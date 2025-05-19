import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import styles from "../../pages/BooksPage.module.css";
import BorrowedBookWarning from "./BorrowedBookWarning";

const BookForm = ({ initialData, onSubmit, formType = 'add', borrowers = [] }) => {
    const [formData, setFormData] = useState({
        BookName: '',
        AuthorName: '',
        CategoryName: '',
        PublishYear: '',
        Quantity: ''
    });
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editConfirmed, setEditConfirmed] = useState(false);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData({
                BookName: initialData.BookName || '',
                AuthorName: initialData.AuthorName || '',
                CategoryName: initialData.CategoryName || '',
                PublishYear: initialData.PublishYear || '',
                Quantity: initialData.Quantity || ''
            });
        } else {
            setFormData({
                BookName: '',
                AuthorName: '',
                CategoryName: '',
                PublishYear: '',
                Quantity: ''
            });
        }
    }, [initialData]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [authorsRes, categoriesRes] = await Promise.all([
                    api.get('/authors'),
                    api.get('/categories')
                ]);
                setAuthors(authorsRes.data || []);
                setCategories(categoriesRes.data || []);
            } catch {
                setError("Failed to load authors or categories. Please try again.");
                setAuthors([]);
                setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDropdownData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.AuthorName) {
            return;
        }
        if (!formData.CategoryName) {
            return;
        }
        if (formType === 'edit' && borrowers && borrowers.length > 0 && !editConfirmed) {
            // Require confirmation if book is borrowed
            return;
        }
        onSubmit(formData);
    };

    if (isLoading) {
        return <p>Loading form data...</p>;
    }
    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    return (
        <form onSubmit={handleSubmit} className={styles.booksForm}>
            {/* Show warning if editing and book is borrowed */}
            {formType === 'edit' && borrowers && borrowers.length > 0 && (
                <>
                    <BorrowedBookWarning borrowers={borrowers} />
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ color: '#ad8b00', fontWeight: 500 }}>
                            <input type="checkbox" checked={editConfirmed} onChange={e => setEditConfirmed(e.target.checked)} />
                            &nbsp;I understand and want to proceed with editing this borrowed book.
                        </label>
                    </div>
                </>
            )}
            <div className={styles.booksFormRow}>
                <label htmlFor="BookName">Book Name</label>
                <input
                    type="text"
                    id="BookName"
                    name="BookName"
                    value={formData.BookName}
                    onChange={handleChange}
                    required
                    className={styles.booksFormInput}
                />
            </div>
            <div className={styles.booksFormRow}>
                <label htmlFor="AuthorName">Author</label>
                <input
                    type="text"
                    id="AuthorName"
                    name="AuthorName"
                    list="author-list"
                    value={formData.AuthorName || ''}
                    onChange={handleChange}
                    required
                    className={styles.booksFormInput}
                />
                <datalist id="author-list">
                    {authors.map(author => (
                        <option key={author.AuthorID} value={author.AuthorName} />
                    ))}
                </datalist>
            </div>
            <div className={styles.booksFormRow}>
                <label htmlFor="CategoryName">Category</label>
                <input
                    type="text"
                    id="CategoryName"
                    name="CategoryName"
                    list="category-list"
                    value={formData.CategoryName || ''}
                    onChange={handleChange}
                    required
                    className={styles.booksFormInput}
                />
                <datalist id="category-list">
                    {categories.map(category => (
                        <option key={category.CategoryID} value={category.CategoryName} />
                    ))}
                </datalist>
            </div>
            <div className={styles.booksFormRow}>
                <label htmlFor="PublishYear">Publish Year</label>
                <input
                    type="number"
                    id="PublishYear"
                    name="PublishYear"
                    value={formData.PublishYear}
                    onChange={handleChange}
                    min={-9999} // Allow negative years
                    max={new Date().getFullYear()} // Current year
                    className={styles.booksFormInput}
                />
            </div>
            <div className={styles.booksFormRow}>
                <label htmlFor="Quantity">Quantity</label>
                <input
                    type="number"
                    id="Quantity"
                    name="Quantity"
                    value={formData.Quantity}
                    onChange={handleChange}
                    min="0"
                    required
                    className={styles.booksFormInput}
                />
            </div>
            <button type="submit" className={styles.booksAddBtn} style={{ width: "100%", marginTop: 18 }}>
                {formType === 'add' ? 'Add Book' : 'Update Book'}
            </button>
        </form>
    );
};

export default BookForm;
