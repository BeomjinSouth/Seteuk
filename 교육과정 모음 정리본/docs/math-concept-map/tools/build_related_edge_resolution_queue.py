from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
NODE_EDGE_CONSISTENCY_CSV = OUT_DIR / "node-edge-consistency-audit.csv"
RELATED_EDGE_RESOLUTION_QUEUE_CSV = OUT_DIR / "related-edge-resolution-queue.csv"
RELATED_EDGE_RESOLUTION_QUEUE_MD = OUT_DIR / "related-edge-resolution-queue.md"

CSV_FIELDS = [
    "rank",
    "node_id",
    "node_label_ko",
    "related_id",
    "related_label_ko",
    "node_domain",
    "node_unit",
    "related_domain",
    "related_unit",
    "node_concept_type",
    "related_concept_type",
    "same_domain",
    "same_unit",
    "reciprocal_related_id",
    "candidate_relationship_types",
    "priority_score",
    "priority_tier",
    "next_action",
    "source_refs",
]


def yes_no(value: bool) -> str:
    return "yes" if value else "no"


def source_ref_summary(concept: dict) -> str:
    refs = concept.get("source_refs", [])
    parts = []
    for ref in refs[:3]:
        source_id = str(ref.get("source_id", ""))
        locator = str(ref.get("locator", ""))
        if source_id and locator:
            parts.append(f"{source_id}: {locator}")
        elif source_id:
            parts.append(source_id)
    if len(refs) > 3:
        parts.append(f"+{len(refs) - 3} more")
    return "; ".join(parts)


def candidate_relationship_types(node: dict, related: dict) -> str:
    types = {node.get("concept_type", ""), related.get("concept_type", "")}
    if "misconception_risk" in types:
        return "often_confused_with"
    if "representation" in types:
        return "represented_by; related_to"
    if "procedure" in types:
        return "used_in; related_to"
    if node.get("concept_type") == related.get("concept_type"):
        return "contrasts_with; related_to"
    return "related_to"


def next_action(candidate_types: str) -> str:
    if candidate_types == "often_confused_with":
        return "confirm_often_confused_with_evidence"
    if candidate_types.startswith("represented_by"):
        return "confirm_representation_or_related_edge"
    if candidate_types.startswith("used_in"):
        return "confirm_used_in_or_related_edge"
    if candidate_types.startswith("contrasts_with"):
        return "confirm_contrast_or_related_edge"
    return "confirm_related_to_edge"


def priority_score(row: dict) -> int:
    score = 0
    if row["same_unit"] == "yes":
        score += 2
    if row["same_domain"] == "yes":
        score += 1
    if row["reciprocal_related_id"] == "yes":
        score += 2
    if "misconception_risk" in {row["node_concept_type"], row["related_concept_type"]}:
        score += 8
    if "low" in {row.get("node_confidence", ""), row.get("related_confidence", "")}:
        score += 3
    if row["candidate_relationship_types"] != "related_to":
        score += 2
    return score


def priority_tier(score: int) -> str:
    if score >= 12:
        return "high"
    if score >= 8:
        return "medium"
    if score > 0:
        return "low"
    return "backlog"


def related_edge_resolution_rows(concepts: Iterable[dict], consistency_rows: Iterable[dict]) -> list[dict]:
    concepts_by_id = {str(concept.get("id", "")): concept for concept in concepts}
    rows: list[dict] = []

    for issue in consistency_rows:
        if issue.get("issue_type") != "missing_edge_for_related_id":
            continue
        node = concepts_by_id.get(str(issue.get("node_id", "")), {})
        related = concepts_by_id.get(str(issue.get("related_id", "")), {})
        node_id = str(node.get("id", issue.get("node_id", "")))
        related_id = str(related.get("id", issue.get("related_id", "")))
        candidate_types = candidate_relationship_types(node, related)
        reciprocal = node_id in related.get("related_ids", [])
        row = {
            "rank": 0,
            "node_id": node_id,
            "node_label_ko": str(node.get("label_ko", issue.get("node_label_ko", ""))),
            "related_id": related_id,
            "related_label_ko": str(related.get("label_ko", issue.get("related_label_ko", ""))),
            "node_domain": str(node.get("domain", "")),
            "node_unit": str(node.get("unit", "")),
            "related_domain": str(related.get("domain", "")),
            "related_unit": str(related.get("unit", "")),
            "node_concept_type": str(node.get("concept_type", "")),
            "related_concept_type": str(related.get("concept_type", "")),
            "same_domain": yes_no(node.get("domain", "") == related.get("domain", "")),
            "same_unit": yes_no(
                node.get("grade", "") == related.get("grade", "")
                and node.get("domain", "") == related.get("domain", "")
                and node.get("unit", "") == related.get("unit", "")
            ),
            "reciprocal_related_id": yes_no(reciprocal),
            "candidate_relationship_types": candidate_types,
            "node_confidence": str(node.get("confidence", "")),
            "related_confidence": str(related.get("confidence", "")),
            "priority_score": 0,
            "priority_tier": "",
            "next_action": next_action(candidate_types),
            "source_refs": source_ref_summary(node) or source_ref_summary(related),
        }
        score = priority_score(row)
        row["priority_score"] = score
        row["priority_tier"] = priority_tier(score)
        row = {field: row[field] for field in CSV_FIELDS}
        rows.append(row)

    rows.sort(
        key=lambda row: (
            -int(row["priority_score"]),
            row["node_domain"],
            row["node_unit"],
            row["node_id"],
            row["related_id"],
        )
    )
    for index, row in enumerate(rows, start=1):
        row["rank"] = index
    return rows


def render_markdown(rows: list[dict]) -> str:
    lines = [
        "# Related Edge Resolution Queue",
        "",
        "This generated queue isolates unresolved `related_ids` entries and suggests candidate edge types for source-backed review.",
        "",
        "## Summary",
        "",
        f"- related edge candidates: {len(rows)}",
        f"- high priority: {sum(1 for row in rows if row['priority_tier'] == 'high')}",
        f"- medium priority: {sum(1 for row in rows if row['priority_tier'] == 'medium')}",
        "",
        "## Queue",
        "",
        "| rank | tier | node_id | node | related_id | related | candidates | next action |",
        "|---:|---|---|---|---|---|---|---|",
    ]

    for row in rows[:100]:
        lines.append(
            "| {rank} | {priority_tier} | {node_id} | {node_label_ko} | "
            "{related_id} | {related_label_ko} | {candidate_relationship_types} | "
            "{next_action} |".format(**row)
        )

    lines.extend(
        [
            "",
            "## Notes",
            "",
            "- Candidate types are review hints, not final relationship assertions.",
            "- Confirm official or textbook wording before adding `related_to`, `contrasts_with`, `often_confused_with`, `represented_by`, or `used_in` edges.",
            "- Rows are sorted to surface same-unit, reciprocal, low-confidence, and misconception-risk links first.",
            "",
        ]
    )
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = RELATED_EDGE_RESOLUTION_QUEUE_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def read_csv_rows(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def main() -> None:
    data = json.loads(CONCEPTS_JSON.read_text(encoding="utf-8"))
    rows = related_edge_resolution_rows(
        data.get("concepts", []),
        read_csv_rows(NODE_EDGE_CONSISTENCY_CSV),
    )
    write_csv(rows)
    RELATED_EDGE_RESOLUTION_QUEUE_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote related edge resolution queue for {len(rows)} rows "
        f"to {RELATED_EDGE_RESOLUTION_QUEUE_CSV} and {RELATED_EDGE_RESOLUTION_QUEUE_MD}."
    )


if __name__ == "__main__":
    main()
