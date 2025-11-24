# converters/font_converter.py - Font Format Converter
import os
import shutil
import tempfile
import subprocess
from typing import Optional, Dict, Any, List
import asyncio
import logging

logger = logging.getLogger(__name__)

# Check for fonttools availability
try:
    from fontTools.ttLib import TTFont
    from fontTools.misc.transform import Transform
    FONTTOOLS_AVAILABLE = True
except ImportError:
    FONTTOOLS_AVAILABLE = False
    logger.warning("fontTools not available - font conversion will be limited")

# Check for woff2 tools
try:
    # Check if woff2_compress and woff2_decompress are available
    result = subprocess.run(['woff2_compress', '--help'],
                          capture_output=True, text=True, timeout=5)
    WOFF2_TOOLS_AVAILABLE = True
except (subprocess.TimeoutExpired, subprocess.CalledProcessError, FileNotFoundError):
    WOFF2_TOOLS_AVAILABLE = False
    logger.warning("woff2 tools not available - WOFF2 conversion will be limited")

# Supported font formats
SUPPORTED_FONT_FORMATS = {
    'input': ['ttf', 'otf', 'woff', 'woff2', 'eot', 'svg', 'ps1'],
    'output': ['ttf', 'otf', 'woff', 'woff2']  # EOT and SVG conversion not supported
}


