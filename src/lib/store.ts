import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClassGroup, Student, SubjectRecord, SubjectRecordHistorySource, TeacherProfile } from '@/types';
import { buildTeacherKey } from '@/lib/teacher-context';
import { createDemoWorkspaceSeed } from '@/lib/demo-workspace';
import { SEONGHO_AUTH_MODE, isSeonghoSchool } from '@/lib/seongho-auth';
import { DEFAULT_FORBIDDEN_WORDS } from '@/lib/forbidden-words';
import { SETEUK_DEFAULT_EXAMPLE_TEMPLATE } from '@/lib/prompts/seteuk';
import {
    buildClassCurriculumSelectionId,
    type ClassCurriculumSelection,
    type CurriculumSemester,
    type CurriculumUnitContext,
    type CurriculumUnitOverride,
} from '@/lib/curriculum-context';

export type SeteukPromptMode = 'default' | 'personal';

// Admin configuration
export const ADMIN_CONFIG = {
    name: '박범진',
    school: '성호중학교'
};

// Check if current teacher is admin
/**
 * Checks if the current teacher has admin privileges.
 * 
 * @param {TeacherProfile | null} teacher - The teacher profile to check.
 * @returns {boolean} True if the teacher matches the admin configuration.
 */
export function isAdmin(teacher: TeacherProfile | null): boolean {
    if (!teacher) return false;
    return teacher.name === ADMIN_CONFIG.name && isSeonghoSchool(teacher.school);
}

function normalizeSchoolKey(value?: string): string {
    return (value || '').trim().replace(/\s+/g, '').toLowerCase();
}

// Notification types
export interface AdminNotification {
    id: string;
    type: 'setting_request' | 'forbidden_request';
    requester: {
        name: string;
        school: string;
        subject: string;
    };
    content: string;
    originalValue?: string;
    newValue: string;
    createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

// Curriculum content by grade/semester
export interface CurriculumContent {
    id: string;
    grade: number;  // 1, 2, 3
    semester: 1 | 2;
    content: string;  // What students learn in this grade/semester
    updatedAt: string;
}

interface AppState {
    // Auth
    teacher: TeacherProfile | null;
    hasHydrated: boolean;

    // Data
    classes: ClassGroup[];
    students: Student[];
    records: SubjectRecord[];

    // AI Settings
    exampleTemplate: string;
    seteukPromptMode: SeteukPromptMode;
    personalSeteukPrompt: string;

    // Server-loaded admin status
    adminStatus: {
        loaded: boolean;
        isAdmin: boolean;
    };

    // Curriculum content by grade/semester
    curriculumContents: CurriculumContent[];
    curriculumUnitOverrides: CurriculumUnitOverride[];
    classCurriculumSelections: ClassCurriculumSelection[];

    // Admin notifications
    adminNotifications: AdminNotification[];

    // Forbidden words (shared across all teachers, editable only by admin)
    forbiddenWords: string[];

    // Keywords for highlighting in review page
    keywords: string[];

    // Actions
    login: (name: string, subject: string, school: string) => void;
    logout: () => void;
    setHasHydrated: (hasHydrated: boolean) => void;
    seedDemoWorkspace: () => string | null;

    addClass: (cls: ClassGroup) => void;
    upsertClass: (cls: ClassGroup) => void;
    updateClass: (id: string, data: Partial<ClassGroup>) => void;

    setStudents: (classId: string, students: Student[]) => void;
    upsertRosterStudents: (students: Student[]) => void;
    replaceRosterStudentsForSchool: (school: string, students: Student[]) => void;
    addStudent: (student: Student) => void;
    updateStudent: (id: string, data: Partial<Student>) => void;
    removeStudent: (id: string) => void;
    updateStudentLearningData: (studentId: string, data: Record<string, string>, classId?: string) => void;

    updateRecord: (record: SubjectRecord, source?: SubjectRecordHistorySource) => void;
    getRecord: (studentId: string) => SubjectRecord | undefined;

