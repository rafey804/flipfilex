# converters/document_converter.py - Fixed LibreOffice detection
import os
import subprocess
import shlex
import json
import csv
import pandas as pd
from typing import Optional
import logging
from io import StringIO, BytesIO
import xlsxwriter
import openpyxl
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

logger = logging.getLogger(__name__)

# Check LibreOffice installation - FIXED VERSION
def check_libreoffice():
    """Check if LibreOffice is installed and accessible"""
    # Possible LibreOffice paths
    possible_paths = [
        'libreoffice',  # System PATH
        'soffice',      # Alternative command
        r'C:\Program Files\LibreOffice\program\soffice.exe',
        r'C:\Program Files (x86)\LibreOffice\program\soffice.exe'
    ]
    
    for path in possible_paths:
        try:
            print(f"Checking LibreOffice at: {path}")
            
            # Use different approach for Windows
            if os.name == 'nt':
                result = subprocess.run(
                    [path, '--version'], 
                    capture_output=True, 
                    text=True, 
                    timeout=15,
                    creationflags=subprocess.CREATE_NO_WINDOW,
                    shell=False
                )
            else:
                result = subprocess.run(
                    [path, '--version'], 
                    capture_output=True, 
                    text=True, 
                    timeout=15
                )
            
            if result.returncode == 0:
                version_line = result.stdout.split('\n')[0] if result.stdout else "Unknown"
                print(f"[OK] LibreOffice found: {version_line}")
                logger.info(f"LibreOffice available: {version_line}")
                
                # Store the working path for later use
                global LIBREOFFICE_PATH
                LIBREOFFICE_PATH = path
                return True
            else:
                print(f"[FAILED] LibreOffice failed with return code: {result.returncode}")
                if result.stderr:
                    print(f"Error: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            print(f"[FAILED] LibreOffice check timed out for: {path}")
        except FileNotFoundError:
            print(f"[FAILED] LibreOffice not found at: {path}")
        except Exception as e:
            print(f"[FAILED] LibreOffice check error for {path}: {str(e)}")

    print("[FAILED] LibreOffice not found in any standard location")
    return False

# Global variable to store working LibreOffice path
LIBREOFFICE_PATH = None
LIBREOFFICE_AVAILABLE = check_libreoffice()

async def excel_to_pdf(input_path: str, output_path: str) -> bool:
    """Convert Excel files to PDF using LibreOffice"""
    
    print(f"Starting Excel to PDF conversion:")
    print(f"   Input: {input_path}")
    print(f"   Output: {output_path}")
    
    if not LIBREOFFICE_AVAILABLE or not LIBREOFFICE_PATH:
        print("[FAILED] LibreOffice not available - cannot convert Excel to PDF")
        return False
    
    if not os.path.exists(input_path):
        print(f"[FAILED] Input file does not exist: {input_path}")
        return False
    
    try:
        # Use LibreOffice headless mode for conversion
        output_dir = os.path.dirname(output_path)
        
        cmd = [
            LIBREOFFICE_PATH,
            "--headless",
            "--convert-to", "pdf",
            "--outdir", output_dir,
            input_path
        ]
        
        print(f"LibreOffice command: {' '.join(cmd)}")
        
        if os.name == 'nt':
            process = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300,  # 5 minutes
                creationflags=subprocess.CREATE_NO_WINDOW,
                shell=False
            )
        else:
            process = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300
            )
        
        if process.returncode == 0:
            # LibreOffice creates PDF with same name as input
            input_name = os.path.splitext(os.path.basename(input_path))[0]
            generated_pdf = os.path.join(output_dir, f"{input_name}.pdf")
            
            if os.path.exists(generated_pdf):
                # Rename to desired output name if different
                if generated_pdf != output_path:
                    os.rename(generated_pdf, output_path)
                
                output_size = os.path.getsize(output_path)
                print(f"✅ Excel to PDF conversion successful!")
                print(f"Output file size: {output_size} bytes")
                return True
            else:
                print("[FAILED] PDF output file not found")
                print(f"Expected: {generated_pdf}")
                return False
        else:
            print(f"[FAILED] LibreOffice failed: {process.stderr}")
            print(f"stdout: {process.stdout}")
            return False
            
    except subprocess.TimeoutExpired:
        print("[FAILED] Excel to PDF conversion timed out")
        return False
    except Exception as e:
        print(f"[FAILED] Excel to PDF conversion error: {str(e)}")
        return False

