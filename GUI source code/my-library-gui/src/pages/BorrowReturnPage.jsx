import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import AutocompleteInput from "../components/common/AutocompleteInput";
import ToastNotification from "../components/common/SuccessToast";
import useSortableTable from "../hooks/useSortableTable";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styles from "./BorrowReturnPage.module.css";

const BorrowReturnPage = () => {
    // State for Borrow form
    const [readers, setReaders] = useState([]);
    const [availableBooks, setAvailableBooks] = useState([]);
    const [selectedReader, setSelectedReader] = useState("");
    const [selectedBook, setSelectedBook] = useState("");
    const [loading, setLoading] = useState(false);
    const [showBorrowToast, setShowBorrowToast] = useState(false);
    const [showBorrowError, setShowBorrowError] = useState(false);
    const [borrowErrorMsg, setBorrowErrorMsg] = useState("");

    // State for Return form
    const [returnReader, setReturnReader] = useState("");
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [selectedReturnBook, setSelectedReturnBook] = useState("");
    const [returnLoading, setReturnLoading] = useState(false);
    const [showReturnToast, setShowReturnToast] = useState(false);
    const [showReturnError, setShowReturnError] = useState(false);
    const [returnErrorMsg, setReturnErrorMsg] = useState("");

    // State for Book Borrowers Lookup
    const [selectedLookupBook, setSelectedLookupBook] = useState("");
    const [lookupBorrowers, setLookupBorrowers] = useState([]);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupError, setLookupError] = useState(null);
    const [lookupBooks, setLookupBooks] = useState([]);

    const { sortedData: sortedLookupBorrowers, sortConfig, requestSort } = useSortableTable(lookupBorrowers);

    // Fetch readers and available books on mount
    useEffect(() => {
        api.get("/readers").then(res => setReaders(res.data)).catch(() => setReaders([]));
        api.get("/borrowing/available").then(res => setAvailableBooks(res.data)).catch(() => setAvailableBooks([]));
    }, []);

    // Fetch borrowed books when returnReader changes
    useEffect(() => {
        setBorrowedBooks([]);
        setSelectedReturnBook("");
        if (returnReader) {
            api.get(`/borrowing/active_by_reader/${returnReader}`)
                .then(res => setBorrowedBooks(res.data))
                .catch(() => setBorrowedBooks([]));
        }
    }, [returnReader]);

    // Fetch borrowers when selectedLookupBook changes
    useEffect(() => {
        setLookupBorrowers([]);
        setLookupError(null);
        if (selectedLookupBook) {
            setLookupLoading(true);
            api.get(`/borrowing/active_by_book/${selectedLookupBook}`)
                .then(res => setLookupBorrowers(res.data))
                .catch(() => setLookupError("Failed to fetch borrowers."))
                .finally(() => setLookupLoading(false));
        }
    }, [selectedLookupBook]);

    // Fetch books with borrowed count for lookup dropdown
    useEffect(() => {
        api.get("/borrowing/books/with_borrowed_count").then(res => setLookupBooks(res.data)).catch(() => setLookupBooks([]));
    }, []);

    const handleBorrow = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowBorrowError(false);
        try {
            const res = await api.post("/borrowing/borrow", {
                reader_id: Number(selectedReader),
                book_id: Number(selectedBook),
            });
            if (res.data.success) {
                setSelectedBook("");
                setShowBorrowToast(true);
                setTimeout(() => setShowBorrowToast(false), 3500);
                // Refresh available books
                api.get("/borrowing/available").then(r => setAvailableBooks(r.data));
            } else {
                setBorrowErrorMsg(res.data.message || "Borrow failed.");
                setShowBorrowError(true);
                setTimeout(() => setShowBorrowError(false), 3500);
            }
        } catch {
            setBorrowErrorMsg("Network or server error.");
            setShowBorrowError(true);
            setTimeout(() => setShowBorrowError(false), 3500);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (e) => {
        e.preventDefault();
        setReturnLoading(true);
        setShowReturnError(false);
        try {
            const res = await api.post("/borrowing/return", {
                reader_id: Number(returnReader),
                book_id: Number(selectedReturnBook),
            });
            if (res.data.success) {
                setSelectedReturnBook("");
                setShowReturnToast(true);
                setTimeout(() => setShowReturnToast(false), 3500);
                // Refresh borrowed books
                api.get(`/borrowing/active_by_reader/${returnReader}`)
                    .then(r => setBorrowedBooks(r.data));
            } else {
                setReturnErrorMsg(res.data.message || "Return failed.");
                setShowReturnError(true);
                setTimeout(() => setShowReturnError(false), 3500);
            }
        } catch {
            setReturnErrorMsg("Network or server error.");
            setShowReturnError(true);
            setTimeout(() => setShowReturnError(false), 3500);
        } finally {
            setReturnLoading(false);
        }
    };

    return (
        <div className={styles.borrowReturnPageCard}>
            <ToastNotification open={showBorrowToast} message="Book borrowed successfully." />
            <ToastNotification open={showReturnToast} message="Book returned successfully." />
            <ToastNotification open={showBorrowError} message={borrowErrorMsg} error={true} />
            <ToastNotification open={showReturnError} message={returnErrorMsg} error={true} />
            <div className={styles.borrowReturnRow}>
                {/* Borrow Book Section */}
                <section className={styles.borrowReturnSection}>
                    <h3 style={{ fontFamily: "var(--font-family-primary)", fontWeight: 600, fontSize: "1.2rem", color: "var(--primary-text)", marginBottom: 18 }}>Borrow book</h3>
                    <form onSubmit={handleBorrow}>
                        <AutocompleteInput
                            label="Reader"
                            options={readers}
                            value={selectedReader ? readers.find(r => r.ReaderID === Number(selectedReader)) : null}
                            onChange={opt => setSelectedReader(opt ? opt.ReaderID : "")}
                            getOptionLabel={r => r ? r.ReaderName : ""}
                            placeholder="Type to search reader..."
                            required
                            disabled={loading}
                        />
                        <AutocompleteInput
                            label="Available book"
                            options={availableBooks}
                            value={selectedBook ? availableBooks.find(b => b.BookID === Number(selectedBook)) : null}
                            onChange={opt => setSelectedBook(opt ? opt.BookID : "")}
                            getOptionLabel={b => b ? `${b.Title} by ${b.Author} (Qty: ${b.Quantity})` : ""}
                            placeholder="Type to search book..."
                            required
                            disabled={loading}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button type="submit" className={styles.borrowReturnBtn} disabled={loading || !selectedReader || !selectedBook}>
                                {loading ? "Processing..." : "Borrow"}
                            </button>
                        </div>
                    </form>
                </section>
                <div className={styles.borrowReturnDivider} />
                {/* Return Book Section */}
                <section className={styles.borrowReturnSection}>
                    <h3 style={{ fontFamily: "var(--font-family-primary)", fontWeight: 600, fontSize: "1.2rem", color: "var(--primary-text)", marginBottom: 18 }}>Return book</h3>
                    <form onSubmit={handleReturn}>
                        <AutocompleteInput
                            label="Reader"
                            options={readers}
                            value={returnReader ? readers.find(r => r.ReaderID === Number(returnReader)) : null}
                            onChange={opt => setReturnReader(opt ? opt.ReaderID : "")}
                            getOptionLabel={r => r ? r.ReaderName : ""}
                            placeholder="Type to search reader..."
                            required
                            disabled={returnLoading}
                        />
                        <AutocompleteInput
                            label="Borrowed book"
                            options={borrowedBooks}
                            value={selectedReturnBook ? borrowedBooks.find(b => b.BookID === Number(selectedReturnBook)) : null}
                            onChange={opt => setSelectedReturnBook(opt ? opt.BookID : "")}
                            getOptionLabel={b => b ? `${b.Title} by ${b.Author} (Borrowed: ${b.BorrowDate})` : ""}
                            placeholder={!returnReader ? "Select a reader first" : borrowedBooks.length === 0 ? "No borrowed books" : "Type to search book..."}
                            disabled={!returnReader || borrowedBooks.length === 0 || returnLoading}
                            required
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button type="submit" className={styles.borrowReturnBtn} disabled={returnLoading || !returnReader || !selectedReturnBook}>
                                {returnLoading ? "Processing..." : "Return"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
            <div style={{ margin: "36px 0 0 0", borderTop: "1.5px solid var(--light-gray-border)", width: "100%" }} />
            <div className={styles.lookupCard}>
                <h3 style={{ fontFamily: "var(--font-family-primary)", fontWeight: 600, fontSize: "1.2rem", color: "var(--primary-text)", marginBottom: 18 }}>Book borrowers lookup</h3>
                <div className={styles.lookupHeaderRow}>
                    <AutocompleteInput
                        // label="Book"
                        options={lookupBooks}
                        value={selectedLookupBook ? lookupBooks.find(b => b.BookID === Number(selectedLookupBook)) : null}
                        onChange={opt => setSelectedLookupBook(opt ? opt.BookID : "")}
                        getOptionLabel={b => b ? `${b.Title} by ${b.Author} (${b.CurrentlyBorrowed} currently borrowed)` : ""}
                        placeholder="Type to search book..."
                        searchBar
                    />
                </div>
                {selectedLookupBook && (
                    (() => {
                        const book = lookupBooks.find(b => b.BookID === Number(selectedLookupBook));
                        if (!book) return null;
                        // Calculate overdue count
                        let overdueCount = 0;
                        if (lookupBorrowers && lookupBorrowers.length > 0) {
                            const now = new Date();
                            overdueCount = lookupBorrowers.filter(bor => {
                                const due = new Date(bor.DueDate);
                                return (now - due) / (1000 * 60 * 60 * 24) > 0;
                            }).length;
                        }
                        return (
                            <div style={{
                                background: "#f5f6f8",
                                borderRadius: 14,
                                padding: "22px 32px 18px 32px",
                                marginBottom: 28,
                                marginTop: 2,
                                minWidth: 340,
                                maxWidth: 540,
                                width: "fit-content",
                                marginLeft: "auto",
                                marginRight: "auto",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                border: "1.5px solid var(--light-gray-border)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 0
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                                    <span style={{ fontWeight: 700, fontSize: "1.18rem", color: "var(--primary-text)", fontFamily: "var(--font-family-primary)", letterSpacing: "0.01em" }}>
                                        Book: <span style={{ fontWeight: 900 }}>{book.Title}</span>
                                    </span>
                                    <span style={{ color: "var(--secondary-text)", fontSize: "1.01rem", fontWeight: 500 }}>
                                        <b>ID:</b> {book.BookID}
                                    </span>
                                </div>
                                <div style={{ color: "var(--secondary-text)", fontSize: "1.01rem", marginBottom: 12 }}>
                                    <b>Author:</b> {book.Author}
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", columnGap: 32, rowGap: 8, marginBottom: 14 }}>
                                    <span style={{ color: "var(--secondary-text)", fontSize: "1.01rem" }}>
                                        <b>Category:</b> {book.CategoryName || "-"}
                                    </span>
                                    <span style={{ color: "var(--secondary-text)", fontSize: "1.01rem" }}>
                                        <b>Publish Year:</b> {book.PublishYear || "-"}
                                    </span>
                                    <span style={{ color: "var(--secondary-text)", fontSize: "1.01rem" }}>
                                        <b>Quantity:</b> {book.Quantity !== undefined ? book.Quantity : "-"}
                                    </span>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", columnGap: 32, rowGap: 8 }}>
                                    <span style={{ color: "var(--primary-text)", fontWeight: 500, fontSize: "1.08rem" }}>
                                        <b>Currently Borrowed:</b> {book.CurrentlyBorrowed}
                                    </span>
                                    <span style={{ color: overdueCount > 0 ? "var(--primary-accent)" : "var(--secondary-text)", fontWeight: overdueCount > 0 ? 600 : 500, fontSize: "1.08rem" }}>
                                        <b>Overdue:</b> {overdueCount}
                                    </span>
                                </div>
                            </div>
                        );
                    })()
                )}
                <div style={{ fontSize: "0.95em", color: "#555", marginBottom: 8 }}>
                    Standard borrow period is <b>14 days</b>.
                </div>
                {lookupLoading && <div>Loading borrowers...</div>}
                {lookupError && <div style={{ color: "var(--primary-accent)" }}>{lookupError}</div>}
                {selectedLookupBook && !lookupLoading && !lookupError && (
                    lookupBorrowers.length === 0 ? (
                        <div className={styles.lookupNoBorrowers}>No users are currently borrowing this book.</div>
                    ) : (
                        <table className={styles.lookupTable}>
                            <thead>
                                <tr>
                                    <th style={{ fontFamily: "var(--font-family-primary)", fontWeight: 600, fontSize: "1.05rem", color: "var(--primary-text)", letterSpacing: "0.01em", cursor: 'pointer' }} onClick={() => requestSort('ReaderName')}>
                                        Reader Name {sortConfig.key === 'ReaderName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                    <th style={{ fontFamily: "var(--font-family-primary)", fontWeight: 400, fontStyle: "italic", color: "var(--secondary-text)", fontSize: "1.01rem", cursor: 'pointer' }} onClick={() => requestSort('PhoneNumber')}>
                                        Phone {sortConfig.key === 'PhoneNumber' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                    <th style={{ fontFamily: "var(--font-family-primary)", fontWeight: 400, color: "var(--secondary-text)", fontSize: "1.01rem", cursor: 'pointer' }} onClick={() => requestSort('BorrowDate')}>
                                        Borrowed Since {sortConfig.key === 'BorrowDate' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                    <th style={{ fontFamily: "var(--font-family-primary)", fontWeight: 400, color: "var(--secondary-text)", fontSize: "1.01rem", cursor: 'pointer' }} onClick={() => requestSort('DueDate')}>
                                        Due Date {sortConfig.key === 'DueDate' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                    <th style={{ fontFamily: "var(--font-family-primary)", fontWeight: 500, color: "var(--primary-accent)", fontSize: "1.01rem", cursor: 'pointer' }} onClick={() => requestSort('DaysOverdue')}>
                                        Days Overdue {sortConfig.key === 'DaysOverdue' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedLookupBorrowers.map(b => {
                                    const due = new Date(b.DueDate);
                                    const now = new Date();
                                    const overdue = Math.floor((now - due) / (1000 * 60 * 60 * 24));
                                    return (
                                        <tr key={b.ReaderID}>
                                            <td style={{ fontWeight: 500, color: "var(--primary-text)", fontFamily: "var(--font-family-primary)" }}>{b.ReaderName}</td>
                                            <td style={{ fontStyle: "italic", color: "var(--secondary-text)", fontFamily: "var(--font-family-primary)" }}>{b.PhoneNumber}</td>
                                            <td style={{ color: "var(--secondary-text)", fontFamily: "var(--font-family-primary)" }}>{b.BorrowDate}</td>
                                            <td style={{ color: "var(--secondary-text)", fontFamily: "var(--font-family-primary)" }}>{b.DueDate}</td>
                                            <td style={overdue > 0 ? { color: "var(--primary-accent)", fontWeight: 600, fontFamily: "var(--font-family-primary)" } : { color: "#A2A2A1", fontFamily: "var(--font-family-primary)" }}>
                                                {overdue > 0 ? overdue : <span>&mdash;</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )
                )}
            </div>
        </div>
    );
};

export default BorrowReturnPage;