    setExampleTemplate: (template: string) => void;
    setSeteukPromptMode: (mode: SeteukPromptMode) => void;
    setPersonalSeteukPrompt: (prompt: string) => void;
    setAdminStatus: (status: { loaded: boolean; isAdmin: boolean }) => void;

    // Curriculum content actions
    setCurriculumContent: (grade: number, semester: 1 | 2, content: string) => void;
    getCurriculumContent: (grade: number, semester: 1 | 2) => CurriculumContent | undefined;
    upsertCurriculumUnitOverride: (unit: CurriculumUnitContext) => void;
    resetCurriculumUnitOverride: (unitId: string) => void;
    importCurriculumUnitOverrides: (units: CurriculumUnitContext[]) => void;
    setClassCurriculumSelection: (classId: string, semester: CurriculumSemester, unitIds: string[]) => void;
    getClassCurriculumSelection: (classId: string, semester: CurriculumSemester) => ClassCurriculumSelection | undefined;

    // Admin notification actions
    addNotification: (notification: Omit<AdminNotification, 'id' | 'createdAt' | 'status'>) => void;
    updateNotificationStatus: (id: string, status: 'approved' | 'rejected') => void;
    clearNotification: (id: string) => void;

    // Forbidden words actions
    setForbiddenWords: (words: string[]) => void;
    addForbiddenWord: (word: string) => void;
    removeForbiddenWord: (word: string) => void;

    // Keywords actions
    setKeywords: (keywords: string[]) => void;
    addKeyword: (keyword: string) => void;
    removeKeyword: (keyword: string) => void;

