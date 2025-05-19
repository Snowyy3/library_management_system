# import mysql.connector
from mysql.connector import Error  # , IntegrityError
from .db_config import get_db_connection


def borrow_book(reader_id, book_id):
    actual_success = False  # Default to False
    actual_message = "Borrowing failed due to an unexpected error (Python init)."

    conn = get_db_connection()
    if not conn:
        print("Error: Failed to connect to the database pool.")
        return actual_success, actual_message  # Return initialized defaults

    try:
        with conn.cursor(dictionary=True) as cursor:
            # Pass placeholders for OUT params; order must match SP
            args_tuple = (reader_id, book_id, False, "")  # Initial values for OUT params in tuple

            cursor.callproc("sp_BorrowBook", args_tuple)

            sp_output_from_select = None
            for result in cursor.stored_results():  # This should now always find a result set
                sp_output_from_select = result.fetchone()
                break

            if sp_output_from_select:
                actual_success = bool(sp_output_from_select.get("success", False))
                actual_message = sp_output_from_select.get("message", "SP SELECT output key missing.")
            else:
                # This case should ideally not be hit if the SP is correct now
                actual_message = "Failed to retrieve OUT parameters from SP's final SELECT."
                print(f"Warning: {actual_message}")

    except Error as e:
        print(f"Database error during borrow_book call (Reader {reader_id}, Book {book_id}): {e}")
        actual_success = False
        actual_message = f"Database error during procedure execution: {e}"
    finally:
        if conn and conn.is_connected():
            conn.close()

    return actual_success, actual_message


def return_book(reader_id, book_id):
    """
    Handles returning a book by updating the ReturnDate in the Borrowing table.
    Relies on trg_AfterBorrowUpdate trigger to increment book quantity.
    Returns True if an active loan was found and updated, False otherwise.
    """
    success = False
    # SQL sets ReturnDate to current date only for the matching active loan
    sql = """UPDATE Borrowing
             SET ReturnDate = CURDATE()
             WHERE ReaderID = %s AND BookID = %s AND ReturnDate IS NULL"""
    conn = get_db_connection()

    if not conn:
        print("Error: Failed to connect to the database pool for returning book.")
        return False

    try:
        with conn.cursor() as cursor:
            # Execute the update statement with parameters
            cursor.execute(sql, (reader_id, book_id))
            # Commit the change to the database
            conn.commit()  # Commit the UPDATE statement

            # Check if a row was actually updated (i.e., an active loan existed)
            if cursor.rowcount > 0:
                success = True
                # print(f"Successfully recorded return for Reader {reader_id}, Book {book_id}.") # Optional print
            else:
                # print(f"Info: No active borrowing record found for Reader {reader_id}, Book {book_id} to update.") # Optional print
                success = False  # No active loan was returned

    except Error as e:
        print(f"Database error during return_book (Reader {reader_id}, Book {book_id}): {e}")
        success = False  # Ensure success is False on database error
        # Attempt rollback if commit failed
        try:
            if conn and conn.in_transaction():
                print("Attempting Python-side rollback due to error...")
                conn.rollback()  # Rollback any potential lingering transaction state
        except Error as rb_e:
            print(f"Rollback error: {rb_e}")
    finally:
        if conn and conn.is_connected():
            conn.close()  # Return connection to pool

    return success  # Return True only if an active loan was updated
