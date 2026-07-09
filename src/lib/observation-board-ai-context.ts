export type ObservationBoardMarkState = 'none' | 'participated' | 'excellent';

export interface ObservationBoardActivitySession {
    id: string;
    label: string;
    date: string;
    topic: string;
}

interface ObservationBoardSessionMark {
    sessionId: string;
    label: string;
    date?: string;
    topic?: string;
    mark: Exclude<ObservationBoardMarkState, 'none'>;
    markLabel: string;
    roleContext?: ObservationBoardRoleContext;
}

export type ObservationBoardMentorRole = 'mentor' | 'mentee' | 'member';

export interface ObservationBoardGroupMember {
    studentId: string;
    role: ObservationBoardMentorRole;
    order: number;
}

export interface ObservationBoardMentorAssignment {
    id: string;
    title: string;
    mentorId?: string;
    menteeId?: string;
    members?: ObservationBoardGroupMember[];
}

export type ObservationBoardMentorAssignmentsByClass = Record<string, ObservationBoardMentorAssignment[]>;
export type ObservationBoardMentorAssignmentSnapshotsByClass = Record<
    string,
    Record<string, ObservationBoardMentorAssignment[]>
>;
export type ObservationBoardActivitySessionsByClass = Record<string, ObservationBoardActivitySession[]>;

interface ObservationBoardRoleContext {
    role: ObservationBoardMentorRole;
    roleLabel: string;
    groupTitle?: string;
    classId?: string;
}

interface ObservationBoardDerivedSummary {
    totalSessions: number;
    markedSessions: number;
    participatedCount: number;
    excellentCount: number;
    participationRate: number;
    trend: 'improving' | 'steady' | 'declining' | 'limited';
    summaryLines: string[];
    writingGuidance: string[];
    roleContext?: ObservationBoardRoleContext;
    roleContexts: ObservationBoardRoleContext[];
}

export interface ObservationBoardAiContext {
    source: 'observation-board-2';
    sessionMarks: ObservationBoardSessionMark[];
    derivedSummary: ObservationBoardDerivedSummary;
    roleContext?: ObservationBoardRoleContext;
}

const LEGACY_DEMO_OBSERVATION_BOARD_ACTIVITY_SESSIONS: ObservationBoardActivitySession[] = [
    { id: 'session-1', label: '1차시', date: '5/2 (금)', topic: '서로 알아가기' },
    { id: 'session-2', label: '2차시', date: '5/9 (금)', topic: '협동 게임' },
    { id: 'session-3', label: '3차시', date: '5/16 (금)', topic: '책 함께 읽기' },
    { id: 'session-4', label: '4차시', date: '5/23 (금)', topic: '미션 활동' },
    { id: 'session-5', label: '5차시', date: '5/30 (금)', topic: '마무리 나누기' },
];

export const DEFAULT_OBSERVATION_BOARD_ACTIVITY_SESSIONS: ObservationBoardActivitySession[] = [
    { id: 'session-1', label: '1차시', date: '', topic: '' },
    { id: 'session-2', label: '2차시', date: '', topic: '' },
    { id: 'session-3', label: '3차시', date: '', topic: '' },
    { id: 'session-4', label: '4차시', date: '', topic: '' },
    { id: 'session-5', label: '5차시', date: '', topic: '' },
];

const markLabels: Record<Exclude<ObservationBoardMarkState, 'none'>, string> = {
    participated: '참여함',
    excellent: '매우 잘함',
};

export function getObservationBoardSessionStorageKey(teacherKey?: string) {
    return `observation-board-2-sessions:${teacherKey || 'guest'}`;
}

export function getObservationBoardMarkStorageKey(teacherKey?: string) {
    return `observation-board-2-marks:${teacherKey || 'guest'}`;
}

export function getObservationBoardMentorAssignmentStorageKey(teacherKey?: string) {
    return `observation-board-2-mentor-assignments:${teacherKey || 'guest'}`;
}

export function getObservationBoardMentorAssignmentSnapshotStorageKey(teacherKey?: string) {
    return `observation-board-2-mentor-assignment-snapshots:${teacherKey || 'guest'}`;
}

