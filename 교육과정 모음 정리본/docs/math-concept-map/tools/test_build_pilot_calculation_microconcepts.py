from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


def source_ids(item: dict) -> set[str]:
    return {ref["source_id"] for ref in item["source_refs"]}


class CalculationMicroconceptTests(unittest.TestCase):
    def test_expression_calculation_microprocedures_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_calc_same_base_power_multiplication": ("같은 밑의 거듭제곱의 곱셈", "property", "medium"),
            "m1_calc_same_base_power_division": ("같은 밑의 거듭제곱의 나눗셈", "property", "medium"),
            "m1_calc_power_of_power": ("거듭제곱의 거듭제곱", "property", "medium"),
            "m1_calc_monomial_coefficient_calculation": ("단항식 계산에서 계수끼리 계산하기", "procedure", "medium"),
            "m1_calc_monomial_literal_part_calculation": ("단항식 계산에서 문자 부분 계산하기", "procedure", "medium"),
            "m1_calc_collect_like_terms_polynomial": ("다항식에서 동류항 모으기", "procedure", "high"),
            "m1_calc_polynomial_parentheses_removal": ("다항식의 괄호 풀기", "procedure", "medium"),
            "m1_calc_polynomial_subtraction_sign_distribution": ("다항식의 뺄셈에서 부호 바꾸기", "procedure", "medium"),
            "m1_calc_monomial_times_polynomial_distribution": ("단항식을 다항식에 분배하기", "procedure", "medium"),
            "m1_calc_polynomial_divided_by_monomial_termwise": ("다항식의 각 항을 단항식으로 나누기", "procedure", "medium"),
            "m1_calc_polynomial_division_quotient_scope_check": ("몫이 다항식인지 확인하기", "procedure", "medium"),
            "m1_mis_polynomial_subtraction_sign": ("다항식 뺄셈에서 괄호 앞 음수를 분배하지 않는 오류", "misconception_risk", "low"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual(concept_type, concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertEqual("식의 계산", concept["unit"])
            self.assertIn("curriculum_math_2022", source_ids(concept))

        self.assertIn("m1_calc_exponent_laws", concepts["m1_calc_same_base_power_multiplication"]["parent_ids"])
        self.assertIn("m1_calc_exponent_laws", concepts["m1_calc_same_base_power_division"]["parent_ids"])
        self.assertIn("m1_calc_exponent_laws", concepts["m1_calc_power_of_power"]["parent_ids"])
        self.assertIn("m1_calc_monomial_mul_div", concepts["m1_calc_monomial_coefficient_calculation"]["parent_ids"])
        self.assertIn("m1_calc_monomial_mul_div", concepts["m1_calc_monomial_literal_part_calculation"]["parent_ids"])
        self.assertIn("m1_calc_polynomial_add_sub", concepts["m1_calc_collect_like_terms_polynomial"]["parent_ids"])
        self.assertIn("m1_calc_polynomial_add_sub", concepts["m1_calc_polynomial_parentheses_removal"]["parent_ids"])
        self.assertIn("m1_calc_polynomial_add_sub", concepts["m1_calc_polynomial_subtraction_sign_distribution"]["parent_ids"])
        self.assertIn("m1_calc_monomial_polynomial_mul_div", concepts["m1_calc_monomial_times_polynomial_distribution"]["parent_ids"])
        self.assertIn("m1_calc_monomial_polynomial_mul_div", concepts["m1_calc_polynomial_divided_by_monomial_termwise"]["parent_ids"])
        self.assertIn("m1_calc_monomial_polynomial_mul_div", concepts["m1_calc_polynomial_division_quotient_scope_check"]["parent_ids"])

        self.assertIn("[9수02-08]", source_locators(concepts["m1_calc_same_base_power_multiplication"]))
        self.assertIn("[9수02-09]", source_locators(concepts["m1_calc_collect_like_terms_polynomial"]))
        self.assertIn("[9수02-10]", source_locators(concepts["m1_calc_monomial_times_polynomial_distribution"]))

    def test_calculation_edges_link_microprocedures_to_parent_flows(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_calc_exponent_laws__contains__m1_calc_same_base_power_multiplication",
            "m1_calc_exponent_laws__contains__m1_calc_same_base_power_division",
            "m1_calc_exponent_laws__contains__m1_calc_power_of_power",
            "m1_calc_monomial_mul_div__contains__m1_calc_monomial_coefficient_calculation",
            "m1_calc_monomial_mul_div__contains__m1_calc_monomial_literal_part_calculation",
            "m1_calc_polynomial_add_sub__contains__m1_calc_collect_like_terms_polynomial",
            "m1_calc_polynomial_add_sub__contains__m1_calc_polynomial_parentheses_removal",
            "m1_calc_polynomial_add_sub__contains__m1_calc_polynomial_subtraction_sign_distribution",
            "m1_calc_monomial_polynomial_mul_div__contains__m1_calc_monomial_times_polynomial_distribution",
            "m1_calc_monomial_polynomial_mul_div__contains__m1_calc_polynomial_divided_by_monomial_termwise",
            "m1_calc_monomial_polynomial_mul_div__contains__m1_calc_polynomial_division_quotient_scope_check",
            "m1_calc_same_base_power_multiplication__used_in__m1_calc_monomial_literal_part_calculation",
            "m1_calc_same_base_power_division__used_in__m1_calc_monomial_literal_part_calculation",
            "m1_calc_monomial_coefficient_calculation__used_in__m1_calc_monomial_mul_div",
            "m1_calc_monomial_literal_part_calculation__used_in__m1_calc_monomial_mul_div",
            "m1_calc_collect_like_terms_polynomial__used_in__m1_calc_polynomial_add_sub",
            "m1_calc_polynomial_parentheses_removal__used_in__m1_calc_polynomial_add_sub",
            "m1_calc_polynomial_subtraction_sign_distribution__used_in__m1_calc_polynomial_add_sub",
            "m1_calc_monomial_times_polynomial_distribution__used_in__m1_calc_expansion",
            "m1_calc_polynomial_divided_by_monomial_termwise__used_in__m1_calc_monomial_polynomial_mul_div",
            "m1_calc_polynomial_division_quotient_scope_check__used_in__m1_calc_polynomial_divided_by_monomial_termwise",
            "m1_calc_polynomial_subtraction_sign_distribution__contrasts_with__m1_calc_collect_like_terms_polynomial",
            "m1_mis_polynomial_subtraction_sign__often_confused_with__m1_calc_polynomial_subtraction_sign_distribution",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

    def test_calculation_misconceptions_remain_low_confidence_without_prerequisites(self) -> None:
        concepts = concepts_by_id()

        for concept_id in [
            "m1_mis_exponent_base",
            "m1_mis_polynomial_like_terms",
            "m1_mis_polynomial_division_scope",
            "m1_mis_polynomial_subtraction_sign",
        ]:
            concept = concepts[concept_id]
            self.assertEqual("misconception_risk", concept["concept_type"])
            self.assertEqual("low", concept["confidence"])
            self.assertEqual([], concept["prerequisite_ids"])

    def test_calculation_noisy_prerequisite_edges_are_removed(self) -> None:
        edges = edges_by_id()

        noisy_prereq_edges = [
            "m1_calc_base__prerequisite_for__m1_mis_exponent_base",
            "m1_calc_exponent_laws__prerequisite_for__m1_mis_exponent_base",
            "m1_calc_monomial_polynomial_mul_div__prerequisite_for__m1_mis_polynomial_division_scope",
            "m1_calc_polynomial_subtraction_sign_distribution__prerequisite_for__m1_mis_polynomial_subtraction_sign",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

    def test_calculation_nodes_do_not_use_research_report_as_direct_source(self) -> None:
        concepts = concepts_by_id()

        for concept in concepts.values():
            if concept["unit"] == "식의 계산":
                self.assertNotIn("achievement_research_report_2022", source_ids(concept))


if __name__ == "__main__":
    unittest.main()
