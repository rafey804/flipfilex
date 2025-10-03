
# routers/document_converter.py - Document converter API endpoints
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import logging
import uuid

from utils.config import UPLOAD_DIR
from utils.helpers import generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files
from converters.document_converter import (
    excel_to_pdf, powerpoint_to_pdf, text_to_pdf, 
    html_to_pdf, csv_to_excel, json_to_csv,
    LIBREOFFICE_AVAILABLE, SUPPORTED_DOCUMENT_FORMATS
)

router = APIRouter()
security = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)

# Simple progress storage
conversion_status = {}

def validate_document_file_size(file: UploadFile, max_size_mb: int = 100):
    """Validate document file size"""
    max_size = max_size_mb * 1024 * 1024
    
    if hasattr(file, 'size') and file.size and file.size > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {max_size_mb}MB"
        )

async def process_document_conversion(conversion_id: str, input_path: str, output_path: str, 
                                    conversion_type: str):
    """Background document conversion process"""
    try:
        print(f"Starting background document conversion for ID: {conversion_id}")
        
        # Update status
        conversion_status[conversion_id] = {
            "status": "processing",
            "progress": 10,
            "message": "Converting document..."
        }
        
        # Run the actual conversion based on type
        success = False
        
        if conversion_type == 'excel_to_pdf':
            success = await excel_to_pdf(input_path, output_path)
        elif conversion_type == 'powerpoint_to_pdf':
            success = await powerpoint_to_pdf(input_path, output_path)
        elif conversion_type == 'text_to_pdf':
            success = await text_to_pdf(input_path, output_path)
        elif conversion_type == 'html_to_pdf':
            success = await html_to_pdf(input_path, output_path)
        elif conversion_type == 'csv_to_excel':
            success = await csv_to_excel(input_path, output_path)
        elif conversion_type == 'json_to_csv':
            success = await json_to_csv(input_path, output_path)
        
        if success:
            if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                conversion_status[conversion_id] = {
                    "status": "completed",
                    "progress": 100,
                    "message": "Document conversion completed",
                    "download_url": f"/download/{os.path.basename(output_path)}"
                }
                print(f"Document conversion {conversion_id} completed successfully")
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
                "message": "Document conversion failed",
                "error": "Conversion process failed"
            }
            print(f"Document conversion {conversion_id} failed")
            
    except Exception as e:
        print(f"Document conversion {conversion_id} error: {str(e)}")
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

@router.post("/convert-document")
async def convert_document_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    conversion_type: str = Form(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """Universal document conversion endpoint"""
    
    print(f"Received document conversion request: {file.filename} -> {conversion_type}")
    
    # Basic validation
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_extension = file.filename.split('.')[-1].lower()
    
    # Validate conversion type and file extension
    if conversion_type not in SUPPORTED_DOCUMENT_FORMATS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported conversion type: {conversion_type}"
        )
    
    supported_input = SUPPORTED_DOCUMENT_FORMATS[conversion_type]['input']
    if file_extension not in supported_input:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported input format for {conversion_type}: {file_extension}. Supported formats: {', '.join(supported_input)}"
        )
    
    # Check LibreOffice requirement for office documents
    if conversion_type in ['excel_to_pdf', 'powerpoint_to_pdf'] and not LIBREOFFICE_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="LibreOffice not available. Please install LibreOffice to enable office document conversion."
        )
    
    # Validate file size
    validate_document_file_size(file)
    
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
        output_extension = SUPPORTED_DOCUMENT_FORMATS[conversion_type]['output'][0]
        output_filename = generate_unique_filename(f"{base_name}_converted.{output_extension}")
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        print(f"Output will be: {output_filename}")
        
        # Initialize status
        conversion_status[conversion_id] = {
            "status": "starting",
            "progress": 0,
            "message": "Initializing document conversion..."
        }
        
        # Start background conversion
        background_tasks.add_task(
            process_document_conversion,
            conversion_id,
            input_path,
            output_path,
            conversion_type
        )
        
        print(f"Started background document conversion: {conversion_id}")
        
        return {
            "message": f"Document conversion ({conversion_type}) started",
            "conversion_id": conversion_id,
            "status": "started",
            "conversion_type": conversion_type,
            "progress_url": f"/convert/document-progress/{conversion_id}"
        }
        
    except Exception as e:
        print(f"Document setup error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Document conversion setup failed: {str(e)}")

@router.get("/document-progress/{conversion_id}")
async def get_document_conversion_progress(conversion_id: str):
    """Get document conversion progress and status"""
    if conversion_id not in conversion_status:
        raise HTTPException(status_code=404, detail="Conversion ID not found")
    
    return conversion_status[conversion_id]

@router.get("/supported-document-formats")
async def get_supported_document_formats():
    """Get comprehensive list of supported document formats"""
    return {
        "conversion_types": SUPPORTED_DOCUMENT_FORMATS,
        "notes": {
            "libreoffice_available": LIBREOFFICE_AVAILABLE,
            "max_file_size": "100MB",
            "requirements": {
                "excel_to_pdf": "LibreOffice required",
                "powerpoint_to_pdf": "LibreOffice required", 
                "text_to_pdf": "Built-in ReportLab",
                "html_to_pdf": "wkhtmltopdf or LibreOffice",
                "csv_to_excel": "Built-in pandas/openpyxl",
                "json_to_csv": "Built-in pandas"
            }
        }
    }

@router.get("/health")
async def document_health_check():
    """Check document conversion service health"""
    return {
        "status": "healthy",
        "libreoffice_available": LIBREOFFICE_AVAILABLE,
        "active_conversions": len(conversion_status),
        "supported_conversions": len(SUPPORTED_DOCUMENT_FORMATS)
    }