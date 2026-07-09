from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
PREREQUISITE_MAP_CSV = OUT_DIR / "prerequisite-map.csv"
PREREQUISITE_MAP_MD = OUT_DIR / "prerequisite-map.md"
PREREQUISITE_UNIT_GRAPH_DOT = OUT_DIR / "prerequisite-unit-graph.dot"

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
    "transition_scope",
    "confidence",
    "source_ref_count",
    "source_refs",
    "notes",
]

UNIT_TRANSITION_FIELDS = [
    "source_grade",
    "source_domain",
    "source_unit",
    "target_grade",
    "target_domain",
    "target_unit",
    "transition_scope",
    "edge_count",
    "high_confidence_count",
    "medium_confidence_count",
    "low_confidence_count",
    "sample_concept_pairs",
]


def source_ref_summary(source_refs: Iterable[dict]) -> str:
    parts: list[str] = []
    for ref in source_refs:
        source_id = str(ref.get("source_id", ""))
        locator = str(ref.get("locator", ""))
        summary = str(ref.get("summary", ""))
        if summary:
            parts.append(f"{source_id}:{locator} - {summary}")
        else:
            parts.append(f"{source_id}:{locator}")
    return "; ".join(parts)


def transition_scope(row: dict) -> str:
    same_grade = row.get("source_grade") == row.get("target_grade")
    same_domain = row.get("source_domain") == row.get("target_domain")
    same_unit = row.get("source_unit") == row.get("target_unit")

    if same_grade and same_domain and same_unit:
        return "same_unit"
    if same_grade and same_domain:
        return "cross_unit_same_domain"
    if same_grade:
        return "cross_domain_same_grade"
    if same_domain:
        return "cross_grade_same_domain"
    return "cross_grade_cross_domain"


def prerequisite_rows(concepts: Iterable[dict], edges: Iterable[dict]) -> list[dict]:
    concepts_by_id = {str(concept.get("id", "")): concept for concept in concepts}
    rows: list[dict] = []

    for edge in edges:
        if edge.get("relationship_type") != "prerequisite_for":
            continue

        source = concepts_by_id[str(edge.get("source_id", ""))]
        target = concepts_by_id[str(edge.get("target_id", ""))]
        row = {
            "edge_id": edge.get("id", ""),
            "source_id": source.get("id", ""),
            "source_label_ko": source.get("label_ko", ""),
            "source_grade": source.get("grade", ""),
            "source_domain": source.get("domain", ""),
            "source_unit": source.get("unit", ""),
            "target_id": target.get("id", ""),
            "target_label_ko": target.get("label_ko", ""),
            "target_grade": target.get("grade", ""),
            "target_domain": target.get("domain", ""),
            "target_unit": target.get("unit", ""),
            "confidence": edge.get("confidence", ""),
            "source_ref_count": len(edge.get("source_refs", [])),
            "source_refs": source_ref_summary(edge.get("source_refs", [])),
            "notes": edge.get("notes", ""),
        }
        row["transition_scope"] = transition_scope(row)
        rows.append(row)

    rows.sort(
        key=lambda row: (
            row["source_grade"],
            row["source_domain"],
            row["source_unit"],
            row["target_grade"],
            row["target_domain"],
            row["target_unit"],
            row["source_label_ko"],
            row["target_label_ko"],
            row["edge_id"],
        )
    )
    return rows


def unit_transition_rows(rows: Iterable[dict]) -> list[dict]:
    grouped: dict[tuple[str, ...], list[dict]] = defaultdict(list)
    for row in rows:
        key = (
            str(row.get("source_grade", "")),
            str(row.get("source_domain", "")),
            str(row.get("source_unit", "")),
            str(row.get("target_grade", "")),
            str(row.get("target_domain", "")),
            str(row.get("target_unit", "")),
            str(row.get("transition_scope", "")),
        )
        grouped[key].append(row)

    summary_rows: list[dict] = []
    for key, transition_edges in grouped.items():
        confidence_counts = Counter(row.get("confidence", "") for row in transition_edges)
        sample_pairs = [
            f"{row.get('source_label_ko', '')} -> {row.get('target_label_ko', '')}"
            for row in transition_edges[:5]
        ]
        summary_rows.append(
            {
                "source_grade": key[0],
                "source_domain": key[1],
                "source_unit": key[2],
                "target_grade": key[3],
                "target_domain": key[4],
                "target_unit": key[5],
                "transition_scope": key[6],
                "edge_count": len(transition_edges),
                "high_confidence_count": confidence_counts.get("high", 0),
                "medium_confidence_count": confidence_counts.get("medium", 0),
                "low_confidence_count": confidence_counts.get("low", 0),
                "sample_concept_pairs": "; ".join(sample_pairs),
            }
        )

    summary_rows.sort(
        key=lambda row: (
            -int(row["edge_count"]),
            row["source_grade"],
            row["source_domain"],
            row["source_unit"],
            row["target_grade"],
            row["target_domain"],
            row["target_unit"],
        )
    )
    return summary_rows


def dot_escape(value: object) -> str:
    return str(value).replace("\\", "\\\\").replace('"', '\\"')


def dot_unit_label(row: dict, prefix: str) -> str:
    return "\\n".join(
        [
            dot_escape(row.get(f"{prefix}_grade", "")),
            dot_escape(row.get(f"{prefix}_domain", "")),
            dot_escape(row.get(f"{prefix}_unit", "")),
        ]
    )


