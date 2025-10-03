# converters/pdf_to_word_converter.py - PDF to Word conversion logic
from utils.dependencies import PYPDF2_AVAILABLE, DOCX_AVAILABLE

async def pdf_to_word_converter(pdf_path: str, output_path: str) -> bool:
    """Convert PDF to Word document"""
    if not PYPDF2_AVAILABLE or not DOCX_AVAILABLE:
        return False
    
    try:
        import PyPDF2
        from docx import Document
        
        # Create new Word document
        doc = Document()
        doc.add_heading('Converted from PDF', 0)
        
        # Read PDF and extract text
        with open(pdf_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            for page_num, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                if text.strip():
                    doc.add_heading(f'Page {page_num + 1}', level=1)
                    doc.add_paragraph(text)
                else:
                    doc.add_paragraph(f"[Page {page_num + 1} - No extractable text]")
        
        # Save Word document
        doc.save(output_path)
        return True
        
    except Exception as e:
        print(f"PDF to Word conversion error: {e}")
        return False