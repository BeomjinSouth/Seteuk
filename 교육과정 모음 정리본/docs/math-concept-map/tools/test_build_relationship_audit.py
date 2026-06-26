from __future__ import annotations

import unittest

import build_relationship_audit as audit


class BuildRelationshipAuditTests(unittest.TestCase):
    def test_relationship_rows_count_edge_types_and_confidence(self) -> None:
        edges = [
            {
                "source_id": "unit",
                "target_id": "coord",
                "relationship_type": "contains",
                "confidence": "high",
            },
            {
                "source_id": "coord",
                "target_id": "ordered_pair",
                "relationship_type": "represented_by",
                "confidence": "medium",
            },
            {
                "source_id": "mistake",
                "target_id": "ordered_pair",
                "relationship_type": "often_confused_with",
                "confidence": "low",
            },
        ]

        rows = audit.relationship_summary_rows(edges, relationship_types=("contains", "represented_by", "used_in", "often_confused_with"))
        contains = next(row for row in rows if row["relationship_type"] == "contains")
        used_in = next(row for row in rows if row["relationship_type"] == "used_in")

        self.assertEqual(contains["edge_count"], 1)
        self.assertEqual(contains["high_confidence_count"], 1)
        self.assertEqual(contains["source_concept_count"], 1)
        self.assertEqual(contains["target_concept_count"], 1)
        self.assertEqual(used_in["edge_count"], 0)

    def test_connectivity_summary_counts_isolated_concepts(self) -> None:
        concepts = [
            {"id": "unit"},
            {"id": "coord"},
            {"id": "isolated"},
        ]
        edges = [
            {
                "source_id": "unit",
                "target_id": "coord",
                "relationship_type": "contains",
                "confidence": "high",
            }
        ]

        summary = audit.connectivity_summary(concepts, edges)

        self.assertEqual(summary["concept_count"], 3)
        self.assertEqual(summary["connected_concept_count"], 2)
        self.assertEqual(summary["isolated_concept_count"], 1)
        self.assertEqual(summary["isolated_concept_ids"], "isolated")

    def test_markdown_summarizes_edges_and_isolates(self) -> None:
        rows = [
            {
                "relationship_type": "contains",
                "edge_count": 2,
                "high_confidence_count": 2,
                "medium_confidence_count": 0,
                "low_confidence_count": 0,
                "source_concept_count": 1,
                "target_concept_count": 2,
            }
        ]
        summary = {
            "concept_count": 3,
            "connected_concept_count": 3,
            "isolated_concept_count": 0,
            "isolated_concept_ids": "",
            "edge_count": 2,
        }

        markdown = audit.render_markdown(rows, summary)

        self.assertIn("# 관계 감사", markdown)
        self.assertIn("- edge 총계: 2개", markdown)
        self.assertIn("- 고립 concept: 0개", markdown)
        self.assertIn("| contains | 2 | 2 | 0 | 0 |", markdown)


if __name__ == "__main__":
    unittest.main()
