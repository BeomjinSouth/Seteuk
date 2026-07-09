from __future__ import annotations

import csv
import unittest

import build_cross_band_edges as cross


class CrossBandEdgeDefinitionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.lookup = cross.build_lookup()
        cls.rows = cross.build_rows(cls.lookup)

    def test_all_edges_reference_existing_concepts(self) -> None:
        for src, dst, *_ in cross.CROSS_EDGES:
            self.assertIn(src, self.lookup, src)
            self.assertIn(dst, self.lookup, dst)

    def test_edges_cross_dataset_boundaries_forward_only(self) -> None:
        cross.validate_forward_only(self.rows)  # 역방향이면 SystemExit
        for r in self.rows:
            self.assertNotEqual(r["source_dataset"], r["target_dataset"], r["edge_id"])

    def test_every_edge_has_document_locator_and_summary(self) -> None:
        for r in self.rows:
            self.assertIn("printed p.", r["source_locator"], r["edge_id"])
            self.assertTrue(r["summary"], r["edge_id"])
            self.assertTrue(r["notes"], r["edge_id"])
            self.assertEqual(r["relationship_type"], "prerequisite_for")

    def test_confidence_matches_evidence_kind(self) -> None:
        # 성취기준 해설·고려 사항의 직접 지목은 high, 과목 성격의 일반 서술은 medium.
        for r in self.rows:
            self.assertIn(r["confidence"], {"high", "medium"}, r["edge_id"])
            if "과목 성격" in r["source_locator"]:
                self.assertEqual(r["confidence"], "medium", r["edge_id"])
            else:
                self.assertEqual(r["confidence"], "high", r["edge_id"])

    def test_documented_key_connections_present(self) -> None:
        pairs = {(r["source_id"], r["target_id"]) for r in self.rows}
        # 문서가 직접 지목하는 대표 연결
        self.assertIn(("e56_num_common_divisor", "m1_num_find_gcd_lcm_prime_factorization"), pairs)
        self.assertIn(("m1_factor_factorization", "hs1_factorization"), pairs)
        self.assertIn(("m1_system_simultaneous_linear_equations", "hs1_system_ineq"), pairs)
        self.assertIn(("m1_data_counting_cases", "hs1_addition_rule"), pairs)
        self.assertIn(("m1_func_function", "hs2_function"), pairs)
        self.assertIn(("m1_func_linear_graph", "hs2_line_condition"), pairs)

    def test_edge_ids_unique(self) -> None:
        ids = [r["edge_id"] for r in self.rows]
        self.assertEqual(len(ids), len(set(ids)))


@unittest.skipUnless(cross.EDGES_CSV.exists(), "생성된 cross-band-edges.csv가 없으면 건너뛴다.")
class GeneratedCrossBandCsvTests(unittest.TestCase):
    def test_csv_matches_definitions(self) -> None:
        with cross.EDGES_CSV.open(encoding="utf-8-sig") as f:
            rows = list(csv.DictReader(f))
        self.assertEqual(len(rows), len(cross.CROSS_EDGES))
        lookup = cross.build_lookup()
        for r in rows:
            self.assertIn(r["source_id"], lookup)
            self.assertIn(r["target_id"], lookup)
            self.assertEqual(r["source_label"], lookup[r["source_id"]]["label"])
            self.assertEqual(r["target_label"], lookup[r["target_id"]]["label"])


if __name__ == "__main__":
    unittest.main()
