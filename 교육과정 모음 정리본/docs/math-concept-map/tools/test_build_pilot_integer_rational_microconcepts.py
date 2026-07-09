from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def relationship_types_by_pair() -> dict[frozenset[str], set[str]]:
    grouped: dict[frozenset[str], set[str]] = {}
    for edge in build_pilot.EDGES:
        grouped.setdefault(frozenset([edge["source_id"], edge["target_id"]]), set()).add(
            edge["relationship_type"]
        )
    return grouped


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class IntegerRationalMicroconceptTests(unittest.TestCase):
    def test_number_system_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        zero = concepts["m1_num_zero"]
        self.assertEqual("0", zero["label_ko"])
        self.assertEqual("term", zero["concept_type"])
        self.assertEqual("medium", zero["confidence"])
        self.assertIn("m1_num_integer", zero["parent_ids"])
        self.assertIn("m1_num_absolute_value", zero["related_ids"])
        self.assertIn("p. 211", source_locators(zero))

        fraction_form = concepts["m1_num_rational_fraction_form"]
        self.assertEqual("유리수의 분수 꼴 표현", fraction_form["label_ko"])
        self.assertEqual("representation", fraction_form["concept_type"])
        self.assertEqual("medium", fraction_form["confidence"])
        self.assertIn("m1_num_rational_number", fraction_form["parent_ids"])
        self.assertIn("m1_num_integer", fraction_form["prerequisite_ids"])

        position_order = concepts["m1_num_number_line_position_order"]
        self.assertEqual("수직선에서 오른쪽에 있는 수가 더 큼", position_order["label_ko"])
        self.assertEqual("property", position_order["concept_type"])
        self.assertEqual("medium", position_order["confidence"])
        self.assertIn("m1_num_order_relation", position_order["parent_ids"])
        self.assertIn("m1_num_number_line", position_order["prerequisite_ids"])
        self.assertIn("p. 212", source_locators(position_order))

        opposite_numbers = concepts["m1_num_opposite_numbers"]
        self.assertEqual("절댓값이 같고 부호가 다른 두 수", opposite_numbers["label_ko"])
        self.assertEqual("property", opposite_numbers["concept_type"])
        self.assertEqual("low", opposite_numbers["confidence"])
        self.assertIn("m1_num_absolute_value", opposite_numbers["parent_ids"])
        self.assertIn("교과서", opposite_numbers["notes"])

    def test_operation_microconcepts_are_separated(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_num_same_sign_addition": ("부호가 같은 수의 덧셈", "medium", "m1_num_integer_rational_add_sub"),
            "m1_num_different_sign_addition": ("부호가 다른 수의 덧셈", "medium", "m1_num_integer_rational_add_sub"),
            "m1_num_subtraction_as_add_opposite": ("뺄셈을 반대 부호의 덧셈으로 바꾸기", "low", "m1_num_integer_rational_add_sub"),
            "m1_num_mul_div_sign_rule": ("곱셈과 나눗셈의 부호 결정", "medium", "m1_num_integer_rational_mul_div"),
            "m1_num_division_as_multiply_reciprocal": ("나눗셈을 역수의 곱셈으로 바꾸기", "medium", "m1_num_integer_rational_mul_div"),
            "m1_num_operation_order_mixed": ("혼합계산의 계산 순서", "medium", "m1_num_mixed_calculation"),
        }
        for concept_id, (label, confidence, parent_id) in expected.items():
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual("procedure", concept["concept_type"])
            self.assertEqual(confidence, concept["confidence"])
            self.assertIn(parent_id, concept["parent_ids"])

        self.assertIn("m1_num_reciprocal", concepts["m1_num_division_as_multiply_reciprocal"]["prerequisite_ids"])
        self.assertIn("교과서", concepts["m1_num_subtraction_as_add_opposite"]["notes"])

    def test_integer_rational_edges_are_directional_and_less_noisy(self) -> None:
        edges = edges_by_id()
        relationships = relationship_types_by_pair()

        expected_edges = [
            "m1_num_integer__contains__m1_num_zero",
            "m1_num_rational_number__represented_by__m1_num_rational_fraction_form",
            "m1_num_number_line__used_in__m1_num_number_line_position_order",
            "m1_num_number_line_position_order__used_in__m1_num_order_relation",
            "m1_num_absolute_value__represented_by__m1_num_number_line",
            "m1_num_positive_number__represented_by__m1_num_plus_sign",
            "m1_num_negative_number__represented_by__m1_num_minus_sign",
            "m1_num_multiplication__prerequisite_for__m1_num_reciprocal",
            "m1_num_same_sign_addition__used_in__m1_num_integer_rational_add_sub",
            "m1_num_different_sign_addition__used_in__m1_num_integer_rational_add_sub",
            "m1_num_subtraction_as_add_opposite__used_in__m1_num_integer_rational_add_sub",
            "m1_num_mul_div_sign_rule__used_in__m1_num_integer_rational_mul_div",
            "m1_num_division_as_multiply_reciprocal__used_in__m1_num_integer_rational_mul_div",
            "m1_num_operation_order_mixed__used_in__m1_num_mixed_calculation",
            "m1_mis_negative_order__often_confused_with__m1_num_absolute_value",
        ]
        for edge_id in expected_edges:
            self.assertIn(edge_id, edges)

        noisy_prereq_edges = [
            "m1_num_absolute_value__prerequisite_for__m1_mis_absolute_value_positive",
            "m1_num_absolute_value__prerequisite_for__m1_mis_negative_order",
            "m1_num_order_relation__prerequisite_for__m1_mis_negative_order",
            "m1_num_plus_sign__prerequisite_for__m1_mis_sign_operation",
            "m1_num_minus_sign__prerequisite_for__m1_mis_sign_operation",
            "m1_num_operation_laws__prerequisite_for__m1_num_commutative_law",
            "m1_num_operation_laws__prerequisite_for__m1_num_associative_law",
            "m1_num_operation_laws__prerequisite_for__m1_num_distributive_law",
        ]
        for edge_id in noisy_prereq_edges:
            self.assertNotIn(edge_id, edges)

        self.assertIn("contrasts_with", relationships[frozenset(["m1_num_zero", "m1_num_positive_number"])])
        self.assertIn("contrasts_with", relationships[frozenset(["m1_num_zero", "m1_num_negative_number"])])
        self.assertIn("contrasts_with", relationships[frozenset(["m1_num_opposite_numbers", "m1_num_zero"])])

    def test_research_report_refs_are_supplemental_without_confidence_upgrade(self) -> None:
        concepts = concepts_by_id()

        self.assertEqual("high", concepts["m1_num_integer_rational_unit"]["confidence"])
        self.assertIn("p. 211", source_locators(concepts["m1_num_integer_rational_unit"]))
        self.assertIn("p. 212", source_locators(concepts["m1_num_order_relation"]))
        self.assertIn("p. 212", source_locators(concepts["m1_num_four_operations"]))

        self.assertEqual("low", concepts["m1_mis_sign_operation"]["confidence"])
        self.assertNotIn("p. 211", source_locators(concepts["m1_mis_sign_operation"]))
        self.assertNotIn("p. 212", source_locators(concepts["m1_mis_sign_operation"]))


if __name__ == "__main__":
    unittest.main()
