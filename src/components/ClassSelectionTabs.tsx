import React from 'react';
import styles from './ClassSelectionTabs.module.css';

interface ClassTab {
    value: string;
    label: string;
    count: number;
}

interface ClassSelectionTabsProps {
    selectedClass: string;
    onSelectClass: (value: string) => void;
    tabs: ClassTab[];
    totalCount: number;
}

export default function ClassSelectionTabs({
    selectedClass,
    onSelectClass,
    tabs,
    totalCount
}: ClassSelectionTabsProps) {
    return (
        <div className={styles.container}>
            <button
                className={`${styles.tab} ${selectedClass === 'all' ? styles.active : ''}`}
                onClick={() => onSelectClass('all')}
            >
                전체 <span className={styles.count}>{totalCount}</span>
            </button>
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    className={`${styles.tab} ${selectedClass === tab.value ? styles.active : ''}`}
                    onClick={() => onSelectClass(tab.value)}
                >
                    {tab.label} <span className={styles.count}>{tab.count}</span>
                </button>
            ))}
        </div>
    );
}
