import { GlobalNav } from '@/components/layout/GlobalNav';
import { Sidebar } from '@/components/layout/Sidebar';
import styles from '@/app/dashboard/layout.module.css';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <>
            <GlobalNav />
            <div className={styles.layout}>
                <Sidebar />
                <main className={styles.main}>{children}</main>
            </div>
        </>
    );
}
