from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os

from utils.config import UPLOAD_DIR
from utils.helpers import validate_file_size, generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files, PIL_AVAILABLE
from converters.png_to_webp_converter import png_to_webp_converter

router = APIRouter()
security = HTTPBearer(auto_error=False)

@router.post("/png-to-webp")
async def convert_png_to_webp(
    file: UploadFile = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not PIL_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="PNG to WebP conversion not available. Missing dependency: Pillow"
        )
    
    # Rate limiting
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()
    
    # Validate file
    if not file.filename.lower().endswith('.png'):
        raise HTTPException(status_code=400, detail="Only PNG files are allowed")
    
    validate_file_size(file)
    
    try:
        # Save uploaded file
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        content = await file.read()
        await write_file(input_path, content)
        
        # Generate output filename
        output_filename = generate_unique_filename(file.filename, '.webp')
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        # Convert PNG to WebP
        success = await png_to_webp_converter(input_path, output_path)
        
        if not success:
            if os.path.exists(input_path):
                os.remove(input_path)
            raise HTTPException(status_code=500, detail="Conversion failed")
        
        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)
        
        return {
    "message": "PNG converted to WebP successfully",
    "download_url": f"http://127.0.0.1:8000/download/{output_filename}",  # Full URL
    "filename": output_filename
}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")