# utils/dependencies.py - CORRECTED with FFmpeg detection
import importlib.util
import os
import time
import subprocess
import logging
from collections import defaultdict
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Try importing required packages
try:
    import aiofiles
    AIOFILES_AVAILABLE = True
except ImportError:
    AIOFILES_AVAILABLE = False

try:
    import PyPDF2
    PYPDF2_AVAILABLE = True
except ImportError:
    PYPDF2_AVAILABLE = False

try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

try:
    from docx import Document
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False

try:
    from pdf2image import convert_from_path, convert_from_bytes
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False

try:
    from PIL import Image
    PIL_AVAILABLE = True
    PILLOW_AVAILABLE = True
    print("[OK] PIL/Pillow imported successfully")
except ImportError:
    PIL_AVAILABLE = False
    PILLOW_AVAILABLE = False
    print("[FAILED] PIL/Pillow import failed")

# Document conversion libraries
try:
    import ebooklib
    from ebooklib import epub
    EBOOKLIB_AVAILABLE = True
    EPUB_AVAILABLE = True  # Alias for consistency
    print("[OK] EbookLib imported successfully")
except ImportError:
    EBOOKLIB_AVAILABLE = False
    EPUB_AVAILABLE = False  # Alias for consistency
    print("[FAILED] EbookLib import failed")

# Kindle format support (MOBI conversion)
try:
    # Check if kindlegen is available (optional for MOBI conversion)
    import subprocess
    result = subprocess.run(['kindlegen'], capture_output=True, timeout=5)
    KINDLEGEN_AVAILABLE = True
    print("[OK] Kindlegen available for MOBI conversion")
except:
    KINDLEGEN_AVAILABLE = False
    print("[INFO] Kindlegen not available - MOBI conversion will use alternative methods")

# Research tools
try:
    import xml.etree.ElementTree as ET
    import matplotlib.pyplot as plt
    import matplotlib.patches as patches
    MATHML_AVAILABLE = True
    print("[OK] MathML tools available")
except ImportError:
    MATHML_AVAILABLE = False
    print("[FAILED] MathML tools not available")

# LaTeX support
try:
    import subprocess
    # Check if pdflatex is available
    result = subprocess.run(['pdflatex', '--version'], capture_output=True, timeout=5)
    LATEX_AVAILABLE = result.returncode == 0
    if LATEX_AVAILABLE:
        print("[OK] LaTeX (pdflatex) available")
    else:
        print("[FAILED] LaTeX (pdflatex) not found")
except:
    LATEX_AVAILABLE = False
    print("[FAILED] LaTeX (pdflatex) not available")

# CAD and 3D mesh processing
try:
    import numpy as np
    from stl import mesh
    MESH_AVAILABLE = True
    print("[OK] Mesh processing (numpy-stl) available")
except ImportError:
    MESH_AVAILABLE = False
    print("[FAILED] Mesh processing not available")

try:
    import ezdxf
    CAD_AVAILABLE = True
    print("[OK] CAD tools (ezdxf) available")
except ImportError:
    CAD_AVAILABLE = False
    print("[FAILED] CAD tools not available")

# Finance tools
try:
    import json
    FINANCE_AVAILABLE = True
    print("[OK] Finance tools available")
except ImportError:
    FINANCE_AVAILABLE = False
    print("[FAILED] Finance tools not available")

# JWT tools
try:
    import jwt as pyjwt
    import base64
    JWT_AVAILABLE = True
    print("[OK] JWT tools available")
except ImportError:
    JWT_AVAILABLE = False
    print("[FAILED] JWT tools not available")

# Medical imaging
try:
    import pydicom
    MEDICAL_AVAILABLE = True
    print("[OK] Medical imaging (pydicom) available")
except ImportError:
    MEDICAL_AVAILABLE = False
    print("[FAILED] Medical imaging not available")

# AVIF support - optional, removed problematic import
AVIF_AVAILABLE = False
print("[INFO] AVIF support disabled - pillow-avif not required")

try:
    import qrcode
    import qrcode.image.svg
    from qrcode.image.styledpil import StyledPilImage
    
    # Try to import colorfills, fall back if not available
    try:
        from qrcode.image.styles.colorfills import SolidFillColorMask
        QRCODE_COLORFILLS_AVAILABLE = True
        print("[OK] QRCode library with colorfills available")
    except ImportError:
        QRCODE_COLORFILLS_AVAILABLE = False
        print("[OK] QRCode library available (basic colors only)")
    
    QRCODE_AVAILABLE = True
