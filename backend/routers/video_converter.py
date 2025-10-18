# routers/video_converter.py - FIXED VERSION with codec support
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import logging
import asyncio
import uuid

from utils.config import UPLOAD_DIR
from utils.helpers import generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files
from converters.video_converter import convert_video, get_video_info, FFMPEG_AVAILABLE

router = APIRouter()
security = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)

# EXPANDED formats including codec formats
SUPPORTED_VIDEO_FORMATS = {
    'input': [
        # Container formats
        'mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv',
        'mpeg', 'mpg', 'm4v', '3gp', 'ts', 'mts',
        # Codec formats that people search for
        'h264', 'h265', 'hevc', 'x264', 'x265'
    ],
    'output': [
        # Container formats
        'mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'mpeg',
        # Codec formats - these will be converted to appropriate containers
        'h264', 'h265', 'hevc', 'x264', 'x265'
    ]
}

# Simple progress storage
conversion_status = {}

def validate_video_file_size(file: UploadFile, max_size_mb: int = 5120):
    """Validate video file size"""
    max_size = max_size_mb * 1024 * 1024
    
    if hasattr(file, 'size') and file.size and file.size > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {max_size_mb}MB"
        )

def get_output_extension(target_format: str) -> str:
    """Get the correct file extension for the target format"""
    target_format = target_format.lower()
    
    # Codec formats output as MP4
    codec_formats = ['h264', 'x264', 'h265', 'hevc', 'x265']
    if target_format in codec_formats:
        return 'mp4'
    
    # Container formats keep their extension
    return target_format

async def process_conversion(conversion_id: str, input_path: str, output_path: str, target_format: str, quality: str):
    """Background conversion process"""
    try:
        print(f"Starting background conversion for ID: {conversion_id}")
        
        # Update status
        conversion_status[conversion_id] = {
            "status": "processing",
            "progress": 10,
            "message": "Converting video..."
        }
        
        # Run the actual conversion
        success = await convert_video(input_path, output_path, target_format, quality)
        
        if success:
            # Check if the output file exists (codec formats might change extension)
            actual_output_path = output_path
            
            # For codec formats, the converter might have changed the extension to .mp4
            codec_formats = ['h264', 'x264', 'h265', 'hevc', 'x265']
            if target_format.lower() in codec_formats:
                mp4_path = output_path.rsplit('.', 1)[0] + '.mp4'
                if os.path.exists(mp4_path) and not os.path.exists(output_path):
                    actual_output_path = mp4_path
            
            if os.path.exists(actual_output_path) and os.path.getsize(actual_output_path) > 0:
                conversion_status[conversion_id] = {
                    "status": "completed",
                    "progress": 100,
                    "message": "Conversion completed",
                    "download_url": f"/download/{os.path.basename(actual_output_path)}"
                }
                print(f"Conversion {conversion_id} completed successfully")
            else:
                conversion_status[conversion_id] = {
                    "status": "error",
                    "progress": 0,
                    "message": "Conversion failed - output file not found",
                    "error": "Output file is missing or empty"
                }
        else:
            conversion_status[conversion_id] = {
                "status": "error",
                "progress": 0,
                "message": "Conversion failed",
                "error": "FFmpeg conversion failed"
            }
            print(f"Conversion {conversion_id} failed")
            
    except Exception as e:
        print(f"Conversion {conversion_id} error: {str(e)}")
        conversion_status[conversion_id] = {
            "status": "error",
            "progress": 0,
            "message": "Conversion error",
            "error": str(e)
        }
    finally:
        # Cleanup input file
        try:
            if os.path.exists(input_path):
                os.remove(input_path)
                print(f"Cleaned up input file: {input_path}")
        except:
            pass