async def powerpoint_to_pdf(input_path: str, output_path: str) -> bool:
    """Convert PowerPoint files to PDF using LibreOffice"""
    
    print(f"Starting PowerPoint to PDF conversion:")
    print(f"   Input: {input_path}")
    print(f"   Output: {output_path}")
    
    if not LIBREOFFICE_AVAILABLE or not LIBREOFFICE_PATH:
        print("[FAILED] LibreOffice not available - cannot convert PowerPoint to PDF")
        return False
    
    try:
        output_dir = os.path.dirname(output_path)
        
        cmd = [
            LIBREOFFICE_PATH,
            "--headless",
            "--convert-to", "pdf",
            "--outdir", output_dir,
            input_path
        ]
        
        if os.name == 'nt':
            process = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300,
                creationflags=subprocess.CREATE_NO_WINDOW,
                shell=False
            )
        else:
            process = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300
            )
        
        if process.returncode == 0:
            input_name = os.path.splitext(os.path.basename(input_path))[0]
            generated_pdf = os.path.join(output_dir, f"{input_name}.pdf")
            
            if os.path.exists(generated_pdf):
                if generated_pdf != output_path:
                    os.rename(generated_pdf, output_path)
                
                print(f"✅ PowerPoint to PDF conversion successful!")
                return True
            else:
                print("[FAILED] PDF output file not found")
                return False
        else:
            print(f"[FAILED] LibreOffice failed: {process.stderr}")
            return False
            
    except Exception as e:
        print(f"[FAILED] PowerPoint to PDF conversion error: {str(e)}")
        return False

async def text_to_pdf(input_path: str, output_path: str) -> bool:
    """Convert text files to PDF using ReportLab"""
    
    print(f"Starting Text to PDF conversion:")
    print(f"   Input: {input_path}")
    print(f"   Output: {output_path}")
    
    try:
        # Read text file
        with open(input_path, 'r', encoding='utf-8') as file:
            text_content = file.read()
        
        # Create PDF
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        styles = getSampleStyleSheet()
        
        # Create a custom style for better text formatting
        custom_style = ParagraphStyle(
            'CustomStyle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=14,
            spaceAfter=6,
        )
        
        # Split text into paragraphs and create PDF content
        story = []
        paragraphs = text_content.split('\n\n')
        
        for para in paragraphs:
            if para.strip():
                # Replace single newlines with <br/> for line breaks
                formatted_para = para.replace('\n', '<br/>')
                story.append(Paragraph(formatted_para, custom_style))
                story.append(Spacer(1, 6))
        
        # Build PDF
        doc.build(story)
        
        if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            print(f"✅ Text to PDF conversion successful!")
            return True
        else:
            print("[FAILED] PDF creation failed")
            return False
            
    except Exception as e:
        print(f"[FAILED] Text to PDF conversion error: {str(e)}")
        return False

