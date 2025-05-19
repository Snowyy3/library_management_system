import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css"; // Import CSS Module

const navItems = [
    { label: "Dashboard", to: "/", icon: "dashboard" },
    { label: "Books", to: "/books", icon: "menu_book" },
    { label: "Authors", to: "/authors", icon: "person" },
    { label: "Categories", to: "/categories", icon: "category" },
    { label: "Readers", to: "/readers", icon: "groups" },
    { label: "Borrowing", to: "/borrowing", icon: "import_contacts" },
    { label: "Reports", to: "/reports", icon: "assessment" },
];

const Sidebar = ({ collapsed = false }) => (
    <aside className={collapsed ? `${styles.sidebar} ${styles.collapsed}` : styles.sidebar}>
        <div className={styles.logoContainer}>
            <div className={styles.logoText}>LibSys</div> {/* Placeholder Logo/Title */}
        </div>
        <nav className={styles.navContainer}>
            <ul className={styles.navList}>
                {navItems.map((item) => (
                    <li key={item.to} className={styles.navItem}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
                            }
                            end={item.to === "/"}
                            title={collapsed ? item.label : undefined}
                        >
                            {item.icon && <span className={`material-symbols-outlined ${styles.navLinkIcon}`}>{item.icon}</span>}
                            {!collapsed && <span className={styles.navLinkLabel}>{item.label}</span>}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    </aside>
);

export default Sidebar;
