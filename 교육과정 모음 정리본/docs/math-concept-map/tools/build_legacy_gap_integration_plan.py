from __future__ import annotations

import csv
import re
from pathlib import Path
from typing import Iterable

import build_legacy_gap_audit as legacy_gap_audit
import build_legacy_gap_resolution as legacy_gap_resolution


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
LEGACY_GAP_RESOLUTION_CSV = OUT_DIR / "legacy-gap-resolution.csv"
LEGACY_GAP_INTEGRATION_PLAN_CSV = OUT_DIR / "legacy-gap-integration-plan.csv"
LEGACY_GAP_INTEGRATION_PLAN_MD = OUT_DIR / "legacy-gap-integration-plan.md"

CSV_FIELDS = [
    "candidate_label",
    "proposed_concept_id",
    "proposed_concept_type",
    "proposed_confidence",
    "integration_status",
    "target_relationship_type",
    "target_concept_ids",
    "target_concept_labels",
    "legacy_units",
    "source_ref_plan",
    "notes",
]

STATUS_ORDER = {
    "stage_prerequisite_node": 0,
    "stage_alias_review": 1,
    "wait_for_source_detail": 2,
}

LABEL_SLUGS = {
    "곱셈": "multiplication",
    "길이": "length",
    "나눗셈": "division",
    "넓이": "area",
    "덧셈": "addition",
    "도형": "figure",
    "배수": "multiple",
    "비": "ratio",
    "뺄셈": "subtraction",
    "삼각형": "triangle",
    "약수": "divisor",
    "피타고라스": "pythagoras",
}


def read_csv_rows(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def slug_for_label(label: str) -> str:
    if label in LABEL_SLUGS:
        return LABEL_SLUGS[label]
    normalized = legacy_gap_audit.normalize_label(label)
    if not normalized:
        return "candidate"
    if normalized in LABEL_SLUGS:
        return LABEL_SLUGS[normalized]
    ascii_slug = re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")
    return ascii_slug or normalized


def proposed_concept_id(label: str) -> str:
    return f"prereq_{slug_for_label(label)}"


def source_ref_plan(row: dict) -> str:
    units = str(row.get("legacy_units", "")).strip()
    if units:
        return f"official confirmation required for legacy units: {units}"
    return "official confirmation required before concept or alias integration"


def integration_row(row: dict) -> dict:
    status = str(row.get("resolution_status", "")).strip()
    label = str(row.get("candidate_label", "")).strip()
    base = {
        "candidate_label": label,
        "proposed_concept_type": str(row.get("candidate_concept_type", "")).strip(),
        "proposed_confidence": str(row.get("candidate_confidence", "low")).strip() or "low",
        "target_concept_ids": str(row.get("possible_existing_concept_ids", "")).strip(),
        "target_concept_labels": str(row.get("possible_existing_concept_labels", "")).strip(),
        "legacy_units": str(row.get("legacy_units", "")).strip(),
        "source_ref_plan": source_ref_plan(row),
    }

    if status == "foundational_prerequisite_candidate":
        return {
            **base,
            "proposed_concept_id": proposed_concept_id(label),
            "integration_status": "stage_prerequisite_node",
            "target_relationship_type": "prerequisite_for",
            "notes": (
                "Create a low-confidence prerequisite node only after official source "
                "confirmation, then link it to the listed existing concepts."
            ),
        }

    if status == "alias_candidate_for_existing_concept":
        return {
            **base,
            "proposed_concept_id": "",
            "integration_status": "stage_alias_review",
            "target_relationship_type": "alias_on_existing_concept",
            "notes": "Do not create a standalone node; review as an alias on the listed existing concepts.",
        }

    return {
        **base,
        "proposed_concept_id": "",
        "integration_status": "wait_for_source_detail",
        "target_relationship_type": "",
        "notes": "Wait for official source context before proposing a concept, alias, or edge.",
    }


def integration_plan_rows(resolution_rows: Iterable[dict]) -> list[dict]:
    rows = [integration_row(row) for row in resolution_rows]
    rows.sort(
        key=lambda row: (
            STATUS_ORDER.get(row["integration_status"], 99),
            str(row["candidate_label"]),
        )
    )
    return rows


def render_markdown(rows: list[dict]) -> str:
    status_counts: dict[str, int] = {}
    for row in rows:
        status = str(row["integration_status"])
        status_counts[status] = status_counts.get(status, 0) + 1

    lines = [
        "# Legacy Gap Integration Plan",
        "",
        "This generated plan turns legacy-gap resolution candidates into conservative integration actions.",
        "It is a staging plan only: do not update `concepts.json` until official curriculum or textbook evidence has been checked.",
        "",
        "## Summary",
        "",
        f"- candidates: {len(rows)}",
    ]
    for status in ["stage_prerequisite_node", "stage_alias_review", "wait_for_source_detail"]:
        lines.append(f"- {status}: {status_counts.get(status, 0)}")

    lines.extend(
        [
            "",
            "## Integration Actions",
            "",
            "| label | action | proposed id | relation | target concepts | units |",
            "|---|---|---|---|---|---|",
        ]
    )
    for row in rows:
        lines.append(
            "| {candidate_label} | {integration_status} | {proposed_concept_id} | "
            "{target_relationship_type} | {target_concept_ids} | {legacy_units} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = LEGACY_GAP_INTEGRATION_PLAN_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    rows = integration_plan_rows(legacy_gap_resolution.read_csv_rows(LEGACY_GAP_RESOLUTION_CSV))
    write_csv(rows)
    LEGACY_GAP_INTEGRATION_PLAN_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote {len(rows)} legacy gap integration plan rows "
        f"to {LEGACY_GAP_INTEGRATION_PLAN_CSV} and {LEGACY_GAP_INTEGRATION_PLAN_MD}."
    )


if __name__ == "__main__":
    main()
