from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class TriangleQuadrilateralMicroconceptTests(unittest.TestCase):
    def test_isosceles_and_right_triangle_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_isosceles_equal_sides": ("이등변삼각형의 두 같은 변", "sub_concept", "medium"),
            "m1_geo_isosceles_base": ("이등변삼각형의 밑변", "term", "medium"),
            "m1_geo_isosceles_vertex_angle": ("이등변삼각형의 꼭지각", "term", "medium"),
            "m1_geo_isosceles_base_angles": ("이등변삼각형의 두 밑각", "term", "medium"),
            "m1_geo_isosceles_base_angles_equal": ("이등변삼각형의 두 밑각의 크기가 같음", "property", "high"),
            "m1_geo_isosceles_vertex_angle_bisector_property": ("이등변삼각형의 꼭지각 이등분선 성질", "property", "medium"),
            "m1_geo_isosceles_property_proof": ("이등변삼각형 성질 정당화하기", "procedure", "high"),
            "m1_geo_right_triangle_congruence_conditions": ("직각삼각형의 합동 조건", "property", "medium"),
            "m1_geo_right_triangle_congruence_judgement": ("직각삼각형 합동 판별하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                self.assertIn(concept_id, concepts)
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("삼각형과 사각형의 성질", concept["unit"])
                self.assertIn("[9수03-09]", source_locators(concept))

        self.assertIn("m1_geo_isosceles_properties", concepts["m1_geo_isosceles_base_angles_equal"]["parent_ids"])
        self.assertIn("m1_geo_triangle_congruence_conditions", concepts["m1_geo_isosceles_property_proof"]["prerequisite_ids"])
        self.assertIn("m1_geo_right_triangle", concepts["m1_geo_right_triangle_congruence_conditions"]["prerequisite_ids"])

    def test_circumcenter_and_incenter_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_angle_bisector": ("각의 이등분선", "term", "medium"),
            "m1_geo_circumcenter_perpendicular_bisectors": ("외심과 세 변의 수직이등분선", "property", "high"),
            "m1_geo_circumcenter_equal_vertex_distance": ("외심에서 세 꼭짓점까지의 거리", "property", "high"),
            "m1_geo_circumradius": ("외접원의 반지름", "term", "medium"),
            "m1_geo_construct_circumcenter": ("외심 찾기", "procedure", "high"),
            "m1_geo_incenter_angle_bisectors": ("내심과 세 내각의 이등분선", "property", "high"),
            "m1_geo_incenter_equal_side_distance": ("내심에서 세 변까지의 거리", "property", "high"),
            "m1_geo_inradius": ("내접원의 반지름", "term", "medium"),
            "m1_geo_construct_incenter": ("내심 찾기", "procedure", "high"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                self.assertIn(concept_id, concepts)
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("삼각형과 사각형의 성질", concept["unit"])
                self.assertIn("[9수03-10]", source_locators(concept))

        self.assertIn("m1_geo_circumcenter", concepts["m1_geo_circumcenter_equal_vertex_distance"]["parent_ids"])
        self.assertIn("m1_geo_incenter", concepts["m1_geo_incenter_equal_side_distance"]["parent_ids"])
        self.assertIn("m1_geo_angle_bisector", concepts["m1_geo_construct_incenter"]["prerequisite_ids"])

    def test_quadrilateral_type_and_classification_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_parallelogram": ("평행사변형", "core_concept", "high"),
            "m1_geo_rectangle": ("직사각형", "core_concept", "high"),
            "m1_geo_rhombus": ("마름모", "core_concept", "high"),
            "m1_geo_square": ("정사각형", "core_concept", "high"),
            "m1_geo_trapezoid": ("사다리꼴", "core_concept", "medium"),
            "m1_geo_parallelogram_opposite_sides_angles": ("평행사변형의 마주 보는 변과 각", "property", "high"),
            "m1_geo_parallelogram_diagonals_bisect": ("평행사변형의 대각선이 서로를 이등분", "property", "high"),
            "m1_geo_rectangle_diagonals_equal": ("직사각형의 대각선의 길이가 같음", "property", "high"),
            "m1_geo_rhombus_diagonals_perpendicular": ("마름모의 대각선이 서로 수직", "property", "high"),
            "m1_geo_square_rectangle_rhombus_relation": ("정사각형과 직사각형·마름모의 관계", "property", "medium"),
            "m1_geo_quadrilateral_classification": ("사각형 분류하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                self.assertIn(concept_id, concepts)
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("삼각형과 사각형의 성질", concept["unit"])
                self.assertIn("[9수03-11]", source_locators(concept))

        self.assertIn("m1_geo_quadrilateral", concepts["m1_geo_parallelogram"]["parent_ids"])
        self.assertIn("m1_geo_parallelogram", concepts["m1_geo_rectangle"]["prerequisite_ids"])
        self.assertIn("m1_geo_rectangle", concepts["m1_geo_square_rectangle_rhombus_relation"]["prerequisite_ids"])
        self.assertIn("m1_geo_rhombus", concepts["m1_geo_square_rectangle_rhombus_relation"]["prerequisite_ids"])

    def test_triangle_quadrilateral_microconcept_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_geo_isosceles_properties__contains__m1_geo_isosceles_base_angles_equal",
            "m1_geo_isosceles_properties__contains__m1_geo_isosceles_property_proof",
            "m1_geo_right_triangle_congruence_conditions__used_in__m1_geo_right_triangle_congruence_judgement",
            "m1_geo_isosceles_base_angles__used_in__m1_geo_isosceles_base_angles_equal",
            "m1_geo_isosceles_base_angles_equal__used_in__m1_geo_isosceles_property_proof",
            "m1_geo_circumcenter__contains__m1_geo_circumcenter_equal_vertex_distance",
            "m1_geo_circumcenter__represented_by__m1_geo_circumcenter_perpendicular_bisectors",
            "m1_geo_perpendicular_bisector__used_in__m1_geo_construct_circumcenter",
            "m1_geo_construct_circumcenter__used_in__m1_geo_circumcenter",
            "m1_geo_incenter__contains__m1_geo_incenter_equal_side_distance",
            "m1_geo_incenter__represented_by__m1_geo_incenter_angle_bisectors",
            "m1_geo_angle_bisector__used_in__m1_geo_construct_incenter",
            "m1_geo_construct_incenter__used_in__m1_geo_incenter",
            "m1_geo_circumcenter_equal_vertex_distance__contrasts_with__m1_geo_incenter_equal_side_distance",
            "m1_geo_quadrilateral__contains__m1_geo_parallelogram",
            "m1_geo_parallelogram__contains__m1_geo_parallelogram_diagonals_bisect",
            "m1_geo_rectangle__contains__m1_geo_rectangle_diagonals_equal",
            "m1_geo_rhombus__contains__m1_geo_rhombus_diagonals_perpendicular",
            "m1_geo_parallelogram_diagonals_bisect__used_in__m1_geo_quadrilateral_classification",
            "m1_geo_rectangle_diagonals_equal__used_in__m1_geo_quadrilateral_classification",
            "m1_geo_square_rectangle_rhombus_relation__used_in__m1_geo_quadrilateral_relationship",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

    def test_triangle_quadrilateral_misconceptions_stay_low_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_misconceptions = [
            "m1_mis_proof_observation",
            "m1_mis_circumcenter_incenter",
            "m1_mis_isosceles_base_vertex_angle_confusion",
            "m1_mis_quadrilateral_inclusion_relation",
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
            "m1_geo_circumcenter__prerequisite_for__m1_mis_circumcenter_incenter",
            "m1_geo_incenter__prerequisite_for__m1_mis_circumcenter_incenter",
            "m1_geo_justification__prerequisite_for__m1_mis_proof_observation",
            "m1_geo_proof__prerequisite_for__m1_mis_proof_observation",
            "m1_geo_isosceles_base_angles__prerequisite_for__m1_mis_isosceles_base_vertex_angle_confusion",
            "m1_geo_quadrilateral_relationship__prerequisite_for__m1_mis_quadrilateral_inclusion_relation",
        ]
        for edge_id in noisy_edges:
            self.assertNotIn(edge_id, edges)

        confusion_edges = [
            "m1_mis_isosceles_base_vertex_angle_confusion__often_confused_with__m1_geo_isosceles_base_angles",
            "m1_mis_isosceles_base_vertex_angle_confusion__often_confused_with__m1_geo_isosceles_vertex_angle",
            "m1_mis_quadrilateral_inclusion_relation__often_confused_with__m1_geo_square_rectangle_rhombus_relation",
            "m1_mis_quadrilateral_inclusion_relation__often_confused_with__m1_geo_quadrilateral_classification",
        ]
        for edge_id in confusion_edges:
            self.assertIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
