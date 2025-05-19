# 📚 LibSys: Modern Library Management System 💻

**A comprehensive digital solution for efficient library operations, built with Python, FastAPI, MySQL, and React.**

---

## 🌟 About LibSys

LibSys is a robust and user-friendly Library Management System designed to streamline core library operations. Developed as a final project for the Database Management Systems course, it focuses on optimizing borrowing and returning processes, managing library assets (books, authors, categories), tracking reader information, and providing insightful statistical reporting through an intuitive web interface.

The system leverages the power of **MySQL** for data persistence, a **Python (FastAPI)** backend for business logic and API services, and a dynamic **React** frontend for a modern user experience.

---

## ✨ Key Features & Visual Showcase

Our system offers a range of functionalities essential for modern library management:

*   **Interactive Dashboard:** Get an at-a-glance overview of key library statistics, including total books, readers, categories, authors, currently borrowed items, overdue books, popular titles, and borrowing trends with visual charts.
    *   *(Screenshot of the main Dashboard page - similar to your `dashboard_full_page_1.png`)*
*   **Comprehensive Book Management:** Easily add, search, view, edit, and delete books. Includes advanced features like handling historical borrowing records during deletion and detailed book information display.
    *   *(Screenshot of the Books Management page - similar to your `books_management_page.png`)*
*   **Efficient Author & Category Management:** Streamlined interfaces for managing authors and book categories with full CRUD capabilities and search/sort functionality.
    *   *(Composite screenshot showing Author Management and Category Management side-by-side or one prominent one)*
*   **Detailed Reader Management:** Register new readers, update existing information, and manage reader records, complete with search, sort, and CRUD operations.
    *   *(Screenshot of the Readers Management page)*
*   **Seamless Borrowing & Returning:** Intuitive forms for processing book borrows and returns, with clear feedback and integration with inventory management. Includes a lookup feature to see current borrowers for any book.
    *   *(Screenshot of the Borrow/Return page with all three cards visible)*
*   **Insightful Statistical Reporting:** Access various reports including Available Books, Currently Borrowed Books, Overdue Books (with adjustable loan periods), and Popular Books.
    *   *(Screenshot of the Reports page, perhaps showing the "Available Books" or "Overdue Books" tab)*
*   **User Authentication:** Secure login, signup, and password reset functionalities for librarians.
    *   *(Screenshot of the Login page)*

---

## 🛠️ Technologies & Tools

*   **Backend:** Python, FastAPI, `mysql-connector-python`
*   **Frontend:** React (with Vite), JavaScript, Axios, `react-router-dom`, MUI X Charts
*   **Database:** MySQL
*   **Development Tools:**
    *   MySQL Workbench (Database design, schema management, SQL querying)
    *   Visual Studio Code (Code development)
    *   GitHub (Version control & repository hosting)
    *   LLM-Powered Assistance (Utilized for synthetic dataset generation and aiding in routine code scaffolding and refinement under human supervision)

---

## 📂 Project Structure Overview

The repository is organized as follows:

```
/
├── my-library-gui/         # React frontend source code
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── db/                     # Python backend (FastAPI, DB operations)
│   ├── __init__.py
│   ├── auth_api.py
│   ├── authors.py
│   ├── book_delete_utils.py
│   ├── books.py
│   ├── borrowing_api.py
│   ├── borrowing.py
│   ├── categories.py
│   ├── db_config.py
│   ├── readers.py
│   ├── reports_api.py
│   ├── reports.py
│   └── users.json          # User credentials (for demo purposes)
├── sql_schema/             # SQL scripts for database setup
│   ├── Database and tables creation.sql
│   ├── Indexes.sql
│   ├── Sample data insertions.sql
│   ├── Stored procedures.sql
│   ├── Triggers.sql
│   ├── User Defined Functions (UDF).sql
│   └── Views.sql
├── main.py                 # FastAPI application entry point
└── README.md               # This file
```


---

## 🚀 Project Presentation

View our comprehensive video presentation demonstrating the system's features and technical implementation:
**YouTube video**

---

## 📜 License

This project is licensed under the Apache 2.0 license.

---

## 📞 Contact

**Group 1**
