from __future__ import annotations

import unittest

import build_node_edge_consistency_audit as audit


class BuildNodeEdgeConsistencyAuditTests(unittest.TestCase):
    def test_consistency_rows_report_missing_parent_and_prerequisite_edges(self) -> None:
        concepts = [
            {
                "id": "unit",
                "label_ko": "단원",
                "parent_ids": [],
                "prerequisite_ids": [],
                "related_ids": [],
            },
            {
                "id": "integer",
                "label_ko": "정수",
                "parent_ids": ["unit"],
                "prerequisite_ids": [],
                "related_ids": [],
            },
            {
                "id": "equation",
                "label_ko": "방정식",
                "parent_ids": [],
                "prerequisite_ids": ["integer"],
                "related_ids": [],
            },
        ]
        edges = [
            {
                "id": "edge_integer_equation",
                "source_id": "integer",
                "target_id": "equation",
                "relationship_type": "prerequisite_for",
            },
            {
                "id": "edge_unit_equation",
                "source_id": "unit",
                "target_id": "equation",
                "relationship_type": "prerequisite_for",
            }
        ]

        rows = audit.consistency_issue_rows(concepts, edges)

        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[0]["issue_type"], "missing_edge_for_parent_id")
        self.assertEqual(rows[0]["node_id"], "integer")
        self.assertEqual(rows[0]["related_id"], "unit")
        self.assertEqual(rows[0]["expected_relationship_type"], "contains")
        self.assertEqual(rows[1]["issue_type"], "edge_without_prerequisite_id")

    def test_consistency_rows_report_missing_related_edge_when_no_allowed_edge_exists(self) -> None:
        concepts = [
            {
                "id": "axis",
                "label_ko": "좌표축",
                "parent_ids": [],
                "prerequisite_ids": [],
                "related_ids": ["quadrant"],
            },
            {
                "id": "quadrant",
                "label_ko": "사분면",
                "parent_ids": [],
                "prerequisite_ids": [],
                "related_ids": [],
            },
        ]

        rows = audit.consistency_issue_rows(concepts, edges=[])

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["issue_type"], "missing_edge_for_related_id")
        self.assertEqual(rows[0]["expected_relationship_type"], "related_edge")

    def test_consistency_rows_accept_related_edge_in_either_direction(self) -> None:
        concepts = [
            {
                "id": "axis",
                "label_ko": "좌표축",
                "parent_ids": [],
                "prerequisite_ids": [],
                "related_ids": ["quadrant"],
            },
            {
                "id": "quadrant",
                "label_ko": "사분면",
                "parent_ids": [],
                "prerequisite_ids": [],
                "related_ids": [],
            },
        ]
        edges = [
            {
                "id": "edge_quadrant_axis",
                "source_id": "quadrant",
                "target_id": "axis",
                "relationship_type": "contrasts_with",
            }
        ]

        rows = audit.consistency_issue_rows(concepts, edges)

        self.assertEqual(rows, [])

    def test_summary_counts_issue_types(self) -> None:
        rows = [
            {"issue_type": "missing_edge_for_parent_id"},
            {"issue_type": "missing_edge_for_parent_id"},
            {"issue_type": "edge_without_parent_id"},
        ]

        summary = audit.issue_summary(rows)

        self.assertEqual(summary["total_issue_count"], 3)
        self.assertEqual(summary["missing_edge_for_parent_id"], 2)
        self.assertEqual(summary["edge_without_parent_id"], 1)

    def test_markdown_renders_summary_and_priority_rows(self) -> None:
        rows = [
            {
                "issue_type": "missing_edge_for_parent_id",
                "node_id": "integer",
                "node_label_ko": "정수",
                "array_field": "parent_ids",
                "related_id": "unit",
                "related_label_ko": "단원",
                "expected_relationship_type": "contains",
                "matching_edge_ids": "",
                "issue_status": "review_needed",
                "notes": "parent_ids entry has no matching contains edge",
            }
        ]

        markdown = audit.render_markdown(rows)

        self.assertIn("# Node Edge Consistency Audit", markdown)
        self.assertIn("- total issues: 1", markdown)
        self.assertIn("| missing_edge_for_parent_id | integer | 정수 | parent_ids | unit | 단원 | contains |", markdown)


if __name__ == "__main__":
    unittest.main()