function parseJsonValue(raw: string | null): unknown {
    if (!raw) return undefined;
    try {
        return JSON.parse(raw);
    } catch {
        return undefined;
    }
}

export function normalizeObservationBoardActivitySessions(value: unknown): ObservationBoardActivitySession[] {
    if (!Array.isArray(value)) return DEFAULT_OBSERVATION_BOARD_ACTIVITY_SESSIONS;

    const normalized = value
        .map((item, index) => {
            if (!item || typeof item !== 'object') return null;
            const session = item as Partial<ObservationBoardActivitySession>;
            const normalizedSession = {
                id: typeof session.id === 'string' && session.id.trim()
                    ? session.id
                    : `session-${index + 1}`,
                label: typeof session.label === 'string' && session.label.trim()
                    ? session.label
                    : `${index + 1}차시`,
                date: typeof session.date === 'string' ? session.date : '',
                topic: typeof session.topic === 'string' ? session.topic : '',
            };

            const legacyDemoSession = LEGACY_DEMO_OBSERVATION_BOARD_ACTIVITY_SESSIONS[index];
            if (
                legacyDemoSession
                && normalizedSession.id === legacyDemoSession.id
                && normalizedSession.label === legacyDemoSession.label
                && normalizedSession.date === legacyDemoSession.date
                && normalizedSession.topic === legacyDemoSession.topic
            ) {
                return { ...normalizedSession, date: '', topic: '' };
            }

            return normalizedSession;
        })
        .filter(Boolean) as ObservationBoardActivitySession[];

    return normalized.length > 0 ? normalized : DEFAULT_OBSERVATION_BOARD_ACTIVITY_SESSIONS;
}

export function normalizeObservationBoardActivitySessionsByClass(
    value: unknown
): ObservationBoardActivitySessionsByClass {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

    const normalized: ObservationBoardActivitySessionsByClass = {};
    Object.entries(value as Record<string, unknown>).forEach(([classId, sessions]) => {
        if (!classId.trim()) return;
        normalized[classId] = normalizeObservationBoardActivitySessions(sessions);
    });

    return normalized;
}

export function getObservationBoardActivitySessionsForClass(input: {
    sessionsByClass: ObservationBoardActivitySessionsByClass;
    classId?: string;
    fallbackSessions?: ObservationBoardActivitySession[];
}): ObservationBoardActivitySession[] {
    if (input.classId && input.classId !== 'all') {
        return input.sessionsByClass[input.classId]
            ?? input.fallbackSessions
            ?? DEFAULT_OBSERVATION_BOARD_ACTIVITY_SESSIONS;
    }

    const firstClassSessions = Object.values(input.sessionsByClass)[0];
    return input.fallbackSessions
        ?? firstClassSessions
        ?? DEFAULT_OBSERVATION_BOARD_ACTIVITY_SESSIONS;
}

export function normalizeObservationBoardMarks(value: unknown): Record<string, ObservationBoardMarkState> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

    const normalized: Record<string, ObservationBoardMarkState> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, mark]) => {
        if (mark === 'none' || mark === 'participated' || mark === 'excellent') {
            normalized[key] = mark;
        }
    });

    return normalized;
}

function isObservationBoardMentorRole(value: unknown): value is ObservationBoardMentorRole {
    return value === 'mentor' || value === 'mentee' || value === 'member';
}

function getDefaultObservationBoardMentorRole(index: number): ObservationBoardMentorRole {
    return index === 0 ? 'mentor' : 'mentee';
}

