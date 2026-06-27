from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_legacy_gap_evidence_scan as evidence_scan


class BuildLegacyGapEvidenceScanTests(unittest.TestCase):
    def test_source_refs_mentioning_candidate_are_extracted(self) -> None:
        source_review_rows = [
            {
                "candidate_label": "덧셈",
                "integration_status": "stage_prerequisite_node",
                "proposed_concept_id": "prereq_addition",
                "review_status": "needs_official_prerequisite_confirmation",
                "review_priority": "official_source_first",
                "legacy_units": "9수02-02; 9수02-09",
                "search_terms": "덧셈; 9수02-02; 일차식의 덧셈과 뺄셈",
                "target_concept_ids": "linear_expression_add_sub; polynomial_add_sub",
                "target_source_ref_count": "2",
                "target_source_refs": (
                    "linear_expression_add_sub: curriculum_math_2022 @ printed p. 34; [9수02-02] "
                    "-> 일차식의 덧셈과 뺄셈 원리를 이해한다. || "
                    "polynomial_mul: curriculum_math_2022 @ printed p. 35; [9수02-10] "
                    "-> 단항식과 다항식의 곱셈을 다룬다."
                ),
            }
        ]

        rows = evidence_scan.evidence_scan_rows(source_review_rows)

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["candidate_label"], "덧셈")
        self.assertEqual(rows[0]["evidence_signal"], "target_source_refs_mention_candidate")
        self.assertEqual(rows[0]["candidate_mention_count"], "1")
        self.assertIn("일차식의 덧셈과 뺄셈", rows[0]["matching_target_source_refs"])
        self.assertNotIn("곱셈을 다룬다", rows[0]["matching_target_source_refs"])
        self.assertIn("before creating prereq_addition", rows[0]["recommended_action"])

    def test_missing_target_source_refs_requires_direct_legacy_unit_review(self) -> None:
        source_review_rows = [
            {
                "candidate_label": "비",
                "integration_status": "stage_prerequisite_node",
                "proposed_concept_id": "prereq_ratio",
                "review_status": "needs_official_prerequisite_confirmation",
                "review_priority": "official_source_first",
                "legacy_units": "9수02-07; 9수03-12",
                "search_terms": "비; 9수02-07; 9수03-12",
                "target_concept_ids": "",
                "target_source_ref_count": "0",
                "target_source_refs": "",
            }
        ]

        rows = evidence_scan.evidence_scan_rows(source_review_rows)

        self.assertEqual(rows[0]["evidence_signal"], "direct_legacy_unit_review_needed")
        self.assertEqual(rows[0]["candidate_mention_count"], "0")
        self.assertIn("Inspect legacy units directly", rows[0]["recommended_action"])
        self.assertIn("No target source refs", rows[0]["notes"])

    def test_alias_candidate_is_marked_for_alias_wording_review(self) -> None:
        source_review_rows = [
            {
                "candidate_label": "피타고라스",
                "integration_status": "stage_alias_review",
                "proposed_concept_id": "",
                "review_status": "needs_alias_confirmation",
                "review_priority": "alias_review",
                "legacy_units": "9수03-15",
                "search_terms": "피타고라스; 피타고라스 정리",
                "target_concept_ids": "pythagorean_theorem",
                "target_source_ref_count": "1",
                "target_source_refs": (
                    "pythagorean_theorem: curriculum_math_2022 @ printed p. 38; [9수03-15] "
                    "-> 피타고라스 정리를 이해하고 정당화한다."
                ),
            }
        ]

        rows = evidence_scan.evidence_scan_rows(source_review_rows)

        self.assertEqual(rows[0]["evidence_signal"], "alias_source_refs_mention_candidate")
        self.assertEqual(rows[0]["candidate_mention_count"], "1")
        self.assertIn("Review alias wording", rows[0]["recommended_action"])

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "candidate_label": "비",
                "integration_status": "stage_prerequisite_node",
                "proposed_concept_id": "prereq_ratio",
                "review_status": "needs_official_prerequisite_confirmation",
                "evidence_signal": "direct_legacy_unit_review_needed",
                "candidate_mention_count": "0",
                "legacy_units": "9수02-07",
                "target_source_ref_count": "0",
                "matching_target_source_refs": "",
                "recommended_action": "Inspect legacy units directly.",
                "notes": "No target source refs.",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "legacy-gap-evidence-scan.csv"
            evidence_scan.write_csv(rows, csv_path)
            markdown = evidence_scan.render_markdown(rows)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), evidence_scan.CSV_FIELDS)
        self.assertIn("# Legacy Gap Evidence Scan", markdown)
        self.assertIn("direct_legacy_unit_review_needed: 1", markdown)
        self.assertIn("비", markdown)


if __name__ == "__main__":
    unittest.main()
