from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edge_keys() -> set[tuple[str, str, str]]:
    return {
        (edge["source_id"], edge["target_id"], edge["relationship_type"])
        for edge in build_pilot.EDGES
    }


class FoundationalPrerequisiteConceptTests(unittest.TestCase):
    def test_foundational_number_prerequisites_are_explicit_concepts(self) -> None:
        concepts = concepts_by_id()
        expected = {
            "m1_num_divisor": ("약수", "term", "m1_num_prime_factor_unit"),
            "m1_num_multiple": ("배수", "term", "m1_num_prime_factor_unit"),
            "m1_num_addition": ("덧셈", "procedure", "m1_num_four_operations"),
            "m1_num_subtraction": ("뺄셈", "procedure", "m1_num_four_operations"),
            "m1_num_multiplication": ("곱셈", "procedure", "m1_num_four_operations"),
            "m1_num_division": ("나눗셈", "procedure", "m1_num_four_operations"),
        }

        for concept_id, (label, concept_type, parent_id) in expected.items():
            with self.subTest(concept_id=concept_id):
                self.assertIn(concept_id, concepts)
                concept = concepts[concept_id]
                self.assertEqual(concept["label_ko"], label)
                self.assertEqual(concept["concept_type"], concept_type)
                self.assertEqual(concept["confidence"], "medium")
                self.assertIn(parent_id, concept["parent_ids"])
                self.assertTrue(concept["source_refs"])

    def test_foundational_number_prerequisites_are_linked_to_existing_units(self) -> None:
        edges = edge_keys()
        expected_edges = {
            ("m1_num_prime_factor_unit", "m1_num_divisor", "contains"),
            ("m1_num_prime_factor_unit", "m1_num_multiple", "contains"),
            ("m1_num_divisor", "m1_num_gcd", "used_in"),
            ("m1_num_multiple", "m1_num_lcm", "used_in"),
            ("m1_num_four_operations", "m1_num_addition", "contains"),
            ("m1_num_four_operations", "m1_num_subtraction", "contains"),
            ("m1_num_four_operations", "m1_num_multiplication", "contains"),
            ("m1_num_four_operations", "m1_num_division", "contains"),
            ("m1_num_addition", "m1_num_integer_rational_add_sub", "used_in"),
            ("m1_num_subtraction", "m1_num_integer_rational_add_sub", "used_in"),
            ("m1_num_multiplication", "m1_num_integer_rational_mul_div", "used_in"),
            ("m1_num_division", "m1_num_integer_rational_mul_div", "used_in"),
        }

        self.assertTrue(expected_edges.issubset(edges))


if __name__ == "__main__":
    unittest.main()
