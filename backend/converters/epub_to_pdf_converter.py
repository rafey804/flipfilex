# converters/epub_to_pdf_converter.py - EPUB to PDF conversion logic
from utils.dependencies import EPUB_AVAILABLE, REPORTLAB_AVAILABLE

async def epub_to_pdf_converter(epub_path: str, output_path: str) -> bool:
    """Convert EPUB to PDF document"""
    if not EPUB_AVAILABLE or not REPORTLAB_AVAILABLE:
        return False

    try:
        import ebooklib
        from ebooklib import epub
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from bs4 import BeautifulSoup
        import html2text

        # Read EPUB file
        book = epub.read_epub(epub_path)

        # Create PDF document
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []

        # Create title style
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=30,
        )

        # Extract book metadata
        title = book.get_metadata('DC', 'title')
        if title:
            story.append(Paragraph(title[0][0], title_style))
            story.append(Spacer(1, 20))

        # Extract text from EPUB chapters
        text_converter = html2text.HTML2Text()
        text_converter.ignore_links = True
        text_converter.ignore_images = True

        for item in book.get_items():
            if item.get_type() == ebooklib.ITEM_DOCUMENT:
                content = item.get_content().decode('utf-8')
                soup = BeautifulSoup(content, 'html.parser')

                # Extract text content
                text_content = text_converter.handle(str(soup))

                if text_content.strip():
                    # Split into paragraphs and add to PDF
                    paragraphs = text_content.split('\n\n')
                    for para in paragraphs:
                        if para.strip():
                            story.append(Paragraph(para.strip(), styles['Normal']))
                            story.append(Spacer(1, 12))

        # Build PDF
        doc.build(story)
        return True

    except Exception as e:
        print(f"EPUB to PDF conversion error: {e}")
        return False