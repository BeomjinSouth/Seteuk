from __future__ import annotations

import csv
import json
import re
import unicodedata
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
LEGACY_GAP_AUDIT_CSV = OUT_DIR / "legacy-gap-audit.csv"
LEGACY_GAP_AUDIT_MD = OUT_DIR / "legacy-gap-audit.md"

CSV_FIELDS = [
    "legacy_record_type",
    "legacy_id",
    "legacy_label_ko",
    "legacy_grade",
    "legacy_domain",
    "legacy_unit",
    "coverage_status",
    "matched_concept_ids",
    "matched_concept_labels",
    "candidate_action",
    "confidence",
    "source_note",
    "notes",
]

NON_AUTHORITATIVE_NOTE = (
    "Legacy hierarchy is a supporting, non-authoritative candidate source; "
    "confirm with official curriculum or textbook evidence before merging."
)


def normalize_label(label: str) -> str:
    normalized = unicodedata.normalize("NFKC", str(label)).casefold()
    return re.sub(r"[\s\-_./,;:()\[\]{}<>·ㆍ]+", "", normalized)


def find_legacy_hierarchy_path(root: Path = ROOT) -> Path:
    matches = sorted(root.glob("*/data/math_concept_hierarchy.json"))
    if not matches:
        raise FileNotFoundError("missing legacy math_concept_hierarchy.json")
    return matches[0]


def read_legacy_data(path: Path | None = None) -> dict:
    legacy_path = path or find_legacy_hierarchy_path()
    return json.loads(legacy_path.read_text(encoding="utf-8"))


def read_concepts(path: Path = CONCEPTS_JSON) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return list(data.get("concepts", []))


def is_middle_grade(value: object) -> bool:
    grade = str(value or "").strip().casefold()
    return grade.startswith("middle") or grade.startswith("\uc911")


def is_middle_code(value: object) -> bool:
    return str(value or "").strip().startswith("9")


def source_note_for(record: dict) -> str:
    source = record.get("source", {})
    if not isinstance(source, dict) or not source:
        return NON_AUTHORITATIVE_NOTE

    parts = []
    for key in ["pdf", "pageRange", "page", "basis"]:
        value = str(source.get(key, "")).strip()
        if value:
            parts.append(f"{key}: {value}")
    if not parts:
        return NON_AUTHORITATIVE_NOTE
    return f"{NON_AUTHORITATIVE_NOTE} Legacy source detail: {'; '.join(parts)}"


def iter_legacy_candidates(legacy_data: dict) -> Iterable[dict]:
    for node in legacy_data.get("curriculum_nodes", []):
        grade = str(node.get("gradeBand", node.get("grade", "")))
        if not is_middle_grade(grade):
            continue
        label = str(node.get("label", node.get("label_ko", ""))).strip()
        if not label:
            continue
        yield {
            "legacy_record_type": "curriculum_node",
            "legacy_id": str(node.get("id", "")),
            "legacy_label_ko": label,
            "legacy_grade": grade,
            "legacy_domain": str(node.get("area", node.get("domain", ""))),
            "legacy_unit": label,
            "source_note": source_note_for(node),
        }

    for concept in legacy_data.get("textbook_concepts", []):
        grade = str(concept.get("gradeBand", concept.get("grade", "")))
        if grade and not is_middle_grade(grade):
            continue
        label = str(
            concept.get("label", concept.get("label_ko", concept.get("name", "")))
        ).strip()
        if not label:
            continue
        yield {
            "legacy_record_type": "textbook_concept",
            "legacy_id": str(concept.get("id", "")),
            "legacy_label_ko": label,
            "legacy_grade": grade,
            "legacy_domain": str(concept.get("area", concept.get("domain", ""))),
            "legacy_unit": str(concept.get("unit", "")),
            "source_note": source_note_for(concept),
        }

    for standard in legacy_data.get("achievement_standards", []):
        grade = str(standard.get("gradeBand", standard.get("grade", "")))
        code = str(standard.get("code", ""))
        if not (is_middle_code(code) or is_middle_grade(grade)):
            continue
        for tag in standard.get("conceptTags", []):
            label = str(tag).strip()
            if not label:
                continue
            yield {
                "legacy_record_type": "achievement_concept_tag",
                "legacy_id": f"achievement:{code}:{label}",
                "legacy_label_ko": label,
                "legacy_grade": grade,
                "legacy_domain": str(standard.get("area", standard.get("domain", ""))),
                "legacy_unit": code,
                "source_note": source_note_for(standard),
            }


def concept_indexes(concepts: Iterable[dict]) -> tuple[dict[str, list[dict]], dict[str, list[dict]]]:
    label_index: dict[str, list[dict]] = {}
    alias_index: dict[str, list[dict]] = {}

    for concept in concepts:
        label_key = normalize_label(str(concept.get("label_ko", "")))
        if label_key:
            label_index.setdefault(label_key, []).append(concept)
        for alias in concept.get("aliases", []):
            alias_key = normalize_label(str(alias))
            if alias_key:
                alias_index.setdefault(alias_key, []).append(concept)

    return label_index, alias_index


