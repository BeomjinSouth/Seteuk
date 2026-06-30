from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class FactorProcedureMicroconceptTests(unittest.TestCase):
    def test_factor_procedure_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_factor_expanded_form": ("전개식", "representation", "medium"),
            "m1_factor_polynomial_product_expansion": ("다항식의 곱 전개하기", "procedure", "high"),
            "m1_factor_formula_selection": ("곱셈·인수분해 공식 선택하기", "procedure", "medium"),
            "m1_factor_common_factor_extraction": ("공통인수로 묶기", "procedure", "medium"),
            "m1_factor_formula_based_factorization": ("공식을 이용한 인수분해", "procedure", "medium"),
            "m1_factor_sum_product_pair_search": ("합과 곱이 맞는 수 찾기", "procedure", "medium"),
            "m1_factor_cross_term_coefficient_check": ("교차항 계수 확인하기", "procedure", "medium"),
            "m1_factor_perfect_square_middle_term_check": ("완전제곱식의 가운데 항 확인하기", "procedure", "medium"),
            "m1_factor_factorization_result_check": ("인수분해 결과 전개로 확인하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertEqual("다항식의 곱셈과 인수분해", concept["unit"])
            self.assertIn("[9수02-19]", source_locators(concept))

        self.assertIn("m1_factor_polynomial_multiplication", concepts["m1_factor_expanded_form"]["parent_ids"])
        self.assertIn("m1_factor_polynomial_multiplication", concepts["m1_factor_polynomial_product_expansion"]["parent_ids"])
        self.assertIn("m1_factor_formula_scope", concepts["m1_factor_formula_selection"]["parent_ids"])
        self.assertIn("m1_factor_factorization", concepts["m1_factor_common_factor_extraction"]["parent_ids"])
        self.assertIn("m1_factor_quadratic_factorization", concepts["m1_factor_formula_based_factorization"]["parent_ids"])
        self.assertIn("m1_factor_binomial_product_xab", concepts["m1_factor_sum_product_pair_search"]["parent_ids"])
        self.assertIn("m1_factor_linear_product_axb_cxd", concepts["m1_factor_cross_term_coefficient_check"]["parent_ids"])
        self.assertIn("m1_factor_perfect_square_expression", concepts["m1_factor_perfect_square_middle_term_check"]["parent_ids"])
        self.assertIn("m1_factor_expansion_factorization_inverse", concepts["m1_factor_factorization_result_check"]["prerequisite_ids"])

    def test_factor_procedure_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_factor_polynomial_multiplication__contains__m1_factor_expanded_form",
            "m1_factor_polynomial_multiplication__contains__m1_factor_polynomial_product_expansion",
            "m1_factor_formula_scope__contains__m1_factor_formula_selection",
            "m1_factor_factorization__contains__m1_factor_common_factor_extraction",
            "m1_factor_quadratic_factorization__contains__m1_factor_formula_based_factorization",
            "m1_factor_binomial_product_xab__contains__m1_factor_sum_product_pair_search",
            "m1_factor_linear_product_axb_cxd__contains__m1_factor_cross_term_coefficient_check",
            "m1_factor_perfect_square_expression__contains__m1_factor_perfect_square_middle_term_check",
            "m1_factor_factorization__contains__m1_factor_factorization_result_check",
            "m1_factor_polynomial_multiplication__represented_by__m1_factor_expanded_form",
            "m1_calc_expansion__used_in__m1_factor_polynomial_product_expansion",
            "m1_factor_polynomial_product_expansion__used_in__m1_factor_polynomial_multiplication",
            "m1_factor_formula_selection__used_in__m1_factor_polynomial_multiplication",
            "m1_factor_formula_selection__used_in__m1_factor_factorization",
            "m1_factor_formula_selection__used_in__m1_factor_formula_based_factorization",
            "m1_factor_common_factor__used_in__m1_factor_common_factor_extraction",
            "m1_factor_common_factor_extraction__used_in__m1_factor_factorization",
            "m1_factor_formula_based_factorization__used_in__m1_factor_quadratic_factorization",
            "m1_factor_sum_product_pair_search__used_in__m1_factor_quadratic_factorization",
            "m1_factor_cross_term_coefficient_check__used_in__m1_factor_quadratic_factorization",
            "m1_factor_perfect_square_middle_term_check__used_in__m1_factor_quadratic_factorization",
            "m1_factor_factorization_result_check__used_in__m1_factor_expansion_factorization_inverse",
            "m1_factor_sum_product_pair_search__contrasts_with__m1_factor_cross_term_coefficient_check",
        ]
        for edge_id in expected_edges:
            if edge_id not in edges:
                self.fail(f"Missing edge: {edge_id}")

    def test_factor_result_check_misconception_stays_low_confidence(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        concept = concepts["m1_mis_factorization_unchecked_result"]
        self.assertEqual("인수분해 결과를 확인하지 않는 오류", concept["label_ko"])
        self.assertEqual("misconception_risk", concept["concept_type"])
        self.assertEqual("low", concept["confidence"])
        self.assertEqual([], concept["prerequisite_ids"])
        self.assertIn("교과서", concept["notes"])

        expected_edge = "m1_mis_factorization_unchecked_result__often_confused_with__m1_factor_factorization_result_check"
        if expected_edge not in edges:
            self.fail(f"Missing edge: {expected_edge}")
        self.assertNotIn(
            "m1_factor_factorization_result_check__prerequisite_for__m1_mis_factorization_unchecked_result",
            edges,
        )

    def test_factor_scope_metadata_does_not_create_noisy_prerequisites(self) -> None:
        edges = edges_by_id()

        noisy_prereq_edges = [
            "m1_expr_like_terms__prerequisite_for__m1_factor_common_factor",
            "m1_factor_polynomial_multiplication__prerequisite_for__m1_factor_formula_scope",
            "m1_factor_factorization__prerequisite_for__m1_factor_formula_scope",
            "m1_factor_formula_scope__prerequisite_for__m1_factor_polynomial_product_expansion",
            "m1_factor_formula_scope__prerequisite_for__m1_factor_perfect_square_expression",
            "m1_factor_formula_scope__prerequisite_for__m1_factor_formula_selection",
            "m1_factor_formula_scope__prerequisite_for__m1_factor_common_factor_formula",
            "m1_factor_formula_scope__prerequisite_for__m1_factor_square_sum_formula",
            "m1_factor_formula_scope__prerequisite_for__m1_factor_square_difference_formula",
            "m1_factor_formula_scope__prerequisite_for__m1_factor_sum_difference_product_formula",
            "m1_factor_formula_scope__prerequisite_for__m1_factor_binomial_product_xab",
            "m1_factor_formula_scope__prerequisite_for__m1_factor_linear_product_axb_cxd",
            "m1_factor_formula_scope__prerequisite_for__m1_factor_quadratic_factorization",
            "m1_factor_formula_scope__prerequisite_for__m1_factor_formula_based_factorization",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

        expected_contrasts = [
            "m1_calc_expansion__contrasts_with__m1_factor_factorization",
            "m1_factor_common_factor__contrasts_with__m1_expr_like_terms",
            "m1_factor_binomial_product_xab__contrasts_with__m1_factor_linear_product_axb_cxd",
        ]
        for edge_id in expected_contrasts:
            if edge_id not in edges:
                self.fail(f"Missing edge: {edge_id}")


if __name__ == "__main__":
    unittest.main()
