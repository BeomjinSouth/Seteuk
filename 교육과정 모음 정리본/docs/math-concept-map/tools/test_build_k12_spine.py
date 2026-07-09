from __future__ import annotations

import csv
import unittest

import build_k12_spine as spine


FIXTURE_PAGES = [
    (
        "공통 교육과정\n"
        "11\n"
        "나. 성취기준\n"
        "[초등학교 1∼2학년]\n"
        "(1) 수와 연산\n"
        "숔 네 자리 이하의 수\n"
        "[2수01-01] 수의 필요성을 인식하면서 0과 100까지의 수 개념을 이해하고, 수를 세고 읽고 쓸 수\n"
        "있다.\n"
        "[2수01-02] 일, 십, 백, 천의 자릿값과 위치적 기수법을 이해하고, 네 자리 이하의 수를 읽고 쓸 수\n"
        "있다.\n"
        "(가) 성취기준 해설\n"
        "• [2수01-02] 자릿값 해설은 성취기준 진술이 아니다.\n"
    ),
    (
        "수학과 교육과정\n"
        "60\n"
        "나. 성취기준\n"
        "(1) 다항식\n"
        "[10공수1-01-01] 다항식의 사칙연산의 원리를 설명하고, 그 계산을 할 수 있다.\n"
        "(나) 성취기준 적용 시 고려 사항\n"
        "• 다항식 고려 사항.\n"
        "(1) 함수의 극한과 연속\n"
        "[12미적Ⅰ-01-01] 함수의 극한의 뜻을 알고, 이를 설명할 수 있다.\n"
    ),
]


class ParseStandardsTests(unittest.TestCase):
    def test_parses_band_and_subject_codes_with_area_titles(self) -> None:
        standards, area_titles = spine.parse_standards(FIXTURE_PAGES)

        codes = [std["code"] for std in standards]
        self.assertEqual(
            codes, ["2수01-01", "2수01-02", "10공수1-01-01", "12미적Ⅰ-01-01"]
        )
        self.assertEqual(area_titles[("2수", "01")], "수와 연산")
        self.assertEqual(area_titles[("10공수1", "01")], "다항식")
        self.assertEqual(area_titles[("12미적Ⅰ", "01")], "함수의 극한과 연속")

    def test_statement_joins_wrapped_lines_and_stops_at_boundary(self) -> None:
        standards, _ = spine.parse_standards(FIXTURE_PAGES)
        by_code = {std["code"]: std for std in standards}

        self.assertEqual(
            by_code["2수01-01"]["statement"],
            "수의 필요성을 인식하면서 0과 100까지의 수 개념을 이해하고, 수를 세고 읽고 쓸 수 있다.",
        )
        # 해설 블록의 재언급은 첫 출현 진술을 덮어쓰지 않는다.
        self.assertEqual(
            by_code["2수01-02"]["statement"],
            "일, 십, 백, 천의 자릿값과 위치적 기수법을 이해하고, 네 자리 이하의 수를 읽고 쓸 수 있다.",
        )

    def test_page_numbers_follow_fixture_pages(self) -> None:
        standards, _ = spine.parse_standards(FIXTURE_PAGES)
        by_code = {std["code"]: std for std in standards}
        self.assertEqual(by_code["2수01-01"]["page"], 1)
        self.assertEqual(by_code["10공수1-01-01"]["page"], 2)


class CleanStatementTests(unittest.TestCase):
    def test_collapses_whitespace_and_spaced_period(self) -> None:
        self.assertEqual(
            spine.clean_statement("수의  크기를 비교할 수 있다 ."),
            "수의 크기를 비교할 수 있다.",
        )

    def test_cuts_trailing_subheader_after_last_sentence(self) -> None:
        self.assertEqual(
            spine.clean_statement("수 감각을 기른다. 숕 두 자리 수 범위의 덧셈과 뺄셈"),
            "수 감각을 기른다.",
        )


