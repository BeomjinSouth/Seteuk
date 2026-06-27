from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
OFFICIAL_TERM_COVERAGE_CSV = OUT_DIR / "official-term-coverage.csv"
EQUIVALENCE_ALIAS_AUDIT_CSV = OUT_DIR / "equivalence-alias-audit.csv"
EQUIVALENCE_ALIAS_AUDIT_MD = OUT_DIR / "equivalence-alias-audit.md"

CSV_FIELDS = [
    "record_type",
    "record_id",
    "label_ko",
    "alias_or_term",
    "concept_ids",
    "concept_labels",
    "grade_domain_unit",
    "relationship_status",
    "recommended_action",
    "confidence",
    "source_ref_count",
    "notes",
]


def read_csv_rows(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def read_concepts_data(path: Path = CONCEPTS_JSON) -> tuple[list[dict], list[dict]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return list(data.get("concepts", [])), list(data.get("edges", []))


def joined(values: Iterable[object]) -> str:
    return "; ".join(str(value) for value in values if str(value).strip())


def grade_domain_unit(concept: dict) -> str:
    return " > ".join(
        str(concept.get(key, ""))
        for key in ["grade", "domain", "unit"]
        if str(concept.get(key, "")).strip()
    )


def source_ref_count(record: dict) -> int:
    refs = record.get("source_refs", [])
    return len(refs) if isinstance(refs, list) else 0


def concept_alias_rows(concepts: Iterable[dict]) -> list[dict]:
    rows: list[dict] = []
    for concept in concepts:
        aliases = list(concept.get("aliases", []))
        if not aliases:
            continue
        rows.append(
            {
                "record_type": "concept_alias",
                "record_id": concept.get("id", ""),
                "label_ko": concept.get("label_ko", ""),
                "alias_or_term": joined(aliases),
                "concept_ids": concept.get("id", ""),
                "concept_labels": concept.get("label_ko", ""),
                "grade_domain_unit": grade_domain_unit(concept),
                "relationship_status": "alias_on_concept",
                "recommended_action": "preserve_alias_and_check_textbook_wording",
                "confidence": "high",
                "source_ref_count": source_ref_count(concept),
                "notes": "Aliases are stored on the concept node; add an equivalent_to edge only when sources treat two separate concepts as interchangeable.",
            }
        )
    return rows


def equivalent_edge_rows(concepts_by_id: dict[str, dict], edges: Iterable[dict]) -> list[dict]:
    rows: list[dict] = []
    for edge in edges:
        if edge.get("relationship_type") != "equivalent_to":
            continue
        source = concepts_by_id.get(str(edge.get("source_id", "")), {})
        target = concepts_by_id.get(str(edge.get("target_id", "")), {})
        rows.append(
            {
                "record_type": "equivalent_edge",
                "record_id": edge.get("id", ""),
                "label_ko": f"{source.get('label_ko', '')} = {target.get('label_ko', '')}",
                "alias_or_term": "",
                "concept_ids": joined([edge.get("source_id", ""), edge.get("target_id", "")]),
                "concept_labels": joined([source.get("label_ko", ""), target.get("label_ko", "")]),
                "grade_domain_unit": joined([grade_domain_unit(source), grade_domain_unit(target)]),
                "relationship_status": "explicit_equivalent_to_edge",
                "recommended_action": "keep_edge_and_confirm_textbook_usage",
                "confidence": edge.get("confidence", ""),
                "source_ref_count": source_ref_count(edge),
                "notes": edge.get("notes", ""),
            }
        )
    return rows


def duplicate_label_rows(concepts: Iterable[dict]) -> list[dict]:
    by_label: dict[str, list[dict]] = defaultdict(list)
    for concept in concepts:
        label = str(concept.get("label_ko", "")).strip()
        if label:
            by_label[label].append(concept)

    rows: list[dict] = []
    for label, group in sorted(by_label.items()):
        if len(group) < 2:
            continue
        rows.append(
            {
                "record_type": "duplicate_label",
                "record_id": f"label:{label}",
                "label_ko": label,
                "alias_or_term": "",
                "concept_ids": joined(concept.get("id", "") for concept in group),
                "concept_labels": joined(concept.get("label_ko", "") for concept in group),
                "grade_domain_unit": joined(grade_domain_unit(concept) for concept in group),
                "relationship_status": "same_label_multiple_nodes",
                "recommended_action": "review_unit_vs_micro_concept_split_before_equivalent_edge",
                "confidence": "medium",
                "source_ref_count": sum(source_ref_count(concept) for concept in group),
                "notes": "Same Korean label appears on multiple nodes; preserve only when unit-level and micro-concept roles are distinct.",
            }
        )
    return rows


def official_multi_match_rows(official_term_rows: Iterable[dict]) -> list[dict]:
    rows: list[dict] = []
    for row in official_term_rows:
        try:
            concept_count = int(str(row.get("concept_count", 0)))
        except ValueError:
            concept_count = 0
        if concept_count < 2:
            continue
        term = str(row.get("term", ""))
        rows.append(
            {
                "record_type": "official_term_multi_match",
                "record_id": f"term:{term}",
                "label_ko": term,
                "alias_or_term": term,
                "concept_ids": row.get("concept_ids", ""),
                "concept_labels": row.get("concept_labels", ""),
                "grade_domain_unit": "",
                "relationship_status": "official_term_maps_to_multiple_concepts",
                "recommended_action": "review_term_scope_and_preserve_alias_or_split_reason",
                "confidence": "medium",
                "source_ref_count": 0,
                "notes": row.get("notes", ""),
            }
        )
    return rows


def equivalence_alias_audit_rows(
    concepts: Iterable[dict],
    edges: Iterable[dict],
    official_term_rows: Iterable[dict],
) -> list[dict]:
    concept_list = list(concepts)
    concepts_by_id = {str(concept.get("id", "")): concept for concept in concept_list}
    rows = (
        concept_alias_rows(concept_list)
        + equivalent_edge_rows(concepts_by_id, edges)
        + duplicate_label_rows(concept_list)
        + official_multi_match_rows(official_term_rows)
    )
    rows.sort(
        key=lambda row: (
            str(row.get("record_type", "")),
            str(row.get("label_ko", "")),
            str(row.get("record_id", "")),
        )
    )
    return rows


def render_markdown(rows: list[dict]) -> str:
    type_counts = Counter(str(row.get("record_type", "")) for row in rows)
    action_counts = Counter(str(row.get("recommended_action", "")) for row in rows)
    lines = [
        "# Equivalence Alias Audit",
        "",
        "This generated audit separates aliases, explicit equivalent edges, repeated labels, and official terms that map to multiple concept nodes.",
        "",
        "## Summary",
        "",
        f"- audit rows: {len(rows)}",
        "",
        "## Record Types",
        "",
        "| record_type | count |",
        "|---|---:|",
    ]
    for record_type, count in sorted(type_counts.items()):
        lines.append(f"| {record_type} | {count} |")

    lines.extend(
        [
            "",
            "## Recommended Actions",
            "",
            "| recommended_action | count |",
            "|---|---:|",
        ]
    )
    for action, count in sorted(action_counts.items()):
        lines.append(f"| {action} | {count} |")

    lines.extend(
        [
            "",
            "## Review Rows",
            "",
            "| type | label | alias_or_term | status | action | confidence | source refs |",
            "|---|---|---|---|---|---|---:|",
        ]
    )
    priority_types = {"equivalent_edge", "duplicate_label", "official_term_multi_match"}
    priority_rows = [row for row in rows if row.get("record_type") in priority_types]
    for row in priority_rows[:80]:
        lines.append(
            "| {record_type} | {label_ko} | {alias_or_term} | {relationship_status} | "
            "{recommended_action} | {confidence} | {source_ref_count} |".format(**row)
        )
    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = EQUIVALENCE_ALIAS_AUDIT_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    concepts, edges = read_concepts_data()
    official_term_rows = read_csv_rows(OFFICIAL_TERM_COVERAGE_CSV)
    rows = equivalence_alias_audit_rows(concepts, edges, official_term_rows)
    write_csv(rows)
    EQUIVALENCE_ALIAS_AUDIT_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote equivalence alias audit with {len(rows)} rows "
        f"to {EQUIVALENCE_ALIAS_AUDIT_CSV} and {EQUIVALENCE_ALIAS_AUDIT_MD}."
    )


if __name__ == "__main__":
    main()
