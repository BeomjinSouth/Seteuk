from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Iterable

import validate_concept_map as validator


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
UNIT_COVERAGE_CSV = OUT_DIR / "unit-coverage.csv"
UNIT_COVERAGE_MD = OUT_DIR / "unit-coverage.md"

CONCEPT_TYPE_FIELDS = [
    "core_concept",
    "sub_concept",
    "representation",
    "procedure",
    "property",
    "term",
    "misconception_risk",
]

CSV_FIELDS = [
    "grade",
    "domain",
    "unit",
    "concept_count",
    "high_confidence_count",
    "medium_confidence_count",
    "low_confidence_count",
    "core_concept_count",
    "sub_concept_count",
    "representation_count",
    "procedure_count",
    "property_count",
    "term_count",
    "misconception_risk_count",
    "achievement_codes",
    "internal_edge_count",
    "incoming_edge_count",
    "outgoing_edge_count",
]

DOMAIN_ORDER = {
    "수와 연산": 1,
    "변화와 관계": 2,
    "도형과 측정": 3,
    "자료와 가능성": 4,
}


def unit_key(concept: dict) -> tuple[str, str, str]:
    return (
        str(concept.get("grade", "")),
        str(concept.get("domain", "")),
        str(concept.get("unit", "")),
    )


def edge_counts_by_unit(concepts: Iterable[dict], edges: Iterable[dict]) -> dict[tuple[str, str, str], Counter]:
    concept_to_unit = {concept["id"]: unit_key(concept) for concept in concepts}
    counts: dict[tuple[str, str, str], Counter] = defaultdict(Counter)

    for edge in edges:
        source_unit = concept_to_unit.get(edge.get("source_id"))
        target_unit = concept_to_unit.get(edge.get("target_id"))
        if not source_unit or not target_unit:
            continue
        if source_unit == target_unit:
            counts[source_unit]["internal"] += 1
        else:
            counts[source_unit]["outgoing"] += 1
            counts[target_unit]["incoming"] += 1

    return counts


def unit_coverage_rows(concepts: Iterable[dict], edges: Iterable[dict]) -> list[dict]:
    concept_list = list(concepts)
    grouped: dict[tuple[str, str, str], list[dict]] = defaultdict(list)
    for concept in concept_list:
        grouped[unit_key(concept)].append(concept)

    edge_counts = edge_counts_by_unit(concept_list, edges)
    rows: list[dict] = []
    for key, unit_concepts in grouped.items():
        grade, domain, unit = key
        confidence_counts = Counter(concept.get("confidence", "") for concept in unit_concepts)
        type_counts = Counter(concept.get("concept_type", "") for concept in unit_concepts)
        achievement_codes = sorted(validator.collect_achievement_codes(unit_concepts))
        counts = edge_counts.get(key, Counter())

        row = {
            "grade": grade,
            "domain": domain,
            "unit": unit,
            "concept_count": len(unit_concepts),
            "high_confidence_count": confidence_counts.get("high", 0),
            "medium_confidence_count": confidence_counts.get("medium", 0),
            "low_confidence_count": confidence_counts.get("low", 0),
            "achievement_codes": "; ".join(achievement_codes),
            "internal_edge_count": counts.get("internal", 0),
            "incoming_edge_count": counts.get("incoming", 0),
            "outgoing_edge_count": counts.get("outgoing", 0),
        }
        for concept_type in CONCEPT_TYPE_FIELDS:
            row[f"{concept_type}_count"] = type_counts.get(concept_type, 0)
        rows.append(row)

    return sorted(
        rows,
        key=lambda row: (
            row["grade"],
            DOMAIN_ORDER.get(row["domain"], 99),
            row["unit"],
        ),
    )


def render_markdown(rows: list[dict]) -> str:
    domain_summary: dict[str, Counter] = defaultdict(Counter)
    for row in rows:
        summary = domain_summary[row["domain"]]
        summary["unit_count"] += 1
        summary["concept_count"] += int(row["concept_count"])
        summary["low_confidence_count"] += int(row["low_confidence_count"])

    lines = [
        "# 단원별 커버리지",
        "",
        "이 문서는 `concepts.json`과 edge 데이터를 학년·영역·단원 단위로 요약하여 다음 교과서 보강 단위를 정하기 쉽게 만든다.",
        "",
        f"- 단원 그룹: {len(rows)}개",
        f"- concept 총계: {sum(int(row['concept_count']) for row in rows)}개",
        f"- low 신뢰도 concept 총계: {sum(int(row['low_confidence_count']) for row in rows)}개",
        "",
        "## 영역별 요약",
        "",
        "| 영역 | 단원 수 | concept 수 | low 신뢰도 concept 수 |",
        "|---|---:|---:|---:|",
    ]

    for domain in DOMAIN_ORDER:
        summary = domain_summary.get(domain, Counter())
        lines.append(
            f"| {domain} | {summary.get('unit_count', 0)} | "
            f"{summary.get('concept_count', 0)} | {summary.get('low_confidence_count', 0)} |"
        )

    lines.extend(
        [
            "",
            "## 단원별 요약",
            "",
            "| 학년 | 영역 | 단원 | concept 수 | high | medium | low | 성취기준 | 내부 edge | 들어오는 edge | 나가는 edge |",
            "|---|---|---|---:|---:|---:|---:|---|---:|---:|---:|",
        ]
    )

    for row in rows:
        lines.append(
            "| {grade} | {domain} | {unit} | {concept_count} | {high_confidence_count} | "
            "{medium_confidence_count} | {low_confidence_count} | {achievement_codes} | "
            "{internal_edge_count} | {incoming_edge_count} | {outgoing_edge_count} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = UNIT_COVERAGE_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    data = json.loads(CONCEPTS_JSON.read_text(encoding="utf-8"))
    rows = unit_coverage_rows(data.get("concepts", []), data.get("edges", []))

    write_csv(rows)
    UNIT_COVERAGE_MD.write_text(render_markdown(rows), encoding="utf-8")

    print(
        f"Wrote unit coverage for {len(rows)} unit groups "
        f"to {UNIT_COVERAGE_CSV} and {UNIT_COVERAGE_MD}."
    )


if __name__ == "__main__":
    main()
