import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClassGroup, Student, SubjectRecord, TeacherProfile } from '@/types';

// Admin configuration
export const ADMIN_CONFIG = {
    name: '박범진',
    school: '성호중학교'
};

// Check if current teacher is admin
export function isAdmin(teacher: TeacherProfile | null): boolean {
    if (!teacher) return false;
    return teacher.name === ADMIN_CONFIG.name && teacher.school === ADMIN_CONFIG.school;
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

    // Data
    classes: ClassGroup[];
    students: Student[];
    records: SubjectRecord[];

    // AI Settings
    exampleTemplate: string;

    // Curriculum content by grade/semester
    curriculumContents: CurriculumContent[];

    // Admin notifications
    adminNotifications: AdminNotification[];

    // Forbidden words (shared across all teachers, editable only by admin)
    forbiddenWords: string[];

    // Actions
    login: (name: string, subject: string, school: string) => void;
    logout: () => void;

    addClass: (cls: ClassGroup) => void;
    updateClass: (id: string, data: Partial<ClassGroup>) => void;

    setStudents: (classId: string, students: Student[]) => void;
    addStudent: (student: Student) => void;
    updateStudent: (id: string, data: Partial<Student>) => void;
    updateStudentLearningData: (studentId: string, data: Record<string, string>) => void;

    updateRecord: (record: SubjectRecord) => void;
    getRecord: (studentId: string) => SubjectRecord | undefined;

    setExampleTemplate: (template: string) => void;

    // Curriculum content actions
    setCurriculumContent: (grade: number, semester: 1 | 2, content: string) => void;
    getCurriculumContent: (grade: number, semester: 1 | 2) => CurriculumContent | undefined;

    // Admin notification actions
    addNotification: (notification: Omit<AdminNotification, 'id' | 'createdAt' | 'status'>) => void;
    updateNotificationStatus: (id: string, status: 'approved' | 'rejected') => void;
    clearNotification: (id: string) => void;

    // Forbidden words actions
    setForbiddenWords: (words: string[]) => void;
    addForbiddenWord: (word: string) => void;
    removeForbiddenWord: (word: string) => void;
}

// Default example template for few-shot learning
const DEFAULT_EXAMPLE_TEMPLATE = `[예시 세특]
김철수 학생은 수업 시간에 집중력 있게 참여하며, 교사의 질문에 적극적으로 답변하는 모습을 보임. 특히 '세포의 구조와 기능' 단원에서 세포 소기관의 역할을 정확하게 이해하고, 이를 실생활 현상과 연결 지어 설명하는 능력이 돋보였음. 모둠 실험 활동에서 현미경 조작을 능숙하게 수행하며 동료들에게 관찰 방법을 안내하는 리더십을 발휘함. 탐구 보고서 작성 시 실험 결과를 체계적으로 정리하고 오차 원인을 논리적으로 분석하는 과학적 탐구 능력을 보여줌.

[어미/어투 특징]
- ~함, ~음, ~였음 등 명사형 어미 사용
- 객관적이고 구체적인 서술
- 학생의 성장과 변화 중심 기술
- 과목 특성을 반영한 용어 사용`;

// Default forbidden words
const DEFAULT_FORBIDDEN_WORDS = ['최고', '가장', '천재', '완벽', '1등', '꼴찌', '못함'];

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            teacher: null,
            classes: [],
            students: [],
            records: [],
            exampleTemplate: DEFAULT_EXAMPLE_TEMPLATE,
            curriculumContents: [],
            adminNotifications: [],
            forbiddenWords: DEFAULT_FORBIDDEN_WORDS,

            login: (name, subject, school) => set({
                teacher: { id: `t-${Date.now()}`, name, subject, school }
            }),

            logout: () => set({ teacher: null }),

            addClass: (cls) => set((state) => ({
                classes: [...state.classes, cls]
            })),

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

            addStudent: (student) => set((state) => ({
                students: [...state.students, student]
            })),

            updateStudent: (id, data) => set((state) => ({
                students: state.students.map(s => s.id === id ? { ...s, ...data } : s)
            })),

            updateStudentLearningData: (studentId, data) => set((state) => ({
                students: state.students.map(s =>
                    s.id === studentId
                        ? { ...s, learningData: { ...s.learningData, ...data } }
                        : s
                )
            })),

            updateRecord: (record) => set((state) => {
                const existingIdx = state.records.findIndex(r => r.id === record.id);
                if (existingIdx >= 0) {
                    const newRecords = [...state.records];
                    newRecords[existingIdx] = record;
                    return { records: newRecords };
                }
                return { records: [...state.records, record] };
            }),

            getRecord: (studentId) => get().records.find(r => r.studentId === studentId),

            setExampleTemplate: (template) => set({ exampleTemplate: template }),

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
        }),
        {
            name: 'seteuk-storage', // localStorage key
            partialize: (state) => ({
                teacher: state.teacher,
                classes: state.classes,
                students: state.students,
                records: state.records,
                exampleTemplate: state.exampleTemplate,
                curriculumContents: state.curriculumContents,
                adminNotifications: state.adminNotifications,
                forbiddenWords: state.forbiddenWords,
            }),
        }
    )
);
