from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import json

from utils.config import UPLOAD_DIR
from utils.helpers import generate_unique_filename, check_rate_limit
from utils.dependencies import cleanup_old_files, QRCODE_AVAILABLE
from converters.qr_code_generator import (
    generate_qr_code,
    validate_qr_text,
    validate_qr_params,
    get_supported_formats,
    get_supported_error_corrections,
    get_supported_styles
)

router = APIRouter()
security = HTTPBearer(auto_error=False)


@router.post("/generate-qr-code")
async def generate_qr_code_endpoint(
    text: str = Form(...),
    format: str = Form(default="png"),
    size: int = Form(default=300),
    border: int = Form(default=4),
    error_correction: str = Form(default="M"),
    fill_color: str = Form(default="black"),
    back_color: str = Form(default="white"),
    style: str = Form(default="square"),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Generate QR Code with customizable options

    Parameters:
    - text: Text or URL to encode in QR code
    - format: Output format (png, jpg, svg, pdf)
    - size: QR code size in pixels (50-2000)
    - border: Border size in modules (0-20)
    - error_correction: Error correction level (L, M, Q, H)
    - fill_color: QR code color (CSS color name or hex)
    - back_color: Background color (CSS color name or hex)
    - style: QR code style (square, rounded, circle)
    """

    # Check if QR code library is available
    if not QRCODE_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="QR code generation not available. Missing dependency: qrcode"
        )

    # Rate limiting
    client_ip = "127.0.0.1"  # In production, get real IP
    check_rate_limit(client_ip)
    cleanup_old_files()

    try:
        # Validate QR code text
        text_valid, text_error = validate_qr_text(text)
        if not text_valid:
            raise HTTPException(status_code=400, detail=text_error)

        # Validate parameters
        params = {
            'format': format,
            'size': size,
            'border': border,
            'error_correction': error_correction,
            'style': style
        }
        params_valid, params_error = validate_qr_params(params)
        if not params_valid:
            raise HTTPException(status_code=400, detail=params_error)

        # Generate unique filename
        file_extension = format.lower()
        if file_extension == 'jpg':
            file_extension = 'jpeg'

        output_filename = generate_unique_filename(f"qrcode.{file_extension}")
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Generate QR code
        success = await generate_qr_code(
            text=text.strip(),
            output_path=output_path,
            format=format.lower(),
            size=size,
            border=border,
            error_correction=error_correction.upper(),
            fill_color=fill_color,
            back_color=back_color,
            style=style.lower()
        )

        if not success:
            raise HTTPException(status_code=500, detail="QR code generation failed")

        return {
            "message": "QR code generated successfully",
            "download_url": f"/download/{output_filename}",  # Use relative URL
            "filename": output_filename,
            "qr_details": {
                "text": text[:100] + "..." if len(text) > 100 else text,
                "format": format.upper(),
                "size": f"{size}x{size}",
                "error_correction": error_correction.upper(),
                "style": style.title()
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"QR Code generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"QR code generation error: {str(e)}")


@router.get("/qr-code-info")
async def get_qr_code_info():
    """Get information about QR code generation capabilities"""
    return {
        "supported_formats": get_supported_formats(),
        "supported_error_corrections": {
            "L": "Low - ~7% error correction",
            "M": "Medium - ~15% error correction (recommended)",
            "Q": "Quartile - ~25% error correction",
            "H": "High - ~30% error correction"
        },
        "supported_styles": {
            "square": "Traditional square modules",
            "rounded": "Rounded corner modules",
            "circle": "Circular modules"
        },
        "size_limits": {
            "min": 50,
            "max": 2000,
            "recommended": 300
        },
        "border_limits": {
            "min": 0,
            "max": 20,
            "recommended": 4
        },
        "text_limits": {
            "max_length": 4296,
            "note": "Actual capacity depends on character type and error correction level"
        },
        "color_formats": [
            "CSS color names (e.g., 'red', 'blue', 'green')",
            "Hex colors (e.g., '#FF0000', '#00FF00')",
            "RGB colors (e.g., 'rgb(255,0,0)')"
        ],
        "usage_tips": [
            "Use higher error correction for damaged/dirty environments",
            "Larger sizes work better for printing",
            "High contrast colors improve scanning reliability",
            "Test QR codes with multiple scanners before deployment"
        ]
    }


@router.post("/validate-qr-text")
async def validate_qr_text_endpoint(
    text: str = Form(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """Validate QR code text without generating the code"""

    try:
        # Validate text
        is_valid, error_message = validate_qr_text(text)

        if is_valid:
            # Calculate estimated QR code properties
            text_length = len(text)

            # Estimate version and capacity
            if text_length <= 25:
                version = 1
                modules = 21
            elif text_length <= 47:
                version = 2
                modules = 25
            elif text_length <= 77:
                version = 3
                modules = 29
            elif text_length <= 114:
                version = 4
                modules = 33
            else:
                version = min(40, (text_length // 100) + 5)
                modules = 21 + (version - 1) * 4

            return {
                "valid": True,
                "text_length": text_length,
                "estimated_properties": {
                    "version": version,
                    "modules": f"{modules}x{modules}",
                    "recommended_size": max(300, modules * 10),
                    "recommended_error_correction": "M" if text_length < 1000 else "L"
                },
                "content_type": detect_content_type(text)  # FIXED: Removed self.
            }
        else:
            return {
                "valid": False,
                "error": error_message
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation error: {str(e)}")


def detect_content_type(text: str) -> dict:
    """Detect the type of content in the QR code text"""
    text_lower = text.lower().strip()

    content_info = {
        "type": "text",
        "description": "Plain text"
    }

    # URL detection
    if text_lower.startswith(('http://', 'https://', 'ftp://', 'ftps://')):
        content_info = {
            "type": "url",
            "description": "Web URL",
            "action": "Opens in browser"
        }

    # Email detection
    elif text_lower.startswith('mailto:') or '@' in text and '.' in text.split('@')[-1]:
        content_info = {
            "type": "email",
            "description": "Email address",
            "action": "Opens email client"
        }

    # Phone detection
    elif text_lower.startswith('tel:') or (text.replace('+', '').replace('-', '').replace(' ', '').replace('(', '').replace(')', '').isdigit() and len(text) >= 10):
        content_info = {
            "type": "phone",
            "description": "Phone number",
            "action": "Opens dialer"
        }

    # SMS detection
    elif text_lower.startswith('sms:'):
        content_info = {
            "type": "sms",
            "description": "SMS message",
            "action": "Opens messaging app"
        }

    # WiFi detection
    elif text_lower.startswith('wifi:'):
        content_info = {
            "type": "wifi",
            "description": "WiFi credentials",
            "action": "Connects to WiFi network"
        }

    # vCard detection
    elif text_lower.startswith('begin:vcard'):
        content_info = {
            "type": "vcard",
            "description": "Contact information",
            "action": "Adds to contacts"
        }

    # Calendar event detection
    elif text_lower.startswith('begin:vevent'):
        content_info = {
            "type": "calendar",
            "description": "Calendar event",
            "action": "Adds to calendar"
        }

    # Geographic location
    elif text_lower.startswith('geo:'):
        content_info = {
            "type": "location",
            "description": "Geographic coordinates",
            "action": "Opens in maps"
        }

    return content_info