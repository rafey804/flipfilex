# routers/pdf_password.py - PDF Password Protection API Router
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, List
import os
import logging
import uuid
import tempfile

from utils.config import UPLOAD_DIR
from utils.helpers import generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files
from converters.pdf_password import (
    add_pdf_password, remove_pdf_password, get_password_capabilities, check_pdf_protection
)

router = APIRouter()
security = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)

# Simple progress storage
protection_status = {}

def validate_pdf_file_size(file: UploadFile, max_size_mb: int = 100):
    """Validate PDF file size"""
    max_size = max_size_mb * 1024 * 1024

    if hasattr(file, 'size') and file.size and file.size > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {max_size_mb}MB"
        )

async def process_pdf_protection(operation_id: str, operation_type: str, input_path: str,
                               output_path: str, **kwargs):
    """Background PDF protection/unprotection process"""
    try:
        print(f"Starting PDF {operation_type} for ID: {operation_id}")

        # Update status
        protection_status[operation_id] = {
            'status': 'processing',
            'progress': 10,
            'message': f'Processing PDF {operation_type}...',
            'operation_type': operation_type
        }

        if operation_type == 'protection':
            # Add password protection
            result = await add_pdf_password(
                input_path, output_path,
                kwargs.get('user_password'),
                kwargs.get('owner_password'),
                kwargs.get('encryption_level', 'standard'),
                kwargs.get('permissions')
            )
        else:
            # Remove password protection
            result = await remove_pdf_password(
                input_path, output_path,
                kwargs.get('password')
            )

        if result['success']:
            protection_status[operation_id] = {
                'status': 'completed',
                'progress': 100,
                'message': f'PDF {operation_type} completed successfully',
                'output_path': output_path,
                'operation_result': result,
                'operation_type': operation_type
            }
            print(f"PDF {operation_type} completed for ID: {operation_id}")
        else:
            protection_status[operation_id] = {
                'status': 'failed',
                'progress': 0,
                'error': result.get('error', f'Unknown {operation_type} error'),
                'message': f"PDF {operation_type} failed: {result.get('error', 'Unknown error')}",
                'operation_type': operation_type
            }
            print(f"PDF {operation_type} failed for ID: {operation_id}")

    except Exception as e:
        logger.error(f"PDF {operation_type} process error: {str(e)}")
        protection_status[operation_id] = {
            'status': 'failed',
            'progress': 0,
            'error': str(e),
            'message': f"PDF {operation_type} error: {str(e)}",
            'operation_type': operation_type
        }


