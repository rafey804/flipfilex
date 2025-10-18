# routers/image_converter.py - UPDATED VERSION with PDF and all formats support
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os

from utils.config import UPLOAD_DIR
from utils.helpers import validate_file_size, generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files, PIL_AVAILABLE, PDF2IMAGE_AVAILABLE
from converters.image_converter import convert_image

router = APIRouter()
security = HTTPBearer(auto_error=False)

# All supported formats - including PDF input
SUPPORTED_FORMATS = {
    'input': [
        # Standard raster formats
        'avif', 'webp', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico', 'heic',
        # Vector formats (input only - can be rasterized)
        'svg',
        # Project files (basic conversion only) 
        'psd', 'ai',  # Added AI support
        # Legacy formats
        'pcx',
        # Document formats - PDF can be input
        'pdf'
    ],
    'output': [
        # Standard raster formats that can be created from any input
        'avif', 'webp', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico', 'heic',
        # Legacy formats
        'pcx',
        # Document formats - PDF can be output
        'pdf',
        # SVG output (embeds raster as base64)
        'svg'
    ]
}

@router.post("/convert-image")
async def convert_image_endpoint(
    file: UploadFile = File(...),
    target_format: str = Form(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not PIL_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="Image conversion not available. Missing PIL/Pillow dependency"
        )
    
    # Rate limiting
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()
    
    # Validate target format
    target_format = target_format.lower()
    if target_format not in SUPPORTED_FORMATS['output']:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported target format: {target_format}. Supported formats: {', '.join(SUPPORTED_FORMATS['output'])}"
        )
    
    # Validate input file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in SUPPORTED_FORMATS['input']:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported input format: {file_extension}. Supported formats: {', '.join(SUPPORTED_FORMATS['input'])}"
        )
    
    # Special warnings for complex formats
    if file_extension == 'ai':
        # Allow but warn about limitations
        pass  # Will be handled in converter with proper error message
    elif file_extension == 'pdf' and not PDF2IMAGE_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="PDF conversion not available. Missing pdf2image dependency. Install with: pip install pdf2image"
        )
    
    # Block impossible conversions
    if target_format in ['ai', 'eps', 'cdr', 'psd', 'xcf']:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot convert to {target_format.upper()}. This format requires specialized vector/project data that cannot be created from images."
        )
    
    validate_file_size(file)
    
    try:
        # Save uploaded file
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        content = await file.read()
        await write_file(input_path, content)
        
        # Generate output filename
        base_name = file.filename.rsplit('.', 1)[0]
        output_filename = generate_unique_filename(f"{base_name}.{target_format}")
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        # Convert image/PDF
        success = await convert_image(input_path, output_path, target_format)
        
        if not success:
            if os.path.exists(input_path):
                os.remove(input_path)
            
            # Provide specific error message for PDF
            if file_extension == 'pdf':
                raise HTTPException(
                    status_code=500, 
                    detail="PDF conversion failed. Please ensure pdf2image and poppler-utils are installed."
                )
            else:
                raise HTTPException(status_code=500, detail="Image conversion failed")
        
        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)
        
        # Create appropriate success message
        if file_extension == 'pdf':
            conversion_message = f"PDF converted to {target_format.upper()} successfully"
        elif target_format == 'svg':
            conversion_message = f"Image converted from {file_extension.upper()} to SVG (embedded raster) successfully"
        else:
            conversion_message = f"Image converted from {file_extension.upper()} to {target_format.upper()} successfully"
        
        return {
            "message": conversion_message,
            "download_url": f"/download/{output_filename}",
            "filename": output_filename
        }
        
    except Exception as e:
        # Cleanup on error
        if 'input_path' in locals() and os.path.exists(input_path):
            os.remove(input_path)
        if 'output_path' in locals() and os.path.exists(output_path):
            os.remove(output_path)
        
        # Provide helpful error messages
        error_message = str(e)
        if "pdf2image" in error_message.lower():
            error_message = "PDF conversion requires pdf2image library. Install with: pip install pdf2image"
        elif "poppler" in error_message.lower():
            error_message = "PDF conversion requires poppler utilities. Please install poppler-utils."
        elif "cairosvg" in error_message.lower() or "svg conversion failed" in error_message.lower():
            error_message = "SVG conversion requires cairosvg or svglib library. Install with: pip install cairosvg svglib"
        elif "pillow-heif" in error_message.lower():
            error_message = "HEIC conversion requires pillow-heif library. Install with: pip install pillow-heif"
        elif "pillow-avif" in error_message.lower():
            error_message = "AVIF conversion requires pillow-avif library. Install with: pip install pillow-avif-plugin"
        elif file_extension == 'ai' and "AI files contain complex vector data" in error_message:
            # Keep the detailed AI error message as-is
            pass
        elif file_extension == 'ai':
            error_message = "AI file conversion failed. Adobe Illustrator files require specialized software for proper conversion. Try: 1) Export from Illustrator as PNG/JPG, 2) Use Inkscape (free), or 3) Convert to SVG first."
        
        raise HTTPException(status_code=500, detail=f"Conversion error: {error_message}")

@router.get("/supported-formats")
async def get_supported_formats():
    """Get list of supported image formats"""
    return {
        "input_formats": SUPPORTED_FORMATS['input'],
        "output_formats": SUPPORTED_FORMATS['output'],
        "pdf_support": PDF2IMAGE_AVAILABLE,
        "notes": {
            "pdf_input": "PDF files are converted using the first page only",
            "pdf_requirements": "PDF conversion requires pdf2image and poppler-utils",
            "ai_input": "AI files have very limited support - complex vector data cannot be converted properly",
            "ai_recommendations": "For AI files: Export from Illustrator as PNG/JPG, use Inkscape, or convert to SVG first",
            "svg_input": "SVG can be converted to raster formats only",
            "svg_output": "SVG output embeds the raster image as base64 data (not true vector conversion)",
            "vector_tracing": "True raster-to-vector conversion requires specialized tracing software",
            "psd_input": "Basic raster extraction only (layers not preserved)", 
            "heic": "Requires pillow-heif library",
            "avif": "Requires pillow-avif-plugin",
            "impossible_conversions": {
                "project_formats": "AI/EPS/PSD/CDR output not supported (require specialized data)",
                "true_vector": "SVG output is embedded raster, not true vector tracing"
            }
        }
    }