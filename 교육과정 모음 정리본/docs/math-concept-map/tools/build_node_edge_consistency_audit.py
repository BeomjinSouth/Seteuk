from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
NODE_EDGE_CONSISTENCY_CSV = OUT_DIR / "node-edge-consistency-audit.csv"
NODE_EDGE_CONSISTENCY_MD = OUT_DIR / "node-edge-consistency-audit.md"

RELATED_EDGE_TYPES = {
    "related_to",
    "equivalent_to",
    "contrasts_with",
    "often_confused_with",
    "represented_by",
    "used_in",
}

ISSUE_TYPE_ORDER = {
    "missing_edge_for_parent_id": 0,
    "missing_edge_for_prerequisite_id": 1,
    "missing_edge_for_related_id": 2,
    "edge_without_parent_id": 3,
    "edge_without_prerequisite_id": 4,
}

CSV_FIELDS = [
    "issue_type",
    "node_id",
    "node_label_ko",
    "array_field",
    "related_id",
    "related_label_ko",
    "expected_relationship_type",
    "matching_edge_ids",
    "issue_status",
    "notes",
]


def concept_label(concepts_by_id: dict[str, dict], concept_id: str) -> str:
    return str(concepts_by_id.get(concept_id, {}).get("label_ko", ""))


def edge_ids_by_pair(edges: Iterable[dict], relationship_type: str) -> dict[tuple[str, str], list[str]]:
    grouped: dict[tuple[str, str], list[str]] = {}
    for edge in edges:
        if edge.get("relationship_type") != relationship_type:
            continue
        key = (str(edge.get("source_id", "")), str(edge.get("target_id", "")))
        grouped.setdefault(key, []).append(str(edge.get("id", "")))
    return grouped


def related_edge_ids_by_unordered_pair(edges: Iterable[dict]) -> dict[frozenset[str], list[str]]:
    grouped: dict[frozenset[str], list[str]] = {}
    for edge in edges:
        if edge.get("relationship_type") not in RELATED_EDGE_TYPES:
            continue
        pair = frozenset([str(edge.get("source_id", "")), str(edge.get("target_id", ""))])
        grouped.setdefault(pair, []).append(str(edge.get("id", "")))
    return grouped


def issue_row(
    *,
    issue_type: str,
    concepts_by_id: dict[str, dict],
    node_id: str,
    array_field: str,
    related_id: str,
    expected_relationship_type: str,
    matching_edge_ids: Iterable[str] = (),
    notes: str,
) -> dict:
    return {
        "issue_type": issue_type,
        "node_id": node_id,
        "node_label_ko": concept_label(concepts_by_id, node_id),
        "array_field": array_field,
        "related_id": related_id,
        "related_label_ko": concept_label(concepts_by_id, related_id),
        "expected_relationship_type": expected_relationship_type,
        "matching_edge_ids": "; ".join(edge_id for edge_id in matching_edge_ids if edge_id),
        "issue_status": "review_needed",
        "notes": notes,
    }


