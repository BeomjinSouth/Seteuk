from __future__ import annotations

import unittest

import validate_concept_map as validator


def ref(locator: str, summary: str = "") -> dict:
    return {
        "source_id": "curriculum_math_2022",
        "locator": locator,
        "evidence_kind": "achievement_standard",
        "summary": summary,
    }


class AchievementCoverageTests(unittest.TestCase):
    def test_expected_middle_school_codes_cover_all_four_domains(self) -> None:
        expected = validator.EXPECTED_ACHIEVEMENT_CODES

        self.assertEqual(len(expected), 60)
        self.assertEqual(expected[0], "9수01-01")
        self.assertEqual(expected[-1], "9수04-09")
        self.assertIn("9수02-22", expected)
        self.assertIn("9수03-19", expected)

    def test_missing_achievement_codes_are_reported_from_refs(self) -> None:
        present = {
            code: [{"source_refs": [ref(f"printed p. 1; [{code}]")]}]
            for code in validator.EXPECTED_ACHIEVEMENT_CODES
        }
        del present["9수03-19"]

        records = [record for records in present.values() for record in records]

        self.assertEqual(
            validator.missing_achievement_codes(records),
            ["9수03-19"],
        )

    def test_code_ranges_in_locators_are_expanded(self) -> None:
        records = [
            {
                "source_refs": [
                    ref(
                        "자료와 가능성 section; [9수04-02]~[9수04-04]",
                        "도수분포표와 상대도수 성취수준",
                    )
                ]
            }
        ]

        self.assertEqual(
            validator.collect_achievement_codes(records),
            {"9수04-02", "9수04-03", "9수04-04"},
        )

    def test_low_confidence_count_matches_review_queue_scope(self) -> None:
        records = [
            {"confidence": "high"},
            {"confidence": "low"},
            {"confidence": "medium"},
            {"confidence": "low"},
        ]

        self.assertEqual(validator.low_confidence_concept_count(records), 2)

    def test_term_needs_concept_count_reports_uncovered_terms(self) -> None:
        rows = [
            {"coverage_status": "covered"},
            {"coverage_status": "covered_by_alias"},
            {"coverage_status": "needs_concept"},
            {"coverage_status": "excluded_by_curriculum_scope"},
        ]

        self.assertEqual(validator.term_needs_concept_count(rows), 1)

    def test_unit_group_count_uses_grade_domain_and_unit(self) -> None:
        records = [
            {"grade": "중1", "domain": "수와 연산", "unit": "소인수분해"},
            {"grade": "중1", "domain": "수와 연산", "unit": "소인수분해"},
            {"grade": "중1", "domain": "변화와 관계", "unit": "소인수분해"},
        ]

        self.assertEqual(validator.unit_group_count(records), 2)

    def test_isolated_concept_count_reports_concepts_without_edges(self) -> None:
        concepts = [{"id": "unit"}, {"id": "coord"}, {"id": "isolated"}]
        edges = [{"source_id": "unit", "target_id": "coord"}]

        self.assertEqual(validator.isolated_concept_count(concepts, edges), 1)

    def test_missing_source_inventory_groups_are_reported(self) -> None:
        rows = [
            {"source_group": "curriculum_pdf", "status": "available"},
            {"source_group": "achievement_pdf", "status": "available"},
            {"source_group": "textbook_originals", "status": "empty"},
        ]

        self.assertEqual(
            validator.missing_source_inventory_groups(rows),
            ["unit_summary_json"],
        )

    def test_invalid_source_inventory_statuses_are_reported(self) -> None:
        rows = [
            {"source_group": "curriculum_pdf", "status": "available"},
            {"source_group": "achievement_pdf", "status": "stale"},
        ]

        self.assertEqual(
            validator.invalid_source_inventory_statuses(rows),
            ["achievement_pdf:stale"],
        )

    def test_source_ref_count_counts_concept_and_edge_refs(self) -> None:
        concepts = [
            {"source_refs": [{"source_id": "curriculum_math_2022"}]},
            {"source_refs": [{"source_id": "achievement_math_2022"}, {"source_id": "unit_summary_math_json"}]},
        ]
        edges = [
            {"source_refs": [{"source_id": "curriculum_math_2022"}]},
        ]

        self.assertEqual(validator.source_ref_count(concepts, edges), 4)

    def test_source_ref_audit_missing_detail_count_sums_locator_and_summary_gaps(self) -> None:
        rows = [
            {"missing_locator_count": "1", "missing_summary_count": "0"},
            {"missing_locator_count": "0", "missing_summary_count": "2"},
        ]

        self.assertEqual(validator.source_ref_audit_missing_detail_count(rows), 3)

    def test_missing_concept_evidence_depth_ids_are_reported(self) -> None:
        concepts = [{"id": "coord"}, {"id": "axis"}]
        rows = [{"concept_id": "coord"}]

        self.assertEqual(
            validator.missing_concept_evidence_depth_ids(concepts, rows),
            ["axis"],
        )

    def test_concept_evidence_depth_source_ref_count_sums_rows(self) -> None:
        rows = [
            {"source_ref_count": "2"},
            {"source_ref_count": "3"},
        ]

        self.assertEqual(validator.concept_evidence_depth_source_ref_count(rows), 5)

    def test_textbook_evidence_count_reports_supported_rows(self) -> None:
        rows = [
            {"has_textbook_evidence": "yes"},
            {"has_textbook_evidence": "no"},
            {"has_textbook_evidence": "yes"},
        ]

        self.assertEqual(validator.concept_evidence_depth_textbook_evidence_count(rows), 2)

    def test_textbook_queue_unit_group_count_uses_grade_domain_unit(self) -> None:
        rows = [
            {"grade": "중1", "domain": "변화와 관계", "unit": "좌표평면과 그래프"},
            {"grade": "중1", "domain": "변화와 관계", "unit": "좌표평면과 그래프"},
            {"grade": "중1", "domain": "수와 연산", "unit": "정수와 유리수"},
        ]

        self.assertEqual(validator.textbook_queue_unit_group_count(rows), 2)

    def test_textbook_queue_needs_textbook_count_sums_rows(self) -> None:
        rows = [
            {"needs_textbook_evidence_count": "2"},
            {"needs_textbook_evidence_count": "3"},
        ]

        self.assertEqual(validator.textbook_queue_needs_textbook_count(rows), 5)

    def test_textbook_packet_missing_concepts_are_reported_for_target_unit(self) -> None:
        concepts = [
            {"id": "coord", "grade": "g1", "domain": "relation", "unit": "coordinate plane"},
            {"id": "axis", "grade": "g1", "domain": "relation", "unit": "coordinate plane"},
            {"id": "integer", "grade": "g1", "domain": "number", "unit": "integer"},
        ]
        packet_rows = [{"concept_id": "coord"}]
        target = {"grade": "g1", "domain": "relation", "unit": "coordinate plane"}

        self.assertEqual(
            validator.textbook_packet_missing_concepts(concepts, packet_rows, target),
            ["axis"],
        )

    def test_textbook_packet_pending_count_reports_pending_rows(self) -> None:
        rows = [
            {"extraction_status": "pending_textbook_pdf"},
            {"extraction_status": "textbook_evidence_linked"},
            {"extraction_status": "pending_textbook_pdf"},
        ]

        self.assertEqual(validator.textbook_packet_pending_count(rows), 2)

    def test_textbook_packet_index_missing_ranks_are_reported(self) -> None:
        rows = [
            {"rank": "1"},
            {"rank": "3"},
        ]

        self.assertEqual(
            validator.textbook_packet_index_missing_ranks(rows, expected_ranks=[1, 2, 3]),
            [2],
        )

    def test_textbook_packet_expected_ranks_follow_queue_rows(self) -> None:
        queue_rows = [
            {"rank": "2"},
            {"rank": "1"},
            {"rank": "3"},
        ]

        self.assertEqual(validator.textbook_packet_expected_ranks(queue_rows), [1, 2, 3])

    def test_textbook_packet_index_pending_count_sums_rows(self) -> None:
        rows = [
            {"pending_textbook_evidence_count": "2"},
            {"pending_textbook_evidence_count": "3"},
        ]

        self.assertEqual(validator.textbook_packet_index_pending_count(rows), 5)

    def test_legacy_gap_needs_review_count_reports_review_candidates(self) -> None:
        rows = [
            {"coverage_status": "covered_by_label"},
            {"coverage_status": "needs_review"},
            {"coverage_status": "covered_by_alias"},
            {"coverage_status": "needs_review"},
        ]

        self.assertEqual(validator.legacy_gap_needs_review_count(rows), 2)

    def test_duplicate_legacy_gap_ids_are_reported(self) -> None:
        rows = [
            {"legacy_id": "legacy-coordinate-plane"},
            {"legacy_id": "legacy-axis-point"},
            {"legacy_id": "legacy-coordinate-plane"},
        ]

        self.assertEqual(
            validator.duplicate_legacy_gap_ids(rows),
            ["legacy-coordinate-plane"],
        )

    def test_duplicate_legacy_resolution_labels_are_reported(self) -> None:
        rows = [
            {"candidate_label": "addition"},
            {"candidate_label": "ratio"},
            {"candidate_label": "addition"},
        ]

        self.assertEqual(
            validator.duplicate_legacy_resolution_labels(rows),
            ["addition"],
        )

    def test_legacy_resolution_candidate_count_reports_rows(self) -> None:
        rows = [
            {"candidate_label": "addition"},
            {"candidate_label": "ratio"},
        ]

        self.assertEqual(validator.legacy_resolution_candidate_count(rows), 2)

    def test_duplicate_legacy_integration_labels_are_reported(self) -> None:
        rows = [
            {"candidate_label": "addition"},
            {"candidate_label": "ratio"},
            {"candidate_label": "addition"},
        ]

        self.assertEqual(
            validator.duplicate_legacy_integration_labels(rows),
            ["addition"],
        )

    def test_legacy_integration_candidate_count_reports_rows(self) -> None:
        rows = [
            {"candidate_label": "addition", "integration_status": "stage_prerequisite_node"},
            {"candidate_label": "ratio", "integration_status": "stage_alias_review"},
        ]

        self.assertEqual(validator.legacy_integration_candidate_count(rows), 2)

    def test_duplicate_legacy_source_review_labels_are_reported(self) -> None:
        rows = [
            {"candidate_label": "addition"},
            {"candidate_label": "ratio"},
            {"candidate_label": "addition"},
        ]

        self.assertEqual(
            validator.duplicate_legacy_source_review_labels(rows),
            ["addition"],
        )

    def test_legacy_source_review_candidate_count_reports_rows(self) -> None:
        rows = [
            {"candidate_label": "addition", "review_status": "needs_official_prerequisite_confirmation"},
            {"candidate_label": "ratio", "review_status": "needs_alias_confirmation"},
        ]

        self.assertEqual(validator.legacy_source_review_candidate_count(rows), 2)

    def test_duplicate_legacy_evidence_scan_labels_are_reported(self) -> None:
        rows = [
            {"candidate_label": "addition"},
            {"candidate_label": "ratio"},
            {"candidate_label": "addition"},
        ]

        self.assertEqual(
            validator.duplicate_legacy_evidence_scan_labels(rows),
            ["addition"],
        )

    def test_legacy_evidence_scan_candidate_count_reports_rows(self) -> None:
        rows = [
            {"candidate_label": "addition", "evidence_signal": "target_source_refs_mention_candidate"},
            {"candidate_label": "ratio", "evidence_signal": "direct_legacy_unit_review_needed"},
        ]

        self.assertEqual(validator.legacy_evidence_scan_candidate_count(rows), 2)


if __name__ == "__main__":
    unittest.main()
