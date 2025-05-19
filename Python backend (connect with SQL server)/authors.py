# import mysql.connector
from mysql.connector import Error, IntegrityError
from .db_config import get_db_connection  # Relative import
from fastapi import APIRouter, HTTPException, status  # Added status
from typing import List  # Added
from pydantic import BaseModel  # Added


# Added Pydantic model for Author response
class Author(BaseModel):
    AuthorID: int
    AuthorName: str


class AuthorCreate(BaseModel):
    AuthorName: str


class AuthorUpdate(BaseModel):
    AuthorName: str


router = APIRouter()  # Added


def add_author(name):
    """Adds a new author to the Authors table."""
    new_author_id = None
    sql = "INSERT INTO Authors (AuthorName) VALUES (%s)"
    conn = get_db_connection()
    if conn:
        try:
            # Use default cursor for operations where you don't need results as dicts,
            # or dictionary=True if you prefer it everywhere.
            with conn.cursor() as cursor:
                cursor.execute(sql, (name,))  # Data must be a tuple/list
                conn.commit()  # Make the changes permanent
                new_author_id = cursor.lastrowid  # Get the ID of the inserted row
                # print(f"Successfully added author '{name}' with ID: {new_author_id}") # Optional print
        except Error as e:
            print(f"Error adding author: {e}")
            # In a real app, you'd log this and potentially return None or False
        finally:
            conn.close()  # Return connection to the pool
    return new_author_id


@router.get("/", response_model=List[Author])  # Added
async def read_all_authors():
    """
    Retrieve all authors from the database.
    """
    try:
        authors_list = get_all_authors()
        if not authors_list:
            return []  # Return empty list if no authors found, consistent with frontend expectation
        return authors_list
    except Exception as e:
        print(f"Error in read_all_authors: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error while fetching authors: {str(e)}")


@router.post("/", response_model=Author, status_code=status.HTTP_201_CREATED)
def create_author(author: AuthorCreate):
    author_id = add_author(author.AuthorName)
    if author_id:
        return {"AuthorID": author_id, "AuthorName": author.AuthorName}
    raise HTTPException(status_code=500, detail="Failed to create author.")


@router.put("/{author_id}", response_model=Author)
def update_author_endpoint(author_id: int, author: AuthorUpdate):
    success = update_author(author_id, author.AuthorName)
    if success:
        return {"AuthorID": author_id, "AuthorName": author.AuthorName}
    raise HTTPException(status_code=404, detail="Author not found.")


@router.delete("/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_author_endpoint(author_id: int):
    try:
        success = delete_author(author_id)
        if success:
            return
        raise HTTPException(status_code=404, detail="Author not found.")
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Cannot delete author: linked to existing books.")


def get_all_authors():
    """Retrieves all authors from the database, ordered by name."""
    authors = []
    sql = "SELECT AuthorID, AuthorName FROM Authors ORDER BY AuthorName"
    conn = get_db_connection()
    if conn:
        try:
            # Use dictionary=True for easy access to columns by name
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql)
                authors = cursor.fetchall()  # Fetch all results
        except Error as e:
            print(f"Error fetching authors: {e}")
        finally:
            conn.close()
    return authors


def get_author_by_id(author_id):
    """Retrieves a single author by their ID."""
    author = None
    sql = "SELECT AuthorID, AuthorName FROM Authors WHERE AuthorID = %s"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql, (author_id,))
                author = cursor.fetchone()
        except Error as e:
            print(f"Error fetching author by ID {author_id}: {e}")
        finally:
            conn.close()
    return author


def get_author_by_name(name):
    """Retrieves an author by their name (case-insensitive). Returns dict or None."""
    author = None
    sql = "SELECT AuthorID, AuthorName FROM Authors WHERE LOWER(AuthorName) = LOWER(%s)"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql, (name,))
                author = cursor.fetchone()
        except Error as e:
            print(f"Error fetching author by name '{name}': {e}")
        finally:
            conn.close()
    return author


def update_author(author_id, new_name):
    """Updates the name of an existing author."""
    success = False
    sql = "UPDATE Authors SET AuthorName = %s WHERE AuthorID = %s"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (new_name, author_id))
                conn.commit()
                if cursor.rowcount > 0:
                    success = True
                    print(f"Successfully updated author ID {author_id}.")
                else:
                    print(f"Warning: Author ID {author_id} not found for update.")
        except Error as e:
            print(f"Error updating author ID {author_id}: {e}")
        finally:
            conn.close()
    return success


def delete_author(author_id):
    """Deletes an author by their ID. Handles IntegrityError if author is linked to books."""
    success = False
    sql = "DELETE FROM Authors WHERE AuthorID = %s"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (author_id,))
                conn.commit()
                if cursor.rowcount > 0:
                    success = True
                    print(f"Successfully deleted author ID {author_id}.")
                else:
                    print(f"Warning: Author ID {author_id} not found for deletion.")
        except IntegrityError as ie:
            print(f"Error deleting author ID {author_id}: Cannot delete - author is linked to existing books. {ie}")
        except Error as e:
            print(f"Error deleting author ID {author_id}: {e}")
        finally:
            conn.close()
    return success
