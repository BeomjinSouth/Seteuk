from __future__ import annotations

import csv
import json
import re
from collections import Counter
from pathlib import Path
from typing import Iterable

import pdfplumber


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
RESEARCH_REPORT_PDF = (
    ROOT
    / "2022_개정_중학교_성취수준_PDF"
    / "연구보고서"
    / "02_수학_성취수준_개발_연구보고서.pdf"
)
RESEARCH_REPORT_SIGNAL_CSV = OUT_DIR / "research-report-concept-signal.csv"
RESEARCH_REPORT_SIGNAL_MD = OUT_DIR / "research-report-concept-signal.md"

CSV_FIELDS = [
    "concept_id",
    "label_ko",
    "grade",
    "domain",
    "unit",
    "concept_type",
    "confidence",
    "source_ref_count",
    "current_sources",
    "match_count",
    "matched_terms",
    "matched_pages",
    "first_matched_page",
    "candidate_status",
    "recommended_action",
    "notes",
]

WHITESPACE_RE = re.compile(r"\s+")
MIN_TERM_LENGTH = 2
MAX_PAGE_LIST = 24


def normalize_text(value: object) -> str:
    return WHITESPACE_RE.sub("", str(value or "")).casefold()


def read_concepts(path: Path = CONCEPTS_JSON) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return list(data.get("concepts", []))


def extract_page_texts(path: Path = RESEARCH_REPORT_PDF) -> list[dict]:
    pages: list[dict] = []
    with pdfplumber.open(path) as pdf:
        for index, page in enumerate(pdf.pages, start=1):
            pages.append({"page_number": index, "text": page.extract_text(x_tolerance=1, y_tolerance=3) or ""})
    return pages


def candidate_terms(concept: dict) -> list[str]:
    terms = [concept.get("label_ko", "")]
    terms.extend(concept.get("aliases", []) or [])
    unique_terms: list[str] = []
    seen: set[str] = set()
    for term in terms:
        normalized = normalize_text(term)
        if len(normalized) < MIN_TERM_LENGTH or normalized in seen:
            continue
        seen.add(normalized)
        unique_terms.append(str(term))
    return unique_terms


def current_sources(concept: dict) -> str:
    return "; ".join(
        sorted(
            {
                str(ref.get("source_id", ""))
                for ref in concept.get("source_refs", [])
                if str(ref.get("source_id", "")).strip()
            }
        )
    )


def recommended_action(concept: dict) -> str:
    confidence = concept.get("confidence", "")
    if confidence == "low":
        return "inspect_research_report_context_before_confidence_change"
    if confidence == "medium":
        return "inspect_research_report_context_before_source_ref_upgrade"
    return "use_as_supplemental_trace_only"


def research_report_signal_rows(concepts: Iterable[dict], page_texts: Iterable[dict]) -> list[dict]:
    normalized_pages = [
        (int(page.get("page_number", 0)), normalize_text(page.get("text", "")))
        for page in page_texts
    ]
    rows: list[dict] = []
    for concept in concepts:
        term_hits: Counter[str] = Counter()
        page_hits: Counter[int] = Counter()
        for term in candidate_terms(concept):
            normalized_term = normalize_text(term)
            for page_number, normalized_page in normalized_pages:
                count = normalized_page.count(normalized_term)
                if count <= 0:
                    continue
                term_hits[str(term)] += count
                page_hits[page_number] += count

        if not page_hits:
            continue

        pages = sorted(page_hits)
        matched_terms = sorted(term_hits)
        rows.append(
            {
                "concept_id": concept.get("id", ""),
                "label_ko": concept.get("label_ko", ""),
                "grade": concept.get("grade", ""),
                "domain": concept.get("domain", ""),
                "unit": concept.get("unit", ""),
                "concept_type": concept.get("concept_type", ""),
                "confidence": concept.get("confidence", ""),
                "source_ref_count": len(concept.get("source_refs", [])),
                "current_sources": current_sources(concept),
                "match_count": sum(page_hits.values()),
                "matched_terms": "; ".join(matched_terms),
                "matched_pages": "; ".join(str(page) for page in pages[:MAX_PAGE_LIST]),
                "first_matched_page": pages[0],
                "candidate_status": "research_report_signal",
                "recommended_action": recommended_action(concept),
                "notes": "Research-report occurrence is a candidate signal, not an automatic source_ref upgrade.",
            }
        )

    action_order = {
        "inspect_research_report_context_before_confidence_change": 0,
        "inspect_research_report_context_before_source_ref_upgrade": 1,
        "use_as_supplemental_trace_only": 2,
    }
    rows.sort(
        key=lambda row: (
            action_order.get(str(row.get("recommended_action", "")), 99),
            -int(row.get("match_count", 0)),
            str(row.get("domain", "")),
            str(row.get("unit", "")),
            str(row.get("label_ko", "")),
        )
    )
    return rows


def render_markdown(rows: list[dict]) -> str:
    action_counts = Counter(str(row.get("recommended_action", "")) for row in rows)
    confidence_counts = Counter(str(row.get("confidence", "")) for row in rows)
    lines = [
        "# Research Report Concept Signal",
        "",
        "This generated audit scans the KICE math achievement-level research report for current concept labels and aliases.",
        "Rows are candidate signals only; inspect the local page context before changing concept confidence or source_refs.",
        "",
        "## Summary",
        "",
        f"- matched concepts: {len(rows)}",
        "",
        "## Confidence",
        "",
        "| confidence | matched concepts |",
        "|---|---:|",
    ]
    for confidence, count in sorted(confidence_counts.items()):
        lines.append(f"| {confidence} | {count} |")

    lines.extend(
        [
            "",
            "## Recommended Actions",
            "",
            "| action | matched concepts |",
            "|---|---:|",
        ]
    )
    for action, count in sorted(action_counts.items()):
        lines.append(f"| {action} | {count} |")

    lines.extend(
        [
            "",
            "## Highest Priority Signals",
            "",
            "| concept_id | label | unit | confidence | matches | pages | status | action |",
            "|---|---|---|---|---:|---|---|---|",
        ]
    )
    for row in rows[:80]:
        lines.append(
            "| {concept_id} | {label_ko} | {unit} | {confidence} | {match_count} | "
            "{matched_pages} | {candidate_status} | {recommended_action} |".format(**row)
        )
    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = RESEARCH_REPORT_SIGNAL_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    concepts = read_concepts()
    page_texts = extract_page_texts()
    rows = research_report_signal_rows(concepts, page_texts)
    write_csv(rows)
    RESEARCH_REPORT_SIGNAL_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(
        f"Wrote research report concept signal with {len(rows)} rows "
        f"to {RESEARCH_REPORT_SIGNAL_CSV} and {RESEARCH_REPORT_SIGNAL_MD}."
    )


if __name__ == "__main__":
    main()
