import { Sidebar } from '@/components/layout/Sidebar';
import styles from '../../dashboard/layout.module.css';

/**
 * AI Settings Layout Component
 * 
 * @description
 * Layout wrapper for the AI settings section.
 * Reuses the dashboard layout structure.
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
export default function AISettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
