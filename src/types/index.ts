export type Semester = '1' | '2';

export interface TeacherProfile {
  id: string;
  name: string;
  subject: string;
  school: string;
}

export interface ClassGroup {
  id: string;
  grade: number;
  classNumber: number;
  subjectName: string; // e.g. "Biology I"
  semester: Semester;
  year: number;
  studentCount: number;
}

export interface Student {
  id: string;
  classId: string;
  number: number;
  name: string;
  grade?: number;  // 학년
  school?: string; // 학교
  classNumber?: number; // 반 번호
  learningData: Record<string, string>; // Evidence data e.g. { 'attitude': 'Good...', 'project1': '...' }
}

export type RecordStatus = 'empty' | 'draft' | 'checked' | 'confirmed';

export interface SubjectRecord {
  id: string;
  studentId: string;
  classId: string;
  content: string; // The generated or edited text
  originalContent?: string; // For comparison
  status: RecordStatus;
  lastUpdated: string;
  checkResult?: {
    spellerErrors: number;
    forbiddenWords: number;
  };
}

export interface SpellerError {
  offset: number;
  length: number;
  word: string;
  suggestions: string[];
}
