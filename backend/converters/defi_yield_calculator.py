# converters/defi_yield_calculator.py - DeFi Yield Calculator logic
from utils.dependencies import FINANCE_AVAILABLE
import json
from typing import Dict, Any

async def defi_yield_calculator(data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate DeFi yield and returns"""
    if not FINANCE_AVAILABLE:
        return {"error": "Finance tools not available"}

    try:
        # Extract input parameters
        principal = float(data.get('principal', 0))
        apy = float(data.get('apy', 0))
        duration_days = int(data.get('duration_days', 365))
        compound_frequency = data.get('compound_frequency', 'daily')  # daily, weekly, monthly
        fees = float(data.get('fees', 0))  # percentage

        if principal <= 0 or apy < 0:
            return {"error": "Invalid input: Principal must be positive, APY must be non-negative"}

        # Convert APY to decimal
        apy_decimal = apy / 100

        # Determine compounding periods per year
        if compound_frequency == 'daily':
            compounds_per_year = 365
        elif compound_frequency == 'weekly':
            compounds_per_year = 52
        elif compound_frequency == 'monthly':
            compounds_per_year = 12
        else:
            compounds_per_year = 365

        # Calculate compound interest
        periods = (duration_days / 365) * compounds_per_year
        compound_multiplier = (1 + apy_decimal / compounds_per_year) ** periods
        final_amount = principal * compound_multiplier

        # Calculate simple interest for comparison
        simple_interest_amount = principal * (1 + apy_decimal * (duration_days / 365))

        # Apply fees
        fees_decimal = fees / 100
        final_amount_after_fees = final_amount * (1 - fees_decimal)

        # Calculate yields
        total_yield = final_amount - principal
        total_yield_after_fees = final_amount_after_fees - principal

        # Daily, weekly, monthly yields
        daily_yield = (final_amount / principal) ** (1 / duration_days) - 1
        weekly_yield = (final_amount / principal) ** (7 / duration_days) - 1
        monthly_yield = (final_amount / principal) ** (30 / duration_days) - 1

        # Calculate effective APY (actual return considering compounding)
        effective_apy = ((final_amount / principal) ** (365 / duration_days) - 1) * 100

        return {
            "success": True,
            "input": {
                "principal": principal,
                "apy": apy,
                "duration_days": duration_days,
                "compound_frequency": compound_frequency,
                "fees": fees
            },
            "results": {
                "final_amount": round(final_amount, 2),
                "final_amount_after_fees": round(final_amount_after_fees, 2),
                "total_yield": round(total_yield, 2),
                "total_yield_after_fees": round(total_yield_after_fees, 2),
                "yield_percentage": round((total_yield / principal) * 100, 2),
                "yield_percentage_after_fees": round((total_yield_after_fees / principal) * 100, 2),
                "effective_apy": round(effective_apy, 2),
                "daily_yield_rate": round(daily_yield * 100, 4),
                "weekly_yield_rate": round(weekly_yield * 100, 4),
                "monthly_yield_rate": round(monthly_yield * 100, 4),
                "simple_interest_comparison": round(simple_interest_amount, 2),
                "compound_advantage": round(final_amount - simple_interest_amount, 2)
            },
            "breakdown": {
                "periods_compounded": int(periods),
                "compound_multiplier": round(compound_multiplier, 6),
                "fees_paid": round(final_amount * fees_decimal, 2)
            },
            "projections": {
                "1_month": round(principal * ((1 + apy_decimal / compounds_per_year) ** (30 / 365 * compounds_per_year)), 2),
                "3_months": round(principal * ((1 + apy_decimal / compounds_per_year) ** (90 / 365 * compounds_per_year)), 2),
                "6_months": round(principal * ((1 + apy_decimal / compounds_per_year) ** (180 / 365 * compounds_per_year)), 2),
                "1_year": round(principal * ((1 + apy_decimal / compounds_per_year) ** compounds_per_year), 2)
            }
        }

    except Exception as e:
        return {"error": f"Calculation error: {str(e)}"}