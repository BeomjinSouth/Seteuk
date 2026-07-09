from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path
from typing import Iterable

import validate_concept_map as validator


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
COVERAGE_CSV = OUT_DIR / "achievement-coverage.csv"
COVERAGE_MD = OUT_DIR / "achievement-coverage.md"

CSV_FIELDS = [
    "achievement_code",
    "domain",
    "concept_count",
    "high_confidence_count",
    "medium_confidence_count",
    "low_confidence_count",
    "concept_ids",
    "concept_labels",
]

DOMAIN_LABELS = {
    "01": "수와 연산",
    "02": "변화와 관계",
    "03": "도형과 측정",
    "04": "자료와 가능성",
}


def domain_for_code(code: str) -> str:
    domain_key = code[2:4]
    return DOMAIN_LABELS.get(domain_key, "미분류")


def achievement_coverage_rows(
    concepts: Iterable[dict],
    expected_codes: Iterable[str] = validator.EXPECTED_ACHIEVEMENT_CODES,
) -> list[dict]:
    concepts_by_code: dict[str, list[dict]] = defaultdict(list)

    for concept in concepts:
        for code in validator.collect_achievement_codes([concept]):
            concepts_by_code[code].append(concept)

    rows: list[dict] = []
    for code in expected_codes:
        linked_concepts = sorted(
            concepts_by_code.get(code, []),
            key=lambda item: str(item.get("id", "")),
        )
        confidence_counts = {
            "high": sum(1 for item in linked_concepts if item.get("confidence") == "high"),
            "medium": sum(1 for item in linked_concepts if item.get("confidence") == "medium"),
            "low": sum(1 for item in linked_concepts if item.get("confidence") == "low"),
        }

        rows.append(
            {
                "achievement_code": code,
                "domain": domain_for_code(code),
                "concept_count": len(linked_concepts),
                "high_confidence_count": confidence_counts["high"],
                "medium_confidence_count": confidence_counts["medium"],
                "low_confidence_count": confidence_counts["low"],
                "concept_ids": "; ".join(str(item.get("id", "")) for item in linked_concepts),
                "concept_labels": "; ".join(str(item.get("label_ko", "")) for item in linked_concepts),
            }
        )

    return rows


def render_markdown(rows: list[dict]) -> str:
    covered_count = sum(1 for row in rows if int(row["concept_count"]) > 0)
    concept_link_count = sum(int(row["concept_count"]) for row in rows)
    domain_summary: dict[str, dict[str, int]] = defaultdict(
        lambda: {"achievement_count": 0, "concept_link_count": 0}
    )

    for row in rows:
        summary = domain_summary[row["domain"]]
        summary["achievement_count"] += 1
        summary["concept_link_count"] += int(row["concept_count"])

    lines = [
        "# 성취기준 커버리지",
        "",
        "이 문서는 `concepts.json`의 `source_refs`에 기록된 공식 성취기준 코드가 어떤 concept 노드와 연결되는지 요약한다.",
        "",
        f"- 커버된 성취기준: {covered_count} / {len(rows)}",
        f"- 성취기준-concept 연결 수: {concept_link_count}",
        "",
        "## 영역별 요약",
        "",
        "| 영역 | 성취기준 수 | concept 연결 수 |",
        "|---|---:|---:|",
    ]

    for domain in DOMAIN_LABELS.values():
        summary = domain_summary.get(domain, {"achievement_count": 0, "concept_link_count": 0})
        lines.append(
            f"| {domain} | {summary['achievement_count']} | {summary['concept_link_count']} |"
        )

    lines.extend(
        [
            "",
            "## 성취기준별 연결 concept",
            "",
            "| 성취기준 | 영역 | concept 수 | high | medium | low | concept labels |",
            "|---|---|---:|---:|---:|---:|---|",
        ]
    )

    for row in rows:
        lines.append(
            "| {achievement_code} | {domain} | {concept_count} | {high_confidence_count} | "
            "{medium_confidence_count} | {low_confidence_count} | {concept_labels} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = COVERAGE_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    data = json.loads(CONCEPTS_JSON.read_text(encoding="utf-8"))
    rows = achievement_coverage_rows(data.get("concepts", []))

    write_csv(rows)
    COVERAGE_MD.write_text(render_markdown(rows), encoding="utf-8")

    covered_count = sum(1 for row in rows if int(row["concept_count"]) > 0)
    print(
        f"Wrote achievement coverage for {covered_count}/{len(rows)} standards "
        f"to {COVERAGE_CSV} and {COVERAGE_MD}."
    )


if __name__ == "__main__":
    main()
