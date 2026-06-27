from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_equivalence_alias_audit as audit


class BuildEquivalenceAliasAuditTests(unittest.TestCase):
    def test_audit_rows_include_aliases_and_equivalent_edges(self) -> None:
        concepts = [
            {
                "id": "natural",
                "label_ko": "자연수",
                "aliases": ["natural number", "양의 정수"],
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "정수와 유리수",
                "source_refs": [{"source_id": "curriculum_math_2022"}],
            },
            {
                "id": "positive_integer",
                "label_ko": "양의 정수",
                "aliases": ["positive integer"],
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "정수와 유리수",
                "source_refs": [],
            },
        ]
        edges = [
            {
                "id": "positive_integer__equivalent_to__natural",
                "source_id": "positive_integer",
                "target_id": "natural",
                "relationship_type": "equivalent_to",
                "source_refs": [{"source_id": "curriculum_math_2022"}, {"source_id": "achievement_math_2022"}],
                "notes": "같은 범위로 취급",
                "confidence": "medium",
            }
        ]

        rows = audit.equivalence_alias_audit_rows(concepts, edges, [])

        self.assertIn(
            {
                "record_type": "concept_alias",
                "record_id": "natural",
                "label_ko": "자연수",
                "alias_or_term": "natural number; 양의 정수",
                "concept_ids": "natural",
                "concept_labels": "자연수",
                "grade_domain_unit": "중1 > 수와 연산 > 정수와 유리수",
                "relationship_status": "alias_on_concept",
                "recommended_action": "preserve_alias_and_check_textbook_wording",
                "confidence": "high",
                "source_ref_count": 1,
                "notes": "Aliases are stored on the concept node; add an equivalent_to edge only when sources treat two separate concepts as interchangeable.",
            },
            rows,
        )
        self.assertIn(
            {
                "record_type": "equivalent_edge",
                "record_id": "positive_integer__equivalent_to__natural",
                "label_ko": "양의 정수 = 자연수",
                "alias_or_term": "",
                "concept_ids": "positive_integer; natural",
                "concept_labels": "양의 정수; 자연수",
                "grade_domain_unit": "중1 > 수와 연산 > 정수와 유리수; 중1 > 수와 연산 > 정수와 유리수",
                "relationship_status": "explicit_equivalent_to_edge",
                "recommended_action": "keep_edge_and_confirm_textbook_usage",
                "confidence": "medium",
                "source_ref_count": 2,
                "notes": "같은 범위로 취급",
            },
            rows,
        )

    def test_audit_rows_include_official_multi_matches_and_duplicate_labels(self) -> None:
        concepts = [
            {
                "id": "prime_unit",
                "label_ko": "소인수분해",
                "aliases": [],
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "소인수분해",
                "source_refs": [],
            },
            {
                "id": "prime_procedure",
                "label_ko": "소인수분해",
                "aliases": [],
                "grade": "중1",
                "domain": "수와 연산",
                "unit": "소인수분해",
                "source_refs": [],
            },
        ]
        official_term_rows = [
            {
                "term": "소인수분해",
                "concept_count": "2",
                "concept_ids": "prime_unit; prime_procedure",
                "concept_labels": "소인수분해; 소인수분해",
                "notes": "",
            }
        ]

        rows = audit.equivalence_alias_audit_rows(concepts, [], official_term_rows)

        self.assertIn(
            {
                "record_type": "duplicate_label",
                "record_id": "label:소인수분해",
                "label_ko": "소인수분해",
                "alias_or_term": "",
                "concept_ids": "prime_unit; prime_procedure",
                "concept_labels": "소인수분해; 소인수분해",
                "grade_domain_unit": "중1 > 수와 연산 > 소인수분해; 중1 > 수와 연산 > 소인수분해",
                "relationship_status": "same_label_multiple_nodes",
                "recommended_action": "review_unit_vs_micro_concept_split_before_equivalent_edge",
                "confidence": "medium",
                "source_ref_count": 0,
                "notes": "Same Korean label appears on multiple nodes; preserve only when unit-level and micro-concept roles are distinct.",
            },
            rows,
        )
        self.assertIn(
            {
                "record_type": "official_term_multi_match",
                "record_id": "term:소인수분해",
                "label_ko": "소인수분해",
                "alias_or_term": "소인수분해",
                "concept_ids": "prime_unit; prime_procedure",
                "concept_labels": "소인수분해; 소인수분해",
                "grade_domain_unit": "",
                "relationship_status": "official_term_maps_to_multiple_concepts",
                "recommended_action": "review_term_scope_and_preserve_alias_or_split_reason",
                "confidence": "medium",
                "source_ref_count": 0,
                "notes": "",
            },
            rows,
        )

    def test_markdown_and_csv_are_stable_outputs(self) -> None:
        rows = [
            {
                "record_type": "concept_alias",
                "record_id": "natural",
                "label_ko": "자연수",
                "alias_or_term": "natural number",
                "concept_ids": "natural",
                "concept_labels": "자연수",
                "grade_domain_unit": "중1 > 수와 연산 > 정수와 유리수",
                "relationship_status": "alias_on_concept",
                "recommended_action": "preserve_alias_and_check_textbook_wording",
                "confidence": "high",
                "source_ref_count": 1,
                "notes": "",
            }
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "equivalence-alias-audit.csv"
            audit.write_csv(rows, csv_path)
            markdown = audit.render_markdown(rows)
            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

        self.assertEqual(list(written[0]), audit.CSV_FIELDS)
        self.assertIn("# Equivalence Alias Audit", markdown)
        self.assertIn("concept_alias", markdown)


if __name__ == "__main__":
    unittest.main()
