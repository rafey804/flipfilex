from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
import string
import random
import json
import os
from datetime import datetime

router = APIRouter()

# Simple JSON file-based storage (you can replace with a real database later)
STORAGE_FILE = "shortened_urls.json"

class URLCreate(BaseModel):
    original_url: HttpUrl
    custom_alias: Optional[str] = None

class URLResponse(BaseModel):
    original: str
    shortened: str
    clicks: int
    created: str

class URLStats(BaseModel):
    original: str
    shortened: str
    clicks: int
    created: str
    short_code: str

# Helper functions
def load_urls():
    """Load URLs from storage file"""
    if not os.path.exists(STORAGE_FILE):
        return {}
    try:
        with open(STORAGE_FILE, 'r') as f:
            return json.load(f)
    except:
        return {}

def save_urls(urls_data):
    """Save URLs to storage file"""
    with open(STORAGE_FILE, 'w') as f:
        json.dump(urls_data, f, indent=2)

def generate_short_code(length=6):
    """Generate a random short code"""
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def is_code_available(code, urls_data):
    """Check if a short code is available"""
    return code not in urls_data

# API Endpoints

@router.post("/shorten", response_model=URLResponse)
async def shorten_url(url_data: URLCreate):
    """Create a shortened URL"""
    urls_data = load_urls()

    # Determine short code
    if url_data.custom_alias:
        # Validate custom alias
        if not url_data.custom_alias.replace('-', '').replace('_', '').isalnum():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Custom alias can only contain letters, numbers, hyphens, and underscores"
            )

        if not is_code_available(url_data.custom_alias, urls_data):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This custom alias is already taken"
            )

        short_code = url_data.custom_alias
    else:
        # Generate random short code
        short_code = generate_short_code()
        attempts = 0
        while not is_code_available(short_code, urls_data) and attempts < 10:
            short_code = generate_short_code()
            attempts += 1

        if attempts >= 10:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate unique short code"
            )

    # Store the URL mapping
    urls_data[short_code] = {
        "original": str(url_data.original_url),
        "clicks": 0,
        "created": datetime.now().strftime("%d/%m/%Y")
    }
    save_urls(urls_data)

    return URLResponse(
        original=str(url_data.original_url),
        shortened=f"https://flipfilex.com/{short_code}",
        clicks=0,
        created=urls_data[short_code]["created"]
    )

@router.get("/redirect/{short_code}")
async def get_redirect_url(short_code: str):
    """Get the original URL for a short code"""
    urls_data = load_urls()

    if short_code not in urls_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Short URL not found"
        )

    # Increment click count
    urls_data[short_code]["clicks"] += 1
    save_urls(urls_data)

    return {
        "original_url": urls_data[short_code]["original"],
        "clicks": urls_data[short_code]["clicks"]
    }

@router.get("/stats/{short_code}", response_model=URLStats)
async def get_url_stats(short_code: str):
    """Get statistics for a shortened URL"""
    urls_data = load_urls()

    if short_code not in urls_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Short URL not found"
        )

    url_info = urls_data[short_code]
    return URLStats(
        original=url_info["original"],
        shortened=f"https://flipfilex.com/{short_code}",
        clicks=url_info["clicks"],
        created=url_info["created"],
        short_code=short_code
    )

@router.get("/list", response_model=List[URLStats])
async def list_all_urls():
    """List all shortened URLs (for debugging/admin purposes)"""
    urls_data = load_urls()

    result = []
    for short_code, url_info in urls_data.items():
        result.append(URLStats(
            original=url_info["original"],
            shortened=f"https://flipfilex.com/{short_code}",
            clicks=url_info["clicks"],
            created=url_info["created"],
            short_code=short_code
        ))

    return result

@router.delete("/{short_code}")
async def delete_shortened_url(short_code: str):
    """Delete a shortened URL"""
    urls_data = load_urls()

    if short_code not in urls_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Short URL not found"
        )

    del urls_data[short_code]
    save_urls(urls_data)

    return {"message": "Short URL deleted successfully"}
