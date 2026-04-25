import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { google } from 'googleapis';
import XLSX from 'xlsx';

const SCHOOL = '성호중학교';
const SHEET_NAME = '학생';
const STUDENT_HEADERS = [
  'id',
  'classId',
  'number',
  'name',
  'grade',
  'school',
  'classNumber',
  'learningData',
  'classLearningData',
];

const rosterFiles = [
  { grade: 1, fileName: '2026 1학년 명렬표(Ver.2).xlsx' },
  { grade: 2, fileName: '2026 2학년 명렬표.xlsx' },
  { grade: 3, fileName: '2026 3학년 명렬표(수정).xlsx' },
];

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const equalsIndex = trimmed.indexOf('=');
  if (equalsIndex < 0) return null;

  const key = trimmed.slice(0, equalsIndex).trim();
  let value = trimmed.slice(equalsIndex + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

async function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  const raw = await fs.readFile(envPath, 'utf8');
  raw.split(/\r?\n/).forEach((line) => {
    const parsed = parseEnvLine(line);
    if (!parsed) return;
    const [key, value] = parsed;
    if (!process.env[key]) process.env[key] = value;
  });
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '');
}

function buildHomeroomClassId(school, grade, classNumber) {
  return `home-${slugify(school)}-${grade}-${classNumber}`;
}

function buildStudentId(school, grade, classNumber, number) {
  return `student-${slugify(school)}-${grade}-${classNumber}-${number}`;
}

function parseClassNumber(raw) {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  const match = String(raw || '').match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
}

function cleanName(raw) {
  return String(raw || '')
    .replace(/\s*\r?\n\s*/g, ' ')
    .trim();
}

function parseWorkbookRoster(filePath, grade) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: false,
    defval: '',
  });
  const header = rows[1] || [];
  const students = [];

  header.forEach((headerCell, columnIndex) => {
    if (columnIndex === 0) return;
    const classNumber = parseClassNumber(headerCell);
    if (!classNumber) return;

    rows.slice(2).forEach((row) => {
      const number = Number.parseInt(String(row[0] || ''), 10);
      const name = cleanName(row[columnIndex]);
      if (!Number.isFinite(number) || number <= 0 || !name || name === '0') return;

      students.push({
        id: buildStudentId(SCHOOL, grade, classNumber, number),
        classId: buildHomeroomClassId(SCHOOL, grade, classNumber),
        number,
        name,
        grade,
        school: SCHOOL,
        classNumber,
        learningData: {},
        classLearningData: {},
      });
    });
  });

  return students;
}

function studentToRow(student) {
  return [
    student.id,
    student.classId,
    String(student.number),
    student.name,
    String(student.grade || ''),
    student.school || '',
    String(student.classNumber || ''),
    JSON.stringify(student.learningData || {}),
    JSON.stringify(student.classLearningData || {}),
  ];
}

function rowToStudent(row) {
  const id = String(row[0] || '').trim();
  const classId = String(row[1] || '').trim();
  const number = Number.parseInt(String(row[2] || ''), 10);
  const name = String(row[3] || '').trim();
  if (!id || !classId || !name || !Number.isFinite(number)) return null;

  return {
    id,
    classId,
    number,
    name,
    grade: Number.parseInt(String(row[4] || ''), 10) || undefined,
    school: String(row[5] || '').trim() || undefined,
    classNumber: Number.parseInt(String(row[6] || ''), 10) || undefined,
    learningData: parseJsonObject(row[7]),
    classLearningData: parseJsonObject(row[8]),
  };
}

function parseJsonObject(raw) {
  try {
    const parsed = JSON.parse(String(raw || '{}'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function isSeonghoStudent(student) {
  return slugify(student.school || '') === slugify(SCHOOL);
}

function dedupeById(students) {
  return Array.from(new Map(students.map((student) => [student.id, student])).values());
}

async function ensureSheetExists(sheets, spreadsheetId, sheetName) {
  const response = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = response.data.sheets?.some((sheet) => sheet.properties?.title === sheetName);
  if (exists) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{ addSheet: { properties: { title: sheetName } } }],
    },
  });
}

async function main() {
  await loadEnvLocal();

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error('Google Sheets environment variables are missing.');
  }

  const rootDir = path.resolve(process.cwd(), '..');
  const importedStudents = dedupeById(
    rosterFiles.flatMap(({ grade, fileName }) =>
      parseWorkbookRoster(path.join(rootDir, fileName), grade),
    ),
  );

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  await ensureSheetExists(sheets, spreadsheetId, SHEET_NAME);

  const existingResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A:ZZ`,
  });
  const rows = existingResponse.data.values || [];
  const dataRows = STUDENT_HEADERS.every((header, index) => rows[0]?.[index] === header)
    ? rows.slice(1)
    : rows;
  const existingStudents = dataRows
    .map(rowToStudent)
    .filter((student) => student !== null);
  const otherSchoolStudents = existingStudents.filter((student) => !isSeonghoStudent(student));
  const existingById = new Map(existingStudents.filter(isSeonghoStudent).map((student) => [student.id, student]));

  let addedCount = 0;
  let updatedCount = 0;

  const mergedSeonghoStudents = importedStudents.map((student) => {
    const existing = existingById.get(student.id);
    if (!existing) {
      addedCount += 1;
      return student;
    }

    const changed = existing.name !== student.name
      || existing.grade !== student.grade
      || existing.classNumber !== student.classNumber
      || existing.number !== student.number;
    if (changed) updatedCount += 1;

    return {
      ...existing,
      ...student,
      learningData: existing.learningData || {},
      classLearningData: existing.classLearningData || {},
    };
  });

  const nextRows = [
    STUDENT_HEADERS,
    ...dedupeById([...otherSchoolStudents, ...mergedSeonghoStudents]).map(studentToRow),
  ];

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${SHEET_NAME}!A:ZZ`,
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:I${nextRows.length}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: nextRows },
  });

  console.log(`Imported ${importedStudents.length} ${SCHOOL} students.`);
  console.log(`Added ${addedCount}, updated ${updatedCount}, preserved ${otherSchoolStudents.length} other-school rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
