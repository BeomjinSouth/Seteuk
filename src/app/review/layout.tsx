import { Sidebar } from '@/components/layout/Sidebar';
import styles from '../dashboard/layout.module.css';

export default function ReviewLayout({
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
