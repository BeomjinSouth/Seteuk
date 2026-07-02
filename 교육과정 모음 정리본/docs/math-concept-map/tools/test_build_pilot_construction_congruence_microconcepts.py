from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class ConstructionCongruenceMicroconceptTests(unittest.TestCase):
    def test_construction_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_straightedge_compass_tools": ("눈금 없는 자와 컴퍼스", "term", "medium"),
            "m1_geo_copy_segment_construction": ("주어진 선분과 길이가 같은 선분 작도", "procedure", "medium"),
            "m1_geo_copy_angle_construction": ("주어진 각과 크기가 같은 각 작도", "procedure", "medium"),
            "m1_geo_triangle_construction_sss": ("세 변이 주어진 삼각형 작도", "procedure", "medium"),
            "m1_geo_triangle_construction_sas": ("두 변과 그 끼인각이 주어진 삼각형 작도", "procedure", "medium"),
            "m1_geo_triangle_construction_asa": ("한 변과 그 양 끝각이 주어진 삼각형 작도", "procedure", "medium"),
            "m1_geo_congruent_triangle_construction": ("주어진 삼각형과 합동인 삼각형 작도", "procedure", "high"),
            "m1_geo_construction_process_explanation": ("작도 과정 설명하기", "procedure", "high"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("작도와 합동", concept["unit"])
                self.assertIn("[9수03-03]", source_locators(concept))

        self.assertIn("m1_geo_construction_congruence_unit", concepts["m1_geo_straightedge_compass_tools"]["parent_ids"])
        self.assertIn("m1_geo_triangle_construction", concepts["m1_geo_triangle_construction_sss"]["parent_ids"])
        self.assertIn("m1_geo_triangle_construction", concepts["m1_geo_triangle_construction_sas"]["parent_ids"])
        self.assertIn("m1_geo_triangle_construction", concepts["m1_geo_triangle_construction_asa"]["parent_ids"])
        self.assertNotIn("m1_geo_triangle_construction", concepts["m1_geo_congruence"]["prerequisite_ids"])

    def test_triangle_congruence_condition_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_correspondence_in_congruence": ("합동에서의 대응 관계", "sub_concept", "medium"),
            "m1_geo_corresponding_vertices_in_congruence": ("합동에서의 대응하는 꼭짓점", "term", "medium"),
            "m1_geo_corresponding_sides_in_congruence": ("합동에서의 대응하는 변", "term", "medium"),
            "m1_geo_corresponding_angles_in_congruence": ("합동에서의 대응하는 각", "term", "medium"),
            "m1_geo_congruent_corresponding_sides_equal": ("합동인 도형의 대응변의 길이가 같음", "property", "medium"),
            "m1_geo_congruent_corresponding_angles_equal": ("합동인 도형의 대응각의 크기가 같음", "property", "medium"),
            "m1_geo_triangle_congruence_sss_condition": ("세 쌍의 대응변의 길이가 각각 같은 삼각형 합동 조건", "property", "medium"),
            "m1_geo_triangle_congruence_sas_condition": ("두 쌍의 대응변의 길이와 그 끼인각의 크기가 각각 같은 삼각형 합동 조건", "property", "medium"),
            "m1_geo_triangle_congruence_asa_condition": ("한 쌍의 대응변의 길이와 그 양 끝각의 크기가 각각 같은 삼각형 합동 조건", "property", "medium"),
            "m1_geo_congruence_condition_selection": ("삼각형 합동 조건 선택하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("작도와 합동", concept["unit"])
                self.assertIn("[9수03-04]", source_locators(concept))

        self.assertIn("m1_geo_construction_congruence_unit", concepts["m1_geo_correspondence_in_congruence"]["parent_ids"])
        self.assertIn("m1_geo_correspondence_in_congruence", concepts["m1_geo_corresponding_sides_in_congruence"]["parent_ids"])
        self.assertIn("m1_geo_triangle_congruence_conditions", concepts["m1_geo_triangle_congruence_sss_condition"]["parent_ids"])
        self.assertIn("m1_geo_triangle_congruence_conditions", concepts["m1_geo_triangle_congruence_sas_condition"]["parent_ids"])
        self.assertIn("m1_geo_triangle_congruence_conditions", concepts["m1_geo_triangle_congruence_asa_condition"]["parent_ids"])
        self.assertIn("m1_geo_congruence_condition_selection", concepts["m1_geo_triangle_congruence_judgement"]["prerequisite_ids"])

    def test_construction_congruence_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_geo_straightedge_compass_tools__used_in__m1_geo_construction",
            "m1_geo_copy_segment_construction__used_in__m1_geo_triangle_construction",
            "m1_geo_copy_angle_construction__used_in__m1_geo_triangle_construction",
            "m1_geo_triangle_construction_sss__used_in__m1_geo_triangle_construction",
            "m1_geo_triangle_construction_sas__used_in__m1_geo_triangle_construction",
            "m1_geo_triangle_construction_asa__used_in__m1_geo_triangle_construction",
            "m1_geo_congruent_triangle_construction__used_in__m1_geo_congruence",
            "m1_geo_construction_process_explanation__used_in__m1_geo_triangle_construction",
            "m1_geo_construction_process_explanation__used_in__m1_geo_congruent_triangle_construction",
            "m1_geo_congruence__represented_by__m1_geo_correspondence_in_congruence",
            "m1_geo_correspondence_in_congruence__represented_by__m1_geo_corresponding_vertices_in_congruence",
            "m1_geo_correspondence_in_congruence__represented_by__m1_geo_corresponding_sides_in_congruence",
            "m1_geo_correspondence_in_congruence__represented_by__m1_geo_corresponding_angles_in_congruence",
            "m1_geo_corresponding_sides_in_congruence__used_in__m1_geo_congruent_corresponding_sides_equal",
            "m1_geo_corresponding_angles_in_congruence__used_in__m1_geo_congruent_corresponding_angles_equal",
            "m1_geo_triangle_congruence_sss_condition__used_in__m1_geo_triangle_congruence_judgement",
            "m1_geo_triangle_congruence_sas_condition__used_in__m1_geo_triangle_congruence_judgement",
            "m1_geo_triangle_congruence_asa_condition__used_in__m1_geo_triangle_congruence_judgement",
            "m1_geo_congruence_condition_selection__used_in__m1_geo_triangle_congruence_judgement",
            "m1_geo_triangle_construction_sss__related_to__m1_geo_triangle_congruence_sss_condition",
            "m1_geo_triangle_construction_sas__related_to__m1_geo_triangle_congruence_sas_condition",
            "m1_geo_triangle_construction_asa__related_to__m1_geo_triangle_congruence_asa_condition",
        ]
        for edge_id in expected_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_construction_congruence_misconceptions_stay_low_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_low = [
            "m1_mis_construction_measurement_tools",
            "m1_mis_sas_nonincluded_angle",
            "m1_mis_congruence_correspondence_order",
            "m1_mis_congruence_similarity",
        ]
        for concept_id in expected_low:
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual("misconception_risk", concept["concept_type"])
                self.assertEqual("low", concept["confidence"])
                self.assertEqual([], concept["prerequisite_ids"])

        confusion_edges = [
            "m1_mis_construction_measurement_tools__often_confused_with__m1_geo_straightedge_compass_tools",
            "m1_mis_construction_measurement_tools__often_confused_with__m1_geo_construction",
            "m1_mis_sas_nonincluded_angle__often_confused_with__m1_geo_triangle_congruence_sas_condition",
            "m1_mis_sas_nonincluded_angle__often_confused_with__m1_geo_triangle_congruence_asa_condition",
            "m1_mis_congruence_correspondence_order__often_confused_with__m1_geo_correspondence_in_congruence",
            "m1_mis_congruence_correspondence_order__often_confused_with__m1_geo_triangle_congruence_judgement",
        ]
        for edge_id in confusion_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_construction_congruence_noisy_edges_are_absent(self) -> None:
        edges = edges_by_id()

        noisy_edges = [
            "m1_geo_triangle_construction__prerequisite_for__m1_geo_congruence",
            "m1_geo_straightedge_compass_tools__prerequisite_for__m1_geo_construction",
            "m1_geo_congruence__prerequisite_for__m1_geo_correspondence_in_congruence",
            "m1_geo_triangle_congruence_conditions__represented_by__m1_geo_triangle_construction",
            "m1_geo_triangle_congruence_conditions__prerequisite_for__m1_geo_triangle_construction",
            "m1_geo_triangle_congruence_sss_condition__prerequisite_for__m1_geo_triangle_construction_sss",
            "m1_mis_sas_nonincluded_angle__prerequisite_for__m1_geo_triangle_congruence_sas_condition",
            "m1_mis_construction_measurement_tools__prerequisite_for__m1_geo_construction",
        ]
        for edge_id in noisy_edges:
            with self.subTest(edge_id=edge_id):
                self.assertNotIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
