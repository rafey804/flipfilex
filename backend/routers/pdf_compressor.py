# routers/pdf_compressor.py - PDF Compressor API Router
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
from converters.pdf_compressor import compress_pdf_file, get_compression_info, get_pdf_file_info

router = APIRouter()
security = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)

# Simple progress storage
compression_status = {}

def validate_pdf_file_size(file: UploadFile, max_size_mb: int = 100):
    """Validate PDF file size"""
    max_size = max_size_mb * 1024 * 1024

    if hasattr(file, 'size') and file.size and file.size > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {max_size_mb}MB"
        )

async def process_pdf_compression(compression_id: str, input_path: str, output_path: str,
                                compression_level: str, remove_metadata: bool, optimize_images: bool):
    """Background PDF compression process"""
    try:
        print(f"Starting PDF compression for ID: {compression_id}")

        # Update status
        compression_status[compression_id] = {
            'status': 'processing',
            'progress': 10,
            'message': 'Analyzing PDF file...'
        }

        # Get original file info
        original_info = get_pdf_file_info(input_path)

        compression_status[compression_id].update({
            'progress': 30,
            'message': 'Compressing PDF file...',
            'original_info': original_info
        })

        # Perform compression
        result = await compress_pdf_file(
            input_path, output_path, compression_level, remove_metadata, optimize_images
        )

        if result['success']:
            compression_status[compression_id] = {
                'status': 'completed',
                'progress': 100,
                'message': 'PDF compression completed successfully',
                'output_path': output_path,
                'compression_result': result,
                'original_info': original_info
            }
            print(f"PDF compression completed for ID: {compression_id}")
        else:
            compression_status[compression_id] = {
                'status': 'failed',
                'progress': 0,
                'error': result.get('error', 'Unknown compression error'),
                'message': f"PDF compression failed: {result.get('error', 'Unknown error')}"
            }
            print(f"PDF compression failed for ID: {compression_id}")

    except Exception as e:
        logger.error(f"PDF compression process error: {str(e)}")
        compression_status[compression_id] = {
            'status': 'failed',
            'progress': 0,
            'error': str(e),
            'message': f"PDF compression error: {str(e)}"
        }


@router.post("/compress-pdf")
async def compress_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    compression_level: str = Form('medium'),
    remove_metadata: bool = Form(True),
    optimize_images: bool = Form(True),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Compress PDF files with advanced compression techniques

    Compression Levels:
    - low: Minimal compression, highest quality (10-30% reduction)
    - medium: Balanced compression and quality (30-60% reduction)
    - high: Maximum compression, good quality (50-80% reduction)

    Features:
    - Advanced image optimization
    - Metadata removal
    - Font compression
    - Content stream compression
    """

    # Rate limiting
    client_ip = "127.0.0.1"  # In production, get real IP
    check_rate_limit(client_ip)
    cleanup_old_files()

    # Validate inputs
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )

    if compression_level not in ['low', 'medium', 'high']:
        raise HTTPException(
            status_code=400,
            detail="Invalid compression level. Use: low, medium, or high"
        )

    # Validate file size
    validate_pdf_file_size(file, max_size_mb=100)

    try:
        # Generate compression ID
        compression_id = str(uuid.uuid4())

        # Generate unique filenames
        input_filename = generate_unique_filename(file.filename)
        base_name = os.path.splitext(input_filename)[0]
        output_filename = f"{base_name}_compressed.pdf"

        # Full paths
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Save uploaded file
        file_content = await file.read()
        await write_file(input_path, file_content)

        # Initialize compression status
        compression_status[compression_id] = {
            'status': 'queued',
            'progress': 0,
            'message': 'PDF compression queued'
        }

        # Start background compression
        background_tasks.add_task(
            process_pdf_compression,
            compression_id,
            input_path,
            output_path,
            compression_level,
            remove_metadata,
            optimize_images
        )

        return {
            "message": "PDF compression started",
            "compression_id": compression_id,
            "status": "queued",
            "estimated_time": "1-5 minutes depending on file size",
            "input_filename": file.filename,
            "output_filename": output_filename,
            "compression_settings": {
                "level": compression_level,
                "remove_metadata": remove_metadata,
                "optimize_images": optimize_images
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF compression error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF compression error: {str(e)}")


@router.get("/compress-pdf/status/{compression_id}")
async def get_compression_status(compression_id: str):
    """Get PDF compression status"""

    if compression_id not in compression_status:
        raise HTTPException(status_code=404, detail="Compression not found")

    status = compression_status[compression_id]

    response = {
        "compression_id": compression_id,
        "status": status['status'],
        "progress": status['progress'],
        "message": status['message']
    }

    if status['status'] == 'completed' and 'output_path' in status:
        # Generate download URL
        filename = os.path.basename(status['output_path'])
        response['download_url'] = f"/download/{filename}"

        # Add compression results
        if 'compression_result' in status:
            result = status['compression_result']
            response['compression_results'] = {
                'original_size': result.get('original_size', 0),
                'compressed_size': result.get('compressed_size', 0),
                'compression_ratio': result.get('compression_ratio', 0),
                'size_reduction': result.get('size_reduction', '0%'),
                'compression_method': result.get('compression_method', 'unknown')
            }

        # Add original file info
        if 'original_info' in status:
            response['original_info'] = status['original_info']

    elif status['status'] == 'failed':
        response['error'] = status.get('error', 'Unknown error')

    return response


@router.get("/compress-pdf/info")
async def get_compression_info_endpoint():
    """Get PDF compression capabilities and information"""
    info = get_compression_info()

    return {
        "compression_capabilities": info,
        "supported_formats": ["PDF"],
        "max_file_size": "100MB",
        "compression_levels": {
            "low": {
                "name": "Low Compression",
                "description": "Minimal compression with highest quality preservation",
                "expected_reduction": "10-30%",
                "recommended_for": "Professional documents, important presentations"
            },
            "medium": {
                "name": "Medium Compression",
                "description": "Balanced compression and quality",
                "expected_reduction": "30-60%",
                "recommended_for": "General documents, web sharing"
            },
            "high": {
                "name": "High Compression",
                "description": "Maximum compression with good quality",
                "expected_reduction": "50-80%",
                "recommended_for": "Web upload, email attachments, archival"
            }
        },
        "features": {
            "image_optimization": "Reduce image quality and resolution while maintaining readability",
            "metadata_removal": "Remove document metadata for privacy and size reduction",
            "font_compression": "Optimize and subset fonts to reduce file size",
            "content_compression": "Compress page content streams and remove redundancy"
        }
    }


@router.delete("/compress-pdf/status/{compression_id}")
async def clear_compression_status(compression_id: str):
    """Clear PDF compression status"""

    if compression_id in compression_status:
        del compression_status[compression_id]
        return {"message": "Compression status cleared"}
    else:
        raise HTTPException(status_code=404, detail="Compression not found")