export function getObservationBoardAssignmentMembers(
    assignment: Partial<ObservationBoardMentorAssignment> | undefined
): ObservationBoardGroupMember[] {
    if (!assignment) return [];

    const members: ObservationBoardGroupMember[] = [];
    const seen = new Set<string>();
    const addMember = (studentId: unknown, role: unknown, order: unknown, fallbackOrder: number) => {
        if (typeof studentId !== 'string' || !studentId.trim() || seen.has(studentId)) return;
        seen.add(studentId);
        members.push({
            studentId,
            role: isObservationBoardMentorRole(role) ? role : getDefaultObservationBoardMentorRole(fallbackOrder),
            order: typeof order === 'number' && Number.isFinite(order) ? order : fallbackOrder,
        });
    };

    if (Array.isArray(assignment.members)) {
        assignment.members.forEach((member, index) => {
            if (!member || typeof member !== 'object') return;
            const groupMember = member as Partial<ObservationBoardGroupMember>;
            addMember(groupMember.studentId, groupMember.role, groupMember.order, index);
        });
    }

    addMember(assignment.mentorId, 'mentor', members.length, members.length);
    addMember(assignment.menteeId, 'mentee', members.length, members.length);

    return members
        .sort((a, b) => a.order - b.order)
        .slice(0, 4)
        .map((member, index) => ({ ...member, order: index }));
}

function getLegacySlotIds(members: ObservationBoardGroupMember[]) {
    const mentorId = members.find((member) => member.role === 'mentor')?.studentId
        ?? members[0]?.studentId;
    const menteeId = members.find((member) => member.role === 'mentee')?.studentId
        ?? members.find((member) => member.studentId !== mentorId)?.studentId;

    return { mentorId, menteeId };
}

export function normalizeObservationBoardMentorAssignmentsByClass(
    value: unknown
): ObservationBoardMentorAssignmentsByClass {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

    const normalized: ObservationBoardMentorAssignmentsByClass = {};
    Object.entries(value as Record<string, unknown>).forEach(([classId, assignments]) => {
        if (!Array.isArray(assignments)) return;
        if (assignments.length === 0) {
            normalized[classId] = [];
            return;
        }

        const normalizedAssignments = assignments
            .map((item, index) => {
                if (!item || typeof item !== 'object') return null;
                const assignment = item as Partial<ObservationBoardMentorAssignment>;
                const members = getObservationBoardAssignmentMembers(assignment);
                const legacySlots = getLegacySlotIds(members);
                return {
                    id: typeof assignment.id === 'string' && assignment.id.trim()
                        ? assignment.id
                        : `group-${index + 1}`,
                    title: typeof assignment.title === 'string' && assignment.title.trim()
                        ? assignment.title
                        : `${index + 1}조`,
                    mentorId: legacySlots.mentorId,
                    menteeId: legacySlots.menteeId,
                    members,
                };
            })
            .filter(Boolean) as ObservationBoardMentorAssignment[];

        if (normalizedAssignments.length > 0) {
            normalized[classId] = normalizedAssignments;
        }
    });

    return normalized;
}

export function normalizeObservationBoardMentorAssignmentSnapshotsByClass(
    value: unknown
): ObservationBoardMentorAssignmentSnapshotsByClass {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

    const normalized: ObservationBoardMentorAssignmentSnapshotsByClass = {};
    Object.entries(value as Record<string, unknown>).forEach(([classId, sessionSnapshots]) => {
        if (!sessionSnapshots || typeof sessionSnapshots !== 'object' || Array.isArray(sessionSnapshots)) return;

        const normalizedSessionSnapshots: Record<string, ObservationBoardMentorAssignment[]> = {};
        Object.entries(sessionSnapshots as Record<string, unknown>).forEach(([sessionId, assignments]) => {
            const normalizedAssignments = normalizeObservationBoardMentorAssignmentsByClass({
                [classId]: assignments,
            })[classId];

            if (normalizedAssignments?.length) {
                normalizedSessionSnapshots[sessionId] = normalizedAssignments;
            }
        });

        if (Object.keys(normalizedSessionSnapshots).length > 0) {
            normalized[classId] = normalizedSessionSnapshots;
        }
    });

    return normalized;
}

export function areObservationBoardMentorAssignmentsEqual(
    a: ObservationBoardMentorAssignment[] = [],
    b: ObservationBoardMentorAssignment[] = []
): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