@router.post("/protect-pdf")
async def protect_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user_password: str = Form(...),
    owner_password: Optional[str] = Form(None),
    encryption_level: str = Form('standard'),
    permissions: Optional[str] = Form(None),  # Comma-separated permissions
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Add password protection to PDF files

    Encryption Levels:
    - basic: 40-bit RC4 encryption (basic security)
    - standard: 128-bit RC4/AES encryption (recommended)
    - high: 256-bit AES encryption (maximum security)

    Available Permissions:
    - print: Allow printing
    - modify: Allow modifying content
    - copy: Allow copying text/graphics
    - annotations: Allow adding annotations
    - forms: Allow filling forms
    - extract: Allow text extraction
    - assemble: Allow document assembly
    - print_high: Allow high-quality printing
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

    if encryption_level not in ['basic', 'standard', 'high']:
        raise HTTPException(
            status_code=400,
            detail="Invalid encryption level. Use: basic, standard, or high"
        )

    if len(user_password) < 4:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 4 characters long"
        )

    # Parse permissions
    permission_list = None
    if permissions:
        permission_list = [p.strip() for p in permissions.split(',') if p.strip()]

    # Validate file size
    validate_pdf_file_size(file, max_size_mb=100)

    try:
        # Generate operation ID
        operation_id = str(uuid.uuid4())

        # Generate unique filenames
        input_filename = generate_unique_filename(file.filename)
        base_name = os.path.splitext(input_filename)[0]
        output_filename = f"{base_name}_protected.pdf"

        # Full paths
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Save uploaded file
        file_content = await file.read()
        await write_file(input_path, file_content)

        # Initialize protection status
        protection_status[operation_id] = {
            'status': 'queued',
            'progress': 0,
            'message': 'PDF protection queued',
            'operation_type': 'protection'
        }

        # Start background protection
        background_tasks.add_task(
            process_pdf_protection,
            operation_id,
            'protection',
            input_path,
            output_path,
            user_password=user_password,
            owner_password=owner_password or user_password,
            encryption_level=encryption_level,
            permissions=permission_list
        )

        return {
            "message": "PDF protection started",
            "operation_id": operation_id,
            "status": "queued",
            "estimated_time": "30 seconds - 2 minutes",
            "input_filename": file.filename,
            "output_filename": output_filename,
            "protection_settings": {
                "encryption_level": encryption_level,
                "permissions": permission_list or [],
                "has_owner_password": bool(owner_password)
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF protection error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF protection error: {str(e)}")


@router.post("/unprotect-pdf")
async def unprotect_pdf_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    password: str = Form(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Remove password protection from PDF files

    This endpoint removes password protection from encrypted PDF files,
    allowing unrestricted access to the document content.
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

    if not password:
        raise HTTPException(
            status_code=400,
            detail="Password is required to unlock PDF"
        )

    # Validate file size
    validate_pdf_file_size(file, max_size_mb=100)

    try:
        # Generate operation ID
        operation_id = str(uuid.uuid4())

        # Generate unique filenames
        input_filename = generate_unique_filename(file.filename)
        base_name = os.path.splitext(input_filename)[0]
        output_filename = f"{base_name}_unlocked.pdf"

        # Full paths
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Save uploaded file
        file_content = await file.read()
        await write_file(input_path, file_content)

        # Initialize protection status
        protection_status[operation_id] = {
            'status': 'queued',
            'progress': 0,
            'message': 'PDF password removal queued',
            'operation_type': 'unprotection'
        }

        # Start background unprotection
        background_tasks.add_task(
            process_pdf_protection,
            operation_id,
            'unprotection',
            input_path,
            output_path,
            password=password
        )

        return {
            "message": "PDF password removal started",
            "operation_id": operation_id,
            "status": "queued",
            "estimated_time": "30 seconds - 1 minute",
            "input_filename": file.filename,
            "output_filename": output_filename
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF password removal error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF password removal error: {str(e)}")


@router.get("/pdf-password/status/{operation_id}")
async def get_protection_status(operation_id: str):
    """Get PDF protection/unprotection status"""

    if operation_id not in protection_status:
        raise HTTPException(status_code=404, detail="Operation not found")

    status = protection_status[operation_id]

    response = {
        "operation_id": operation_id,
        "operation_type": status.get('operation_type', 'unknown'),
        "status": status['status'],
        "progress": status['progress'],
        "message": status['message']
    }

    if status['status'] == 'completed' and 'output_path' in status:
        # Generate download URL
        filename = os.path.basename(status['output_path'])
        response['download_url'] = f"/download/{filename}"

        # Add operation results
        if 'operation_result' in status:
            result = status['operation_result']
            response['operation_results'] = result

    elif status['status'] == 'failed':
        response['error'] = status.get('error', 'Unknown error')

    return response


@router.post("/pdf-password/check")
async def check_pdf_protection_endpoint(
    file: UploadFile = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Check if PDF file is password protected

    This endpoint analyzes a PDF file to determine if it requires
    a password to open and provides encryption information.
    """

    # Validate inputs
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )

    try:
        # Save file temporarily for analysis
        temp_filename = generate_unique_filename(file.filename)
        temp_path = os.path.join(UPLOAD_DIR, temp_filename)

        # Read file content
        file_content = await file.read()
        await write_file(temp_path, file_content)

        # Check protection status
        protection_info = check_pdf_protection(temp_path)

        # Clean up temp file
        try:
            os.unlink(temp_path)
        except:
            pass

        return {
            "filename": file.filename,
            "protection_info": protection_info,
            "file_size": file.size if hasattr(file, 'size') else 0
        }

    except Exception as e:
        logger.error(f"PDF protection check error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Protection check error: {str(e)}")


@router.get("/pdf-password/info")
async def get_password_info_endpoint():
    """Get PDF password protection capabilities and information"""
    info = get_password_capabilities()

    return {
        "password_capabilities": info,
        "supported_formats": ["PDF"],
        "max_file_size": "100MB",
        "encryption_levels": {
            "basic": {
                "name": "Basic Encryption (40-bit)",
                "description": "Standard RC4 encryption for basic protection",
                "security_level": "Low",
                "recommended_for": "Simple document protection"
            },
            "standard": {
                "name": "Standard Encryption (128-bit)",
                "description": "Strong RC4/AES encryption for normal use",
                "security_level": "Medium",
                "recommended_for": "Business documents, general use"
            },
            "high": {
                "name": "High Security (256-bit AES)",
                "description": "Advanced AES encryption for sensitive documents",
                "security_level": "High",
                "recommended_for": "Confidential documents, sensitive data"
            }
        },
        "available_permissions": {
            "print": "Allow printing the document",
            "modify": "Allow modifying document content",
            "copy": "Allow copying text and graphics",
            "annotations": "Allow adding comments and annotations",
            "forms": "Allow filling in form fields",
            "extract": "Allow text extraction for accessibility",
            "assemble": "Allow document assembly and page manipulation",
            "print_high": "Allow high-quality printing"
        },
        "features": {
            "add_password": "Protect PDF files with user and owner passwords",
            "remove_password": "Remove password protection from encrypted PDFs",
            "custom_permissions": "Set specific permissions for document usage",
            "encryption_levels": "Choose from multiple encryption strengths",
            "batch_processing": "Process multiple files simultaneously"
        }
    }


@router.delete("/pdf-password/status/{operation_id}")
async def clear_protection_status(operation_id: str):
    """Clear PDF protection operation status"""

    if operation_id in protection_status:
        del protection_status[operation_id]
        return {"message": "Operation status cleared"}
    else:
        raise HTTPException(status_code=404, detail="Operation not found")