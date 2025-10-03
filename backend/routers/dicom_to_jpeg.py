# routers/dicom_to_jpeg.py - DICOM to JPEG conversion router
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os

from utils.config import UPLOAD_DIR
from utils.helpers import validate_file_size, generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files, MEDICAL_AVAILABLE
from converters.dicom_to_jpeg_converter import dicom_to_jpeg_converter

router = APIRouter()
security = HTTPBearer(auto_error=False)

@router.post("/dicom-to-jpeg")
async def convert_dicom_to_jpeg(
    file: UploadFile = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not MEDICAL_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="DICOM to JPEG conversion not available. Missing dependencies: pydicom, Pillow"
        )

    # Rate limiting
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()

    # Validate file
    if not file.filename.lower().endswith(('.dcm', '.dicom')):
        raise HTTPException(status_code=400, detail="Only DICOM files (.dcm, .dicom) are allowed")

    validate_file_size(file)

    try:
        # Save uploaded file
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)

        content = await file.read()
        await write_file(input_path, content)

        # Generate output filename
        output_filename = generate_unique_filename(file.filename, '.jpg')
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Convert DICOM to JPEG
        success = await dicom_to_jpeg_converter(input_path, output_path)

        if not success:
            if os.path.exists(input_path):
                os.remove(input_path)
            raise HTTPException(status_code=500, detail="Conversion failed")

        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)

        return {
            "message": "DICOM converted to JPEG successfully",
            "download_url": f"/download/{output_filename}",
            "filename": output_filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")