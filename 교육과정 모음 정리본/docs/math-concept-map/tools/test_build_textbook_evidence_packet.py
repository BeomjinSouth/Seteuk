from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_textbook_evidence_packet as packet


class BuildTextbookEvidencePacketTests(unittest.TestCase):
    def test_packet_rows_filter_ranked_unit_and_add_textbook_slots(self) -> None:
        queue_rows = [
            {
                "rank": "1",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "priority_tier": "highest",
                "priority_score": "90",
            }
        ]
        concepts = [
            {
                "id": "coord",
                "label_ko": "좌표",
                "concept_type": "term",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "confidence": "high",
                "source_refs": [
                    {
                        "source_id": "curriculum_math_2022",
                        "locator": "p. 1",
                        "evidence_kind": "term_list",
                        "summary": "좌표 용어",
                    }
                ],
            },
            {
                "id": "axis_misread",
                "label_ko": "축 오개념",
                "concept_type": "misconception_risk",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "confidence": "low",
                "source_refs": [
                    {
                        "source_id": "achievement_math_2022",
                        "locator": "p. 2",
                        "evidence_kind": "achievement_level",
                        "summary": "축 해석 오개념",
                    }
                ],
            },
            {
                "id": "integer",
                "label_ko": "정수",
                "concept_type": "term",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "정수와 유리수",
                "confidence": "high",
                "source_refs": [],
            },
        ]
        evidence_rows = [
            {
                "concept_id": "coord",
                "evidence_depth": "official_single_source",
                "needs_textbook_evidence": "yes",
                "source_ref_count": "1",
            },
            {
                "concept_id": "axis_misread",
                "evidence_depth": "official_dual_source",
                "needs_textbook_evidence": "yes",
                "source_ref_count": "1",
            },
        ]

        rows = packet.textbook_evidence_packet_rows(concepts, evidence_rows, queue_rows, rank=1)

        self.assertEqual([row["concept_id"] for row in rows], ["axis_misread", "coord"])
        self.assertEqual(rows[0]["extraction_status"], "pending_textbook_pdf")
        self.assertEqual(rows[0]["definition_ref"], "")
        self.assertEqual(rows[0]["problem_pattern_ref"], "")
        self.assertIn("achievement_math_2022", rows[0]["current_source_refs"])
        self.assertEqual(rows[1]["evidence_depth"], "official_single_source")

    def test_target_unit_returns_rank_metadata(self) -> None:
        queue_rows = [
            {"rank": "2", "grade": "중2", "domain": "자료와 가능성", "unit": "경우의 수와 확률"},
            {"rank": "1", "grade": "중1", "domain": "변화와 관계", "unit": "좌표평면과 그래프"},
        ]

        target = packet.target_unit(queue_rows, rank=1)

        self.assertEqual(target["unit"], "좌표평면과 그래프")

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        target = {
            "rank": "1",
            "grade": "중1",
            "domain": "변화와 관계",
            "unit": "좌표평면과 그래프",
            "priority_tier": "highest",
            "priority_score": "90",
        }
        rows = [
            {
                "packet_rank": 1,
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_id": "coord",
                "label_ko": "좌표",
                "concept_type": "term",
                "confidence": "high",
                "evidence_depth": "official_single_source",
                "needs_textbook_evidence": "yes",
                "source_ref_count": 1,
                "current_source_refs": "curriculum_math_2022: p. 1",
                "extraction_status": "pending_textbook_pdf",
                "toc_ref": "",
                "learning_objective_ref": "",
                "definition_ref": "",
                "summary_ref": "",
                "example_ref": "",
                "term_explanation_ref": "",
                "problem_pattern_ref": "",
                "textbook_page_refs": "",
                "extraction_notes": "",
            }
        ]
        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "packet.csv"

            packet.write_csv(rows, csv_path)
            markdown = packet.render_markdown(rows, target)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), packet.CSV_FIELDS)
        self.assertIn("# Textbook Evidence Packet", markdown)
        self.assertIn("좌표평면과 그래프", markdown)
        self.assertIn("coord", markdown)


if __name__ == "__main__":
    unittest.main()
