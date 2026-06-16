import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const __filename = fileURLToPath(import.meta.url);
const toolsDir = path.dirname(__filename);
const summaryRoot = path.dirname(toolsDir);
const dataPath = path.join(summaryRoot, "unit_summary_data.json");
const outputDir = path.join(summaryRoot, "교과별_XLSX");

const KEYS = {
  subject: "교과",
  largeUnit: "대단원",
  middleUnit: "중단원",
  smallUnit: "소단원",
  code: "성취기준 코드",
  learning: "배우는 내용",
  coreIdea: "핵심 아이디어",
  contentElement: "내용 요소",
  explanation: "성취기준 해설 요약",
  consideration: "적용 시 고려 사항",
  sourcePdf: "출처 PDF",
  page: "페이지",
  sourceUrl: "출처 URL",
  note: "추출 메모",
  fileSize: "파일 크기",
  sha256: "SHA-256",
  rowCount: "행 수",
};

const unitHeaders = [
  KEYS.subject,
  KEYS.largeUnit,
  KEYS.middleUnit,
  KEYS.smallUnit,
  KEYS.code,
  KEYS.learning,
  KEYS.coreIdea,
  KEYS.contentElement,
  KEYS.explanation,
  KEYS.consideration,
  KEYS.sourcePdf,
  KEYS.page,
];

const sourceHeaders = [
  KEYS.subject,
  KEYS.sourcePdf,
  KEYS.sourceUrl,
  KEYS.fileSize,
  KEYS.sha256,
  KEYS.rowCount,
  KEYS.note,
];

const largeUnitHeaders = [
  KEYS.largeUnit,
  "중단원 수",
  "소단원 수",
  "중단원",
  KEYS.coreIdea,
];

const data = JSON.parse(await fs.readFile(dataPath, "utf8"));
const rows = data.rows;
const sources = data.sources;

function groupBy(records, field) {
  const map = new Map();
  for (const record of records) {
    const key = record[field];
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(record);
  }
  return map;
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function columnName(count) {
  let n = count;
  let name = "";
  while (n > 0) {
    const mod = (n - 1) % 26;
    name = String.fromCharCode(65 + mod) + name;
    n = Math.floor((n - mod) / 26);
  }
  return name;
}

function toMatrix(headers, records) {
  return [headers, ...records.map((record) => headers.map((header) => record[header] ?? ""))];
}

function sanitizeFilePart(value) {
  return value
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function writeMatrix(sheet, matrix, tableName, widths) {
  const rowCount = matrix.length;
  const colCount = matrix[0].length;
  const range = sheet.getRangeByIndexes(0, 0, rowCount, colCount);
  range.values = matrix;
  range.format = {
    wrapText: true,
    verticalAlignment: "top",
    font: { size: 10, color: "#1F2937" },
    fill: "#FFFFFF",
  };

  const header = sheet.getRangeByIndexes(0, 0, 1, colCount);
  header.format = {
    fill: "#244766",
    font: { bold: true, color: "#FFFFFF", size: 10 },
    horizontalAlignment: "center",
    verticalAlignment: "middle",
    wrapText: true,
  };

  sheet.freezePanes.freezeRows(1);
  const table = sheet.tables.add(`A1:${columnName(colCount)}${rowCount}`, true, tableName);
  table.style = "TableStyleMedium2";
  table.showFilterButton = true;

  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, rowCount, 1).format.columnWidthPx = width;
  });
  sheet.getRangeByIndexes(0, 0, rowCount, colCount).format.borders = {
    preset: "all",
    style: "thin",
    color: "#D6DEE8",
  };
}

function buildLargeUnitRows(subjectRows) {
  return Array.from(groupBy(subjectRows, KEYS.largeUnit).entries()).map(([largeUnit, unitRows]) => {
    const middleUnits = unique(unitRows.map((row) => row[KEYS.middleUnit]));
    const coreIdeas = unique(unitRows.map((row) => row[KEYS.coreIdea])).slice(0, 4);
    return {
      [KEYS.largeUnit]: largeUnit,
      "중단원 수": middleUnits.length,
      "소단원 수": unitRows.length,
      중단원: middleUnits.join(", "),
      [KEYS.coreIdea]: coreIdeas.join(" / "),
    };
  });
}

