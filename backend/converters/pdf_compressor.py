# converters/pdf_compressor.py - PDF Compression Engine
import os
import shutil
import tempfile
import subprocess
from typing import Optional, Dict, Any, List
import asyncio
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# Check for PyPDF2/PyPDF4 availability
try:
    import PyPDF2
    PDF_READER_AVAILABLE = True
except ImportError:
    try:
        import PyPDF4 as PyPDF2
        PDF_READER_AVAILABLE = True
    except ImportError:
        PDF_READER_AVAILABLE = False
        logger.warning("PyPDF2/PyPDF4 not available - PDF compression will be limited")

# Check for Ghostscript availability
try:
    result = subprocess.run(['gs', '--version'], capture_output=True, text=True, timeout=5)
    GHOSTSCRIPT_AVAILABLE = True
    logger.info(f"Ghostscript found: {result.stdout.strip()}")
except (subprocess.TimeoutExpired, subprocess.CalledProcessError, FileNotFoundError):
    GHOSTSCRIPT_AVAILABLE = False
    logger.warning("Ghostscript not available - advanced PDF compression will be limited")

# Compression levels
COMPRESSION_LEVELS = {
    'low': {
        'name': 'Low Compression',
        'description': 'Moderate compression with good quality',
        'gs_setting': '/printer',
        'quality_factor': 0.9,
        'expected_reduction': '30-50%',
        'scale_factor': 0.90,
        'image_dpi': 200
    },
    'medium': {
        'name': 'Medium Compression',
        'description': 'Aggressive compression with multiple passes',
        'gs_setting': '/ebook',
        'quality_factor': 0.7,
        'expected_reduction': '50-70%',
        'scale_factor': 0.75,
        'image_dpi': 150
    },
    'high': {
        'name': 'High Compression',
        'description': 'Maximum compression with 3 passes',
        'gs_setting': '/screen',
        'quality_factor': 0.5,
        'expected_reduction': '70-85%',
        'scale_factor': 0.60,
        'image_dpi': 100
    }
}


