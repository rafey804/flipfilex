# routers/contact_form.py - Handle contact form submissions
import os
import json
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, validator
from utils.config import UPLOAD_DIR

router = APIRouter()

# Data model for contact form
class ContactFormData(BaseModel):
    name: str
    email: EmailStr
    category: str
    subject: str
    message: str
    timestamp: Optional[datetime] = None

    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    @validator('subject')
    def subject_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Subject cannot be empty')
        return v.strip()

    @validator('message')
    def message_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Message cannot be empty')
        return v.strip()

    @validator('category')
    def category_must_be_valid(cls, v):
        valid_categories = [
            'general', 'technical_support', 'feature_request',
            'bug_report', 'business_inquiry', 'feedback'
        ]
        if v not in valid_categories:
            raise ValueError(f'Category must be one of: {", ".join(valid_categories)}')
        return v

# Ensure contact_forms directory exists
CONTACT_FORMS_DIR = os.path.join(os.path.dirname(UPLOAD_DIR), "contact_forms")
os.makedirs(CONTACT_FORMS_DIR, exist_ok=True)

def save_contact_form(form_data: ContactFormData) -> str:
    """Save contact form data to JSON file and return submission ID"""
    try:
        # Generate submission ID based on timestamp
        timestamp = datetime.now()
        submission_id = f"contact_{timestamp.strftime('%Y%m%d_%H%M%S_%f')[:-3]}"

        # Add timestamp to form data
        form_data.timestamp = timestamp

        # Save to JSON file
        file_path = os.path.join(CONTACT_FORMS_DIR, f"{submission_id}.json")
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(form_data.dict(), f, indent=2, default=str, ensure_ascii=False)

        return submission_id
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save contact form: {str(e)}")

@router.post("/contact-form")
async def submit_contact_form(
    name: str = Form(...),
    email: str = Form(...),
    category: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...)
):
    """Handle contact form submission"""
    try:
        # Create form data object
        form_data = ContactFormData(
            name=name,
            email=email,
            category=category,
            subject=subject,
            message=message
        )

        # Save the form data
        submission_id = save_contact_form(form_data)

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Thank you for your message! We'll get back to you within 24 hours.",
                "submission_id": submission_id,
                "timestamp": form_data.timestamp.isoformat()
            }
        )

    except ValueError as e:
        # Validation error
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "error": "Validation error",
                "message": str(e)
            }
        )
    except Exception as e:
        # Other errors
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Server error",
                "message": "Unable to process your request. Please try again later."
            }
        )

@router.get("/contact-forms")
async def list_contact_forms():
    """List all contact form submissions (for admin use)"""
    try:
        forms = []
        if os.path.exists(CONTACT_FORMS_DIR):
            for filename in os.listdir(CONTACT_FORMS_DIR):
                if filename.endswith('.json'):
                    file_path = os.path.join(CONTACT_FORMS_DIR, filename)
                    with open(file_path, 'r', encoding='utf-8') as f:
                        form_data = json.load(f)
                        forms.append({
                            "id": filename.replace('.json', ''),
                            "name": form_data.get('name'),
                            "email": form_data.get('email'),
                            "category": form_data.get('category'),
                            "subject": form_data.get('subject'),
                            "timestamp": form_data.get('timestamp'),
                            "preview": form_data.get('message', '')[:100] + "..." if len(form_data.get('message', '')) > 100 else form_data.get('message', '')
                        })

        # Sort by timestamp, newest first
        forms.sort(key=lambda x: x.get('timestamp', ''), reverse=True)

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "count": len(forms),
                "forms": forms
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Failed to retrieve contact forms",
                "message": str(e)
            }
        )

@router.get("/contact-forms/{submission_id}")
async def get_contact_form(submission_id: str):
    """Get a specific contact form submission"""
    try:
        file_path = os.path.join(CONTACT_FORMS_DIR, f"{submission_id}.json")

        if not os.path.exists(file_path):
            return JSONResponse(
                status_code=404,
                content={
                    "success": False,
                    "error": "Contact form not found"
                }
            )

        with open(file_path, 'r', encoding='utf-8') as f:
            form_data = json.load(f)

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "form": form_data
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Failed to retrieve contact form",
                "message": str(e)
            }
        )