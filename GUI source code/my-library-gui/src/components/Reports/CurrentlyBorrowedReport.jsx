import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import styles from "../../pages/ReportsPage.module.css";
import Pagination from "../common/Pagination";
import useSortableTable from "../../hooks/useSortableTable";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const RESULTS_OPTIONS = [10, 25, 40];

export default function CurrentlyBorrowedReport() {
    const [borrowed, setBorrowed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(25);
    const totalPages = Math.ceil(borrowed.length / resultsPerPage) || 1;

    const { sortedData: sortedBorrowed, sortConfig, requestSort } = useSortableTable(borrowed);
    const paginatedBorrowed = sortedBorrowed.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    useEffect(() => {
        setLoading(true);
        api.get("/reports/currently-borrowed")
            .then(res => setBorrowed(res.data))
            .catch(() => setError("Failed to load borrowed books."))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [borrowed, resultsPerPage]);

    const handleResultsPerPageChange = (event) => {
        setResultsPerPage(Number(event.target.value));
    };

    if (loading) return <div className={styles.reportsNoResults}>Loading...</div>;
    if (error) return <div className={styles.reportsError}>{error}</div>;
    if (!borrowed.length) return <div className={styles.reportsNoResults}>No borrowed books found.</div>;

    return (
        <>
            <div className={styles.reportsContainer}>
                <div className={styles.reportsInputRow}>
                    <select
                        id="currentlyBorrowedResultsPerPage"
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
                            <th className={styles.reportsTitleCol} onClick={() => requestSort('ReaderName')} style={{ cursor: 'pointer' }}>
                                Reader Name {sortConfig.key === 'ReaderName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                            </th>
                            <th className={styles.reportsYearCol} onClick={() => requestSort('BorrowDate')} style={{ cursor: 'pointer' }}>
                                Borrow Date {sortConfig.key === 'BorrowDate' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                            </th>
                            <th className={styles.reportsYearCol} onClick={() => requestSort('DueDate')} style={{ cursor: 'pointer' }}>
                                Due Date {sortConfig.key === 'DueDate' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedBorrowed.map(row => (
                            <tr key={row.BorrowID}>
                                <td className={styles.reportsTitleCol}>{row.BookName}</td>
                                <td className={styles.reportsAuthorCol}>{row.AuthorName}</td>
                                <td className={styles.reportsTitleCol}>{row.ReaderName}</td>
                                <td className={styles.reportsYearCol}>{row.BorrowDate}</td>
                                <td className={styles.reportsYearCol}>{row.DueDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
    );
}
