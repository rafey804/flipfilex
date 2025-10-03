# converters/ris_to_bibtex_converter.py - RIS to BibTeX conversion logic

async def ris_to_bibtex_converter(ris_path: str, output_path: str) -> bool:
    """Convert RIS to BibTeX format"""
    try:
        import re
        from pathlib import Path

        # Read RIS file
        with open(ris_path, 'r', encoding='utf-8', errors='ignore') as ris_file:
            content = ris_file.read()

        # Parse RIS entries
        entries = re.split(r'\n(?=TY\s+-)', content)
        bibtex_entries = []

        for entry in entries:
            if not entry.strip():
                continue

            # Parse RIS fields
            fields = {}
            lines = entry.strip().split('\n')

            for line in lines:
                match = re.match(r'^([A-Z][A-Z0-9])\s+-\s+(.+)$', line.strip())
                if match:
                    field_code, field_value = match.groups()
                    if field_code in fields:
                        if isinstance(fields[field_code], list):
                            fields[field_code].append(field_value)
                        else:
                            fields[field_code] = [fields[field_code], field_value]
                    else:
                        fields[field_code] = field_value

            # Skip if no type specified
            if 'TY' not in fields:
                continue

            # Map RIS to BibTeX entry type
            ris_type = fields['TY']
            bibtex_type = {
                'JOUR': 'article',
                'BOOK': 'book',
                'CHAP': 'inbook',
                'CONF': 'inproceedings',
                'THES': 'phdthesis',
                'RPRT': 'techreport',
                'WEB': 'misc',
                'GENERIC': 'misc'
            }.get(ris_type, 'misc')

            # Generate citation key
            author_key = ''
            if 'AU' in fields:
                authors = fields['AU'] if isinstance(fields['AU'], list) else [fields['AU']]
                if authors:
                    first_author = authors[0].split(',')[0].strip()
                    author_key = re.sub(r'[^a-zA-Z]', '', first_author)

            year_key = ''
            if 'PY' in fields:
                year_match = re.search(r'\d{4}', fields['PY'])
                if year_match:
                    year_key = year_match.group()

            title_key = ''
            if 'TI' in fields:
                title_words = re.findall(r'\b[a-zA-Z]+\b', fields['TI'])
                if title_words:
                    title_key = title_words[0]

            citation_key = f"{author_key}{year_key}{title_key}".lower()
            if not citation_key:
                citation_key = f"entry{len(bibtex_entries) + 1}"

            # Build BibTeX entry
            bibtex_entry = f"@{bibtex_type}{{{citation_key},\n"

            # Map RIS fields to BibTeX
            field_mapping = {
                'TI': 'title',
                'AU': 'author',
                'PY': 'year',
                'JO': 'journal',
                'VL': 'volume',
                'IS': 'number',
                'SP': 'pages',
                'EP': 'pages',
                'PB': 'publisher',
                'CY': 'address',
                'AB': 'abstract',
                'KW': 'keywords',
                'UR': 'url',
                'DO': 'doi',
                'BT': 'booktitle',
                'T2': 'booktitle',
                'SN': 'isbn'
            }

            for ris_field, bibtex_field in field_mapping.items():
                if ris_field in fields:
                    value = fields[ris_field]

                    if isinstance(value, list):
                        if ris_field == 'AU':
                            # Join authors with 'and'
                            value = ' and '.join(value)
                        elif ris_field == 'KW':
                            # Join keywords with commas
                            value = ', '.join(value)
                        else:
                            value = value[0]  # Take first value

                    # Handle page ranges
                    if ris_field == 'SP' and 'EP' in fields:
                        end_page = fields['EP']
                        if isinstance(end_page, list):
                            end_page = end_page[0]
                        value = f"{value}--{end_page}"
                    elif ris_field == 'EP':
                        continue  # Skip, handled with SP

                    # Clean and escape value
                    value = value.replace('{', '\\{').replace('}', '\\}')
                    bibtex_entry += f"  {bibtex_field} = {{{value}}},\n"

            bibtex_entry = bibtex_entry.rstrip(',\n') + '\n}\n\n'
            bibtex_entries.append(bibtex_entry)

        # Write BibTeX file
        with open(output_path, 'w', encoding='utf-8') as bibtex_file:
            bibtex_file.write(''.join(bibtex_entries))

        return True

    except Exception as e:
        print(f"RIS to BibTeX conversion error: {e}")
        return False