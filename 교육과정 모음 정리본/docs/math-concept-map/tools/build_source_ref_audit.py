from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
SOURCE_REF_AUDIT_CSV = OUT_DIR / "source-ref-audit.csv"
SOURCE_REF_AUDIT_MD = OUT_DIR / "source-ref-audit.md"

CSV_FIELDS = [
    "record_kind",
    "source_id",
    "evidence_kind",
    "source_ref_count",
    "record_count",
    "high_confidence_record_count",
    "medium_confidence_record_count",
    "low_confidence_record_count",
    "missing_locator_count",
    "missing_summary_count",
]


def blank(value: object) -> bool:
    return not str(value or "").strip()


def source_ref_summary_rows(concepts: Iterable[dict], edges: Iterable[dict]) -> list[dict]:
    grouped: dict[tuple[str, str, str], dict] = defaultdict(
        lambda: {
            "record_ids": set(),
            "confidence_by_record": {},
            "source_ref_count": 0,
            "missing_locator_count": 0,
            "missing_summary_count": 0,
        }
    )

    for record_kind, records in [("concept", concepts), ("edge", edges)]:
        for record in records:
            record_id = str(record.get("id", ""))
            confidence = str(record.get("confidence", ""))
            for ref in record.get("source_refs", []):
                source_id = str(ref.get("source_id", ""))
                evidence_kind = str(ref.get("evidence_kind", ""))
                key = (record_kind, source_id, evidence_kind)
                bucket = grouped[key]
                bucket["record_ids"].add(record_id)
                bucket["confidence_by_record"][record_id] = confidence
                bucket["source_ref_count"] += 1
                bucket["missing_locator_count"] += int(blank(ref.get("locator")))
                bucket["missing_summary_count"] += int(blank(ref.get("summary")))

    rows: list[dict] = []
    for (record_kind, source_id, evidence_kind), bucket in sorted(grouped.items()):
        confidences = bucket["confidence_by_record"].values()
        rows.append(
            {
                "record_kind": record_kind,
                "source_id": source_id,
                "evidence_kind": evidence_kind,
                "source_ref_count": bucket["source_ref_count"],
                "record_count": len(bucket["record_ids"]),
                "high_confidence_record_count": sum(1 for item in confidences if item == "high"),
                "medium_confidence_record_count": sum(1 for item in confidences if item == "medium"),
                "low_confidence_record_count": sum(1 for item in confidences if item == "low"),
                "missing_locator_count": bucket["missing_locator_count"],
                "missing_summary_count": bucket["missing_summary_count"],
            }
        )
    return rows


def source_ref_quality_summary(rows: Iterable[dict]) -> dict:
    totals = {
        "source_ref_count": 0,
        "missing_locator_count": 0,
        "missing_summary_count": 0,
    }
    for row in rows:
        for key in totals:
            totals[key] += int(row.get(key, 0))
    return totals


def render_markdown(rows: list[dict]) -> str:
    summary = source_ref_quality_summary(rows)
    lines = [
        "# Source Reference Audit",
        "",
        "This generated audit summarizes concept and edge source references by source and evidence type.",
        "",
        "## Summary",
        "",
        f"- source refs: {summary['source_ref_count']}",
        f"- missing locator: {summary['missing_locator_count']}",
        f"- missing summary: {summary['missing_summary_count']}",
        "",
        "## Rows",
        "",
        "| record_kind | source_id | evidence_kind | refs | records | high | medium | low | missing locator | missing summary |",
        "|---|---|---|---:|---:|---:|---:|---:|---:|---:|",
    ]

    for row in rows:
        lines.append(
            "| {record_kind} | {source_id} | {evidence_kind} | {source_ref_count} | "
            "{record_count} | {high_confidence_record_count} | "
            "{medium_confidence_record_count} | {low_confidence_record_count} | "
            "{missing_locator_count} | {missing_summary_count} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = SOURCE_REF_AUDIT_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    data = json.loads(CONCEPTS_JSON.read_text(encoding="utf-8"))
    rows = source_ref_summary_rows(data.get("concepts", []), data.get("edges", []))
    write_csv(rows)
    SOURCE_REF_AUDIT_MD.write_text(render_markdown(rows), encoding="utf-8")

    summary = source_ref_quality_summary(rows)
    print(
        f"Wrote source reference audit for {summary['source_ref_count']} refs "
        f"to {SOURCE_REF_AUDIT_CSV} and {SOURCE_REF_AUDIT_MD}."
    )


if __name__ == "__main__":
    main()
