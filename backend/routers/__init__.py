# routers/__init__.py - Router module exports
from . import (
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
    dicom_to_jpeg
)

__all__ = [
    "pdf_to_word", "word_to_pdf", "merge_pdf", "pdf_to_images",
    "download", "png_to_webp", "wav_to_mp3", "image_converter",
    "video_converter", "document_converter", "audio_converter",
    "qr_code_generator", "image_compressor", "ocr_processor",
    "font_converter", "pdf_compressor", "pdf_password", "split_pdf",
    "epub_to_pdf", "mobi_to_epub", "txt_to_epub", "docx_to_epub", "bib_to_pdf", "latex_to_pdf",
    "ris_to_bibtex", "mathml_to_image",
    "stl_to_obj", "dwg_to_pdf", "step_to_stl", "ply_to_obj",
    "defi_yield", "jwt_decoder",
    "dicom_to_jpeg"
]