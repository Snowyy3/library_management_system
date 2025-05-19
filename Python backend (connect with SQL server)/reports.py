from datetime import datetime, timedelta
from typing import List, Dict, Any, Literal
from mysql.connector import Error
from .db_config import get_db_connection  # Relative import


def report_available_books():
    """Retrieves a list of books currently available (Quantity > 0) using a view."""
    books = []
    # Query the pre-defined view for available books
    sql = "SELECT * FROM vw_AvailableBooks ORDER BY BookName"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql)
                books = cursor.fetchall()
        except Error as e:
            print(f"Database error fetching available books report: {e}")
        finally:
            conn.close()
    return books


def report_currently_borrowed():
    """Retrieves a list of books currently out on loan using a view."""
    borrowed_list = []
    # Query the pre-defined view for currently borrowed books
    sql = "SELECT * FROM vw_CurrentlyBorrowed ORDER BY DueDate ASC"  # Order by due date
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql)
                borrowed_list = cursor.fetchall()
        except Error as e:
            print(f"Database error fetching currently borrowed report: {e}")
        finally:
            conn.close()
    return borrowed_list


def report_overdue_books(loan_period_days=14):
    """Generates a report of overdue books using the sp_ReportOverdueBooks procedure."""
    overdue_list = []
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                # Call the stored procedure
                cursor.callproc("sp_ReportOverdueBooks", (loan_period_days,))

                # Iterate through the result sets returned by the procedure
                # sp_ReportOverdueBooks is expected to return one result set
                for result in cursor.stored_results():
                    overdue_list = result.fetchall()
                    break  # Assuming only one result set
        except Error as e:
            print(f"Database error generating overdue books report: {e}")
        finally:
            conn.close()
    # Add Status field to each record and ensure BookID is present
    for record in overdue_list:
        record["Status"] = "Overdue"
        if "BookID" not in record:
            record["BookID"] = None  # fallback if not present
    return overdue_list


def get_database_counts():
    """Retrieves basic counts (books, authors, categories, readers) from the database."""
    counts = {"total_books": 0, "total_authors": 0, "total_categories": 0, "total_readers": 0}
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                # Execute count queries sequentially
                cursor.execute("SELECT COUNT(*) AS total FROM Books")
                result = cursor.fetchone()
                if result:
                    counts["total_books"] = result["total"]

                cursor.execute("SELECT COUNT(*) AS total FROM Authors")
                result = cursor.fetchone()
                if result:
                    counts["total_authors"] = result["total"]

                cursor.execute("SELECT COUNT(*) AS total FROM Categories")
                result = cursor.fetchone()
                if result:
                    counts["total_categories"] = result["total"]

                cursor.execute("SELECT COUNT(*) AS total FROM Readers")
                result = cursor.fetchone()
                if result:
                    counts["total_readers"] = result["total"]
        except Error as e:
            print(f"Database error getting counts: {e}")
            # Return default counts (all zeros) on error
        finally:
            conn.close()
    return counts


def report_popular_books(limit=10):
    """Generates a report of the most frequently borrowed books."""
    popular_books = []
    # SQL query to count borrows per book and rank them
    sql = """
        SELECT b.BookID, b.BookName, a.AuthorName, COUNT(br.BookID) as BorrowCount
        FROM Borrowing br
        JOIN Books b ON br.BookID = b.BookID
        JOIN Authors a ON b.AuthorID = a.AuthorID
        GROUP BY br.BookID, b.BookID, b.BookName, a.AuthorName
        ORDER BY BorrowCount DESC
        LIMIT %s
    """
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql, (limit,))  # Pass limit as parameter
                popular_books = cursor.fetchall()
        except Error as e:
            print(f"Database error generating popular books report: {e}")
        finally:
            conn.close()
    return popular_books


def get_transaction_trends(db_unused, period: Literal["week", "month"]) -> List[Dict[str, Any]]:
    """
    Calculates transaction trends (borrows and returns) for a given period using direct SQL.
    - period='week': Daily counts for the last 7 days.
    - period='month': Weekly counts for the last 4 weeks.
    """
    today = datetime.utcnow().date()
    results = []
    conn = get_db_connection()
    if not conn:
        return results
    try:
        with conn.cursor(dictionary=True) as cursor:
            if period == "week":
                for i in range(6, -1, -1):
                    current_date = today - timedelta(days=i)
                    # Borrows
                    cursor.execute(
                        """
                        SELECT COUNT(*) as count FROM Borrowing WHERE DATE(BorrowDate) = %s
                    """,
                        (current_date,),
                    )
                    borrows_count = cursor.fetchone()["count"]
                    # Returns
                    cursor.execute(
                        """
                        SELECT COUNT(*) as count FROM Borrowing WHERE DATE(ReturnDate) = %s
                    """,
                        (current_date,),
                    )
                    returns_count = cursor.fetchone()["count"]
                    results.append({
                        "label": current_date.strftime("%Y-%m-%d"),
                        "borrows": borrows_count,
                        "returns": returns_count,
                    })
            elif period == "month":
                for i in range(3, -1, -1):
                    current_week_monday = today - timedelta(days=today.weekday())
                    week_start_date = current_week_monday - timedelta(weeks=i)
                    week_end_date = week_start_date + timedelta(days=6)
                    # Borrows
                    cursor.execute(
                        """
                        SELECT COUNT(*) as count FROM Borrowing WHERE DATE(BorrowDate) >= %s AND DATE(BorrowDate) <= %s
                    """,
                        (week_start_date, week_end_date),
                    )
                    borrows_count = cursor.fetchone()["count"]
                    # Returns
                    cursor.execute(
                        """
                        SELECT COUNT(*) as count FROM Borrowing WHERE DATE(ReturnDate) >= %s AND DATE(ReturnDate) <= %s
                    """,
                        (week_start_date, week_end_date),
                    )
                    returns_count = cursor.fetchone()["count"]
                    week_label = f"Week {week_start_date.strftime('%b %d')} - {week_end_date.strftime('%b %d')}"
                    results.append({"label": week_label, "borrows": borrows_count, "returns": returns_count})
    except Exception as e:
        print(f"Database error in get_transaction_trends: {e}")
    finally:
        conn.close()
    return results


# --- Example Usage (Illustrative) ---
if __name__ == "__main__":
    print("\n--- Available Books Report ---")
    available = report_available_books()
    if available:
        print(available[:2])  # Print first two

    print("\n--- Currently Borrowed Report ---")
    borrowed = report_currently_borrowed()
    if borrowed:
        print(borrowed[:2])  # Print first two

    print("\n--- Overdue Books Report (14 days) ---")
    overdue = report_overdue_books(14)
    if overdue:
        print(overdue)

    print("\n--- Database Counts ---")
    counts = get_database_counts()
    print(counts)

    print("\n--- Top 5 Popular Books ---")
    popular = report_popular_books(limit=5)
    if popular:
        print(popular)
