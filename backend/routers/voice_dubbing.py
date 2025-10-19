"""
Voice and Dubbing API Router
Provides endpoints for both gTTS (Default Voice) and Coqui TTS (Voice Cloning)
"""

import os
import json
import shutil
from pathlib import Path
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from converters.voice_dubbing_converter import VoiceDubbingConverter

router = APIRouter()
converter = VoiceDubbingConverter()

# Storage for voice samples and audio history
VOICE_SAMPLES_DIR = Path("uploads/voice_samples")
VOICE_SAMPLES_DIR.mkdir(parents=True, exist_ok=True)

AUDIO_HISTORY_DIR = Path("uploads/audio_history")
AUDIO_HISTORY_DIR.mkdir(parents=True, exist_ok=True)

AUDIO_HISTORY_FILE = AUDIO_HISTORY_DIR / "history.json"


# Pydantic models
class VoiceGenerationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to convert to speech")
    language: str = Field(default='en', description="Language code")
    speed: float = Field(default=1.0, ge=0.5, le=2.0, description="Speed multiplier")
    pitch: float = Field(default=0.0, ge=-12.0, le=12.0, description="Pitch adjustment in semitones")
    volume: float = Field(default=1.0, ge=0.0, le=2.0, description="Volume multiplier")
    output_format: str = Field(default='mp3', description="Output audio format")
    apply_noise_reduction: bool = Field(default=False, description="Apply noise reduction")
    quality: str = Field(default='high', description="Audio quality (low, medium, high, ultra)")


class VoiceCloneRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to convert to speech")
    language: str = Field(default='en', description="Language code")
    speed: float = Field(default=1.0, ge=0.5, le=2.0, description="Speed multiplier")
    pitch: float = Field(default=0.0, ge=-12.0, le=12.0, description="Pitch adjustment in semitones")
    volume: float = Field(default=1.0, ge=0.0, le=2.0, description="Volume multiplier")
    output_format: str = Field(default='mp3', description="Output audio format")
    apply_noise_reduction: bool = Field(default=False, description="Apply noise reduction")
    quality: str = Field(default='high', description="Audio quality")
    use_sample_id: Optional[str] = Field(default=None, description="ID of pre-uploaded voice sample")


class BatchGenerationRequest(BaseModel):
    texts: List[str] = Field(..., min_items=1, max_items=10, description="List of texts to convert")
    language: str = Field(default='en', description="Language code")
    speed: float = Field(default=1.0, ge=0.5, le=2.0, description="Speed multiplier")
    pitch: float = Field(default=0.0, ge=-12.0, le=12.0, description="Pitch adjustment")
    volume: float = Field(default=1.0, ge=0.0, le=2.0, description="Volume multiplier")
    output_format: str = Field(default='mp3', description="Output audio format")
    apply_noise_reduction: bool = Field(default=False, description="Apply noise reduction")
    quality: str = Field(default='high', description="Audio quality")


class AudioHistoryItem(BaseModel):
    id: str
    filename: str
    text: str
    mode: str  # 'gtts' or 'coqui'
    language: str
    created_at: str
    file_size: int
    duration: Optional[float] = None


def save_to_history(
    filename: str,
    text: str,
    mode: str,
    language: str,
    file_path: str
) -> AudioHistoryItem:
    """Save generated audio to history"""
    file_size = os.path.getsize(file_path)

    history_item = AudioHistoryItem(
        id=filename.split('.')[0],
        filename=filename,
        text=text[:100] + "..." if len(text) > 100 else text,
        mode=mode,
        language=language,
        created_at=datetime.now().isoformat(),
        file_size=file_size
    )

    # Load existing history
    history = []
    if AUDIO_HISTORY_FILE.exists():
        try:
            with open(AUDIO_HISTORY_FILE, 'r', encoding='utf-8') as f:
                history = json.load(f)
        except:
            history = []

    # Add new item
    history.insert(0, history_item.dict())

    # Keep only last 100 items
    history = history[:100]

    # Save history
    with open(AUDIO_HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2)

    return history_item


