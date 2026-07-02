from __future__ import annotations

import unittest

import build_pilot


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edges_by_id() -> dict[str, dict]:
    return {edge["id"]: edge for edge in build_pilot.EDGES}


def source_locators(item: dict) -> str:
    return " ".join(ref["locator"] for ref in item["source_refs"])


class PythagoreanMicroconceptTests(unittest.TestCase):
    def test_right_triangle_parts_and_formula_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_pythagorean_right_angle": ("직각삼각형의 직각", "term", "medium"),
            "m1_geo_pythagorean_hypotenuse": ("피타고라스 정리에서의 빗변", "term", "medium"),
            "m1_geo_pythagorean_legs": ("직각삼각형의 두 직각변", "term", "medium"),
            "m1_geo_pythagorean_square_on_side": ("변 위의 정사각형", "representation", "medium"),
            "m1_geo_pythagorean_formula": ("피타고라스 정리의 식 표현", "representation", "medium"),
            "m1_geo_pythagorean_square_area_relation": ("세 변 위 정사각형 넓이 관계", "property", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("피타고라스 정리", concept["unit"])
                self.assertIn("[9수03-15]", source_locators(concept))

        self.assertIn("m1_geo_right_triangle", concepts["m1_geo_pythagorean_hypotenuse"]["parent_ids"])
        self.assertIn("m1_geo_right_triangle", concepts["m1_geo_pythagorean_legs"]["parent_ids"])
        self.assertIn("m1_geo_pythagorean_theorem", concepts["m1_geo_pythagorean_formula"]["parent_ids"])

    def test_pythagorean_procedures_are_explicit(self) -> None:
        concepts = concepts_by_id()

        expected = {
            "m1_geo_pythagorean_hypotenuse_length": ("피타고라스 정리로 빗변의 길이 구하기", "procedure", "high"),
            "m1_geo_pythagorean_leg_length": ("피타고라스 정리로 한 직각변의 길이 구하기", "procedure", "medium"),
            "m1_geo_pythagorean_unknown_side_selection": ("구하려는 변이 빗변인지 직각변인지 판단하기", "procedure", "medium"),
            "m1_geo_pythagorean_triple_check": ("세 수가 피타고라스 관계를 만족하는지 확인하기", "procedure", "medium"),
            "m1_geo_pythagorean_converse_side_ordering": ("가장 긴 변을 빗변 후보로 정하기", "procedure", "medium"),
            "m1_geo_pythagorean_converse_judgement": ("피타고라스 정리의 역으로 직각삼각형 판별하기", "procedure", "high"),
            "m1_geo_pythagorean_area_dissection_justification": ("넓이 분해로 피타고라스 정리 정당화하기", "procedure", "medium"),
        }
        for concept_id, (label, concept_type, confidence) in expected.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual(concept_type, concept["concept_type"])
                self.assertEqual(confidence, concept["confidence"])
                self.assertEqual("피타고라스 정리", concept["unit"])

        self.assertIn("연구보고서 p. 62", source_locators(concepts["m1_geo_pythagorean_hypotenuse_length"]))
        self.assertIn("[9수03-15]", source_locators(concepts["m1_geo_pythagorean_converse_judgement"]))
        self.assertIn("m1_geo_pythagorean_unknown_side_selection", concepts["m1_geo_pythagorean_leg_length"]["prerequisite_ids"])
        self.assertIn("m1_geo_pythagorean_converse_side_ordering", concepts["m1_geo_pythagorean_converse_judgement"]["prerequisite_ids"])

    def test_pythagorean_edges_are_directional(self) -> None:
        edges = edges_by_id()

        expected_edges = [
            "m1_geo_right_triangle__contains__m1_geo_pythagorean_right_angle",
            "m1_geo_right_triangle__contains__m1_geo_pythagorean_hypotenuse",
            "m1_geo_right_triangle__contains__m1_geo_pythagorean_legs",
            "m1_geo_pythagorean_theorem__represented_by__m1_geo_pythagorean_formula",
            "m1_geo_pythagorean_theorem__represented_by__m1_geo_pythagorean_square_area_relation",
            "m1_geo_pythagorean_square_on_side__used_in__m1_geo_pythagorean_square_area_relation",
            "m1_geo_pythagorean_square_area_relation__used_in__m1_geo_pythagorean_justification",
            "m1_geo_pythagorean_formula__used_in__m1_geo_pythagorean_hypotenuse_length",
            "m1_geo_pythagorean_formula__used_in__m1_geo_pythagorean_leg_length",
            "m1_geo_pythagorean_unknown_side_selection__used_in__m1_geo_pythagorean_hypotenuse_length",
            "m1_geo_pythagorean_unknown_side_selection__used_in__m1_geo_pythagorean_leg_length",
            "m1_geo_pythagorean_hypotenuse_length__used_in__m1_geo_pythagorean_theorem",
            "m1_geo_pythagorean_leg_length__used_in__m1_geo_pythagorean_theorem",
            "m1_geo_pythagorean_converse_side_ordering__used_in__m1_geo_pythagorean_converse_judgement",
            "m1_geo_pythagorean_triple_check__used_in__m1_geo_pythagorean_converse_judgement",
            "m1_geo_pythagorean_converse_judgement__used_in__m1_geo_right_triangle_judgement",
            "m1_geo_pythagorean_area_dissection_justification__used_in__m1_geo_pythagorean_justification",
        ]
        for edge_id in expected_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_pythagorean_misconceptions_stay_low_without_prerequisites(self) -> None:
        concepts = concepts_by_id()
        edges = edges_by_id()

        expected_low = {
            "m1_mis_pythagorean_non_right_triangle": "직각삼각형이 아닌 삼각형에 피타고라스 정리를 적용하는 오류",
            "m1_mis_pythagorean_hypotenuse_misidentification": "빗변을 가장 길지 않은 변으로 잘못 정하는 오류",
            "m1_mis_pythagorean_leg_subtraction": "한 직각변을 구할 때 제곱의 차를 쓰지 않는 오류",
            "m1_mis_pythagorean_converse_unsorted_sides": "가장 긴 변을 확인하지 않고 역을 적용하는 오류",
        }
        for concept_id, label in expected_low.items():
            with self.subTest(concept_id=concept_id):
                concept = concepts[concept_id]
                self.assertEqual(label, concept["label_ko"])
                self.assertEqual("misconception_risk", concept["concept_type"])
                self.assertEqual("low", concept["confidence"])
                self.assertEqual([], concept["prerequisite_ids"])

        confusion_edges = [
            "m1_mis_pythagorean_non_right_triangle__often_confused_with__m1_geo_pythagorean_theorem",
            "m1_mis_pythagorean_hypotenuse_misidentification__often_confused_with__m1_geo_pythagorean_hypotenuse",
            "m1_mis_pythagorean_leg_subtraction__often_confused_with__m1_geo_pythagorean_leg_length",
            "m1_mis_pythagorean_converse_unsorted_sides__often_confused_with__m1_geo_pythagorean_converse_side_ordering",
        ]
        for edge_id in confusion_edges:
            with self.subTest(edge_id=edge_id):
                self.assertIn(edge_id, edges)

    def test_pythagorean_noisy_edges_are_absent(self) -> None:
        edges = edges_by_id()

        noisy_edges = [
            "m1_geo_pythagorean_formula__represented_by__m1_geo_pythagorean_theorem",
            "m1_geo_pythagorean_unit__prerequisite_for__m1_geo_trig_unit",
            "m1_geo_similarity_unit__prerequisite_for__m1_geo_pythagorean_unit",
            "m1_geo_pythagorean_theorem__prerequisite_for__m1_mis_pythagorean_non_right_triangle",
            "m1_geo_pythagorean_hypotenuse__prerequisite_for__m1_mis_pythagorean_hypotenuse_misidentification",
            "m1_geo_pythagorean_square_area_relation__prerequisite_for__m1_geo_pythagorean_formula",
            "m1_geo_pythagorean_hypotenuse_length__prerequisite_for__m1_geo_pythagorean_leg_length",
        ]
        for edge_id in noisy_edges:
            with self.subTest(edge_id=edge_id):
                self.assertNotIn(edge_id, edges)


if __name__ == "__main__":
    unittest.main()
