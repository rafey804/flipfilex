# pdf2docx_method.py - Original pdf2docx conversion method
import os

async def pdf2docx_convert(pdf_path: str, output_path: str) -> bool:
    """
    Convert PDF to Word using pdf2docx library
    Best for: General purpose, tables, images, layout preservation

    Args:
        pdf_path: Input PDF file path
        output_path: Output DOCX file path

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        from pdf2docx import parse

        print(f"[DEBUG] Starting pdf2docx conversion: {pdf_path} -> {output_path}")

        # Convert PDF to Word using pdf2docx with formatting preservation
        parse(pdf_path, output_path, start=0, end=None)

        # Verify the output file was created and is not empty
        if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            print(f"[DEBUG] pdf2docx conversion completed successfully")
            return True
        else:
            print(f"[WARNING] pdf2docx conversion failed - output file not created or empty")
            return False

    except ImportError:
        print(f"[ERROR] pdf2docx not available")
        return False
    except Exception as e:
        print(f"[WARNING] pdf2docx conversion failed: {e}")
        # Clean up failed output file if it exists
        if os.path.exists(output_path):
            try:
                os.remove(output_path)
            except:
                pass
        return False
