from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
EDGES_CSV = OUT_DIR / "edges.csv"
TEXTBOOK_EXTRACTION_QUEUE_CSV = OUT_DIR / "textbook-extraction-queue.csv"
TEXTBOOK_EDGE_EVIDENCE_PACKET_DIR = OUT_DIR / "textbook-edge-evidence-packets"

CSV_FIELDS = [
    "packet_rank",
    "grade",
    "domain",
    "unit",
    "edge_id",
    "edge_scope",
    "source_id",
    "source_label_ko",
    "source_unit",
    "target_id",
    "target_label_ko",
    "target_unit",
    "relationship_type",
    "confidence",
    "source_ref_count",
    "current_source_refs",
    "notes",
    "required_evidence_fields",
    "evidence_focus",
    "extraction_status",
    "structure_ref",
    "prerequisite_ref",
    "representation_ref",
    "procedure_ref",
    "contrast_ref",
    "misconception_ref",
    "problem_pattern_ref",
    "related_ref",
    "textbook_page_refs",
    "extraction_notes",
]

INDEX_FIELDS = [
    "rank",
    "grade",
    "domain",
    "unit",
    "edge_count",
    "intra_unit_edge_count",
    "cross_unit_edge_count",
    "low_confidence_count",
    "priority_tier",
    "priority_score",
    "next_action",
    "packet_csv",
    "packet_md",
]

TEXTBOOK_SLOT_FIELDS = [
    "structure_ref",
    "prerequisite_ref",
    "representation_ref",
    "procedure_ref",
    "contrast_ref",
    "misconception_ref",
    "problem_pattern_ref",
    "related_ref",
    "textbook_page_refs",
    "extraction_notes",
]

REQUIRED_EVIDENCE_BY_RELATIONSHIP = {
    "contains": ["structure_ref", "textbook_page_refs"],
    "prerequisite_for": ["prerequisite_ref", "textbook_page_refs"],
    "represented_by": ["representation_ref", "textbook_page_refs"],
    "used_in": ["procedure_ref", "textbook_page_refs"],
    "contrasts_with": ["contrast_ref", "textbook_page_refs"],
    "often_confused_with": ["misconception_ref", "problem_pattern_ref", "textbook_page_refs"],
    "related_to": ["related_ref", "textbook_page_refs"],
    "equivalent_to": ["related_ref", "textbook_page_refs"],
}