    replaceSyncedWorkspaceState: (data: Partial<Pick<AppState,
        'classes'
        | 'students'
        | 'records'
        | 'exampleTemplate'
        | 'seteukPromptMode'
        | 'personalSeteukPrompt'
        | 'curriculumContents'
        | 'curriculumUnitOverrides'
        | 'classCurriculumSelections'
        | 'adminNotifications'
        | 'forbiddenWords'
        | 'keywords'
    >>) => void;
}

const LEGACY_STORE_DEFAULT_EXAMPLE_TEMPLATE = `[예시 세특]
김철수 학생은 수업 시간에 집중력 있게 참여하며, 교사의 질문에 적극적으로 답변하는 모습을 보임. 특히 '세포의 구조와 기능' 단원에서 세포 소기관의 역할을 정확하게 이해하고, 이를 실생활 현상과 연결 지어 설명하는 능력이 돋보였음. 모둠 실험 활동에서 현미경 조작을 능숙하게 수행하며 동료들에게 관찰 방법을 안내하는 리더십을 발휘함. 탐구 보고서 작성 시 실험 결과를 체계적으로 정리하고 오차 원인을 논리적으로 분석하는 과학적 탐구 능력을 보여줌.

[어미/어투 특징]
- ~함, ~음, ~였음 등 명사형 어미 사용
- 객관적이고 구체적인 서술
- 학생의 성장과 변화 중심 기술
- 과목 특성을 반영한 용어 사용`;

const LEGACY_EXAMPLES_PAGE_DEFAULT_TEMPLATE = `${LEGACY_STORE_DEFAULT_EXAMPLE_TEMPLATE}

[자주 사용하는 표현]
- 적극적으로 참여함
- 깊은 이해를 보여줌
- 논리적으로 분석하는 능력
- 협력하여 문제를 해결함
- 탐구 능력을 발휘함`;

const LEGACY_SETEUK_V2_EXAMPLE_TEMPLATE = `[예시 세특]
우리 지역의 환경 변화를 다룬 자료 읽기 활동에서 그래프의 변화 양상을 확인하고, 활동지에 주요 내용을 정리함. 모둠 논의 과정에서 친구의 의견을 들은 뒤 조사한 자료와 연결해 발표 자료의 일부 문장을 수정함. 발표 준비 과정에서 맡은 부분을 확인하며 수업 흐름에 맞추어 과제를 수행함.

[어미/어투 특징]
- 학생 이름이나 "학생은"을 주어로 쓰지 않음
- 관찰된 행동, 수행 과정, 산출물 내용을 중심으로 서술
- "~함.", "~음.", "~됨." 형태의 학교생활기록부 문체 사용
- 근거 없는 칭찬, 리더십 단정, 미래 예측 표현은 사용하지 않음

[표현 기준]
- 활동명 나열보다 구체적인 관찰 장면을 우선함
- "돋보임", "뛰어남", "깊이 이해함" 같은 상투적 평가어보다 확인 가능한 행동을 씀
- 교육과정 용어는 학생별 입력 자료와 직접 연결될 때만 사용함

[짧은 입력 예시]
입력: 중학교 1학년 수학 / 문제 풀이함. 설명함.
출력: 문자와 식을 다루는 문제 상황에서 주어진 수량 관계를 식으로 나타내며 풀이 과정을 이어감. 풀이를 설명할 때 미지수로 둔 값과 등식이 성립하는 이유를 중심으로 말함.

입력: 중학교 2학년 국어 / 글 읽음. 질문에 답함.
출력: 설명하는 글 읽기에서 중심 내용과 뒷받침 근거가 연결되는 부분을 확인함. 글의 전개 흐름을 묻는 질문에 답하며 읽은 내용을 말로 풀어냄.`;

const LEGACY_DEFAULT_EXAMPLE_TEMPLATES = new Set([
    LEGACY_STORE_DEFAULT_EXAMPLE_TEMPLATE.trim(),
    LEGACY_EXAMPLES_PAGE_DEFAULT_TEMPLATE.trim(),
    LEGACY_SETEUK_V2_EXAMPLE_TEMPLATE.trim(),
]);

function resolveExampleTemplate(template?: string): string {
    if (!template?.trim()) return SETEUK_DEFAULT_EXAMPLE_TEMPLATE;
    if (LEGACY_DEFAULT_EXAMPLE_TEMPLATES.has(template.trim())) {
        return SETEUK_DEFAULT_EXAMPLE_TEMPLATE;
    }
    return template;
}

const LEGACY_DEFAULT_FORBIDDEN_WORDS = ['최고', '가장', '천재', '완벽', '1등', '꼴찌', '못함'];

function isLegacyDefaultForbiddenWords(words?: string[]): boolean {
    if (!Array.isArray(words) || words.length !== LEGACY_DEFAULT_FORBIDDEN_WORDS.length) return false;
    return LEGACY_DEFAULT_FORBIDDEN_WORDS.every((word, index) => words[index] === word);
}

type IdentifiedItem = { id?: string };

function mergeByIdPreservingLocal<T extends IdentifiedItem>(
    localItems: T[],
    remoteItems: unknown,
    chooseItem?: (localItem: T, remoteItem: T) => T
): T[] {
    if (!Array.isArray(remoteItems) || remoteItems.length === 0) return localItems;

    const merged = new Map<string, T>();
    const order: string[] = [];

    const addItem = (item: T) => {
        if (!item?.id) return;
        if (!merged.has(item.id)) order.push(item.id);
        merged.set(item.id, item);
    };

    localItems.forEach(addItem);
    (remoteItems as T[]).forEach((remoteItem) => {
        if (!remoteItem?.id) return;
        const current = merged.get(remoteItem.id);
        if (!current) {
            addItem(remoteItem);
            return;
        }
        merged.set(remoteItem.id, chooseItem ? chooseItem(current, remoteItem) : { ...current, ...remoteItem });
    });

    return order.map((id) => merged.get(id)).filter(Boolean) as T[];
}

function chooseNewestRecord(localRecord: SubjectRecord, remoteRecord: SubjectRecord): SubjectRecord {
    const localTime = Date.parse(localRecord.lastUpdated || '');
    const remoteTime = Date.parse(remoteRecord.lastUpdated || '');

    if (Number.isFinite(localTime) && Number.isFinite(remoteTime)) {
        return remoteTime > localTime ? remoteRecord : localRecord;
    }

    if (remoteRecord.content?.trim() && !localRecord.content?.trim()) return remoteRecord;
    return localRecord.content?.trim() ? localRecord : remoteRecord;
}

/**
 * Main application state store using Zustand.
 * Persists state to localStorage.
 * 
 * Manages:
 * - Authentication (Teacher profile)
 * - Data (Classes, Students, Records)
 * - Settings (AI Templates, Forbidden Words, Keywords)
 * - Admin features (Notifications)
 */
export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            teacher: null,
            hasHydrated: false,
            classes: [],
            students: [],
            records: [],
            exampleTemplate: SETEUK_DEFAULT_EXAMPLE_TEMPLATE,
            seteukPromptMode: 'default',
            personalSeteukPrompt: '',
            adminStatus: {
                loaded: false,
                isAdmin: false,
            },
            curriculumContents: [],
            curriculumUnitOverrides: [],
            classCurriculumSelections: [],
            adminNotifications: [],
            forbiddenWords: DEFAULT_FORBIDDEN_WORDS,
            keywords: ['탐구', '협력', '분석', '창의', '문제해결', '의사소통', '비판적 사고'],

