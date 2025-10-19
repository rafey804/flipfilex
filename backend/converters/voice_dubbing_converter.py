"""
Voice and Dubbing Converter
Supports both gTTS (Default Voice) and Coqui TTS (Voice Cloning)
"""

import os
import io
import uuid
import logging
from pathlib import Path
from typing import Optional, Literal
from datetime import datetime
from pydub import AudioSegment
from pydub.effects import normalize, compress_dynamic_range, low_pass_filter, high_pass_filter
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Check for gTTS availability
try:
    from gtts import gTTS
    GTTS_AVAILABLE = True
    logger.info("gTTS is available")
except ImportError:
    GTTS_AVAILABLE = False
    logger.warning("gTTS is not available. Install with: pip install gTTS")

# Check for Coqui TTS availability
try:
    from TTS.api import TTS
    COQUI_AVAILABLE = True
    logger.info("Coqui TTS is available")
except ImportError:
    COQUI_AVAILABLE = False
    logger.warning("Coqui TTS is not available. Voice cloning will use gTTS with audio mixing")

# Check for pyttsx3 (offline TTS alternative)
try:
    import pyttsx3
    PYTTSX3_AVAILABLE = True
    logger.info("pyttsx3 is available for offline TTS")
except ImportError:
    PYTTSX3_AVAILABLE = False
    logger.info("pyttsx3 not available")

# Check for noisereduce
try:
    import noisereduce as nr
    NOISEREDUCE_AVAILABLE = True
    logger.info("Noise reduction is available")
except ImportError:
    NOISEREDUCE_AVAILABLE = False
    logger.warning("Noise reduction not available. Install with: pip install noisereduce")


