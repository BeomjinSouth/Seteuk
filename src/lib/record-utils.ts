import { SubjectRecord } from '@/types';

/**
 * Returns the record that matches a student + semester.
 * For legacy data without semester, semester 2 treats missing semester as fallback.
 */
export function getRecordByStudentSemester(
    records: SubjectRecord[],
    studentId: string,
    semester: 1 | 2,
    teacherKey?: string
): SubjectRecord | undefined {
    const semesterMatch = records.find(
        (record) =>
            record.studentId === studentId
            && record.semester === semester
            && (!teacherKey || record.teacherKey === teacherKey)
    );
    if (semesterMatch) return semesterMatch;

    if (semester === 2) {
        return records.find(
            (record) =>
                record.studentId === studentId
                && !record.semester
                && (!teacherKey || !record.teacherKey || record.teacherKey === teacherKey)
        );
    }

    return undefined;
}
