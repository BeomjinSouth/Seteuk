from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_pilot_unit_map as pilot_unit_map


class BuildPilotUnitMapTests(unittest.TestCase):
    def test_target_unit_prefers_workplan_rank_metadata(self) -> None:
        rows = [
            {
                "rank": "1",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_count": "40",
                "edge_count": "202",
                "total_pending_evidence_count": "242",
            }
        ]

        target = pilot_unit_map.target_unit(rows, rank=1)

        self.assertEqual(target["unit"], "좌표평면과 그래프")
        self.assertEqual(target["concept_count"], "40")
        self.assertEqual(target["edge_count"], "202")

    def test_pilot_node_rows_filter_target_unit_and_join_evidence(self) -> None:
        target = {"rank": "1", "grade": "중1", "domain": "변화와 관계", "unit": "좌표평면과 그래프"}
        concepts = [
            {
                "id": "coord",
                "label_ko": "좌표",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_type": "term",
                "confidence": "high",
                "short_definition": "점의 위치를 나타내는 수의 짝.",
                "source_refs": [{"source_id": "curriculum_math_2022"}],
                "parent_ids": ["plane"],
                "prerequisite_ids": ["number_line"],
                "related_ids": ["ordered_pair"],
                "notes": "",
            },
            {
                "id": "axis_point",
                "label_ko": "축 위의 점",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_type": "sub_concept",
                "confidence": "low",
                "short_definition": "x축 또는 y축 위에 있는 점.",
                "source_refs": [{"source_id": "achievement_math_2022"}],
                "parent_ids": ["axis"],
                "prerequisite_ids": [],
                "related_ids": [],
                "notes": "교과서 예시 확인 필요",
            },
            {
                "id": "linear_function",
                "label_ko": "일차함수",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "일차함수와 그 그래프",
                "concept_type": "core_concept",
                "confidence": "high",
                "short_definition": "",
                "source_refs": [],
                "parent_ids": [],
                "prerequisite_ids": [],
                "related_ids": [],
                "notes": "",
            },
        ]
        evidence_rows = [
            {
                "concept_id": "coord",
                "evidence_depth": "official_single_source",
                "source_ref_count": "1",
                "needs_textbook_evidence": "yes",
            },
            {
                "concept_id": "axis_point",
                "evidence_depth": "official_dual_source",
                "source_ref_count": "1",
                "needs_textbook_evidence": "yes",
            },
        ]

        rows = pilot_unit_map.pilot_unit_node_rows(concepts, evidence_rows, target)

        self.assertEqual([row["concept_id"] for row in rows], ["axis_point", "coord"])
        self.assertEqual(rows[0]["evidence_depth"], "official_dual_source")
        self.assertEqual(rows[0]["parent_ids"], "axis")
        self.assertEqual(rows[1]["prerequisite_ids"], "number_line")
        self.assertEqual(rows[1]["related_ids"], "ordered_pair")

    def test_pilot_edge_rows_include_edges_touching_target_unit(self) -> None:
        target = {"rank": "1", "grade": "중1", "domain": "변화와 관계", "unit": "좌표평면과 그래프"}
        concepts = [
            {"id": "coord", "label_ko": "좌표", "grade": "중1", "domain": "변화와 관계", "unit": "좌표평면과 그래프"},
            {"id": "plane", "label_ko": "좌표평면", "grade": "중1", "domain": "변화와 관계", "unit": "좌표평면과 그래프"},
            {"id": "number_line", "label_ko": "수직선", "grade": "중1", "domain": "수와 연산", "unit": "정수와 유리수"},
            {"id": "linear_function", "label_ko": "일차함수", "grade": "중1", "domain": "변화와 관계", "unit": "일차함수와 그 그래프"},
        ]
        edges = [
            {
                "id": "plane__contains__coord",
                "source_id": "plane",
                "target_id": "coord",
                "relationship_type": "contains",
                "confidence": "high",
                "source_refs": [{"source_id": "curriculum_math_2022"}],
                "notes": "",
            },
            {
                "id": "number_line__prerequisite_for__coord",
                "source_id": "number_line",
                "target_id": "coord",
                "relationship_type": "prerequisite_for",
                "confidence": "medium",
                "source_refs": [],
                "notes": "좌표 도입 전 수직선 필요",
            },
            {
                "id": "unrelated",
                "source_id": "number_line",
                "target_id": "linear_function",
                "relationship_type": "prerequisite_for",
                "confidence": "medium",
                "source_refs": [],
                "notes": "",
            },
        ]
        evidence_rows = [
            {
                "edge_id": "plane__contains__coord",
                "evidence_depth": "official_single_source",
                "source_ref_count": "1",
                "needs_textbook_evidence": "yes",
            },
            {
                "edge_id": "number_line__prerequisite_for__coord",
                "evidence_depth": "source_gap",
                "source_ref_count": "0",
                "needs_textbook_evidence": "yes",
            },
        ]

        rows = pilot_unit_map.pilot_unit_edge_rows(concepts, edges, evidence_rows, target)

        self.assertEqual(
            [row["edge_id"] for row in rows],
            ["plane__contains__coord", "number_line__prerequisite_for__coord"],
        )
        self.assertEqual(rows[0]["edge_scope"], "intra_unit")
        self.assertEqual(rows[0]["source_label_ko"], "좌표평면")
        self.assertEqual(rows[1]["edge_scope"], "cross_unit")
        self.assertEqual(rows[1]["source_unit"], "정수와 유리수")

    def test_markdown_csv_and_dot_are_stable_outputs(self) -> None:
        target = {
            "rank": "1",
            "grade": "중1",
            "domain": "변화와 관계",
            "unit": "좌표평면과 그래프",
            "priority_tier": "highest",
            "workplan_score": "337",
            "concept_count": "2",
            "edge_count": "1",
            "total_pending_evidence_count": "3",
        }
        node_rows = [
            {
                "rank": "1",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_id": "plane",
                "label_ko": "좌표평면",
                "concept_type": "core_concept",
                "confidence": "high",
                "evidence_depth": "official_single_source",
                "needs_textbook_evidence": "yes",
                "source_ref_count": "1",
                "parent_ids": "",
                "prerequisite_ids": "",
                "related_ids": "",
                "short_definition": "두 좌표축으로 이루어진 평면.",
                "notes": "",
            },
            {
                "rank": "1",
                "grade": "중1",
                "domain": "변화와 관계",
                "unit": "좌표평면과 그래프",
                "concept_id": "coord",
                "label_ko": "좌표",
                "concept_type": "term",
                "confidence": "low",
                "evidence_depth": "official_dual_source",
                "needs_textbook_evidence": "yes",
                "source_ref_count": "2",
                "parent_ids": "plane",
                "prerequisite_ids": "",
                "related_ids": "",
                "short_definition": "점의 위치를 나타내는 수의 짝.",
                "notes": "교과서 정의 확인 필요",
            },
        ]
        edge_rows = [
            {
                "rank": "1",
                "unit": "좌표평면과 그래프",
                "edge_id": "plane__contains__coord",
                "source_id": "plane",
                "source_label_ko": "좌표평면",
                "source_unit": "좌표평면과 그래프",
                "target_id": "coord",
                "target_label_ko": "좌표",
                "target_unit": "좌표평면과 그래프",
                "relationship_type": "contains",
                "edge_scope": "intra_unit",
                "confidence": "high",
                "evidence_depth": "official_single_source",
                "needs_textbook_evidence": "yes",
                "source_ref_count": "1",
                "notes": "",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            node_path = Path(temp_dir) / "nodes.csv"
            edge_path = Path(temp_dir) / "edges.csv"
            pilot_unit_map.write_node_csv(node_rows, node_path)
            pilot_unit_map.write_edge_csv(edge_rows, edge_path)
            markdown = pilot_unit_map.render_markdown(target, node_rows, edge_rows)
            dot = pilot_unit_map.render_dot(target, node_rows, edge_rows)

            with node_path.open("r", encoding="utf-8-sig", newline="") as f:
                written_nodes = list(csv.DictReader(f))
            with edge_path.open("r", encoding="utf-8-sig", newline="") as f:
                written_edges = list(csv.DictReader(f))

        self.assertEqual(list(written_nodes[0]), pilot_unit_map.NODE_CSV_FIELDS)
        self.assertEqual(list(written_edges[0]), pilot_unit_map.EDGE_CSV_FIELDS)
        self.assertIn("# Pilot Unit Map", markdown)
        self.assertIn("좌표평면과 그래프", markdown)
        self.assertIn("low confidence concepts: 1", markdown)
        self.assertIn("digraph pilot_unit_map", dot)
        self.assertIn("\"plane\" -> \"coord\" [label=\"contains\"", dot)

    def test_render_dot_declares_each_external_node_once(self) -> None:
        target = {"unit": "좌표평면과 그래프"}
        node_rows = [
            {
                "concept_id": "coord",
                "label_ko": "좌표",
                "concept_type": "term",
                "confidence": "high",
            }
        ]
        edge_rows = [
            {
                "source_id": "number_line",
                "source_label_ko": "수직선",
                "target_id": "coord",
                "target_label_ko": "좌표",
                "relationship_type": "prerequisite_for",
                "edge_scope": "cross_unit",
                "confidence": "medium",
            },
            {
                "source_id": "number_line",
                "source_label_ko": "수직선",
                "target_id": "coord",
                "target_label_ko": "좌표",
                "relationship_type": "used_in",
                "edge_scope": "cross_unit",
                "confidence": "medium",
            },
        ]

        dot = pilot_unit_map.render_dot(target, node_rows, edge_rows)

        self.assertEqual(dot.count("\"number_line\" [label=\"수직선\\\\nexternal\""), 1)

    def test_unit_map_packet_set_builds_ranked_packets(self) -> None:
        workplan_rows = [
            {"rank": "2", "grade": "중1", "domain": "변화와 관계", "unit": "일차함수", "workplan_score": "20"},
            {"rank": "1", "grade": "중1", "domain": "변화와 관계", "unit": "좌표평면", "workplan_score": "30"},
        ]
        concepts = [
            {"id": "coord", "label_ko": "좌표", "grade": "중1", "domain": "변화와 관계", "unit": "좌표평면", "concept_type": "term", "confidence": "high", "source_refs": [], "parent_ids": [], "prerequisite_ids": [], "related_ids": [], "short_definition": "", "notes": ""},
            {"id": "linear", "label_ko": "일차함수", "grade": "중1", "domain": "변화와 관계", "unit": "일차함수", "concept_type": "core_concept", "confidence": "low", "source_refs": [], "parent_ids": [], "prerequisite_ids": [], "related_ids": [], "short_definition": "", "notes": ""},
        ]
        edges = [
            {"id": "coord__prerequisite_for__linear", "source_id": "coord", "target_id": "linear", "relationship_type": "prerequisite_for", "confidence": "medium", "source_refs": [], "notes": ""},
        ]
        concept_evidence_rows = [
            {"concept_id": "coord", "evidence_depth": "official_single_source", "source_ref_count": "0", "needs_textbook_evidence": "yes"},
            {"concept_id": "linear", "evidence_depth": "official_single_source", "source_ref_count": "0", "needs_textbook_evidence": "yes"},
        ]
        edge_evidence_rows = [
            {"edge_id": "coord__prerequisite_for__linear", "evidence_depth": "official_single_source", "source_ref_count": "0", "needs_textbook_evidence": "yes"},
        ]

        packets = pilot_unit_map.unit_map_packet_set(
            concepts,
            edges,
            concept_evidence_rows,
            edge_evidence_rows,
            workplan_rows,
        )

        self.assertEqual([packet["rank"] for packet in packets], [1, 2])
        self.assertEqual([packet["target"]["unit"] for packet in packets], ["좌표평면", "일차함수"])
        self.assertEqual([len(packet["node_rows"]) for packet in packets], [1, 1])
        self.assertEqual([len(packet["edge_rows"]) for packet in packets], [1, 1])

    def test_unit_map_index_rows_track_packet_paths_and_counts(self) -> None:
        packets = [
            {
                "rank": 1,
                "target": {
                    "rank": "1",
                    "grade": "중1",
                    "domain": "변화와 관계",
                    "unit": "좌표평면",
                    "priority_tier": "highest",
                    "workplan_score": "30",
                    "total_pending_evidence_count": "3",
                    "next_action": "fill_low_confidence_concept_and_edge_evidence",
                },
                "node_rows": [{"confidence": "low"}, {"confidence": "high"}],
                "edge_rows": [{"confidence": "medium", "edge_scope": "intra_unit"}, {"confidence": "low", "edge_scope": "cross_unit"}],
            }
        ]

        rows = pilot_unit_map.unit_map_index_rows(packets)

        self.assertEqual(rows[0]["concept_count"], 2)
        self.assertEqual(rows[0]["edge_count"], 2)
        self.assertEqual(rows[0]["cross_unit_edge_count"], 1)
        self.assertEqual(rows[0]["low_confidence_concept_count"], 1)
        self.assertEqual(rows[0]["low_confidence_edge_count"], 1)
        self.assertEqual(rows[0]["node_csv"], "rank-01-nodes.csv")
        self.assertEqual(rows[0]["map_dot"], "rank-01.dot")

    def test_write_unit_map_packet_set_writes_index_and_rank_files(self) -> None:
        packets = [
            {
                "rank": 1,
                "target": {
                    "rank": "1",
                    "grade": "중1",
                    "domain": "변화와 관계",
                    "unit": "좌표평면",
                    "priority_tier": "highest",
                    "workplan_score": "30",
                    "total_pending_evidence_count": "3",
                    "next_action": "fill_low_confidence_concept_and_edge_evidence",
                },
                "node_rows": [
                    {
                        "rank": "1",
                        "grade": "중1",
                        "domain": "변화와 관계",
                        "unit": "좌표평면",
                        "concept_id": "coord",
                        "label_ko": "좌표",
                        "concept_type": "term",
                        "confidence": "high",
                        "evidence_depth": "official_single_source",
                        "needs_textbook_evidence": "yes",
                        "source_ref_count": "1",
                        "parent_ids": "",
                        "prerequisite_ids": "",
                        "related_ids": "",
                        "short_definition": "",
                        "notes": "",
                    }
                ],
                "edge_rows": [],
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            output_dir = Path(temp_dir) / "unit-map-packets"
            pilot_unit_map.write_unit_map_packet_set(packets, output_dir)

            self.assertTrue((output_dir / "index.csv").exists())
            self.assertTrue((output_dir / "index.md").exists())
            self.assertTrue((output_dir / "rank-01-nodes.csv").exists())
            self.assertTrue((output_dir / "rank-01-edges.csv").exists())
            self.assertTrue((output_dir / "rank-01.md").exists())
            self.assertTrue((output_dir / "rank-01.dot").exists())
            self.assertIn("# Unit Map Packet Index", (output_dir / "index.md").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
