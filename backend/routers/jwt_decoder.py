# routers/jwt_decoder.py - JWT Token Decoder router
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional

from utils.helpers import check_rate_limit
from utils.dependencies import cleanup_old_files, JWT_AVAILABLE
from converters.jwt_token_decoder import jwt_token_decoder

router = APIRouter()
security = HTTPBearer(auto_error=False)

class JWTDecodeRequest(BaseModel):
    token: str
    verify_signature: bool = False
    secret: Optional[str] = None

@router.post("/jwt-decoder")
async def decode_jwt_token(
    request: JWTDecodeRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not JWT_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="JWT Decoder not available. Missing JWT dependencies"
        )

    # Rate limiting
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()

    # Validate input
    if not request.token or not request.token.strip():
        raise HTTPException(status_code=400, detail="JWT token is required")

    if request.verify_signature and not request.secret:
        raise HTTPException(status_code=400, detail="Secret is required for signature verification")

    try:
        # Decode JWT token
        result = await jwt_token_decoder(
            token=request.token,
            verify_signature=request.verify_signature,
            secret=request.secret
        )

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return {
            "message": "JWT token decoded successfully",
            "decoded_token": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decoding error: {str(e)}")

@router.get("/jwt-decoder/info")
async def get_decoder_info():
    """Get information about the JWT decoder"""
    return {
        "description": "Decode and analyze JWT tokens",
        "parameters": {
            "token": "JWT token to decode (required)",
            "verify_signature": "Whether to verify the signature (default: false)",
            "secret": "Secret key for signature verification (required if verify_signature is true)"
        },
        "features": [
            "Decodes JWT header and payload",
            "Analyzes token claims and timestamps",
            "Identifies security issues",
            "Verifies signatures (optional)",
            "Shows custom claims",
            "Calculates token age and expiry"
        ],
        "example": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            "verify_signature": False,
            "secret": null
        }
    }