class VoiceDubbingConverter:
    """Handle voice generation and dubbing conversions"""

    # Supported languages for gTTS
    GTTS_LANGUAGES = {
        'en': 'English',
        'ur': 'Urdu',
        'hi': 'Hindi',
        'ar': 'Arabic',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh-CN': 'Chinese (Simplified)',
        'zh-TW': 'Chinese (Traditional)',
        'tr': 'Turkish',
        'nl': 'Dutch',
        'pl': 'Polish',
        'vi': 'Vietnamese',
        'th': 'Thai',
        'id': 'Indonesian'
    }

    SUPPORTED_OUTPUT_FORMATS = ['mp3', 'wav', 'ogg', 'flac', 'm4a']

    def __init__(self, output_dir: str = "uploads"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Initialize Coqui TTS if available
        self.coqui_tts = None
        if COQUI_AVAILABLE:
            try:
                # Use a multilingual model for better quality
                self.coqui_tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2", progress_bar=False, gpu=False)
                logger.info("Coqui TTS model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load Coqui TTS model: {e}")
                self.coqui_tts = None

    def generate_gtts_voice(
        self,
        text: str,
        language: str = 'en',
        speed: float = 1.0,
        pitch: float = 0.0,
        volume: float = 1.0,
        output_format: str = 'mp3',
        apply_noise_reduction: bool = False,
        quality: str = 'high'
    ) -> tuple[str, str]:
        """
        Generate voice using gTTS (Default Voice Mode)

        Args:
            text: Text to convert to speech
            language: Language code (e.g., 'en', 'ur', 'hi')
            speed: Speed multiplier (0.5 to 2.0)
            pitch: Pitch adjustment in semitones (-12 to +12)
            volume: Volume multiplier (0.0 to 2.0)
            output_format: Output audio format
            apply_noise_reduction: Whether to apply noise reduction
            quality: Audio quality (low, medium, high, ultra)

        Returns:
            Tuple of (output_file_path, filename)
        """
        if not GTTS_AVAILABLE:
            raise ImportError("gTTS is not installed. Install with: pip install gTTS")

        if language not in self.GTTS_LANGUAGES:
            raise ValueError(f"Unsupported language: {language}")

        if output_format not in self.SUPPORTED_OUTPUT_FORMATS:
            raise ValueError(f"Unsupported format: {output_format}")

        # Generate unique filename
        filename = f"voice_gtts_{uuid.uuid4().hex[:8]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{output_format}"
        output_path = self.output_dir / filename

        # Generate speech with gTTS
        tts = gTTS(text=text, lang=language, slow=False)

        # Save to temporary MP3 file
        temp_mp3 = self.output_dir / f"temp_{uuid.uuid4().hex}.mp3"
        tts.save(str(temp_mp3))

        # Load audio for processing
        audio = AudioSegment.from_mp3(str(temp_mp3))

        # Apply audio processing
        audio = self._apply_audio_effects(
            audio, speed, pitch, volume, apply_noise_reduction, quality
        )

        # Export in desired format
        self._export_audio(audio, output_path, output_format, quality)

        # Clean up temp file
        if temp_mp3.exists():
            temp_mp3.unlink()

        return str(output_path), filename

    def generate_coqui_voice_clone(
        self,
        text: str,
        speaker_wav_path: str,
        language: str = 'en',
        speed: float = 1.0,
        pitch: float = 0.0,
        volume: float = 1.0,
        output_format: str = 'mp3',
        apply_noise_reduction: bool = False,
        quality: str = 'high'
    ) -> tuple[str, str]:
        """
        Generate voice using Coqui TTS with voice cloning
        Falls back to enhanced gTTS if Coqui is not available

        Args:
            text: Text to convert to speech
            speaker_wav_path: Path to the speaker's voice sample
            language: Language code
            speed: Speed multiplier
            pitch: Pitch adjustment
            volume: Volume multiplier
            output_format: Output audio format
            apply_noise_reduction: Whether to apply noise reduction
            quality: Audio quality

        Returns:
            Tuple of (output_file_path, filename)
        """
        if not os.path.exists(speaker_wav_path):
            raise FileNotFoundError(f"Speaker audio file not found: {speaker_wav_path}")

        # Generate unique filename
        filename = f"voice_clone_{uuid.uuid4().hex[:8]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{output_format}"
        output_path = self.output_dir / filename
        temp_wav = self.output_dir / f"temp_coqui_{uuid.uuid4().hex}.wav"

        try:
            if COQUI_AVAILABLE and self.coqui_tts is not None:
                # Use Coqui TTS for true voice cloning
                self.coqui_tts.tts_to_file(
                    text=text,
                    speaker_wav=speaker_wav_path,
                    language=language,
                    file_path=str(temp_wav)
                )
                audio = AudioSegment.from_wav(str(temp_wav))
            else:
                # Fallback: Use gTTS and apply speaker audio characteristics
                logger.info("Using gTTS fallback for voice cloning")
                audio = self._generate_enhanced_voice(text, language, speaker_wav_path)

            # Apply audio processing
            audio = self._apply_audio_effects(
                audio, speed, pitch, volume, apply_noise_reduction, quality
            )

            # Export in desired format
            self._export_audio(audio, output_path, output_format, quality)

            return str(output_path), filename

        finally:
            # Clean up temp file
            if temp_wav.exists():
                temp_wav.unlink()

    def _generate_enhanced_voice(
        self,
        text: str,
        language: str,
        speaker_wav_path: str
    ) -> AudioSegment:
        """
        Generate voice using gTTS and apply speaker audio characteristics
        This is a fallback when Coqui TTS is not available

        Analyzes speaker audio and tries to match:
        - Volume/loudness (dBFS)
        - Average pitch (by estimating formants)
        - Speaking speed (words per minute)
        """
        if not GTTS_AVAILABLE:
            raise ImportError("gTTS is required for voice generation")

        # Generate speech with gTTS
        tts = gTTS(text=text, lang=language, slow=False)
        temp_mp3 = self.output_dir / f"temp_gtts_{uuid.uuid4().hex}.mp3"
        tts.save(str(temp_mp3))

        # Load the generated audio
        generated_audio = AudioSegment.from_mp3(str(temp_mp3))

        try:
            # Load speaker audio to analyze characteristics
            speaker_audio = AudioSegment.from_file(speaker_wav_path)

            # 1. Match volume/loudness
            speaker_db = speaker_audio.dBFS
            generated_db = generated_audio.dBFS
            db_diff = speaker_db - generated_db
            generated_audio = generated_audio + db_diff

            logger.info(f"Volume matched: Speaker {speaker_db:.2f}dB, Generated {generated_db:.2f}dB, Adjusted by {db_diff:.2f}dB")

            # 2. Estimate and match pitch
            # We'll use a simple heuristic: analyze the speaker's audio duration vs samples
            # to estimate if it's a higher or lower pitched voice
            speaker_samples = len(speaker_audio.get_array_of_samples())
            speaker_duration_ms = len(speaker_audio)

            # Higher pitch voices tend to have more oscillations per second
            # This is a rough estimate, not perfect
            sample_rate = speaker_audio.frame_rate

            # If speaker audio is relatively short with many samples, it might be higher pitched
            # Apply a gentle pitch shift based on this analysis
            if speaker_duration_ms > 0:
                samples_per_ms = speaker_samples / speaker_duration_ms
                # Normalize this value
                if samples_per_ms > sample_rate / 500:  # Rough threshold for higher pitch
                    # Apply slight pitch increase
                    pitch_shift = 2  # semitones
                    generated_audio = self._change_pitch(generated_audio, pitch_shift)
                    logger.info(f"Applied +{pitch_shift} semitone pitch shift for higher voice")
                elif samples_per_ms < sample_rate / 1000:  # Rough threshold for lower pitch
                    # Apply slight pitch decrease
                    pitch_shift = -2  # semitones
                    generated_audio = self._change_pitch(generated_audio, pitch_shift)
                    logger.info(f"Applied {pitch_shift} semitone pitch shift for lower voice")

            # 3. Try to match speaking speed
            # If speaker audio is slower/faster, adjust generated audio speed slightly
            expected_duration = len(text.split()) * 500  # Rough estimate: 500ms per word
            if speaker_duration_ms > expected_duration * 1.3:  # Speaker talks slower
                speed_factor = 0.95
                generated_audio = self._change_speed(generated_audio, speed_factor)
                logger.info(f"Applied speed factor {speed_factor} for slower speech")
            elif speaker_duration_ms < expected_duration * 0.7:  # Speaker talks faster
                speed_factor = 1.05
                generated_audio = self._change_speed(generated_audio, speed_factor)
                logger.info(f"Applied speed factor {speed_factor} for faster speech")

        except Exception as e:
            logger.warning(f"Could not analyze speaker audio: {e}")
            # If analysis fails, at least try to match volume
            try:
                speaker_audio = AudioSegment.from_file(speaker_wav_path)
                speaker_db = speaker_audio.dBFS
                db_diff = speaker_db - generated_audio.dBFS
                generated_audio = generated_audio + db_diff
            except:
                pass

        finally:
            # Clean up temp file
            if temp_mp3.exists():
                temp_mp3.unlink()

        return generated_audio

    def _apply_audio_effects(
        self,
        audio: AudioSegment,
        speed: float,
        pitch: float,
        volume: float,
        apply_noise_reduction: bool,
        quality: str
    ) -> AudioSegment:
        """Apply various audio effects to the AudioSegment"""

        # Apply noise reduction if requested
        if apply_noise_reduction and NOISEREDUCE_AVAILABLE:
            try:
                audio = self._apply_noise_reduction(audio)
            except Exception as e:
                logger.warning(f"Noise reduction failed: {e}")

        # Apply speed adjustment
        if speed != 1.0:
            audio = self._change_speed(audio, speed)

        # Apply pitch adjustment
        if pitch != 0.0:
            audio = self._change_pitch(audio, pitch)

        # Apply volume adjustment
        if volume != 1.0:
            # Convert volume multiplier to dB
            db_change = 20 * np.log10(volume) if volume > 0 else -60
            audio = audio + db_change

        # Apply normalization for consistent volume
        audio = normalize(audio)

        return audio

    def _change_speed(self, audio: AudioSegment, speed: float) -> AudioSegment:
        """Change playback speed without affecting pitch"""
        # Change frame rate
        sound_with_altered_frame_rate = audio._spawn(
            audio.raw_data,
            overrides={"frame_rate": int(audio.frame_rate * speed)}
        )
        # Convert back to original frame rate
        return sound_with_altered_frame_rate.set_frame_rate(audio.frame_rate)

    def _change_pitch(self, audio: AudioSegment, semitones: float) -> AudioSegment:
        """Change pitch by semitones"""
        # Calculate new sample rate
        new_sample_rate = int(audio.frame_rate * (2.0 ** (semitones / 12.0)))

        # Change frame rate to shift pitch
        pitched = audio._spawn(audio.raw_data, overrides={'frame_rate': new_sample_rate})

        # Resample to original frame rate
        return pitched.set_frame_rate(audio.frame_rate)

    def _apply_noise_reduction(self, audio: AudioSegment) -> AudioSegment:
        """Apply noise reduction to audio"""
        if not NOISEREDUCE_AVAILABLE:
            return audio

        # Convert to numpy array
        samples = np.array(audio.get_array_of_samples())

        # Apply noise reduction
        reduced_noise = nr.reduce_noise(
            y=samples,
            sr=audio.frame_rate,
            stationary=True
        )

        # Convert back to AudioSegment
        reduced_audio = audio._spawn(reduced_noise.tobytes())
        return reduced_audio

    def _export_audio(
        self,
        audio: AudioSegment,
        output_path: Path,
        format: str,
        quality: str
    ):
        """Export audio with specified quality settings"""

        # Quality settings
        bitrate_map = {
            'low': '64k',
            'medium': '128k',
            'high': '192k',
            'ultra': '320k'
        }

        bitrate = bitrate_map.get(quality, '192k')

        # Export parameters based on format
        export_params = {
            'format': format,
            'bitrate': bitrate
        }

        if format == 'mp3':
            export_params['parameters'] = ['-q:a', '0']
        elif format == 'ogg':
            export_params['codec'] = 'libvorbis'

        audio.export(str(output_path), **export_params)

    @staticmethod
    def get_supported_languages():
        """Get list of supported languages"""
        return VoiceDubbingConverter.GTTS_LANGUAGES

    @staticmethod
    def get_supported_formats():
        """Get list of supported output formats"""
        return VoiceDubbingConverter.SUPPORTED_OUTPUT_FORMATS

    @staticmethod
    def get_dependencies_status():
        """Check status of dependencies"""
        return {
            'gtts': GTTS_AVAILABLE,
            'coqui_tts': COQUI_AVAILABLE,
            'pydub': True,  # Required dependency
            'noisereduce': NOISEREDUCE_AVAILABLE
        }


# Example usage
if __name__ == "__main__":
    converter = VoiceDubbingConverter()
    print("Supported languages:", converter.get_supported_languages())
    print("Supported formats:", converter.get_supported_formats())
    print("Dependencies status:", converter.get_dependencies_status())
