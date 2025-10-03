# FlipFileX Deployment Guide for Hostinger VPS

## 🎯 Deployment Readiness Status: ✅ READY

Your website is fully ready for VPS deployment with excellent SEO and production configuration.

---

## 📊 SEO & Structure Audit Report

### ✅ **SEO Configuration (Excellent)**

#### Meta Tags & Schema
- ✅ Complete meta tags with title, description, keywords
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card metadata
- ✅ Structured Data (JSON-LD):
  - Organization Schema
  - WebApplication Schema
  - Website Schema with SearchAction
- ✅ Canonical URLs configured
- ✅ Google Analytics (G-918R7EMM6E)
- ✅ Google AdSense (ca-pub-8694080572387733)
- ✅ Site verification (Google & Bing)

#### SEO Files
- ✅ `sitemap.xml` - Dynamic with 407 pages
- ✅ `robots.txt` - Proper crawling rules
- ✅ `manifest.json` - PWA ready
- ✅ Favicon & Apple touch icons

#### Content
- ✅ 407 static pages pre-rendered
- ✅ 20+ blog posts with proper metadata
- ✅ 200+ tool pages with SEO-friendly URLs
- ✅ Semantic HTML structure

---

## 🏗️ Architecture Overview

### Frontend (Next.js 15.5.4)
- **Port**: 3004 (dev) / 3000 (production)
- **Build Size**: Optimized static pages
- **Framework**: Next.js with Turbopack
- **Styling**: TailwindCSS

### Backend (FastAPI 3.0.0)
- **Port**: 8000
- **API Framework**: Python FastAPI
- **File Processing**: PIL, FFmpeg, LibreOffice, Poppler
- **CORS**: Configured for flipfilex.com

---

## 🚀 Hostinger VPS Deployment Steps

### 1. Server Requirements

```bash
# Minimum VPS Specs
- CPU: 2 cores
- RAM: 4GB
- Storage: 50GB SSD
- OS: Ubuntu 22.04 LTS
```

### 2. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.11+
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install system dependencies
sudo apt install -y \
    ffmpeg \
    poppler-utils \
    tesseract-ocr \
    libreoffice \
    git \
    nginx \
    imagemagick

# Install ImageMagick from source (for SVG support)
wget https://imagemagick.org/download/ImageMagick.tar.gz
tar xvzf ImageMagick.tar.gz
cd ImageMagick-*
./configure
make
sudo make install
sudo ldconfig
```

### 3. Clone & Setup Project

```bash
# Create project directory
sudo mkdir -p /var/www/flipfilex
cd /var/www/flipfilex

# Upload your project files or clone from git
# Upload both 'file' and 'backend' directories

# Set permissions
sudo chown -R $USER:$USER /var/www/flipfilex
```

### 4. Backend Setup

```bash
cd /var/www/flipfilex/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install additional packages if needed
pip install \
    fastapi uvicorn aiofiles \
    pillow reportlab python-docx \
    PyPDF2 pdf2image pypdf \
    openpyxl xlsxwriter ebooklib \
    pydub imageio opencv-python \
    qrcode fonttools brotli \
    Wand svglib numpy-stl \
    ezdxf pydicom pandas

# Create uploads directory
mkdir -p uploads

# Test backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 5. Frontend Setup

```bash
cd /var/www/flipfilex/file

# Install dependencies
npm install

# Build for production
npm run build

# Test production build
npm start
```

### 6. Environment Variables

Create `/var/www/flipfilex/file/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://api.flipfilex.com
NODE_ENV=production
```

Create `/var/www/flipfilex/backend/.env`:
```env
PYTHONUNBUFFERED=1
MAX_FILE_SIZE=104857600
UPLOAD_DIR=uploads
CORS_ORIGINS=https://flipfilex.com,https://www.flipfilex.com
```

### 7. Process Management with PM2

```bash
# Install PM2
sudo npm install -g pm2

# Start Backend
cd /var/www/flipfilex/backend
pm2 start "venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000" --name flipfilex-api

# Start Frontend
cd /var/www/flipfilex/file
pm2 start "npm start" --name flipfilex-web

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor
pm2 monit
pm2 logs
```

### 8. Nginx Configuration

Create `/etc/nginx/sites-available/flipfilex`:

