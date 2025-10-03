# FlipFileX - Free Online File Converter

🚀 **200+ Free Online Tools for File Conversion**

FlipFileX is a comprehensive online platform offering 200+ free tools for converting files between different formats including PDF, Images, Audio, Video, Documents, and more.

## 🌟 Features

### Document Conversion
- **PDF Tools**: PDF to Word, Word to PDF, Merge PDF, Split PDF, Compress PDF
- **Image Conversion**: HEIC to JPG, WebP to PNG, AVIF to PNG, SVG to PNG
- **Audio Conversion**: WAV to MP3, FLAC to MP3, AAC to MP3
- **Video Conversion**: MP4 to MOV, AVI to MP4, WebM to MP4
- **Font Conversion**: TTF to OTF, WOFF to TTF, OTF to WOFF2

### Utility Tools
- 🎨 QR Code Generator
- 🔐 Password Generator
- 🔗 URL Shortener
- 📊 Base64 Encoder/Decoder
- 🎨 Color Palette Generator
- 📝 OCR Text Extraction
- 📄 Resume Builder
- 🧾 Invoice Generator

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 with Turbopack
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **UI**: React 19.1.0

### Backend
- **Framework**: FastAPI 3.0.0
- **Language**: Python 3.11+
- **File Processing**: PIL, FFmpeg, LibreOffice, Poppler, ImageMagick
- **Server**: Uvicorn ASGI

## 📦 Installation

### Prerequisites
- Node.js 20+
- Python 3.11+
- FFmpeg
- ImageMagick
- Poppler Utils
- LibreOffice (optional for document conversion)

### Frontend Setup

```bash
cd file
npm install
npm run dev
```

Frontend runs on: http://localhost:3004

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs on: http://localhost:8000

## 🚀 Production Build

```bash
# Frontend
cd file
npm run build
npm start

# Backend
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions for VPS hosting.

## 📊 SEO Features

- ✅ Complete meta tags and Open Graph
- ✅ Structured data (Schema.org)
- ✅ Dynamic sitemap.xml
- ✅ robots.txt configuration
- ✅ Google Analytics integration
- ✅ Mobile-responsive design
- ✅ PWA ready

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
MAX_FILE_SIZE=104857600
UPLOAD_DIR=uploads
CORS_ORIGINS=http://localhost:3004
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Rafey-ul-din**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!

## 📞 Contact

- Website: https://flipfilex.com
- Email: support@flipfilex.com

---

Made with ❤️ by Rafey-ul-din
