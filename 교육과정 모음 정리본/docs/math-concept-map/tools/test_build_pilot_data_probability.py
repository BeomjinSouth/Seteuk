from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


class DataProbabilityConceptTests(unittest.TestCase):
    def test_or_cases_keeps_reviewed_research_report_achievement_level_context(self) -> None:
        concepts = concepts_by_id()
        or_cases = concepts["m1_data_or_cases"]
        research_refs = [
            ref
            for ref in or_cases["source_refs"]
            if ref["source_id"] == "achievement_research_report_2022"
        ]
        locators = " ".join(ref["locator"] for ref in research_refs)

        self.assertEqual(or_cases["confidence"], "medium")
        self.assertEqual(
            {ref["evidence_kind"] for ref in research_refs},
            {"research_report_achievement_level_context", "research_report_assessment_item_context"},
        )
        self.assertIn("p. 228", locators)
        self.assertIn("p. 240", locators)
        self.assertIn("p. 266", locators)


if __name__ == "__main__":
    unittest.main()
