from __future__ import annotations

import csv
import json
import re
from collections import Counter
from functools import lru_cache
from pathlib import Path
from typing import Iterable

import build_research_report_context_packet as context_packet


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
RESEARCH_REPORT_SOURCE_REVIEW_CSV = OUT_DIR / "research-report-source-review.csv"
RESEARCH_REPORT_SOURCE_REVIEW_MD = OUT_DIR / "research-report-source-review.md"
RESEARCH_REPORT_SOURCE_ID = "achievement_research_report_2022"

CSV_FIELDS = [
    "rank",
    "context_packet_rank",
    "concept_id",
    "label_ko",
    "matched_term",
    "grade",
    "domain",
    "unit",
    "confidence",
    "page_number",
    "source_locator_candidate",
    "context_signal",
    "evidence_candidate_type",
    "review_decision",
    "review_priority",
    "source_ref_action",
    "source_ref_application_status",
    "confidence_action",
    "source_ref_upgrade_allowed",
    "review_reason",
    "notes",
]

SOURCE_REF_UPGRADE_ALLOWED = "no"
MANUAL_REVIEW_REQUIRED = "manual_review_required"
APPLIED_AFTER_MANUAL_REVIEW = "applied_after_manual_review"
DO_NOT_ADD_FROM_THIS_ROW = "do_not_add_from_this_row"
CANDIDATE_ADD_AFTER_REVIEW = "candidate_add_after_manual_review"
APPLIED_TO_CONCEPTS_JSON = "applied_to_concepts_json"
PENDING_MANUAL_REVIEW = "pending_manual_review"
NOT_APPLICABLE_FROM_THIS_ROW = "not_applicable_from_this_row"
KEEP_CONFIDENCE = "keep_current_confidence_until_source_review"
KEEP_LOW = "keep_low_until_textbook_or_middle_course_evidence"
PAGE_RE = re.compile(r"p\.\s*(\d+)")

BROAD_CONTEXT_MARKERS = (
    "목차",
    "내용 체계",
    "내용체계",
    "<표",
    "통합 제시",
    "학습 내용 재구조화",
)
PREREQUISITE_CONTEXT_MARKERS = (
    "비와 비율",
    "비가 적용",
    "비례식",
    "비례배분",
)


def split_semicolon(value: object) -> list[str]:
    return [part.strip() for part in str(value or "").split(";") if part.strip()]


def int_value(value: object) -> int:
    try:
        return int(str(value).strip())
    except ValueError:
        return 0


def has_signal(row: dict, signal_name: str) -> bool:
    return signal_name in split_semicolon(row.get("context_signal", ""))


@lru_cache(maxsize=1)
def default_page_text_by_number() -> dict[int, str]:
    return {
        int(page.get("page_number", 0)): str(page.get("text", ""))
        for page in context_packet.signal.extract_page_texts()
    }


def is_broad_context(row: dict, page_text_by_number: dict[int, str] | None = None) -> bool:
    page_number = int_value(row.get("page_number", ""))
    full_page_text = (page_text_by_number or {}).get(page_number, "")
    review_text = " ".join([str(row.get("context_excerpt", "")), str(full_page_text)])
    return page_number <= 20 or any(marker in review_text for marker in BROAD_CONTEXT_MARKERS)


def is_prerequisite_context(row: dict) -> bool:
    excerpt = str(row.get("context_excerpt", ""))
    return str(row.get("confidence", "")) == "low" and any(
        marker in excerpt for marker in PREREQUISITE_CONTEXT_MARKERS
    )


def evidence_candidate_type(row: dict, page_text_by_number: dict[int, str] | None = None) -> str:
    if is_broad_context(row, page_text_by_number=page_text_by_number):
        return "broad_report_context_only"
    if is_prerequisite_context(row):
        return "candidate_prerequisite_evidence"
    if has_signal(row, "example_assessment_tool_context"):
        return "candidate_assessment_item_evidence"
    if has_signal(row, "achievement_level_context") and int_value(row.get("match_count_on_page", 0)) >= 2:
        return "candidate_achievement_level_evidence"
    return "weak_occurrence_only"


