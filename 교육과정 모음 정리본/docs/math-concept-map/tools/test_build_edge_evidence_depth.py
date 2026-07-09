from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_edge_evidence_depth as depth


class BuildEdgeEvidenceDepthTests(unittest.TestCase):
    def test_edge_rows_classify_source_depth_and_scope(self) -> None:
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
                "id": "linear",
                "label_ko": "일차함수",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "일차함수와 그 그래프",
            },
            {
                "id": "integer",
                "label_ko": "정수",
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "정수와 유리수",
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
                "source_refs": [
                    {"source_id": "curriculum_math_2022", "evidence_kind": "term_list"},
                    {"source_id": "achievement_math_2022", "evidence_kind": "achievement_level"},
                ],
            },
            {
                "id": "coord__prerequisite_for__linear",
                "source_id": "coord",
                "target_id": "linear",
                "relationship_type": "prerequisite_for",
                "confidence": "medium",
                "notes": "same domain, later unit",
                "source_refs": [
                    {"source_id": "curriculum_math_2022", "evidence_kind": "achievement_standard"},
                ],
            },
            {
                "id": "integer__related_to__coord",
                "source_id": "integer",
                "target_id": "coord",
                "relationship_type": "related_to",
                "confidence": "low",
                "notes": "needs textbook bridge",
                "source_refs": [
                    {"source_id": "textbook_originals", "evidence_kind": "textbook_body"},
                ],
            },
            {
                "id": "gap",
                "source_id": "integer",
                "target_id": "linear",
                "relationship_type": "related_to",
                "confidence": "low",
                "notes": "",
                "source_refs": [],
            },
        ]

        rows = depth.edge_evidence_rows(concepts, edges)
        by_id = {row["edge_id"]: row for row in rows}

        self.assertEqual(by_id["coord__contains__axis"]["edge_scope"], "same_unit")
        self.assertEqual(by_id["coord__contains__axis"]["evidence_depth"], "official_dual_source")
        self.assertEqual(by_id["coord__contains__axis"]["needs_textbook_evidence"], "yes")
        self.assertEqual(by_id["coord__contains__axis"]["source_ref_count"], 2)
        self.assertEqual(by_id["coord__prerequisite_for__linear"]["edge_scope"], "cross_unit_same_domain")
        self.assertEqual(by_id["coord__prerequisite_for__linear"]["evidence_depth"], "official_single_source")
        self.assertEqual(by_id["integer__related_to__coord"]["edge_scope"], "cross_domain_same_grade")
        self.assertEqual(by_id["integer__related_to__coord"]["evidence_depth"], "textbook_supported")
        self.assertEqual(by_id["integer__related_to__coord"]["needs_textbook_evidence"], "no")
        self.assertEqual(by_id["gap"]["evidence_depth"], "source_gap")

    def test_summary_counts_depths_textbook_gaps_and_low_confidence(self) -> None:
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

        self.assertEqual(summary["edge_count"], 3)
        self.assertEqual(summary["needs_textbook_evidence_count"], 2)
        self.assertEqual(summary["low_confidence_count"], 1)
        self.assertEqual(summary["depth_counts"]["official_dual_source"], 1)

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "edge_id": "coord__contains__axis",
                "source_id": "coord",
                "source_label_ko": "좌표",
                "source_grade": "중1",
                "source_domain": "변화와 관계",
                "source_unit": "좌표평면과 그래프",
                "target_id": "axis",
                "target_label_ko": "좌표축",
                "target_grade": "중1",
                "target_domain": "변화와 관계",
                "target_unit": "좌표평면과 그래프",
                "relationship_type": "contains",
                "edge_scope": "same_unit",
                "confidence": "high",
                "source_ref_count": 2,
                "source_count": 2,
                "evidence_kind_count": 2,
                "sources": "achievement_math_2022; curriculum_math_2022",
                "evidence_kinds": "achievement_level; term_list",
                "has_curriculum_evidence": "yes",
                "has_achievement_evidence": "yes",
                "has_textbook_evidence": "no",
                "evidence_depth": "official_dual_source",
                "needs_textbook_evidence": "yes",
                "notes": "",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "edge-evidence-depth.csv"

            depth.write_csv(rows, csv_path)
            markdown = depth.render_markdown(rows)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), depth.CSV_FIELDS)
        self.assertIn("# Edge Evidence Depth", markdown)
        self.assertIn("official_dual_source", markdown)
        self.assertIn("needs textbook evidence", markdown)


if __name__ == "__main__":
    unittest.main()