except ImportError:
    QRCODE_AVAILABLE = False
    QRCODE_COLORFILLS_AVAILABLE = False
    print("[FAILED] QRCode library not available - QR code generation disabled")
    
    QRCODE_AVAILABLE = True
    print("[OK] QRCode library available")
except ImportError:
    QRCODE_AVAILABLE = False
    QRCODE_COLORFILLS_AVAILABLE = False
    print("[FAILED] QRCode library not available - QR code generation disabled")

PYDUB_AVAILABLE = importlib.util.find_spec("pydub") is not None

# ADDED: Better FFmpeg detection
def detect_ffmpeg():
    """Detect FFmpeg installation with comprehensive checking"""
    try:
        # Try running ffmpeg -version
        result = subprocess.run(
            ['ffmpeg', '-version'], 
            capture_output=True, 
            text=True, 
            timeout=10,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        )
        
        if result.returncode == 0:
            # Extract version info
            version_info = result.stdout.split('\n')[0] if result.stdout else "Unknown version"
            print(f"[OK] FFmpeg detected: {version_info}")
            return True, version_info
        else:
            print(f"[FAILED] FFmpeg check failed with return code {result.returncode}")
            return False, None
            
    except subprocess.TimeoutExpired:
        print("[FAILED] FFmpeg detection timed out")
        return False, None
    except FileNotFoundError:
        print("[FAILED] FFmpeg not found in system PATH")
        return False, None
    except Exception as e:
        print(f"[FAILED] FFmpeg detection error: {str(e)}")
        return False, None

FFMPEG_AVAILABLE, FFMPEG_VERSION = detect_ffmpeg()

# Find poppler path with better error handling
def find_poppler_path():
    """Find poppler installation path"""
    possible_paths = [
        r"C:\poppler\Library\bin",
        r"C:\poppler-windows\Library\bin", 
        r"C:\Program Files\poppler\bin",
        r"C:\Program Files (x86)\poppler\bin",
        r"C:\poppler\bin",
        r"C:\poppler-windows\bin",
        "/usr/bin",  # Linux
        "/usr/local/bin",  # macOS
        "/opt/homebrew/bin"  # macOS ARM
    ]
    
    for path in possible_paths:
        try:
            if os.path.exists(path):
                # Check for pdftoppm executable
                pdftoppm_path = os.path.join(path, "pdftoppm.exe" if os.name == 'nt' else "pdftoppm")
                if os.path.exists(pdftoppm_path):
                    print(f"[OK] Found poppler at: {path}")
                    return path
        except Exception as e:
            logger.debug(f"Error checking path {path}: {e}")
            continue
    
    print("[FAILED] Poppler not found in common locations")
    return None

POPPLER_PATH = find_poppler_path()

# Rate limiting storage
request_counts = defaultdict(list)

def check_dependencies():
    """Print comprehensive dependency status"""
    print("=== Dependency Status ===")
    print(f"  - aiofiles: {'[OK]' if AIOFILES_AVAILABLE else '[FAILED]'} {AIOFILES_AVAILABLE}")
    print(f"  - PyPDF2: {'[OK]' if PYPDF2_AVAILABLE else '[FAILED]'} {PYPDF2_AVAILABLE}")
    print(f"  - reportlab: {'[OK]' if REPORTLAB_AVAILABLE else '[FAILED]'} {REPORTLAB_AVAILABLE}")
    print(f"  - python-docx: {'[OK]' if DOCX_AVAILABLE else '[FAILED]'} {DOCX_AVAILABLE}")
    print(f"  - pdf2image: {'[OK]' if PDF2IMAGE_AVAILABLE else '[FAILED]'} {PDF2IMAGE_AVAILABLE}")
    print(f"  - PIL/Pillow: {'[OK]' if PIL_AVAILABLE else '[FAILED]'} {PIL_AVAILABLE}")
    print(f"  - ebooklib: {'[OK]' if EBOOKLIB_AVAILABLE else '[FAILED]'} {EBOOKLIB_AVAILABLE}")
    print(f"  - kindlegen: {'[OK]' if KINDLEGEN_AVAILABLE else '[INFO]'} {KINDLEGEN_AVAILABLE}")
    print(f"  - mathml tools: {'[OK]' if MATHML_AVAILABLE else '[FAILED]'} {MATHML_AVAILABLE}")
    print(f"  - latex (pdflatex): {'[OK]' if LATEX_AVAILABLE else '[FAILED]'} {LATEX_AVAILABLE}")
    print(f"  - mesh tools (numpy-stl): {'[OK]' if MESH_AVAILABLE else '[FAILED]'} {MESH_AVAILABLE}")
    print(f"  - cad tools (ezdxf): {'[OK]' if CAD_AVAILABLE else '[FAILED]'} {CAD_AVAILABLE}")
    print(f"  - finance tools: {'[OK]' if FINANCE_AVAILABLE else '[FAILED]'} {FINANCE_AVAILABLE}")
    print(f"  - jwt tools: {'[OK]' if JWT_AVAILABLE else '[FAILED]'} {JWT_AVAILABLE}")
    print(f"  - medical imaging (pydicom): {'[OK]' if MEDICAL_AVAILABLE else '[FAILED]'} {MEDICAL_AVAILABLE}")
    print(f"  - pillow-avif: {'[OK]' if AVIF_AVAILABLE else '[INFO]'} {AVIF_AVAILABLE}")
    print(f"  - pydub: {'[OK]' if PYDUB_AVAILABLE else '[FAILED]'} {PYDUB_AVAILABLE}")
    print(f"  - qrcode: {'[OK]' if QRCODE_AVAILABLE else '[FAILED]'} {QRCODE_AVAILABLE}")
    print(f"  - qrcode colorfills: {'[OK]' if QRCODE_COLORFILLS_AVAILABLE else '[WARNING]'} {QRCODE_COLORFILLS_AVAILABLE}")
    print(f"  - FFmpeg: {'[OK]' if FFMPEG_AVAILABLE else '[FAILED]'} {FFMPEG_AVAILABLE}")

    if FFMPEG_VERSION:
        print(f"    Version: {FFMPEG_VERSION}")

    if POPPLER_PATH:
        print(f"  - poppler path: [OK] {POPPLER_PATH}")
    else:
        print("  - poppler: [FAILED] NOT FOUND")

    print("========================")

