import { ClassGroup, Student, TeacherProfile } from '@/types';

function slugify(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9가-힣-]/g, '');
}

export function buildTeacherKey(input: Pick<TeacherProfile, 'school' | 'name' | 'subject'>): string {
    return [
        slugify(input.school),
        slugify(input.name),
        slugify(input.subject),
    ].join('::');
}

export function buildHomeroomClassId(school: string, grade: number, classNumber: number): string {
    return `home-${slugify(school)}-${grade}-${classNumber}`;
}

export function buildTeachingClassId(input: {
    teacherKey: string;
    school: string;
    grade: number;
    classNumber: number;
    semester: '1' | '2';
    year: number;
    subjectName: string;
}): string {
    return [
        'teach',
        slugify(input.school),
        input.year,
        input.semester,
        input.grade,
        input.classNumber,
        slugify(input.subjectName),
        slugify(input.teacherKey),
    ].join('-');
}

export function getTeacherClasses(
    classes: ClassGroup[],
    teacher: TeacherProfile | null,
    semester?: '1' | '2'
): ClassGroup[] {
    if (!teacher) return [];
    return classes
        .filter((cls) => cls.kind === 'teaching' && cls.teacherKey === teacher.teacherKey)
        .filter((cls) => !semester || cls.semester === semester)
        .sort((a, b) => {
            if (a.grade !== b.grade) return a.grade - b.grade;
            return a.classNumber - b.classNumber;
        });
}

export function getStudentsInTeachingClass(students: Student[], cls: ClassGroup): Student[] {
    const classSchoolKey = slugify(cls.school || '');

    return students
        .filter((student) =>
            slugify(student.school || '') === classSchoolKey
            && student.grade === cls.grade
            && student.classNumber === cls.classNumber
        )
        .sort((a, b) => a.number - b.number);
}

export function getLearningDataForClass(student: Student, classId?: string): Record<string, string> {
    if (!classId) return student.learningData || {};
    return student.classLearningData?.[classId] || {};
}

export function getUniqueHomeroomOptions(students: Student[], school?: string) {
    const map = new Map<string, { key: string; grade: number; classNumber: number; count: number }>();
    const schoolKey = school ? slugify(school) : '';

    students.forEach((student) => {
        if (schoolKey && slugify(student.school || '') !== schoolKey) return;
        const grade = student.grade || 0;
        const classNumber = student.classNumber || 0;
        if (grade <= 0 || classNumber <= 0) return;
        const key = `${grade}-${classNumber}`;
        const current = map.get(key);
        if (current) {
            current.count += 1;
            return;
        }
        map.set(key, { key, grade, classNumber, count: 1 });
    });

    return Array.from(map.values()).sort((a, b) => {
        if (a.grade !== b.grade) return a.grade - b.grade;
        return a.classNumber - b.classNumber;
    });
}
