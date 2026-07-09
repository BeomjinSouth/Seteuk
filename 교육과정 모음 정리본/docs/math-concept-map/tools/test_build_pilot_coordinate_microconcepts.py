from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def relationship_types_by_pair() -> dict[frozenset[str], set[str]]:
    grouped: dict[frozenset[str], set[str]] = {}
    for edge in build_pilot.EDGES:
        grouped.setdefault(frozenset([edge["source_id"], edge["target_id"]]), set()).add(
            edge["relationship_type"]
        )
    return grouped


class CoordinateMicroconceptTests(unittest.TestCase):
    def test_axis_specific_point_nodes_are_kept_as_low_confidence_microconcepts(self) -> None:
        concepts = concepts_by_id()

        for concept_id, label, axis_id, zero_coordinate_id in [
            ("m1_coord_x_axis_point", "x축 위의 점", "m1_coord_x_axis", "m1_coord_y_coordinate"),
            ("m1_coord_y_axis_point", "y축 위의 점", "m1_coord_y_axis", "m1_coord_x_coordinate"),
        ]:
            concept = concepts[concept_id]

            self.assertEqual(label, concept["label_ko"])
            self.assertEqual("sub_concept", concept["concept_type"])
            self.assertEqual("low", concept["confidence"])
            self.assertIn("m1_coord_axis_point", concept["parent_ids"])
            self.assertIn(axis_id, concept["parent_ids"])
            self.assertIn(zero_coordinate_id, concept["prerequisite_ids"])
            self.assertIn("교과서", concept["notes"])

    def test_quadrant_sign_pattern_is_separated_from_quadrant_terms(self) -> None:
        concepts = concepts_by_id()
        concept = concepts["m1_coord_quadrant_signs"]

        self.assertEqual("사분면별 좌표 부호", concept["label_ko"])
        self.assertEqual("property", concept["concept_type"])
        self.assertEqual("low", concept["confidence"])
        self.assertIn("m1_coord_quadrant", concept["parent_ids"])
        self.assertIn("m1_coord_x_coordinate", concept["prerequisite_ids"])
        self.assertIn("m1_coord_y_coordinate", concept["prerequisite_ids"])
        self.assertIn("m1_coord_axis_point", concept["related_ids"])
        self.assertIn("교과서", concept["notes"])

    def test_coordinate_microconcept_edges_are_explicit(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_coord_x_axis_point", "m1_coord_y_axis_point"]): "contrasts_with",
            frozenset(["m1_coord_axis_point", "m1_coord_x_axis_point"]): "contains",
            frozenset(["m1_coord_axis_point", "m1_coord_y_axis_point"]): "contains",
            frozenset(["m1_coord_quadrant", "m1_coord_quadrant_signs"]): "contains",
            frozenset(["m1_coord_quadrant_signs", "m1_coord_axis_point"]): "contrasts_with",
            frozenset(["m1_coord_quadrant_signs", "m1_mis_axis_quadrant"]): "often_confused_with",
            frozenset(["m1_coord_axis", "m1_coord_x_axis_point"]): "related_to",
            frozenset(["m1_coord_axis", "m1_coord_y_axis_point"]): "related_to",
            frozenset(["m1_coord_axis_point", "m1_coord_origin"]): "related_to",
            frozenset(["m1_coord_coordinate_plane", "m1_coord_point_location"]): "contains",
            frozenset(["m1_coord_ordered_pair", "m1_coord_x_coordinate"]): "contains",
            frozenset(["m1_coord_ordered_pair", "m1_coord_y_coordinate"]): "contains",
            frozenset(["m1_coord_quadrant_signs", "m1_coord_quadrant_1"]): "related_to",
            frozenset(["m1_coord_quadrant_signs", "m1_coord_quadrant_2"]): "related_to",
            frozenset(["m1_coord_quadrant_signs", "m1_coord_quadrant_3"]): "related_to",
            frozenset(["m1_coord_quadrant_signs", "m1_coord_quadrant_4"]): "related_to",
            frozenset(["m1_coord_x_axis_point", "m1_coord_quadrant_signs"]): "contrasts_with",
            frozenset(["m1_coord_y_axis_point", "m1_coord_quadrant_signs"]): "contrasts_with",
        }

        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)


if __name__ == "__main__":
    unittest.main()
