from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_research_report_context_packet as packet


class BuildResearchReportContextPacketTests(unittest.TestCase):
    def test_context_packet_rows_limit_pages_and_classify_context(self) -> None:
        signal_rows = [
            {
                "concept_id": "ratio",
                "label_ko": "비",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "공통 선수개념",
                "concept_type": "term",
                "confidence": "low",
                "match_count": "7",
                "matched_terms": "비율; 비",
                "matched_pages": "10; 11; 12",
                "recommended_action": "inspect_research_report_context_before_confidence_change",
            },
            {
                "concept_id": "figure",
                "label_ko": "도형",
                "grade": "중학교",
                "domain": "도형과 측정",
                "unit": "도형과 측정",
                "concept_type": "core_concept",
                "confidence": "medium",
                "match_count": "5",
                "matched_terms": "도형",
                "matched_pages": "20; 21",
                "recommended_action": "inspect_research_report_context_before_source_ref_upgrade",
            },
            {
                "concept_id": "addition",
                "label_ko": "덧셈",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "정수와 유리수",
                "concept_type": "procedure",
                "confidence": "high",
                "match_count": "4",
                "matched_terms": "덧셈",
                "matched_pages": "30",
                "recommended_action": "use_as_supplemental_trace_only",
            },
        ]
        page_texts = [
            {"page_number": 10, "text": "성취수준 문항에서 비율을 비교하고 채점 기준을 확인한다."},
            {"page_number": 11, "text": "교수 학습 상황에서 비율 표현을 해석한다."},
            {"page_number": 12, "text": "비율을 다시 설명한다."},
            {"page_number": 20, "text": "예시 평가도구 문항은 도형의 성질을 다룬다."},
            {"page_number": 21, "text": "성취수준별 도형 활동을 정리한다."},
            {"page_number": 30, "text": "덧셈을 설명한다."},
        ]

        rows = packet.research_report_context_packet_rows(
            signal_rows,
            page_texts,
            max_low_confidence_pages=2,
            max_medium_concepts=1,
            max_medium_pages=1,
        )

        self.assertEqual([row["rank"] for row in rows], [1, 2, 3])
        self.assertEqual([row["concept_id"] for row in rows], ["ratio", "ratio", "figure"])
        self.assertEqual([row["page_number"] for row in rows], [10, 11, 20])
        self.assertEqual(rows[0]["matched_term"], "비율")
        self.assertIn("achievement_level_context", rows[0]["context_signal"])
        self.assertIn("example_assessment_tool_context", rows[2]["context_signal"])
        self.assertEqual(rows[0]["source_locator_candidate"], "연구보고서 p. 10")
        self.assertEqual(rows[0]["source_ref_upgrade_allowed"], "no")
        self.assertEqual(rows[0]["review_status"], "pending_context_review")
        self.assertLessEqual(len(rows[0]["context_excerpt"]), packet.MAX_CONTEXT_EXCERPT_CHARS)

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "rank": 1,
                "concept_id": "ratio",
                "label_ko": "비",
                "matched_term": "비율",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "공통 선수개념",
                "concept_type": "term",
                "confidence": "low",
                "recommended_action": "inspect_research_report_context_before_confidence_change",
                "page_number": 10,
                "match_count_on_page": 2,
                "context_signal": "achievement_level_context; assessment_context",
                "context_excerpt": "성취수준 문항에서 비율을 비교한다.",
                "review_status": "pending_context_review",
                "source_candidate_id": "achievement_research_report_2022",
                "source_locator_candidate": "연구보고서 p. 10",
                "source_ref_upgrade_allowed": "no",
                "notes": "Short page context for manual review only.",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "research-report-context-packet.csv"
            packet.write_csv(rows, csv_path)
            markdown = packet.render_markdown(rows)
            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), packet.CSV_FIELDS)
        self.assertIn("# Research Report Context Packet", markdown)
        self.assertIn("source_ref_upgrade_allowed", markdown)

    def test_short_excerpt_removes_null_characters(self) -> None:
        excerpt = packet.short_excerpt("성취수준 \x00 비율 설명", "비율")

        self.assertNotIn("\x00", excerpt)
        self.assertIn("비율", excerpt)


if __name__ == "__main__":
    unittest.main()