def match_candidate(candidate: dict, label_index: dict[str, list[dict]], alias_index: dict[str, list[dict]]) -> dict:
    normalized = normalize_label(candidate["legacy_label_ko"])
    label_matches = label_index.get(normalized, [])
    alias_matches = alias_index.get(normalized, [])

    if label_matches:
        matches = sorted(label_matches, key=lambda item: str(item.get("id", "")))
        return {
            "coverage_status": "covered_by_label",
            "matches": matches,
            "candidate_action": "no_action_existing_concept",
            "confidence": "medium",
            "notes": "Matched by normalized label.",
        }
    if alias_matches:
        matches = sorted(alias_matches, key=lambda item: str(item.get("id", "")))
        return {
            "coverage_status": "covered_by_alias",
            "matches": matches,
            "candidate_action": "no_action_existing_concept",
            "confidence": "medium",
            "notes": "Matched by normalized alias.",
        }
    return {
        "coverage_status": "needs_review",
        "matches": [],
        "candidate_action": "review_against_official_sources",
        "confidence": "low",
        "notes": "No normalized label or alias match in concepts.json.",
    }


def legacy_gap_rows(legacy_data: dict, concepts: Iterable[dict]) -> list[dict]:
    label_index, alias_index = concept_indexes(concepts)
    rows: list[dict] = []

    for candidate in iter_legacy_candidates(legacy_data):
        result = match_candidate(candidate, label_index, alias_index)
        matches = result["matches"]
        rows.append(
            {
                "legacy_record_type": candidate["legacy_record_type"],
                "legacy_id": candidate["legacy_id"],
                "legacy_label_ko": candidate["legacy_label_ko"],
                "legacy_grade": candidate["legacy_grade"],
                "legacy_domain": candidate["legacy_domain"],
                "legacy_unit": candidate["legacy_unit"],
                "coverage_status": result["coverage_status"],
                "matched_concept_ids": "; ".join(str(item.get("id", "")) for item in matches),
                "matched_concept_labels": "; ".join(str(item.get("label_ko", "")) for item in matches),
                "candidate_action": result["candidate_action"],
                "confidence": result["confidence"],
                "source_note": candidate["source_note"],
                "notes": result["notes"],
            }
        )

    rows.sort(key=lambda row: (row["legacy_id"], row["legacy_record_type"]))
    return rows


def render_markdown(rows: list[dict]) -> str:
    status_counts: dict[str, int] = {}
    type_counts: dict[str, int] = {}
    for row in rows:
        status_counts[row["coverage_status"]] = status_counts.get(row["coverage_status"], 0) + 1
        type_counts[row["legacy_record_type"]] = type_counts.get(row["legacy_record_type"], 0) + 1

    lines = [
        "# Legacy Gap Audit",
        "",
        "This generated audit compares the older local hierarchy against the current official-source concept map.",
        "The older hierarchy is treated only as a non-authoritative candidate source.",
        "",
        "## Summary",
        "",
        f"- legacy candidates: {len(rows)}",
    ]
    for status in ["covered_by_label", "covered_by_alias", "needs_review"]:
        lines.append(f"- {status}: {status_counts.get(status, 0)}")

    lines.extend(["", "## Candidate Types", ""])
    for record_type in sorted(type_counts):
        lines.append(f"- {record_type}: {type_counts[record_type]}")

    lines.extend(
        [
            "",
            "## Needs Review",
            "",
            "| legacy_id | label | domain | unit | action | notes |",
            "|---|---|---|---|---|---|",
        ]
    )
    for row in rows:
        if row["coverage_status"] != "needs_review":
            continue
        lines.append(
            "| {legacy_id} | {legacy_label_ko} | {legacy_domain} | {legacy_unit} | "
            "{candidate_action} | {notes} |".format(**row)
        )

    lines.extend(
        [
            "",
            "## Covered Candidates",
            "",
            "| legacy_id | label | status | matched concepts |",
            "|---|---|---|---|",
        ]
    )
    for row in rows:
        if row["coverage_status"] == "needs_review":
            continue
        lines.append(
            "| {legacy_id} | {legacy_label_ko} | {coverage_status} | "
            "{matched_concept_ids} |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = LEGACY_GAP_AUDIT_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    rows = legacy_gap_rows(read_legacy_data(), read_concepts())
    write_csv(rows)
    LEGACY_GAP_AUDIT_MD.write_text(render_markdown(rows), encoding="utf-8")
    needs_review = sum(1 for row in rows if row["coverage_status"] == "needs_review")
    print(
        f"Wrote {len(rows)} legacy gap audit rows "
        f"({needs_review} needing review) to {LEGACY_GAP_AUDIT_CSV} and {LEGACY_GAP_AUDIT_MD}."
    )


if __name__ == "__main__":
    main()