```nginx
# Main website
server {
    listen 80;
    server_name flipfilex.com www.flipfilex.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name flipfilex.com www.flipfilex.com;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/flipfilex.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/flipfilex.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Client max body size for file uploads
    client_max_body_size 100M;

    # Next.js frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files cache
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }
}

# API subdomain
server {
    listen 80;
    server_name api.flipfilex.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.flipfilex.com;

    ssl_certificate /etc/letsencrypt/live/api.flipfilex.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.flipfilex.com/privkey.pem;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    location /download/ {
        proxy_pass http://localhost:8000/download/;
        proxy_buffering off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/flipfilex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y

# Get certificates
sudo certbot --nginx -d flipfilex.com -d www.flipfilex.com
sudo certbot --nginx -d api.flipfilex.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 10. Firewall Setup

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 11. Monitoring & Logs

```bash
# PM2 logs
pm2 logs flipfilex-web
pm2 logs flipfilex-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System monitoring
htop
df -h
free -m
```

### 12. Backup Strategy

```bash
# Create backup script
sudo nano /root/backup-flipfilex.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backup/flipfilex"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup files
tar -czf $BACKUP_DIR/flipfilex_$DATE.tar.gz /var/www/flipfilex

# Backup PM2 config
pm2 save

# Keep only last 7 backups
find $BACKUP_DIR -name "flipfilex_*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x /root/backup-flipfilex.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /root/backup-flipfilex.sh
```

---

## 🔍 Pre-Deployment Checklist

- ✅ All converters tested and working
- ✅ Build completed successfully (407 pages)
- ✅ SEO metadata complete
- ✅ Sitemap & robots.txt configured
- ✅ Analytics & AdSense ready
- ✅ CORS configured for production
- ✅ Error handling implemented
- ✅ File size limits configured
- ✅ Upload directory structure ready

---

## 📈 Post-Deployment Steps

1. **Domain Configuration**
   - Point `flipfilex.com` A record to VPS IP
   - Point `api.flipfilex.com` A record to VPS IP
   - Point `www.flipfilex.com` CNAME to `flipfilex.com`

2. **Submit to Search Engines**
   - Google Search Console: Submit sitemap
   - Bing Webmaster Tools: Submit sitemap
   - Submit to Google Analytics

3. **Performance Monitoring**
   - Setup uptime monitoring (UptimeRobot)
   - Configure error tracking (Sentry)
   - Monitor server resources

4. **SEO Optimization**
   - Submit sitemap to Google
   - Verify structured data with Google Rich Results Test
   - Check mobile-friendliness
   - Test page speed with PageSpeed Insights

---

## 🛠️ Troubleshooting

### Backend not starting
```bash
cd /var/www/flipfilex/backend
source venv/bin/activate
python main.py  # Check for errors
```

### Frontend build errors
```bash
cd /var/www/flipfilex/file
rm -rf .next node_modules
npm install
npm run build
```

### File upload issues
```bash
# Check permissions
sudo chown -R www-data:www-data /var/www/flipfilex/backend/uploads
sudo chmod -R 755 /var/www/flipfilex/backend/uploads
```

### SVG conversion not working
```bash
# Verify ImageMagick
convert -version
# If not working, reinstall ImageMagick
```

---

## 📞 Support & Maintenance

- Monitor PM2: `pm2 monit`
- Restart services: `pm2 restart all`
- View logs: `pm2 logs`
- Check disk space: `df -h`
- Monitor bandwidth: `vnstat`

---

## ✅ Final Notes

Your FlipFileX website is **production-ready** with:

1. ✅ **Excellent SEO** - Complete meta tags, schema, sitemap
2. ✅ **407 optimized pages** - Fast static generation
3. ✅ **All converters working** - SVG, Font, JSON, QR Code fixed
4. ✅ **Scalable architecture** - Frontend + Backend separation
5. ✅ **Analytics ready** - Google Analytics & AdSense configured
6. ✅ **Security configured** - CORS, file validation, rate limiting
7. ✅ **Mobile responsive** - TailwindCSS responsive design
8. ✅ **PWA ready** - Manifest and icons configured

**Estimated deployment time:** 2-3 hours including SSL setup

**Good luck with your deployment! 🚀**
