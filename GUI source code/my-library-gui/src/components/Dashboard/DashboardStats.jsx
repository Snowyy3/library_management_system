import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import ChartCard from "./ChartCard";
import api from "../../api/axiosConfig";
import styles from "./DashboardStats.module.css"; // Import CSS Module

export default function DashboardStats() {
    const [counts, setCounts] = useState(null);
    const [borrowedCount, setBorrowedCount] = useState(null);
    const [overdueCount, setOverdueCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get("/reports/counts"),
            api.get("/reports/currently-borrowed"),
            api.get("/reports/overdue")
        ]).then(([countsRes, borrowedRes, overdueRes]) => {
            setCounts(countsRes.data);
            setBorrowedCount(borrowedRes.data.length);
            setOverdueCount(overdueRes.data.length);
        }).finally(() => setLoading(false));
    }, []);

    if (loading || !counts) return <div className={styles.loadingStats}>Loading stats...</div>;

    return (
        <div className={styles.dashboardStatsContainer}>
            {/* First row: 4 stat cards as direct grid children */}
            <StatCard
                icon={<span className="material-symbols-outlined">menu_book</span>}
                label="Total books"
                value={counts.total_books}
                accent
                boldLabel
            />
            <StatCard
                icon={<span className="material-symbols-outlined">person</span>}
                label="Total readers"
                value={counts.total_readers}
                boldLabel
            />
            <StatCard
                icon={<span className="material-symbols-outlined">category</span>}
                label="Categories"
                value={counts.total_categories}
                boldLabel
            />
            <StatCard
                icon={<span className="material-symbols-outlined">groups</span>}
                label="Authors"
                value={counts.total_authors}
                boldLabel
            />
            {/* Second row: stacked cards and chart card as grid children */}
            <div className={styles.stackedStatsColumn}>                <StatCard
                className={styles.stackedCard}
                icon={<span className="material-symbols-outlined">assignment_return</span>}
                label="Borrowed books"
                labelClassName="stackedStatLabel"
                value={borrowedCount}
                accent
                boldLabel
            />
                <StatCard
                    className={styles.stackedCard}
                    icon={<span className="material-symbols-outlined">error</span>}
                    label="Overdue books"
                    labelClassName="stackedStatLabel"
                    value={overdueCount}
                    accent
                    boldLabel
                />
            </div>
            <div className={styles.chartContainer}>
                <ChartCard />
            </div>
        </div>
    );
}
