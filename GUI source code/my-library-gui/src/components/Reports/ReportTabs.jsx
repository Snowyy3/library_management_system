import React, { useState } from "react";
import styles from "../../pages/ReportsPage.module.css";

const tabList = [
    { key: "available", label: "Available Books" },
    { key: "borrowed", label: "Currently Borrowed" },
    { key: "overdue", label: "Overdue Books" },
    { key: "popular", label: "Popular Books" },
];

export default function ReportTabs({ tabs }) {
    const [activeTab, setActiveTab] = useState(tabList[0].key);

    return (
        <div>
            <div className={styles.reportsTabsRow}>
                {tabList.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={
                            activeTab === tab.key
                                ? `${styles.reportsTabBtn} ${styles.reportsTabBtnActive}`
                                : styles.reportsTabBtn
                        }
                        tabIndex={0}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>
                {tabs.find(tab => tab.key === activeTab)?.content}
            </div>
        </div>
    );
}
