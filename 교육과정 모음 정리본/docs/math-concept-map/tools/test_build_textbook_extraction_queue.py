from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_textbook_extraction_queue as queue


class BuildTextbookExtractionQueueTests(unittest.TestCase):
    def test_queue_rows_group_units_and_rank_by_textbook_need(self) -> None:
        evidence_rows = [
            {
                "concept_id": "coord",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "confidence": "high",
                "needs_textbook_evidence": "yes",
                "evidence_depth": "official_dual_source",
            },
            {
                "concept_id": "axis",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "confidence": "low",
                "needs_textbook_evidence": "yes",
                "evidence_depth": "official_single_source",
            },
            {
                "concept_id": "integer",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "정수와 유리수",
                "confidence": "medium",
                "needs_textbook_evidence": "no",
                "evidence_depth": "textbook_supported",
            },
        ]

        rows = queue.textbook_extraction_queue_rows(evidence_rows)

        self.assertEqual(rows[0]["unit"], "좌표평면과 그래프")
        self.assertEqual(rows[0]["concept_count"], 2)
        self.assertEqual(rows[0]["needs_textbook_evidence_count"], 2)
        self.assertEqual(rows[0]["low_confidence_count"], 1)
        self.assertEqual(rows[0]["official_single_source_count"], 1)
        self.assertEqual(rows[0]["priority_tier"], "medium")
        self.assertEqual(rows[0]["next_action"], "textbook_evidence_for_low_confidence")
        self.assertEqual(rows[1]["priority_tier"], "complete")

    def test_priority_tier_uses_score_thresholds(self) -> None:
        self.assertEqual(queue.priority_tier(40), "highest")
        self.assertEqual(queue.priority_tier(20), "high")
        self.assertEqual(queue.priority_tier(8), "medium")
        self.assertEqual(queue.priority_tier(1), "low")
        self.assertEqual(queue.priority_tier(0), "complete")

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "rank": 1,
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_count": 2,
                "needs_textbook_evidence_count": 2,
                "low_confidence_count": 1,
                "official_single_source_count": 1,
                "official_dual_source_count": 1,
                "textbook_supported_count": 0,
                "priority_score": 7,
                "priority_tier": "medium",
                "next_action": "textbook_evidence_for_low_confidence",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "textbook-extraction-queue.csv"
            queue.write_csv(rows, csv_path)
            markdown = queue.render_markdown(rows)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), queue.CSV_FIELDS)
        self.assertIn("# Textbook Extraction Queue", markdown)
        self.assertIn("좌표평면과 그래프", markdown)
        self.assertIn("textbook_evidence_for_low_confidence", markdown)


if __name__ == "__main__":
    unittest.main()
