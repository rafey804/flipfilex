# routers/download.py - CORRECTED with video support and better error handling
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
import mimetypes
import logging

from utils.config import UPLOAD_DIR

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/download/{filename:path}")
async def download_file(filename: str):
    """Download converted file with comprehensive format support and error handling"""

    # Enhanced security check - allow single level subdirectories for split files
    if ".." in filename or filename.startswith("/") or filename.startswith("\\"):
        logger.warning(f"Invalid filename attempted: {filename}")
        raise HTTPException(status_code=400, detail="Invalid filename")

    # Additional security: limit path depth and check for suspicious patterns
    path_parts = filename.replace("\\", "/").split("/")
    if len(path_parts) > 2:  # Allow only one level of subdirectory
        logger.warning(f"Path too deep attempted: {filename}")
        raise HTTPException(status_code=400, detail="Invalid file path")

    # Check for suspicious patterns
    for part in path_parts:
        if not part or part.startswith('.') or any(char in part for char in ['<', '>', ':', '"', '|', '?', '*']):
            logger.warning(f"Suspicious path component: {part}")
            raise HTTPException(status_code=400, detail="Invalid filename")

    # Determine the base directory (support both uploads and downloads)
    base_dirs = [UPLOAD_DIR]

    # Add download directory if it exists
    download_dir = os.path.join(os.path.dirname(UPLOAD_DIR), "downloads")
    if os.path.exists(download_dir):
        base_dirs.append(download_dir)

    # Try each base directory
    file_path = None
    for base_dir in base_dirs:
        potential_path = os.path.join(base_dir, filename)
        if os.path.exists(potential_path):
            file_path = potential_path
            break

    if not file_path:
        file_path = os.path.join(UPLOAD_DIR, filename)  # Default fallback
    
    # Log download attempt for debugging
    logger.info(f"Download request for: {filename}")
    logger.debug(f"Looking for file at: {file_path}")
    
    # Check if file exists
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        
        # List available files for debugging (only in development)
        try:
            available_files = os.listdir(UPLOAD_DIR)
            logger.debug(f"Available files in {UPLOAD_DIR}: {available_files}")
        except Exception as e:
            logger.error(f"Could not list directory: {e}")
        
        raise HTTPException(status_code=404, detail="File not found or has expired")
    
    # Check if it's actually a file
    if not os.path.isfile(file_path):
        logger.error(f"Path exists but is not a file: {file_path}")
        raise HTTPException(status_code=400, detail="Invalid file")
    
    # Check file size
    file_size = os.path.getsize(file_path)
    if file_size == 0:
        logger.error(f"File is empty: {file_path}")
        raise HTTPException(status_code=404, detail="File is empty or corrupted")
    
    logger.info(f"Serving file: {file_path} (size: {file_size} bytes)")
    
    try:
        # Determine media type based on file extension
        file_extension = filename.lower().split('.')[-1] if '.' in filename else ''
        
        # EXPANDED media type mapping for all supported formats
        media_type_map = {
            # Video formats
            'mp4': 'video/mp4',
            'mov': 'video/quicktime',
            'avi': 'video/x-msvideo',
            'mkv': 'video/x-matroska',
            'webm': 'video/webm',
            'wmv': 'video/x-ms-wmv',
            'flv': 'video/x-flv',
            'mpeg': 'video/mpeg',
            'mpg': 'video/mpeg',
            'm4v': 'video/x-m4v',
            '3gp': 'video/3gpp',
            
            # Image formats
            'webp': 'image/webp',
            'avif': 'image/avif',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'tiff': 'image/tiff',
            'ico': 'image/x-icon',
            'heic': 'image/heic',
            'svg': 'image/svg+xml',
            
            # Document formats
            'pdf': 'application/pdf',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'doc': 'application/msword',
            
            # Audio formats
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg',
            'aac': 'audio/aac',
            'ogg': 'audio/ogg',
            'm4a': 'audio/mp4'
        }
        
        # Get media type from mapping or use mimetypes as fallback
        media_type = media_type_map.get(file_extension)
        if not media_type:
            guessed_type, _ = mimetypes.guess_type(filename)
            media_type = guessed_type or 'application/octet-stream'
        
        logger.debug(f"Using media type: {media_type} for extension: {file_extension}")
        
        # Generate clean filename for download
        clean_filename = filename
        
        # If filename looks like a UUID, make it more user-friendly
        if (len(filename.split('-')) > 3 or 
            any(len(part) > 8 for part in filename.split('-')[:-1])):
            
            # Extract original name if possible, otherwise use generic name
            if '_converted.' in filename:
                # Try to extract original name before _converted
                base_name = filename.split('_converted.')[0]
                if len(base_name) > 32:  # If still looks like UUID
                    clean_filename = f"converted_file.{file_extension}"
                else:
                    clean_filename = filename
            else:
                # Use format-specific generic names
                format_names = {
                    'mp4': 'converted_video.mp4',
                    'mov': 'converted_video.mov',
                    'webm': 'converted_video.webm',
                    'avi': 'converted_video.avi',
                    'pdf': 'converted_document.pdf',
                    'docx': 'converted_document.docx',
                    'webp': 'converted_image.webp',
                    'png': 'converted_image.png',
                    'mp3': 'converted_audio.mp3',
                    'wav': 'converted_audio.wav'
                }
                clean_filename = format_names.get(file_extension, f"converted_file.{file_extension}")
        
        # FIXED: Proper header formatting with quotes for filename
        return FileResponse(
            path=file_path,
            media_type=media_type,
            filename=clean_filename,
            headers={
                "Content-Disposition": f'attachment; filename="{clean_filename}"',
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                "Content-Length": str(file_size)
            }
        )
        
    except Exception as e:
        logger.error(f"Error serving file {file_path}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error serving file")

@router.get("/files")
async def list_available_files():
    """List available files for debugging (development only)"""
    try:
        if not os.path.exists(UPLOAD_DIR):
            return {
                "files": [], 
                "upload_dir": UPLOAD_DIR, 
                "exists": False,
                "error": "Upload directory does not exist"
            }
        
        files = []
        total_size = 0
        
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.isfile(file_path):
                file_size = os.path.getsize(file_path)
                files.append({
                    "name": filename,
                    "size": file_size,
                    "size_mb": round(file_size / (1024 * 1024), 2),
                    "modified": os.path.getmtime(file_path),
                    "download_url": f"/download/{filename}"
                })
                total_size += file_size
        
        # Sort by modification time (newest first)
        files.sort(key=lambda x: x['modified'], reverse=True)
        
        return {
            "files": files,
            "upload_dir": UPLOAD_DIR,
            "exists": True,
            "total_files": len(files),
            "total_size_mb": round(total_size / (1024 * 1024), 2)
        }
        
    except Exception as e:
        logger.error(f"Error listing files: {str(e)}")
        return {
            "error": str(e), 
            "upload_dir": UPLOAD_DIR,
            "files": []
        }

@router.delete("/cleanup")
async def cleanup_old_files():
    """Manually trigger cleanup of old files"""
    try:
        from utils.dependencies import cleanup_old_files
        cleanup_old_files()
        return {"message": "Cleanup completed"}
    except Exception as e:
        logger.error(f"Cleanup error: {str(e)}")
        raise HTTPException(status_code=500, detail="Cleanup failed")