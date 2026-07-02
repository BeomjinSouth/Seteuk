from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(concept: dict) -> str:
    return " ".join(ref["locator"] for ref in concept["source_refs"])


class DataProbabilityMicroconceptTests(unittest.TestCase):
    def test_probability_case_ratio_microconcepts_are_preserved(self) -> None:
        concepts = concepts_by_id()

        total_cases = concepts["m1_data_total_cases"]
        event_cases = concepts["m1_data_event_cases_count"]
        calculation = concepts["m1_data_probability_by_case_ratio"]

        self.assertEqual(total_cases["label_ko"], "전체 경우의 수")
        self.assertEqual(total_cases["concept_type"], "sub_concept")
        self.assertEqual(total_cases["confidence"], "medium")
        self.assertIn("m1_data_theoretical_probability", total_cases["parent_ids"])
        self.assertIn("m1_data_counting_cases", total_cases["prerequisite_ids"])
        self.assertIn("p. 260", source_locators(total_cases))

        self.assertEqual(event_cases["label_ko"], "사건이 일어나는 경우의 수")
        self.assertEqual(event_cases["concept_type"], "sub_concept")
        self.assertEqual(event_cases["confidence"], "medium")
        self.assertIn("m1_data_theoretical_probability", event_cases["parent_ids"])
        self.assertIn("m1_data_event", event_cases["prerequisite_ids"])
        self.assertIn("m1_data_counting_cases", event_cases["prerequisite_ids"])
        self.assertIn("p. 260", source_locators(event_cases))

        self.assertEqual(calculation["label_ko"], "경우의 수의 비율로 확률 구하기")
        self.assertEqual(calculation["concept_type"], "procedure")
        self.assertEqual(calculation["confidence"], "medium")
        self.assertIn("m1_data_theoretical_probability", calculation["parent_ids"])
        self.assertIn("m1_data_total_cases", calculation["prerequisite_ids"])
        self.assertIn("m1_data_event_cases_count", calculation["prerequisite_ids"])
        self.assertIn("m1_num_ratio", calculation["prerequisite_ids"])
        self.assertIn("p. 260", source_locators(calculation))

    def test_probability_value_and_basic_property_microconcepts_are_preserved(self) -> None:
        concepts = concepts_by_id()

        probability_value = concepts["m1_data_probability_value"]
        probability_range = concepts["m1_data_probability_range_0_1"]
        zero_event = concepts["m1_data_zero_probability_event"]
        one_event = concepts["m1_data_one_probability_event"]

        self.assertEqual(probability_value["concept_type"], "sub_concept")
        self.assertEqual(probability_value["confidence"], "low")
        self.assertIn("m1_data_probability", probability_value["parent_ids"])

        self.assertEqual(probability_range["label_ko"], "확률의 범위")
        self.assertEqual(probability_range["concept_type"], "property")
        self.assertEqual(probability_range["confidence"], "medium")
        self.assertIn("m1_data_probability_basic_properties", probability_range["parent_ids"])
        self.assertIn("m1_data_probability_value", probability_range["prerequisite_ids"])

        self.assertEqual(zero_event["label_ko"], "확률이 0인 사건")
        self.assertEqual(zero_event["confidence"], "low")
        self.assertIn("불가능한 사건", zero_event["aliases"])
        self.assertIn("m1_data_probability_range_0_1", zero_event["prerequisite_ids"])

        self.assertEqual(one_event["label_ko"], "확률이 1인 사건")
        self.assertEqual(one_event["confidence"], "low")
        self.assertIn("반드시 일어나는 사건", one_event["aliases"])
        self.assertIn("m1_data_probability_range_0_1", one_event["prerequisite_ids"])

    def test_counting_foundation_and_listing_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_data_probability_unit": ("경우의 수와 확률", "core_concept", "high"),
            "m1_data_event": ("사건", "term", "high"),
            "m1_data_counting_cases": ("경우의 수", "procedure", "high"),
            "m1_data_possible_outcome": ("일어날 수 있는 경우", "sub_concept", "medium"),
            "m1_data_all_outcomes_listing": ("가능한 모든 경우 나열하기", "procedure", "medium"),
            "m1_data_counting_without_omission_duplication": ("빠짐없이 중복 없이 경우 세기", "procedure", "low"),
            "m1_data_case_classification": ("경우를 기준에 따라 나누기", "procedure", "medium"),
            "m1_data_counting_operation_choice": ("합하는 상황과 곱하는 상황 구별", "procedure", "medium"),
            "m1_data_event_case_selection": ("사건에 해당하는 경우 판별하기", "procedure", "medium"),
            "m1_data_equal_likelihood_check": ("동등 가능성 확인", "procedure", "medium"),
            "m1_data_route_path": ("이동 경로", "sub_concept", "medium"),
            "m1_data_no_repeated_point_condition": ("같은 지점을 두 번 이상 지나지 않는 조건", "property", "medium"),
            "m1_data_counting_table_tree_representation": ("표/수형도로 경우의 수 나타내기", "representation", "low"),
        }

        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(concept["label_ko"], label)
                self.assertEqual(concept["concept_type"], concept_type)
                self.assertEqual(concept["confidence"], confidence)

        self.assertIn("m1_data_relative_frequency", concepts["m1_data_probability_unit"]["prerequisite_ids"])
        self.assertIn("m1_num_rational_number", concepts["m1_data_probability_unit"]["prerequisite_ids"])
        self.assertIn("m1_data_event", concepts["m1_data_counting_cases"]["prerequisite_ids"])
        self.assertIn("m1_data_counting_cases", concepts["m1_data_possible_outcome"]["parent_ids"])
        self.assertIn("m1_data_possible_outcome", concepts["m1_data_all_outcomes_listing"]["prerequisite_ids"])
        self.assertIn("m1_data_all_outcomes_listing", concepts["m1_data_counting_without_omission_duplication"]["prerequisite_ids"])
        self.assertIn("m1_data_addition_counting", concepts["m1_data_counting_operation_choice"]["related_ids"])
        self.assertIn("m1_data_multiplication_counting", concepts["m1_data_counting_operation_choice"]["related_ids"])
        self.assertIn("m1_data_all_outcomes_listing", concepts["m1_data_event_case_selection"]["prerequisite_ids"])
        self.assertIn("m1_data_equally_likely_assumption", concepts["m1_data_equal_likelihood_check"]["prerequisite_ids"])
        self.assertIn("p. 260", source_locators(concepts["m1_data_possible_outcome"]))
        self.assertIn("p. 266", source_locators(concepts["m1_data_route_path"]))
        self.assertIn("p. 266", source_locators(concepts["m1_data_no_repeated_point_condition"]))

    def test_probability_formula_complement_and_risk_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_data_probability_formula": ("확률의 계산식", "representation", "medium"),
            "m1_data_probability_fraction_expression": ("확률의 분수 표현", "representation", "medium"),
            "m1_data_probability_numerator_denominator": ("확률식의 분자와 분모", "sub_concept", "medium"),
            "m1_data_event_not_occur_cases_count": ("사건이 일어나지 않는 경우의 수", "sub_concept", "low"),
            "m1_data_complement_probability": ("사건이 일어나지 않을 확률", "property", "low"),
            "m1_data_probability_comparison": ("확률 비교하기", "procedure", "low"),
            "m1_mis_total_event_cases_swap": ("전체 경우의 수와 사건이 일어나는 경우의 수를 바꾸는 오류", "misconception_risk", "low"),
            "m1_mis_or_overlap_double_counting": ("또는의 경우를 중복 세는 오류", "misconception_risk", "low"),
            "m1_mis_probability_out_of_range": ("확률을 0보다 작거나 1보다 크게 쓰는 오류", "misconception_risk", "low"),
        }

        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(concept["label_ko"], label)
                self.assertEqual(concept["concept_type"], concept_type)
                self.assertEqual(concept["confidence"], confidence)

        self.assertIn("m1_data_probability_by_case_ratio", concepts["m1_data_probability_formula"]["parent_ids"])
        self.assertIn("m1_data_total_cases", concepts["m1_data_probability_numerator_denominator"]["prerequisite_ids"])
        self.assertIn("m1_data_event_cases_count", concepts["m1_data_probability_numerator_denominator"]["prerequisite_ids"])
        self.assertIn("m1_data_event_not_occur_cases_count", concepts["m1_data_complement_probability"]["prerequisite_ids"])
        self.assertIn("m1_data_probability_range_0_1", concepts["m1_data_probability_comparison"]["prerequisite_ids"])
        self.assertIn("p. 260", source_locators(concepts["m1_data_probability_formula"]))
        self.assertIn("p. 260", source_locators(concepts["m1_data_probability_numerator_denominator"]))
        self.assertEqual(concepts["m1_mis_total_event_cases_swap"]["prerequisite_ids"], [])
        self.assertEqual(concepts["m1_mis_or_overlap_double_counting"]["prerequisite_ids"], [])
        self.assertEqual(concepts["m1_mis_probability_out_of_range"]["prerequisite_ids"], [])

    def test_probability_edges_are_directional_and_less_noisy(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_data_counting_cases__contains__m1_data_or_cases",
            "m1_data_counting_cases__contains__m1_data_and_cases",
            "m1_data_counting_cases__contains__m1_data_possible_outcome",
            "m1_data_counting_cases__represented_by__m1_data_counting_table_tree_representation",
            "m1_data_possible_outcome__used_in__m1_data_all_outcomes_listing",
            "m1_data_possible_outcome__used_in__m1_data_total_cases",
            "m1_data_possible_outcome__used_in__m1_data_event_cases_count",
            "m1_data_all_outcomes_listing__used_in__m1_data_total_cases",
            "m1_data_all_outcomes_listing__used_in__m1_data_event_case_selection",
            "m1_data_counting_without_omission_duplication__used_in__m1_data_counting_cases",
            "m1_data_case_classification__used_in__m1_data_counting_without_omission_duplication",
            "m1_data_case_classification__used_in__m1_data_addition_counting",
            "m1_data_case_classification__used_in__m1_data_and_cases",
            "m1_data_counting_operation_choice__used_in__m1_data_addition_counting",
            "m1_data_counting_operation_choice__used_in__m1_data_multiplication_counting",
            "m1_data_counting_operation_choice__used_in__m1_data_or_cases",
            "m1_data_counting_operation_choice__used_in__m1_data_and_cases",
            "m1_data_event_case_selection__used_in__m1_data_event_cases_count",
            "m1_data_event_case_selection__used_in__m1_data_probability_by_case_ratio",
            "m1_data_equal_likelihood_check__used_in__m1_data_probability_by_case_ratio",
            "m1_data_route_path__used_in__m1_data_route_counting_context",
            "m1_data_route_path__used_in__m1_data_or_cases",
            "m1_data_route_path__used_in__m1_data_and_cases",
            "m1_data_no_repeated_point_condition__used_in__m1_data_route_counting_context",
            "m1_data_no_repeated_point_condition__used_in__m1_data_counting_without_omission_duplication",
            "m1_data_total_cases__used_in__m1_data_probability_by_case_ratio",
            "m1_data_event_cases_count__used_in__m1_data_probability_by_case_ratio",
            "m1_data_probability_by_case_ratio__used_in__m1_data_theoretical_probability",
            "m1_data_probability_by_case_ratio__used_in__m1_data_or_probability",
            "m1_data_probability_by_case_ratio__used_in__m1_data_and_probability",
            "m1_data_probability_by_case_ratio__represented_by__m1_data_probability_formula",
            "m1_data_probability_formula__represented_by__m1_data_probability_fraction_expression",
            "m1_data_probability_numerator_denominator__used_in__m1_data_probability_formula",
            "m1_data_probability_numerator_denominator__used_in__m1_data_probability_fraction_expression",
            "m1_data_event_not_occur_cases_count__used_in__m1_data_complement_probability",
            "m1_data_complement_probability__used_in__m1_data_probability_basic_properties",
            "m1_data_probability_range_0_1__used_in__m1_data_probability_comparison",
            "m1_data_addition_counting__used_in__m1_data_or_cases",
            "m1_data_multiplication_counting__used_in__m1_data_and_cases",
            "m1_data_experimental_probability__represented_by__m1_data_relative_frequency",
            "m1_mis_total_event_cases_swap__often_confused_with__m1_data_total_cases",
            "m1_mis_total_event_cases_swap__often_confused_with__m1_data_event_cases_count",
            "m1_mis_or_overlap_double_counting__often_confused_with__m1_data_or_cases",
            "m1_mis_probability_out_of_range__often_confused_with__m1_data_probability_range_0_1",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

        self.assertNotIn("m1_data_relative_frequency__represented_by__m1_data_experimental_probability", edges)
        self.assertNotIn("m1_data_and_cases__contrasts_with__m1_data_or_cases", edges)
        self.assertNotIn("m1_data_or_cases__used_in__m1_data_addition_counting", edges)
        self.assertNotIn("m1_data_and_cases__used_in__m1_data_multiplication_counting", edges)

        noisy_prereq_edges = [
            "m1_data_or_cases__prerequisite_for__m1_mis_or_and_counting_confusion",
            "m1_data_and_cases__prerequisite_for__m1_mis_or_and_counting_confusion",
            "m1_data_counting_cases__prerequisite_for__m1_mis_permutation_combination_scope",
            "m1_data_theoretical_probability__prerequisite_for__m1_mis_probability_no_equal_likely",
            "m1_data_equally_likely_assumption__prerequisite_for__m1_mis_probability_no_equal_likely",
            "m1_data_addition_counting__prerequisite_for__m1_mis_or_and_counting_confusion",
            "m1_data_multiplication_counting__prerequisite_for__m1_mis_or_and_counting_confusion",
            "m1_mis_or_and_counting_confusion__prerequisite_for__m1_data_or_cases",
            "m1_mis_or_and_counting_confusion__prerequisite_for__m1_data_and_cases",
            "m1_data_probability_by_case_ratio__prerequisite_for__m1_mis_probability_no_equal_likely",
            "m1_mis_probability_no_equal_likely__prerequisite_for__m1_data_probability_by_case_ratio",
            "m1_data_addition_counting__prerequisite_for__m1_mis_permutation_combination_scope",
            "m1_data_multiplication_counting__prerequisite_for__m1_mis_permutation_combination_scope",
            "m1_data_theoretical_probability__used_in__m1_data_probability_by_case_ratio",
            "m1_data_probability__used_in__m1_data_relative_frequency_case_ratio_link",
            "m1_data_total_cases__prerequisite_for__m1_mis_total_event_cases_swap",
            "m1_data_event_cases_count__prerequisite_for__m1_mis_total_event_cases_swap",
            "m1_data_probability_range_0_1__prerequisite_for__m1_mis_probability_out_of_range",
            "m1_data_probability_formula__used_in__m1_data_probability_by_case_ratio",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

    def test_probability_misconceptions_stay_low_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_risks = [
            "m1_mis_or_and_counting_confusion",
            "m1_mis_probability_no_equal_likely",
            "m1_mis_permutation_combination_scope",
            "m1_mis_total_event_cases_swap",
            "m1_mis_or_overlap_double_counting",
            "m1_mis_probability_out_of_range",
        ]

        for concept_id in expected_risks:
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(concept["concept_type"], "misconception_risk")
                self.assertEqual(concept["confidence"], "low")
                self.assertEqual(concept["prerequisite_ids"], [])

        expected_confusion_edges = [
            "m1_mis_or_and_counting_confusion__often_confused_with__m1_data_or_cases",
            "m1_mis_or_and_counting_confusion__often_confused_with__m1_data_and_cases",
            "m1_mis_or_and_counting_confusion__often_confused_with__m1_data_addition_counting",
            "m1_mis_or_and_counting_confusion__often_confused_with__m1_data_multiplication_counting",
            "m1_mis_probability_no_equal_likely__often_confused_with__m1_data_equally_likely_assumption",
            "m1_mis_probability_no_equal_likely__often_confused_with__m1_data_probability_by_case_ratio",
            "m1_mis_probability_no_equal_likely__often_confused_with__m1_data_theoretical_probability",
            "m1_mis_permutation_combination_scope__often_confused_with__m1_data_counting_cases",
            "m1_mis_permutation_combination_scope__often_confused_with__m1_data_addition_counting",
            "m1_mis_permutation_combination_scope__often_confused_with__m1_data_multiplication_counting",
            "m1_mis_total_event_cases_swap__often_confused_with__m1_data_total_cases",
            "m1_mis_total_event_cases_swap__often_confused_with__m1_data_event_cases_count",
            "m1_mis_or_overlap_double_counting__often_confused_with__m1_data_or_cases",
            "m1_mis_or_overlap_double_counting__often_confused_with__m1_data_case_classification",
            "m1_mis_probability_out_of_range__often_confused_with__m1_data_probability_range_0_1",
            "m1_mis_probability_out_of_range__often_confused_with__m1_data_probability_value",
        ]
        for edge_id in expected_confusion_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)
                self.assertEqual(edges[edge_id]["relationship_type"], "often_confused_with")
                self.assertEqual(edges[edge_id]["confidence"], "low")

    def test_research_report_source_refs_are_applied_without_confidence_upgrade(self) -> None:
        concepts = concepts_by_id()

        and_cases = concepts["m1_data_and_cases"]
        or_probability = concepts["m1_data_or_probability"]
        and_probability = concepts["m1_data_and_probability"]
        route_context = concepts["m1_data_route_counting_context"]
        or_and_misconception = concepts["m1_mis_or_and_counting_confusion"]

        self.assertEqual(and_cases["confidence"], "medium")
        self.assertIn("p. 228", source_locators(and_cases))
        self.assertIn("p. 240", source_locators(and_cases))
        self.assertIn("p. 266", source_locators(and_cases))

        self.assertEqual(or_probability["confidence"], "medium")
        self.assertIn("p. 240", source_locators(or_probability))
        self.assertIn("p. 260", source_locators(or_probability))

        self.assertEqual(and_probability["confidence"], "medium")
        self.assertIn("p. 240", source_locators(and_probability))
        self.assertIn("p. 260", source_locators(and_probability))

        self.assertEqual(route_context["confidence"], "medium")
        self.assertIn("p. 266", source_locators(route_context))
        self.assertIn("p. 267", source_locators(route_context))

        self.assertEqual(or_and_misconception["confidence"], "low")
        self.assertIn("p. 266", source_locators(or_and_misconception))


if __name__ == "__main__":
    unittest.main()
