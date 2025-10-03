# converters/merge_pdf_converter.py - Merge PDF files logic
from typing import List
from utils.dependencies import PYPDF2_AVAILABLE

async def merge_pdfs(pdf_paths: List[str], output_path: str) -> bool:
    """Merge multiple PDFs into one"""
    if not PYPDF2_AVAILABLE:
        return False
    
    try:
        import PyPDF2
        
        pdf_merger = PyPDF2.PdfMerger()
        
        for pdf_path in pdf_paths:
            with open(pdf_path, 'rb') as pdf_file:
                pdf_merger.append(pdf_file)
        
        with open(output_path, 'wb') as output_file:
            pdf_merger.write(output_file)
        
        pdf_merger.close()
        return True
        
    except Exception as e:
        print(f"PDF merge error: {e}")
        return False