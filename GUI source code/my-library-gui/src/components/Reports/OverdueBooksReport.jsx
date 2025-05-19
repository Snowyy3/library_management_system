import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import styles from "../../pages/ReportsPage.module.css";
import Pagination from "../common/Pagination";
import useSortableTable from "../../hooks/useSortableTable";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const RESULTS_OPTIONS = [10, 25, 40];

export default function OverdueBooksReport() {
    const [loanPeriod, setLoanPeriod] = useState(14);
    const [overdue, setOverdue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(25);
    const totalPages = Math.ceil(overdue.length / resultsPerPage) || 1;
    const { sortedData: sortedOverdue, sortConfig, requestSort } = useSortableTable(overdue);
    const paginatedOverdue = sortedOverdue.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    const fetchData = (period) => {
        setLoading(true);
        setError(null);
        api.get(`/reports/overdue?loan_period_days=${period}`)
            .then(res => setOverdue(res.data))
            .catch(() => setError("Failed to load overdue books."))
            .finally(() => setLoading(false));
    };

    const handleResultsPerPageChange = (e) => {
        setResultsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchData(loanPeriod);
    }, [loanPeriod]);

    useEffect(() => {
        setCurrentPage(1);
    }, [overdue]);

    return (
        <div>
            <div className={styles.reportsInputRow} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`material-symbols-outlined ${styles.reportsInputIcon}`}>filter_alt</span>
                    <label htmlFor="loanPeriod" className={styles.reportsInputLabel}>Loan Period (days):</label>
                    <input
                        id="loanPeriod"
                        type="number"
                        min={1}
                        max={60}
                        value={loanPeriod}
                        onChange={e => setLoanPeriod(Number(e.target.value) || 1)}
                        className={styles.reportsInputNumber}
                    />
                    <span className={styles.reportsInputSuffix}>days</span>
                </div>
                <select
                    id="overdueBooksResultsPerPage"
                    value={resultsPerPage}
                    onChange={handleResultsPerPageChange}
                    className={styles.booksResultsPerPage}
                    style={{ marginLeft: 'auto' }}
                >
                    {RESULTS_OPTIONS.map(option => (
                        <option key={option} value={option}>{option} / page</option>
                    ))}
                </select>
            </div>
            {loading ? (
                <div className={styles.reportsNoResults}>Loading...</div>
            ) : error ? (
                <div className={styles.reportsError}>{error}</div>
            ) : !overdue.length ? (
                <div className={styles.reportsNoResults}>No overdue books found.</div>
            ) : (
                <>
                    <div className={styles.reportsTableWrapper}>
                        <table className={styles.reportsTable}>
                            <thead>
                                <tr>
                                    <th className={styles.reportsTitleCol} onClick={() => requestSort('ReaderName')} style={{ cursor: 'pointer' }}>
                                        Reader Name {sortConfig.key === 'ReaderName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                    <th className={styles.reportsTitleCol} onClick={() => requestSort('BookName')} style={{ cursor: 'pointer' }}>
                                        Book Name {sortConfig.key === 'BookName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                    <th className={styles.reportsYearCol} onClick={() => requestSort('BorrowDate')} style={{ cursor: 'pointer' }}>
                                        Borrow Date {sortConfig.key === 'BorrowDate' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                    <th className={styles.reportsYearCol} onClick={() => requestSort('DueDate')} style={{ cursor: 'pointer' }}>
                                        Due Date {sortConfig.key === 'DueDate' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                    <th className={styles.reportsQtyCol} onClick={() => requestSort('DaysOverdue')} style={{ cursor: 'pointer' }}>
                                        Days Overdue {sortConfig.key === 'DaysOverdue' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOverdue.map((row, i) => (
                                    <tr key={i}>
                                        <td className={styles.reportsTitleCol}>{row.ReaderName}</td>
                                        <td className={styles.reportsTitleCol}>{row.BookName}</td>
                                        <td className={styles.reportsYearCol}>{row.BorrowDate}</td>
                                        <td className={styles.reportsYearCol}>{row.DueDate}</td>
                                        <td className={styles.reportsQtyCol}>{row.DaysOverdue}</td>
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
