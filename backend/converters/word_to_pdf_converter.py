# converters/word_to_pdf_converter.py - Word to PDF conversion logic
from utils.dependencies import DOCX_AVAILABLE, REPORTLAB_AVAILABLE

async def word_to_pdf_converter(word_path: str, output_path: str) -> bool:
    """Convert Word document to PDF"""
    if not DOCX_AVAILABLE or not REPORTLAB_AVAILABLE:
        return False
    
    try:
        from docx import Document
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib.pagesizes import letter
        
        # Read Word document
        doc = Document(word_path)
        
        # Create PDF using reportlab
        pdf_doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        content = []
        
        # Extract text from Word document
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                p = Paragraph(paragraph.text, styles['Normal'])
                content.append(p)
                content.append(Spacer(1, 12))
        
        if not content:
            content.append(Paragraph("No content found in document", styles['Normal']))
        
        pdf_doc.build(content)
        return True
        
    except Exception as e:
        print(f"Word to PDF conversion error: {e}")
        return False