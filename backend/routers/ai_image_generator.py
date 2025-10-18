"""
FastAPI Router for AI Image Generator
Handles image generation requests using Google Gemini API
"""

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
import logging

from converters.ai_image_generator import (
    generate_ai_image,
    get_style_options,
    get_size_options
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


# Request Models
class ImageGenerationRequest(BaseModel):
    """Request model for image generation"""
    prompt: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="Text description of the image to generate"
    )
    style: Literal[
        "realistic",
        "artistic",
        "digital_art",
        "anime",
        "3d_render",
        "watercolor",
        "sketch",
        "fantasy"
    ] = Field(
        default="realistic",
        description="Image style preset"
    )
    size: Literal[
        "square_small",
        "square_medium",
        "portrait",
        "landscape",
        "wide"
    ] = Field(
        default="square_medium",
        description="Image size"
    )
    negative_prompt: Optional[str] = Field(
        None,
        max_length=500,
        description="What to avoid in the image"
    )
    num_images: int = Field(
        default=1,
        ge=1,
        le=4,
        description="Number of images to generate (1-4)"
    )

    @validator('prompt')
    def validate_prompt(cls, v):
        """Validate prompt is not empty"""
        if not v or not v.strip():
            raise ValueError('Prompt cannot be empty')
        return v.strip()

    class Config:
        schema_extra = {
            "example": {
                "prompt": "A majestic mountain landscape at sunset with snow-capped peaks and a crystal clear lake",
                "style": "realistic",
                "size": "landscape",
                "negative_prompt": "blurry, low quality, distorted",
                "num_images": 1
            }
        }


# API Endpoints
@router.post("/generate-image",
             summary="Generate AI Image",
             description="Generate images from text descriptions using AI",
             response_description="Generated image data and metadata")
async def create_ai_image(request: ImageGenerationRequest):
    """
    Generate AI image from text description

    - **prompt**: Detailed description of the image you want to create
    - **style**: Choose from realistic, artistic, digital_art, anime, 3d_render, watercolor, sketch, fantasy
    - **size**: Image dimensions (square_small, square_medium, portrait, landscape, wide)
    - **negative_prompt**: Optional - things to avoid in the image
    - **num_images**: Number of variations to generate (1-4)
    """
    try:
        logger.info(f"Received image generation request for: {request.prompt[:50]}...")

        # Generate image
        result = generate_ai_image(
            prompt=request.prompt,
            style=request.style,
            size=request.size,
            negative_prompt=request.negative_prompt,
            num_images=request.num_images
        )

        if not result.get("success", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Image generation failed")
            )

        response_data = {
            "success": True,
            "message": "Image generation guidance created successfully",
            "data": {
                "prompt": result["prompt"],
                "enhanced_prompt": result["enhanced_prompt"],
                "style": result["style"],
                "size": result["size"],
                "num_images": result["num_images"],
                "metadata": result["metadata"],
                "recommendations": result["recommendations"],
                "note": result.get("message", "")
            },
            "timestamp": None
        }

        logger.info("Image generation request completed successfully")
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=response_data
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in image generation endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/style-options",
            summary="Get Style Options",
            description="Get all available image style presets",
            response_description="List of available styles")
async def get_styles():
    """
    Get all available image style options

    Returns descriptions and modifiers for each style preset
    """
    try:
        styles = get_style_options()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "data": {
                    "styles": styles,
                    "count": len(styles)
                }
            }
        )
    except Exception as e:
        logger.error(f"Error fetching style options: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/size-options",
            summary="Get Size Options",
            description="Get all available image size options",
            response_description="List of available sizes")
async def get_sizes():
    """
    Get all available image size options

    Returns dimensions and labels for each size option
    """
    try:
        sizes = get_size_options()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "data": {
                    "sizes": sizes,
                    "count": len(sizes)
                }
            }
        )
    except Exception as e:
        logger.error(f"Error fetching size options: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/health",
            summary="Health Check",
            description="Check if the AI Image Generator service is running",
            response_description="Health status")
async def health_check():
    """Check if the AI Image Generator service is healthy"""
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "service": "AI Image Generator",
            "status": "healthy",
            "message": "Service is running"
        }
    )
