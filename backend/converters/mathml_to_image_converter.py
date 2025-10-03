# converters/mathml_to_image_converter.py - MathML to Image conversion logic
from utils.dependencies import MATHML_AVAILABLE, PILLOW_AVAILABLE

async def mathml_to_image_converter(mathml_path: str, output_path: str) -> bool:
    """Convert MathML to Image"""
    if not MATHML_AVAILABLE or not PILLOW_AVAILABLE:
        return False

    try:
        import xml.etree.ElementTree as ET
        from PIL import Image, ImageDraw, ImageFont
        import matplotlib.pyplot as plt
        import matplotlib.patches as patches
        from io import BytesIO
        import re

        # Read MathML file
        with open(mathml_path, 'r', encoding='utf-8') as mathml_file:
            content = mathml_file.read()

        # Parse MathML
        try:
            root = ET.fromstring(content)
        except ET.ParseError:
            # Try to extract MathML from HTML or XML wrapper
            mathml_match = re.search(r'<math[^>]*>.*?</math>', content, re.DOTALL)
            if mathml_match:
                root = ET.fromstring(mathml_match.group())
            else:
                return False

        # Create figure
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 6)
        ax.axis('off')

        # Simple MathML to text conversion for basic rendering
        def extract_text_from_mathml(element):
            text_content = []

            if element.text:
                text_content.append(element.text)

            for child in element:
                tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag

                if tag == 'mi':  # identifier
                    text_content.append(child.text or '')
                elif tag == 'mn':  # number
                    text_content.append(child.text or '')
                elif tag == 'mo':  # operator
                    text_content.append(child.text or '')
                elif tag == 'mtext':  # text
                    text_content.append(child.text or '')
                elif tag == 'mfrac':  # fraction
                    children = list(child)
                    if len(children) >= 2:
                        numerator = extract_text_from_mathml(children[0])
                        denominator = extract_text_from_mathml(children[1])
                        text_content.append(f"({numerator})/({denominator})")
                elif tag == 'msup':  # superscript
                    children = list(child)
                    if len(children) >= 2:
                        base = extract_text_from_mathml(children[0])
                        exp = extract_text_from_mathml(children[1])
                        text_content.append(f"{base}^{exp}")
                elif tag == 'msub':  # subscript
                    children = list(child)
                    if len(children) >= 2:
                        base = extract_text_from_mathml(children[0])
                        sub = extract_text_from_mathml(children[1])
                        text_content.append(f"{base}_{sub}")
                elif tag == 'mrow':  # row grouping
                    text_content.append(extract_text_from_mathml(child))
                elif tag == 'msqrt':  # square root
                    inner = extract_text_from_mathml(child)
                    text_content.append(f"√({inner})")
                else:
                    # Recursively process other elements
                    text_content.append(extract_text_from_mathml(child))

                if child.tail:
                    text_content.append(child.tail)

            return ''.join(text_content)

        # Extract mathematical expression
        math_text = extract_text_from_mathml(root)

        # Clean up the text
        math_text = re.sub(r'\s+', ' ', math_text).strip()

        if not math_text:
            math_text = "Mathematical Expression"

        # Render the mathematical expression
        try:
            # Try to render as LaTeX if possible
            ax.text(5, 3, f'${math_text}$', fontsize=16, ha='center', va='center',
                   transform=ax.transData, family='serif')
        except:
            # Fallback to plain text
            ax.text(5, 3, math_text, fontsize=16, ha='center', va='center',
                   transform=ax.transData, family='monospace')

        # Add a border
        rect = patches.Rectangle((0.5, 0.5), 9, 5, linewidth=1,
                               edgecolor='black', facecolor='white', alpha=0.8)
        ax.add_patch(rect)

        # Save as image
        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches='tight',
                   facecolor='white', edgecolor='none')
        plt.close()

        return True

    except Exception as e:
        print(f"MathML to Image conversion error: {e}")
        return False