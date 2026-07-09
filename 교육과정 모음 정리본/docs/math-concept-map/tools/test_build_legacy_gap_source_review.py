from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_legacy_gap_source_review as source_review


class BuildLegacyGapSourceReviewTests(unittest.TestCase):
    def test_prerequisite_plan_collects_target_source_refs(self) -> None:
        integration_rows = [
            {
                "candidate_label": "비",
                "integration_status": "stage_prerequisite_node",
                "proposed_concept_id": "prereq_ratio",
                "target_relationship_type": "prerequisite_for",
                "target_concept_ids": "direct_proportion; similarity_ratio",
                "target_concept_labels": "정비례; 닮음비",
                "legacy_units": "9수02-07; 9수03-12",
            }
        ]
        concepts = [
            {
                "id": "direct_proportion",
                "label_ko": "정비례",
                "source_refs": [
                    {
                        "source_id": "curriculum_math_2022",
                        "locator": "printed p. 40; [9수02-07]",
                        "summary": "정비례 관계를 표, 식, 그래프로 나타낸다.",
                    }
                ],
            },
            {
                "id": "similarity_ratio",
                "label_ko": "닮음비",
                "source_refs": [
                    {
                        "source_id": "achievement_math_2022",
                        "locator": "도형의 닮음 section",
                        "summary": "닮음비를 이용하여 길이의 비를 구한다.",
                    }
                ],
            },
        ]

        rows = source_review.source_review_rows(integration_rows, concepts)

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["candidate_label"], "비")
        self.assertEqual(rows[0]["review_status"], "needs_official_prerequisite_confirmation")
        self.assertEqual(rows[0]["review_priority"], "official_source_first")
        self.assertEqual(rows[0]["target_source_ref_count"], "2")
        self.assertIn("direct_proportion: curriculum_math_2022 @ printed p. 40; [9수02-07]", rows[0]["target_source_refs"])
        self.assertIn("비; 9수02-07; 9수03-12; 정비례; 닮음비", rows[0]["search_terms"])
        self.assertIn("before adding prereq_ratio", rows[0]["recommended_next_step"])

    def test_alias_plan_keeps_existing_concept_review_without_new_node(self) -> None:
        integration_rows = [
            {
                "candidate_label": "피타고라스",
                "integration_status": "stage_alias_review",
                "proposed_concept_id": "",
                "target_relationship_type": "alias_on_existing_concept",
                "target_concept_ids": "pythagorean_theorem",
                "target_concept_labels": "피타고라스 정리",
                "legacy_units": "9수03-14",
            }
        ]
        concepts = [
            {
                "id": "pythagorean_theorem",
                "label_ko": "피타고라스 정리",
                "source_refs": [
                    {
                        "source_id": "curriculum_math_2022",
                        "locator": "printed p. 60; [9수03-14]",
                        "summary": "피타고라스 정리를 이해한다.",
                    }
                ],
            }
        ]

        rows = source_review.source_review_rows(integration_rows, concepts)

        self.assertEqual(rows[0]["review_status"], "needs_alias_confirmation")
        self.assertEqual(rows[0]["review_priority"], "alias_review")
        self.assertIn("Do not create a standalone node", rows[0]["recommended_next_step"])

    def test_missing_targets_are_kept_for_direct_legacy_unit_review(self) -> None:
        integration_rows = [
            {
                "candidate_label": "비",
                "integration_status": "stage_prerequisite_node",
                "proposed_concept_id": "prereq_ratio",
                "target_relationship_type": "prerequisite_for",
                "target_concept_ids": "",
                "target_concept_labels": "",
                "legacy_units": "9수02-07",
            }
        ]

        rows = source_review.source_review_rows(integration_rows, concepts=[])

        self.assertEqual(rows[0]["target_source_ref_count"], "0")
        self.assertIn("No target concepts listed", rows[0]["notes"])
        self.assertIn("9수02-07", rows[0]["search_terms"])

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "candidate_label": "비",
                "integration_status": "stage_prerequisite_node",
                "proposed_concept_id": "prereq_ratio",
                "target_relationship_type": "prerequisite_for",
                "review_status": "needs_official_prerequisite_confirmation",
                "review_priority": "official_source_first",
                "legacy_units": "9수02-07",
                "search_terms": "비; 9수02-07; 정비례",
                "target_concept_ids": "direct_proportion",
                "target_source_ref_count": "1",
                "target_source_refs": "direct_proportion: curriculum_math_2022 @ printed p. 40; [9수02-07] -> 정비례",
                "recommended_next_step": "Inspect official sources before adding prereq_ratio.",
                "notes": "Review target source refs first.",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "legacy-gap-source-review.csv"
            source_review.write_csv(rows, csv_path)
            markdown = source_review.render_markdown(rows)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), source_review.CSV_FIELDS)
        self.assertIn("# Legacy Gap Source Review", markdown)
        self.assertIn("needs_official_prerequisite_confirmation: 1", markdown)
        self.assertIn("비", markdown)


if __name__ == "__main__":
    unittest.main()