function styleSummarySheet(sheet, subject, subjectRows, largeUnitRows, source) {
  sheet.showGridLines = false;
  const summaryRows = [
    [`${subject} 교육과정 단원 정리`, "", "", ""],
    ["생성일", data.generatedAt ?? "", "범위", data.scope ?? "중학교 공통 교육과정"],
    ["교과", subject, "단원 행 수", subjectRows.length],
    ["대단원 수", largeUnitRows.length, "출처 PDF", source?.[KEYS.sourcePdf] ?? ""],
    ["정리 기준", "대단원=교육과정 영역, 중단원=내용 요소/성취기준 묶음, 소단원=성취기준 단위 또는 세부 학습 요소", "", ""],
    ["설명 방식", "핵심 개념과 원리, 수행 활동과 탐구 기능, 태도·적용·평가 유의점을 합쳐 교사용 요약 문장으로 정리", "", ""],
    ["주의", "교과서 출판사별 단원이 아니라 공식 교육과정 구조를 단원형으로 변환한 정리본", "", ""],
    ["출처 URL", source?.[KEYS.sourceUrl] ?? "", "", ""],
  ];

  sheet.getRangeByIndexes(0, 0, summaryRows.length, 4).values = summaryRows;
  sheet.getRangeByIndexes(0, 0, summaryRows.length, 4).format = {
    wrapText: true,
    verticalAlignment: "top",
    font: { size: 10, color: "#1F2937" },
  };

  sheet.getRange("A1:D1").merge();
  sheet.getRange("A1").format = {
    fill: "#244766",
    font: { bold: true, color: "#FFFFFF", size: 16 },
    horizontalAlignment: "center",
    verticalAlignment: "middle",
  };

  for (const cell of ["A2", "C2", "A3", "C3", "A4", "C4", "A5", "A6", "A7", "A8"]) {
    sheet.getRange(cell).format = {
      fill: "#E9F2F9",
      font: { bold: true, color: "#18324A", size: 10 },
      verticalAlignment: "top",
    };
  }

  sheet.getRangeByIndexes(0, 0, summaryRows.length, 4).format.borders = {
    preset: "all",
    style: "thin",
    color: "#D6DEE8",
  };
  [150, 420, 130, 520].forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, summaryRows.length, 1).format.columnWidthPx = width;
  });
  sheet.freezePanes.freezeRows(1);
}

async function buildSubjectWorkbook(subject, subjectRows, source, index) {
  const workbook = Workbook.create();
  const largeUnitRows = buildLargeUnitRows(subjectRows);
  const serial = String(index + 1).padStart(2, "0");

  const summarySheet = workbook.worksheets.add("요약");
  styleSummarySheet(summarySheet, subject, subjectRows, largeUnitRows, source);

  const unitsSheet = workbook.worksheets.add("단원목록");
  unitsSheet.showGridLines = false;
  writeMatrix(
    unitsSheet,
    toMatrix(unitHeaders, subjectRows),
    `UnitList_${serial}`,
    [90, 140, 170, 260, 120, 430, 360, 250, 360, 360, 260, 75],
  );

  const largeSheet = workbook.worksheets.add("대단원요약");
  largeSheet.showGridLines = false;
  writeMatrix(
    largeSheet,
    toMatrix(largeUnitHeaders, largeUnitRows),
    `LargeUnits_${serial}`,
    [160, 90, 90, 520, 520],
  );

  const sourceSheet = workbook.worksheets.add("출처");
  sourceSheet.showGridLines = false;
  writeMatrix(sourceSheet, toMatrix(sourceHeaders, [source]), `Sources_${serial}`, [120, 320, 460, 110, 520, 80, 420]);

  const errors = await workbook.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
    options: { useRegex: true, maxResults: 50 },
    summary: `${subject} formula error scan`,
  });
  if (errors.ndjson.includes("#REF!") || errors.ndjson.includes("#DIV/0!") || errors.ndjson.includes("#VALUE!")) {
    throw new Error(`${subject} workbook contains formula errors`);
  }

  const fileName = `${serial}_${sanitizeFilePart(subject)}_단원_정리.xlsx`;
  const outputPath = path.join(outputDir, fileName);
  const tempPath = path.join(os.tmpdir(), `middle_school_${serial}_subject_units.xlsx`);
  const xlsx = await SpreadsheetFile.exportXlsx(workbook);
  await xlsx.save(tempPath);
  await fs.copyFile(tempPath, outputPath);
  await fs.rm(tempPath, { force: true });
  await fs.rm(`${tempPath}.inspect.ndjson`, { force: true });
  await fs.rm(`${outputPath}.inspect.ndjson`, { force: true });
  return { subject, fileName, rows: subjectRows.length, largeUnits: largeUnitRows.length };
}

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

const bySubject = groupBy(rows, KEYS.subject);
const sourceBySubject = new Map(sources.map((source) => [source[KEYS.subject], source]));
const subjectOrder = sources.map((source) => source[KEYS.subject]).filter((subject) => bySubject.has(subject));
const created = [];

for (const [index, subject] of subjectOrder.entries()) {
  const subjectRows = bySubject.get(subject);
  const source = sourceBySubject.get(subject);
  created.push(await buildSubjectWorkbook(subject, subjectRows, source, index));
}

console.log(JSON.stringify({ outputDir, created }, null, 2));