async def html_to_pdf(input_path: str, output_path: str) -> bool:
    """Convert HTML files to PDF using wkhtmltopdf or LibreOffice fallback"""
    
    print(f"Starting HTML to PDF conversion:")
    print(f"   Input: {input_path}")
    print(f"   Output: {output_path}")
    
    try:
        # Try wkhtmltopdf first
        try:
            import pdfkit
            
            options = {
                'page-size': 'A4',
                'margin-top': '0.75in',
                'margin-right': '0.75in',
                'margin-bottom': '0.75in',
                'margin-left': '0.75in',
                'encoding': "UTF-8",
                'no-outline': None
            }
            
            # Read HTML content
            with open(input_path, 'r', encoding='utf-8') as file:
                html_content = file.read()
            
            # Convert to PDF
            pdfkit.from_string(html_content, output_path, options=options)
            
            if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                print(f"✅ HTML to PDF conversion successful (wkhtmltopdf)!")
                return True
                
        except Exception as e:
            print(f"wkhtmltopdf failed: {str(e)}")
            
        # Fallback to LibreOffice if available
        if LIBREOFFICE_AVAILABLE and LIBREOFFICE_PATH:
            print("Trying LibreOffice fallback...")
            
            output_dir = os.path.dirname(output_path)
            cmd = [
                LIBREOFFICE_PATH,
                "--headless",
                "--convert-to", "pdf",
                "--outdir", output_dir,
                input_path
            ]
            
            if os.name == 'nt':
                process = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=300,
                    creationflags=subprocess.CREATE_NO_WINDOW,
                    shell=False
                )
            else:
                process = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if process.returncode == 0:
                input_name = os.path.splitext(os.path.basename(input_path))[0]
                generated_pdf = os.path.join(output_dir, f"{input_name}.pdf")
                
                if os.path.exists(generated_pdf):
                    if generated_pdf != output_path:
                        os.rename(generated_pdf, output_path)
                    print(f"✅ HTML to PDF conversion successful (LibreOffice)!")
                    return True
        
        print("[FAILED] HTML to PDF conversion failed - no converter available")
        return False
            
    except Exception as e:
        print(f"[FAILED] HTML to PDF conversion error: {str(e)}")
        return False

async def csv_to_excel(input_path: str, output_path: str) -> bool:
    """Convert CSV files to Excel using pandas and openpyxl"""
    
    print(f"Starting CSV to Excel conversion:")
    print(f"   Input: {input_path}")
    print(f"   Output: {output_path}")
    
    try:
        # Read CSV file
        df = pd.read_csv(input_path, encoding='utf-8')
        
        # Write to Excel
        with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Sheet1', index=False)
            
            # Auto-adjust column widths
            worksheet = writer.sheets['Sheet1']
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
        
        if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            print(f"✅ CSV to Excel conversion successful!")
            return True
        else:
            print("[FAILED] Excel creation failed")
            return False
            
    except Exception as e:
        print(f"[FAILED] CSV to Excel conversion error: {str(e)}")
        return False

async def json_to_csv(input_path: str, output_path: str) -> bool:
    """Convert JSON files to CSV using pandas"""
    
    print(f"Starting JSON to CSV conversion:")
    print(f"   Input: {input_path}")
    print(f"   Output: {output_path}")
    
    try:
        # Read JSON file
        with open(input_path, 'r', encoding='utf-8') as file:
            json_data = json.load(file)
        
        # Handle different JSON structures
        if isinstance(json_data, list):
            # Array of objects
            df = pd.json_normalize(json_data)
        elif isinstance(json_data, dict):
            # Single object or nested structure
            df = pd.json_normalize([json_data])
        else:
            # Simple value
            df = pd.DataFrame([{'value': json_data}])
        
        # Write to CSV with UTF-8 BOM for Windows compatibility
        df.to_csv(output_path, index=False, encoding='utf-8-sig')

        if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            print("[OK] JSON to CSV conversion successful!")
            return True
        else:
            print("[FAILED] CSV creation failed")
            return False

    except Exception as e:
        print(f"[FAILED] JSON to CSV conversion error: {str(e)}")
        return False

# Supported document formats
SUPPORTED_DOCUMENT_FORMATS = {
    'excel_to_pdf': {
        'input': ['xlsx', 'xls', 'xlsm'],
        'output': ['pdf']
    },
    'powerpoint_to_pdf': {
        'input': ['pptx', 'ppt', 'pptm'],
        'output': ['pdf']
    },
    'text_to_pdf': {
        'input': ['txt', 'text'],
        'output': ['pdf']
    },
    'html_to_pdf': {
        'input': ['html', 'htm'],
        'output': ['pdf']
    },
    'csv_to_excel': {
        'input': ['csv'],
        'output': ['xlsx']
    },
    'json_to_csv': {
        'input': ['json'],
        'output': ['csv']
    }
}