from __future__ import annotations

import unittest

import build_pilot


def edge_keys() -> set[tuple[str, str, str]]:
    return {
        (edge["source_id"], edge["target_id"], edge["relationship_type"])
        for edge in build_pilot.EDGES
    }


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edge_pairs_by_type(relationship_type: str) -> set[frozenset[str]]:
    return {
        frozenset([edge["source_id"], edge["target_id"]])
        for edge in build_pilot.EDGES
        if edge["relationship_type"] == relationship_type
    }


def edge_pairs_by_types(relationship_types: set[str]) -> set[frozenset[str]]:
    return {
        frozenset([edge["source_id"], edge["target_id"]])
        for edge in build_pilot.EDGES
        if edge["relationship_type"] in relationship_types
    }


def relationship_types_by_pair() -> dict[frozenset[str], set[str]]:
    grouped: dict[frozenset[str], set[str]] = {}
    for edge in build_pilot.EDGES:
        grouped.setdefault(frozenset([edge["source_id"], edge["target_id"]]), set()).add(
            edge["relationship_type"]
        )
    return grouped


class BuildPilotEdgeSyncTests(unittest.TestCase):
    def test_every_parent_id_is_mirrored_by_contains_edge(self) -> None:
        edges = edge_keys()
        missing = [
            (parent_id, concept["id"])
            for concept in build_pilot.CONCEPTS
            for parent_id in concept["parent_ids"]
            if (parent_id, concept["id"], "contains") not in edges
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_prerequisite_id_is_mirrored_by_prerequisite_edge(self) -> None:
        edges = edge_keys()
        missing = [
            (prerequisite_id, concept["id"])
            for concept in build_pilot.CONCEPTS
            for prerequisite_id in concept["prerequisite_ids"]
            if (prerequisite_id, concept["id"], "prerequisite_for") not in edges
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_contains_edge_is_mirrored_by_parent_id(self) -> None:
        concepts = concepts_by_id()
        missing = [
            (edge["source_id"], edge["target_id"])
            for edge in build_pilot.EDGES
            if edge["relationship_type"] == "contains"
            if edge["source_id"] not in concepts[edge["target_id"]]["parent_ids"]
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_prerequisite_edge_is_mirrored_by_prerequisite_id(self) -> None:
        concepts = concepts_by_id()
        missing = [
            (edge["source_id"], edge["target_id"])
            for edge in build_pilot.EDGES
            if edge["relationship_type"] == "prerequisite_for"
            if edge["source_id"] not in concepts[edge["target_id"]]["prerequisite_ids"]
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_misconception_related_id_has_confusion_edge(self) -> None:
        concepts = concepts_by_id()
        confused_pairs = edge_pairs_by_type("often_confused_with")
        missing = [
            (concept["id"], related_id)
            for concept in build_pilot.CONCEPTS
            for related_id in concept["related_ids"]
            if (
                concept["concept_type"] == "misconception_risk"
                or concepts[related_id]["concept_type"] == "misconception_risk"
            )
            if frozenset([concept["id"], related_id]) not in confused_pairs
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_related_ids_do_not_duplicate_only_structural_edges(self) -> None:
        structural_pairs = edge_pairs_by_types({"contains", "prerequisite_for"})
        semantic_pairs = edge_pairs_by_types(
            {
                "related_to",
                "equivalent_to",
                "contrasts_with",
                "often_confused_with",
                "represented_by",
                "used_in",
            }
        )
        duplicated = [
            (concept["id"], related_id)
            for concept in build_pilot.CONCEPTS
            for related_id in concept["related_ids"]
            if frozenset([concept["id"], related_id]) in structural_pairs
            if frozenset([concept["id"], related_id]) not in semantic_pairs
        ]

        self.assertEqual([], duplicated[:20])
        self.assertEqual(0, len(duplicated))

    def test_coordinate_semantic_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_coord_x_axis", "m1_coord_y_axis"]): "contrasts_with",
            frozenset(["m1_coord_origin", "m1_coord_x_axis"]): "related_to",
            frozenset(["m1_coord_origin", "m1_coord_y_axis"]): "related_to",
            frozenset(["m1_coord_x_axis", "m1_coord_axis_point"]): "related_to",
            frozenset(["m1_coord_y_axis", "m1_coord_axis_point"]): "related_to",
            frozenset(["m1_coord_coordinate", "m1_coord_ordered_pair"]): "represented_by",
            frozenset(["m1_coord_coordinate", "m1_coord_number_line"]): "represented_by",
            frozenset(["m1_coord_coordinate", "m1_coord_usefulness"]): "used_in",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_geometry_semantic_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_geo_intersection_line", "m1_geo_intersection_point"]): "related_to",
            frozenset(["m1_geo_point", "m1_geo_line"]): "contrasts_with",
            frozenset(["m1_geo_point", "m1_geo_plane"]): "contrasts_with",
            frozenset(["m1_geo_line", "m1_geo_plane"]): "contrasts_with",
            frozenset(["m1_geo_sine", "m1_geo_tangent_ratio"]): "contrasts_with",
            frozenset(["m1_geo_cosine", "m1_geo_tangent_ratio"]): "contrasts_with",
            frozenset(["m1_geo_circumcircle", "m1_geo_incircle"]): "contrasts_with",
            frozenset(["m1_geo_frustum_cone", "m1_geo_frustum_pyramid"]): "contrasts_with",
            frozenset(["m1_geo_model_tool_solid", "m1_geo_solid_cross_section"]): "used_in",
            frozenset(["m1_geo_opposite_angle", "m1_geo_opposite_side"]): "contrasts_with",
            frozenset(["m1_geo_arc", "m1_geo_central_angle"]): "related_to",
            frozenset(["m1_geo_exterior_angle", "m1_geo_interior_angle"]): "contrasts_with",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_algebra_function_and_polygon_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_geo_convex_polygon_scope", "m1_geo_diagonal_count"]): "related_to",
            frozenset(["m1_geo_convex_polygon_scope", "m1_geo_polygon_angle_sum"]): "related_to",
            frozenset(["m1_factor_square_difference_formula", "m1_factor_square_sum_formula"]): "contrasts_with",
            frozenset(["m1_expr_coefficient", "m1_expr_constant_term"]): "contrasts_with",
            frozenset(["m1_calc_base", "m1_calc_exponent"]): "contrasts_with",
            frozenset(["m1_quad_func_general_form", "m1_quad_func_vertex_form"]): "related_to",
            frozenset(["m1_eq_both_sides", "m1_eq_left_side"]): "contains",
            frozenset(["m1_eq_both_sides", "m1_eq_right_side"]): "contains",
            frozenset(["m1_func_x_intercept", "m1_func_y_intercept"]): "contrasts_with",
            frozenset(["m1_context_speed_distance", "m1_context_speed_time"]): "contrasts_with",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)


if __name__ == "__main__":
    unittest.main()
