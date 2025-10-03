# converters/bib_to_pdf_converter.py - BIB to PDF conversion logic
from utils.dependencies import REPORTLAB_AVAILABLE

async def bib_to_pdf_converter(bib_path: str, output_path: str) -> bool:
    """Convert BIB to PDF document"""
    if not REPORTLAB_AVAILABLE:
        return False

    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        import re

        # Read BIB file
        with open(bib_path, 'r', encoding='utf-8', errors='ignore') as bib_file:
            content = bib_file.read()

        # Create PDF document
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []

        # Create custom styles
        title_style = ParagraphStyle(
            'BibTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
        )

        entry_style = ParagraphStyle(
            'BibEntry',
            parent=styles['Normal'],
            fontSize=11,
            leftIndent=20,
            spaceAfter=15,
        )

        # Add title
        story.append(Paragraph("Bibliography", title_style))
        story.append(Spacer(1, 20))

        # Parse BIB entries
        entries = re.findall(r'@(\w+)\s*\{([^@]+)\}', content, re.DOTALL)

        for entry_type, entry_content in entries:
            # Extract entry key
            key_match = re.match(r'\s*([^,\s]+)\s*,', entry_content)
            key = key_match.group(1) if key_match else "unknown"

            # Parse fields
            fields = {}
            field_matches = re.findall(r'(\w+)\s*=\s*["{]([^"}]+)["}]', entry_content)
            for field_name, field_value in field_matches:
                fields[field_name.lower()] = field_value.strip()

            # Format entry
            formatted_entry = f"<b>[{key}]</b> "

            # Add common fields in citation format
            if 'author' in fields:
                formatted_entry += f"{fields['author']}. "
            if 'title' in fields:
                formatted_entry += f'"{fields["title"]}". '
            if 'journal' in fields:
                formatted_entry += f"<i>{fields['journal']}</i>. "
            if 'booktitle' in fields:
                formatted_entry += f"In <i>{fields['booktitle']}</i>. "
            if 'year' in fields:
                formatted_entry += f"({fields['year']}). "
            if 'pages' in fields:
                formatted_entry += f"pp. {fields['pages']}. "
            if 'publisher' in fields:
                formatted_entry += f"{fields['publisher']}. "
            if 'volume' in fields:
                formatted_entry += f"Vol. {fields['volume']}. "
            if 'number' in fields:
                formatted_entry += f"No. {fields['number']}. "

            story.append(Paragraph(formatted_entry, entry_style))

        # Build PDF
        if not story or len(story) == 2:  # Only title and spacer
            story.append(Paragraph("No valid bibliography entries found.", styles['Normal']))

        doc.build(story)
        return True

    except Exception as e:
        print(f"BIB to PDF conversion error: {e}")
        return False