            login: (name, subject, school) => set(() => {
                const teacherKey = buildTeacherKey({ name, subject, school });
                return {
                    teacher: { id: teacherKey, teacherKey, name, subject, school, authMode: SEONGHO_AUTH_MODE },
                    adminStatus: { loaded: false, isAdmin: false },
                };
            }),

            logout: () => set({
                teacher: null,
                adminStatus: { loaded: false, isAdmin: false },
            }),
            setHasHydrated: (hasHydrated) => set({ hasHydrated }),

            seedDemoWorkspace: () => {
                const teacher = get().teacher;
                if (!teacher) return null;

                const seed = createDemoWorkspaceSeed(teacher);
                set((state) => {
                    const nextClasses = [...state.classes];
                    seed.classes.forEach((cls) => {
                        const existingIndex = nextClasses.findIndex((item) => item.id === cls.id);
                        if (existingIndex >= 0) {
                            nextClasses[existingIndex] = { ...nextClasses[existingIndex], ...cls };
                            return;
                        }
                        nextClasses.push(cls);
                    });

                    const nextStudents = [...state.students];
                    seed.students.forEach((student) => {
                        const existingIndex = nextStudents.findIndex((item) => item.id === student.id);
                        if (existingIndex >= 0) {
                            nextStudents[existingIndex] = {
                                ...nextStudents[existingIndex],
                                ...student,
                                classLearningData: {
                                    ...(nextStudents[existingIndex].classLearningData || {}),
                                    ...(student.classLearningData || {}),
                                },
                            };
                            return;
                        }
                        nextStudents.push(student);
                    });

                    return {
                        classes: nextClasses,
                        students: nextStudents,
                    };
                });

                return seed.defaultClassId;
            },

            addClass: (cls) => set((state) => ({
                classes: [...state.classes, cls]
            })),

            upsertClass: (cls) => set((state) => {
                const existingIndex = state.classes.findIndex((item) => item.id === cls.id);
                if (existingIndex < 0) {
                    return {
                        classes: [...state.classes, cls]
                    };
                }

                const nextClasses = [...state.classes];
                nextClasses[existingIndex] = {
                    ...nextClasses[existingIndex],
                    ...cls,
                };

                return { classes: nextClasses };
            }),

            updateClass: (id, data) => set((state) => ({
                classes: state.classes.map(c => c.id === id ? { ...c, ...data } : c)
            })),

