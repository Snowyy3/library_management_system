import React from "react";
import ReportTabs from "../components/Reports/ReportTabs";
import AvailableBooksReport from "../components/Reports/AvailableBooksReport";
import CurrentlyBorrowedReport from "../components/Reports/CurrentlyBorrowedReport";
import OverdueBooksReport from "../components/Reports/OverdueBooksReport";
import PopularBooksReport from "../components/Reports/PopularBooksReport";
import styles from "./ReportsPage.module.css";

const reportTabsContent = [
    {
        key: "available",
        content: <AvailableBooksReport />
    },
    {
        key: "borrowed",
        content: <CurrentlyBorrowedReport />
    },
    {
        key: "overdue",
        content: <OverdueBooksReport />
    },
    {
        key: "popular",
        content: <PopularBooksReport />
    }
];

const ReportsPage = () => (
    <div className={styles.reportsPageCard}>
        <ReportTabs tabs={reportTabsContent} />
    </div>
);

export default ReportsPage;
