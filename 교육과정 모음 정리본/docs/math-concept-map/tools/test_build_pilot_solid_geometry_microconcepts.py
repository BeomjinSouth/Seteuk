from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class SolidGeometryMicroconceptTests(unittest.TestCase):
    def test_solid_geometry_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_solid_face": ("입체도형의 면", "term", "medium"),
            "m1_geo_solid_edge": ("입체도형의 모서리", "term", "medium"),
            "m1_geo_solid_vertex": ("입체도형의 꼭짓점", "term", "medium"),
            "m1_geo_solid_component_identification": ("면·모서리·꼭짓점 찾기", "procedure", "medium"),
            "m1_geo_orthographic_drawing": ("겨냥도", "representation", "low"),
            "m1_geo_solid_net_drawing": ("전개도 그리기", "procedure", "medium"),
            "m1_geo_solid_net_validity_judgement": ("전개도가 될 수 있는지 판단하기", "procedure", "medium"),
            "m1_geo_solid_cross_section_prediction": ("단면 모양 예상하기", "procedure", "medium"),
            "m1_geo_rotation_generation": ("평면도형을 회전시켜 회전체 만들기", "procedure", "high"),
            "m1_geo_net_surface_area_strategy": ("전개도로 겉넓이 구하기", "procedure", "medium"),
            "m1_geo_convex_polyhedron_scope": ("볼록한 다면체 범위", "property", "high"),
            "m1_mis_solid_net_adjacency": ("전개도에서 붙는 면의 이웃 관계를 잘못 판단하는 오류", "misconception_risk", "low"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertIn("m1_geo_solid_unit", concept["parent_ids"])

        self.assertIn("m1_geo_solid_face", concepts["m1_geo_solid_component_identification"]["prerequisite_ids"])
        self.assertIn("m1_geo_solid_edge", concepts["m1_geo_solid_component_identification"]["prerequisite_ids"])
        self.assertIn("m1_geo_solid_vertex", concepts["m1_geo_solid_component_identification"]["prerequisite_ids"])
        self.assertIn("m1_geo_solid_net", concepts["m1_geo_solid_net_validity_judgement"]["prerequisite_ids"])
        self.assertIn("m1_geo_axis_of_rotation", concepts["m1_geo_rotation_generation"]["prerequisite_ids"])
        self.assertIn("m1_geo_solid_net", concepts["m1_geo_net_surface_area_strategy"]["prerequisite_ids"])
        self.assertIn("m1_geo_surface_area", concepts["m1_geo_net_surface_area_strategy"]["prerequisite_ids"])

        self.assertIn("p. 173", source_locators(concepts["m1_geo_orthographic_drawing"]))
        self.assertIn("p. 174", source_locators(concepts["m1_geo_solid_component_identification"]))
        self.assertIn("교과서", concepts["m1_geo_solid_cross_section_prediction"]["notes"])

    def test_solid_geometry_microconcept_edges_link_to_parent_flows(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_geo_solid_unit__contains__m1_geo_solid_face",
            "m1_geo_solid_unit__contains__m1_geo_solid_edge",
            "m1_geo_solid_unit__contains__m1_geo_solid_vertex",
            "m1_geo_solid_unit__contains__m1_geo_solid_component_identification",
            "m1_geo_solid_unit__contains__m1_geo_orthographic_drawing",
            "m1_geo_solid_unit__contains__m1_geo_solid_net_drawing",
            "m1_geo_solid_unit__contains__m1_geo_solid_net_validity_judgement",
            "m1_geo_solid_unit__contains__m1_geo_solid_cross_section_prediction",
            "m1_geo_solid_unit__contains__m1_geo_rotation_generation",
            "m1_geo_solid_unit__contains__m1_geo_net_surface_area_strategy",
            "m1_geo_solid_unit__contains__m1_geo_convex_polyhedron_scope",
            "m1_geo_solid_unit__contains__m1_mis_solid_net_adjacency",
            "m1_geo_solid_face__used_in__m1_geo_solid_component_identification",
            "m1_geo_solid_edge__used_in__m1_geo_solid_component_identification",
            "m1_geo_solid_vertex__used_in__m1_geo_solid_component_identification",
            "m1_geo_solid_net__used_in__m1_geo_solid_net_drawing",
            "m1_geo_solid_net__used_in__m1_geo_solid_net_validity_judgement",
            "m1_geo_solid_net__used_in__m1_geo_net_surface_area_strategy",
            "m1_geo_surface_area__used_in__m1_geo_net_surface_area_strategy",
            "m1_geo_solid_cross_section__used_in__m1_geo_solid_cross_section_prediction",
            "m1_geo_axis_of_rotation__used_in__m1_geo_rotation_generation",
            "m1_geo_rotation_generation__used_in__m1_geo_solid_of_revolution",
            "m1_geo_convex_polyhedron_scope__related_to__m1_geo_polyhedron",
            "m1_mis_solid_net_adjacency__often_confused_with__m1_geo_solid_net_validity_judgement",
        ]
        for edge_id in expected_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_solid_geometry_scope_and_misconceptions_stay_evidence_limited(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        net_adjacency = concepts["m1_mis_solid_net_adjacency"]
        self.assertEqual("low", net_adjacency["confidence"])
        self.assertEqual([], net_adjacency["prerequisite_ids"])
        self.assertIn("교과서", net_adjacency["notes"])

        convex_scope = concepts["m1_geo_convex_polyhedron_scope"]
        self.assertIn("볼록", convex_scope["short_definition"])
        self.assertIn("유의사항", convex_scope["notes"])

        noisy_edges = [
            "m1_geo_surface_area__prerequisite_for__m1_mis_surface_area_volume",
            "m1_geo_volume__prerequisite_for__m1_mis_surface_area_volume",
            "m1_geo_surface_area__prerequisite_for__m1_mis_complex_area_volume_scope",
            "m1_geo_volume__prerequisite_for__m1_mis_complex_area_volume_scope",
            "m1_geo_solid_of_revolution__represented_by__m1_geo_axis_of_rotation",
            "m1_geo_solid_unit__represented_by__m1_geo_solid_net",
            "m1_geo_solid_unit__represented_by__m1_geo_solid_cross_section",
            "m1_mis_surface_area_volume__often_confused_with__m1_geo_solid_net",
            "m1_mis_complex_area_volume_scope__often_confused_with__m1_geo_plane_properties_unit",
        ]
        for edge_id in noisy_edges:
            with self.subTest(edge_id=edge_id):
                self.assertNotIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
