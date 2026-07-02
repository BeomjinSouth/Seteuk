from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class DataVariabilityMicroconceptTests(unittest.TestCase):
    def test_variability_calculation_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_data_deviation_calculation": ("편차 구하기", "procedure", "medium"),
            "m1_data_deviation_formula": ("편차 계산식", "representation", "medium"),
            "m1_data_deviation_sum_zero": ("편차의 합은 0", "property", "low"),
            "m1_data_squared_deviation": ("편차의 제곱", "sub_concept", "medium"),
            "m1_data_sum_squared_deviation": ("편차의 제곱의 합", "sub_concept", "medium"),
            "m1_data_variance_calculation": ("분산 구하기", "procedure", "medium"),
            "m1_data_variance_formula": ("분산 계산식", "representation", "medium"),
            "m1_data_standard_deviation_calculation": ("표준편차 구하기", "procedure", "medium"),
            "m1_data_standard_deviation_formula": ("표준편차 계산식", "representation", "medium"),
            "m1_data_variability_calculation_table": ("산포도 계산 표", "representation", "low"),
            "m1_data_standard_deviation_unit": ("표준편차의 단위", "property", "low"),
            "m1_data_variability_magnitude_interpretation": ("산포도 값의 크기 해석", "procedure", "medium"),
            "m1_data_explain_distribution_with_variability": ("산포도로 자료의 분포 설명하기", "procedure", "high"),
            "m1_data_same_mean_different_spread": ("평균이 같은 두 분포의 흩어진 정도 비교", "sub_concept", "low"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("산포도", concept["unit"])
                self.assertIn("[9수04-07]", source_locators(concept))

        self.assertIn("m1_data_deviation_calculation", concepts["m1_data_variance"]["prerequisite_ids"])
        self.assertIn("m1_data_variance_calculation", concepts["m1_data_standard_deviation_calculation"]["prerequisite_ids"])
        self.assertIn("m1_data_variability_magnitude_interpretation", concepts["m1_data_compare_distributions_variability"]["prerequisite_ids"])

    def test_variability_edges_follow_calculation_flow(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_data_mean__used_in__m1_data_deviation_calculation",
            "m1_data_variable__used_in__m1_data_deviation_calculation",
            "m1_data_deviation_calculation__used_in__m1_data_deviation",
            "m1_data_deviation__represented_by__m1_data_deviation_formula",
            "m1_data_deviation__used_in__m1_data_deviation_sum_zero",
            "m1_data_deviation__used_in__m1_data_squared_deviation",
            "m1_data_deviation_sum_zero__related_to__m1_data_squared_deviation",
            "m1_calc_power__used_in__m1_data_squared_deviation",
            "m1_data_squared_deviation__used_in__m1_data_sum_squared_deviation",
            "m1_data_sum_squared_deviation__used_in__m1_data_variance_calculation",
            "m1_num_division__used_in__m1_data_variance_calculation",
            "m1_data_variance_calculation__represented_by__m1_data_variability_calculation_table",
            "m1_data_variance_calculation__used_in__m1_data_variance",
            "m1_data_variance__represented_by__m1_data_variance_formula",
            "m1_data_variance__used_in__m1_data_standard_deviation_calculation",
            "m1_num_square_root__used_in__m1_data_standard_deviation_calculation",
            "m1_data_standard_deviation_calculation__used_in__m1_data_standard_deviation",
            "m1_data_standard_deviation__represented_by__m1_data_standard_deviation_formula",
            "m1_data_standard_deviation__used_in__m1_data_standard_deviation_unit",
            "m1_data_standard_deviation__used_in__m1_data_variability_magnitude_interpretation",
            "m1_data_variability_magnitude_interpretation__used_in__m1_data_compare_distributions_variability",
            "m1_data_distribution__used_in__m1_data_explain_distribution_with_variability",
            "m1_data_calculate_variance_sd__used_in__m1_data_explain_distribution_with_variability",
            "m1_data_variability_magnitude_interpretation__used_in__m1_data_explain_distribution_with_variability",
            "m1_data_explain_distribution_with_variability__used_in__m1_data_compare_distributions_variability",
            "m1_data_same_mean_different_spread__used_in__m1_data_compare_distributions_variability",
        ]
        for edge_id in expected_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_variability_misconceptions_stay_low_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_low = [
            "m1_mis_deviation_as_absolute_distance",
            "m1_mis_sd_without_square_root",
            "m1_mis_same_mean_same_distribution",
            "m1_mis_variance_standard_deviation",
        ]
        for concept_id in expected_low:
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual("misconception_risk", concept["concept_type"])
                self.assertEqual("low", concept["confidence"])
                self.assertEqual([], concept["prerequisite_ids"])

        confusion_edges = [
            "m1_mis_deviation_as_absolute_distance__often_confused_with__m1_data_deviation",
            "m1_mis_deviation_as_absolute_distance__often_confused_with__m1_data_squared_deviation",
            "m1_mis_sd_without_square_root__often_confused_with__m1_data_standard_deviation_calculation",
            "m1_mis_sd_without_square_root__often_confused_with__m1_data_variance",
            "m1_mis_same_mean_same_distribution__often_confused_with__m1_data_same_mean_different_spread",
            "m1_mis_same_mean_same_distribution__often_confused_with__m1_data_compare_distributions_variability",
            "m1_mis_variance_standard_deviation__often_confused_with__m1_data_variance",
            "m1_mis_variance_standard_deviation__often_confused_with__m1_data_standard_deviation",
        ]
        for edge_id in confusion_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_variability_noisy_edges_are_absent(self) -> None:
        edges = edges_by_id()

        noisy_edges = [
            "m1_data_representative_unit__prerequisite_for__m1_data_variability_unit",
            "m1_data_frequency_unit__prerequisite_for__m1_data_variability_unit",
            "m1_data_variability_unit__prerequisite_for__m1_data_box_scatter_unit",
            "m1_data_technology_tool_stats__prerequisite_for__m1_data_calculate_variance_sd",
            "m1_data_variability__prerequisite_for__m1_data_mean",
            "m1_data_variability__prerequisite_for__m1_data_deviation",
            "m1_data_variability__prerequisite_for__m1_data_variance",
            "m1_data_variability__prerequisite_for__m1_data_standard_deviation",
            "m1_data_variance__equivalent_to__m1_data_standard_deviation",
            "m1_data_standard_deviation__equivalent_to__m1_data_variance",
            "m1_data_variability_calculation_table__represented_by__m1_data_variability",
            "m1_data_same_mean_different_spread__prerequisite_for__m1_data_mean",
            "m1_mis_variance_standard_deviation__prerequisite_for__m1_data_variance",
            "m1_data_variance__prerequisite_for__m1_mis_variance_standard_deviation",
            "m1_data_standard_deviation__prerequisite_for__m1_mis_variance_standard_deviation",
            "m1_mis_sd_without_square_root__prerequisite_for__m1_data_standard_deviation",
            "m1_data_box_plot_compare__prerequisite_for__m1_data_compare_distributions_variability",
        ]
        for edge_id in noisy_edges:
            with self.subTest(edge_id=edge_id):
                self.assertNotIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
