from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import tempfile

from utils.config import UPLOAD_DIR
from utils.helpers import generate_unique_filename, check_rate_limit
from utils.dependencies import cleanup_old_files, PIL_AVAILABLE
from converters.ocr_processor import (
    extract_text_from_image,
    validate_ocr_params,
    get_supported_languages,
    get_available_engines,
    get_ocr_capabilities
)

router = APIRouter()
security = HTTPBearer(auto_error=False)


@router.post("/extract-text")
async def extract_text_endpoint(
    file: UploadFile = File(...),
    language: str = Form(default="eng"),
    engine: str = Form(default="tesseract"),
    enhance_image: bool = Form(default=True),
    auto_rotate: bool = Form(default=True),
    output_format: str = Form(default="text"),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Extract text from image using OCR

    Parameters:
    - file: Image file to process (max 50MB)
    - language: Language code (eng, spa, fra, deu, etc.)
    - engine: OCR engine (tesseract, easyocr, paddleocr)
    - enhance_image: Apply image enhancement preprocessing
    - auto_rotate: Automatically detect and correct orientation
    - output_format: Output format (text, json, hocr)
    """

    # Check if PIL is available (required for image processing)
    if not PIL_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="OCR not available. Missing dependency: Pillow (PIL)"
        )

    # Rate limiting
    client_ip = "127.0.0.1"  # In production, get real IP
    check_rate_limit(client_ip)
    cleanup_old_files()

    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Check file size (200MB max for OCR)
    max_size = 200 * 1024 * 1024  # 200MB
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 200MB")

    # Reset file pointer
    await file.seek(0)

    # Validate file type
    allowed_types = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/tiff',
        'image/bmp', 'image/webp', 'application/pdf'
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Supported types: {', '.join(allowed_types)}"
        )

    try:
        # Validate OCR parameters
        params = {
            'language': language,
            'engine': engine,
            'output_format': output_format
        }
        params_valid, params_error = validate_ocr_params(params)
        if not params_valid:
            raise HTTPException(status_code=400, detail=params_error)

        # Generate unique filename
        input_filename = generate_unique_filename(file.filename)
        input_path = os.path.join(UPLOAD_DIR, input_filename)

        # Save uploaded file
        with open(input_path, "wb") as buffer:
            buffer.write(file_content)

        # Process OCR
        result = await extract_text_from_image(
            image_path=input_path,
            language=language,
            engine=engine,
            enhance_image=enhance_image,
            auto_rotate=auto_rotate,
            output_format=output_format
        )

        # Clean up input file
        try:
            os.remove(input_path)
        except:
            pass

        if not result.get('success', False):
            raise HTTPException(
                status_code=500,
                detail=f"OCR processing failed: {result.get('error', 'Unknown error')}"
            )

        # Prepare response
        ocr_details = {
            'original_filename': file.filename,
            'file_size_mb': len(file_content) / (1024 * 1024),
            'language_requested': language,
            'language_detected': result.get('language_detected', language),
            'engine_used': result.get('engine_used', engine),
            'processing_time_seconds': result.get('processing_time', 0),
            'image_info': result.get('image_info', {}),
            'text_statistics': {
                'character_count': result.get('character_count', 0),
                'word_count': result.get('word_count', 0),
                'confidence_score': result.get('confidence', 0)
            },
            'settings': {
                'image_enhancement': enhance_image,
                'auto_rotation': auto_rotate,
                'output_format': output_format
            },
            'output_files': result.get('output_files', {}),
            'pages_processed': result.get('pages_processed'),
            'total_pages': result.get('total_pages')
        }

        return {
            "message": "Text extraction completed successfully",
            "extracted_text": result.get('extracted_text', ''),
            "confidence": result.get('confidence', 0),
            "ocr_details": ocr_details,
            "output_files": result.get('output_files', {})
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"OCR processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OCR processing error: {str(e)}")


@router.get("/ocr-capabilities")
async def get_ocr_capabilities_endpoint():
    """Get OCR system capabilities and supported features"""
    try:
        capabilities = get_ocr_capabilities()

        return {
            "available_engines": capabilities['engines'],
            "supported_languages": capabilities['languages'],
            "file_limits": {
                "max_file_size": f"{capabilities['max_file_size_mb']} MB",
                "max_file_size_bytes": capabilities['max_file_size_mb'] * 1024 * 1024,
                "supported_formats": capabilities['supported_formats']
            },
            "features": capabilities['features'],
            "system_status": capabilities['libraries_status'],
            "language_recommendations": {
                "latin_scripts": ["eng", "spa", "fra", "deu", "ita", "por"],
                "asian_scripts": ["jpn", "kor", "chi_sim", "chi_tra"],
                "arabic_scripts": ["ara", "urd"],
                "indic_scripts": ["hin"]
            },
            "accuracy_tips": [
                "Use high-resolution images (300+ DPI) for best results",
                "Ensure good contrast between text and background",
                "Avoid skewed or rotated text when possible",
                "Use image enhancement for low-quality scans",
                "Select the correct language for your text",
                "Clean, noise-free images produce better results"
            ],
            "use_cases": [
                "Document digitization and archival",
                "Data entry automation from forms and receipts",
                "Text extraction from screenshots and photos",
                "Multilingual document processing",
                "Academic research and note digitization",
                "Business card and contact information extraction"
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get OCR capabilities: {str(e)}")


@router.get("/supported-languages")
async def get_supported_languages_endpoint():
    """Get list of supported languages for OCR"""
    try:
        languages = get_supported_languages()
        engines = get_available_engines()

        return {
            "languages": languages,
            "language_count": len(languages),
            "available_engines": engines,
            "popular_languages": {
                "eng": "English",
                "spa": "Spanish",
                "fra": "French",
                "deu": "German",
                "chi_sim": "Chinese (Simplified)",
                "jpn": "Japanese",
                "ara": "Arabic"
            },
            "language_groups": {
                "Western European": ["eng", "spa", "fra", "deu", "ita", "por"],
                "Eastern European": ["rus"],
                "East Asian": ["jpn", "kor", "chi_sim", "chi_tra"],
                "Middle Eastern": ["ara"],
                "South Asian": ["hin", "urd"]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get supported languages: {str(e)}")


@router.post("/validate-image")
async def validate_image_for_ocr(
    file: UploadFile = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Validate image for OCR processing and provide recommendations
    """

    if not PIL_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Image validation not available. Missing dependency: Pillow (PIL)"
        )

    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Check file size
    file_content = await file.read()
    file_size_mb = len(file_content) / (1024 * 1024)

    try:
        # Save to temp file for analysis
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            tmp_file.write(file_content)
            tmp_file.flush()

            # Analyze image
            from PIL import Image
            with Image.open(tmp_file.name) as img:
                width, height = img.size
                mode = img.mode
                format_name = img.format

                # Calculate DPI if available
                dpi = img.info.get('dpi', (72, 72))
                if isinstance(dpi, tuple):
                    avg_dpi = (dpi[0] + dpi[1]) / 2
                else:
                    avg_dpi = dpi

                # Analyze image quality for OCR
                recommendations = []
                quality_score = 100

                # Check resolution
                if width < 600 or height < 400:
                    recommendations.append("Image resolution is low. Consider using a higher resolution image for better OCR accuracy.")
                    quality_score -= 20

                if avg_dpi < 150:
                    recommendations.append("Image DPI is low. 300+ DPI is recommended for optimal text recognition.")
                    quality_score -= 15

                # Check image mode
                if mode not in ['RGB', 'L']:
                    recommendations.append("Convert image to RGB or Grayscale for better OCR processing.")
                    quality_score -= 10

                # Check file size
                if file_size_mb > 20:
                    recommendations.append("Large file size may slow processing. Consider compressing the image.")
                elif file_size_mb < 0.1:
                    recommendations.append("Very small file size may indicate low quality. Ensure image is clear.")
                    quality_score -= 10

                # Determine best OCR settings
                recommended_settings = {
                    "language": "eng",  # Default
                    "engine": "tesseract",  # Most reliable
                    "enhance_image": avg_dpi < 200 or quality_score < 80,
                    "auto_rotate": True
                }

                if not recommendations:
                    recommendations.append("Image looks good for OCR processing!")

            # Clean up temp file
            try:
                os.unlink(tmp_file.name)
            except:
                pass

            return {
                "validation_result": "success",
                "image_analysis": {
                    "filename": file.filename,
                    "file_size_mb": round(file_size_mb, 2),
                    "dimensions": {"width": width, "height": height},
                    "format": format_name,
                    "color_mode": mode,
                    "dpi": round(avg_dpi, 1),
                    "quality_score": max(0, quality_score)
                },
                "recommendations": recommendations,
                "suggested_settings": recommended_settings,
                "ocr_readiness": {
                    "ready": quality_score >= 60,
                    "confidence": "High" if quality_score >= 80 else "Medium" if quality_score >= 60 else "Low",
                    "expected_accuracy": "90-95%" if quality_score >= 80 else "70-90%" if quality_score >= 60 else "50-70%"
                }
            }

    except Exception as e:
        try:
            os.unlink(tmp_file.name)
        except:
            pass
        raise HTTPException(status_code=500, detail=f"Image validation failed: {str(e)}")