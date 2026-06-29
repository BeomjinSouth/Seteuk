from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class LinearEquationMicroconceptTests(unittest.TestCase):
    def test_equation_solution_and_property_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_eq_judge_solution": ("해인지 판단하기", "procedure", "high", "[9수02-03]"),
            "m1_eq_equal_add_subtract_property": (
                "양변에 같은 수를 더하거나 빼기",
                "property",
                "medium",
                "[9수02-03]",
            ),
            "m1_eq_equal_multiply_divide_property": (
                "양변에 같은 수를 곱하거나 나누기",
                "property",
                "medium",
                "[9수02-03]",
            ),
            "m1_eq_apply_equality_properties": (
                "등식의 성질을 이용해 방정식 변형하기",
                "procedure",
                "high",
                "[9수02-04]",
            ),
        }
        for concept_id, (label, concept_type, confidence, source_marker) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn(source_marker, source_locators(concept))

        self.assertIn("m1_eq_unit", concepts["m1_eq_judge_solution"]["parent_ids"])
        self.assertIn("m1_eq_equation", concepts["m1_eq_judge_solution"]["prerequisite_ids"])
        self.assertIn("m1_expr_substitution", concepts["m1_eq_judge_solution"]["prerequisite_ids"])
        self.assertIn("m1_eq_equality_properties", concepts["m1_eq_equal_add_subtract_property"]["parent_ids"])
        self.assertIn("m1_eq_equality_properties", concepts["m1_eq_equal_multiply_divide_property"]["parent_ids"])
        self.assertIn("m1_eq_solving_linear_equation", concepts["m1_eq_apply_equality_properties"]["parent_ids"])

    def test_linear_equation_solving_and_modeling_microprocedures_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_eq_collect_unknown_terms": ("미지수항 모으기", "procedure", "medium"),
            "m1_eq_collect_constant_terms": ("상수항 모으기", "procedure", "medium"),
            "m1_eq_choose_unknown_from_context": ("문제 상황에서 미지수 정하기", "procedure", "medium"),
            "m1_eq_interpret_solution_context": ("해를 문제 상황에 맞게 해석하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn("일차방정식", concept["unit"])

        self.assertIn("m1_eq_transposition", concepts["m1_eq_collect_unknown_terms"]["prerequisite_ids"])
        self.assertIn("m1_eq_unknown", concepts["m1_eq_collect_unknown_terms"]["prerequisite_ids"])
        self.assertIn("m1_expr_constant_term", concepts["m1_eq_collect_constant_terms"]["prerequisite_ids"])
        self.assertIn("m1_expr_letter_quantity", concepts["m1_eq_choose_unknown_from_context"]["prerequisite_ids"])
        self.assertIn("m1_eq_solution_check", concepts["m1_eq_interpret_solution_context"]["prerequisite_ids"])

    def test_linear_equation_edges_are_directional_and_less_noisy(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_eq_equation__used_in__m1_eq_judge_solution",
            "m1_expr_substitution__used_in__m1_eq_judge_solution",
            "m1_eq_judge_solution__used_in__m1_eq_solution",
            "m1_eq_equal_add_subtract_property__used_in__m1_eq_apply_equality_properties",
            "m1_eq_equal_multiply_divide_property__used_in__m1_eq_apply_equality_properties",
            "m1_eq_apply_equality_properties__used_in__m1_eq_solving_linear_equation",
            "m1_eq_transposition__used_in__m1_eq_collect_unknown_terms",
            "m1_eq_transposition__used_in__m1_eq_collect_constant_terms",
            "m1_eq_collect_unknown_terms__used_in__m1_eq_solving_linear_equation",
            "m1_eq_collect_constant_terms__used_in__m1_eq_solving_linear_equation",
            "m1_eq_choose_unknown_from_context__used_in__m1_eq_modeling_linear_equation",
            "m1_eq_solution_check__used_in__m1_eq_interpret_solution_context",
            "m1_eq_interpret_solution_context__used_in__m1_eq_modeling_linear_equation",
            "m1_mis_expression_equation__often_confused_with__m1_eq_equality",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

        noisy_prereq_edges = [
            "m1_repr_expression__prerequisite_for__m1_mis_expression_equation",
            "m1_eq_equality__prerequisite_for__m1_mis_expression_equation",
            "m1_eq_equation__prerequisite_for__m1_mis_expression_equation",
            "m1_eq_transposition__prerequisite_for__m1_mis_transposition_sign",
            "m1_eq_equality_properties__prerequisite_for__m1_mis_transposition_sign",
            "m1_eq_solution_check__prerequisite_for__m1_mis_solution_check",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

    def test_misconception_nodes_keep_low_confidence_without_prerequisites(self) -> None:
        concepts = concepts_by_id()

        for concept_id in [
            "m1_mis_expression_equation",
            "m1_mis_transposition_sign",
            "m1_mis_solution_check",
        ]:
            concept = concepts[concept_id]
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])

    def test_research_report_ref_is_scoped_to_direct_equation_evidence(self) -> None:
        concepts = concepts_by_id()

        direct_ref_concepts = [
            "m1_eq_equation",
            "m1_eq_solution",
            "m1_eq_equality_properties",
            "m1_eq_linear_equation",
            "m1_eq_solving_linear_equation",
            "m1_eq_modeling_linear_equation",
        ]
        for concept_id in direct_ref_concepts:
            self.assertIn("p. 214", source_locators(concepts[concept_id]))

        for concept_id in ["m1_eq_both_sides", "m1_eq_transposition"]:
            self.assertNotIn("p. 214", source_locators(concepts[concept_id]))


if __name__ == "__main__":
    unittest.main()
