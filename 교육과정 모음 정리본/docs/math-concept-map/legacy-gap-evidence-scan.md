# Legacy Gap Evidence Scan

This generated scan checks whether legacy-gap candidates appear in existing target source refs before any concept-map integration.

## Summary

- candidates: 6
- target_source_refs_mention_candidate: 4
- alias_source_refs_mention_candidate: 1
- target_source_refs_do_not_mention_candidate: 0
- direct_legacy_unit_review_needed: 1

## Evidence Signals

| label | signal | mentions | target refs | action |
|---|---|---:|---:|---|
| 길이 | target_source_refs_mention_candidate | 6 | 10 | Review matching source refs before creating prereq_length or prerequisite edges. |
| 넓이 | target_source_refs_mention_candidate | 8 | 8 | Review matching source refs before creating prereq_area or prerequisite edges. |
| 도형 | target_source_refs_mention_candidate | 21 | 51 | Review matching source refs before creating prereq_figure or prerequisite edges. |
| 비 | direct_legacy_unit_review_needed | 0 | 0 | Inspect legacy units directly before proposing a concept or edge. |
| 삼각형 | target_source_refs_mention_candidate | 26 | 32 | Review matching source refs before creating prereq_triangle or prerequisite edges. |
| 피타고라스 | alias_source_refs_mention_candidate | 8 | 10 | Review alias wording against matching source refs before updating aliases. |
