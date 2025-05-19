import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import CategoryForm from "../components/Categories/CategoryForm";
import styles from "./CategoriesPage.module.css";
import Modal from "../components/common/Modal";
import SuccessToast from "../components/common/SuccessToast";
import Pagination from "../components/common/Pagination";
import useSortableTable from "../hooks/useSortableTable";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const RESULTS_OPTIONS = [10, 25, 40];

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [resultsPerPage, setResultsPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCategories = () => {
        setLoading(true);
        axios
            .get("/categories")
            .then((res) => {
                setCategories(res.data);
                setError(null);
            })
            .catch(() => {
                setError("Failed to fetch categories.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = (data) => {
        setAddLoading(true);
        setAddError("");
        setSuccessMsg("");
        axios
            .post("/categories", data)
            .then(() => {
                setSuccessMsg("Category added successfully.");
                setShowAddForm(false);
                fetchCategories();
            })
            .catch((err) => {
                setAddError(err.response?.data?.detail || "Failed to add category.");
            })
            .finally(() => setAddLoading(false));
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setShowAddForm(false);
        setEditError("");
        setSuccessMsg("");
    };

    const handleEditCategory = (data) => {
        if (!editingCategory) return;
        setEditLoading(true);
        setEditError("");
        setSuccessMsg("");
        axios
            .put(`/categories/${editingCategory.CategoryID}`, data)
            .then(() => {
                setSuccessMsg("Category updated successfully.");
                setEditingCategory(null);
                fetchCategories();
            })
            .catch((err) => {
                setEditError(err.response?.data?.detail || "Failed to update category.");
            })
            .finally(() => setEditLoading(false));
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setEditError("");
    };

    const handleDeleteCategory = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };
    const confirmDeleteCategory = () => {
        if (!categoryToDelete) return;
        setDeleteLoading(true);
        setSuccessMsg("");
        axios
            .delete(`/categories/${categoryToDelete.CategoryID}`)
            .then(() => {
                setSuccessMsg("Category deleted successfully.");
                fetchCategories();
            })
            .catch(() => { })
            .finally(() => {
                setDeleteLoading(false);
                setShowDeleteModal(false);
                setCategoryToDelete(null);
            });
    };

    // Pagination logic
    const filteredCategories = categories.filter((c) =>
        c.CategoryName.toLowerCase().includes(search.toLowerCase()) ||
        String(c.CategoryID).toLowerCase().includes(search.toLowerCase())
    );
    const { sortedData: sortedCategories, sortConfig, requestSort } = useSortableTable(filteredCategories);
    const totalPages = Math.ceil(filteredCategories.length / resultsPerPage) || 1;
    const paginatedCategories = sortedCategories.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, resultsPerPage]);

    return (
        <div className={styles.categoriesPageCard}>
            <div className={styles.categoriesHeaderRow}>
                <input
                    className={styles.categoriesSearchBar}
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className={styles.categoriesAddBtn}
                    onClick={() => setShowAddForm((v) => !v)}
                >
                    <span className="material-symbols-outlined">add</span>
                    {showAddForm ? "Cancel" : "Add New Category"}
                </button>
                <div className={styles.categoriesHeaderSpacer} />
                <select
                    className={styles.categoriesResultsPerPage}
                    value={resultsPerPage}
                    onChange={e => setResultsPerPage(Number(e.target.value))}
                >
                    {RESULTS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt} / page</option>
                    ))}
                </select>
            </div>

            <Modal open={showAddForm} onClose={() => setShowAddForm(false)}>
                <CategoryForm onSubmit={handleAddCategory} formType="add" onCancel={() => setShowAddForm(false)} />
                {addLoading && <div className={styles.categoriesNoResults}>Adding category...</div>}
                {addError && <div className={styles.categoriesFormError}>{addError}</div>}
            </Modal>

            <Modal open={!!editingCategory} onClose={handleCancelEdit}>
                <CategoryForm initialData={editingCategory} onSubmit={handleEditCategory} formType="edit" onCancel={handleCancelEdit} />
                {editLoading && <div className={styles.categoriesNoResults}>Updating category...</div>}
                {editError && <div className={styles.categoriesFormError}>{editError}</div>}
            </Modal>

            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div style={{ textAlign: "center", padding: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--danger-red)", marginBottom: 8 }}>delete</span>
                    <h3 style={{ margin: "18px 0 8px 0", color: "var(--primary-text)", fontWeight: 700 }}>Delete Category?</h3>
                    <div style={{ color: "var(--secondary-text)", marginBottom: 18 }}>
                        Are you sure you want to delete <b>{categoryToDelete?.CategoryName}</b>?
                    </div>
                    <button className={`${styles.categoriesDeleteBtn} ${styles.categoriesActionBtn}`} onClick={confirmDeleteCategory} disabled={deleteLoading}>
                        Delete
                    </button>
                    <button className={`${styles.categoriesEditBtn} ${styles.categoriesActionBtn}`} onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </button>
                </div>
            </Modal>

            <SuccessToast open={!!successMsg} message={successMsg} />

            {loading ? (
                <div className={styles.categoriesNoResults}>Loading categories...</div>
            ) : error ? (
                <div className={styles.categoriesNoResults} style={{ color: "var(--danger-red)" }}>{error}</div>
            ) : (
                <div className={styles.categoriesTableWrapper}>
                    <table className={styles.categoriesTable}>
                        <colgroup>
                            <col style={{ minWidth: 70, maxWidth: 90 }} />
                            <col style={{ minWidth: 220, maxWidth: 400 }} />
                            <col style={{ minWidth: 180, maxWidth: 220 }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className={styles.categoriesIdCol} onClick={() => requestSort('CategoryID')} style={{ cursor: 'pointer' }}>
                                    ID {sortConfig.key === 'CategoryID' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th onClick={() => requestSort('CategoryName')} style={{ cursor: 'pointer' }}>
                                    Name {sortConfig.key === 'CategoryName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th style={{ textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className={styles.categoriesNoResults}>No categories found.</td>
                                </tr>
                            ) : (
                                paginatedCategories.map((category) => (
                                    <tr key={category.CategoryID}>
                                        <td className={styles.categoriesIdCol}>{category.CategoryID}</td>
                                        <td className={styles.categoriesNameCol}>{category.CategoryName}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <button className={`${styles.categoriesActionBtn} ${styles.categoriesEditBtn}`} onClick={() => handleEditClick(category)}>
                                                <span className="material-symbols-outlined">edit</span> Edit
                                            </button>
                                            <button className={`${styles.categoriesActionBtn} ${styles.categoriesDeleteBtn}`} onClick={() => handleDeleteCategory(category)} disabled={deleteLoading}>
                                                <span className="material-symbols-outlined">delete</span> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default CategoriesPage;
