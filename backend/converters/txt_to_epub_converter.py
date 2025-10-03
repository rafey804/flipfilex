# converters/txt_to_epub_converter.py - TXT to EPUB conversion logic
from utils.dependencies import EPUB_AVAILABLE

async def txt_to_epub_converter(txt_path: str, output_path: str) -> bool:
    """Convert TXT to EPUB document"""
    if not EPUB_AVAILABLE:
        return False

    try:
        import ebooklib
        from ebooklib import epub
        import re
        from pathlib import Path

        # Read text file
        with open(txt_path, 'r', encoding='utf-8', errors='ignore') as txt_file:
            content = txt_file.read()

        # Create EPUB book
        book = epub.EpubBook()

        # Set metadata
        filename = Path(txt_path).stem
        book.set_identifier(f'txt_converted_{filename}')
        book.set_title(filename.replace('_', ' ').title())
        book.set_language('en')
        book.add_author('Unknown')

        # Split content into chapters based on common patterns
        chapters = []
        chapter_patterns = [
            r'\n\s*Chapter\s+\d+.*?\n',
            r'\n\s*CHAPTER\s+\d+.*?\n',
            r'\n\s*\d+\.\s+.*?\n',
            r'\n\s*Part\s+\d+.*?\n',
        ]

        # Try to find chapter breaks
        chapter_found = False
        for pattern in chapter_patterns:
            matches = list(re.finditer(pattern, content, re.IGNORECASE))
            if len(matches) > 1:  # Found multiple chapters
                chapter_found = True
                for i, match in enumerate(matches):
                    start = match.start()
                    end = matches[i + 1].start() if i + 1 < len(matches) else len(content)
                    chapter_content = content[start:end].strip()

                    if chapter_content:
                        chapter_title = match.group().strip()
                        chapters.append((chapter_title, chapter_content))
                break

        # If no chapters found, split by double line breaks or create single chapter
        if not chapter_found:
            sections = content.split('\n\n\n')
            if len(sections) > 3:
                for i, section in enumerate(sections):
                    if section.strip():
                        title = f"Section {i + 1}"
                        chapters.append((title, section.strip()))
            else:
                chapters.append(("Full Text", content))

        # Create EPUB chapters
        epub_chapters = []
        for i, (title, chapter_content) in enumerate(chapters):
            # Create HTML content
            html_content = f"""
            <html>
            <head>
                <title>{title}</title>
                <style>
                    body {{ font-family: Georgia, serif; line-height: 1.6; margin: 2em; }}
                    h1 {{ color: #333; border-bottom: 2px solid #333; }}
                    p {{ margin-bottom: 1em; text-align: justify; }}
                </style>
            </head>
            <body>
                <h1>{title}</h1>
            """

            # Split content into paragraphs
            paragraphs = chapter_content.split('\n\n')
            for para in paragraphs:
                if para.strip():
                    # Clean up the paragraph
                    clean_para = para.strip().replace('\n', ' ')
                    html_content += f"<p>{clean_para}</p>\n"

            html_content += """
            </body>
            </html>
            """

            # Create EPUB chapter
            chapter = epub.EpubHtml(
                title=title,
                file_name=f'chap_{i:02d}.xhtml',
                lang='en'
            )
            chapter.content = html_content

            book.add_item(chapter)
            epub_chapters.append(chapter)

        # Create table of contents
        book.toc = tuple(epub.Link(f"chap_{i:02d}.xhtml", title, f"chapter{i}")
                        for i, (title, _) in enumerate(chapters))

        # Add navigation files
        book.add_item(epub.EpubNcx())
        book.add_item(epub.EpubNav())

        # Create spine
        book.spine = ['nav'] + epub_chapters

        # Write EPUB file
        epub.write_epub(output_path, book, {})
        return True

    except Exception as e:
        print(f"TXT to EPUB conversion error: {e}")
        return False