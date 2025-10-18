#!/bin/bash
# VPS Package Upgrade Script for Hostinger
# Run this script on your Hostinger VPS

echo "========================================="
echo "  Upgrading Backend Python Packages"
echo "========================================="
echo ""

# Navigate to project directory
cd ~/your-project-path/backend  # Change this to your actual path

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip itself
echo "Upgrading pip..."
pip install --upgrade pip

# Upgrade all installed packages
echo "Upgrading all Python packages..."
pip install --upgrade \
    fastapi \
    uvicorn \
    python-multipart \
    aiofiles \
    PyPDF2 \
    pypdf \
    reportlab \
    python-docx \
    pdf2image \
    Pillow \
    pydub \
    qrcode \
    ebooklib \
    pydicom \
    pyyaml \
    opencv-python \
    imageio \
    openpyxl \
    xlsxwriter \
    PyJWT \
    google-generativeai

# Install any missing dependencies
echo "Installing/updating additional packages..."
pip install --upgrade \
    numpy-stl \
    ezdxf \
    pydantic

echo ""
echo "========================================="
echo "  Package upgrade complete!"
echo "========================================="
echo ""
echo "Now restart your backend server:"
echo "  pm2 restart backend"
echo "  OR"
echo "  pkill -f uvicorn && python -m uvicorn main:app --host 0.0.0.0 --port 8000 &"
echo ""
