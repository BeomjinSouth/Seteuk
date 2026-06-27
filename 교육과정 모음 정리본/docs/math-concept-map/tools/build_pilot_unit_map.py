from __future__ import annotations

import argparse
import csv
import json
from collections import Counter
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
CONCEPT_EVIDENCE_DEPTH_CSV = OUT_DIR / "concept-evidence-depth.csv"
EDGE_EVIDENCE_DEPTH_CSV = OUT_DIR / "edge-evidence-depth.csv"
TEXTBOOK_EVIDENCE_WORKPLAN_CSV = OUT_DIR / "textbook-evidence-workplan.csv"
PILOT_UNIT_MAP_MD = OUT_DIR / "pilot-unit-map.md"
PILOT_UNIT_MAP_NODES_CSV = OUT_DIR / "pilot-unit-map-nodes.csv"
PILOT_UNIT_MAP_EDGES_CSV = OUT_DIR / "pilot-unit-map-edges.csv"
PILOT_UNIT_MAP_DOT = OUT_DIR / "pilot-unit-map.dot"

NODE_CSV_FIELDS = [
    "rank",
    "grade",
    "domain",
    "unit",
    "concept_id",
    "label_ko",
    "concept_type",
    "confidence",
    "evidence_depth",
    "needs_textbook_evidence",
    "source_ref_count",
    "parent_ids",
    "prerequisite_ids",
    "related_ids",
    "short_definition",
    "notes",
]

EDGE_CSV_FIELDS = [
    "rank",
    "unit",
    "edge_id",
    "source_id",
    "source_label_ko",
    "source_unit",
    "target_id",
    "target_label_ko",
    "target_unit",
    "relationship_type",
    "edge_scope",
    "confidence",
    "evidence_depth",
    "needs_textbook_evidence",
    "source_ref_count",
    "notes",
]

CONCEPT_TYPE_SORT_PRIORITY = {
    "core_concept": 0,
    "sub_concept": 1,
    "representation": 2,
    "procedure": 3,
    "property": 4,
    "term": 5,
    "misconception_risk": 6,
}

RELATIONSHIP_SORT_PRIORITY = {
    "contains": 0,
    "prerequisite_for": 1,
    "represented_by": 2,
    "used_in": 3,
    "contrasts_with": 4,
    "often_confused_with": 5,
    "equivalent_to": 6,
    "related_to": 7,
}


