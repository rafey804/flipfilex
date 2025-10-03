
# converters/wav_to_mp3_converter.py - Audio conversion logic
from utils.dependencies import PYDUB_AVAILABLE

async def wav_to_mp3_converter(wav_path: str, output_path: str) -> bool:
    """Convert WAV to MP3 format"""
    if not PYDUB_AVAILABLE:
        return False
    
    try:
        from pydub import AudioSegment
        
        # Load WAV file
        audio = AudioSegment.from_wav(wav_path)
        
        # Export as MP3 with good quality settings
        audio.export(
            output_path, 
            format="mp3",
            bitrate="192k",  # Good quality bitrate
            parameters=["-q:a", "2"]  # High quality VBR
        )
        
        print(f"WAV converted to MP3: {output_path}")
        return True
        
    except Exception as e:
        print(f"WAV to MP3 conversion error: {e}")
        return False