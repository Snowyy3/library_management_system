DELIMITER / /
-- Calculate current overdue days
CREATE FUNCTION fn_CalculateCurrentOverdueDays (f_BorrowDate DATE, f_LoanPeriodDays INT) RETURNS INT DETERMINISTIC BEGIN DECLARE overdueDays INT DEFAULT 0;

DECLARE dueDate DATE;

IF f_BorrowDate IS NULL THEN RETURN 0;

END IF;

SET
    dueDate = DATE_ADD (f_BorrowDate, INTERVAL f_LoanPeriodDays DAY);

IF CURDATE () > dueDate THEN
SET
    overdueDays = DATEDIFF (CURDATE (), dueDate);

END IF;

RETURN overdueDays;

END / / DELIMITER;
