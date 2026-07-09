from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class TrigMicroconceptTests(unittest.TestCase):
    def test_trig_definition_parts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_trig_reference_angle": ("삼각비의 기준각", "term", "medium"),
            "m1_geo_trig_hypotenuse": ("삼각비에서의 빗변", "term", "medium"),
            "m1_geo_trig_opposite_side": ("기준각의 대변", "term", "medium"),
            "m1_geo_trig_adjacent_side": ("기준각의 이웃변", "term", "medium"),
            "m1_geo_sine_ratio_formula": ("사인의 비 표현", "representation", "medium"),
            "m1_geo_cosine_ratio_formula": ("코사인의 비 표현", "representation", "medium"),
            "m1_geo_tangent_ratio_formula": ("탄젠트의 비 표현", "representation", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertEqual("삼각비", concept["unit"])
            self.assertIn("[9수03-16]", source_locators(concept))

        self.assertIn("m1_geo_trigonometric_ratio", concepts["m1_geo_trig_reference_angle"]["parent_ids"])
        self.assertIn("m1_geo_trigonometric_ratio", concepts["m1_geo_trig_hypotenuse"]["parent_ids"])
        self.assertIn("m1_geo_trigonometric_ratio", concepts["m1_geo_trig_opposite_side"]["parent_ids"])
        self.assertIn("m1_geo_trigonometric_ratio", concepts["m1_geo_trig_adjacent_side"]["parent_ids"])
        self.assertIn("m1_geo_sine", concepts["m1_geo_sine_ratio_formula"]["parent_ids"])
        self.assertIn("m1_geo_cosine", concepts["m1_geo_cosine_ratio_formula"]["parent_ids"])
        self.assertIn("m1_geo_tangent_ratio", concepts["m1_geo_tangent_ratio_formula"]["parent_ids"])

    def test_trig_value_and_application_procedures_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_trig_value_table": ("삼각비의 값 표", "representation", "medium", "[9수03-16]"),
            "m1_geo_special_angle_value_lookup": ("특수각 삼각비 값 찾기", "procedure", "medium", "[9수03-16]"),
            "m1_geo_trig_select_ratio_for_unknown": ("구하려는 길이에 맞는 삼각비 선택하기", "procedure", "medium", "[9수03-17]"),
            "m1_geo_trig_distance_height_modeling": ("거리와 높이 문제를 직각삼각형으로 나타내기", "procedure", "medium", "[9수03-17]"),
        }
        for concept_id, (label, concept_type, confidence, locator) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertEqual("삼각비", concept["unit"])
            self.assertIn(locator, source_locators(concept))

        self.assertIn("m1_geo_special_angles_30_45_60", concepts["m1_geo_trig_value_table"]["parent_ids"])
        self.assertIn("m1_geo_right_triangle_trig_value", concepts["m1_geo_special_angle_value_lookup"]["parent_ids"])
        self.assertIn("m1_geo_right_triangle_trig_value", concepts["m1_geo_trig_select_ratio_for_unknown"]["parent_ids"])
        self.assertIn("m1_geo_trig_distance_height", concepts["m1_geo_trig_distance_height_modeling"]["parent_ids"])

    def test_trig_microconcept_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_geo_trigonometric_ratio__contains__m1_geo_trig_reference_angle",
            "m1_geo_trigonometric_ratio__contains__m1_geo_trig_hypotenuse",
            "m1_geo_trigonometric_ratio__contains__m1_geo_trig_opposite_side",
            "m1_geo_trigonometric_ratio__contains__m1_geo_trig_adjacent_side",
            "m1_geo_sine__contains__m1_geo_sine_ratio_formula",
            "m1_geo_cosine__contains__m1_geo_cosine_ratio_formula",
            "m1_geo_tangent_ratio__contains__m1_geo_tangent_ratio_formula",
            "m1_geo_special_angles_30_45_60__contains__m1_geo_trig_value_table",
            "m1_geo_right_triangle_trig_value__contains__m1_geo_special_angle_value_lookup",
            "m1_geo_right_triangle_trig_value__contains__m1_geo_trig_select_ratio_for_unknown",
            "m1_geo_trig_distance_height__contains__m1_geo_trig_distance_height_modeling",
            "m1_geo_sine__represented_by__m1_geo_sine_ratio_formula",
            "m1_geo_cosine__represented_by__m1_geo_cosine_ratio_formula",
            "m1_geo_tangent_ratio__represented_by__m1_geo_tangent_ratio_formula",
            "m1_geo_special_angles_30_45_60__represented_by__m1_geo_trig_value_table",
            "m1_geo_trig_reference_angle__used_in__m1_geo_sine_ratio_formula",
            "m1_geo_trig_opposite_side__used_in__m1_geo_sine_ratio_formula",
            "m1_geo_trig_hypotenuse__used_in__m1_geo_sine_ratio_formula",
            "m1_geo_trig_adjacent_side__used_in__m1_geo_cosine_ratio_formula",
            "m1_geo_trig_opposite_side__used_in__m1_geo_tangent_ratio_formula",
            "m1_geo_sine_ratio_formula__used_in__m1_geo_right_triangle_trig_value",
            "m1_geo_cosine_ratio_formula__used_in__m1_geo_right_triangle_trig_value",
            "m1_geo_tangent_ratio_formula__used_in__m1_geo_right_triangle_trig_value",
            "m1_geo_trig_value_table__used_in__m1_geo_special_angle_value_lookup",
            "m1_geo_special_angle_value_lookup__used_in__m1_geo_right_triangle_trig_value",
            "m1_geo_trig_distance_height_modeling__used_in__m1_geo_trig_distance_height",
            "m1_geo_trig_select_ratio_for_unknown__used_in__m1_geo_trig_distance_height",
        ]
        for edge_id in expected_edges:
            if edge_id not in edges:
                self.fail(f"Missing edge: {edge_id}")

    def test_trig_misconceptions_stay_low_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_low = {
            "m1_mis_trig_angle_scope": "m1_geo_trigonometric_ratio",
            "m1_mis_trig_relation_scope": "m1_geo_trigonometric_ratio",
            "m1_mis_trig_opposite_adjacent_swap": "m1_geo_trig_opposite_side",
        }
        for misconception_id, target_id in expected_low.items():
            concept = concepts[misconception_id]
            self.assertEqual("misconception_risk", concept["concept_type"])
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])
            expected_edge = f"{misconception_id}__often_confused_with__{target_id}"
            if expected_edge not in edges:
                self.fail(f"Missing edge: {expected_edge}")

        noisy_edges = [
            "m1_geo_sine__prerequisite_for__m1_mis_trig_relation_scope",
            "m1_geo_cosine__prerequisite_for__m1_mis_trig_relation_scope",
            "m1_geo_tangent_ratio__prerequisite_for__m1_mis_trig_relation_scope",
            "m1_geo_trigonometric_ratio__prerequisite_for__m1_mis_trig_angle_scope",
            "m1_geo_trig_opposite_side__prerequisite_for__m1_mis_trig_opposite_adjacent_swap",
        ]
        for edge_id in noisy_edges:
            self.assertNotIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