@router.post("/convert-video")
async def convert_video_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    target_format: str = Form(...),
    quality: str = Form(default="medium"),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """Universal video conversion endpoint supporting all formats and codecs"""
    
    print(f"Received conversion request: {file.filename} -> {target_format}")
    
    if not FFMPEG_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="FFmpeg not available. Please install FFmpeg to enable video conversion."
        )
    
    # Basic validation
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in SUPPORTED_VIDEO_FORMATS['input']:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported input format: {file_extension}. Supported formats: {', '.join(SUPPORTED_VIDEO_FORMATS['input'])}"
        )
    
    if target_format.lower() not in SUPPORTED_VIDEO_FORMATS['output']:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported output format: {target_format}. Supported formats: {', '.join(SUPPORTED_VIDEO_FORMATS['output'])}"
        )
    
    # Validate quality option
    valid_quality = ["high", "medium", "low", "web"]
    if quality not in valid_quality:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid quality setting: {quality}. Valid options: {', '.join(valid_quality)}"
        )
    
    # Validate file size
    validate_video_file_size(file)
    
    try:
        # Generate unique ID
        conversion_id = str(uuid.uuid4())
        
        # Save input file
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        content = await file.read()
        await write_file(input_path, content)
        
        print(f"Saved input file: {input_filename} ({len(content)} bytes)")
        
        # Generate output filename with correct extension
        base_name = file.filename.rsplit('.', 1)[0]
        output_extension = get_output_extension(target_format)
        output_filename = generate_unique_filename(f"{base_name}_converted.{output_extension}")
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        print(f"Output will be: {output_filename}")
        
        # Initialize status
        conversion_status[conversion_id] = {
            "status": "starting",
            "progress": 0,
            "message": "Initializing conversion..."
        }
        
        # Start background conversion
        background_tasks.add_task(
            process_conversion,
            conversion_id,
            input_path,
            output_path,
            target_format,
            quality
        )
        
        print(f"Started background conversion: {conversion_id}")
        
        # Create appropriate success message
        format_name = target_format.upper()
        if target_format.lower() in ['h264', 'x264']:
            format_name = "H.264"
        elif target_format.lower() in ['h265', 'hevc', 'x265']:
            format_name = "H.265"
        
        return {
            "message": f"Video conversion to {format_name} started",
            "conversion_id": conversion_id,
            "status": "started",
            "target_format": target_format,
            "quality": quality,
            "progress_url": f"/convert/video-progress/{conversion_id}"
        }
        
    except Exception as e:
        print(f"Setup error: {str(e)}")
        
        # Provide helpful error messages
        error_message = str(e)
        if "ffmpeg" in error_message.lower():
            error_message = "FFmpeg is required for video conversion. Please install FFmpeg."
        elif "memory" in error_message.lower():
            error_message = "Insufficient memory for video conversion. Try a smaller file or lower quality."
        elif "space" in error_message.lower():
            error_message = "Insufficient disk space for video conversion."
        
        raise HTTPException(status_code=500, detail=f"Conversion setup failed: {error_message}")

@router.get("/video-progress/{conversion_id}")
async def get_conversion_progress(conversion_id: str):
    """Get conversion progress and status"""
    if conversion_id not in conversion_status:
        raise HTTPException(status_code=404, detail="Conversion ID not found")
    
    return conversion_status[conversion_id]

@router.get("/supported-video-formats")
async def get_supported_formats():
    """Get comprehensive list of supported video formats"""
    print(f"DEBUG: SUPPORTED_VIDEO_FORMATS output = {SUPPORTED_VIDEO_FORMATS['output']}")
    return {
        "input_formats": SUPPORTED_VIDEO_FORMATS['input'],
        "output_formats": SUPPORTED_VIDEO_FORMATS['output'],
        "quality_options": ["high", "medium", "low", "web"],
        "codec_formats": {
            "h264": "H.264 codec (outputs as MP4)",
            "x264": "x264 encoder (outputs as MP4)", 
            "h265": "H.265/HEVC codec (outputs as MP4)",
            "hevc": "HEVC codec (outputs as MP4)",
            "x265": "x265 encoder (outputs as MP4)"
        },
        "container_formats": {
            "mp4": "MPEG-4 container",
            "mov": "QuickTime container",
            "avi": "Audio Video Interleave",
            "mkv": "Matroska container",
            "webm": "WebM container",
            "wmv": "Windows Media Video",
            "flv": "Flash Video"
        },
        "notes": {
            "ffmpeg_available": FFMPEG_AVAILABLE,
            "max_file_size": "5GB",
            "codec_note": "Codec formats (H.264, H.265, etc.) are output as MP4 containers with the specified codec",
            "quality_guide": {
                "high": "Best quality, larger file size",
                "medium": "Balanced quality and size", 
                "low": "Smaller file, lower quality",
                "web": "Optimized for web streaming"
            }
        }
    }

@router.get("/health")
async def health_check():
    """Check video conversion service health"""
    return {
        "status": "healthy",
        "ffmpeg_available": FFMPEG_AVAILABLE,
        "active_conversions": len(conversion_status),
        "supported_formats": len(SUPPORTED_VIDEO_FORMATS['output'])
    }