from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


class ChangeRelationshipResearchRefTests(unittest.TestCase):
    def test_inverse_proportion_keeps_reviewed_research_report_context(self) -> None:
        inverse = concepts_by_id()["m1_prop_inverse_proportion"]
        research_refs = [
            ref
            for ref in inverse["source_refs"]
            if ref["source_id"] == "achievement_research_report_2022"
        ]

        self.assertEqual(inverse["confidence"], "medium")
        self.assertEqual(
            {ref["evidence_kind"] for ref in research_refs},
            {"research_report_achievement_level_context"},
        )
        self.assertIn("p. 58", " ".join(ref["locator"] for ref in research_refs))

    def test_graph_intersection_keeps_reviewed_research_report_context(self) -> None:
        intersection = concepts_by_id()["m1_func_intersection_point"]
        research_refs = [
            ref
            for ref in intersection["source_refs"]
            if ref["source_id"] == "achievement_research_report_2022"
        ]

        self.assertEqual(intersection["confidence"], "medium")
        self.assertEqual(
            {ref["evidence_kind"] for ref in research_refs},
            {"research_report_achievement_level_context"},
        )
        self.assertIn("p. 58", " ".join(ref["locator"] for ref in research_refs))


if __name__ == "__main__":
    unittest.main()
