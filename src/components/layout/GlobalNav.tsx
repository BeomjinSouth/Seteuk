'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, ScanLine, Sparkles, ClipboardCheck, ClipboardList, School } from 'lucide-react';
import clsx from 'clsx';
import { SharedRosterSync } from '@/components/providers/SharedRosterSync';
import styles from './GlobalNav.module.css';

const mainSections: Array<{
    href: string;
    label: string;
    icon: typeof School;
    description: string;
    hidden?: boolean;
}> = [
    {
        href: '/dashboard',
        label: '학교 정보',
        icon: School,
        description: '대시보드, 학교·학생 정보'
    },
    {
        href: '/observation-board',
        label: '학생 관찰 기록',
        icon: ClipboardList,
        description: '학생 카드 보드, 관찰 메모'
    },
    {
        href: '/write',
        label: 'AI 세특 생성',
        icon: Sparkles,
        description: '세특 작성, 생기부 상담 점검'
    },
    {
        href: '/eval-check',
        label: '평가 점검',
        icon: ClipboardCheck,
        description: '시험지 오류 점검, 수정 제안'
    },
    {
        href: '/ocr',
        label: '학습지 OCR',
        icon: ScanLine,
        description: '손글씨·그림 인식, 관찰 메모',
        // Keep the route available, but hide the tab from the main navigation for now.
        hidden: true
    },
];

/**
 * Global Navigation Component
 * 
 * @description
 * Top navigation bar visible across all authenticated pages.
 * Provides access to the visible top-level sections in the authenticated workspace.
 */
export function GlobalNav() {
    const pathname = usePathname();

    // Helper to determine if a section is active
    const isActive = (href: string) => {
        if (href === '/observation-board') {
            return pathname.startsWith('/observation-board') || pathname.startsWith('/observations');
        }
        if (href === '/ocr') return pathname.startsWith('/ocr');
        if (href === '/eval-check') return pathname.startsWith('/eval-check');
        if (href === '/dashboard') return pathname.startsWith('/dashboard') || pathname.startsWith('/school') || pathname.startsWith('/students');
        if (href === '/write') return (
            pathname.startsWith('/write') ||
            pathname.startsWith('/counsel-chat') ||
            pathname.startsWith('/record-review') ||
            pathname.startsWith('/review') ||
            pathname.startsWith('/export') ||
            pathname.startsWith('/examples') ||
            pathname.startsWith('/settings') ||
            pathname.startsWith('/search-inspector')
        );
        return false;
    };

    return (
        <>
            <SharedRosterSync />
            <header className={styles.gnb}>
                <div className={styles.gnbInner}>
                    {/* Logo */}
                    <Link href="/dashboard" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <GraduationCap size={20} color="white" />
                        </div>
                        <span className={styles.logoText}>성호 AI</span>
                    </Link>

                    {/* Main Navigation */}
                    <nav className={styles.mainNav}>
                        {mainSections.filter((section) => !section.hidden).map((section) => {
                            const Icon = section.icon;
                            const active = isActive(section.href);

                            return (
                                <Link
                                    key={section.href}
                                    href={section.href}
                                    className={clsx(
                                        styles.navItem,
                                        active && styles.navItemActive
                                    )}
                                >
                                    <Icon size={18} />
                                    <span className={styles.navLabel}>{section.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Spacer */}
                    <div className={styles.spacer} />
                </div>
            </header>
        </>
    );
}
