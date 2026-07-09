from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path
from typing import Iterable

import build_legacy_gap_audit as legacy_gap_audit


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
LEGACY_GAP_AUDIT_CSV = OUT_DIR / "legacy-gap-audit.csv"
LEGACY_GAP_RESOLUTION_CSV = OUT_DIR / "legacy-gap-resolution.csv"
LEGACY_GAP_RESOLUTION_MD = OUT_DIR / "legacy-gap-resolution.md"

CSV_FIELDS = [
    "candidate_label",
    "occurrence_count",
    "legacy_domains",
    "legacy_units",
    "resolution_status",
    "resolution_action",
    "candidate_concept_type",
    "candidate_confidence",
    "possible_existing_concept_ids",
    "possible_existing_concept_labels",
    "evidence_basis",
    "notes",
]

FOUNDATIONAL_PREREQUISITE_LABELS = {
    "약수",
    "배수",
    "덧셈",
    "뺄셈",
    "곱셈",
    "나눗셈",
    "비",
    "삼각형",
    "도형",
    "길이",
    "넓이",
}
ALIAS_CANDIDATE_LABELS = {"피타고라스"}
CORE_CONCEPT_LABELS = {"삼각형", "도형"}
STATUS_ORDER = {
    "foundational_prerequisite_candidate": 0,
    "alias_candidate_for_existing_concept": 1,
    "source_detail_needed": 2,
}
MAX_POSSIBLE_MATCHES = 12


