import React, { useState, useEffect } from "react";
import styles from "./ReaderForm.module.css";

const ReaderForm = ({ initialData, onSubmit, formType = "add", onCancel }) => {
    const [readerName, setReaderName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (formType === "edit" && initialData && Object.keys(initialData).length > 0) {
            setReaderName(initialData.ReaderName ?? "");
            setAddress(initialData.Address ?? "");
            setPhoneNumber(initialData.PhoneNumber ?? "");
        } else if (formType === "add") {
            setReaderName("");
            setAddress("");
            setPhoneNumber("");
        }
    }, [formType, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!readerName.trim() || !address.trim() || !phoneNumber.trim()) {
            setError("All fields are required.");
            return;
        }
        setError("");
        onSubmit({ ReaderName: readerName.trim(), Address: address.trim(), PhoneNumber: phoneNumber.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.readersForm}>
            <div className={styles.readersFormRow}>
                <label htmlFor="readerName" className={styles.readersFormLabel}>Name</label>
                <input
                    id="readerName"
                    type="text"
                    value={readerName}
                    onChange={(e) => setReaderName(e.target.value)}
                    autoFocus
                    className={styles.readersFormInput}
                />
            </div>
            <div className={styles.readersFormRow}>
                <label htmlFor="address" className={styles.readersFormLabel}>Address</label>
                <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={styles.readersFormInput}
                />
            </div>
            <div className={styles.readersFormRow}>
                <label htmlFor="phoneNumber" className={styles.readersFormLabel}>Phone Number</label>
                <input
                    id="phoneNumber"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={styles.readersFormInput}
                />
            </div>
            {error && <div className={styles.readersFormError}>{error}</div>}
            <div className={styles.readersFormBtnRow}>
                <button type="submit" className={styles.readersFormBtn}>
                    {formType === "edit" ? "Update" : "Add"} Reader
                </button>
                {onCancel && (
                    <button type="button" className={styles.readersFormBtnCancel} onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ReaderForm;