def get_dependency_status() -> Dict[str, Any]:
    """Get dependency status for API response"""
    return {
        "aiofiles": AIOFILES_AVAILABLE,
        "PyPDF2": PYPDF2_AVAILABLE,
        "reportlab": REPORTLAB_AVAILABLE,
        "python-docx": DOCX_AVAILABLE,
        "pdf2image": PDF2IMAGE_AVAILABLE and (POPPLER_PATH is not None),
        "PIL": PIL_AVAILABLE,
        "ebooklib": EBOOKLIB_AVAILABLE,
        "epub": EPUB_AVAILABLE,
        "kindlegen": KINDLEGEN_AVAILABLE,
        "mathml_tools": MATHML_AVAILABLE,
        "latex": LATEX_AVAILABLE,
        "mesh_tools": MESH_AVAILABLE,
        "cad_tools": CAD_AVAILABLE,
        "finance_tools": FINANCE_AVAILABLE,
        "jwt_tools": JWT_AVAILABLE,
        "medical_imaging": MEDICAL_AVAILABLE,
        "pillow-avif": AVIF_AVAILABLE,
        "pydub": PYDUB_AVAILABLE,
        "qrcode": QRCODE_AVAILABLE,
        "qrcode_colorfills": QRCODE_COLORFILLS_AVAILABLE,
        "ffmpeg": FFMPEG_AVAILABLE,
        "ffmpeg_version": FFMPEG_VERSION if FFMPEG_AVAILABLE else None,
        "poppler_path": POPPLER_PATH
    }

def cleanup_old_files():
    """Remove files older than 1 hour with better error handling"""
    from .config import UPLOAD_DIR
    
    if not os.path.exists(UPLOAD_DIR):
        return
    
    try:
        current_time = time.time()
        cleanup_count = 0
        
        for filename in os.listdir(UPLOAD_DIR):
            try:
                filepath = os.path.join(UPLOAD_DIR, filename)
                if os.path.isfile(filepath):
                    file_age = current_time - os.path.getctime(filepath)
                    if file_age > 3600:  # 1 hour
                        os.remove(filepath)
                        cleanup_count += 1
                        print(f"Cleaned up old file: {filename}")
            except Exception as e:
                print(f"Failed to cleanup file {filename}: {e}")
        
        if cleanup_count > 0:
            print(f"Cleaned up {cleanup_count} old files")
            
    except Exception as e:
        print(f"Cleanup error: {e}")

def validate_system_requirements():
    """Validate system requirements for video conversion"""
    issues = []
    
    if not FFMPEG_AVAILABLE:
        issues.append("FFmpeg is required for video conversion but is not installed or not in PATH")
    
    if not AIOFILES_AVAILABLE:
        issues.append("aiofiles is recommended for better file I/O performance")
    
    return issues