EVIDENCE_FOCUS_BY_RELATIONSHIP = {
    "contains": "Find textbook structure evidence for the containment relation.",
    "prerequisite_for": "Find textbook sequencing or prior-knowledge evidence for the prerequisite relation.",
    "represented_by": "Find textbook representation evidence such as a table, graph, expression, or diagram.",
    "used_in": "Find a worked example, procedure, or application where this source concept is used.",
    "contrasts_with": "Find textbook wording or examples that distinguish the two concepts.",
    "often_confused_with": "Find misconception, caution, example, or problem-pattern evidence for the confusion risk.",
    "related_to": "Find textbook wording or examples that justify keeping these concepts linked.",
    "equivalent_to": "Find textbook wording that treats the two concepts or labels as equivalent in context.",
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


def read_concepts(path: Path = CONCEPTS_JSON) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return list(data.get("concepts", []))


def read_edges(path: Path = EDGES_CSV) -> list[dict]:
    return read_csv_rows(path)


def target_unit(queue_rows: Iterable[dict], rank: int = 1) -> dict:
    expected = str(rank)
    for row in queue_rows:
        if str(row.get("rank", "")) == expected:
            return row
    raise ValueError(f"textbook extraction queue has no rank {rank}")


def parse_source_refs(edge: dict) -> list[dict]:
    raw_refs = str(edge.get("source_refs", "")).strip()
    if not raw_refs:
        return []
    try:
        parsed = json.loads(raw_refs)
    except json.JSONDecodeError:
        return []
    if not isinstance(parsed, list):
        return []
    return [ref for ref in parsed if isinstance(ref, dict)]


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


def concept_unit(concept: dict | None) -> str:
    if not concept:
        return ""
    return str(concept.get("unit", ""))


def concept_is_target(concept: dict | None, target: dict) -> bool:
    if not concept:
        return False
    return (
        concept.get("grade") == target.get("grade")
        and concept.get("domain") == target.get("domain")
        and concept.get("unit") == target.get("unit")
    )


def edge_scope(source_in_unit: bool, target_in_unit: bool) -> str:
    if source_in_unit and target_in_unit:
        return "intra_unit"
    return "cross_unit"


def extraction_status(source_refs: Iterable[dict]) -> str:
    for ref in source_refs:
        source_id = str(ref.get("source_id", "")).lower()
        if "textbook" in source_id or "교과서" in source_id:
            return "textbook_evidence_linked"
    return "pending_textbook_pdf"


def required_evidence_fields(row: dict) -> str:
    fields = list(
        REQUIRED_EVIDENCE_BY_RELATIONSHIP.get(
            row.get("relationship_type", ""),
            ["related_ref", "textbook_page_refs"],
        )
    )
    if row.get("confidence") == "low" and "extraction_notes" not in fields:
        fields.append("extraction_notes")
    return ";".join(fields)


def evidence_focus(row: dict) -> str:
    return EVIDENCE_FOCUS_BY_RELATIONSHIP.get(
        row.get("relationship_type", ""),
        "Find textbook page evidence for this relationship.",
    )


def textbook_edge_evidence_packet_rows(
    concepts: Iterable[dict],
    edges: Iterable[dict],
    queue_rows: Iterable[dict],
    rank: int = 1,
) -> list[dict]:
    target = target_unit(queue_rows, rank=rank)
    concepts_by_id = {str(concept.get("id", "")): concept for concept in concepts}
    rows: list[dict] = []

    for edge in edges:
        source_id = str(edge.get("source_id", ""))
        target_id = str(edge.get("target_id", ""))
        source = concepts_by_id.get(source_id)
        target_concept = concepts_by_id.get(target_id)
        source_in_unit = concept_is_target(source, target)
        target_in_unit = concept_is_target(target_concept, target)
        if not source_in_unit and not target_in_unit:
            continue

        source_refs = parse_source_refs(edge)
        row = {
            "packet_rank": rank,
            "grade": target.get("grade", ""),
            "domain": target.get("domain", ""),
            "unit": target.get("unit", ""),
            "edge_id": edge.get("id", ""),
            "edge_scope": edge_scope(source_in_unit, target_in_unit),
            "source_id": source_id,
            "source_label_ko": (source or {}).get("label_ko", ""),
            "source_unit": concept_unit(source),
            "target_id": target_id,
            "target_label_ko": (target_concept or {}).get("label_ko", ""),
            "target_unit": concept_unit(target_concept),
            "relationship_type": edge.get("relationship_type", ""),
            "confidence": edge.get("confidence", ""),
            "source_ref_count": len(source_refs),
            "current_source_refs": source_ref_summary(source_refs),
            "notes": edge.get("notes", ""),
            "required_evidence_fields": "",
            "evidence_focus": "",
            "extraction_status": extraction_status(source_refs),
        }
        row["required_evidence_fields"] = required_evidence_fields(row)
        row["evidence_focus"] = evidence_focus(row)
        row.update({field: "" for field in TEXTBOOK_SLOT_FIELDS})
        rows.append(row)

    rows.sort(
        key=lambda row: (
            row.get("confidence") != "low",
            row.get("edge_scope") != "intra_unit",
            RELATIONSHIP_SORT_PRIORITY.get(str(row.get("relationship_type", "")), 99),
            str(row.get("edge_id", "")),
        )
    )
    return rows


def render_markdown(rows: list[dict], target: dict) -> str:
    low_count = sum(1 for row in rows if row.get("confidence") == "low")
    cross_unit_count = sum(1 for row in rows if row.get("edge_scope") == "cross_unit")
    lines = [
        "# Textbook Edge Evidence Packet",
        "",
        "This generated packet is the unit-level worksheet for adding textbook-grounded relationship evidence.",
        "",
        "## Target Unit",
        "",
        f"- rank: {target.get('rank', '')}",
        f"- grade: {target.get('grade', '')}",
        f"- domain: {target.get('domain', '')}",
        f"- unit: {target.get('unit', '')}",
        f"- priority tier: {target.get('priority_tier', '')}",
        f"- priority score: {target.get('priority_score', '')}",
        f"- edges in packet: {len(rows)}",
        f"- cross-unit edges: {cross_unit_count}",
        f"- low confidence edges: {low_count}",
        "",
        "## Relationship Evidence Slots",
        "",
        "| edge_id | scope | source | relationship | target | confidence | required evidence | focus | source refs |",
        "|---|---|---|---|---|---|---|---|---:|",
    ]

    for row in rows:
        lines.append(
            "| {edge_id} | {edge_scope} | {source_label_ko} | {relationship_type} | "
            "{target_label_ko} | {confidence} | {required_evidence_fields} | "
            "{evidence_focus} | {source_ref_count} |".format(**row)
        )

    lines.extend(
        [
            "",
            "## Textbook Edge Evidence Fields",
            "",
            "- structure_ref",
            "- prerequisite_ref",
            "- representation_ref",
            "- procedure_ref",
            "- contrast_ref",
            "- misconception_ref",
            "- problem_pattern_ref",
            "- related_ref",
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


def packet_paths(rank: int, output_dir: Path = TEXTBOOK_EDGE_EVIDENCE_PACKET_DIR) -> tuple[Path, Path]:
    stem = f"rank-{rank:02d}"
    return (
        output_dir / f"{stem}.csv",
        output_dir / f"{stem}.md",
    )


def textbook_edge_evidence_packet_set(
    concepts: Iterable[dict],
    edges: Iterable[dict],
    queue_rows: Iterable[dict],
    top_n: int | None,
) -> list[dict]:
    queue_row_list = list(queue_rows)
    sorted_targets = sorted(queue_row_list, key=lambda row: int(row.get("rank", 0)))[:top_n]
    concept_list = list(concepts)
    edge_list = list(edges)

    packets: list[dict] = []
    for target in sorted_targets:
        rank = int(target.get("rank", 0))
        packets.append(
            {
                "rank": rank,
                "target": target,
                "rows": textbook_edge_evidence_packet_rows(
                    concept_list,
                    edge_list,
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
                "edge_count": len(packet_rows),
                "intra_unit_edge_count": sum(1 for row in packet_rows if row.get("edge_scope") == "intra_unit"),
                "cross_unit_edge_count": sum(1 for row in packet_rows if row.get("edge_scope") == "cross_unit"),
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
    total_edges = sum(int(row["edge_count"]) for row in rows)
    total_cross_unit = sum(int(row["cross_unit_edge_count"]) for row in rows)
    lines = [
        "# Textbook Edge Evidence Packet Index",
        "",
        "This generated index tracks the prepared unit-level textbook edge evidence packets.",
        "",
        "## Summary",
        "",
        f"- packets: {len(rows)}",
        f"- edges in packets: {total_edges}",
        f"- cross-unit edges in packets: {total_cross_unit}",
        "",
        "## Packets",
        "",
        "| rank | grade | domain | unit | edges | intra-unit | cross-unit | low | tier | score | packet |",
        "|---:|---|---|---|---:|---:|---:|---:|---|---:|---|",
    ]

    for row in rows:
        lines.append(
            "| {rank} | {grade} | {domain} | {unit} | {edge_count} | "
            "{intra_unit_edge_count} | {cross_unit_edge_count} | {low_confidence_count} | "
            "{priority_tier} | {priority_score} | {packet_md} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_index_csv(rows: list[dict], path: Path) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=INDEX_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def write_packet_set(packets: list[dict], output_dir: Path = TEXTBOOK_EDGE_EVIDENCE_PACKET_DIR) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    for packet in packets:
        csv_path, md_path = packet_paths(int(packet["rank"]), output_dir)
        write_csv(packet["rows"], csv_path)
        md_path.write_text(render_markdown(packet["rows"], packet["target"]), encoding="utf-8")

    index_rows = packet_index_rows(packets)
    write_index_csv(index_rows, output_dir / "index.csv")
    (output_dir / "index.md").write_text(render_index_markdown(index_rows), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build unit-level textbook edge evidence packets.")
    parser.add_argument("--rank", type=int, default=1, help="textbook extraction queue rank")
    parser.add_argument("--top-n", type=int, help="build packets for the top N queue ranks and write an index")
    parser.add_argument("--all", action="store_true", help="build packets for every queue rank and write an index")
    args = parser.parse_args()

    queue_rows = read_csv_rows(TEXTBOOK_EXTRACTION_QUEUE_CSV)
    concepts = read_concepts()
    edges = read_edges()
    top_n = resolve_top_n(queue_rows, top_n=args.top_n, include_all=args.all)

    if args.top_n or args.all:
        packets = textbook_edge_evidence_packet_set(
            concepts,
            edges,
            queue_rows,
            top_n=top_n,
        )
        write_packet_set(packets)
        print(
            f"Wrote {len(packets)} textbook edge evidence packets "
            f"to {TEXTBOOK_EDGE_EVIDENCE_PACKET_DIR}."
        )
        return

    target = target_unit(queue_rows, rank=args.rank)
    rows = textbook_edge_evidence_packet_rows(
        concepts,
        edges,
        queue_rows,
        rank=args.rank,
    )

    TEXTBOOK_EDGE_EVIDENCE_PACKET_DIR.mkdir(parents=True, exist_ok=True)
    csv_path, md_path = packet_paths(args.rank)
    write_csv(rows, csv_path)
    md_path.write_text(render_markdown(rows, target), encoding="utf-8")
    print(
        f"Wrote textbook edge evidence packet rank {args.rank} for {len(rows)} edges "
        f"to {csv_path} and {md_path}."
    )


if __name__ == "__main__":
    main()
