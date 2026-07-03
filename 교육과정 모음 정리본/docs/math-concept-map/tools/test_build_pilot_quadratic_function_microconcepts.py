from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def relationship_types_by_pair() -> dict[frozenset[str], set[str]]:
    grouped: dict[frozenset[str], set[str]] = {}
    for edge in build_pilot.EDGES:
        grouped.setdefault(frozenset([edge["source_id"], edge["target_id"]]), set()).add(
            edge["relationship_type"]
        )
    return grouped


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class QuadraticFunctionMicroconceptTests(unittest.TestCase):
    def test_quadratic_function_judgement_and_expression_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        identifying = concepts["m1_quad_func_identifying_quadratic_function"]
        self.assertEqual("이차함수 판별하기", identifying["label_ko"])
        self.assertEqual("procedure", identifying["concept_type"])
        self.assertEqual("high", identifying["confidence"])
        self.assertIn("m1_quad_func_unit", identifying["parent_ids"])
        self.assertIn("m1_quad_func_quadratic_function", identifying["prerequisite_ids"])
        self.assertIn("p. 220", source_locators(identifying))

        situation_to_formula = concepts["m1_quad_func_situation_to_formula"]
        self.assertEqual("상황을 이차함수 식으로 나타내기", situation_to_formula["label_ko"])
        self.assertEqual("procedure", situation_to_formula["concept_type"])
        self.assertEqual("high", situation_to_formula["confidence"])
        self.assertIn("m1_quad_func_formula", situation_to_formula["parent_ids"])
        self.assertIn("m1_func_function", situation_to_formula["prerequisite_ids"])
        self.assertIn("m1_factor_quadratic_expression", situation_to_formula["prerequisite_ids"])
        self.assertIn("p. 220", source_locators(situation_to_formula))

    def test_quadratic_function_form_microconcepts_are_not_mixed_with_graph_nodes(self) -> None:
        concepts = concepts_by_id()

        expected_forms = {
            "m1_quad_func_y_ax2_form": "y=ax^2 꼴",
            "m1_quad_func_shifted_square_form": "y=a(x-p)^2 꼴",
            "m1_quad_func_vertical_shift_form": "y=ax^2+q 꼴",
            "m1_quad_func_vertex_form": "y=a(x-p)^2+q 꼴",
            "m1_quad_func_general_form": "y=ax^2+bx+c 꼴",
        }
        for concept_id, label in expected_forms.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual("representation", concept["concept_type"])
            self.assertIn("m1_quad_func_formula", concept["parent_ids"])
            self.assertIn("p. 220", source_locators(concept))

        y_ax2_graph = concepts["m1_quad_func_y_ax2_graph"]
        self.assertEqual("y=ax^2 그래프", y_ax2_graph["label_ko"])
        self.assertIn("m1_quad_func_graph", y_ax2_graph["parent_ids"])
        self.assertNotIn("m1_quad_func_formula", y_ax2_graph["parent_ids"])
        self.assertIn("m1_quad_func_y_ax2_form", y_ax2_graph["prerequisite_ids"])

    def test_graph_property_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_quad_func_value_table": ("이차함수의 값의 표", "representation", "medium"),
            "m1_quad_func_vertex_coordinates": ("꼭짓점 좌표", "representation", "medium"),
            "m1_quad_func_axis_equation": ("축의 방정식", "representation", "medium"),
            "m1_quad_func_opening_direction": ("위로 열린 그래프와 아래로 열린 그래프", "property", "medium"),
            "m1_quad_func_vertex_form_graph_reading": ("꼭짓점형에서 그래프 성질 읽기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn("p. 220", source_locators(concept))

        self.assertIn("m1_quad_func_graph_drawing", concepts["m1_quad_func_value_table"]["parent_ids"])
        self.assertIn("m1_quad_func_graph_properties", concepts["m1_quad_func_vertex_coordinates"]["parent_ids"])
        self.assertIn("m1_quad_func_graph_properties", concepts["m1_quad_func_axis_equation"]["parent_ids"])
        self.assertIn("m1_quad_func_graph_properties", concepts["m1_quad_func_opening_direction"]["parent_ids"])
        self.assertIn("m1_quad_func_vertex_form", concepts["m1_quad_func_vertex_form_graph_reading"]["parent_ids"])

    def test_quadratic_function_graph_reading_microsteps_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_quad_func_coefficient_a": ("이차함수의 계수 a", "term", "medium"),
            "m1_quad_func_nonzero_a_condition": ("a≠0 조건", "property", "medium"),
            "m1_quad_func_y_ax2_axis_vertex": ("y=ax^2의 축과 꼭짓점", "property", "medium"),
            "m1_quad_func_a_sign_opening": ("a의 부호로 열린 방향 판단하기", "procedure", "medium"),
            "m1_quad_func_a_abs_width": ("a의 절댓값과 그래프의 폭", "property", "low"),
            "m1_quad_func_axis_symmetry": ("축에 대한 대칭", "property", "medium"),
            "m1_quad_func_symmetric_points": ("축을 기준으로 대칭인 두 점", "representation", "low"),
            "m1_quad_func_value_table_ordered_pairs": ("값의 표에서 순서쌍 만들기", "procedure", "medium"),
            "m1_quad_func_choose_symmetric_x_values": ("축을 기준으로 대칭인 x값 고르기", "procedure", "low"),
            "m1_quad_func_plot_points_and_connect": ("점 찍고 포물선으로 연결하기", "procedure", "low"),
            "m1_quad_func_p_parameter_horizontal_shift": ("p 값과 좌우 평행이동", "property", "medium"),
            "m1_quad_func_vertex_form_p_sign_reading": ("꼭짓점형의 p 부호 읽기", "procedure", "medium"),
            "m1_quad_func_q_parameter_vertical_shift": ("q 값과 상하 평행이동", "property", "medium"),
            "m1_quad_func_general_to_vertex_form": ("일반형을 꼭짓점형으로 고치기", "procedure", "low"),
            "m1_quad_func_complete_square_for_vertex": ("완전제곱식으로 고쳐 꼭짓점 찾기", "procedure", "low"),
            "m1_quad_func_vertex_y_extreme_value": ("꼭짓점의 y좌표와 최댓값·최솟값", "property", "medium"),
            "m1_quad_func_opening_extreme_decision": ("열린 방향으로 최댓값·최솟값 판단하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("이차함수와 그 그래프", concept["unit"])
                self.assertIn("p. 220", source_locators(concept))

        self.assertIn("m1_quad_func_formula", concepts["m1_quad_func_nonzero_a_condition"]["parent_ids"])
        self.assertIn("m1_quad_func_coefficient_a", concepts["m1_quad_func_nonzero_a_condition"]["prerequisite_ids"])
        self.assertIn("m1_quad_func_graph_properties", concepts["m1_quad_func_y_ax2_axis_vertex"]["parent_ids"])
        self.assertIn("m1_quad_func_y_ax2_form", concepts["m1_quad_func_y_ax2_axis_vertex"]["prerequisite_ids"])
        self.assertIn("m1_quad_func_graph_properties", concepts["m1_quad_func_axis_symmetry"]["parent_ids"])
        self.assertIn("m1_quad_func_graph_drawing", concepts["m1_quad_func_symmetric_points"]["parent_ids"])
        self.assertIn("m1_quad_func_graph_drawing", concepts["m1_quad_func_value_table_ordered_pairs"]["parent_ids"])
        self.assertIn("m1_quad_func_graph_drawing", concepts["m1_quad_func_choose_symmetric_x_values"]["parent_ids"])
        self.assertIn("m1_quad_func_axis_equation", concepts["m1_quad_func_choose_symmetric_x_values"]["prerequisite_ids"])
        self.assertIn("m1_quad_func_graph_drawing", concepts["m1_quad_func_plot_points_and_connect"]["parent_ids"])
        self.assertIn("m1_quad_func_vertex_form", concepts["m1_quad_func_p_parameter_horizontal_shift"]["parent_ids"])
        self.assertIn("m1_quad_func_vertex_form", concepts["m1_quad_func_vertex_form_p_sign_reading"]["parent_ids"])
        self.assertIn(
            "m1_quad_func_vertex_form_p_sign_reading",
            concepts["m1_quad_func_vertex_form_graph_reading"]["prerequisite_ids"],
        )
        self.assertIn("m1_quad_func_vertex_form", concepts["m1_quad_func_q_parameter_vertical_shift"]["parent_ids"])
        self.assertIn("m1_quad_func_general_form", concepts["m1_quad_func_general_to_vertex_form"]["prerequisite_ids"])
        self.assertIn("m1_factor_perfect_square_expression", concepts["m1_quad_func_complete_square_for_vertex"]["prerequisite_ids"])

    def test_quadratic_function_new_misconception_risks_stay_low(self) -> None:
        concepts = concepts_by_id()

        expected_low = [
            "m1_mis_quadratic_a_sign_opening_direction",
            "m1_mis_quadratic_general_form_vertex_reading",
        ]
        for concept_id in expected_low:
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual("misconception_risk", concept["concept_type"])
                self.assertEqual("low", concept["confidence"])
                self.assertEqual([], concept["prerequisite_ids"])

    def test_quadratic_function_edges_are_directional_and_less_noisy(self) -> None:
        edges = edges_by_id()
        relationships = relationship_types_by_pair()

        expected_edges = [
            "m1_quad_func_quadratic_function__used_in__m1_quad_func_identifying_quadratic_function",
            "m1_quad_func_situation_to_formula__used_in__m1_quad_func_identifying_quadratic_function",
            "m1_quad_func_y_ax2_form__represented_by__m1_quad_func_y_ax2_graph",
            "m1_quad_func_value_table__used_in__m1_quad_func_y_ax2_graph",
            "m1_quad_func_vertex_form__represented_by__m1_quad_func_vertex_coordinates",
            "m1_quad_func_vertex_form__represented_by__m1_quad_func_axis_equation",
            "m1_quad_func_axis_equation__used_in__m1_quad_func_vertex_form_graph_reading",
            "m1_quad_func_vertex_coordinates__used_in__m1_quad_func_vertex_form_graph_reading",
            "m1_quad_func_vertex_form_graph_reading__used_in__m1_quad_func_graph_drawing",
            "m1_quad_func_opening_direction__used_in__m1_quad_func_graph_properties",
            "m1_quad_func_formula__contains__m1_quad_func_nonzero_a_condition",
            "m1_quad_func_coefficient_a__used_in__m1_quad_func_nonzero_a_condition",
            "m1_quad_func_nonzero_a_condition__used_in__m1_quad_func_identifying_quadratic_function",
            "m1_quad_func_y_ax2_form__used_in__m1_quad_func_y_ax2_axis_vertex",
            "m1_quad_func_y_ax2_axis_vertex__used_in__m1_quad_func_axis_equation",
            "m1_quad_func_y_ax2_axis_vertex__used_in__m1_quad_func_vertex_coordinates",
            "m1_quad_func_coefficient_a__used_in__m1_quad_func_a_sign_opening",
            "m1_quad_func_a_sign_opening__used_in__m1_quad_func_opening_direction",
            "m1_quad_func_a_abs_width__used_in__m1_quad_func_graph_properties",
            "m1_quad_func_axis_symmetry__used_in__m1_quad_func_graph_drawing",
            "m1_quad_func_axis_equation__used_in__m1_quad_func_choose_symmetric_x_values",
            "m1_quad_func_choose_symmetric_x_values__used_in__m1_quad_func_value_table_ordered_pairs",
            "m1_quad_func_choose_symmetric_x_values__used_in__m1_quad_func_graph_drawing",
            "m1_quad_func_value_table_ordered_pairs__used_in__m1_quad_func_plot_points_and_connect",
            "m1_quad_func_plot_points_and_connect__used_in__m1_quad_func_graph_drawing",
            "m1_quad_func_vertex_form__contains__m1_quad_func_vertex_form_p_sign_reading",
            "m1_quad_func_p_parameter_horizontal_shift__used_in__m1_quad_func_vertex_form_p_sign_reading",
            "m1_quad_func_vertex_form_p_sign_reading__used_in__m1_quad_func_axis_equation",
            "m1_quad_func_vertex_form_p_sign_reading__used_in__m1_quad_func_vertex_form_graph_reading",
            "m1_quad_func_p_parameter_horizontal_shift__used_in__m1_quad_func_vertex_form_graph_reading",
            "m1_quad_func_q_parameter_vertical_shift__used_in__m1_quad_func_vertex_form_graph_reading",
            "m1_quad_func_complete_square_for_vertex__used_in__m1_quad_func_general_to_vertex_form",
            "m1_quad_func_general_to_vertex_form__used_in__m1_quad_func_vertex_form_graph_reading",
            "m1_quad_func_vertex_y_extreme_value__used_in__m1_quad_func_opening_extreme_decision",
            "m1_quad_func_opening_extreme_decision__used_in__m1_quad_func_graph_properties",
            "m1_mis_quadratic_a_sign_opening_direction__often_confused_with__m1_quad_func_a_sign_opening",
            "m1_mis_quadratic_general_form_vertex_reading__often_confused_with__m1_quad_func_general_form",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

        noisy_prereq_edges = [
            "m1_quad_func_axis__prerequisite_for__m1_mis_axis_vertex",
            "m1_quad_func_vertex__prerequisite_for__m1_mis_axis_vertex",
            "m1_quad_func_max_min_real_scope__prerequisite_for__m1_mis_max_min_scope",
            "m1_quad_func_quadratic_function__prerequisite_for__m1_mis_quadratic_function_equation",
            "m1_quad_eq_quadratic_equation__prerequisite_for__m1_mis_quadratic_function_equation",
            "m1_quad_func_formula__contains__m1_quad_func_y_ax2_graph",
            "m1_quad_func_coefficient_a__prerequisite_for__m1_func_slope",
            "m1_quad_func_general_form__represented_by__m1_quad_func_vertex_coordinates",
            "m1_factor_perfect_square_expression__prerequisite_for__m1_quad_func_graph",
            "m1_quad_func_p_parameter_horizontal_shift__represented_by__m1_func_x_intercept",
            "m1_quad_func_q_parameter_vertical_shift__represented_by__m1_func_y_intercept",
            "m1_quad_func_a_abs_width__prerequisite_for__m1_data_correlation_strength",
            "m1_quad_func_a_sign_opening__prerequisite_for__m1_mis_quadratic_a_sign_opening_direction",
            "m1_quad_func_general_form__prerequisite_for__m1_mis_quadratic_general_form_vertex_reading",
            "m1_quad_func_nonzero_a_condition__prerequisite_for__m1_func_slope",
            "m1_quad_func_nonzero_a_condition__prerequisite_for__m1_mis_quadratic_function_equation",
            "m1_quad_func_y_ax2_axis_vertex__represented_by__m1_func_x_intercept",
            "m1_quad_func_vertex_form_p_sign_reading__represented_by__m1_func_x_intercept",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

        self.assertIn("contrasts_with", relationships[frozenset(["m1_quad_func_axis", "m1_quad_func_vertex"])])
        self.assertIn("represented_by", relationships[frozenset(["m1_quad_func_graph", "m1_quad_func_parabola"])])

    def test_research_report_ref_is_supplemental_without_confidence_upgrade(self) -> None:
        concepts = concepts_by_id()

        self.assertIn("p. 220", source_locators(concepts["m1_quad_func_quadratic_function"]))
        self.assertIn("p. 220", source_locators(concepts["m1_quad_func_graph"]))
        self.assertEqual("low", concepts["m1_mis_axis_vertex"]["confidence"])
        self.assertEqual("low", concepts["m1_mis_max_min_scope"]["confidence"])
        self.assertEqual("low", concepts["m1_mis_quadratic_function_equation"]["confidence"])
        self.assertNotIn("p. 220", source_locators(concepts["m1_mis_axis_vertex"]))


if __name__ == "__main__":
    unittest.main()
