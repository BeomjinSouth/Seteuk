from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_related_edge_resolution_queue as queue


class BuildRelatedEdgeResolutionQueueTests(unittest.TestCase):
    def test_rows_keep_missing_related_edges_and_suggest_resolution_type(self) -> None:
        concepts = [
            {
                "id": "coord",
                "label_ko": "좌표평면",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_type": "core_concept",
                "confidence": "high",
                "related_ids": ["axis"],
                "source_refs": [
                    {
                        "source_id": "curriculum_math_2022",
                        "locator": "[9수02-05]",
                        "summary": "좌표평면에서 점의 좌표를 찾는다.",
                    }
                ],
            },
            {
                "id": "axis",
                "label_ko": "좌표축",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_type": "representation",
                "confidence": "high",
                "related_ids": ["coord"],
                "source_refs": [],
            },
            {
                "id": "axis_swap",
                "label_ko": "x좌표와 y좌표 혼동",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_type": "misconception_risk",
                "confidence": "low",
                "related_ids": ["axis"],
                "source_refs": [],
            },
        ]
        consistency_rows = [
            {
                "issue_type": "missing_edge_for_related_id",
                "node_id": "coord",
                "related_id": "axis",
            },
            {
                "issue_type": "missing_edge_for_parent_id",
                "node_id": "axis",
                "related_id": "coord",
            },
            {
                "issue_type": "missing_edge_for_related_id",
                "node_id": "axis_swap",
                "related_id": "axis",
            },
        ]

        rows = queue.related_edge_resolution_rows(concepts, consistency_rows)

        self.assertEqual([row["node_id"] for row in rows], ["axis_swap", "coord"])
        self.assertEqual(rows[0]["candidate_relationship_types"], "often_confused_with")
        self.assertEqual(rows[0]["next_action"], "confirm_often_confused_with_evidence")
        self.assertEqual(rows[1]["candidate_relationship_types"], "represented_by; related_to")
        self.assertEqual(rows[1]["reciprocal_related_id"], "yes")
        self.assertEqual(rows[1]["source_refs"], "curriculum_math_2022: [9수02-05]")

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "rank": 1,
                "node_id": "axis_swap",
                "node_label_ko": "x좌표와 y좌표 혼동",
                "related_id": "axis",
                "related_label_ko": "좌표축",
                "node_domain": "변화와 관계",
                "node_unit": "좌표평면과 그래프",
                "related_domain": "변화와 관계",
                "related_unit": "좌표평면과 그래프",
                "node_concept_type": "misconception_risk",
                "related_concept_type": "representation",
                "same_domain": "yes",
                "same_unit": "yes",
                "reciprocal_related_id": "no",
                "candidate_relationship_types": "often_confused_with",
                "priority_score": 13,
                "priority_tier": "high",
                "next_action": "confirm_often_confused_with_evidence",
                "source_refs": "",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "related-edge-resolution-queue.csv"
            queue.write_csv(rows, csv_path)
            markdown = queue.render_markdown(rows)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), queue.CSV_FIELDS)
        self.assertIn("# Related Edge Resolution Queue", markdown)
        self.assertIn("- related edge candidates: 1", markdown)
        self.assertIn("| 1 | high | axis_swap | x좌표와 y좌표 혼동 | axis | 좌표축 |", markdown)


if __name__ == "__main__":
    unittest.main()
