from __future__ import annotations

import unittest

import build_review_queue as queue


class BuildReviewQueueTests(unittest.TestCase):
    def test_rows_keep_only_low_confidence_concepts_with_review_reason(self) -> None:
        concepts = [
            {
                "id": "coord_001",
                "label_ko": "좌표평면",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_type": "core_concept",
                "confidence": "high",
                "notes": "",
                "source_refs": [],
            },
            {
                "id": "coord_mis_001",
                "label_ko": "순서쌍의 순서 혼동",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_type": "misconception_risk",
                "confidence": "low",
                "notes": "교과서 예제와 오답 근거 확인 필요.",
                "source_refs": [
                    {
                        "source_id": "achievement_math_2022",
                        "locator": "성취기준 [9수02-05]",
                        "summary": "좌표를 점으로 나타내기",
                    }
                ],
            },
        ]

        rows = queue.review_queue_rows(concepts)

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["concept_id"], "coord_mis_001")
        self.assertEqual(rows[0]["review_priority"], "textbook_evidence_needed")
        self.assertEqual(rows[0]["source_refs"], "achievement_math_2022: 성취기준 [9수02-05]")

    def test_markdown_summarizes_domain_and_type_counts(self) -> None:
        rows = [
            {
                "concept_id": "num_mis_001",
                "label_ko": "1을 소수나 합성수로 보는 오류",
                "domain": "수와 연산",
                "unit": "소인수분해",
                "concept_type": "misconception_risk",
                "confidence": "low",
                "review_priority": "textbook_evidence_needed",
                "notes": "교과서 확인 필요.",
                "source_refs": "curriculum_math_2022: [9수01-01]",
            },
            {
                "concept_id": "shape_001",
                "label_ko": "정당화",
                "domain": "도형과 측정",
                "unit": "삼각형과 사각형의 성질",
                "concept_type": "sub_concept",
                "confidence": "low",
                "review_priority": "source_detail_needed",
                "notes": "공식 문서 기반 잠정 분리.",
                "source_refs": "curriculum_math_2022: [9수03-10]",
            },
        ]

        markdown = queue.render_markdown(rows)

        self.assertIn("# 검토 큐", markdown)
        self.assertIn("- 검토 대상 concept: 2개", markdown)
        self.assertIn("| 수와 연산 | 1 |", markdown)
        self.assertIn("| misconception_risk | 1 |", markdown)
        self.assertIn("| num_mis_001 | 수와 연산 | 소인수분해 |", markdown)


if __name__ == "__main__":
    unittest.main()
