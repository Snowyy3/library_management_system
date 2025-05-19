import mysql.connector
from mysql.connector import Error
from mysql.connector.pooling import MySQLConnectionPool
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(override=True)  # <--- MODIFIED: Added override=True

# --- START: Diagnostic prints for .env values ---
print("--- Loading .env variables for database connection ---")
db_host_env = os.getenv("DB_HOST", "localhost")
db_user_env = os.getenv("DB_USER")
db_password_env = os.getenv("DB_PASSWORD")
db_name_env = os.getenv("DB_NAME", "library_db")

print("  Attempting to use the following configuration:")  # Removed f-string here
print(f"    DB_HOST: {db_host_env}")
print(f"    DB_USER: {db_user_env}")
print(f"    DB_PASSWORD is set: {'Yes' if db_password_env else 'No'}")
if db_password_env:
    print(f"    DB_PASSWORD length: {len(db_password_env)}")
    # For deeper debugging, you might temporarily print a small part of the password,
    # e.g., print(f"    DB_PASSWORD (first char): {db_password_env[0]}" if db_password_env else "N/A")
    # but be careful about logging sensitive information.
print(f"    DB_NAME: {db_name_env}")
print("----------------------------------------------------")
# --- END: Diagnostic prints ---

# Secure Database Configuration using Environment Variables
db_config_secure = {
    "host": db_host_env,
    "user": db_user_env,
    "password": db_password_env,
    "database": db_name_env,
}

# Validate that essential variables were loaded
# This check runs when the module is imported
if not all([db_config_secure["user"], db_config_secure["password"]]):
    print("!!! VALIDATION ERROR: DB_USER or DB_PASSWORD was not loaded correctly from .env. !!!")
    print(f"    Loaded DB_USER for validation: {db_config_secure['user']}")
    print(f"    Loaded DB_PASSWORD for validation is present: {'Yes' if db_config_secure['password'] else 'No'}")
    raise ValueError(
        "Error: DB_USER or DB_PASSWORD environment variables not set or not loaded. Please create/check your .env file and ensure the backend is restarted to pick up changes."
    )
else:
    print("DB_USER and DB_PASSWORD successfully validated (both are present).")

# --- Database Connection Pool Initialization ---
# This pool is created ONCE when the db_config module is first imported.
db_pool = None  # Initialize as None

try:
    # Create the connection pool
    # Adjust pool_size based on expected concurrent connections (5 is a reasonable start)
    db_pool = MySQLConnectionPool(pool_name="library_app_pool", pool_size=7, **db_config_secure)
    print("Database connection pool created successfully.")

except Error as e:
    print(f"CRITICAL ERROR: Failed to create database connection pool: {e}")
    # The application cannot function without a pool, so log and db_pool remains None.


def get_db_connection():
    """
    Gets a connection from the database connection pool.
    Returns None if the pool is not available or an error occurs getting a connection.
    """
    if db_pool is None:
        print("Error: Cannot get connection, database connection pool is not available.")
        return None

    connection = None
    try:
        # Get a connection from the pool
        connection = db_pool.get_connection()
        if connection and connection.is_connected():  # Ensure connection is valid
            print("Successfully obtained connection from pool.")  # Existing debug message, good to keep
            # --- Add SELECT USER(), DATABASE() debug print here ---
            try:
                cursor = connection.cursor()
                cursor.execute("SELECT USER(), DATABASE()")
                user_db_info = cursor.fetchone()
                if user_db_info:
                    print(f"DEBUG: Connected to MySQL as USER: {user_db_info[0]}, DATABASE: {user_db_info[1]}")
                else:
                    print("DEBUG: Could not retrieve USER(), DATABASE() info.")
                cursor.close()
            except Error as e_debug:
                print(f"DEBUG: Failed to execute SELECT USER(), DATABASE(): {e_debug}")
            # --- End of debug print ---
            return connection
        else:
            print("Error: Obtained connection from pool, but it is not connected or invalid.")
            if connection:  # If connection object exists, try to close it
                try:
                    connection.close()
                except Error as e_close:
                    print(f"Error closing invalid connection: {e_close}")
            return None

    except Error as e:
        print(f"Error getting connection from pool: {e}")
        if connection:  # If connection object was assigned before error, try to close it
            try:
                connection.close()
            except Error as e_close:
                print(f"Error closing connection after pool error: {e_close}")
        return None  # Return None on error


# Optional: Add a function to close the pool when the app shuts down (less critical for simple script/notebook)
def close_db_pool():
    """Closes all connections in the database connection pool."""
    if db_pool:
        try:
            db_pool.shutdown()
            print("Database connection pool shut down.")
        except Error as e:
            print(f"Error shutting down database connection pool: {e}")


# Note: In a larger application, you might call close_db_pool() when the application exits.
# For this test script, it's less crucial as Python will clean up on exit.
