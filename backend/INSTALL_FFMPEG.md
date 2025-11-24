# FFmpeg Installation Guide

FFmpeg is required for audio and video conversion functionality.

## Error Message
If you see this error:
```
FFmpeg not available. Please install FFmpeg to enable video conversion.
```

This means FFmpeg is not installed or not in your system PATH.

## Installation Instructions

### Windows

#### Option 1: Using Chocolatey (Recommended)
1. Open PowerShell as Administrator
2. Install Chocolatey if not already installed:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```
3. Install FFmpeg:
   ```powershell
   choco install ffmpeg
   ```

#### Option 2: Manual Installation
1. Download FFmpeg from: https://www.gyan.dev/ffmpeg/builds/
2. Download the "ffmpeg-release-essentials.zip" file
3. Extract to `C:\ffmpeg`
4. Add to PATH:
   - Right-click "This PC" → Properties
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System Variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\ffmpeg\bin`
   - Click OK on all dialogs
5. Restart your terminal/command prompt

#### Option 3: Using Scoop
```powershell
scoop install ffmpeg
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

### Linux (CentOS/RHEL)
```bash
sudo yum install epel-release
sudo yum install ffmpeg
```

### macOS
```bash
brew install ffmpeg
```

## Verify Installation

After installation, verify FFmpeg is working:

```bash
ffmpeg -version
```

You should see FFmpeg version information.

## Restart Backend Server

After installing FFmpeg, restart your backend server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Supported Conversions

Once FFmpeg is installed, the following conversions will work:

### Video Formats
- MP4, MOV, AVI, MKV, WebM, WMV, FLV, MPEG
- Codec formats: H.264, H.265/HEVC, x264, x265

### Audio Formats
- MP3, WAV, FLAC, AAC, M4A, OGG, Opus, WMA

## Troubleshooting

### FFmpeg not found after installation
- Make sure FFmpeg is in your system PATH
- Restart your terminal/command prompt
- Restart your IDE/editor
- Restart your computer if necessary

### Permission Issues (Linux/Mac)
```bash
sudo chmod +x /usr/local/bin/ffmpeg
```

### Windows PATH Not Working
- Verify the PATH variable includes the FFmpeg bin directory
- Use the full path: `C:\ffmpeg\bin\ffmpeg.exe -version`
- Restart your computer

## Additional Help

For more information:
- FFmpeg Official Website: https://ffmpeg.org/
- FFmpeg Documentation: https://ffmpeg.org/documentation.html
- Windows Builds: https://www.gyan.dev/ffmpeg/builds/
