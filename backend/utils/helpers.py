# utils/helpers.py - CORRECTED Helper functions with video support
import uuid
import os
import time
import logging
from typing import Optional
from fastapi import UploadFile, HTTPException
from .config import (
    MAX_FILE_SIZE, MAX_IMAGE_SIZE, MAX_DOCUMENT_SIZE, MAX_AUDIO_SIZE,
    UPLOAD_DIR, RATE_LIMIT, RATE_WINDOW
)
from .dependencies import request_counts, AIOFILES_AVAILABLE

logger = logging.getLogger(__name__)

def get_max_file_size_for_type(file_type: str) -> int:
    """Get maximum file size based on file type"""
    if file_type.startswith('video/'):
        return MAX_FILE_SIZE  # 5GB for videos
    elif file_type.startswith('image/'):
        return MAX_IMAGE_SIZE  # 100MB for images
    elif file_type.startswith('audio/'):
        return MAX_AUDIO_SIZE  # 200MB for audio
    else:
        return MAX_DOCUMENT_SIZE  # 50MB for documents

def validate_file_size(file: UploadFile, file_type: str = None):
    """Enhanced file size validation based on file type"""
    if not hasattr(file, 'size') or not file.size:
        # Try to get size from content-length header
        if hasattr(file, 'headers') and 'content-length' in file.headers:
            try:
                file.size = int(file.headers['content-length'])
            except (ValueError, KeyError):
                logger.warning("Could not determine file size")
                return  # Skip validation if size unknown
    
    if file.size:
        # Determine file type if not provided
        if not file_type and file.filename:
            file_extension = file.filename.split('.')[-1].lower()
            if file_extension in ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'mpeg', 'h264', 'h265']:
                file_type = 'video/'
            elif file_extension in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'avif']:
                file_type = 'image/'
            elif file_extension in ['wav', 'mp3', 'aac', 'ogg']:
                file_type = 'audio/'
        
        max_size = get_max_file_size_for_type(file_type or 'document/')
        
        if file.size > max_size:
            size_mb = max_size // (1024 * 1024)
            size_gb = size_mb // 1024 if size_mb >= 1024 else None
            
            if size_gb:
                size_text = f"{size_gb}GB"
            else:
                size_text = f"{size_mb}MB"
            
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size for this file type is {size_text}"
            )

def generate_unique_filename(original_filename: str, extension: str = None) -> str:
    """Generate unique filename with better handling"""
    if extension:
        # Ensure extension starts with dot
        if not extension.startswith('.'):
            extension = f".{extension}"
        return f"{uuid.uuid4()}{extension}"
    else:
        if not original_filename:
            return f"{uuid.uuid4()}.tmp"
        
        name_parts = original_filename.rsplit('.', 1)
        if len(name_parts) == 2:
            name, ext = name_parts
            return f"{uuid.uuid4()}.{ext}"
        else:
            return f"{uuid.uuid4()}.tmp"

def check_rate_limit(client_ip: str, file_type: str = None):
    """Enhanced rate limiting with different limits for different file types"""
    current_time = time.time()
    
    # Adjust rate limit based on file type
    if file_type and file_type.startswith('video/'):
        current_rate_limit = max(10, RATE_LIMIT // 10)  # Stricter for videos
        current_rate_window = RATE_WINDOW * 10  # Longer window for videos
    else:
        current_rate_limit = RATE_LIMIT
        current_rate_window = RATE_WINDOW
    
    # Clean old requests
    if client_ip in request_counts:
        request_counts[client_ip] = [
            req_time for req_time in request_counts[client_ip]
            if current_time - req_time < current_rate_window
        ]
    else:
        request_counts[client_ip] = []
    
    # Check rate limit
    if len(request_counts[client_ip]) >= current_rate_limit:
        wait_time = current_rate_window // 60  # Convert to minutes
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Please wait {wait_time} minutes before trying again."
        )
    
    # Add current request
    request_counts[client_ip].append(current_time)

async def write_file(file_path: str, content: bytes):
    """Write file with better error handling"""
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        if AIOFILES_AVAILABLE:
            import aiofiles
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(content)
        else:
            with open(file_path, 'wb') as f:
                f.write(content)
        
        # Verify file was written correctly
        if not os.path.exists(file_path) or os.path.getsize(file_path) != len(content):
            raise Exception("File write verification failed")
            
        logger.info(f"File written successfully: {file_path} ({len(content)} bytes)")
        
    except Exception as e:
        logger.error(f"Failed to write file {file_path}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

def cleanup_file(file_path: str):
    """Safely cleanup a file"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Cleaned up file: {file_path}")
    except Exception as e:
        logger.warning(f"Failed to cleanup file {file_path}: {str(e)}")

def get_file_info(file_path: str) -> dict:
    """Get file information"""
    if not os.path.exists(file_path):
        return {}
    
    stat = os.stat(file_path)
    return {
        'size': stat.st_size,
        'created': stat.st_ctime,
        'modified': stat.st_mtime,
        'exists': True
    }

def is_video_file(filename: str) -> bool:
    """Check if file is a video file based on extension"""
    if not filename:
        return False
    
    video_extensions = [
        'mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 
        'mpeg', 'mpg', 'h264', 'h265', 'hevc', 'm4v', '3gp'
    ]
    
    extension = filename.split('.')[-1].lower()
    return extension in video_extensions

def is_image_file(filename: str) -> bool:
    """Check if file is an image file based on extension"""
    if not filename:
        return False
    
    image_extensions = [
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'avif', 
        'tiff', 'ico', 'heic', 'svg'
    ]
    
    extension = filename.split('.')[-1].lower()