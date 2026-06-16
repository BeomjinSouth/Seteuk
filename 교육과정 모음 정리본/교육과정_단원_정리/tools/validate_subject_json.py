from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


SUMMARY_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = SUMMARY_ROOT / "unit_summary_data.json"
OUTPUT_DIR = SUMMARY_ROOT / "교과별_JSON"
PDF_DIR = SUMMARY_ROOT.parent / "2022_개정_중학교_교육과정_PDF" / "교과"
REQUIRED_FIELDS = ["교과", "대단원", "중단원", "소단원", "배우는 내용", "출처 PDF"]


def sanitize_file_part(value: str) -> str:
    safe = re.sub(r'[\\/:*?"<>|]', "_", value)
    safe = re.sub(r"\s+", "_", safe)
    safe = re.sub(r"_+", "_", safe).strip("_")
    return safe


def expected_file_name(index: int, subject: str) -> str:
    return f"{index:02d}_{sanitize_file_part(subject)}_단원_정리.json"


def count_hierarchy_units(hierarchy: list[dict[str, Any]]) -> int:
    return sum(
        len(middle_unit.get("smallUnits", []))
        for large_unit in hierarchy
        for middle_unit in large_unit.get("middleUnits", [])
    )


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    rows: list[dict[str, Any]] = data["rows"]
    sources: list[dict[str, Any]] = data["sources"]
    row_fields = set(rows[0].keys())
    source_by_subject = {source["교과"]: source for source in sources}

    row_signatures = [json.dumps(row, ensure_ascii=False, sort_keys=True) for row in rows]
    if len(row_signatures) != len(set(row_signatures)):
        raise AssertionError("source rows contain fully duplicated records")

    missing_required = [
        (index, row.get("교과", ""), field)
        for index, row in enumerate(rows, start=1)
        for field in REQUIRED_FIELDS
        if not str(row.get(field, "")).strip()
    ]
    if missing_required:
        raise AssertionError(f"required source fields are blank: {missing_required[:5]}")

    subject_order = [source["교과"] for source in sources]
    files = sorted(OUTPUT_DIR.glob("*.json"))
    subject_files = [path for path in files if path.name != "index.json"]
    if len(subject_files) != len(subject_order):
        raise AssertionError(f"expected {len(subject_order)} subject json files, found {len(subject_files)}")

    index_path = OUTPUT_DIR / "index.json"
    if not index_path.exists():
        raise AssertionError("missing index.json")
    index_document = json.loads(index_path.read_text(encoding="utf-8"))
    if index_document["metadata"].get("schemaVersion") != "1.0.0":
        raise AssertionError("index schemaVersion mismatch")
    if index_document["metadata"]["subjectCount"] != len(subject_order):
        raise AssertionError("index subjectCount mismatch")
    if index_document["metadata"]["unitRowCount"] != len(rows):
        raise AssertionError("index unitRowCount mismatch")
    index_subjects = {subject["subject"]: subject for subject in index_document.get("subjects", [])}
    if set(index_subjects) != set(subject_order):
        raise AssertionError("index subject list mismatch")

    total_rows = 0
    total_hierarchy_units = 0
    for index, subject in enumerate(subject_order, start=1):
        expected_path = OUTPUT_DIR / expected_file_name(index, subject)
        if not expected_path.exists():
            raise AssertionError(f"missing subject json: {expected_path.name}")

        subject_document = json.loads(expected_path.read_text(encoding="utf-8"))
        subject_rows = [row for row in rows if row["교과"] == subject]
        metadata = subject_document.get("metadata", {})
        units = subject_document.get("units", [])
        hierarchy = subject_document.get("hierarchy", [])

        if metadata.get("subject") != subject:
            raise AssertionError(f"{expected_path.name} metadata subject mismatch")
        if metadata.get("schemaVersion") != "1.0.0":
            raise AssertionError(f"{expected_path.name} schemaVersion mismatch")
        if metadata.get("rowCount") != len(subject_rows):
            raise AssertionError(f"{expected_path.name} rowCount mismatch")
        if metadata.get("source") != source_by_subject[subject]:
            raise AssertionError(f"{expected_path.name} metadata source mismatch")
        if units != subject_rows:
            raise AssertionError(f"{expected_path.name} units do not exactly match source rows")
        if count_hierarchy_units(hierarchy) != len(subject_rows):
            raise AssertionError(f"{expected_path.name} hierarchy small unit count mismatch")
        if metadata.get("smallUnitCount") != len(subject_rows):
            raise AssertionError(f"{expected_path.name} metadata smallUnitCount mismatch")
        extraction = metadata.get("extraction", {})
        if extraction.get("codeRows") != sum(1 for row in subject_rows if str(row.get("성취기준 코드", "")).strip()):
            raise AssertionError(f"{expected_path.name} extraction codeRows mismatch")
        if extraction.get("manual") != any(str(row.get("추출 메모", "")).strip() for row in subject_rows):
            raise AssertionError(f"{expected_path.name} extraction manual flag mismatch")
        if extraction.get("pageValuesAreStrings") is not True:
            raise AssertionError(f"{expected_path.name} pageValuesAreStrings should be true")

        index_item = index_subjects[subject]
        if index_item.get("file") != expected_path.name:
            raise AssertionError(f"{expected_path.name} index file mismatch")
        if index_item.get("rowCount") != len(subject_rows):
            raise AssertionError(f"{expected_path.name} index rowCount mismatch")
        if index_item.get("sourcePdf") != source_by_subject[subject].get("출처 PDF", ""):
            raise AssertionError(f"{expected_path.name} index sourcePdf mismatch")

        pdf_name = source_by_subject[subject].get("출처 PDF", "")
        if pdf_name and not (PDF_DIR / pdf_name).exists():
            raise AssertionError(f"{expected_path.name} source PDF is missing: {pdf_name}")

        for unit_index, unit in enumerate(units, start=1):
            if set(unit.keys()) != row_fields:
                raise AssertionError(f"{expected_path.name} unit {unit_index} field set mismatch")
            for field in REQUIRED_FIELDS:
                if not str(unit.get(field, "")).strip():
                    raise AssertionError(f"{expected_path.name} unit {unit_index} blank required field: {field}")

        total_rows += len(units)
        total_hierarchy_units += count_hierarchy_units(hierarchy)

    if total_rows != len(rows) or total_hierarchy_units != len(rows):
        raise AssertionError("total JSON unit counts do not match source rows")

    print(json.dumps({"subjects": len(subject_order), "subjectFiles": len(subject_files), "rows": total_rows}, ensure_ascii=False))


if __name__ == "__main__":
    main()
