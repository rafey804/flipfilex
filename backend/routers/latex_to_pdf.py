# routers/latex_to_pdf.py - LaTeX to PDF conversion router
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os

from utils.config import UPLOAD_DIR
from utils.helpers import validate_file_size, generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files, LATEX_AVAILABLE
from converters.latex_to_pdf_converter import latex_to_pdf_converter

router = APIRouter()
security = HTTPBearer(auto_error=False)

@router.post("/latex-to-pdf")
async def convert_latex_to_pdf(
    file: UploadFile = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not LATEX_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="LaTeX to PDF conversion not available. Missing dependencies: pdflatex"
        )

    # Rate limiting
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()

    # Validate file
    if not file.filename.lower().endswith(('.tex', '.latex')):
        raise HTTPException(status_code=400, detail="Only TEX or LATEX files are allowed")

    validate_file_size(file)

    try:
        # Save uploaded file
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)

        content = await file.read()
        await write_file(input_path, content)

        # Generate output filename
        output_filename = generate_unique_filename(file.filename, '.pdf')
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Convert LaTeX to PDF
        success = await latex_to_pdf_converter(input_path, output_path)

        if not success:
            if os.path.exists(input_path):
                os.remove(input_path)
            raise HTTPException(status_code=500, detail="LaTeX compilation failed")

        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)

        return {
            "message": "LaTeX compiled to PDF successfully",
            "download_url": f"/download/{output_filename}",
            "filename": output_filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")