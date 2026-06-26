from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
CONCEPT_EVIDENCE_DEPTH_CSV = OUT_DIR / "concept-evidence-depth.csv"
TEXTBOOK_EXTRACTION_QUEUE_CSV = OUT_DIR / "textbook-extraction-queue.csv"
TEXTBOOK_EVIDENCE_PACKET_DIR = OUT_DIR / "textbook-evidence-packets"

CSV_FIELDS = [
    "packet_rank",
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
    "current_source_refs",
    "extraction_status",
    "toc_ref",
    "learning_objective_ref",
    "definition_ref",
    "summary_ref",
    "example_ref",
    "term_explanation_ref",
    "problem_pattern_ref",
    "textbook_page_refs",
    "extraction_notes",
]

INDEX_FIELDS = [
    "rank",
    "grade",
    "domain",
    "unit",
    "concept_count",
    "pending_textbook_evidence_count",
    "low_confidence_count",
    "priority_tier",
    "priority_score",
    "next_action",
    "packet_csv",
    "packet_md",
]

TEXTBOOK_SLOT_FIELDS = [
    "toc_ref",
    "learning_objective_ref",
    "definition_ref",
    "summary_ref",
    "example_ref",
    "term_explanation_ref",
    "problem_pattern_ref",
    "textbook_page_refs",
    "extraction_notes",
]