function findRoleContext(input: {
    assignmentsByClass: ObservationBoardMentorAssignmentsByClass;
    studentId: string;
    classId?: string;
}): ObservationBoardRoleContext | undefined {
    const classIds = input.classId
        ? [input.classId, ...Object.keys(input.assignmentsByClass).filter((classId) => classId !== input.classId)]
        : Object.keys(input.assignmentsByClass);

    for (const classId of classIds) {
        const assignments = input.assignmentsByClass[classId] ?? [];
        for (const assignment of assignments) {
            const member = getObservationBoardAssignmentMembers(assignment)
                .find((item) => item.studentId === input.studentId);
            if (member) {
                return {
                    role: member.role,
                    roleLabel: member.role === 'mentor'
                        ? '멘토'
                        : member.role === 'mentee'
                            ? '멘티'
                            : '모둠원',
                    groupTitle: assignment.title,
                    classId,
                };
            }

            if (assignment.mentorId === input.studentId) {
                return {
                    role: 'mentor',
                    roleLabel: '멘토',
                    groupTitle: assignment.title,
                    classId,
                };
            }

            if (assignment.menteeId === input.studentId) {
                return {
                    role: 'mentee',
                    roleLabel: '멘티',
                    groupTitle: assignment.title,
                    classId,
                };
            }
        }
    }

    return undefined;
}

function findSessionRoleContext(input: {
    snapshotsByClass: ObservationBoardMentorAssignmentSnapshotsByClass;
    studentId: string;
    sessionId: string;
    classId?: string;
}): ObservationBoardRoleContext | undefined {
    const classIds = input.classId
        ? [input.classId, ...Object.keys(input.snapshotsByClass).filter((classId) => classId !== input.classId)]
        : Object.keys(input.snapshotsByClass);

    for (const classId of classIds) {
        const assignments = input.snapshotsByClass[classId]?.[input.sessionId];
        if (!assignments?.length) continue;

        const roleContext = findRoleContext({
            assignmentsByClass: { [classId]: assignments },
            studentId: input.studentId,
            classId,
        });

        if (roleContext) return roleContext;
    }

    return undefined;
}

function getUniqueRoleContexts(sessionMarks: ObservationBoardSessionMark[]): ObservationBoardRoleContext[] {
    const roleContexts = new Map<string, ObservationBoardRoleContext>();
    sessionMarks.forEach((sessionMark) => {
        if (!sessionMark.roleContext) return;
        const key = [
            sessionMark.roleContext.classId || '',
            sessionMark.roleContext.groupTitle || '',
            sessionMark.roleContext.role,
        ].join(':');
        roleContexts.set(key, sessionMark.roleContext);
    });

    return Array.from(roleContexts.values());
}

function getMarkScore(mark?: ObservationBoardMarkState): number {
    if (mark === 'excellent') return 2;
    if (mark === 'participated') return 1;
    return 0;
}

function average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getTrend(input: {
    sessions: ObservationBoardActivitySession[];
    markLookup: Map<string, ObservationBoardMarkState>;
    markedSessions: number;
}): ObservationBoardDerivedSummary['trend'] {
    if (input.sessions.length < 3 || input.markedSessions < 2) return 'limited';

    const firstCut = Math.max(1, Math.ceil(input.sessions.length / 3));
    const lastStart = Math.max(firstCut, Math.floor((input.sessions.length * 2) / 3));
    const firstScores = input.sessions.slice(0, firstCut).map((session) => getMarkScore(input.markLookup.get(session.id)));
    const lastScores = input.sessions.slice(lastStart).map((session) => getMarkScore(input.markLookup.get(session.id)));
    const delta = average(lastScores) - average(firstScores);

    if (delta >= 0.35) return 'improving';
    if (delta <= -0.35) return 'declining';
    return 'steady';
}