def read_csv_rows(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def read_concepts_data(path: Path = CONCEPTS_JSON) -> tuple[list[dict], list[dict]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return list(data.get("concepts", [])), list(data.get("edges", []))


def target_unit(workplan_rows: Iterable[dict], rank: int = 1) -> dict:
    expected = str(rank)
    for row in workplan_rows:
        if str(row.get("rank", "")) == expected:
            return row
    raise ValueError(f"textbook evidence workplan has no rank {rank}")


def is_target_concept(concept: dict | None, target: dict) -> bool:
    if not concept:
        return False
    return (
        concept.get("grade") == target.get("grade")
        and concept.get("domain") == target.get("domain")
        and concept.get("unit") == target.get("unit")
    )


def joined_ids(values: Iterable[object]) -> str:
    return "; ".join(str(value) for value in values if str(value).strip())


def evidence_lookup(rows: Iterable[dict], id_field: str) -> dict[str, dict]:
    return {str(row.get(id_field, "")): row for row in rows}


def source_ref_count(record: dict) -> int:
    refs = record.get("source_refs", [])
    return len(refs) if isinstance(refs, list) else 0


def pilot_unit_node_rows(
    concepts: Iterable[dict],
    evidence_rows: Iterable[dict],
    target: dict,
) -> list[dict]:
    evidence_by_id = evidence_lookup(evidence_rows, "concept_id")
    rows: list[dict] = []
    for concept in concepts:
        if not is_target_concept(concept, target):
            continue

        concept_id = str(concept.get("id", ""))
        evidence = evidence_by_id.get(concept_id, {})
        rows.append(
            {
                "rank": target.get("rank", ""),
                "grade": concept.get("grade", ""),
                "domain": concept.get("domain", ""),
                "unit": concept.get("unit", ""),
                "concept_id": concept_id,
                "label_ko": concept.get("label_ko", ""),
                "concept_type": concept.get("concept_type", ""),
                "confidence": concept.get("confidence", ""),
                "evidence_depth": evidence.get("evidence_depth", ""),
                "needs_textbook_evidence": evidence.get("needs_textbook_evidence", ""),
                "source_ref_count": evidence.get("source_ref_count", source_ref_count(concept)),
                "parent_ids": joined_ids(concept.get("parent_ids", [])),
                "prerequisite_ids": joined_ids(concept.get("prerequisite_ids", [])),
                "related_ids": joined_ids(concept.get("related_ids", [])),
                "short_definition": concept.get("short_definition", ""),
                "notes": concept.get("notes", ""),
            }
        )

    rows.sort(
        key=lambda row: (
            row.get("confidence") != "low",
            CONCEPT_TYPE_SORT_PRIORITY.get(str(row.get("concept_type", "")), 99),
            str(row.get("concept_id", "")),
        )
    )
    return rows


def edge_scope(source_in_unit: bool, target_in_unit: bool) -> str:
    if source_in_unit and target_in_unit:
        return "intra_unit"
    return "cross_unit"


def pilot_unit_edge_rows(
    concepts: Iterable[dict],
    edges: Iterable[dict],
    evidence_rows: Iterable[dict],
    target: dict,
) -> list[dict]:
    concepts_by_id = {str(concept.get("id", "")): concept for concept in concepts}
    evidence_by_id = evidence_lookup(evidence_rows, "edge_id")
    rows: list[dict] = []

    for edge in edges:
        source_id = str(edge.get("source_id", ""))
        target_id = str(edge.get("target_id", ""))
        source = concepts_by_id.get(source_id)
        target_concept = concepts_by_id.get(target_id)
        source_in_unit = is_target_concept(source, target)
        target_in_unit = is_target_concept(target_concept, target)
        if not source_in_unit and not target_in_unit:
            continue

        edge_id = str(edge.get("id", ""))
        evidence = evidence_by_id.get(edge_id, {})
        rows.append(
            {
                "rank": target.get("rank", ""),
                "unit": target.get("unit", ""),
                "edge_id": edge_id,
                "source_id": source_id,
                "source_label_ko": (source or {}).get("label_ko", ""),
                "source_unit": (source or {}).get("unit", ""),
                "target_id": target_id,
                "target_label_ko": (target_concept or {}).get("label_ko", ""),
                "target_unit": (target_concept or {}).get("unit", ""),
                "relationship_type": edge.get("relationship_type", ""),
                "edge_scope": edge_scope(source_in_unit, target_in_unit),
                "confidence": edge.get("confidence", ""),
                "evidence_depth": evidence.get("evidence_depth", ""),
                "needs_textbook_evidence": evidence.get("needs_textbook_evidence", ""),
                "source_ref_count": evidence.get("source_ref_count", source_ref_count(edge)),
                "notes": edge.get("notes", ""),
            }
        )

    rows.sort(
        key=lambda row: (
            row.get("confidence") != "low",
            row.get("edge_scope") != "intra_unit",
            RELATIONSHIP_SORT_PRIORITY.get(str(row.get("relationship_type", "")), 99),
            str(row.get("edge_id", "")),
        )
    )
    return rows


def count_by(rows: Iterable[dict], field: str) -> Counter:
    return Counter(str(row.get(field, "")) for row in rows)


def render_counter_table(counter: Counter, key_label: str) -> list[str]:
    lines = [
        f"| {key_label} | count |",
        "|---|---:|",
    ]
    for key, count in sorted(counter.items()):
        lines.append(f"| {key} | {count} |")
    return lines


def render_markdown(target: dict, node_rows: list[dict], edge_rows: list[dict]) -> str:
    low_concepts = sum(1 for row in node_rows if row.get("confidence") == "low")
    low_edges = sum(1 for row in edge_rows if row.get("confidence") == "low")
    cross_edges = sum(1 for row in edge_rows if row.get("edge_scope") == "cross_unit")
    lines = [
        "# Pilot Unit Map",
        "",
        "This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.",
        "",
        "## Target Unit",
        "",
        f"- rank: {target.get('rank', '')}",
        f"- grade: {target.get('grade', '')}",
        f"- domain: {target.get('domain', '')}",
        f"- unit: {target.get('unit', '')}",
        f"- priority tier: {target.get('priority_tier', '')}",
        f"- workplan score: {target.get('workplan_score', '')}",
        f"- concepts: {len(node_rows)}",
        f"- edges touching unit: {len(edge_rows)}",
        f"- cross-unit edges: {cross_edges}",
        f"- low confidence concepts: {low_concepts}",
        f"- low confidence edges: {low_edges}",
        "",
        "## Concept Type Distribution",
        "",
        *render_counter_table(count_by(node_rows, "concept_type"), "concept_type"),
        "",
        "## Relationship Distribution",
        "",
        *render_counter_table(count_by(edge_rows, "relationship_type"), "relationship_type"),
        "",
        "## Low Confidence Concepts",
        "",
        "| concept_id | label_ko | type | evidence_depth | notes |",
        "|---|---|---|---|---|",
    ]

    low_rows = [row for row in node_rows if row.get("confidence") == "low"]
    for row in low_rows[:20]:
        lines.append(
            "| {concept_id} | {label_ko} | {concept_type} | {evidence_depth} | {notes} |".format(**row)
        )
    if not low_rows:
        lines.append("|  |  |  |  |  |")

    lines.extend(
        [
            "",
            "## Cross-Unit Edges",
            "",
            "| edge_id | source | relationship | target | confidence | evidence_depth |",
            "|---|---|---|---|---|---|",
        ]
    )
    for row in [edge for edge in edge_rows if edge.get("edge_scope") == "cross_unit"][:40]:
        lines.append(
            "| {edge_id} | {source_label_ko} | {relationship_type} | "
            "{target_label_ko} | {confidence} | {evidence_depth} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def dot_escape(value: object) -> str:
    return str(value).replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n")


def render_dot(target: dict, node_rows: list[dict], edge_rows: list[dict]) -> str:
    node_by_id = {row["concept_id"]: row for row in node_rows}
    lines = [
        "digraph pilot_unit_map {",
        "  rankdir=\"LR\";",
        "  graph [fontname=\"Malgun Gothic\", label=\"{}\", labelloc=\"t\"];".format(dot_escape(target.get("unit", ""))),
        "  node [shape=box, style=\"rounded,filled\", fontname=\"Malgun Gothic\", fillcolor=\"#f7fbff\", color=\"#557a95\"];",
        "  edge [fontname=\"Malgun Gothic\", color=\"#6b7280\"];",
    ]

    for row in node_rows:
        fill = "#fff7ed" if row.get("confidence") == "low" else "#f7fbff"
        label = f"{row.get('label_ko', '')}\\n{row.get('concept_type', '')}"
        lines.append(
            "  \"{}\" [label=\"{}\", fillcolor=\"{}\"];".format(
                dot_escape(row.get("concept_id", "")),
                dot_escape(label),
                fill,
            )
        )

    external_ids: set[str] = set()
    for row in edge_rows:
        for endpoint_key, label_key in [("source_id", "source_label_ko"), ("target_id", "target_label_ko")]:
            concept_id = str(row.get(endpoint_key, ""))
            if concept_id and concept_id not in node_by_id:
                if concept_id in external_ids:
                    continue
                external_ids.add(concept_id)
                label = f"{row.get(label_key, '')}\\nexternal"
                lines.append(
                    "  \"{}\" [label=\"{}\", fillcolor=\"#f3f4f6\", color=\"#9ca3af\"];".format(
                        dot_escape(concept_id),
                        dot_escape(label),
                    )
                )

    for row in edge_rows:
        style = "solid" if row.get("edge_scope") == "intra_unit" else "dashed"
        color = "#b91c1c" if row.get("confidence") == "low" else "#6b7280"
        lines.append(
            "  \"{}\" -> \"{}\" [label=\"{}\", style=\"{}\", color=\"{}\"];".format(
                dot_escape(row.get("source_id", "")),
                dot_escape(row.get("target_id", "")),
                dot_escape(row.get("relationship_type", "")),
                style,
                color,
            )
        )

    lines.append("}")
    return "\n".join(lines)


def write_node_csv(rows: list[dict], path: Path = PILOT_UNIT_MAP_NODES_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=NODE_CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def write_edge_csv(rows: list[dict], path: Path = PILOT_UNIT_MAP_EDGES_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=EDGE_CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a compact pilot unit concept hierarchy map.")
    parser.add_argument("--rank", type=int, default=1, help="textbook evidence workplan rank")
    args = parser.parse_args()

    workplan_rows = read_csv_rows(TEXTBOOK_EVIDENCE_WORKPLAN_CSV)
    target = target_unit(workplan_rows, rank=args.rank)
    concepts, edges = read_concepts_data()
    concept_evidence_rows = read_csv_rows(CONCEPT_EVIDENCE_DEPTH_CSV)
    edge_evidence_rows = read_csv_rows(EDGE_EVIDENCE_DEPTH_CSV)
    node_rows = pilot_unit_node_rows(concepts, concept_evidence_rows, target)
    edge_rows = pilot_unit_edge_rows(concepts, edges, edge_evidence_rows, target)

    write_node_csv(node_rows)
    write_edge_csv(edge_rows)
    PILOT_UNIT_MAP_MD.write_text(render_markdown(target, node_rows, edge_rows), encoding="utf-8")
    PILOT_UNIT_MAP_DOT.write_text(render_dot(target, node_rows, edge_rows), encoding="utf-8")
    print(
        f"Wrote pilot unit map for rank {args.rank}: "
        f"{len(node_rows)} concepts, {len(edge_rows)} edges."
    )


if __name__ == "__main__":
    main()
