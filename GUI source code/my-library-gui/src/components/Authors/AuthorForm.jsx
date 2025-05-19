import React, { useState } from "react";
import styles from "./AuthorForm.module.css";

const AuthorForm = ({ initialData = {}, onSubmit, formType = "add", onCancel }) => {
    const [authorName, setAuthorName] = useState(initialData.AuthorName || "");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!authorName.trim()) {
            setError("Author name is required.");
            return;
        }
        setError("");
        onSubmit({ AuthorName: authorName.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.authorsForm}>
            <div className={styles.authorsFormRow}>
                <label htmlFor="authorName">Author Name:</label>
                <input
                    id="authorName"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    autoFocus
                    className={styles.authorsFormInput}
                />
            </div>
            {error && <div className={styles.authorsFormError}>{error}</div>}
            <div className={styles.authorsFormActions}>
                <button type="submit" className={styles.authorsFormSubmitBtn}>
                    {formType === "edit" ? "Update" : "Add"} Author
                </button>
                {onCancel && (
                    <button type="button" className={styles.authorsFormCancelBtn} onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default AuthorForm;
