# import mysql.connector
from mysql.connector import Error, IntegrityError
from .db_config import get_db_connection  # Relative import
from fastapi import APIRouter, HTTPException, status  # Added status
from typing import List  # Added
from pydantic import BaseModel  # Added


# Added Pydantic model for Category response
class Category(BaseModel):  # Added
    CategoryID: int  # Added
    CategoryName: str  # Added


class CategoryCreate(BaseModel):  # Added
    CategoryName: str  # Added


class CategoryUpdate(BaseModel):  # Added
    CategoryName: str  # Added


router = APIRouter()  # Added


def add_category(name):
    """Adds a new category to the Categories table."""
    new_category_id = None
    # Assuming CategoryName should be unique, handle potential duplicate error
    sql = "INSERT INTO Categories (CategoryName) VALUES (%s)"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (name,))
                conn.commit()
                new_category_id = cursor.lastrowid
                print(f"Successfully added category '{name}' with ID: {new_category_id}")
        except IntegrityError as ie:
            # Catches unique constraint violation if CategoryName must be unique
            print(f"Error adding category '{name}': Category name likely already exists. {ie}")
        except Error as e:
            print(f"Error adding category: {e}")
        finally:
            conn.close()
    return new_category_id


@router.get("/", response_model=List[Category])  # Added
async def read_all_categories():  # Added
    """
    Retrieve all categories from the database.
    """
    try:
        categories_list = get_all_categories()
        if not categories_list:
            return []  # Return empty list if no categories found
        return categories_list
    except Exception as e:
        print(f"Error in read_all_categories: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error while fetching categories: {str(e)}")


@router.post("/", response_model=Category, status_code=status.HTTP_201_CREATED)  # Added
def create_category(category: CategoryCreate):  # Added
    category_id = add_category(category.CategoryName)  # Added
    if category_id:  # Added
        return {"CategoryID": category_id, "CategoryName": category.CategoryName}  # Added
    raise HTTPException(status_code=500, detail="Failed to create category.")  # Added


@router.put("/{category_id}", response_model=Category)  # Added
def update_category_endpoint(category_id: int, category: CategoryUpdate):  # Added
    success = update_category(category_id, category.CategoryName)  # Added
    if success:  # Added
        return {"CategoryID": category_id, "CategoryName": category.CategoryName}  # Added
    raise HTTPException(status_code=404, detail="Category not found or name already exists.")  # Added


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)  # Added
def delete_category_endpoint(category_id: int):  # Added
    try:  # Added
        success = delete_category(category_id)  # Added
        if success:  # Added
            return  # Added
        raise HTTPException(status_code=404, detail="Category not found.")  # Added
    except IntegrityError:  # Added
        raise HTTPException(status_code=409, detail="Cannot delete category: linked to existing books.")  # Added


def get_all_categories():
    """Retrieves all categories from the database, ordered by name."""
    categories = []
    sql = "SELECT CategoryID, CategoryName FROM Categories ORDER BY CategoryName"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql)
                categories = cursor.fetchall()
        except Error as e:
            print(f"Error fetching categories: {e}")
        finally:
            conn.close()
    return categories


def get_category_by_id(category_id):
    """Retrieves a single category by its ID."""
    category = None
    sql = "SELECT CategoryID, CategoryName FROM Categories WHERE CategoryID = %s"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql, (category_id,))
                category = cursor.fetchone()
        except Error as e:
            print(f"Error fetching category by ID {category_id}: {e}")
        finally:
            conn.close()
    return category


def get_category_by_name(name):
    """Retrieves a category by its name (case-insensitive). Returns dict or None."""
    category = None
    sql = "SELECT CategoryID, CategoryName FROM Categories WHERE LOWER(CategoryName) = LOWER(%s)"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql, (name,))
                category = cursor.fetchone()
        except Error as e:
            print(f"Error fetching category by name '{name}': {e}")
        finally:
            conn.close()
    return category


def update_category(category_id, new_name):
    """Updates the name of an existing category."""
    success = False
    sql = "UPDATE Categories SET CategoryName = %s WHERE CategoryID = %s"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (new_name, category_id))
                conn.commit()
                if cursor.rowcount > 0:
                    success = True
                    print(f"Successfully updated category ID {category_id}.")
                else:
                    print(f"Warning: Category ID {category_id} not found for update.")
        except IntegrityError as ie:
            print(
                f"Error updating category ID {category_id}: New name '{new_name}' likely violates unique constraint. {ie}"
            )
        except Error as e:
            print(f"Error updating category ID {category_id}: {e}")
        finally:
            conn.close()
    return success


def delete_category(category_id):
    """Deletes a category by ID. Handles IntegrityError if category is linked to books."""
    success = False
    sql = "DELETE FROM Categories WHERE CategoryID = %s"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (category_id,))
                conn.commit()
                if cursor.rowcount > 0:
                    success = True
                    print(f"Successfully deleted category ID {category_id}.")
                else:
                    print(f"Warning: Category ID {category_id} not found for deletion.")
        except IntegrityError as ie:
            print(
                f"Error deleting category ID {category_id}: Cannot delete - category is linked to existing books. {ie}"
            )
        except Error as e:
            print(f"Error deleting category ID {category_id}: {e}")
        finally:
            conn.close()
    return success
