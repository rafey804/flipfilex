# converters/audio_converter.py - FIXED VERSION
import os
import subprocess
import shlex
from typing import Optional
import logging
import threading

logger = logging.getLogger(__name__)

def check_ffmpeg():
    """Check if FFmpeg is installed and accessible"""
    try:
        print("Checking FFmpeg installation for audio conversion...")
        result = subprocess.run(
            ['ffmpeg', '-version'], 
            capture_output=True, 
            text=True, 
            timeout=10,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        )
        
        if result.returncode == 0:
            version_line = result.stdout.split('\n')[0] if result.stdout else "Unknown"
            print(f"[OK] FFmpeg found for audio: {version_line}")
            logger.info(f"FFmpeg available for audio: {version_line}")
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

async def convert_audio(input_path: str, output_path: str, target_format: str, 
                       bitrate: str = "320") -> bool:
    """Convert audio with comprehensive format support"""
    
    print(f"Starting audio conversion:")
    print(f"   Input: {input_path}")
    print(f"   Output: {output_path}")
    print(f"   Format: {target_format}")
    print(f"   Bitrate: {bitrate}")
    
    if not FFMPEG_AVAILABLE:
        print("[FAILED] FFmpeg not available - cannot convert audio")
        return False
    
    if not os.path.exists(input_path):
        print(f"[FAILED] Input file does not exist: {input_path}")
        return False
    
    try:
        # Bitrate settings
        bitrate_settings = {
            "96": "96k",
            "128": "128k", 
            "192": "192k",
            "256": "256k",
            "320": "320k"
        }
        
        # FIXED: Comprehensive format settings with proper indentation
        format_settings = {
            # Lossy formats
            'mp3': ["-c:a", "libmp3lame", "-b:a", bitrate_settings.get(bitrate, "320k")],
            'aac': ["-c:a", "aac", "-b:a", bitrate_settings.get(bitrate, "320k")],
            'm4a': ["-c:a", "aac", "-b:a", bitrate_settings.get(bitrate, "320k")],
            'ogg': ["-c:a", "libvorbis", "-b:a", bitrate_settings.get(bitrate, "320k")],
            'opus': ["-c:a", "libopus", "-b:a", bitrate_settings.get(bitrate, "320k")],
            'wma': ["-c:a", "wmav2", "-b:a", bitrate_settings.get(bitrate, "320k")],
            'ac3': ["-c:a", "ac3", "-b:a", bitrate_settings.get(bitrate, "320k")],
            
            # Lossless formats
            'wav': ["-c:a", "pcm_s16le"],
            'flac': ["-c:a", "flac"],
            'aiff': ["-c:a", "pcm_s16be"],
            'alac': ["-c:a", "alac"]
        }
        
        # Build FFmpeg command
        cmd = ["ffmpeg", "-y", "-i", input_path]
        
        # Add format-specific encoding settings
        target_format_lower = target_format.lower()
        
        if target_format_lower in format_settings:
            cmd.extend(format_settings[target_format_lower])
        else:
            print(f"⚠️  Unknown format {target_format}, using default AAC settings")
            cmd.extend(["-c:a", "aac", "-b:a", "320k"])
        
        # Essential audio settings
        cmd.extend([
            "-ar", "44100",  # Sample rate
            "-threads", "0",  # Use all cores
            "-avoid_negative_ts", "make_zero"
        ])
        
        # Add output file
        cmd.append(output_path)
        
        # Log the complete command
        cmd_str = ' '.join(shlex.quote(arg) for arg in cmd)
        print(f"FFmpeg command: {cmd_str}")
        logger.info(f"FFmpeg command: {cmd_str}")
        
        # Execute conversion
        print("⚡ Starting FFmpeg audio conversion...")
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
                    # Print progress and important messages
                    if any(keyword in line.lower() for keyword in ['time=', 'error', 'warning']):
                        print(f"FFmpeg: {line.strip()}")
        
        # Start reading thread
        stderr_thread = threading.Thread(target=read_stderr)
        stderr_thread.start()
        
        # Wait for completion with timeout
        try:
            return_code = process.wait(timeout=600)  # 10 minutes for audio
            
            # Wait for thread to finish
            stderr_thread.join(timeout=5)
            
            print(f"FFmpeg finished with return code: {return_code}")
            
            if return_code == 0:
                if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                    output_size = os.path.getsize(output_path)
                    print(f"[OK] Audio conversion successful!")
                    print(f"Output file size: {output_size} bytes ({output_size/1024/1024:.2f} MB)")
                    logger.info(f"Audio conversion successful: {input_path} -> {output_path}")
                    return True
                else:
                    print("[FAILED] Output file is missing or empty")
                    logger.error("Output file missing or empty")
                    return False
            else:
                print(f"[FAILED] FFmpeg failed with return code: {return_code}")
                if stderr_lines:
                    print("Last error messages:")
                    for line in stderr_lines[-5:]:
                        print(f"  {line}")
                logger.error(f"FFmpeg failed: {return_code}")
                return False
                
        except subprocess.TimeoutExpired:
            print("[FAILED] Audio conversion timed out after 10 minutes")
            process.kill()
            stderr_thread.join(timeout=2)
            logger.error("Audio conversion timed out")
            return False
            
    except Exception as e:
        print(f"[FAILED] Audio conversion error: {str(e)}")
        logger.error(f"Audio conversion error: {str(e)}")
        return False

# All supported audio formats
SUPPORTED_AUDIO_FORMATS = {
    'input': [
        # Common formats
        'mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'wma',
        # Additional formats
        'aiff', 'opus', 'ac3', 'mp2', 'amr', 'au', 'ra'
    ],
    'output': [
        # Lossy formats
        'mp3', 'aac', 'm4a', 'ogg', 'opus', 'wma', 'ac3',
        # Lossless formats  
        'wav', 'flac', 'aiff'
    ]
}