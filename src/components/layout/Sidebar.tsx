'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    CheckCircle,
    Download,
    LogOut,
    ShieldAlert,
    Bot,
    FileText,
    School,
    Sun,
    Moon,
    ClipboardCheck,
    ClipboardList,
    Database,
    Handshake,
    MessageSquareQuote,
    Sparkles
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '@/hooks/useTheme';
import styles from './Sidebar.module.css';

// LNB for School Info section
const schoolNavItems = [
    { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
    { href: '/school', label: '학교 정보', icon: School },
    { href: '/students', label: '학생 관리', icon: Users },
];

const observationNavItems = [
    { href: '/observation-board', label: '학생 카드 보드', icon: Users },
    { href: '/observations', label: '관찰 메모', icon: ClipboardList },
];

const observation2NavItems = [
    { href: '/observation-board-2', label: '멘토·멘티 활동판', icon: Handshake },
];

const studentDataNavItems = [
    { href: '/student-data', label: '학생 데이터', icon: Database },
];

// LNB for AI 세특 생성 section
const seteukNavItems = [
    { href: '/write', label: '세특 작성', icon: Sparkles },
    { href: '/counsel-chat', label: '생기부 상담 점검', icon: MessageSquareQuote },
    { href: '/review', label: '검토/확정', icon: CheckCircle },
    { href: '/export', label: '내보내기', icon: Download },
];

// LNB for Eval Check section
const evalCheckNavItems = [
    { href: '/eval-check', label: '점검 홈', icon: ClipboardCheck },
    { href: '/eval-check?tab=settings', label: '설정', icon: ShieldAlert },
];

const toolsItems = [
    { href: '/settings', label: '기재 금지어 관리', icon: ShieldAlert },
    { href: '/settings/ai', label: '인공지능 설정', icon: Bot },
];

/**
 * Main Sidebar Component
 * 
 * @description
 * Primary sidebar navigation for the dashboard and general features.
 * Includes links to major features like Dashboard, School Info, Student Mgmt, Writing, Review.
 * Also contains "AI Example Templates" and tools links.
 */
export function Sidebar() {
    const pathname = usePathname();
    const { resolvedTheme, toggleTheme, mounted } = useTheme();
    const activeEvalTab = typeof window === 'undefined'
        ? 'settings'
        : new URLSearchParams(window.location.search).get('tab') ?? 'settings';
    const matchesRoute = (route: string) => pathname === route || pathname.startsWith(`${route}/`);

    const isSchoolSection = matchesRoute('/dashboard') || matchesRoute('/school') || matchesRoute('/students');
    const isObservationSection = matchesRoute('/observation-board') || matchesRoute('/observations');
    const isObservation2Section = matchesRoute('/observation-board-2');
    const isStudentDataSection = matchesRoute('/student-data');
    const isEvalCheckSection = matchesRoute('/eval-check');

    let activeNavItems;
    let sectionLabel;

    if (isSchoolSection) {
        activeNavItems = schoolNavItems;
        sectionLabel = '학교 정보';
    } else if (isObservationSection) {
        activeNavItems = observationNavItems;
        sectionLabel = '학생 관찰 기록';
    } else if (isObservation2Section) {
        activeNavItems = observation2NavItems;
        sectionLabel = '학생 기록 관찰 2';
    } else if (isStudentDataSection) {
        activeNavItems = studentDataNavItems;
        sectionLabel = '학생 데이터';
    } else if (isEvalCheckSection) {
        activeNavItems = evalCheckNavItems;
        sectionLabel = '평가 점검';
    } else {
        activeNavItems = seteukNavItems;
        sectionLabel = 'AI 세특 생성';
    }

    return (
        <aside className={styles.sidebar}>
            {/* Section Label */}
            <div className={styles.sectionLabel}>
                {sectionLabel}
            </div>

            {/* Main Navigation */}
            <nav className={styles.nav}>
                {activeNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === '/counsel-chat'
                        ? pathname.startsWith('/counsel-chat') || pathname.startsWith('/record-review')
                        : item.href === '/eval-check'
                            ? pathname === '/eval-check' && activeEvalTab !== 'settings'
                            : item.href === '/eval-check?tab=settings'
                                ? pathname === '/eval-check' && activeEvalTab === 'settings'
                        : pathname === item.href || pathname.startsWith(item.href + '/');
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

            {/* Show examples only for Seteuk section */}
            {!isSchoolSection && !isObservationSection && !isObservation2Section && !isStudentDataSection && !isEvalCheckSection && (
                <div className={styles.examplesSection}>
                    <Link
                        href="/examples"
                        className={clsx(styles.exampleLink, pathname === '/examples' && styles.exampleLinkActive)}
                    >
                        <FileText size={18} />
                        <span>AI 예시 양식</span>
                        <span className={styles.exampleBadge}>NEW</span>
                    </Link>
                    {/* Moved Tools Items */}
                    <div className={styles.toolList}>
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
                    </div>
                </div>
            )}

            {/* Tools & Settings */}
            <div className={styles.toolsSection}>
                <div className={styles.toolsHeader}>SETTINGS</div>
                <Link href="/" className={styles.toolItem}>
                    <LogOut size={18} />
                    <span>로그아웃</span>
                </Link>

                {/* Theme Toggle */}
                <button
                    className={styles.themeToggle}
                    onClick={toggleTheme}
                    title={mounted ? (resolvedTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환') : '다크 모드로 전환'}
                    aria-label="Toggle theme"
                    suppressHydrationWarning
                >
                    {mounted && resolvedTheme === 'dark' ? (
                        <Sun size={18} />
                    ) : (
                        <Moon size={18} />
                    )}
                    <span>{mounted && resolvedTheme === 'dark' ? '라이트 모드' : '다크 모드'}</span>
                </button>
            </div>

            {!isSchoolSection && !isObservationSection && !isObservation2Section && !isStudentDataSection && !isEvalCheckSection && (
                <Link href="/examples" className={styles.guideCard}>
                    <div className={styles.guideText}>
                        <strong>AI 세특 생성<br />가이드</strong>
                        <span>더 똑똑하게 활용하는 방법</span>
                    </div>
                    <div className={styles.guideArt} aria-hidden="true">
                        <span className={styles.guideSheetOne} />
                        <span className={styles.guideSheetTwo} />
                    </div>
                    <span className={styles.guideArrow}>›</span>
                </Link>
            )}
        </aside>
    );
}
