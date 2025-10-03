# converters/dicom_to_jpeg_converter.py - DICOM to JPEG conversion logic
from utils.dependencies import MEDICAL_AVAILABLE

async def dicom_to_jpeg_converter(dicom_path: str, output_path: str) -> bool:
    """Convert DICOM to JPEG format"""
    if not MEDICAL_AVAILABLE:
        return False

    try:
        import pydicom
        from PIL import Image
        import numpy as np

        # Read DICOM file
        dicom_data = pydicom.dcmread(dicom_path)

        # Check if pixel data exists
        if not hasattr(dicom_data, 'pixel_array'):
            return False

        # Get pixel array
        pixel_array = dicom_data.pixel_array

        # Handle different photometric interpretations
        photometric = getattr(dicom_data, 'PhotometricInterpretation', 'MONOCHROME2')

        # Normalize pixel values to 0-255 range
        if pixel_array.dtype != np.uint8:
            # Get the minimum and maximum values
            min_val = np.min(pixel_array)
            max_val = np.max(pixel_array)

            # Avoid division by zero
            if max_val > min_val:
                # Normalize to 0-255
                pixel_array = ((pixel_array - min_val) / (max_val - min_val) * 255).astype(np.uint8)
            else:
                pixel_array = np.zeros_like(pixel_array, dtype=np.uint8)

        # Handle different image shapes
        if len(pixel_array.shape) == 3:
            # Multi-frame or color image
            if pixel_array.shape[0] == 1:
                # Single frame
                pixel_array = pixel_array[0]
            elif pixel_array.shape[2] == 3:
                # RGB image
                pass
            else:
                # Take first frame for multi-frame
                pixel_array = pixel_array[0]

        # Handle photometric interpretation
        if photometric == 'MONOCHROME1':
            # Invert grayscale (0 = white, max = black)
            pixel_array = 255 - pixel_array

        # Create PIL Image
        if len(pixel_array.shape) == 2:
            # Grayscale
            image = Image.fromarray(pixel_array, mode='L')
        elif len(pixel_array.shape) == 3 and pixel_array.shape[2] == 3:
            # RGB
            image = Image.fromarray(pixel_array, mode='RGB')
        else:
            # Fallback to grayscale
            if len(pixel_array.shape) == 3:
                pixel_array = pixel_array[:, :, 0]
            image = Image.fromarray(pixel_array, mode='L')

        # Apply window/level if present
        if hasattr(dicom_data, 'WindowWidth') and hasattr(dicom_data, 'WindowCenter'):
            try:
                window_width = float(dicom_data.WindowWidth)
                window_center = float(dicom_data.WindowCenter)

                if isinstance(window_width, (list, tuple)):
                    window_width = window_width[0]
                if isinstance(window_center, (list, tuple)):
                    window_center = window_center[0]

                # Apply windowing
                min_window = window_center - window_width / 2
                max_window = window_center + window_width / 2

                # Get original pixel array for windowing
                original_array = dicom_data.pixel_array.astype(np.float64)

                # Apply window
                windowed = np.clip(original_array, min_window, max_window)
                windowed = ((windowed - min_window) / (max_window - min_window) * 255).astype(np.uint8)

                if photometric == 'MONOCHROME1':
                    windowed = 255 - windowed

                if len(windowed.shape) == 3:
                    windowed = windowed[0] if windowed.shape[0] == 1 else windowed[:, :, 0]

                image = Image.fromarray(windowed, mode='L')

            except Exception:
                # If windowing fails, use the original image
                pass

        # Add metadata to image info
        image_info = {}

        # Add DICOM metadata
        if hasattr(dicom_data, 'PatientName'):
            image_info['PatientName'] = str(dicom_data.PatientName)

        if hasattr(dicom_data, 'StudyDescription'):
            image_info['StudyDescription'] = str(dicom_data.StudyDescription)

        if hasattr(dicom_data, 'Modality'):
            image_info['Modality'] = str(dicom_data.Modality)

        if hasattr(dicom_data, 'StudyDate'):
            image_info['StudyDate'] = str(dicom_data.StudyDate)

        if hasattr(dicom_data, 'SliceThickness'):
            image_info['SliceThickness'] = str(dicom_data.SliceThickness)

        # Save as JPEG
        # JPEG doesn't support metadata the same way, so we'll save a clean image
        image.save(output_path, 'JPEG', quality=95, optimize=True)

        return True

    except Exception as e:
        print(f"DICOM to JPEG conversion error: {e}")
        return False