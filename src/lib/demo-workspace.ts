import { ClassGroup, Student, TeacherProfile } from '@/types';
import { buildHomeroomClassId, buildTeachingClassId } from '@/lib/teacher-context';

export interface DemoWorkspaceSeed {
    classes: ClassGroup[];
    students: Student[];
    defaultClassId: string;
}

export function createDemoWorkspaceSeed(teacher: TeacherProfile): DemoWorkspaceSeed {
    const year = new Date().getFullYear();
    const class3TeachingId = buildTeachingClassId({
        teacherKey: teacher.teacherKey,
        school: teacher.school,
        grade: 2,
        classNumber: 3,
        semester: '2',
        year,
        subjectName: teacher.subject,
    });
    const class4TeachingId = buildTeachingClassId({
        teacherKey: teacher.teacherKey,
        school: teacher.school,
        grade: 2,
        classNumber: 4,
        semester: '2',
        year,
        subjectName: teacher.subject,
    });

    return {
        defaultClassId: class3TeachingId,
        classes: [
            {
                id: buildHomeroomClassId(teacher.school, 2, 3),
                kind: 'homeroom',
                school: teacher.school,
                grade: 2,
                classNumber: 3,
                subjectName: '학적 명부',
                semester: '1',
                year,
                studentCount: 2,
            },
            {
                id: buildHomeroomClassId(teacher.school, 2, 4),
                kind: 'homeroom',
                school: teacher.school,
                grade: 2,
                classNumber: 4,
                subjectName: '학적 명부',
                semester: '1',
                year,
                studentCount: 2,
            },
            {
                id: class3TeachingId,
                kind: 'teaching',
                school: teacher.school,
                teacherKey: teacher.teacherKey,
                grade: 2,
                classNumber: 3,
                subjectName: teacher.subject,
                semester: '2',
                year,
                studentCount: 2,
            },
            {
                id: class4TeachingId,
                kind: 'teaching',
                school: teacher.school,
                teacherKey: teacher.teacherKey,
                grade: 2,
                classNumber: 4,
                subjectName: teacher.subject,
                semester: '2',
                year,
                studentCount: 2,
            },
        ],
        students: [
            {
                id: `student-${teacher.school}-2-3-1`,
                classId: buildHomeroomClassId(teacher.school, 2, 3),
                number: 1,
                name: '홍길동',
                grade: 2,
                school: teacher.school,
                classNumber: 3,
                learningData: {},
                classLearningData: {
                    [class3TeachingId]: {
                        customData: '세포 호흡 실험에서 결과 해석을 주도하고 오차 원인을 질문으로 확장함',
                    },
                },
            },
            {
                id: `student-${teacher.school}-2-3-2`,
                classId: buildHomeroomClassId(teacher.school, 2, 3),
                number: 2,
                name: '김철수',
                grade: 2,
                school: teacher.school,
                classNumber: 3,
                learningData: {},
                classLearningData: {
                    [class3TeachingId]: {
                        customData: '유전 단원 발표에서 도표를 활용해 핵심 개념을 명확히 설명함',
                    },
                },
            },
            {
                id: `student-${teacher.school}-2-4-1`,
                classId: buildHomeroomClassId(teacher.school, 2, 4),
                number: 1,
                name: '이영희',
                grade: 2,
                school: teacher.school,
                classNumber: 4,
                learningData: {},
                classLearningData: {
                    [class4TeachingId]: {
                        customData: '효소 반응 탐구에서 변인 통제를 꼼꼼하게 정리하고 팀 토론을 이끔',
                    },
                },
            },
            {
                id: `student-${teacher.school}-2-4-2`,
                classId: buildHomeroomClassId(teacher.school, 2, 4),
                number: 2,
                name: '박민수',
                grade: 2,
                school: teacher.school,
                classNumber: 4,
                learningData: {},
                classLearningData: {
                    [class4TeachingId]: {
                        customData: '생태계 프로젝트에서 자료 조사와 근거 정리를 안정적으로 수행함',
                    },
                },
            },
        ],
    };
}