def read_csv_rows(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def read_concepts(path: Path = CONCEPTS_JSON) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return list(data.get("concepts", []))


def target_unit(queue_rows: Iterable[dict], rank: int = 1) -> dict:
    expected = str(rank)
    for row in queue_rows:
        if str(row.get("rank", "")) == expected:
            return row
    raise ValueError(f"textbook extraction queue has no rank {rank}")


def source_ref_summary(source_refs: Iterable[dict]) -> str:
    parts: list[str] = []
    for ref in source_refs:
        source_id = str(ref.get("source_id", "")).strip()
        locator = str(ref.get("locator", "")).strip()
        evidence_kind = str(ref.get("evidence_kind", "")).strip()
        summary = str(ref.get("summary", "")).strip()
        detail = "; ".join(part for part in [locator, evidence_kind, summary] if part)
        if source_id and detail:
            parts.append(f"{source_id}: {detail}")
        elif source_id:
            parts.append(source_id)
    return " | ".join(parts)


def extraction_status(evidence: dict) -> str:
    if (
        evidence.get("has_textbook_evidence") == "yes"
        or evidence.get("evidence_depth") == "textbook_supported"
    ):
        return "textbook_evidence_linked"
    return "pending_textbook_pdf"


def textbook_evidence_packet_rows(
    concepts: Iterable[dict],
    evidence_rows: Iterable[dict],
    queue_rows: Iterable[dict],
    rank: int = 1,
) -> list[dict]:
    target = target_unit(queue_rows, rank=rank)
    evidence_by_id = {row.get("concept_id", ""): row for row in evidence_rows}
    rows: list[dict] = []

    for concept in concepts:
        if (
            concept.get("grade") != target.get("grade")
            or concept.get("domain") != target.get("domain")
            or concept.get("unit") != target.get("unit")
        ):
            continue

        concept_id = str(concept.get("id", ""))
        evidence = evidence_by_id.get(concept_id, {})
        row = {
            "packet_rank": rank,
            "grade": concept.get("grade", ""),
            "domain": concept.get("domain", ""),
            "unit": concept.get("unit", ""),
            "concept_id": concept_id,
            "label_ko": concept.get("label_ko", ""),
            "concept_type": concept.get("concept_type", ""),
            "confidence": concept.get("confidence", ""),
            "evidence_depth": evidence.get("evidence_depth", ""),
            "needs_textbook_evidence": evidence.get("needs_textbook_evidence", ""),
            "source_ref_count": evidence.get(
                "source_ref_count",
                len(concept.get("source_refs", [])),
            ),
            "current_source_refs": source_ref_summary(concept.get("source_refs", [])),
            "extraction_status": extraction_status(evidence),
        }
        row.update({field: "" for field in TEXTBOOK_SLOT_FIELDS})
        rows.append(row)

    rows.sort(
        key=lambda row: (
            row.get("confidence") != "low",
            row.get("evidence_depth") != "official_single_source",
            str(row.get("concept_id", "")),
        )
    )
    return rows


def render_markdown(rows: list[dict], target: dict) -> str:
    pending_count = sum(1 for row in rows if row.get("extraction_status") == "pending_textbook_pdf")
    low_count = sum(1 for row in rows if row.get("confidence") == "low")
    lines = [
        "# Textbook Evidence Packet",
        "",
        "This generated packet is the unit-level worksheet for adding textbook-grounded evidence.",
        "",
        "## Target Unit",
        "",
        f"- rank: {target.get('rank', '')}",
        f"- grade: {target.get('grade', '')}",
        f"- domain: {target.get('domain', '')}",
        f"- unit: {target.get('unit', '')}",
        f"- priority tier: {target.get('priority_tier', '')}",
        f"- priority score: {target.get('priority_score', '')}",
        f"- concepts in packet: {len(rows)}",
        f"- pending textbook evidence: {pending_count}",
        f"- low confidence concepts: {low_count}",
        "",
        "## Concept Evidence Slots",
        "",
        "| concept_id | label_ko | type | confidence | evidence_depth | status | source refs |",
        "|---|---|---|---|---|---|---:|",
    ]

    for row in rows:
        lines.append(
            "| {concept_id} | {label_ko} | {concept_type} | {confidence} | "
            "{evidence_depth} | {extraction_status} | {source_ref_count} |".format(**row)
        )

    lines.extend(
        [
            "",
            "## Textbook Evidence Fields",
            "",
            "- toc_ref",
            "- learning_objective_ref",
            "- definition_ref",
            "- summary_ref",
            "- example_ref",
            "- term_explanation_ref",
            "- problem_pattern_ref",
            "- textbook_page_refs",
            "- extraction_notes",
            "",
        ]
    )
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def packet_paths(rank: int, output_dir: Path = TEXTBOOK_EVIDENCE_PACKET_DIR) -> tuple[Path, Path]:
    stem = f"rank-{rank:02d}"
    return (
        output_dir / f"{stem}.csv",
        output_dir / f"{stem}.md",
    )


def textbook_evidence_packet_set(
    concepts: Iterable[dict],
    evidence_rows: Iterable[dict],
    queue_rows: Iterable[dict],
    top_n: int | None,
) -> list[dict]:
    queue_row_list = list(queue_rows)
    sorted_targets = sorted(queue_row_list, key=lambda row: int(row.get("rank", 0)))[:top_n]
    concept_list = list(concepts)
    evidence_row_list = list(evidence_rows)

    packets: list[dict] = []
    for target in sorted_targets:
        rank = int(target.get("rank", 0))
        packets.append(
            {
                "rank": rank,
                "target": target,
                "rows": textbook_evidence_packet_rows(
                    concept_list,
                    evidence_row_list,
                    queue_row_list,
                    rank=rank,
                ),
            }
        )
    return packets


def resolve_top_n(queue_rows: Iterable[dict], top_n: int | None, include_all: bool) -> int:
    row_count = len(list(queue_rows))
    if include_all:
        return row_count
    if top_n is None:
        return 1
    return top_n


def packet_index_rows(packets: Iterable[dict]) -> list[dict]:
    rows: list[dict] = []
    for packet in packets:
        rank = int(packet["rank"])
        target = packet["target"]
        packet_rows = packet["rows"]
        csv_path, md_path = packet_paths(rank)
        rows.append(
            {
                "rank": rank,
                "grade": target.get("grade", ""),
                "domain": target.get("domain", ""),
                "unit": target.get("unit", ""),
                "concept_count": len(packet_rows),
                "pending_textbook_evidence_count": sum(
                    1 for row in packet_rows if row.get("extraction_status") == "pending_textbook_pdf"
                ),
                "low_confidence_count": sum(1 for row in packet_rows if row.get("confidence") == "low"),
                "priority_tier": target.get("priority_tier", ""),
                "priority_score": target.get("priority_score", ""),
                "next_action": target.get("next_action", ""),
                "packet_csv": csv_path.name,
                "packet_md": md_path.name,
            }
        )
    return rows


def render_index_markdown(rows: list[dict]) -> str:
    total_concepts = sum(int(row["concept_count"]) for row in rows)
    total_pending = sum(int(row["pending_textbook_evidence_count"]) for row in rows)
    lines = [
        "# Textbook Evidence Packet Index",
        "",
        "This generated index tracks the prepared unit-level textbook evidence packets.",
        "",
        "## Summary",
        "",
        f"- packets: {len(rows)}",
        f"- concepts in packets: {total_concepts}",
        f"- pending textbook evidence rows: {total_pending}",
        "",
        "## Packets",
        "",
        "| rank | grade | domain | unit | concepts | pending | low | tier | score | packet |",
        "|---:|---|---|---|---:|---:|---:|---|---:|---|",
    ]

    for row in rows:
        lines.append(
            "| {rank} | {grade} | {domain} | {unit} | {concept_count} | "
            "{pending_textbook_evidence_count} | {low_confidence_count} | "
            "{priority_tier} | {priority_score} | {packet_md} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_index_csv(rows: list[dict], path: Path) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=INDEX_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def write_packet_set(packets: list[dict], output_dir: Path = TEXTBOOK_EVIDENCE_PACKET_DIR) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    for packet in packets:
        csv_path, md_path = packet_paths(int(packet["rank"]), output_dir)
        write_csv(packet["rows"], csv_path)
        md_path.write_text(render_markdown(packet["rows"], packet["target"]), encoding="utf-8")

    index_rows = packet_index_rows(packets)
    write_index_csv(index_rows, output_dir / "index.csv")
    (output_dir / "index.md").write_text(render_index_markdown(index_rows), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a unit-level textbook evidence packet.")
    parser.add_argument("--rank", type=int, default=1, help="textbook extraction queue rank")
    parser.add_argument("--top-n", type=int, help="build packets for the top N queue ranks and write an index")
    parser.add_argument("--all", action="store_true", help="build packets for every queue rank and write an index")
    args = parser.parse_args()

    queue_rows = read_csv_rows(TEXTBOOK_EXTRACTION_QUEUE_CSV)
    concepts = read_concepts()
    evidence_rows = read_csv_rows(CONCEPT_EVIDENCE_DEPTH_CSV)
    top_n = resolve_top_n(queue_rows, top_n=args.top_n, include_all=args.all)

    if args.top_n or args.all:
        packets = textbook_evidence_packet_set(
            concepts,
            evidence_rows,
            queue_rows,
            top_n=top_n,
        )
        write_packet_set(packets)
        print(
            f"Wrote {len(packets)} textbook evidence packets "
            f"to {TEXTBOOK_EVIDENCE_PACKET_DIR}."
        )
        return

    target = target_unit(queue_rows, rank=args.rank)
    rows = textbook_evidence_packet_rows(
        concepts,
        evidence_rows,
        queue_rows,
        rank=args.rank,
    )

    TEXTBOOK_EVIDENCE_PACKET_DIR.mkdir(parents=True, exist_ok=True)
    csv_path, md_path = packet_paths(args.rank)
    write_csv(rows, csv_path)
    md_path.write_text(render_markdown(rows, target), encoding="utf-8")
    print(
        f"Wrote textbook evidence packet rank {args.rank} for {len(rows)} concepts "
        f"to {csv_path} and {md_path}."
    )


if __name__ == "__main__":
    main()
