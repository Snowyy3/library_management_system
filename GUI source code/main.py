from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your API routers from the db package
from db import books  # Import the books router
from db import authors, categories  # You'll need to adjust this based on how your routers are defined
from db import readers  # Import the readers router
from db import borrowing_api  # Import the new borrowing API router
from db import reports_api  # <-- Add this import
from db import auth_api  # Import the auth API router

app = FastAPI(title="Library Management System API", description="API for managing library resources.", version="1.0.0")

# Define allowed origins for CORS
origins = [
    "http://localhost:5173",  # Vite default dev port for your React frontend
    "http://127.0.0.1:5173",  # Also allow 127.0.0.1
    # You can add other origins here if needed, e.g., a production frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include your API routers
app.include_router(books.router, prefix="/api/books", tags=["books"])
app.include_router(authors.router, prefix="/api/authors", tags=["authors"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(readers.router, prefix="/api/readers", tags=["readers"])
app.include_router(borrowing_api.router, prefix="/api/borrowing", tags=["borrowing"])
app.include_router(reports_api.router, prefix="/api/reports", tags=["reports"])
app.include_router(auth_api.router, prefix="/api/auth", tags=["auth"])


# A simple root endpoint to check if the API is running
@app.get("/")
async def root():
    return {"message": "Welcome to the Library Management System API!"}


# To run this application, you would typically use Uvicorn:
# uvicorn main:app --reload --port 8000
# (You can run this command in your terminal from the project root directory)
