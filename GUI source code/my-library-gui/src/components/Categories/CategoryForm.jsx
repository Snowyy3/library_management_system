import React, { useState } from "react";
import styles from "../../pages/CategoriesPage.module.css";

const CategoryForm = ({ initialData = {}, onSubmit, formType = "add", onCancel }) => {
    const [categoryName, setCategoryName] = useState(initialData.CategoryName || "");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            setError("Category name is required.");
            return;
        }
        setError("");
        onSubmit({ CategoryName: categoryName.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.categoriesForm}>
            <div className={styles.categoriesFormRow}>
                <label htmlFor="categoryName">Category Name:</label>
                <input
                    id="categoryName"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    autoFocus
                    className={styles.categoriesFormInput}
                />
            </div>
            {error && <div className={styles.categoriesFormError}>{error}</div>}
            <div className={styles.categoriesFormActions}>
                <button type="submit" className={styles.categoriesFormSubmitBtn}>
                    {formType === "edit" ? "Update" : "Add"} Category
                </button>
                {onCancel && (
                    <button type="button" className={styles.categoriesFormCancelBtn} onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default CategoryForm;
