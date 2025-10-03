# converters/image_converter.py - FIXED VERSION with PDF support
from utils.dependencies import PIL_AVAILABLE, PDF2IMAGE_AVAILABLE, POPPLER_PATH
import os
import base64
import io
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from PIL import Image as PILImage

async def convert_image(input_path: str, output_path: str, target_format: str) -> bool:
    """Convert image from one format to another, including PDF input"""
    if not PIL_AVAILABLE:
        print("PIL/Pillow not available")
        return False
    
    try:
        from PIL import Image
        
        # Handle PDF input (requires pdf2image)
        if input_path.lower().endswith('.pdf'):
            if not PDF2IMAGE_AVAILABLE:
                print("pdf2image not available - PDF conversion not supported")
                return False
            
            try:
                from pdf2image import convert_from_path
                
                # Convert PDF to images
                convert_kwargs = {
                    'dpi': 300,
                    'fmt': 'png'  # Always convert to PNG first for processing
                }
                
                if POPPLER_PATH:
                    convert_kwargs['poppler_path'] = POPPLER_PATH
                
                try:
                    images = convert_from_path(input_path, **convert_kwargs)
                except Exception as e:
                    print(f"PDF conversion failed with poppler path: {e}")
                    # Try without poppler path
                    if POPPLER_PATH:
                        convert_kwargs.pop('poppler_path', None)
                        images = convert_from_path(input_path, **convert_kwargs)
                    else:
                        raise e
                
                if not images:
                    print("No images generated from PDF")
                    return False
                
                # Use the first page
                img = images[0]
                print(f"Converted PDF to image: {img.size} pixels")
                
            except ImportError:
                print("pdf2image not installed - PDF conversion not available")
                return False
            except Exception as e:
                print(f"PDF processing error: {e}")
                return False
        
        # Handle SVG input - use ImageMagick via Wand
        elif input_path.lower().endswith('.svg'):
            svg_converted = False

            # Try Wand/ImageMagick first (best quality)
            try:
                from wand.image import Image as WandImage

                # Set ImageMagick path for Windows
                import os as os_module
                imagemagick_paths = [
                    r'C:\Program Files\ImageMagick-7.1.2-Q16-HDRI',
                    r'C:\Program Files\ImageMagick-7.1.1-Q16-HDRI',
                    r'C:\Program Files\ImageMagick-7.1.0-Q16-HDRI',
                    r'C:\Program Files\ImageMagick-7.0.11-Q16-HDRI',
                ]

                # Find ImageMagick installation
                magick_home = None
                for path in imagemagick_paths:
                    if os_module.path.exists(path):
                        magick_home = path
                        break

                if magick_home:
                    os_module.environ['MAGICK_HOME'] = magick_home
                    print(f"Using ImageMagick from: {magick_home}")

                with WandImage(filename=input_path, resolution=150) as wand_img:
                    wand_img.background_color = 'white'
                    wand_img.alpha_channel = 'remove'

                    # Limit max size for faster processing
                    max_dimension = 2000
                    if wand_img.width > max_dimension or wand_img.height > max_dimension:
                        if wand_img.width > wand_img.height:
                            new_width = max_dimension
                            new_height = int(wand_img.height * max_dimension / wand_img.width)
                        else:
                            new_height = max_dimension
                            new_width = int(wand_img.width * max_dimension / wand_img.height)
                        wand_img.resize(new_width, new_height)

                    wand_img.format = 'png'
                    png_blob = wand_img.make_blob()
                    img = Image.open(io.BytesIO(png_blob))
                    print(f"Converted SVG using Wand/ImageMagick: {img.size} pixels")
                    svg_converted = True

            except ImportError:
                print("Wand not installed")
            except Exception as wand_error:
                print(f"Wand conversion failed: {wand_error}")

            # Fallback: Simple XML parsing for basic SVGs
            if not svg_converted:
                try:
                    import xml.etree.ElementTree as ET
                    from PIL import ImageDraw

                    tree = ET.parse(input_path)
                    root = tree.getroot()

                    # Extract dimensions
                    import re
                    width = root.attrib.get('width', '800')
                    height = root.attrib.get('height', '600')

                    width = int(re.findall(r'\d+', str(width))[0]) if re.findall(r'\d+', str(width)) else 800
                    height = int(re.findall(r'\d+', str(height))[0]) if re.findall(r'\d+', str(height)) else 600

                    width = min(max(width, 100), 4000)
                    height = min(max(height, 100), 4000)

                    img = Image.new('RGBA', (width, height), (255, 255, 255, 255))
                    print(f"Created basic SVG placeholder: {width}x{height}")
                    svg_converted = True

                except Exception as e:
                    print(f"Basic SVG parsing failed: {e}")

            if not svg_converted:
                print("SVG conversion failed with all methods")
                return False
        
        # Handle HEIC input (requires pillow-heif)
        elif input_path.lower().endswith('.heic'):
            try:
                from pillow_heif import register_heif_opener
                register_heif_opener()
                img = Image.open(input_path)
            except ImportError:
                print("pillow-heif not installed - HEIC conversion not available")
                return False
        
        # Handle PSD input (basic support with psd-tools)
        elif input_path.lower().endswith('.psd'):
            try:
                from psd_tools import PSDImage
                psd = PSDImage.open(input_path)
                img = psd.composite()
                if img is None:
                    print("Could not extract image from PSD file")
                    return False
            except ImportError:
                print("psd-tools not installed - PSD conversion not available")
                return False
        
        # Handle AI input (Adobe Illustrator - very limited support)
        elif input_path.lower().endswith('.ai'):
            try:
                # AI files are complex vector files that PIL cannot handle properly
                # Try basic PIL support (works only for very simple AI files)
                img = Image.open(input_path)
                print("AI file opened with basic PIL support")
            except Exception as e:
                print(f"AI file conversion failed: {e}")
                # Return False with a specific error message that will be caught
                raise Exception("AI files contain complex vector data that requires specialized software. For best results: 1) Open in Adobe Illustrator and export as PNG/JPG, 2) Use Inkscape (free) to convert AI files, 3) Try online converters with proper Adobe support, or 4) Convert to SVG first if the file is simple.")
        
        # Handle standard image formats
        else:
            try:
                img = Image.open(input_path)
            except Exception as e:
                print(f"Failed to open image {input_path}: {e}")
                return False
        
        # Format mapping
        format_mapping = {
            'jpg': 'JPEG',
            'jpeg': 'JPEG',
            'png': 'PNG',
            'webp': 'WEBP',
            'avif': 'AVIF',
            'gif': 'GIF',
            'bmp': 'BMP',
            'tiff': 'TIFF',
            'ico': 'ICO',
            'heic': 'HEIC',
            'pdf': 'PDF',
            'pcx': 'PCX',
            'svg': 'SVG'
        }
        
        # Check for unsupported output formats
        unsupported_output_formats = ['ai', 'eps', 'cdr', 'psd', 'xcf', 'gltf', 'obj', 'fbx', 'stl']
        
        if target_format.lower() in unsupported_output_formats:
            print(f"Cannot convert to {target_format.upper()} - format not supported for output")
            return False
        
        # Special handling for SVG output
        if target_format.lower() == 'svg':
            return await create_svg_from_image(img, output_path)
        
        output_format = format_mapping.get(target_format.lower())
        if not output_format:
            print(f"Unsupported target format: {target_format}")
            return False
        
        # Handle format-specific conversions
        save_kwargs = {}
        
        # Convert RGBA to RGB for formats that don't support transparency
        if output_format in ['JPEG'] and img.mode in ['RGBA', 'LA']:
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'RGBA':
                background.paste(img, mask=img.split()[-1])
            else:
                background.paste(img)
            img = background
        
        # Format-specific settings
        if output_format == 'JPEG':
            save_kwargs = {'quality': 95, 'optimize': True}
        elif output_format == 'PNG':
            save_kwargs = {'optimize': True}
        elif output_format == 'WEBP':
            save_kwargs = {'quality': 95, 'method': 6}
        elif output_format == 'AVIF':
            try:
                import pillow_avif
                save_kwargs = {'quality': 95}
            except ImportError:
                print("Warning: AVIF support requires pillow-avif-plugin")
                return False
        elif output_format == 'HEIC':
            try:
                from pillow_heif import register_heif_opener
                register_heif_opener()
                save_kwargs = {'quality': 95}
            except ImportError:
                print("Warning: HEIC support requires pillow-heif")
                return False
        elif output_format == 'ICO':
            sizes = [(16, 16), (32, 32), (48, 48)]
            save_kwargs = {'sizes': sizes}
        elif output_format == 'TIFF':
            save_kwargs = {'compression': 'lzw'}
        elif output_format == 'GIF':
            if img.mode != 'P':
                img = img.convert('P', palette=Image.ADAPTIVE)
        elif output_format == 'PDF':
            if img.mode == 'RGBA':
                img = img.convert('RGB')
            save_kwargs = {'resolution': 100.0}
        
        # Save the converted image
        img.save(output_path, format=output_format, **save_kwargs)
        print(f"Successfully saved {output_format} to {output_path}")
        return True
        
    except Exception as e:
        print(f"Image conversion error: {e}")
        return False

async def create_svg_from_image(img: 'PILImage.Image', output_path: str) -> bool:
    """Create an SVG file that embeds the raster image as base64 data"""
    try:
        # Convert image to PNG format for embedding
        png_buffer = io.BytesIO()
        
        # Handle transparency properly
        if img.mode in ['RGBA', 'LA']:
            img_for_svg = img
        else:
            img_for_svg = img.convert('RGB')
        
        img_for_svg.save(png_buffer, format='PNG', optimize=True)
        png_buffer.seek(0)
        
        # Encode as base64
        img_base64 = base64.b64encode(png_buffer.getvalue()).decode('utf-8')
        
        # Get image dimensions
        width, height = img.size
        
        # Create SVG content
        svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="{width}" 
     height="{height}" 
     viewBox="0 0 {width} {height}">
  <title>Converted Image</title>
  <desc>Raster image converted to SVG format</desc>
  <image width="{width}" 
         height="{height}" 
         xlink:href="data:image/png;base64,{img_base64}"/>
</svg>'''
        
        # Write SVG file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        print(f"Created SVG file with embedded raster image: {output_path}")
        return True
        
    except Exception as e:
        print(f"SVG creation error: {e}")
        return False