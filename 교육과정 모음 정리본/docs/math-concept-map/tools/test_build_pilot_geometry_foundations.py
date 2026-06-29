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


def research_refs(concept: dict) -> list[dict]:
    return [
        ref
        for ref in concept["source_refs"]
        if ref["source_id"] == "achievement_research_report_2022"
    ]


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

    def test_geometry_foundations_keep_reviewed_assessment_item_context(self) -> None:
        concepts = concepts_by_id()

        expected_summaries = {
            "m1_geo_triangle": "삼각형의 외심의 성질을 이용하여 외접원의 넓이를 구하는 중학교 도형 평가 과제 맥락",
            "m1_geo_length": "피타고라스 정리를 이용하여 직각삼각형의 빗변의 길이를 구하는 중학교 도형 평가 과제 맥락",
            "m1_geo_area": "뿔의 부피를 구하는 과정과 입체도형의 겉넓이·부피를 다루는 중학교 도형 평가 과제 맥락",
        }

        for concept_id, expected_summary in expected_summaries.items():
            with self.subTest(concept_id=concept_id):
                refs = research_refs(concepts[concept_id])
                locators = " ".join(ref["locator"] for ref in refs)
                summaries = " ".join(ref["summary"] for ref in refs)

                self.assertIn("p. 62", locators)
                self.assertIn(expected_summary, summaries)
                self.assertIn(
                    "research_report_assessment_item_context",
                    {ref["evidence_kind"] for ref in refs},
                )


if __name__ == "__main__":
    unittest.main()
