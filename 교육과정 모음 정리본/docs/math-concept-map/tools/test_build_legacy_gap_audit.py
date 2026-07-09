from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_legacy_gap_audit as legacy_gap_audit


class BuildLegacyGapAuditTests(unittest.TestCase):
    def test_rows_classify_label_alias_and_review_gaps(self) -> None:
        legacy_data = {
            "curriculum_nodes": [
                {
                    "id": "legacy-coordinate-plane",
                    "label": "Coordinate Plane",
                    "area": "Relation",
                    "gradeBand": "middle1-3",
                },
                {
                    "id": "legacy-x-axis",
                    "label": "x-axis",
                    "area": "Relation",
                    "gradeBand": "middle1-3",
                },
                {
                    "id": "legacy-axis-point",
                    "label": "Axis point",
                    "area": "Relation",
                    "gradeBand": "middle1-3",
                },
            ]
        }
        concepts = [
            {
                "id": "coord_plane",
                "label_ko": "Coordinate Plane",
                "aliases": [],
                "domain": "Relation",
                "unit": "Coordinate Plane",
            },
            {
                "id": "x_axis",
                "label_ko": "Horizontal axis",
                "aliases": ["x-axis"],
                "domain": "Relation",
                "unit": "Coordinate Plane",
            },
        ]

        rows = legacy_gap_audit.legacy_gap_rows(legacy_data, concepts)
        rows_by_id = {row["legacy_id"]: row for row in rows}

        self.assertEqual(
            rows_by_id["legacy-coordinate-plane"]["coverage_status"],
            "covered_by_label",
        )
        self.assertEqual(
            rows_by_id["legacy-coordinate-plane"]["matched_concept_ids"],
            "coord_plane",
        )
        self.assertEqual(rows_by_id["legacy-x-axis"]["coverage_status"], "covered_by_alias")
        self.assertEqual(rows_by_id["legacy-x-axis"]["matched_concept_ids"], "x_axis")
        self.assertEqual(rows_by_id["legacy-axis-point"]["coverage_status"], "needs_review")
        self.assertEqual(rows_by_id["legacy-axis-point"]["confidence"], "low")
        self.assertEqual(
            rows_by_id["legacy-axis-point"]["candidate_action"],
            "review_against_official_sources",
        )

    def test_middle_scope_filters_out_elementary_records_and_uses_achievement_tags(self) -> None:
        legacy_data = {
            "curriculum_nodes": [
                {
                    "id": "legacy-elementary",
                    "label": "Elementary counting",
                    "area": "Number",
                    "gradeBand": "elementary1-2",
                },
                {
                    "id": "legacy-middle",
                    "label": "Linear function",
                    "area": "Relation",
                    "gradeBand": "middle1-3",
                },
            ],
            "achievement_standards": [
                {
                    "code": "9M02-01",
                    "label": "Do not use full achievement sentences as concepts.",
                    "area": "Relation",
                    "gradeBand": "middle1-3",
                    "conceptTags": ["slope"],
                },
                {
                    "code": "6M01-01",
                    "label": "Elementary standard",
                    "area": "Number",
                    "gradeBand": "elementary5-6",
                    "conceptTags": ["fraction"],
                },
            ],
        }
        concepts = [
            {
                "id": "linear_function",
                "label_ko": "Linear function",
                "aliases": [],
                "domain": "Relation",
                "unit": "Linear function",
            }
        ]

        rows = legacy_gap_audit.legacy_gap_rows(legacy_data, concepts)

        self.assertEqual(
            [row["legacy_id"] for row in rows],
            ["achievement:9M02-01:slope", "legacy-middle"],
        )
        self.assertEqual(rows[0]["legacy_record_type"], "achievement_concept_tag")
        self.assertEqual(rows[0]["legacy_label_ko"], "slope")
        self.assertEqual(rows[0]["coverage_status"], "needs_review")

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "legacy_record_type": "curriculum_node",
                "legacy_id": "legacy-coordinate-plane",
                "legacy_label_ko": "Coordinate Plane",
                "legacy_grade": "middle1-3",
                "legacy_domain": "Relation",
                "legacy_unit": "Coordinate Plane",
                "coverage_status": "covered_by_label",
                "matched_concept_ids": "coord_plane",
                "matched_concept_labels": "Coordinate Plane",
                "candidate_action": "no_action_existing_concept",
                "confidence": "medium",
                "source_note": "legacy source",
                "notes": "Matched by normalized label.",
            },
            {
                "legacy_record_type": "curriculum_node",
                "legacy_id": "legacy-axis-point",
                "legacy_label_ko": "Axis point",
                "legacy_grade": "middle1-3",
                "legacy_domain": "Relation",
                "legacy_unit": "Axis point",
                "coverage_status": "needs_review",
                "matched_concept_ids": "",
                "matched_concept_labels": "",
                "candidate_action": "review_against_official_sources",
                "confidence": "low",
                "source_note": "legacy source",
                "notes": "No normalized label or alias match in concepts.json.",
            },
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "legacy-gap-audit.csv"
            legacy_gap_audit.write_csv(rows, csv_path)
            markdown = legacy_gap_audit.render_markdown(rows)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), legacy_gap_audit.CSV_FIELDS)
        self.assertIn("# Legacy Gap Audit", markdown)
        self.assertIn("needs_review: 1", markdown)
        self.assertIn("Axis point", markdown)


if __name__ == "__main__":
    unittest.main()
