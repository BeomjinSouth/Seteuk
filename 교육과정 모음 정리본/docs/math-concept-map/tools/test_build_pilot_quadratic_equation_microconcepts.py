from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class QuadraticEquationMicroconceptTests(unittest.TestCase):
    def test_quadratic_equation_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_quad_eq_leading_coefficient_one_case": ("이차항의 계수가 1인 이차방정식", "sub_concept", "high"),
            "m1_quad_eq_coefficients_in_standard_form": ("이차방정식의 계수", "term", "medium"),
            "m1_quad_eq_factorized_form": ("이차방정식의 인수분해된 식 표현", "representation", "medium"),
            "m1_quad_eq_zero_product_condition": ("각 인수가 0이 되는 조건", "property", "low"),
            "m1_quad_eq_process_explanation": ("이차방정식 풀이 과정 설명하기", "procedure", "high"),
            "m1_quad_eq_set_up_from_context": ("문제 상황을 이차방정식으로 나타내기", "procedure", "high"),
            "m1_quad_eq_context_solution_check": ("해가 문제 상황에 적합한지 확인하기", "procedure", "high"),
            "m1_quad_eq_root_formula_substitution": ("근의 공식에 계수 대입하기", "procedure", "low"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn("이차방정식", concept["unit"])

        for concept_id in [
            "m1_quad_eq_leading_coefficient_one_case",
            "m1_quad_eq_process_explanation",
            "m1_quad_eq_set_up_from_context",
        ]:
            self.assertIn("p. 220", source_locators(concepts[concept_id]))

    def test_quadratic_equation_microconcepts_have_expected_structure(self) -> None:
        concepts = concepts_by_id()

        self.assertIn("m1_quad_eq_quadratic_term", concepts["m1_quad_eq_leading_coefficient_one_case"]["prerequisite_ids"])
        self.assertIn("m1_expr_coefficient", concepts["m1_quad_eq_leading_coefficient_one_case"]["prerequisite_ids"])
        self.assertIn("m1_quad_eq_standard_form", concepts["m1_quad_eq_coefficients_in_standard_form"]["parent_ids"])
        self.assertIn("m1_factor_quadratic_factorization", concepts["m1_quad_eq_factorized_form"]["prerequisite_ids"])
        self.assertIn("m1_factor_factorization", concepts["m1_quad_eq_zero_product_condition"]["prerequisite_ids"])
        self.assertIn("m1_quad_eq_solution", concepts["m1_quad_eq_process_explanation"]["prerequisite_ids"])
        self.assertIn("m1_quad_eq_modeling", concepts["m1_quad_eq_set_up_from_context"]["parent_ids"])
        self.assertIn("m1_eq_solution_check", concepts["m1_quad_eq_context_solution_check"]["prerequisite_ids"])
        self.assertIn("m1_quad_eq_coefficients_in_standard_form", concepts["m1_quad_eq_root_formula_substitution"]["prerequisite_ids"])

    def test_quadratic_equation_edges_are_semantically_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_quad_eq_unit__contains__m1_quad_eq_leading_coefficient_one_case",
            "m1_quad_eq_standard_form__contains__m1_quad_eq_coefficients_in_standard_form",
            "m1_quad_eq_factorization_solving__contains__m1_quad_eq_factorized_form",
            "m1_quad_eq_factorization_solving__contains__m1_quad_eq_zero_product_condition",
            "m1_quad_eq_solving__contains__m1_quad_eq_process_explanation",
            "m1_quad_eq_modeling__contains__m1_quad_eq_set_up_from_context",
            "m1_quad_eq_modeling__contains__m1_quad_eq_context_solution_check",
            "m1_quad_eq_root_formula__contains__m1_quad_eq_root_formula_substitution",
            "m1_quad_eq_quadratic_equation__represented_by__m1_quad_eq_standard_form",
            "m1_factor_quadratic_expression__contrasts_with__m1_quad_eq_quadratic_equation",
            "m1_eq_solution_check__used_in__m1_quad_eq_modeling",
            "m1_quad_eq_solution__contains__m1_quad_eq_double_root",
            "m1_factor_linear_product_axb_cxd__used_in__m1_quad_eq_factorization_solving",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

        noisy_edges = [
            "m1_quad_eq_root_formula__prerequisite_for__m1_mis_root_coefficient_relation_scope",
            "m1_quad_eq_unit__contains__m1_factor_quadratic_expression",
            "m1_quad_eq_double_root__contains__m1_quad_eq_solution",
            "m1_factor_quadratic_expression__represented_by__m1_quad_eq_standard_form",
            "m1_quad_eq_solving__used_in__m1_eq_solution_check",
            "m1_mis_root_coefficient_relation_scope__often_confused_with__m1_quad_eq_real_solution_scope",
        ]
        for edge_id in noisy_edges:
            self.assertNotIn(edge_id, edges)

    def test_quadratic_equation_misconceptions_stay_low_confidence_without_prerequisites(self) -> None:
        concepts = concepts_by_id()

        for concept_id in [
            "m1_mis_quadratic_expression_equation",
            "m1_mis_quadratic_factorization_solution",
            "m1_mis_root_coefficient_relation_scope",
        ]:
            concept = concepts[concept_id]
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])

    def test_research_report_ref_is_scoped_to_direct_quadratic_equation_evidence(self) -> None:
        concepts = concepts_by_id()

        direct_ref_concepts = [
            "m1_quad_eq_unit",
            "m1_quad_eq_quadratic_equation",
            "m1_quad_eq_quadratic_term",
            "m1_quad_eq_solving",
            "m1_quad_eq_modeling",
            "m1_quad_eq_leading_coefficient_one_case",
            "m1_quad_eq_process_explanation",
            "m1_quad_eq_set_up_from_context",
        ]
        for concept_id in direct_ref_concepts:
            self.assertIn("p. 220", source_locators(concepts[concept_id]))

        for concept_id in [
            "m1_quad_eq_root_formula",
            "m1_quad_eq_double_root",
            "m1_quad_eq_real_solution_scope",
            "m1_mis_root_coefficient_relation_scope",
            "m1_mis_quadratic_expression_equation",
            "m1_mis_quadratic_factorization_solution",
        ]:
            self.assertNotIn("p. 220", source_locators(concepts[concept_id]))


if __name__ == "__main__":
    unittest.main()
