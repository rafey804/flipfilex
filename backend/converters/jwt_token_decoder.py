# converters/jwt_token_decoder.py - JWT Token Decoder logic
from utils.dependencies import JWT_AVAILABLE
import json
import base64
from typing import Dict, Any

async def jwt_token_decoder(token: str, verify_signature: bool = False, secret: str = None) -> Dict[str, Any]:
    """Decode and analyze JWT token"""
    if not JWT_AVAILABLE:
        return {"error": "JWT tools not available"}

    try:
        import jwt as pyjwt
        from datetime import datetime, timezone
        import re

        # Remove Bearer prefix if present
        token = re.sub(r'^Bearer\s+', '', token.strip())

        # Split JWT token
        try:
            parts = token.split('.')
            if len(parts) != 3:
                return {"error": "Invalid JWT format: must have 3 parts separated by dots"}
        except Exception:
            return {"error": "Invalid JWT format"}

        header_encoded, payload_encoded, signature_encoded = parts

        # Decode header
        try:
            # Add padding if needed
            header_padded = header_encoded + '=' * (4 - len(header_encoded) % 4)
            header_decoded = base64.urlsafe_b64decode(header_padded)
            header = json.loads(header_decoded)
        except Exception as e:
            return {"error": f"Failed to decode header: {str(e)}"}

        # Decode payload
        try:
            # Add padding if needed
            payload_padded = payload_encoded + '=' * (4 - len(payload_encoded) % 4)
            payload_decoded = base64.urlsafe_b64decode(payload_padded)
            payload = json.loads(payload_decoded)
        except Exception as e:
            return {"error": f"Failed to decode payload: {str(e)}"}

        # Analyze token
        result = {
            "success": True,
            "token_parts": {
                "header": header,
                "payload": payload,
                "signature": signature_encoded
            },
            "analysis": {}
        }

        # Analyze header
        algorithm = header.get('alg', 'Unknown')
        token_type = header.get('typ', 'Unknown')
        key_id = header.get('kid', None)

        result["analysis"]["header_analysis"] = {
            "algorithm": algorithm,
            "type": token_type,
            "key_id": key_id,
            "is_none_algorithm": algorithm.lower() == 'none'
        }

        # Analyze payload claims
        current_time = datetime.now(timezone.utc).timestamp()

        # Standard claims
        issued_at = payload.get('iat')
        expires_at = payload.get('exp')
        not_before = payload.get('nbf')
        issuer = payload.get('iss')
        subject = payload.get('sub')
        audience = payload.get('aud')
        jwt_id = payload.get('jti')

        claims_analysis = {
            "issuer": issuer,
            "subject": subject,
            "audience": audience,
            "jwt_id": jwt_id
        }

        # Time-based analysis
        if issued_at:
            claims_analysis["issued_at"] = {
                "timestamp": issued_at,
                "date": datetime.fromtimestamp(issued_at, timezone.utc).isoformat(),
                "age_seconds": int(current_time - issued_at)
            }

        if expires_at:
            is_expired = current_time > expires_at
            claims_analysis["expires_at"] = {
                "timestamp": expires_at,
                "date": datetime.fromtimestamp(expires_at, timezone.utc).isoformat(),
                "is_expired": is_expired,
                "time_until_expiry_seconds": int(expires_at - current_time) if not is_expired else 0
            }

        if not_before:
            is_active = current_time >= not_before
            claims_analysis["not_before"] = {
                "timestamp": not_before,
                "date": datetime.fromtimestamp(not_before, timezone.utc).isoformat(),
                "is_active": is_active
            }

        result["analysis"]["payload_analysis"] = claims_analysis

        # Custom claims (non-standard)
        standard_claims = {'iat', 'exp', 'nbf', 'iss', 'sub', 'aud', 'jti'}
        custom_claims = {k: v for k, v in payload.items() if k not in standard_claims}
        result["analysis"]["custom_claims"] = custom_claims

        # Security analysis
        security_issues = []

        if algorithm.lower() == 'none':
            security_issues.append("Algorithm is 'none' - no signature verification")

        if not expires_at:
            security_issues.append("No expiration time (exp) claim")
        elif expires_at and current_time > expires_at:
            security_issues.append("Token is expired")

        if not issuer:
            security_issues.append("No issuer (iss) claim")

        if not subject:
            security_issues.append("No subject (sub) claim")

        result["analysis"]["security_analysis"] = {
            "issues": security_issues,
            "risk_level": "HIGH" if len(security_issues) > 2 else "MEDIUM" if len(security_issues) > 0 else "LOW"
        }

        # Signature verification (if requested and secret provided)
        if verify_signature and secret and algorithm.lower() != 'none':
            try:
                decoded_payload = pyjwt.decode(token, secret, algorithms=[algorithm])
                result["analysis"]["signature_verification"] = {
                    "valid": True,
                    "message": "Signature verified successfully"
                }
            except pyjwt.InvalidSignatureError:
                result["analysis"]["signature_verification"] = {
                    "valid": False,
                    "message": "Invalid signature"
                }
            except pyjwt.DecodeError:
                result["analysis"]["signature_verification"] = {
                    "valid": False,
                    "message": "Failed to decode token with provided secret"
                }
            except Exception as e:
                result["analysis"]["signature_verification"] = {
                    "valid": False,
                    "message": f"Verification error: {str(e)}"
                }
        elif verify_signature:
            result["analysis"]["signature_verification"] = {
                "valid": False,
                "message": "Secret required for signature verification"
            }

        return result

    except Exception as e:
        return {"error": f"JWT decoding error: {str(e)}"}