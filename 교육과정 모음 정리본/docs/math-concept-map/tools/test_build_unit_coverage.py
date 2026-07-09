from __future__ import annotations

import unittest

import build_unit_coverage as units


def ref(locator: str, summary: str = "") -> dict:
    return {
        "source_id": "curriculum_math_2022",
        "locator": locator,
        "evidence_kind": "achievement_standard",
        "summary": summary,
    }


class BuildUnitCoverageTests(unittest.TestCase):
    def test_rows_group_concepts_by_grade_domain_unit_and_count_edges(self) -> None:
        concepts = [
            {
                "id": "expr_001",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "문자의 사용과 식",
                "concept_type": "core_concept",
                "confidence": "high",
                "source_refs": [ref("[9수02-01]")],
            },
            {
                "id": "expr_002",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "문자의 사용과 식",
                "concept_type": "term",
                "confidence": "medium",
                "source_refs": [ref("[9수02-02]")],
            },
            {
                "id": "eq_001",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "일차방정식",
                "concept_type": "procedure",
                "confidence": "low",
                "source_refs": [ref("[9수02-03]")],
            },
        ]
        edges = [
            {"source_id": "expr_001", "target_id": "expr_002", "relationship_type": "contains"},
            {"source_id": "expr_002", "target_id": "eq_001", "relationship_type": "prerequisite_for"},
            {"source_id": "eq_001", "target_id": "expr_001", "relationship_type": "used_in"},
        ]

        rows = units.unit_coverage_rows(concepts, edges)
        expr_row = next(row for row in rows if row["unit"] == "문자의 사용과 식")

        self.assertEqual(expr_row["concept_count"], 2)
        self.assertEqual(expr_row["high_confidence_count"], 1)
        self.assertEqual(expr_row["medium_confidence_count"], 1)
        self.assertEqual(expr_row["term_count"], 1)
        self.assertEqual(expr_row["achievement_codes"], "9수02-01; 9수02-02")
        self.assertEqual(expr_row["internal_edge_count"], 1)
        self.assertEqual(expr_row["incoming_edge_count"], 1)
        self.assertEqual(expr_row["outgoing_edge_count"], 1)

    def test_markdown_summarizes_domains_and_units(self) -> None:
        rows = [
            {
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "소인수분해",
                "concept_count": 13,
                "high_confidence_count": 10,
                "medium_confidence_count": 2,
                "low_confidence_count": 1,
                "core_concept_count": 2,
                "sub_concept_count": 3,
                "representation_count": 0,
                "procedure_count": 2,
                "property_count": 1,
                "term_count": 4,
                "misconception_risk_count": 1,
                "achievement_codes": "9수01-01; 9수01-02",
                "internal_edge_count": 15,
                "incoming_edge_count": 0,
                "outgoing_edge_count": 2,
            },
            {
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_count": 40,
                "high_confidence_count": 31,
                "medium_confidence_count": 3,
                "low_confidence_count": 6,
                "core_concept_count": 4,
                "sub_concept_count": 16,
                "representation_count": 8,
                "procedure_count": 4,
                "property_count": 1,
                "term_count": 1,
                "misconception_risk_count": 6,
                "achievement_codes": "9수02-05; 9수02-06; 9수02-07",
                "internal_edge_count": 45,
                "incoming_edge_count": 1,
                "outgoing_edge_count": 3,
            },
        ]

        markdown = units.render_markdown(rows)

        self.assertIn("# 단원별 커버리지", markdown)
        self.assertIn("- 단원 그룹: 2개", markdown)
        self.assertIn("| 변화와 관계 | 1 | 40 | 6 |", markdown)
        self.assertIn("| 중1 | 변화와 관계 | 좌표평면과 그래프 | 40 |", markdown)


if __name__ == "__main__":
    unittest.main()
