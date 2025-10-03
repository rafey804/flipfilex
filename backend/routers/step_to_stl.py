# routers/step_to_stl.py - STEP to STL conversion router
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os

from utils.config import UPLOAD_DIR
from utils.helpers import validate_file_size, generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files, CAD_AVAILABLE
from converters.step_to_stl_converter import step_to_stl_converter

router = APIRouter()
security = HTTPBearer(auto_error=False)

@router.post("/step-to-stl")
async def convert_step_to_stl(
    file: UploadFile = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not CAD_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="STEP to STL conversion not available. Missing CAD dependencies"
        )

    # Rate limiting
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()

    # Validate file
    if not file.filename.lower().endswith(('.step', '.stp')):
        raise HTTPException(status_code=400, detail="Only STEP or STP files are allowed")

    validate_file_size(file)

    try:
        # Save uploaded file
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)

        content = await file.read()
        await write_file(input_path, content)

        # Generate output filename
        output_filename = generate_unique_filename(file.filename, '.stl')
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Convert STEP to STL
        success = await step_to_stl_converter(input_path, output_path)

        if not success:
            if os.path.exists(input_path):
                os.remove(input_path)
            raise HTTPException(status_code=500, detail="Conversion failed")

        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)

        return {
            "message": "STEP converted to STL successfully",
            "download_url": f"/download/{output_filename}",
            "filename": output_filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")