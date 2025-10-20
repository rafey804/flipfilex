"""
Background Remover API Router
Provides comprehensive background removal endpoints with advanced features
"""
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import FileResponse
from typing import Optional, List
import os
import uuid
import shutil
from datetime import datetime
from converters.background_remover import BackgroundRemover

router = APIRouter(prefix="/bg-remove", tags=["Background Removal"])

# Upload directory
UPLOAD_DIR = "uploads/background_remover"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Allowed formats
ALLOWED_FORMATS = {".jpg", ".jpeg", ".png", ".webp", ".heic"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    # Check file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format. Allowed: {', '.join(ALLOWED_FORMATS)}"
        )

    # Check file size (note: this is an estimate, actual size checked during read)
    if hasattr(file, 'size') and file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )


def save_upload_file(upload_file: UploadFile) -> str:
    """Save uploaded file and return path"""
    # Generate unique filename
    file_ext = os.path.splitext(upload_file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return file_path


@router.post("/remove")
async def remove_background_endpoint(
    file: UploadFile = File(...),
    output_format: str = Form("png"),
    background_color: Optional[str] = Form(None),
    edge_refinement: int = Form(0),
    quality: int = Form(95)
):
    """
    Remove background from image

    Args:
        file: Image file to process
        output_format: Output format (png, jpg, webp)
        background_color: Background color in format 'r,g,b,a' (e.g., '255,255,255,255')
        edge_refinement: Edge refinement level 0-10
        quality: Output quality 1-100

    Returns:
        Processed image file
    """
    try:
        # Validate
        validate_file(file)

        # Save input file
        input_path = save_upload_file(file)

        # Parse background color if provided
        bg_color = None
        if background_color:
            try:
                parts = background_color.split(",")
                bg_color = tuple(int(p) for p in parts)
            except:
                raise HTTPException(status_code=400, detail="Invalid background color format")

        # Generate output path
        output_filename = f"nobg_{uuid.uuid4()}.{output_format}"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Process
        result = BackgroundRemover.remove_background(
            input_path=input_path,
            output_path=output_path,
            output_format=output_format,
            background_color=bg_color,
            edge_refinement=edge_refinement,
            quality=quality
        )

        # Clean up input file
        os.remove(input_path)

        # Return file
        return FileResponse(
            output_path,
            media_type=f"image/{output_format}",
            filename=f"nobg_{file.filename.rsplit('.', 1)[0]}.{output_format}",
            headers={
                "X-Processing-Info": str(result)
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        # Clean up on error
        if 'input_path' in locals() and os.path.exists(input_path):
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/blur-background")
async def blur_background_endpoint(
    file: UploadFile = File(...),
    blur_intensity: int = Form(20),
    output_format: str = Form("png")
):
    """
    Blur background while keeping foreground sharp

    Args:
        file: Image file to process
        blur_intensity: Blur intensity 1-100
        output_format: Output format (png, jpg, webp)

    Returns:
        Processed image file
    """
    try:
        validate_file(file)
        input_path = save_upload_file(file)

        output_filename = f"blurred_{uuid.uuid4()}.{output_format}"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        result = BackgroundRemover.blur_background(
            input_path=input_path,
            output_path=output_path,
            blur_intensity=blur_intensity,
            output_format=output_format
        )

        os.remove(input_path)

        return FileResponse(
            output_path,
            media_type=f"image/{output_format}",
            filename=f"blurred_{file.filename}"
        )

    except HTTPException:
        raise
    except Exception as e:
        if 'input_path' in locals() and os.path.exists(input_path):
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/replace-background")
async def replace_background_endpoint(
    foreground: UploadFile = File(...),
    background: UploadFile = File(...),
    output_format: str = Form("png")
):
    """
    Replace background with custom image

    Args:
        foreground: Foreground image file
        background: Background image file
        output_format: Output format (png, jpg, webp)

    Returns:
        Processed image file
    """
    try:
        validate_file(foreground)
        validate_file(background)

        foreground_path = save_upload_file(foreground)
        background_path = save_upload_file(background)

        output_filename = f"replaced_{uuid.uuid4()}.{output_format}"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        result = BackgroundRemover.replace_background(
            foreground_path=foreground_path,
            background_path=background_path,
            output_path=output_path,
            output_format=output_format
        )

        os.remove(foreground_path)
        os.remove(background_path)

        return FileResponse(
            output_path,
            media_type=f"image/{output_format}",
            filename=f"replaced_{foreground.filename}"
        )

    except HTTPException:
        raise
    except Exception as e:
        if 'foreground_path' in locals() and os.path.exists(foreground_path):
            os.remove(foreground_path)
        if 'background_path' in locals() and os.path.exists(background_path):
            os.remove(background_path)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/gradient-background")
async def gradient_background_endpoint(
    file: UploadFile = File(...),
    gradient_type: str = Form("linear"),
    color_start: str = Form("138,43,226"),  # Purple
    color_end: str = Form("75,0,130"),  # Indigo
    output_format: str = Form("png")
):
    """
    Add gradient background to image

    Args:
        file: Image file to process
        gradient_type: Gradient type (linear or radial)
        color_start: Start color in RGB format 'r,g,b'
        color_end: End color in RGB format 'r,g,b'
        output_format: Output format (png, jpg, webp)

    Returns:
        Processed image file
    """
    try:
        validate_file(file)
        input_path = save_upload_file(file)

        # Parse colors
        try:
            start = tuple(int(c) for c in color_start.split(","))
            end = tuple(int(c) for c in color_end.split(","))
        except:
            raise HTTPException(status_code=400, detail="Invalid color format")

        output_filename = f"gradient_{uuid.uuid4()}.{output_format}"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        result = BackgroundRemover.add_gradient_background(
            input_path=input_path,
            output_path=output_path,
            gradient_type=gradient_type,
            color_start=start,
            color_end=end,
            output_format=output_format
        )

        os.remove(input_path)

        return FileResponse(
            output_path,
            media_type=f"image/{output_format}",
            filename=f"gradient_{file.filename}"
        )

    except HTTPException:
        raise
    except Exception as e:
        if 'input_path' in locals() and os.path.exists(input_path):
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch-remove")
async def batch_remove_endpoint(
    files: List[UploadFile] = File(...),
    output_format: str = Form("png"),
    background_color: Optional[str] = Form(None)
):
    """
    Batch process multiple images

    Args:
        files: List of image files to process
        output_format: Output format (png, jpg, webp)
        background_color: Background color in format 'r,g,b,a'

    Returns:
        ZIP file with all processed images
    """
    try:
        import zipfile
        from io import BytesIO

        # Validate all files
        for file in files:
            validate_file(file)

        # Save all input files
        input_paths = []
        for file in files:
            path = save_upload_file(file)
            input_paths.append(path)

        # Parse background color if provided
        bg_color = None
        if background_color:
            try:
                parts = background_color.split(",")
                bg_color = tuple(int(p) for p in parts)
            except:
                raise HTTPException(status_code=400, detail="Invalid background color format")

        # Create output directory for batch
        batch_id = str(uuid.uuid4())
        batch_dir = os.path.join(UPLOAD_DIR, f"batch_{batch_id}")
        os.makedirs(batch_dir, exist_ok=True)

        # Process all images
        results = []
        output_paths = []

        for i, input_path in enumerate(input_paths):
            try:
                filename = os.path.basename(input_path)
                output_filename = f"nobg_{i}_{filename.rsplit('.', 1)[0]}.{output_format}"
                output_path = os.path.join(batch_dir, output_filename)

                result = BackgroundRemover.remove_background(
                    input_path=input_path,
                    output_path=output_path,
                    output_format=output_format,
                    background_color=bg_color
                )

                results.append({"index": i, "success": True, "filename": output_filename})
                output_paths.append(output_path)

            except Exception as e:
                results.append({"index": i, "success": False, "error": str(e)})

        # Create ZIP file
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for output_path in output_paths:
                if os.path.exists(output_path):
                    zip_file.write(output_path, os.path.basename(output_path))

        # Clean up
        for path in input_paths:
            if os.path.exists(path):
                os.remove(path)
        shutil.rmtree(batch_dir, ignore_errors=True)

        # Return ZIP
        zip_buffer.seek(0)
        from fastapi.responses import StreamingResponse
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename=batch_nobg_{batch_id}.zip"}
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/resize")
async def resize_endpoint(
    file: UploadFile = File(...),
    size: str = Form("original")
):
    """
    Resize processed image

    Args:
        file: Image file to resize
        size: Size preset (small, medium, original)

    Returns:
        Resized image file
    """
    try:
        validate_file(file)
        input_path = save_upload_file(file)

        output_filename = f"resized_{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        result = BackgroundRemover.resize_output(
            input_path=input_path,
            output_path=output_path,
            size=size
        )

        os.remove(input_path)

        return FileResponse(
            output_path,
            media_type="image/png",
            filename=f"resized_{file.filename}"
        )

    except HTTPException:
        raise
    except Exception as e:
        if 'input_path' in locals() and os.path.exists(input_path):
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Background Remover API",
        "model": "briaai/RMBG-1.4",
        "timestamp": datetime.now().isoformat()
    }
