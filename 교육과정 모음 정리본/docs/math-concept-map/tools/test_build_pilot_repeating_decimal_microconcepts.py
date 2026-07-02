from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class RepeatingDecimalMicroconceptTests(unittest.TestCase):
    def test_fraction_decimal_classification_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_num_irreducible_fraction": ("기약분수", "term", "medium"),
            "m1_num_reduce_fraction_lowest_terms": ("분수를 기약분수로 고치기", "procedure", "medium"),
            "m1_num_fraction_to_decimal_division": ("분수를 소수로 나타내기", "procedure", "medium"),
            "m1_num_decimal_remainder_repetition": ("분수 나눗셈에서 나머지 반복", "property", "medium"),
            "m1_num_terminating_decimal_denominator_condition": ("유한소수가 되는 분모 조건", "property", "medium"),
            "m1_num_repeating_decimal_denominator_condition": ("순환소수가 되는 분모 조건", "property", "medium"),
            "m1_num_denominator_power_of_ten_conversion": ("분모를 10의 거듭제곱으로 만들기", "procedure", "medium"),
            "m1_num_finite_decimal_to_fraction": ("유한소수를 분수로 나타내기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("유리수와 순환소수", concept["unit"])
                self.assertIn("[9수01-06]", source_locators(concept))

        self.assertIn("m1_num_rational_fraction_form", concepts["m1_num_irreducible_fraction"]["prerequisite_ids"])
        self.assertIn("m1_num_gcd", concepts["m1_num_reduce_fraction_lowest_terms"]["prerequisite_ids"])
        self.assertIn("m1_num_division", concepts["m1_num_fraction_to_decimal_division"]["prerequisite_ids"])
        self.assertIn("m1_num_prime_factorization", concepts["m1_num_terminating_decimal_denominator_condition"]["prerequisite_ids"])
        self.assertIn("m1_num_terminating_decimal_denominator_condition", concepts["m1_num_denominator_power_of_ten_conversion"]["prerequisite_ids"])
        self.assertIn("m1_num_repeating_decimal_denominator_condition", concepts["m1_num_fraction_decimal_classification"]["prerequisite_ids"])

    def test_repetend_notation_and_conversion_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_num_repetend_identification": ("순환마디 찾기", "procedure", "medium"),
            "m1_num_repeating_decimal_dot_notation": ("순환마디 위 점 표기", "representation", "medium"),
            "m1_num_repeating_decimal_equation_conversion": ("식을 세워 순환소수를 분수로 나타내기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("유리수와 순환소수", concept["unit"])
                self.assertIn("[9수01-06]", source_locators(concept))

        self.assertIn("m1_num_repeating_decimal", concepts["m1_num_repetend_identification"]["prerequisite_ids"])
        self.assertIn("m1_num_repeating_decimal_notation", concepts["m1_num_repeating_decimal_dot_notation"]["parent_ids"])
        self.assertIn("m1_num_repeating_decimal_to_fraction", concepts["m1_num_repeating_decimal_equation_conversion"]["parent_ids"])
        self.assertIn("m1_num_repeating_decimal_dot_notation", concepts["m1_num_repeating_decimal_equation_conversion"]["prerequisite_ids"])

    def test_repeating_decimal_microconcept_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_num_repeating_decimal_unit__contains__m1_num_irreducible_fraction",
            "m1_num_repeating_decimal_unit__contains__m1_num_reduce_fraction_lowest_terms",
            "m1_num_repeating_decimal_unit__contains__m1_num_fraction_to_decimal_division",
            "m1_num_repeating_decimal_unit__contains__m1_num_terminating_decimal_denominator_condition",
            "m1_num_repeating_decimal_notation__contains__m1_num_repeating_decimal_dot_notation",
            "m1_num_repeating_decimal_to_fraction__contains__m1_num_repeating_decimal_equation_conversion",
            "m1_num_reduce_fraction_lowest_terms__used_in__m1_num_irreducible_fraction",
            "m1_num_reduce_fraction_lowest_terms__used_in__m1_num_fraction_decimal_classification",
            "m1_num_fraction_to_decimal_division__used_in__m1_num_decimal_remainder_repetition",
            "m1_num_decimal_remainder_repetition__used_in__m1_num_repeating_decimal",
            "m1_num_decimal_remainder_repetition__used_in__m1_num_rational_repeating_relation",
            "m1_num_decimal_remainder_repetition__related_to__m1_num_repetend",
            "m1_num_terminating_decimal_denominator_condition__used_in__m1_num_fraction_decimal_classification",
            "m1_num_repeating_decimal_denominator_condition__used_in__m1_num_fraction_decimal_classification",
            "m1_num_terminating_decimal_denominator_condition__contrasts_with__m1_num_repeating_decimal_denominator_condition",
            "m1_num_repeating_decimal_denominator_condition__contrasts_with__m1_num_terminating_decimal_denominator_condition",
            "m1_num_denominator_power_of_ten_conversion__used_in__m1_num_finite_decimal",
            "m1_num_finite_decimal_to_fraction__represented_by__m1_num_rational_fraction_form",
            "m1_num_repetend_identification__used_in__m1_num_repeating_decimal_dot_notation",
            "m1_num_repetend__represented_by__m1_num_repeating_decimal_dot_notation",
            "m1_num_repeating_decimal_notation__represented_by__m1_num_repeating_decimal_dot_notation",
            "m1_num_repeating_decimal_equation_conversion__used_in__m1_num_repeating_decimal_to_fraction",
            "m1_num_repeating_decimal_equation_conversion__used_in__m1_num_rational_repeating_relation",
            "m1_num_repeating_decimal_to_fraction__used_in__m1_num_rational_repeating_relation",
            "m1_num_repeating_decimal__represented_by__m1_num_rational_fraction_form",
            "m1_num_rational_fraction_form__used_in__m1_num_rational_repeating_relation",
            "m1_num_irreducible_fraction__related_to__m1_num_coprime",
            "m1_num_finite_decimal__contrasts_with__m1_num_repeating_decimal",
            "m1_num_repeating_decimal_unit__related_to__m1_num_square_root_real_unit",
        ]
        for edge_id in expected_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_repeating_decimal_misconceptions_stay_low_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_low = [
            "m1_mis_finite_to_repeating_scope",
            "m1_mis_fraction_decimal_denominator_not_reduced",
            "m1_mis_denominator_condition_2_5",
            "m1_mis_repetend_dot_notation_scope",
            "m1_mis_repeating_decimal_shift_digits",
        ]
        for concept_id in expected_low:
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual("misconception_risk", concept["concept_type"])
                self.assertEqual("low", concept["confidence"])
                self.assertEqual([], concept["prerequisite_ids"])

        confusion_edges = [
            "m1_mis_finite_to_repeating_scope__often_confused_with__m1_num_finite_decimal",
            "m1_mis_finite_to_repeating_scope__often_confused_with__m1_num_repeating_decimal",
            "m1_mis_finite_to_repeating_scope__often_confused_with__m1_num_rational_repeating_relation",
            "m1_mis_fraction_decimal_denominator_not_reduced__often_confused_with__m1_num_reduce_fraction_lowest_terms",
            "m1_mis_fraction_decimal_denominator_not_reduced__often_confused_with__m1_num_fraction_decimal_classification",
            "m1_mis_denominator_condition_2_5__often_confused_with__m1_num_terminating_decimal_denominator_condition",
            "m1_mis_denominator_condition_2_5__often_confused_with__m1_num_repeating_decimal_denominator_condition",
            "m1_mis_repetend_dot_notation_scope__often_confused_with__m1_num_repetend_identification",
            "m1_mis_repetend_dot_notation_scope__often_confused_with__m1_num_repeating_decimal_dot_notation",
            "m1_mis_repeating_decimal_shift_digits__often_confused_with__m1_num_repeating_decimal_equation_conversion",
            "m1_mis_repeating_decimal_shift_digits__often_confused_with__m1_num_repetend_identification",
        ]
        for edge_id in confusion_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_repeating_decimal_noisy_edges_are_absent(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        noisy_edges = [
            "m1_num_rational_repeating_relation__prerequisite_for__m1_mis_finite_to_repeating_scope",
            "m1_num_rational_number__prerequisite_for__m1_num_finite_decimal",
            "m1_num_rational_number__prerequisite_for__m1_num_infinite_decimal",
            "m1_num_prime_factor_unit__prerequisite_for__m1_num_repeating_decimal_unit",
            "m1_num_rationalize_denominator__prerequisite_for__m1_num_fraction_decimal_classification",
            "m1_num_finite_decimal__represented_by__m1_num_repeating_decimal_notation",
            "m1_num_finite_decimal__prerequisite_for__m1_num_repeating_decimal_to_fraction",
            "m1_num_finite_decimal__used_in__m1_num_repeating_decimal_to_fraction",
            "m1_num_infinite_decimal__contrasts_with__m1_num_irrational_number",
            "m1_num_repeating_decimal__prerequisite_for__m1_num_irrational_number",
            "m1_num_fraction_decimal_classification__used_in__m1_num_finite_decimal",
            "m1_num_fraction_decimal_classification__used_in__m1_num_repeating_decimal",
            "m1_num_rational_repeating_relation__used_in__m1_num_repeating_decimal_to_fraction",
            "m1_num_repeating_decimal_to_fraction__represented_by__m1_num_rational_number",
            "m1_num_irrational_number__contrasts_with__m1_num_repeating_decimal",
            "m1_mis_irrational_decimal__often_confused_with__m1_num_rational_repeating_relation",
        ]
        for edge_id in noisy_edges:
            with self.subTest(edge_id=edge_id):
                self.assertNotIn(edge_id, edges)

        self.assertEqual("제곱근과 실수", concepts["m1_mis_irrational_decimal"]["unit"])
        self.assertEqual("low", concepts["m1_mis_irrational_decimal"]["confidence"])


if __name__ == "__main__":
    unittest.main()
