from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List
from db.borrowing import borrow_book, return_book
from db.db_config import get_db_connection

router = APIRouter()


# Pydantic models for request/response
class BorrowRequest(BaseModel):
    reader_id: int
    book_id: int


class ReturnRequest(BaseModel):
    reader_id: int
    book_id: int


class AvailableBook(BaseModel):
    BookID: int
    Title: str
    Author: str
    Quantity: int


class ActiveBorrowing(BaseModel):
    BookID: int
    Title: str
    Author: str
    BorrowDate: str


class BookBorrowerInfo(BaseModel):
    ReaderID: int
    ReaderName: str
    PhoneNumber: str
    BorrowDate: str
    DueDate: str


@router.post("/borrow", status_code=200)
def api_borrow_book(req: BorrowRequest):
    success, message = borrow_book(req.reader_id, req.book_id)
    return {"success": success, "message": message}


@router.post("/return", status_code=200)
def api_return_book(req: ReturnRequest):
    success = return_book(req.reader_id, req.book_id)
    if success:
        return {"success": True, "message": "Book returned successfully."}
    else:
        return {"success": False, "message": "No active borrowing found for this reader and book."}


@router.get("/available", response_model=List[AvailableBook])
def get_available_books():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error.")
    try:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute(
                "SELECT b.BookID, b.BookName AS Title, a.AuthorName AS Author, b.Quantity FROM Books b JOIN Authors a ON b.AuthorID = a.AuthorID"
            )
            books = cursor.fetchall()
        return books
    finally:
        if conn and conn.is_connected():
            conn.close()


@router.get("/active_by_reader/{reader_id}", response_model=List[ActiveBorrowing])
def get_active_borrowings_by_reader(reader_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error.")
    try:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute(
                """
                SELECT b.BookID, bk.BookName AS Title, a.AuthorName AS Author, b.BorrowDate
                FROM Borrowing b
                JOIN Books bk ON b.BookID = bk.BookID
                JOIN Authors a ON bk.AuthorID = a.AuthorID
                WHERE b.ReaderID = %s AND b.ReturnDate IS NULL
            """,
                (reader_id,),
            )
            borrowings = cursor.fetchall()
            # Convert BorrowDate to string (ISO format) for each record
            for b in borrowings:
                if b["BorrowDate"] is not None:
                    b["BorrowDate"] = b["BorrowDate"].isoformat()
        return borrowings
    finally:
        if conn and conn.is_connected():
            conn.close()


@router.get("/active_by_book/{book_id}", response_model=List[BookBorrowerInfo])
def get_active_borrowers_by_book(book_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error.")
    try:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute(
                """
                SELECT r.ReaderID, r.ReaderName, r.PhoneNumber, b.BorrowDate,
                       DATE_ADD(b.BorrowDate, INTERVAL 14 DAY) AS DueDate
                FROM Borrowing b
                JOIN Readers r ON b.ReaderID = r.ReaderID
                WHERE b.BookID = %s AND b.ReturnDate IS NULL
                ORDER BY b.BorrowDate
                """,
                (book_id,),
            )
            borrowers = cursor.fetchall()
            # Convert dates to ISO string
            for br in borrowers:
                if br["BorrowDate"] is not None:
                    br["BorrowDate"] = br["BorrowDate"].isoformat()
                if br["DueDate"] is not None:
                    br["DueDate"] = br["DueDate"].isoformat()
        return borrowers
    finally:
        if conn and conn.is_connected():
            conn.close()


@router.get("/books/with_borrowed_count", response_model=List[dict])
def get_books_with_borrowed_count():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error.")
    try:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute(
                """
                SELECT b.BookID, b.BookName AS Title, a.AuthorName AS Author, 
                       c.CategoryName, b.PublishYear, b.Quantity,
                       COUNT(br.BorrowID) AS CurrentlyBorrowed
                FROM Books b
                JOIN Authors a ON b.AuthorID = a.AuthorID
                JOIN Categories c ON b.CategoryID = c.CategoryID
                LEFT JOIN Borrowing br ON b.BookID = br.BookID AND br.ReturnDate IS NULL
                GROUP BY b.BookID, b.BookName, a.AuthorName, c.CategoryName, b.PublishYear, b.Quantity
                ORDER BY b.BookName
                """
            )
            books = cursor.fetchall()
        return books
    finally:
        if conn and conn.is_connected():
            conn.close()
