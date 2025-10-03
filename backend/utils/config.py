# utils/config.py - CORRECTED Configuration with video support
import os

# Configuration - UPDATED for video support
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024  # FIXED: 5GB for videos (was 50MB)
MAX_IMAGE_SIZE = 100 * 1024 * 1024  # 100MB for images
MAX_DOCUMENT_SIZE = 50 * 1024 * 1024  # 50MB for documents
MAX_AUDIO_SIZE = 200 * 1024 * 1024  # 200MB for audio

# File type specific configurations
ALLOWED_PDF_TYPES = ["application/pdf"]
ALLOWED_WORD_TYPES = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword"
]

# Video file configurations
ALLOWED_VIDEO_TYPES = [
    "video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska",
    "video/webm", "video/x-ms-wmv", "video/x-flv", "video/mpeg"
]

# Rate limiting - ADJUSTED for larger files
RATE_LIMIT = 40  # Reduced for video files (requests per window)
RATE_WINDOW = 300  # Increased to 5 minutes for video processing

# Conversion timeouts - ADDED for different file types
CONVERSION_TIMEOUTS = {
    'video': 1800,  # 30 minutes for video
    'image': 300,   # 5 minutes for image
    'document': 600,  # 10 minutes for document
    'audio': 300    # 5 minutes for audio
}

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# FFmpeg configuration - ADDED
FFMPEG_PATH = None  # Will be detected automatically
FFMPEG_THREADS = 0  # Use all available cores

# Quality presets for video conversion
VIDEO_QUALITY_PRESETS = {
    'high': {'crf': 18, 'preset': 'medium'},
    'medium': {'crf': 23, 'preset': 'fast'},
    'low': {'crf': 28, 'preset': 'veryfast'},
    'web': {'crf': 25, 'preset': 'fast'}
}