from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
REVIEW_QUEUE_CSV = OUT_DIR / "review-queue.csv"
REVIEW_QUEUE_MD = OUT_DIR / "review-queue.md"

CSV_FIELDS = [
    "concept_id",
    "label_ko",
    "domain",
    "unit",
    "concept_type",
    "confidence",
    "review_priority",
    "notes",
    "source_refs",
]

DOMAIN_ORDER = {
    "수와 연산": 1,
    "변화와 관계": 2,
    "도형과 측정": 3,
    "자료와 가능성": 4,
}


def source_ref_summary(concept: dict) -> str:
    refs = []
    for ref in concept.get("source_refs", []):
        source_id = str(ref.get("source_id", "")).strip()
        locator = str(ref.get("locator", "")).strip()
        if source_id or locator:
            refs.append(f"{source_id}: {locator}".strip(": "))
    return "; ".join(refs)


def review_priority(concept: dict) -> str:
    if concept.get("concept_type") == "misconception_risk":
        return "textbook_evidence_needed"
    return "source_detail_needed"


def review_queue_rows(concepts: Iterable[dict]) -> list[dict]:
    rows = []
    for concept in concepts:
        if concept.get("confidence") != "low":
            continue

        rows.append(
            {
                "concept_id": concept.get("id", ""),
                "label_ko": concept.get("label_ko", ""),
                "domain": concept.get("domain", ""),
                "unit": concept.get("unit", ""),
                "concept_type": concept.get("concept_type", ""),
                "confidence": concept.get("confidence", ""),
                "review_priority": review_priority(concept),
                "notes": concept.get("notes", ""),
                "source_refs": source_ref_summary(concept),
            }
        )

    return sorted(
        rows,
        key=lambda row: (
            DOMAIN_ORDER.get(row["domain"], 99),
            row["unit"],
            row["concept_type"],
            row["concept_id"],
        ),
    )


def render_markdown(rows: list[dict]) -> str:
    domain_counts = Counter(row["domain"] for row in rows)
    type_counts = Counter(row["concept_type"] for row in rows)

    lines = [
        "# 검토 큐",
        "",
        "이 문서는 `concepts.json`에서 `confidence: low`인 concept을 모아 다음 출처 보강 때 먼저 확인할 대상을 정리한다.",
        "",
        f"- 검토 대상 concept: {len(rows)}개",
        "",
        "## 영역별 검토 대상",
        "",
        "| 영역 | concept 수 |",
        "|---|---:|",
    ]

    for domain in DOMAIN_ORDER:
        lines.append(f"| {domain} | {domain_counts.get(domain, 0)} |")

    lines.extend(
        [
            "",
            "## 유형별 검토 대상",
            "",
            "| concept_type | concept 수 |",
            "|---|---:|",
        ]
    )

    for concept_type, count in sorted(type_counts.items()):
        lines.append(f"| {concept_type} | {count} |")

    lines.extend(
        [
            "",
            "## 검토 항목",
            "",
            "| concept_id | 영역 | 단원 | 유형 | 우선순위 | label_ko | notes |",
            "|---|---|---|---|---|---|---|",
        ]
    )

    for row in rows:
        lines.append(
            "| {concept_id} | {domain} | {unit} | {concept_type} | {review_priority} | "
            "{label_ko} | {notes} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = REVIEW_QUEUE_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    data = json.loads(CONCEPTS_JSON.read_text(encoding="utf-8"))
    rows = review_queue_rows(data.get("concepts", []))

    write_csv(rows)
    REVIEW_QUEUE_MD.write_text(render_markdown(rows), encoding="utf-8")

    print(
        f"Wrote {len(rows)} low-confidence concept review rows "
        f"to {REVIEW_QUEUE_CSV} and {REVIEW_QUEUE_MD}."
    )


if __name__ == "__main__":
    main()
