from __future__ import annotations

import unittest

import build_coverage_report as report


def ref(locator: str, summary: str = "") -> dict:
    return {
        "source_id": "curriculum_math_2022",
        "locator": locator,
        "evidence_kind": "achievement_standard",
        "summary": summary,
    }


class BuildCoverageReportTests(unittest.TestCase):
    def test_rows_expand_range_refs_and_count_confidence(self) -> None:
        concepts = [
            {
                "id": "data_004",
                "label_ko": "중앙값",
                "domain": "자료와 가능성",
                "unit": "대푯값",
                "confidence": "high",
                "source_refs": [ref("성취기준 [9수04-01]")],
            },
            {
                "id": "data_022",
                "label_ko": "상대도수",
                "domain": "자료와 가능성",
                "unit": "상대도수",
                "confidence": "medium",
                "source_refs": [ref("성취기준 [9수04-02]~[9수04-04]")],
            },
        ]

        rows = report.achievement_coverage_rows(
            concepts,
            expected_codes=("9수04-01", "9수04-02", "9수04-03", "9수04-04"),
        )

        self.assertEqual([row["achievement_code"] for row in rows], ["9수04-01", "9수04-02", "9수04-03", "9수04-04"])
        self.assertEqual(rows[0]["concept_count"], 1)
        self.assertEqual(rows[0]["high_confidence_count"], 1)
        self.assertEqual(rows[0]["concept_ids"], "data_004")
        self.assertEqual(rows[1]["concept_count"], 1)
        self.assertEqual(rows[1]["medium_confidence_count"], 1)
        self.assertEqual(rows[2]["concept_ids"], "data_022")
        self.assertEqual(rows[3]["concept_labels"], "상대도수")

    def test_markdown_summarizes_total_and_domain_counts(self) -> None:
        rows = [
            {
                "achievement_code": "9수04-01",
                "domain": "자료와 가능성",
                "concept_count": 2,
                "high_confidence_count": 1,
                "medium_confidence_count": 1,
                "low_confidence_count": 0,
                "concept_ids": "data_001; data_002",
                "concept_labels": "자료; 대푯값",
            },
            {
                "achievement_code": "9수04-02",
                "domain": "자료와 가능성",
                "concept_count": 1,
                "high_confidence_count": 1,
                "medium_confidence_count": 0,
                "low_confidence_count": 0,
                "concept_ids": "data_003",
                "concept_labels": "도수분포표",
            },
        ]

        markdown = report.render_markdown(rows)

        self.assertIn("# 성취기준 커버리지", markdown)
        self.assertIn("- 커버된 성취기준: 2 / 2", markdown)
        self.assertIn("| 자료와 가능성 | 2 | 3 |", markdown)
        self.assertIn("| 9수04-01 | 자료와 가능성 | 2 |", markdown)


if __name__ == "__main__":
    unittest.main()
