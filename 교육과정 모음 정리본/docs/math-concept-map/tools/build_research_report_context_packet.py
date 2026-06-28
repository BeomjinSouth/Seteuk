from __future__ import annotations

import csv
import re
from collections import Counter
from pathlib import Path
from typing import Iterable

import build_research_report_concept_signal as signal


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
RESEARCH_REPORT_CONTEXT_PACKET_CSV = OUT_DIR / "research-report-context-packet.csv"
RESEARCH_REPORT_CONTEXT_PACKET_MD = OUT_DIR / "research-report-context-packet.md"

CSV_FIELDS = [
    "rank",
    "concept_id",
    "label_ko",
    "matched_term",
    "grade",
    "domain",
    "unit",
    "concept_type",
    "confidence",
    "recommended_action",
    "page_number",
    "match_count_on_page",
    "context_signal",
    "context_excerpt",
    "review_status",
    "source_candidate_id",
    "source_locator_candidate",
    "source_ref_upgrade_allowed",
    "notes",
]

LOW_CONFIDENCE_ACTION = "inspect_research_report_context_before_confidence_change"
MEDIUM_CONFIDENCE_ACTION = "inspect_research_report_context_before_source_ref_upgrade"
MAX_LOW_CONFIDENCE_PAGES = 8
MAX_MEDIUM_CONCEPTS = 20
MAX_MEDIUM_PAGES = 2
MAX_CONTEXT_EXCERPT_CHARS = 90
SOURCE_CANDIDATE_ID = "achievement_research_report_2022"
REVIEW_STATUS = "pending_context_review"
SOURCE_REF_UPGRADE_ALLOWED = "no"
WHITESPACE_RE = re.compile(r"\s+")

CONTEXT_SIGNAL_RULES = [
    ("achievement_level_context", ("성취수준", "성취 수준", "성취기준", "성취 기준")),
    ("example_assessment_tool_context", ("예시 평가도구", "평가도구", "문항", "예시 문항")),
    ("assessment_context", ("평가", "채점", "정답", "해설")),
    ("teaching_learning_context", ("교수", "학습", "수업")),
    ("curriculum_context", ("교육과정", "내용 체계", "성취기준")),
]


def split_semicolon_values(value: object) -> list[str]:
    return [part.strip() for part in str(value or "").split(";") if part.strip()]


def matched_page_numbers(value: object) -> list[int]:
    pages: list[int] = []
    for part in split_semicolon_values(value):
        try:
            pages.append(int(part))
        except ValueError:
            continue
    return pages


def collapse_whitespace(value: object) -> str:
    text = str(value or "").replace("\x00", " ")
    return WHITESPACE_RE.sub(" ", text).strip()


def context_signal(text: str) -> str:
    matches: list[str] = []
    for signal_name, terms in CONTEXT_SIGNAL_RULES:
        if any(term in text for term in terms):
            matches.append(signal_name)
    return "; ".join(dict.fromkeys(matches)) or "general_report_context"


def best_matched_term(terms: list[str], text: str) -> tuple[str, int]:
    normalized_text = signal.normalize_text(text)
    term_counts: list[tuple[int, int, str]] = []
    for term in terms:
        normalized_term = signal.normalize_text(term)
        if not normalized_term:
            continue
        count = normalized_text.count(normalized_term)
        if count:
            term_counts.append((len(normalized_term), count, term))

    if not term_counts:
        return (terms[0] if terms else "", 0)

    length, count, term = max(term_counts)
    return term, count