@router.post("/voice-dubbing/generate-gtts")
async def generate_gtts_voice(
    text: str = Form(...),
    language: str = Form('en'),
    speed: float = Form(1.0),
    pitch: float = Form(0.0),
    volume: float = Form(1.0),
    output_format: str = Form('mp3'),
    apply_noise_reduction: bool = Form(False),
    quality: str = Form('high')
):
    """
    Generate voice using gTTS (Default Voice Mode)

    Supports multiple languages with configurable speed, pitch, and volume
    """
    try:
        # Validate input
        if not text or len(text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        if len(text) > 5000:
            raise HTTPException(status_code=400, detail="Text too long (max 5000 characters)")

        # Generate voice
        output_path, filename = converter.generate_gtts_voice(
            text=text,
            language=language,
            speed=speed,
            pitch=pitch,
            volume=volume,
            output_format=output_format,
            apply_noise_reduction=apply_noise_reduction,
            quality=quality
        )

        # Save to history
        history_item = save_to_history(filename, text, 'gtts', language, output_path)

        return JSONResponse({
            "success": True,
            "message": "Voice generated successfully",
            "filename": filename,
            "download_url": f"/download/{filename}",
            "history_item": history_item.dict()
        })

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating voice: {str(e)}")


@router.post("/voice-dubbing/generate-clone")
async def generate_voice_clone(
    text: str = Form(...),
    speaker_audio: Optional[UploadFile] = File(None),
    use_sample_id: Optional[str] = Form(None),
    language: str = Form('en'),
    speed: float = Form(1.0),
    pitch: float = Form(0.0),
    volume: float = Form(1.0),
    output_format: str = Form('mp3'),
    apply_noise_reduction: bool = Form(False),
    quality: str = Form('high')
):
    """
    Generate voice using Coqui TTS with voice cloning

    Either upload a speaker audio file or use a pre-saved voice sample
    """
    try:
        # Validate input
        if not text or len(text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        if len(text) > 5000:
            raise HTTPException(status_code=400, detail="Text too long (max 5000 characters)")

        # Determine speaker audio path
        speaker_wav_path = None

        if use_sample_id:
            # Use pre-uploaded voice sample
            sample_path = VOICE_SAMPLES_DIR / f"{use_sample_id}.wav"
            if not sample_path.exists():
                raise HTTPException(status_code=404, detail="Voice sample not found")
            speaker_wav_path = str(sample_path)

        elif speaker_audio:
            # Save uploaded audio temporarily
            temp_audio_path = VOICE_SAMPLES_DIR / f"temp_{speaker_audio.filename}"
            with open(temp_audio_path, "wb") as buffer:
                shutil.copyfileobj(speaker_audio.file, buffer)
            speaker_wav_path = str(temp_audio_path)

        else:
            raise HTTPException(
                status_code=400,
                detail="Either upload speaker audio or provide a voice sample ID"
            )

        # Generate cloned voice
        output_path, filename = converter.generate_coqui_voice_clone(
            text=text,
            speaker_wav_path=speaker_wav_path,
            language=language,
            speed=speed,
            pitch=pitch,
            volume=volume,
            output_format=output_format,
            apply_noise_reduction=apply_noise_reduction,
            quality=quality
        )

        # Clean up temporary file if it was uploaded
        if speaker_audio and temp_audio_path.exists():
            temp_audio_path.unlink()

        # Save to history
        history_item = save_to_history(filename, text, 'coqui', language, output_path)

        return JSONResponse({
            "success": True,
            "message": "Voice cloned successfully",
            "filename": filename,
            "download_url": f"/download/{filename}",
            "history_item": history_item.dict()
        })

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating voice clone: {str(e)}")


@router.post("/voice-dubbing/upload-voice-sample")
async def upload_voice_sample(
    audio: UploadFile = File(...),
    sample_name: str = Form(...)
):
    """
    Upload and save a voice sample for later use in voice cloning
    """
    try:
        # Validate file type
        allowed_types = ['audio/wav', 'audio/wave', 'audio/x-wav', 'audio/mpeg', 'audio/mp3']
        if audio.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload WAV or MP3 files"
            )

        # Generate unique ID for the sample
        sample_id = f"sample_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{sample_name.replace(' ', '_')}"
        sample_path = VOICE_SAMPLES_DIR / f"{sample_id}.wav"

        # Save audio file
        with open(sample_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)

        # Get file info
        file_size = os.path.getsize(sample_path)

        return JSONResponse({
            "success": True,
            "message": "Voice sample uploaded successfully",
            "sample_id": sample_id,
            "sample_name": sample_name,
            "file_size": file_size
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading voice sample: {str(e)}")


@router.get("/voice-dubbing/voice-samples")
async def list_voice_samples():
    """
    List all saved voice samples
    """
    try:
        samples = []
        for sample_file in VOICE_SAMPLES_DIR.glob("sample_*.wav"):
            file_size = os.path.getsize(sample_file)
            created_at = datetime.fromtimestamp(sample_file.stat().st_ctime).isoformat()

            samples.append({
                "sample_id": sample_file.stem,
                "filename": sample_file.name,
                "file_size": file_size,
                "created_at": created_at
            })

        return JSONResponse({
            "success": True,
            "samples": samples,
            "count": len(samples)
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing voice samples: {str(e)}")


@router.delete("/voice-dubbing/voice-sample/{sample_id}")
async def delete_voice_sample(sample_id: str):
    """
    Delete a saved voice sample
    """
    try:
        sample_path = VOICE_SAMPLES_DIR / f"{sample_id}.wav"
        if not sample_path.exists():
            raise HTTPException(status_code=404, detail="Voice sample not found")

        sample_path.unlink()

        return JSONResponse({
            "success": True,
            "message": "Voice sample deleted successfully"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting voice sample: {str(e)}")


@router.post("/voice-dubbing/batch-generate")
async def batch_generate_voices(request: BatchGenerationRequest):
    """
    Generate multiple voices from a list of texts (batch processing)
    """
    try:
        results = []
        errors = []

        for idx, text in enumerate(request.texts):
            try:
                output_path, filename = converter.generate_gtts_voice(
                    text=text,
                    language=request.language,
                    speed=request.speed,
                    pitch=request.pitch,
                    volume=request.volume,
                    output_format=request.output_format,
                    apply_noise_reduction=request.apply_noise_reduction,
                    quality=request.quality
                )

                history_item = save_to_history(filename, text, 'gtts', request.language, output_path)

                results.append({
                    "index": idx,
                    "text": text[:50] + "..." if len(text) > 50 else text,
                    "filename": filename,
                    "download_url": f"/download/{filename}",
                    "success": True
                })

            except Exception as e:
                errors.append({
                    "index": idx,
                    "text": text[:50] + "..." if len(text) > 50 else text,
                    "error": str(e)
                })

        return JSONResponse({
            "success": True,
            "message": f"Batch generation completed. {len(results)} succeeded, {len(errors)} failed",
            "results": results,
            "errors": errors,
            "total": len(request.texts),
            "successful": len(results),
            "failed": len(errors)
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in batch generation: {str(e)}")


@router.get("/voice-dubbing/history")
async def get_audio_history(limit: int = 50):
    """
    Get audio generation history
    """
    try:
        if not AUDIO_HISTORY_FILE.exists():
            return JSONResponse({
                "success": True,
                "history": [],
                "count": 0
            })

        with open(AUDIO_HISTORY_FILE, 'r', encoding='utf-8') as f:
            history = json.load(f)

        # Limit results
        history = history[:limit]

        return JSONResponse({
            "success": True,
            "history": history,
            "count": len(history)
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading history: {str(e)}")


@router.delete("/voice-dubbing/history/{audio_id}")
async def delete_from_history(audio_id: str):
    """
    Delete an audio file from history
    """
    try:
        # Load history
        if not AUDIO_HISTORY_FILE.exists():
            raise HTTPException(status_code=404, detail="History not found")

        with open(AUDIO_HISTORY_FILE, 'r', encoding='utf-8') as f:
            history = json.load(f)

        # Find and remove item
        item_to_remove = None
        for item in history:
            if item['id'] == audio_id:
                item_to_remove = item
                break

        if not item_to_remove:
            raise HTTPException(status_code=404, detail="Audio not found in history")

        # Delete file
        file_path = Path("uploads") / item_to_remove['filename']
        if file_path.exists():
            file_path.unlink()

        # Remove from history
        history = [item for item in history if item['id'] != audio_id]

        # Save updated history
        with open(AUDIO_HISTORY_FILE, 'w', encoding='utf-8') as f:
            json.dump(history, f, indent=2)

        return JSONResponse({
            "success": True,
            "message": "Audio deleted from history"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting from history: {str(e)}")


@router.get("/voice-dubbing/languages")
async def get_supported_languages():
    """
    Get list of supported languages
    """
    return JSONResponse({
        "success": True,
        "languages": converter.get_supported_languages()
    })


@router.get("/voice-dubbing/formats")
async def get_supported_formats():
    """
    Get list of supported output formats
    """
    return JSONResponse({
        "success": True,
        "formats": converter.get_supported_formats()
    })


@router.get("/voice-dubbing/status")
async def get_status():
    """
    Get voice dubbing service status and capabilities
    """
    dependencies = converter.get_dependencies_status()

    return JSONResponse({
        "success": True,
        "service": "Voice and Dubbing",
        "version": "1.0.0",
        "capabilities": {
            "default_voice": dependencies['gtts'],
            "voice_cloning": dependencies['coqui_tts'],
            "noise_reduction": dependencies['noisereduce'],
            "batch_processing": True,
            "audio_history": True
        },
        "dependencies": dependencies,
        "supported_languages": len(converter.get_supported_languages()),
        "supported_formats": converter.get_supported_formats()
    })
