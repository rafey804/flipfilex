# main.py - Updated with document, audio, and video converter support
import os
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import route modules - Updated to include all new converters
from routers import (
    pdf_to_word, word_to_pdf, merge_pdf, pdf_to_images,
    download, png_to_webp, wav_to_mp3, image_converter,
    video_converter, document_converter, audio_converter,
    qr_code_generator, image_compressor, ocr_processor,
    font_converter, pdf_compressor, pdf_password, split_pdf,
    # New document converters
    epub_to_pdf, mobi_to_epub, txt_to_epub, docx_to_epub, bib_to_pdf, latex_to_pdf,
    # Research tools
    ris_to_bibtex, mathml_to_image,
    # CAD tools
    stl_to_obj, dwg_to_pdf, step_to_stl, ply_to_obj,
    # Finance tools
    defi_yield, jwt_decoder,
    # Medical tools
    dicom_to_jpeg,
    # Contact form
    contact_form,
    # AI Tools
    video_script_writer,
    ai_image_generator,
    # Voice and Dubbing
    voice_dubbing
)
from utils.config import UPLOAD_DIR
from utils.dependencies import check_dependencies, cleanup_old_files, get_dependency_status

# Lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("File Converter API started successfully!")
    print(f"Upload directory: {UPLOAD_DIR}")
    check_dependencies()
    cleanup_old_files()
    yield
    # Shutdown
    print("Shutting down File Converter API...")

