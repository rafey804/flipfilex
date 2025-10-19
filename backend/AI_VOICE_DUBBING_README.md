# AI Voice & Dubbing Studio

A professional AI-powered voice generation and dubbing web application with support for multiple languages and voice cloning capabilities.

## Features

### 🎤 Default Voice Mode (gTTS)
- **Text-to-Speech**: Convert text to natural-sounding speech in multiple languages
- **20+ Languages**: English, Urdu, Hindi, Arabic, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Turkish, and more
- **Voice Controls**:
  - Speed adjustment (0.5x to 2x)
  - Pitch adjustment (-12 to +12 semitones)
  - Volume control (0% to 200%)
- **Audio Formats**: MP3, WAV, OGG, FLAC, M4A
- **Quality Settings**: Low, Medium, High, Ultra
- **Background Noise Reduction**: Optional noise reduction for cleaner audio

### 🎭 Voice Cloning Mode
- **Upload Voice Sample**: Upload your own voice recording (10-30 seconds recommended)
- **Record Voice**: Record directly from microphone
- **Voice Sample Library**: Save and reuse voice samples
- **Enhanced Processing**: Apply speaker audio characteristics to generated voice
- *Note: True voice cloning requires Coqui TTS. When not available, the system uses enhanced gTTS with voice characteristics analysis*

### 📝 Batch Processing
- Generate multiple voices at once
- Process up to 10 texts simultaneously
- Efficient batch generation with progress tracking

### 📚 Audio History
- Automatic saving of all generated audio
- View and manage previously generated audio
- Download or delete from history
- Search and filter capabilities

### 🎨 Modern UI/UX
- **Dark Mode**: Eye-friendly dark theme with toggle
- **Glass Morphism**: Modern, professional design
- **Smooth Animations**: Fade-in, hover effects, pulse animations
- **Waveform Visualization**: Animated audio visualization
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Real-time Progress**: Live progress bar during generation
- **Notifications**: Success/error notifications with animations

## Installation

### Backend Requirements

```bash
cd backend
pip install -r requirements.txt
```

Required packages:
- `gTTS` - Google Text-to-Speech
- `pydub` - Audio manipulation
- `noisereduce` - Background noise reduction
- `soundfile` - Audio file I/O
- `numpy` - Numerical operations
- `scipy` - Scientific computing

Optional (for true voice cloning):
- `TTS` - Coqui TTS for advanced voice cloning (requires Python 3.9-3.11)

### FFmpeg Requirement

Install FFmpeg for audio format conversion:

**Windows:**
```bash
choco install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

### Frontend Requirements

```bash
cd file
npm install framer-motion
```

## API Endpoints

### Generate Voice (Default Mode)
```http
POST /ai/voice-dubbing/generate-gtts
Content-Type: multipart/form-data

Parameters:
- text: string (required) - Text to convert
- language: string (default: 'en') - Language code
- speed: float (default: 1.0) - Speed multiplier (0.5-2.0)
- pitch: float (default: 0.0) - Pitch adjustment (-12 to +12)
- volume: float (default: 1.0) - Volume multiplier (0.0-2.0)
- output_format: string (default: 'mp3') - Output format
- apply_noise_reduction: boolean (default: false)
- quality: string (default: 'high') - Audio quality
```

### Generate Voice Clone
```http
POST /ai/voice-dubbing/generate-clone
Content-Type: multipart/form-data

Parameters:
- text: string (required) - Text to convert
- speaker_audio: file (optional) - Voice sample file
- use_sample_id: string (optional) - ID of saved voice sample
- language: string (default: 'en')
- speed: float (default: 1.0)
- pitch: float (default: 0.0)
- volume: float (default: 1.0)
- output_format: string (default: 'mp3')
- apply_noise_reduction: boolean (default: false)
- quality: string (default: 'high')
```

### Upload Voice Sample
```http
POST /ai/voice-dubbing/upload-voice-sample
Content-Type: multipart/form-data

Parameters:
- audio: file (required) - Voice sample audio file
- sample_name: string (required) - Name for the sample
```

### Batch Generation
```http
POST /ai/voice-dubbing/batch-generate
Content-Type: application/json

