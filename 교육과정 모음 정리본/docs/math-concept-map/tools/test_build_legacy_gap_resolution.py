from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_legacy_gap_resolution as legacy_gap_resolution


class BuildLegacyGapResolutionTests(unittest.TestCase):
    def test_rows_group_needs_review_candidates_by_label(self) -> None:
        audit_rows = [
            {
                "legacy_label_ko": "addition",
                "legacy_domain": "algebra",
                "legacy_unit": "9M02-02",
                "coverage_status": "needs_review",
                "legacy_id": "achievement:9M02-02:addition",
            },
            {
                "legacy_label_ko": "addition",
                "legacy_domain": "number",
                "legacy_unit": "9M01-03",
                "coverage_status": "needs_review",
                "legacy_id": "achievement:9M01-03:addition",
            },
            {
                "legacy_label_ko": "coordinate",
                "legacy_domain": "algebra",
                "legacy_unit": "9M02-05",
                "coverage_status": "covered_by_label",
                "legacy_id": "achievement:9M02-05:coordinate",
            },
        ]
        concepts = [
            {
                "id": "integer_addition",
                "label_ko": "integer addition",
                "aliases": [],
                "domain": "number",
                "unit": "integer",
            }
        ]

        rows = legacy_gap_resolution.legacy_gap_resolution_rows(
            audit_rows,
            concepts,
            foundational_labels={"addition"},
            alias_labels=set(),
        )

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["candidate_label"], "addition")
        self.assertEqual(rows[0]["occurrence_count"], 2)
        self.assertEqual(rows[0]["legacy_units"], "9M01-03; 9M02-02")
        self.assertEqual(rows[0]["resolution_status"], "foundational_prerequisite_candidate")
        self.assertEqual(rows[0]["resolution_action"], "review_for_low_confidence_prerequisite_node")
        self.assertEqual(rows[0]["candidate_concept_type"], "term")
        self.assertEqual(rows[0]["possible_existing_concept_ids"], "integer_addition")

    def test_alias_candidates_point_to_existing_concepts(self) -> None:
        audit_rows = [
            {
                "legacy_label_ko": "Pythagoras",
                "legacy_domain": "geometry",
                "legacy_unit": "9M03-14",
                "coverage_status": "needs_review",
                "legacy_id": "achievement:9M03-14:Pythagoras",
            }
        ]
        concepts = [
            {
                "id": "pythagorean_theorem",
                "label_ko": "Pythagoras theorem",
                "aliases": ["right triangle theorem"],
                "domain": "geometry",
                "unit": "Pythagoras theorem",
            }
        ]

        rows = legacy_gap_resolution.legacy_gap_resolution_rows(
            audit_rows,
            concepts,
            foundational_labels=set(),
            alias_labels={"Pythagoras"},
        )

        self.assertEqual(rows[0]["resolution_status"], "alias_candidate_for_existing_concept")
        self.assertEqual(rows[0]["resolution_action"], "review_alias_on_existing_concept")
        self.assertEqual(rows[0]["candidate_concept_type"], "term")
        self.assertEqual(rows[0]["candidate_confidence"], "low")
        self.assertEqual(rows[0]["possible_existing_concept_ids"], "pythagorean_theorem")

    def test_uncategorized_candidates_remain_source_detail_needed(self) -> None:
        audit_rows = [
            {
                "legacy_label_ko": "new concept",
                "legacy_domain": "relation",
                "legacy_unit": "9M02-01",
                "coverage_status": "needs_review",
                "legacy_id": "achievement:9M02-01:new concept",
            }
        ]

        rows = legacy_gap_resolution.legacy_gap_resolution_rows(
            audit_rows,
            concepts=[],
            foundational_labels=set(),
            alias_labels=set(),
        )

        self.assertEqual(rows[0]["resolution_status"], "source_detail_needed")
        self.assertEqual(rows[0]["resolution_action"], "inspect_official_source_before_decision")
        self.assertEqual(rows[0]["possible_existing_concept_ids"], "")

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "candidate_label": "addition",
                "occurrence_count": 2,
                "legacy_domains": "algebra; number",
                "legacy_units": "9M01-03; 9M02-02",
                "resolution_status": "foundational_prerequisite_candidate",
                "resolution_action": "review_for_low_confidence_prerequisite_node",
                "candidate_concept_type": "term",
                "candidate_confidence": "low",
                "possible_existing_concept_ids": "integer_addition",
                "possible_existing_concept_labels": "integer addition",
                "evidence_basis": "legacy gap audit needs_review rows",
                "notes": "Review as a foundational prerequisite concept.",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "legacy-gap-resolution.csv"
            legacy_gap_resolution.write_csv(rows, csv_path)
            markdown = legacy_gap_resolution.render_markdown(rows)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), legacy_gap_resolution.CSV_FIELDS)
        self.assertIn("# Legacy Gap Resolution", markdown)
        self.assertIn("foundational_prerequisite_candidate: 1", markdown)
        self.assertIn("addition", markdown)


if __name__ == "__main__":
    unittest.main()
