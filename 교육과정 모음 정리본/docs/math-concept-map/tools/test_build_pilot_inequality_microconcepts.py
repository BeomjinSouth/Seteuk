from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class InequalityMicroconceptTests(unittest.TestCase):
    def test_inequality_vocabulary_and_solution_representation_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_ineq_inequality_sign": ("부등호", "term", "low", "[9수02-11]"),
            "m1_ineq_inequality_sign_direction": ("부등호의 방향", "sub_concept", "medium", "[9수02-11]"),
            "m1_ineq_solution_range": ("부등식 해의 범위", "sub_concept", "medium", "[9수02-11]"),
            "m1_ineq_number_line_solution_representation": (
                "부등식 해의 수직선 표현",
                "representation",
                "low",
                "[9수02-11]",
            ),
            "m1_ineq_boundary_value": ("부등식 해의 경계값", "sub_concept", "low", "[9수02-11]"),
            "m1_ineq_endpoint_inclusion_representation": (
                "부등식 해의 끝점 포함 표시",
                "representation",
                "low",
                "[9수02-11]",
            ),
        }
        for concept_id, (label, concept_type, confidence, source_marker) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn(source_marker, source_locators(concept))
            self.assertEqual("일차부등식", concept["unit"])

        self.assertIn("m1_ineq_inequality", concepts["m1_ineq_inequality_sign"]["parent_ids"])
        self.assertIn("m1_ineq_inequality_sign", concepts["m1_ineq_inequality_sign_direction"]["parent_ids"])
        self.assertIn("해집합", concepts["m1_ineq_solution_range"]["aliases"])
        self.assertIn(
            "m1_num_number_line_position_order",
            concepts["m1_ineq_number_line_solution_representation"]["prerequisite_ids"],
        )
        self.assertIn(
            "m1_ineq_number_line_solution_representation",
            concepts["m1_ineq_endpoint_inclusion_representation"]["parent_ids"],
        )

    def test_inequality_property_and_solving_microprocedures_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_ineq_add_sub_same_number_property": (
                "부등식 양변에 같은 수 더하기·빼기",
                "property",
                "medium",
                "[9수02-11]",
            ),
            "m1_ineq_multiply_divide_positive_property": (
                "부등식 양변에 양수를 곱하거나 나누기",
                "property",
                "medium",
                "[9수02-11]",
            ),
            "m1_ineq_multiply_divide_negative_reverses_sign": (
                "부등식 양변에 음수를 곱하거나 나눌 때 부등호 방향 바꾸기",
                "property",
                "medium",
                "[9수02-11]",
            ),
            "m1_ineq_equivalent_transformation": ("부등식의 동치 변형", "procedure", "medium", "[9수02-12]"),
            "m1_ineq_isolate_unknown": ("미지수를 한쪽으로 모으기", "procedure", "medium", "[9수02-12]"),
            "m1_ineq_write_solution_range": (
                "일차부등식의 해를 범위로 나타내기",
                "procedure",
                "medium",
                "[9수02-12]",
            ),
            "m1_ineq_judge_solution": ("부등식의 해인지 판단하기", "procedure", "medium", "[9수02-11]"),
            "m1_ineq_choose_unknown_from_context": (
                "문제 상황에서 미지수 정하기",
                "procedure",
                "medium",
                "[9수02-12]",
            ),
            "m1_ineq_translate_condition": ("문제 조건을 부등식으로 옮기기", "procedure", "medium", "[9수02-12]"),
            "m1_ineq_interpret_solution_context": (
                "부등식의 해를 문제 상황에 맞게 해석하기",
                "procedure",
                "medium",
                "[9수02-12]",
            ),
            "m1_ineq_linear_inequality_problem_solving": (
                "일차부등식 활용 문제 해결",
                "procedure",
                "high",
                "[9수02-12]",
            ),
        }
        for concept_id, (label, concept_type, confidence, source_marker) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn(source_marker, source_locators(concept))
            self.assertEqual("일차부등식", concept["unit"])

        self.assertIn("m1_ineq_properties", concepts["m1_ineq_add_sub_same_number_property"]["parent_ids"])
        self.assertIn("m1_ineq_properties", concepts["m1_ineq_multiply_divide_positive_property"]["parent_ids"])
        self.assertIn("m1_ineq_properties", concepts["m1_ineq_multiply_divide_negative_reverses_sign"]["parent_ids"])
        self.assertIn("m1_ineq_solving_linear_inequality", concepts["m1_ineq_equivalent_transformation"]["parent_ids"])
        self.assertIn("m1_ineq_solution_check", concepts["m1_ineq_judge_solution"]["parent_ids"])
        self.assertIn("m1_ineq_modeling_linear_inequality", concepts["m1_ineq_choose_unknown_from_context"]["parent_ids"])
        self.assertIn("m1_ineq_unit", concepts["m1_ineq_linear_inequality_problem_solving"]["parent_ids"])

    def test_inequality_microconcept_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_ineq_inequality__represented_by__m1_ineq_inequality_sign",
            "m1_ineq_inequality_sign_direction__used_in__m1_ineq_multiply_divide_negative_reverses_sign",
            "m1_ineq_solution_range__represented_by__m1_ineq_number_line_solution_representation",
            "m1_num_number_line_position_order__used_in__m1_ineq_number_line_solution_representation",
            "m1_ineq_boundary_value__used_in__m1_ineq_endpoint_inclusion_representation",
            "m1_eq_both_sides__used_in__m1_ineq_properties",
            "m1_ineq_add_sub_same_number_property__used_in__m1_ineq_equivalent_transformation",
            "m1_ineq_multiply_divide_positive_property__used_in__m1_ineq_equivalent_transformation",
            "m1_ineq_multiply_divide_negative_reverses_sign__used_in__m1_ineq_equivalent_transformation",
            "m1_ineq_equivalent_transformation__used_in__m1_ineq_solving_linear_inequality",
            "m1_ineq_solution_range__used_in__m1_ineq_write_solution_range",
            "m1_expr_substitution__used_in__m1_ineq_judge_solution",
            "m1_ineq_judge_solution__used_in__m1_ineq_solution_check",
            "m1_ineq_choose_unknown_from_context__used_in__m1_ineq_modeling_linear_inequality",
            "m1_ineq_translate_condition__represented_by__m1_ineq_linear_inequality",
            "m1_ineq_solution_check__used_in__m1_ineq_interpret_solution_context",
            "m1_ineq_modeling_linear_inequality__used_in__m1_ineq_linear_inequality_problem_solving",
            "m1_ineq_solving_linear_inequality__used_in__m1_ineq_linear_inequality_problem_solving",
            "m1_ineq_solution_check__used_in__m1_ineq_linear_inequality_problem_solving",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

    def test_inequality_misconceptions_stay_low_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        for concept_id in [
            "m1_mis_ineq_negative",
            "m1_mis_ineq_solution_single_value",
            "m1_mis_ineq_endpoint_inclusion",
            "m1_mis_ineq_sign_reversal_overgeneralization",
        ]:
            concept = concepts[concept_id]
            self.assertEqual("misconception_risk", concept["concept_type"])
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])

        expected_confusion_edges = [
            "m1_mis_ineq_negative__often_confused_with__m1_ineq_multiply_divide_negative_reverses_sign",
            "m1_mis_ineq_solution_single_value__often_confused_with__m1_ineq_solution_range",
            "m1_mis_ineq_endpoint_inclusion__often_confused_with__m1_ineq_endpoint_inclusion_representation",
            "m1_mis_ineq_sign_reversal_overgeneralization__often_confused_with__m1_ineq_multiply_divide_positive_property",
        ]
        for edge_id in expected_confusion_edges:
            self.assertIn(edge_id, edges)

        noisy_prereq_edges = [
            "m1_ineq_multiply_divide_negative_reverses_sign__prerequisite_for__m1_mis_ineq_negative",
            "m1_ineq_endpoint_inclusion_representation__prerequisite_for__m1_mis_ineq_endpoint_inclusion",
            "m1_eq_solution__prerequisite_for__m1_ineq_solution_range",
            "m1_graph_graph__prerequisite_for__m1_ineq_number_line_solution_representation",
            "m1_coord_number_line__prerequisite_for__m1_ineq_number_line_solution_representation",
            "m1_calc_unit__prerequisite_for__m1_ineq_unit",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
