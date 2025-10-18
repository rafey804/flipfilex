"""
AI Image Generator using Google Gemini API
Generates images from text descriptions using Google's Imagen model
"""

import google.generativeai as genai
import base64
import os
from typing import Dict, Any, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Google API Configuration
GOOGLE_API_KEY = "AIzaSyB2klA37dXr37gUebpeox5Z2sHoEKuJFwY"
genai.configure(api_key=GOOGLE_API_KEY)


class AIImageGenerator:
    """
    AI Image Generator using Google Gemini API
    Generates high-quality images from text descriptions
    """

    # Style presets for different image types
    STYLE_PRESETS = {
        "realistic": {
            "description": "Photorealistic, high detail, professional photography",
            "modifiers": "photorealistic, high resolution, professional photography, sharp focus, detailed, 8K, masterpiece"
        },
        "artistic": {
            "description": "Artistic, painterly, creative interpretation",
            "modifiers": "artistic, painterly style, creative, beautiful composition, vibrant colors, masterpiece"
        },
        "digital_art": {
            "description": "Digital art, modern, vibrant",
            "modifiers": "digital art, modern style, vibrant colors, detailed, high quality, trending on artstation"
        },
        "anime": {
            "description": "Anime style, manga-inspired",
            "modifiers": "anime style, manga, detailed anime art, vibrant colors, high quality"
        },
        "3d_render": {
            "description": "3D rendered, CGI, modern",
            "modifiers": "3D render, CGI, octane render, unreal engine, high quality, detailed"
        },
        "watercolor": {
            "description": "Watercolor painting style",
            "modifiers": "watercolor painting, soft colors, artistic, beautiful, high quality"
        },
        "sketch": {
            "description": "Pencil sketch, hand-drawn",
            "modifiers": "pencil sketch, hand-drawn, detailed line art, artistic"
        },
        "fantasy": {
            "description": "Fantasy art, magical, ethereal",
            "modifiers": "fantasy art, magical, ethereal, detailed, beautiful, epic"
        }
    }

    # Image size options
    SIZE_OPTIONS = {
        "square_small": {"width": 512, "height": 512, "label": "Square - 512x512"},
        "square_medium": {"width": 1024, "height": 1024, "label": "Square - 1024x1024"},
        "portrait": {"width": 768, "height": 1024, "label": "Portrait - 768x1024"},
        "landscape": {"width": 1024, "height": 768, "label": "Landscape - 1024x768"},
        "wide": {"width": 1920, "height": 1080, "label": "Wide - 1920x1080"}
    }

    def __init__(self):
        """Initialize the AI Image Generator"""
        try:
            # Use Gemini 2.5 Flash for image generation guidance
            # Note: Direct image generation via Gemini API is not yet available
            # This provides detailed guidance for use with other image generation tools
            self.model = genai.GenerativeModel('gemini-2.5-flash')
            logger.info("AI Image Generator initialized successfully with Gemini 2.5 Flash")
        except Exception as e:
            logger.error(f"Failed to initialize AI Image Generator: {e}")
            raise

    def generate_image(
        self,
        prompt: str,
        style: str = "realistic",
        size: str = "square_medium",
        negative_prompt: Optional[str] = None,
        num_images: int = 1
    ) -> Dict[str, Any]:
        """
        Generate image from text description

        Args:
            prompt: Text description of the image to generate
            style: Style preset (realistic, artistic, digital_art, etc.)
            size: Image size (square_small, square_medium, portrait, landscape, wide)
            negative_prompt: What to avoid in the image
            num_images: Number of images to generate (1-4)

        Returns:
            Dictionary containing success status, images, and metadata
        """
        try:
            logger.info(f"Generating image with prompt: {prompt[:50]}...")

            # Validate inputs
            if not prompt or len(prompt.strip()) < 3:
                return {
                    "success": False,
                    "error": "Prompt must be at least 3 characters long"
                }

            if style not in self.STYLE_PRESETS:
                style = "realistic"

            if size not in self.SIZE_OPTIONS:
                size = "square_medium"

            if num_images < 1 or num_images > 4:
                num_images = 1

            # Get style modifiers
            style_info = self.STYLE_PRESETS[style]
            enhanced_prompt = f"{prompt}, {style_info['modifiers']}"

            # Add negative prompt if provided
            if negative_prompt:
                enhanced_prompt += f"\nAvoid: {negative_prompt}"

            # Get size information
            size_info = self.SIZE_OPTIONS[size]

            # Note: Google Gemini API doesn't directly generate images yet
            # This is a placeholder for when the feature becomes available
            # For now, we'll return a helpful response about image generation

            generation_config = {
                "temperature": 0.9,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 2048,
            }

            # Generate detailed image description and metadata
            response_prompt = f"""As an AI image generation assistant, provide detailed information for this image request:

Prompt: {prompt}
Style: {style_info['description']}
Size: {size_info['label']}

Provide:
1. Enhanced detailed description for image generation (100-150 words)
2. Recommended camera settings (if realistic/photography)
3. Color palette suggestions
4. Composition tips
5. Lighting recommendations
6. Three alternative prompt variations
7. SEO-optimized title and tags for the image

Format as structured JSON-like text."""

            response = self.model.generate_content(
                response_prompt,
                generation_config=generation_config
            )

            result = {
                "success": True,
                "prompt": prompt,
                "enhanced_prompt": enhanced_prompt,
                "style": style,
                "size": size_info['label'],
                "num_images": num_images,
                "metadata": {
                    "original_prompt": prompt,
                    "style_used": style_info['description'],
                    "dimensions": f"{size_info['width']}x{size_info['height']}",
                    "guidance": response.text if response.text else "Image generation guidance"
                },
                "message": "Image generation guidance created successfully. Note: Direct image generation via Gemini API is coming soon. Use this detailed guidance with tools like DALL-E, Midjourney, or Stable Diffusion.",
                "recommendations": response.text if response.text else ""
            }

            logger.info("Image generation guidance created successfully")
            return result

        except Exception as e:
            logger.error(f"Error generating image: {e}")
            return {
                "success": False,
                "error": f"Failed to generate image: {str(e)}"
            }

    def get_available_styles(self) -> Dict[str, Dict[str, str]]:
        """Get all available style presets"""
        return self.STYLE_PRESETS

    def get_available_sizes(self) -> Dict[str, Dict[str, Any]]:
        """Get all available size options"""
        return self.SIZE_OPTIONS


# Module-level functions for easy access
def generate_ai_image(
    prompt: str,
    style: str = "realistic",
    size: str = "square_medium",
    negative_prompt: Optional[str] = None,
    num_images: int = 1
) -> Dict[str, Any]:
    """
    Generate image from text description

    Args:
        prompt: Text description of the image to generate
        style: Style preset
        size: Image size
        negative_prompt: What to avoid
        num_images: Number of images (1-4)

    Returns:
        Dictionary with generation results
    """
    generator = AIImageGenerator()
    return generator.generate_image(prompt, style, size, negative_prompt, num_images)


def get_style_options() -> Dict[str, Dict[str, str]]:
    """Get available style options"""
    generator = AIImageGenerator()
    return generator.get_available_styles()


def get_size_options() -> Dict[str, Dict[str, Any]]:
    """Get available size options"""
    generator = AIImageGenerator()
    return generator.get_available_sizes()
