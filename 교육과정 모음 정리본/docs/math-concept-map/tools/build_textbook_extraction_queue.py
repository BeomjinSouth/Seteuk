from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPT_EVIDENCE_DEPTH_CSV = OUT_DIR / "concept-evidence-depth.csv"
TEXTBOOK_EXTRACTION_QUEUE_CSV = OUT_DIR / "textbook-extraction-queue.csv"
TEXTBOOK_EXTRACTION_QUEUE_MD = OUT_DIR / "textbook-extraction-queue.md"

CSV_FIELDS = [
    "rank",
    "grade",
    "domain",
    "unit",
    "concept_count",
    "needs_textbook_evidence_count",
    "low_confidence_count",
    "official_single_source_count",
    "official_dual_source_count",
    "textbook_supported_count",
    "priority_score",
    "priority_tier",
    "next_action",
]


def int_flag(value: bool) -> int:
    return 1 if value else 0


def priority_score(row: dict) -> int:
    return (
        int(row["needs_textbook_evidence_count"])
        + int(row["low_confidence_count"]) * 4
        + int(row["official_single_source_count"]) * 2
    )


def priority_tier(score: int) -> str:
    if score >= 40:
        return "highest"
    if score >= 20:
        return "high"
    if score >= 8:
        return "medium"
    if score > 0:
        return "low"
    return "complete"


def next_action(row: dict) -> str:
    if int(row["low_confidence_count"]) > 0:
        return "textbook_evidence_for_low_confidence"
    if int(row["official_single_source_count"]) > 0:
        return "confirm_official_single_source_concepts"
    if int(row["needs_textbook_evidence_count"]) > 0:
        return "add_textbook_page_refs"
    return "no_textbook_action_needed"


def textbook_extraction_queue_rows(evidence_rows: Iterable[dict]) -> list[dict]:
    grouped: dict[tuple[str, str, str], dict] = defaultdict(
        lambda: {
            "concept_count": 0,
            "needs_textbook_evidence_count": 0,
            "low_confidence_count": 0,
            "official_single_source_count": 0,
            "official_dual_source_count": 0,
            "textbook_supported_count": 0,
        }
    )

    for evidence in evidence_rows:
        key = (evidence.get("grade", ""), evidence.get("domain", ""), evidence.get("unit", ""))
        row = grouped[key]
        row["concept_count"] += 1
        row["needs_textbook_evidence_count"] += int_flag(evidence.get("needs_textbook_evidence") == "yes")
        row["low_confidence_count"] += int_flag(evidence.get("confidence") == "low")
        row["official_single_source_count"] += int_flag(evidence.get("evidence_depth") == "official_single_source")
        row["official_dual_source_count"] += int_flag(evidence.get("evidence_depth") == "official_dual_source")
        row["textbook_supported_count"] += int_flag(evidence.get("evidence_depth") == "textbook_supported")

    rows: list[dict] = []
    for (grade, domain, unit), counts in grouped.items():
        row = {
            "rank": 0,
            "grade": grade,
            "domain": domain,
            "unit": unit,
            **counts,
        }
        score = priority_score(row)
        row["priority_score"] = score
        row["priority_tier"] = priority_tier(score)
        row["next_action"] = next_action(row)
        rows.append(row)

    rows.sort(
        key=lambda row: (
            -int(row["priority_score"]),
            -int(row["low_confidence_count"]),
            -int(row["official_single_source_count"]),
            str(row["domain"]),
            str(row["unit"]),
        )
    )
    for index, row in enumerate(rows, start=1):
        row["rank"] = index
    return rows


def render_markdown(rows: list[dict]) -> str:
    total_needs = sum(int(row["needs_textbook_evidence_count"]) for row in rows)
    total_low = sum(int(row["low_confidence_count"]) for row in rows)
    lines = [
        "# Textbook Extraction Queue",
        "",
        "This generated queue ranks units for the next textbook-grounded concept extraction pass.",
        "",
        "## Summary",
        "",
        f"- unit groups: {len(rows)}",
        f"- concepts needing textbook evidence: {total_needs}",
        f"- low confidence concepts in queue: {total_low}",
        "",
        "## Queue",
        "",
        "| rank | grade | domain | unit | tier | score | needs textbook | low | official single | next action |",
        "|---:|---|---|---|---|---:|---:|---:|---:|---|",
    ]

    for row in rows:
        lines.append(
            "| {rank} | {grade} | {domain} | {unit} | {priority_tier} | {priority_score} | "
            "{needs_textbook_evidence_count} | {low_confidence_count} | "
            "{official_single_source_count} | {next_action} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = TEXTBOOK_EXTRACTION_QUEUE_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def read_concept_evidence_rows(path: Path = CONCEPT_EVIDENCE_DEPTH_CSV) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def main() -> None:
    rows = textbook_extraction_queue_rows(read_concept_evidence_rows())
    write_csv(rows)
    TEXTBOOK_EXTRACTION_QUEUE_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote textbook extraction queue for {len(rows)} unit groups "
        f"to {TEXTBOOK_EXTRACTION_QUEUE_CSV} and {TEXTBOOK_EXTRACTION_QUEUE_MD}."
    )


if __name__ == "__main__":
    main()
