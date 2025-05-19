import React, { useEffect } from "react";
import styles from "./Toast.module.css";

export default function Toast({ type = "info", message, onClose, duration = 3000 }) {
    useEffect(() => {
        if (!duration) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <span className={styles.icon}>
                {type === "success" && <span className="material-symbols-outlined">check_circle</span>}
                {type === "error" && <span className="material-symbols-outlined">error</span>}
                {type === "warning" && <span className="material-symbols-outlined">warning</span>}
                {type === "info" && <span className="material-symbols-outlined">info</span>}
            </span>
            <span className={styles.message}>{message}</span>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close notification">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>
    );
}
