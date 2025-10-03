import asyncio
import os
from PIL import Image, ImageOps
import io
from typing import Optional, Dict, Any, Tuple

class ImageCompressor:
    """Advanced image compression with quality control and format conversion"""

    def __init__(self):
        self.supported_input_formats = ['jpeg', 'jpg', 'png', 'webp', 'bmp', 'tiff', 'gif']
        self.supported_output_formats = ['jpeg', 'png', 'webp']

        # Quality settings for different formats
        self.quality_settings = {
            'jpeg': {'min': 10, 'max': 100, 'default': 80},
            'png': {'min': 1, 'max': 9, 'default': 6},  # PNG compression level
            'webp': {'min': 10, 'max': 100, 'default': 80}
        }

    async def compress_image(
        self,
        input_path: str,
        output_path: str,
        quality: int = 80,
        format: str = 'jpeg',
        width: Optional[int] = None,
        height: Optional[int] = None,
        maintain_aspect_ratio: bool = True,
        optimize: bool = True,
        progressive: bool = True
    ) -> Dict[str, Any]:
        """
        Compress and optionally resize an image

        Args:
            input_path: Path to input image
            output_path: Path for output image
            quality: Compression quality (10-100 for JPEG/WebP, 1-9 for PNG)
            format: Output format (jpeg, png, webp)
            width: Target width (optional)
            height: Target height (optional)
            maintain_aspect_ratio: Whether to maintain aspect ratio
            optimize: Enable optimization
            progressive: Enable progressive encoding (JPEG)

        Returns:
            Dict with compression results
        """
        try:
            # Open and process image
            with Image.open(input_path) as img:
                # Get original info
                original_size = os.path.getsize(input_path)
                original_width, original_height = img.size
                original_format = img.format or 'UNKNOWN'

                # Handle EXIF orientation
                img = ImageOps.exif_transpose(img)

                # Convert mode if necessary
                processed_img = await self._prepare_image_for_format(img, format)

                # Resize if dimensions specified
                if width or height:
                    processed_img = await self._resize_image(
                        processed_img, width, height, maintain_aspect_ratio
                    )

                # Validate and adjust quality
                quality = self._validate_quality(quality, format)

                # Save with compression
                await self._save_compressed_image(
                    processed_img, output_path, format, quality, optimize, progressive
                )

                # Get compressed file info
                compressed_size = os.path.getsize(output_path)
                final_width, final_height = processed_img.size

                # Calculate compression ratio
                compression_ratio = ((original_size - compressed_size) / original_size) * 100

                return {
                    'success': True,
                    'original_size': original_size,
                    'compressed_size': compressed_size,
                    'compression_ratio': round(compression_ratio, 2),
                    'size_reduction': original_size - compressed_size,
                    'original_dimensions': {'width': original_width, 'height': original_height},
                    'final_dimensions': {'width': final_width, 'height': final_height},
                    'original_format': original_format,
                    'output_format': format.upper(),
                    'quality_used': quality,
                    'optimized': optimize,
                    'progressive': progressive if format == 'jpeg' else None
                }

        except Exception as e:
            print(f"Image compression error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    async def _prepare_image_for_format(self, img: Image.Image, format: str) -> Image.Image:
        """Prepare image for specific output format"""
        format = format.lower()

        if format == 'jpeg':
            # Convert to RGB for JPEG (no transparency)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                if img.mode in ('RGBA', 'LA'):
                    background.paste(img, mask=img.split()[-1])
                return background
            elif img.mode != 'RGB':
                return img.convert('RGB')

        elif format == 'png':
            # PNG supports transparency, convert to RGBA if needed
            if img.mode not in ('RGBA', 'RGB', 'L'):
                return img.convert('RGBA')

        elif format == 'webp':
            # WebP supports both RGB and RGBA
            if img.mode not in ('RGBA', 'RGB'):
                return img.convert('RGBA')

        return img

    async def _resize_image(
        self,
        img: Image.Image,
        width: Optional[int],
        height: Optional[int],
        maintain_aspect_ratio: bool
    ) -> Image.Image:
        """Resize image with optional aspect ratio maintenance"""
        original_width, original_height = img.size

        if maintain_aspect_ratio:
            # Calculate new dimensions maintaining aspect ratio
            if width and height:
                # Use the smaller ratio to fit within bounds
                width_ratio = width / original_width
                height_ratio = height / original_height
                ratio = min(width_ratio, height_ratio)
                new_width = int(original_width * ratio)
                new_height = int(original_height * ratio)
            elif width:
                ratio = width / original_width
                new_width = width
                new_height = int(original_height * ratio)
            elif height:
                ratio = height / original_height
                new_width = int(original_width * ratio)
                new_height = height
            else:
                return img
        else:
            # Use exact dimensions (may distort image)
            new_width = width or original_width
            new_height = height or original_height

        # Ensure minimum size
        new_width = max(1, new_width)
        new_height = max(1, new_height)

        return img.resize((new_width, new_height), Image.Resampling.LANCZOS)

    def _validate_quality(self, quality: int, format: str) -> int:
        """Validate and adjust quality value for format"""
        format = format.lower()
        settings = self.quality_settings.get(format, self.quality_settings['jpeg'])

        # Clamp quality to valid range
        quality = max(settings['min'], min(settings['max'], quality))

        return quality

    async def _save_compressed_image(
        self,
        img: Image.Image,
        output_path: str,
        format: str,
        quality: int,
        optimize: bool,
        progressive: bool
    ) -> None:
        """Save image with compression settings"""
        format = format.lower()
        save_kwargs = {}

        if format == 'jpeg':
            save_kwargs.update({
                'format': 'JPEG',
                'quality': quality,
                'optimize': optimize,
                'progressive': progressive
            })
        elif format == 'png':
            save_kwargs.update({
                'format': 'PNG',
                'compress_level': quality,  # PNG uses compress_level instead of quality
                'optimize': optimize
            })
        elif format == 'webp':
            save_kwargs.update({
                'format': 'WebP',
                'quality': quality,
                'optimize': optimize,
                'method': 6  # Best compression method
            })

        img.save(output_path, **save_kwargs)

    def get_image_info(self, image_path: str) -> Dict[str, Any]:
        """Get detailed information about an image file"""
        try:
            with Image.open(image_path) as img:
                file_size = os.path.getsize(image_path)

                return {
                    'width': img.width,
                    'height': img.height,
                    'format': img.format,
                    'mode': img.mode,
                    'file_size': file_size,
                    'has_transparency': img.mode in ('RGBA', 'LA') or 'transparency' in img.info,
                    'is_animated': getattr(img, 'is_animated', False)
                }
        except Exception as e:
            return {'error': str(e)}

    def estimate_compressed_size(
        self,
        original_size: int,
        quality: int,
        format: str,
        resize_factor: float = 1.0
    ) -> int:
        """Estimate compressed file size"""
        # Base compression ratios for different quality levels
        compression_ratios = {
            'jpeg': {
                10: 0.05, 20: 0.08, 30: 0.12, 40: 0.18, 50: 0.25,
                60: 0.35, 70: 0.45, 80: 0.60, 90: 0.80, 100: 1.0
            },
            'png': {
                1: 0.3, 2: 0.4, 3: 0.5, 4: 0.6, 5: 0.7,
                6: 0.8, 7: 0.85, 8: 0.9, 9: 0.95
            },
            'webp': {
                10: 0.04, 20: 0.07, 30: 0.10, 40: 0.15, 50: 0.22,
                60: 0.30, 70: 0.40, 80: 0.55, 90: 0.75, 100: 0.95
            }
        }

        format = format.lower()
        ratios = compression_ratios.get(format, compression_ratios['jpeg'])

        # Find closest quality level
        closest_quality = min(ratios.keys(), key=lambda x: abs(x - quality))
        compression_ratio = ratios[closest_quality]

        # Apply resize factor (affects file size quadratically)
        size_factor = resize_factor * resize_factor

        estimated_size = int(original_size * compression_ratio * size_factor)
        return max(1024, estimated_size)  # Minimum 1KB


# Global instance
image_compressor = ImageCompressor()


async def compress_image(
    input_path: str,
    output_path: str,
    quality: int = 80,
    format: str = 'jpeg',
    width: Optional[int] = None,
    height: Optional[int] = None,
    maintain_aspect_ratio: bool = True,
    optimize: bool = True,
    progressive: bool = True
) -> Dict[str, Any]:
    """
    Main function to compress images

    Args:
        input_path: Path to input image
        output_path: Path for output image
        quality: Compression quality (10-100 for JPEG/WebP, 1-9 for PNG)
        format: Output format (jpeg, png, webp)
        width: Target width (optional)
        height: Target height (optional)
        maintain_aspect_ratio: Whether to maintain aspect ratio
        optimize: Enable optimization
        progressive: Enable progressive encoding (JPEG)

    Returns:
        Dict with compression results
    """
    return await image_compressor.compress_image(
        input_path=input_path,
        output_path=output_path,
        quality=quality,
        format=format,
        width=width,
        height=height,
        maintain_aspect_ratio=maintain_aspect_ratio,
        optimize=optimize,
        progressive=progressive
    )


def get_supported_formats() -> Dict[str, list]:
    """Get supported input and output formats"""
    return {
        'input_formats': image_compressor.supported_input_formats,
        'output_formats': image_compressor.supported_output_formats
    }


def get_quality_info() -> Dict[str, Dict[str, int]]:
    """Get quality settings for different formats"""
    return image_compressor.quality_settings


def validate_compression_params(params: Dict[str, Any]) -> Tuple[bool, str]:
    """Validate image compression parameters"""

    # Validate format
    format = params.get('format', 'jpeg').lower()
    if format not in image_compressor.supported_output_formats:
        return False, f"Unsupported output format: {format}"

    # Validate quality
    quality = params.get('quality', 80)
    if not isinstance(quality, int):
        return False, "Quality must be an integer"

    quality_range = image_compressor.quality_settings.get(format, {'min': 10, 'max': 100})
    if quality < quality_range['min'] or quality > quality_range['max']:
        return False, f"Quality for {format} must be between {quality_range['min']} and {quality_range['max']}"

    # Validate dimensions
    width = params.get('width')
    height = params.get('height')

    if width is not None:
        if not isinstance(width, int) or width < 1 or width > 10000:
            return False, "Width must be between 1 and 10000 pixels"

    if height is not None:
        if not isinstance(height, int) or height < 1 or height > 10000:
            return False, "Height must be between 1 and 10000 pixels"

    return True, ""