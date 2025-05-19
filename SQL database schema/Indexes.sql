-- Index for searching books by name, readers by name, borrowing records by dates (usually automatically created)
CREATE INDEX idx_book_name ON Books (BookName);

CREATE INDEX idx_reader_name ON Readers (ReaderName);

CREATE INDEX idx_borrow_dates ON Borrowing (BorrowDate, ReturnDate);

-- Index on FKs (in case not automatically created)
CREATE INDEX idx_book_author_fk ON Books (AuthorID);

CREATE INDEX idx_book_category_fk ON Books (CategoryID);

CREATE INDEX idx_borrow_reader_fk ON Borrowing (ReaderID);

CREATE INDEX idx_borrow_book_fk ON Borrowing (BookID);
