# routers/defi_yield.py - DeFi Yield Calculator router
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json

from utils.helpers import check_rate_limit
from utils.dependencies import cleanup_old_files, FINANCE_AVAILABLE
from converters.defi_yield_calculator import defi_yield_calculator

router = APIRouter()
security = HTTPBearer(auto_error=False)

class YieldCalculationRequest(BaseModel):
    principal: float
    apy: float
    duration_days: int = 365
    compound_frequency: str = "daily"
    fees: float = 0.0

@router.post("/defi-yield-calculator")
async def calculate_defi_yield(
    request: YieldCalculationRequest,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not FINANCE_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="DeFi Yield Calculator not available. Missing finance dependencies"
        )

    # Rate limiting
    client_ip = "127.0.0.1"
    check_rate_limit(client_ip)
    cleanup_old_files()

    # Validate input
    if request.principal <= 0:
        raise HTTPException(status_code=400, detail="Principal amount must be positive")

    if request.apy < 0:
        raise HTTPException(status_code=400, detail="APY cannot be negative")

    if request.duration_days <= 0:
        raise HTTPException(status_code=400, detail="Duration must be positive")

    if request.compound_frequency not in ["daily", "weekly", "monthly"]:
        raise HTTPException(status_code=400, detail="Compound frequency must be daily, weekly, or monthly")

    if request.fees < 0 or request.fees > 100:
        raise HTTPException(status_code=400, detail="Fees must be between 0 and 100 percent")

    try:
        # Convert request to dictionary
        data = {
            "principal": request.principal,
            "apy": request.apy,
            "duration_days": request.duration_days,
            "compound_frequency": request.compound_frequency,
            "fees": request.fees
        }

        # Calculate yield
        result = await defi_yield_calculator(data)

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return {
            "message": "DeFi yield calculated successfully",
            "calculation": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@router.get("/defi-yield-calculator/info")
async def get_calculator_info():
    """Get information about the DeFi yield calculator"""
    return {
        "description": "Calculate DeFi yields with compound interest",
        "parameters": {
            "principal": "Initial investment amount (required)",
            "apy": "Annual Percentage Yield as percentage (required)",
            "duration_days": "Investment duration in days (default: 365)",
            "compound_frequency": "How often interest compounds: daily, weekly, monthly (default: daily)",
            "fees": "Platform fees as percentage (default: 0)"
        },
        "example": {
            "principal": 1000,
            "apy": 12.5,
            "duration_days": 365,
            "compound_frequency": "daily",
            "fees": 0.5
        }
    }