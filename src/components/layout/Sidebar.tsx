'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileEdit,
    CheckCircle,
    Download,
    GraduationCap,
    LogOut,
    ShieldAlert,
    Bot,
    FileText,
    School
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '@/lib/store';
import styles from './Sidebar.module.css';

const mainNavItems = [
    { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
    { href: '/school', label: '학교 정보', icon: School },
    { href: '/students', label: '학생 관리', icon: Users },
    { href: '/write', label: '세특 작성', icon: FileEdit },
    { href: '/review', label: '검토/확정', icon: CheckCircle },
    { href: '/export', label: '내보내기', icon: Download },
];

const toolsItems = [
    { href: '/settings', label: '기재 금지어 관리', icon: ShieldAlert },
    { href: '/settings/ai', label: '인공지능 설정', icon: Bot },
];

export function Sidebar() {
    const pathname = usePathname();
    const teacher = useAppStore((state) => state.teacher);

    return (
        <aside className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.logoSection}>
                <div className={styles.logoIcon}>
                    <GraduationCap size={24} color="white" />
                </div>
                <span className={styles.logoText}>세특 AI</span>
            </div>

            {/* Main Navigation */}
            <nav className={styles.nav}>
                {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(styles.navItem, isActive && styles.navItemActive)}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* AI Example Templates Section */}
            <div className={styles.examplesSection}>
                <Link
                    href="/examples"
                    className={clsx(styles.exampleLink, pathname === '/examples' && styles.exampleLinkActive)}
                >
                    <FileText size={18} />
                    <span>AI 예시 양식</span>
                    <span className={styles.exampleBadge}>퓨샷</span>
                </Link>
            </div>

            {/* Tools & Settings */}
            <div className={styles.toolsSection}>
                <div className={styles.toolsHeader}>TOOLS & SETTINGS</div>
                {toolsItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(styles.toolItem, isActive && styles.toolItemActive)}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
                <Link href="/" className={styles.toolItem}>
                    <LogOut size={18} />
                    <span>로그아웃</span>
                </Link>
            </div>

            {/* User Section */}
            <div className={styles.userSection}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        {teacher?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                        <p className={styles.userName}>{teacher?.name || '로그인 필요'}</p>
                        <p className={styles.userSubject}>{teacher?.subject || ''}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
