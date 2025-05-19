import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import AuthorForm from "../components/Authors/AuthorForm";
import Modal from "../components/common/Modal";
import SuccessToast from "../components/common/SuccessToast";
import Pagination from "../components/common/Pagination";
import useSortableTable from "../hooks/useSortableTable";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styles from "./AuthorsPage.module.css";

const RESULTS_OPTIONS = [10, 25, 40];

const AuthorsPage = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [resultsPerPage, setResultsPerPage] = useState(25);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState(null);
    const [successToast, setSuccessToast] = useState({ open: false, message: "" });
    const [currentPage, setCurrentPage] = useState(1);

    const fetchAuthors = () => {
        setLoading(true);
        axios
            .get("/authors")
            .then((res) => {
                setAuthors(res.data);
                setError(null);
            })
            .catch(() => {
                setError("Failed to fetch authors.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleAddAuthor = (data) => {
        setAddLoading(true);
        setAddError("");
        axios
            .post("/authors", data)
            .then(() => {
                setSuccessToast({ open: true, message: "Author added successfully." });
                setShowAddForm(false);
                fetchAuthors();
            })
            .catch((err) => {
                setAddError(
                    err.response?.data?.detail || "Failed to add author."
                );
            })
            .finally(() => setAddLoading(false));
    };

    const handleEditClick = (author) => {
        setEditingAuthor(author);
        setShowAddForm(false);
        setEditError("");
    };

    const handleEditAuthor = (data) => {
        if (!editingAuthor) return;
        setEditLoading(true);
        setEditError("");
        axios
            .put(`/authors/${editingAuthor.AuthorID}`, data)
            .then(() => {
                setSuccessToast({ open: true, message: "Author updated successfully." });
                setEditingAuthor(null);
                fetchAuthors();
            })
            .catch((err) => {
                setEditError(
                    err.response?.data?.detail || "Failed to update author."
                );
            })
            .finally(() => setEditLoading(false));
    };

    const handleCancelEdit = () => {
        setEditingAuthor(null);
        setEditError("");
    };

    const handleDeleteAuthor = (author) => {
        setAuthorToDelete(author);
        setShowDeleteModal(true);
    };

    const confirmDeleteAuthor = async () => {
        if (!authorToDelete) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`/authors/${authorToDelete.AuthorID}`);
            fetchAuthors();
            setShowDeleteModal(false);
            setAuthorToDelete(null);
            setSuccessToast({ open: true, message: "Author deleted successfully!" });
        } catch (err) {
            setEditError(err.response?.data?.detail || "Failed to delete author.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const filteredAuthors = authors.filter((a) =>
        a.AuthorName.toLowerCase().includes(search.toLowerCase()) ||
        String(a.AuthorID).toLowerCase().includes(search.toLowerCase())
    );
    const { sortedData: sortedAuthors, sortConfig, requestSort } = useSortableTable(filteredAuthors);
    const totalPages = Math.ceil(filteredAuthors.length / resultsPerPage) || 1;
    const paginatedAuthors = sortedAuthors.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, resultsPerPage]);

    useEffect(() => {
        if (successToast.open) {
            const t = setTimeout(() => setSuccessToast({ open: false, message: "" }), 1500);
            return () => clearTimeout(t);
        }
    }, [successToast.open]);

    return (
        <div className={styles.authorsPageCard}>
            <div className={styles.authorsHeaderRow}>
                <input
                    className={styles.authorsSearchBar}
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className={styles.authorsAddBtn}
                    onClick={() => setShowAddForm((v) => !v)}
                >
                    <span className="material-symbols-outlined">add</span>
                    {showAddForm ? "Cancel" : "Add New Author"}
                </button>
                <div className={styles.authorsHeaderSpacer} />
                <select
                    className={styles.authorsResultsPerPage}
                    value={resultsPerPage}
                    onChange={e => setResultsPerPage(Number(e.target.value))}
                >
                    {RESULTS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt} / page</option>
                    ))}
                </select>
            </div>

            <Modal open={showAddForm} onClose={() => setShowAddForm(false)}>
                <AuthorForm onSubmit={handleAddAuthor} formType="add" onCancel={() => setShowAddForm(false)} />
                {addLoading && <div className={styles.authorsNoResults}>Adding author...</div>}
                {addError && <div className={styles.authorsFormError}>{addError}</div>}
            </Modal>

            <Modal open={!!editingAuthor} onClose={handleCancelEdit}>
                <AuthorForm initialData={editingAuthor} onSubmit={handleEditAuthor} formType="edit" onCancel={handleCancelEdit} />
                {editLoading && <div className={styles.authorsNoResults}>Updating author...</div>}
                {editError && <div className={styles.authorsFormError}>{editError}</div>}
            </Modal>

            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div style={{ textAlign: "center", padding: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--danger-red)", marginBottom: 8 }}>delete</span>
                    <h3 style={{ margin: "18px 0 8px 0", color: "var(--primary-text)", fontWeight: 700 }}>Delete Author?</h3>
                    <div style={{ color: "var(--secondary-text)", marginBottom: 18 }}>
                        Are you sure you want to delete <b>{authorToDelete?.AuthorName}</b>?
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                        <button className={`${styles.authorsActionBtn} ${styles.authorsDeleteBtn}`} onClick={confirmDeleteAuthor}>
                            Delete
                        </button>
                        <button className={`${styles.authorsActionBtn} ${styles.authorsEditBtn}`} onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
            <SuccessToast open={successToast.open} message={successToast.message} />

            <div className={styles.authorsTableWrapper}>
                {loading && authors.length === 0 ? (
                    <div className={styles.authorsNoResults}>Loading authors...</div>
                ) : error && authors.length === 0 ? (
                    <div className={styles.authorsNoResults}>Error fetching authors.</div>
                ) : paginatedAuthors.length === 0 ? (
                    <div className={styles.authorsNoResults}>{search ? "No authors match your search." : "No authors found."}</div>
                ) : (
                    <table className={styles.authorsTable}>
                        <thead>
                            <tr>
                                <th className={`${styles.authorsIdCol} authorsIdCol`} onClick={() => requestSort('AuthorID')} style={{ cursor: 'pointer' }}>
                                    ID {sortConfig.key === 'AuthorID' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th onClick={() => requestSort('AuthorName')} style={{ cursor: 'pointer' }}>
                                    Name {sortConfig.key === 'AuthorName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedAuthors.map((author) => (
                                <tr key={author.AuthorID}>
                                    <td className={`${styles.authorsIdCol} authorsIdCol`}>{author.AuthorID}</td>
                                    <td className={styles.authorsNameCol}>{author.AuthorName}</td>
                                    <td>
                                        <button className={`${styles.authorsActionBtn} ${styles.authorsEditBtn}`} onClick={() => handleEditClick(author)}>
                                            <span className="material-symbols-outlined">edit</span>
                                            Edit
                                        </button>
                                        <button className={`${styles.authorsActionBtn} ${styles.authorsDeleteBtn}`} onClick={() => handleDeleteAuthor(author)} disabled={deleteLoading}>
                                            <span className="material-symbols-outlined">delete</span>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default AuthorsPage;
