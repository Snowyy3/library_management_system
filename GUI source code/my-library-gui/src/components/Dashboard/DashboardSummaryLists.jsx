import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import styles from "./DashboardSummaryLists.module.css";

function DashboardSummaryLists({ popularBooks, recentlyOverdue }) {
    // Pagination for recentlyOverdue
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 5;
    let paginatedOverdue = recentlyOverdue || [];
    let totalPages = 1;
    if (recentlyOverdue) {
        totalPages = Math.ceil(recentlyOverdue.length / resultsPerPage) || 1;
        paginatedOverdue = recentlyOverdue.slice(
            (currentPage - 1) * resultsPerPage,
            currentPage * resultsPerPage
        );
    }
    useEffect(() => {
        setCurrentPage(1);
    }, [recentlyOverdue]);

    if (popularBooks) {
        return (
            <div className={`${styles.summaryCard} card-base ${styles.popularBooksCard}`}>
                <h3 className={styles.listTitle}>Popular Books</h3>
                <div className={styles.tableContainer}>
                    <table className={`${styles.summaryTable} ${styles.popularBooksTable}`}>
                        <thead>
                            <tr>
                                <th className={styles.rankColumn}>#</th>
                                <th className={styles.bookIdColumn}>Book ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th className={styles.countColumn}>Borrows</th>
                            </tr>
                        </thead>
                        <tbody>
                            {popularBooks.length === 0 ? (
                                <tr><td colSpan={5} className={styles.noDataMessageTable}>No popular books data available.</td></tr>
                            ) : popularBooks.map((book, idx) => (
                                <tr key={book.BookID + book.BookName + book.AuthorName + idx}>
                                    <td className={styles.rankColumn}>{idx + 1}.</td>
                                    <td className={`${styles.bookIdColumn} ${styles.bookIdCell}`}>{book.BookID}</td>
                                    <td className={styles.popularBooksTitle} title={book.BookName}>{book.BookName}</td>
                                    <td className={styles.popularBooksAuthor} title={book.AuthorName}>{book.AuthorName}</td>
                                    <td className={styles.countColumn}>
                                        <span className={styles.borrowCountBadge}>{book.BorrowCount}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (recentlyOverdue) {
        return (
            <div className={`${styles.summaryCard} card-base ${styles.recentlyOverdueCard}`}>
                <h3 className={styles.listTitle}>Overdue Books</h3>
                <div className={styles.tableContainer}>
                    <table className={styles.summaryTable}>
                        <thead>
                            <tr>
                                <th>Reader Name</th>
                                <th className={styles.bookIdColumn}>Book ID</th>
                                <th>Book Title</th>
                                <th>Author</th>
                                <th className={styles.overdueDaysCell}>Days Overdue</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOverdue.length === 0 ? (
                                <tr><td colSpan={6} className={styles.noDataMessageTable}>No recently overdue data available.</td></tr>
                            ) : paginatedOverdue.map((item, idx) => (
                                <tr key={item.ReaderName + item.BookName + idx}>
                                    <td className={styles.readerNameCell} title={item.ReaderName}>{item.ReaderName}</td>
                                    <td className={`${styles.bookIdColumn} ${styles.bookIdCell}`}>{item.BookID}</td>
                                    <td title={item.BookName}>{item.BookName}</td>
                                    <td className={styles.authorNameCell} title={item.AuthorName}>{item.AuthorName}</td>
                                    <td className={styles.overdueDaysCell}>{item.DaysOverdue}</td>
                                    <td><span className={styles.overdueStatusBadge}>{item.Status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            </div>
        );
    }

    return null; // Or some fallback UI if needed
}

export default DashboardSummaryLists;
