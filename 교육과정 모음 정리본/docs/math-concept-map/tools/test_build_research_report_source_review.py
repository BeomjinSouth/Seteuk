from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_research_report_source_review as review


class BuildResearchReportSourceReviewTests(unittest.TestCase):
    def test_source_review_rows_classify_candidate_and_broad_context(self) -> None:
        context_rows = [
            {
                "rank": "1",
                "concept_id": "ratio",
                "label_ko": "비",
                "matched_term": "비율",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "공통 선수개념",
                "concept_type": "term",
                "confidence": "low",
                "recommended_action": "inspect_research_report_context_before_confidence_change",
                "page_number": "180",
                "match_count_on_page": "8",
                "context_signal": "achievement_level_context; curriculum_context",
                "context_excerpt": "비와 비율의 의미와 표현 방법을 종합적으로 이해한다.",
                "source_locator_candidate": "연구보고서 p. 180",
            },
            {
                "rank": "2",
                "concept_id": "figure",
                "label_ko": "도형",
                "matched_term": "도형",
                "grade": "중학교",
                "domain": "도형과 측정",
                "unit": "도형과 측정",
                "concept_type": "core_concept",
                "confidence": "medium",
                "recommended_action": "inspect_research_report_context_before_source_ref_upgrade",
                "page_number": "9",
                "match_count_on_page": "3",
                "context_signal": "achievement_level_context; curriculum_context",
                "context_excerpt": "목차 도형과 측정 영역의 내용 체계 표가 제시된다.",
                "source_locator_candidate": "연구보고서 p. 9",
            },
            {
                "rank": "3",
                "concept_id": "triangle",
                "label_ko": "삼각형",
                "matched_term": "삼각형",
                "grade": "중학교",
                "domain": "도형과 측정",
                "unit": "도형과 측정",
                "concept_type": "core_concept",
                "confidence": "medium",
                "recommended_action": "inspect_research_report_context_before_source_ref_upgrade",
                "page_number": "60",
                "match_count_on_page": "5",
                "context_signal": "achievement_level_context; example_assessment_tool_context; assessment_context",
                "context_excerpt": "예시 평가도구 문항에서 삼각형의 예인 것과 아닌 것을 분류한다.",
                "source_locator_candidate": "연구보고서 p. 60",
            },
        ]

        rows = review.research_report_source_review_rows(
            context_rows,
            applied_source_ref_keys=set(),
            page_text_by_number={},
        )
        by_id = {row["concept_id"]: row for row in rows}

        self.assertEqual(by_id["ratio"]["evidence_candidate_type"], "candidate_prerequisite_evidence")
        self.assertEqual(by_id["ratio"]["source_ref_action"], "candidate_add_after_manual_review")
        self.assertEqual(by_id["ratio"]["source_ref_application_status"], "pending_manual_review")
        self.assertEqual(by_id["ratio"]["confidence_action"], "keep_low_until_textbook_or_middle_course_evidence")
        self.assertEqual(by_id["figure"]["evidence_candidate_type"], "broad_report_context_only")
        self.assertEqual(by_id["figure"]["source_ref_action"], "do_not_add_from_this_row")
        self.assertEqual(by_id["figure"]["source_ref_application_status"], "not_applicable_from_this_row")
        self.assertEqual(by_id["triangle"]["evidence_candidate_type"], "candidate_assessment_item_evidence")
        self.assertEqual(by_id["triangle"]["review_decision"], "manual_review_required")
        self.assertEqual(by_id["triangle"]["source_ref_upgrade_allowed"], "no")

    def test_source_review_marks_matching_research_report_refs_as_applied(self) -> None:
        context_rows = [
            {
                "rank": "1",
                "concept_id": "m1_num_ratio",
                "label_ko": "비",
                "matched_term": "비율",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "공통 선수개념",
                "concept_type": "term",
                "confidence": "low",
                "recommended_action": "inspect_research_report_context_before_confidence_change",
                "page_number": "180",
                "match_count_on_page": "8",
                "context_signal": "achievement_level_context; curriculum_context",
                "context_excerpt": "비와 비율의 의미와 표현 방법을 종합적으로 이해한다.",
                "source_locator_candidate": "연구보고서 p. 180",
            }
        ]

        rows = review.research_report_source_review_rows(
            context_rows,
            applied_source_ref_keys={("m1_num_ratio", "180")},
            page_text_by_number={},
        )
        row = rows[0]

        self.assertEqual(row["review_decision"], "applied_after_manual_review")
        self.assertEqual(row["source_ref_action"], "applied_to_concepts_json")
        self.assertEqual(row["source_ref_application_status"], "applied_after_manual_review")
        self.assertEqual(row["source_ref_upgrade_allowed"], "no")
        self.assertEqual(row["confidence_action"], "keep_low_until_textbook_or_middle_course_evidence")

    def test_source_review_uses_full_page_text_to_reject_broad_content_tables(self) -> None:
        context_rows = [
            {
                "rank": "1",
                "concept_id": "m1_num_addition",
                "label_ko": "덧셈",
                "matched_term": "덧셈",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "정수와 유리수",
                "concept_type": "procedure",
                "confidence": "medium",
                "recommended_action": "inspect_research_report_context_before_source_ref_upgrade",
                "page_number": "26",
                "match_count_on_page": "4",
                "context_signal": "achievement_level_context; teaching_learning_context; curriculum_context",
                "context_excerpt": "정수와 유리수의 덧셈과 뺄셈",
                "source_locator_candidate": "연구보고서 p. 26",
            }
        ]

        rows = review.research_report_source_review_rows(
            context_rows,
            applied_source_ref_keys=set(),
            page_text_by_number={26: "<표 Ⅱ-1-2> 수와 연산 영역 내용 체계"},
        )
        row = rows[0]

        self.assertEqual(row["evidence_candidate_type"], "broad_report_context_only")
        self.assertEqual(row["source_ref_action"], "do_not_add_from_this_row")
        self.assertEqual(row["source_ref_application_status"], "not_applicable_from_this_row")

    def test_source_review_rejects_assessment_reporting_pages(self) -> None:
        context_rows = [
            {
                "rank": "1",
                "concept_id": "m1_data_mean",
                "label_ko": "평균",
                "matched_term": "평균",
                "grade": "중1",
                "domain": "자료와 가능성",
                "unit": "대푯값",
                "concept_type": "core_concept",
                "confidence": "medium",
                "recommended_action": "inspect_research_report_context_before_source_ref_upgrade",
                "page_number": "91",
                "match_count_on_page": "2",
                "context_signal": "achievement_level_context; assessment_context",
                "context_excerpt": "지필평가의 경우 평균, 표준편차, 성취수준별 학생 비율 분포",
                "source_locator_candidate": "연구보고서 p. 91",
            }
        ]

        rows = review.research_report_source_review_rows(
            context_rows,
            applied_source_ref_keys=set(),
            page_text_by_number={
                91: "성취 결과 산출 및 보고의 근거로 활용 지필평가의 경우 평균, 표준편차, 문항 정답률, 문항 변별도 등을 분석한다.",
            },
        )
        row = rows[0]

        self.assertEqual(row["evidence_candidate_type"], "broad_report_context_only")
        self.assertEqual(row["source_ref_action"], "do_not_add_from_this_row")
        self.assertEqual(row["source_ref_application_status"], "not_applicable_from_this_row")

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "rank": 1,
                "context_packet_rank": "1",
                "concept_id": "ratio",
                "label_ko": "비",
                "matched_term": "비율",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "공통 선수개념",
                "confidence": "low",
                "page_number": "180",
                "source_locator_candidate": "연구보고서 p. 180",
                "context_signal": "achievement_level_context; curriculum_context",
                "evidence_candidate_type": "candidate_prerequisite_evidence",
                "review_decision": "manual_review_required",
                "review_priority": "high",
                "source_ref_action": "candidate_add_after_manual_review",
                "source_ref_application_status": "pending_manual_review",
                "confidence_action": "keep_low_until_textbook_or_middle_course_evidence",
                "source_ref_upgrade_allowed": "no",
                "review_reason": "Low-confidence prerequisite concept has direct ratio context.",
                "notes": "Review source page before changing concepts.json.",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "research-report-source-review.csv"
            review.write_csv(rows, csv_path)
            markdown = review.render_markdown(rows)
            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), review.CSV_FIELDS)
        self.assertIn("# Research Report Source Review", markdown)
        self.assertIn("candidate_prerequisite_evidence", markdown)


if __name__ == "__main__":
    unittest.main()
