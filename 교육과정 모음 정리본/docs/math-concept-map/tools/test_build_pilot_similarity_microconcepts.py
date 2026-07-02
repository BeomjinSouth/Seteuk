from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class SimilarityMicroconceptTests(unittest.TestCase):
    def test_similar_figure_property_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_similar_figure_properties": ("닮은 도형의 성질", "property", "high"),
            "m1_geo_corresponding_vertices": ("대응하는 꼭짓점", "term", "medium"),
            "m1_geo_corresponding_sides_in_similarity": ("대응하는 변", "term", "medium"),
            "m1_geo_corresponding_angles_in_similarity": ("대응하는 각", "term", "medium"),
            "m1_geo_similar_corresponding_angles_equal": ("닮은 도형의 대응각의 크기가 같음", "property", "medium"),
            "m1_geo_similar_corresponding_sides_proportional": ("닮은 도형의 대응변의 길이의 비가 일정함", "property", "medium"),
            "m1_geo_similarity_ratio_order": ("닮음비의 순서", "sub_concept", "low"),
            "m1_geo_similarity_ratio_calculation": ("닮음비 구하기", "procedure", "high"),
            "m1_geo_unknown_corresponding_side_from_similarity_ratio": ("닮음비로 대응변 길이 구하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                self.assertIn(concept_id, concepts)
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("도형의 닮음", concept["unit"])
                self.assertIn("[9수03-12]", source_locators(concept))

        self.assertIn("m1_geo_similarity_unit", concepts["m1_geo_similar_figure_properties"]["parent_ids"])
        self.assertIn("m1_geo_correspondence", concepts["m1_geo_corresponding_vertices"]["parent_ids"])
        self.assertIn("m1_geo_correspondence", concepts["m1_geo_corresponding_sides_in_similarity"]["parent_ids"])
        self.assertIn("m1_geo_correspondence", concepts["m1_geo_corresponding_angles_in_similarity"]["parent_ids"])
        self.assertIn("m1_geo_corresponding_sides_in_similarity", concepts["m1_geo_similarity_ratio_calculation"]["prerequisite_ids"])
        self.assertIn("m1_geo_similarity_ratio", concepts["m1_geo_similarity_ratio_order"]["parent_ids"])

        self.assertIn("m1_geo_corresponding_angles", concepts)
        self.assertIn("m1_geo_corresponding_angles_in_similarity", concepts)
        self.assertNotEqual(
            concepts["m1_geo_corresponding_angles"]["id"],
            concepts["m1_geo_corresponding_angles_in_similarity"]["id"],
        )

    def test_triangle_similarity_condition_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_triangle_similarity_aa_condition": ("두 쌍의 대응각이 같은 삼각형 닮음 조건", "property", "medium"),
            "m1_geo_triangle_similarity_sas_condition": ("두 쌍의 대응변의 길이의 비와 그 끼인각이 같은 삼각형 닮음 조건", "property", "medium"),
            "m1_geo_triangle_similarity_sss_condition": ("세 쌍의 대응변의 길이의 비가 같은 삼각형 닮음 조건", "property", "medium"),
            "m1_geo_similarity_condition_selection": ("삼각형 닮음 조건 선택하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("도형의 닮음", concept["unit"])
                self.assertIn("[9수03-13]", source_locators(concept))

        self.assertIn("m1_geo_triangle_similarity_conditions", concepts["m1_geo_triangle_similarity_aa_condition"]["parent_ids"])
        self.assertIn("m1_geo_triangle_similarity_conditions", concepts["m1_geo_triangle_similarity_sas_condition"]["parent_ids"])
        self.assertIn("m1_geo_triangle_similarity_conditions", concepts["m1_geo_triangle_similarity_sss_condition"]["parent_ids"])
        self.assertIn("m1_geo_triangle_similarity_conditions", concepts["m1_geo_similarity_condition_selection"]["prerequisite_ids"])
        self.assertIn("m1_geo_similarity_condition_selection", concepts["m1_geo_similarity_judgement"]["prerequisite_ids"])

    def test_parallel_segment_and_centroid_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_triangle_parallel_segment_ratio": ("삼각형에서 한 변에 평행한 직선이 만드는 선분의 비", "property", "medium"),
            "m1_geo_three_parallel_lines_segment_ratio": ("여러 평행선이 두 직선에서 만드는 선분의 비", "property", "medium"),
            "m1_geo_parallel_segment_ratio_equation_setup": ("평행선 선분비 식 세우기", "procedure", "medium"),
            "m1_geo_centroid_median_concurrency": ("세 중선은 한 점에서 만남", "property", "medium"),
            "m1_geo_centroid_two_to_one_ratio": ("무게중심은 중선을 2:1로 나눔", "property", "medium"),
            "m1_geo_centroid_location_by_median_ratio": ("중선 위 2:1 비로 무게중심 위치 찾기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("도형의 닮음", concept["unit"])
                self.assertIn("[9수03-14]", source_locators(concept))

        self.assertIn("m1_geo_parallel_segment_ratio", concepts["m1_geo_triangle_parallel_segment_ratio"]["parent_ids"])
        self.assertIn("m1_geo_parallel_segment_ratio", concepts["m1_geo_three_parallel_lines_segment_ratio"]["parent_ids"])
        self.assertIn("m1_geo_centroid", concepts["m1_geo_centroid_median_concurrency"]["parent_ids"])
        self.assertIn("m1_geo_median", concepts["m1_geo_centroid_median_concurrency"]["prerequisite_ids"])
        self.assertIn("m1_geo_centroid", concepts["m1_geo_centroid_two_to_one_ratio"]["parent_ids"])
        self.assertIn("m1_geo_centroid_median_concurrency", concepts["m1_geo_centroid_two_to_one_ratio"]["prerequisite_ids"])
        self.assertIn("m1_geo_centroid_from_parallel_ratio", concepts["m1_geo_centroid_location_by_median_ratio"]["parent_ids"])
        self.assertIn("m1_geo_centroid_two_to_one_ratio", concepts["m1_geo_centroid_location_by_median_ratio"]["prerequisite_ids"])

    def test_similarity_microconcept_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_geo_similarity_unit__related_to__m1_geo_pythagorean_unit",
            "m1_geo_similarity_ratio__related_to__m1_geo_trigonometric_ratio",
            "m1_geo_correspondence__represented_by__m1_geo_corresponding_vertices",
            "m1_geo_correspondence__represented_by__m1_geo_corresponding_sides_in_similarity",
            "m1_geo_correspondence__represented_by__m1_geo_corresponding_angles_in_similarity",
            "m1_geo_corresponding_sides_in_similarity__used_in__m1_geo_similarity_ratio",
            "m1_geo_similar_corresponding_sides_proportional__represented_by__m1_geo_similarity_ratio",
            "m1_geo_similarity_ratio_order__used_in__m1_geo_similarity_ratio_calculation",
            "m1_geo_triangle_similarity_aa_condition__used_in__m1_geo_similarity_judgement",
            "m1_geo_triangle_similarity_sas_condition__used_in__m1_geo_similarity_judgement",
            "m1_geo_triangle_similarity_sss_condition__used_in__m1_geo_similarity_judgement",
            "m1_geo_similarity_condition_selection__used_in__m1_geo_similarity_judgement",
            "m1_geo_triangle_parallel_segment_ratio__used_in__m1_geo_triangle_midpoint_theorem",
            "m1_geo_parallel_segment_ratio_equation_setup__used_in__m1_geo_centroid_from_parallel_ratio",
            "m1_geo_centroid_median_concurrency__used_in__m1_geo_centroid_two_to_one_ratio",
            "m1_geo_centroid_two_to_one_ratio__used_in__m1_geo_centroid_location_by_median_ratio",
            "m1_geo_centroid_location_by_median_ratio__used_in__m1_geo_centroid_from_parallel_ratio",
        ]
        for edge_id in expected_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_similarity_misconceptions_and_broad_edges_are_clean(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_low = [
            "m1_mis_congruence_similarity",
            "m1_mis_similarity_ratio_reversal",
            "m1_mis_similarity_ratio_noncorresponding_sides",
        ]
        for concept_id in expected_low:
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual("misconception_risk", concept["concept_type"])
                self.assertEqual("low", concept["confidence"])
                self.assertEqual([], concept["prerequisite_ids"])

        confusion_edges = [
            "m1_mis_congruence_similarity__often_confused_with__m1_geo_congruence",
            "m1_mis_congruence_similarity__often_confused_with__m1_geo_similarity",
            "m1_mis_similarity_ratio_reversal__often_confused_with__m1_geo_similarity_ratio_order",
            "m1_mis_similarity_ratio_reversal__often_confused_with__m1_geo_similarity_ratio",
            "m1_mis_similarity_ratio_noncorresponding_sides__often_confused_with__m1_geo_corresponding_sides_in_similarity",
            "m1_mis_similarity_ratio_noncorresponding_sides__often_confused_with__m1_geo_similarity_ratio",
        ]
        for edge_id in confusion_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

        noisy_edges = [
            "m1_geo_congruence__prerequisite_for__m1_mis_congruence_similarity",
            "m1_geo_similarity__prerequisite_for__m1_mis_congruence_similarity",
            "m1_mis_congruence_similarity__often_confused_with__m1_geo_similarity_ratio",
            "m1_geo_similarity_unit__prerequisite_for__m1_geo_pythagorean_unit",
            "m1_geo_similarity_ratio__prerequisite_for__m1_geo_trigonometric_ratio",
            "m1_geo_parallel_segment_ratio__prerequisite_for__m1_geo_centroid",
            "m1_geo_similarity_ratio__represented_by__m1_geo_correspondence",
        ]
        for edge_id in noisy_edges:
            with self.subTest(edge_id=edge_id):
                self.assertNotIn(edge_id, edges)

        self.assertIn("m1_num_ratio__used_in__m1_geo_similarity_ratio", edges)
        self.assertEqual("low", edges["m1_num_ratio__used_in__m1_geo_similarity_ratio"]["confidence"])
        self.assertIn("m1_num_ratio__used_in__m1_geo_parallel_segment_ratio", edges)
        self.assertEqual("low", edges["m1_num_ratio__used_in__m1_geo_parallel_segment_ratio"]["confidence"])


if __name__ == "__main__":
    unittest.main()
