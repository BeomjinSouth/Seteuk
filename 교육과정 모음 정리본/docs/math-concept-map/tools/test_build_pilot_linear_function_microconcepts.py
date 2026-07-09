from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def relationship_types_by_pair() -> dict[frozenset[str], set[str]]:
    grouped: dict[frozenset[str], set[str]] = {}
    for edge in build_pilot.EDGES:
        grouped.setdefault(frozenset([edge["source_id"], edge["target_id"]]), set()).add(
            edge["relationship_type"]
        )
    return grouped


class LinearFunctionMicroconceptTests(unittest.TestCase):
    def test_function_definition_microconcepts_are_explicit(self) -> None:
        concepts = concepts_by_id()

        unique_correspondence = concepts["m1_func_unique_correspondence"]
        self.assertEqual("하나씩 정해지는 대응", unique_correspondence["label_ko"])
        self.assertEqual("property", unique_correspondence["concept_type"])
        self.assertEqual("high", unique_correspondence["confidence"])
        self.assertIn("m1_func_function", unique_correspondence["parent_ids"])
        self.assertIn("m1_func_correspondence", unique_correspondence["prerequisite_ids"])

        input_value = concepts["m1_func_input_value"]
        self.assertEqual("입력값", input_value["label_ko"])
        self.assertEqual("term", input_value["concept_type"])
        self.assertEqual("low", input_value["confidence"])
        self.assertIn("m1_func_function", input_value["parent_ids"])
        self.assertIn("m1_func_value", input_value["related_ids"])
        self.assertIn("교과서", input_value["notes"])

        multiple_outputs = concepts["m1_mis_multiple_outputs_same_input"]
        self.assertEqual("하나의 입력에 여러 출력이 대응하는 경우를 함수로 보는 오류", multiple_outputs["label_ko"])
        self.assertEqual("misconception_risk", multiple_outputs["concept_type"])
        self.assertEqual("low", multiple_outputs["confidence"])
        self.assertIn("m1_func_unique_correspondence", multiple_outputs["prerequisite_ids"])
        self.assertIn("m1_func_unique_correspondence", multiple_outputs["related_ids"])

    def test_slope_increment_microconcepts_are_kept_low_until_textbook_evidence(self) -> None:
        concepts = concepts_by_id()

        for concept_id, label, coordinate_id in [
            ("m1_func_x_increment", "x의 증가량", "m1_coord_x_coordinate"),
            ("m1_func_y_increment", "y의 증가량", "m1_coord_y_coordinate"),
        ]:
            concept = concepts[concept_id]
            self.assertEqual(label, concept["label_ko"])
            self.assertEqual("term", concept["concept_type"])
            self.assertEqual("low", concept["confidence"])
            self.assertIn("m1_func_slope", concept["parent_ids"])
            self.assertIn(coordinate_id, concept["prerequisite_ids"])
            self.assertIn("교과서", concept["notes"])

        formula = concepts["m1_func_slope_ratio_formula"]
        self.assertEqual("기울기 계산식", formula["label_ko"])
        self.assertEqual("representation", formula["concept_type"])
        self.assertEqual("low", formula["confidence"])
        self.assertIn("m1_func_slope", formula["parent_ids"])
        self.assertIn("m1_func_x_increment", formula["prerequisite_ids"])
        self.assertIn("m1_func_y_increment", formula["prerequisite_ids"])
        self.assertIn("m1_num_ratio", formula["prerequisite_ids"])
        self.assertIn("교과서", formula["notes"])

    def test_linear_function_microconcept_edges_are_explicit(self) -> None:
        relationships = relationship_types_by_pair()
        expected = [
            (frozenset(["m1_func_function", "m1_func_unique_correspondence"]), "contains"),
            (frozenset(["m1_func_unique_correspondence", "m1_mis_all_relations_are_functions"]), "often_confused_with"),
            (frozenset(["m1_func_unique_correspondence", "m1_mis_multiple_outputs_same_input"]), "often_confused_with"),
            (frozenset(["m1_func_function", "m1_func_input_value"]), "contains"),
            (frozenset(["m1_func_input_value", "m1_func_value"]), "contrasts_with"),
            (frozenset(["m1_func_input_value", "m1_mis_function_value_input_output"]), "often_confused_with"),
            (frozenset(["m1_func_slope", "m1_func_x_increment"]), "contains"),
            (frozenset(["m1_func_slope", "m1_func_y_increment"]), "contains"),
            (frozenset(["m1_func_slope", "m1_func_slope_ratio_formula"]), "contains"),
            (frozenset(["m1_func_slope", "m1_func_slope_ratio_formula"]), "represented_by"),
            (frozenset(["m1_func_x_increment", "m1_func_slope_ratio_formula"]), "used_in"),
            (frozenset(["m1_func_y_increment", "m1_func_slope_ratio_formula"]), "used_in"),
            (frozenset(["m1_num_ratio", "m1_func_slope_ratio_formula"]), "prerequisite_for"),
            (frozenset(["m1_func_slope_ratio_formula", "m1_func_find_graph_equation"]), "used_in"),
            (frozenset(["m1_func_y_ax_graph", "m1_func_y_ax_b_graph"]), "contrasts_with"),
            (frozenset(["m1_func_slope", "m1_func_y_intercept"]), "contrasts_with"),
            (frozenset(["m1_func_slope_sign", "m1_func_graph_drawing"]), "used_in"),
        ]

        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)


if __name__ == "__main__":
    unittest.main()
