'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ScanLine,
    ClipboardList,
    HelpCircle,
    Sun,
    Moon,
    LogOut,
    ChevronDown,
    ChevronRight,
    User,
    Calendar,
    Trash2,
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '@/lib/store';
import { useTheme } from '@/hooks/useTheme';
import { Observation, Assessment } from '@/types';
import styles from './Sidebar.module.css';
import { OCRUserGuideModal } from '../OCRUserGuideModal';

// LNB for OCR section
const ocrNavItems = [
    { href: '/ocr', label: 'OCR 분석', icon: ScanLine },
];

/**
 * OCR Sidebar Component
 * 
 * @description
 * Sidebar specifically for the OCR section.
 * Displays navigation for OCR tools and a list of recent observation memos.
 * Allows quick access to view and delete observation records.
 */
export function OCRSidebar() {
    const pathname = usePathname();
    const { teacher, students, classes } = useAppStore();
    const { resolvedTheme, toggleTheme, mounted } = useTheme();

    // Observation memo states
    const [observations, setObservations] = useState<Observation[]>([]);
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);

    // Fetch observations
    useEffect(() => {
        fetchObservations();
    }, []);

    const fetchObservations = async () => {
        setIsLoading(true);
        try {
            const [obsRes, assessRes] = await Promise.all([
                fetch('/api/observations'),
                fetch('/api/assessments'),
            ]);

            const obsData = await obsRes.json();
            const assessData = await assessRes.json();

            if (obsData.success) {
                setObservations(obsData.data);
            }
            if (assessData.success) {
                setAssessments(assessData.data);
            }
        } catch (error) {
            console.error('Failed to fetch observations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get student display name
    const getStudentDisplay = (studentId: string): string => {
        const student = students.find(s => s.id === studentId);
        if (!student) return '알 수 없음';
        const studentClass = classes.find(c => c.id === student.classId);
        return `${studentClass?.grade || ''}${studentClass?.classNumber || ''} ${student.number}번 ${student.name}`;
    };

    // Get assessment title
    const getAssessmentTitle = (assessmentId?: string): string => {
        if (!assessmentId) return '';
        const assessment = assessments.find(a => a.id === assessmentId);
        return assessment?.title || '';
    };

    // Delete observation
    const handleDeleteObservation = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('이 관찰 메모를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/observations?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                setObservations(observations.filter(o => o.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    // Sort observations by date (newest first)
    const sortedObservations = [...observations].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const [isGuideOpen, setIsGuideOpen] = useState(false);

    return (
        <>
            <aside className={styles.sidebar}>
                {/* Section Label */}
                <div className={styles.sectionLabel}>
                    학습지 OCR
                </div>

                {/* Main Navigation */}
                <nav className={styles.nav}>
                    {ocrNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
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

                {/* Observation Memos Section */}
                <div className={styles.observationSection}>
                    <button
                        className={styles.observationHeader}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className={styles.observationHeaderLeft}>
                            <ClipboardList size={18} />
                            <span>관찰 메모</span>
                            <span className={styles.observationCount}>{observations.length}</span>
                        </div>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {isExpanded && (
                        <div className={styles.observationList}>
                            {isLoading ? (
                                <div className={styles.observationLoading}>로딩 중...</div>
                            ) : sortedObservations.length === 0 ? (
                                <div className={styles.observationEmpty}>
                                    <p>저장된 메모가 없습니다</p>
                                    <p className={styles.observationEmptyHint}>
                                        OCR 분석 후 저장하세요
                                    </p>
                                </div>
                            ) : (
                                sortedObservations.slice(0, 10).map((obs) => (
                                    <div
                                        key={obs.id}
                                        className={clsx(
                                            styles.observationItem,
                                            selectedObservation?.id === obs.id && styles.observationItemActive
                                        )}
                                        onClick={() => setSelectedObservation(
                                            selectedObservation?.id === obs.id ? null : obs
                                        )}
                                    >
                                        <div className={styles.observationItemHeader}>
                                            <span className={styles.observationStudent}>
                                                <User size={12} />
                                                {getStudentDisplay(obs.studentId)}
                                            </span>
                                            <button
                                                className={styles.observationDeleteBtn}
                                                onClick={(e) => handleDeleteObservation(obs.id, e)}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>

                                        {obs.assessmentId && (
                                            <span className={styles.observationAssessment}>
                                                {getAssessmentTitle(obs.assessmentId)}
                                            </span>
                                        )}

                                        <p className={styles.observationMemo}>
                                            {obs.memo.slice(0, 50)}{obs.memo.length > 50 ? '...' : ''}
                                        </p>

                                        <div className={styles.observationMeta}>
                                            <span className={styles.observationDate}>
                                                <Calendar size={10} />
                                                {obs.date}
                                            </span>
                                            <span className={`${styles.observationType} ${obs.sourceType === 'ocr' ? styles.ocrType : ''}`}>
                                                {obs.sourceType === 'ocr' ? 'OCR' : '수동'}
                                            </span>
                                        </div>

                                        {/* Expanded detail */}
                                        {selectedObservation?.id === obs.id && (
                                            <div className={styles.observationDetail}>
                                                <div className={styles.observationDetailSection}>
                                                    <strong>전체 메모:</strong>
                                                    <p>{obs.memo}</p>
                                                </div>
                                                {obs.tags.length > 0 && (
                                                    <div className={styles.observationDetailSection}>
                                                        <strong>태그:</strong>
                                                        <div className={styles.observationTags}>
                                                            {obs.tags.map((tag, i) => (
                                                                <span key={i} className={styles.observationTag}>{tag}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                            {observations.length > 10 && (
                                <div className={styles.observationMore}>
                                    +{observations.length - 10}개 더 보기
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Tools & Settings */}
                <div className={styles.toolsSection}>
                    <div className={styles.toolsHeader}>도움말</div>
                    {/* Changed from Link to button to open modal */}
                    <button
                        onClick={() => setIsGuideOpen(true)}
                        className={clsx(styles.toolItem, styles.toolButton)}
                        type="button"
                    >
                        <HelpCircle size={18} />
                        <span>사용 가이드</span>
                    </button>
                    <Link href="/" className={styles.toolItem}>
                        <LogOut size={18} />
                        <span>로그아웃</span>
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        className={styles.themeToggle}
                        onClick={toggleTheme}
                        title={mounted ? (resolvedTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환') : '테마 전환'}
                        aria-label="Toggle theme"
                        suppressHydrationWarning
                    >
                        {mounted && resolvedTheme === 'dark' ? (
                            <Sun size={18} />
                        ) : (
                            <Moon size={18} />
                        )}
                        <span suppressHydrationWarning>{mounted && resolvedTheme === 'dark' ? '라이트 모드' : '다크 모드'}</span>
                    </button>
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

            <OCRUserGuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
            />
        </>
    );
}
