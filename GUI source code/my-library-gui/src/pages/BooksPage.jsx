import React, { useEffect, useState, useMemo } from "react";
import api from "../api/axiosConfig";
import BookForm from "../components/Books/BookForm";
import Modal from "../components/common/Modal";
import SuccessToast from "../components/common/SuccessToast";
import Pagination from "../components/common/Pagination";
import BorrowedBookWarning from "../components/Books/BorrowedBookWarning";
import useSortableTable from "../hooks/useSortableTable";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styles from "./BooksPage.module.css";

const RESULTS_OPTIONS = [10, 25, 40];

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [resultsPerPage, setResultsPerPage] = useState(25);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [successToast, setSuccessToast] = useState({ open: false, message: "", error: false });
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteHistoryModal, setShowDeleteHistoryModal] = useState(false);
    const [pendingDeleteBook, setPendingDeleteBook] = useState(null);
    const [editBorrowers, setEditBorrowers] = useState([]);

    const filteredBooks = useMemo(() => {
        if (!searchTerm) return books;
        return books.filter(book => {
            const term = searchTerm.toLowerCase();
            return (
                book.BookName.toLowerCase().includes(term) ||
                book.AuthorName.toLowerCase().includes(term) ||
                book.CategoryName.toLowerCase().includes(term) ||
                String(book.BookID).toLowerCase().includes(term) ||
                String(book.PublishYear).toLowerCase().includes(term)
            );
        });
    }, [books, searchTerm]);

    const { sortedData: sortedBooks, sortConfig, requestSort } = useSortableTable(filteredBooks);
    const totalPages = Math.ceil(filteredBooks.length / resultsPerPage) || 1;
    const paginatedBooks = sortedBooks.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    const fetchBooks = () => {
        setIsLoading(true);
        api.get("/books")
            .then((res) => {
                setBooks(res.data || []);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, resultsPerPage]);

    const handleAddBook = async (formData) => {
        setIsLoading(true);
        try {
            await api.post("/books", formData);
            fetchBooks();
            setShowAddForm(false);
            setSuccessToast({ open: true, message: "Book added successfully!", error: false });
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditBook = async (formData) => {
        setIsLoading(true);
        try {
            await api.put(`/books/${editingBook.BookID}`, formData);
            fetchBooks();
            setShowEditForm(false);
            setEditingBook(null);
            setSuccessToast({ open: true, message: "Book updated successfully!", error: false });
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteBook = (book) => {
        setBookToDelete(book);
        setShowDeleteModal(true);
    };

    const confirmDeleteBook = async () => {
        if (!bookToDelete) return;
        setIsLoading(true);
        try {
            await api.delete(`/books/${bookToDelete.BookID}`);
            fetchBooks();
            setShowDeleteModal(false);
            setBookToDelete(null);
            setSuccessToast({ open: true, message: "Book deleted successfully!", error: false });
        } catch (err) {
            const msg = err?.response?.data?.detail || "Failed to delete book.";
            if (msg.includes("currently borrowed")) {
                setShowDeleteModal(false);
                setBookToDelete(null);
                setSuccessToast({ open: true, message: msg, error: true });
            } else if (msg.includes("past borrowing records")) {
                setShowDeleteModal(false);
                setPendingDeleteBook(bookToDelete);
                setShowDeleteHistoryModal(true);
            } else {
                setError(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDeleteHistory = async () => {
        if (!pendingDeleteBook) return;
        setIsLoading(true);
        try {
            await api.delete(`/books/${pendingDeleteBook.BookID}?confirm_delete_history=true`);
            fetchBooks();
            setShowDeleteHistoryModal(false);
            setPendingDeleteBook(null);
            setSuccessToast({ open: true, message: "Book and its borrowing history deleted.", error: false });
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const openEditForm = async (book) => {
        setEditingBook(book);
        setShowEditForm(true);
        setShowAddForm(false);
        // Fetch current borrowers for this book
        try {
            const res = await api.get(`/borrowing/active_by_book/${book.BookID}`);
            setEditBorrowers(res.data || []);
        } catch {
            setEditBorrowers([]);
        }
    };

    const closeForms = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setEditingBook(null);
    };

    // Hide toast after 1.5s
    useEffect(() => {
        if (successToast.open) {
            const t = setTimeout(() => setSuccessToast({ open: false, message: "", error: false }), 1500);
            return () => clearTimeout(t);
        }
    }, [successToast.open]);

    return (
        <div className={styles.booksPageCard}>
            <div className={styles.booksHeaderRow}>
                <input
                    className={styles.booksSearchBar}
                    type="text"
                    placeholder="Search by name, author, or category..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button
                    className={styles.booksAddBtn}
                    onClick={() => { setShowAddForm(true); setShowEditForm(false); }}
                >
                    <span className="material-symbols-outlined">add</span>
                    Add New Book
                </button>
                <div className={styles.booksHeaderSpacer} />
                <select
                    className={styles.booksResultsPerPage}
                    value={resultsPerPage}
                    onChange={e => setResultsPerPage(Number(e.target.value))}
                >
                    {RESULTS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt} / page</option>
                    ))}
                </select>
            </div>

            {/* Add Book Modal */}
            <Modal open={showAddForm} onClose={closeForms}>
                <BookForm onSubmit={handleAddBook} formType="add" />
            </Modal>
            {/* Edit Book Modal */}
            <Modal open={showEditForm && editingBook} onClose={closeForms}>
                <BookForm initialData={editingBook} onSubmit={handleEditBook} formType="edit" borrowers={editBorrowers} />
            </Modal>
            {/* Delete Confirmation Modal */}
            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div style={{ textAlign: "center", padding: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--danger-red)" }}>delete</span>
                    <h3 style={{ margin: "18px 0 8px 0", color: "var(--primary-text)", fontWeight: 700 }}>Delete Book?</h3>
                    <div style={{ color: "var(--secondary-text)", marginBottom: 18 }}>
                        Are you sure you want to delete <b>{bookToDelete?.BookName}</b>?
                    </div>
                    <button className={`${styles.booksDeleteBtn} ${styles.solidRounded}`} onClick={confirmDeleteBook}>
                        Delete
                    </button>
                    <button className={`${styles.booksEditBtn} ${styles.solidRounded}`} onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </button>
                </div>
            </Modal>
            {/* Delete History Confirmation Modal */}
            <Modal open={showDeleteHistoryModal} onClose={() => { setShowDeleteHistoryModal(false); setPendingDeleteBook(null); }}>
                <div style={{ textAlign: "center", padding: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--danger-red)" }}>warning</span>
                    <h3 style={{ margin: "18px 0 8px 0", color: "var(--primary-text)", fontWeight: 700 }}>Delete Book & History?</h3>
                    <div style={{ color: "var(--secondary-text)", marginBottom: 18 }}>
                        <b>{pendingDeleteBook?.BookName}</b> has past borrowing records.<br />
                        Deleting this book will also permanently erase its entire borrowing history.<br />
                        <span style={{ color: "#F65867", fontWeight: 500 }}>This action cannot be undone.</span><br />
                        Are you sure you want to proceed?
                    </div>
                    <button className={`${styles.booksDeleteBtn} ${styles.solidRounded}`} onClick={confirmDeleteHistory}>
                        Delete Book & History
                    </button>
                    <button className={`${styles.booksEditBtn} ${styles.solidRounded}`} onClick={() => { setShowDeleteHistoryModal(false); setPendingDeleteBook(null); }}>
                        Cancel
                    </button>
                </div>
            </Modal>
            <SuccessToast open={successToast.open} message={successToast.message} error={successToast.error} />

            <div className={styles.booksTableWrapper}>
                {isLoading && books.length === 0 ? (
                    <div className={styles.booksNoResults}>Loading books...</div>
                ) : error && books.length === 0 ? (
                    <div className={styles.booksNoResults}>Error fetching books.</div>
                ) : paginatedBooks.length === 0 ? (
                    <div className={styles.booksNoResults}>{searchTerm ? "No books match your search." : "No books found."}</div>
                ) : (
                    <table className={styles.booksTable}>
                        <thead>
                            <tr>
                                <th className={`${styles.booksIdCol} booksIdCol`} onClick={() => requestSort('BookID')} style={{ cursor: 'pointer' }}>
                                    ID {sortConfig.key === 'BookID' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th onClick={() => requestSort('BookName')} style={{ cursor: 'pointer' }}>
                                    Book Name {sortConfig.key === 'BookName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th onClick={() => requestSort('AuthorName')} style={{ cursor: 'pointer' }}>
                                    Author Name {sortConfig.key === 'AuthorName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th onClick={() => requestSort('CategoryName')} style={{ cursor: 'pointer' }}>
                                    Category Name {sortConfig.key === 'CategoryName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th onClick={() => requestSort('PublishYear')} style={{ cursor: 'pointer' }}>
                                    Publish Year {sortConfig.key === 'PublishYear' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th onClick={() => requestSort('Quantity')} style={{ cursor: 'pointer' }}>
                                    Quantity {sortConfig.key === 'Quantity' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBooks.map((book) => (
                                <tr key={book.BookID}>
                                    <td className={`${styles.booksIdCol} booksIdCol`}>{book.BookID}</td>
                                    <td className={styles.booksTitleCol}>{book.BookName}</td>
                                    <td className={styles.booksAuthorCol}>{book.AuthorName}</td>
                                    <td className={styles.booksCategoryCol}>{book.CategoryName}</td>
                                    <td className={styles.booksYearCol}>{book.PublishYear}</td>
                                    <td className={styles.booksQtyCol}>{book.Quantity}</td>
                                    <td>
                                        <button className={`${styles.booksActionBtn} ${styles.booksEditBtn}`} onClick={() => openEditForm(book)}>
                                            <span className="material-symbols-outlined">edit</span>
                                            Edit
                                        </button>
                                        <button className={`${styles.booksActionBtn} ${styles.booksDeleteBtn}`} onClick={() => handleDeleteBook(book)}>
                                            <span className="material-symbols-outlined">delete</span>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default BooksPage;
