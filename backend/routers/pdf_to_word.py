# routers/pdf_to_word.py - PDF to Word conversion router
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os

from utils.config import UPLOAD_DIR
from utils.helpers import validate_file_size, generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files, PYPDF2_AVAILABLE, DOCX_AVAILABLE
from converters.pdf_to_word_converter import pdf_to_word_converter

router = APIRouter()
security = HTTPBearer(auto_error=False)

@router.post("/pdf-to-word")
async def convert_pdf_to_word(
    file: UploadFile = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not PYPDF2_AVAILABLE or not DOCX_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="PDF to Word conversion not available. Missing dependencies: PyPDF2 or python-docx"
        )
    
    # Rate limiting
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()
    
    # Validate file
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    validate_file_size(file)
    
    try:
        # Save uploaded file
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        content = await file.read()
        await write_file(input_path, content)
        
        # Generate output filename
        output_filename = generate_unique_filename(file.filename, '.docx')
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        # Convert PDF to Word
        success = await pdf_to_word_converter(input_path, output_path)
        
        if not success:
            if os.path.exists(input_path):
                os.remove(input_path)
            raise HTTPException(status_code=500, detail="Conversion failed")
        
        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)
        
        return {
            "message": "PDF converted to Word successfully",
            "download_url": f"/download/{output_filename}",
            "filename": output_filename
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")