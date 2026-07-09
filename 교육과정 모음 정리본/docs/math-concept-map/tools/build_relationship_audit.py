from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
RELATIONSHIP_AUDIT_CSV = OUT_DIR / "relationship-audit.csv"
RELATIONSHIP_AUDIT_MD = OUT_DIR / "relationship-audit.md"

RELATIONSHIP_TYPES = (
    "contains",
    "prerequisite_for",
    "represented_by",
    "used_in",
    "contrasts_with",
    "often_confused_with",
    "equivalent_to",
    "related_to",
)

REQUIRED_GOAL_RELATIONSHIP_TYPES = (
    "contains",
    "prerequisite_for",
    "represented_by",
    "used_in",
    "contrasts_with",
    "often_confused_with",
)

CSV_FIELDS = [
    "relationship_type",
    "edge_count",
    "high_confidence_count",
    "medium_confidence_count",
    "low_confidence_count",
    "source_concept_count",
    "target_concept_count",
]


def relationship_summary_rows(
    edges: Iterable[dict],
    relationship_types: Iterable[str] = RELATIONSHIP_TYPES,
) -> list[dict]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for edge in edges:
        grouped[str(edge.get("relationship_type", ""))].append(edge)

    rows: list[dict] = []
    for relationship_type in relationship_types:
        typed_edges = grouped.get(relationship_type, [])
        confidence_counts = Counter(edge.get("confidence", "") for edge in typed_edges)
        rows.append(
            {
                "relationship_type": relationship_type,
                "edge_count": len(typed_edges),
                "high_confidence_count": confidence_counts.get("high", 0),
                "medium_confidence_count": confidence_counts.get("medium", 0),
                "low_confidence_count": confidence_counts.get("low", 0),
                "source_concept_count": len({edge.get("source_id") for edge in typed_edges}),
                "target_concept_count": len({edge.get("target_id") for edge in typed_edges}),
            }
        )

    extra_types = sorted(set(grouped) - set(relationship_types))
    for relationship_type in extra_types:
        typed_edges = grouped[relationship_type]
        confidence_counts = Counter(edge.get("confidence", "") for edge in typed_edges)
        rows.append(
            {
                "relationship_type": relationship_type,
                "edge_count": len(typed_edges),
                "high_confidence_count": confidence_counts.get("high", 0),
                "medium_confidence_count": confidence_counts.get("medium", 0),
                "low_confidence_count": confidence_counts.get("low", 0),
                "source_concept_count": len({edge.get("source_id") for edge in typed_edges}),
                "target_concept_count": len({edge.get("target_id") for edge in typed_edges}),
            }
        )

    return rows


def connectivity_summary(concepts: Iterable[dict], edges: Iterable[dict]) -> dict:
    concept_ids = {concept.get("id") for concept in concepts}
    connected_ids = set()
    edge_count = 0
    for edge in edges:
        edge_count += 1
        connected_ids.add(edge.get("source_id"))
        connected_ids.add(edge.get("target_id"))

    isolated_ids = sorted(str(concept_id) for concept_id in concept_ids - connected_ids if concept_id)
    return {
        "concept_count": len(concept_ids),
        "connected_concept_count": len(concept_ids & connected_ids),
        "isolated_concept_count": len(isolated_ids),
        "isolated_concept_ids": "; ".join(isolated_ids),
        "edge_count": edge_count,
    }


def render_markdown(rows: list[dict], summary: dict) -> str:
    missing_required = [
        row["relationship_type"]
        for row in rows
        if row["relationship_type"] in REQUIRED_GOAL_RELATIONSHIP_TYPES
        and int(row["edge_count"]) == 0
    ]

    lines = [
        "# 관계 감사",
        "",
        "이 문서는 `concepts.json`의 edge를 관계 유형과 연결성 기준으로 요약한다.",
        "",
        f"- concept 총계: {summary['concept_count']}개",
        f"- edge 총계: {summary['edge_count']}개",
        f"- 연결된 concept: {summary['connected_concept_count']}개",
        f"- 고립 concept: {summary['isolated_concept_count']}개",
        f"- 목표 필수 관계 타입 누락: {', '.join(missing_required) if missing_required else '없음'}",
    ]

    if summary["isolated_concept_ids"]:
        lines.append(f"- 고립 concept ids: {summary['isolated_concept_ids']}")

    lines.extend(
        [
            "",
            "## 관계 유형별 요약",
            "",
            "| relationship_type | edge 수 | high | medium | low | source concept 수 | target concept 수 |",
            "|---|---:|---:|---:|---:|---:|---:|",
        ]
    )

    for row in rows:
        lines.append(
            "| {relationship_type} | {edge_count} | {high_confidence_count} | "
            "{medium_confidence_count} | {low_confidence_count} | "
            "{source_concept_count} | {target_concept_count} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = RELATIONSHIP_AUDIT_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    data = json.loads(CONCEPTS_JSON.read_text(encoding="utf-8"))
    rows = relationship_summary_rows(data.get("edges", []))
    summary = connectivity_summary(data.get("concepts", []), data.get("edges", []))

    write_csv(rows)
    RELATIONSHIP_AUDIT_MD.write_text(render_markdown(rows, summary), encoding="utf-8")

    print(
        f"Wrote relationship audit for {summary['edge_count']} edges "
        f"and {summary['isolated_concept_count']} isolated concepts "
        f"to {RELATIONSHIP_AUDIT_CSV} and {RELATIONSHIP_AUDIT_MD}."
    )


if __name__ == "__main__":
    main()
