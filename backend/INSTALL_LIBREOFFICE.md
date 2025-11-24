# LibreOffice Installation Guide

LibreOffice is required for converting Office documents (Word, Excel, PowerPoint) to PDF.

## Windows Installation

### Option 1: Download from Official Website
1. Visit: https://www.libreoffice.org/download/download/
2. Download the latest version for Windows
3. Run the installer
4. Follow the installation wizard (use default options)
5. Restart the backend server after installation

### Option 2: Using Chocolatey (Package Manager)
```powershell
choco install libreoffice
```

### Option 3: Using winget
```powershell
winget install --id TheDocumentFoundation.LibreOffice
```

## Verify Installation

After installation, verify LibreOffice is accessible:

```bash
# Check if LibreOffice is installed
"C:\Program Files\LibreOffice\program\soffice.exe" --version
```

Or restart the backend and check the logs - it should show:
```
[OK] LibreOffice found: LibreOffice 7.x.x.x
```

## Supported Conversions with LibreOffice

Once installed, the following conversions will work:

### Word to PDF
- Input formats: DOCX, DOC
- Output: PDF
- Usage: `/convert/convert-document` with `conversion_type=word_to_pdf`

### Excel to PDF
- Input formats: XLSX, XLS, XLSM
- Output: PDF
- Usage: `/convert/convert-document` with `conversion_type=excel_to_pdf`

### PowerPoint to PDF
- Input formats: PPTX, PPT, PPTM
- Output: PDF
- Usage: `/convert/convert-document` with `conversion_type=powerpoint_to_pdf`

## Troubleshooting

### LibreOffice not detected after installation

If LibreOffice is installed but not detected:

1. **Restart the backend server** - The backend checks for LibreOffice on startup
2. **Check installation path** - Ensure LibreOffice is installed in one of these locations:
   - `C:\Program Files\LibreOffice\program\soffice.exe`
   - `C:\Program Files (x86)\LibreOffice\program\soffice.exe`
3. **Add to PATH** - Add LibreOffice to system PATH:
   - Right-click "This PC" → Properties → Advanced system settings
   - Environment Variables → System variables → Path → Edit
   - Add: `C:\Program Files\LibreOffice\program`
   - Restart terminal and backend

### Conversion fails with timeout

If conversions timeout:
- Increase timeout in `backend/converters/document_converter.py`
- Default is 300 seconds (5 minutes)
- Large documents may need more time

### Error: "convert to pdf failed"

Check that:
1. LibreOffice is properly installed
2. The input file is not corrupted
3. The input file format is supported
4. There's enough disk space for temporary files

## Testing

After installation, test with curl:

```bash
# Test Word to PDF conversion
curl -X POST http://localhost:8000/convert/convert-document \
  -F "file=@test.docx" \
  -F "conversion_type=word_to_pdf"
```

## Production Deployment

For production servers (Linux):

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y libreoffice

# CentOS/RHEL
sudo yum install -y libreoffice

# Docker
FROM python:3.9
RUN apt-get update && apt-get install -y libreoffice
```

## System Requirements

- Disk Space: ~500MB for LibreOffice installation
- RAM: Minimum 512MB available for document conversion
- OS: Windows 7+, Linux, macOS

## Alternative: Cloud Conversion Services

If LibreOffice cannot be installed, consider using cloud APIs:
- CloudConvert API
- Zamzar API
- ConvertAPI

Note: These require API keys and may have usage limits.
