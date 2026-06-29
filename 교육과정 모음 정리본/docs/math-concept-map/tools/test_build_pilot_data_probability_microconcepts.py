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

    def test_probability_edges_are_directional_and_less_noisy(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_data_counting_cases__contains__m1_data_or_cases",
            "m1_data_counting_cases__contains__m1_data_and_cases",
            "m1_data_total_cases__used_in__m1_data_probability_by_case_ratio",
            "m1_data_event_cases_count__used_in__m1_data_probability_by_case_ratio",
            "m1_data_probability_by_case_ratio__used_in__m1_data_theoretical_probability",
            "m1_data_probability_by_case_ratio__used_in__m1_data_or_probability",
            "m1_data_probability_by_case_ratio__used_in__m1_data_and_probability",
            "m1_data_addition_counting__used_in__m1_data_or_cases",
            "m1_data_multiplication_counting__used_in__m1_data_and_cases",
            "m1_data_experimental_probability__represented_by__m1_data_relative_frequency",
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
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

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
