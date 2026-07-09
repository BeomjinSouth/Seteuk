from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_legacy_gap_integration_plan as integration_plan


class BuildLegacyGapIntegrationPlanTests(unittest.TestCase):
    def test_foundational_candidate_becomes_low_confidence_prerequisite_plan(self) -> None:
        resolution_rows = [
            {
                "candidate_label": "ratio",
                "occurrence_count": "3",
                "legacy_domains": "geometry; relation",
                "legacy_units": "9M02-07; 9M03-12",
                "resolution_status": "foundational_prerequisite_candidate",
                "resolution_action": "review_for_low_confidence_prerequisite_node",
                "candidate_concept_type": "term",
                "candidate_confidence": "low",
                "possible_existing_concept_ids": "direct_proportion; similarity_ratio",
                "possible_existing_concept_labels": "direct proportion; similarity ratio",
            }
        ]

        rows = integration_plan.integration_plan_rows(resolution_rows)

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["candidate_label"], "ratio")
        self.assertEqual(rows[0]["proposed_concept_id"], "prereq_ratio")
        self.assertEqual(rows[0]["integration_status"], "stage_prerequisite_node")
        self.assertEqual(rows[0]["target_relationship_type"], "prerequisite_for")
        self.assertEqual(rows[0]["target_concept_ids"], "direct_proportion; similarity_ratio")
        self.assertEqual(rows[0]["proposed_confidence"], "low")
        self.assertIn("official confirmation required", rows[0]["source_ref_plan"])

    def test_alias_candidate_targets_existing_concept_without_new_node(self) -> None:
        resolution_rows = [
            {
                "candidate_label": "Pythagoras",
                "occurrence_count": "2",
                "legacy_domains": "geometry",
                "legacy_units": "9M03-14; 9M03-15",
                "resolution_status": "alias_candidate_for_existing_concept",
                "resolution_action": "review_alias_on_existing_concept",
                "candidate_concept_type": "term",
                "candidate_confidence": "low",
                "possible_existing_concept_ids": "pythagorean_theorem; pythagorean_converse",
                "possible_existing_concept_labels": "Pythagoras theorem; converse",
            }
        ]

        rows = integration_plan.integration_plan_rows(resolution_rows)

        self.assertEqual(rows[0]["proposed_concept_id"], "")
        self.assertEqual(rows[0]["integration_status"], "stage_alias_review")
        self.assertEqual(rows[0]["target_relationship_type"], "alias_on_existing_concept")
        self.assertEqual(rows[0]["target_concept_ids"], "pythagorean_theorem; pythagorean_converse")
        self.assertIn("Do not create a standalone node", rows[0]["notes"])

    def test_source_detail_needed_waits_without_targets(self) -> None:
        resolution_rows = [
            {
                "candidate_label": "unknown",
                "occurrence_count": "1",
                "legacy_domains": "relation",
                "legacy_units": "9M02-01",
                "resolution_status": "source_detail_needed",
                "resolution_action": "inspect_official_source_before_decision",
                "candidate_concept_type": "term",
                "candidate_confidence": "low",
                "possible_existing_concept_ids": "",
                "possible_existing_concept_labels": "",
            }
        ]

        rows = integration_plan.integration_plan_rows(resolution_rows)

        self.assertEqual(rows[0]["integration_status"], "wait_for_source_detail")
        self.assertEqual(rows[0]["target_relationship_type"], "")
        self.assertEqual(rows[0]["proposed_concept_id"], "")

    def test_known_korean_candidate_labels_use_ascii_prerequisite_ids(self) -> None:
        resolution_rows = [
            {
                "candidate_label": "비",
                "occurrence_count": "7",
                "legacy_domains": "변화와 관계",
                "legacy_units": "9수02-07",
                "resolution_status": "foundational_prerequisite_candidate",
                "resolution_action": "review_for_low_confidence_prerequisite_node",
                "candidate_concept_type": "term",
                "candidate_confidence": "low",
                "possible_existing_concept_ids": "direct_proportion",
                "possible_existing_concept_labels": "정비례",
            }
        ]

        rows = integration_plan.integration_plan_rows(resolution_rows)

        self.assertEqual(rows[0]["proposed_concept_id"], "prereq_ratio")

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "candidate_label": "ratio",
                "proposed_concept_id": "prereq_ratio",
                "proposed_concept_type": "term",
                "proposed_confidence": "low",
                "integration_status": "stage_prerequisite_node",
                "target_relationship_type": "prerequisite_for",
                "target_concept_ids": "direct_proportion",
                "target_concept_labels": "direct proportion",
                "legacy_units": "9M02-07",
                "source_ref_plan": "official confirmation required",
                "notes": "Create only after source confirmation.",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "legacy-gap-integration-plan.csv"
            integration_plan.write_csv(rows, csv_path)
            markdown = integration_plan.render_markdown(rows)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), integration_plan.CSV_FIELDS)
        self.assertIn("# Legacy Gap Integration Plan", markdown)
        self.assertIn("stage_prerequisite_node: 1", markdown)
        self.assertIn("ratio", markdown)


if __name__ == "__main__":
    unittest.main()
