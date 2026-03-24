import { Semester } from './common';

/**
 * Represents a class group (e.g., a specific grade and class).
 */
export interface ClassGroup {
    /** Unique identifier for the class group. */
    id: string;
    /** Class group kind. */
    kind?: 'homeroom' | 'teaching';
    /** School name. */
    school?: string;
    /** Stable teacher key for teaching classes. */
    teacherKey?: string;
    /** Grade level (e.g., 1, 2, 3). */
    grade: number;
    /** Class number. */
    classNumber: number;
    /** Subject name associated with this class. */
    subjectName: string; // e.g. "Biology I"
    /** Semester. */
    semester: Semester;
    /** Year of the class. */
    year: number;
    /** Number of students in the class. */
    studentCount: number;
}

/**
 * Student information.
 */
export interface Student {
    /** Unique identifier for the student. */
    id: string;
    /** ID of the homeroom class the student belongs to. */
    classId: string;
    /** Student number within the class. */
    number: number;
    /** Student's name. */
    name: string;
    /** Grade level. */
    grade?: number;  // 학년
    /** School name. */
    school?: string; // 학교
    /** Class number. */
    classNumber?: number; // 반 번호
    /** Key-value pair of global learning data or evidence. */
    learningData: Record<string, string>; // Evidence data e.g. { 'attitude': 'Good...', 'project1': '...' }
    /** Subject/class-specific learning data keyed by teaching class ID. */
    classLearningData?: Record<string, Record<string, string>>;
}
