# routers/audio_converter.py - CORRECTED VERSION
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import logging
import uuid

from utils.config import UPLOAD_DIR
from utils.helpers import generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files
from converters.audio_converter import convert_audio, FFMPEG_AVAILABLE

router = APIRouter()
security = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)

# Supported audio formats
SUPPORTED_AUDIO_FORMATS = {
    'input': [
        # All input formats supported
        'mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'wma',
        'aiff', 'opus', 'ac3', 'mp2', 'amr', 'au', 'ra'
    ],
    'output': [
        # Only reliable output formats
        'mp3', 'wav', 'aac', 'm4a'
    ]
}

# Simple progress storage
conversion_status = {}

def validate_audio_file_size(file: UploadFile, max_size_mb: int = 1024):
    """Validate audio file size"""
    max_size = max_size_mb * 1024 * 1024
    
    if hasattr(file, 'size') and file.size and file.size > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {max_size_mb}MB"
        )

async def process_audio_conversion(conversion_id: str, input_path: str, output_path: str, 
                                 target_format: str, bitrate: str):
    """Background audio conversion process"""
    try:
        print(f"Starting background audio conversion for ID: {conversion_id}")
        
        # Update status
        conversion_status[conversion_id] = {
            "status": "processing",
            "progress": 10,
            "message": "Converting audio..."
        }
        
        # Run the actual conversion
        success = await convert_audio(input_path, output_path, target_format, bitrate)
        
        if success:
            if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                conversion_status[conversion_id] = {
                    "status": "completed",
                    "progress": 100,
                    "message": "Audio conversion completed",
                    "download_url": f"/download/{os.path.basename(output_path)}"
                }
                print(f"Audio conversion {conversion_id} completed successfully")
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
                "message": "Audio conversion failed",
                "error": "FFmpeg conversion failed"
            }
            print(f"Audio conversion {conversion_id} failed")
            
    except Exception as e:
        print(f"Audio conversion {conversion_id} error: {str(e)}")
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

@router.post("/convert-audio")
async def convert_audio_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    target_format: str = Form(...),
    bitrate: str = Form(default="320"),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """Universal audio conversion endpoint supporting all formats"""
    
    print(f"Received audio conversion request: {file.filename} -> {target_format}")
    
    if not FFMPEG_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="FFmpeg not available. Please install FFmpeg to enable audio conversion."
        )
    
    # Basic validation
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in SUPPORTED_AUDIO_FORMATS['input']:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported input format: {file_extension}. Supported formats: {', '.join(SUPPORTED_AUDIO_FORMATS['input'])}"
        )
    
    if target_format.lower() not in SUPPORTED_AUDIO_FORMATS['output']:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported output format: {target_format}. Supported formats: {', '.join(SUPPORTED_AUDIO_FORMATS['output'])}"
        )
    
    # Validate bitrate option
    valid_bitrates = ["96", "128", "192", "256", "320"]
    if bitrate not in valid_bitrates:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid bitrate setting: {bitrate}. Valid options: {', '.join(valid_bitrates)}"
        )
    
    # Validate file size
    validate_audio_file_size(file)
    
    try:
        # Generate unique ID
        conversion_id = str(uuid.uuid4())
        
        # Save input file
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        content = await file.read()
        await write_file(input_path, content)
        
        print(f"Saved input file: {input_filename} ({len(content)} bytes)")
        
        # Generate output filename
        base_name = file.filename.rsplit('.', 1)[0]
        output_filename = generate_unique_filename(f"{base_name}_converted.{target_format}")
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        print(f"Output will be: {output_filename}")
        
        # Initialize status
        conversion_status[conversion_id] = {
            "status": "starting",
            "progress": 0,
            "message": "Initializing audio conversion..."
        }
        
        # Start background conversion
        background_tasks.add_task(
            process_audio_conversion,
            conversion_id,
            input_path,
            output_path,
            target_format,
            bitrate
        )
        
        print(f"Started background audio conversion: {conversion_id}")
        
        # Create appropriate success message
        format_name = target_format.upper()
        
        return {
            "message": f"Audio conversion to {format_name} started",
            "conversion_id": conversion_id,
            "status": "started",
            "target_format": target_format,
            "bitrate": bitrate,
            "progress_url": f"/convert/audio-progress/{conversion_id}"
        }
        
    except Exception as e:
        print(f"Audio setup error: {str(e)}")
        
        # Provide helpful error messages
        error_message = str(e)
        if "ffmpeg" in error_message.lower():
            error_message = "FFmpeg is required for audio conversion. Please install FFmpeg."
        elif "memory" in error_message.lower():
            error_message = "Insufficient memory for audio conversion. Try a smaller file."
        elif "space" in error_message.lower():
            error_message = "Insufficient disk space for audio conversion."
        
        raise HTTPException(status_code=500, detail=f"Audio conversion setup failed: {error_message}")

@router.get("/audio-progress/{conversion_id}")
async def get_audio_conversion_progress(conversion_id: str):
    """Get audio conversion progress and status"""
    if conversion_id not in conversion_status:
        raise HTTPException(status_code=404, detail="Conversion ID not found")
    
    return conversion_status[conversion_id]

@router.get("/supported-audio-formats")
async def get_supported_audio_formats():
    """Get comprehensive list of supported audio formats"""
    return {
        "input_formats": SUPPORTED_AUDIO_FORMATS['input'],
        "output_formats": SUPPORTED_AUDIO_FORMATS['output'],
        "bitrate_options": ["96", "128", "192", "256", "320"],
        "format_categories": {
            "lossy": {
                "formats": ["mp3", "aac", "m4a", "ogg", "opus", "wma", "ac3"],
                "description": "Compressed formats with smaller file sizes"
            },
            "lossless": {
                "formats": ["wav", "flac", "aiff"],
                "description": "Uncompressed formats with perfect quality"
            }
        },
        "format_details": {
            "mp3": "Most popular compressed format",
            "wav": "Uncompressed Windows audio format",
            "flac": "Free lossless audio codec",
            "aac": "Advanced Audio Coding (Apple/iTunes)",
            "m4a": "MPEG-4 audio container",
            "ogg": "Open source Vorbis format",
            "opus": "Modern low-latency codec",
            "wma": "Windows Media Audio",
            "aiff": "Audio Interchange File Format"
        },
        "notes": {
            "ffmpeg_available": FFMPEG_AVAILABLE,
            "max_file_size": "1GB",
            "bitrate_note": "Higher bitrates provide better quality but larger file sizes",
            "lossless_note": "Lossless formats ignore bitrate settings and preserve original quality"
        }
    }

@router.get("/health")
async def audio_health_check():
    """Check audio conversion service health"""
    return {
        "status": "healthy",
        "ffmpeg_available": FFMPEG_AVAILABLE,
        "active_conversions": len(conversion_status),
        "supported_formats": len(SUPPORTED_AUDIO_FORMATS['output'])
    }