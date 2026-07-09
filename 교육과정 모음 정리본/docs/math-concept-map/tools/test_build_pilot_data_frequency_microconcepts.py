from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class DataFrequencyMicroconceptTests(unittest.TestCase):
    def test_frequency_table_and_graphing_procedures_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_data_frequency_table_construction": ("도수분포표로 나타내기", "procedure", "high"),
            "m1_data_histogram_drawing": ("히스토그램으로 나타내기", "procedure", "high"),
            "m1_data_frequency_polygon_drawing": ("도수분포다각형으로 나타내기", "procedure", "high"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn("m1_data_frequency_unit", concept["parent_ids"])
            self.assertIn("p. 227", source_locators(concept))

        self.assertIn("m1_data_class", concepts["m1_data_frequency_table_construction"]["prerequisite_ids"])
        self.assertIn("m1_data_frequency", concepts["m1_data_frequency_table_construction"]["prerequisite_ids"])
        self.assertIn("m1_data_frequency_table", concepts["m1_data_histogram_drawing"]["prerequisite_ids"])
        self.assertIn("m1_data_class_width", concepts["m1_data_histogram_drawing"]["prerequisite_ids"])
        self.assertIn("m1_data_histogram", concepts["m1_data_frequency_polygon_drawing"]["prerequisite_ids"])
        self.assertIn("m1_data_class_mark", concepts["m1_data_frequency_polygon_drawing"]["prerequisite_ids"])

    def test_relative_frequency_microconcepts_are_separated(self) -> None:
        concepts = concepts_by_id()

        total_frequency = concepts["m1_data_total_frequency"]
        calculation = concepts["m1_data_relative_frequency_calculation"]
        comparison = concepts["m1_data_compare_groups_by_relative_frequency"]
        frequency_sum = concepts["m1_data_relative_frequency_sum"]

        self.assertEqual("총도수", total_frequency["label_ko"])
        self.assertEqual("term", total_frequency["concept_type"])
        self.assertEqual("medium", total_frequency["confidence"])
        self.assertIn("m1_data_frequency_unit", total_frequency["parent_ids"])
        self.assertIn("m1_data_frequency", total_frequency["prerequisite_ids"])
        self.assertIn("p. 227", source_locators(total_frequency))

        self.assertEqual("상대도수 구하기", calculation["label_ko"])
        self.assertEqual("procedure", calculation["concept_type"])
        self.assertEqual("high", calculation["confidence"])
        self.assertIn("m1_data_frequency", calculation["prerequisite_ids"])
        self.assertIn("m1_data_total_frequency", calculation["prerequisite_ids"])
        self.assertIn("m1_num_ratio", calculation["prerequisite_ids"])
        self.assertIn("p. 228", source_locators(calculation))

        self.assertEqual("상대도수로 두 집단의 분포 비교하기", comparison["label_ko"])
        self.assertEqual("procedure", comparison["concept_type"])
        self.assertEqual("medium", comparison["confidence"])
        self.assertIn("m1_data_relative_frequency_distribution", comparison["prerequisite_ids"])
        self.assertIn("m1_data_distribution_interpretation", comparison["prerequisite_ids"])
        self.assertIn("p. 227", source_locators(comparison))

        self.assertEqual("상대도수의 합", frequency_sum["label_ko"])
        self.assertEqual("property", frequency_sum["concept_type"])
        self.assertEqual("low", frequency_sum["confidence"])
        self.assertIn("m1_data_relative_frequency_distribution", frequency_sum["parent_ids"])
        self.assertIn("교과서", frequency_sum["notes"])

    def test_frequency_edges_are_directional_and_less_noisy(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_data_class__used_in__m1_data_frequency_table_construction",
            "m1_data_frequency__used_in__m1_data_frequency_table_construction",
            "m1_data_frequency_table_construction__used_in__m1_data_frequency_table",
            "m1_data_frequency_table__used_in__m1_data_histogram_drawing",
            "m1_data_histogram_drawing__used_in__m1_data_histogram",
            "m1_data_histogram__used_in__m1_data_frequency_polygon_drawing",
            "m1_data_class_mark__used_in__m1_data_frequency_polygon_drawing",
            "m1_data_frequency_polygon_drawing__used_in__m1_data_frequency_polygon",
            "m1_data_frequency__used_in__m1_data_relative_frequency_calculation",
            "m1_data_total_frequency__used_in__m1_data_relative_frequency_calculation",
            "m1_data_relative_frequency_calculation__used_in__m1_data_relative_frequency",
            "m1_data_relative_frequency_distribution__used_in__m1_data_compare_groups_by_relative_frequency",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

        noisy_prereq_edges = [
            "m1_data_critical_graph_reading__prerequisite_for__m1_mis_graph_scale_distortion",
            "m1_data_histogram__prerequisite_for__m1_mis_histogram_bar_graph",
            "m1_graph_graph__prerequisite_for__m1_mis_histogram_bar_graph",
            "m1_data_frequency__prerequisite_for__m1_mis_relative_frequency_frequency",
            "m1_data_relative_frequency__prerequisite_for__m1_mis_relative_frequency_frequency",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

    def test_research_report_refs_are_supplemental_without_confidence_upgrade(self) -> None:
        concepts = concepts_by_id()

        self.assertIn("p. 227", source_locators(concepts["m1_data_frequency_table"]))
        self.assertIn("p. 228", source_locators(concepts["m1_data_relative_frequency"]))
        self.assertIn("p. 228", source_locators(concepts["m1_data_statistical_inquiry_unit"]))

        self.assertEqual("low", concepts["m1_mis_graph_scale_distortion"]["confidence"])
        self.assertEqual("low", concepts["m1_mis_histogram_bar_graph"]["confidence"])
        self.assertEqual("low", concepts["m1_mis_relative_frequency_frequency"]["confidence"])
        self.assertNotIn("p. 227", source_locators(concepts["m1_mis_histogram_bar_graph"]))


if __name__ == "__main__":
    unittest.main()