            setStudents: (classId, newStudents) => set((state) => {
                // Remove old students for this class and add new ones
                const otherStudents = state.students.filter(s => s.classId !== classId);

                // Update class student count
                const updatedClasses = state.classes.map(c =>
                    c.id === classId ? { ...c, studentCount: newStudents.length } : c
                );

                return {
                    students: [...otherStudents, ...newStudents],
                    classes: updatedClasses
                };
            }),

            upsertRosterStudents: (newStudents) => set((state) => {
                const nextStudents = [...state.students];
                const indexMap = new Map(nextStudents.map((student, index) => [student.id, index]));

                newStudents.forEach((student) => {
                    const existingIndex = indexMap.get(student.id);
                    if (existingIndex === undefined) {
                        indexMap.set(student.id, nextStudents.length);
                        nextStudents.push(student);
                        return;
                    }

                    const existing = nextStudents[existingIndex];
                    nextStudents[existingIndex] = {
                        ...existing,
                        ...student,
                        learningData: existing.learningData ?? student.learningData ?? {},
                        classLearningData: {
                            ...(existing.classLearningData || {}),
                            ...(student.classLearningData || {}),
                        },
                    };
                });

                return { students: nextStudents };
            }),

            replaceRosterStudentsForSchool: (school, newStudents) => set((state) => {
                const schoolKey = normalizeSchoolKey(school);
                const incomingIds = new Set(newStudents.map((student) => student.id));
                const nextStudents = state.students.filter((student) =>
                    normalizeSchoolKey(student.school) !== schoolKey
                    && !incomingIds.has(student.id)
                    && !student.id.startsWith(`student-${schoolKey}-`)
                );

                newStudents.forEach((student) => {
                    const existing = state.students.find((item) => item.id === student.id);
                    nextStudents.push({
                        ...existing,
                        ...student,
                        learningData: existing?.learningData ?? student.learningData ?? {},
                        classLearningData: {
                            ...(existing?.classLearningData || {}),
                            ...(student.classLearningData || {}),
                        },
                    });
                });

                return { students: nextStudents };
            }),

            addStudent: (student) => set((state) => ({
                students: [...state.students, student]
            })),

            updateStudent: (id, data) => set((state) => ({
                students: state.students.map(s => s.id === id ? { ...s, ...data } : s)
            })),

            removeStudent: (id) => set((state) => {
                const student = state.students.find(s => s.id === id);
                if (!student) return {};

                return {
                    students: state.students.filter(s => s.id !== id),
                    classes: state.classes.map(c =>
                        c.id === student.classId
                            ? { ...c, studentCount: Math.max(0, (c.studentCount || 0) - 1) }
                            : c
                    ),
                    records: state.records.filter(r => r.studentId !== id),
                };
            }),

            updateStudentLearningData: (studentId, data, classId) => set((state) => ({
                students: state.students.map((student) => {
                    if (student.id !== studentId) return student;

                    if (!classId) {
                        return {
                            ...student,
                            learningData: { ...student.learningData, ...data }
                        };
                    }

                    return {
                        ...student,
                        classLearningData: {
                            ...(student.classLearningData || {}),
                            [classId]: {
                                ...(student.classLearningData?.[classId] || {}),
                                ...data,
                            },
                        },
                    };
                })
            })),

            updateRecord: (record, source: SubjectRecordHistorySource = 'manual') => set((state) => {
                const existingIdx = state.records.findIndex(r => r.id === record.id);
                if (existingIdx >= 0) {
                    const existingRecord = state.records[existingIdx];

                    // If content changed, save previous to history
                    let updatedRecord = { ...record };
                    if (existingRecord.content && existingRecord.content !== record.content) {
                        const historyEntry = {
                            content: existingRecord.content,
                            timestamp: existingRecord.lastUpdated || new Date().toISOString(),
                            source
                        };

                        // Keep max 10 versions
                        const history = [...(existingRecord.history || []), historyEntry].slice(-10);
                        updatedRecord = { ...record, history, competencyAnalysis: undefined };
                    } else if (existingRecord.history) {
                        // Preserve existing history
                        updatedRecord = { ...record, history: existingRecord.history };
                    }

                    const newRecords = [...state.records];
                    newRecords[existingIdx] = updatedRecord;
                    return { records: newRecords };
                }
                return { records: [...state.records, record] };
            }),

