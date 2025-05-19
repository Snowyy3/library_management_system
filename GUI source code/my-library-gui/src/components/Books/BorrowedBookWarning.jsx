import React from "react";

const BorrowedBookWarning = ({ borrowers }) => {
    if (!borrowers || borrowers.length === 0) return null;
    return (
        <div style={{
            background: "#fffbe6",
            border: "1.5px solid #ffe58f",
            color: "#ad8b00",
            borderRadius: 8,
            padding: "12px 18px",
            marginBottom: 16,
            fontSize: "1.01em"
        }}>
            <b>Warning:</b> This book is currently borrowed by the following reader(s):<br />
            <ul style={{ margin: "8px 0 0 18px", padding: 0 }}>
                {borrowers.map(b => (
                    <li key={b.ReaderID}>
                        <b>{b.ReaderName}</b> (Phone: {b.PhoneNumber})<br />
                        Borrowed: {b.BorrowDate} | Due: {b.DueDate}
                    </li>
                ))}
            </ul>
            <div style={{ marginTop: 6 }}>
                <b>Note:</b> Editing book details will affect all active borrowers and their records.
            </div>
        </div>
    );
};

export default BorrowedBookWarning;
