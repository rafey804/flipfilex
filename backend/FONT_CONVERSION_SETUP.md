# Font Conversion Setup Instructions

## Required Python Packages

To enable font conversion functionality, install the following packages:

```bash
# Core font manipulation library
pip install fonttools

# For WOFF2 compression (REQUIRED for WOFF2 conversions)
pip install brotli

# Optional: For better WOFF2 support
pip install zopfli
```

## Complete Installation

Install all font conversion dependencies at once:

```bash
pip install fonttools brotli zopfli
```

## Supported Conversions

Once installed, the following font conversions will work:

### Input Formats:
- TTF (TrueType Font)
- OTF (OpenType Font)
- WOFF (Web Open Font Format)
- WOFF2 (Web Open Font Format 2)
- EOT (Embedded OpenType)

### Output Formats:
- TTF
- OTF
- WOFF
- WOFF2 (requires `brotli`)
- SVG Font (basic support)

## Conversion Matrix

| From → To | TTF | OTF | WOFF | WOFF2 | EOT | SVG |
|-----------|-----|-----|------|-------|-----|-----|
| **TTF**   | ✅  | ✅  | ✅   | ✅*   | ✅  | ✅  |
| **OTF**   | ✅  | ✅  | ✅   | ✅*   | ✅  | ✅  |
| **WOFF**  | ✅  | ✅  | ✅   | ✅*   | ✅  | ✅  |
| **WOFF2** | ✅  | ✅  | ✅   | ✅*   | ✅  | ✅  |
| **EOT**   | ✅  | ✅  | ✅   | ✅*   | ❌  | ❌  |

*Requires `brotli` package

## Troubleshooting

### "WOFF2 conversion requires brotli library"

Install brotli:
```bash
pip install brotli
```

### "fontTools not available"

Install fonttools:
```bash
pip install fonttools
```

### Performance Issues

For better compression with WOFF formats:
```bash
pip install zopfli
```

## Verify Installation

Check if packages are installed:
```bash
python -c "import fontTools; print('fontTools:', fontTools.__version__)"
python -c "import brotli; print('brotli: OK')"
```

## Technical Details

### fontTools
- Pure Python library for font manipulation
- Handles TTF, OTF, WOFF formats natively
- Requires brotli for WOFF2 compression

### brotli
- Google's compression algorithm
- Required for WOFF2 format
- Provides better compression than gzip

### Conversion Method
The converter uses fontTools' TTFont class to:
1. Load source font
2. Set appropriate flavor (woff, woff2, or None)
3. Save to target format

Example:
```python
from fontTools.ttLib import TTFont

# Load font
font = TTFont('input.ttf')

# Convert to WOFF2
font.flavor = 'woff2'
font.save('output.woff2')
```

## Production Deployment

For production servers, install dependencies during deployment:

```bash
# In your deployment script or Dockerfile
pip install fonttools brotli zopfli

# Or use requirements.txt
pip install -r requirements_font.txt
```

## System Requirements

- Python 3.7+
- 50MB disk space for packages
- No external binaries required (pure Python)

## Alternative: System WOFF2 Tools (Optional)

If fontTools+brotli fails, install system tools:

**Ubuntu/Debian:**
```bash
sudo apt-get install woff2
```

**macOS:**
```bash
brew install woff2
```

**Windows:**
Download from: https://github.com/google/woff2/releases
