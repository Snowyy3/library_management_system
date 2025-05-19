import React from 'react';
import OverdueRatioChart from './OverdueRatioChart';
import AvailableBookRatioChart from './AvailableBookRatioChart';
import styles from './ChartCard.module.css';

function ChartCard() {
    return (
        <div className={styles.chartCardContainer}>
            <div className={styles.chartsRow}>
                <div className={styles.chartWrapper}>
                    <h3 className={styles.chartTitle}>Available books</h3>
                    <AvailableBookRatioChart />
                </div>
                <div className={styles.chartWrapper}>
                    <h3 className={styles.chartTitle}>Overdue books</h3>
                    <OverdueRatioChart />
                </div>
            </div>
        </div>
    );
}

export default ChartCard;
