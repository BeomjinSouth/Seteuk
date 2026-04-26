export type ObservationBoardMarkState = 'none' | 'participated' | 'excellent';

export interface ObservationBoardActivitySession {
    id: string;
    label: string;
    date: string;
    topic: string;
}

export interface ObservationBoardSessionMark {
    sessionId: string;
    label: string;
    date?: string;
    topic?: string;
    mark: Exclude<ObservationBoardMarkState, 'none'>;
    markLabel: string;
}

export interface ObservationBoardAiContext {
    source: 'observation-board-2';
    sessionMarks: ObservationBoardSessionMark[];
}

export const DEFAULT_OBSERVATION_BOARD_ACTIVITY_SESSIONS: ObservationBoardActivitySession[] = [
    { id: 'session-1', label: '1차시', date: '5/2 (금)', topic: '서로 알아가기' },
    { id: 'session-2', label: '2차시', date: '5/9 (금)', topic: '협동 게임' },
    { id: 'session-3', label: '3차시', date: '5/16 (금)', topic: '책 함께 읽기' },
    { id: 'session-4', label: '4차시', date: '5/23 (금)', topic: '미션 활동' },
    { id: 'session-5', label: '5차시', date: '5/30 (금)', topic: '마무리 나누기' },
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
            return {
                id: typeof session.id === 'string' && session.id.trim()
                    ? session.id
                    : `session-${index + 1}`,
                label: typeof session.label === 'string' && session.label.trim()
                    ? session.label
                    : `${index + 1}차시`,
                date: typeof session.date === 'string' ? session.date : '',
                topic: typeof session.topic === 'string' ? session.topic : '',
            };
        })
        .filter(Boolean) as ObservationBoardActivitySession[];

    return normalized.length > 0 ? normalized : DEFAULT_OBSERVATION_BOARD_ACTIVITY_SESSIONS;
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

export function readObservationBoardAiContext(input: {
    studentId: string;
    teacherKey?: string;
}): ObservationBoardAiContext | undefined {
    if (typeof window === 'undefined') return undefined;

    const sessionRaw = window.localStorage.getItem(getObservationBoardSessionStorageKey(input.teacherKey))
        ?? window.localStorage.getItem(getObservationBoardSessionStorageKey());
    const markRaw = window.localStorage.getItem(getObservationBoardMarkStorageKey(input.teacherKey))
        ?? window.localStorage.getItem(getObservationBoardMarkStorageKey());

    const sessions = normalizeObservationBoardActivitySessions(parseJsonValue(sessionRaw));
    const marks = normalizeObservationBoardMarks(parseJsonValue(markRaw));
    const sessionMarks = sessions.flatMap((session) => {
        const mark = marks[`${input.studentId}:${session.id}`];
        if (mark !== 'participated' && mark !== 'excellent') return [];

        return [{
            sessionId: session.id,
            label: session.label,
            date: session.date || undefined,
            topic: session.topic || undefined,
            mark,
            markLabel: markLabels[mark],
        }];
    });

    if (sessionMarks.length === 0) return undefined;

    return {
        source: 'observation-board-2',
        sessionMarks,
    };
}

export function formatObservationBoardContextForPrompt(context?: ObservationBoardAiContext): string {
    if (!context?.sessionMarks?.length) return '';

    return context.sessionMarks.map((item) => {
        const sessionParts = [item.label, item.date, item.topic].filter(Boolean).join(' / ');
        return `• ${sessionParts}: ${item.markLabel}`;
    }).join('\n');
}

export function countObservationBoardContextItems(context?: ObservationBoardAiContext): number {
    return context?.sessionMarks?.length ?? 0;
}
