from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class FactorMicroconceptTests(unittest.TestCase):
    def test_common_factor_formula_and_quadratic_factorization_are_explicit(self) -> None:
        concepts = concepts_by_id()

        common_factor_formula = concepts["m1_factor_common_factor_formula"]
        self.assertEqual("m(a+b) 공식", common_factor_formula["label_ko"])
        self.assertEqual("property", common_factor_formula["concept_type"])
        self.assertEqual("high", common_factor_formula["confidence"])
        self.assertIn("m1_factor_formula_scope", common_factor_formula["parent_ids"])
        self.assertIn("m1_factor_common_factor", common_factor_formula["prerequisite_ids"])
        self.assertIn("m1_num_distributive_law", common_factor_formula["prerequisite_ids"])
        self.assertIn("[9수02-19] explanation", source_locators(common_factor_formula))

        quadratic_factorization = concepts["m1_factor_quadratic_factorization"]
        self.assertEqual("이차식 인수분해", quadratic_factorization["label_ko"])
        self.assertEqual("procedure", quadratic_factorization["concept_type"])
        self.assertEqual("high", quadratic_factorization["confidence"])
        self.assertIn("m1_factor_factorization", quadratic_factorization["parent_ids"])
        self.assertIn("m1_factor_quadratic_expression", quadratic_factorization["prerequisite_ids"])
        self.assertIn("p. 219", source_locators(quadratic_factorization))

    def test_factor_formula_edges_cover_expansion_and_factorization_directions(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_factor_formula_scope__contains__m1_factor_common_factor_formula",
            "m1_factor_factorization__contains__m1_factor_quadratic_factorization",
            "m1_factor_common_factor__used_in__m1_factor_common_factor_formula",
            "m1_num_distributive_law__used_in__m1_factor_common_factor_formula",
            "m1_factor_common_factor_formula__used_in__m1_factor_polynomial_multiplication",
            "m1_factor_common_factor_formula__used_in__m1_factor_factorization",
            "m1_factor_square_sum_formula__used_in__m1_factor_polynomial_multiplication",
            "m1_factor_square_difference_formula__used_in__m1_factor_polynomial_multiplication",
            "m1_factor_sum_difference_product_formula__used_in__m1_factor_polynomial_multiplication",
            "m1_factor_binomial_product_xab__used_in__m1_factor_polynomial_multiplication",
            "m1_factor_linear_product_axb_cxd__used_in__m1_factor_polynomial_multiplication",
            "m1_factor_binomial_product_xab__used_in__m1_factor_factorization",
            "m1_factor_linear_product_axb_cxd__used_in__m1_factor_factorization",
            "m1_factor_binomial_product_xab__used_in__m1_factor_quadratic_factorization",
            "m1_factor_linear_product_axb_cxd__used_in__m1_factor_quadratic_factorization",
            "m1_factor_quadratic_expression__represented_by__m1_factor_binomial_product_xab",
            "m1_factor_quadratic_expression__represented_by__m1_factor_linear_product_axb_cxd",
            "m1_factor_quadratic_expression__used_in__m1_factor_quadratic_factorization",
            "m1_factor_formula_scope__used_in__m1_factor_quadratic_factorization",
            "m1_factor_quadratic_factorization__used_in__m1_factor_factorization",
            "m1_factor_quadratic_factorization__used_in__m1_quad_eq_factorization_solving",
            "m1_factor_sum_difference_product_formula__contrasts_with__m1_factor_square_difference_formula",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

        removed_direction_edges = [
            "m1_factor_binomial_product_xab__represented_by__m1_factor_quadratic_expression",
            "m1_factor_linear_product_axb_cxd__represented_by__m1_factor_quadratic_expression",
        ]
        for edge_id in removed_direction_edges:
            self.assertNotIn(edge_id, edges)

    def test_factor_misconception_nodes_keep_low_confidence_without_prerequisites(self) -> None:
        concepts = concepts_by_id()

        for concept_id in [
            "m1_mis_expansion_factorization_direction",
            "m1_mis_factor_common_factor_missing",
            "m1_mis_factor_formula_pattern",
            "m1_mis_perfect_square_sign",
            "m1_mis_quadratic_expression_equation",
            "m1_mis_quadratic_factorization_solution",
        ]:
            concept = concepts[concept_id]
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])

    def test_factor_noisy_prerequisite_edges_are_removed(self) -> None:
        edges = edges_by_id()

        noisy_prereq_edges = [
            "m1_factor_expansion_factorization_inverse__prerequisite_for__m1_mis_expansion_factorization_direction",
            "m1_factor_common_factor__prerequisite_for__m1_mis_factor_common_factor_missing",
            "m1_factor_formula_scope__prerequisite_for__m1_mis_factor_formula_pattern",
            "m1_factor_perfect_square_expression__prerequisite_for__m1_mis_perfect_square_sign",
            "m1_factor_quadratic_expression__prerequisite_for__m1_mis_quadratic_expression_equation",
            "m1_quad_eq_quadratic_equation__prerequisite_for__m1_mis_quadratic_expression_equation",
            "m1_quad_eq_factorization_solving__prerequisite_for__m1_mis_quadratic_factorization_solution",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

    def test_research_report_ref_is_scoped_to_direct_factor_evidence(self) -> None:
        concepts = concepts_by_id()

        direct_ref_concepts = [
            "m1_factor_unit",
            "m1_factor_polynomial_multiplication",
            "m1_factor_factorization",
            "m1_factor_expansion_factorization_inverse",
            "m1_factor_quadratic_expression",
            "m1_factor_quadratic_factorization",
        ]
        for concept_id in direct_ref_concepts:
            self.assertIn("p. 219", source_locators(concepts[concept_id]))

        for concept_id in [
            "m1_mis_expansion_factorization_direction",
            "m1_mis_factor_formula_pattern",
            "m1_mis_perfect_square_sign",
        ]:
            self.assertNotIn("p. 219", source_locators(concepts[concept_id]))


if __name__ == "__main__":
    unittest.main()
