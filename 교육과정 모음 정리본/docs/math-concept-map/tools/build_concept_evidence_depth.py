from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
CONCEPT_EVIDENCE_DEPTH_CSV = OUT_DIR / "concept-evidence-depth.csv"
CONCEPT_EVIDENCE_DEPTH_MD = OUT_DIR / "concept-evidence-depth.md"

CURRICULUM_SOURCES = {"curriculum_math_2022"}
ACHIEVEMENT_SOURCES = {"achievement_math_2022"}
TEXTBOOK_SOURCES = {"textbook_originals"}

CSV_FIELDS = [
    "concept_id",
    "label_ko",
    "grade",
    "domain",
    "unit",
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


def concept_evidence_rows(concepts: Iterable[dict]) -> list[dict]:
    rows: list[dict] = []
    for concept in concepts:
        refs = concept.get("source_refs", [])
        sources = {str(ref.get("source_id", "")) for ref in refs if str(ref.get("source_id", "")).strip()}
        evidence_kinds = {
            str(ref.get("evidence_kind", ""))
            for ref in refs
            if str(ref.get("evidence_kind", "")).strip()
        }
        has_textbook = bool(sources & TEXTBOOK_SOURCES)

        rows.append(
            {
                "concept_id": concept.get("id", ""),
                "label_ko": concept.get("label_ko", ""),
                "grade": concept.get("grade", ""),
                "domain": concept.get("domain", ""),
                "unit": concept.get("unit", ""),
                "confidence": concept.get("confidence", ""),
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
            }
        )
    return rows


def evidence_depth_summary(rows: Iterable[dict]) -> dict:
    row_list = list(rows)
    return {
        "concept_count": len(row_list),
        "needs_textbook_evidence_count": sum(
            1 for row in row_list if row.get("needs_textbook_evidence") == "yes"
        ),
        "low_confidence_count": sum(1 for row in row_list if row.get("confidence") == "low"),
        "depth_counts": Counter(str(row.get("evidence_depth", "")) for row in row_list),
    }


def render_markdown(rows: list[dict]) -> str:
    summary = evidence_depth_summary(rows)
    lines = [
        "# Concept Evidence Depth",
        "",
        "This generated audit summarizes source evidence depth for each concept node.",
        "",
        "## Summary",
        "",
        f"- concepts: {summary['concept_count']}",
        f"- needs textbook evidence: {summary['needs_textbook_evidence_count']}",
        f"- low confidence concepts: {summary['low_confidence_count']}",
        "",
        "## Evidence Depth Counts",
        "",
        "| evidence_depth | concept count |",
        "|---|---:|",
    ]

    for evidence_depth, count in sorted(summary["depth_counts"].items()):
        lines.append(f"| {evidence_depth} | {count} |")

    lines.extend(
        [
            "",
            "## Priority Rows",
            "",
            "| concept_id | label_ko | confidence | evidence_depth | source refs | sources |",
            "|---|---|---|---|---:|---|",
        ]
    )

    priority_rows = sorted(
        rows,
        key=lambda row: (
            row.get("needs_textbook_evidence") != "yes",
            row.get("confidence") != "low",
            str(row.get("domain", "")),
            str(row.get("unit", "")),
            str(row.get("concept_id", "")),
        ),
    )[:40]
    for row in priority_rows:
        lines.append(
            "| {concept_id} | {label_ko} | {confidence} | {evidence_depth} | "
            "{source_ref_count} | {sources} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = CONCEPT_EVIDENCE_DEPTH_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    data = json.loads(CONCEPTS_JSON.read_text(encoding="utf-8"))
    rows = concept_evidence_rows(data.get("concepts", []))
    write_csv(rows)
    CONCEPT_EVIDENCE_DEPTH_MD.write_text(render_markdown(rows), encoding="utf-8")

    summary = evidence_depth_summary(rows)
    print(
        f"Wrote concept evidence depth for {summary['concept_count']} concepts "
        f"({summary['needs_textbook_evidence_count']} need textbook evidence) "
        f"to {CONCEPT_EVIDENCE_DEPTH_CSV} and {CONCEPT_EVIDENCE_DEPTH_MD}."
    )


if __name__ == "__main__":
    main()
