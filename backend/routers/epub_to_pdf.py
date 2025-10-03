# routers/epub_to_pdf.py - EPUB to PDF conversion router
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os

from utils.config import UPLOAD_DIR
from utils.helpers import validate_file_size, generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files, EPUB_AVAILABLE, REPORTLAB_AVAILABLE
from converters.epub_to_pdf_converter import epub_to_pdf_converter

router = APIRouter()
security = HTTPBearer(auto_error=False)

@router.post("/epub-to-pdf")
async def convert_epub_to_pdf(
    file: UploadFile = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not EPUB_AVAILABLE or not REPORTLAB_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="EPUB to PDF conversion not available. Missing dependencies: EbookLib or ReportLab"
        )

    # Rate limiting
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()

    # Validate file
    if not file.filename.lower().endswith('.epub'):
        raise HTTPException(status_code=400, detail="Only EPUB files are allowed")

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

        # Convert EPUB to PDF
        success = await epub_to_pdf_converter(input_path, output_path)

        if not success:
            if os.path.exists(input_path):
                os.remove(input_path)
            raise HTTPException(status_code=500, detail="Conversion failed")

        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)

        return {
            "message": "EPUB converted to PDF successfully",
            "download_url": f"/download/{output_filename}",
            "filename": output_filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")