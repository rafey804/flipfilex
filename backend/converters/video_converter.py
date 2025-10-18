# converters/video_converter.py - FIXED VERSION with full format support

import os
import subprocess
import shlex
from typing import Optional
import logging
import threading
import queue
import asyncio
import json

logger = logging.getLogger(__name__)

def check_ffmpeg():
    """Check if FFmpeg is installed and accessible with detailed logging"""
    try:
        print("Checking FFmpeg installation...")
        result = subprocess.run(
            ['ffmpeg', '-version'], 
            capture_output=True, 
            text=True, 
            timeout=10,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        )
        
        if result.returncode == 0:
            version_line = result.stdout.split('\n')[0] if result.stdout else "Unknown"
            print(f"[OK] FFmpeg found: {version_line}")
            logger.info(f"FFmpeg available: {version_line}")
            return True
        else:
            print(f"[FAILED] FFmpeg failed with return code: {result.returncode}")
            logger.error(f"FFmpeg check failed: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("[FAILED] FFmpeg check timed out")
        logger.error("FFmpeg check timed out")
        return False
    except FileNotFoundError:
        print("[FAILED] FFmpeg not found in system PATH")
        logger.error("FFmpeg not found in PATH")
        return False
    except Exception as e:
        print(f"[FAILED] FFmpeg check error: {str(e)}")
        logger.error(f"FFmpeg check error: {str(e)}")
        return False

FFMPEG_AVAILABLE = check_ffmpeg()

async def convert_video(input_path: str, output_path: str, target_format: str, 
                       quality: str = "medium") -> bool:
    """Convert video with comprehensive format and codec support"""
    
    print(f"Starting video conversion:")
    print(f"   Input: {input_path}")
    print(f"   Output: {output_path}")
    print(f"   Format: {target_format}")
    print(f"   Quality: {quality}")
    
    if not FFMPEG_AVAILABLE:
        print("❌ FFmpeg not available - cannot convert video")
        return False
    
    if not os.path.exists(input_path):
        print(f"❌ Input file does not exist: {input_path}")
        return False
    
    try:
        # Quality presets
        quality_settings = {
            "high": ["-crf", "18", "-preset", "medium"],
            "medium": ["-crf", "23", "-preset", "fast"], 
            "low": ["-crf", "28", "-preset", "veryfast"],
            "web": ["-crf", "25", "-preset", "fast", "-movflags", "+faststart"]
        }
        
        # Comprehensive format settings - handles containers and codecs
        format_settings = {
            # Container formats
            'mp4': ["-c:v", "libx264", "-c:a", "aac", "-profile:v", "main"],
            'mov': ["-c:v", "libx264", "-c:a", "aac", "-profile:v", "main"],
            'avi': ["-c:v", "libx264", "-c:a", "aac"],
            'mkv': ["-c:v", "libx264", "-c:a", "aac"],
            'webm': ["-c:v", "libvpx-vp9", "-c:a", "libopus", "-b:v", "1M"],
            'wmv': ["-c:v", "wmv2", "-c:a", "wmav2"],
            'flv': ["-c:v", "libx264", "-c:a", "aac", "-f", "flv"],
            'mpeg': ["-c:v", "mpeg2video", "-c:a", "mp2"],

            # Codec formats - these output as MP4 with specified codec
            'h264': ["-c:v", "libx264", "-c:a", "aac", "-profile:v", "main"],
            'x264': ["-c:v", "libx264", "-c:a", "aac", "-profile:v", "main"],
            'h265': ["-c:v", "libx265", "-c:a", "aac", "-profile:v", "main"],
            'hevc': ["-c:v", "libx265", "-c:a", "aac", "-profile:v", "main"],
            'x265': ["-c:v", "libx265", "-c:a", "aac", "-profile:v", "main"],
        }
        
        # Build FFmpeg command
        cmd = ["ffmpeg", "-y", "-i", input_path]
        
        # Add quality settings
        if quality in quality_settings:
            cmd.extend(quality_settings[quality])
        else:
            cmd.extend(quality_settings["medium"])
        
        # Handle format settings
        target_format_lower = target_format.lower()
        
        # For codec formats, we need to adjust the output path to .mp4
        codec_formats = ['h264', 'x264', 'h265', 'hevc', 'x265']
        if target_format_lower in codec_formats:
            # Change output extension to .mp4 for codec formats
            if not output_path.endswith('.mp4'):
                output_path = output_path.rsplit('.', 1)[0] + '.mp4'
                print(f"Codec format detected, changing output to: {output_path}")
        
        # Add format-specific encoding settings
        if target_format_lower in format_settings:
            cmd.extend(format_settings[target_format_lower])
        else:
            print(f"⚠️  Unknown format {target_format}, using default H.264 settings")
            cmd.extend(["-c:v", "libx264", "-c:a", "aac"])
        
        # Essential stability settings
        cmd.extend([
            "-threads", "0",  # Use all cores
            "-avoid_negative_ts", "make_zero",
            "-fflags", "+genpts",
            "-max_muxing_queue_size", "1024"
        ])
        
        # Add output file
        cmd.append(output_path)
        
        # Log the complete command
        cmd_str = ' '.join(shlex.quote(arg) for arg in cmd)
        print(f"FFmpeg command: {cmd_str}")
        logger.info(f"FFmpeg command: {cmd_str}")
        
        # Execute conversion
        print("⚡ Starting FFmpeg process...")
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            bufsize=1,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        )
        
        # Read output in real-time
        stderr_lines = []
        
        def read_stderr():
            for line in iter(process.stderr.readline, ''):
                if line.strip():
                    stderr_lines.append(line.strip())
                    # Only print progress and important messages
                    if any(keyword in line.lower() for keyword in ['time=', 'error', 'warning']):
                        print(f"FFmpeg: {line.strip()}")
        
        # Start reading thread
        stderr_thread = threading.Thread(target=read_stderr)
        stderr_thread.start()
        
        # Wait for completion with timeout
        try:
            return_code = process.wait(timeout=1800)  # 30 minutes
            
            # Wait for thread to finish
            stderr_thread.join(timeout=5)
            
            print(f"FFmpeg finished with return code: {return_code}")
            
            if return_code == 0:
                if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                    output_size = os.path.getsize(output_path)
                    print(f"✅ Conversion successful!")
                    print(f"Output file size: {output_size} bytes ({output_size/1024/1024:.2f} MB)")
                    logger.info(f"Video conversion successful: {input_path} -> {output_path}")
                    return True
                else:
                    print("❌ Output file is missing or empty")
                    logger.error("Output file missing or empty")
                    return False
            else:
                print(f"❌ FFmpeg failed with return code: {return_code}")
                if stderr_lines:
                    print("Last error messages:")
                    for line in stderr_lines[-5:]:
                        print(f"  {line}")
                logger.error(f"FFmpeg failed: {return_code}")
                return False
                
        except subprocess.TimeoutExpired:
            print("❌ Conversion timed out after 30 minutes")
            process.kill()
            stderr_thread.join(timeout=2)
            logger.error("Video conversion timed out")
            return False
            
    except Exception as e:
        print(f"❌ Conversion error: {str(e)}")
        logger.error(f"Video conversion error: {str(e)}")
        return False

async def get_video_info(input_path: str) -> Optional[dict]:
    """Get video information"""
    if not FFMPEG_AVAILABLE:
        return None
    
    if not os.path.exists(input_path):
        return None
    
    try:
        cmd = [
            "ffprobe", "-v", "quiet", "-print_format", "json", 
            "-show_format", "-show_streams", input_path
        ]
        
        result = subprocess.run(
            cmd, 
            capture_output=True, 
            text=True, 
            timeout=30,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        )
        
        if result.returncode == 0 and result.stdout.strip():
            try:
                data = json.loads(result.stdout)
                return data
            except json.JSONDecodeError:
                return None
        else:
            return None
            
    except Exception:
        return None

# All supported formats including codec formats
SUPPORTED_VIDEO_FORMATS = {
    'input': [
        # Container formats
        'mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv',
        'mpeg', 'mpg', 'm4v', '3gp', 'ts', 'mts',
        # Codec formats
        'h264', 'h265', 'hevc', 'x264', 'x265'
    ],
    'output': [
        # Container formats
        'mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'mpeg',
        # Codec formats (output as MP4 with specified codec)
        'h264', 'h265', 'hevc', 'x264', 'x265'
    ]
}