            getRecord: (studentId) => get().records.find(r => r.studentId === studentId),

            setExampleTemplate: (template) => set({ exampleTemplate: template }),
            setSeteukPromptMode: (mode) => set({ seteukPromptMode: mode }),
            setPersonalSeteukPrompt: (prompt) => set({ personalSeteukPrompt: prompt }),
            setAdminStatus: (status) => set({ adminStatus: status }),

            // Curriculum content
            setCurriculumContent: (grade, semester, content) => set((state) => {
                const existing = state.curriculumContents.find(
                    c => c.grade === grade && c.semester === semester
                );

                if (existing) {
                    return {
                        curriculumContents: state.curriculumContents.map(c =>
                            c.grade === grade && c.semester === semester
                                ? { ...c, content, updatedAt: new Date().toISOString() }
                                : c
                        )
                    };
                }

                return {
                    curriculumContents: [
                        ...state.curriculumContents,
                        {
                            id: `curr-${grade}-${semester}`,
                            grade,
                            semester,
                            content,
                            updatedAt: new Date().toISOString()
                        }
                    ]
                };
            }),

            getCurriculumContent: (grade, semester) =>
                get().curriculumContents.find(c => c.grade === grade && c.semester === semester),

            upsertCurriculumUnitOverride: (unit) => set((state) => {
                const override: CurriculumUnitOverride = {
                    ...unit,
                    isTeacherOverride: true,
                    updatedAt: new Date().toISOString(),
                };
                const existingIndex = state.curriculumUnitOverrides.findIndex((item) => item.id === unit.id);
                if (existingIndex < 0) {
                    return { curriculumUnitOverrides: [...state.curriculumUnitOverrides, override] };
                }

                const nextOverrides = [...state.curriculumUnitOverrides];
                nextOverrides[existingIndex] = override;
                return { curriculumUnitOverrides: nextOverrides };
            }),

            resetCurriculumUnitOverride: (unitId) => set((state) => ({
                curriculumUnitOverrides: state.curriculumUnitOverrides.filter((unit) => unit.id !== unitId),
            })),

            importCurriculumUnitOverrides: (units) => set((state) => {
                const now = new Date().toISOString();
                const incoming = units.map((unit): CurriculumUnitOverride => ({
                    ...unit,
                    isTeacherOverride: true,
                    updatedAt: now,
                }));
                return {
                    curriculumUnitOverrides: mergeByIdPreservingLocal(
                        state.curriculumUnitOverrides,
                        incoming,
                        (_local, remote) => remote
                    ),
                };
            }),

            setClassCurriculumSelection: (classId, semester, unitIds) => set((state) => {
                const id = buildClassCurriculumSelectionId(classId, semester);
                const nextSelection: ClassCurriculumSelection = {
                    id,
                    classId,
                    semester,
                    unitIds: Array.from(new Set(unitIds.filter(Boolean))),
                    updatedAt: new Date().toISOString(),
                };

                const existingIndex = state.classCurriculumSelections.findIndex((item) => item.id === id);
                if (existingIndex < 0) {
                    return {
                        classCurriculumSelections: [...state.classCurriculumSelections, nextSelection],
                    };
                }

                const nextSelections = [...state.classCurriculumSelections];
                nextSelections[existingIndex] = nextSelection;
                return { classCurriculumSelections: nextSelections };
            }),

            getClassCurriculumSelection: (classId, semester) =>
                get().classCurriculumSelections.find((item) =>
                    item.id === buildClassCurriculumSelectionId(classId, semester)
                ),