Body:
{
  "texts": ["text1", "text2", ...],
  "language": "en",
  "speed": 1.0,
  "pitch": 0.0,
  "volume": 1.0,
  "output_format": "mp3",
  "apply_noise_reduction": false,
  "quality": "high"
}
```

### Get Audio History
```http
GET /ai/voice-dubbing/history?limit=50
```

### Get Voice Samples
```http
GET /ai/voice-dubbing/voice-samples
```

### Get Supported Languages
```http
GET /ai/voice-dubbing/languages
```

### Get Service Status
```http
GET /ai/voice-dubbing/status
```

## Usage

### Start Backend Server

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Start Frontend

```bash
cd file
npm run dev
```

Access the application at: `http://localhost:3004/ai-voice-dubbing`

## How to Use

### Default Voice Mode

1. **Toggle to Default Voice** (🎤 icon)
2. **Enter your text** in the input box
3. **Select language** from dropdown
4. **Adjust settings** (optional):
   - Speed slider
   - Pitch slider
   - Advanced settings for volume, format, quality
5. **Click "Generate Voice"**
6. **Listen and download** the generated audio

### Voice Cloning Mode

1. **Toggle to Voice Cloning** (🎭 icon)
2. **Provide voice sample**:
   - Click "📁 Upload" to select audio file
   - Click "🎙️ Record" to record from microphone
   - Click "📚 Library" to choose from saved samples
3. **Enter text** to be spoken in the cloned voice
4. **Adjust settings** as needed
5. **Click "Clone & Generate"**
6. **Listen and download** the cloned voice

### Batch Processing

1. **Click "📋 Batch Mode"**
2. **Enter multiple texts** (one per input box)
3. **Click "➕ Add Another Text"** to add more (up to 10)
4. **Configure settings** for all texts
5. **Click "🚀 Generate All"**
6. **View results** in history

## Advanced Features

### Audio Quality Settings

- **Low (64 kbps)**: Smallest file size, basic quality
- **Medium (128 kbps)**: Good balance of quality and size
- **High (192 kbps)**: Excellent quality (default)
- **Ultra (320 kbps)**: Maximum quality, larger files

### Noise Reduction

Enable background noise reduction for:
- Cleaner voice output
- Removing ambient noise
- Professional audio quality

*Note: Requires `noisereduce` package*

### Voice Sample Library

Save frequently used voice samples:
1. Upload or record a voice
2. Click "💾 Save to Library"
3. Access from library in future sessions
4. Manage saved samples in Advanced Settings

## Performance Tips

1. **Text Length**: Keep texts under 5000 characters for optimal performance
2. **Voice Samples**: Use 10-30 second voice samples for best cloning results
3. **Audio Quality**: Use WAV or MP3 format for voice samples
4. **Batch Processing**: Process up to 10 texts at once for efficiency
5. **History Management**: Regularly clean up old audio files

## Troubleshooting

### No Audio Generated
- Check that FFmpeg is installed
- Verify text is not empty
- Check browser console for errors

### Voice Cloning Not Working
- Ensure voice sample is uploaded or selected
- Check audio file format (WAV, MP3 recommended)
- Verify sample is 10-30 seconds long

### Poor Audio Quality
- Increase quality setting to "High" or "Ultra"
- Enable noise reduction
- Use higher quality voice samples

### Slow Generation
- Reduce text length
- Lower quality setting
- Disable noise reduction for faster processing

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Security & Privacy

- All audio processing is done on your server
- No data is sent to third-party services (except gTTS uses Google's TTS API)
- Voice samples are stored locally
- Automatic cleanup of old temporary files

## Future Enhancements

- [ ] Multi-speaker conversations
- [ ] Real-time voice streaming
- [ ] Custom voice training
- [ ] Voice emotion controls
- [ ] Advanced audio effects
- [ ] Text highlighting during playback
- [ ] Export to video with subtitles

## Credits

- **gTTS**: Google Text-to-Speech
- **Coqui TTS**: Advanced voice cloning (optional)
- **pydub**: Audio manipulation
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Modern styling

## License

This project is part of the FlipFileX suite.

## Support

For issues, questions, or feature requests, please contact support or open an issue in the repository.

---

**Enjoy creating amazing voices!** 🎤✨
