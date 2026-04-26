'use client';

import { useAppStore, isAdmin } from '@/lib/store';
import { motion } from 'framer-motion';
import {
    Users,
    FileText,
    CheckCircle2,
    AlertCircle,
    Plus,
    TrendingUp,
    Clock,
    Bell,
    Check,
    X,
    Shield,
    FlaskConical,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { getStudentsInTeachingClass, getTeacherClasses } from '@/lib/teacher-context';
import styles from './page.module.css';

/**
 * Dashboard Page Component
 * 
 * @description
 * Main dashboard view showing overview statistics and class progress.
 * 
 * Features:
 * - Teacher greeting and info
 * - Statistics cards (Total students, Drafts, Pending reviews, Confirmed)
 * - Admin notification center for setting approval requests
 * - Class list overview with progress bars
 */
export default function DashboardPage() {
    const {
        teacher,
        classes,
        students,
        records,
        adminNotifications,
        updateNotificationStatus,
        seedDemoWorkspace,
    } = useAppStore();

    const isAdminUser = isAdmin(teacher);
    const pendingNotifications = adminNotifications.filter(n => n.status === 'pending');
    const teacherClasses = getTeacherClasses(classes, teacher);

    const teacherStudents = teacherClasses.reduce<typeof students>((acc, cls) => {
        getStudentsInTeachingClass(students, cls).forEach((student) => {
            if (!acc.some((item) => item.id === student.id)) {
                acc.push(student);
            }
        });
        return acc;
    }, []);
    const teacherRecords = records.filter((record) =>
        teacher?.teacherKey ? record.teacherKey === teacher.teacherKey : true
    );

    const totalStudents = teacherStudents.length;
    const draftCount = teacherRecords.filter(r => r.status === 'draft').length;
    const confirmedCount = teacherRecords.filter(r => r.status === 'confirmed').length;
    const pendingReviewCount = teacherRecords.filter(r => r.status === 'checked').length;

    // Handle notification actions
    const handleApprove = (id: string, newValue: string) => {
        // For setting requests, save the new value
        const notification = adminNotifications.find(n => n.id === id);
        if (notification?.type === 'setting_request') {
            localStorage.setItem('ai_system_prompt', newValue);
        }
        updateNotificationStatus(id, 'approved');
    };

    const handleReject = (id: string) => {
        updateNotificationStatus(id, 'rejected');
    };

    const statCards = [
        {
            label: '전체 학생',
            value: totalStudents,
            icon: Users,
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
            label: '초안 작성',
            value: draftCount,
            icon: FileText,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)'
        },
        {
            label: '검토 대기',
            value: pendingReviewCount,
            icon: Clock,
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.1)'
        },
        {
            label: '확정 완료',
            value: confirmedCount,
            icon: CheckCircle2,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)'
        },
    ];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title} suppressHydrationWarning>
                        안녕하세요, {teacher?.name || '선생님'}!
                        {isAdminUser && <span className={styles.adminBadge}><Shield size={14} /> 관리자</span>}
                    </h1>
                    <p className={styles.subtitle} suppressHydrationWarning>
                        {teacher?.school} · {teacher?.subject} 세특 작업 현황
                    </p>
                </div>
                <Link href="/students">
                    <Button>
                        <Plus size={18} /> 학생 추가
                    </Button>
                </Link>
            </header>

            {/* Admin Notifications */}
            {isAdminUser && pendingNotifications.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.notificationSection}
                >
                    <div className={styles.notificationHeader}>
                        <Bell size={20} />
                        <h2>수정 요청 알림 ({pendingNotifications.length})</h2>
                    </div>
                    <div className={styles.notificationList}>
                        {pendingNotifications.map(notif => (
                            <div key={notif.id} className={styles.notificationCard}>
                                <div className={styles.notificationInfo}>
                                    <div className={styles.requesterInfo}>
                                        <strong>{notif.requester.name}</strong>
                                        <span>{notif.requester.school} · {notif.requester.subject}</span>
                                    </div>
                                    <p className={styles.notificationContent}>{notif.content}</p>
                                    {notif.type === 'setting_request' && (
                                        <details className={styles.notificationDetails}>
                                            <summary>변경 내용 보기</summary>
                                            <div className={styles.diffView}>
                                                <pre>{notif.newValue.slice(0, 300)}...</pre>
                                            </div>
                                        </details>
                                    )}
                                </div>
                                <div className={styles.notificationActions}>
                                    <Button
                                        size="sm"
                                        onClick={() => handleApprove(notif.id, notif.newValue)}
                                    >
                                        <Check size={14} /> 승인
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleReject(notif.id)}
                                    >
                                        <X size={14} /> 거절
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={styles.statCard}
                        >
                            <div
                                className={styles.statIcon}
                                style={{ background: stat.bgColor, color: stat.color }}
                            >
                                <Icon size={24} />
                            </div>
                            <div className={styles.statContent}>
                                <p className={styles.statValue}>{stat.value}</p>
                                <p className={styles.statLabel}>{stat.label}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Class List */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>내 반 목록</h2>
                    <Link href="/students" className={styles.sectionLink}>
                        전체 보기 →
                    </Link>
                </div>

                {teacherClasses.length === 0 ? (
                    <div className={styles.emptyState}>
                        <AlertCircle size={48} className={styles.emptyIcon} />
                        <h3>등록된 반이 없습니다</h3>
                        <p>학생 관리에서 명부를 업로드하고 학급을 연결하세요.</p>
                        <div className={styles.emptyActions}>
                            <Link href="/students">
                                <Button className="mt-4">
                                    <Plus size={18} /> 학생 명부 등록
                                </Button>
                            </Link>
                            <Button
                                variant="secondary"
                                className="mt-4"
                                onClick={() => {
                                    seedDemoWorkspace();
                                    window.location.href = '/observation-board-2';
                                }}
                            >
                                <FlaskConical size={18} /> 데모 작업공간 채우기
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.classGrid}>
                        {teacherClasses.map((cls, i) => {
                            const classStudents = getStudentsInTeachingClass(students, cls);
                            const classRecords = teacherRecords.filter(r => r.classId === cls.id);
                            const progress = classStudents.length > 0
                                ? Math.round((classRecords.filter(r => r.status === 'confirmed').length / classStudents.length) * 100)
                                : 0;

                            return (
                                <motion.div
                                    key={cls.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={styles.classCard}
                                >
                                    <div className={styles.classHeader}>
                                        <h3>{cls.grade}학년 {cls.classNumber}반</h3>
                                        <span className={styles.classBadge}>{cls.subjectName}</span>
                                    </div>
                                    <div className={styles.classStats}>
                                        <span><Users size={14} /> {classStudents.length}명</span>
                                        <span><TrendingUp size={14} /> {progress}% 완료</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <Link href={`/write?classId=${cls.id}`}>
                                        <Button variant="secondary" className="w-full mt-4">
                                            세특 작성하기
                                        </Button>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </section>

        </div>
    );
}
