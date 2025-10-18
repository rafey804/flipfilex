"""
Video Script Writer Router
API endpoints for AI-powered video script generation
"""

from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, Literal
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from converters.video_script_writer import generate_video_script, refine_video_script

router = APIRouter()

# Request Models
class ScriptGenerationRequest(BaseModel):
    topic: str = Field(..., description="Video topic or subject", min_length=3, max_length=500)
    duration: int = Field(..., description="Video duration in minutes", ge=1, le=60)
    tone: Literal["professional", "casual", "humorous", "educational", "motivational", "storytelling"] = Field(
        ...,
        description="Tone of the video script"
    )
    platform: Literal["youtube", "instagram", "tiktok", "facebook", "linkedin"] = Field(
        ...,
        description="Target platform for the video"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "topic": "How to Start a Successful YouTube Channel in 2025",
                "duration": 5,
                "tone": "educational",
                "platform": "youtube"
            }
        }


class ScriptRefinementRequest(BaseModel):
    original_script: str = Field(..., description="Original script to refine", min_length=10)
    refinement_request: str = Field(..., description="What to change or improve", min_length=5, max_length=500)

    class Config:
        json_schema_extra = {
            "example": {
                "original_script": "[Original script text here...]",
                "refinement_request": "Make the hook more engaging and add more humor"
            }
        }


# API Endpoints
@router.post("/generate-script")
async def create_video_script(request: ScriptGenerationRequest):
    """
    Generate a professional video script using AI

    **Parameters:**
    - topic: What the video is about
    - duration: How long the video should be (1-60 minutes)
    - tone: The style/mood of the script
    - platform: Where the video will be published

    **Returns:**
    - Complete video script with timestamps
    - Visual and music cues
    - Thumbnail suggestions
    - SEO keywords
    - Metadata
    """

    try:
        # Generate the script
        result = generate_video_script(
            topic=request.topic,
            duration=request.duration,
            tone=request.tone,
            platform=request.platform
        )

        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Failed to generate script")
            )

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Video script generated successfully",
                "data": {
                    "script": result["script"],
                    "metadata": result["metadata"]
                }
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while generating the script: {str(e)}"
        )


@router.post("/refine-script")
async def refine_script(request: ScriptRefinementRequest):
    """
    Refine or modify an existing video script

    **Parameters:**
    - original_script: The script to refine
    - refinement_request: Specific changes to make

    **Returns:**
    - Refined script with requested modifications
    """

    try:
        # Refine the script
        result = refine_video_script(
            original_script=request.original_script,
            refinement_request=request.refinement_request
        )

        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Failed to refine script")
            )

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Script refined successfully",
                "data": {
                    "refined_script": result["refined_script"],
                    "refinement_applied": result["refinement_applied"]
                }
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while refining the script: {str(e)}"
        )


@router.get("/script-options")
async def get_script_options():
    """
    Get available options for script generation

    **Returns:**
    - Available tones
    - Available platforms
    - Duration recommendations
    - Tips for best results
    """

    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "data": {
                "tones": {
                    "professional": {
                        "name": "Professional",
                        "description": "Formal, data-driven, authoritative",
                        "best_for": "Corporate, B2B, Educational institutions"
                    },
                    "casual": {
                        "name": "Casual",
                        "description": "Friendly, relatable, conversational",
                        "best_for": "Lifestyle, Personal vlogs, Entertainment"
                    },
                    "humorous": {
                        "name": "Humorous",
                        "description": "Jokes, puns, light-hearted",
                        "best_for": "Comedy, Entertainment, Viral content"
                    },
                    "educational": {
                        "name": "Educational",
                        "description": "Step-by-step, clear teaching style",
                        "best_for": "Tutorials, How-to, Courses"
                    },
                    "motivational": {
                        "name": "Motivational",
                        "description": "Inspiring, energetic, empowering",
                        "best_for": "Self-help, Fitness, Success stories"
                    },
                    "storytelling": {
                        "name": "Storytelling",
                        "description": "Narrative structure, emotional",
                        "best_for": "Documentaries, Brand stories, Case studies"
                    }
                },
                "platforms": {
                    "youtube": {
                        "name": "YouTube",
                        "optimal_duration": "8-15 minutes",
                        "characteristics": "Longer form, detailed, SEO-focused"
                    },
                    "instagram": {
                        "name": "Instagram",
                        "optimal_duration": "30-90 seconds",
                        "characteristics": "Short, punchy, visually driven"
                    },
                    "tiktok": {
                        "name": "TikTok",
                        "optimal_duration": "15-60 seconds",
                        "characteristics": "Ultra-short, hook-first, trend-aware"
                    },
                    "facebook": {
                        "name": "Facebook",
                        "optimal_duration": "1-3 minutes",
                        "characteristics": "Community-focused, shareable"
                    },
                    "linkedin": {
                        "name": "LinkedIn",
                        "optimal_duration": "2-5 minutes",
                        "characteristics": "Professional, value-driven, insights"
                    }
                },
                "tips": [
                    "Be specific with your topic for better results",
                    "Match tone to your target audience",
                    "Consider platform-specific best practices",
                    "Scripts work best when topic is clear and focused",
                    "Review and customize the generated script for your style",
                    "Use visual and music cues as editing guides",
                    "Test different tones for the same topic",
                    "Shorter videos often perform better on social media"
                ]
            }
        }
    )


# Health check endpoint
@router.get("/health")
async def health_check():
    """Check if the video script writer service is operational"""
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "service": "Video Script Writer",
            "status": "operational"
        }
    )