def consistency_issue_rows(concepts: Iterable[dict], edges: Iterable[dict]) -> list[dict]:
    concept_list = list(concepts)
    edge_list = list(edges)
    concepts_by_id = {str(concept.get("id", "")): concept for concept in concept_list}
    contains_edges = edge_ids_by_pair(edge_list, "contains")
    prerequisite_edges = edge_ids_by_pair(edge_list, "prerequisite_for")
    related_edges = related_edge_ids_by_unordered_pair(edge_list)

    rows: list[dict] = []

    for concept in concept_list:
        node_id = str(concept.get("id", ""))
        for parent_id in concept.get("parent_ids", []):
            parent_id = str(parent_id)
            if (parent_id, node_id) not in contains_edges:
                rows.append(
                    issue_row(
                        issue_type="missing_edge_for_parent_id",
                        concepts_by_id=concepts_by_id,
                        node_id=node_id,
                        array_field="parent_ids",
                        related_id=parent_id,
                        expected_relationship_type="contains",
                        notes="parent_ids entry has no matching contains edge",
                    )
                )
        for prerequisite_id in concept.get("prerequisite_ids", []):
            prerequisite_id = str(prerequisite_id)
            if (prerequisite_id, node_id) not in prerequisite_edges:
                rows.append(
                    issue_row(
                        issue_type="missing_edge_for_prerequisite_id",
                        concepts_by_id=concepts_by_id,
                        node_id=node_id,
                        array_field="prerequisite_ids",
                        related_id=prerequisite_id,
                        expected_relationship_type="prerequisite_for",
                        notes="prerequisite_ids entry has no matching prerequisite_for edge",
                    )
                )
        for related_id in concept.get("related_ids", []):
            related_id = str(related_id)
            if frozenset([node_id, related_id]) not in related_edges:
                rows.append(
                    issue_row(
                        issue_type="missing_edge_for_related_id",
                        concepts_by_id=concepts_by_id,
                        node_id=node_id,
                        array_field="related_ids",
                        related_id=related_id,
                        expected_relationship_type="related_edge",
                        notes="related_ids entry has no matching related/contrast/confusion/representation/used-in edge in either direction",
                    )
                )

    for edge in edge_list:
        relationship_type = edge.get("relationship_type")
        source_id = str(edge.get("source_id", ""))
        target_id = str(edge.get("target_id", ""))
        target = concepts_by_id.get(target_id, {})
        if relationship_type == "contains" and source_id not in target.get("parent_ids", []):
            rows.append(
                issue_row(
                    issue_type="edge_without_parent_id",
                    concepts_by_id=concepts_by_id,
                    node_id=target_id,
                    array_field="parent_ids",
                    related_id=source_id,
                    expected_relationship_type="contains",
                    matching_edge_ids=[str(edge.get("id", ""))],
                    notes="contains edge is not mirrored in target parent_ids",
                )
            )
        if relationship_type == "prerequisite_for" and source_id not in target.get("prerequisite_ids", []):
            rows.append(
                issue_row(
                    issue_type="edge_without_prerequisite_id",
                    concepts_by_id=concepts_by_id,
                    node_id=target_id,
                    array_field="prerequisite_ids",
                    related_id=source_id,
                    expected_relationship_type="prerequisite_for",
                    matching_edge_ids=[str(edge.get("id", ""))],
                    notes="prerequisite_for edge is not mirrored in target prerequisite_ids",
                )
            )

    rows.sort(
        key=lambda row: (
            ISSUE_TYPE_ORDER.get(row["issue_type"], 99),
            row["issue_type"],
            row["array_field"],
            row["node_id"],
            row["related_id"],
            row["matching_edge_ids"],
        )
    )
    return rows


def issue_summary(rows: Iterable[dict]) -> dict:
    row_list = list(rows)
    counts = Counter(row.get("issue_type", "") for row in row_list)
    summary = {"total_issue_count": len(row_list)}
    summary.update(dict(counts))
    return summary


def render_markdown(rows: list[dict]) -> str:
    summary = issue_summary(rows)
    issue_types = sorted(key for key in summary if key != "total_issue_count")
    priority_rows = rows[:50]

    lines = [
        "# Node Edge Consistency Audit",
        "",
        "This generated audit compares node relationship arrays with explicit edge rows.",
        "",
        "## Summary",
        "",
        f"- total issues: {summary['total_issue_count']}",
    ]

    for issue_type in issue_types:
        lines.append(f"- {issue_type}: {summary[issue_type]}")

    lines.extend(
        [
            "",
            "## Priority Rows",
            "",
            "| issue_type | node_id | node | array_field | related_id | related label | expected relationship | matching edge ids |",
            "|---|---|---|---|---|---|---|---|",
        ]
    )

    for row in priority_rows:
        lines.append(
            "| {issue_type} | {node_id} | {node_label_ko} | {array_field} | "
            "{related_id} | {related_label_ko} | {expected_relationship_type} | "
            "{matching_edge_ids} |".format(**row)
        )

    lines.extend(
        [
            "",
            "## Notes",
            "",
            "- Rows are review items, not automatic data corrections.",
            "- Some `related_ids` entries are broad semantic links; confirm source wording before adding or removing edges.",
            "- Use this audit before editing `concepts.json` so node fields and edge rows stay traceable.",
            "",
        ]
    )
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = NODE_EDGE_CONSISTENCY_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    data = json.loads(CONCEPTS_JSON.read_text(encoding="utf-8"))
    rows = consistency_issue_rows(data.get("concepts", []), data.get("edges", []))
    write_csv(rows)
    NODE_EDGE_CONSISTENCY_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote node-edge consistency audit with {len(rows)} review rows "
        f"to {NODE_EDGE_CONSISTENCY_CSV} and {NODE_EDGE_CONSISTENCY_MD}."
    )


if __name__ == "__main__":
    main()
