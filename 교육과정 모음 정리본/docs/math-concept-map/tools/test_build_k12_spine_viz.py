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
        cls.micro_index = viz.load_micro_index()
        cls.model = viz.build_view_model(
            viz.load_rows(viz.NODES_CSV), viz.load_rows(viz.EDGES_CSV), cls.micro_index
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

    def test_micro_concepts_attached_to_scope_blocks(self) -> None:
        # 초·중·고 각 층에서 대표 블록이 미시 개념을 담고 있어야 한다.
        total = sum(b.get("micro", {}).get("count", 0) for b in self.model["blocks"].values())
        self.assertEqual(total, 330 + 977 + 61)
        for block in self.model["blocks"].values():
            if block["kind"] in {"domain", "area"}:
                micro = block.get("micro")
                self.assertTrue(micro["count"] > 0, block["id"])
                for unit in micro["units"]:
                    self.assertTrue(unit["items"])
                    for item in unit["items"]:
                        self.assertTrue(item["label"])
                        self.assertIn(item["confidence"], {"high", "medium", "low"})

    def test_alternative_subjects_have_no_micro(self) -> None:
        # 기본수학1·2(대체 경로)는 미시 분해 대상이 아니다.
        for block in self.model["blocks"].values():
            if block["kind"] in {"subject_alt", "area_alt"}:
                self.assertEqual(block.get("micro", {}).get("count", 0), 0, block["id"])

    def test_micro_items_sorted_by_type_hierarchy(self) -> None:
        # 각 단원 안에서 핵심 개념이 절차·용어보다 앞서야 한다(위계 정렬).
        for block in self.model["blocks"].values():
            for unit in block.get("micro", {}).get("units", []):
                ranks = [
                    next((k for k, v in viz.TYPE_BADGES.items() if v == it["type"]), None)
                    for it in unit["items"]
                ]
                orders = [viz.TYPE_ORDER.get(r, 9) for r in ranks]
                self.assertEqual(orders, sorted(orders), (block["id"], unit["unit"]))


if __name__ == "__main__":
    unittest.main()
