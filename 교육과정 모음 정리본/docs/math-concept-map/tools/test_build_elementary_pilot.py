from __future__ import annotations

import unittest

import build_elementary_pilot as pilot


class ElementaryPilotDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.concepts = [
            dict(c, prerequisite_ids=[], parent_ids=[], related_ids=[])
            for c in pilot.CONCEPTS
        ]
        cls.edges = pilot.build_edges()
        pilot.sync_arrays(cls.concepts, cls.edges)
        cls.by_id = {c["id"]: c for c in cls.concepts}

    def test_ids_unique_and_edges_reference_defined_concepts(self) -> None:
        ids = [c["id"] for c in self.concepts]
        self.assertEqual(len(ids), len(set(ids)))
        for edge in self.edges:
            self.assertIn(edge["source_id"], self.by_id)
            self.assertIn(edge["target_id"], self.by_id)

    def test_scope_is_elementary_bands_all_domains(self) -> None:
        grades = {"초1-2", "초3-4"}
        domains = {"수와 연산", "변화와 관계", "도형과 측정", "자료와 가능성"}
        for c in self.concepts:
            self.assertIn(c["grade"], grades)
            self.assertIn(c["domain"], domains)
        for grade in grades:
            covered = {c["domain"] for c in self.concepts if c["grade"] == grade}
            self.assertEqual(covered, domains, grade)

    def test_geometry_terms_and_cross_domain_edges_present(self) -> None:
        labels = {c["label_ko"] for c in self.concepts}
        for term in ["삼각형", "사각형", "원", "꼭짓점", "변", "시", "분", "약(어림 표현)", "표", "그래프"]:
            self.assertIn(term, labels)
        pairs = {(e["source_id"], e["target_id"]) for e in self.edges}
        # 영역을 가로지르는 공식 근거 edge
        self.assertIn(("e12_mul_table", "e12_pat_tables_find"), pairs)
        self.assertIn(("e12_add", "e12_meas_length_addsub"), pairs)
        self.assertIn(("e12_num_counting", "e12_data_count"), pairs)

    def test_every_concept_has_official_source_ref_with_locator(self) -> None:
        for c in self.concepts:
            self.assertTrue(c["source_refs"], c["id"])
            for r in c["source_refs"]:
                self.assertEqual(r["source_id"], "curriculum_math_2022")
                self.assertIn("printed p.", r["locator"])
                self.assertTrue(r["summary"])

    def test_prerequisite_graph_is_acyclic(self) -> None:
        self.assertTrue(pilot.prerequisite_graph_is_acyclic(self.edges))

    def test_arrays_are_derived_from_edges(self) -> None:
        for edge in self.edges:
            src, dst = edge["source_id"], edge["target_id"]
            rel = edge["relationship_type"]
            if rel == "contains":
                self.assertIn(src, self.by_id[dst]["parent_ids"])
            elif rel == "prerequisite_for":
                self.assertIn(src, self.by_id[dst]["prerequisite_ids"])
            elif rel == "related_to":
                self.assertIn(dst, self.by_id[src]["related_ids"])
                self.assertIn(src, self.by_id[dst]["related_ids"])

    def test_official_terms_present_and_unextracted_symbols_absent(self) -> None:
        labels = {c["label_ko"] for c in self.concepts}
        # 용어 목록에서 추출 확인된 항목
        for term in ["덧셈", "뺄셈", "곱셈", "짝수", "홀수", "곱셈 기호 ×"]:
            self.assertIn(term, labels)
        # 글꼴 문제로 미추출된 기호는 시각 확인 전까지 concept으로 만들지 않는다
        for absent in ["덧셈 기호", "뺄셈 기호", "부등호"]:
            self.assertNotIn(absent, labels)
        compare = self.by_id["e12_num_compare"]
        self.assertIn("미추출", compare["notes"])

    def test_no_misconception_nodes_without_official_basis(self) -> None:
        for c in self.concepts:
            self.assertNotEqual(c["concept_type"], "misconception_risk", c["id"])

    def test_document_grounded_edges_are_high_and_inferred_edges_medium(self) -> None:
        by_pair = {
            (e["source_id"], e["target_id"]): e for e in self.edges
        }
        # 진술·고려 사항 직접 근거
        for pair in [
            ("e12_num_ten_bundles", "e12_num_positional_notation"),
            ("e12_addsub_two_digit_principle", "e12_addsub_two_digit_calc"),
            ("e12_gugu", "e12_single_digit_mul"),
            ("e12_mul_table", "e12_mul_comm"),
        ]:
            self.assertEqual(by_pair[pair]["confidence"], "high", pair)
        # 배열 순서·개념 구조에서 추론한 관계는 medium + 추론 메모
        for pair in [
            ("e12_num_zero_to_100", "e12_num_place_value"),
            ("e12_addsub_two_digit_calc", "e12_three_number_addsub"),
            ("e12_add", "e12_mul_repeated_addition"),
        ]:
            self.assertEqual(by_pair[pair]["confidence"], "medium", pair)
            self.assertTrue(by_pair[pair]["notes"], pair)

    def test_generated_outputs_match_data(self) -> None:
        if not pilot.CONCEPTS_JSON.exists():
            self.skipTest("생성된 elementary-concepts.json이 없다.")
        import json

        data = json.loads(pilot.CONCEPTS_JSON.read_text(encoding="utf-8"))
        self.assertEqual(data["metadata"]["concept_count"], len(self.concepts))
        self.assertEqual(data["metadata"]["edge_count"], len(self.edges))
        self.assertEqual(len(data["concepts"]), len(self.concepts))
        self.assertEqual(len(data["edges"]), len(self.edges))
        self.assertIn("선택 과목 제외", data["metadata"]["scope_rules"])


if __name__ == "__main__":
    unittest.main()
