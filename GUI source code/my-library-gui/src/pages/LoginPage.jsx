import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./LoginPage.module.css";
import logo from "../assets/Book_2_icon_low_res.jpeg";
import GoogleLogo from "../assets/google.svg";
import { useUser } from "../store/UserContext.jsx";
import { useToast } from "../store/ToastContext";
import api from "../api/axiosConfig";

const LoginPage = () => {
    const { setUser } = useUser();
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate

    const getModeFromPath = useCallback(() => {
        return location.pathname === "/signup" ? "signup" : "login";
    }, [location.pathname]);

    const [form, setForm] = useState({
        email: "",
        displayName: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState(getModeFromPath());
    const [apiError, setApiError] = useState("");
    const [showForgot, setShowForgot] = useState(false);
    const [forgotForm, setForgotForm] = useState({ email: "", displayName: "", newPassword: "" });
    const [forgotErrors, setForgotErrors] = useState({});
    const [forgotMsg, setForgotMsg] = useState("");

    useEffect(() => {
        const currentPathMode = getModeFromPath();
        if (mode !== currentPathMode) {
            setMode(currentPathMode);
        }
    }, [location.pathname, mode, getModeFromPath]);

    useEffect(() => {
        setForm(prevForm => ({
            email: prevForm.email,
            displayName: mode === "signup" ? prevForm.displayName : "",
            password: "",
            confirmPassword: "",
        }));
        setErrors({});
        setApiError("");
    }, [mode]);

    // Always clear password fields when switching mode or opening forgot password
    useEffect(() => {
        if (!showForgot) return;
        setForm(prevForm => ({
            ...prevForm,
            password: "",
            confirmPassword: "",
        }));
    }, [showForgot]);

    const handleShowForgot = () => {
        setForgotForm({
            email: form.email,
            displayName: "",
            newPassword: "",
        });
        setForgotErrors({});
        setForgotMsg("");
        setShowForgot(true);
    };

    const validate = (field, value, currentValidationMode) => {
        let err = "";
        if (field === "email") {
            if (!value) err = "Email is required.";
            else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) err = "Invalid email.";
        }
        if (field === "displayName" && currentValidationMode === "signup") {
            if (!value) err = "Display name required.";
        }
        if (field === "password") {
            if (!value) err = "Password required.";
            else if (value.length < 6) err = "Min 6 characters.";
        }
        if (field === "confirmPassword" && currentValidationMode === "signup") {
            if (!value) err = "Confirm password.";
            else if (value !== form.password) err = "Passwords do not match.";
        }
        return err;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value.trimStart() }));
        setErrors((errs) => ({ ...errs, [name]: validate(name, value.trimStart(), mode) }));
    };

    const handleForgotChange = (e) => {
        const { name, value } = e.target;
        setForgotForm((f) => ({ ...f, [name]: value.trimStart() }));
        setForgotErrors((errs) => ({ ...errs, [name]: "" })); // Clear specific error on change
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        let errs = {};
        if (!forgotForm.email) errs.email = "Email required.";
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(forgotForm.email)) errs.email = "Invalid email.";
        if (!forgotForm.displayName) errs.displayName = "Display name required.";
        if (!forgotForm.newPassword || forgotForm.newPassword.length < 6) errs.newPassword = "Min 6 characters for new password.";
        setForgotErrors(errs);
        if (Object.values(errs).some(Boolean)) return;
        setLoading(true); // Added loading state for forgot password
        setForgotMsg(""); // Clear previous messages
        try {
            const res = await api.post("/auth/forgot", {
                email: forgotForm.email.trim(),
                display_name: forgotForm.displayName.trim(),
                new_password: forgotForm.newPassword.trim(),
            });
            if (res.data && res.data.success) {
                setForgotMsg("Password updated! You can now log in.");
                showToast({ type: "success", message: "Password updated! You can now log in." });
                setTimeout(() => {
                    setShowForgot(false);
                    setForgotMsg(""); // Clear message after modal closes
                }, 1800);
            } else {
                setForgotMsg(res.data.message || "Failed to update password.");
                showToast({ type: "error", message: res.data.message || "Failed to update password." });
            }
        } catch (err) {
            setForgotMsg(err.response?.data?.detail || "Failed to update password.");
            showToast({ type: "error", message: err.response?.data?.detail || "Failed to update password." });
        } finally {
            setLoading(false); // Added loading state for forgot password
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("submit", form, mode);
        let newErrors = {};
        const fieldsToValidate = ["email", "password"];
        if (mode === "signup") {
            fieldsToValidate.push("displayName", "confirmPassword");
        }

        fieldsToValidate.forEach((field) => {
            newErrors[field] = validate(field, form[field], mode);
        });

        setErrors(newErrors);
        if (Object.values(newErrors).filter(Boolean).length > 0) return;

        setLoading(true);
        setApiError("");
        try {
            const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
            const payload = {
                email: form.email.trim(), // Trim values before sending
                password: form.password.trim(), // Trim values before sending
            };
            if (mode === "signup") {
                payload.display_name = form.displayName.trim(); // Trim values before sending
            }

            console.log("API call:", endpoint, payload);
            const res = await api.post(endpoint, payload);
            console.log("API response:", res.data);
            if (res.data && res.data.success) {
                setUser({
                    name: res.data.display_name,
                    email: res.data.email,
                    loggedIn: true,
                    // avatar: res.data.avatar_url, // Potentially if backend sends it
                    // role: res.data.role, // Potentially if backend sends it
                });
                navigate("/"); // Use navigate instead of window.location.href
            } else {
                setApiError(res.data.message || (mode === "login" ? "Login failed." : "Signup failed."));
            }
        } catch (err) {
            console.log("API error:", err);
            setApiError(err.response?.data?.detail || "Network error or server issue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPageWrapper}>
            <div className={styles.loginCard} style={{ minWidth: 400, maxWidth: 440, minHeight: 540 }}>
                <img src={logo} alt="LibSys logo" className={styles.logo} />
                <h2 className={styles.title}>{mode === "login" ? "Welcome back" : "Create an account"}</h2>
                <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
                    <input
                        className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        autoFocus
                    />
                    {errors.email && <div className={styles.error}>{errors.email}</div>}
                    {mode === "signup" && (
                        <>
                            <input
                                className={`${styles.input} ${errors.displayName ? styles.inputError : ""}`}
                                type="text"
                                name="displayName"
                                placeholder="Display name"
                                value={form.displayName}
                                onChange={handleChange}
                            />
                            {errors.displayName && <div className={styles.error}>{errors.displayName}</div>}
                        </>
                    )}
                    <input
                        className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        autoCorrect="off"
                        spellCheck={false}
                    />
                    {errors.password && <div className={styles.error}>{errors.password}</div>}
                    {mode === "signup" && (
                        <input
                            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            autoCorrect="off"
                            spellCheck={false}
                        />
                    )}
                    {mode === "signup" && errors.confirmPassword && (
                        <div className={styles.error}>{errors.confirmPassword}</div>
                    )}
                    <div className={styles.forgotRow}>
                        <button type="button" className={styles.forgotBtn} tabIndex={-1} onClick={handleShowForgot}>
                            Forgot Password?
                        </button>
                    </div>
                    {apiError && <div className={styles.apiError}>{apiError}</div>}
                    <button
                        className={styles.continueBtn} // Style will be updated in CSS module
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (mode === "login" ? "Logging in..." : "Signing up...") : (mode === "login" ? "Log in" : "Sign up")}
                    </button>
                </form>
                <div className={styles.switchModeRow}>
                    {mode === "login" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <button type="button" className={styles.switchModeBtn} onClick={() => navigate("/signup")}>Sign up</button> {/* Use navigate */}
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button type="button" className={styles.switchModeBtn} onClick={() => navigate("/login")}>Log in</button> {/* Use navigate */}
                        </>
                    )}
                </div>
                <div className={styles.dividerRow}>
                    <span className={styles.dividerText}>or</span>
                </div>
                {/* Guest login button replaces Google button */}
                <button
                    className={styles.guestBtn}
                    type="button"
                    tabIndex={-1}
                    onClick={() => {
                        setUser({
                            name: "user",
                            email: "",
                            loggedIn: true,
                            isGuest: true,
                        });
                        navigate("/");
                    }}
                >
                    <span className={styles.guestIcon} aria-hidden="true">👤</span>
                    Continue as Guest
                </button>
                {/* Google button placeholder, hidden for now */}
                {/* <button className={styles.googleBtn} type="button" tabIndex={-1} disabled>
                    <img src={GoogleLogo} alt="Google logo" className={styles.googleIcon} />
                    Continue with Google
                </button> */}
                {showForgot && (
                    <div className={styles.forgotModalOverlay}>
                        <div className={styles.forgotModal}>
                            <h3>Reset Password</h3>
                            <form onSubmit={handleForgotSubmit} className={styles.forgotForm}>
                                <input
                                    className={`${styles.input} ${forgotErrors.email ? styles.inputError : ""}`}
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={forgotForm.email}
                                    onChange={handleForgotChange}
                                />
                                {forgotErrors.email && <div className={styles.error}>{forgotErrors.email}</div>}
                                <input
                                    className={`${styles.input} ${forgotErrors.displayName ? styles.inputError : ""}`}
                                    type="text"
                                    name="displayName"
                                    placeholder="Display name"
                                    value={forgotForm.displayName}
                                    onChange={handleForgotChange}
                                />
                                {forgotErrors.displayName && <div className={styles.error}>{forgotErrors.displayName}</div>}
                                <input
                                    className={`${styles.input} ${forgotErrors.newPassword ? styles.inputError : ""}`}
                                    type="password"
                                    name="newPassword"
                                    placeholder="New password (min 6 chars)"
                                    value={forgotForm.newPassword}
                                    onChange={handleForgotChange}
                                    autoComplete="new-password"
                                    autoCorrect="off"
                                    spellCheck={false}
                                />
                                {forgotErrors.newPassword && <div className={styles.error}>{forgotErrors.newPassword}</div>}
                                {forgotMsg && <div className={styles.apiError} style={{ color: forgotMsg.startsWith("Password updated") ? "var(--color-success)" : "var(--color-danger)" }}>{forgotMsg}</div>}
                                <div className={styles.forgotModalActions}>
                                    <button type="button" className={styles.forgotCancelBtn} onClick={() => setShowForgot(false)} disabled={loading}>Cancel</button>
                                    <button type="submit" className={styles.forgotConfirmBtn} disabled={loading}>
                                        {loading ? "Processing..." : "Confirm"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <footer className={styles.footer}>
                <a href="#" className={styles.footerLink}>Privacy policy</a>
                <span className={styles.footerSep}>|</span>
                <a href="#" className={styles.footerLink}>Terms of service</a>
            </footer>
        </div>
    );
};

export default LoginPage;
