from __future__ import annotations

import json
import re
import shutil
from collections import OrderedDict
from pathlib import Path
from typing import Any


SUMMARY_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = SUMMARY_ROOT / "unit_summary_data.json"
OUTPUT_DIR = SUMMARY_ROOT / "교과별_JSON"

SUBJECT = "교과"
LARGE_UNIT = "대단원"
MIDDLE_UNIT = "중단원"
SMALL_UNIT = "소단원"
CODE = "성취기준 코드"
LEARNING = "배우는 내용"
CORE_IDEA = "핵심 아이디어"
CONTENT_ELEMENT = "내용 요소"
EXPLANATION = "성취기준 해설 요약"
CONSIDERATION = "적용 시 고려 사항"
SOURCE_PDF = "출처 PDF"
PAGE = "페이지"
SOURCE_URL = "출처 URL"
NOTE = "추출 메모"


def ordered_group(records: list[dict[str, Any]], key: str) -> OrderedDict[str, list[dict[str, Any]]]:
    grouped: OrderedDict[str, list[dict[str, Any]]] = OrderedDict()
    for record in records:
        grouped.setdefault(str(record.get(key, "")), []).append(record)
    return grouped


def unique(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        normalized = str(value).strip()
        if normalized and normalized not in seen:
            seen.add(normalized)
            result.append(normalized)
    return result


def sanitize_file_part(value: str) -> str:
    safe = re.sub(r'[\\/:*?"<>|]', "_", value)
    safe = re.sub(r"\s+", "_", safe)
    safe = re.sub(r"_+", "_", safe).strip("_")
    return safe


def build_hierarchy(subject_rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    hierarchy: list[dict[str, Any]] = []
    for large_unit, large_rows in ordered_group(subject_rows, LARGE_UNIT).items():
        large_item = {
            "name": large_unit,
            "coreIdeas": unique([row.get(CORE_IDEA, "") for row in large_rows]),
            "contentElements": unique([row.get(CONTENT_ELEMENT, "") for row in large_rows]),
            "middleUnits": [],
        }
        for middle_unit, middle_rows in ordered_group(large_rows, MIDDLE_UNIT).items():
            middle_item = {
                "name": middle_unit,
                "contentElements": unique([row.get(CONTENT_ELEMENT, "") for row in middle_rows]),
                "smallUnits": [],
            }
            for row in middle_rows:
                middle_item["smallUnits"].append(
                    {
                        "name": row.get(SMALL_UNIT, ""),
                        "achievementCode": row.get(CODE, ""),
                        "learningSummary": row.get(LEARNING, ""),
                        "coreIdea": row.get(CORE_IDEA, ""),
                        "contentElement": row.get(CONTENT_ELEMENT, ""),
                        "achievementExplanationSummary": row.get(EXPLANATION, ""),
                        "applicationConsiderations": row.get(CONSIDERATION, ""),
                        "source": {
                            "pdf": row.get(SOURCE_PDF, ""),
                            "page": row.get(PAGE, ""),
                            "url": row.get(SOURCE_URL, ""),
                            "extractionNote": row.get(NOTE, ""),
                        },
                    }
                )
            large_item["middleUnits"].append(middle_item)
        hierarchy.append(large_item)
    return hierarchy


def count_small_units(hierarchy: list[dict[str, Any]]) -> int:
    return sum(
        len(middle_unit["smallUnits"])
        for large_unit in hierarchy
        for middle_unit in large_unit["middleUnits"]
    )


def build_extraction_metadata(subject_rows: list[dict[str, Any]]) -> dict[str, Any]:
    notes = unique([row.get(NOTE, "") for row in subject_rows])
    pages = unique([row.get(PAGE, "") for row in subject_rows])
    code_rows = sum(1 for row in subject_rows if str(row.get(CODE, "")).strip())
    return {
        "pageReferences": pages,
        "codeRows": code_rows,
        "manual": bool(notes),
        "manualNotes": notes,
        "pageValuesAreStrings": True,
    }


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    rows: list[dict[str, Any]] = data["rows"]
    sources: list[dict[str, Any]] = data["sources"]

    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True)

    by_subject = ordered_group(rows, SUBJECT)
    source_by_subject = {source[SUBJECT]: source for source in sources}
    subject_order = [source[SUBJECT] for source in sources if source[SUBJECT] in by_subject]
    index_subjects: list[dict[str, Any]] = []

    for index, subject in enumerate(subject_order, start=1):
        subject_rows = by_subject[subject]
        source = source_by_subject[subject]
        hierarchy = build_hierarchy(subject_rows)
        file_name = f"{index:02d}_{sanitize_file_part(subject)}_단원_정리.json"

        subject_document = {
            "metadata": {
                "schemaVersion": "1.0.0",
                "title": f"{subject} 교육과정 단원 정리",
                "subject": subject,
                "generatedAt": data.get("generatedAt", ""),
                "scope": data.get("scope", ""),
                "sourceData": "../unit_summary_data.json",
                "rowCount": len(subject_rows),
                "largeUnitCount": len(hierarchy),
                "middleUnitCount": sum(len(large_unit["middleUnits"]) for large_unit in hierarchy),
                "smallUnitCount": count_small_units(hierarchy),
                "unitConversionRules": {
                    "largeUnit": "교육과정 영역",
                    "middleUnit": "영역 안의 내용 요소 또는 성취기준 묶음",
                    "smallUnit": "성취기준 코드 단위 또는 세부 학습 요소",
                    "learningSummary": "핵심 개념과 원리, 수행 활동과 탐구 기능, 태도·적용·평가 유의점을 종합한 교사용 요약",
                },
                "extraction": build_extraction_metadata(subject_rows),
                "source": source,
            },
            "hierarchy": hierarchy,
            "units": subject_rows,
        }

        (OUTPUT_DIR / file_name).write_text(
            json.dumps(subject_document, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

        index_subjects.append(
            {
                "order": index,
                "subject": subject,
                "file": file_name,
                "rowCount": len(subject_rows),
                "largeUnitCount": len(hierarchy),
                "middleUnitCount": subject_document["metadata"]["middleUnitCount"],
                "sourcePdf": source.get(SOURCE_PDF, ""),
                "sourceUrl": source.get(SOURCE_URL, ""),
                "sourceSha256": source.get("SHA-256", ""),
            }
        )

    index_document = {
        "metadata": {
            "schemaVersion": "1.0.0",
            "title": "중학교 교과별 교육과정 단원 JSON 인덱스",
            "generatedAt": data.get("generatedAt", ""),
            "scope": data.get("scope", ""),
            "sourceData": "../unit_summary_data.json",
            "subjectCount": len(subject_order),
            "unitRowCount": len(rows),
            "primaryOutput": "교과별 JSON 17개",
        },
        "subjects": index_subjects,
    }
    (OUTPUT_DIR / "index.json").write_text(
        json.dumps(index_document, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(json.dumps({"subjects": len(subject_order), "rows": len(rows), "outputDir": str(OUTPUT_DIR)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
