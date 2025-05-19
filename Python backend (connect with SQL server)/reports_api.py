from fastapi import APIRouter, Query, Depends, HTTPException
from typing import Optional, List, Literal
from pydantic import BaseModel

from db.reports import (
    report_available_books,
    report_currently_borrowed,
    report_overdue_books,
    report_popular_books,
    get_database_counts,
    get_transaction_trends,
)

router = APIRouter()


# Pydantic models for Transaction Trends
class TransactionCountItem(BaseModel):
    label: str  # e.g., "YYYY-MM-DD" for daily, "Week X (YYYY-MM-DD to YYYY-MM-DD)" for weekly
    borrows: int
    returns: int


class TransactionTrendsData(BaseModel):
    period_type: Literal["daily", "weekly"]
    data: List[TransactionCountItem]


@router.get("/available-books")
def get_available_books():
    return report_available_books()


@router.get("/currently-borrowed")
def get_currently_borrowed():
    return report_currently_borrowed()


@router.get("/overdue")
def get_overdue_books(loan_period_days: Optional[int] = Query(14, description="Loan period in days")):
    return report_overdue_books(loan_period_days)


@router.get("/popular-books")
def get_popular_books(limit: Optional[int] = Query(10, description="Number of top books to return")):
    return report_popular_books(limit)


@router.get("/counts")
def get_counts():
    return get_database_counts()


@router.get("/transaction-trends", response_model=TransactionTrendsData, tags=["reports"])
async def get_transaction_trends_report(period: Literal["week", "month"] = "week"):
    """
    Get transaction trends (borrows and returns).
    - **period='week'**: Daily counts for the last 7 days.
    - **period='month'**: Weekly counts for the last 4 weeks.
    """
    try:
        trends_data = get_transaction_trends(None, period)  # Pass None for db argument
        if not trends_data:
            return TransactionTrendsData(period_type="daily" if period == "week" else "weekly", data=[])
        if period == "week":
            return TransactionTrendsData(period_type="daily", data=trends_data)
        else:
            return TransactionTrendsData(period_type="weekly", data=trends_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve transaction trends: {str(e)}")
