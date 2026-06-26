from __future__ import annotations

import unittest

import build_terminology_coverage as terms


class BuildTerminologyCoverageTests(unittest.TestCase):
    def test_rows_match_terms_by_label_or_alias_and_keep_exclusions(self) -> None:
        concepts = [
            {
                "id": "num_001",
                "label_ko": "근호",
                "aliases": ["√", "근호 기호"],
                "domain": "수와 연산",
                "unit": "제곱근과 실수",
            },
            {
                "id": "rel_001",
                "label_ko": "좌표",
                "aliases": [],
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
            },
        ]
        official_terms = [
            terms.official_term("근호 기호", "수와 연산", "용어·기호"),
            terms.official_term("좌표", "변화와 관계", "용어·기호"),
            terms.official_term("가정", "도형과 측정", "제외 용어", "excluded_by_curriculum_scope"),
            terms.official_term("미등록 용어", "자료와 가능성", "테스트"),
        ]

        rows = terms.terminology_coverage_rows(concepts, official_terms)

        self.assertEqual(rows[0]["coverage_status"], "covered_by_alias")
        self.assertEqual(rows[0]["concept_ids"], "num_001")
        self.assertEqual(rows[1]["coverage_status"], "covered")
        self.assertEqual(rows[1]["concept_labels"], "좌표")
        self.assertEqual(rows[2]["coverage_status"], "excluded_by_curriculum_scope")
        self.assertEqual(rows[2]["concept_count"], 0)
        self.assertEqual(rows[3]["coverage_status"], "needs_concept")

    def test_markdown_summarizes_status_and_domain_counts(self) -> None:
        rows = [
            {
                "term": "소수",
                "domain": "수와 연산",
                "source_locator": "용어·기호",
                "coverage_status": "covered",
                "concept_count": 1,
                "concept_ids": "num_001",
                "concept_labels": "소수",
                "notes": "",
            },
            {
                "term": "미등록 용어",
                "domain": "변화와 관계",
                "source_locator": "용어·기호",
                "coverage_status": "needs_concept",
                "concept_count": 0,
                "concept_ids": "",
                "concept_labels": "",
                "notes": "",
            },
        ]

        markdown = terms.render_markdown(rows)

        self.assertIn("# 공식 용어·기호 커버리지", markdown)
        self.assertIn("- 공식 용어·기호 항목: 2개", markdown)
        self.assertIn("| covered | 1 |", markdown)
        self.assertIn("| 변화와 관계 | 1 | 0 | 0 | 1 | 0 |", markdown)
        self.assertIn("| 미등록 용어 | 변화와 관계 | needs_concept |", markdown)


if __name__ == "__main__":
    unittest.main()