function buildDerivedSummary(input: {
    sessions: ObservationBoardActivitySession[];
    sessionMarks: ObservationBoardSessionMark[];
    roleContext?: ObservationBoardRoleContext;
}): ObservationBoardDerivedSummary {
    const totalSessions = input.sessions.length;
    const markedSessions = input.sessionMarks.length;
    const participatedCount = input.sessionMarks.filter((item) => item.mark === 'participated').length;
    const excellentCount = input.sessionMarks.filter((item) => item.mark === 'excellent').length;
    const participationRate = totalSessions > 0 ? markedSessions / totalSessions : 0;
    const markLookup = new Map(input.sessionMarks.map((item) => [item.sessionId, item.mark as ObservationBoardMarkState]));
    const trend = getTrend({ sessions: input.sessions, markLookup, markedSessions });
    const participationPercent = Math.round(participationRate * 100);
    const roleContexts = getUniqueRoleContexts(input.sessionMarks);
    const primaryRoleContext = input.roleContext ?? roleContexts[roleContexts.length - 1];
    const summaryLines: string[] = [
        `총 ${totalSessions}차시 중 ${markedSessions}차시에 활동 참여 신호가 기록되었고, 이 중 ${excellentCount}차시는 적극적이고 안정적인 참여로 볼 수 있는 표시가 남아 있습니다.`,
    ];

    if (participationRate >= 0.8) {
        summaryLines.push('멘토·멘티 상호작용 활동에 꾸준히 참여한 흐름이 뚜렷해 성실성과 활동 지속성을 보여주는 자료로 해석할 수 있습니다.');
    } else if (participationRate >= 0.5) {
        summaryLines.push(`활동 참여 신호가 전체 차시의 약 ${participationPercent}%에서 확인되어 관계 기반 활동에 일정하게 참여한 자료로 해석할 수 있습니다.`);
    } else {
        summaryLines.push('활동 참여 신호가 많지는 않으므로 단정적인 표현보다 관찰 가능한 참여 태도 중심으로 조심스럽게 활용해야 합니다.');
    }

    if (excellentCount >= 3) {
        summaryLines.push('적극적 참여 표시가 반복되어 책임감, 관계적 참여, 협력 태도와 연결해 서술할 수 있습니다.');
    } else if (excellentCount > 0) {
        summaryLines.push('일부 차시에서 적극적 참여 표시가 있어 활동에 몰입한 순간을 태도 근거로 활용할 수 있습니다.');
    } else if (participatedCount > 0) {
        summaryLines.push('참여 표시를 중심으로 꾸준함과 기본적인 활동 성실성을 표현하는 데 활용합니다.');
    }

    if (trend === 'improving') {
        summaryLines.push('초반보다 후반 활동 신호가 좋아져 활동 적응과 참여 태도의 성장을 조심스럽게 반영할 수 있습니다.');
    } else if (trend === 'steady' && participationRate >= 0.5) {
        summaryLines.push('차시 전반에 걸쳐 참여 흐름이 비교적 안정적으로 유지된 자료입니다.');
    } else if (trend === 'declining') {
        summaryLines.push('후반 신호가 약해진 흐름이 있으므로 성장 단정보다는 확인된 참여 장면 위주로만 활용합니다.');
    }

    if (roleContexts.length > 1) {
        summaryLines.push('멘토·멘티 배치가 중간에 변경된 이력이 있어 각 차시는 기록 당시의 조와 역할 기준으로 해석합니다.');
    } else if (primaryRoleContext) {
        summaryLines.push(`${primaryRoleContext.groupTitle ? `${primaryRoleContext.groupTitle}에서 ` : ''}${primaryRoleContext.roleLabel} 역할로 배치된 맥락이 있어 역할 수행과 관계 참여를 함께 고려할 수 있습니다.`);
    }

    return {
        totalSessions,
        markedSessions,
        participatedCount,
        excellentCount,
        participationRate,
        trend,
        summaryLines,
        writingGuidance: [
            '차시명과 △/○ 표시를 그대로 나열하지 말고 성실성, 책임감, 관계적 참여, 협력 태도, 활동 지속성, 성장 흐름으로 해석합니다.',
            '멘토·멘티 활동 기록만으로 교과 지식 성취나 리더십을 단정하지 않습니다.',
            '관찰 메모나 학습 데이터가 함께 있으면 그 구체 장면을 중심에 두고 활동판 해석은 태도 근거로 보조합니다.',
        ],
        roleContext: primaryRoleContext,
        roleContexts,
    };
}

