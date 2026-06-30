from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_ids(item: dict) -> set[str]:
    return {ref["source_id"] for ref in item["source_refs"]}


class BasicGeometryMicroconceptTests(unittest.TestCase):
    def test_basic_geometry_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_basic_figure_notation": ("representation", "medium"),
            "m1_geo_position_relation_explanation": ("procedure", "high"),
            "m1_geo_identify_corresponding_alternate_angles": ("procedure", "high"),
            "m1_geo_parallel_angle_measure_calculation": ("procedure", "high"),
            "m1_geo_parallel_angle_property_explanation": ("procedure", "medium"),
            "m1_geo_transversal_line_context": ("sub_concept", "medium"),
            "m1_geo_angle_measure": ("term", "high"),
            "m1_geo_corresponding_angles_equal": ("property", "high"),
            "m1_geo_alternate_interior_angles_equal": ("property", "high"),
            "m1_geo_line_segment": ("term", "low"),
            "m1_geo_ray": ("term", "low"),
            "m1_geo_coplanar_condition": ("property", "low"),
        }

        for concept_id, (concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("기본 도형", concept["unit"])
                self.assertIn("m1_geo_basic_unit", concept["parent_ids"])
                self.assertTrue(concept["source_refs"])

        self.assertEqual(
            {"curriculum_math_2022", "achievement_math_2022"},
            source_ids(concepts["m1_geo_position_relation_explanation"]),
        )
        self.assertEqual(
            {"curriculum_math_2022", "achievement_math_2022"},
            source_ids(concepts["m1_geo_parallel_angle_measure_calculation"]),
        )

    def test_basic_geometry_procedure_and_property_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_geo_basic_unit__contains__m1_geo_basic_figure_notation",
            "m1_geo_basic_unit__contains__m1_geo_position_relation_explanation",
            "m1_geo_basic_unit__contains__m1_geo_identify_corresponding_alternate_angles",
            "m1_geo_basic_unit__contains__m1_geo_parallel_angle_measure_calculation",
            "m1_geo_basic_unit__contains__m1_geo_parallel_angle_property_explanation",
            "m1_geo_basic_unit__contains__m1_geo_transversal_line_context",
            "m1_geo_basic_unit__contains__m1_geo_angle_measure",
            "m1_geo_basic_unit__contains__m1_geo_corresponding_angles_equal",
            "m1_geo_basic_unit__contains__m1_geo_alternate_interior_angles_equal",
            "m1_geo_point__used_in__m1_geo_basic_figure_notation",
            "m1_geo_line__used_in__m1_geo_basic_figure_notation",
            "m1_geo_plane__used_in__m1_geo_basic_figure_notation",
            "m1_geo_angle__used_in__m1_geo_basic_figure_notation",
            "m1_geo_intersection_point__used_in__m1_geo_position_relation",
            "m1_geo_intersection_line__used_in__m1_geo_position_relation",
            "m1_geo_skew_lines__used_in__m1_geo_position_relation",
            "m1_geo_position_relation__used_in__m1_geo_position_relation_explanation",
            "m1_geo_transversal_line_context__used_in__m1_geo_corresponding_angles",
            "m1_geo_transversal_line_context__used_in__m1_geo_alternate_interior_angles",
            "m1_geo_parallel_lines__used_in__m1_geo_parallel_angle_properties",
            "m1_geo_corresponding_angles__used_in__m1_geo_identify_corresponding_alternate_angles",
            "m1_geo_alternate_interior_angles__used_in__m1_geo_identify_corresponding_alternate_angles",
            "m1_geo_identify_corresponding_alternate_angles__used_in__m1_geo_parallel_angle_measure_calculation",
            "m1_geo_angle_measure__used_in__m1_geo_parallel_angle_measure_calculation",
            "m1_geo_corresponding_angles_equal__used_in__m1_geo_parallel_angle_properties",
            "m1_geo_alternate_interior_angles_equal__used_in__m1_geo_parallel_angle_properties",
            "m1_geo_parallel_angle_properties__used_in__m1_geo_parallel_angle_measure_calculation",
            "m1_geo_parallel_angle_properties__used_in__m1_geo_parallel_angle_property_explanation",
            "m1_geo_coplanar_condition__contrasts_with__m1_geo_skew_lines",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

        removed_edges = [
            "m1_geo_position_relation__used_in__m1_geo_intersection_point",
            "m1_geo_position_relation__used_in__m1_geo_intersection_line",
            "m1_geo_position_relation__used_in__m1_geo_skew_lines",
            "m1_geo_parallel_lines__used_in__m1_geo_corresponding_angles",
            "m1_geo_parallel_lines__used_in__m1_geo_alternate_interior_angles",
            "m1_geo_parallel_lines__prerequisite_for__m1_geo_corresponding_angles",
            "m1_geo_parallel_lines__prerequisite_for__m1_geo_alternate_interior_angles",
        ]
        for edge_id in removed_edges:
            self.assertNotIn(edge_id, edges)

    def test_basic_geometry_misconceptions_remain_low_confidence_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        for concept_id in [
            "m1_mis_corresponding_alternate_angles",
            "m1_mis_skew_parallel_lines",
            "m1_mis_tangent_radius",
        ]:
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual("misconception_risk", concept["concept_type"])
                self.assertEqual("low", concept["confidence"])
                self.assertEqual([], concept["prerequisite_ids"])

        noisy_edges = [
            "m1_geo_corresponding_angles__prerequisite_for__m1_mis_corresponding_alternate_angles",
            "m1_geo_alternate_interior_angles__prerequisite_for__m1_mis_corresponding_alternate_angles",
            "m1_geo_parallel_lines__prerequisite_for__m1_mis_skew_parallel_lines",
            "m1_geo_skew_lines__prerequisite_for__m1_mis_skew_parallel_lines",
            "m1_geo_tangent_property__prerequisite_for__m1_mis_tangent_radius",
            "m1_geo_perpendicular__prerequisite_for__m1_mis_tangent_radius",
        ]
        for edge_id in noisy_edges:
            self.assertNotIn(edge_id, edges)

        confusion_edges = [
            "m1_mis_corresponding_alternate_angles__often_confused_with__m1_geo_corresponding_angles",
            "m1_mis_corresponding_alternate_angles__often_confused_with__m1_geo_alternate_interior_angles",
            "m1_mis_skew_parallel_lines__often_confused_with__m1_geo_skew_lines",
            "m1_mis_skew_parallel_lines__often_confused_with__m1_geo_parallel_lines",
            "m1_mis_tangent_radius__often_confused_with__m1_geo_tangent_property",
        ]
        for edge_id in confusion_edges:
            self.assertIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
