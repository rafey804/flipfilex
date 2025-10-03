# converters/pdf_to_images_converter.py - PDF to Images conversion logic
from typing import List
import os
from utils.dependencies import PDF2IMAGE_AVAILABLE, PYPDF2_AVAILABLE, POPPLER_PATH

def validate_pdf_file(file_path: str) -> bool:
    """Validate if the PDF file is readable"""
    try:
        if not PYPDF2_AVAILABLE:
            return True  # Skip validation if PyPDF2 not available
            
        import PyPDF2
        with open(file_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            # Try to get page count
            page_count = len(pdf_reader.pages)
            print(f"PDF validation: {page_count} pages found")
            return page_count > 0
    except Exception as e:
        print(f"PDF validation failed: {e}")
        return False

async def pdf_to_images_converter(pdf_path: str, output_dir: str) -> List[str]:
    """Convert PDF pages to images with enhanced error handling and fallbacks"""
    if not PDF2IMAGE_AVAILABLE:
        print("PDF2IMAGE not available")
        return []
    
    try:
        from pdf2image import convert_from_path, convert_from_bytes
        
        print(f"Converting PDF: {pdf_path}")
        print(f"Output directory: {output_dir}")
        print(f"Using poppler path: {POPPLER_PATH}")
        
        # Validate PDF file first
        if not validate_pdf_file(pdf_path):
            print("PDF validation failed")
            return []
        
        # Method 1: Try with explicit poppler path and conservative settings
        images = None
        
        if POPPLER_PATH:
            try:
                print("Trying Method 1: With explicit poppler path")
                images = convert_from_path(
                    pdf_path, 
                    dpi=150,  # Lower DPI to reduce memory usage
                    poppler_path=POPPLER_PATH,
                    first_page=1,
                    last_page=None,
                    thread_count=1,  # Single thread to avoid issues
                    grayscale=False,
                    size=None,
                    transparent=False,
                    single_file=False,
                    output_folder=None,
                    output_file=None,
                    strict=False  # Less strict parsing
                )
                print(f"Method 1 successful: {len(images)} pages")
            except Exception as e:
                print(f"Method 1 failed: {e}")
                images = None
        
        # Method 2: Try without explicit poppler path
        if images is None:
            try:
                print("Trying Method 2: Without explicit poppler path")
                images = convert_from_path(
                    pdf_path, 
                    dpi=150,
                    thread_count=1,
                    strict=False
                )
                print(f"Method 2 successful: {len(images)} pages")
            except Exception as e:
                print(f"Method 2 failed: {e}")
                images = None
        
        # Method 3: Try with bytes (load file into memory)
        if images is None:
            try:
                print("Trying Method 3: Convert from bytes")
                with open(pdf_path, 'rb') as pdf_file:
                    pdf_bytes = pdf_file.read()
                
                if POPPLER_PATH:
                    images = convert_from_bytes(
                        pdf_bytes,
                        dpi=150,
                        poppler_path=POPPLER_PATH,
                        thread_count=1,
                        strict=False
                    )
                else:
                    images = convert_from_bytes(
                        pdf_bytes,
                        dpi=150,
                        thread_count=1,
                        strict=False
                    )
                print(f"Method 3 successful: {len(images)} pages")
            except Exception as e:
                print(f"Method 3 failed: {e}")
                images = None
        
        # Method 4: Try page by page conversion (fallback for problematic PDFs)
        if images is None:
            try:
                print("Trying Method 4: Page by page conversion")
                images = []
                page_num = 1
                
                while True:
                    try:
                        if POPPLER_PATH:
                            page_images = convert_from_path(
                                pdf_path,
                                dpi=150,
                                poppler_path=POPPLER_PATH,
                                first_page=page_num,
                                last_page=page_num,
                                strict=False
                            )
                        else:
                            page_images = convert_from_path(
                                pdf_path,
                                dpi=150,
                                first_page=page_num,
                                last_page=page_num,
                                strict=False
                            )
                        
                        if page_images:
                            images.extend(page_images)
                            print(f"Converted page {page_num}")
                            page_num += 1
                        else:
                            break
                            
                        # Safety limit to prevent infinite loop
                        if page_num > 1000:
                            print("Reached page limit (1000)")
                            break
                            
                    except Exception as e:
                        print(f"Failed to convert page {page_num}: {e}")
                        break
                
                if images:
                    print(f"Method 4 successful: {len(images)} pages")
            except Exception as e:
                print(f"Method 4 failed: {e}")
                images = None
        
        # If all methods failed
        if not images:
            print("All conversion methods failed")
            return []
        
        # Save images
        image_paths = []
        
        for i, image in enumerate(images):
            try:
                image_filename = f"page_{i+1:03d}.png"
                image_path = os.path.join(output_dir, image_filename)
                
                # Save image with high quality
                image.save(image_path, 'PNG', quality=95, optimize=True)
                image_paths.append(image_path)
                print(f"Saved page {i+1} as {image_filename}")
                
                # Close the image to free memory
                image.close()
                
            except Exception as e:
                print(f"Failed to save page {i+1}: {e}")
                continue
        
        return image_paths
        
    except Exception as e:
        print(f"PDF to images conversion error: {e}")
        import traceback
        traceback.print_exc()
        return []