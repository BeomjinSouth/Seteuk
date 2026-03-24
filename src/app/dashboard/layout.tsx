import { Sidebar } from '@/components/layout/Sidebar';
import { GlobalNav } from '@/components/layout/GlobalNav';
import styles from './layout.module.css';

/**
 * Dashboard Layout Component
 * 
 * @description
 * Layout wrapper for the dashboard section.
 * Includes GlobalNav and Sidebar components.
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
export default function DashboardLayout({
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
