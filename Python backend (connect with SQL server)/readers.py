# import mysql.connector
from mysql.connector import Error, IntegrityError
from .db_config import get_db_connection  # Relative import
from fastapi import APIRouter, HTTPException, status
from typing import List
from pydantic import BaseModel


class Reader(BaseModel):
    ReaderID: int
    ReaderName: str
    Address: str
    PhoneNumber: str


class ReaderCreate(BaseModel):
    ReaderName: str
    Address: str
    PhoneNumber: str


class ReaderUpdate(BaseModel):
    ReaderName: str
    Address: str
    PhoneNumber: str


router = APIRouter()


@router.get("/", response_model=List[Reader])
def read_all_readers():
    try:
        readers_list = get_all_readers()
        if not readers_list:
            return []
        return readers_list
    except Exception as e:
        print(f"Error in read_all_readers: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error while fetching readers: {str(e)}")


@router.post("/", response_model=Reader, status_code=status.HTTP_201_CREATED)
def create_reader(reader: ReaderCreate):
    reader_id = add_reader(reader.ReaderName, reader.Address, reader.PhoneNumber)
    if reader_id:
        return {"ReaderID": reader_id, **reader.dict()}
    raise HTTPException(status_code=500, detail="Failed to create reader.")


@router.put("/{reader_id}", response_model=Reader)
def update_reader_endpoint(reader_id: int, reader: ReaderUpdate):
    success = update_reader(reader_id, reader.ReaderName, reader.Address, reader.PhoneNumber)
    if success:
        return {"ReaderID": reader_id, **reader.dict()}
    raise HTTPException(status_code=404, detail="Reader not found or phone number already exists.")


@router.delete("/{reader_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reader_endpoint(reader_id: int):
    try:
        success = delete_reader(reader_id)
        if success:
            return
        raise HTTPException(status_code=404, detail="Reader not found.")
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Cannot delete reader: has borrowing records.")


def add_reader(name, address, phone_number):
    """Adds a new reader to the Readers table."""
    new_reader_id = None
    sql = "INSERT INTO Readers (ReaderName, Address, PhoneNumber) VALUES (%s, %s, %s)"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (name, address, phone_number))
                conn.commit()
                new_reader_id = cursor.lastrowid
                print(f"Successfully added reader '{name}' with ID: {new_reader_id}")
        except IntegrityError as ie:
            # Catches unique constraint violation if PhoneNumber must be unique
            print(f"Error adding reader '{name}': Phone number '{phone_number}' likely already exists. {ie}")
        except Error as e:
            print(f"Error adding reader: {e}")
        finally:
            conn.close()
    return new_reader_id


def get_all_readers():
    """Retrieves all readers from the database, ordered by name."""
    readers = []
    sql = "SELECT ReaderID, ReaderName, Address, PhoneNumber FROM Readers ORDER BY ReaderName"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql)
                readers = cursor.fetchall()
        except Error as e:
            print(f"Error fetching readers: {e}")
        finally:
            conn.close()
    return readers


def get_reader_by_id(reader_id):
    """Retrieves a single reader by their ID."""
    reader = None
    sql = "SELECT ReaderID, ReaderName, Address, PhoneNumber FROM Readers WHERE ReaderID = %s"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute(sql, (reader_id,))
                reader = cursor.fetchone()
        except Error as e:
            print(f"Error fetching reader by ID {reader_id}: {e}")
        finally:
            conn.close()
    return reader


def update_reader(reader_id, new_name, new_address, new_phone_number):
    """Updates the details of an existing reader."""
    success = False
    sql = """UPDATE Readers
             SET ReaderName = %s, Address = %s, PhoneNumber = %s
             WHERE ReaderID = %s"""
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (new_name, new_address, new_phone_number, reader_id))
                conn.commit()
                if cursor.rowcount > 0:
                    success = True
                    print(f"Successfully updated reader ID {reader_id}.")
                else:
                    print(f"Warning: Reader ID {reader_id} not found for update.")
        except IntegrityError as ie:
            print(
                f"Error updating reader ID {reader_id}: Phone number '{new_phone_number}' likely conflicts with another reader. {ie}"
            )
        except Error as e:
            print(f"Error updating reader ID {reader_id}: {e}")
        finally:
            conn.close()
    return success


def delete_reader(reader_id):
    """Deletes a reader by ID. Handles IntegrityError if reader has borrowing records."""
    success = False
    sql = "DELETE FROM Readers WHERE ReaderID = %s"
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, (reader_id,))
                conn.commit()
                if cursor.rowcount > 0:
                    success = True
                    print(f"Successfully deleted reader ID {reader_id}.")
                else:
                    print(f"Warning: Reader ID {reader_id} not found for deletion.")
        except IntegrityError as ie:
            print(f"Error deleting reader ID {reader_id}: Cannot delete - reader has existing borrowing records. {ie}")
        except Error as e:
            print(f"Error deleting reader ID {reader_id}: {e}")
        finally:
            conn.close()
    return success
