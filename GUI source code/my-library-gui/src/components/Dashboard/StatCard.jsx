import React from "react";
import styles from "./StatCard.module.css"; // Import CSS Module

const StatCard = ({
    icon,
    value,
    label,
    accent,
    customContent,
    className,
    labelClassName,
    style,
    boldLabel = false
}) => (
    <div className={`${styles.statCard} ${className || ''}`} style={style}>
        <div className={styles.statCardTop}>
            <span className={`${styles.statIconWrapper} ${accent ? styles.accent : ''}`}>
                {icon} {/* Assuming icon is a <span className="material-symbols-outlined">icon_name</span> */}
            </span>
            <span className={styles.statCardValue}>{value}</span>
        </div>
        <div className={`${styles.statCardLabel} ${boldLabel ? styles.boldLabel : ''} ${labelClassName ? styles[labelClassName] : ''}`}>
            {label}
        </div>
        {customContent && (
            <div className={styles.statCardCustomContent}>
                {customContent}
            </div>
        )}
    </div>
);

export default StatCard;
