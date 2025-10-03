import qrcode
import qrcode.image.svg
from PIL import Image, ImageDraw
import io
import os
import asyncio
from typing import Optional, Dict, Any
import base64

# Try importing advanced styling modules, fall back to basic if not available
try:
    from qrcode.image.styledpil import StyledPilImage
    STYLED_PIL_AVAILABLE = True
except ImportError:
    STYLED_PIL_AVAILABLE = False
    StyledPilImage = None

try:
    from qrcode.image.styles.moduledrawers import RoundedModuleDrawer, CircleModuleDrawer, SquareModuleDrawer
    MODULE_DRAWERS_AVAILABLE = True
except ImportError:
    MODULE_DRAWERS_AVAILABLE = False
    RoundedModuleDrawer = CircleModuleDrawer = SquareModuleDrawer = None

try:
    from qrcode.image.styles.colorfills import SolidFillColorMask
    COLOR_FILLS_AVAILABLE = True
except ImportError:
    COLOR_FILLS_AVAILABLE = False
    SolidFillColorMask = None
    print("[INFO] Advanced color fills not available - using basic colors")


class QRCodeGenerator:
    """Professional QR Code Generator with advanced styling options"""

    def __init__(self):
        self.supported_formats = ['png', 'jpg', 'jpeg', 'svg', 'pdf']
        self.supported_error_corrections = {
            'L': qrcode.constants.ERROR_CORRECT_L,  # ~7%
            'M': qrcode.constants.ERROR_CORRECT_M,  # ~15%
            'Q': qrcode.constants.ERROR_CORRECT_Q,  # ~25%
            'H': qrcode.constants.ERROR_CORRECT_H   # ~30%
        }

        # Initialize supported styles based on available modules
        self.supported_styles = {'square': 'basic'}  # Always available

        if MODULE_DRAWERS_AVAILABLE:
            self.supported_styles.update({
                'rounded': RoundedModuleDrawer(),
                'circle': CircleModuleDrawer()
            })
            self.supported_styles['square'] = SquareModuleDrawer()
        else:
            print("[INFO] Advanced QR code styling not available - using basic square style only")

    async def generate_qr_code(
        self,
        text: str,
        output_path: str,
        format: str = 'png',
        size: int = 300,
        border: int = 4,
        error_correction: str = 'M',
        fill_color: str = 'black',
        back_color: str = 'white',
        style: str = 'square',
        logo_path: Optional[str] = None
    ) -> bool:
        """
        Generate QR code with advanced styling options

        Args:
            text: Text or URL to encode
            output_path: Output file path
            format: Output format (png, jpg, svg, pdf)
            size: QR code size in pixels
            border: Border size (modules)
            error_correction: Error correction level (L, M, Q, H)
            fill_color: QR code color
            back_color: Background color
            style: Module style (square, rounded, circle)
            logo_path: Optional logo to embed in center

        Returns:
            bool: Success status
        """
        try:
            # Create QR code instance
            qr = qrcode.QRCode(
                version=1,  # Auto-sizing
                error_correction=self.supported_error_corrections.get(error_correction, qrcode.constants.ERROR_CORRECT_M),
                box_size=max(1, size // 25),  # Adjust box size based on total size
                border=border,
            )

            # Add data
            qr.add_data(text)
            qr.make(fit=True)

            # Generate based on format
            if format.lower() == 'svg':
                return await self._generate_svg(qr, output_path, fill_color, back_color)
            elif format.lower() == 'pdf':
                return await self._generate_pdf(qr, output_path, size, fill_color, back_color)
            else:
                return await self._generate_image(
                    qr, output_path, format, size, fill_color, back_color, style, logo_path
                )

        except Exception as e:
            print(f"QR Code generation error: {str(e)}")
            return False

    def _normalize_color(self, color: str) -> str:
        """Normalize and validate color input"""
        color = color.strip().lower()

        # If it's a hex color, validate and normalize
        if color.startswith('#'):
            # Remove # and validate
            hex_color = color[1:]

            # Handle 3-digit hex shorthand (#RGB -> #RRGGBB)
            if len(hex_color) == 3:
                hex_color = ''.join([c*2 for c in hex_color])

            # Validate hex color (must be 6 characters)
            if len(hex_color) != 6 or not all(c in '0123456789abcdef' for c in hex_color):
                print(f"[WARNING] Invalid hex color '{color}', using default")
                return 'black' if color.startswith('#') else 'white'

            return f'#{hex_color}'

        # For named colors, return as-is (Pillow supports CSS color names)
        return color

    async def _generate_image(
        self,
        qr,
        output_path: str,
        format: str,
        size: int,
        fill_color: str,
        back_color: str,
        style: str,
        logo_path: Optional[str] = None
    ) -> bool:
        """Generate PNG/JPG QR code with styling"""
        try:
            # Normalize colors
            fill_color = self._normalize_color(fill_color)
            back_color = self._normalize_color(back_color)

            print(f"Generating QR code with fill_color='{fill_color}', back_color='{back_color}'")
            # Check if advanced styling is available and requested
            if (style != 'square' and
                STYLED_PIL_AVAILABLE and
                MODULE_DRAWERS_AVAILABLE and
                style in self.supported_styles):

                # Use advanced styled image for rounded/circle styles
                module_drawer = self.supported_styles.get(style)

                if COLOR_FILLS_AVAILABLE:
                    # Use advanced color mask if available
                    img = qr.make_image(
                        image_factory=StyledPilImage,
                        module_drawer=module_drawer,
                        color_mask=SolidFillColorMask(
                            back_color=back_color,
                            front_color=fill_color
                        )
                    )
                else:
                    # Use styled image with basic colors
                    img = qr.make_image(
                        image_factory=StyledPilImage,
                        module_drawer=module_drawer,
                        fill_color=fill_color,
                        back_color=back_color
                    )
                print(f"[OK] Generated QR code with {style} style")
            else:
                # Use basic image generation (always available)
                if style != 'square' and not (STYLED_PIL_AVAILABLE and MODULE_DRAWERS_AVAILABLE):
                    print(f"[INFO] Style '{style}' not available, using basic square style")
                img = qr.make_image(fill_color=fill_color, back_color=back_color)

            # Resize to target size
            img = img.resize((size, size), Image.LANCZOS)

            # Add logo if provided
            if logo_path and os.path.exists(logo_path):
                img = await self._add_logo(img, logo_path)

            # Convert to RGB for JPEG
            if format.lower() in ['jpg', 'jpeg']:
                if img.mode in ("RGBA", "P"):
                    # Create white background
                    background = Image.new('RGB', img.size, back_color)
                    if img.mode == "P":
                        img = img.convert("RGBA")
                    background.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
                    img = background

            # Save image
            img.save(output_path, format=format.upper(), quality=95, optimize=True)
            return True

        except Exception as e:
            print(f"Image generation error: {str(e)}")
            return False

    async def _generate_svg(self, qr, output_path: str, fill_color: str, back_color: str) -> bool:
        """Generate SVG QR code"""
        try:
            factory = qrcode.image.svg.SvgPathImage
            img = qr.make_image(image_factory=factory, fill_color=fill_color, back_color=back_color)

            with open(output_path, 'wb') as f:
                img.save(f)
            return True

        except Exception as e:
            print(f"SVG generation error: {str(e)}")
            return False

    async def _generate_pdf(self, qr, output_path: str, size: int, fill_color: str, back_color: str) -> bool:
        """Generate PDF QR code"""
        try:
            # Generate as PNG first
            img = qr.make_image(fill_color=fill_color, back_color=back_color)
            img = img.resize((size, size), Image.LANCZOS)

            # Convert to PDF
            if img.mode in ("RGBA", "P"):
                background = Image.new('RGB', img.size, back_color)
                if img.mode == "P":
                    img = img.convert("RGBA")
                background.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
                img = background

            img.save(output_path, format='PDF', quality=95)
            return True

        except Exception as e:
            print(f"PDF generation error: {str(e)}")
            return False

    async def _add_logo(self, qr_img: Image.Image, logo_path: str) -> Image.Image:
        """Add logo to center of QR code"""
        try:
            logo = Image.open(logo_path)

            # Calculate logo size (10% of QR code)
            qr_width, qr_height = qr_img.size
            logo_size = min(qr_width, qr_height) // 10

            # Resize logo
            logo = logo.resize((logo_size, logo_size), Image.LANCZOS)

            # Create mask for circular logo
            mask = Image.new('L', (logo_size, logo_size), 0)
            draw = ImageDraw.Draw(mask)
            draw.ellipse((0, 0, logo_size, logo_size), fill=255)

            # Apply mask if logo has transparency
            if logo.mode in ("RGBA", "LA"):
                logo_alpha = logo.split()[-1]
                mask = Image.composite(mask, Image.new('L', mask.size, 0), logo_alpha)

            # Paste logo in center
            logo_pos = (
                (qr_width - logo_size) // 2,
                (qr_height - logo_size) // 2
            )
            qr_img.paste(logo, logo_pos, mask)

            return qr_img

        except Exception as e:
            print(f"Logo addition error: {str(e)}")
            return qr_img


# Global instance
qr_generator = QRCodeGenerator()


async def generate_qr_code(
    text: str,
    output_path: str,
    format: str = 'png',
    size: int = 300,
    border: int = 4,
    error_correction: str = 'M',
    fill_color: str = 'black',
    back_color: str = 'white',
    style: str = 'square',
    logo_path: Optional[str] = None
) -> bool:
    """
    Main function to generate QR codes

    Args:
        text: Text or URL to encode
        output_path: Output file path
        format: Output format (png, jpg, svg, pdf)
        size: QR code size in pixels (default: 300)
        border: Border size in modules (default: 4)
        error_correction: Error correction level L/M/Q/H (default: M)
        fill_color: QR code color (default: black)
        back_color: Background color (default: white)
        style: Module style square/rounded/circle (default: square)
        logo_path: Optional logo file path

    Returns:
        bool: Success status
    """
    return await qr_generator.generate_qr_code(
        text=text,
        output_path=output_path,
        format=format,
        size=size,
        border=border,
        error_correction=error_correction,
        fill_color=fill_color,
        back_color=back_color,
        style=style,
        logo_path=logo_path
    )


def get_supported_formats() -> list:
    """Get list of supported output formats"""
    return qr_generator.supported_formats


def get_supported_error_corrections() -> dict:
    """Get supported error correction levels"""
    return list(qr_generator.supported_error_corrections.keys())


def get_supported_styles() -> list:
    """Get supported QR code styles"""
    return list(qr_generator.supported_styles.keys())


# Validation functions
def validate_qr_text(text: str) -> tuple[bool, str]:
    """Validate QR code text input"""
    if not text or not text.strip():
        return False, "Text cannot be empty"

    if len(text) > 4296:  # QR code limit for alphanumeric
        return False, "Text too long (max 4296 characters)"

    return True, ""


def validate_qr_params(params: Dict[str, Any]) -> tuple[bool, str]:
    """Validate QR code generation parameters"""
    # Validate format
    format = params.get('format', 'png').lower()
    if format not in qr_generator.supported_formats:
        return False, f"Unsupported format: {format}"

    # Validate size
    size = params.get('size', 300)
    if not isinstance(size, int) or size < 50 or size > 2000:
        return False, "Size must be between 50 and 2000 pixels"

    # Validate border
    border = params.get('border', 4)
    if not isinstance(border, int) or border < 0 or border > 20:
        return False, "Border must be between 0 and 20 modules"

    # Validate error correction
    error_correction = params.get('error_correction', 'M')
    if error_correction not in qr_generator.supported_error_corrections:
        return False, f"Invalid error correction level: {error_correction}"

    # Validate style
    style = params.get('style', 'square')
    if style not in qr_generator.supported_styles:
        available_styles = list(qr_generator.supported_styles.keys())
        return False, f"Invalid style: {style}. Available styles: {available_styles}"

    return True, ""