from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class SystemMicroconceptTests(unittest.TestCase):
    def test_system_solving_microprocedures_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_system_common_solution_condition": ("공통 해 조건", "property", "medium"),
            "m1_system_solution_ordered_pair": ("해의 순서쌍 표현", "representation", "medium"),
            "m1_system_solution_check": ("연립일차방정식 해의 확인", "procedure", "medium"),
            "m1_system_elimination_coefficient_matching": ("소거할 미지수의 계수 맞추기", "procedure", "medium"),
            "m1_system_add_or_subtract_equations": ("두 방정식 더하거나 빼기", "procedure", "medium"),
            "m1_system_back_substitution": ("한 미지수 값을 대입해 다른 미지수 구하기", "procedure", "medium"),
            "m1_system_substitution_isolate_variable": ("한 미지수를 다른 미지수의 식으로 나타내기", "procedure", "medium"),
            "m1_system_substitution_into_other_equation": ("다른 방정식에 식 전체 대입하기", "procedure", "medium"),
            "m1_system_modeling_variable_assignment": ("두 미지수 정하기", "procedure", "medium"),
            "m1_system_modeling_two_conditions": ("두 조건을 두 방정식으로 나타내기", "procedure", "medium"),
            "m1_system_problem_solving": ("연립일차방정식 활용 문제 해결", "procedure", "medium"),
            "m1_system_process_explanation": ("연립일차방정식 풀이 과정 설명하기", "procedure", "medium"),
            "m1_system_solution_context_interpretation": ("해를 문제 상황에 맞게 해석하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertEqual("연립일차방정식", concept["unit"])
            self.assertIn("[9수02-13]", source_locators(concept))

        self.assertIn("m1_system_solution", concepts["m1_system_common_solution_condition"]["parent_ids"])
        self.assertIn("m1_system_solution", concepts["m1_system_solution_ordered_pair"]["parent_ids"])
        self.assertIn("m1_system_solution", concepts["m1_system_solution_check"]["parent_ids"])
        self.assertIn("m1_system_addition_subtraction_method", concepts["m1_system_elimination_coefficient_matching"]["parent_ids"])
        self.assertIn("m1_system_addition_subtraction_method", concepts["m1_system_add_or_subtract_equations"]["parent_ids"])
        self.assertIn("m1_system_solving", concepts["m1_system_back_substitution"]["parent_ids"])
        self.assertIn("m1_system_substitution_method", concepts["m1_system_substitution_isolate_variable"]["parent_ids"])
        self.assertIn("m1_system_substitution_method", concepts["m1_system_substitution_into_other_equation"]["parent_ids"])
        self.assertIn("m1_system_modeling", concepts["m1_system_modeling_variable_assignment"]["parent_ids"])
        self.assertIn("m1_system_modeling", concepts["m1_system_modeling_two_conditions"]["parent_ids"])
        self.assertIn("m1_system_unit", concepts["m1_system_problem_solving"]["parent_ids"])
        self.assertIn("m1_system_solving", concepts["m1_system_process_explanation"]["parent_ids"])
        self.assertIn("m1_system_problem_solving", concepts["m1_system_solution_context_interpretation"]["parent_ids"])

    def test_system_microprocedure_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_system_solution__contains__m1_system_common_solution_condition",
            "m1_system_solution__contains__m1_system_solution_ordered_pair",
            "m1_system_solution__contains__m1_system_solution_check",
            "m1_system_addition_subtraction_method__contains__m1_system_elimination_coefficient_matching",
            "m1_system_addition_subtraction_method__contains__m1_system_add_or_subtract_equations",
            "m1_system_solving__contains__m1_system_back_substitution",
            "m1_system_substitution_method__contains__m1_system_substitution_isolate_variable",
            "m1_system_substitution_method__contains__m1_system_substitution_into_other_equation",
            "m1_system_modeling__contains__m1_system_modeling_variable_assignment",
            "m1_system_modeling__contains__m1_system_modeling_two_conditions",
            "m1_system_unit__contains__m1_system_problem_solving",
            "m1_system_solving__contains__m1_system_process_explanation",
            "m1_system_problem_solving__contains__m1_system_solution_context_interpretation",
            "m1_system_solution__represented_by__m1_system_solution_ordered_pair",
            "m1_system_common_solution_condition__used_in__m1_system_solution_check",
            "m1_expr_substitution__used_in__m1_system_solution_check",
            "m1_system_solution_check__used_in__m1_system_modeling",
            "m1_system_elimination_coefficient_matching__used_in__m1_system_addition_subtraction_method",
            "m1_system_add_or_subtract_equations__used_in__m1_system_elimination",
            "m1_system_add_or_subtract_equations__used_in__m1_system_addition_subtraction_method",
            "m1_system_add_or_subtract_equations__used_in__m1_system_back_substitution",
            "m1_system_substitution_isolate_variable__used_in__m1_system_substitution_method",
            "m1_system_substitution_into_other_equation__used_in__m1_system_substitution_method",
            "m1_system_substitution_into_other_equation__used_in__m1_system_back_substitution",
            "m1_system_modeling_variable_assignment__used_in__m1_system_modeling",
            "m1_system_modeling_two_conditions__used_in__m1_system_modeling",
            "m1_system_modeling__used_in__m1_system_problem_solving",
            "m1_system_solving__used_in__m1_system_problem_solving",
            "m1_system_solution_check__used_in__m1_system_problem_solving",
            "m1_system_process_explanation__used_in__m1_system_solving",
            "m1_system_solution_context_interpretation__used_in__m1_system_problem_solving",
            "m1_system_addition_subtraction_method__contrasts_with__m1_system_substitution_method",
            "m1_system_elimination_coefficient_matching__contrasts_with__m1_system_substitution_isolate_variable",
        ]
        for edge_id in expected_edges:
            if edge_id not in edges:
                self.fail(f"Missing edge: {edge_id}")

    def test_system_misconceptions_do_not_receive_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_low = {
            "m1_mis_system_one_equation_only": "m1_system_common_solution_condition",
            "m1_mis_system_elimination_sign": "m1_system_elimination_coefficient_matching",
            "m1_mis_system_substitution": "m1_system_substitution_into_other_equation",
            "m1_mis_system_ordered_pair_swap": "m1_system_solution_ordered_pair",
        }
        for misconception_id, target_id in expected_low.items():
            concept = concepts[misconception_id]
            self.assertEqual("misconception_risk", concept["concept_type"])
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])
            expected_edge = f"{misconception_id}__often_confused_with__{target_id}"
            if expected_edge not in edges:
                self.fail(f"Missing edge: {expected_edge}")

        noisy_prereq_edges = [
            "m1_system_solution__prerequisite_for__m1_mis_system_one_equation_only",
            "m1_system_addition_subtraction_method__prerequisite_for__m1_mis_system_elimination_sign",
            "m1_system_substitution_method__prerequisite_for__m1_mis_system_substitution",
            "m1_system_solution_ordered_pair__prerequisite_for__m1_mis_system_ordered_pair_swap",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

    def test_system_broad_graph_prerequisite_is_not_created(self) -> None:
        edges = edges_by_id()
        noisy_edge = "m1_system_unit__prerequisite_for__m1_coord_graph_unit"
        self.assertFalse(noisy_edge in edges, noisy_edge)
        self.assertIn(
            "m1_system_unit__related_to__m1_coord_graph_unit",
            edges,
        )

    def test_system_graph_relation_edges_target_representations_and_relations(self) -> None:
        edges = edges_by_id()

        noisy_edges = [
            "m1_system_two_variable_linear_equation__represented_by__m1_func_two_variable_equation_as_graph",
            "m1_system_simultaneous_linear_equations__represented_by__m1_func_system_graph_relation",
            "m1_func_two_variable_equation_as_graph__used_in__m1_system_solution",
            "m1_func_system_solution_from_intersection__used_in__m1_system_solution",
        ]
        for edge_id in noisy_edges:
            self.assertFalse(edge_id in edges, edge_id)

        expected_edges = [
            "m1_system_two_variable_linear_equation__used_in__m1_func_two_variable_equation_as_graph",
            "m1_func_two_variable_equation_as_graph__used_in__m1_func_system_graph_relation",
            "m1_system_simultaneous_linear_equations__represented_by__m1_func_two_linear_graphs",
            "m1_func_system_solution_from_intersection__used_in__m1_func_system_graph_relation",
            "m1_system_solution__represented_by__m1_func_intersection_point",
        ]
        for edge_id in expected_edges:
            if edge_id not in edges:
                self.fail(f"Missing edge: {edge_id}")


if __name__ == "__main__":
    unittest.main()
