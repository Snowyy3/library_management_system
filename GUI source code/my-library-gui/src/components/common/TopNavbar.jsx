import React, { useState, useRef, useEffect } from "react";
import styles from "./TopNavbar.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../store/UserContext.jsx";
import * as api from "../../api/auth";
import { useToast } from "../../store/ToastContext";

const PAGE_TITLES = {
    "/": "Dashboard",
    "/books": "Books Management",
    "/authors": "Authors Management",
    "/categories": "Categories Management",
    "/readers": "Readers Management",
    "/borrowing": "Borrow and Return",
    "/reports": "Reports",
};

function randomString(length = 7) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const TopNavbar = ({ onHamburgerClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");
    const pageTitle = PAGE_TITLES[path] || "";
    const { user, setUser } = useUser();
    const { showToast } = useToast();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const userBlockRef = useRef(null);
    const [showRename, setShowRename] = useState(false);
    const [renameValue, setRenameValue] = useState("");
    const [renameError, setRenameError] = useState("");
    const [renameLoading, setRenameLoading] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteChallenge, setDeleteChallenge] = useState("");
    const [deleteInput, setDeleteInput] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Close dropdown on outside click
    useEffect(() => {
        if (!dropdownOpen) return;
        function handleClick(e) {
            if (userBlockRef.current && !userBlockRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [dropdownOpen]);

    return (
        <>
            <nav className={styles.topNavbar}>
                <div className={styles.leftSection}>
                    <button
                        className={styles.hamburgerButton}
                        aria-label="Toggle sidebar"
                        onClick={onHamburgerClick}
                        type="button"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className={styles.pageLabel}>{pageTitle}</span>
                </div>
                <div className={styles.navControls}>
                    <div
                        className={styles.userInfoBlock}
                        ref={userBlockRef}
                        tabIndex={0}
                        onClick={() => setDropdownOpen((v) => !v)}
                    >
                        <div className={styles.userTextBlock}>
                            <div className={styles.userName}>{user && user.loggedIn && user.isGuest ? "Guest user" : user && user.loggedIn ? user.name : "Guest user"}</div>
                            <div className={styles.userRole}>{user && user.loggedIn ? (user.role || "Librarian") : "Librarian"}</div>
                        </div>
                        <img
                            // src={user && user.avatar ? user.avatar : "https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-1/470968463_1648249186098093_6221390604306863311_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEceLisdj9aLZ2k-BCOsYYfUzMkoknKtKpTMySiScq0qqXKfcHP0QZo06vUH8XBHPxeWaITj7ZskeJoakTVllrT&_nc_ohc=LnFQVyjsrd8Q7kNvwGy69Ma&_nc_oc=Admfx4R85Nl1CZSFggknZllotC1M85noDngeJ5dH_NldUCER99HGd_d7S6acDaiQlxiKfaGbwjg7AwHLH2Nv0U9a&_nc_zt=24&_nc_ht=scontent.fhan2-5.fna&_nc_gid=91pCsEXoKyozAl25FAU_ow&oh=00_AfIptfqlHbNG0qDXBwaQ2J_UfIkGn5M4yes3g75yONuAJg&oe=682FABA3"} // User avatar URL
                            src={user && user.avatar ? user.avatar : "https://scontent.fhan2-4.fna.fbcdn.net/v/t1.6435-9/106382706_169080851291770_5323761216384394774_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHtIeBMcV1S5T7FzPSAUPtEhkFd4m2_moKGQV3ibb-aghDnlBSyLjh9QxovazLaHsE6kSaL5bXCOcDHtKU5xlDI&_nc_ohc=hg7LHmAKWpoQ7kNvwGzm18H&_nc_oc=Admm6DoCaxIpjzp4Km2jFZK4iAo-moJDbVO2wGU3obuqKXIFcy8WYhuhFStbeWfs0MBuWLtQ_TZHsBdX9uApJuPm&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=BCX_crKArTVjhGj035SDCw&oh=00_AfLt-huTLeMN8gvN6fE4Cx88QM_ypsFvJ0EmC5s0RK_pxA&oe=684FA5BB"} // User avatar URL
                            // src={user && user.avatar ? user.avatar : "https://randomuser.me/api/portraits/women/94.jpg"} // User avatar URL
                            alt="User avatar"
                            className={styles.userAvatar}
                            width={44}
                            height={44}
                        />
                        {dropdownOpen && (
                            <div className={styles.userDropdownMenu}>
                                {user && user.loggedIn ? (
                                    <>
                                        <button
                                            className={`${styles.userDropdownItem} ${styles.userDropdownItemRename}`}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setDropdownOpen(false);
                                                setRenameValue(user.name || "");
                                                setRenameError("");
                                                setShowRename(true);
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.1em', verticalAlign: 'middle', marginRight: 8 }}>edit</span>
                                            Rename
                                        </button>
                                        <button
                                            className={`${styles.userDropdownItem} ${styles.userDropdownItemDelete}`}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setDropdownOpen(false);
                                                setDeleteChallenge(randomString(Math.floor(Math.random() * 3) + 6));
                                                setDeleteInput("");
                                                setDeleteError("");
                                                setShowDelete(true);
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.1em', verticalAlign: 'middle', marginRight: 8 }}>delete</span>
                                            Delete account
                                        </button>
                                        <button
                                            className={styles.userDropdownItem}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setDropdownOpen(false);
                                                setUser(null);
                                                navigate('/login');
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.1em', verticalAlign: 'middle', marginRight: 8 }}>logout</span>
                                            Log out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className={styles.userDropdownItem}
                                            style={{ color: '#F65867', fontWeight: 500 }}
                                            onClick={e => { e.stopPropagation(); setDropdownOpen(false); navigate('/signup'); }}
                                        >Sign up</button>
                                        <button
                                            className={styles.userDropdownItem}
                                            onClick={e => { e.stopPropagation(); setDropdownOpen(false); navigate('/login'); }}
                                        >Log in</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {/* Rename Modal */}
            {showRename && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalDialog}>
                        <h3 className={styles.modalTitle}>Change Display Name</h3>
                        <input
                            className={styles.input}
                            type="text"
                            value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            placeholder="New display name"
                            autoFocus
                            autoComplete="off"
                        />
                        {renameError && <div className={styles.error}>{renameError}</div>}
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setShowRename(false)} disabled={renameLoading}>Cancel</button>
                            <button
                                className={styles.confirmBtn}
                                disabled={renameLoading || !renameValue.trim() || renameValue.trim().length < 2}
                                onClick={async () => {
                                    if (!renameValue.trim() || renameValue.trim().length < 2) {
                                        setRenameError("Name must be at least 2 characters.");
                                        return;
                                    }
                                    setRenameLoading(true);
                                    try {
                                        await api.renameUser({ email: user.email, newDisplayName: renameValue.trim() });
                                        setUser({ ...user, name: renameValue.trim() });
                                        setShowRename(false);
                                        showToast({ type: "success", message: "Display name updated successfully." });
                                    } catch (err) {
                                        setRenameError("Failed to update name.");
                                        showToast({ type: "error", message: "Failed to update display name." });
                                    } finally {
                                        setRenameLoading(false);
                                    }
                                }}
                            >{renameLoading ? 'Saving...' : 'Confirm'}</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Modal */}
            {showDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalDialog}>
                        <h3 className={styles.modalTitle} style={{ color: 'var(--danger-red)' }}>Delete Account</h3>
                        <div style={{ color: 'var(--primary-text)', marginBottom: 12 }}>
                            This action is <b>irreversible</b>.<br />
                            To confirm, type the code below:
                        </div>
                        <div style={{
                            fontFamily: 'monospace',
                            fontSize: '1.2em',
                            background: '#fbeaea',
                            color: 'var(--danger-red)',
                            padding: '6px 16px',
                            borderRadius: 6,
                            marginBottom: 10,
                            display: 'inline-block',
                            letterSpacing: 2
                        }}>{deleteChallenge}</div>
                        <input
                            className={styles.input}
                            type="text"
                            value={deleteInput}
                            onChange={e => setDeleteInput(e.target.value)}
                            placeholder="Type the code above to confirm"
                            autoFocus
                            autoComplete="off"
                        />
                        {deleteError && <div className={styles.error}>{deleteError}</div>}
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setShowDelete(false)} disabled={deleteLoading}>Cancel</button>
                            <button
                                className={styles.confirmBtn}
                                style={{ backgroundColor: 'var(--danger-red)' }}
                                disabled={deleteInput !== deleteChallenge || deleteLoading}
                                onClick={async () => {
                                    if (deleteInput !== deleteChallenge) {
                                        setDeleteError("Code does not match.");
                                        showToast({ type: "error", message: "Confirmation code does not match." });
                                        return;
                                    }
                                    setDeleteLoading(true);
                                    try {
                                        await api.deleteUser({ email: user.email });
                                        setUser(null);
                                        setShowDelete(false);
                                        setDeleteLoading(false);
                                        showToast({ type: "success", message: "Account deleted successfully." });
                                        window.location.reload();
                                    } catch (err) {
                                        setDeleteError("Failed to delete account.");
                                        showToast({ type: "error", message: "Failed to delete account." });
                                        setDeleteLoading(false);
                                    }
                                }}
                            >{deleteLoading ? 'Deleting...' : 'Delete'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TopNavbar;
