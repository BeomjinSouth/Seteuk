from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Iterable

import build_legacy_gap_integration_plan as legacy_gap_integration_plan


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
LEGACY_GAP_INTEGRATION_PLAN_CSV = OUT_DIR / "legacy-gap-integration-plan.csv"
LEGACY_GAP_SOURCE_REVIEW_CSV = OUT_DIR / "legacy-gap-source-review.csv"
LEGACY_GAP_SOURCE_REVIEW_MD = OUT_DIR / "legacy-gap-source-review.md"

CSV_FIELDS = [
    "candidate_label",
    "integration_status",
    "proposed_concept_id",
    "target_relationship_type",
    "review_status",
    "review_priority",
    "legacy_units",
    "search_terms",
    "target_concept_ids",
    "target_source_ref_count",
    "target_source_refs",
    "recommended_next_step",
    "notes",
]


def read_csv_rows(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def read_concepts(path: Path = CONCEPTS_JSON) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return list(data.get("concepts", []))


def split_semicolon(value: str) -> list[str]:
    return [part.strip() for part in str(value).split(";") if part.strip()]


def concept_index(concepts: Iterable[dict]) -> dict[str, dict]:
    return {str(concept.get("id", "")): concept for concept in concepts}


def review_status_for(integration_status: str) -> str:
    if integration_status == "stage_prerequisite_node":
        return "needs_official_prerequisite_confirmation"
    if integration_status == "stage_alias_review":
        return "needs_alias_confirmation"
    return "needs_source_detail"


def review_priority_for(integration_status: str) -> str:
    if integration_status == "stage_prerequisite_node":
        return "official_source_first"
    if integration_status == "stage_alias_review":
        return "alias_review"
    return "source_detail_first"


def compact_source_refs(target_ids: list[str], concepts_by_id: dict[str, dict]) -> list[str]:
    refs: list[str] = []
    for concept_id in target_ids:
        concept = concepts_by_id.get(concept_id)
        if not concept:
            continue
        for ref in concept.get("source_refs", []):
            source_id = str(ref.get("source_id", "")).strip()
            locator = str(ref.get("locator", "")).strip()
            summary = str(ref.get("summary", "")).strip()
            refs.append(f"{concept_id}: {source_id} @ {locator} -> {summary}")
    return refs


def search_terms(row: dict) -> str:
    terms = [str(row.get("candidate_label", "")).strip()]
    terms.extend(split_semicolon(str(row.get("legacy_units", ""))))
    terms.extend(split_semicolon(str(row.get("target_concept_labels", ""))))
    return "; ".join(dict.fromkeys(term for term in terms if term))


def recommended_next_step(row: dict) -> str:
    status = str(row.get("integration_status", "")).strip()
    proposed_id = str(row.get("proposed_concept_id", "")).strip()
    if status == "stage_prerequisite_node":
        return (
            "Inspect official curriculum and achievement-level source refs "
            f"before adding {proposed_id}; then create prerequisite_for edges only for confirmed targets."
        )
    if status == "stage_alias_review":
        return "Do not create a standalone node; confirm whether the candidate label belongs as an alias."
    return "Inspect source context before proposing a concept, alias, or relationship."


def notes_for(row: dict, target_ids: list[str], concepts_by_id: dict[str, dict]) -> str:
    missing_targets = [target_id for target_id in target_ids if target_id not in concepts_by_id]
    if not target_ids:
        return "No target concepts listed; inspect legacy units directly before proposing edges."
    if missing_targets:
        return f"Missing target concepts in concepts.json: {'; '.join(missing_targets)}"
    return "Review target source refs first; add source_refs only after direct official evidence is confirmed."


def source_review_row(row: dict, concepts_by_id: dict[str, dict]) -> dict:
    target_ids = split_semicolon(str(row.get("target_concept_ids", "")))
    refs = compact_source_refs(target_ids, concepts_by_id)
    integration_status = str(row.get("integration_status", "")).strip()
    return {
        "candidate_label": str(row.get("candidate_label", "")).strip(),
        "integration_status": integration_status,
        "proposed_concept_id": str(row.get("proposed_concept_id", "")).strip(),
        "target_relationship_type": str(row.get("target_relationship_type", "")).strip(),
        "review_status": review_status_for(integration_status),
        "review_priority": review_priority_for(integration_status),
        "legacy_units": str(row.get("legacy_units", "")).strip(),
        "search_terms": search_terms(row),
        "target_concept_ids": "; ".join(target_ids),
        "target_source_ref_count": str(len(refs)),
        "target_source_refs": " || ".join(refs),
        "recommended_next_step": recommended_next_step(row),
        "notes": notes_for(row, target_ids, concepts_by_id),
    }


def source_review_rows(integration_rows: Iterable[dict], concepts: Iterable[dict]) -> list[dict]:
    concepts_by_id = concept_index(concepts)
    return [source_review_row(row, concepts_by_id) for row in integration_rows]


def render_markdown(rows: list[dict]) -> str:
    status_counts: dict[str, int] = {}
    for row in rows:
        status = str(row["review_status"])
        status_counts[status] = status_counts.get(status, 0) + 1

    lines = [
        "# Legacy Gap Source Review",
        "",
        "This generated review packet lists where each legacy-gap integration candidate should be checked before updating `concepts.json`.",
        "",
        "## Summary",
        "",
        f"- candidates: {len(rows)}",
    ]
    for status in [
        "needs_official_prerequisite_confirmation",
        "needs_alias_confirmation",
        "needs_source_detail",
    ]:
        lines.append(f"- {status}: {status_counts.get(status, 0)}")

    lines.extend(
        [
            "",
            "## Review Queue",
            "",
            "| label | review status | proposed id | target refs | search terms |",
            "|---|---|---|---:|---|",
        ]
    )
    for row in rows:
        lines.append(
            "| {candidate_label} | {review_status} | {proposed_concept_id} | "
            "{target_source_ref_count} | {search_terms} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = LEGACY_GAP_SOURCE_REVIEW_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    rows = source_review_rows(
        legacy_gap_integration_plan.read_csv_rows(LEGACY_GAP_INTEGRATION_PLAN_CSV),
        read_concepts(),
    )
    write_csv(rows)
    LEGACY_GAP_SOURCE_REVIEW_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote {len(rows)} legacy gap source review rows "
        f"to {LEGACY_GAP_SOURCE_REVIEW_CSV} and {LEGACY_GAP_SOURCE_REVIEW_MD}."
    )


if __name__ == "__main__":
    main()
