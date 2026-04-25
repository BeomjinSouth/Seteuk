/**
 * Teacher profile information.
 */
export interface TeacherProfile {
    /** Unique identifier for the teacher. */
    id: string;
    /** Stable teacher key derived from school/name/subject. */
    teacherKey: string;
    /** Teacher's name. */
    name: string;
    /** Subject taught by the teacher. */
    subject: string;
    /** School name. */
    school: string;
    /** Login provider used to create the teacher session. */
    authMode?: 'seongho-school';
}
