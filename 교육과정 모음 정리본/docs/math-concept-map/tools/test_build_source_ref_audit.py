from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_source_ref_audit as audit


class BuildSourceRefAuditTests(unittest.TestCase):
    def test_source_ref_rows_group_by_record_kind_source_and_evidence_kind(self) -> None:
        concepts = [
            {
                "id": "coord",
                "confidence": "high",
                "source_refs": [
                    {
                        "source_id": "curriculum_math_2022",
                        "locator": "p. 1",
                        "evidence_kind": "achievement_standard",
                        "summary": "좌표평면 성취기준",
                    },
                    {
                        "source_id": "achievement_math_2022",
                        "locator": "p. 2",
                        "evidence_kind": "achievement_level",
                        "summary": "좌표평면 성취수준",
                    },
                ],
            },
            {
                "id": "graph_misread",
                "confidence": "low",
                "source_refs": [
                    {
                        "source_id": "achievement_math_2022",
                        "locator": "",
                        "evidence_kind": "achievement_level",
                        "summary": "",
                    }
                ],
            },
        ]
        edges = [
            {
                "id": "edge_coord_graph",
                "confidence": "medium",
                "source_refs": [
                    {
                        "source_id": "curriculum_math_2022",
                        "locator": "p. 3",
                        "evidence_kind": "term_list",
                        "summary": "좌표 용어",
                    }
                ],
            }
        ]

        rows = audit.source_ref_summary_rows(concepts, edges)
        concept_achievement = next(
            row
            for row in rows
            if row["record_kind"] == "concept"
            and row["source_id"] == "achievement_math_2022"
            and row["evidence_kind"] == "achievement_level"
        )
        edge_terms = next(row for row in rows if row["record_kind"] == "edge")

        self.assertEqual(concept_achievement["source_ref_count"], 2)
        self.assertEqual(concept_achievement["record_count"], 2)
        self.assertEqual(concept_achievement["high_confidence_record_count"], 1)
        self.assertEqual(concept_achievement["low_confidence_record_count"], 1)
        self.assertEqual(concept_achievement["missing_locator_count"], 1)
        self.assertEqual(concept_achievement["missing_summary_count"], 1)
        self.assertEqual(edge_terms["medium_confidence_record_count"], 1)

    def test_source_ref_quality_summary_counts_totals_and_missing_details(self) -> None:
        rows = [
            {
                "record_kind": "concept",
                "source_id": "curriculum_math_2022",
                "evidence_kind": "achievement_standard",
                "source_ref_count": 3,
                "record_count": 2,
                "high_confidence_record_count": 2,
                "medium_confidence_record_count": 0,
                "low_confidence_record_count": 0,
                "missing_locator_count": 0,
                "missing_summary_count": 1,
            },
            {
                "record_kind": "edge",
                "source_id": "achievement_math_2022",
                "evidence_kind": "achievement_level",
                "source_ref_count": 4,
                "record_count": 3,
                "high_confidence_record_count": 1,
                "medium_confidence_record_count": 2,
                "low_confidence_record_count": 0,
                "missing_locator_count": 1,
                "missing_summary_count": 0,
            },
        ]

        summary = audit.source_ref_quality_summary(rows)

        self.assertEqual(summary["source_ref_count"], 7)
        self.assertEqual(summary["missing_locator_count"], 1)
        self.assertEqual(summary["missing_summary_count"], 1)

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "record_kind": "concept",
                "source_id": "curriculum_math_2022",
                "evidence_kind": "achievement_standard",
                "source_ref_count": 3,
                "record_count": 2,
                "high_confidence_record_count": 2,
                "medium_confidence_record_count": 0,
                "low_confidence_record_count": 0,
                "missing_locator_count": 0,
                "missing_summary_count": 0,
            }
        ]
        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "source-ref-audit.csv"

            audit.write_csv(rows, csv_path)
            markdown = audit.render_markdown(rows)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), audit.CSV_FIELDS)
        self.assertIn("# Source Reference Audit", markdown)
        self.assertIn("curriculum_math_2022", markdown)
        self.assertIn("achievement_standard", markdown)


if __name__ == "__main__":
    unittest.main()
