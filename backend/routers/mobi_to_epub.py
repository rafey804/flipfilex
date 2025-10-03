# routers/mobi_to_epub.py - MOBI to EPUB conversion router
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os

from utils.config import UPLOAD_DIR
from utils.helpers import validate_file_size, generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files, KINDLEGEN_AVAILABLE, EPUB_AVAILABLE
from converters.mobi_to_epub_converter import mobi_to_epub_converter

router = APIRouter()
security = HTTPBearer(auto_error=False)

@router.post("/mobi-to-epub")
async def convert_mobi_to_epub(
    file: UploadFile = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not KINDLEGEN_AVAILABLE or not EPUB_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="MOBI to EPUB conversion not available. Missing dependencies: Calibre or EbookLib"
        )

    # Rate limiting
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()

    # Validate file
    if not file.filename.lower().endswith(('.mobi', '.azw', '.azw3')):
        raise HTTPException(status_code=400, detail="Only MOBI, AZW, or AZW3 files are allowed")

    validate_file_size(file)

    try:
        # Save uploaded file
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)

        content = await file.read()
        await write_file(input_path, content)

        # Generate output filename
        output_filename = generate_unique_filename(file.filename, '.epub')
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Convert MOBI to EPUB
        success = await mobi_to_epub_converter(input_path, output_path)

        if not success:
            if os.path.exists(input_path):
                os.remove(input_path)
            raise HTTPException(status_code=500, detail="Conversion failed")

        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)

        return {
            "message": "MOBI converted to EPUB successfully",
            "download_url": f"/download/{output_filename}",
            "filename": output_filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")