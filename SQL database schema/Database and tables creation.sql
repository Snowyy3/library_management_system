CREATE DATABASE IF NOT EXISTS library_db;

USE library_db;

-- Drop tables in reverse order of creation if they exist (for easy re-running)
DROP TABLE IF EXISTS Borrowing;

DROP TABLE IF EXISTS Books;

DROP TABLE IF EXISTS Readers;

DROP TABLE IF EXISTS Categories;

DROP TABLE IF EXISTS Authors;

-- Create Authors table
CREATE TABLE Authors (
    AuthorID INT AUTO_INCREMENT PRIMARY KEY,
    AuthorName VARCHAR(255) NOT NULL
);

-- Create Categories table
CREATE TABLE Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL UNIQUE
);

-- Create Readers table
CREATE TABLE Readers (
    ReaderID INT AUTO_INCREMENT PRIMARY KEY,
    ReaderName VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    PhoneNumber VARCHAR(20) UNIQUE
);

-- Create Books table
CREATE TABLE Books (
    BookID INT AUTO_INCREMENT PRIMARY KEY,
    BookName VARCHAR(255) NOT NULL,
    AuthorID INT NOT NULL,
    PublishYear SMALLINT,
    Quantity INT NOT NULL DEFAULT 0 CHECK (Quantity >= 0),
    CategoryID INT NOT NULL,
    CONSTRAINT fk_book_author FOREIGN KEY (AuthorID) REFERENCES Authors (AuthorID) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_book_category FOREIGN KEY (CategoryID) REFERENCES Categories (CategoryID) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create Borrowing table
CREATE TABLE Borrowing (
    BorrowID INT AUTO_INCREMENT PRIMARY KEY,
    ReaderID INT NOT NULL,
    BookID INT NOT NULL,
    BorrowDate DATE NOT NULL,
    ReturnDate DATE NULL, -- NULL indicates the book is currently borrowed
    CONSTRAINT fk_borrow_reader FOREIGN KEY (ReaderID) REFERENCES Readers (ReaderID) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_borrow_book FOREIGN KEY (BookID) REFERENCES Books (BookID) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_return_date CHECK (
        ReturnDate IS NULL
        OR ReturnDate >= BorrowDate
    )
);

-- Add indexes for searching performance
CREATE INDEX idx_book_name ON Books (BookName);

CREATE INDEX idx_reader_name ON Readers (ReaderName);

CREATE INDEX idx_borrow_dates ON Borrowing (BorrowDate, ReturnDate);

CREATE INDEX idx_book_author_fk ON Books (AuthorID);

CREATE INDEX idx_book_category_fk ON Books (CategoryID);

CREATE INDEX idx_borrow_reader_fk ON Borrowing (ReaderID);

CREATE INDEX idx_borrow_book_fk ON Borrowing (BookID);
