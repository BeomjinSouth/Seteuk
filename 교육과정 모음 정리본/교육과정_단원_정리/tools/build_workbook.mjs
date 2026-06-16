import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const __filename = fileURLToPath(import.meta.url);
const toolsDir = path.dirname(__filename);
const summaryRoot = path.dirname(toolsDir);
const dataPath = path.join(summaryRoot, "unit_summary_data.json");
const outputPath = path.join(summaryRoot, "중학교_교과별_교육과정_단원_정리.xlsx");
const previewDir = path.join(os.tmpdir(), "curriculum-unit-summary-previews");
const tempXlsxPath = path.join(os.tmpdir(), "middle_school_curriculum_unit_summary.xlsx");

const data = JSON.parse(await fs.readFile(dataPath, "utf8"));
const rows = data.rows;
const sources = data.sources;

const unitHeaders = [
  "교과",
  "대단원",
  "중단원",
  "소단원",
  "성취기준 코드",
  "배우는 내용",
  "핵심 아이디어",
  "내용 요소",
  "성취기준 해설 요약",
  "적용 시 고려 사항",
  "출처 PDF",
  "페이지",
];

const sourceHeaders = ["교과", "출처 PDF", "출처 URL", "파일 크기", "SHA-256", "행 수", "추출 메모"];

function toMatrix(headers, records) {
  return [headers, ...records.map((record) => headers.map((header) => record[header] ?? ""))];
}

function countBy(records, field) {
  const map = new Map();
  for (const record of records) {
    map.set(record[field], (map.get(record[field]) ?? 0) + 1);
  }
  return map;
}

function groupBy(records, field) {
  const map = new Map();
  for (const record of records) {
    const key = record[field];
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(record);
  }
  return map;
}

function writeMatrix(sheet, matrix, tableName, widths) {
  const rowCount = matrix.length;
  const colCount = matrix[0].length;
  const range = sheet.getRangeByIndexes(0, 0, rowCount, colCount);
  range.values = matrix;
  range.format = { wrapText: true, verticalAlignment: "top" };
  const header = sheet.getRangeByIndexes(0, 0, 1, colCount);
  header.format = {
    fill: "#244766",
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
    verticalAlignment: "middle",
  };
  sheet.freezePanes.freezeRows(1);
  sheet.tables.add(`A1:${columnName(colCount)}${rowCount}`, true, tableName).style = "TableStyleMedium2";
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, rowCount, 1).format.columnWidthPx = width;
  });
  sheet.getRangeByIndexes(0, 0, rowCount, colCount).format.borders = {
    preset: "all",
    style: "thin",
    color: "#D6DEE8",
  };
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

function styleTitle(sheet, rangeAddress) {
  const range = sheet.getRange(rangeAddress);
  range.format = {
    fill: "#E9F2F9",
    font: { bold: true, color: "#18324A" },
    wrapText: true,
  };
}

const workbook = Workbook.create();

const bySubject = groupBy(rows, "교과");
const sourceBySubject = new Map(sources.map((source) => [source["교과"], source]));
const subjectSummaryRows = Array.from(bySubject.entries()).map(([subject, subjectRows]) => {
  const largeUnits = Array.from(new Set(subjectRows.map((row) => row["대단원"])));
  const source = sourceBySubject.get(subject) ?? {};
  return {
    교과: subject,
    "단원 행 수": subjectRows.length,
    "대단원 수": largeUnits.length,
    대단원: largeUnits.join(", "),
    "출처 PDF": source["출처 PDF"] ?? "",
    "추출 메모": source["추출 메모"] ?? "",
  };
});

const summarySheet = workbook.worksheets.add("요약");
summarySheet.showGridLines = false;
const countBySubject = countBy(rows, "교과");
const summaryRows = [
  ["중학교 교과별 교육과정 단원 정리", ""],
  ["생성일", data.generatedAt],
  ["범위", data.scope],
  ["교과 수", bySubject.size],
  ["단원 행 수", rows.length],
  ["정리 기준", "대단원=교육과정 영역, 중단원=내용 요소/성취기준 묶음, 소단원=성취기준 단위"],
  ["요약 원칙", "성취기준 원문 장문 전재 없이 핵심 개념, 수행 활동, 태도·적용·평가 유의점을 교사용 문장으로 정리"],
  ["주의", "생활 외국어는 이미지 기반 PDF라 공통 영역 구조로 요약, 한국어 교육과정은 별책41 구조로 요약"],
  ["", ""],
  ["교과", "단원 행 수"],
  ...Array.from(countBySubject.entries()),
];
summarySheet.getRangeByIndexes(0, 0, summaryRows.length, 2).values = summaryRows;
summarySheet.getRangeByIndexes(0, 0, summaryRows.length, 2).format = { wrapText: true, verticalAlignment: "top" };
summarySheet.getRange("A1:B1").merge();
summarySheet.getRange("A1").format = {
  fill: "#244766",
  font: { bold: true, color: "#FFFFFF", size: 16 },
};
styleTitle(summarySheet, "A10:B10");
summarySheet.getRangeByIndexes(0, 0, summaryRows.length, 1).format.columnWidthPx = 180;
summarySheet.getRangeByIndexes(0, 1, summaryRows.length, 1).format.columnWidthPx = 760;
summarySheet.freezePanes.freezeRows(10);

const unitsSheet = workbook.worksheets.add("단원목록");
unitsSheet.showGridLines = false;
writeMatrix(
  unitsSheet,
  toMatrix(unitHeaders, rows),
  "UnitListTable",
  [90, 150, 170, 260, 120, 430, 380, 250, 360, 360, 260, 80],
);

const subjectSheet = workbook.worksheets.add("교과별요약");
subjectSheet.showGridLines = false;
writeMatrix(
  subjectSheet,
  toMatrix(["교과", "단원 행 수", "대단원 수", "대단원", "출처 PDF", "추출 메모"], subjectSummaryRows),
  "SubjectSummaryTable",
  [120, 90, 90, 520, 280, 420],
);

const sourceSheet = workbook.worksheets.add("출처");
sourceSheet.showGridLines = false;
writeMatrix(sourceSheet, toMatrix(sourceHeaders, sources), "SourcesTable", [120, 320, 460, 110, 520, 80, 420]);

const inspect = await workbook.inspect({
  kind: "sheet",
  include: "name,range",
  maxChars: 1200,
});
console.log(inspect.ndjson);

await fs.rm(previewDir, { recursive: true, force: true });
await fs.mkdir(previewDir, { recursive: true });
const renderRanges = new Map([
  ["요약", { range: undefined, file: "summary.png" }],
  ["단원목록", { range: "A1:L30", file: "units.png" }],
  ["교과별요약", { range: undefined, file: "subject-summary.png" }],
  ["출처", { range: undefined, file: "sources.png" }],
]);

for (const [sheetName, config] of renderRanges.entries()) {
  const preview = await workbook.render({
    sheetName,
    range: config.range,
    autoCrop: config.range ? undefined : "all",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(path.join(previewDir, config.file), new Uint8Array(await preview.arrayBuffer()));
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(tempXlsxPath);
await fs.copyFile(tempXlsxPath, outputPath);
await fs.rm(tempXlsxPath, { force: true });
await fs.rm(`${tempXlsxPath}.inspect.ndjson`, { force: true });
await fs.rm(`${outputPath}.inspect.ndjson`, { force: true });
console.log(JSON.stringify({ outputPath, previewDir, rows: rows.length, subjects: bySubject.size }));
