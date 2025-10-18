"""
AI Image Generator using Stable Diffusion XL via Hugging Face
Generates actual images from text descriptions
"""

import base64
import os
import io
from typing import Dict, Any, Optional
import logging
import requests
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Hugging Face API Configuration
HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN", "")
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"}


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
            # Initialize Stable Diffusion XL via Hugging Face API
            logger.info("AI Image Generator initialized successfully with Stable Diffusion XL")
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

            # Generate actual images using Imagen 3.0 Fast
            generated_images = []

            for i in range(num_images):
                try:
                    # Call Hugging Face Stable Diffusion XL API
                    payload = {
                        "inputs": enhanced_prompt,
                        "options": {"wait_for_model": True}
                    }

                    response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=60)

                    if response.status_code == 200:
                        # Convert response to PIL Image
                        image = Image.open(io.BytesIO(response.content))

                        # Resize image based on size option
                        target_size = (size_info['width'], size_info['height'])
                        image = image.resize(target_size, Image.Resampling.LANCZOS)

                        # Convert to base64
                        img_byte_arr = io.BytesIO()
                        image.save(img_byte_arr, format='PNG')
                        img_byte_arr = img_byte_arr.getvalue()
                        base64_image = base64.b64encode(img_byte_arr).decode('utf-8')

                        generated_images.append({
                            "image_data": f"data:image/png;base64,{base64_image}",
                            "index": i + 1
                        })

                        logger.info(f"Generated image {i+1}/{num_images} successfully")
                    else:
                        logger.error(f"API Error {response.status_code}: {response.text}")

                except Exception as img_error:
                    logger.error(f"Error generating image {i+1}: {img_error}")
                    # Continue with other images even if one fails

            if not generated_images:
                return {
                    "success": False,
                    "error": "Failed to generate any images. Please try again."
                }

            result = {
                "success": True,
                "prompt": prompt,
                "enhanced_prompt": enhanced_prompt,
                "style": style,
                "size": size_info['label'],
                "num_images": len(generated_images),
                "images": generated_images,
                "metadata": {
                    "original_prompt": prompt,
                    "style_used": style_info['description'],
                    "dimensions": f"{size_info['width']}x{size_info['height']}",
                    "model": "Stable Diffusion XL"
                },
                "message": f"Successfully generated {len(generated_images)} image(s)!"
            }

            logger.info(f"Successfully generated {len(generated_images)} images")
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
