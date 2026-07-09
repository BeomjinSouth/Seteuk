from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class FunctionEquationRelationMicroconceptTests(unittest.TestCase):
    def test_solution_graph_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_func_two_variable_equation_solution_pair": ("representation", "medium", "02-17"),
            "m1_func_two_variable_linear_equation_graph": ("representation", "high", "02-17"),
            "m1_func_two_variable_equation_solution_set_graph": ("representation", "medium", "02-17"),
        }
        for concept_id, (concept_type, confidence, source_code) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn(source_code, source_locators(concept))

        solution_pair = concepts["m1_func_two_variable_equation_solution_pair"]
        self.assertIn("02-05", source_locators(solution_pair))
        self.assertIn("m1_system_two_variable_linear_equation", solution_pair["prerequisite_ids"])
        self.assertIn("m1_coord_ordered_pair", solution_pair["prerequisite_ids"])
        self.assertIn("m1_func_eq_relation_unit", solution_pair["parent_ids"])

        equation_graph = concepts["m1_func_two_variable_linear_equation_graph"]
        self.assertIn("m1_system_two_variable_linear_equation", equation_graph["prerequisite_ids"])
        self.assertIn("m1_func_linear_graph", equation_graph["prerequisite_ids"])
        self.assertIn("m1_coord_coordinate_plane", equation_graph["prerequisite_ids"])
        self.assertIn("m1_func_eq_relation_unit", equation_graph["parent_ids"])

        solution_set_graph = concepts["m1_func_two_variable_equation_solution_set_graph"]
        self.assertIn("m1_func_two_variable_equation_solution_pair", solution_set_graph["prerequisite_ids"])
        self.assertIn("m1_func_two_variable_linear_equation_graph", solution_set_graph["prerequisite_ids"])
        self.assertIn("m1_func_two_variable_linear_equation_graph", solution_set_graph["parent_ids"])

        as_graph = concepts["m1_func_two_variable_equation_as_graph"]
        self.assertIn("m1_func_two_variable_equation_solution_pair", as_graph["prerequisite_ids"])

    def test_intersection_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        point_coordinate = concepts["m1_func_intersection_point_coordinate"]
        self.assertEqual("representation", point_coordinate["concept_type"])
        self.assertEqual("medium", point_coordinate["confidence"])
        self.assertIn("02-18", source_locators(point_coordinate))
        self.assertIn("02-05", source_locators(point_coordinate))
        self.assertIn("m1_func_intersection_point", point_coordinate["parent_ids"])
        self.assertIn("m1_coord_coordinate", point_coordinate["prerequisite_ids"])

        count_relation = concepts["m1_func_intersection_solution_count_relation"]
        self.assertEqual("property", count_relation["concept_type"])
        self.assertEqual("medium", count_relation["confidence"])
        self.assertIn("02-18", source_locators(count_relation))
        self.assertIn("m1_func_intersection_count", count_relation["prerequisite_ids"])
        self.assertIn("m1_system_solution", count_relation["prerequisite_ids"])
        self.assertIn("m1_func_eq_relation_unit", count_relation["parent_ids"])

    def test_equation_graph_drawing_microprocedures_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_func_equation_function_form_conversion": ("미지수가 2개인 일차방정식을 y=ax+b 꼴로 나타내기", "procedure", "medium"),
            "m1_func_equation_solution_table": ("미지수가 2개인 일차방정식 해의 대응표", "representation", "medium"),
            "m1_func_equation_graph_from_two_solution_pairs": ("두 해의 순서쌍으로 일차방정식 그래프 그리기", "procedure", "medium"),
            "m1_func_equation_x_zero_substitution": ("x=0을 대입해 y축과의 교점 구하기", "procedure", "medium"),
            "m1_func_equation_y_zero_substitution": ("y=0을 대입해 x축과의 교점 구하기", "procedure", "medium"),
            "m1_func_equation_x_axis_intersection": ("일차방정식 그래프의 x축과의 교점", "representation", "medium"),
            "m1_func_equation_y_axis_intersection": ("일차방정식 그래프의 y축과의 교점", "representation", "medium"),
            "m1_func_equation_two_intercepts_graph_drawing": ("두 축과의 교점으로 일차방정식 그래프 그리기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("일차함수와 일차방정식의 관계", concept["unit"])
                self.assertIn("02-17", source_locators(concept))

        self.assertIn(
            "m1_system_two_variable_linear_equation",
            concepts["m1_func_equation_function_form_conversion"]["prerequisite_ids"],
        )
        self.assertIn(
            "m1_func_two_variable_equation_solution_pair",
            concepts["m1_func_equation_solution_table"]["prerequisite_ids"],
        )
        self.assertIn(
            "m1_func_equation_x_axis_intersection",
            concepts["m1_func_equation_two_intercepts_graph_drawing"]["prerequisite_ids"],
        )
        self.assertIn(
            "m1_func_equation_y_axis_intersection",
            concepts["m1_func_equation_two_intercepts_graph_drawing"]["prerequisite_ids"],
        )

    def test_graph_case_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_func_system_graph_same_plane": ("두 일차함수 그래프를 한 좌표평면에 나타내기", "procedure", "medium"),
            "m1_func_intersection_coordinate_reading": ("교점 좌표 읽기", "procedure", "medium"),
            "m1_func_one_intersection_case": ("두 그래프가 한 점에서 만나는 경우", "property", "medium"),
            "m1_func_parallel_graph_case": ("두 그래프가 평행한 경우", "property", "low"),
            "m1_func_coincident_graph_case": ("두 그래프가 일치하는 경우", "property", "low"),
            "m1_func_system_unique_solution_graph_case": ("한 점에서 만나는 그래프와 하나의 해", "property", "medium"),
            "m1_func_system_no_solution_graph_case": ("평행한 두 그래프와 해가 없는 경우", "property", "low"),
            "m1_func_system_infinitely_many_solutions_graph_case": ("일치하는 두 그래프와 해가 무수히 많은 경우", "property", "low"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("일차함수와 일차방정식의 관계", concept["unit"])
                self.assertIn("02-18", source_locators(concept))

        self.assertIn("연구보고서 p. 58", source_locators(concepts["m1_func_one_intersection_case"]))
        self.assertIn("m1_func_intersection_point_coordinate", concepts["m1_func_intersection_coordinate_reading"]["prerequisite_ids"])
        self.assertIn("m1_func_intersection_count", concepts["m1_func_one_intersection_case"]["parent_ids"])
        self.assertIn("m1_func_intersection_count", concepts["m1_func_parallel_graph_case"]["parent_ids"])
        self.assertIn("m1_func_intersection_count", concepts["m1_func_coincident_graph_case"]["parent_ids"])

    def test_microconcept_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_system_two_variable_linear_equation__represented_by__m1_func_two_variable_linear_equation_graph",
            "m1_func_two_variable_equation_solution_pair__represented_by__m1_coord_ordered_pair",
            "m1_func_two_variable_equation_solution_pair__related_to__m1_system_solution_ordered_pair",
            "m1_func_two_variable_equation_solution_pair__used_in__m1_func_two_variable_equation_as_graph",
            "m1_func_two_variable_linear_equation_graph__used_in__m1_func_two_variable_equation_as_graph",
            "m1_func_two_variable_linear_equation_graph__related_to__m1_func_equation_relation",
            "m1_func_two_variable_equation_solution_set_graph__represented_by__m1_func_two_variable_linear_equation_graph",
            "m1_func_two_variable_equation_solution_set_graph__used_in__m1_func_equation_relation",
            "m1_func_two_variable_equation_solution_set_graph__used_in__m1_func_two_variable_equation_as_graph",
            "m1_func_two_variable_equation_as_graph__contrasts_with__m1_func_two_linear_graphs",
            "m1_func_two_linear_graphs__contrasts_with__m1_func_two_variable_equation_as_graph",
            "m1_func_intersection_point__represented_by__m1_func_intersection_point_coordinate",
            "m1_func_intersection_point_coordinate__used_in__m1_func_system_solution_from_intersection",
            "m1_system_solution__represented_by__m1_func_intersection_point_coordinate",
            "m1_func_intersection_count__used_in__m1_func_intersection_solution_count_relation",
            "m1_func_intersection_solution_count_relation__used_in__m1_func_system_graph_relation",
            "m1_system_unit__related_to__m1_func_eq_relation_unit",
            "m1_func_equation_function_form_conversion__used_in__m1_func_two_variable_equation_as_graph",
            "m1_func_two_variable_equation_solution_pair__used_in__m1_func_equation_solution_table",
            "m1_func_equation_solution_table__used_in__m1_func_equation_graph_from_two_solution_pairs",
            "m1_func_equation_graph_from_two_solution_pairs__used_in__m1_func_two_variable_equation_as_graph",
            "m1_func_equation_x_zero_substitution__used_in__m1_func_equation_y_axis_intersection",
            "m1_func_equation_y_zero_substitution__used_in__m1_func_equation_x_axis_intersection",
            "m1_func_equation_x_axis_intersection__used_in__m1_func_equation_two_intercepts_graph_drawing",
            "m1_func_equation_y_axis_intersection__used_in__m1_func_equation_two_intercepts_graph_drawing",
            "m1_func_equation_two_intercepts_graph_drawing__used_in__m1_func_two_variable_equation_as_graph",
            "m1_func_system_graph_same_plane__used_in__m1_func_intersection_coordinate_reading",
            "m1_func_intersection_coordinate_reading__used_in__m1_func_system_solution_from_intersection",
            "m1_func_one_intersection_case__used_in__m1_func_system_unique_solution_graph_case",
            "m1_func_parallel_graph_case__used_in__m1_func_system_no_solution_graph_case",
            "m1_func_coincident_graph_case__used_in__m1_func_system_infinitely_many_solutions_graph_case",
            "m1_func_system_unique_solution_graph_case__used_in__m1_func_intersection_solution_count_relation",
            "m1_func_system_no_solution_graph_case__used_in__m1_func_intersection_solution_count_relation",
            "m1_func_system_infinitely_many_solutions_graph_case__used_in__m1_func_intersection_solution_count_relation",
        ]
        for edge_id in expected_edges:
            if edge_id not in edges:
                self.fail(f"Missing edge: {edge_id}")

    def test_misconceptions_do_not_receive_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_low = [
            "m1_mis_intersection_solution",
            "m1_mis_intersection_count_solution_count",
            "m1_mis_single_equation_graph_as_system_solution",
            "m1_mis_equation_intercepts_substitution_swap",
            "m1_mis_parallel_graphs_have_solution",
            "m1_mis_coincident_graph_single_solution",
        ]
        for concept_id in expected_low:
            concept = concepts[concept_id]
            self.assertEqual("misconception_risk", concept["concept_type"])
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])

        expected_confusion_edges = [
            "m1_mis_intersection_solution__often_confused_with__m1_func_intersection_point_coordinate",
            "m1_mis_intersection_solution__often_confused_with__m1_system_solution",
            "m1_mis_intersection_count_solution_count__often_confused_with__m1_func_intersection_solution_count_relation",
            "m1_mis_single_equation_graph_as_system_solution__often_confused_with__m1_func_two_variable_equation_as_graph",
            "m1_mis_equation_intercepts_substitution_swap__often_confused_with__m1_func_equation_x_zero_substitution",
            "m1_mis_parallel_graphs_have_solution__often_confused_with__m1_func_system_no_solution_graph_case",
            "m1_mis_coincident_graph_single_solution__often_confused_with__m1_func_system_infinitely_many_solutions_graph_case",
        ]
        for edge_id in expected_confusion_edges:
            if edge_id not in edges:
                self.fail(f"Missing edge: {edge_id}")

        noisy_edges = [
            "m1_func_system_graph_relation__prerequisite_for__m1_mis_intersection_solution",
            "m1_mis_intersection_solution__often_confused_with__m1_func_system_graph_relation",
            "m1_mis_intersection_solution__often_confused_with__m1_func_intersection_count",
            "m1_mis_intersection_solution__often_confused_with__m1_func_system_solution_from_intersection",
            "m1_system_unit__prerequisite_for__m1_func_eq_relation_unit",
            "m1_func_slope__prerequisite_for__m1_func_two_variable_linear_equation_graph",
            "m1_func_x_intercept__prerequisite_for__m1_func_two_variable_linear_equation_graph",
            "m1_func_y_intercept__prerequisite_for__m1_func_two_variable_linear_equation_graph",
            "m1_func_x_intercept__prerequisite_for__m1_func_equation_two_intercepts_graph_drawing",
            "m1_func_y_intercept__prerequisite_for__m1_func_equation_two_intercepts_graph_drawing",
            "m1_system_two_variable_linear_equation__represented_by__m1_func_two_variable_equation_as_graph",
            "m1_func_system_solution_from_intersection__used_in__m1_system_solution",
            "m1_func_equation_x_zero_substitution__used_in__m1_func_equation_x_axis_intersection",
            "m1_func_equation_y_zero_substitution__used_in__m1_func_equation_y_axis_intersection",
            "m1_func_parallel_graph_case__prerequisite_for__m1_func_system_no_solution_graph_case",
            "m1_func_coincident_graph_case__prerequisite_for__m1_func_system_infinitely_many_solutions_graph_case",
            "m1_func_two_variable_linear_equation_graph__prerequisite_for__m1_mis_equation_intercepts_substitution_swap",
        ]
        for edge_id in noisy_edges:
            self.assertNotIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