class FontConverter:
    """Font format converter using fontTools and system utilities"""

    def __init__(self):
        self.temp_files = []

    def cleanup(self):
        """Clean up temporary files"""
        for temp_file in self.temp_files:
            try:
                if os.path.exists(temp_file):
                    os.unlink(temp_file)
            except:
                pass
        self.temp_files = []

    def __del__(self):
        self.cleanup()

    async def convert_font(self, input_path: str, output_path: str,
                          target_format: str) -> Dict[str, Any]:
        """
        Convert font from one format to another

        Args:
            input_path: Path to input font file
            output_path: Path to output font file
            target_format: Target format (ttf, otf, woff, woff2, eot, svg)

        Returns:
            Dict with conversion results
        """
        try:
            input_format = self._detect_format(input_path)
            if not input_format:
                return {
                    'success': False,
                    'error': 'Could not detect input font format'
                }

            logger.info(f"Converting font from {input_format} to {target_format}")

            # Check if conversion is supported
            if input_format not in SUPPORTED_FONT_FORMATS['input']:
                return {
                    'success': False,
                    'error': f'Input format {input_format} not supported'
                }

            if target_format not in SUPPORTED_FONT_FORMATS['output']:
                return {
                    'success': False,
                    'error': f'Output format {target_format} not supported'
                }

            # If same format, just copy
            if input_format == target_format:
                shutil.copy2(input_path, output_path)
                return {
                    'success': True,
                    'input_format': input_format,
                    'output_format': target_format,
                    'conversion_method': 'copy'
                }

            # Perform conversion based on target format
            if target_format == 'woff2':
                return await self._convert_to_woff2(input_path, output_path, input_format)
            elif target_format == 'woff':
                return await self._convert_to_woff(input_path, output_path, input_format)
            elif target_format in ['ttf', 'otf']:
                return await self._convert_to_ttf_otf(input_path, output_path, target_format, input_format)
            elif target_format == 'eot':
                return await self._convert_to_eot(input_path, output_path, input_format)
            elif target_format == 'svg':
                return await self._convert_to_svg(input_path, output_path, input_format)
            else:
                return {
                    'success': False,
                    'error': f'Conversion to {target_format} not implemented'
                }

        except Exception as e:
            logger.error(f"Font conversion error: {str(e)}")
            return {
                'success': False,
                'error': f'Conversion failed: {str(e)}'
            }

    def _detect_format(self, file_path: str) -> Optional[str]:
        """Detect font format from file extension and content"""
        try:
            # Check file extension
            ext = os.path.splitext(file_path)[1].lower()
            if ext in ['.ttf']:
                return 'ttf'
            elif ext in ['.otf']:
                return 'otf'
            elif ext in ['.woff']:
                return 'woff'
            elif ext in ['.woff2']:
                return 'woff2'
            elif ext in ['.eot']:
                return 'eot'
            elif ext in ['.svg']:
                return 'svg'
            elif ext in ['.ps1', '.ps', '.pfa', '.pfb']:
                return 'ps1'

            # Try to detect from file content
            with open(file_path, 'rb') as f:
                header = f.read(12)

                # TTF/OTF detection
                if header[:4] in [b'\x00\x01\x00\x00', b'OTTO', b'true', b'typ1']:
                    if header[:4] == b'OTTO':
                        return 'otf'
                    else:
                        return 'ttf'

                # WOFF detection
                if header[:4] == b'wOFF':
                    return 'woff'

                # WOFF2 detection
                if header[:4] == b'wOF2':
                    return 'woff2'

            return None
        except:
            return None

    async def _convert_to_woff2(self, input_path: str, output_path: str,
                               input_format: str) -> Dict[str, Any]:
        """Convert font to WOFF2 format using fontTools"""
        try:
            if not FONTTOOLS_AVAILABLE:
                return {
                    'success': False,
                    'error': 'fontTools not available for WOFF2 conversion'
                }

            # Try using fontTools with brotli (pure Python solution)
            try:
                # Load font
                font = TTFont(input_path)

                # Save as WOFF2 (fontTools handles compression with brotli)
                font.flavor = 'woff2'
                font.save(output_path)

                return {
                    'success': True,
                    'input_format': input_format,
                    'output_format': 'woff2',
                    'conversion_method': 'fonttools_brotli'
                }

            except Exception as fonttools_error:
                logger.warning(f"fontTools WOFF2 conversion failed: {fonttools_error}")

                # Fallback: Try system woff2_compress if available
                if WOFF2_TOOLS_AVAILABLE:
                    # For WOFF2, we need TTF/OTF as intermediate
                    if input_format in ['woff', 'woff2']:
                        # First decompress to TTF
                        temp_ttf = tempfile.mktemp(suffix='.ttf')
                        self.temp_files.append(temp_ttf)

                        if input_format == 'woff2':
                            # Decompress WOFF2 to TTF
                            result = subprocess.run([
                                'woff2_decompress', input_path, temp_ttf
                            ], capture_output=True, text=True, timeout=30)

                            if result.returncode != 0:
                                return {
                                    'success': False,
                                    'error': f'WOFF2 decompression failed: {result.stderr}'
                                }

                            input_path = temp_ttf

                    # Convert to WOFF2
                    result = subprocess.run([
                        'woff2_compress', input_path, output_path
                    ], capture_output=True, text=True, timeout=30)

                    if result.returncode != 0:
                        return {
                            'success': False,
                            'error': f'WOFF2 compression failed: {result.stderr}'
                        }

                    return {
                        'success': True,
                        'input_format': input_format,
                        'output_format': 'woff2',
                        'conversion_method': 'woff2_compress'
                    }
                else:
                    return {
                        'success': False,
                        'error': f'WOFF2 conversion requires brotli library. Install with: pip install brotli'
                    }

        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'error': 'WOFF2 conversion timed out'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'WOFF2 conversion error: {str(e)}'
            }

    async def _convert_to_woff(self, input_path: str, output_path: str,
                             input_format: str) -> Dict[str, Any]:
        """Convert font to WOFF format using fontTools"""
        try:
            if not FONTTOOLS_AVAILABLE:
                return {
                    'success': False,
                    'error': 'fontTools not available for WOFF conversion'
                }

            # Load font
            font = TTFont(input_path)

            # Set flavor to WOFF and save
            font.flavor = 'woff'
            font.save(output_path)

            return {
                'success': True,
                'input_format': input_format,
                'output_format': 'woff',
                'conversion_method': 'fonttools'
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'WOFF conversion error: {str(e)}'
            }

    async def _convert_to_ttf_otf(self, input_path: str, output_path: str,
                                 target_format: str, input_format: str) -> Dict[str, Any]:
        """Convert font to TTF or OTF format"""
        try:
            if not FONTTOOLS_AVAILABLE:
                return {
                    'success': False,
                    'error': 'fontTools not available'
                }

            # Handle WOFF2 decompression first if needed
            if input_format == 'woff2' and WOFF2_TOOLS_AVAILABLE:
                temp_ttf = tempfile.mktemp(suffix='.ttf')
                self.temp_files.append(temp_ttf)

                result = subprocess.run([
                    'woff2_decompress', input_path, temp_ttf
                ], capture_output=True, text=True, timeout=30)

                if result.returncode == 0:
                    input_path = temp_ttf

            # Load font
            font = TTFont(input_path)

            # Remove flavor to save as uncompressed TTF/OTF
            font.flavor = None

            # Save in target format
            font.save(output_path)

            return {
                'success': True,
                'input_format': input_format,
                'output_format': target_format,
                'conversion_method': 'fonttools'
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'{target_format.upper()} conversion error: {str(e)}'
            }

    async def _convert_to_eot(self, input_path: str, output_path: str,
                            input_format: str) -> Dict[str, Any]:
        """Convert font to EOT format (limited support)"""
        return {
            'success': False,
            'error': 'EOT conversion not implemented - legacy format not recommended'
        }

    async def _convert_to_svg(self, input_path: str, output_path: str,
                            input_format: str) -> Dict[str, Any]:
        """Convert font to SVG format (limited support)"""
        return {
            'success': False,
            'error': 'SVG font conversion not implemented - use SVG icons instead'
        }


# Global converter instance
font_converter = FontConverter()


async def convert_font(input_path: str, output_path: str,
                      target_format: str) -> Dict[str, Any]:
    """
    Main font conversion function

    Args:
        input_path: Path to input font file
        output_path: Path to output font file
        target_format: Target format

    Returns:
        Dict with conversion results
    """
    return await font_converter.convert_font(input_path, output_path, target_format)


def get_supported_formats() -> Dict[str, List[str]]:
    """Get supported font formats"""
    return SUPPORTED_FONT_FORMATS


def get_font_info(file_path: str) -> Dict[str, Any]:
    """Get information about a font file"""
    try:
        if not FONTTOOLS_AVAILABLE:
            return {'error': 'fontTools not available'}

        font = TTFont(file_path)

        # Extract basic info
        info = {
            'format': font_converter._detect_format(file_path),
            'num_glyphs': font.getGlyphSet().keys().__len__(),
            'units_per_em': getattr(font['head'], 'unitsPerEm', None),
        }

        # Try to get name info
        if 'name' in font:
            name_table = font['name']
            for record in name_table.names:
                if record.nameID == 1:  # Font family name
                    info['family_name'] = str(record)
                    break

        return info

    except Exception as e:
        return {'error': str(e)}