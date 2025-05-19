-- View for Available Books
CREATE
OR REPLACE VIEW vw_AvailableBooks AS
SELECT
    b.BookID,
    b.BookName,
    a.AuthorName,
    c.CategoryName,
    b.PublishYear,
    b.Quantity
FROM
    Books b
    JOIN Authors a ON b.AuthorID = a.AuthorID
    JOIN Categories c ON b.CategoryID = c.CategoryID
WHERE
    b.Quantity > 0;

-- View for Currently Borrowed Books
CREATE
OR REPLACE VIEW vw_CurrentlyBorrowed AS
SELECT
    br.BorrowID,
    r.ReaderID,
    r.ReaderName,
    r.PhoneNumber,
    b.BookID,
    b.BookName,
    a.AuthorName,
    br.BorrowDate,
    DATE_ADD (br.BorrowDate, INTERVAL 14 DAY) AS DueDate -- Assuming a 14-day loan period for display
FROM
    Borrowing br
    JOIN Readers r ON br.ReaderID = r.ReaderID
    JOIN Books b ON br.BookID = b.BookID
    JOIN Authors a ON b.AuthorID = a.AuthorID
WHERE
    br.ReturnDate IS NULL;
