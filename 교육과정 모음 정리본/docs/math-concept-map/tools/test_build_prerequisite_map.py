from __future__ import annotations

import unittest

import build_prerequisite_map as prereq


class BuildPrerequisiteMapTests(unittest.TestCase):
    def test_prerequisite_rows_expand_concept_pair_context(self) -> None:
        concepts = [
            {
                "id": "integer",
                "label_ko": "정수",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "정수와 유리수",
            },
            {
                "id": "linear_equation",
                "label_ko": "일차방정식",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "일차방정식",
            },
        ]
        edges = [
            {
                "id": "edge_integer_to_linear_equation",
                "source_id": "integer",
                "target_id": "linear_equation",
                "relationship_type": "prerequisite_for",
                "confidence": "medium",
                "source_refs": [
                    {
                        "source_id": "curriculum_math_2022",
                        "locator": "[9수02-03]",
                        "summary": "일차방정식 풀이에서 수 연산을 사용한다.",
                    }
                ],
                "notes": "수 연산에서 식 풀이로 이어지는 선수 관계",
            },
            {
                "id": "edge_non_prerequisite",
                "source_id": "integer",
                "target_id": "linear_equation",
                "relationship_type": "used_in",
                "confidence": "medium",
                "source_refs": [],
                "notes": "",
            },
        ]

        rows = prereq.prerequisite_rows(concepts, edges)

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["edge_id"], "edge_integer_to_linear_equation")
        self.assertEqual(rows[0]["source_label_ko"], "정수")
        self.assertEqual(rows[0]["target_label_ko"], "일차방정식")
        self.assertEqual(rows[0]["transition_scope"], "cross_domain_same_grade")
        self.assertEqual(rows[0]["source_ref_count"], 1)
        self.assertIn("[9수02-03]", rows[0]["source_refs"])

    def test_transition_scope_prioritizes_unit_grade_and_domain(self) -> None:
        same_unit = {
            "source_grade": "중1",
            "source_domain": "변화와 관계",
            "source_unit": "좌표평면과 그래프",
            "target_grade": "중1",
            "target_domain": "변화와 관계",
            "target_unit": "좌표평면과 그래프",
        }
        cross_unit = dict(same_unit, target_unit="일차함수와 그 그래프")
        cross_domain = dict(cross_unit, target_domain="자료와 가능성")
        cross_grade = dict(cross_unit, target_grade="중2")

        self.assertEqual(prereq.transition_scope(same_unit), "same_unit")
        self.assertEqual(prereq.transition_scope(cross_unit), "cross_unit_same_domain")
        self.assertEqual(prereq.transition_scope(cross_domain), "cross_domain_same_grade")
        self.assertEqual(prereq.transition_scope(cross_grade), "cross_grade_same_domain")

    def test_unit_transition_rows_summarize_concept_pairs(self) -> None:
        rows = [
            {
                "source_grade": "중1",
                "source_domain": "변화와 관계",
                "source_unit": "좌표평면과 그래프",
                "source_label_ko": "좌표평면",
                "target_grade": "중1",
                "target_domain": "변화와 관계",
                "target_unit": "일차함수와 그 그래프",
                "target_label_ko": "일차함수의 그래프",
                "confidence": "high",
                "transition_scope": "cross_unit_same_domain",
            },
            {
                "source_grade": "중1",
                "source_domain": "변화와 관계",
                "source_unit": "좌표평면과 그래프",
                "source_label_ko": "그래프",
                "target_grade": "중1",
                "target_domain": "변화와 관계",
                "target_unit": "일차함수와 그 그래프",
                "target_label_ko": "기울기",
                "confidence": "medium",
                "transition_scope": "cross_unit_same_domain",
            },
        ]

        summary_rows = prereq.unit_transition_rows(rows)

        self.assertEqual(len(summary_rows), 1)
        self.assertEqual(summary_rows[0]["edge_count"], 2)
        self.assertEqual(summary_rows[0]["high_confidence_count"], 1)
        self.assertEqual(summary_rows[0]["medium_confidence_count"], 1)
        self.assertIn("좌표평면 -> 일차함수의 그래프", summary_rows[0]["sample_concept_pairs"])
        self.assertIn("그래프 -> 기울기", summary_rows[0]["sample_concept_pairs"])

    def test_markdown_renders_summary_and_transition_table(self) -> None:
        rows = [
            {
                "edge_id": "edge_coord_to_linear",
                "source_id": "coord",
                "source_label_ko": "좌표평면",
                "source_grade": "중1",
                "source_domain": "변화와 관계",
                "source_unit": "좌표평면과 그래프",
                "target_id": "linear",
                "target_label_ko": "일차함수의 그래프",
                "target_grade": "중1",
                "target_domain": "변화와 관계",
                "target_unit": "일차함수와 그 그래프",
                "transition_scope": "cross_unit_same_domain",
                "confidence": "high",
                "source_ref_count": 2,
                "source_refs": "curriculum_math_2022:[9수02-05]",
                "notes": "",
            }
        ]

        markdown = prereq.render_markdown(rows)

        self.assertIn("# 선수 관계 지도", markdown)
        self.assertIn("- 선수 관계 edge: 1개", markdown)
        self.assertIn("| cross_unit_same_domain | 1 |", markdown)
        self.assertIn("| 중1 | 변화와 관계 | 좌표평면과 그래프 | 중1 | 변화와 관계 | 일차함수와 그 그래프 | 1 |", markdown)


if __name__ == "__main__":
    unittest.main()
