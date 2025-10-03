# routers/wav_to_mp3.py - WAV to MP3 conversion endpoint
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import traceback

from utils.config import UPLOAD_DIR
from utils.helpers import validate_file_size, generate_unique_filename, check_rate_limit, write_file
from utils.dependencies import cleanup_old_files, PYDUB_AVAILABLE
from converters.wav_to_mp3_converter import wav_to_mp3_converter

router = APIRouter()
security = HTTPBearer(auto_error=False)

@router.post("/wav-to-mp3")
async def convert_wav_to_mp3(
    file: UploadFile = File(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    print(f"📥 Received WAV conversion request for file: {file.filename}")
    print(f"📊 File size: {file.size if hasattr(file, 'size') else 'Unknown'} bytes")
    
    # Check pydub availability
    if not PYDUB_AVAILABLE:
        print("❌ pydub dependency not available")
        raise HTTPException(
            status_code=503, 
            detail="WAV to MP3 conversion not available. Missing dependency: pydub"
        )
    
    print("✅ pydub dependency available")
    
    # Rate limiting and cleanup
    try:
        client_ip = "127.0.0.1"
        check_rate_limit(client_ip)
        cleanup_old_files()
        print("✅ Rate limiting and cleanup completed")
    except Exception as e:
        print(f"⚠️ Warning in rate limiting/cleanup: {str(e)}")
    
    # Validate file extension
    if not file.filename or not file.filename.lower().endswith('.wav'):
        print(f"❌ Invalid file type: {file.filename}")
        raise HTTPException(status_code=400, detail="Only WAV files are allowed")
    
    print("✅ File extension validation passed")
    
    # Validate file size
    try:
        validate_file_size(file)
        print("✅ File size validation passed")
    except Exception as e:
        print(f"❌ File size validation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"File validation failed: {str(e)}")
    
    input_path = None
    output_path = None
    
    try:
        # Generate unique filenames
        input_filename = generate_unique_filename(file.filename)
        output_filename = generate_unique_filename(file.filename.replace('.wav', '.mp3'))
        
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        output_path = os.path.join(UPLOAD_DIR, output_filename)
        
        print(f"📁 Input path: {input_path}")
        print(f"📁 Output path: {output_path}")
        
        # Read and save uploaded file
        print("📥 Reading uploaded file...")
        content = await file.read()
        print(f"✅ File read successfully, size: {len(content)} bytes")
        
        # Save to disk
        print("💾 Saving file to disk...")
        await write_file(input_path, content)
        
        # Verify file was saved
        if not os.path.exists(input_path):
            raise Exception(f"Failed to save input file: {input_path}")
        
        file_size = os.path.getsize(input_path)
        print(f"✅ File saved successfully, size on disk: {file_size} bytes")
        
        # Convert WAV to MP3
        print("🔄 Starting WAV to MP3 conversion...")
        success = await wav_to_mp3_converter(input_path, output_path)
        
        if not success:
            print("❌ Conversion function returned False")
            raise Exception("Audio conversion failed - converter returned False")
        
        # Verify output file was created
        if not os.path.exists(output_path):
            print("❌ Output file was not created")
            raise Exception("Conversion failed - output file not found")
        
        output_size = os.path.getsize(output_path)
        print(f"✅ Conversion successful! Output file size: {output_size} bytes")
        
        # Cleanup input file
        try:
            if os.path.exists(input_path):
                os.remove(input_path)
                print("🗑️ Input file cleaned up")
        except Exception as cleanup_error:
            print(f"⚠️ Warning: Failed to cleanup input file: {cleanup_error}")
        
        # Return success response
        response = {
            "message": "WAV converted to MP3 successfully",
            "download_url": f"/download/{output_filename}",
            "filename": output_filename
        }
        print(f"✅ Returning success response: {response}")
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"❌ Conversion error occurred: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        traceback.print_exc()
        
        # Cleanup files on error
        try:
            if input_path and os.path.exists(input_path):
                os.remove(input_path)
                print("🗑️ Cleaned up input file after error")
            if output_path and os.path.exists(output_path):
                os.remove(output_path)
                print("🗑️ Cleaned up partial output file after error")
        except Exception as cleanup_error:
            print(f"⚠️ Error during cleanup: {cleanup_error}")
        
        # Return detailed error
        error_message = f"Conversion error: {str(e)}"
        print(f"📤 Returning error response: {error_message}")
        raise HTTPException(status_code=500, detail=error_message)