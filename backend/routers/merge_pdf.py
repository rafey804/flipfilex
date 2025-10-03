# routers/merge_pdf.py - Merge PDF files router
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
import os

from utils.config import UPLOAD_DIR
from utils.helpers import validate_file_size, generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files, PYPDF2_AVAILABLE
from converters.merge_pdf_converter import merge_pdfs

router = APIRouter()
security = HTTPBearer(auto_error=False)

@router.post("/merge-pdf")
async def merge_pdf_files(
    files: List[UploadFile] = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not PYPDF2_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="PDF merge not available. Missing dependency: PyPDF2"
        )
    
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()
    
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files are required for merging")
    
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files allowed for merging")
    
    input_paths = []
    
    try:
        # Save all uploaded files
        for file in files:
            if not file.filename.lower().endswith('.pdf'):
                raise HTTPException(status_code=400, detail="Only PDF files are allowed")
            
            validate_file_size(file)
            
            input_filename = generate_unique_filename(file.filename)
            input_path = os.path.join(UPLOAD_DIR, input_filename)
            input_paths.append(input_path)
            
            content = await file.read()
            await write_file(input_path, content)
        
        # Generate output filename
        output_filename = generate_unique_filename("merged_document.pdf", '.pdf')
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        # Merge PDFs
        success = await merge_pdfs(input_paths, output_path)
        
        if not success:
            raise HTTPException(status_code=500, detail="PDF merge failed")
        
        # Cleanup input files
        for input_path in input_paths:
            if os.path.exists(input_path):
                os.remove(input_path)
        
        return {
            "message": f"{len(files)} PDF files merged successfully",
            "download_url": f"/download/{output_filename}",
            "filename": output_filename
        }
        
    except Exception as e:
        # Cleanup on error
        for input_path in input_paths:
            if os.path.exists(input_path):
                os.remove(input_path)
        raise HTTPException(status_code=500, detail=f"Merge error: {str(e)}")