            // Admin notifications
            addNotification: (notification) => set((state) => ({
                adminNotifications: [
                    ...state.adminNotifications,
                    {
                        ...notification,
                        id: `notif-${Date.now()}`,
                        createdAt: new Date().toISOString(),
                        status: 'pending'
                    }
                ]
            })),

            updateNotificationStatus: (id, status) => set((state) => ({
                adminNotifications: state.adminNotifications.map(n =>
                    n.id === id ? { ...n, status } : n
                )
            })),

            clearNotification: (id) => set((state) => ({
                adminNotifications: state.adminNotifications.filter(n => n.id !== id)
            })),

            // Forbidden words
            setForbiddenWords: (words) => set({ forbiddenWords: words }),

            addForbiddenWord: (word) => set((state) => ({
                forbiddenWords: [...new Set([...state.forbiddenWords, word])]
            })),

            removeForbiddenWord: (word) => set((state) => ({
                forbiddenWords: state.forbiddenWords.filter(w => w !== word)
            })),

            // Keywords
            setKeywords: (keywords) => set({ keywords }),

            addKeyword: (keyword) => set((state) => ({
                keywords: [...new Set([...state.keywords, keyword])]
            })),

            removeKeyword: (keyword) => set((state) => ({
                keywords: state.keywords.filter(k => k !== keyword)
            })),

            replaceSyncedWorkspaceState: (data) => set((state) => ({
                classes: mergeByIdPreservingLocal(state.classes, data.classes),
                students: mergeByIdPreservingLocal(state.students, data.students),
                records: mergeByIdPreservingLocal(state.records, data.records, chooseNewestRecord),
                exampleTemplate: typeof data.exampleTemplate === 'string'
                    ? resolveExampleTemplate(data.exampleTemplate)
                    : state.exampleTemplate,
                seteukPromptMode: data.seteukPromptMode === 'personal' || data.seteukPromptMode === 'default'
                    ? data.seteukPromptMode
                    : state.seteukPromptMode,
                personalSeteukPrompt: typeof data.personalSeteukPrompt === 'string'
                    ? data.personalSeteukPrompt
                    : state.personalSeteukPrompt,
                curriculumContents: mergeByIdPreservingLocal(state.curriculumContents, data.curriculumContents),
                curriculumUnitOverrides: mergeByIdPreservingLocal(
                    state.curriculumUnitOverrides,
                    data.curriculumUnitOverrides,
                    (_local, remote) => remote
                ),
                classCurriculumSelections: mergeByIdPreservingLocal(
                    state.classCurriculumSelections,
                    data.classCurriculumSelections,
                    (_local, remote) => remote
                ),
                adminNotifications: mergeByIdPreservingLocal(state.adminNotifications, data.adminNotifications),
                forbiddenWords: Array.isArray(data.forbiddenWords) ? data.forbiddenWords : state.forbiddenWords,
                keywords: Array.isArray(data.keywords) ? data.keywords : state.keywords,
            })),
        }),
        {
            name: 'seteuk-storage', // localStorage key
            partialize: (state) => ({
                teacher: state.teacher,
                classes: state.classes,
                students: state.students,
                records: state.records,
                exampleTemplate: state.exampleTemplate,
                seteukPromptMode: state.seteukPromptMode,
                personalSeteukPrompt: state.personalSeteukPrompt,
                curriculumContents: state.curriculumContents,
                curriculumUnitOverrides: state.curriculumUnitOverrides,
                classCurriculumSelections: state.classCurriculumSelections,
                adminNotifications: state.adminNotifications,
                forbiddenWords: state.forbiddenWords,
                keywords: state.keywords,
            }),
            onRehydrateStorage: () => (state) => {
                if (isLegacyDefaultForbiddenWords(state?.forbiddenWords)) {
                    state?.setForbiddenWords(DEFAULT_FORBIDDEN_WORDS);
                }
                if (state) {
                    state.setExampleTemplate(resolveExampleTemplate(state.exampleTemplate));
                }
                state?.setHasHydrated(true);
            },
        }
    )
);
