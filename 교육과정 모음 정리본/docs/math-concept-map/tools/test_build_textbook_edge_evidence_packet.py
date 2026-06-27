from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_textbook_edge_evidence_packet as packet


class BuildTextbookEdgeEvidencePacketTests(unittest.TestCase):
    def test_edge_packet_rows_include_edges_touching_ranked_unit(self) -> None:
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
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
            },
            {
                "id": "axis",
                "label_ko": "좌표축",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
            },
            {
                "id": "integer",
                "label_ko": "정수",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "정수와 유리수",
            },
            {
                "id": "slope",
                "label_ko": "기울기",
                "grade": "중2",
                "domain": "변화와 관계",
                "unit": "일차함수와 그 그래프",
            },
        ]
        edges = [
            {
                "id": "coord__contains__axis",
                "source_id": "coord",
                "target_id": "axis",
                "relationship_type": "contains",
                "confidence": "high",
                "notes": "",
                "source_refs": (
                    '[{"source_id":"curriculum_math_2022","locator":"printed p. 36",'
                    '"evidence_kind":"term_list","summary":"좌표와 좌표축"}]'
                ),
            },
            {
                "id": "integer__prerequisite_for__coord",
                "source_id": "integer",
                "target_id": "coord",
                "relationship_type": "prerequisite_for",
                "confidence": "low",
                "notes": "Needs textbook sequencing evidence.",
                "source_refs": "[]",
            },
            {
                "id": "integer__related_to__slope",
                "source_id": "integer",
                "target_id": "slope",
                "relationship_type": "related_to",
                "confidence": "medium",
                "notes": "",
                "source_refs": "[]",
            },
        ]

        rows = packet.textbook_edge_evidence_packet_rows(concepts, edges, queue_rows, rank=1)

        self.assertEqual([row["edge_id"] for row in rows], ["integer__prerequisite_for__coord", "coord__contains__axis"])
        self.assertEqual(rows[0]["edge_scope"], "cross_unit")
        self.assertEqual(rows[0]["source_label_ko"], "정수")
        self.assertEqual(rows[0]["target_label_ko"], "좌표")
        self.assertIn("prerequisite_ref", rows[0]["required_evidence_fields"])
        self.assertIn("textbook_page_refs", rows[0]["required_evidence_fields"])
        self.assertIn("extraction_notes", rows[0]["required_evidence_fields"])
        self.assertIn("sequencing", rows[0]["evidence_focus"])
        self.assertEqual(rows[1]["edge_scope"], "intra_unit")
        self.assertIn("structure_ref", rows[1]["required_evidence_fields"])
        self.assertIn("curriculum_math_2022", rows[1]["current_source_refs"])
        self.assertEqual(rows[1]["source_ref_count"], 1)

    def test_required_evidence_fields_follow_relationship_type(self) -> None:
        self.assertEqual(
            packet.required_evidence_fields({"relationship_type": "represented_by", "confidence": "medium"}),
            "representation_ref;textbook_page_refs",
        )
        self.assertEqual(
            packet.required_evidence_fields({"relationship_type": "often_confused_with", "confidence": "low"}),
            "misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes",
        )

    def test_packet_set_and_index_outputs_are_stable(self) -> None:
        packets = [
            {
                "rank": 1,
                "target": {
                    "rank": "1",
                    "grade": "중1",
                    "domain": "변화와 관계",
                    "unit": "좌표평면과 그래프",
                    "priority_tier": "highest",
                    "priority_score": "90",
                },
                "rows": [
                    {
                        "packet_rank": 1,
                        "grade": "중1",
                        "domain": "변화와 관계",
                        "unit": "좌표평면과 그래프",
                        "edge_id": "coord__contains__axis",
                        "edge_scope": "intra_unit",
                        "source_id": "coord",
                        "source_label_ko": "좌표",
                        "source_unit": "좌표평면과 그래프",
                        "target_id": "axis",
                        "target_label_ko": "좌표축",
                        "target_unit": "좌표평면과 그래프",
                        "relationship_type": "contains",
                        "confidence": "high",
                        "source_ref_count": 1,
                        "current_source_refs": "curriculum_math_2022: printed p. 36",
                        "notes": "",
                        "required_evidence_fields": "structure_ref;textbook_page_refs",
                        "evidence_focus": "Find textbook structure evidence for the containment relation.",
                        "extraction_status": "pending_textbook_pdf",
                        "structure_ref": "",
                        "prerequisite_ref": "",
                        "representation_ref": "",
                        "procedure_ref": "",
                        "contrast_ref": "",
                        "misconception_ref": "",
                        "problem_pattern_ref": "",
                        "related_ref": "",
                        "textbook_page_refs": "",
                        "extraction_notes": "",
                    }
                ],
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            output_dir = Path(temp_dir)
            packet.write_packet_set(packets, output_dir)

            with (output_dir / "index.csv").open("r", encoding="utf-8-sig", newline="") as f:
                index_rows = list(csv.DictReader(f))
            with (output_dir / "rank-01.csv").open("r", encoding="utf-8-sig", newline="") as f:
                packet_rows = list(csv.DictReader(f))

            index_markdown = (output_dir / "index.md").read_text(encoding="utf-8")
            packet_markdown = (output_dir / "rank-01.md").read_text(encoding="utf-8")

        self.assertEqual(list(index_rows[0]), packet.INDEX_FIELDS)
        self.assertEqual(list(packet_rows[0]), packet.CSV_FIELDS)
        self.assertEqual(index_rows[0]["edge_count"], "1")
        self.assertIn("# Textbook Edge Evidence Packet Index", index_markdown)
        self.assertIn("# Textbook Edge Evidence Packet", packet_markdown)


if __name__ == "__main__":
    unittest.main()
