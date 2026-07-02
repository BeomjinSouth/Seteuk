from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class DataRepresentativeMicroconceptTests(unittest.TestCase):
    def test_mean_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_data_sum_of_values": ("자료값의 합", "term", "medium"),
            "m1_data_number_of_values": ("자료의 개수", "term", "medium"),
            "m1_data_mean_formula": ("평균 계산식", "representation", "medium"),
            "m1_data_mean_calculation": ("평균 구하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn("m1_data_representative_unit", concept["parent_ids"])
            self.assertIn("[9수04-01]", source_locators(concept))

        calculation = concepts["m1_data_mean_calculation"]
        self.assertIn("m1_data_sum_of_values", calculation["prerequisite_ids"])
        self.assertIn("m1_data_number_of_values", calculation["prerequisite_ids"])
        self.assertIn("m1_num_rational_number", calculation["prerequisite_ids"])

    def test_median_and_mode_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_data_ordered_data_for_median": ("중앙값을 구하기 위한 자료 정렬", "procedure", "medium"),
            "m1_data_middle_position": ("가운데 위치", "term", "medium"),
            "m1_data_median_odd_count": ("자료의 개수가 홀수일 때 중앙값", "procedure", "medium"),
            "m1_data_median_even_count": ("자료의 개수가 짝수일 때 중앙값", "procedure", "medium"),
            "m1_data_value_frequency_count": ("자료값의 도수 세기", "procedure", "medium"),
            "m1_data_mode_selection": ("최빈값 찾기", "procedure", "high"),
            "m1_data_no_mode": ("최빈값이 없는 경우", "property", "low"),
            "m1_data_multiple_modes": ("최빈값이 여러 개인 경우", "property", "low"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn("m1_data_representative_unit", concept["parent_ids"])
            self.assertIn("[9수04-01]", source_locators(concept))

        self.assertIn("m1_data_ordered_data_for_median", concepts["m1_data_median_odd_count"]["prerequisite_ids"])
        self.assertIn("m1_data_ordered_data_for_median", concepts["m1_data_median_even_count"]["prerequisite_ids"])
        self.assertIn("m1_data_mean", concepts["m1_data_median_even_count"]["prerequisite_ids"])
        self.assertIn("m1_data_value_frequency_count", concepts["m1_data_mode_selection"]["prerequisite_ids"])

    def test_representative_value_selection_context_is_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_data_representative_value_context": ("자료의 특성 살펴보기", "procedure", "high"),
            "m1_data_representative_value_usefulness_discussion": ("대푯값의 유용성 토론하기", "procedure", "high"),
            "m1_data_extreme_value": ("극단적인 값", "term", "low"),
            "m1_data_mean_sensitive_to_extreme_value": ("평균은 극단적인 값의 영향을 받음", "property", "low"),
            "m1_data_median_extreme_value_context": ("극단적인 값이 있는 자료에서 중앙값 고려하기", "procedure", "low"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn("m1_data_representative_unit", concept["parent_ids"])

        self.assertIn("[9수04-01]", source_locators(concepts["m1_data_representative_value_context"]))
        self.assertIn("교과서", concepts["m1_data_extreme_value"]["notes"])

    def test_representative_value_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_data_sum_of_values__used_in__m1_data_mean_calculation",
            "m1_data_number_of_values__used_in__m1_data_mean_calculation",
            "m1_data_mean__represented_by__m1_data_mean_formula",
            "m1_data_mean_calculation__used_in__m1_data_mean",
            "m1_data_ordered_data_for_median__used_in__m1_data_median",
            "m1_data_middle_position__used_in__m1_data_median",
            "m1_data_median_odd_count__used_in__m1_data_median",
            "m1_data_median_even_count__used_in__m1_data_median",
            "m1_data_value_frequency_count__used_in__m1_data_mode_selection",
            "m1_data_mode_selection__used_in__m1_data_mode",
            "m1_data_no_mode__contrasts_with__m1_data_mode",
            "m1_data_multiple_modes__related_to__m1_data_mode",
            "m1_data_representative_value_context__used_in__m1_data_choose_representative_value",
            "m1_data_representative_value_usefulness_discussion__used_in__m1_data_choose_representative_value",
            "m1_data_extreme_value__used_in__m1_data_mean_sensitive_to_extreme_value",
            "m1_data_mean_sensitive_to_extreme_value__used_in__m1_data_choose_representative_value",
            "m1_data_median_extreme_value_context__used_in__m1_data_choose_representative_value",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

    def test_representative_value_misconceptions_stay_low_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected = {
            "m1_mis_mean_only_representative": "대푯값을 평균으로만 보는 오류",
            "m1_mis_median_without_ordering": "자료를 정렬하지 않고 중앙값을 찾는 오류",
            "m1_mis_mode_largest_value": "최빈값을 가장 큰 값으로 보는 오류",
            "m1_mis_even_median_no_average": "짝수 개 자료에서 두 가운데 값 중 하나만 중앙값으로 보는 오류",
            "m1_mis_extreme_value_mean_choice": "극단적인 값이 있는 자료에서 평균만 선택하는 오류",
        }
        for concept_id, label in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual("misconception_risk", concept["concept_type"])
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])

        expected_confusions = [
            "m1_mis_mean_only_representative__often_confused_with__m1_data_choose_representative_value",
            "m1_mis_median_without_ordering__often_confused_with__m1_data_ordered_data_for_median",
            "m1_mis_mode_largest_value__often_confused_with__m1_data_mode",
            "m1_mis_even_median_no_average__often_confused_with__m1_data_median_even_count",
            "m1_mis_extreme_value_mean_choice__often_confused_with__m1_data_mean_sensitive_to_extreme_value",
        ]
        for edge_id in expected_confusions:
            self.assertIn(edge_id, edges)

    def test_representative_value_noisy_edges_are_absent(self) -> None:
        edges = edges_by_id()

        noisy_edges = [
            "m1_data_mean_formula__represented_by__m1_data_mean",
            "m1_data_representative_value__prerequisite_for__m1_mis_mean_only_representative",
            "m1_data_choose_representative_value__prerequisite_for__m1_mis_mean_only_representative",
            "m1_data_mean__prerequisite_for__m1_mis_extreme_value_mean_choice",
            "m1_data_median__prerequisite_for__m1_data_mode",
            "m1_data_mode__prerequisite_for__m1_data_median",
            "m1_data_extreme_value__prerequisite_for__m1_data_mean",
            "m1_data_mean_sensitive_to_extreme_value__prerequisite_for__m1_data_median",
        ]
        for edge_id in noisy_edges:
            self.assertNotIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
