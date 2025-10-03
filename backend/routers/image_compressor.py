from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import tempfile

from utils.config import UPLOAD_DIR
from utils.helpers import generate_unique_filename, check_rate_limit
from utils.dependencies import cleanup_old_files, PIL_AVAILABLE
from converters.image_compressor import (
    compress_image,
    validate_compression_params,
    get_supported_formats,
    get_quality_info,
    image_compressor
)

router = APIRouter()
security = HTTPBearer(auto_error=False)


@router.post("/compress-image")
async def compress_image_endpoint(
    file: UploadFile = File(...),
    quality: int = Form(default=80),
    format: str = Form(default="jpeg"),
    width: Optional[int] = Form(default=None),
    height: Optional[int] = Form(default=None),
    maintain_aspect_ratio: bool = Form(default=True),
    optimize: bool = Form(default=True),
    progressive: bool = Form(default=True),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Compress an image with customizable options

    Parameters:
    - file: Image file to compress (max 200MB)
    - quality: Compression quality (10-100 for JPEG/WebP, 1-9 for PNG)
    - format: Output format (jpeg, png, webp)
    - width: Target width in pixels (optional)
    - height: Target height in pixels (optional)
    - maintain_aspect_ratio: Whether to maintain aspect ratio when resizing
    - optimize: Enable optimization for smaller file size
    - progressive: Enable progressive encoding (JPEG only)
    """

    # Check if PIL is available
    if not PIL_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Image compression not available. Missing dependency: Pillow (PIL)"
        )

    # Rate limiting
    client_ip = "127.0.0.1"  # In production, get real IP
    check_rate_limit(client_ip)
    cleanup_old_files()

    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Check file size (200MB max)
    max_size = 200 * 1024 * 1024  # 200MB
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 200MB")

    # Reset file pointer
    await file.seek(0)

    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff', 'image/gif']
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Supported types: {', '.join(allowed_types)}"
        )

    try:
        # Validate compression parameters
        params = {
            'format': format,
            'quality': quality,
            'width': width,
            'height': height
        }
        params_valid, params_error = validate_compression_params(params)
        if not params_valid:
            raise HTTPException(status_code=400, detail=params_error)

        # Generate unique filenames
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)

        # Determine output extension
        output_extension = format.lower()
        if output_extension == 'jpeg':
            output_extension = 'jpg'

        output_filename = generate_unique_filename(f"compressed.{output_extension}")
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Save uploaded file
        with open(input_path, "wb") as buffer:
            buffer.write(file_content)

        # Get original file info
        original_info = image_compressor.get_image_info(input_path)
        original_size = len(file_content)

        # Compress image
        result = await compress_image(
            input_path=input_path,
            output_path=output_path,
            quality=quality,
            format=format.lower(),
            width=width,
            height=height,
            maintain_aspect_ratio=maintain_aspect_ratio,
            optimize=optimize,
            progressive=progressive
        )

        # Clean up input file
        try:
            os.remove(input_path)
        except:
            pass

        if not result.get('success', False):
            raise HTTPException(status_code=500, detail=f"Compression failed: {result.get('error', 'Unknown error')}")

        # Prepare response
        compression_details = {
            'original_filename': file.filename,
            'compressed_filename': output_filename,
            'original_size': result['original_size'],
            'compressed_size': result['compressed_size'],
            'size_reduction_bytes': result['size_reduction'],
            'size_reduction_percentage': result['compression_ratio'],
            'original_dimensions': result['original_dimensions'],
            'final_dimensions': result['final_dimensions'],
            'original_format': result['original_format'],
            'output_format': result['output_format'],
            'quality_used': result['quality_used'],
            'settings': {
                'maintain_aspect_ratio': maintain_aspect_ratio,
                'optimize': optimize,
                'progressive': result.get('progressive')
            }
        }

        return {
            "message": "Image compressed successfully",
            "download_url": f"/download/{output_filename}",
            "filename": output_filename,
            "compression_details": compression_details
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Image compression error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image compression error: {str(e)}")


@router.get("/compression-info")
async def get_compression_info():
    """Get information about image compression capabilities"""
    formats = get_supported_formats()
    quality_info = get_quality_info()

    return {
        "supported_formats": formats,
        "quality_settings": quality_info,
        "file_size_limits": {
            "max_upload_size": "200 MB",
            "max_upload_size_bytes": 200 * 1024 * 1024
        },
        "dimension_limits": {
            "min_width": 1,
            "max_width": 10000,
            "min_height": 1,
            "max_height": 10000
        },
        "compression_features": [
            "Quality control (10-100% for JPEG/WebP, 1-9 for PNG)",
            "Format conversion (JPEG, PNG, WebP)",
            "Image resizing with aspect ratio control",
            "Optimization for smaller file sizes",
            "Progressive JPEG encoding",
            "EXIF orientation handling",
            "Transparency preservation (PNG/WebP)"
        ],
        "optimization_tips": {
            "jpeg": {
                "best_for": "Photographs and images with many colors",
                "recommended_quality": "80-90 for good quality/size balance",
                "notes": "No transparency support, progressive encoding available"
            },
            "png": {
                "best_for": "Graphics, logos, images with transparency",
                "recommended_quality": "6-8 for good compression",
                "notes": "Lossless compression, supports transparency"
            },
            "webp": {
                "best_for": "Modern web applications",
                "recommended_quality": "80-90 for good quality/size balance",
                "notes": "Better compression than JPEG/PNG, supports transparency"
            }
        }
    }


@router.post("/estimate-compression")
async def estimate_compression_size(
    file: UploadFile = File(...),
    quality: int = Form(default=80),
    format: str = Form(default="jpeg"),
    width: Optional[int] = Form(default=None),
    height: Optional[int] = Form(default=None),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Estimate compressed file size without actually compressing
    Useful for preview before actual compression
    """

    if not PIL_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Image compression not available. Missing dependency: Pillow (PIL)"
        )

    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Check file size
    file_content = await file.read()
    original_size = len(file_content)

    try:
        # Validate parameters
        params = {
            'format': format,
            'quality': quality,
            'width': width,
            'height': height
        }
        params_valid, params_error = validate_compression_params(params)
        if not params_valid:
            raise HTTPException(status_code=400, detail=params_error)

        # Save to temp file to get image info
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            tmp_file.write(file_content)
            tmp_file.flush()

            # Get image info
            image_info = image_compressor.get_image_info(tmp_file.name)

            # Calculate resize factor if dimensions specified
            resize_factor = 1.0
            if width or height:
                original_width = image_info['width']
                original_height = image_info['height']

                if width and height:
                    # Both dimensions specified
                    width_factor = width / original_width
                    height_factor = height / original_height
                    resize_factor = min(width_factor, height_factor)  # Maintain aspect ratio
                elif width:
                    resize_factor = width / original_width
                elif height:
                    resize_factor = height / original_height

            # Estimate compressed size
            estimated_size = image_compressor.estimate_compressed_size(
                original_size, quality, format, resize_factor
            )

            # Calculate estimated compression ratio
            estimated_ratio = ((original_size - estimated_size) / original_size) * 100

            # Estimate final dimensions
            final_width = image_info['width']
            final_height = image_info['height']
            if resize_factor != 1.0:
                final_width = int(final_width * resize_factor)
                final_height = int(final_height * resize_factor)

            # Clean up temp file
            try:
                os.unlink(tmp_file.name)
            except:
                pass

            return {
                "original_size": original_size,
                "estimated_compressed_size": estimated_size,
                "estimated_size_reduction": original_size - estimated_size,
                "estimated_compression_ratio": round(estimated_ratio, 2),
                "original_dimensions": {
                    "width": image_info['width'],
                    "height": image_info['height']
                },
                "estimated_final_dimensions": {
                    "width": final_width,
                    "height": final_height
                },
                "format_conversion": f"{image_info.get('format', 'Unknown')} → {format.upper()}",
                "settings": {
                    "quality": quality,
                    "format": format,
                    "resize_factor": round(resize_factor, 3)
                },
                "note": "This is an estimate. Actual results may vary based on image content."
            }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Compression estimation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Estimation error: {str(e)}")