'use client';

import { OCRSidebar } from '@/components/layout/OCRSidebar';
import { GlobalNav } from '@/components/layout/GlobalNav';
import styles from '../dashboard/layout.module.css';

/**
 * OCR Layout Component
 * 
 * @description
 * Layout wrapper for the OCR evaluation section.
 * Includes GlobalNav and OCRSidebar components for specialized navigation.
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
export default function OCRLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <GlobalNav />
            <div className={styles.layout}>
                <OCRSidebar />
                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </>
    );
}
