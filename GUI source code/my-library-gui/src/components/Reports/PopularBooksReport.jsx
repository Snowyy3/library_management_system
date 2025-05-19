import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import styles from "../../pages/ReportsPage.module.css";
import Pagination from "../common/Pagination";
import useSortableTable from "../../hooks/useSortableTable";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const RESULTS_OPTIONS = [10, 25, 40];

export default function PopularBooksReport() {
    const [limit, setLimit] = useState(10);
    const [popular, setPopular] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resultsPerPage, setResultsPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    const { sortedData: sortedPopular, sortConfig, requestSort } = useSortableTable(popular);

    const fetchData = (lim) => {
        setLoading(true);
        setError(null);
        api.get(`/reports/popular-books?limit=${lim}`)
            .then(res => setPopular(res.data))
            .catch(() => setError("Failed to load popular books."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData(limit);
    }, [limit]);

    useEffect(() => {
        setCurrentPage(1);
    }, [popular, resultsPerPage]);

    const totalPages = Math.ceil(popular.length / resultsPerPage) || 1;
    const paginatedPopular = sortedPopular.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    const handleResultsPerPageChange = (e) => {
        setResultsPerPage(Number(e.target.value));
    };

    const showResultsPerPage = limit > 10;

    return (
        <div>
            <div className={styles.reportsInputRow} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`material-symbols-outlined ${styles.reportsInputIcon}`}>star</span>
                    <label htmlFor="limit" className={styles.reportsInputLabel}>Show Top</label>
                    <input
                        id="limit"
                        type="number"
                        min={1}
                        max={20}
                        value={limit}
                        onChange={e => setLimit(Number(e.target.value) || 1)}
                        className={styles.reportsInputNumber}
                    />
                    <span className={styles.reportsInputSuffix}>books</span>
                </div>
                {showResultsPerPage && (
                    <select
                        id="resultsPerPage"
                        className={styles.booksResultsPerPage}
                        value={resultsPerPage}
                        onChange={handleResultsPerPageChange}
                    >
                        {RESULTS_OPTIONS.map(option => (
                            <option key={option} value={option}>{option} / page</option>
                        ))}
                    </select>
                )}
            </div>
            {loading ? (
                <div className={styles.reportsNoResults}>Loading...</div>
            ) : error ? (
                <div className={styles.reportsError}>{error}</div>
            ) : !popular.length ? (
                <div className={styles.reportsNoResults}>No popular books found.</div>
            ) : (
                <>
                    <div className={styles.reportsTableWrapper}>
                        <table className={styles.reportsTable}>
                            <thead>
                                <tr>
                                    <th className={styles.reportsIdCol} onClick={() => requestSort('BookID')} style={{ cursor: 'pointer' }}>
                                        Book ID {sortConfig.key === 'BookID' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                    <th className={styles.reportsTitleCol} onClick={() => requestSort('BookName')} style={{ cursor: 'pointer' }}>
                                        Book Name {sortConfig.key === 'BookName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                    <th className={styles.reportsAuthorCol} onClick={() => requestSort('AuthorName')} style={{ cursor: 'pointer' }}>
                                        Author Name {sortConfig.key === 'AuthorName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                    <th className={styles.reportsQtyCol} onClick={() => requestSort('BorrowCount')} style={{ cursor: 'pointer' }}>
                                        Borrow Count {sortConfig.key === 'BorrowCount' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPopular.map((row, i) => (
                                    <tr key={i}>
                                        <td className={styles.reportsIdCol}>{row.BookID}</td>
                                        <td className={styles.reportsTitleCol}>{row.BookName}</td>
                                        <td className={styles.reportsAuthorCol}>{row.AuthorName}</td>
                                        <td className={styles.reportsQtyCol}>{row.BorrowCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    );
}