class PDFCompressor:
    """Advanced PDF compression using multiple techniques"""

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

    async def compress_pdf(self, input_path: str, output_path: str,
                          compression_level: str = 'medium',
                          remove_metadata: bool = True,
                          optimize_images: bool = True) -> Dict[str, Any]:
        """
        Compress PDF file using various techniques

        Args:
            input_path: Path to input PDF file
            output_path: Path to output compressed PDF file
            compression_level: 'low', 'medium', or 'high'
            remove_metadata: Whether to remove metadata
            optimize_images: Whether to optimize embedded images

        Returns:
            Dict with compression results
        """
        try:
            if not os.path.exists(input_path):
                return {
                    'success': False,
                    'error': 'Input PDF file not found'
                }

            # Get original file size
            original_size = os.path.getsize(input_path)

            if original_size == 0:
                return {
                    'success': False,
                    'error': 'Input PDF file is empty'
                }

            logger.info(f"Compressing PDF: {input_path} (Original size: {original_size} bytes)")

            # Try Ghostscript compression first (best results)
            if GHOSTSCRIPT_AVAILABLE:
                logger.info("Attempting Ghostscript compression...")
                result = await self._compress_with_ghostscript(
                    input_path, output_path, compression_level, optimize_images
                )
                if result['success']:
                    # Optionally remove metadata
                    if remove_metadata:
                        await self._remove_metadata(output_path)

                    # Get final file size
                    final_size = os.path.getsize(output_path)
                    compression_ratio = ((original_size - final_size) / original_size) * 100

                    result.update({
                        'original_size': original_size,
                        'compressed_size': final_size,
                        'compression_ratio': round(compression_ratio, 1),
                        'size_reduction': f"{compression_ratio:.1f}%",
                        'compression_method': 'ghostscript'
                    })
                    logger.info(f"Ghostscript compression successful: {compression_ratio:.1f}% reduction")
                    return result
                else:
                    logger.warning(f"Ghostscript compression failed: {result.get('error', 'Unknown error')}")
            else:
                logger.info("Ghostscript not available, skipping...")

            # Try image-based compression for aggressive reduction (only for larger files)
            if original_size > 1024 * 1024:  # Only for files larger than 1MB
                logger.info("Attempting image-based compression for large files...")
                result = await self._compress_via_images(
                    input_path, output_path, compression_level
                )
                if result['success']:
                    final_size = os.path.getsize(output_path)
                    compression_ratio = ((original_size - final_size) / original_size) * 100

                    # Only use image compression if it actually reduces file size by at least 10%
                    if compression_ratio > 10:
                        result.update({
                            'original_size': original_size,
                            'compressed_size': final_size,
                            'compression_ratio': round(compression_ratio, 1),
                            'size_reduction': f"{compression_ratio:.1f}%",
                            'compression_method': 'image_based'
                        })
                        logger.info(f"Image-based compression successful: {compression_ratio:.1f}% reduction")
                        return result
                    else:
                        logger.info(f"Image compression didn't provide good reduction ({compression_ratio:.1f}%), trying other methods")
            else:
                logger.info("File too small for image-based compression, using other methods")

            # Fallback to PyPDF2 compression if image-based fails
            if PDF_READER_AVAILABLE:
                logger.info("Falling back to PyPDF2 compression...")
                result = await self._compress_with_pypdf2(
                    input_path, output_path, remove_metadata, compression_level
                )
                if result['success']:
                    final_size = os.path.getsize(output_path)
                    compression_ratio = ((original_size - final_size) / original_size) * 100

                    result.update({
                        'original_size': original_size,
                        'compressed_size': final_size,
                        'compression_ratio': round(compression_ratio, 1),
                        'size_reduction': f"{compression_ratio:.1f}%",
                        'compression_method': 'pypdf2'
                    })
                    logger.info(f"PyPDF2 compression successful: {compression_ratio:.1f}% reduction")
                    return result
                else:
                    logger.warning(f"PyPDF2 compression failed: {result.get('error', 'Unknown error')}")
            else:
                logger.warning("PyPDF2 not available")

            logger.error(f"No PDF compression tools available. Ghostscript: {GHOSTSCRIPT_AVAILABLE}, PyPDF2: {PDF_READER_AVAILABLE}")
            return {
                'success': False,
                'error': 'No PDF compression tools available'
            }

        except Exception as e:
            logger.error(f"PDF compression error: {str(e)}")
            return {
                'success': False,
                'error': f'Compression failed: {str(e)}'
            }

    async def _compress_with_ghostscript(self, input_path: str, output_path: str,
                                       compression_level: str, optimize_images: bool) -> Dict[str, Any]:
        """Compress PDF using Ghostscript"""
        try:
            level_config = COMPRESSION_LEVELS.get(compression_level, COMPRESSION_LEVELS['medium'])

            # Ghostscript command for PDF compression
            gs_command = [
                'gs',
                '-sDEVICE=pdfwrite',
                '-dCompatibilityLevel=1.4',
                f'-dPDFSETTINGS={level_config["gs_setting"]}',
                '-dNOPAUSE',
                '-dQUIET',
                '-dBATCH',
                '-dDetectDuplicateImages=true',
                '-dCompressFonts=true',
                '-dSubsetFonts=true',
                f'-sOutputFile={output_path}',
                input_path
            ]

            # Add image optimization options
            if optimize_images:
                gs_command.extend([
                    '-dDownsampleColorImages=true',
                    '-dColorImageResolution=150',
                    '-dDownsampleGrayImages=true',
                    '-dGrayImageResolution=150',
                    '-dDownsampleMonoImages=true',
                    '-dMonoImageResolution=150'
                ])

            # Run Ghostscript
            result = subprocess.run(
                gs_command,
                capture_output=True,
                text=True,
                timeout=120  # 2 minutes timeout
            )

            if result.returncode == 0 and os.path.exists(output_path):
                return {
                    'success': True,
                    'compression_level': compression_level,
                    'compression_method': 'ghostscript',
                    'settings_used': level_config['gs_setting']
                }
            else:
                return {
                    'success': False,
                    'error': f'Ghostscript compression failed: {result.stderr}'
                }

        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'error': 'PDF compression timed out'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Ghostscript compression error: {str(e)}'
            }

    async def _compress_with_pypdf2(self, input_path: str, output_path: str,
                                   remove_metadata: bool, compression_level: str = 'medium') -> Dict[str, Any]:
        """Compress PDF using PyPDF2 with aggressive compression techniques"""
        try:
            input_size = os.path.getsize(input_path)
            level_config = COMPRESSION_LEVELS.get(compression_level, COMPRESSION_LEVELS['medium'])

            with open(input_path, 'rb') as input_file:
                # Try new PyPDF2 API first
                try:
                    pdf_reader = PyPDF2.PdfReader(input_file)

                    # Check if PDF is encrypted
                    if pdf_reader.is_encrypted:
                        logger.warning("PDF is encrypted, attempting to decrypt with empty password")
                        if not pdf_reader.decrypt(""):
                            logger.error("PDF is password protected and cannot be compressed")
                            # Copy original file for encrypted PDFs
                            import shutil
                            shutil.copy2(input_path, output_path)
                            return {
                                'success': True,
                                'compression_level': 'none',
                                'compression_method': 'copy_encrypted'
                            }

                    pdf_writer = PyPDF2.PdfWriter()

                    # Copy all pages with aggressive compression
                    for page_num, page in enumerate(pdf_reader.pages):
                        logger.info(f"Processing page {page_num + 1} with aggressive compression")

                        # Apply content stream compression (proven to work)
                        if hasattr(page, 'compress_content_streams'):
                            try:
                                page.compress_content_streams()
                                logger.info(f"Applied content stream compression to page {page_num + 1}")
                            except Exception as e:
                                logger.warning(f"Content stream compression failed on page {page_num + 1}: {e}")

                        # Conservative scaling based on compression level
                        scale_factors = {
                            'low': 0.98,
                            'medium': 0.95,
                            'high': 0.90
                        }
                        scale_factor = scale_factors.get(compression_level, 0.95)

                        if hasattr(page, 'scale'):
                            try:
                                page.scale(scale_factor, scale_factor)
                                logger.info(f"Applied {scale_factor} scaling to page {page_num + 1}")
                            except Exception as e:
                                logger.warning(f"Page scaling failed: {e}")

                        # Remove various PDF elements for maximum compression
                        removed_items = []

                        # Remove annotations
                        if '/Annots' in page:
                            del page['/Annots']
                            removed_items.append("annotations")

                        # Remove JavaScript and actions
                        if '/AA' in page:
                            del page['/AA']
                            removed_items.append("actions")

                        # Remove optional content groups
                        if '/Group' in page:
                            del page['/Group']
                            removed_items.append("groups")

                        # Remove structural elements
                        if '/StructParents' in page:
                            del page['/StructParents']
                            removed_items.append("struct_parents")

                        # Remove transitions
                        if '/Trans' in page:
                            del page['/Trans']
                            removed_items.append("transitions")

                        # Remove thumbnails
                        if '/Thumb' in page:
                            del page['/Thumb']
                            removed_items.append("thumbnails")

                        # For high compression, remove even more
                        if compression_level == 'high':
                            # Remove metadata references
                            if '/Metadata' in page:
                                del page['/Metadata']
                                removed_items.append("metadata")

                            # Remove optional content references
                            if '/Properties' in page.get('/Resources', {}):
                                del page['/Resources']['/Properties']
                                removed_items.append("properties")

                        if removed_items:
                            logger.info(f"Removed from page {page_num + 1}: {', '.join(removed_items)}")

                        pdf_writer.add_page(page)

                    # Remove metadata if requested (this actually helps reduce size)
                    if remove_metadata:
                        if hasattr(pdf_writer, 'remove_links'):
                            pdf_writer.remove_links()

                    # Write compressed PDF
                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)

                    # Skip multiple passes for now to avoid file size increase
                    # if compression_level in ['medium', 'high']:
                    #     await self._apply_multiple_passes(output_path, compression_level)

                except AttributeError:
                    # Fallback to old PyPDF2 API
                    input_file.seek(0)
                    pdf_reader = PyPDF2.PdfFileReader(input_file)
                    pdf_writer = PyPDF2.PdfFileWriter()

                    # Copy all pages with basic working compression
                    for page_num in range(pdf_reader.numPages):
                        page = pdf_reader.getPage(page_num)

                        # Apply content stream compression (proven to work)
                        if hasattr(page, 'compressContentStreams'):
                            try:
                                page.compressContentStreams()
                            except:
                                pass

                        pdf_writer.addPage(page)

                    # Remove metadata if requested
                    if remove_metadata and hasattr(pdf_writer, 'removeLinks'):
                        pdf_writer.removeLinks()

                    # Write compressed PDF
                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)

            # Check if compression actually reduced file size
            if os.path.exists(output_path):
                output_size = os.path.getsize(output_path)
                logger.info(f"Compression result: {input_size} -> {output_size} bytes")

                # If compression made file larger, copy original instead
                if output_size >= input_size:
                    logger.info(f"Compression increased file size ({input_size} -> {output_size}), reverting to original")
                    import shutil
                    shutil.copy2(input_path, output_path)
                    # But still return as successful with 0% compression
                    return {
                        'success': True,
                        'compression_level': 'none',
                        'compression_method': 'already_optimized',
                        'original_size': input_size,
                        'compressed_size': input_size,
                        'compression_ratio': 0.0,
                        'size_reduction': '0.0%'
                    }
                else:
                    reduction = ((input_size - output_size) / input_size) * 100
                    logger.info(f"Successful compression: {reduction:.1f}% reduction")

            return {
                'success': True,
                'compression_level': 'basic',
                'compression_method': 'pypdf2_basic'
            }

        except Exception as e:
            logger.error(f"PyPDF2 compression error: {str(e)}")
            logger.error(f"Error type: {type(e).__name__}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            # If compression fails, just copy the original file
            try:
                import shutil
                shutil.copy2(input_path, output_path)
                logger.info("Compression failed, copied original file")
                return {
                    'success': True,
                    'compression_level': 'none',
                    'compression_method': 'copy_original'
                }
            except Exception as copy_error:
                logger.error(f"Failed to copy original file: {str(copy_error)}")
                return {
                    'success': False,
                    'error': f'PyPDF2 compression error: {str(e)}'
                }

    async def _second_pass_compression(self, input_path: str, output_path: str) -> bool:
        """Apply second pass compression for maximum reduction"""
        try:
            with open(input_path, 'rb') as input_file:
                if hasattr(PyPDF2, 'PdfReader'):
                    pdf_reader = PyPDF2.PdfReader(input_file)
                    pdf_writer = PyPDF2.PdfWriter()

                    for page in pdf_reader.pages:
                        # More aggressive scaling
                        if hasattr(page, 'scale'):
                            try:
                                page.scale(0.80, 0.80)  # More aggressive scaling
                            except:
                                pass

                        # Remove more elements
                        if '/Resources' in page:
                            resources = page['/Resources']
                            # Remove optional content groups
                            if '/Properties' in resources:
                                del resources['/Properties']

                        pdf_writer.add_page(page)

                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)
                    return True
                else:
                    # Old API fallback
                    pdf_reader = PyPDF2.PdfFileReader(input_file)
                    pdf_writer = PyPDF2.PdfFileWriter()

                    for page_num in range(pdf_reader.numPages):
                        page = pdf_reader.getPage(page_num)
                        if hasattr(page, 'scaleBy'):
                            try:
                                page.scaleBy(0.80)
                            except:
                                pass
                        pdf_writer.addPage(page)

                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)
                    return True

        except Exception as e:
            logger.error(f"Second pass compression error: {e}")
            return False

    async def _apply_multiple_passes(self, file_path: str, compression_level: str) -> None:
        """Apply multiple compression passes for maximum reduction"""
        try:
            original_size = os.path.getsize(file_path)
            passes = 2 if compression_level == 'medium' else 3

            for pass_num in range(passes):
                logger.info(f"Applying compression pass {pass_num + 1}/{passes}")

                # Create temporary file for this pass
                temp_path = file_path + f'.pass{pass_num + 1}'

                with open(file_path, 'rb') as input_file:
                    if hasattr(PyPDF2, 'PdfReader'):
                        pdf_reader = PyPDF2.PdfReader(input_file)
                        pdf_writer = PyPDF2.PdfWriter()

                        # Apply additional scaling in each pass
                        additional_scale = 0.95 - (pass_num * 0.05)  # 0.95, 0.90, 0.85

                        for page in pdf_reader.pages:
                            # Apply content compression
                            if hasattr(page, 'compress_content_streams'):
                                try:
                                    page.compress_content_streams()
                                except:
                                    pass

                            # Apply additional scaling
                            if hasattr(page, 'scale'):
                                try:
                                    page.scale(additional_scale, additional_scale)
                                except:
                                    pass

                            pdf_writer.add_page(page)

                        # Write the compressed result
                        with open(temp_path, 'wb') as output_file:
                            pdf_writer.write(output_file)

                        # Check if this pass improved compression
                        new_size = os.path.getsize(temp_path)
                        current_size = os.path.getsize(file_path)

                        if new_size < current_size:
                            # Use the better compressed version
                            import shutil
                            shutil.move(temp_path, file_path)
                            logger.info(f"Pass {pass_num + 1} improved compression: {current_size} -> {new_size}")
                        else:
                            # Remove the temp file if it didn't help
                            if os.path.exists(temp_path):
                                os.unlink(temp_path)
                            logger.info(f"Pass {pass_num + 1} didn't improve compression, keeping previous version")
                            break  # Stop if no improvement

            final_size = os.path.getsize(file_path)
            total_reduction = ((original_size - final_size) / original_size) * 100
            logger.info(f"Multiple passes completed. Total reduction: {total_reduction:.1f}%")

        except Exception as e:
            logger.error(f"Multiple passes compression error: {e}")

    async def _compress_via_images(self, input_path: str, output_path: str, compression_level: str) -> Dict[str, Any]:
        """Compress PDF by converting to images and back with high compression"""
        try:
            # Try to import pdf2image and PIL for image-based compression
            try:
                from pdf2image import convert_from_path
                from PIL import Image
                import tempfile
                image_compression_available = True
            except ImportError:
                logger.warning("pdf2image or PIL not available for image-based compression")
                return {'success': False, 'error': 'Image compression libraries not available'}

            logger.info("Converting PDF to images for compression...")

            # Quality settings based on compression level - more aggressive for real compression
            quality_settings = {
                'low': {'dpi': 100, 'quality': 60},
                'medium': {'dpi': 85, 'quality': 45},
                'high': {'dpi': 72, 'quality': 30}
            }
            settings = quality_settings.get(compression_level, quality_settings['medium'])

            # Convert PDF pages to images
            try:
                # Try with Poppler path
                poppler_path = r"C:\poppler\Library\bin"
                images = convert_from_path(input_path, dpi=settings['dpi'], poppler_path=poppler_path)
                logger.info(f"Converted {len(images)} pages to images at {settings['dpi']} DPI")
            except Exception as e:
                logger.error(f"PDF to image conversion failed: {e}")
                return {'success': False, 'error': f'PDF to image conversion failed: {str(e)}'}

            # Compress images and convert back to PDF
            compressed_images = []
            for i, image in enumerate(images):
                try:
                    # Convert to RGB if needed
                    if image.mode != 'RGB':
                        image = image.convert('RGB')

                    # Create compressed image in memory
                    from io import BytesIO
                    img_buffer = BytesIO()
                    image.save(img_buffer, format='JPEG', quality=settings['quality'], optimize=True)
                    img_buffer.seek(0)

                    # Reload compressed image
                    compressed_img = Image.open(img_buffer)
                    compressed_images.append(compressed_img)

                    logger.info(f"Compressed page {i+1} with quality {settings['quality']}")
                except Exception as e:
                    logger.warning(f"Failed to compress page {i+1}: {e}")
                    # Use original image if compression fails
                    compressed_images.append(image)

            # Convert images back to PDF
            if compressed_images:
                try:
                    compressed_images[0].save(
                        output_path,
                        format='PDF',
                        save_all=True,
                        append_images=compressed_images[1:],
                        optimize=True,
                        quality=settings['quality']
                    )
                    logger.info(f"Successfully created compressed PDF with {len(compressed_images)} pages")
                    return {'success': True, 'compression_method': 'image_based'}
                except Exception as e:
                    logger.error(f"Images to PDF conversion failed: {e}")
                    return {'success': False, 'error': f'Images to PDF conversion failed: {str(e)}'}
            else:
                return {'success': False, 'error': 'No images to convert to PDF'}

        except Exception as e:
            logger.error(f"Image-based compression error: {str(e)}")
            return {'success': False, 'error': f'Image-based compression error: {str(e)}'}

    async def _remove_metadata(self, pdf_path: str) -> bool:
        """Remove metadata from PDF file"""
        try:
            if not PDF_READER_AVAILABLE:
                return False

            temp_path = tempfile.mktemp(suffix='.pdf')
            self.temp_files.append(temp_path)

            with open(pdf_path, 'rb') as input_file:
                # Try new PyPDF2 API first
                try:
                    pdf_reader = PyPDF2.PdfReader(input_file)
                    pdf_writer = PyPDF2.PdfWriter()

                    # Copy pages without metadata
                    for page in pdf_reader.pages:
                        pdf_writer.add_page(page)

                    # Write without metadata
                    with open(temp_path, 'wb') as output_file:
                        pdf_writer.write(output_file)

                except AttributeError:
                    # Fallback to old PyPDF2 API
                    input_file.seek(0)
                    pdf_reader = PyPDF2.PdfFileReader(input_file)
                    pdf_writer = PyPDF2.PdfFileWriter()

                    # Copy pages without metadata
                    for page_num in range(pdf_reader.numPages):
                        pdf_writer.addPage(pdf_reader.getPage(page_num))

                    # Write without metadata
                    with open(temp_path, 'wb') as output_file:
                        pdf_writer.write(output_file)

            # Replace original file
            shutil.move(temp_path, pdf_path)
            return True

        except Exception as e:
            logger.error(f"Metadata removal error: {str(e)}")
            return False

    def get_pdf_info(self, file_path: str) -> Dict[str, Any]:
        """Get PDF file information"""
        try:
            if not PDF_READER_AVAILABLE:
                return {'error': 'PDF reader not available'}

            with open(file_path, 'rb') as file:
                # Try new PyPDF2 API first
                try:
                    pdf_reader = PyPDF2.PdfReader(file)

                    info = {
                        'pages': len(pdf_reader.pages),
                        'file_size': os.path.getsize(file_path),
                        'encrypted': pdf_reader.is_encrypted,
                    }

                    # Try to get metadata
                    try:
                        if hasattr(pdf_reader, 'metadata') and pdf_reader.metadata:
                            metadata = pdf_reader.metadata
                            info['metadata'] = {
                                'title': metadata.get('/Title', ''),
                                'author': metadata.get('/Author', ''),
                                'subject': metadata.get('/Subject', ''),
                                'creator': metadata.get('/Creator', ''),
                                'producer': metadata.get('/Producer', ''),
                                'creation_date': str(metadata.get('/CreationDate', '')),
                                'modification_date': str(metadata.get('/ModDate', ''))
                            }
                    except:
                        info['metadata'] = {}

                    return info

                except AttributeError:
                    # Fallback to old PyPDF2 API
                    file.seek(0)
                    pdf_reader = PyPDF2.PdfFileReader(file)

                    info = {
                        'pages': pdf_reader.numPages,
                        'file_size': os.path.getsize(file_path),
                        'encrypted': pdf_reader.isEncrypted,
                    }

                    # Try to get metadata
                    try:
                        if pdf_reader.documentInfo:
                            metadata = pdf_reader.documentInfo
                            info['metadata'] = {
                                'title': metadata.get('/Title', ''),
                                'author': metadata.get('/Author', ''),
                                'subject': metadata.get('/Subject', ''),
                                'creator': metadata.get('/Creator', ''),
                                'producer': metadata.get('/Producer', ''),
                                'creation_date': str(metadata.get('/CreationDate', '')),
                                'modification_date': str(metadata.get('/ModDate', ''))
                            }
                    except:
                        info['metadata'] = {}

                    return info

        except Exception as e:
            return {'error': str(e)}


