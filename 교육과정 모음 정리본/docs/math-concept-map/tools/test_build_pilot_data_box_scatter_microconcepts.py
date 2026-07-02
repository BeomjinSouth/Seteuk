from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class DataBoxScatterMicroconceptTests(unittest.TestCase):
    def test_box_plot_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_data_ordered_data_for_quartiles": ("사분위수를 구하기 위한 자료 정렬", "procedure", "medium"),
            "m1_data_quartile_calculation": ("사분위수 구하기", "procedure", "medium"),
            "m1_data_first_quartile": ("제1사분위수", "term", "medium"),
            "m1_data_second_quartile": ("제2사분위수", "term", "medium"),
            "m1_data_third_quartile": ("제3사분위수", "term", "medium"),
            "m1_data_minimum_value": ("최솟값", "term", "low"),
            "m1_data_maximum_value": ("최댓값", "term", "low"),
            "m1_data_box_plot_five_value_summary": ("상자그림의 다섯 값", "sub_concept", "medium"),
            "m1_data_interquartile_range": ("사분위범위", "term", "low"),
            "m1_data_box_plot_box": ("상자그림의 상자", "representation", "low"),
            "m1_data_box_plot_whisker": ("상자그림의 수염", "representation", "low"),
            "m1_data_box_plot_construction_tool": ("공학 도구로 상자그림 나타내기", "procedure", "high"),
            "m1_data_box_plot_center_spread_reading": ("상자그림에서 중심과 퍼짐 읽기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("상자그림과 산점도", concept["unit"])
                self.assertIn("[9수04-08]", source_locators(concept))

        self.assertIn("m1_data_ordered_data_for_quartiles", concepts["m1_data_quartile"]["prerequisite_ids"])
        self.assertIn("m1_data_quartile_calculation", concepts["m1_data_box_plot_construction_tool"]["prerequisite_ids"])
        self.assertIn("m1_data_box_plot_five_value_summary", concepts["m1_data_box_plot"]["prerequisite_ids"])
        self.assertIn("m1_data_interquartile_range", concepts["m1_data_box_plot_center_spread_reading"]["prerequisite_ids"])

    def test_scatter_plot_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_data_bivariate_pair": ("두 변량의 대응값", "sub_concept", "medium"),
            "m1_data_scatter_plot_axes_variables": ("산점도의 두 축과 변량", "sub_concept", "medium"),
            "m1_data_scatter_plot_point": ("산점도의 점", "representation", "medium"),
            "m1_data_scatter_plot_drawing": ("산점도로 나타내기", "procedure", "high"),
            "m1_data_scatter_plot_trend": ("산점도의 경향", "sub_concept", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("상자그림과 산점도", concept["unit"])
                self.assertIn("[9수04-09]", source_locators(concept))

        self.assertIn("m1_data_bivariate_pair", concepts["m1_data_scatter_plot"]["prerequisite_ids"])
        self.assertIn("m1_data_scatter_plot_trend", concepts["m1_data_correlation"]["prerequisite_ids"])
        self.assertIn("m1_data_scatter_plot_trend", concepts["m1_data_scatter_plot_interpretation"]["prerequisite_ids"])

    def test_box_scatter_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_data_variability_unit__related_to__m1_data_box_scatter_unit",
            "m1_data_technology_tool_stats__used_in__m1_data_box_scatter_unit",
            "m1_data_ordered_data_for_quartiles__used_in__m1_data_quartile_calculation",
            "m1_data_quartile_calculation__used_in__m1_data_box_plot_five_value_summary",
            "m1_data_quartile__contains__m1_data_first_quartile",
            "m1_data_quartile__contains__m1_data_second_quartile",
            "m1_data_quartile__contains__m1_data_third_quartile",
            "m1_data_second_quartile__equivalent_to__m1_data_median",
            "m1_data_box_plot_five_value_summary__represented_by__m1_data_box_plot",
            "m1_data_box_plot__contains__m1_data_box_plot_box",
            "m1_data_box_plot__contains__m1_data_box_plot_whisker",
            "m1_data_interquartile_range__represented_by__m1_data_box_plot_box",
            "m1_data_box_plot_construction_tool__used_in__m1_data_box_plot",
            "m1_data_box_plot_center_spread_reading__used_in__m1_data_box_plot_compare",
            "m1_data_bivariate_pair__represented_by__m1_coord_ordered_pair",
            "m1_data_bivariate_pair__represented_by__m1_data_scatter_plot_point",
            "m1_data_scatter_plot_drawing__used_in__m1_data_scatter_plot",
            "m1_data_scatter_plot_point__used_in__m1_data_scatter_plot_trend",
            "m1_data_scatter_plot_trend__used_in__m1_data_correlation",
            "m1_data_scatter_plot_trend__used_in__m1_data_scatter_plot_interpretation",
            "m1_data_positive_correlation__used_in__m1_data_scatter_plot_interpretation",
            "m1_data_negative_correlation__used_in__m1_data_scatter_plot_interpretation",
            "m1_data_no_correlation__used_in__m1_data_scatter_plot_interpretation",
        ]
        for edge_id in expected_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_box_scatter_misconceptions_stay_low_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_low = [
            "m1_mis_quartile_without_ordering",
            "m1_mis_box_plot_length_frequency",
            "m1_mis_scatter_axis_swap",
            "m1_mis_correlation_causation",
        ]
        for concept_id in expected_low:
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual("misconception_risk", concept["concept_type"])
                self.assertEqual("low", concept["confidence"])
                self.assertEqual([], concept["prerequisite_ids"])

        confusion_edges = [
            "m1_mis_quartile_without_ordering__often_confused_with__m1_data_ordered_data_for_quartiles",
            "m1_mis_quartile_without_ordering__often_confused_with__m1_data_quartile",
            "m1_mis_box_plot_length_frequency__often_confused_with__m1_data_box_plot_box",
            "m1_mis_box_plot_length_frequency__often_confused_with__m1_data_box_plot_whisker",
            "m1_mis_box_plot_length_frequency__often_confused_with__m1_data_box_plot_center_spread_reading",
            "m1_mis_scatter_axis_swap__often_confused_with__m1_data_scatter_plot_axes_variables",
            "m1_mis_scatter_axis_swap__often_confused_with__m1_data_bivariate_pair",
            "m1_mis_scatter_axis_swap__often_confused_with__m1_coord_ordered_pair",
            "m1_mis_correlation_causation__often_confused_with__m1_data_scatter_plot_interpretation",
        ]
        for edge_id in confusion_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_box_scatter_noisy_edges_are_absent(self) -> None:
        edges = edges_by_id()

        noisy_edges = [
            "m1_data_variability_unit__prerequisite_for__m1_data_box_scatter_unit",
            "m1_data_technology_tool_stats__prerequisite_for__m1_data_box_scatter_unit",
            "m1_data_technology_tool_stats__prerequisite_for__m1_data_box_plot",
            "m1_graph_graph__prerequisite_for__m1_data_scatter_plot",
            "m1_coord_coordinate_plane__represented_by__m1_data_scatter_plot",
            "m1_graph_graph__represented_by__m1_data_scatter_plot",
            "m1_data_correlation__prerequisite_for__m1_mis_correlation_causation",
            "m1_data_box_plot_compare__used_in__m1_data_box_plot",
            "m1_data_box_plot__used_in__m1_data_quartile",
        ]
        for edge_id in noisy_edges:
            with self.subTest(edge_id=edge_id):
                self.assertNotIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
