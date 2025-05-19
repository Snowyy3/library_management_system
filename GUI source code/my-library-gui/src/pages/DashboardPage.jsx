import React, { useEffect, useState } from "react";
import { useUser } from "../store/UserContext.jsx";
import DashboardStats from "../components/Dashboard/DashboardStats";
import DashboardSummaryLists from "../components/Dashboard/DashboardSummaryLists";
import TransactionTrendsChart from "../components/Dashboard/TransactionTrendsChart";
import api from "../api/axiosConfig";
import styles from "./DashboardPage.module.css";

function getGreeting(hour) {
    if (hour >= 4 && hour < 13) return "Good morning"; // 4:00 - 12:59
    if (hour >= 13 && hour < 18) return "Good afternoon"; // 13:00 - 17:59
    if (hour >= 18 && hour < 23) return "Good evening"; // 18:00 - 22:59 (Corrected from 23:15 as it overlaps with night)
    if (hour === 23 && new Date().getMinutes() <= 15) return "Good evening"; // 23:00-23:15 is evening
    return "Good night"; // 23:16 - 3:59
}

function getTimeOfDayIcon(hour) {
    if (hour >= 4 && hour < 13) return "☀️"; // Morning
    if (hour >= 13 && hour < 18) return "🌤️"; // Afternoon
    if (hour >= 18 && hour < 23) return "🌆"; // Evening
    if (hour === 23 && new Date().getMinutes() <= 15) return "🌆"; // Evening
    return "🌙"; // Night
}

function formatDateTime(date, showColon) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const colon = showColon ? ":" : " ";
    const timeOfDayIcon = getTimeOfDayIcon(date.getHours());

    return `${month} ${dayNum}, ${year} | ${day}, ${hour}${colon}${minute} ${timeOfDayIcon}`;
}

const DashboardGreeting = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showColon, setShowColon] = useState(true);
    const { user } = useUser();
    let username = "user";
    if (user && user.loggedIn && user.isGuest) {
        username = "user";
    } else if (user && user.loggedIn) {
        username = user.name;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
            setShowColon(prev => !prev);
        }, 1000); // Update every second for colon blink and time update
        return () => clearInterval(timer);
    }, []);

    const greeting = getGreeting(currentTime.getHours());

    return (
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div className={styles.dashboardGreeting}>
                {greeting}, <span className={styles.highlight}>{username}!</span>
            </div>
            <div className={styles.dashboardDateTime}>
                {formatDateTime(currentTime, showColon)}
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const [popularBooks, setPopularBooks] = useState([]);
    const [recentlyOverdue, setRecentlyOverdue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get("/reports/popular-books"),
            api.get("/reports/overdue")
        ]).then(([popularRes, overdueRes]) => {
            setPopularBooks(popularRes.data || []);
            const overdue = Array.isArray(overdueRes.data) ? overdueRes.data : [];
            setRecentlyOverdue(overdue.slice(0, 5));
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div className={styles.dashboardPage}>
            <div>
                <DashboardGreeting />
            </div>

            <section className={styles.dashboardSection}>
                <DashboardStats />
            </section>

            {loading ? (
                <div className={styles.loadingMessage}>Loading dashboard data...</div>
            ) : (
                <>
                    <section className={`${styles.dashboardSection} ${styles.popularBooksSection}`}>
                        <DashboardSummaryLists popularBooks={popularBooks} />
                    </section>                    <section className={`${styles.dashboardSection} ${styles.borrowingInfoSection}`}>
                        <TransactionTrendsChart />
                        <DashboardSummaryLists recentlyOverdue={recentlyOverdue} />
                    </section>
                </>
            )}
        </div>
    );
};

export default DashboardPage;
