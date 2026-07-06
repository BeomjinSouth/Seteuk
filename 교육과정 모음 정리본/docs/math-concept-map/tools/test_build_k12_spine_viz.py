from __future__ import annotations

import unittest

import build_k12_spine_viz as viz


@unittest.skipUnless(
    viz.NODES_CSV.exists() and viz.EDGES_CSV.exists(),
    "생성된 spine CSV가 없으면 시각화 검증을 건너뛴다.",
)
class SpineVizModelTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.model = viz.build_view_model(
            viz.load_rows(viz.NODES_CSV), viz.load_rows(viz.EDGES_CSV)
        )

    def test_elective_subjects_are_excluded(self) -> None:
        titles = {b["title"] for b in self.model["blocks"].values()}
        for elective in ["대수", "미적분Ⅰ", "미적분Ⅱ", "확률과 통계", "기하",
                         "경제 수학", "인공지능 수학", "직무 수학",
                         "수학과 문화", "실용 통계", "수학과제 탐구"]:
            self.assertNotIn(elective, titles)

    def test_common_grid_and_common_subjects_present(self) -> None:
        blocks = self.model["blocks"]
        domain_blocks = [b for b in blocks.values() if b["kind"] == "domain"]
        self.assertEqual(len(domain_blocks), 16)
        titles = {b["title"] for b in blocks.values()}
        for subject in ["공통수학1", "공통수학2", "기본수학1", "기본수학2"]:
            self.assertIn(subject, titles)

    def test_every_domain_block_carries_standards(self) -> None:
        for b in self.model["blocks"].values():
            if b["kind"] in {"domain", "area", "area_alt"}:
                self.assertTrue(b["standards"], b["id"])
                for s in b["standards"]:
                    self.assertTrue(s["code"])
                    self.assertTrue(s["statement"])

    def test_arrows_connect_known_blocks_or_m13_bridge(self) -> None:
        block_ids = set(self.model["blocks"])
        for arrow in self.model["arrows"]:
            self.assertIn(arrow["to"], block_ids)
            self.assertTrue(
                arrow["from"] in block_ids or arrow["from"] == "spine_dom_m13_bridge"
            )

    def test_rendered_html_excludes_electives(self) -> None:
        html_text = viz.render_html(self.model)
        self.assertNotIn("미적분", html_text)
        self.assertIn("공통수학1", html_text)
        self.assertIn("선택 과목", html_text)  # 제외 안내 문구


if __name__ == "__main__":
    unittest.main()