# Create FastAPI app
app = FastAPI(
    title="File Converter API",
    description="Convert between PDF, Word, Images, Audio, Video, Document, and Font formats",  # Updated description
    version="3.0.0",  # Version bump for new features
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3004","http://localhost:3001", "http://127.0.0.1:3001", "http://127.0.0.1:3004", "http://localhost:8000", "http://127.0.0.1:8000", "http://flipfilex.com", "https://flipfilex.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers - Updated to include all new converters
app.include_router(pdf_to_word.router, prefix="/convert", tags=["PDF to Word"])
app.include_router(word_to_pdf.router, prefix="/convert", tags=["Word to PDF"])
app.include_router(merge_pdf.router, prefix="/convert", tags=["Merge PDF"])
app.include_router(pdf_to_images.router, prefix="/convert", tags=["PDF to Images"])
app.include_router(png_to_webp.router, prefix="/convert", tags=["PNG to WebP"])
app.include_router(wav_to_mp3.router, prefix="/convert", tags=["WAV to MP3"])
app.include_router(image_converter.router, prefix="/convert", tags=["Image Converter"])
app.include_router(video_converter.router, prefix="/convert", tags=["Video Converter"])
app.include_router(document_converter.router, prefix="/convert", tags=["Document Converter"])
app.include_router(audio_converter.router, prefix="/convert", tags=["Audio Converter"])
app.include_router(qr_code_generator.router, prefix="/convert", tags=["QR Code Generator"])
app.include_router(image_compressor.router, prefix="/convert", tags=["Image Compressor"])
app.include_router(ocr_processor.router, prefix="/convert", tags=["OCR Text Extraction"])
app.include_router(font_converter.router, prefix="/convert", tags=["Font Converter"])
app.include_router(pdf_compressor.router, prefix="/convert", tags=["PDF Compressor"])
app.include_router(pdf_password.router, prefix="/convert", tags=["PDF Password Protection"])
app.include_router(split_pdf.router, tags=["PDF Splitter"])

# New document converters
app.include_router(epub_to_pdf.router, prefix="/convert", tags=["EPUB to PDF"])
app.include_router(mobi_to_epub.router, prefix="/convert", tags=["MOBI to EPUB"])
app.include_router(txt_to_epub.router, prefix="/convert", tags=["TXT to EPUB"])
app.include_router(docx_to_epub.router, prefix="/convert", tags=["DOCX to EPUB"])
app.include_router(bib_to_pdf.router, prefix="/convert", tags=["BIB to PDF"])
app.include_router(latex_to_pdf.router, prefix="/convert", tags=["LaTeX to PDF"])

# Research tools
app.include_router(ris_to_bibtex.router, prefix="/convert", tags=["RIS to BibTeX"])
app.include_router(mathml_to_image.router, prefix="/convert", tags=["MathML to Image"])

# CAD tools
app.include_router(stl_to_obj.router, prefix="/convert", tags=["STL to OBJ"])
app.include_router(dwg_to_pdf.router, prefix="/convert", tags=["DWG to PDF"])
app.include_router(step_to_stl.router, prefix="/convert", tags=["STEP to STL"])
app.include_router(ply_to_obj.router, prefix="/convert", tags=["PLY to OBJ"])

# Finance tools
app.include_router(defi_yield.router, prefix="/tools", tags=["DeFi Yield Calculator"])
app.include_router(jwt_decoder.router, prefix="/tools", tags=["JWT Token Decoder"])

# Medical tools
app.include_router(dicom_to_jpeg.router, prefix="/convert", tags=["DICOM to JPEG"])

# Contact form
app.include_router(contact_form.router, prefix="/api", tags=["Contact Form"])

# AI Tools
app.include_router(video_script_writer.router, prefix="/ai", tags=["AI Video Script Writer"])
app.include_router(ai_image_generator.router, prefix="/ai", tags=["AI Image Generator"])

# Voice and Dubbing
app.include_router(voice_dubbing.router, prefix="/ai", tags=["Voice and Dubbing"])

app.include_router(download.router, tags=["Download"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "File Converter API is running - Complete Media & Document Conversion Suite!"}

# Health endpoint - Updated to include FFmpeg and all converter status
@app.get("/health")
async def health_check():
    # Import here to avoid circular imports
    try:
        from converters.video_converter import FFMPEG_AVAILABLE
    except ImportError:
        FFMPEG_AVAILABLE = False
    
    dependencies = get_dependency_status()
    dependencies["ffmpeg"] = FFMPEG_AVAILABLE  # Add FFmpeg status
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "3.0.0",
        "supported_conversions": [
            "PDF ↔ Word",
            "PDF → Images",
            "PDF Merge/Split/Compression/Password Protection",
            "EPUB ↔ PDF, MOBI ↔ EPUB, TXT ↔ EPUB, DOCX ↔ EPUB",
            "BIB → PDF, LaTeX → PDF",
            "RIS → BibTeX, MathML → Image",
            "STL ↔ OBJ, DWG → PDF, STEP → STL, PLY → OBJ",
            "DeFi Yield Calculator, JWT Token Decoder",
            "DICOM → JPEG",
            "Image Formats (PNG, JPG, WebP, etc.)",
            "Audio Formats (WAV, MP3, AAC, etc.)",
            "Video Formats (MP4, AVI, MOV, etc.)",
            "Document Formats (DOCX, PDF, TXT, etc.)",
            "Font Formats (TTF, OTF, WOFF, WOFF2, etc.)",
            "QR Code Generation",
            "Image Compression",
            "OCR Text Extraction"
        ],
        "dependencies": dependencies
    }

# New endpoint to list available converters
@app.get("/converters")
async def list_converters():
    return {
        "available_converters": {
            "pdf_to_word": "/convert/pdf-to-word",
            "word_to_pdf": "/convert/word-to-pdf",
            "merge_pdf": "/convert/merge-pdf",
            "pdf_to_images": "/convert/pdf-to-images",
            "png_to_webp": "/convert/png-to-webp",
            "wav_to_mp3": "/convert/wav-to-mp3",
            "image_converter": "/convert/image",
            "video_converter": "/convert/video",
            "document_converter": "/convert/document",
            "audio_converter": "/convert/audio",
            "font_converter": "/convert/font",
            "pdf_compressor": "/convert/compress-pdf",
            "pdf_password": "/convert/protect-pdf",
            "qr_code_generator": "/convert/generate-qr-code",
            "image_compressor": "/convert/compress-image",
            "ocr_processor": "/convert/extract-text",
            "epub_to_pdf": "/convert/epub-to-pdf",
            "mobi_to_epub": "/convert/mobi-to-epub",
            "txt_to_epub": "/convert/txt-to-epub",
            "docx_to_epub": "/convert/docx-to-epub",
            "bib_to_pdf": "/convert/bib-to-pdf",
            "latex_to_pdf": "/convert/latex-to-pdf",
            "ris_to_bibtex": "/convert/ris-to-bibtex",
            "mathml_to_image": "/convert/mathml-to-image",
            "stl_to_obj": "/convert/stl-to-obj",
            "dwg_to_pdf": "/convert/dwg-to-pdf",
            "step_to_stl": "/convert/step-to-stl",
            "ply_to_obj": "/convert/ply-to-obj",
            "defi_yield_calculator": "/tools/defi-yield-calculator",
            "jwt_decoder": "/tools/jwt-decoder",
            "dicom_to_jpeg": "/convert/dicom-to-jpeg"
        },
        "supported_formats": {
            "images": ["PNG", "JPG", "JPEG", "WebP", "GIF", "BMP", "TIFF"],
            "documents": ["PDF", "DOCX", "DOC", "TXT", "RTF", "ODT", "EPUB", "MOBI"],
            "research": ["BIB", "RIS", "MathML", "LaTeX"],
            "cad_3d": ["STL", "OBJ", "DWG", "DXF", "STEP", "STP", "PLY"],
            "medical": ["DICOM", "DCM"],
            "audio": ["MP3", "WAV", "AAC", "FLAC", "OGG", "M4A"],
            "video": ["MP4", "AVI", "MOV", "MKV", "WMV", "FLV", "WebM"],
            "fonts": ["TTF", "OTF", "WOFF", "WOFF2", "EOT", "SVG", "PS1"],
            "qr_codes": ["PNG", "JPG", "SVG", "PDF"]
        }
    }

# Error handlers
@app.exception_handler(413)
async def file_too_large_handler(request, exc):
    return JSONResponse(
        status_code=413,
        content={"detail": "File too large"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
