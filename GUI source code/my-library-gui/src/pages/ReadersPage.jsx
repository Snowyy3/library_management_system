import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import ReaderForm from "../components/Readers/ReaderForm";
import Modal from "../components/common/Modal";
import SuccessToast from "../components/common/SuccessToast";
import Pagination from "../components/common/Pagination";
import useSortableTable from "../hooks/useSortableTable";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styles from "./ReadersPage.module.css";

const RESULTS_OPTIONS = [10, 25, 40];

const ReadersPage = () => {
    const [readers, setReaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");
    const [editingReader, setEditingReader] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [resultsPerPage, setResultsPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [readerToDelete, setReaderToDelete] = useState(null);
    const [successToast, setSuccessToast] = useState({ open: false, message: "" });

    const fetchReaders = () => {
        setLoading(true);
        axios
            .get("/readers")
            .then((res) => {
                setReaders(res.data);
                setError(null);
            })
            .catch(() => {
                setError("Failed to fetch readers.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchReaders();
    }, []);

    const handleAddReader = (data) => {
        setAddLoading(true);
        setAddError("");
        axios
            .post("/readers", data)
            .then(() => {
                setSuccessToast({ open: true, message: "Reader added successfully." });
                setShowAddForm(false);
                fetchReaders();
            })
            .catch((err) => {
                setAddError(err.response?.data?.detail || "Failed to add reader.");
            })
            .finally(() => setAddLoading(false));
    };

    const handleEditClick = (reader) => {
        setEditingReader(reader);
        setShowAddForm(false);
        setEditError("");
    };

    const handleEditReader = (data) => {
        if (!editingReader) return;
        setEditLoading(true);
        setEditError("");
        axios
            .put(`/readers/${editingReader.ReaderID}`, data)
            .then(() => {
                setSuccessToast({ open: true, message: "Reader updated successfully." });
                setEditingReader(null);
                fetchReaders();
            })
            .catch((err) => {
                setEditError(err.response?.data?.detail || "Failed to update reader.");
            })
            .finally(() => setEditLoading(false));
    };

    const handleCancelEdit = () => {
        setEditingReader(null);
        setEditError("");
    };

    const handleDeleteReader = (reader) => {
        setReaderToDelete(reader);
        setShowDeleteModal(true);
    };

    const confirmDeleteReader = async () => {
        if (!readerToDelete) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`/readers/${readerToDelete.ReaderID}`);
            fetchReaders();
            setShowDeleteModal(false);
            setReaderToDelete(null);
            setSuccessToast({ open: true, message: "Reader deleted successfully!" });
        } catch (err) {
            setEditError(err.response?.data?.detail || "Failed to delete reader.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const filteredReaders = readers.filter((r) =>
        r.ReaderName.toLowerCase().includes(search.toLowerCase()) ||
        r.Address.toLowerCase().includes(search.toLowerCase()) ||
        r.PhoneNumber.toLowerCase().includes(search.toLowerCase()) ||
        String(r.ReaderID).toLowerCase().includes(search.toLowerCase())
    );
    const { sortedData: sortedReaders, sortConfig, requestSort } = useSortableTable(filteredReaders);
    const totalPages = Math.ceil(filteredReaders.length / resultsPerPage) || 1;
    const paginatedReaders = sortedReaders.slice(
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
        <div className={styles.readersPageCard}>
            <div className={styles.readersHeaderRow}>
                <input
                    className={styles.readersSearchBar}
                    type="text"
                    placeholder="Search by name, address, or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className={styles.readersAddBtn}
                    onClick={() => setShowAddForm((v) => !v)}
                >
                    <span className="material-symbols-outlined">add</span>
                    {showAddForm ? "Cancel" : "Add New Reader"}
                </button>
                <div className={styles.readersHeaderSpacer} />
                <select
                    className={styles.readersResultsPerPage}
                    value={resultsPerPage}
                    onChange={e => setResultsPerPage(Number(e.target.value))}
                >
                    {RESULTS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt} / page</option>
                    ))}
                </select>
            </div>

            <Modal open={showAddForm} onClose={() => setShowAddForm(false)}>
                <ReaderForm onSubmit={handleAddReader} formType="add" onCancel={() => setShowAddForm(false)} />
                {addLoading && <div className={styles.readersNoResults}>Adding reader...</div>}
                {addError && <div className={styles.readersFormError}>{addError}</div>}
            </Modal>

            <Modal open={!!editingReader} onClose={handleCancelEdit}>
                <ReaderForm initialData={editingReader} onSubmit={handleEditReader} formType="edit" onCancel={handleCancelEdit} />
                {editLoading && <div className={styles.readersNoResults}>Updating reader...</div>}
                {editError && <div className={styles.readersFormError}>{editError}</div>}
            </Modal>

            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div style={{ textAlign: "center", padding: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--danger-red)", marginBottom: 8 }}>delete</span>
                    <h3 style={{ margin: "18px 0 8px 0", color: "var(--primary-text)", fontWeight: 700 }}>Delete Reader?</h3>
                    <div style={{ color: "var(--secondary-text)", marginBottom: 18 }}>
                        Are you sure you want to delete <b>{readerToDelete?.ReaderName}</b>?
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                        <button className={`${styles.readersActionBtn} ${styles.readersDeleteBtn}`} onClick={confirmDeleteReader} disabled={deleteLoading}>
                            Delete
                        </button>
                        <button className={`${styles.readersActionBtn} ${styles.readersEditBtn}`} onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
            <SuccessToast open={successToast.open} message={successToast.message} />

            <div className={styles.readersTableWrapper}>
                {loading && readers.length === 0 ? (
                    <div className={styles.readersNoResults}>Loading readers...</div>
                ) : error && readers.length === 0 ? (
                    <div className={styles.readersNoResults}>Error fetching readers.</div>
                ) : paginatedReaders.length === 0 ? (
                    <div className={styles.readersNoResults}>{search ? "No readers match your search." : "No readers found."}</div>
                ) : (
                    <table className={styles.readersTable}>
                        <thead>
                            <tr>
                                <th className={`${styles.readersIdCol} readersIdCol`} onClick={() => requestSort('ReaderID')} style={{ cursor: 'pointer' }}>
                                    ID {sortConfig.key === 'ReaderID' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th onClick={() => requestSort('ReaderName')} style={{ cursor: 'pointer' }}>
                                    Name {sortConfig.key === 'ReaderName' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th onClick={() => requestSort('Address')} style={{ cursor: 'pointer' }}>
                                    Address {sortConfig.key === 'Address' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th onClick={() => requestSort('PhoneNumber')} style={{ cursor: 'pointer' }}>
                                    Phone Number {sortConfig.key === 'PhoneNumber' && (sortConfig.direction === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
                                </th>
                                <th className={`${styles.readersActionsCol} readersActionsCol`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReaders.map((reader) => (
                                <tr key={reader.ReaderID}>
                                    <td className={`${styles.readersIdCol} readersIdCol`}>{reader.ReaderID}</td>
                                    <td className={styles.readersNameCol}>{reader.ReaderName}</td>
                                    <td className={styles.readersAddressCol}>{reader.Address}</td>
                                    <td className={styles.readersPhoneCol}>{reader.PhoneNumber}</td>
                                    <td className={`${styles.readersActionsCol} readersActionsCol`}>
                                        <button className={`${styles.readersActionBtn} ${styles.readersEditBtn}`} onClick={() => handleEditClick(reader)}>
                                            <span className="material-symbols-outlined">edit</span>
                                            Edit
                                        </button>
                                        <button className={`${styles.readersActionBtn} ${styles.readersDeleteBtn}`} onClick={() => handleDeleteReader(reader)} disabled={deleteLoading}>
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

export default ReadersPage;
