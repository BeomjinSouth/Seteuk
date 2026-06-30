# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 31
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 수와 연산
- unit: 공통 선수개념
- priority tier: low
- workplan score: 63
- concepts: 1
- edges touching unit: 14
- cross-unit edges: 14
- low confidence concepts: 1
- low confidence edges: 11

## Concept Type Distribution

| concept_type | count |
|---|---:|
| term | 1 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 1 |
| prerequisite_for | 5 |
| used_in | 8 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_num_ratio | 비 | term | official_dual_source | 단독 용어로서의 직접 출처는 아직 약하지만 정비례·반비례, 닮음비, 평행선 사이의 선분 길이의 비, 삼각비, 상대도수와 확률의 비율 표현에서 반복되는 공통 선수개념으로 분리했다. 연구보고서 p. 61, p. 172, p. 180, p. 181, p. 184는 비와 비율의 선수·평가 맥락을 보조하지만, 교과서 본문 또는 중학교 과정의 직접 근거 확인 전까지 낮은 신뢰도로 유지한다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_domain__contains__m1_num_ratio | 수와 연산 | contains | 비 | low | official_single_source |
| m1_num_ratio__prerequisite_for__m1_func_slope_ratio_formula | 비 | prerequisite_for | 기울기 계산식 | low | official_single_source |
| m1_num_rational_number__prerequisite_for__m1_num_ratio | 유리수 | prerequisite_for | 비 | low | official_single_source |
| m1_num_ratio__used_in__m1_data_relative_frequency | 비 | used_in | 상대도수 | low | official_dual_source |
| m1_num_ratio__used_in__m1_data_relative_frequency_calculation | 비 | used_in | 상대도수 구하기 | low | official_single_source |
| m1_num_ratio__used_in__m1_data_theoretical_probability | 비 | used_in | 경우의 수의 비율로서의 확률 | low | official_dual_source |
| m1_num_ratio__used_in__m1_geo_parallel_segment_ratio | 비 | used_in | 평행선 사이의 선분의 길이의 비 | low | official_dual_source |
| m1_num_ratio__used_in__m1_geo_similarity_ratio | 비 | used_in | 닮음비 | low | official_dual_source |
| m1_num_ratio__used_in__m1_geo_trigonometric_ratio | 비 | used_in | 삼각비 | low | official_dual_source |
| m1_num_ratio__used_in__m1_prop_direct_proportion | 비 | used_in | 정비례 | low | official_dual_source |
| m1_num_ratio__used_in__m1_prop_inverse_proportion | 비 | used_in | 반비례 | low | official_dual_source |
| m1_num_ratio__prerequisite_for__m1_data_probability_by_case_ratio | 비 | prerequisite_for | 경우의 수의 비율로 확률 구하기 | medium | official_dual_source |
| m1_num_ratio__prerequisite_for__m1_data_relative_frequency_calculation | 비 | prerequisite_for | 상대도수 구하기 | high | official_dual_source |
| m1_num_ratio__prerequisite_for__m1_geo_sector_proportional_reasoning | 비 | prerequisite_for | 중심각에 따른 부채꼴 비례 추론 | medium | official_dual_source |
