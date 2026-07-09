from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
EDGE_EVIDENCE_DEPTH_CSV = OUT_DIR / "edge-evidence-depth.csv"
EDGE_EVIDENCE_DEPTH_MD = OUT_DIR / "edge-evidence-depth.md"

CURRICULUM_SOURCES = {"curriculum_math_2022"}
ACHIEVEMENT_SOURCES = {"achievement_math_2022"}
TEXTBOOK_SOURCES = {"textbook_originals"}

CSV_FIELDS = [
    "edge_id",
    "source_id",
    "source_label_ko",
    "source_grade",
    "source_domain",
    "source_unit",
    "target_id",
    "target_label_ko",
    "target_grade",
    "target_domain",
    "target_unit",
    "relationship_type",
    "edge_scope",
    "confidence",
    "source_ref_count",
    "source_count",
    "evidence_kind_count",
    "sources",
    "evidence_kinds",
    "has_curriculum_evidence",
    "has_achievement_evidence",
    "has_textbook_evidence",
    "evidence_depth",
    "needs_textbook_evidence",
    "notes",
]


def yes_no(value: bool) -> str:
    return "yes" if value else "no"


def evidence_depth_for(sources: set[str]) -> str:
    if sources & TEXTBOOK_SOURCES:
        return "textbook_supported"
    if not sources:
        return "source_gap"
    if sources & CURRICULUM_SOURCES and sources & ACHIEVEMENT_SOURCES:
        return "official_dual_source"
    return "official_single_source"


def edge_scope(source: dict, target: dict) -> str:
    source_grade = source.get("grade", "")
    source_domain = source.get("domain", "")
    source_unit = source.get("unit", "")
    target_grade = target.get("grade", "")
    target_domain = target.get("domain", "")
    target_unit = target.get("unit", "")

    if (source_grade, source_domain, source_unit) == (target_grade, target_domain, target_unit):
        return "same_unit"
    if source_grade == target_grade and source_domain == target_domain:
        return "cross_unit_same_domain"
    if source_grade == target_grade:
        return "cross_domain_same_grade"
    if source_domain == target_domain:
        return "cross_grade_same_domain"
    return "cross_grade_cross_domain"


def edge_evidence_rows(concepts: Iterable[dict], edges: Iterable[dict]) -> list[dict]:
    concepts_by_id = {str(concept.get("id", "")): concept for concept in concepts}
    rows: list[dict] = []

    for edge in edges:
        refs = edge.get("source_refs", [])
        sources = {str(ref.get("source_id", "")) for ref in refs if str(ref.get("source_id", "")).strip()}
        evidence_kinds = {
            str(ref.get("evidence_kind", ""))
            for ref in refs
            if str(ref.get("evidence_kind", "")).strip()
        }
        has_textbook = bool(sources & TEXTBOOK_SOURCES)
        source = concepts_by_id.get(str(edge.get("source_id", "")), {})
        target = concepts_by_id.get(str(edge.get("target_id", "")), {})

        rows.append(
            {
                "edge_id": edge.get("id", ""),
                "source_id": edge.get("source_id", ""),
                "source_label_ko": source.get("label_ko", ""),
                "source_grade": source.get("grade", ""),
                "source_domain": source.get("domain", ""),
                "source_unit": source.get("unit", ""),
                "target_id": edge.get("target_id", ""),
                "target_label_ko": target.get("label_ko", ""),
                "target_grade": target.get("grade", ""),
                "target_domain": target.get("domain", ""),
                "target_unit": target.get("unit", ""),
                "relationship_type": edge.get("relationship_type", ""),
                "edge_scope": edge_scope(source, target),
                "confidence": edge.get("confidence", ""),
                "source_ref_count": len(refs),
                "source_count": len(sources),
                "evidence_kind_count": len(evidence_kinds),
                "sources": "; ".join(sorted(sources)),
                "evidence_kinds": "; ".join(sorted(evidence_kinds)),
                "has_curriculum_evidence": yes_no(bool(sources & CURRICULUM_SOURCES)),
                "has_achievement_evidence": yes_no(bool(sources & ACHIEVEMENT_SOURCES)),
                "has_textbook_evidence": yes_no(has_textbook),
                "evidence_depth": evidence_depth_for(sources),
                "needs_textbook_evidence": yes_no(not has_textbook),
                "notes": edge.get("notes", ""),
            }
        )
    return rows


def evidence_depth_summary(rows: Iterable[dict]) -> dict:
    row_list = list(rows)
    return {
        "edge_count": len(row_list),
        "needs_textbook_evidence_count": sum(
            1 for row in row_list if row.get("needs_textbook_evidence") == "yes"
        ),
        "low_confidence_count": sum(1 for row in row_list if row.get("confidence") == "low"),
        "depth_counts": Counter(str(row.get("evidence_depth", "")) for row in row_list),
        "scope_counts": Counter(str(row.get("edge_scope", "")) for row in row_list),
    }


def render_markdown(rows: list[dict]) -> str:
    summary = evidence_depth_summary(rows)
    lines = [
        "# Edge Evidence Depth",
        "",
        "This generated audit summarizes source evidence depth for each relationship edge.",
        "",
        "## Summary",
        "",
        f"- edges: {summary['edge_count']}",
        f"- needs textbook evidence: {summary['needs_textbook_evidence_count']}",
        f"- low confidence edges: {summary['low_confidence_count']}",
        "",
        "## Evidence Depth Counts",
        "",
        "| evidence_depth | edge count |",
        "|---|---:|",
    ]

    for evidence_depth, count in sorted(summary["depth_counts"].items()):
        lines.append(f"| {evidence_depth} | {count} |")

    lines.extend(
        [
            "",
            "## Edge Scope Counts",
            "",
            "| edge_scope | edge count |",
            "|---|---:|",
        ]
    )
    for scope, count in sorted(summary["scope_counts"].items()):
        lines.append(f"| {scope} | {count} |")

    lines.extend(
        [
            "",
            "## Priority Rows",
            "",
            "| edge_id | relationship | scope | confidence | evidence_depth | source refs | sources |",
            "|---|---|---|---|---|---:|---|",
        ]
    )

    priority_rows = sorted(
        rows,
        key=lambda row: (
            row.get("needs_textbook_evidence") != "yes",
            row.get("confidence") != "low",
            str(row.get("edge_scope", "")),
            str(row.get("relationship_type", "")),
            str(row.get("edge_id", "")),
        ),
    )[:40]
    for row in priority_rows:
        lines.append(
            "| {edge_id} | {relationship_type} | {edge_scope} | {confidence} | "
            "{evidence_depth} | {source_ref_count} | {sources} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = EDGE_EVIDENCE_DEPTH_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    data = json.loads(CONCEPTS_JSON.read_text(encoding="utf-8"))
    rows = edge_evidence_rows(data.get("concepts", []), data.get("edges", []))
    write_csv(rows)
    EDGE_EVIDENCE_DEPTH_MD.write_text(render_markdown(rows), encoding="utf-8")

    summary = evidence_depth_summary(rows)
    print(
        f"Wrote edge evidence depth for {summary['edge_count']} edges "
        f"({summary['needs_textbook_evidence_count']} need textbook evidence) "
        f"to {EDGE_EVIDENCE_DEPTH_CSV} and {EDGE_EVIDENCE_DEPTH_MD}."
    )


if __name__ == "__main__":
    main()
