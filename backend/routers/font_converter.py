# routers/font_converter.py - Font Format Converter API
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import logging
import uuid
import tempfile

from utils.config import UPLOAD_DIR
from utils.helpers import generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files
from converters.font_converter import convert_font, get_supported_formats, FONTTOOLS_AVAILABLE

router = APIRouter()
security = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)

# Supported font formats
SUPPORTED_FONT_FORMATS = {
    'input': ['ttf', 'otf', 'woff', 'woff2', 'eot', 'svg', 'ps1'],
    'output': ['ttf', 'otf', 'woff', 'woff2']  # Conservative list for actual conversion
}

# Simple progress storage
conversion_status = {}

def validate_font_file_size(file: UploadFile, max_size_mb: int = 50):
    """Validate font file size"""
    max_size = max_size_mb * 1024 * 1024

    if hasattr(file, 'size') and file.size and file.size > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {max_size_mb}MB"
        )

async def process_font_conversion(conversion_id: str, input_path: str, output_path: str,
                                target_format: str):
    """Background font conversion process"""
    try:
        print(f"Starting background font conversion for ID: {conversion_id}")

        # Update status
        conversion_status[conversion_id] = {
            'status': 'processing',
            'progress': 10,
            'message': 'Converting font...'
        }

        # Perform conversion
        result = await convert_font(input_path, output_path, target_format)

        if result['success']:
            conversion_status[conversion_id] = {
                'status': 'completed',
                'progress': 100,
                'message': 'Font conversion completed successfully',
                'output_path': output_path,
                'conversion_method': result.get('conversion_method', 'unknown')
            }
            print(f"Font conversion completed for ID: {conversion_id}")
        else:
            conversion_status[conversion_id] = {
                'status': 'failed',
                'progress': 0,
                'error': result.get('error', 'Unknown conversion error'),
                'message': f"Font conversion failed: {result.get('error', 'Unknown error')}"
            }
            print(f"Font conversion failed for ID: {conversion_id}")

    except Exception as e:
        logger.error(f"Font conversion process error: {str(e)}")
        conversion_status[conversion_id] = {
            'status': 'failed',
            'progress': 0,
            'error': str(e),
            'message': f"Font conversion error: {str(e)}"
        }


@router.post("/font")
async def convert_font_format(
    file: UploadFile = File(...),
    target_format: str = Form(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Convert font files between different formats

    Supported input formats: TTF, OTF, WOFF, WOFF2, EOT, SVG, PS Type 1
    Supported output formats: TTF, OTF, WOFF, WOFF2
    """

    # Check if fontTools is available
    if not FONTTOOLS_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Font conversion not available. Missing dependency: fontTools"
        )

    # Rate limiting
    client_ip = "127.0.0.1"  # In production, get real IP
    check_rate_limit(client_ip)
    cleanup_old_files()

    # Validate inputs
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    if target_format.lower() not in SUPPORTED_FONT_FORMATS['output']:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported target format: {target_format}. Supported formats: {', '.join(SUPPORTED_FONT_FORMATS['output'])}"
        )

    # Validate file size
    validate_font_file_size(file, max_size_mb=50)

    # Validate file type
    allowed_extensions = ['.ttf', '.otf', '.woff', '.woff2', '.eot', '.svg', '.ps1', '.ps', '.pfa', '.pfb']
    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_extension}. Supported types: {', '.join(allowed_extensions)}"
        )

    try:
        # Generate unique filenames
        input_filename = generate_unique_filename(file.filename)
        base_name = os.path.splitext(input_filename)[0]
        output_filename = f"{base_name}.{target_format.lower()}"

        # Full paths
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Save uploaded file
        content = await file.read()
        await write_file(input_path, content)

        # Perform conversion immediately
        print(f"Converting font: {input_filename} to {target_format}")
        result = await convert_font(input_path, output_path, target_format.lower())

        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)

        if result['success']:
            return {
                "success": True,
                "message": f"Font converted from {file_extension[1:].upper()} to {target_format.upper()} successfully",
                "download_url": f"/download/{output_filename}",
                "filename": output_filename,
                "conversion_method": result.get('conversion_method', 'fonttools')
            }
        else:
            # Cleanup output file if exists
            if os.path.exists(output_path):
                os.remove(output_path)

            raise HTTPException(
                status_code=500,
                detail=f"Font conversion failed: {result.get('error', 'Unknown error')}"
            )

    except HTTPException:
        raise
    except Exception as e:
        # Cleanup files on error
        if 'input_path' in locals() and os.path.exists(input_path):
            os.remove(input_path)
        if 'output_path' in locals() and os.path.exists(output_path):
            os.remove(output_path)

        logger.error(f"Font conversion error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Font conversion error: {str(e)}")


@router.get("/font/status/{conversion_id}")
async def get_font_conversion_status(conversion_id: str):
    """Get font conversion status"""

    if conversion_id not in conversion_status:
        raise HTTPException(status_code=404, detail="Conversion not found")

    status = conversion_status[conversion_id]

    response = {
        "conversion_id": conversion_id,
        "status": status['status'],
        "progress": status['progress'],
        "message": status['message']
    }

    if status['status'] == 'completed' and 'output_path' in status:
        # Generate download URL
        filename = os.path.basename(status['output_path'])
        response['download_url'] = f"/download/{filename}"
        response['conversion_method'] = status.get('conversion_method', 'unknown')
    elif status['status'] == 'failed':
        response['error'] = status.get('error', 'Unknown error')

    return response


@router.get("/font/formats")
async def get_font_formats():
    """Get supported font formats"""
    formats = get_supported_formats()

    return {
        "supported_formats": formats,
        "format_descriptions": {
            "ttf": "TrueType Font - Universal compatibility",
            "otf": "OpenType Font - Advanced typography features",
            "woff": "Web Open Font Format - Web optimized",
            "woff2": "Web Open Font Format 2 - Best web compression",
            "eot": "Embedded OpenType - Legacy IE support",
            "svg": "SVG Fonts - Vector-based fonts",
            "ps1": "PostScript Type 1 - Professional printing"
        },
        "recommendations": {
            "web_use": ["woff2", "woff"],
            "desktop_use": ["ttf", "otf"],
            "print_use": ["otf", "ps1"]
        },
        "system_status": {
            "fonttools_available": FONTTOOLS_AVAILABLE,
            "woff2_tools_available": False  # Will be updated based on actual availability
        }
    }


@router.delete("/font/status/{conversion_id}")
async def clear_font_conversion_status(conversion_id: str):
    """Clear font conversion status"""

    if conversion_id in conversion_status:
        del conversion_status[conversion_id]
        return {"message": "Conversion status cleared"}
    else:
        raise HTTPException(status_code=404, detail="Conversion not found")