import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ open, onClose, children }) => {
    if (!open) return null;
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.modalCloseBtn} onClick={onClose}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
