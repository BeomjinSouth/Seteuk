from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class SquareRootMicroconceptTests(unittest.TestCase):
    def test_square_root_and_radical_microprocedures_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_num_square_number": ("제곱수", "term", "medium"),
            "m1_num_find_square_root": ("제곱근 구하기", "procedure", "high"),
            "m1_num_represent_square_root_radical": ("제곱근을 근호로 나타내기", "procedure", "high"),
            "m1_num_simplify_radical_expression": ("근호를 포함한 식 간단히 하기", "procedure", "high"),
            "m1_num_radicand": ("근호 안의 수", "term", "medium"),
            "m1_num_radical_mul_div": ("제곱근의 곱셈과 나눗셈", "procedure", "high"),
            "m1_num_radical_add_sub_same_radicand": (
                "근호 안의 수가 같은 제곱근의 덧셈과 뺄셈",
                "procedure",
                "high",
            ),
            "m1_num_real_number_system": ("실수의 수 체계", "representation", "high"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn("제곱근과 실수", concept["unit"])
            self.assertIn("p. 213", source_locators(concept))

        self.assertIn("m1_calc_power", concepts["m1_num_square_number"]["prerequisite_ids"])
        self.assertIn("m1_num_square_root", concepts["m1_num_find_square_root"]["prerequisite_ids"])
        self.assertIn("m1_num_square_number", concepts["m1_num_find_square_root"]["prerequisite_ids"])
        self.assertIn("m1_num_radical_sign", concepts["m1_num_represent_square_root_radical"]["prerequisite_ids"])
        self.assertIn("m1_num_square_root_property", concepts["m1_num_simplify_radical_expression"]["prerequisite_ids"])
        self.assertIn("m1_num_radicand", concepts["m1_num_radical_add_sub_same_radicand"]["prerequisite_ids"])
        self.assertIn("m1_num_real_number", concepts["m1_num_real_number_system"]["parent_ids"])

    def test_square_root_edges_link_microprocedures_to_parent_procedures(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_num_square_root_real_unit__contains__m1_num_square_number",
            "m1_num_square_root_real_unit__contains__m1_num_find_square_root",
            "m1_num_square_root_real_unit__contains__m1_num_represent_square_root_radical",
            "m1_num_radical_operations__contains__m1_num_simplify_radical_expression",
            "m1_num_radical_expression__contains__m1_num_radicand",
            "m1_num_radical_operations__contains__m1_num_radical_mul_div",
            "m1_num_radical_operations__contains__m1_num_radical_add_sub_same_radicand",
            "m1_num_real_number__contains__m1_num_real_number_system",
            "m1_calc_power__used_in__m1_num_square_number",
            "m1_num_square_root__used_in__m1_num_find_square_root",
            "m1_num_square_number__used_in__m1_num_find_square_root",
            "m1_num_square_root__used_in__m1_num_represent_square_root_radical",
            "m1_num_radical_sign__used_in__m1_num_represent_square_root_radical",
            "m1_num_square_root_property__used_in__m1_num_simplify_radical_expression",
            "m1_num_simplify_radical_expression__used_in__m1_num_radical_operations",
            "m1_num_square_root_property__used_in__m1_num_radical_mul_div",
            "m1_num_radical_mul_div__used_in__m1_num_radical_operations",
            "m1_num_radicand__used_in__m1_num_radical_add_sub_same_radicand",
            "m1_num_radical_add_sub_same_radicand__used_in__m1_num_radical_operations",
            "m1_num_real_number__represented_by__m1_num_real_number_system",
            "m1_num_real_number_system__used_in__m1_num_rational_irrational_classification",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

    def test_square_root_misconceptions_keep_low_confidence_without_prerequisites(self) -> None:
        concepts = concepts_by_id()

        for concept_id in [
            "m1_mis_irrational_decimal",
            "m1_mis_radical_like_terms",
            "m1_mis_radical_principal_root",
        ]:
            concept = concepts[concept_id]
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])

    def test_square_root_noisy_prerequisite_edges_are_removed(self) -> None:
        edges = edges_by_id()

        noisy_prereq_edges = [
            "m1_num_infinite_decimal__prerequisite_for__m1_mis_irrational_decimal",
            "m1_num_irrational_number__prerequisite_for__m1_mis_irrational_decimal",
            "m1_num_radical_operations__prerequisite_for__m1_mis_radical_like_terms",
            "m1_num_radical_sign__prerequisite_for__m1_mis_radical_principal_root",
            "m1_num_square_root__prerequisite_for__m1_mis_radical_principal_root",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

    def test_research_report_ref_is_scoped_to_direct_square_root_evidence(self) -> None:
        concepts = concepts_by_id()

        direct_ref_concepts = [
            "m1_num_square_root_real_unit",
            "m1_num_square_root",
            "m1_num_square_root_property",
            "m1_num_compare_square_roots",
            "m1_num_irrational_number",
            "m1_num_real_number",
            "m1_num_real_order",
            "m1_num_radical_expression",
            "m1_num_radical_operations",
        ]
        for concept_id in direct_ref_concepts:
            self.assertIn("p. 213", source_locators(concepts[concept_id]))

        for concept_id in [
            "m1_mis_irrational_decimal",
            "m1_mis_radical_like_terms",
            "m1_mis_radical_principal_root",
        ]:
            self.assertNotIn("p. 213", source_locators(concepts[concept_id]))


if __name__ == "__main__":
    unittest.main()
