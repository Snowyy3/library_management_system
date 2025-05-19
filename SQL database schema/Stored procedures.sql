DELIMITER //

-- Procedure to handle borrowing a book
CREATE PROCEDURE sp_BorrowBook(
    IN p_ReaderID INT,         
    IN p_BookID INT,           
    OUT p_Success BOOLEAN,     
    OUT p_Message VARCHAR(255)
)
sp_BorrowBook_block:
BEGIN

    DECLARE bookQuantity INT DEFAULT 0;
    DECLARE readerExists INT DEFAULT 0;
    DECLARE bookExists INT DEFAULT 0;
    DECLARE alreadyBorrowed INT DEFAULT 0;

    SET p_Success = FALSE;
    SET p_Message = 'An unexpected error occurred during the borrowing process.';
    
    SELECT COUNT(*) INTO readerExists FROM Readers WHERE ReaderID = p_ReaderID;
    IF readerExists = 0 THEN
        SET p_Message = 'Error: Reader does not exist.';
        SELECT p_Success AS success, p_Message AS message;
        LEAVE sp_BorrowBook_block;
    END IF;

    SELECT COUNT(*) INTO bookExists FROM Books WHERE BookID = p_BookID;
    IF bookExists = 0 THEN
        SET p_Message = 'Error: Book does not exist.';
        SELECT p_Success AS success, p_Message AS message;
        LEAVE sp_BorrowBook_block;
    END IF;

    SELECT COUNT(*) INTO alreadyBorrowed
    FROM Borrowing
    WHERE ReaderID = p_ReaderID AND BookID = p_BookID AND ReturnDate IS NULL;

    IF alreadyBorrowed > 0 THEN
        SET p_Message = 'Error: Reader has already borrowed this book and not returned it.';
        SELECT p_Success AS success, p_Message AS message;
        LEAVE sp_BorrowBook_block;
    END IF;

    START TRANSACTION;

    SELECT Quantity INTO bookQuantity FROM Books WHERE BookID = p_BookID FOR UPDATE;

    IF bookQuantity <= 0 THEN
        SET p_Message = 'Error: Book is currently out of stock.';
        ROLLBACK;
        
    ELSE    
        INSERT INTO Borrowing (ReaderID, BookID, BorrowDate)
        VALUES (p_ReaderID, p_BookID, CURDATE());

        IF ROW_COUNT() > 0 THEN
            SET p_Success = TRUE;
            SET p_Message = 'Book borrowed successfully.';
            COMMIT;
        ELSE
            SET p_Message = 'Error: Failed to record borrowing due to an unknown database issue.';
            ROLLBACK;

        END IF;
    END IF;

    SELECT p_Success AS success, p_Message AS message;

END sp_BorrowBook_block //

-- Procedure for Overdue Books Report
CREATE PROCEDURE sp_ReportOverdueBooks(
IN p_LoanPeriodDays INT
)
BEGIN
    SELECT
        r.ReaderName,
        r.PhoneNumber,
        b.BookID,
        b.BookName,
        a.AuthorName,
        br.BorrowDate,
        
        DATE_ADD(br.BorrowDate, INTERVAL p_LoanPeriodDays DAY) AS DueDate,

        fn_CalculateCurrentOverdueDays(br.BorrowDate, p_LoanPeriodDays) AS DaysOverdue
    FROM
        Borrowing br        
    JOIN
        Readers r ON br.ReaderID = r.ReaderID
    JOIN
        Books b ON br.BookID = b.BookID       
    JOIN
        Authors a ON b.AuthorID = a.AuthorID   
    WHERE
        br.ReturnDate IS NULL
      AND   
        CURDATE() > DATE_ADD(br.BorrowDate, INTERVAL p_LoanPeriodDays DAY);
END //

DELIMITER ;
