import React, { useState, useRef, useEffect } from "react";
import styles from "./AutocompleteInput.module.css";

const AutocompleteInput = ({ label, options, value, onChange, getOptionLabel, placeholder, disabled, required, searchBar }) => {
    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setFilteredOptions(
            options.filter(opt =>
                getOptionLabel(opt).toLowerCase().includes(inputValue.toLowerCase())
            )
        );
    }, [inputValue, options, getOptionLabel]);

    useEffect(() => {
        if (!showDropdown) setInputValue("");
    }, [showDropdown]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                inputRef.current &&
                !inputRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Determine input value and style
    const isSelected = !!value;
    const displayValue = showDropdown
        ? inputValue
        : (isSelected ? getOptionLabel(value) : "");
    // If searchBar and selected, hide text (white on white) and show placeholder
    const inputClass = `${styles.input} ${searchBar ? styles.searchBar : ""} ${isSelected && !showDropdown && searchBar ? styles.inputSelected : ""}`;
    const inputStyle = (isSelected && !showDropdown && searchBar)
        ? { color: "#fff", background: "#fff", caretColor: "#fff" }
        : {};

    return (
        <div className={styles.autocompleteWrapper}>
            {label && <label className={styles.label}>{label}{required && <span className={styles.required}>*</span>}</label>}
            <input
                ref={inputRef}
                className={inputClass}
                type="text"
                value={displayValue}
                onChange={e => {
                    setInputValue(e.target.value);
                    setShowDropdown(true);
                    onChange("");
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder={showDropdown || !isSelected ? placeholder : (searchBar ? placeholder : "")}
                disabled={disabled}
                autoComplete="off"
                required={required}
                style={inputStyle}
            />
            {showDropdown && filteredOptions.length > 0 && (
                <ul className={styles.dropdown} ref={dropdownRef}>
                    {filteredOptions.map(opt => (
                        <li
                            key={getOptionLabel(opt)}
                            className={styles.option}
                            onMouseDown={() => {
                                onChange(opt);
                                setInputValue("");
                                setShowDropdown(false);
                            }}
                        >
                            {getOptionLabel(opt)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteInput;
