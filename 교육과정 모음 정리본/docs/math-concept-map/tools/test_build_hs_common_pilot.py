from __future__ import annotations

import unittest

import build_hs_common_pilot as hs


class HsCommonPilotTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.concepts = [
            dict(c, prerequisite_ids=[], parent_ids=[], related_ids=[])
            for c in hs.CONCEPTS
        ]
        cls.edges = hs.build_edges()
        hs.sync_arrays(cls.concepts, cls.edges)
        cls.by_id = {c["id"]: c for c in cls.concepts}

    def test_scope_is_common_math_only(self) -> None:
        for c in self.concepts:
            self.assertEqual(c["grade"], "고1")
            self.assertIn(c["domain"], {"공통수학1", "공통수학2"})
        units1 = {c["unit"] for c in self.concepts if c["domain"] == "공통수학1"}
        units2 = {c["unit"] for c in self.concepts if c["domain"] == "공통수학2"}
        self.assertEqual(units1, {"다항식", "방정식과 부등식", "경우의 수", "행렬"})
        self.assertEqual(units2, {"도형의 방정식", "집합과 명제", "함수와 그래프"})

    def test_no_elective_subject_content(self) -> None:
        labels = " ".join(c["label_ko"] for c in self.concepts)
        for banned in ["지수함수", "로그", "삼각함수", "수열", "극한", "미분", "적분"]:
            self.assertNotIn(banned, labels)

    def test_ids_unique_and_edges_valid(self) -> None:
        ids = [c["id"] for c in self.concepts]
        self.assertEqual(len(ids), len(set(ids)))
        for edge in self.edges:
            self.assertIn(edge["source_id"], self.by_id)
            self.assertIn(edge["target_id"], self.by_id)
        self.assertTrue(hs.prerequisite_graph_is_acyclic(self.edges))

    def test_every_concept_has_official_source_ref(self) -> None:
        for c in self.concepts:
            self.assertTrue(c["source_refs"], c["id"])
            for r in c["source_refs"]:
                self.assertEqual(r["source_id"], "curriculum_math_2022")
                self.assertIn("printed p.", r["locator"])

    def test_document_grounded_edges(self) -> None:
        by_pair = {(e["source_id"], e["target_id"]): e for e in self.edges}
        for pair in [
            ("hs2_distance", "hs2_division"),
            ("hs1_factorization", "hs1_cubic_quartic"),
            ("hs2_set", "hs2_function"),
            ("hs1_complex", "hs1_real_imag_roots"),
        ]:
            self.assertEqual(by_pair[pair]["confidence"], "high", pair)
        inferred = ("hs1_mult_rule", "hs1_permutation")
        self.assertEqual(by_pair[inferred]["confidence"], "medium")
        self.assertTrue(by_pair[inferred]["notes"])

    def test_arrays_are_derived_from_edges(self) -> None:
        for edge in self.edges:
            src, dst = edge["source_id"], edge["target_id"]
            rel = edge["relationship_type"]
            if rel == "contains":
                self.assertIn(src, self.by_id[dst]["parent_ids"])
            elif rel == "prerequisite_for":
                self.assertIn(src, self.by_id[dst]["prerequisite_ids"])
            elif rel in {"related_to", "contrasts_with"}:
                self.assertIn(dst, self.by_id[src]["related_ids"])
                self.assertIn(src, self.by_id[dst]["related_ids"])

    def test_generated_outputs_match_data(self) -> None:
        if not hs.CONCEPTS_JSON.exists():
            self.skipTest("생성된 hs-common-concepts.json이 없다.")
        import json

        data = json.loads(hs.CONCEPTS_JSON.read_text(encoding="utf-8"))
        self.assertEqual(data["metadata"]["concept_count"], len(self.concepts))
        self.assertEqual(data["metadata"]["edge_count"], len(self.edges))
        self.assertIn("선택 과목 제외", data["metadata"]["scope_rules"])


if __name__ == "__main__":
    unittest.main()
