from __future__ import annotations

import unittest

import validate_concept_map as validator


def ref(locator: str, summary: str = "") -> dict:
    return {
        "source_id": "curriculum_math_2022",
        "locator": locator,
        "evidence_kind": "achievement_standard",
        "summary": summary,
    }


class AchievementCoverageTests(unittest.TestCase):
    def test_expected_middle_school_codes_cover_all_four_domains(self) -> None:
        expected = validator.EXPECTED_ACHIEVEMENT_CODES

        self.assertEqual(len(expected), 60)
        self.assertEqual(expected[0], "9수01-01")
        self.assertEqual(expected[-1], "9수04-09")
        self.assertIn("9수02-22", expected)
        self.assertIn("9수03-19", expected)

    def test_missing_achievement_codes_are_reported_from_refs(self) -> None:
        present = {
            code: [{"source_refs": [ref(f"printed p. 1; [{code}]")]}]
            for code in validator.EXPECTED_ACHIEVEMENT_CODES
        }
        del present["9수03-19"]

        records = [record for records in present.values() for record in records]

        self.assertEqual(
            validator.missing_achievement_codes(records),
            ["9수03-19"],
        )

    def test_code_ranges_in_locators_are_expanded(self) -> None:
        records = [
            {
                "source_refs": [
                    ref(
                        "자료와 가능성 section; [9수04-02]~[9수04-04]",
                        "도수분포표와 상대도수 성취수준",
                    )
                ]
            }
        ]

        self.assertEqual(
            validator.collect_achievement_codes(records),
            {"9수04-02", "9수04-03", "9수04-04"},
        )


if __name__ == "__main__":
    unittest.main()