def review_priority(candidate_type: str, row: dict) -> str:
    if candidate_type == "candidate_prerequisite_evidence":
        return "high"
    if candidate_type in {"candidate_assessment_item_evidence", "candidate_achievement_level_evidence"}:
        return "medium"
    if str(row.get("confidence", "")) == "low":
        return "medium"
    return "low"


def source_ref_action(candidate_type: str) -> str:
    if candidate_type in {
        "candidate_prerequisite_evidence",
        "candidate_assessment_item_evidence",
        "candidate_achievement_level_evidence",
    }:
        return CANDIDATE_ADD_AFTER_REVIEW
    return DO_NOT_ADD_FROM_THIS_ROW


def source_ref_application_status(action: str) -> str:
    if action == APPLIED_TO_CONCEPTS_JSON:
        return APPLIED_AFTER_MANUAL_REVIEW
    if action == CANDIDATE_ADD_AFTER_REVIEW:
        return PENDING_MANUAL_REVIEW
    return NOT_APPLICABLE_FROM_THIS_ROW


def confidence_action(row: dict, candidate_type: str) -> str:
    if str(row.get("confidence", "")) == "low":
        return KEEP_LOW
    if candidate_type == "weak_occurrence_only":
        return "no_confidence_change_from_occurrence_only"
    return KEEP_CONFIDENCE


def review_reason(row: dict, candidate_type: str) -> str:
    if candidate_type == "candidate_prerequisite_evidence":
        return "Low-confidence prerequisite concept has direct ratio context in the research report."
    if candidate_type == "candidate_assessment_item_evidence":
        return "Research-report page appears to contain assessment-item context for the matched concept."
    if candidate_type == "candidate_achievement_level_evidence":
        return "Research-report page appears to contain achievement-level context with repeated matches."
    if candidate_type == "broad_report_context_only":
        return "Page appears to be table-of-contents, overview, or broad curriculum context."
    return "Matched term appears without enough page context for a source_ref decision."


def source_ref_page_numbers(locator: object) -> set[str]:
    return set(PAGE_RE.findall(str(locator or "")))


def applied_source_ref_keys(concepts: Iterable[dict]) -> set[tuple[str, str]]:
    keys: set[tuple[str, str]] = set()
    for concept in concepts:
        concept_id = str(concept.get("id", ""))
        for ref in concept.get("source_refs", []):
            if str(ref.get("source_id", "")) != RESEARCH_REPORT_SOURCE_ID:
                continue
            for page_number in source_ref_page_numbers(ref.get("locator", "")):
                keys.add((concept_id, page_number))
    return keys


def read_applied_source_ref_keys(path: Path = CONCEPTS_JSON) -> set[tuple[str, str]]:
    if not path.exists():
        return set()
    data = json.loads(path.read_text(encoding="utf-8"))
    return applied_source_ref_keys(data.get("concepts", []))


def source_review_row(
    row: dict,
    rank: int,
    applied_source_ref_keys: set[tuple[str, str]] | None = None,
    page_text_by_number: dict[int, str] | None = None,
) -> dict:
    candidate_type = evidence_candidate_type(row, page_text_by_number=page_text_by_number)
    applied = (
        str(row.get("concept_id", "")),
        str(row.get("page_number", "")),
    ) in (applied_source_ref_keys or set())
    action = APPLIED_TO_CONCEPTS_JSON if applied else source_ref_action(candidate_type)
    decision = APPLIED_AFTER_MANUAL_REVIEW if applied else MANUAL_REVIEW_REQUIRED
    reason = (
        "Matching research-report source_ref exists in concepts.json; keep confidence decisions separate."
        if applied
        else review_reason(row, candidate_type)
    )
    notes = (
        "Applied source_ref exists in concepts.json; confidence still waits for textbook or direct middle-course evidence."
        if applied
        else "Review source page before changing concepts.json; this generated review does not apply source_refs."
    )
    return {
        "rank": rank,
        "context_packet_rank": row.get("rank", ""),
        "concept_id": row.get("concept_id", ""),
        "label_ko": row.get("label_ko", ""),
        "matched_term": row.get("matched_term", ""),
        "grade": row.get("grade", ""),
        "domain": row.get("domain", ""),
        "unit": row.get("unit", ""),
        "confidence": row.get("confidence", ""),
        "page_number": row.get("page_number", ""),
        "source_locator_candidate": row.get("source_locator_candidate", ""),
        "context_signal": row.get("context_signal", ""),
        "evidence_candidate_type": candidate_type,
        "review_decision": decision,
        "review_priority": review_priority(candidate_type, row),
        "source_ref_action": action,
        "source_ref_application_status": source_ref_application_status(action),
        "confidence_action": confidence_action(row, candidate_type),
        "source_ref_upgrade_allowed": SOURCE_REF_UPGRADE_ALLOWED,
        "review_reason": reason,
        "notes": notes,
    }


