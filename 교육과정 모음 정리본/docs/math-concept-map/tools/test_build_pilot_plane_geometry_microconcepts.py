from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class PlaneGeometryMicroconceptTests(unittest.TestCase):
    def test_polygon_angle_and_diagonal_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_polygon_vertex_count": ("다각형의 꼭짓점 수", "sub_concept", "medium"),
            "m1_geo_polygon_interior_angle_sum": ("다각형의 내각의 합", "property", "high"),
            "m1_geo_polygon_exterior_angle_sum": ("다각형의 외각의 합", "property", "high"),
            "m1_geo_polygon_angle_sum_generalization": ("다각형의 각의 성질 일반화하기", "procedure", "high"),
            "m1_geo_polygon_interior_angle_sum_calculation": ("다각형의 내각의 합 구하기", "procedure", "high"),
            "m1_geo_polygon_exterior_angle_calculation": ("다각형의 외각의 크기 구하기", "procedure", "high"),
            "m1_geo_diagonal_count_calculation": ("다각형의 대각선 개수 구하기", "procedure", "high"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertEqual("평면도형의 성질", concept["unit"])
            self.assertIn("[9수03-05]", source_locators(concept))

        self.assertIn("m1_geo_polygon", concepts["m1_geo_polygon_vertex_count"]["prerequisite_ids"])
        self.assertIn("m1_geo_polygon_angle_sum", concepts["m1_geo_polygon_interior_angle_sum"]["parent_ids"])
        self.assertIn("m1_geo_polygon_angle_sum", concepts["m1_geo_polygon_exterior_angle_sum"]["parent_ids"])
        self.assertIn("m1_geo_diagonal_count", concepts["m1_geo_diagonal_count_calculation"]["parent_ids"])
        self.assertIn("m1_geo_convex_polygon_scope", concepts["m1_geo_polygon_angle_sum_generalization"]["prerequisite_ids"])

    def test_sector_length_area_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_sector_central_angle_arc_relation": ("부채꼴의 중심각과 호의 관계", "property", "high"),
            "m1_geo_sector_arc_length_calculation": ("부채꼴의 호의 길이 구하기", "procedure", "high"),
            "m1_geo_sector_area_calculation": ("부채꼴의 넓이 구하기", "procedure", "high"),
            "m1_geo_sector_proportional_reasoning": ("중심각에 따른 부채꼴 비례 추론", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertEqual("평면도형의 성질", concept["unit"])
            self.assertIn("[9수03-06]", source_locators(concept))

        self.assertIn("m1_geo_sector", concepts["m1_geo_sector_central_angle_arc_relation"]["parent_ids"])
        self.assertIn("m1_geo_sector_arc_length_area", concepts["m1_geo_sector_arc_length_calculation"]["parent_ids"])
        self.assertIn("m1_geo_sector_arc_length_area", concepts["m1_geo_sector_area_calculation"]["parent_ids"])
        self.assertIn("m1_geo_central_angle", concepts["m1_geo_sector_proportional_reasoning"]["prerequisite_ids"])

    def test_plane_geometry_misconceptions_stay_low_confidence_without_prerequisites(self) -> None:
        concepts = concepts_by_id()

        for concept_id in [
            "m1_mis_arc_chord",
            "m1_mis_polygon_interior_exterior_angle",
            "m1_mis_sector_angle_proportion",
        ]:
            concept = concepts[concept_id]
            self.assertEqual("misconception_risk", concept["concept_type"])
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])
            self.assertIn("교과서", concept["notes"])

    def test_plane_geometry_microconcept_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_geo_polygon_angle_sum__contains__m1_geo_polygon_interior_angle_sum",
            "m1_geo_polygon_angle_sum__contains__m1_geo_polygon_exterior_angle_sum",
            "m1_geo_polygon_angle_sum__contains__m1_geo_polygon_angle_sum_generalization",
            "m1_geo_polygon_angle_sum__contains__m1_geo_polygon_interior_angle_sum_calculation",
            "m1_geo_polygon_angle_sum__contains__m1_geo_polygon_exterior_angle_calculation",
            "m1_geo_diagonal_count__contains__m1_geo_diagonal_count_calculation",
            "m1_geo_sector__contains__m1_geo_sector_central_angle_arc_relation",
            "m1_geo_sector_arc_length_area__contains__m1_geo_sector_arc_length_calculation",
            "m1_geo_sector_arc_length_area__contains__m1_geo_sector_area_calculation",
            "m1_geo_sector_arc_length_area__contains__m1_geo_sector_proportional_reasoning",
            "m1_geo_polygon_interior_angle_sum__used_in__m1_geo_polygon_interior_angle_sum_calculation",
            "m1_geo_polygon_exterior_angle_sum__used_in__m1_geo_polygon_exterior_angle_calculation",
            "m1_geo_polygon_angle_sum_generalization__used_in__m1_geo_polygon_angle_sum",
            "m1_geo_polygon_vertex_count__used_in__m1_geo_diagonal_count_calculation",
            "m1_geo_diagonal_count_calculation__used_in__m1_geo_diagonal_count",
            "m1_geo_sector_central_angle_arc_relation__used_in__m1_geo_sector_arc_length_calculation",
            "m1_geo_sector_central_angle_arc_relation__used_in__m1_geo_sector_area_calculation",
            "m1_geo_sector_proportional_reasoning__used_in__m1_geo_sector_arc_length_area",
            "m1_mis_polygon_interior_exterior_angle__often_confused_with__m1_geo_interior_angle",
            "m1_mis_polygon_interior_exterior_angle__often_confused_with__m1_geo_exterior_angle",
            "m1_mis_sector_angle_proportion__often_confused_with__m1_geo_sector_central_angle_arc_relation",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

        noisy_edges = [
            "m1_geo_arc__prerequisite_for__m1_mis_arc_chord",
            "m1_geo_chord__prerequisite_for__m1_mis_arc_chord",
            "m1_geo_interior_angle__prerequisite_for__m1_mis_polygon_interior_exterior_angle",
            "m1_geo_sector_central_angle_arc_relation__prerequisite_for__m1_mis_sector_angle_proportion",
        ]
        for edge_id in noisy_edges:
            self.assertNotIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
