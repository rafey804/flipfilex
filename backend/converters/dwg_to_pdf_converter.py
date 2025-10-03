# converters/dwg_to_pdf_converter.py - DWG to PDF conversion logic
from utils.dependencies import CAD_AVAILABLE

async def dwg_to_pdf_converter(dwg_path: str, output_path: str) -> bool:
    """Convert DWG to PDF format"""
    if not CAD_AVAILABLE:
        return False

    try:
        import ezdxf
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter, A4
        from reportlab.lib.units import inch
        import math

        # Try to read DWG file (ezdxf has limited DWG support, mainly DXF)
        try:
            doc = ezdxf.readfile(dwg_path)
        except:
            # If DWG reading fails, create a simple PDF with error message
            c = canvas.Canvas(output_path, pagesize=A4)
            width, height = A4

            c.setFont("Helvetica-Bold", 16)
            c.drawCentredText(width/2, height/2 + 50, "DWG File Conversion")

            c.setFont("Helvetica", 12)
            c.drawCentredText(width/2, height/2, "DWG file format detected.")
            c.drawCentredText(width/2, height/2 - 20, "Limited DWG support available.")
            c.drawCentredText(width/2, height/2 - 40, "For full DWG support, please convert to DXF format first.")

            c.setFont("Helvetica", 10)
            c.drawCentredText(width/2, height/2 - 80, "This is a preview conversion. Full DWG parsing requires specialized libraries.")

            c.save()
            return True

        # Get model space
        msp = doc.modelspace()

        # Create PDF
        c = canvas.Canvas(output_path, pagesize=A4)
        width, height = A4

        # Scale and offset for drawing
        scale = 10
        offset_x = width / 2
        offset_y = height / 2

        # Draw header
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredText(width/2, height - 50, "CAD Drawing (DWG)")

        # Process entities
        line_count = 0
        circle_count = 0
        text_count = 0

        for entity in msp:
            try:
                if entity.dxftype() == 'LINE':
                    start = entity.dxf.start
                    end = entity.dxf.end

                    x1 = start.x * scale + offset_x
                    y1 = start.y * scale + offset_y
                    x2 = end.x * scale + offset_x
                    y2 = end.y * scale + offset_y

                    # Keep within page bounds
                    if (0 <= x1 <= width and 0 <= y1 <= height and
                        0 <= x2 <= width and 0 <= y2 <= height):
                        c.line(x1, y1, x2, y2)
                        line_count += 1

                elif entity.dxftype() == 'CIRCLE':
                    center = entity.dxf.center
                    radius = entity.dxf.radius

                    x = center.x * scale + offset_x
                    y = center.y * scale + offset_y
                    r = radius * scale

                    # Keep within page bounds
                    if (r <= x <= width - r and r <= y <= height - r):
                        c.circle(x, y, r, stroke=1, fill=0)
                        circle_count += 1

                elif entity.dxftype() == 'TEXT':
                    if hasattr(entity.dxf, 'insert') and hasattr(entity.dxf, 'text'):
                        pos = entity.dxf.insert
                        text = entity.dxf.text

                        x = pos.x * scale + offset_x
                        y = pos.y * scale + offset_y

                        # Keep within page bounds
                        if 0 <= x <= width and 0 <= y <= height:
                            c.setFont("Helvetica", 8)
                            c.drawString(x, y, str(text)[:50])  # Limit text length
                            text_count += 1

            except Exception as entity_error:
                # Skip problematic entities
                continue

        # Add summary
        c.setFont("Helvetica", 10)
        summary_y = 100
        c.drawString(50, summary_y, f"Drawing Summary:")
        c.drawString(50, summary_y - 15, f"Lines: {line_count}")
        c.drawString(50, summary_y - 30, f"Circles: {circle_count}")
        c.drawString(50, summary_y - 45, f"Text elements: {text_count}")

        # Add note
        c.setFont("Helvetica", 8)
        c.drawString(50, 50, "Note: This is a simplified conversion. Complex DWG features may not be fully represented.")

        c.save()
        return True

    except Exception as e:
        print(f"DWG to PDF conversion error: {e}")
        return False