from __future__ import annotations

import unittest

import build_pilot


def edge_keys() -> set[tuple[str, str, str]]:
    return {
        (edge["source_id"], edge["target_id"], edge["relationship_type"])
        for edge in build_pilot.EDGES
    }


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edge_pairs_by_type(relationship_type: str) -> set[frozenset[str]]:
    return {
        frozenset([edge["source_id"], edge["target_id"]])
        for edge in build_pilot.EDGES
        if edge["relationship_type"] == relationship_type
    }


class BuildPilotEdgeSyncTests(unittest.TestCase):
    def test_every_parent_id_is_mirrored_by_contains_edge(self) -> None:
        edges = edge_keys()
        missing = [
            (parent_id, concept["id"])
            for concept in build_pilot.CONCEPTS
            for parent_id in concept["parent_ids"]
            if (parent_id, concept["id"], "contains") not in edges
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_prerequisite_id_is_mirrored_by_prerequisite_edge(self) -> None:
        edges = edge_keys()
        missing = [
            (prerequisite_id, concept["id"])
            for concept in build_pilot.CONCEPTS
            for prerequisite_id in concept["prerequisite_ids"]
            if (prerequisite_id, concept["id"], "prerequisite_for") not in edges
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_contains_edge_is_mirrored_by_parent_id(self) -> None:
        concepts = concepts_by_id()
        missing = [
            (edge["source_id"], edge["target_id"])
            for edge in build_pilot.EDGES
            if edge["relationship_type"] == "contains"
            if edge["source_id"] not in concepts[edge["target_id"]]["parent_ids"]
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_prerequisite_edge_is_mirrored_by_prerequisite_id(self) -> None:
        concepts = concepts_by_id()
        missing = [
            (edge["source_id"], edge["target_id"])
            for edge in build_pilot.EDGES
            if edge["relationship_type"] == "prerequisite_for"
            if edge["source_id"] not in concepts[edge["target_id"]]["prerequisite_ids"]
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_misconception_related_id_has_confusion_edge(self) -> None:
        concepts = concepts_by_id()
        confused_pairs = edge_pairs_by_type("often_confused_with")
        missing = [
            (concept["id"], related_id)
            for concept in build_pilot.CONCEPTS
            for related_id in concept["related_ids"]
            if (
                concept["concept_type"] == "misconception_risk"
                or concepts[related_id]["concept_type"] == "misconception_risk"
            )
            if frozenset([concept["id"], related_id]) not in confused_pairs
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))


if __name__ == "__main__":
    unittest.main()
