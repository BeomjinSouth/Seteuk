import { Sidebar } from '@/components/layout/Sidebar';
import { GlobalNav } from '@/components/layout/GlobalNav';
import styles from '../dashboard/layout.module.css';

/**
 * Examples Layout Component
 * 
 * @description
 * Layout wrapper for the examples section.
 * Reuses the dashboard layout structure.
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
export default function ExamplesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <GlobalNav />
            <div className={styles.layout}>
                <Sidebar />
                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </>
    );
}
