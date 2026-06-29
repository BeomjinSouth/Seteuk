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


class DataRepresentativeResearchRefTests(unittest.TestCase):
    def test_mean_keeps_reviewed_research_report_prerequisite_context(self) -> None:
        mean = concepts_by_id()["m1_data_mean"]
        refs = research_refs(mean)
        locators = " ".join(ref["locator"] for ref in refs)
        summaries = " ".join(ref["summary"] for ref in refs)

        self.assertEqual(mean["confidence"], "medium")
        self.assertEqual(
            {ref["evidence_kind"] for ref in refs},
            {"research_report_prerequisite_context"},
        )
        self.assertIn("p. 177", locators)
        self.assertIn("평균의 의미", summaries)


if __name__ == "__main__":
    unittest.main()
