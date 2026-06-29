from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class ExpressionMicroconceptTests(unittest.TestCase):
    def test_literal_expression_microprocedures_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_expr_quantity_relationship": ("상황 속 수량 관계", "sub_concept", "medium"),
            "m1_expr_letter_quantity": ("문자가 나타내는 수량 정하기", "procedure", "medium"),
            "m1_expr_situation_to_literal_expression": ("상황을 문자를 사용한 식으로 나타내기", "procedure", "high"),
            "m1_expr_evaluate_expression_value": ("식의 값 구하기", "procedure", "high"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn("m1_expr_unit", concept["parent_ids"])
            self.assertIn("p. 214", source_locators(concept))

        self.assertIn("m1_expr_letter", concepts["m1_expr_letter_quantity"]["prerequisite_ids"])
        self.assertIn("m1_expr_quantity_relationship", concepts["m1_expr_letter_quantity"]["prerequisite_ids"])
        self.assertIn("m1_expr_letter_quantity", concepts["m1_expr_situation_to_literal_expression"]["prerequisite_ids"])
        self.assertIn("m1_repr_everyday_language", concepts["m1_expr_situation_to_literal_expression"]["prerequisite_ids"])
        self.assertIn("m1_expr_substitution", concepts["m1_expr_evaluate_expression_value"]["prerequisite_ids"])
        self.assertIn("m1_num_four_operations", concepts["m1_expr_evaluate_expression_value"]["prerequisite_ids"])

    def test_linear_expression_calculation_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        principle = concepts["m1_expr_linear_expression_add_sub_principle"]
        explanation = concepts["m1_expr_explain_linear_expression_calculation"]

        self.assertEqual("일차식의 덧셈과 뺄셈 원리", principle["label_ko"])
        self.assertEqual("property", principle["concept_type"])
        self.assertEqual("high", principle["confidence"])
        self.assertIn("m1_expr_unit", principle["parent_ids"])
        self.assertIn("m1_expr_linear_expression", principle["prerequisite_ids"])
        self.assertIn("m1_expr_like_terms", principle["prerequisite_ids"])
        self.assertIn("p. 214", source_locators(principle))

        self.assertEqual("일차식 계산 과정 설명하기", explanation["label_ko"])
        self.assertEqual("procedure", explanation["concept_type"])
        self.assertEqual("medium", explanation["confidence"])
        self.assertIn("m1_expr_add_sub_linear_expression", explanation["prerequisite_ids"])
        self.assertIn("m1_expr_linear_expression_add_sub_principle", explanation["prerequisite_ids"])
        self.assertIn("p. 214", source_locators(explanation))

    def test_expression_edges_are_directional_and_less_noisy(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_expr_quantity_relationship__used_in__m1_expr_letter_quantity",
            "m1_expr_letter__used_in__m1_expr_letter_quantity",
            "m1_expr_letter_quantity__used_in__m1_expr_situation_to_literal_expression",
            "m1_repr_everyday_language__used_in__m1_expr_situation_to_literal_expression",
            "m1_expr_situation_to_literal_expression__used_in__m1_expr_literal_expression",
            "m1_expr_literal_expression__used_in__m1_expr_evaluate_expression_value",
            "m1_expr_substitution__used_in__m1_expr_evaluate_expression_value",
            "m1_num_four_operations__used_in__m1_expr_evaluate_expression_value",
            "m1_expr_evaluate_expression_value__used_in__m1_expr_value",
            "m1_expr_linear_expression_add_sub_principle__used_in__m1_expr_add_sub_linear_expression",
            "m1_expr_add_sub_linear_expression__used_in__m1_expr_explain_linear_expression_calculation",
            "m1_expr_linear_expression_add_sub_principle__used_in__m1_expr_explain_linear_expression_calculation",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

        noisy_prereq_edges = [
            "m1_expr_letter__prerequisite_for__m1_mis_letter_as_label_only",
            "m1_expr_like_terms__prerequisite_for__m1_mis_like_terms",
            "m1_expr_coefficient__prerequisite_for__m1_mis_coefficient_constant_degree",
            "m1_expr_constant_term__prerequisite_for__m1_mis_coefficient_constant_degree",
            "m1_expr_degree__prerequisite_for__m1_mis_coefficient_constant_degree",
            "m1_expr_like_terms__prerequisite_for__m1_mis_polynomial_like_terms",
            "m1_calc_polynomial_add_sub__prerequisite_for__m1_mis_polynomial_like_terms",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

    def test_research_report_ref_is_supplemental_without_confidence_upgrade(self) -> None:
        concepts = concepts_by_id()

        self.assertIn("p. 214", source_locators(concepts["m1_expr_literal_expression"]))
        self.assertIn("p. 214", source_locators(concepts["m1_expr_value"]))
        self.assertIn("p. 214", source_locators(concepts["m1_expr_add_sub_linear_expression"]))

        self.assertEqual("low", concepts["m1_mis_letter_as_label_only"]["confidence"])
        self.assertEqual("low", concepts["m1_mis_like_terms"]["confidence"])
        self.assertEqual("low", concepts["m1_mis_coefficient_constant_degree"]["confidence"])
        self.assertNotIn("p. 214", source_locators(concepts["m1_mis_letter_as_label_only"]))


if __name__ == "__main__":
    unittest.main()
