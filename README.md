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
![image](https://github.com/user-attachments/assets/6ee45694-b8f7-4d0c-a963-d848c291eb54)
![image](https://github.com/user-attachments/assets/d84a6c23-3f86-466a-809f-b93649170181)
![image](https://github.com/user-attachments/assets/9ae4f9e4-9e47-4092-8821-54b013c4491c)


*   **Comprehensive Book Management:** Easily add, search, view, edit, and delete books. Includes advanced features like handling historical borrowing records during deletion and detailed book information display.
![image](https://github.com/user-attachments/assets/614dc0b0-3457-433e-aa6c-2d1580369625)

*   **Efficient Author & Category Management:** Streamlined interfaces for managing authors and book categories with full CRUD capabilities and search/sort functionality.
![image](https://github.com/user-attachments/assets/69bd0521-6f63-40fa-a061-f372502b78a3)
![image](https://github.com/user-attachments/assets/b1b38049-441f-4cea-8081-e7d50abc8af5)

*   **Detailed Reader Management:** Register new readers, update existing information, and manage reader records, complete with search, sort, and CRUD operations.
![image](https://github.com/user-attachments/assets/c459fe54-5ce8-4536-9afb-78954309b72a)

*   **Seamless Borrowing & Returning:** Intuitive forms for processing book borrows and returns, with clear feedback and integration with inventory management. Includes a lookup feature to see current borrowers for any book.
![image](https://github.com/user-attachments/assets/adc2dbe4-02e9-47f8-b3ec-98a7a4456880)

*   **Insightful Statistical Reporting:** Access various reports including Available Books, Currently Borrowed Books, Overdue Books (with adjustable loan periods), and Popular Books.
![image](https://github.com/user-attachments/assets/cf825af1-5cf5-4916-88dd-1df02839a239)

*   **User Authentication:** Secure login, signup, and password reset functionalities for librarians.
![image](https://github.com/user-attachments/assets/8da475b4-e0a2-45d9-aee8-7316975096bb)


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

**[LibSys: From Database Design to a Full-Featured Library App │ DBMS Project, Group 1](https://youtu.be/fzxclHYIyzE)**

---

## 📜 License

This project is licensed under the Apache 2.0 license.

---

## 📞 Contact

**Group 1**
