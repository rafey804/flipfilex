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

        # Register AVIF and HEIF plugins at the start
        try:
            import pillow_avif
            print("AVIF plugin loaded")
        except ImportError:
            print("AVIF plugin not available")

        try:
            import pillow_heif
            pillow_heif.register_heif_opener()
            print("HEIF plugin registered")
        except ImportError:
            print("HEIF plugin not available")
        
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
        
        # Handle SVG input - Canvas based rendering with proper dimensions
        elif input_path.lower().endswith('.svg'):
            try:
                from html2image import Html2Image
                import tempfile
                import shutil
                from lxml import etree
                import base64

                print(f"Converting SVG file: {input_path}")

                # Read SVG content
                with open(input_path, 'r', encoding='utf-8') as f:
                    svg_content = f.read()

                # Parse SVG to get exact dimensions from viewBox
                try:
                    root = etree.fromstring(svg_content.encode('utf-8'))

                    # Get viewBox - this is the most reliable source
                    viewbox = root.get('viewBox')
                    svg_width = root.get('width')
                    svg_height = root.get('height')

                    vb_width, vb_height = None, None

                    if viewbox:
                        parts = viewbox.split()
                        if len(parts) >= 4:
                            vb_width = float(parts[2])
                            vb_height = float(parts[3])

                    # Parse width/height attributes
                    def parse_dim(val):
                        if not val or '%' in str(val):
                            return None
                        num = ''.join(c for c in str(val) if c.isdigit() or c == '.')
                        return float(num) if num else None

                    # Get original dimensions
                    orig_w = parse_dim(svg_width) or vb_width or 800
                    orig_h = parse_dim(svg_height) or vb_height or 600

                    # Calculate aspect ratio
                    aspect_ratio = orig_w / orig_h

                    # Set minimum width for high quality (1920px)
                    min_width = 1920

                    # Calculate final dimensions maintaining aspect ratio
                    if orig_w >= min_width:
                        width = int(orig_w)
                        height = int(orig_h)
                    else:
                        width = min_width
                        height = int(min_width / aspect_ratio)

                    print(f"Original SVG: {orig_w}x{orig_h}, Output: {width}x{height}")

                except Exception as e:
                    print(f"Could not parse SVG: {e}")
                    width, height = 1920, 1080

                # Create temp directory
                temp_dir = tempfile.mkdtemp()

                try:
                    # Convert SVG to base64 data URL
                    svg_base64 = base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')
                    svg_data_url = f"data:image/svg+xml;base64,{svg_base64}"

                    # Create HTML - canvas matches SVG natural dimensions exactly
                    html_file = os.path.join(temp_dir, 'render.html')
                    html_content = f'''<!DOCTYPE html>
<html>
<head>
    <style>
        * {{ margin: 0; padding: 0; }}
        html, body {{
            overflow: hidden;
            background: #FFFFFF;
        }}
        canvas {{
            display: block;
            background: #FFFFFF;
        }}
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script>
        (function() {{
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image();

            img.onload = function() {{
                // Get natural dimensions
                var naturalWidth = img.naturalWidth || img.width;
                var naturalHeight = img.naturalHeight || img.height;

                // HD UPSCALING: Scale factor for high quality output
                var scaleFactor = 4;

                // Calculate HD dimensions
                var hdWidth = naturalWidth * scaleFactor;
                var hdHeight = naturalHeight * scaleFactor;

                // Set canvas to HD dimensions
                canvas.width = hdWidth;
                canvas.height = hdHeight;

                // Update body/html size to match
                document.body.style.width = hdWidth + 'px';
                document.body.style.height = hdHeight + 'px';
                document.documentElement.style.width = hdWidth + 'px';
                document.documentElement.style.height = hdHeight + 'px';

                // Enable high quality rendering
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Fill canvas with WHITE background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw image at HD scale
                ctx.drawImage(img, 0, 0, hdWidth, hdHeight);

                // Mark as ready with actual dimensions
                document.body.setAttribute('data-ready', 'true');
                document.body.setAttribute('data-width', hdWidth);
                document.body.setAttribute('data-height', hdHeight);
            }};

            img.onerror = function() {{
                canvas.width = {width};
                canvas.height = {height};
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                document.body.setAttribute('data-ready', 'error');
            }};

            img.src = "{svg_data_url}";
        }})();
    </script>
</body>
</html>'''

                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(html_content)

                    # Render using html2image with large viewport for HD output
                    output_name = 'output.png'
                    # 4x scale factor means we need larger viewport
                    max_size = 8000  # Large enough for 4x scaled SVG

                    hti = Html2Image(
                        output_path=temp_dir,
                        size=(max_size, max_size),
                        custom_flags=['--default-background-color=FFFFFF', '--hide-scrollbars', '--force-device-scale-factor=1']
                    )

                    # Use file URL
                    file_url = f'file:///{html_file.replace(os.sep, "/")}'
                    hti.screenshot(url=file_url, save_as=output_name)

                    # Load result
                    rendered_path = os.path.join(temp_dir, output_name)
                    if os.path.exists(rendered_path):
                        img = Image.open(rendered_path)
                        img.load()

                        # Auto-crop to remove extra white space from large viewport
                        from PIL import ImageOps

                        # Convert to RGB first for processing
                        if img.mode == 'RGBA':
                            bg = Image.new('RGB', img.size, (255, 255, 255))
                            bg.paste(img, mask=img.split()[3])
                            img = bg
                        elif img.mode != 'RGB':
                            img = img.convert('RGB')

                        # Find content bounds
                        gray = img.convert('L')
                        inverted = ImageOps.invert(gray)
                        bbox = inverted.getbbox()

                        if bbox:
                            # Crop to content with small padding
                            pad = 5
                            bbox = (
                                max(0, bbox[0] - pad),
                                max(0, bbox[1] - pad),
                                min(img.width, bbox[2] + pad),
                                min(img.height, bbox[3] + pad)
                            )
                            img = img.crop(bbox)

                        print(f"SVG converted: {img.size} pixels")
                    else:
                        print("ERROR: Failed to render SVG")
                        return False

                finally:
                    shutil.rmtree(temp_dir, ignore_errors=True)

            except ImportError as e:
                print(f"ERROR: {e}")
                return False
            except Exception as svg_error:
                print(f"ERROR: SVG conversion failed: {svg_error}")
                import traceback
                traceback.print_exc()
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