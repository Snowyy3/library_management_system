from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel, Field
from typing import List, Optional

from mysql.connector import Error, IntegrityError
from .db_config import get_db_connection  # Relative import
from db.authors import get_author_by_name, add_author
from db.categories import get_category_by_name, add_category
from db.book_delete_utils import has_active_borrowing, has_historical_borrowing, delete_borrowing_history

router = APIRouter()


# Pydantic Models for Book data
class BookBase(BaseModel):
    BookName: str = Field(..., min_length=1, max_length=255)
    AuthorID: Optional[int] = None
    AuthorName: Optional[str] = None
    PublishYear: Optional[int] = None
    Quantity: int = Field(..., ge=0)  # Quantity must be greater than or equal to 0
    CategoryID: Optional[int] = None
    CategoryName: Optional[str] = None


class BookCreate(BookBase):
    pass


class BookAuthorCategory(BaseModel):  # For representing author and category names
    AuthorID: int
    AuthorName: str
    CategoryID: int
    CategoryName: str


class BookDisplay(BookBase):
    BookID: int
    AuthorName: str  # Added from join
    CategoryName: str  # Added from join

    class Config:
        orm_mode = True


# API Endpoints
@router.post("/", response_model=BookDisplay, status_code=status.HTTP_201_CREATED)
def create_book_api(book: BookCreate):
    # Resolve AuthorID
    author_id = book.AuthorID
    if not author_id and book.AuthorName:
        author = get_author_by_name(book.AuthorName)
        if author:
            author_id = author["AuthorID"]
        else:
            author_id = add_author(book.AuthorName)
            if not author_id:
                raise HTTPException(status_code=500, detail="Failed to create new author.")
    if not author_id:
        raise HTTPException(status_code=400, detail="AuthorID or AuthorName required.")

    # Resolve CategoryID
    category_id = book.CategoryID
    if not category_id and book.CategoryName:
        category = get_category_by_name(book.CategoryName)
        if category:
            category_id = category["CategoryID"]
        else:
            category_id = add_category(book.CategoryName)
            if not category_id:
                raise HTTPException(status_code=500, detail="Failed to create new category.")
    if not category_id:
        raise HTTPException(status_code=400, detail="CategoryID or CategoryName required.")

    sql = """INSERT INTO Books (BookName, AuthorID, PublishYear, Quantity, CategoryID)
             VALUES (%s, %s, %s, %s, %s)"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database connection failed")
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, (book.BookName, author_id, book.PublishYear, book.Quantity, category_id))
            conn.commit()
            new_book_id = cursor.lastrowid
            if new_book_id:
                created_book_details = get_book_details_by_id_api(new_book_id)
                if created_book_details:
                    return created_book_details
                else:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Failed to retrieve created book details.",
                    )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create book, no ID returned."
                )
    except IntegrityError as ie:
        conn.rollback()
        error_detail = (
            f"Error creating book '{book.BookName}': Invalid AuthorID ({author_id}) or CategoryID ({category_id})."
        )
        if "FOREIGN KEY (`AuthorID`)" in str(ie):
            error_detail = f"Author with ID {author_id} does not exist."
        elif "FOREIGN KEY (`CategoryID`)" in str(ie):
            error_detail = f"Category with ID {category_id} does not exist."
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_detail)
    except Error as e:
        conn.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {e}")
    finally:
        if conn:
            conn.close()


@router.get("/", response_model=List[BookDisplay])
def get_all_books_api():
    books_data = get_all_books_details()
    if not books_data:
        return []
    return [
        BookDisplay(
            BookID=b["BookID"],
            BookName=b["BookName"],
            AuthorID=b["AuthorID"],
            PublishYear=b["PublishYear"],
            Quantity=b["Quantity"],
            CategoryID=b["CategoryID"],
            AuthorName=b["AuthorName"],
            CategoryName=b["CategoryName"],
        )
        for b in books_data
    ]


@router.get("/{book_id}", response_model=BookDisplay)
def get_book_details_by_id_api(book_id: int):
    book_data = get_book_details_by_id(book_id)
    if not book_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {book_id} not found")
    return BookDisplay(
        BookID=book_data["BookID"],
        BookName=book_data["BookName"],
        AuthorID=book_data["AuthorID"],
        PublishYear=book_data["PublishYear"],
        Quantity=book_data["Quantity"],
        CategoryID=book_data["CategoryID"],
        AuthorName=book_data["AuthorName"],
        CategoryName=book_data["CategoryName"],
    )


class BookUpdate(BaseModel):
    BookName: Optional[str] = Field(None, min_length=1, max_length=255)
    AuthorID: Optional[int] = None
    AuthorName: Optional[str] = None
    PublishYear: Optional[int] = None
    CategoryID: Optional[int] = None
    CategoryName: Optional[str] = None
    Quantity: Optional[int] = Field(None, ge=0)  # Allow updating quantity


@router.put("/{book_id}", response_model=BookDisplay)
def update_book_api(book_id: int, book_update: BookUpdate):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database connection failed")

    current_book = get_book_details_by_id(book_id)
    if not current_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {book_id} not found for update."
        )

    # --- Resolve AuthorID (support AuthorName) ---
    updated_author_id = book_update.AuthorID if book_update.AuthorID is not None else current_book["AuthorID"]
    if updated_author_id is None and getattr(book_update, "AuthorName", None):
        author = get_author_by_name(book_update.AuthorName)
        if author:
            updated_author_id = author["AuthorID"]
        else:
            updated_author_id = add_author(book_update.AuthorName)
            if not updated_author_id:
                raise HTTPException(status_code=500, detail="Failed to create new author.")
    if updated_author_id is None:
        raise HTTPException(status_code=400, detail="AuthorID or AuthorName required.")

    # --- Resolve CategoryID (support CategoryName) ---
    updated_category_id = book_update.CategoryID if book_update.CategoryID is not None else current_book["CategoryID"]
    if updated_category_id is None and getattr(book_update, "CategoryName", None):
        category = get_category_by_name(book_update.CategoryName)
        if category:
            updated_category_id = category["CategoryID"]
        else:
            updated_category_id = add_category(book_update.CategoryName)
            if not updated_category_id:
                raise HTTPException(status_code=500, detail="Failed to create new category.")
    if updated_category_id is None:
        raise HTTPException(status_code=400, detail="CategoryID or CategoryName required.")

    updated_name = book_update.BookName if book_update.BookName is not None else current_book["BookName"]
    updated_publish_year = (
        book_update.PublishYear if book_update.PublishYear is not None else current_book["PublishYear"]
    )
    updated_quantity = book_update.Quantity if book_update.Quantity is not None else current_book["Quantity"]

    sql = """UPDATE Books
             SET BookName = %s, AuthorID = %s, PublishYear = %s, CategoryID = %s, Quantity = %s
             WHERE BookID = %s"""
    try:
        print(f"[DEBUG] Attempting to update BookID={book_id} with values:")
        print(f"  Name: {updated_name}")
        print(f"  AuthorID: {updated_author_id}")
        print(f"  PublishYear: {updated_publish_year}")
        print(f"  CategoryID: {updated_category_id}")
        print(f"  Quantity: {updated_quantity}")
        with conn.cursor() as cursor:
            cursor.execute(
                sql,
                (updated_name, updated_author_id, updated_publish_year, updated_category_id, updated_quantity, book_id),
            )
            conn.commit()
            print(f"[DEBUG] SQL UPDATE rowcount: {cursor.rowcount}")
            if cursor.rowcount == 0:
                print(f"[DEBUG] No rows updated for BookID={book_id}.")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Book with ID {book_id} not found during update execution.",
                )

        updated_book_details = get_book_details_by_id_api(book_id)
        if not updated_book_details:
            print(f"[DEBUG] Updated book details not found after update for BookID={book_id}.")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve updated book details."
            )
        return updated_book_details
    except IntegrityError as ie:
        conn.rollback()
        error_detail = f"Error updating book ID {book_id}."
        if "FOREIGN KEY (`AuthorID`)" in str(ie) and updated_author_id is not None:
            error_detail = f"Author with ID {updated_author_id} does not exist."
        elif "FOREIGN KEY (`CategoryID`)" in str(ie) and updated_category_id is not None:
            error_detail = f"Category with ID {updated_category_id} does not exist."
        print(f"[DEBUG] IntegrityError: {error_detail}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_detail)
    except Error as e:
        conn.rollback()
        print(f"[DEBUG] Database error during book update: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error during book update: {e}"
        )
    finally:
        if conn:
            conn.close()


class BookQuantityUpdate(BaseModel):
    QuantityChange: int


@router.patch("/{book_id}/quantity", response_model=BookDisplay)
def update_book_quantity_api(book_id: int, quantity_update: BookQuantityUpdate):
    success = update_book_quantity(book_id, quantity_update.QuantityChange)
    if not success:
        book_exists = get_book_details_by_id(book_id)
        if not book_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {book_id} not found for quantity update."
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update quantity for book ID {book_id}.",
        )

    updated_book_details = get_book_details_by_id_api(book_id)
    if not updated_book_details:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve book details after quantity update.",
        )
    return updated_book_details


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book_api(
    book_id: int,
    confirm_delete_history: bool = Query(False, description="Confirm deletion of borrowing history if present"),
):
    book_to_delete = get_book_details_by_id(book_id)
    if not book_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {book_id} not found for deletion."
        )

    # 1. Check for active borrows
    if has_active_borrowing(book_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete book. It is currently borrowed by one or more readers.",
        )

    # 2. Check for historical borrows
    if has_historical_borrowing(book_id):
        if not confirm_delete_history:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This book has past borrowing records. Deleting it will also remove its borrowing history. Please confirm this action by retrying with confirm_delete_history=true.",
            )
        # User confirmed, delete borrowing history
        if not delete_borrowing_history(book_id):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete borrowing history for this book.",
            )
    # 3. Proceed to delete the book
    success = delete_book(book_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot delete book ID {book_id}. It might have existing borrowing records or another issue occurred.",
        )
    return


# Original db functions
def add_book(name, author_id, publish_year, quantity, category_id):
    new_book_id = None
    sql = """INSERT INTO Books (BookName, AuthorID, PublishYear, Quantity, CategoryID)
             VALUES (%s, %s, %s, %s, %s)"""
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (name, author_id, publish_year, quantity, category_id))
                conn.commit()
                new_book_id = cursor.lastrowid
                print(f"Successfully added book '{name}' with ID: {new_book_id}")
        except IntegrityError as ie:
            print(f"Error adding book '{name}': Invalid AuthorID ({author_id}) or CategoryID ({category_id}). {ie}")
        except Error as e:
            print(f"Error adding book: {e}")
        finally:
            conn.close()
    return new_book_id


def get_all_books_details():
    books = []
    sql = """SELECT
                b.BookID, b.BookName, b.PublishYear, b.Quantity,
                a.AuthorID, a.AuthorName,
                c.CategoryID, c.CategoryName
             FROM Books b
             JOIN Authors a ON b.AuthorID = a.AuthorID
             JOIN Categories c ON b.CategoryID = c.CategoryID
             ORDER BY b.BookName"""
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql)
                books = cursor.fetchall()
        except Error as e:
            print(f"Error fetching all book details: {e}")
        finally:
            conn.close()
    return books


def get_book_details_by_id(book_id):
    book = None
    sql = """SELECT
                b.BookID, b.BookName, b.PublishYear, b.Quantity,
                a.AuthorID, a.AuthorName,
                c.CategoryID, c.CategoryName
             FROM Books b
             JOIN Authors a ON b.AuthorID = a.AuthorID
             JOIN Categories c ON b.CategoryID = c.CategoryID
             WHERE b.BookID = %s"""
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql, (book_id,))
                book = cursor.fetchone()
        except Error as e:
            print(f"Error fetching book details by ID {book_id}: {e}")
        finally:
            conn.close()
    return book


def update_book_details(book_id, new_name, new_author_id, new_publish_year, new_category_id):
    success = False
    sql = """UPDATE Books
             SET BookName = %s, AuthorID = %s, PublishYear = %s, CategoryID = %s
             WHERE BookID = %s"""
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (new_name, new_author_id, new_publish_year, new_category_id, book_id))
                conn.commit()
                if cursor.rowcount > 0:
                    success = True
                    print(f"Successfully updated details for book ID {book_id}.")
                else:
                    print(f"Warning: Book ID {book_id} not found for detail update.")
        except IntegrityError as ie:
            print(
                f"Error updating book details for ID {book_id}: Invalid AuthorID ({new_author_id}) or CategoryID ({new_category_id}). {ie}"
            )
        except Error as e:
            print(f"Error updating book details for ID {book_id}: {e}")
        finally:
            conn.close()
    return success


def update_book_quantity(book_id, quantity_change):
    success = False
    sql = """UPDATE Books
             SET Quantity = GREATEST(0, Quantity + %s)
             WHERE BookID = %s"""
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (quantity_change, book_id))
                conn.commit()
                if cursor.rowcount > 0:
                    success = True
                    print(f"Successfully updated quantity for book ID {book_id} by {quantity_change}.")
                else:
                    print(
                        f"Warning: Book ID {book_id} not found for quantity update, or quantity already 0 and change was negative."
                    )
        except Error as e:
            print(f"Error updating quantity for book ID {book_id}: {e}")
            success = False
        finally:
            conn.close()
    return success


def delete_book(book_id):
    success = False
    sql = "DELETE FROM Books WHERE BookID = %s"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (book_id,))
                conn.commit()
                if cursor.rowcount > 0:
                    success = True
                    print(f"Successfully deleted book ID {book_id}.")
                else:
                    print(f"Warning: Book ID {book_id} not found for deletion.")
        except IntegrityError as ie:
            print(f"Error deleting book ID {book_id}: Cannot delete - book has existing borrowing records. {ie}")
        except Error as e:
            print(f"Error deleting book ID {book_id}: {e}")
        finally:
            conn.close()
    return success
