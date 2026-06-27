from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_textbook_evidence_workplan as workplan


class BuildTextbookEvidenceWorkplanTests(unittest.TestCase):
    def test_workplan_rows_join_concept_and_edge_packet_indexes(self) -> None:
        concept_index_rows = [
            {
                "rank": "1",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_count": "2",
                "pending_textbook_evidence_count": "2",
                "low_confidence_count": "1",
                "priority_tier": "highest",
                "priority_score": "90",
                "next_action": "textbook_evidence_for_low_confidence",
                "packet_csv": "rank-01.csv",
                "packet_md": "rank-01.md",
            },
            {
                "rank": "2",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "일차함수와 그 그래프",
                "concept_count": "1",
                "pending_textbook_evidence_count": "1",
                "low_confidence_count": "0",
                "priority_tier": "high",
                "priority_score": "20",
                "next_action": "add_textbook_page_refs",
                "packet_csv": "rank-02.csv",
                "packet_md": "rank-02.md",
            },
        ]
        edge_index_rows = [
            {
                "rank": "1",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "edge_count": "5",
                "intra_unit_edge_count": "3",
                "cross_unit_edge_count": "2",
                "low_confidence_count": "2",
                "packet_csv": "rank-01.csv",
                "packet_md": "rank-01.md",
            },
            {
                "rank": "2",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "일차함수와 그 그래프",
                "edge_count": "4",
                "intra_unit_edge_count": "4",
                "cross_unit_edge_count": "0",
                "low_confidence_count": "0",
                "packet_csv": "rank-02.csv",
                "packet_md": "rank-02.md",
            },
        ]
        edge_packet_rows_by_rank = {
            1: [
                {"extraction_status": "pending_textbook_pdf"},
                {"extraction_status": "textbook_evidence_linked"},
                {"extraction_status": "pending_textbook_pdf"},
                {"extraction_status": "pending_textbook_pdf"},
                {"extraction_status": "pending_textbook_pdf"},
            ],
            2: [
                {"extraction_status": "textbook_evidence_linked"},
                {"extraction_status": "textbook_evidence_linked"},
                {"extraction_status": "textbook_evidence_linked"},
                {"extraction_status": "textbook_evidence_linked"},
            ],
        }

        rows = workplan.textbook_evidence_workplan_rows(
            concept_index_rows,
            edge_index_rows,
            edge_packet_rows_by_rank=edge_packet_rows_by_rank,
        )

        self.assertEqual([row["rank"] for row in rows], [1, 2])
        self.assertEqual(rows[0]["total_evidence_rows"], 7)
        self.assertEqual(rows[0]["pending_edge_evidence_count"], 4)
        self.assertEqual(rows[0]["total_pending_evidence_count"], 6)
        self.assertEqual(rows[0]["total_low_confidence_count"], 3)
        self.assertEqual(rows[0]["workplan_score"], 100)
        self.assertEqual(rows[0]["next_action"], "fill_low_confidence_concept_and_edge_evidence")
        self.assertEqual(rows[0]["concept_packet_csv"], "rank-01.csv")
        self.assertEqual(rows[0]["edge_packet_csv"], "rank-01.csv")
        self.assertEqual(rows[1]["next_action"], "add_textbook_page_refs")

    def test_missing_edge_index_rank_is_reported(self) -> None:
        with self.assertRaises(ValueError):
            workplan.textbook_evidence_workplan_rows(
                [{"rank": "1", "grade": "중1", "domain": "수와 연산", "unit": "정수와 유리수"}],
                [],
            )

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "rank": 1,
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "priority_tier": "highest",
                "priority_score": 90,
                "workplan_score": 100,
                "concept_count": 2,
                "pending_concept_evidence_count": 2,
                "low_confidence_concept_count": 1,
                "edge_count": 5,
                "pending_edge_evidence_count": 4,
                "intra_unit_edge_count": 3,
                "cross_unit_edge_count": 2,
                "low_confidence_edge_count": 2,
                "total_evidence_rows": 7,
                "total_pending_evidence_count": 6,
                "total_low_confidence_count": 3,
                "next_action": "fill_low_confidence_concept_and_edge_evidence",
                "concept_next_action": "textbook_evidence_for_low_confidence",
                "concept_packet_csv": "rank-01.csv",
                "concept_packet_md": "rank-01.md",
                "edge_packet_csv": "rank-01.csv",
                "edge_packet_md": "rank-01.md",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "textbook-evidence-workplan.csv"
            workplan.write_csv(rows, csv_path)
            markdown = workplan.render_markdown(rows)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), workplan.CSV_FIELDS)
        self.assertIn("# Textbook Evidence Workplan", markdown)
        self.assertIn("좌표평면과 그래프", markdown)
        self.assertIn("fill_low_confidence_concept_and_edge_evidence", markdown)


if __name__ == "__main__":
    unittest.main()