class SpineStructureTests(unittest.TestCase):
    def _build(self) -> tuple[list[dict], list[dict]]:
        standards, area_titles = spine.parse_standards(FIXTURE_PAGES)
        nodes = spine.build_nodes(standards, area_titles)
        edges = spine.build_edges(standards, content_system_page=9)
        return nodes, edges

    def test_all_edges_reference_defined_nodes(self) -> None:
        nodes, edges = self._build()
        node_ids = {node["node_id"] for node in nodes}
        self.assertEqual(len(node_ids), len(nodes))
        for edge in edges:
            self.assertIn(edge["source_id"], node_ids)
            self.assertIn(edge["target_id"], node_ids)

    def test_prerequisite_graph_is_acyclic(self) -> None:
        _, edges = self._build()
        self.assertTrue(spine.prerequisite_graph_is_acyclic(edges))

    def test_band_and_subject_chains_exist(self) -> None:
        _, edges = self._build()
        prereq_pairs = {
            (edge["source_id"], edge["target_id"])
            for edge in edges
            if edge["relationship_type"] == "prerequisite_for"
        }
        self.assertIn(("spine_stage_e12", "spine_stage_e34"), prereq_pairs)
        self.assertIn(("spine_stage_e56", "spine_stage_m13"), prereq_pairs)
        self.assertIn(("spine_dom_e56_01", "spine_dom_m13_01"), prereq_pairs)
        self.assertIn(("spine_stage_m13", "spine_subj_gongsu1"), prereq_pairs)
        self.assertIn(("spine_subj_gongsu2", "spine_subj_daesu"), prereq_pairs)
        self.assertIn(("spine_subj_mijeok1", "spine_subj_mijeok2"), prereq_pairs)

    def test_documented_related_edges_have_high_confidence(self) -> None:
        _, edges = self._build()
        related = {
            (edge["source_id"], edge["target_id"]): edge
            for edge in edges
            if edge["relationship_type"] == "related_to"
        }
        for pair in [
            ("spine_subj_mijeok2", "spine_subj_giha"),
            ("spine_subj_mijeok2", "spine_subj_gyeongsu"),
            ("spine_subj_daesu", "spine_subj_insu"),
        ]:
            self.assertIn(pair, related)
            self.assertEqual(related[pair]["confidence"], "high")

    def test_inferred_subject_prerequisites_stay_medium(self) -> None:
        _, edges = self._build()
        by_pair = {
            (edge["source_id"], edge["target_id"]): edge
            for edge in edges
            if edge["relationship_type"] == "prerequisite_for"
        }
        for pair in [
            ("spine_subj_gongsu1", "spine_subj_gongsu2"),
            ("spine_subj_daesu", "spine_subj_mijeok2"),
            ("spine_subj_mijeok1", "spine_subj_mijeok2"),
        ]:
            self.assertEqual(by_pair[pair]["confidence"], "medium")


@unittest.skipUnless(
    spine.NODES_CSV.exists() and spine.EDGES_CSV.exists(),
    "생성된 spine CSV가 없으면 통합 검증을 건너뛴다.",
)
class GeneratedSpineOutputTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        with spine.NODES_CSV.open(encoding="utf-8-sig") as f:
            cls.nodes = list(csv.DictReader(f))
        with spine.EDGES_CSV.open(encoding="utf-8-sig") as f:
            cls.edges = list(csv.DictReader(f))

    def test_band_standard_counts_match_official_totals(self) -> None:
        standards = [n for n in self.nodes if n["node_type"] == "achievement_standard"]
        counts: dict[str, int] = {}
        for node in standards:
            counts[node["grade_band"]] = counts.get(node["grade_band"], 0) + 1
        self.assertEqual(counts["초1-2"], 29)
        self.assertEqual(counts["초3-4"], 47)
        self.assertEqual(counts["초5-6"], 45)
        self.assertEqual(counts["중1-3"], 60)

    def test_all_high_school_subjects_present(self) -> None:
        subjects = {
            n["label_ko"] for n in self.nodes if n["node_type"] == "hs_subject"
        }
        self.assertEqual(len(subjects), 15)
        self.assertIn("공통수학1", subjects)
        self.assertIn("미적분Ⅱ", subjects)
        self.assertIn("수학과제 탐구", subjects)

    def test_generated_edges_reference_generated_nodes(self) -> None:
        node_ids = {n["node_id"] for n in self.nodes}
        for edge in self.edges:
            self.assertIn(edge["source_id"], node_ids)
            self.assertIn(edge["target_id"], node_ids)

    def test_generated_prerequisites_are_acyclic(self) -> None:
        self.assertTrue(spine.prerequisite_graph_is_acyclic(self.edges))

    def test_standard_statements_are_filled(self) -> None:
        for node in self.nodes:
            if node["node_type"] == "achievement_standard":
                self.assertTrue(node["statement"], node["achievement_code"])
                self.assertTrue(node["achievement_code"])


if __name__ == "__main__":
    unittest.main()
