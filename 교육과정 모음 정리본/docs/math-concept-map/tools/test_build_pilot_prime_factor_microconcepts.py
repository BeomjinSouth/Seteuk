from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class PrimeFactorMicroconceptTests(unittest.TestCase):
    def test_prime_factorization_microprocedures_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_num_prime_factorization_meaning_explanation": ("소인수분해의 뜻 설명하기", "procedure", "high"),
            "m1_num_prime_factorization_guided_procedure": ("안내된 절차에 따라 소인수분해하기", "procedure", "high"),
            "m1_num_prime_composite_classification": ("소수와 합성수 판별하기", "procedure", "high"),
            "m1_num_prime_factorization_division_method": ("나눗셈을 이용한 소인수분해", "procedure", "medium"),
            "m1_num_prime_factorization_exponent_notation": ("소인수분해 결과를 거듭제곱으로 정리하기", "procedure", "high"),
            "m1_num_prime_factorization_uniqueness": ("소인수분해의 유일성", "property", "low"),
            "m1_num_one_not_prime_or_composite": ("1은 소수도 합성수도 아님", "property", "medium"),
            "m1_num_common_divisor": ("공약수", "term", "medium"),
            "m1_num_common_multiple": ("공배수", "term", "medium"),
            "m1_num_common_prime_factor": ("공통 소인수", "sub_concept", "medium"),
            "m1_num_select_common_prime_factors": ("공통 소인수 선택하기", "procedure", "medium"),
            "m1_num_select_all_prime_factors": ("필요한 모든 소인수 선택하기", "procedure", "medium"),
            "m1_num_gcd_prime_factor_product": ("최대공약수를 공통 소인수의 곱으로 나타내기", "procedure", "high"),
            "m1_num_lcm_prime_factor_product": ("최소공배수를 필요한 모든 소인수의 곱으로 나타내기", "procedure", "high"),
            "m1_num_gcd_lcm_principle_explanation": ("최대공약수와 최소공배수의 원리 설명하기", "procedure", "high"),
            "m1_num_coprime_judgement_prime_factorization": ("소인수분해로 서로소 판별하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn("m1_num_prime_factor_unit", concept["parent_ids"])

        self.assertIn("m1_num_prime_number", concepts["m1_num_prime_composite_classification"]["prerequisite_ids"])
        self.assertIn("m1_num_composite_number", concepts["m1_num_prime_composite_classification"]["prerequisite_ids"])
        self.assertIn("m1_num_prime_factorization", concepts["m1_num_prime_factorization_meaning_explanation"]["prerequisite_ids"])
        self.assertIn("m1_num_prime_composite_classification", concepts["m1_num_prime_factorization_guided_procedure"]["prerequisite_ids"])
        self.assertIn("m1_num_prime_factor", concepts["m1_num_prime_factorization_division_method"]["prerequisite_ids"])
        self.assertIn("m1_num_prime_factor_product", concepts["m1_num_prime_factorization_exponent_notation"]["prerequisite_ids"])
        self.assertIn("m1_num_natural_number", concepts["m1_num_one_not_prime_or_composite"]["prerequisite_ids"])
        self.assertIn("m1_num_divisor", concepts["m1_num_common_divisor"]["prerequisite_ids"])
        self.assertIn("m1_num_multiple", concepts["m1_num_common_multiple"]["prerequisite_ids"])
        self.assertIn("m1_num_prime_factorization", concepts["m1_num_common_prime_factor"]["prerequisite_ids"])
        self.assertIn("m1_num_common_prime_factor", concepts["m1_num_select_common_prime_factors"]["prerequisite_ids"])
        self.assertIn("m1_num_prime_factor_product", concepts["m1_num_select_all_prime_factors"]["prerequisite_ids"])
        self.assertIn("m1_num_prime_factorization", concepts["m1_num_coprime_judgement_prime_factorization"]["prerequisite_ids"])

        self.assertIn("achievement levels", source_locators(concepts["m1_num_prime_composite_classification"]))
        self.assertIn("achievement levels", source_locators(concepts["m1_num_gcd_lcm_principle_explanation"]))
        self.assertIn("교과서", concepts["m1_num_prime_factorization_uniqueness"]["notes"])

    def test_prime_factor_edges_link_microprocedures_to_parent_flows(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_num_prime_factor_unit__contains__m1_num_prime_factorization_meaning_explanation",
            "m1_num_prime_factor_unit__contains__m1_num_prime_factorization_guided_procedure",
            "m1_num_prime_factor_unit__contains__m1_num_prime_composite_classification",
            "m1_num_prime_factor_unit__contains__m1_num_prime_factorization_division_method",
            "m1_num_prime_factor_unit__contains__m1_num_prime_factorization_exponent_notation",
            "m1_num_prime_factor_unit__contains__m1_num_prime_factorization_uniqueness",
            "m1_num_prime_factor_unit__contains__m1_num_one_not_prime_or_composite",
            "m1_num_prime_factor_unit__contains__m1_num_common_divisor",
            "m1_num_prime_factor_unit__contains__m1_num_common_multiple",
            "m1_num_prime_factor_unit__contains__m1_num_common_prime_factor",
            "m1_num_prime_factor_unit__contains__m1_num_select_common_prime_factors",
            "m1_num_prime_factor_unit__contains__m1_num_select_all_prime_factors",
            "m1_num_prime_factor_unit__contains__m1_num_gcd_prime_factor_product",
            "m1_num_prime_factor_unit__contains__m1_num_lcm_prime_factor_product",
            "m1_num_prime_factor_unit__contains__m1_num_gcd_lcm_principle_explanation",
            "m1_num_prime_factor_unit__contains__m1_num_coprime_judgement_prime_factorization",
            "m1_num_prime_factor__used_in__m1_num_prime_factorization_meaning_explanation",
            "m1_num_prime_factorization_guided_procedure__used_in__m1_num_prime_factorization",
            "m1_num_prime_composite_classification__used_in__m1_num_prime_factorization",
            "m1_num_prime_factorization_division_method__used_in__m1_num_prime_factorization",
            "m1_num_prime_factorization_exponent_notation__used_in__m1_num_prime_factorization",
            "m1_num_one_not_prime_or_composite__used_in__m1_num_prime_composite_classification",
            "m1_num_prime_factorization__used_in__m1_num_common_prime_factor",
            "m1_num_prime_factorization__used_in__m1_num_coprime_judgement_prime_factorization",
            "m1_num_coprime_judgement_prime_factorization__used_in__m1_num_coprime",
            "m1_num_common_divisor__used_in__m1_num_gcd",
            "m1_num_common_multiple__used_in__m1_num_lcm",
            "m1_num_divisor__prerequisite_for__m1_num_prime_number",
            "m1_num_divisor__prerequisite_for__m1_num_composite_number",
            "m1_num_divisor__prerequisite_for__m1_num_prime_factor",
            "m1_num_common_prime_factor__used_in__m1_num_gcd_prime_factor_product",
            "m1_num_common_prime_factor__used_in__m1_num_select_common_prime_factors",
            "m1_num_select_common_prime_factors__used_in__m1_num_gcd_prime_factor_product",
            "m1_num_select_all_prime_factors__used_in__m1_num_lcm_prime_factor_product",
            "m1_num_gcd_prime_factor_product__used_in__m1_num_find_gcd_lcm_prime_factorization",
            "m1_num_lcm_prime_factor_product__used_in__m1_num_find_gcd_lcm_prime_factorization",
            "m1_num_gcd_lcm_principle_explanation__used_in__m1_num_find_gcd_lcm_prime_factorization",
            "m1_num_prime_factor_product__used_in__m1_num_find_gcd_lcm_prime_factorization",
            "m1_num_gcd__used_in__m1_num_coprime",
            "m1_num_common_divisor__contrasts_with__m1_num_common_multiple",
            "m1_num_common_multiple__contrasts_with__m1_num_common_divisor",
            "m1_num_select_common_prime_factors__contrasts_with__m1_num_select_all_prime_factors",
            "m1_num_select_all_prime_factors__contrasts_with__m1_num_select_common_prime_factors",
            "m1_num_gcd_prime_factor_product__contrasts_with__m1_num_lcm_prime_factor_product",
            "m1_num_lcm_prime_factor_product__contrasts_with__m1_num_gcd_prime_factor_product",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

    def test_prime_factor_misconceptions_keep_low_confidence_without_prerequisites(self) -> None:
        concepts = concepts_by_id()

        for concept_id in [
            "m1_mis_prime_one",
            "m1_mis_gcd_lcm_scope",
            "m1_mis_gcd_lcm_common_all_prime_factor",
        ]:
            concept = concepts[concept_id]
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])

    def test_prime_factor_noisy_prerequisite_edges_are_removed(self) -> None:
        edges = edges_by_id()

        noisy_prereq_edges = [
            "m1_num_prime_number__prerequisite_for__m1_mis_prime_one",
            "m1_num_composite_number__prerequisite_for__m1_mis_prime_one",
            "m1_num_find_gcd_lcm_prime_factorization__prerequisite_for__m1_mis_gcd_lcm_scope",
            "m1_num_select_common_prime_factors__prerequisite_for__m1_mis_gcd_lcm_common_all_prime_factor",
            "m1_num_select_all_prime_factors__prerequisite_for__m1_mis_gcd_lcm_common_all_prime_factor",
            "m1_num_prime_number__prerequisite_for__m1_num_composite_number",
            "m1_num_prime_factorization__prerequisite_for__m1_num_gcd",
            "m1_num_prime_factorization__prerequisite_for__m1_num_lcm",
            "m1_num_prime_factor_unit__prerequisite_for__m1_num_integer_rational_unit",
            "m1_num_prime_factor_unit__related_to__m1_calc_power",
            "m1_num_coprime__used_in__m1_num_gcd",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

        self.assertIn(
            "m1_mis_gcd_lcm_common_all_prime_factor__often_confused_with__m1_num_select_common_prime_factors",
            edges,
        )
        self.assertIn(
            "m1_mis_gcd_lcm_common_all_prime_factor__often_confused_with__m1_num_select_all_prime_factors",
            edges,
        )


if __name__ == "__main__":
    unittest.main()
