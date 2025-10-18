# 🚀 Hostinger VPS Deployment Guide - AI Image Generator Fix

## Problem
- ✅ Video Script Generator working
- ❌ AI Image Generator showing "Failed to fetch" error

## Solution: Complete VPS Update

### Step 1: SSH into Your Hostinger VPS

```bash
ssh your-username@your-vps-ip
```

### Step 2: Navigate to Your Project

```bash
cd /path/to/your/project
# Example: cd /var/www/flipfilex/backend
```

### Step 3: Pull Latest Code (If Using Git)

```bash
git pull origin main
```

**OR** manually upload these files to VPS:
- `backend/converters/ai_image_generator.py` (UPDATED - uses gemini-2.5-flash)
- `backend/routers/ai_image_generator.py`

### Step 4: Activate Virtual Environment

```bash
cd backend
source venv/bin/activate
```

### Step 5: Install/Upgrade ALL Required Packages

```bash
# Upgrade pip first
pip install --upgrade pip

# Install missing email-validator (CRITICAL!)
pip install email-validator

# Upgrade Google AI package for image generator
pip install --upgrade google-generativeai

# Install/upgrade all other packages
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
    numpy-stl \
    ezdxf \
    pydantic
```

### Step 6: Verify Installation

```bash
# Check if email-validator is installed
pip show email-validator

# Check if google-generativeai is updated
pip show google-generativeai
```

### Step 7: Restart Backend Server

**Option A: If using PM2**
```bash
pm2 restart backend
pm2 logs backend  # Check for any errors
```

**Option B: If using systemd**
```bash
sudo systemctl restart backend
sudo systemctl status backend
```

**Option C: If running manually**
```bash
# Kill old process
pkill -f uvicorn

# Start new server
cd /path/to/your/project/backend
source venv/bin/activate
nohup python -m uvicorn main:app --host 0.0.0.0 --port 8000 > logs/backend.log 2>&1 &
```

### Step 8: Test the API

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test AI Image Generator
curl -X POST "http://localhost:8000/ai/generate-image" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "style": "realistic",
    "size": "landscape",
    "num_images": 1
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Image generation guidance created successfully",
  "data": {
    "prompt": "A beautiful sunset over mountains",
    "enhanced_prompt": "...",
    ...
  }
}
```

### Step 9: Test from Browser

Go to: `https://flipfilex.com/ai-image-generator`

Fill in the form and click "Generate Image Guidance"

---

## 🔧 Quick One-Liner Commands (Copy-Paste)

```bash
# Complete update in one go
cd /var/www/flipfilex/backend && \
source venv/bin/activate && \
pip install --upgrade pip && \
pip install email-validator && \
pip install --upgrade google-generativeai fastapi uvicorn pydantic && \
pm2 restart backend && \
pm2 logs backend
```

---

## 📝 Common Issues & Fixes

### Issue 1: "email_validator module not found"
```bash
pip install email-validator
pm2 restart backend
```

### Issue 2: "404 Not Found" for AI endpoints
```bash
# Check if routes are registered
curl http://localhost:8000/health | grep -i "ai"

# If not showing, restart server
pm2 restart backend --update-env
```

### Issue 3: "Gemini API error"
```bash
# Update google-generativeai
pip install --upgrade google-generativeai

# Verify installation
python -c "import google.generativeai as genai; print(genai.__version__)"
```

### Issue 4: Server not restarting
```bash
# Force kill and restart
pm2 delete backend
cd /var/www/flipfilex/backend
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name backend
pm2 save
```

---

## ✅ Verification Checklist

- [ ] SSH into VPS successful
- [ ] Latest code pulled/uploaded
- [ ] email-validator installed
- [ ] google-generativeai upgraded
- [ ] All packages installed
- [ ] Backend server restarted
- [ ] Health endpoint working
- [ ] AI Image Generator endpoint returns success
- [ ] Frontend form works without "Failed to fetch"

---

## 🆘 Still Not Working?

Check backend logs:
```bash
# PM2 logs
pm2 logs backend --lines 100

# OR systemd logs
sudo journalctl -u backend -f

# OR manual log file
tail -f /var/www/flipfilex/backend/logs/backend.log
```

Look for errors related to:
- Import errors
- Module not found
- API key issues
- Port binding issues

---

## 📞 Support

If you encounter any issues, check:
1. Backend logs for specific error messages
2. Nginx/Apache logs if using reverse proxy
3. Firewall settings (port 8000 should be open)
4. Python version (should be 3.8+)

---

**Last Updated:** 2025-10-18
**Version:** 1.0
