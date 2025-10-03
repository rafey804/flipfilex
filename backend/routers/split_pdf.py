import os
import uuid
from pathlib import Path
from typing import List
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import FileResponse
import PyPDF2
from werkzeug.utils import secure_filename

# Create router
router = APIRouter(prefix="/convert", tags=["pdf_split"])

# Upload and download directories
UPLOAD_FOLDER = Path(__file__).parent.parent / "uploads"

# Create directories if they don't exist
UPLOAD_FOLDER.mkdir(exist_ok=True)

def parse_page_ranges(page_range_str: str, total_pages: int) -> List[List[int]]:
    """
    Parse page ranges like "1-3, 5, 7-10" into list of page ranges
    Returns: [[1,2,3], [5], [7,8,9,10]]
    """
    ranges = []
    if not page_range_str.strip():
        return ranges

    parts = [p.strip() for p in page_range_str.split(',')]

    for part in parts:
        if '-' in part:
            try:
                start, end = map(int, part.split('-'))
                if start < 1 or end > total_pages or start > end:
                    raise ValueError(f"Invalid range: {part}")
                ranges.append(list(range(start, end + 1)))
            except ValueError as e:
                raise HTTPException(status_code=400, detail=f"Invalid page range: {part}")
        else:
            try:
                page_num = int(part)
                if page_num < 1 or page_num > total_pages:
                    raise ValueError(f"Page {page_num} is out of range")
                ranges.append([page_num])
            except ValueError as e:
                raise HTTPException(status_code=400, detail=f"Invalid page number: {part}")

    return ranges

def split_pdf_by_pages(input_path: str, pages_list: List[int], filename_prefix: str, file_id: str) -> str:
    """Split PDF by specific pages and return output filename"""
    try:
        with open(input_path, 'rb') as input_file:
            pdf_reader = PyPDF2.PdfReader(input_file)
            pdf_writer = PyPDF2.PdfWriter()

            for page_num in pages_list:
                if 1 <= page_num <= len(pdf_reader.pages):
                    pdf_writer.add_page(pdf_reader.pages[page_num - 1])  # Convert to 0-indexed

            # Create output filename
            pages_str = f"pages_{'-'.join(map(str, pages_list))}"
            output_filename = f"{filename_prefix}_{pages_str}.pdf"

            # Save directly to uploads directory with file_id prefix for uniqueness
            output_path = UPLOAD_FOLDER / f"{file_id}_{output_filename}"

            with open(output_path, 'wb') as output_file:
                pdf_writer.write(output_file)

            return f"{file_id}_{output_filename}"

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error splitting PDF: {str(e)}")

def split_pdf_individual_pages(input_path: str, filename_prefix: str, file_id: str) -> List[str]:
    """Split PDF into individual pages and return list of output filenames"""
    try:
        with open(input_path, 'rb') as input_file:
            pdf_reader = PyPDF2.PdfReader(input_file)
            total_pages = len(pdf_reader.pages)
            output_files = []

            for page_num in range(total_pages):
                pdf_writer = PyPDF2.PdfWriter()
                pdf_writer.add_page(pdf_reader.pages[page_num])

                output_filename = f"{filename_prefix}_page_{page_num + 1}.pdf"
                # Save directly to uploads directory with file_id prefix
                output_path = UPLOAD_FOLDER / f"{file_id}_{output_filename}"

                with open(output_path, 'wb') as output_file:
                    pdf_writer.write(output_file)

                output_files.append(f"{file_id}_{output_filename}")

            return output_files

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error splitting PDF: {str(e)}")

@router.post("/split-pdf")
async def split_pdf(
    file: UploadFile = File(...),
    split_option: str = Form("all"),  # "all", "range", "individual"
    page_range: str = Form("")
):
    """
    Split PDF file based on the specified option

    - split_option: "all" (individual pages), "range" (custom ranges), "individual" (same as all)
    - page_range: For range option, e.g., "1-3, 5, 7-10"
    """

    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Generate unique filename
    file_id = str(uuid.uuid4())
    safe_filename = secure_filename(file.filename)
    name_without_ext = os.path.splitext(safe_filename)[0]

    # Save uploaded file
    input_filename = f"{file_id}_{safe_filename}"
    input_path = UPLOAD_FOLDER / input_filename

    try:
        # Save uploaded file
        with open(input_path, 'wb') as f:
            content = await file.read()
            f.write(content)

        # Read PDF to get total pages
        with open(input_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            total_pages = len(pdf_reader.pages)

        if total_pages == 0:
            raise HTTPException(status_code=400, detail="PDF file appears to be empty or corrupted")

        print(f"DEBUG: PDF has {total_pages} pages, split_option: {split_option}")

        output_files = []

        if split_option in ["all", "individual"]:
            # Split into individual pages
            print(f"DEBUG: Splitting {total_pages} pages individually")
            filenames = split_pdf_individual_pages(str(input_path), name_without_ext, file_id)
            print(f"DEBUG: Generated {len(filenames)} split files")
            for filename in filenames:
                # Extract the original filename without file_id prefix for display
                display_name = filename.replace(f"{file_id}_", "")
                output_files.append({
                    "filename": filename,
                    "original_name": display_name,
                    "pages": 1
                })

        elif split_option == "range":
            if not page_range:
                raise HTTPException(status_code=400, detail="Page range is required for range split option")

            # Parse page ranges
            page_ranges = parse_page_ranges(page_range, total_pages)

            if not page_ranges:
                raise HTTPException(status_code=400, detail="No valid page ranges provided")

            # Split by each range
            for i, pages_list in enumerate(page_ranges):
                filename = split_pdf_by_pages(str(input_path), pages_list, name_without_ext, file_id)
                # Extract the original filename without file_id prefix for display
                display_name = filename.replace(f"{file_id}_", "")
                output_files.append({
                    "filename": filename,
                    "original_name": display_name,
                    "pages": len(pages_list)
                })

        else:
            raise HTTPException(status_code=400, detail="Invalid split_option. Must be 'all', 'range', or 'individual'")

        # Clean up input file
        os.remove(input_path)

        return {
            "success": True,
            "message": f"PDF split successfully into {len(output_files)} files",
            "original_filename": file.filename,
            "total_pages": total_pages,
            "split_option": split_option,
            "files": output_files
        }

    except HTTPException:
        # Clean up on HTTP errors
        if input_path.exists():
            os.remove(input_path)
        raise
    except Exception as e:
        # Clean up on other errors
        if input_path.exists():
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=f"PDF splitting failed: {str(e)}")

@router.get("/split-pdf/supported-options")
async def get_supported_split_options():
    """Get supported PDF split options"""
    return {
        "split_options": [
            {
                "value": "all",
                "label": "Split into Individual Pages",
                "description": "Each page becomes a separate PDF file"
            },
            {
                "value": "range",
                "label": "Split by Page Ranges",
                "description": "Specify custom page ranges (e.g., 1-3, 5, 7-10)"
            },
            {
                "value": "individual",
                "label": "Extract Individual Pages",
                "description": "Same as 'all' - each page becomes a separate file"
            }
        ]
    }