def read_csv_rows(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def read_concepts(path: Path = CONCEPTS_JSON) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return list(data.get("concepts", []))


def unique_join(values: Iterable[str]) -> str:
    return "; ".join(sorted({str(value).strip() for value in values if str(value).strip()}))


def candidate_concept_type(label: str) -> str:
    if label in CORE_CONCEPT_LABELS:
        return "core_concept"
    return "term"


def possible_concept_matches(label: str, concepts: Iterable[dict]) -> list[dict]:
    normalized_label = legacy_gap_audit.normalize_label(label)
    if not normalized_label:
        return []

    matches: list[dict] = []
    for concept in concepts:
        candidates = [str(concept.get("label_ko", ""))]
        candidates.extend(str(alias) for alias in concept.get("aliases", []))
        normalized_candidates = [
            legacy_gap_audit.normalize_label(candidate)
            for candidate in candidates
            if candidate
        ]
        if any(
            normalized_label == normalized_candidate
            or (
                len(normalized_label) > 1
                and normalized_label in normalized_candidate
            )
            for normalized_candidate in normalized_candidates
        ):
            matches.append(concept)

    matches.sort(key=lambda item: str(item.get("id", "")))
    return matches[:MAX_POSSIBLE_MATCHES]


def resolution_for_label(
    label: str,
    possible_matches: list[dict],
    foundational_labels: set[str],
    alias_labels: set[str],
) -> dict:
    if label in alias_labels:
        return {
            "resolution_status": "alias_candidate_for_existing_concept",
            "resolution_action": "review_alias_on_existing_concept",
            "candidate_concept_type": "term",
            "candidate_confidence": "low",
            "notes": "Likely a shortened legacy label; review as an alias on a more specific existing concept.",
        }

    if label in foundational_labels:
        return {
            "resolution_status": "foundational_prerequisite_candidate",
            "resolution_action": "review_for_low_confidence_prerequisite_node",
            "candidate_concept_type": candidate_concept_type(label),
            "candidate_confidence": "low",
            "notes": "Review as a foundational prerequisite concept before adding or linking it.",
        }

    if possible_matches:
        return {
            "resolution_status": "alias_candidate_for_existing_concept",
            "resolution_action": "review_alias_on_existing_concept",
            "candidate_concept_type": "term",
            "candidate_confidence": "low",
            "notes": "A nearby concept label exists; inspect official source detail before merging as an alias.",
        }

    return {
        "resolution_status": "source_detail_needed",
        "resolution_action": "inspect_official_source_before_decision",
        "candidate_concept_type": "term",
        "candidate_confidence": "low",
        "notes": "No safe label-level decision yet; inspect the official source context first.",
    }


def legacy_gap_resolution_rows(
    audit_rows: Iterable[dict],
    concepts: Iterable[dict],
    foundational_labels: set[str] = FOUNDATIONAL_PREREQUISITE_LABELS,
    alias_labels: set[str] = ALIAS_CANDIDATE_LABELS,
) -> list[dict]:
    groups: dict[str, list[dict]] = defaultdict(list)
    display_labels: dict[str, str] = {}
    for row in audit_rows:
        if row.get("coverage_status") != "needs_review":
            continue
        label = str(row.get("legacy_label_ko", "")).strip()
        normalized = legacy_gap_audit.normalize_label(label)
        if not normalized:
            continue
        groups[normalized].append(row)
        display_labels.setdefault(normalized, label)

    concept_list = list(concepts)
    rows: list[dict] = []
    for normalized_label, grouped_rows in groups.items():
        label = display_labels[normalized_label]
        possible_matches = possible_concept_matches(label, concept_list)
        resolution = resolution_for_label(
            label,
            possible_matches,
            foundational_labels=foundational_labels,
            alias_labels=alias_labels,
        )
        rows.append(
            {
                "candidate_label": label,
                "occurrence_count": len(grouped_rows),
                "legacy_domains": unique_join(row.get("legacy_domain", "") for row in grouped_rows),
                "legacy_units": unique_join(row.get("legacy_unit", "") for row in grouped_rows),
                "resolution_status": resolution["resolution_status"],
                "resolution_action": resolution["resolution_action"],
                "candidate_concept_type": resolution["candidate_concept_type"],
                "candidate_confidence": resolution["candidate_confidence"],
                "possible_existing_concept_ids": unique_join(
                    str(item.get("id", "")) for item in possible_matches
                ),
                "possible_existing_concept_labels": unique_join(
                    str(item.get("label_ko", "")) for item in possible_matches
                ),
                "evidence_basis": "legacy-gap-audit needs_review rows; official source confirmation required",
                "notes": resolution["notes"],
            }
        )

    rows.sort(
        key=lambda row: (
            STATUS_ORDER.get(row["resolution_status"], 99),
            str(row["candidate_label"]),
        )
    )
    return rows


def render_markdown(rows: list[dict]) -> str:
    status_counts: dict[str, int] = {}
    for row in rows:
        status = str(row["resolution_status"])
        status_counts[status] = status_counts.get(status, 0) + 1

    lines = [
        "# Legacy Gap Resolution",
        "",
        "This generated audit folds legacy-gap `needs_review` rows into unique candidate labels and suggests the next conservative resolution step.",
        "It does not add concepts by itself; official curriculum or textbook evidence is still required before merging candidates into `concepts.json`.",
        "",
        "## Summary",
        "",
        f"- unique candidates: {len(rows)}",
    ]
    for status in [
        "foundational_prerequisite_candidate",
        "alias_candidate_for_existing_concept",
        "source_detail_needed",
    ]:
        lines.append(f"- {status}: {status_counts.get(status, 0)}")

    lines.extend(
        [
            "",
            "## Candidates",
            "",
            "| label | occurrences | status | action | type | possible existing concepts | units |",
            "|---|---:|---|---|---|---|---|",
        ]
    )
    for row in rows:
        lines.append(
            "| {candidate_label} | {occurrence_count} | {resolution_status} | "
            "{resolution_action} | {candidate_concept_type} | "
            "{possible_existing_concept_ids} | {legacy_units} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = LEGACY_GAP_RESOLUTION_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    rows = legacy_gap_resolution_rows(
        read_csv_rows(LEGACY_GAP_AUDIT_CSV),
        read_concepts(),
    )
    write_csv(rows)
    LEGACY_GAP_RESOLUTION_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote {len(rows)} legacy gap resolution rows "
        f"to {LEGACY_GAP_RESOLUTION_CSV} and {LEGACY_GAP_RESOLUTION_MD}."
    )


if __name__ == "__main__":
    main()
