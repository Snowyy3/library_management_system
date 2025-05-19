DELIMITER / /
-- Trigger to DECREMENT book quantity after a borrow record is INSERTED
CREATE TRIGGER trg_AfterBorrowInsert AFTER INSERT ON Borrowing FOR EACH ROW BEGIN
UPDATE Books
SET
    Quantity = Quantity - 1
WHERE
    BookID = NEW.BookID
    AND Quantity > 0;

END / /
-- Trigger to INCREMENT book quantity after a borrow record is UPDATED (returned)
CREATE TRIGGER trg_AfterBorrowUpdate AFTER
UPDATE ON Borrowing FOR EACH ROW BEGIN IF OLD.ReturnDate IS NULL
AND NEW.ReturnDate IS NOT NULL THEN
UPDATE Books
SET
    Quantity = Quantity + 1
WHERE
    BookID = NEW.BookID;

END IF;

END / / DELIMITER;
