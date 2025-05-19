import React from "react";
import styles from "./SuccessToast.module.css";

const ToastNotification = ({ open, message, error = false }) => {
    if (!open) return null;
    const type = error ? "error" : "success";
    return (
        <div className={styles.toastContainer}>
            <div className={
                type === "error"
                    ? `${styles.toastContent} ${styles.toastError}`
                    : styles.toastContent
            }>
                <span className={type === "error" ? styles.errorIcon : styles.checkIcon}>
                    <span className="material-symbols-outlined">
                        {type === "error" ? "error" : "check_circle"}
                    </span>
                </span>
                <span className={styles.toastMessage}>{message || (type === "error" ? "Error!" : "Success!")}</span>
            </div>
        </div>
    );
};

export default ToastNotification;
