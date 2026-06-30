# Equivalence Alias Audit

This generated audit separates aliases, explicit equivalent edges, repeated labels, and official terms that map to multiple concept nodes.

## Summary

- audit rows: 674

## Record Types

| record_type | count |
|---|---:|
| concept_alias | 650 |
| duplicate_label | 12 |
| equivalent_edge | 3 |
| official_term_multi_match | 9 |

## Recommended Actions

| recommended_action | count |
|---|---:|
| keep_edge_and_confirm_textbook_usage | 3 |
| preserve_alias_and_check_textbook_wording | 650 |
| review_term_scope_and_preserve_alias_or_split_reason | 9 |
| review_unit_vs_micro_concept_split_before_equivalent_edge | 12 |

## Review Rows

| type | label | alias_or_term | status | action | confidence | source refs |
|---|---|---|---|---|---|---:|
| duplicate_label | 교점 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 5 |
| duplicate_label | 대푯값 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 7 |
| duplicate_label | 산포도 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 5 |
| duplicate_label | 삼각비 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 7 |
| duplicate_label | 소인수분해 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 8 |
| duplicate_label | 수직선 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 6 |
| duplicate_label | 연립일차방정식 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 5 |
| duplicate_label | 이차방정식 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 8 |
| duplicate_label | 일차방정식 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 8 |
| duplicate_label | 일차부등식 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 5 |
| duplicate_label | 피타고라스 정리 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 5 |
| duplicate_label | 해를 문제 상황에 맞게 해석하기 |  | same_label_multiple_nodes | review_unit_vs_micro_concept_split_before_equivalent_edge | medium | 5 |
| equivalent_edge | 양의 정수 = 자연수 |  | explicit_equivalent_to_edge | keep_edge_and_confirm_textbook_usage | medium | 5 |
| equivalent_edge | 이차방정식의 해 = 근 |  | explicit_equivalent_to_edge | keep_edge_and_confirm_textbook_usage | medium | 2 |
| equivalent_edge | 해 = 근 |  | explicit_equivalent_to_edge | keep_edge_and_confirm_textbook_usage | medium | 2 |
| official_term_multi_match | 교점 | 교점 | official_term_maps_to_multiple_concepts | review_term_scope_and_preserve_alias_or_split_reason | medium | 0 |
| official_term_multi_match | 대푯값 | 대푯값 | official_term_maps_to_multiple_concepts | review_term_scope_and_preserve_alias_or_split_reason | medium | 0 |
| official_term_multi_match | 산포도 | 산포도 | official_term_maps_to_multiple_concepts | review_term_scope_and_preserve_alias_or_split_reason | medium | 0 |
| official_term_multi_match | 삼각비 | 삼각비 | official_term_maps_to_multiple_concepts | review_term_scope_and_preserve_alias_or_split_reason | medium | 0 |
| official_term_multi_match | 소인수분해 | 소인수분해 | official_term_maps_to_multiple_concepts | review_term_scope_and_preserve_alias_or_split_reason | medium | 0 |
| official_term_multi_match | 수직선 | 수직선 | official_term_maps_to_multiple_concepts | review_term_scope_and_preserve_alias_or_split_reason | medium | 0 |
| official_term_multi_match | 이차방정식 | 이차방정식 | official_term_maps_to_multiple_concepts | review_term_scope_and_preserve_alias_or_split_reason | medium | 0 |
| official_term_multi_match | 일차방정식 | 일차방정식 | official_term_maps_to_multiple_concepts | review_term_scope_and_preserve_alias_or_split_reason | medium | 0 |
| official_term_multi_match | 피타고라스 정리 | 피타고라스 정리 | official_term_maps_to_multiple_concepts | review_term_scope_and_preserve_alias_or_split_reason | medium | 0 |
