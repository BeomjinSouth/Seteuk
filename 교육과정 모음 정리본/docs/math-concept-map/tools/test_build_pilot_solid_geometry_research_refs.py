from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def research_refs(concept: dict) -> list[dict]:
    return [
        ref
        for ref in concept["source_refs"]
        if ref["source_id"] == "achievement_research_report_2022"
    ]


class SolidGeometryResearchRefTests(unittest.TestCase):
    def test_solid_net_keeps_reviewed_research_report_context(self) -> None:
        solid_net = concepts_by_id()["m1_geo_solid_net"]
        refs = research_refs(solid_net)
        locators = " ".join(ref["locator"] for ref in refs)

        self.assertEqual(solid_net["confidence"], "medium")
        self.assertEqual(
            {ref["evidence_kind"] for ref in refs},
            {"research_report_achievement_level_context"},
        )
        self.assertIn("p. 173", locators)
        self.assertIn("p. 174", locators)

    def test_pyramid_keeps_reviewed_research_report_context(self) -> None:
        pyramid = concepts_by_id()["m1_geo_pyramid"]
        refs = research_refs(pyramid)
        locators = " ".join(ref["locator"] for ref in refs)

        self.assertEqual(pyramid["confidence"], "medium")
        self.assertEqual(
            {ref["evidence_kind"] for ref in refs},
            {"research_report_achievement_level_context"},
        )
        self.assertIn("p. 174", locators)
        self.assertIn("p. 181", locators)

    def test_prism_keeps_reviewed_research_report_context(self) -> None:
        prism = concepts_by_id()["m1_geo_prism"]
        refs = research_refs(prism)
        locators = " ".join(ref["locator"] for ref in refs)
        summaries = " ".join(ref["summary"] for ref in refs)

        self.assertEqual(prism["confidence"], "medium")
        self.assertEqual(
            {ref["evidence_kind"] for ref in refs},
            {"research_report_prerequisite_context", "research_report_achievement_level_context"},
        )
        self.assertIn("p. 103", locators)
        self.assertIn("p. 108", locators)
        self.assertIn("원기둥", summaries)

    def test_algebraic_expansion_does_not_take_solid_net_context(self) -> None:
        expansion = concepts_by_id()["m1_calc_expansion"]

        self.assertEqual(research_refs(expansion), [])


if __name__ == "__main__":
    unittest.main()