def research_report_source_review_rows(
    context_rows: Iterable[dict],
    applied_source_ref_keys: set[tuple[str, str]] | None = None,
    page_text_by_number: dict[int, str] | None = None,
) -> list[dict]:
    applied_keys = read_applied_source_ref_keys() if applied_source_ref_keys is None else applied_source_ref_keys
    page_texts = default_page_text_by_number() if page_text_by_number is None else page_text_by_number
    rows = [
        source_review_row(
            row,
            rank=index,
            applied_source_ref_keys=applied_keys,
            page_text_by_number=page_texts,
        )
        for index, row in enumerate(context_rows, start=1)
    ]
    priority_order = {"high": 0, "medium": 1, "low": 2}
    rows.sort(
        key=lambda row: (
            priority_order.get(str(row.get("review_priority", "")), 99),
            str(row.get("evidence_candidate_type", "")),
            int_value(row.get("page_number", "")),
            str(row.get("concept_id", "")),
        )
    )
    for index, row in enumerate(rows, start=1):
        row["rank"] = index
    return rows


def read_context_rows(path: Path = context_packet.RESEARCH_REPORT_CONTEXT_PACKET_CSV) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def write_csv(rows: list[dict], path: Path = RESEARCH_REPORT_SOURCE_REVIEW_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def render_markdown(rows: list[dict]) -> str:
    candidate_counts = Counter(str(row.get("evidence_candidate_type", "")) for row in rows)
    priority_counts = Counter(str(row.get("review_priority", "")) for row in rows)
    application_counts = Counter(str(row.get("source_ref_application_status", "")) for row in rows)
    lines = [
        "# Research Report Source Review",
        "",
        "This generated review separates source-worthy research-report context from broad or weak occurrences.",
        "Rows with matching reviewed source_refs in `concepts.json` are marked as applied; all other rows remain review tasks.",
        "The generated review still does not permit automatic source_ref or confidence upgrades.",
        "",
        "## Summary",
        "",
        f"- review rows: {len(rows)}",
        "",
        "## Evidence Candidate Types",
        "",
        "| evidence_candidate_type | rows |",
        "|---|---:|",
    ]
    for candidate_type, count in sorted(candidate_counts.items()):
        lines.append(f"| {candidate_type} | {count} |")

    lines.extend(
        [
            "",
            "## Source Ref Application",
            "",
            "| application_status | rows |",
            "|---|---:|",
        ]
    )
    for status, count in sorted(application_counts.items()):
        lines.append(f"| {status} | {count} |")

    lines.extend(
        [
            "",
            "## Review Priority",
            "",
            "| priority | rows |",
            "|---|---:|",
        ]
    )
    for priority, count in sorted(priority_counts.items()):
        lines.append(f"| {priority} | {count} |")

    lines.extend(
        [
            "",
            "## Review Rows",
            "",
            "| rank | concept_id | label | page | candidate type | priority | source_ref_action | application_status | confidence_action |",
            "|---:|---|---|---:|---|---|---|---|---|",
        ]
    )
    for row in rows[:80]:
        lines.append(
            "| {rank} | {concept_id} | {label_ko} | {page_number} | {evidence_candidate_type} | "
            "{review_priority} | {source_ref_action} | {source_ref_application_status} | {confidence_action} |".format(**row)
        )
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    rows = research_report_source_review_rows(read_context_rows())
    write_csv(rows)
    RESEARCH_REPORT_SOURCE_REVIEW_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote research report source review with {len(rows)} rows "
        f"to {RESEARCH_REPORT_SOURCE_REVIEW_CSV} and {RESEARCH_REPORT_SOURCE_REVIEW_MD}."
    )


if __name__ == "__main__":
    main()