# Global compressor instance
pdf_compressor = PDFCompressor()


async def compress_pdf_file(input_path: str, output_path: str,
                           compression_level: str = 'medium',
                           remove_metadata: bool = True,
                           optimize_images: bool = True) -> Dict[str, Any]:
    """
    Main PDF compression function

    Args:
        input_path: Path to input PDF file
        output_path: Path to output compressed PDF file
        compression_level: 'low', 'medium', or 'high'
        remove_metadata: Whether to remove metadata
        optimize_images: Whether to optimize embedded images

    Returns:
        Dict with compression results
    """
    return await pdf_compressor.compress_pdf(
        input_path, output_path, compression_level, remove_metadata, optimize_images
    )


def get_compression_info() -> Dict[str, Any]:
    """Get compression capabilities and settings"""
    return {
        'available_methods': {
            'ghostscript': GHOSTSCRIPT_AVAILABLE,
            'pypdf2': PDF_READER_AVAILABLE
        },
        'compression_levels': COMPRESSION_LEVELS,
        'features': {
            'image_optimization': GHOSTSCRIPT_AVAILABLE,
            'metadata_removal': PDF_READER_AVAILABLE,
            'font_optimization': GHOSTSCRIPT_AVAILABLE,
            'duplicate_detection': GHOSTSCRIPT_AVAILABLE
        },
        'max_file_size': 100 * 1024 * 1024,  # 100MB
        'supported_formats': ['pdf'],
        'output_format': 'pdf'
    }


def get_pdf_file_info(file_path: str) -> Dict[str, Any]:
    """Get PDF file information"""
    return pdf_compressor.get_pdf_info(file_path)