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


class RatioFoundationConceptTests(unittest.TestCase):
    def test_ratio_is_explicit_low_confidence_foundational_concept(self) -> None:
        concepts = concepts_by_id()

        self.assertIn("m1_num_ratio", concepts)
        ratio = concepts["m1_num_ratio"]

        self.assertEqual(ratio["label_ko"], "비")
        self.assertEqual(ratio["concept_type"], "term")
        self.assertEqual(ratio["confidence"], "low")
        self.assertEqual(ratio["domain"], "수와 연산")
        self.assertIn("비율", ratio["aliases"])
        self.assertIn("m1_num_domain", ratio["parent_ids"])
        self.assertIn("m1_num_rational_number", ratio["prerequisite_ids"])
        self.assertIn("m1_geo_trigonometric_ratio", ratio["related_ids"])
        self.assertIn("교과서", ratio["notes"])
        self.assertTrue(ratio["source_refs"])

    def test_ratio_keeps_reviewed_research_report_prerequisite_context(self) -> None:
        concepts = concepts_by_id()
        ratio = concepts["m1_num_ratio"]
        source_ids = {source["id"] for source in build_pilot.SOURCES}
        research_refs = [
            ref
            for ref in ratio["source_refs"]
            if ref["source_id"] == "achievement_research_report_2022"
        ]
        locators = " ".join(ref["locator"] for ref in research_refs)

        self.assertIn("achievement_research_report_2022", source_ids)
        self.assertEqual(ratio["confidence"], "low")
        self.assertIn("교과서", ratio["notes"])
        self.assertEqual({ref["evidence_kind"] for ref in research_refs}, {"research_report_prerequisite_context"})
        self.assertIn("p. 172", locators)
        self.assertIn("p. 180", locators)
        self.assertIn("p. 181", locators)

    def test_ratio_links_cross_domain_ratio_based_concepts(self) -> None:
        edges = edge_keys()
        expected_edges = {
            ("m1_num_domain", "m1_num_ratio", "contains"),
            ("m1_num_rational_number", "m1_num_ratio", "prerequisite_for"),
            ("m1_num_ratio", "m1_prop_direct_proportion", "used_in"),
            ("m1_num_ratio", "m1_prop_inverse_proportion", "used_in"),
            ("m1_num_ratio", "m1_geo_similarity_ratio", "used_in"),
            ("m1_num_ratio", "m1_geo_parallel_segment_ratio", "used_in"),
            ("m1_num_ratio", "m1_geo_trigonometric_ratio", "used_in"),
            ("m1_num_ratio", "m1_data_relative_frequency", "used_in"),
            ("m1_num_ratio", "m1_data_theoretical_probability", "used_in"),
        }

        self.assertTrue(expected_edges.issubset(edges))


if __name__ == "__main__":
    unittest.main()
