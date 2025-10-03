# routers/pdf_to_images.py - PDF to Images conversion router
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import uuid
import zipfile
import shutil

from utils.config import UPLOAD_DIR
from utils.helpers import validate_file_size, generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files, PDF2IMAGE_AVAILABLE
from converters.pdf_to_images_converter import pdf_to_images_converter

router = APIRouter()
security = HTTPBearer(auto_error=False)

@router.post("/pdf-to-images")
async def convert_pdf_to_images(
    file: UploadFile = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not PDF2IMAGE_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="PDF to Images conversion not available. Missing dependencies: pdf2image or Pillow"
        )
    
    # Rate limiting
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()
    
    # Validate file
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    validate_file_size(file)
    
    input_path = None
    output_dir = None
    
    try:
        # Save uploaded file
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        content = await file.read()
        await write_file(input_path, content)
        
        print(f"Saved uploaded file to: {input_path}")
        
        # Create output directory for images
        output_dir = os.path.join(UPLOAD_DIR, f"images_{uuid.uuid4()}")
        os.makedirs(output_dir, exist_ok=True)
        
        print(f"Created output directory: {output_dir}")
        
        # Convert PDF to images with enhanced error handling
        image_paths = await pdf_to_images_converter(input_path, output_dir)
        
        if not image_paths:
            raise HTTPException(status_code=500, detail="PDF conversion failed. Could not extract images from PDF. The PDF file might be corrupted, password-protected, or in an unsupported format.")
        
        print(f"Successfully converted to {len(image_paths)} images")
        
        # Create ZIP file with all images
        zip_filename = f"pdf_images_{uuid.uuid4().hex[:8]}.zip"
        zip_path = os.path.join(UPLOAD_DIR, zip_filename)
        
        print(f"Creating ZIP file: {zip_path}")
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for image_path in image_paths:
                # Add file to zip with just the filename (not full path)
                zipf.write(image_path, os.path.basename(image_path))
                print(f"Added {os.path.basename(image_path)} to ZIP")
        
        # Cleanup input file and images directory
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(output_dir):
            shutil.rmtree(output_dir)
        
        print(f"Conversion completed successfully. ZIP file: {zip_filename}")
        
        return {
            "message": f"PDF converted to {len(image_paths)} images successfully",
            "download_url": f"/download/{zip_filename}",
            "filename": zip_filename,
            "image_count": len(image_paths)
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"Error in pdf-to-images conversion: {e}")
        import traceback
        traceback.print_exc()
        
        # Cleanup on error
        if input_path and os.path.exists(input_path):
            os.remove(input_path)
        if output_dir and os.path.exists(output_dir):
            shutil.rmtree(output_dir)
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")