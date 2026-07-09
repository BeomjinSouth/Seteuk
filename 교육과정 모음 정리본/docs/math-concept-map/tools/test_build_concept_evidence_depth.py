from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_concept_evidence_depth as depth


class BuildConceptEvidenceDepthTests(unittest.TestCase):
    def test_concept_rows_classify_dual_single_textbook_and_gap_evidence(self) -> None:
        concepts = [
            {
                "id": "coord",
                "label_ko": "좌표",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "confidence": "high",
                "source_refs": [
                    {"source_id": "curriculum_math_2022", "evidence_kind": "achievement_standard"},
                    {"source_id": "achievement_math_2022", "evidence_kind": "achievement_level"},
                ],
            },
            {
                "id": "axis",
                "label_ko": "축",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "confidence": "medium",
                "source_refs": [
                    {"source_id": "curriculum_math_2022", "evidence_kind": "term_list"},
                ],
            },
            {
                "id": "textbook_term",
                "label_ko": "교과서 용어",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "confidence": "high",
                "source_refs": [
                    {"source_id": "textbook_originals", "evidence_kind": "textbook_body"},
                ],
            },
            {
                "id": "gap",
                "label_ko": "근거 없음",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "confidence": "low",
                "source_refs": [],
            },
        ]

        rows = depth.concept_evidence_rows(concepts)
        by_id = {row["concept_id"]: row for row in rows}

        self.assertEqual(by_id["coord"]["evidence_depth"], "official_dual_source")
        self.assertEqual(by_id["coord"]["needs_textbook_evidence"], "yes")
        self.assertEqual(by_id["axis"]["evidence_depth"], "official_single_source")
        self.assertEqual(by_id["textbook_term"]["evidence_depth"], "textbook_supported")
        self.assertEqual(by_id["textbook_term"]["needs_textbook_evidence"], "no")
        self.assertEqual(by_id["gap"]["evidence_depth"], "source_gap")

    def test_summary_counts_depths_and_textbook_gaps(self) -> None:
        rows = [
            {
                "evidence_depth": "official_dual_source",
                "needs_textbook_evidence": "yes",
                "confidence": "high",
            },
            {
                "evidence_depth": "official_single_source",
                "needs_textbook_evidence": "yes",
                "confidence": "low",
            },
            {
                "evidence_depth": "textbook_supported",
                "needs_textbook_evidence": "no",
                "confidence": "medium",
            },
        ]

        summary = depth.evidence_depth_summary(rows)

        self.assertEqual(summary["concept_count"], 3)
        self.assertEqual(summary["needs_textbook_evidence_count"], 2)
        self.assertEqual(summary["low_confidence_count"], 1)
        self.assertEqual(summary["depth_counts"]["official_dual_source"], 1)

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "concept_id": "coord",
                "label_ko": "좌표",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "confidence": "high",
                "source_ref_count": 2,
                "source_count": 2,
                "evidence_kind_count": 2,
                "sources": "achievement_math_2022; curriculum_math_2022",
                "evidence_kinds": "achievement_level; achievement_standard",
                "has_curriculum_evidence": "yes",
                "has_achievement_evidence": "yes",
                "has_textbook_evidence": "no",
                "evidence_depth": "official_dual_source",
                "needs_textbook_evidence": "yes",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "concept-evidence-depth.csv"

            depth.write_csv(rows, csv_path)
            markdown = depth.render_markdown(rows)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), depth.CSV_FIELDS)
        self.assertIn("# Concept Evidence Depth", markdown)
        self.assertIn("official_dual_source", markdown)
        self.assertIn("needs textbook evidence", markdown)


if __name__ == "__main__":
    unittest.main()