def render_unit_graph_dot(unit_rows: list[dict]) -> str:
    unit_keys: list[tuple[str, str, str]] = []
    for row in unit_rows:
        for prefix in ["source", "target"]:
            key = (
                str(row.get(f"{prefix}_grade", "")),
                str(row.get(f"{prefix}_domain", "")),
                str(row.get(f"{prefix}_unit", "")),
            )
            if key not in unit_keys:
                unit_keys.append(key)

    node_ids = {key: f"unit_{index:03d}" for index, key in enumerate(unit_keys, start=1)}

    lines = [
        "digraph prerequisite_unit_graph {",
        '  rankdir="LR";',
        '  graph [fontname="Malgun Gothic"];',
        '  node [shape=box, style="rounded,filled", fillcolor="#f7f9fc", color="#4b5563", fontname="Malgun Gothic"];',
        '  edge [color="#506070", fontname="Malgun Gothic"];',
        "",
    ]

    for key, node_id in node_ids.items():
        label = "\\n".join(dot_escape(part) for part in key)
        lines.append(f'  {node_id} [label="{label}"];')

    lines.append("")

    for row in unit_rows:
        source_key = (
            str(row.get("source_grade", "")),
            str(row.get("source_domain", "")),
            str(row.get("source_unit", "")),
        )
        target_key = (
            str(row.get("target_grade", "")),
            str(row.get("target_domain", "")),
            str(row.get("target_unit", "")),
        )
        edge_count = int(row.get("edge_count", 0))
        high_count = int(row.get("high_confidence_count", 0))
        medium_count = int(row.get("medium_confidence_count", 0))
        low_count = int(row.get("low_confidence_count", 0))
        label = (
            f"{edge_count} prerequisite edges\\n"
            f"H{high_count} M{medium_count} L{low_count}"
        )
        color = "#b73535" if low_count else "#506070"
        penwidth = min(5, max(1, edge_count // 3 + 1))
        lines.append(
            f'  {node_ids[source_key]} -> {node_ids[target_key]} '
            f'[label="{label}", color="{color}", penwidth={penwidth}];'
        )

    lines.append("}")
    lines.append("")
    return "\n".join(lines)


def render_markdown(rows: list[dict]) -> str:
    scope_counts = Counter(row["transition_scope"] for row in rows)
    confidence_counts = Counter(row["confidence"] for row in rows)
    source_concepts = {row["source_id"] for row in rows}
    target_concepts = {row["target_id"] for row in rows}
    unit_rows = unit_transition_rows(rows)

    lines = [
        "# 선수 관계 지도",
        "",
        "이 문서는 `concepts.json`의 `prerequisite_for` edge를 개념쌍과 단원 전이 기준으로 펼친다.",
        "",
        "## Summary",
        "",
        f"- 선수 관계 edge: {len(rows)}개",
        f"- source concept: {len(source_concepts)}개",
        f"- target concept: {len(target_concepts)}개",
        f"- high/medium/low: {confidence_counts.get('high', 0)} / {confidence_counts.get('medium', 0)} / {confidence_counts.get('low', 0)}",
        "",
        "## Transition Scope",
        "",
        "| transition_scope | edge 수 |",
        "|---|---:|",
    ]

    for scope, count in sorted(scope_counts.items()):
        lines.append(f"| {scope} | {count} |")

    lines.extend(
        [
            "",
            "## Unit Transitions",
            "",
            "| source grade | source domain | source unit | target grade | target domain | target unit | edge 수 | high | medium | low | sample concept pairs |",
            "|---|---|---|---|---|---|---:|---:|---:|---:|---|",
        ]
    )

    for row in unit_rows:
        lines.append(
            "| {source_grade} | {source_domain} | {source_unit} | "
            "{target_grade} | {target_domain} | {target_unit} | "
            "{edge_count} | {high_confidence_count} | {medium_confidence_count} | "
            "{low_confidence_count} | {sample_concept_pairs} |".format(**row)
        )

    lines.extend(
        [
            "",
            "## Notes",
            "",
            "- CSV에는 각 선수 관계 edge의 concept id, label, 학년, 영역, 단원, 근거 요약이 모두 포함된다.",
            "- 교과서 PDF가 추가되면 같은 edge에 교과서 쪽수 근거를 누적하고, 낮은 신뢰도 선수 관계를 재검토한다.",
            "",
        ]
    )
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = PREREQUISITE_MAP_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def write_dot(unit_rows: list[dict], path: Path = PREREQUISITE_UNIT_GRAPH_DOT) -> None:
    path.write_text(render_unit_graph_dot(unit_rows), encoding="utf-8")


def main() -> None:
    data = json.loads(CONCEPTS_JSON.read_text(encoding="utf-8"))
    rows = prerequisite_rows(data.get("concepts", []), data.get("edges", []))
    unit_rows = unit_transition_rows(rows)

    write_csv(rows)
    PREREQUISITE_MAP_MD.write_text(render_markdown(rows), encoding="utf-8")
    write_dot(unit_rows)

    print(
        f"Wrote prerequisite map with {len(rows)} prerequisite edges "
        f"to {PREREQUISITE_MAP_CSV}, {PREREQUISITE_MAP_MD}, "
        f"and {PREREQUISITE_UNIT_GRAPH_DOT}."
    )


if __name__ == "__main__":
    main()