def short_excerpt(text: str, term: str, max_chars: int = MAX_CONTEXT_EXCERPT_CHARS) -> str:
    collapsed = collapse_whitespace(text)
    if len(collapsed) <= max_chars:
        return collapsed

    index = collapsed.find(term) if term else -1
    if index < 0:
        return collapsed[: max_chars - 3].rstrip() + "..."

    half_window = max((max_chars - len(term)) // 2, 0)
    start = max(index - half_window, 0)
    end = min(start + max_chars, len(collapsed))
    start = max(end - max_chars, 0)
    excerpt = collapsed[start:end].strip()
    if start > 0:
        excerpt = "..." + excerpt[3:].lstrip()
    if end < len(collapsed):
        excerpt = excerpt[: max_chars - 3].rstrip() + "..."
    return excerpt


def selected_signal_rows(
    signal_rows: Iterable[dict],
    max_medium_concepts: int = MAX_MEDIUM_CONCEPTS,
) -> list[dict]:
    rows = list(signal_rows)
    low_rows = [
        row for row in rows
        if row.get("recommended_action") == LOW_CONFIDENCE_ACTION
    ]
    medium_rows = [
        row for row in rows
        if row.get("recommended_action") == MEDIUM_CONFIDENCE_ACTION
    ][:max_medium_concepts]
    return low_rows + medium_rows


def research_report_context_packet_rows(
    signal_rows: Iterable[dict],
    page_texts: Iterable[dict],
    max_low_confidence_pages: int = MAX_LOW_CONFIDENCE_PAGES,
    max_medium_concepts: int = MAX_MEDIUM_CONCEPTS,
    max_medium_pages: int = MAX_MEDIUM_PAGES,
) -> list[dict]:
    pages_by_number = {
        int(page.get("page_number", 0)): str(page.get("text", ""))
        for page in page_texts
    }
    rows: list[dict] = []
    for signal_row in selected_signal_rows(signal_rows, max_medium_concepts=max_medium_concepts):
        action = str(signal_row.get("recommended_action", ""))
        page_limit = max_low_confidence_pages if action == LOW_CONFIDENCE_ACTION else max_medium_pages
        terms = split_semicolon_values(signal_row.get("matched_terms", ""))
        for page_number in matched_page_numbers(signal_row.get("matched_pages", ""))[:page_limit]:
            page_text = pages_by_number.get(page_number, "")
            matched_term, match_count = best_matched_term(terms, page_text)
            rows.append(
                {
                    "rank": len(rows) + 1,
                    "concept_id": signal_row.get("concept_id", ""),
                    "label_ko": signal_row.get("label_ko", ""),
                    "matched_term": matched_term,
                    "grade": signal_row.get("grade", ""),
                    "domain": signal_row.get("domain", ""),
                    "unit": signal_row.get("unit", ""),
                    "concept_type": signal_row.get("concept_type", ""),
                    "confidence": signal_row.get("confidence", ""),
                    "recommended_action": action,
                    "page_number": page_number,
                    "match_count_on_page": match_count,
                    "context_signal": context_signal(page_text),
                    "context_excerpt": short_excerpt(page_text, matched_term),
                    "review_status": REVIEW_STATUS,
                    "source_candidate_id": SOURCE_CANDIDATE_ID,
                    "source_locator_candidate": f"연구보고서 p. {page_number}",
                    "source_ref_upgrade_allowed": SOURCE_REF_UPGRADE_ALLOWED,
                    "notes": "Short page context for manual review only; do not change source_refs or confidence without source review.",
                }
            )
    return rows


def read_signal_rows(path: Path = signal.RESEARCH_REPORT_SIGNAL_CSV) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def write_csv(rows: list[dict], path: Path = RESEARCH_REPORT_CONTEXT_PACKET_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def render_markdown(rows: list[dict]) -> str:
    action_counts = Counter(str(row.get("recommended_action", "")) for row in rows)
    context_counts = Counter(
        signal_name
        for row in rows
        for signal_name in split_semicolon_values(row.get("context_signal", ""))
    )
    lines = [
        "# Research Report Context Packet",
        "",
        "This generated packet extracts bounded page-level context for high-priority research-report concept signals.",
        "Rows are manual-review candidates only; `source_ref_upgrade_allowed` stays `no` until a source review is completed.",
        "",
        "## Summary",
        "",
        f"- context rows: {len(rows)}",
        "",
        "## Recommended Actions",
        "",
        "| action | context rows |",
        "|---|---:|",
    ]
    for action, count in sorted(action_counts.items()):
        lines.append(f"| {action} | {count} |")

    lines.extend(
        [
            "",
            "## Context Signals",
            "",
            "| signal | rows |",
            "|---|---:|",
        ]
    )
    for signal_name, count in sorted(context_counts.items()):
        lines.append(f"| {signal_name} | {count} |")

    lines.extend(
        [
            "",
            "## Review Rows",
            "",
            "| rank | concept_id | label | page | term | confidence | context_signal | source_ref_upgrade_allowed |",
            "|---:|---|---|---:|---|---|---|---|",
        ]
    )
    for row in rows[:80]:
        lines.append(
            "| {rank} | {concept_id} | {label_ko} | {page_number} | {matched_term} | "
            "{confidence} | {context_signal} | {source_ref_upgrade_allowed} |".format(**row)
        )
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    signal_rows = read_signal_rows()
    page_texts = signal.extract_page_texts()
    rows = research_report_context_packet_rows(signal_rows, page_texts)
    write_csv(rows)
    RESEARCH_REPORT_CONTEXT_PACKET_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote research report context packet with {len(rows)} rows "
        f"to {RESEARCH_REPORT_CONTEXT_PACKET_CSV} and {RESEARCH_REPORT_CONTEXT_PACKET_MD}."
    )


if __name__ == "__main__":
    main()
