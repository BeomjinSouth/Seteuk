'use client';

import { useRouter } from 'next/navigation';
import type { DragEvent, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BarChart3,
    Bell,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Circle,
    ClipboardList,
    Cloud,
    Cookie,
    Eye,
    Handshake,
    Megaphone,
    MinusCircle,
    Pencil,
    Plus,
    RotateCcw,
    Save,
    Search,
    Settings,
    Sparkles,
    Star,
    Trash2,
    Triangle,
    UserRound,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import { GroupSurveyDashboard } from '@/components/group-survey/GroupSurveyDashboard';
import { SharedRosterSync } from '@/components/providers/SharedRosterSync';
import { useAppStore } from '@/lib/store';
import { isAuthorizedSeonghoTeacher } from '@/lib/seongho-auth';
import {
    DEFAULT_OBSERVATION_BOARD_ACTIVITY_SESSIONS as defaultActivitySessions,
    areObservationBoardMentorAssignmentsEqual,
    getObservationBoardAssignmentMembers,
    getObservationBoardMarkStorageKey,
    getObservationBoardMentorAssignmentStorageKey,
    getObservationBoardMentorAssignmentSnapshotStorageKey,
    getObservationBoardSessionStorageKey,
    normalizeObservationBoardActivitySessions,
    normalizeObservationBoardMentorAssignmentSnapshotsByClass,
    normalizeObservationBoardMentorAssignmentsByClass,
    normalizeObservationBoardMarks,
    type ObservationBoardActivitySession,
    type ObservationBoardGroupMember,
    type ObservationBoardMarkState,
    type ObservationBoardMentorAssignment,
    type ObservationBoardMentorAssignmentSnapshotsByClass,
    type ObservationBoardMentorAssignmentsByClass,
    type ObservationBoardMentorRole,
} from '@/lib/observation-board-ai-context';
import { getStudentsInTeachingClass, getTeacherClasses } from '@/lib/teacher-context';
import { ClassGroup, Observation, Student } from '@/types';
import styles from './page.module.css';

type MarkState = ObservationBoardMarkState;
type BoardMode = 'mentor' | 'growth' | 'stats' | 'grouping' | 'notice' | 'settings' | 'records';
type MentorActivityTab = 'groups' | 'records';
type VisibleRosterCount = number | 'all';
type ActivitySession = ObservationBoardActivitySession;

interface ObservationDraftRow {
    lessonTopic: string;
    tags: string[];
    memo: string;
}

interface ObservationCardStats {
    count: number;
    cookieCount: number;
    latest?: Observation;
}

interface MarkSummary {
    participated: number;
    excellent: number;
}

interface NoticeItem {
    id: string;
    title: string;
    body: string;
    dueDate: string;
    completed: boolean;
    createdAt: string;
}

interface ObservationBoardRemoteState {
    activitySessions: ActivitySession[];
    marks: Record<string, MarkState>;
    mentorAssignmentsByClass: ObservationBoardMentorAssignmentsByClass;
    mentorAssignmentSnapshotsByClass: ObservationBoardMentorAssignmentSnapshotsByClass;
    notices: NoticeItem[];
}

type GrowthTimelineItem = {
    id: string;
    studentId: string;
    type: 'observation' | 'note' | 'grade' | 'mentor_match';
    title: string;
    body: string;
    date: string;
    meta: string;
};

type MentorRole = ObservationBoardMentorRole;
type MentorGroupAssignment = ObservationBoardMentorAssignment;

interface MentorGroupMemberView {
    student: Student;
    role: MentorRole;
    order: number;
}

interface MentorGroupView {
    id: string;
    title: string;
    mentor?: Student;
    mentee?: Student;
    members: MentorGroupMemberView[];
}

const visibleRosterCountOptions: VisibleRosterCount[] = ['all', 24, 16, 12, 8, 6];
const maxMentorGroupMembers = 4;

const markCookieValues: Record<MarkState, number> = {
    none: 0,
    participated: 1,
    excellent: 2,
};

const markCookieLabels: Record<MarkState, string> = {
    none: '활동하지 않음',
    participated: '참여함',
    excellent: '매우 잘함',
};

const observationTagOptions = [
    '참여',
    '발표',
    '협력',
    '성장',
    '질문',
    '탐구',
    '자기주도',
    '배려',
    '문제해결',
    '의사소통',
];

const today = () => new Date().toISOString().split('T')[0];

function createEmptyDraft(): ObservationDraftRow {
    return {
        lessonTopic: '',
        tags: [],
        memo: '',
    };
}

function formatStudentNumber(number: number) {
    return String(number).padStart(2, '0');
}

function getGrowthCookieCount(observation: Observation) {
    return observation.tags.reduce((sum, tag) => {
        const match = tag.match(/쿠키\s*(\d+)개/);
        if (!match) return sum;
        return sum + Number(match[1]);
    }, 0);
}

function getDefaultMark(): MarkState {
    return 'none';
}

function getNextMark(mark: MarkState): MarkState {
    if (mark === 'none') return 'participated';
    if (mark === 'participated') return 'excellent';
    return 'none';
}

function getCookieDelta(previousMark: MarkState, nextMark: MarkState) {
    return markCookieValues[nextMark] - markCookieValues[previousMark];
}

function getObservationTimestamp(observation?: Observation) {
    if (!observation) return 0;
    const value = observation.date || observation.createdAt;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatShortDate(value?: string) {
    if (!value) return '기록 전';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function formatFullDate(value?: string) {
    if (!value) return '날짜 없음';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function getNoticeStorageKey(teacherKey?: string) {
    return `observation-board-2-notices:${teacherKey || 'guest'}`;
}

function getBoardModeTitle(mode: BoardMode) {
    const titles: Record<BoardMode, string> = {
        mentor: '학생 관찰 기록',
        growth: '성장 기록',
        stats: '통계 보기',
        grouping: '모둠 편성',
        notice: '알림장',
        settings: '설정',
        records: '관찰 메모 작성',
    };
    return titles[mode];
}

function buildMentorAssignments(studentsForBoard: Student[]): MentorGroupAssignment[] {
    const rows = studentsForBoard;
    if (rows.length === 0) return [];

    const groupCount = Math.max(3, Math.ceil(rows.length / 2));

    return Array.from({ length: groupCount }, (_, groupIndex) => ({
        id: `group-${groupIndex + 1}`,
        title: `${groupIndex + 1}조`,
        mentorId: rows[groupIndex * 2]?.id,
        menteeId: rows[groupIndex * 2 + 1]?.id,
        members: [
            rows[groupIndex * 2] ? {
                studentId: rows[groupIndex * 2].id,
                role: 'mentor',
                order: 0,
            } : null,
            rows[groupIndex * 2 + 1] ? {
                studentId: rows[groupIndex * 2 + 1].id,
                role: 'mentee',
                order: 1,
            } : null,
        ].filter(Boolean) as ObservationBoardGroupMember[],
    }));
}

function cloneMentorAssignments(assignments: MentorGroupAssignment[]): MentorGroupAssignment[] {
    return assignments.map((assignment) => ({
        ...assignment,
        members: getObservationBoardAssignmentMembers(assignment),
    }));
}

function getAssignmentStudentIds(assignment: MentorGroupAssignment): string[] {
    return getObservationBoardAssignmentMembers(assignment).map((member) => member.studentId);
}

function getLegacySlotIds(members: ObservationBoardGroupMember[]) {
    const mentorId = members.find((member) => member.role === 'mentor')?.studentId
        ?? members[0]?.studentId;
    const menteeId = members.find((member) => member.role === 'mentee')?.studentId
        ?? members.find((member) => member.studentId !== mentorId)?.studentId;

    return { mentorId, menteeId };
}

function getDefaultGroupRoleByIndex(index: number): MentorRole {
    return index === 0 ? 'mentor' : 'mentee';
}

function normalizeGroupMembers(members: ObservationBoardGroupMember[]) {
    return members
        .filter((member) => member.studentId)
        .slice(0, maxMentorGroupMembers)
        .map((member, index) => ({
            studentId: member.studentId,
            role: member.role || getDefaultGroupRoleByIndex(index),
            order: index,
        }));
}

function withGroupMembers(
    assignment: MentorGroupAssignment,
    members: ObservationBoardGroupMember[]
): MentorGroupAssignment {
    const normalizedMembers = normalizeGroupMembers(members);
    const legacySlots = getLegacySlotIds(normalizedMembers);

    return {
        ...assignment,
        mentorId: legacySlots.mentorId,
        menteeId: legacySlots.menteeId,
        members: normalizedMembers,
    };
}

function getRoleLabel(role: MentorRole) {
    if (role === 'mentor') return '멘토';
    if (role === 'mentee') return '멘티';
    return '모둠원';
}

const mentorRoleOptions: { value: MentorRole; label: string }[] = [
    { value: 'mentor', label: '멘토' },
    { value: 'mentee', label: '멘티' },
    { value: 'member', label: '모둠원' },
];

function hasClassMentorAssignments(
    assignmentsByClass: ObservationBoardMentorAssignmentsByClass,
    classId: string
) {
    return Object.prototype.hasOwnProperty.call(assignmentsByClass, classId);
}

function isActiveMark(mark?: MarkState) {
    return mark === 'participated' || mark === 'excellent';
}

function getVisibleRosterStudents<T>(studentsForBoard: T[], visibleRosterCount: VisibleRosterCount) {
    return visibleRosterCount === 'all'
        ? studentsForBoard
        : studentsForBoard.slice(0, visibleRosterCount);
}

function sortStudents(a: Student, b: Student) {
    return (a.grade ?? 0) - (b.grade ?? 0)
        || (a.classNumber ?? 0) - (b.classNumber ?? 0)
        || a.number - b.number
        || a.name.localeCompare(b.name);
}

export default function ObservationBoard2Page() {
    const router = useRouter();
    const { classes, students, teacher, logout } = useAppStore();
    const [isStoreReady, setIsStoreReady] = useState(false);
    const [activeMode, setActiveMode] = useState<BoardMode>('mentor');
    const [selectedClassId, setSelectedClassId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [marks, setMarks] = useState<Record<string, MarkState>>({});
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
    const [observations, setObservations] = useState<Observation[]>([]);
    const [isLoadingObservations, setIsLoadingObservations] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [commonDate, setCommonDate] = useState(today);
    const [commonLessonTopic, setCommonLessonTopic] = useState('');
    const [commonTags, setCommonTags] = useState<string[]>([]);
    const [customTagInput, setCustomTagInput] = useState('');
    const [customTagOptions, setCustomTagOptions] = useState<string[]>([]);
    const [studentDrafts, setStudentDrafts] = useState<Record<string, ObservationDraftRow>>({});
    const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
    const [visibleRosterCount, setVisibleRosterCount] = useState<VisibleRosterCount>('all');
    const [noticeDraft, setNoticeDraft] = useState({ title: '', body: '', dueDate: today() });
    const [notices, setNotices] = useState<NoticeItem[]>([]);
    const [loadedNoticeKey, setLoadedNoticeKey] = useState('');
    const [mentorAssignments, setMentorAssignments] = useState<MentorGroupAssignment[]>([]);
    const [editingMentorGroupId, setEditingMentorGroupId] = useState<string | null>(null);
    const [editingMentorGroupMembers, setEditingMentorGroupMembers] = useState<ObservationBoardGroupMember[]>([]);
    const [mentorAssignmentsByClass, setMentorAssignmentsByClass] = useState<ObservationBoardMentorAssignmentsByClass>({});
    const [mentorAssignmentSnapshotsByClass, setMentorAssignmentSnapshotsByClass] =
        useState<ObservationBoardMentorAssignmentSnapshotsByClass>({});
    const [activitySessions, setActivitySessions] = useState<ActivitySession[]>(defaultActivitySessions);
    const [loadedSessionKey, setLoadedSessionKey] = useState('');
    const [loadedMarkKey, setLoadedMarkKey] = useState('');
    const [loadedMentorAssignmentKey, setLoadedMentorAssignmentKey] = useState('');
    const [loadedMentorAssignmentSnapshotKey, setLoadedMentorAssignmentSnapshotKey] = useState('');
    const [isRemoteBoardLoaded, setIsRemoteBoardLoaded] = useState(false);
    const lastRemoteBoardPayloadRef = useRef('');

    useEffect(() => {
        setIsStoreReady(useAppStore.persist.hasHydrated());
        return useAppStore.persist.onFinishHydration(() => setIsStoreReady(true));
    }, []);

    useEffect(() => {
        if (!isStoreReady) return;

        if (!teacher) {
            router.replace('/');
            return;
        }

        if (!isAuthorizedSeonghoTeacher(teacher)) {
            logout();
            router.replace('/');
        }

        const controller = new AbortController();
        const verifyServerSession = async () => {
            try {
                const response = await fetch('/api/auth/session', {
                    cache: 'no-store',
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error('Session check failed');

                const payload = await response.json() as { teacher?: { teacherKey?: string } | null };
                if (payload.teacher?.teacherKey !== teacher.teacherKey) {
                    logout();
                    router.replace('/');
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Server session check failed:', error);
                    logout();
                    router.replace('/');
                }
            }
        };

        void verifyServerSession();

        return () => controller.abort();
    }, [isStoreReady, logout, router, teacher]);

    const teacherClasses = useMemo(
        () => getTeacherClasses(classes, teacher),
        [classes, teacher]
    );

    const teacherStudents = useMemo(() => {
        const map = new Map<string, Student>();
        teacherClasses.forEach((cls) => {
            getStudentsInTeachingClass(students, cls).forEach((student) => {
                map.set(student.id, student);
            });
        });

        return Array.from(map.values()).sort(sortStudents);
    }, [students, teacherClasses]);

    const studentLookup = useMemo(() => {
        const map = new Map<string, Student>();
        [...students, ...teacherStudents].forEach((student) => {
            map.set(student.id, student);
        });
        return map;
    }, [students, teacherStudents]);

    const selectedClass = teacherClasses.find((cls) => cls.id === selectedClassId);

    const boardStudents = useMemo(() => {
        const classStudents = selectedClass
            ? getStudentsInTeachingClass(students, selectedClass)
            : teacherStudents;

        return classStudents;
    }, [selectedClass, students, teacherStudents]);

    const sortedBoardStudents = useMemo(
        () => [...boardStudents].sort(sortStudents),
        [boardStudents]
    );

    const filteredStudents = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        return sortedBoardStudents
            .filter((student) => !normalizedQuery || student.name.toLowerCase().includes(normalizedQuery))
    }, [searchQuery, sortedBoardStudents]);

    const featuredStudents = useMemo(
        () => getVisibleRosterStudents(sortedBoardStudents, visibleRosterCount),
        [sortedBoardStudents, visibleRosterCount]
    );

    const defaultMentorAssignments = useMemo(
        () => buildMentorAssignments(featuredStudents),
        [featuredStudents]
    );

    const currentMentorAssignments = mentorAssignments;

    const mentorGroups = useMemo<MentorGroupView[]>(() => {
        return currentMentorAssignments.map((group) => ({
            id: group.id,
            title: group.title,
            mentor: group.mentorId ? studentLookup.get(group.mentorId) : undefined,
            mentee: group.menteeId ? studentLookup.get(group.menteeId) : undefined,
            members: getObservationBoardAssignmentMembers(group)
                .map((member) => {
                    const student = studentLookup.get(member.studentId);
                    return student ? {
                        student,
                        role: member.role,
                        order: member.order,
                    } : null;
                })
                .filter(Boolean) as MentorGroupMemberView[],
        }));
    }, [currentMentorAssignments, studentLookup]);

    const selectedStudents = useMemo(
        () => filteredStudents.filter((student) => selectedStudentIds.has(student.id)),
        [filteredStudents, selectedStudentIds]
    );

    const activeStudentIds = useMemo(
        () => new Set(boardStudents.map((student) => student.id)),
        [boardStudents]
    );

    const availableTagOptions = useMemo(
        () => Array.from(new Set([...observationTagOptions, ...customTagOptions])),
        [customTagOptions]
    );

    const scopedObservations = useMemo(
        () => observations.filter((observation) =>
            (!teacher?.teacherKey || !observation.teacherKey || observation.teacherKey === teacher.teacherKey)
            && activeStudentIds.has(observation.studentId)
            && (selectedClassId === 'all' || observation.classId === selectedClassId)
        ),
        [activeStudentIds, observations, selectedClassId, teacher]
    );

    const observationStatsByStudent = useMemo(() => {
        const stats = new Map<string, ObservationCardStats>();

        scopedObservations.forEach((observation) => {
            const current = stats.get(observation.studentId) ?? { count: 0, cookieCount: 0 };
            stats.set(observation.studentId, {
                count: current.count + 1,
                cookieCount: current.cookieCount + getGrowthCookieCount(observation),
                latest: getObservationTimestamp(current.latest) > getObservationTimestamp(observation)
                    ? current.latest
                    : observation,
            });
        });

        return stats;
    }, [scopedObservations]);

    const filteredObservations = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return scopedObservations
            .filter((observation) => {
                if (!normalizedQuery) return true;
                const student = studentLookup.get(observation.studentId);
                return [
                    student?.name,
                    observation.lessonTopic,
                    observation.memo,
                    observation.tags.join(' '),
                ].filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery);
            })
            .sort((a, b) => getObservationTimestamp(b) - getObservationTimestamp(a));
    }, [scopedObservations, searchQuery, studentLookup]);

    const markStatsByStudent = useMemo(() => {
        const stats = new Map<string, MarkSummary>();

        sortedBoardStudents.forEach((student) => {
            const summary = { participated: 0, excellent: 0 };
            activitySessions.forEach((session) => {
                const mark = marks[`${student.id}:${session.id}`] ?? getDefaultMark();
                if (mark === 'participated') summary.participated += 1;
                if (mark === 'excellent') summary.excellent += 1;
            });
            stats.set(student.id, summary);
        });

        return stats;
    }, [activitySessions, marks, sortedBoardStudents]);

    const totalExcellent = Array.from(markStatsByStudent.values()).reduce((sum, summary) => (
        sum + summary.excellent
    ), 0);

    const growthTimeline = useMemo<GrowthTimelineItem[]>(() => {
        const fromObservations = filteredObservations.map((observation) => ({
            id: `observation-${observation.id}`,
            studentId: observation.studentId,
            type: 'observation' as const,
            title: observation.lessonTopic || '관찰 메모',
            body: observation.memo,
            date: observation.date || observation.createdAt,
            meta: observation.tags.length > 0 ? observation.tags.slice(0, 3).join(', ') : '수업 관찰',
        }));

        const normalizedQuery = searchQuery.trim().toLowerCase();

        return fromObservations
            .filter((item) => {
                if (!normalizedQuery) return true;
                const student = studentLookup.get(item.studentId);
                return [student?.name, item.title, item.body, item.meta]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedQuery);
            })
            .sort((a, b) => {
                const aTime = new Date(a.date).getTime();
                const bTime = new Date(b.date).getTime();
                return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
            });
    }, [filteredObservations, searchQuery, studentLookup]);

    const tagStats = useMemo(() => {
        const counts = new Map<string, number>();
        scopedObservations.forEach((observation) => {
            observation.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
        });
        return Array.from(counts.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }, [scopedObservations]);

    const currentMarkCounts = useMemo(() => (
        Array.from(markStatsByStudent.values()).reduce(
            (result, summary) => ({
                participated: result.participated + summary.participated,
                excellent: result.excellent + summary.excellent,
            }),
            { participated: 0, excellent: 0 }
        )
    ), [markStatsByStudent]);

    useEffect(() => {
        void loadObservations();
    }, []);

    useEffect(() => {
        const availableIds = new Set(boardStudents.map((student) => student.id));
        const hasSavedAssignments = selectedClassId !== 'all'
            && hasClassMentorAssignments(mentorAssignmentsByClass, selectedClassId);
        const savedAssignments = hasSavedAssignments ? mentorAssignmentsByClass[selectedClassId] ?? [] : [];
        const assignedIds = savedAssignments.flatMap(getAssignmentStudentIds);
        const canUseSavedAssignments = hasSavedAssignments
            && (assignedIds.length === 0 || assignedIds.every((studentId) => availableIds.has(studentId)));

        setMentorAssignments(cloneMentorAssignments(canUseSavedAssignments ? savedAssignments : defaultMentorAssignments));
    }, [boardStudents, defaultMentorAssignments, mentorAssignmentsByClass, selectedClassId]);

    useEffect(() => {
        const storageKey = getObservationBoardMentorAssignmentStorageKey(teacher?.teacherKey);
        setLoadedMentorAssignmentKey(storageKey);

        try {
            const saved = window.localStorage.getItem(storageKey);
            setMentorAssignmentsByClass(saved
                ? normalizeObservationBoardMentorAssignmentsByClass(JSON.parse(saved))
                : {});
        } catch (error) {
            console.error('Failed to load mentor assignments:', error);
            setMentorAssignmentsByClass({});
        }
    }, [teacher?.teacherKey]);

    useEffect(() => {
        if (!loadedMentorAssignmentKey) return;
        window.localStorage.setItem(loadedMentorAssignmentKey, JSON.stringify(mentorAssignmentsByClass));
    }, [loadedMentorAssignmentKey, mentorAssignmentsByClass]);

    useEffect(() => {
        const storageKey = getObservationBoardMentorAssignmentSnapshotStorageKey(teacher?.teacherKey);
        setLoadedMentorAssignmentSnapshotKey(storageKey);

        try {
            const saved = window.localStorage.getItem(storageKey);
            setMentorAssignmentSnapshotsByClass(saved
                ? normalizeObservationBoardMentorAssignmentSnapshotsByClass(JSON.parse(saved))
                : {});
        } catch (error) {
            console.error('Failed to load mentor assignment snapshots:', error);
            setMentorAssignmentSnapshotsByClass({});
        }
    }, [teacher?.teacherKey]);

    useEffect(() => {
        if (!loadedMentorAssignmentSnapshotKey) return;
        window.localStorage.setItem(loadedMentorAssignmentSnapshotKey, JSON.stringify(mentorAssignmentSnapshotsByClass));
    }, [loadedMentorAssignmentSnapshotKey, mentorAssignmentSnapshotsByClass]);

    useEffect(() => {
        const storageKey = getNoticeStorageKey(teacher?.teacherKey);
        setLoadedNoticeKey(storageKey);

        try {
            const saved = window.localStorage.getItem(storageKey);
            setNotices(saved ? JSON.parse(saved) as NoticeItem[] : []);
        } catch (error) {
            console.error('Failed to load observation board notices:', error);
            setNotices([]);
        }
    }, [teacher?.teacherKey]);

    useEffect(() => {
        if (!loadedNoticeKey) return;
        window.localStorage.setItem(loadedNoticeKey, JSON.stringify(notices));
    }, [loadedNoticeKey, notices]);

    useEffect(() => {
        const storageKey = getObservationBoardSessionStorageKey(teacher?.teacherKey);
        setLoadedSessionKey(storageKey);

        try {
            const saved = window.localStorage.getItem(storageKey)
                ?? window.localStorage.getItem(getObservationBoardSessionStorageKey());
            setActivitySessions(saved ? normalizeObservationBoardActivitySessions(JSON.parse(saved)) : defaultActivitySessions);
        } catch (error) {
            console.error('Failed to load observation board sessions:', error);
            setActivitySessions(defaultActivitySessions);
        }
    }, [teacher?.teacherKey]);

    useEffect(() => {
        if (!loadedSessionKey) return;
        window.localStorage.setItem(loadedSessionKey, JSON.stringify(activitySessions));
    }, [activitySessions, loadedSessionKey]);

    useEffect(() => {
        const storageKey = getObservationBoardMarkStorageKey(teacher?.teacherKey);
        setLoadedMarkKey(storageKey);

        try {
            const saved = window.localStorage.getItem(storageKey)
                ?? window.localStorage.getItem(getObservationBoardMarkStorageKey());
            setMarks(saved ? normalizeObservationBoardMarks(JSON.parse(saved)) : {});
        } catch (error) {
            console.error('Failed to load observation board marks:', error);
            setMarks({});
        }
    }, [teacher?.teacherKey]);

    useEffect(() => {
        if (!loadedMarkKey) return;
        window.localStorage.setItem(loadedMarkKey, JSON.stringify(marks));
    }, [loadedMarkKey, marks]);

    const remoteBoardPayload = useMemo<ObservationBoardRemoteState>(() => ({
        activitySessions,
        marks,
        mentorAssignmentsByClass,
        mentorAssignmentSnapshotsByClass,
        notices,
    }), [
        activitySessions,
        marks,
        mentorAssignmentsByClass,
        mentorAssignmentSnapshotsByClass,
        notices,
    ]);

    useEffect(() => {
        if (!isStoreReady || !teacher?.teacherKey) return;

        const controller = new AbortController();
        setIsRemoteBoardLoaded(false);

        const loadRemoteBoardState = async () => {
            try {
                const response = await fetch('/api/observation-board-state', {
                    cache: 'no-store',
                    signal: controller.signal,
                });
                if (!response.ok) return;

                const body = await response.json() as {
                    configured?: boolean;
                    data?: Partial<ObservationBoardRemoteState> | null;
                };
                if (!body.configured || !body.data || Object.keys(body.data).length === 0) return;

                const nextState: ObservationBoardRemoteState = {
                    activitySessions: normalizeObservationBoardActivitySessions(body.data.activitySessions),
                    marks: normalizeObservationBoardMarks(body.data.marks),
                    mentorAssignmentsByClass: normalizeObservationBoardMentorAssignmentsByClass(body.data.mentorAssignmentsByClass),
                    mentorAssignmentSnapshotsByClass: normalizeObservationBoardMentorAssignmentSnapshotsByClass(body.data.mentorAssignmentSnapshotsByClass),
                    notices: Array.isArray(body.data.notices) ? body.data.notices as NoticeItem[] : [],
                };

                setActivitySessions(nextState.activitySessions);
                setMarks(nextState.marks);
                setMentorAssignmentsByClass(nextState.mentorAssignmentsByClass);
                setMentorAssignmentSnapshotsByClass(nextState.mentorAssignmentSnapshotsByClass);
                setNotices(nextState.notices);
                lastRemoteBoardPayloadRef.current = JSON.stringify(nextState);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Observation board Supabase sync load failed:', error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsRemoteBoardLoaded(true);
                }
            }
        };

        void loadRemoteBoardState();

        return () => controller.abort();
    }, [isStoreReady, teacher?.teacherKey]);

    useEffect(() => {
        if (!isStoreReady || !teacher?.teacherKey || !isRemoteBoardLoaded) return;

        const serializedPayload = JSON.stringify(remoteBoardPayload);
        if (serializedPayload === lastRemoteBoardPayloadRef.current) return;

        const timeout = window.setTimeout(() => {
            lastRemoteBoardPayloadRef.current = serializedPayload;
            void fetch('/api/observation-board-state', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacherKey: teacher.teacherKey,
                    data: remoteBoardPayload,
                }),
            }).catch((error) => {
                console.error('Observation board Supabase sync save failed:', error);
                lastRemoteBoardPayloadRef.current = '';
            });
        }, 900);

        return () => window.clearTimeout(timeout);
    }, [isRemoteBoardLoaded, isStoreReady, remoteBoardPayload, teacher?.teacherKey]);

    useEffect(() => {
        setStudentDrafts((prev) => {
            const next: Record<string, ObservationDraftRow> = {};
            selectedStudentIds.forEach((studentId) => {
                next[studentId] = prev[studentId] ?? createEmptyDraft();
            });
            return next;
        });
    }, [selectedStudentIds]);

    const loadObservations = async () => {
        setIsLoadingObservations(true);
        try {
            const response = await fetch('/api/observations');
            const data = await response.json();
            if (data.success) {
                setObservations(data.data);
            }
        } catch (error) {
            console.error('Failed to load observations:', error);
        } finally {
            setIsLoadingObservations(false);
        }
    };

    const handleClassChange = (classId: string) => {
        setSelectedClassId(classId);
        setSelectedStudentIds(new Set());
        setMentorAssignments([]);
        setEditingMentorGroupId(null);
        setEditingMentorGroupMembers([]);
    };

    useEffect(() => {
        if (activeMode !== 'mentor' && activeMode !== 'stats' && activeMode !== 'grouping') return;

        if (teacherClasses.length === 0) {
            if (selectedClassId !== 'all') {
                setSelectedClassId('all');
            }
            return;
        }

        const hasSelectedClass = teacherClasses.some((cls) => cls.id === selectedClassId);
        if (!hasSelectedClass) {
            setSelectedClassId(teacherClasses[0].id);
            setSelectedStudentIds(new Set());
            setMentorAssignments([]);
        }
    }, [activeMode, selectedClassId, teacherClasses]);

    const handleVisibleRosterCountChange = (count: VisibleRosterCount) => {
        setVisibleRosterCount(count);
        setMentorAssignments([]);
        setEditingMentorGroupId(null);
        setEditingMentorGroupMembers([]);
    };

    const commitMentorAssignments = (nextAssignments: MentorGroupAssignment[]) => {
        const normalizedAssignments = cloneMentorAssignments(nextAssignments);
        setMentorAssignments(normalizedAssignments);

        if (selectedClassId === 'all') return;
        setMentorAssignmentsByClass((prev) => {
            const hasCurrent = hasClassMentorAssignments(prev, selectedClassId);
            const current = hasCurrent ? prev[selectedClassId] ?? [] : [];
            if (hasCurrent && areObservationBoardMentorAssignmentsEqual(current, normalizedAssignments)) return prev;

            return {
                ...prev,
                [selectedClassId]: normalizedAssignments,
            };
        });
    };

    const captureSessionAssignmentSnapshot = (
        classId: string,
        sessionId: string,
        assignments: MentorGroupAssignment[]
    ) => {
        if (classId === 'all' || assignments.length === 0) return;

        const snapshot = cloneMentorAssignments(assignments);
        setMentorAssignmentSnapshotsByClass((prev) => {
            if (prev[classId]?.[sessionId]?.length) return prev;

            return {
                ...prev,
                [classId]: {
                    ...(prev[classId] ?? {}),
                    [sessionId]: snapshot,
                },
            };
        });
    };

    const captureMarkedSessionAssignmentSnapshots = (
        classId: string,
        assignments: MentorGroupAssignment[]
    ) => {
        if (classId === 'all' || assignments.length === 0) return;

        const assignedStudentIds = new Set(
            assignments
                .flatMap(getAssignmentStudentIds)
                .filter(Boolean) as string[]
        );
        if (assignedStudentIds.size === 0) return;

        const sessionIdsToCapture = activitySessions
            .filter((session) => Array.from(assignedStudentIds).some((studentId) =>
                isActiveMark(marks[`${studentId}:${session.id}`])
            ))
            .map((session) => session.id);

        if (sessionIdsToCapture.length === 0) return;

        const snapshot = cloneMentorAssignments(assignments);
        setMentorAssignmentSnapshotsByClass((prev) => {
            const classSnapshots = prev[classId] ?? {};
            const missingSessionIds = sessionIdsToCapture.filter((sessionId) => !classSnapshots[sessionId]?.length);
            if (missingSessionIds.length === 0) return prev;

            return {
                ...prev,
                [classId]: {
                    ...classSnapshots,
                    ...Object.fromEntries(missingSessionIds.map((sessionId) => [sessionId, snapshot])),
                },
            };
        });
    };

    const syncMarkCookieDelta = async (
        studentId: string,
        session: ActivitySession,
        previousMark: MarkState,
        nextMark: MarkState
    ) => {
        if (!teacher) return;

        const delta = getCookieDelta(previousMark, nextMark);
        if (delta === 0) return;

        const student = studentLookup.get(studentId);
        const reason = [
            '멘토·멘티 활동 자동 반영',
            session.label,
            markCookieLabels[previousMark],
            '→',
            markCookieLabels[nextMark],
        ].join(' ');

        try {
            const response = await fetch('/api/cookies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    school: student?.school || teacher.school,
                    studentId,
                    teacherKey: teacher.teacherKey,
                    type: delta > 0 ? 'award' : 'adjust',
                    amount: delta,
                    reason,
                }),
            });
            const data = await response.json().catch(() => null) as { success?: boolean; error?: string } | null;
            if (!response.ok || !data?.success) {
                throw new Error(data?.error || '쿠키 원장 반영 실패');
            }
        } catch (error) {
            console.error('Failed to sync observation mark cookie delta:', error);
            alert('활동 표시는 저장했지만 쿠키 자동 반영에 실패했습니다. 잠시 후 다시 표시를 조정해 주세요.');
        }
    };

    const updateMark = (studentId: string, session: ActivitySession, fallback: MarkState) => {
        const key = `${studentId}:${session.id}`;
        const previousMark = marks[key] ?? fallback;
        const nextMark = getNextMark(previousMark);

        if (isActiveMark(nextMark)) {
            captureSessionAssignmentSnapshot(selectedClassId, session.id, currentMentorAssignments);
        }

        setMarks((prev) => ({
            ...prev,
            [key]: nextMark,
        }));
        void syncMarkCookieDelta(studentId, session, previousMark, nextMark);
    };

    const toggleStudentSelection = (studentId: string) => {
        setSelectedStudentIds((prev) => {
            const next = new Set(prev);
            if (next.has(studentId)) next.delete(studentId);
            else next.add(studentId);
            return next;
        });
    };

    const selectSingleStudent = (studentId: string) => {
        setSelectedStudentIds(new Set([studentId]));
    };

    const toggleSelectAll = () => {
        if (filteredStudents.length === 0) return;
        if (selectedStudentIds.size === filteredStudents.length) {
            setSelectedStudentIds(new Set());
            return;
        }

        setSelectedStudentIds(new Set(filteredStudents.map((student) => student.id)));
    };

    const getTeachingClassForStudent = (student: Student): ClassGroup | undefined => {
        if (selectedClass) return selectedClass;
        return teacherClasses.find((cls) =>
            cls.school === student.school
            && cls.grade === student.grade
            && cls.classNumber === student.classNumber
        );
    };

    const getClassDisplay = (classId?: string) => {
        const targetClass = teacherClasses.find((cls) => cls.id === classId)
            || classes.find((cls) => cls.id === classId);
        if (!targetClass) return '수업 정보 없음';
        return `${targetClass.grade}학년 ${targetClass.classNumber}반 · ${targetClass.subjectName}`;
    };

    const getStudentDisplay = (studentId: string) => {
        const student = studentLookup.get(studentId);
        if (!student) return '알 수 없는 학생';
        return `${student.number}번 ${student.name}`;
    };

    const updateStudentDraft = (
        studentId: string,
        field: 'lessonTopic' | 'memo',
        value: string
    ) => {
        setStudentDrafts((prev) => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] ?? createEmptyDraft()),
                [field]: value,
            },
        }));
    };

    const toggleCommonTag = (tag: string) => {
        setCommonTags((prev) =>
            prev.includes(tag)
                ? prev.filter((item) => item !== tag)
                : [...prev, tag]
        );
    };

    const toggleStudentTag = (studentId: string, tag: string) => {
        setStudentDrafts((prev) => {
            const current = prev[studentId] ?? createEmptyDraft();
            const nextTags = current.tags.includes(tag)
                ? current.tags.filter((item) => item !== tag)
                : [...current.tags, tag];

            return {
                ...prev,
                [studentId]: {
                    ...current,
                    tags: nextTags,
                },
            };
        });
    };

    const addCustomTag = () => {
        const nextTag = customTagInput.trim();
        if (!nextTag) return;

        setCustomTagOptions((prev) => (prev.includes(nextTag) ? prev : [...prev, nextTag]));
        setCommonTags((prev) => (prev.includes(nextTag) ? prev : [...prev, nextTag]));
        setCustomTagInput('');
    };

    const handleSaveManualObservations = async () => {
        if (!teacher || selectedStudents.length === 0) {
            alert('학생을 먼저 선택하세요.');
            return;
        }

        const missingClassStudents = selectedStudents.filter((student) => !getTeachingClassForStudent(student));
        if (missingClassStudents.length > 0) {
            alert('수업 학급을 찾을 수 없는 학생이 있습니다. 담당 학급을 먼저 선택하세요.');
            return;
        }

        const missingMemoStudents = selectedStudents
            .filter((student) => !studentDrafts[student.id]?.memo?.trim())
            .map((student) => student.name);
        if (missingMemoStudents.length > 0) {
            alert(`관찰 메모가 비어 있는 학생: ${missingMemoStudents.join(', ')}`);
            return;
        }

        setIsSaving(true);
        try {
            const results = await Promise.all(selectedStudents.map(async (student) => {
                const targetClass = getTeachingClassForStudent(student);
                const draft = studentDrafts[student.id] ?? createEmptyDraft();
                const tags = Array.from(new Set([...commonTags, ...draft.tags]));
                const response = await fetch('/api/observations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: student.id,
                        classId: targetClass?.id,
                        teacherKey: teacher.teacherKey,
                        subjectName: targetClass?.subjectName,
                        lessonTopic: commonLessonTopic.trim() || draft.lessonTopic.trim() || undefined,
                        date: commonDate,
                        memo: draft.memo.trim(),
                        evidenceType: 'process',
                        tags,
                        sourceType: 'manual',
                    }),
                });
                const data = await response.json();
                return response.ok && data.success;
            }));

            const failedCount = results.filter((result) => !result).length;
            if (failedCount > 0) {
                alert(`${selectedStudents.length - failedCount}명 저장, ${failedCount}명 저장 실패`);
                await loadObservations();
                return;
            }

            setCommonLessonTopic('');
            setCommonTags([]);
            setStudentDrafts({});
            setSelectedStudentIds(new Set());
            await loadObservations();
            alert(`${results.length}명의 관찰 기록을 저장했습니다.`);
        } catch (error) {
            console.error('Failed to save observations:', error);
            alert('관찰 기록 저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveGrowthRecord = async (cookieCount: number, memo: string) => {
        if (!teacher || selectedStudents.length === 0) {
            alert('학생을 먼저 선택하세요.');
            return false;
        }

        const missingClassStudents = selectedStudents.filter((student) => !getTeachingClassForStudent(student));
        if (missingClassStudents.length > 0) {
            alert('수업 학급을 찾을 수 없는 학생이 있습니다. 담당 학급을 먼저 선택하세요.');
            return false;
        }

        const trimmedMemo = memo.trim();
        const fallbackMemo = `성장 쿠키 ${cookieCount}개를 기록했습니다.`;

        setIsSaving(true);
        try {
            const results = await Promise.all(selectedStudents.map(async (student) => {
                const targetClass = getTeachingClassForStudent(student);
                const response = await fetch('/api/observations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: student.id,
                        classId: targetClass?.id,
                        teacherKey: teacher.teacherKey,
                        subjectName: targetClass?.subjectName,
                        lessonTopic: '성장 기록',
                        date: today(),
                        memo: trimmedMemo || fallbackMemo,
                        evidenceType: 'process',
                        tags: ['성장', `쿠키 ${cookieCount}개`],
                        sourceType: 'manual',
                    }),
                });
                const data = await response.json();
                return response.ok && data.success;
            }));

            const failedCount = results.filter((result) => !result).length;
            await loadObservations();

            if (failedCount > 0) {
                alert(`${selectedStudents.length - failedCount}명 저장, ${failedCount}명 저장 실패`);
                return false;
            }

            setSelectedStudentIds(new Set());
            alert(`${results.length}명의 성장 기록을 저장했습니다.`);
            return true;
        } catch (error) {
            console.error('Failed to save growth records:', error);
            alert('성장 기록 저장 중 오류가 발생했습니다.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteObservation = async (id: string) => {
        if (!confirm('이 관찰 기록을 삭제할까요?')) return;

        try {
            const response = await fetch(`/api/observations?id=${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok || !data.success) {
                alert(data.error || '관찰 기록 삭제에 실패했습니다.');
                return;
            }

            setObservations((prev) => prev.filter((item) => item.id !== id));
            if (selectedObservation?.id === id) {
                setSelectedObservation(null);
            }
        } catch (error) {
            console.error('Failed to delete observation:', error);
            alert('관찰 기록 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleAddNotice = () => {
        const title = noticeDraft.title.trim();
        const body = noticeDraft.body.trim();
        if (!title && !body) return;

        setNotices((prev) => [
            {
                id: `notice-${Date.now()}`,
                title: title || '제목 없는 알림',
                body,
                dueDate: noticeDraft.dueDate || today(),
                completed: false,
                createdAt: new Date().toISOString(),
            },
            ...prev,
        ]);
        setNoticeDraft({ title: '', body: '', dueDate: today() });
    };

    const handleAddStudentToMentorGroup = (studentId: string, targetGroupId: string) => {
        if (selectedClassId === 'all') {
            alert('멘토·멘티 배치를 바꾸려면 먼저 학급을 선택해 주세요.');
            return;
        }

        const source = cloneMentorAssignments(currentMentorAssignments);
        const targetGroup = source.find((group) => group.id === targetGroupId);
        if (!targetGroup) return;

        const targetMembers = getObservationBoardAssignmentMembers(targetGroup);
        if (targetMembers.some((member) => member.studentId === studentId)) return;

        if (targetMembers.length >= maxMentorGroupMembers) {
            alert('한 모둠에는 최대 4명까지 넣을 수 있습니다.');
            return;
        }

        captureMarkedSessionAssignmentSnapshots(selectedClassId, source);

        const nextAssignments = source.map((group) => {
            const remainingMembers = getObservationBoardAssignmentMembers(group)
                .filter((member) => member.studentId !== studentId);

            if (group.id === targetGroupId) {
                return withGroupMembers(group, [
                    ...remainingMembers,
                    {
                        studentId,
                        role: getDefaultGroupRoleByIndex(remainingMembers.length),
                        order: remainingMembers.length,
                    },
                ]);
            }

            return withGroupMembers(group, remainingMembers);
        });

        commitMentorAssignments(nextAssignments);
        if (editingMentorGroupId === targetGroupId) {
            setEditingMentorGroupMembers(getObservationBoardAssignmentMembers(
                nextAssignments.find((group) => group.id === targetGroupId)
            ));
        }
    };

    const handleUpdateMentorGroupMemberRole = (groupId: string, studentId: string, role: MentorRole) => {
        if (selectedClassId === 'all') return;

        const source = cloneMentorAssignments(currentMentorAssignments);
        const targetGroup = source.find((group) => group.id === groupId);
        if (!targetGroup) return;

        captureMarkedSessionAssignmentSnapshots(selectedClassId, source);

        const nextAssignments = source.map((group) => {
            if (group.id !== groupId) return group;
            const members = getObservationBoardAssignmentMembers(group).map((member) =>
                member.studentId === studentId ? { ...member, role } : member
            );
            return withGroupMembers(group, members);
        });

        commitMentorAssignments(nextAssignments);
        if (editingMentorGroupId === groupId) {
            setEditingMentorGroupMembers((prev) => normalizeGroupMembers(
                prev.map((member) => member.studentId === studentId ? { ...member, role } : member)
            ));
        }
    };

    const handleUpdateEditingMentorGroupMemberRole = (studentId: string, role: MentorRole) => {
        setEditingMentorGroupMembers((prev) => normalizeGroupMembers(
            prev.map((member) => member.studentId === studentId ? { ...member, role } : member)
        ));
    };

    const handleEditMentorGroup = (groupId: string) => {
        if (selectedClassId === 'all') {
            alert('학급을 먼저 선택해 주세요.');
            return;
        }

        const targetGroup = currentMentorAssignments.find((group) => group.id === groupId);
        if (!targetGroup) return;

        setEditingMentorGroupId(groupId);
        setEditingMentorGroupMembers(getObservationBoardAssignmentMembers(targetGroup));
    };

    const handleCancelMentorGroupEdit = () => {
        setEditingMentorGroupId(null);
        setEditingMentorGroupMembers([]);
    };

    const handleStageMentorGroupStudent = (studentId: string) => {
        if (!editingMentorGroupId) return;

        setEditingMentorGroupMembers((prev) => {
            if (prev.some((member) => member.studentId === studentId)) return prev;
            if (prev.length >= maxMentorGroupMembers) {
                alert('한 모둠에는 최대 4명까지 넣을 수 있습니다.');
                return prev;
            }

            return [
                ...prev,
                {
                    studentId,
                    role: getDefaultGroupRoleByIndex(prev.length),
                    order: prev.length,
                },
            ];
        });
    };

    const handleRemoveMentorGroupStudent = (studentId: string) => {
        setEditingMentorGroupMembers((prev) => normalizeGroupMembers(
            prev.filter((member) => member.studentId !== studentId)
        ));
    };

    const handleSaveMentorGroupEdit = () => {
        if (!editingMentorGroupId || selectedClassId === 'all') return;
        if (editingMentorGroupMembers.length > maxMentorGroupMembers) {
            alert('한 모둠에는 최대 4명까지 넣을 수 있습니다.');
            return;
        }

        const source = cloneMentorAssignments(currentMentorAssignments);
        const editedStudentIds = new Set(editingMentorGroupMembers.map((member) => member.studentId));
        captureMarkedSessionAssignmentSnapshots(selectedClassId, source);

        const nextAssignments = source.map((group) => {
            if (group.id === editingMentorGroupId) {
                return withGroupMembers(group, editingMentorGroupMembers);
            }

            const remainingMembers = getObservationBoardAssignmentMembers(group)
                .filter((member) => !editedStudentIds.has(member.studentId));
            return withGroupMembers(group, remainingMembers);
        });

        commitMentorAssignments(nextAssignments);
        handleCancelMentorGroupEdit();
    };

    const handleAddMentorGroup = () => {
        const source = cloneMentorAssignments(currentMentorAssignments);
        const nextNumber = source.length + 1;
        commitMentorAssignments([
            ...source,
            {
                id: `group-${Date.now()}`,
                members: [],
                title: `${nextNumber}조`,
            },
        ]);
    };

    const handleDeleteMentorGroup = (groupId: string) => {
        if (selectedClassId === 'all') {
            alert('멘토·멘티 모둠을 삭제하려면 먼저 학급을 선택해 주세요.');
            return;
        }

        const source = cloneMentorAssignments(currentMentorAssignments);
        const targetGroup = source.find((group) => group.id === groupId);
        if (!targetGroup) return;

        if (!confirm(`${targetGroup.title} 모둠을 삭제할까요?\n이미 기록된 △/○ 활동 표시는 지우지 않습니다.`)) {
            return;
        }

        captureMarkedSessionAssignmentSnapshots(selectedClassId, source);
        commitMentorAssignments(source.filter((group) => group.id !== groupId));
        if (editingMentorGroupId === groupId) {
            handleCancelMentorGroupEdit();
        }
    };

    const handleResetMentorAssignments = () => {
        if (selectedClassId === 'all' || !selectedClass) {
            alert('초기화할 학급을 먼저 선택해 주세요.');
            return;
        }

        if (!confirm('현재 학급의 멘토·멘티 모둠과 배치를 모두 비울까요?\n이미 기록된 △/○ 활동 표시는 지우지 않고, 과거 차시는 당시 배치 이력으로 보존합니다.')) {
            return;
        }

        captureMarkedSessionAssignmentSnapshots(selectedClassId, currentMentorAssignments);
        commitMentorAssignments([]);
        handleCancelMentorGroupEdit();
    };

    const persistActivitySessions = (nextSessions: ActivitySession[]) => {
        if (typeof window === 'undefined') return;

        try {
            const storageKeys = new Set([
                loadedSessionKey,
                getObservationBoardSessionStorageKey(teacher?.teacherKey),
            ].filter(Boolean));
            storageKeys.forEach((storageKey) => {
                window.localStorage.setItem(storageKey, JSON.stringify(nextSessions));
            });
        } catch (error) {
            console.error('Failed to save observation board sessions:', error);
        }
    };

    const handleUpdateSession = (sessionId: string, field: 'date' | 'topic', value: string) => {
        const nextSessions = activitySessions.map((session) => (
            session.id === sessionId ? { ...session, [field]: value } : session
        ));
        setActivitySessions(nextSessions);
        persistActivitySessions(nextSessions);
    };

    const handleAddSession = () => {
        const nextSessions = [
            ...activitySessions,
            {
                id: `session-${Date.now()}`,
                label: `${activitySessions.length + 1}차시`,
                date: '',
                topic: '',
            },
        ];
        setActivitySessions(nextSessions);
        persistActivitySessions(nextSessions);
    };

    const renderObservationRecordsView = () => (
        <ObservationRecordsView
            filteredStudents={filteredStudents}
            selectedStudentIds={selectedStudentIds}
            selectedStudents={selectedStudents}
            observations={filteredObservations}
            observationStatsByStudent={observationStatsByStudent}
            isLoadingObservations={isLoadingObservations}
            commonDate={commonDate}
            commonLessonTopic={commonLessonTopic}
            commonTags={commonTags}
            availableTagOptions={availableTagOptions}
            customTagInput={customTagInput}
            studentDrafts={studentDrafts}
            isSaving={isSaving}
            getClassDisplay={getClassDisplay}
            getStudentDisplay={getStudentDisplay}
            onToggleStudent={toggleStudentSelection}
            onToggleAll={toggleSelectAll}
            onClearSelected={() => setSelectedStudentIds(new Set())}
            onCommonDateChange={setCommonDate}
            onCommonLessonTopicChange={setCommonLessonTopic}
            onToggleCommonTag={toggleCommonTag}
            onCustomTagInputChange={setCustomTagInput}
            onAddCustomTag={addCustomTag}
            onToggleStudentTag={toggleStudentTag}
            onUpdateStudentDraft={updateStudentDraft}
            onSave={handleSaveManualObservations}
            onOpenDetail={setSelectedObservation}
            onDelete={handleDeleteObservation}
        />
    );

    const renderBoardContent = () => {
        if (activeMode === 'growth') {
            return (
                <GrowthDashboard
                    teacherClasses={teacherClasses}
                    teacherStudents={teacherStudents}
                    students={filteredStudents}
                    selectedClassId={selectedClassId}
                    searchQuery={searchQuery}
                    timeline={growthTimeline}
                    isLoading={isLoadingObservations}
                    studentLookup={studentLookup}
                    observationStatsByStudent={observationStatsByStudent}
                    markStatsByStudent={markStatsByStudent}
                    selectedStudentIds={selectedStudentIds}
                    selectedStudents={selectedStudents}
                    isSaving={isSaving}
                    onClassChange={handleClassChange}
                    onSearchChange={setSearchQuery}
                    onToggleStudent={toggleStudentSelection}
                    onSelectSingleStudent={selectSingleStudent}
                    onClearSelected={() => setSelectedStudentIds(new Set())}
                    onSaveGrowthRecord={handleSaveGrowthRecord}
                />
            );
        }

        if (activeMode === 'stats') {
            return (
                <StatsDashboard
                    teacherClasses={teacherClasses}
                    teacherStudents={teacherStudents}
                    selectedClassId={selectedClassId}
                    observations={filteredObservations}
                    students={filteredStudents}
                    tagStats={tagStats}
                    currentMarkCounts={currentMarkCounts}
                    latestObservation={filteredObservations[0]}
                    studentStats={observationStatsByStudent}
                    mentorGroups={mentorGroups}
                    markStatsByStudent={markStatsByStudent}
                    getStudentDisplay={getStudentDisplay}
                    onClassChange={handleClassChange}
                    onModeChange={setActiveMode}
                />
            );
        }

        if (activeMode === 'grouping') {
            return (
                <GroupSurveyDashboard
                    teacherClasses={teacherClasses}
                    teacherStudents={teacherStudents}
                    selectedClassId={selectedClassId}
                    onClassChange={handleClassChange}
                />
            );
        }

        if (activeMode === 'notice') {
            return (
                <NoticeBoard
                    notices={notices}
                    draft={noticeDraft}
                    onDraftChange={setNoticeDraft}
                    onAddNotice={handleAddNotice}
                    onToggleNotice={(id) => setNotices((prev) => prev.map((notice) => (
                        notice.id === id ? { ...notice, completed: !notice.completed } : notice
                    )))}
                    onDeleteNotice={(id) => setNotices((prev) => prev.filter((notice) => notice.id !== id))}
                />
            );
        }

        if (activeMode === 'settings') {
            return (
                <SettingsDashboard
                    teacherClasses={teacherClasses}
                    selectedClassId={selectedClassId}
                    visibleRosterCount={visibleRosterCount}
                    noticesCount={notices.length}
                    hasRealStudents={teacherStudents.length > 0}
                    onClassChange={handleClassChange}
                    onVisibleRosterCountChange={handleVisibleRosterCountChange}
                    onResetMarks={() => setMarks({})}
                    onClearNotices={() => setNotices([])}
                    onModeChange={setActiveMode}
                />
            );
        }

        if (activeMode === 'records') {
            return (
                <>
                    <FilterStrip
                        teacherClasses={teacherClasses}
                        teacherStudents={teacherStudents}
                        selectedClassId={selectedClassId}
                        searchQuery={searchQuery}
                        onClassChange={handleClassChange}
                        onSearchChange={setSearchQuery}
                    />
                    {renderObservationRecordsView()}
                </>
            );
        }

        return (
            <MentorActivityView
                teacherClasses={teacherClasses}
                teacherStudents={teacherStudents}
                selectedClassId={selectedClassId}
                boardStudents={boardStudents}
                featuredStudents={featuredStudents}
                mentorGroups={mentorGroups}
                editingGroupId={editingMentorGroupId}
                editingGroupMembers={editingMentorGroupMembers}
                sessions={activitySessions}
                marks={marks}
                totalExcellent={totalExcellent}
                visibleRosterCount={visibleRosterCount}
                onAddStudentToGroup={handleAddStudentToMentorGroup}
                onChangeMemberRole={handleUpdateMentorGroupMemberRole}
                onChangeEditingMemberRole={handleUpdateEditingMentorGroupMemberRole}
                onEditGroup={handleEditMentorGroup}
                onStageGroupStudent={handleStageMentorGroupStudent}
                onRemoveGroupStudent={handleRemoveMentorGroupStudent}
                onSaveGroupEdit={handleSaveMentorGroupEdit}
                onCancelGroupEdit={handleCancelMentorGroupEdit}
                onClassChange={handleClassChange}
                onAddGroup={handleAddMentorGroup}
                onDeleteGroup={handleDeleteMentorGroup}
                onResetAssignments={handleResetMentorAssignments}
                onAddSession={handleAddSession}
                onUpdateSession={handleUpdateSession}
                onUpdateMark={updateMark}
            />
        );
    };

    return (
        <div className={styles.dashboardShell}>
            {teacher && <SharedRosterSync />}
            <ClassroomSidebar activeMode={activeMode} onModeChange={setActiveMode} />

            <main className={styles.dashboardMain}>
                <header className={styles.dashboardHeader}>
                    <div className={styles.titleCluster}>
                        <span className={styles.titleIcon}>
                            <img src="/observation-board-2/title-clipboard.png" alt="" aria-hidden="true" />
                        </span>
                        <h1>{getBoardModeTitle(activeMode)}</h1>
                    </div>
                    <div className={styles.headerActions} aria-label="사용자 정보">
                        <span className={styles.headerCloud} aria-hidden="true">
                            <Cloud size={60} />
                        </span>
                        <button type="button" className={styles.referenceHeaderButton}>
                            <span className={`${styles.headerIcon} ${styles.badgeIcon}`} aria-hidden="true">
                                <Handshake size={28} />
                            </span>
                            우정 배지
                        </button>
                        <button type="button" className={styles.referenceHeaderButton}>
                            <span className={`${styles.headerIcon} ${styles.noticeIcon}`} aria-hidden="true">
                                <Bell size={27} />
                            </span>
                            알림
                        </button>
                        <span className={styles.teacherChip}>
                            <span className={`${styles.headerIcon} ${styles.teacherIcon}`} aria-hidden="true">
                                <UserRound size={26} />
                            </span>
                            선생님
                            <ChevronDown size={16} aria-hidden="true" />
                        </span>
                    </div>
                </header>

                {renderBoardContent()}
            </main>

            <AnimatePresence>
                {selectedObservation && (
                    <ObservationDetailModal
                        observation={selectedObservation}
                        getClassDisplay={getClassDisplay}
                        getStudentDisplay={getStudentDisplay}
                        onClose={() => setSelectedObservation(null)}
                        onDelete={handleDeleteObservation}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ClassroomSidebar({
    activeMode,
    onModeChange,
}: {
    activeMode: BoardMode;
    onModeChange: (mode: BoardMode) => void;
}) {
    const navItems: Array<{ mode: BoardMode; label: string; icon: ReactNode }> = [
        { mode: 'mentor', label: '학생 관찰 기록', icon: <ClipboardList size={34} strokeWidth={2.35} /> },
        { mode: 'growth', label: '성장 기록', icon: <Sparkles size={34} strokeWidth={2.35} /> },
        { mode: 'stats', label: '통계 보기', icon: <BarChart3 size={34} strokeWidth={2.35} /> },
        { mode: 'grouping', label: '모둠 편성', icon: <Users size={34} strokeWidth={2.35} /> },
    ];

    return (
        <aside className={styles.classroomSidebar}>
            <div className={styles.sidebarLogoBlock} aria-label="학급 관찰기록">
                <span className={styles.sidebarLogoIcon} aria-hidden="true">
                    <Star size={36} strokeWidth={2.45} />
                </span>
                <span className={styles.sidebarLogoText}>
                    <strong>학급</strong>
                    <em>관찰기록</em>
                </span>
            </div>

            <nav className={styles.sidebarNav} aria-label="관찰2 사이드 메뉴">
                {navItems.map((item) => (
                    <button
                        key={item.mode}
                        type="button"
                        className={activeMode === item.mode ? styles.sidebarNavActive : ''}
                        onClick={() => onModeChange(item.mode)}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>

            <img
                src="/observation-board-2/sidebar-kids.png"
                alt=""
                className={styles.sidebarKidsImage}
                aria-hidden="true"
            />
        </aside>
    );
}

function FilterStrip({
    teacherClasses,
    teacherStudents,
    selectedClassId,
    searchQuery,
    onClassChange,
    onSearchChange,
}: {
    teacherClasses: ClassGroup[];
    teacherStudents: Student[];
    selectedClassId: string;
    searchQuery: string;
    onClassChange: (classId: string) => void;
    onSearchChange: (value: string) => void;
}) {
    return (
        <section className={styles.filterStrip} aria-label="관찰2 필터">
            <button
                type="button"
                className={`${styles.classChip} ${selectedClassId === 'all' ? styles.classChipActive : ''}`}
                onClick={() => onClassChange('all')}
            >
                전체
                <span>{teacherStudents.length}</span>
            </button>
            {teacherClasses.map((cls) => (
                <button
                    key={cls.id}
                    type="button"
                    className={`${styles.classChip} ${selectedClassId === cls.id ? styles.classChipActive : ''}`}
                    onClick={() => onClassChange(cls.id)}
                >
                    {cls.grade}-{cls.classNumber}
                    <span>{getStudentsInTeachingClass(teacherStudents, cls).length}</span>
                </button>
            ))}
            <label className={styles.searchBox}>
                <Search size={17} />
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="학생 이름, 메모 검색"
                />
            </label>
        </section>
    );
}

function ClassScopeSelect({
    teacherClasses,
    teacherStudents,
    selectedClassId,
    onClassChange,
    ariaLabel = '학급 선택',
    selectLabel = '담당 학급',
}: {
    teacherClasses: ClassGroup[];
    teacherStudents: Student[];
    selectedClassId: string;
    onClassChange: (classId: string) => void;
    ariaLabel?: string;
    selectLabel?: string;
}) {
    const selectedClass = teacherClasses.find((cls) => cls.id === selectedClassId) ?? teacherClasses[0];
    const selectedClassStudentCount = selectedClass
        ? getStudentsInTeachingClass(teacherStudents, selectedClass).length
        : 0;

    return (
        <section className={styles.mentorScopeBar} aria-label={ariaLabel}>
            <span className={styles.scopeLabel}>
                <Users size={16} />
                학급 선택
            </span>
            <label className={styles.mentorClassSelect}>
                <span>{selectLabel}</span>
                <select
                    value={selectedClass?.id ?? ''}
                    onChange={(event) => onClassChange(event.target.value)}
                    disabled={teacherClasses.length === 0}
                >
                    {teacherClasses.length === 0 && <option value="">담당 학급 없음</option>}
                    {teacherClasses.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.grade}학년 {cls.classNumber}반
                        </option>
                    ))}
                </select>
            </label>
            <span className={styles.mentorScopeCount}>
                <strong>{selectedClassStudentCount}</strong>
                명
            </span>
        </section>
    );
}

function SummaryCard({
    icon,
    label,
    value,
    tone,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    tone: 'blue' | 'green' | 'yellow' | 'pink';
}) {
    return (
        <article className={`${styles.summaryCard} ${styles[`summary-${tone}`]}`}>
            <span>{icon}</span>
            <div>
                <strong>{value}</strong>
                <em>{label}</em>
            </div>
        </article>
    );
}

function GrowthDashboard({
    teacherClasses,
    teacherStudents,
    students,
    selectedClassId,
    searchQuery,
    timeline,
    isLoading,
    studentLookup,
    observationStatsByStudent,
    markStatsByStudent,
    selectedStudentIds,
    selectedStudents,
    isSaving,
    onClassChange,
    onSearchChange,
    onToggleStudent,
    onSelectSingleStudent,
    onClearSelected,
    onSaveGrowthRecord,
}: {
    teacherClasses: ClassGroup[];
    teacherStudents: Student[];
    students: Student[];
    selectedClassId: string;
    searchQuery: string;
    timeline: GrowthTimelineItem[];
    isLoading: boolean;
    studentLookup: Map<string, Student>;
    observationStatsByStudent: Map<string, ObservationCardStats>;
    markStatsByStudent: Map<string, MarkSummary>;
    selectedStudentIds: Set<string>;
    selectedStudents: Student[];
    isSaving: boolean;
    onClassChange: (classId: string) => void;
    onSearchChange: (value: string) => void;
    onToggleStudent: (studentId: string) => void;
    onSelectSingleStudent: (studentId: string) => void;
    onClearSelected: () => void;
    onSaveGrowthRecord: (cookieCount: number, memo: string) => Promise<boolean>;
}) {
    const [isComposerOpen, setIsComposerOpen] = useState(false);

    return (
        <section className={styles.dashboardView}>
            <FilterStrip
                teacherClasses={teacherClasses}
                teacherStudents={teacherStudents}
                selectedClassId={selectedClassId}
                searchQuery={searchQuery}
                onClassChange={onClassChange}
                onSearchChange={onSearchChange}
            />
            <div className={styles.growthLayout}>
                <div className={styles.growthWriteDock}>
                    <div>
                        <strong>선택한 학생 {selectedStudents.length}명</strong>
                        <span>성장 기록 작성 모달에서 쿠키와 간단 메모를 함께 남깁니다.</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsComposerOpen(true)}
                        disabled={selectedStudents.length === 0}
                    >
                        <Sparkles size={17} />
                        성장 기록 작성
                    </button>
                </div>

                <div className={styles.growthStudentGrid}>
                    {students.length === 0 && (
                        <div className={styles.emptyList}>담당 학급 학생이 없습니다. 먼저 담당 학급을 등록하세요.</div>
                    )}
                    {students.map((student) => {
                        const observationStats = observationStatsByStudent.get(student.id) ?? { count: 0, cookieCount: 0 };
                        const markStats = markStatsByStudent.get(student.id) ?? { participated: 0, excellent: 0 };
                        const cookieCount = observationStats.cookieCount + markStats.participated + (markStats.excellent * 2);
                        const isSelected = selectedStudentIds.has(student.id);
                        return (
                            <button
                                key={student.id}
                                type="button"
                                className={`${styles.growthStudentCard} ${isSelected ? styles.growthStudentCardSelected : ''}`}
                                aria-pressed={isSelected}
                                onClick={() => onToggleStudent(student.id)}
                                onDoubleClick={() => {
                                    onSelectSingleStudent(student.id);
                                    setIsComposerOpen(true);
                                }}
                            >
                                <span className={styles.growthStudentIndex}>{formatStudentNumber(student.number)}</span>
                                <span className={styles.growthStudentName}>{student.name}</span>
                                <span className={styles.growthStudentDivider} aria-hidden="true" />
                                <span className={styles.growthStudentObservation}>관찰 {observationStats.count}건</span>
                                <span className={styles.growthStudentCookie} aria-label={`쿠키 ${cookieCount}개`}>
                                    <Cookie className={styles.growthStudentCookieIcon} size={18} aria-hidden="true" />
                                    <strong>{cookieCount}</strong>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className={styles.timelineList}>
                    {isLoading && <div className={styles.emptyList}>성장 기록을 불러오는 중입니다.</div>}
                    {!isLoading && timeline.length === 0 && <div className={styles.emptyList}>표시할 누적 기록이 없습니다.</div>}
                    {timeline.slice(0, 18).map((item) => {
                        const student = studentLookup.get(item.studentId);
                        return (
                            <article key={item.id} className={styles.timelineCard}>
                                <span className={styles.timelineAvatar}>{student ? formatStudentNumber(student.number) : '?'}</span>
                                <div>
                                    <div className={styles.timelineMeta}>
                                        <strong>{student?.name || '학생 정보 없음'}</strong>
                                        <em>{formatFullDate(item.date)} · {item.meta}</em>
                                    </div>
                                    <h3>{item.title}</h3>
                                    <p>{item.body}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
            {isComposerOpen && (
                <GrowthRecordModal
                    selectedStudents={selectedStudents}
                    isSaving={isSaving}
                    onRemoveStudent={onToggleStudent}
                    onClearSelected={onClearSelected}
                    onClose={() => setIsComposerOpen(false)}
                    onSave={onSaveGrowthRecord}
                />
            )}
        </section>
    );
}

const growthCookieOptions = [
    { count: 1, label: '쿠키 1개', description: '조금씩 성장했어요' },
    { count: 2, label: '쿠키 2개', description: '잘 해냈어요!' },
    { count: 3, label: '쿠키 3개', description: '정말 멋져요! 최고!' },
];

const growthStudentAvatars = ['🐻', '🐱', '🐰', '🐶', '🦊', '🐼'];

function GrowthRecordModal({
    selectedStudents,
    isSaving,
    onRemoveStudent,
    onClearSelected,
    onClose,
    onSave,
}: {
    selectedStudents: Student[];
    isSaving: boolean;
    onRemoveStudent: (studentId: string) => void;
    onClearSelected: () => void;
    onClose: () => void;
    onSave: (cookieCount: number, memo: string) => Promise<boolean>;
}) {
    const [cookieCount, setCookieCount] = useState<number | null>(null);
    const [memo, setMemo] = useState('');

    const handleSave = async () => {
        if (!cookieCount) {
            alert('쿠키를 선택해 주세요.');
            return;
        }
        const saved = await onSave(cookieCount, memo);
        if (saved) onClose();
    };

    return (
        <div className={styles.growthModalBackdrop} role="presentation">
            <motion.section
                className={styles.growthRecordModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="growth-record-title"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.18 }}
            >
                <header className={styles.growthModalHeader}>
                    <h2 id="growth-record-title">
                        <img src="/observation-board-2/title-clipboard.png" alt="" aria-hidden="true" />
                        성장 기록 작성
                    </h2>
                    <button type="button" onClick={onClose} aria-label="성장 기록 작성 닫기">
                        <X size={24} />
                    </button>
                </header>

                <div className={styles.growthStepper} aria-label="성장 기록 작성 단계">
                    {['학생 선택', '성장 기록 작성', '완료'].map((step, index) => (
                        <span
                            key={step}
                            className={index === 1 ? styles.growthStepActive : index === 0 ? styles.growthStepDone : ''}
                        >
                            <i>{index + 1}</i>
                            {step}
                        </span>
                    ))}
                </div>

                <section className={styles.selectedGrowthStudents}>
                    <div>
                        <strong>선택한 학생 {selectedStudents.length}명</strong>
                        {selectedStudents.length > 0 && (
                            <button type="button" onClick={onClearSelected} aria-label="선택 학생 전체 해제">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className={styles.selectedGrowthChipList}>
                        {selectedStudents.length === 0 && (
                            <p>뒤 화면의 학생 카드를 선택하면 여기에 표시됩니다.</p>
                        )}
                        {selectedStudents.map((student, index) => (
                            <span key={student.id} className={styles.selectedGrowthChip}>
                                <span className={styles.growthChipAvatar} aria-hidden="true">
                                    {growthStudentAvatars[index % growthStudentAvatars.length]}
                                </span>
                                <strong>{student.name}</strong>
                                <em>{student.grade}학년 {student.classNumber}반</em>
                                <button
                                    type="button"
                                    onClick={() => onRemoveStudent(student.id)}
                                    aria-label={`${student.name} 선택 해제`}
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </section>

                <section className={styles.cookieRewardSection}>
                    <h3>
                        <Star size={20} />
                        이번 활동에서 함께 잘한 것
                    </h3>
                    <p>해당하는 쿠키를 1~3개 선택해 주세요!</p>
                    <div className={styles.cookieOptionGrid}>
                        {growthCookieOptions.map((option) => (
                            <button
                                key={option.count}
                                type="button"
                                className={cookieCount === option.count ? styles.cookieOptionActive : ''}
                                onClick={() => setCookieCount(option.count)}
                            >
                                <span className={styles.cookieCheckBox} aria-hidden="true" />
                                <span className={styles.cookieCluster} aria-hidden="true">
                                    {Array.from({ length: option.count }).map((_, index) => (
                                        <i key={index} />
                                    ))}
                                </span>
                                <strong>{option.label}</strong>
                                <em>{option.description}</em>
                            </button>
                        ))}
                    </div>
                </section>

                <label className={styles.growthMemoBox}>
                    <span>선택 사항</span>
                    <strong>이번 활동에서 특히 잘한 점을 간단히 기록해 보세요 (선택)</strong>
                    <textarea
                        value={memo}
                        maxLength={100}
                        onChange={(event) => setMemo(event.target.value)}
                        placeholder="예) 친구를 도와주었어요, 발표를 자신있게 했어요, 정리정돈을 잘했어요 등"
                    />
                    <em>{memo.length}/100</em>
                </label>

                <footer className={styles.growthModalFooter}>
                    <button type="button" onClick={onClose}>
                        이전
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || selectedStudents.length === 0}
                    >
                        <Sparkles size={17} />
                        {isSaving ? '저장 중' : '저장하기'}
                    </button>
                </footer>
            </motion.section>
        </div>
    );
}

function StatsDashboard({
    teacherClasses,
    teacherStudents,
    selectedClassId,
    observations,
    students,
    tagStats,
    currentMarkCounts,
    latestObservation,
    studentStats,
    mentorGroups,
    markStatsByStudent,
    getStudentDisplay,
    onClassChange,
    onModeChange,
}: {
    teacherClasses: ClassGroup[];
    teacherStudents: Student[];
    selectedClassId: string;
    observations: Observation[];
    students: Student[];
    tagStats: Array<{ tag: string; count: number }>;
    currentMarkCounts: { participated: number; excellent: number };
    latestObservation?: Observation;
    studentStats: Map<string, ObservationCardStats>;
    mentorGroups: MentorGroupView[];
    markStatsByStudent: Map<string, MarkSummary>;
    getStudentDisplay: (studentId: string) => string;
    onClassChange: (classId: string) => void;
    onModeChange: (mode: BoardMode) => void;
}) {
    const topStudentStats = students
        .map((student) => ({ student, count: studentStats.get(student.id)?.count ?? 0 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
    const averageObservationCount = students.length > 0
        ? students.reduce((sum, student) => sum + (studentStats.get(student.id)?.count ?? 0), 0) / students.length
        : 0;
    const lowObservationThreshold = averageObservationCount / 2;
    const studentsNeedingRecords = students
        .map((student) => ({ student, count: studentStats.get(student.id)?.count ?? 0 }))
        .filter(({ count }) => count === 0 || count < lowObservationThreshold);
    const groupBalanceStats = mentorGroups.map((group) => {
        const groupStudents = group.members.map((member) => member.student);
        const summary = groupStudents.reduce(
            (result, student) => {
                const markSummary = markStatsByStudent.get(student.id) ?? { participated: 0, excellent: 0 };
                return {
                    participated: result.participated + markSummary.participated,
                    excellent: result.excellent + markSummary.excellent,
                };
            },
            { participated: 0, excellent: 0 }
        );

        return {
            title: group.title,
            names: groupStudents.map((student) => student.name).join(' · ') || '학생 미배정',
            ...summary,
        };
    });
    const maxTagCount = Math.max(...tagStats.map((item) => item.count), 1);
    const maxStudentCount = Math.max(...topStudentStats.map((item) => item.count), 1);
    const maxGroupCount = Math.max(...groupBalanceStats.map((item) => item.participated + item.excellent), 1);

    return (
        <section className={styles.dashboardView}>
            <ClassScopeSelect
                teacherClasses={teacherClasses}
                teacherStudents={teacherStudents}
                selectedClassId={selectedClassId}
                onClassChange={onClassChange}
                ariaLabel="통계 보기 학급 선택"
                selectLabel="통계 학급"
            />

            <div className={styles.homeSummaryGrid}>
                <SummaryCard icon={<ClipboardList size={24} />} label="관찰 기록" value={`${observations.length}건`} tone="blue" />
                <SummaryCard icon={<Triangle size={24} />} label="참여 표시" value={`${currentMarkCounts.participated}회`} tone="green" />
                <SummaryCard icon={<Circle size={24} />} label="매우 잘함" value={`${currentMarkCounts.excellent}회`} tone="pink" />
                <SummaryCard icon={<CalendarDays size={24} />} label="최근 기록일" value={formatShortDate(latestObservation?.date || latestObservation?.createdAt)} tone="yellow" />
            </div>

            <div className={styles.statsInsightGrid}>
                <article className={styles.statsPanel}>
                    <div className={styles.panelTitle}>
                        <UserRound size={22} />
                        <div>
                            <h2>먼저 살펴볼 학생</h2>
                            <p>관찰 메모가 없거나 평균의 절반 미만인 담당 학생입니다.</p>
                        </div>
                    </div>
                    <div className={styles.statsPillList}>
                        {studentsNeedingRecords.length === 0 && <div className={styles.emptyList}>기록이 부족한 표시 학생이 없습니다.</div>}
                        {studentsNeedingRecords.map(({ student }) => (
                            <button key={student.id} type="button" onClick={() => onModeChange('records')}>
                                <span>{student.number}번</span>
                                {student.name}
                            </button>
                        ))}
                    </div>
                </article>

                <article className={styles.statsPanel}>
                    <div className={styles.panelTitle}>
                        <Handshake size={22} />
                        <div>
                            <h2>모둠별 활동 균형</h2>
                            <p>멘토·멘티 표의 △/○ 표시가 어느 모둠에 몰렸는지 봅니다.</p>
                        </div>
                    </div>
                    <div className={styles.groupBalanceList}>
                        {groupBalanceStats.length === 0 && <div className={styles.emptyList}>아직 모둠이 없습니다.</div>}
                        {groupBalanceStats.map((group) => {
                            const total = group.participated + group.excellent;
                            return (
                                <div key={group.title} className={styles.groupBalanceRow}>
                                    <strong>{group.title}</strong>
                                    <span>{group.names}</span>
                                    <div>
                                        <i style={{ width: `${Math.max(8, (total / maxGroupCount) * 100)}%` }} />
                                    </div>
                                    <em>참여 {group.participated} · 매우 잘함 {group.excellent}</em>
                                </div>
                            );
                        })}
                    </div>
                </article>
            </div>

            <div className={styles.statsGrid}>
                <article className={styles.statsPanel}>
                    <div className={styles.panelTitle}>
                        <BarChart3 size={22} />
                        <div>
                            <h2>학생별 기록 수</h2>
                            <p>누적 관찰 메모 기준</p>
                        </div>
                    </div>
                    <div className={styles.barList}>
                        {topStudentStats.map(({ student, count }) => (
                            <div key={student.id} className={styles.barRow}>
                                <span>{student.name}</span>
                                <div><i style={{ width: `${Math.max(8, (count / maxStudentCount) * 100)}%` }} /></div>
                                <em>{count}</em>
                            </div>
                        ))}
                    </div>
                </article>

                <article className={styles.statsPanel}>
                    <div className={styles.panelTitle}>
                        <Sparkles size={22} />
                        <div>
                            <h2>태그 빈도</h2>
                            <p>최근 관찰 메모에서 자주 나온 키워드</p>
                        </div>
                    </div>
                    <div className={styles.barList}>
                        {tagStats.length === 0 && <div className={styles.emptyList}>태그 데이터가 없습니다.</div>}
                        {tagStats.map((item) => (
                            <div key={item.tag} className={styles.barRow}>
                                <span>{item.tag}</span>
                                <div><i style={{ width: `${Math.max(8, (item.count / maxTagCount) * 100)}%` }} /></div>
                                <em>{item.count}</em>
                            </div>
                        ))}
                    </div>
                </article>

                <article className={styles.statsPanel}>
                    <div className={styles.panelTitle}>
                        <ClipboardList size={22} />
                        <div>
                            <h2>최근 기록</h2>
                            <p>통계에서 바로 성장 기록으로 이동할 수 있습니다.</p>
                        </div>
                    </div>
                    <div className={styles.compactList}>
                        {observations.slice(0, 4).map((observation) => (
                            <div key={observation.id} className={styles.compactItem}>
                                <strong>{getStudentDisplay(observation.studentId)}</strong>
                                <span>{formatShortDate(observation.date)} · {observation.lessonTopic || observation.memo.slice(0, 40)}</span>
                            </div>
                        ))}
                    </div>
                    <button type="button" className={styles.primaryActionButton} onClick={() => onModeChange('growth')}>
                        <Sparkles size={17} />
                        성장 기록으로 이동
                    </button>
                </article>
            </div>
        </section>
    );
}

function NoticeBoard({
    notices,
    draft,
    onDraftChange,
    onAddNotice,
    onToggleNotice,
    onDeleteNotice,
}: {
    notices: NoticeItem[];
    draft: { title: string; body: string; dueDate: string };
    onDraftChange: (draft: { title: string; body: string; dueDate: string }) => void;
    onAddNotice: () => void;
    onToggleNotice: (id: string) => void;
    onDeleteNotice: (id: string) => void;
}) {
    return (
        <section className={styles.dashboardView}>
            <div className={styles.noticeLayout}>
                <article className={styles.noticeForm}>
                    <div className={styles.panelTitle}>
                        <Megaphone size={22} />
                        <div>
                            <h2>알림 작성</h2>
                            <p>관찰2 전용 알림은 이 브라우저에 저장됩니다.</p>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={draft.title}
                        onChange={(event) => onDraftChange({ ...draft, title: event.target.value })}
                        placeholder="알림 제목"
                    />
                    <textarea
                        value={draft.body}
                        onChange={(event) => onDraftChange({ ...draft, body: event.target.value })}
                        placeholder="전달할 내용"
                    />
                    <input
                        type="date"
                        value={draft.dueDate}
                        onChange={(event) => onDraftChange({ ...draft, dueDate: event.target.value })}
                    />
                    <button type="button" onClick={onAddNotice}>
                        <Plus size={17} />
                        알림 추가
                    </button>
                </article>

                <div className={styles.noticeList}>
                    {notices.length === 0 && <div className={styles.emptyList}>작성된 알림이 없습니다.</div>}
                    {notices.map((notice) => (
                        <article key={notice.id} className={`${styles.noticeCard} ${notice.completed ? styles.noticeDone : ''}`}>
                            <button type="button" onClick={() => onToggleNotice(notice.id)} aria-label="완료 상태 변경">
                                <CheckCircle2 size={19} />
                            </button>
                            <div>
                                <strong>{notice.title}</strong>
                                <span>{formatFullDate(notice.dueDate)} · {notice.completed ? '완료' : '진행 중'}</span>
                                {notice.body && <p>{notice.body}</p>}
                            </div>
                            <button type="button" onClick={() => onDeleteNotice(notice.id)} aria-label="알림 삭제">
                                <Trash2 size={18} />
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SettingsDashboard({
    teacherClasses,
    selectedClassId,
    visibleRosterCount,
    noticesCount,
    hasRealStudents,
    onClassChange,
    onVisibleRosterCountChange,
    onResetMarks,
    onClearNotices,
    onModeChange,
}: {
    teacherClasses: ClassGroup[];
    selectedClassId: string;
    visibleRosterCount: VisibleRosterCount;
    noticesCount: number;
    hasRealStudents: boolean;
    onClassChange: (classId: string) => void;
    onVisibleRosterCountChange: (count: VisibleRosterCount) => void;
    onResetMarks: () => void;
    onClearNotices: () => void;
    onModeChange: (mode: BoardMode) => void;
}) {
    return (
        <section className={styles.dashboardView}>
            <div className={styles.settingsGrid}>
                <article className={styles.settingPanel}>
                    <div className={styles.panelTitle}>
                        <Settings size={22} />
                        <div>
                            <h2>기본 선택 학급</h2>
                            <p>멘토·멘티 화면에 사용할 학급 범위를 고릅니다.</p>
                        </div>
                    </div>
                    <div className={styles.classButtonGrid}>
                        <button
                            type="button"
                            className={selectedClassId === 'all' ? styles.classChipActive : ''}
                            onClick={() => onClassChange('all')}
                        >
                            전체 담당 학급
                        </button>
                        {teacherClasses.map((cls) => (
                            <button
                                key={cls.id}
                                type="button"
                                className={selectedClassId === cls.id ? styles.classChipActive : ''}
                                onClick={() => onClassChange(cls.id)}
                            >
                                {cls.grade}학년 {cls.classNumber}반
                            </button>
                        ))}
                    </div>
                </article>

                <article className={styles.settingPanel}>
                    <div className={styles.panelTitle}>
                        <Users size={22} />
                        <div>
                            <h2>표시 학생 수</h2>
                            <p>학생 목록 패널에 처음 보이는 인원을 조정합니다.</p>
                        </div>
                    </div>
                    <div className={styles.segmentedControl}>
                        {visibleRosterCountOptions.map((count) => (
                            <button
                                key={count}
                                type="button"
                                className={visibleRosterCount === count ? styles.segmentedActive : ''}
                                onClick={() => onVisibleRosterCountChange(count)}
                            >
                                {count === 'all' ? '전체' : `${count}명`}
                            </button>
                        ))}
                    </div>
                </article>

                <article className={styles.settingPanel}>
                    <div className={styles.panelTitle}>
                        <Sparkles size={22} />
                        <div>
                            <h2>데이터 상태</h2>
                            <p>{hasRealStudents ? '실제 명렬표 데이터를 사용 중입니다.' : '담당 학급 학생이 아직 없습니다.'}</p>
                        </div>
                    </div>
                    <div className={styles.settingActions}>
                        <button type="button" onClick={onResetMarks}>
                            <Triangle size={17} />
                            △/○ 초기화
                        </button>
                        <button type="button" onClick={onClearNotices} disabled={noticesCount === 0}>
                            <Trash2 size={17} />
                            알림장 초기화
                        </button>
                        <button type="button" onClick={() => onModeChange('records')}>
                            <BookOpen size={17} />
                            관찰 메모 작성 열기
                        </button>
                    </div>
                </article>
            </div>
        </section>
    );
}

function MentorActivityView({
    teacherClasses,
    teacherStudents,
    selectedClassId,
    boardStudents,
    featuredStudents,
    mentorGroups,
    editingGroupId,
    editingGroupMembers,
    sessions,
    marks,
    totalExcellent,
    visibleRosterCount,
    onAddStudentToGroup,
    onChangeMemberRole,
    onChangeEditingMemberRole,
    onEditGroup,
    onStageGroupStudent,
    onRemoveGroupStudent,
    onSaveGroupEdit,
    onCancelGroupEdit,
    onClassChange,
    onAddGroup,
    onDeleteGroup,
    onResetAssignments,
    onAddSession,
    onUpdateSession,
    onUpdateMark,
}: {
    teacherClasses: ClassGroup[];
    teacherStudents: Student[];
    selectedClassId: string;
    boardStudents: Student[];
    featuredStudents: Student[];
    mentorGroups: MentorGroupView[];
    editingGroupId: string | null;
    editingGroupMembers: ObservationBoardGroupMember[];
    sessions: ActivitySession[];
    marks: Record<string, MarkState>;
    totalExcellent: number;
    visibleRosterCount: VisibleRosterCount;
    onAddStudentToGroup: (studentId: string, groupId: string) => void;
    onChangeMemberRole: (groupId: string, studentId: string, role: MentorRole) => void;
    onChangeEditingMemberRole: (studentId: string, role: MentorRole) => void;
    onEditGroup: (groupId: string) => void;
    onStageGroupStudent: (studentId: string) => void;
    onRemoveGroupStudent: (studentId: string) => void;
    onSaveGroupEdit: () => void;
    onCancelGroupEdit: () => void;
    onClassChange: (classId: string) => void;
    onAddGroup: () => void;
    onDeleteGroup: (groupId: string) => void;
    onResetAssignments: () => void;
    onAddSession: () => void;
    onUpdateSession: (sessionId: string, field: 'date' | 'topic', value: string) => void;
    onUpdateMark: (studentId: string, session: ActivitySession, fallback: MarkState) => void;
}) {
    const editingMemberIds = useMemo(
        () => new Set(editingGroupMembers.map((member) => member.studentId)),
        [editingGroupMembers]
    );
    const availableRosterStudents = useMemo(() => {
        const assignedStudentIds = new Set<string>();
        mentorGroups.forEach((group) => {
            group.members.forEach((member) => {
                assignedStudentIds.add(member.student.id);
            });
        });
        editingMemberIds.forEach((studentId) => assignedStudentIds.add(studentId));

        return boardStudents.filter((student) => !assignedStudentIds.has(student.id));
    }, [boardStudents, editingMemberIds, mentorGroups]);
    const rosterStudents = useMemo(
        () => getVisibleRosterStudents(availableRosterStudents, visibleRosterCount),
        [availableRosterStudents, visibleRosterCount]
    );
    const [activeTab, setActiveTab] = useState<MentorActivityTab>('groups');

    const startStudentDrag = (event: DragEvent<HTMLElement>, studentId: string) => {
        event.dataTransfer.setData('text/plain', studentId);
        event.dataTransfer.effectAllowed = 'move';
    };

    const dropStudentToGroup = (event: DragEvent<HTMLElement>, groupId: string) => {
        event.preventDefault();
        const studentId = event.dataTransfer.getData('text/plain');
        if (!studentId) return;
        onAddStudentToGroup(studentId, groupId);
    };
    const dropStudentToEditor = (event: DragEvent<HTMLElement>) => {
        event.preventDefault();
        const studentId = event.dataTransfer.getData('text/plain');
        if (!studentId) return;
        onStageGroupStudent(studentId);
    };
    const editingGroup = mentorGroups.find((group) => group.id === editingGroupId);

    return (
        <>
            <div className={styles.mentorTabHeader} role="tablist" aria-label="멘토·멘티 화면 선택">
                <button
                    id="mentor-groups-tab"
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'groups'}
                    aria-controls="mentor-groups-panel"
                    className={`${styles.mentorTabButton} ${activeTab === 'groups' ? styles.mentorTabButtonActive : ''}`}
                    onClick={() => setActiveTab('groups')}
                >
                    <Users size={20} />
                    멘토·멘티 구성
                </button>
                <button
                    id="mentor-records-tab"
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'records'}
                    aria-controls="mentor-records-panel"
                    className={`${styles.mentorTabButton} ${activeTab === 'records' ? styles.mentorTabButtonActive : ''}`}
                    onClick={() => setActiveTab('records')}
                >
                    <ClipboardList size={20} />
                    활동 기록
                </button>
            </div>

            <main className={styles.mentorTabWorkspace}>
                {activeTab === 'groups' && (
                    <section
                        id="mentor-groups-panel"
                        role="tabpanel"
                        aria-labelledby="mentor-groups-tab"
                        className={styles.mentorPanel}
                    >
                        <div className={styles.panelTitle}>
                            <img src="/observation-board-2/panel-kids.png" alt="" className={styles.panelTitleImage} aria-hidden="true" />
                            <div>
                                <h2>멘토·멘티 구성</h2>
                                <p>{featuredStudents.length}명 표시 · 전체 {boardStudents.length}명</p>
                            </div>
                        </div>

                        <ClassScopeSelect
                            teacherClasses={teacherClasses}
                            teacherStudents={teacherStudents}
                            selectedClassId={selectedClassId}
                            onClassChange={onClassChange}
                            ariaLabel="멘토 화면 학급 선택"
                        />

                        <div className={styles.yellowNotice}>
                            <Handshake size={18} />
                            학생을 드래그해서 멘토와 멘티를 연결해 보세요!
                        </div>

                        <div className={styles.groupStack}>
                            {mentorGroups.length === 0 && (
                                <div className={styles.mentorEmptyState}>
                                    {boardStudents.length === 0
                                        ? '해당 학급 학생이 없습니다. 수업 학급을 먼저 등록하면 멘토·멘티를 구성할 수 있습니다.'
                                        : '멘토·멘티 모둠이 비어 있습니다. 모둠 추가를 눌러 새 모둠을 만들 수 있습니다.'}
                                </div>
                            )}
                            {mentorGroups.map((group) => (
                                <motion.article
                                    key={group.id}
                                    className={styles.groupCard}
                                    initial={false}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.12 }}
                                >
                                    <div className={styles.groupHeader}>
                                        <span className={styles.groupTitle}>
                                            <strong>{group.title}</strong>
                                            <Star size={17} />
                                            <em>{group.members.length}명</em>
                                        </span>
                                        <button
                                            type="button"
                                            className={styles.editGroupButton}
                                            onClick={() => onEditGroup(group.id)}
                                            title="모둠 수정"
                                            aria-label={`${group.title} 모둠 수정`}
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.deleteGroupButton}
                                            onClick={() => onDeleteGroup(group.id)}
                                            title="모둠 삭제"
                                            aria-label={`${group.title} 모둠 삭제`}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                    <div className={styles.memberGrid}>
                                        {group.members.length < maxMentorGroupMembers && (
                                            <button
                                                type="button"
                                                className={styles.emptyMemberSlot}
                                                onDragOver={(event) => event.preventDefault()}
                                                onDrop={(event) => dropStudentToGroup(event, group.id)}
                                                onClick={() => onEditGroup(group.id)}
                                            >
                                                <UserPlus size={16} />
                                                학생 추가
                                            </button>
                                        )}
                                        {group.members.map((member) => (
                                            <GroupMemberToken
                                                key={member.student.id}
                                                member={member}
                                                onDragStart={(event, studentId) => startStudentDrag(event, studentId)}
                                                onRoleChange={(studentId, role) => onChangeMemberRole(group.id, studentId, role)}
                                            />
                                        ))}
                                    </div>
                                    <div className={styles.pairRow}>
                                        <StudentToken
                                            student={group.mentor}
                                            role="멘토"
                                            tone="blue"
                                            onDragStart={(event, studentId) => startStudentDrag(event, studentId)}
                                            onDrop={(event) => dropStudentToGroup(event, group.id)}
                                        />
                                        <div className={styles.handshakeMark}>
                                            <Handshake size={22} />
                                        </div>
                                        <StudentToken
                                            student={group.mentee}
                                            role="멘티"
                                            tone="pink"
                                            onDragStart={(event, studentId) => startStudentDrag(event, studentId)}
                                            onDrop={(event) => dropStudentToGroup(event, group.id)}
                                        />
                                    </div>
                                </motion.article>
                            ))}
                        </div>

                        {editingGroup && (
                            <div
                                className={styles.groupEditPanel}
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={dropStudentToEditor}
                            >
                                <div className={styles.groupEditHeader}>
                                    <div>
                                        <strong>{editingGroup.title} 선택 모둠만 수정</strong>
                                        <span>{editingGroupMembers.length}/4명 · 학생 목록에서 더블클릭하거나 드래그</span>
                                    </div>
                                    <button type="button" onClick={onCancelGroupEdit} aria-label="수정 취소">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className={styles.groupEditMembers}>
                                    {editingGroupMembers.length === 0 && (
                                        <div className={styles.groupEditEmpty}>
                                            <UserPlus size={18} />
                                            학생을 여기에 끌어 놓으세요.
                                        </div>
                                    )}
                                    {editingGroupMembers.map((member) => {
                                        const student = boardStudents.find((item) => item.id === member.studentId);
                                        if (!student) return null;

                                        return (
                                            <div key={member.studentId} className={styles.groupEditMember}>
                                                <span className={styles.smallAvatar}>{formatStudentNumber(student.number)}</span>
                                                <strong>{student.name}</strong>
                                                <select
                                                    className={styles.roleSelect}
                                                    value={member.role}
                                                    onChange={(event) => onChangeEditingMemberRole(member.studentId, event.target.value as MentorRole)}
                                                    aria-label={`${student.name} 역할 선택`}
                                                >
                                                    {mentorRoleOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                                <button type="button" onClick={() => onRemoveGroupStudent(member.studentId)} aria-label="학생 제거">
                                                    <MinusCircle size={15} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={styles.groupEditActions}>
                                    <button type="button" onClick={onSaveGroupEdit}>
                                        <Save size={16} />
                                        이 모둠만 저장
                                    </button>
                                    <button type="button" onClick={onCancelGroupEdit}>
                                        <X size={16} />
                                        변경 취소
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={styles.mentorActionRow}>
                            <button type="button" className={styles.addGroupButton} onClick={onAddGroup}>
                                <Plus size={17} />
                                모둠 추가
                            </button>
                            <button type="button" className={styles.resetMentorButton} onClick={onResetAssignments}>
                                <RotateCcw size={17} />
                                모둠 비우기
                            </button>
                        </div>

                        <div className={styles.rosterTray}>
                            <div className={styles.trayTitle}>
                                학생 목록
                                <span>{availableRosterStudents.length}명</span>
                            </div>
                            <div className={styles.rosterGrid}>
                                {boardStudents.length === 0 && (
                                    <div className={styles.rosterEmptyState}>담당 학급 학생만 여기에 표시됩니다.</div>
                                )}
                                {boardStudents.length > 0 && availableRosterStudents.length === 0 && (
                                    <div className={styles.rosterEmptyState}>모둠에 배정되지 않은 학생이 없습니다.</div>
                                )}
                                {rosterStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className={`${styles.rosterItem} ${editingMemberIds.has(student.id) ? styles.rosterItemSelected : ''}`}
                                        draggable
                                        onDragStart={(event) => startStudentDrag(event, student.id)}
                                        onDoubleClick={() => onStageGroupStudent(student.id)}
                                        title={`${student.name} 드래그`}
                                    >
                                        <span>{formatStudentNumber(student.number)}</span>
                                        {student.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'records' && (
                    <section
                        id="mentor-records-panel"
                        role="tabpanel"
                        aria-labelledby="mentor-records-tab"
                        className={styles.recordPanel}
                    >
                        <div className={styles.recordHeader}>
                            <div className={styles.panelTitle}>
                                <img src="/observation-board-2/panel-record.png" alt="" className={styles.panelTitleImage} aria-hidden="true" />
                                <div>
                                    <h2>멘토·멘티 활동 기록</h2>
                                    <p>{sessions.length}차시 · 매우 잘함 {totalExcellent}회</p>
                                </div>
                            </div>
                            <div className={styles.legend}>
                                <span>
                                    <Triangle size={18} />
                                    참여함 +1 쿠키
                                </span>
                                <span>
                                    <Circle size={18} />
                                    매우 잘함 +2 쿠키
                                </span>
                            </div>
                        </div>

                        <div className={styles.sessionNote}>
                            <CalendarDays size={18} />
                            <span>차시를 클릭하면 활동 상태와 쿠키가 함께 반영됩니다.</span>
                        </div>

                        <div className={styles.tableShell}>
                            <div
                                className={styles.activityTable}
                                role="table"
                                aria-label="멘토·멘티 차시별 활동 기록"
                                style={{
                                    gridTemplateColumns: `46px 86px repeat(${sessions.length}, minmax(96px, 1fr)) 72px`,
                                    minWidth: `${Math.max(700, 204 + sessions.length * 96)}px`,
                                }}
                            >
                                <div className={styles.tableHeaderCell} role="columnheader">차시</div>
                                {sessions.map((session) => (
                                    <div key={session.id} className={styles.sessionNumberHeader} role="columnheader">
                                        <strong>{session.label}</strong>
                                    </div>
                                ))}
                                <button type="button" className={styles.addSessionButton} aria-label="차시 추가" onClick={onAddSession}>
                                    <Plus size={20} />
                                    <span>추가</span>
                                </button>

                                <div className={styles.sessionRowLabel}>날짜 (선택)</div>
                                {sessions.map((session) => (
                                    <label key={`${session.id}-date`} className={styles.sessionEditCell}>
                                        <input
                                            type="text"
                                            value={session.date}
                                            onChange={(event) => onUpdateSession(session.id, 'date', event.target.value)}
                                            placeholder="날짜"
                                            aria-label={`${session.label} 날짜`}
                                        />
                                    </label>
                                ))}

                                <div className={styles.sessionRowLabel}>주제 (선택)</div>
                                {sessions.map((session) => (
                                    <label key={`${session.id}-topic`} className={styles.sessionEditCell}>
                                        <input
                                            type="text"
                                            value={session.topic}
                                            onChange={(event) => onUpdateSession(session.id, 'topic', event.target.value)}
                                            placeholder="내용"
                                            aria-label={`${session.label} 내용`}
                                        />
                                    </label>
                                ))}

                                {mentorGroups.map((group) => (
                                    <ActivityGroupRows
                                        key={group.id}
                                        groupTitle={group.title}
                                        members={group.members}
                                        sessions={sessions}
                                        marks={marks}
                                        onUpdateMark={onUpdateMark}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {activeTab === 'records' && (
                <section className={styles.guideBanner}>
                    <div>
                        <strong>활동 기록 안내</strong>
                        <span>
                            <Triangle size={17} />
                            참여 +1 쿠키
                        </span>
                        <span>
                            <Circle size={17} />
                            매우 잘함 +2 쿠키
                        </span>
                        <span>빈칸 0 쿠키</span>
                    </div>
                    <p>
                        함께 성장하는 우리, 최고예요!
                        <CheckCircle2 size={18} />
                    </p>
                </section>
            )}
        </>
    );
}

function ObservationRecordsView({
    filteredStudents,
    selectedStudentIds,
    selectedStudents,
    observations,
    observationStatsByStudent,
    isLoadingObservations,
    commonDate,
    commonLessonTopic,
    commonTags,
    availableTagOptions,
    customTagInput,
    studentDrafts,
    isSaving,
    getClassDisplay,
    getStudentDisplay,
    onToggleStudent,
    onToggleAll,
    onClearSelected,
    onCommonDateChange,
    onCommonLessonTopicChange,
    onToggleCommonTag,
    onCustomTagInputChange,
    onAddCustomTag,
    onToggleStudentTag,
    onUpdateStudentDraft,
    onSave,
    onOpenDetail,
    onDelete,
}: {
    filteredStudents: Student[];
    selectedStudentIds: Set<string>;
    selectedStudents: Student[];
    observations: Observation[];
    observationStatsByStudent: Map<string, ObservationCardStats>;
    isLoadingObservations: boolean;
    commonDate: string;
    commonLessonTopic: string;
    commonTags: string[];
    availableTagOptions: string[];
    customTagInput: string;
    studentDrafts: Record<string, ObservationDraftRow>;
    isSaving: boolean;
    getClassDisplay: (classId?: string) => string;
    getStudentDisplay: (studentId: string) => string;
    onToggleStudent: (studentId: string) => void;
    onToggleAll: () => void;
    onClearSelected: () => void;
    onCommonDateChange: (date: string) => void;
    onCommonLessonTopicChange: (topic: string) => void;
    onToggleCommonTag: (tag: string) => void;
    onCustomTagInputChange: (value: string) => void;
    onAddCustomTag: () => void;
    onToggleStudentTag: (studentId: string, tag: string) => void;
    onUpdateStudentDraft: (studentId: string, field: 'lessonTopic' | 'memo', value: string) => void;
    onSave: () => void;
    onOpenDetail: (observation: Observation) => void;
    onDelete: (id: string) => void;
}) {
    const selectedAll = filteredStudents.length > 0 && selectedStudentIds.size === filteredStudents.length;

    return (
        <main className={styles.recordsWorkspace}>
            <section className={styles.recordsStudentPanel}>
                <div className={styles.panelTitle}>
                    <Users size={22} />
                    <div>
                        <h2>학생 선택</h2>
                        <p>{selectedStudentIds.size}명 선택 · {filteredStudents.length}명 표시</p>
                    </div>
                </div>

                <div className={styles.selectionActions}>
                    <button type="button" onClick={onToggleAll} disabled={filteredStudents.length === 0}>
                        <Users size={16} />
                        {selectedAll ? '전체 해제' : '전체 선택'}
                    </button>
                    <button type="button" onClick={onClearSelected} disabled={selectedStudentIds.size === 0}>
                        <X size={16} />
                        선택 해제
                    </button>
                </div>

                <div className={styles.studentRecordGrid}>
                    {filteredStudents.map((student, index) => {
                        const stats = observationStatsByStudent.get(student.id) ?? { count: 0, cookieCount: 0 };
                        const isSelected = selectedStudentIds.has(student.id);
                        return (
                            <motion.button
                                key={student.id}
                                type="button"
                                className={`${styles.studentRecordCard} ${isSelected ? styles.studentRecordCardSelected : ''}`}
                                onClick={() => onToggleStudent(student.id)}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.01, 0.16) }}
                            >
                                <span className={styles.studentRecordNumber}>{student.number}</span>
                                <strong>{student.name}</strong>
                                <small>{student.grade}학년 {student.classNumber}반</small>
                                <em>{stats.count}건 · {formatShortDate(stats.latest?.date || stats.latest?.createdAt)}</em>
                            </motion.button>
                        );
                    })}
                </div>
            </section>

            <section className={styles.composePanel}>
                <div className={styles.panelTitle}>
                    <BookOpen size={22} />
                    <div>
                        <h2>관찰 메모 작성</h2>
                        <p>관찰2 분위기에 맞춘 일괄 메모 입력</p>
                    </div>
                </div>

                <div className={styles.composeTopBar}>
                    <label>
                        날짜
                        <input
                            type="date"
                            value={commonDate}
                            onChange={(event) => onCommonDateChange(event.target.value)}
                        />
                    </label>
                    <label>
                        공통 수업 주제
                        <input
                            type="text"
                            value={commonLessonTopic}
                            onChange={(event) => onCommonLessonTopicChange(event.target.value)}
                            placeholder="예: 협동 문제 해결 활동"
                        />
                    </label>
                </div>

                <div className={styles.tagBoard}>
                    {availableTagOptions.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            className={commonTags.includes(tag) ? styles.tagButtonActive : ''}
                            onClick={() => onToggleCommonTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                    <div className={styles.customTagBox}>
                        <input
                            type="text"
                            value={customTagInput}
                            onChange={(event) => onCustomTagInputChange(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    onAddCustomTag();
                                }
                            }}
                            placeholder="태그 추가"
                        />
                        <button type="button" onClick={onAddCustomTag}>
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                <div className={styles.draftList}>
                    {selectedStudents.length === 0 ? (
                        <div className={styles.emptyDraft}>
                            <ClipboardList size={36} />
                            <p>왼쪽에서 학생을 선택하면 관찰 메모 입력 칸이 열립니다.</p>
                        </div>
                    ) : (
                        selectedStudents.map((student) => {
                            const draft = studentDrafts[student.id] ?? createEmptyDraft();
                            return (
                                <article key={student.id} className={styles.draftRow}>
                                    <div className={styles.draftStudent}>
                                        <span>{formatStudentNumber(student.number)}</span>
                                        <div>
                                            <strong>{student.name}</strong>
                                            <small>{student.number}번</small>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={draft.lessonTopic}
                                        onChange={(event) => onUpdateStudentDraft(student.id, 'lessonTopic', event.target.value)}
                                        placeholder="개별 주제 보충"
                                    />
                                    <div className={styles.studentTagStrip}>
                                        {availableTagOptions.slice(0, 7).map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                className={draft.tags.includes(tag) ? styles.tagButtonActive : ''}
                                                onClick={() => onToggleStudentTag(student.id, tag)}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={draft.memo}
                                        onChange={(event) => onUpdateStudentDraft(student.id, 'memo', event.target.value)}
                                        placeholder="질문, 수행, 협력, 발표, 변화가 보인 장면을 구체적으로 적어주세요."
                                    />
                                </article>
                            );
                        })
                    )}
                </div>

                <div className={styles.composeActions}>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving || selectedStudents.length === 0}
                    >
                        <Save size={17} />
                        {isSaving ? '저장 중' : '관찰 기록 저장'}
                    </button>
                </div>
            </section>

            <section className={styles.observationListPanel}>
                <div className={styles.panelTitle}>
                    <ClipboardList size={22} />
                    <div>
                        <h2>최근 관찰 기록</h2>
                        <p>{observations.length}건 표시</p>
                    </div>
                </div>

                {isLoadingObservations ? (
                    <div className={styles.emptyList}>관찰 기록을 불러오는 중입니다.</div>
                ) : observations.length === 0 ? (
                    <div className={styles.emptyList}>아직 표시할 관찰 기록이 없습니다.</div>
                ) : (
                    <div className={styles.observationList}>
                        {observations.slice(0, 8).map((observation) => (
                            <article key={observation.id} className={styles.observationCard}>
                                <div>
                                    <strong>{getStudentDisplay(observation.studentId)}</strong>
                                    <span>{getClassDisplay(observation.classId)} · {formatShortDate(observation.date)}</span>
                                </div>
                                {observation.lessonTopic && <h3>{observation.lessonTopic}</h3>}
                                <p>{observation.memo.length > 150 ? `${observation.memo.slice(0, 150)}...` : observation.memo}</p>
                                <div className={styles.observationTags}>
                                    <span>{observation.sourceType === 'ocr' ? 'OCR' : '수동'}</span>
                                    {observation.tags.slice(0, 4).map((tag) => (
                                        <span key={tag}>{tag}</span>
                                    ))}
                                </div>
                                <div className={styles.observationActions}>
                                    <button type="button" onClick={() => onOpenDetail(observation)} title="상세 보기">
                                        <Eye size={16} />
                                    </button>
                                    <button type="button" onClick={() => onDelete(observation.id)} title="삭제">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

function StudentToken({
    student,
    role,
    tone,
    onDragStart,
    onDrop,
}: {
    student?: Student;
    role: string;
    tone: 'blue' | 'pink';
    onDragStart: (event: DragEvent<HTMLElement>, studentId: string) => void;
    onDrop: (event: DragEvent<HTMLElement>) => void;
}) {
    const handleDragOver = (event: DragEvent<HTMLElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    if (!student) {
        return (
            <div
                className={`${styles.studentToken} ${styles.emptyToken}`}
                onDragOver={handleDragOver}
                onDrop={onDrop}
            >
                <span className={styles.roleLabel}>{role}</span>
                <strong>여기에 놓기</strong>
            </div>
        );
    }

    return (
        <div
            className={`${styles.studentToken} ${tone === 'blue' ? styles.tokenBlue : styles.tokenPink}`}
            draggable
            onDragStart={(event) => onDragStart(event, student.id)}
            onDragOver={handleDragOver}
            onDrop={onDrop}
            title={`${student.name} 드래그해서 자리 바꾸기`}
        >
            <span className={styles.avatar}>{formatStudentNumber(student.number)}</span>
            <span className={styles.roleLabel}>{role}</span>
            <strong>{student.name}</strong>
        </div>
    );
}

function GroupMemberToken({
    member,
    onDragStart,
    onRoleChange,
}: {
    member: MentorGroupMemberView;
    onDragStart: (event: DragEvent<HTMLElement>, studentId: string) => void;
    onRoleChange: (studentId: string, role: MentorRole) => void;
}) {
    return (
        <div
            className={styles.groupMemberToken}
            draggable
            onDragStart={(event) => onDragStart(event, member.student.id)}
            title={`${member.student.name} drag`}
        >
            <span className={styles.smallAvatar}>{formatStudentNumber(member.student.number)}</span>
            <div>
                <strong>{member.student.name}</strong>
                <select
                    className={styles.roleSelect}
                    value={member.role}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => onRoleChange(member.student.id, event.target.value as MentorRole)}
                    aria-label={`${member.student.name} 역할 선택`}
                >
                    {mentorRoleOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

function ActivityGroupRows({
    groupTitle,
    members,
    sessions,
    marks,
    onUpdateMark,
}: {
    groupTitle: string;
    members: MentorGroupMemberView[];
    sessions: ActivitySession[];
    marks: Record<string, MarkState>;
    onUpdateMark: (studentId: string, session: ActivitySession, fallback: MarkState) => void;
}) {
    if (members.length === 0) return null;

    return (
        <>
            {members.map((member, studentIndex) => {
                const student = member.student;
                return (
                    <div className={styles.studentRow} role="row" key={student.id}>
                        {studentIndex === 0 && (
                            <div
                                className={styles.groupLabel}
                                role="rowheader"
                                style={{ gridRow: `span ${members.length}` }}
                            >
                                {groupTitle}
                            </div>
                        )}
                        <div className={styles.studentNameCell}>
                            <span className={styles.smallAvatar}>{formatStudentNumber(student.number)}</span>
                            <div>
                                <strong>{student.name}</strong>
                                <span>{getRoleLabel(member.role)}</span>
                            </div>
                        </div>
                        {sessions.map((session) => {
                            const fallback = getDefaultMark();
                            const mark = marks[`${student.id}:${session.id}`] ?? fallback;

                            return (
                                <button
                                    key={session.id}
                                    type="button"
                                    className={`${styles.markButton} ${styles[`mark-${mark}`]}`}
                                    onClick={() => onUpdateMark(student.id, session, fallback)}
                                    aria-label={`${student.name} ${session.label} 활동 상태 변경`}
                                >
                                    {mark === 'participated' && <Triangle size={28} />}
                                    {mark === 'excellent' && <Circle size={28} />}
                                </button>
                            );
                        })}
                        <div className={styles.rowSpacer} aria-hidden="true" />
                    </div>
                );
            })}
        </>
    );
}

function ObservationDetailModal({
    observation,
    getClassDisplay,
    getStudentDisplay,
    onClose,
    onDelete,
}: {
    observation: Observation;
    getClassDisplay: (classId?: string) => string;
    getStudentDisplay: (studentId: string) => string;
    onClose: () => void;
    onDelete: (id: string) => void;
}) {
    return (
        <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.detailModal}
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                onClick={(event) => event.stopPropagation()}
            >
                <header>
                    <h2>
                        <ClipboardList size={20} />
                        관찰 기록 상세
                    </h2>
                    <button type="button" onClick={onClose} aria-label="닫기">
                        <X size={20} />
                    </button>
                </header>
                <dl>
                    <div>
                        <dt>학생</dt>
                        <dd>{getStudentDisplay(observation.studentId)}</dd>
                    </div>
                    <div>
                        <dt>수업</dt>
                        <dd>{getClassDisplay(observation.classId)}</dd>
                    </div>
                    <div>
                        <dt>날짜</dt>
                        <dd>{observation.date}</dd>
                    </div>
                    <div>
                        <dt>수업 주제</dt>
                        <dd>{observation.lessonTopic || '미입력'}</dd>
                    </div>
                    <div>
                        <dt>출처</dt>
                        <dd>{observation.sourceType === 'ocr' ? 'OCR 분석' : '수동 입력'}</dd>
                    </div>
                </dl>
                <div className={styles.detailTags}>
                    {observation.tags.length === 0 ? (
                        <span>태그 없음</span>
                    ) : (
                        observation.tags.map((tag) => <span key={tag}>{tag}</span>)
                    )}
                </div>
                <p className={styles.detailMemo}>{observation.memo}</p>
                <footer>
                    <button type="button" onClick={() => onDelete(observation.id)}>
                        <Trash2 size={16} />
                        삭제
                    </button>
                    <button type="button" onClick={onClose}>
                        닫기
                    </button>
                </footer>
            </motion.div>
        </motion.div>
    );
}
