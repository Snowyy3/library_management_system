# Utility functions for book deletion logic
from mysql.connector import Error
from db.db_config import get_db_connection


def has_active_borrowing(book_id):
    conn = get_db_connection()
    if not conn:
        return False
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM Borrowing WHERE BookID = %s AND ReturnDate IS NULL", (book_id,))
            (count,) = cursor.fetchone()
            return count > 0
    except Error:
        return False
    finally:
        conn.close()


def has_historical_borrowing(book_id):
    conn = get_db_connection()
    if not conn:
        return False
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM Borrowing WHERE BookID = %s", (book_id,))
            (count,) = cursor.fetchone()
            return count > 0
    except Error:
        return False
    finally:
        conn.close()


def delete_borrowing_history(book_id):
    conn = get_db_connection()
    if not conn:
        return False
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM Borrowing WHERE BookID = %s", (book_id,))
            conn.commit()
            return True
    except Error:
        return False
    finally:
        conn.close()
