from utils.dependencies import PIL_AVAILABLE

async def png_to_webp_converter(png_path: str, output_path: str) -> bool:
    """Convert PNG to WebP format"""
    if not PIL_AVAILABLE:
        return False
    
    try:
        from PIL import Image
        
        # Open PNG image
        with Image.open(png_path) as img:
            # Preserve transparency for WebP
            if img.mode in ('RGBA', 'LA'):
                # Save with transparency
                img.save(output_path, 'WebP', quality=85, method=6, lossless=False)
            else:
                # Convert to RGB for non-transparent images
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img.save(output_path, 'WebP', quality=85, method=6)
            
            print(f"PNG converted to WebP: {output_path}")
            
        return True
        
    except Exception as e:
        print(f"PNG to WebP conversion error: {e}")
        return False