export function readObservationBoardAiContext(input: {
    studentId: string;
    teacherKey?: string;
    classId?: string;
}): ObservationBoardAiContext | undefined {
    if (typeof window === 'undefined') return undefined;

    const sessionRaw = window.localStorage.getItem(getObservationBoardSessionStorageKey(input.teacherKey))
        ?? window.localStorage.getItem(getObservationBoardSessionStorageKey());
    const markRaw = window.localStorage.getItem(getObservationBoardMarkStorageKey(input.teacherKey))
        ?? window.localStorage.getItem(getObservationBoardMarkStorageKey());
    const assignmentRaw = window.localStorage.getItem(getObservationBoardMentorAssignmentStorageKey(input.teacherKey))
        ?? window.localStorage.getItem(getObservationBoardMentorAssignmentStorageKey());
    const assignmentSnapshotRaw = window.localStorage.getItem(getObservationBoardMentorAssignmentSnapshotStorageKey(input.teacherKey))
        ?? window.localStorage.getItem(getObservationBoardMentorAssignmentSnapshotStorageKey());

    const sessionValue = parseJsonValue(sessionRaw);
    const sessionsByClass = normalizeObservationBoardActivitySessionsByClass(sessionValue);
    const legacySessions = Array.isArray(sessionValue)
        ? normalizeObservationBoardActivitySessions(sessionValue)
        : undefined;
    const sessions = getObservationBoardActivitySessionsForClass({
        sessionsByClass,
        classId: input.classId,
        fallbackSessions: legacySessions,
    });
    const marks = normalizeObservationBoardMarks(parseJsonValue(markRaw));
    const assignmentsByClass = normalizeObservationBoardMentorAssignmentsByClass(parseJsonValue(assignmentRaw));
    const snapshotsByClass = normalizeObservationBoardMentorAssignmentSnapshotsByClass(parseJsonValue(assignmentSnapshotRaw));
    const roleContext = findRoleContext({
        assignmentsByClass,
        studentId: input.studentId,
        classId: input.classId,
    });
    const sessionMarks = sessions.flatMap((session) => {
        const mark = marks[`${input.studentId}:${session.id}`];
        if (mark !== 'participated' && mark !== 'excellent') return [];

        const sessionRoleContext = findSessionRoleContext({
            snapshotsByClass,
            studentId: input.studentId,
            sessionId: session.id,
            classId: input.classId,
        }) ?? roleContext;

        return [{
            sessionId: session.id,
            label: session.label,
            date: session.date || undefined,
            topic: session.topic || undefined,
            mark,
            markLabel: markLabels[mark],
            roleContext: sessionRoleContext,
        }];
    });

    if (sessionMarks.length === 0) return undefined;
    const derivedSummary = buildDerivedSummary({ sessions, sessionMarks, roleContext });

    return {
        source: 'observation-board-2',
        sessionMarks,
        derivedSummary,
        roleContext,
    };
}

export function formatObservationBoardContextForPrompt(context?: ObservationBoardAiContext): string {
    if (!context?.derivedSummary?.summaryLines.length) return '';

    return [
        '[활동 해석 요약]',
        ...context.derivedSummary.summaryLines.map((line) => `• ${line}`),
        '',
        '[차시별 기록]',
        ...context.sessionMarks.map((item) => {
            const details = [
                item.date,
                item.topic,
                item.roleContext
                    ? `${item.roleContext.groupTitle ? `${item.roleContext.groupTitle} ` : ''}${item.roleContext.roleLabel}`
                    : undefined,
            ].filter(Boolean).join(' / ');
            return `• ${item.label}: ${item.markLabel}${details ? ` (${details})` : ''}`;
        }),
        '',
        '[작성 지침]',
        ...context.derivedSummary.writingGuidance.map((line) => `• ${line}`),
    ].join('\n');
}

export function countObservationBoardContextItems(context?: ObservationBoardAiContext): number {
    return context?.sessionMarks?.length ?? 0;
}
