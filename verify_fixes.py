#!/usr/bin/env python3
"""
Verification script to check all fixes are working correctly
"""

import os
import sys
import subprocess
from pathlib import Path

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def check_file_exists(filepath, description):
    """Check if a file exists"""
    if os.path.exists(filepath):
        print(f"✅ {description}: EXISTS")
        return True
    else:
        print(f"❌ {description}: MISSING")
        return False

def check_ffmpeg():
    """Check if FFmpeg is installed"""
    try:
        result = subprocess.run(
            ['ffmpeg', '-version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            version = result.stdout.split('\n')[0]
            print(f"✅ FFmpeg installed: {version}")
            return True
        else:
            print("❌ FFmpeg check failed")
            return False
    except FileNotFoundError:
        print("❌ FFmpeg NOT installed")
        print("   Install FFmpeg to enable video/audio conversions")
        print("   See: backend/INSTALL_FFMPEG.md")
        return False
    except Exception as e:
        print(f"❌ FFmpeg check error: {e}")
        return False

def check_font_converter():
    """Check font converter configuration"""
    file_path = "backend/converters/font_converter.py"
    if not os.path.exists(file_path):
        print(f"❌ Font converter file not found: {file_path}")
        return False

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if EOT is removed from output formats
    if "'output': ['ttf', 'otf', 'woff', 'woff2']" in content:
        print("✅ Font converter: EOT removed from output formats")
        return True
    else:
        print("❌ Font converter: EOT still in output formats")
        return False

def check_format_mappings():
    """Check format mappings file"""
    file_path = "file/src/lib/formatMappings.ts"
    if not os.path.exists(file_path):
        print(f"❌ Format mappings file not found: {file_path}")
        return False

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if font formats are updated
    issues = []

    # Check for EOT removal from TTF/OTF/WOFF/WOFF2 outputs
    if "{ from: 'ttf', to: ['woff', 'woff2', 'otf']" in content:
        print("✅ Format mappings: TTF formats updated (EOT removed)")
    else:
        issues.append("TTF format mappings not updated")

    # Check for duplicate jpeg key
    if content.count("'jpeg': 'JPEG'") <= 1:
        print("✅ Format mappings: No duplicate keys")
    else:
        issues.append("Duplicate 'jpeg' key found")

    if issues:
        for issue in issues:
            print(f"❌ Format mappings: {issue}")
        return False

    return True

def check_tool_pages():
    """Check if tool page directories exist"""
    app_dir = "file/src/app"
    if not os.path.exists(app_dir):
        print(f"❌ App directory not found: {app_dir}")
        return False

    # Count directories
    dirs = [d for d in os.listdir(app_dir)
            if os.path.isdir(os.path.join(app_dir, d))
            and not d.startswith('.')
            and not d.startswith('_')]

    print(f"✅ Tool pages found: {len(dirs)} directories")

    # Check for some important converter pages
    important_pages = [
        'jpg-to-png', 'png-to-jpg', 'heic-to-jpg',
        'mp4-to-avi', 'avi-to-mp4', 'mov-to-mp4',
        'mp3-to-wav', 'wav-to-mp3', 'flac-to-mp3',
        'ttf-to-woff', 'ttf-to-woff2', 'otf-to-ttf',
        'docx-to-pdf', 'pdf-to-docx', 'pdf-to-jpg'
    ]

    missing = []
    for page in important_pages:
        page_path = os.path.join(app_dir, page)
        if not os.path.exists(page_path):
            missing.append(page)

    if missing:
        print(f"❌ Missing important pages: {', '.join(missing)}")
        return False
    else:
        print(f"✅ All important converter pages exist")
        return True

def main():
    print_header("FlipFileX Fixes Verification")

    results = {}

    # Check documentation files
    print_header("Documentation Files")
    results['ffmpeg_guide'] = check_file_exists(
        "backend/INSTALL_FFMPEG.md",
        "FFmpeg Installation Guide"
    )
    results['fixes_summary'] = check_file_exists(
        "FIXES_SUMMARY.md",
        "Fixes Summary (English)"
    )
    results['fixes_urdu'] = check_file_exists(
        "FIXES_URDU.md",
        "Fixes Summary (Urdu)"
    )

    # Check FFmpeg installation
    print_header("FFmpeg Check")
    results['ffmpeg'] = check_ffmpeg()

    # Check backend fixes
    print_header("Backend Fixes")
    results['font_converter'] = check_font_converter()

    # Check frontend fixes
    print_header("Frontend Fixes")
    results['format_mappings'] = check_format_mappings()
    results['tool_pages'] = check_tool_pages()

    # Summary
    print_header("Verification Summary")

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    print(f"\nPassed: {passed}/{total}")

    for check, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}: {check}")

    if not results.get('ffmpeg'):
        print("\n⚠️  WARNING: FFmpeg is not installed!")
        print("   Video and audio conversions will NOT work.")
        print("   Install FFmpeg using: backend/INSTALL_FFMPEG.md")

    print("\n" + "="*60)

    if passed == total:
        print("✅ All checks passed!")
        return 0
    else:
        print("❌ Some checks failed. Please review above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
