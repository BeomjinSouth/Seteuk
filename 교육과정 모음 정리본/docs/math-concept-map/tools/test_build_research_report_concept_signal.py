from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_research_report_concept_signal as signal


class BuildResearchReportConceptSignalTests(unittest.TestCase):
    def test_signal_rows_count_label_and_alias_matches_by_page(self) -> None:
        concepts = [
            {
                "id": "coord",
                "label_ko": "좌표",
                "aliases": ["coordinate"],
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_type": "term",
                "confidence": "high",
                "source_refs": [{"source_id": "curriculum_math_2022"}],
            },
            {
                "id": "axis_point",
                "label_ko": "축 위의 점",
                "aliases": [],
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_type": "sub_concept",
                "confidence": "low",
                "source_refs": [{"source_id": "curriculum_math_2022"}],
            },
            {
                "id": "single_letter",
                "label_ko": "식",
                "aliases": [],
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "문자의 사용과 식",
                "concept_type": "representation",
                "confidence": "high",
                "source_refs": [],
            },
        ]
        pages = [
            {"page_number": 10, "text": "순서쌍과 좌표를 알고 좌표를 그래프로 나타낸다."},
            {"page_number": 12, "text": "coordinate 표현과 축 위의 점을 구분한다."},
            {"page_number": 13, "text": "식"},
        ]

        rows = signal.research_report_signal_rows(concepts, pages)
        by_id = {row["concept_id"]: row for row in rows}

        self.assertEqual(by_id["coord"]["match_count"], 3)
        self.assertEqual(by_id["coord"]["matched_terms"], "coordinate; 좌표")
        self.assertEqual(by_id["coord"]["matched_pages"], "10; 12")
        self.assertEqual(by_id["coord"]["candidate_status"], "research_report_signal")
        self.assertEqual(by_id["coord"]["recommended_action"], "use_as_supplemental_trace_only")
        self.assertEqual(by_id["axis_point"]["match_count"], 1)
        self.assertEqual(by_id["axis_point"]["first_matched_page"], 12)
        self.assertEqual(
            by_id["axis_point"]["recommended_action"],
            "inspect_research_report_context_before_confidence_change",
        )
        self.assertNotIn("single_letter", by_id)

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "concept_id": "coord",
                "label_ko": "좌표",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_type": "term",
                "confidence": "high",
                "source_ref_count": 1,
                "current_sources": "curriculum_math_2022",
                "match_count": 2,
                "matched_terms": "좌표",
                "matched_pages": "10",
                "first_matched_page": 10,
                "candidate_status": "research_report_signal",
                "recommended_action": "use_as_supplemental_trace_only",
                "notes": "Research-report occurrence is a candidate signal, not an automatic source_ref upgrade.",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "research-report-concept-signal.csv"
            signal.write_csv(rows, csv_path)
            markdown = signal.render_markdown(rows)
            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), signal.CSV_FIELDS)
        self.assertIn("# Research Report Concept Signal", markdown)
        self.assertIn("research_report_signal", markdown)


if __name__ == "__main__":
    unittest.main()
