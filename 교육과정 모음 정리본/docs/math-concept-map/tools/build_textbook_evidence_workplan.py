from __future__ import annotations

import csv
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
TEXTBOOK_EVIDENCE_PACKET_DIR = OUT_DIR / "textbook-evidence-packets"
TEXTBOOK_EDGE_EVIDENCE_PACKET_DIR = OUT_DIR / "textbook-edge-evidence-packets"
TEXTBOOK_EVIDENCE_WORKPLAN_CSV = OUT_DIR / "textbook-evidence-workplan.csv"
TEXTBOOK_EVIDENCE_WORKPLAN_MD = OUT_DIR / "textbook-evidence-workplan.md"

CONCEPT_PACKET_INDEX_CSV = TEXTBOOK_EVIDENCE_PACKET_DIR / "index.csv"
EDGE_PACKET_INDEX_CSV = TEXTBOOK_EDGE_EVIDENCE_PACKET_DIR / "index.csv"

CSV_FIELDS = [
    "rank",
    "grade",
    "domain",
    "unit",
    "priority_tier",
    "priority_score",
    "workplan_score",
    "concept_count",
    "pending_concept_evidence_count",
    "low_confidence_concept_count",
    "edge_count",
    "pending_edge_evidence_count",
    "intra_unit_edge_count",
    "cross_unit_edge_count",
    "low_confidence_edge_count",
    "total_evidence_rows",
    "total_pending_evidence_count",
    "total_low_confidence_count",
    "next_action",
    "concept_next_action",
    "concept_packet_csv",
    "concept_packet_md",
    "edge_packet_csv",
    "edge_packet_md",
]


def int_value(value: object) -> int:
    try:
        return int(str(value))
    except (TypeError, ValueError):
        return 0


