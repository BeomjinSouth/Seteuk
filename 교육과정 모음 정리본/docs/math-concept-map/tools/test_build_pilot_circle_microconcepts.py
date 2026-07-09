from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class CircleMicroconceptTests(unittest.TestCase):
    def test_chord_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_chord_center_distance": ("sub_concept", "medium", "[9수03-18]"),
            "m1_geo_chord_center_perpendicular_bisects": ("property", "medium", "[9수03-18]"),
            "m1_geo_chord_midpoint_center_perpendicular": ("property", "medium", "[9수03-18]"),
            "m1_geo_equal_chords_equal_center_distance": ("property", "medium", "[9수03-18]"),
            "m1_geo_equal_center_distance_equal_chords": ("property", "medium", "[9수03-18]"),
        }
        for concept_id, (concept_type, confidence, locator) in expected.items():
            with self.subTest(concept_id=concept_id):
                self.assertIn(concept_id, concepts)
                concept = concepts[concept_id]
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("원의 성질", concept["unit"])
                self.assertIn(locator, source_locators(concept))
                self.assertIn("m1_geo_circle_chord_property", concept["parent_ids"])

        self.assertIn("m1_geo_perpendicular", concepts["m1_geo_chord_center_perpendicular_bisects"]["prerequisite_ids"])
        self.assertIn("m1_geo_chord_center_distance", concepts["m1_geo_equal_chords_equal_center_distance"]["prerequisite_ids"])

    def test_tangent_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_circle_radius": ("term", "medium", "[9수03-18]"),
            "m1_geo_tangent_radius_perpendicular": ("property", "high", "[9수03-18]"),
            "m1_geo_equal_tangent_lengths_from_point": ("property", "medium", "[9수03-18]"),
        }
        for concept_id, (concept_type, confidence, locator) in expected.items():
            with self.subTest(concept_id=concept_id):
                self.assertIn(concept_id, concepts)
                concept = concepts[concept_id]
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("원의 성질", concept["unit"])
                self.assertIn(locator, source_locators(concept))

        self.assertIn("m1_geo_circle_radius", concepts["m1_geo_tangent_radius_perpendicular"]["prerequisite_ids"])
        self.assertIn("m1_geo_tangent_length", concepts["m1_geo_equal_tangent_lengths_from_point"]["parent_ids"])

    def test_inscribed_angle_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_inscribed_angle_subtended_arc": ("sub_concept", "medium", "[9수03-19]"),
            "m1_geo_same_arc": ("sub_concept", "medium", "[9수03-19]"),
            "m1_geo_same_chord": ("sub_concept", "medium", "[9수03-18]"),
            "m1_geo_same_arc_inscribed_angles_equal": ("property", "high", "[9수03-19]"),
            "m1_geo_same_arc_same_chord_relation": ("property", "medium", "[9수03-19]"),
            "m1_geo_central_inscribed_angle_relation": ("property", "medium", "[9수03-19]"),
            "m1_geo_semicircle_arc": ("term", "low", "[9수03-19]"),
            "m1_geo_semicircle_inscribed_angle_right": ("property", "medium", "[9수03-19]"),
            "m1_geo_circle_property_evidence_selection": ("procedure", "medium", "[9수03-19]"),
            "m1_geo_circle_auxiliary_radius_center": ("procedure", "low", "[9수03-19]"),
        }
        for concept_id, (concept_type, confidence, locator) in expected.items():
            with self.subTest(concept_id=concept_id):
                self.assertIn(concept_id, concepts)
                concept = concepts[concept_id]
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("원의 성질", concept["unit"])
                self.assertIn(locator, source_locators(concept))

        self.assertIn("m1_geo_inscribed_angle_property", concepts["m1_geo_same_arc_inscribed_angles_equal"]["parent_ids"])
        self.assertIn("m1_geo_circle_chord_property", concepts["m1_geo_same_arc_same_chord_relation"]["parent_ids"])
        self.assertIn("m1_geo_central_inscribed_angle_relation", concepts["m1_geo_semicircle_inscribed_angle_right"]["prerequisite_ids"])

    def test_circle_microconcept_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_geo_circle_chord_property__contains__m1_geo_chord_center_distance",
            "m1_geo_chord_center_perpendicular_bisects__used_in__m1_geo_chord_center_distance",
            "m1_geo_chord_center_distance__used_in__m1_geo_circle_justification",
            "m1_geo_tangent_property__contains__m1_geo_tangent_radius_perpendicular",
            "m1_geo_circle_radius__used_in__m1_geo_tangent_radius_perpendicular",
            "m1_geo_tangent_radius_perpendicular__used_in__m1_geo_equal_tangent_lengths_from_point",
            "m1_geo_inscribed_angle_property__contains__m1_geo_same_arc_inscribed_angles_equal",
            "m1_geo_inscribed_angle_subtended_arc__used_in__m1_geo_same_arc_inscribed_angles_equal",
            "m1_geo_central_inscribed_angle_relation__used_in__m1_geo_semicircle_inscribed_angle_right",
            "m1_geo_central_inscribed_angle_relation__related_to__m1_geo_sector_central_angle_arc_relation",
            "m1_geo_circle_property_evidence_selection__used_in__m1_geo_circle_justification",
            "m1_geo_circle_auxiliary_radius_center__used_in__m1_geo_circle_justification",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

    def test_circle_misconceptions_stay_low_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_misconceptions = [
            "m1_mis_circle_proportion_scope",
            "m1_mis_tangent_radius",
            "m1_mis_inscribed_central_angle_equal",
            "m1_mis_same_chord_arc_scope",
        ]
        for concept_id in expected_misconceptions:
            with self.subTest(concept_id=concept_id):
                self.assertIn(concept_id, concepts)
                concept = concepts[concept_id]
                self.assertEqual("misconception_risk", concept["concept_type"])
                self.assertEqual("low", concept["confidence"])
                self.assertEqual([], concept["prerequisite_ids"])
                self.assertIn("교과서", concept["notes"])

        noisy_edges = [
            "m1_geo_circle__prerequisite_for__m1_mis_circle_proportion_scope",
            "m1_geo_similarity_ratio__prerequisite_for__m1_mis_circle_proportion_scope",
            "m1_geo_tangent_radius_perpendicular__prerequisite_for__m1_mis_tangent_radius",
            "m1_geo_central_inscribed_angle_relation__prerequisite_for__m1_mis_inscribed_central_angle_equal",
            "m1_geo_same_chord__prerequisite_for__m1_mis_same_chord_arc_scope",
        ]
        for edge_id in noisy_edges:
            self.assertNotIn(edge_id, edges)

        confusion_edges = [
            "m1_mis_tangent_radius__often_confused_with__m1_geo_tangent_radius_perpendicular",
            "m1_mis_inscribed_central_angle_equal__often_confused_with__m1_geo_central_inscribed_angle_relation",
            "m1_mis_same_chord_arc_scope__often_confused_with__m1_geo_same_arc_same_chord_relation",
            "m1_mis_proof_observation__often_confused_with__m1_geo_circle_justification",
        ]
        for edge_id in confusion_edges:
            self.assertIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
