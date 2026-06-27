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
UNIT_MAP_PACKET_DIR = OUT_DIR / "unit-map-packets"

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

INDEX_CSV_FIELDS = [
    "rank",
    "grade",
    "domain",
    "unit",
    "priority_tier",
    "workplan_score",
    "concept_count",
    "edge_count",
    "intra_unit_edge_count",
    "cross_unit_edge_count",
    "low_confidence_concept_count",
    "low_confidence_edge_count",
    "total_pending_evidence_count",
    "next_action",
    "node_csv",
    "edge_csv",
    "map_md",
    "map_dot",
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


def int_value(value: object) -> int:
    try:
        return int(str(value))
    except (TypeError, ValueError):
        return 0


def unit_map_packet_paths(rank: int, output_dir: Path = UNIT_MAP_PACKET_DIR) -> dict[str, Path]:
    stem = f"rank-{rank:02d}"
    return {
        "node_csv": output_dir / f"{stem}-nodes.csv",
        "edge_csv": output_dir / f"{stem}-edges.csv",
        "map_md": output_dir / f"{stem}.md",
        "map_dot": output_dir / f"{stem}.dot",
    }


def unit_map_packet_set(
    concepts: Iterable[dict],
    edges: Iterable[dict],
    concept_evidence_rows: Iterable[dict],
    edge_evidence_rows: Iterable[dict],
    workplan_rows: Iterable[dict],
    top_n: int | None = None,
) -> list[dict]:
    concept_list = list(concepts)
    edge_list = list(edges)
    concept_evidence_list = list(concept_evidence_rows)
    edge_evidence_list = list(edge_evidence_rows)
    targets = sorted(list(workplan_rows), key=lambda row: int_value(row.get("rank")))
    if top_n is not None:
        targets = targets[:top_n]

    packets: list[dict] = []
    for target in targets:
        rank = int_value(target.get("rank"))
        packets.append(
            {
                "rank": rank,
                "target": target,
                "node_rows": pilot_unit_node_rows(concept_list, concept_evidence_list, target),
                "edge_rows": pilot_unit_edge_rows(concept_list, edge_list, edge_evidence_list, target),
            }
        )
    return packets


def unit_map_index_rows(packets: Iterable[dict]) -> list[dict]:
    rows: list[dict] = []
    for packet in packets:
        rank = int_value(packet.get("rank"))
        target = packet.get("target", {})
        node_rows = list(packet.get("node_rows", []))
        edge_rows = list(packet.get("edge_rows", []))
        paths = unit_map_packet_paths(rank)
        rows.append(
            {
                "rank": rank,
                "grade": target.get("grade", ""),
                "domain": target.get("domain", ""),
                "unit": target.get("unit", ""),
                "priority_tier": target.get("priority_tier", ""),
                "workplan_score": target.get("workplan_score", ""),
                "concept_count": len(node_rows),
                "edge_count": len(edge_rows),
                "intra_unit_edge_count": sum(1 for row in edge_rows if row.get("edge_scope") == "intra_unit"),
                "cross_unit_edge_count": sum(1 for row in edge_rows if row.get("edge_scope") == "cross_unit"),
                "low_confidence_concept_count": sum(1 for row in node_rows if row.get("confidence") == "low"),
                "low_confidence_edge_count": sum(1 for row in edge_rows if row.get("confidence") == "low"),
                "total_pending_evidence_count": target.get("total_pending_evidence_count", ""),
                "next_action": target.get("next_action", ""),
                "node_csv": paths["node_csv"].name,
                "edge_csv": paths["edge_csv"].name,
                "map_md": paths["map_md"].name,
                "map_dot": paths["map_dot"].name,
            }
        )
    return rows


def render_index_markdown(rows: list[dict]) -> str:
    total_concepts = sum(int_value(row.get("concept_count")) for row in rows)
    total_edges = sum(int_value(row.get("edge_count")) for row in rows)
    total_cross_edges = sum(int_value(row.get("cross_unit_edge_count")) for row in rows)
    lines = [
        "# Unit Map Packet Index",
        "",
        "This generated index tracks compact concept hierarchy maps for every textbook evidence workplan unit.",
        "",
        "## Summary",
        "",
        f"- unit maps: {len(rows)}",
        f"- concept rows: {total_concepts}",
        f"- edge rows touching units: {total_edges}",
        f"- cross-unit edge rows: {total_cross_edges}",
        "",
        "## Packets",
        "",
        "| rank | grade | domain | unit | concepts | edges | cross | low concepts | low edges | map | dot |",
        "|---:|---|---|---|---:|---:|---:|---:|---:|---|---|",
    ]
    for row in rows:
        lines.append(
            "| {rank} | {grade} | {domain} | {unit} | {concept_count} | {edge_count} | "
            "{cross_unit_edge_count} | {low_confidence_concept_count} | "
            "{low_confidence_edge_count} | {map_md} | {map_dot} |".format(**row)
        )
    lines.append("")
    return "\n".join(lines)


def write_index_csv(rows: list[dict], path: Path) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=INDEX_CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def write_unit_map_packet_set(
    packets: list[dict],
    output_dir: Path = UNIT_MAP_PACKET_DIR,
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    for packet in packets:
        rank = int_value(packet.get("rank"))
        paths = unit_map_packet_paths(rank, output_dir)
        write_node_csv(packet.get("node_rows", []), paths["node_csv"])
        write_edge_csv(packet.get("edge_rows", []), paths["edge_csv"])
        paths["map_md"].write_text(
            render_markdown(packet.get("target", {}), packet.get("node_rows", []), packet.get("edge_rows", [])),
            encoding="utf-8",
        )
        paths["map_dot"].write_text(
            render_dot(packet.get("target", {}), packet.get("node_rows", []), packet.get("edge_rows", [])),
            encoding="utf-8",
        )

    index_rows = unit_map_index_rows(packets)
    write_index_csv(index_rows, output_dir / "index.csv")
    (output_dir / "index.md").write_text(render_index_markdown(index_rows), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a compact pilot unit concept hierarchy map.")
    parser.add_argument("--rank", type=int, default=1, help="textbook evidence workplan rank")
    parser.add_argument("--top-n", type=int, help="build compact unit map packets for the top N workplan ranks")
    parser.add_argument("--all", action="store_true", help="build compact unit map packets for every workplan rank")
    args = parser.parse_args()

    workplan_rows = read_csv_rows(TEXTBOOK_EVIDENCE_WORKPLAN_CSV)
    concepts, edges = read_concepts_data()
    concept_evidence_rows = read_csv_rows(CONCEPT_EVIDENCE_DEPTH_CSV)
    edge_evidence_rows = read_csv_rows(EDGE_EVIDENCE_DEPTH_CSV)

    if args.all or args.top_n is not None:
        top_n = None if args.all else args.top_n
        packets = unit_map_packet_set(
            concepts,
            edges,
            concept_evidence_rows,
            edge_evidence_rows,
            workplan_rows,
            top_n=top_n,
        )
        write_unit_map_packet_set(packets)
        print(f"Wrote {len(packets)} compact unit map packets to {UNIT_MAP_PACKET_DIR}.")
        return

    target = target_unit(workplan_rows, rank=args.rank)
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