def read_csv_rows(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def packet_pending_count(rows: Iterable[dict]) -> int:
    return sum(1 for row in rows if row.get("extraction_status") == "pending_textbook_pdf")


def edge_packet_rows_by_rank(
    edge_index_rows: Iterable[dict],
    packet_dir: Path = TEXTBOOK_EDGE_EVIDENCE_PACKET_DIR,
) -> dict[int, list[dict]]:
    rows_by_rank: dict[int, list[dict]] = {}
    for row in edge_index_rows:
        rank = int_value(row.get("rank"))
        packet_csv = str(row.get("packet_csv", "")).strip()
        packet_path = packet_dir / packet_csv
        rows_by_rank[rank] = read_csv_rows(packet_path) if packet_path.exists() else []
    return rows_by_rank


def next_action(row: dict) -> str:
    has_low_concepts = int_value(row.get("low_confidence_concept_count")) > 0
    has_low_edges = int_value(row.get("low_confidence_edge_count")) > 0
    if has_low_concepts and has_low_edges:
        return "fill_low_confidence_concept_and_edge_evidence"
    if has_low_concepts:
        return "fill_low_confidence_concept_evidence"
    if has_low_edges:
        return "fill_low_confidence_edge_evidence"
    if int_value(row.get("cross_unit_edge_count")) > 0:
        return "confirm_cross_unit_edge_evidence"
    if int_value(row.get("total_pending_evidence_count")) > 0:
        return "add_textbook_page_refs"
    return "no_textbook_action_needed"


def validate_matching_unit(concept_row: dict, edge_row: dict, rank: int) -> None:
    for key in ["grade", "domain", "unit"]:
        if concept_row.get(key, "") != edge_row.get(key, ""):
            raise ValueError(f"rank {rank} concept and edge packet indexes disagree on {key}")


def textbook_evidence_workplan_rows(
    concept_index_rows: Iterable[dict],
    edge_index_rows: Iterable[dict],
    edge_packet_rows_by_rank: dict[int, list[dict]] | None = None,
) -> list[dict]:
    concept_rows = sorted(list(concept_index_rows), key=lambda row: int_value(row.get("rank")))
    edge_rows_by_rank = {int_value(row.get("rank")): row for row in edge_index_rows}
    edge_packet_lookup = edge_packet_rows_by_rank or {}

    rows: list[dict] = []
    for concept_row in concept_rows:
        rank = int_value(concept_row.get("rank"))
        edge_row = edge_rows_by_rank.get(rank)
        if edge_row is None:
            raise ValueError(f"textbook edge evidence packet index has no rank {rank}")
        validate_matching_unit(concept_row, edge_row, rank)

        concept_count = int_value(concept_row.get("concept_count"))
        pending_concept_count = int_value(concept_row.get("pending_textbook_evidence_count"))
        low_concept_count = int_value(concept_row.get("low_confidence_count"))
        edge_count = int_value(edge_row.get("edge_count"))
        pending_edge_count = packet_pending_count(edge_packet_lookup[rank]) if rank in edge_packet_lookup else edge_count
        intra_unit_edge_count = int_value(edge_row.get("intra_unit_edge_count"))
        cross_unit_edge_count = int_value(edge_row.get("cross_unit_edge_count"))
        low_edge_count = int_value(edge_row.get("low_confidence_count"))
        priority_score = int_value(concept_row.get("priority_score"))

        row = {
            "rank": rank,
            "grade": concept_row.get("grade", ""),
            "domain": concept_row.get("domain", ""),
            "unit": concept_row.get("unit", ""),
            "priority_tier": concept_row.get("priority_tier", ""),
            "priority_score": priority_score,
            "workplan_score": priority_score + low_edge_count * 4 + cross_unit_edge_count,
            "concept_count": concept_count,
            "pending_concept_evidence_count": pending_concept_count,
            "low_confidence_concept_count": low_concept_count,
            "edge_count": edge_count,
            "pending_edge_evidence_count": pending_edge_count,
            "intra_unit_edge_count": intra_unit_edge_count,
            "cross_unit_edge_count": cross_unit_edge_count,
            "low_confidence_edge_count": low_edge_count,
            "total_evidence_rows": concept_count + edge_count,
            "total_pending_evidence_count": pending_concept_count + pending_edge_count,
            "total_low_confidence_count": low_concept_count + low_edge_count,
            "next_action": "",
            "concept_next_action": concept_row.get("next_action", ""),
            "concept_packet_csv": concept_row.get("packet_csv", ""),
            "concept_packet_md": concept_row.get("packet_md", ""),
            "edge_packet_csv": edge_row.get("packet_csv", ""),
            "edge_packet_md": edge_row.get("packet_md", ""),
        }
        row["next_action"] = next_action(row)
        rows.append(row)

    return rows


def render_markdown(rows: list[dict]) -> str:
    total_concepts = sum(int_value(row["concept_count"]) for row in rows)
    total_edges = sum(int_value(row["edge_count"]) for row in rows)
    total_pending = sum(int_value(row["total_pending_evidence_count"]) for row in rows)
    total_low = sum(int_value(row["total_low_confidence_count"]) for row in rows)
    lines = [
        "# Textbook Evidence Workplan",
        "",
        "This generated workplan combines concept evidence packets and relationship edge evidence packets.",
        "",
        "## Summary",
        "",
        f"- unit groups: {len(rows)}",
        f"- concept evidence rows: {total_concepts}",
        f"- edge evidence rows: {total_edges}",
        f"- pending textbook evidence rows: {total_pending}",
        f"- low confidence concept/edge rows: {total_low}",
        "",
        "## Unit Workplan",
        "",
        "| rank | grade | domain | unit | tier | workplan score | concepts pending/low | edges pending/low/cross | next action | packets |",
        "|---:|---|---|---|---|---:|---:|---:|---|---|",
    ]

    for row in rows:
        lines.append(
            "| {rank} | {grade} | {domain} | {unit} | {priority_tier} | {workplan_score} | "
            "{pending_concept_evidence_count}/{low_confidence_concept_count} | "
            "{pending_edge_evidence_count}/{low_confidence_edge_count}/{cross_unit_edge_count} | "
            "{next_action} | {concept_packet_md}; {edge_packet_md} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = TEXTBOOK_EVIDENCE_WORKPLAN_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    concept_index_rows = read_csv_rows(CONCEPT_PACKET_INDEX_CSV)
    edge_index_rows = read_csv_rows(EDGE_PACKET_INDEX_CSV)
    rows = textbook_evidence_workplan_rows(
        concept_index_rows,
        edge_index_rows,
        edge_packet_rows_by_rank=edge_packet_rows_by_rank(edge_index_rows),
    )
    write_csv(rows)
    TEXTBOOK_EVIDENCE_WORKPLAN_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote textbook evidence workplan for {len(rows)} unit groups "
        f"to {TEXTBOOK_EVIDENCE_WORKPLAN_CSV} and {TEXTBOOK_EVIDENCE_WORKPLAN_MD}."
    )


if __name__ == "__main__":
    main()
