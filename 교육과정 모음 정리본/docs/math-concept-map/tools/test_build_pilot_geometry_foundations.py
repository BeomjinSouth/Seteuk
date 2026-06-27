from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edge_keys() -> set[tuple[str, str, str]]:
    return {
        (edge["source_id"], edge["target_id"], edge["relationship_type"])
        for edge in build_pilot.EDGES
    }


class GeometryFoundationConceptTests(unittest.TestCase):
    def test_geometry_foundations_are_explicit_concepts(self) -> None:
        concepts = concepts_by_id()
        expected = {
            "m1_geo_figure": ("도형", "core_concept", "m1_geo_domain"),
            "m1_geo_triangle": ("삼각형", "core_concept", "m1_geo_figure"),
            "m1_geo_length": ("길이", "term", "m1_geo_domain"),
            "m1_geo_area": ("넓이", "term", "m1_geo_domain"),
        }

        for concept_id, (label, concept_type, parent_id) in expected.items():
            with self.subTest(concept_id=concept_id):
                self.assertIn(concept_id, concepts)
                concept = concepts[concept_id]
                self.assertEqual(concept["label_ko"], label)
                self.assertEqual(concept["concept_type"], concept_type)
                self.assertEqual(concept["confidence"], "medium")
                self.assertIn(parent_id, concept["parent_ids"])
                self.assertTrue(concept["source_refs"])

    def test_geometry_foundations_are_linked_to_existing_units_and_procedures(self) -> None:
        edges = edge_keys()
        expected_edges = {
            ("m1_geo_domain", "m1_geo_figure", "contains"),
            ("m1_geo_figure", "m1_geo_triangle", "contains"),
            ("m1_geo_domain", "m1_geo_length", "contains"),
            ("m1_geo_domain", "m1_geo_area", "contains"),
            ("m1_geo_figure", "m1_geo_basic_unit", "used_in"),
            ("m1_geo_figure", "m1_geo_similarity_unit", "used_in"),
            ("m1_geo_triangle", "m1_geo_triangle_construction", "used_in"),
            ("m1_geo_triangle", "m1_geo_triangle_congruence_conditions", "used_in"),
            ("m1_geo_triangle", "m1_geo_triangle_similarity_conditions", "used_in"),
            ("m1_geo_length", "m1_geo_sector_arc_length_area", "used_in"),
            ("m1_geo_length", "m1_geo_right_triangle_judgement", "used_in"),
            ("m1_geo_area", "m1_geo_sector_arc_length_area", "used_in"),
            ("m1_geo_area", "m1_geo_surface_area", "used_in"),
            ("m1_geo_area", "m1_geo_trig_triangle_area", "used_in"),
        }

        self.assertTrue(expected_edges.issubset(edges))

    def test_pythagoras_alias_is_preserved_on_existing_theorem_nodes(self) -> None:
        concepts = concepts_by_id()

        for concept_id in ("m1_geo_pythagorean_unit", "m1_geo_pythagorean_theorem"):
            with self.subTest(concept_id=concept_id):
                self.assertIn("피타고라스", concepts[concept_id]["aliases"])


if __name__ == "__main__":
    unittest.main()
