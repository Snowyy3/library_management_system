import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import styles from "../../pages/ReportsPage.module.css";
import Pagination from "../common/Pagination";
import useSortableTable from "../../hooks/useSortableTable";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const RESULTS_OPTIONS = [10, 25, 40];

export default function AvailableBooksReport() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(25);
    const totalPages = Math.ceil(books.length / resultsPerPage) || 1;

    const { sortedData: sortedBooks, sortConfig, requestSort } = useSortableTable(books);
    const paginatedBooks = sortedBooks.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    useEffect(() => {
        setLoading(true);
        api.get("/reports/available-books")
            .then(res => setBooks(res.data))
            .catch(() => setError("Failed to load available books."))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [books, resultsPerPage]);

    const handleResultsPerPageChange = (event) => {
        setResultsPerPage(Number(event.target.value));
    };

    if (loading) return <div className={styles.reportsNoResults}>Loading...</div>;
    if (error) return <div className={styles.reportsError}>{error}</div>;
    if (!books.length) return <div className={styles.reportsNoResults}>No available books found.</div>;

    return (
        <>
            <div className={styles.reportsContainer}>
                <div className={styles.reportsInputRow}>
                    <select
                        id="availableBooksResultsPerPage"
                        value={resultsPerPage}
                        onChange={handleResultsPerPageChange}
                        className={styles.booksResultsPerPage}
                        style={{ marginLeft: 'auto' }} // Align to the right
                    >
                        {RESULTS_OPTIONS.map(option => (
                            <option key={option} value={option}>{option} / page</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className={styles.reportsTableWrapper}>
                <table className={styles.reportsTable}>
                    <thead>
                        <tr>
                            <th className={styles.reportsTitleCol} onClick={() => requestSort('BookName')} style={{ cursor: 'pointer' }}>
                                Book Name {sortConfig.key === 'BookName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                            </th>
                            <th className={styles.reportsAuthorCol} onClick={() => requestSort('AuthorName')} style={{ cursor: 'pointer' }}>
                                Author Name {sortConfig.key === 'AuthorName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                            </th>
                            <th className={styles.reportsCategoryCol} onClick={() => requestSort('CategoryName')} style={{ cursor: 'pointer' }}>
                                Category Name {sortConfig.key === 'CategoryName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                            </th>
                            <th className={styles.reportsYearCol} onClick={() => requestSort('PublishYear')} style={{ cursor: 'pointer' }}>
                                Publish Year {sortConfig.key === 'PublishYear' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                            </th>
                            <th className={styles.reportsQtyCol} onClick={() => requestSort('Quantity')} style={{ cursor: 'pointer' }}>
                                Quantity {sortConfig.key === 'Quantity' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedBooks.map(book => (
                            <tr key={book.BookID}>
                                <td className={styles.reportsTitleCol}>{book.BookName}</td>
                                <td className={styles.reportsAuthorCol}>{book.AuthorName}</td>
                                <td className={styles.reportsCategoryCol}>{book.CategoryName}</td>
                                <td className={styles.reportsYearCol}>{book.PublishYear}</td>
                                <td className={styles.reportsQtyCol}>{book.Quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
    );
}
