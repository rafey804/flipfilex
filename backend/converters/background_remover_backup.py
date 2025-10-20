"""
Advanced Background Remover Converter
Uses briaai/RMBG-1.4 model for professional background removal
"""
from PIL import Image, ImageFilter, ImageEnhance
from rembg import remove
import io
import numpy as np
from typing import Tuple, Optional, Literal
import cv2


class BackgroundRemover:
    """Advanced background removal with multiple output options"""

    @staticmethod
    def remove_background(
        input_path: str,
        output_path: str,
        output_format: Literal["png", "jpg", "webp"] = "png",
        background_color: Optional[Tuple[int, int, int, int]] = None,
        edge_refinement: int = 0,
        quality: int = 95
    ) -> dict:
        """
        Remove background from image with advanced options

        Args:
            input_path: Path to input image
            output_path: Path to save output image
            output_format: Output format (png, jpg, webp)
            background_color: RGBA tuple for background color (None = transparent)
            edge_refinement: Edge refinement level 0-10
            quality: Output quality 1-100

        Returns:
            dict with processing info
        """
        try:
            # Open original image
            input_image = Image.open(input_path).convert("RGBA")
            original_size = input_image.size

            # Remove background using RMBG-1.4 (default rembg model)
            output_image = remove(input_image)

            # Apply edge refinement if requested
            if edge_refinement > 0:
                output_image = BackgroundRemover._refine_edges(output_image, edge_refinement)

            # Apply background if specified
            if background_color:
                output_image = BackgroundRemover._apply_background(
                    output_image,
                    background_color,
                    original_size
                )

            # Convert format if needed
            if output_format == "jpg":
                # JPG doesn't support transparency, ensure white background if none specified
                if not background_color:
                    output_image = BackgroundRemover._apply_background(
                        output_image,
                        (255, 255, 255, 255),
                        original_size
                    )
                output_image = output_image.convert("RGB")
            elif output_format == "webp":
                output_image = output_image.convert("RGBA")

            # Save with quality settings
            save_kwargs = {"quality": quality, "optimize": True}
            if output_format == "png":
                save_kwargs["compress_level"] = 6

            output_image.save(output_path, format=output_format.upper(), **save_kwargs)

            return {
                "success": True,
                "original_size": original_size,
                "output_size": output_image.size,
                "format": output_format,
                "has_transparency": output_format in ["png", "webp"] and not background_color
            }

        except Exception as e:
            raise Exception(f"Background removal failed: {str(e)}")

    @staticmethod
    def _refine_edges(image: Image.Image, level: int) -> Image.Image:
        """Apply edge refinement to improve mask quality"""
        # Convert to numpy array
        img_array = np.array(image)

        # Apply slight blur to alpha channel to smooth edges
        alpha = img_array[:, :, 3]

        # Use bilateral filter to preserve edges while smoothing
        kernel_size = min(level * 2 + 1, 9)
        refined_alpha = cv2.bilateralFilter(alpha, kernel_size, 75, 75)

        # Apply back to image
        img_array[:, :, 3] = refined_alpha

        return Image.fromarray(img_array)

    @staticmethod
    def _clean_edges(image: Image.Image) -> Image.Image:
        """Advanced edge cleanup to remove artifacts and preserve object boundaries"""
        img_array = np.array(image)
        alpha = img_array[:, :, 3]

        # Apply morphological operations to clean edges
        # Erosion to remove small artifacts
        kernel = np.ones((2, 2), np.uint8)
        alpha_eroded = cv2.erode(alpha, kernel, iterations=1)

        # Dilation to restore proper edges
        alpha_dilated = cv2.dilate(alpha_eroded, kernel, iterations=1)

        # Apply Gaussian blur for smooth transition
        alpha_smooth = cv2.GaussianBlur(alpha_dilated, (3, 3), 0)

        # Threshold to remove semi-transparent artifacts
        _, alpha_clean = cv2.threshold(alpha_smooth, 10, 255, cv2.THRESH_BINARY)

        # Apply bilateral filter to preserve edges while smoothing
        alpha_final = cv2.bilateralFilter(alpha_clean, 5, 50, 50)

        # Update alpha channel
        img_array[:, :, 3] = alpha_final

        return Image.fromarray(img_array)

    @staticmethod
    def _apply_background(
        image: Image.Image,
        color: Tuple[int, int, int, int],
        size: Tuple[int, int]
    ) -> Image.Image:
        """Apply solid color background to transparent image"""
        # Create background
        background = Image.new("RGBA", size, color)

        # Composite foreground over background
        background.paste(image, (0, 0), image)

        return background

    @staticmethod
    def blur_background(
        input_path: str,
        output_path: str,
        blur_intensity: int = 20,
        output_format: str = "png"
    ) -> dict:
        """
        Blur the background while keeping foreground sharp

        Args:
            input_path: Path to input image
            output_path: Path to save output
            blur_intensity: Blur intensity 1-100
            output_format: Output format
        """
        try:
            # Open and process
            input_image = Image.open(input_path).convert("RGBA")

            # Remove background using RMBG-1.4
            foreground = remove(input_image)

            # Extract alpha mask
            mask = foreground.split()[3]

            # Blur the original image
            blurred = input_image.filter(ImageFilter.GaussianBlur(radius=blur_intensity))

            # Composite: sharp foreground over blurred background
            result = Image.composite(foreground, blurred, mask)

            # Save
            if output_format == "jpg":
                result = result.convert("RGB")

            result.save(output_path, format=output_format.upper(), quality=95)

            return {
                "success": True,
                "blur_intensity": blur_intensity,
                "format": output_format
            }

        except Exception as e:
            raise Exception(f"Background blur failed: {str(e)}")

    @staticmethod
    def replace_background(
        foreground_path: str,
        background_path: str,
        output_path: str,
        output_format: str = "png"
    ) -> dict:
        """
        Replace background with custom image

        Args:
            foreground_path: Path to foreground image
            background_path: Path to background image
            output_path: Path to save output
            output_format: Output format
        """
        try:
            # Load foreground and remove background using RMBG-1.4
            foreground_img = Image.open(foreground_path).convert("RGBA")
            foreground = remove(foreground_img)

            # Load and resize background to match foreground
            background = Image.open(background_path).convert("RGBA")
            background = background.resize(foreground.size, Image.Resampling.LANCZOS)

            # Extract alpha mask
            mask = foreground.split()[3]

            # Composite foreground over background
            result = Image.composite(foreground, background, mask)

            # Save
            if output_format == "jpg":
                result = result.convert("RGB")

            result.save(output_path, format=output_format.upper(), quality=95)

            return {
                "success": True,
                "format": output_format,
                "size": result.size
            }

        except Exception as e:
            raise Exception(f"Background replacement failed: {str(e)}")

    @staticmethod
    def add_gradient_background(
        input_path: str,
        output_path: str,
        gradient_type: Literal["linear", "radial"] = "linear",
        color_start: Tuple[int, int, int] = (138, 43, 226),  # Purple
        color_end: Tuple[int, int, int] = (75, 0, 130),  # Indigo
        output_format: str = "png"
    ) -> dict:
        """
        Add gradient background to image

        Args:
            input_path: Path to input image
            output_path: Path to save output
            gradient_type: Type of gradient (linear or radial)
            color_start: RGB start color
            color_end: RGB end color
            output_format: Output format
        """
        try:
            # Remove background using RMBG-1.4
            input_image = Image.open(input_path).convert("RGBA")
            foreground = remove(input_image)

            # Create gradient background
            width, height = foreground.size
            gradient = BackgroundRemover._create_gradient(
                width, height, gradient_type, color_start, color_end
            )

            # Composite
            mask = foreground.split()[3]
            result = Image.composite(foreground, gradient, mask)

            # Save
            if output_format == "jpg":
                result = result.convert("RGB")

            result.save(output_path, format=output_format.upper(), quality=95)

            return {
                "success": True,
                "gradient_type": gradient_type,
                "format": output_format
            }

        except Exception as e:
            raise Exception(f"Gradient background failed: {str(e)}")

    @staticmethod
    def _create_gradient(
        width: int,
        height: int,
        gradient_type: str,
        color_start: Tuple[int, int, int],
        color_end: Tuple[int, int, int]
    ) -> Image.Image:
        """Create gradient image"""
        gradient = Image.new("RGBA", (width, height))
        pixels = gradient.load()

        if gradient_type == "linear":
            # Vertical linear gradient
            for y in range(height):
                ratio = y / height
                r = int(color_start[0] * (1 - ratio) + color_end[0] * ratio)
                g = int(color_start[1] * (1 - ratio) + color_end[1] * ratio)
                b = int(color_start[2] * (1 - ratio) + color_end[2] * ratio)
                for x in range(width):
                    pixels[x, y] = (r, g, b, 255)
        else:
            # Radial gradient
            center_x, center_y = width // 2, height // 2
            max_distance = np.sqrt(center_x**2 + center_y**2)

            for y in range(height):
                for x in range(width):
                    distance = np.sqrt((x - center_x)**2 + (y - center_y)**2)
                    ratio = min(distance / max_distance, 1.0)
                    r = int(color_start[0] * (1 - ratio) + color_end[0] * ratio)
                    g = int(color_start[1] * (1 - ratio) + color_end[1] * ratio)
                    b = int(color_start[2] * (1 - ratio) + color_end[2] * ratio)
                    pixels[x, y] = (r, g, b, 255)

        return gradient

    @staticmethod
    def batch_remove_backgrounds(
        input_paths: list[str],
        output_dir: str,
        **kwargs
    ) -> list[dict]:
        """
        Process multiple images in batch

        Args:
            input_paths: List of input image paths
            output_dir: Directory to save outputs
            **kwargs: Additional arguments for remove_background

        Returns:
            List of processing results
        """
        results = []

        for i, input_path in enumerate(input_paths):
            try:
                import os
                filename = os.path.basename(input_path)
                output_path = os.path.join(output_dir, f"nobg_{filename}")

                result = BackgroundRemover.remove_background(
                    input_path,
                    output_path,
                    **kwargs
                )
                result["index"] = i
                result["filename"] = filename
                results.append(result)

            except Exception as e:
                results.append({
                    "index": i,
                    "filename": os.path.basename(input_path),
                    "success": False,
                    "error": str(e)
                })

        return results

    @staticmethod
    def resize_output(
        input_path: str,
        output_path: str,
        size: Literal["small", "medium", "original"] = "original",
        maintain_aspect: bool = True
    ) -> dict:
        """
        Resize processed image to different sizes

        Args:
            input_path: Path to input image
            output_path: Path to save resized image
            size: Size preset
            maintain_aspect: Maintain aspect ratio
        """
        try:
            image = Image.open(input_path)
            original_size = image.size

            # Define size presets
            size_map = {
                "small": (800, 600),
                "medium": (1920, 1080),
                "original": original_size
            }

            target_size = size_map.get(size, original_size)

            if size != "original" and maintain_aspect:
                # Calculate aspect ratio
                image.thumbnail(target_size, Image.Resampling.LANCZOS)
            elif size != "original":
                image = image.resize(target_size, Image.Resampling.LANCZOS)

            # Save
            image.save(output_path, quality=95, optimize=True)

            return {
                "success": True,
                "original_size": original_size,
                "output_size": image.size,
                "size_preset": size
            }

        except Exception as e:
            raise Exception(f"Resize failed: {str(e)}")
