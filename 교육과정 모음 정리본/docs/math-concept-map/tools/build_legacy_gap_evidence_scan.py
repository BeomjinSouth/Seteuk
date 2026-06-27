from __future__ import annotations

import csv
from pathlib import Path
from typing import Iterable

import build_legacy_gap_source_review as legacy_gap_source_review


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
LEGACY_GAP_SOURCE_REVIEW_CSV = OUT_DIR / "legacy-gap-source-review.csv"
LEGACY_GAP_EVIDENCE_SCAN_CSV = OUT_DIR / "legacy-gap-evidence-scan.csv"
LEGACY_GAP_EVIDENCE_SCAN_MD = OUT_DIR / "legacy-gap-evidence-scan.md"

CSV_FIELDS = [
    "candidate_label",
    "integration_status",
    "proposed_concept_id",
    "review_status",
    "evidence_signal",
    "candidate_mention_count",
    "legacy_units",
    "target_source_ref_count",
    "matching_target_source_refs",
    "recommended_action",
    "notes",
]


def read_csv_rows(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def split_refs(value: str) -> list[str]:
    return [part.strip() for part in str(value).split("||") if part.strip()]


def matching_refs(candidate_label: str, target_source_refs: str) -> list[str]:
    if not candidate_label:
        return []
    return [ref for ref in split_refs(target_source_refs) if candidate_label in ref]


def evidence_signal(row: dict, matches: list[str]) -> str:
    integration_status = str(row.get("integration_status", "")).strip()
    target_source_refs = str(row.get("target_source_refs", "")).strip()
    if matches and integration_status == "stage_alias_review":
        return "alias_source_refs_mention_candidate"
    if matches:
        return "target_source_refs_mention_candidate"
    if not target_source_refs:
        return "direct_legacy_unit_review_needed"
    return "target_source_refs_do_not_mention_candidate"


def recommended_action(row: dict, signal: str) -> str:
    proposed_id = str(row.get("proposed_concept_id", "")).strip()
    if signal == "alias_source_refs_mention_candidate":
        return "Review alias wording against matching source refs before updating aliases."
    if signal == "target_source_refs_mention_candidate":
        return f"Review matching source refs before creating {proposed_id} or prerequisite edges."
    if signal == "direct_legacy_unit_review_needed":
        return "Inspect legacy units directly before proposing a concept or edge."
    return "Inspect target concepts and official source refs manually before integration."


def notes_for(row: dict, signal: str) -> str:
    if signal == "direct_legacy_unit_review_needed":
        return "No target source refs are available; use legacy units and official PDFs for direct review."
    if signal == "target_source_refs_do_not_mention_candidate":
        return "Target source refs exist, but none mention the candidate label directly."
    return "Candidate label appears in existing target source refs; still confirm before updating concepts.json."


def evidence_scan_row(row: dict) -> dict:
    label = str(row.get("candidate_label", "")).strip()
    matches = matching_refs(label, str(row.get("target_source_refs", "")))
    signal = evidence_signal(row, matches)
    return {
        "candidate_label": label,
        "integration_status": str(row.get("integration_status", "")).strip(),
        "proposed_concept_id": str(row.get("proposed_concept_id", "")).strip(),
        "review_status": str(row.get("review_status", "")).strip(),
        "evidence_signal": signal,
        "candidate_mention_count": str(len(matches)),
        "legacy_units": str(row.get("legacy_units", "")).strip(),
        "target_source_ref_count": str(row.get("target_source_ref_count", "")).strip(),
        "matching_target_source_refs": " || ".join(matches),
        "recommended_action": recommended_action(row, signal),
        "notes": notes_for(row, signal),
    }


def evidence_scan_rows(source_review_rows: Iterable[dict]) -> list[dict]:
    return [evidence_scan_row(row) for row in source_review_rows]


def render_markdown(rows: list[dict]) -> str:
    signal_counts: dict[str, int] = {}
    for row in rows:
        signal = str(row["evidence_signal"])
        signal_counts[signal] = signal_counts.get(signal, 0) + 1

    lines = [
        "# Legacy Gap Evidence Scan",
        "",
        "This generated scan checks whether legacy-gap candidates appear in existing target source refs before any concept-map integration.",
        "",
        "## Summary",
        "",
        f"- candidates: {len(rows)}",
    ]
    for signal in [
        "target_source_refs_mention_candidate",
        "alias_source_refs_mention_candidate",
        "target_source_refs_do_not_mention_candidate",
        "direct_legacy_unit_review_needed",
    ]:
        lines.append(f"- {signal}: {signal_counts.get(signal, 0)}")

    lines.extend(
        [
            "",
            "## Evidence Signals",
            "",
            "| label | signal | mentions | target refs | action |",
            "|---|---|---:|---:|---|",
        ]
    )
    for row in rows:
        lines.append(
            "| {candidate_label} | {evidence_signal} | {candidate_mention_count} | "
            "{target_source_ref_count} | {recommended_action} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = LEGACY_GAP_EVIDENCE_SCAN_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    rows = evidence_scan_rows(legacy_gap_source_review.read_csv_rows(LEGACY_GAP_SOURCE_REVIEW_CSV))
    write_csv(rows)
    LEGACY_GAP_EVIDENCE_SCAN_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote {len(rows)} legacy gap evidence scan rows "
        f"to {LEGACY_GAP_EVIDENCE_SCAN_CSV} and {LEGACY_GAP_EVIDENCE_SCAN_MD}."
    )


if __name__ == "__main__":
    main()
