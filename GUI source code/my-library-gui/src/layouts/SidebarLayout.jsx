import React, { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import TopNavbar from "../components/common/TopNavbar";
import { Outlet } from "react-router-dom";
import styles from "./SidebarLayout.module.css"; // Import CSS Module

const SidebarLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const handleHamburgerClick = () => setSidebarCollapsed((prev) => !prev);
    return (
        <div className={styles.appContainer}>
            <div className={
                sidebarCollapsed
                    ? `${styles.sidebarWrapper} ${styles.sidebarCollapsed}`
                    : styles.sidebarWrapper
            }>
                <Sidebar collapsed={sidebarCollapsed} />
            </div>
            <div className={styles.mainContentWrapper}>
                <TopNavbar onHamburgerClick={handleHamburgerClick} />
                <main className={styles.pageContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SidebarLayout;
