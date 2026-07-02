# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 28
- grade: 중2(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 피타고라스 정리
- priority tier: high
- workplan score: 122
- concepts: 23
- edges touching unit: 126
- cross-unit edges: 35
- low confidence concepts: 4
- low confidence edges: 12

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 4 |
| procedure | 9 |
| property | 3 |
| representation | 2 |
| term | 3 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 27 |
| contrasts_with | 6 |
| often_confused_with | 8 |
| prerequisite_for | 54 |
| related_to | 3 |
| represented_by | 2 |
| used_in | 26 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_pythagorean_converse_unsorted_sides | 가장 긴 변을 확인하지 않고 역을 적용하는 오류 | misconception_risk | official_dual_source | 공식 문서는 해당 오개념을 직접 제시하지 않는다. 피타고라스 정리의 역과 직각삼각형 판별 과정에서 발생 가능한 지도상 위험으로만 연결하고, 교과서 오답·평가 문항 근거 확인 전까지 low로 둔다. |
| m1_mis_pythagorean_hypotenuse_misidentification | 빗변을 가장 길지 않은 변으로 잘못 정하는 오류 | misconception_risk | official_dual_source | 공식 문서는 해당 오개념을 직접 제시하지 않는다. 피타고라스 정리 적용 과정에서 발생 가능한 지도상 위험으로만 연결하고, 교과서 오답·평가 문항 근거 확인 전까지 low로 둔다. |
| m1_mis_pythagorean_leg_subtraction | 한 직각변을 구할 때 제곱의 차를 쓰지 않는 오류 | misconception_risk | official_dual_source | 공식 문서는 해당 오개념을 직접 제시하지 않는다. 피타고라스 정리 적용 과정에서 발생 가능한 지도상 위험으로만 연결하고, 교과서 오답·평가 문항 근거 확인 전까지 low로 둔다. |
| m1_mis_pythagorean_non_right_triangle | 직각삼각형이 아닌 삼각형에 피타고라스 정리를 적용하는 오류 | misconception_risk | official_dual_source | 공식 문서는 해당 오개념을 직접 제시하지 않는다. 피타고라스 정리 적용 과정에서 발생 가능한 지도상 위험으로만 연결하고, 교과서 오답·평가 문항 근거 확인 전까지 low로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_geo_domain__contains__m1_geo_pythagorean_unit | 도형과 측정 | contains | 피타고라스 정리 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_geo_pythagorean_formula | 거듭제곱 | prerequisite_for | 피타고라스 정리의 식 표현 | medium | official_dual_source |
| m1_calc_power__prerequisite_for__m1_geo_pythagorean_triple_check | 거듭제곱 | prerequisite_for | 세 수가 피타고라스 관계를 만족하는지 확인하기 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_pythagorean_right_angle | 각 | prerequisite_for | 직각삼각형의 직각 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_right_triangle | 각 | prerequisite_for | 직각삼각형 | high | official_dual_source |
| m1_geo_area__prerequisite_for__m1_geo_pythagorean_area_dissection_justification | 넓이 | prerequisite_for | 넓이 분해로 피타고라스 정리 정당화하기 | medium | official_dual_source |
| m1_geo_area__prerequisite_for__m1_geo_pythagorean_square_area_relation | 넓이 | prerequisite_for | 세 변 위 정사각형 넓이 관계 | medium | official_dual_source |
| m1_geo_area__prerequisite_for__m1_geo_pythagorean_square_on_side | 넓이 | prerequisite_for | 변 위의 정사각형 | medium | official_dual_source |
| m1_geo_justification__prerequisite_for__m1_geo_pythagorean_area_dissection_justification | 정당화 | prerequisite_for | 넓이 분해로 피타고라스 정리 정당화하기 | medium | official_dual_source |
| m1_geo_justification__prerequisite_for__m1_geo_pythagorean_justification | 정당화 | prerequisite_for | 피타고라스 정리의 정당화 | high | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_pythagorean_converse_side_ordering | 길이 | prerequisite_for | 가장 긴 변을 빗변 후보로 정하기 | medium | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_pythagorean_hypotenuse | 길이 | prerequisite_for | 피타고라스 정리에서의 빗변 | medium | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_pythagorean_legs | 길이 | prerequisite_for | 직각삼각형의 두 직각변 | medium | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_pythagorean_square_on_side | 길이 | prerequisite_for | 변 위의 정사각형 | medium | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_pythagorean_triple_check | 길이 | prerequisite_for | 세 수가 피타고라스 관계를 만족하는지 확인하기 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_right_triangle_congruence_conditions | 직각삼각형 | prerequisite_for | 직각삼각형의 합동 조건 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_special_angles_30_45_60 | 직각삼각형 | prerequisite_for | 30도, 45도, 60도의 삼각비 | high | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trig_adjacent_side | 직각삼각형 | prerequisite_for | 기준각의 이웃변 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trig_distance_height_modeling | 직각삼각형 | prerequisite_for | 거리와 높이 문제를 직각삼각형으로 나타내기 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trig_hypotenuse | 직각삼각형 | prerequisite_for | 삼각비에서의 빗변 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trig_opposite_side | 직각삼각형 | prerequisite_for | 기준각의 대변 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trig_reference_angle | 직각삼각형 | prerequisite_for | 삼각비의 기준각 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trigonometric_ratio | 직각삼각형 | prerequisite_for | 삼각비 | high | official_dual_source |
| m1_geo_square__prerequisite_for__m1_geo_pythagorean_square_on_side | 정사각형 | prerequisite_for | 변 위의 정사각형 | medium | official_dual_source |
| m1_geo_triangle_quadrilateral_unit__prerequisite_for__m1_geo_pythagorean_unit | 삼각형과 사각형의 성질 | prerequisite_for | 피타고라스 정리 | high | official_dual_source |
| m1_geo_triangle_quadrilateral_unit__prerequisite_for__m1_geo_right_triangle | 삼각형과 사각형의 성질 | prerequisite_for | 직각삼각형 | high | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_geo_pythagorean_converse_side_ordering | 정수와 유리수의 대소 관계 | prerequisite_for | 가장 긴 변을 빗변 후보로 정하기 | medium | official_dual_source |
| m1_num_square_root__prerequisite_for__m1_geo_pythagorean_hypotenuse_length | 제곱근 | prerequisite_for | 피타고라스 정리로 빗변의 길이 구하기 | high | official_dual_source |
| m1_num_square_root__prerequisite_for__m1_geo_pythagorean_leg_length | 제곱근 | prerequisite_for | 피타고라스 정리로 한 직각변의 길이 구하기 | medium | official_dual_source |
| m1_num_square_root__prerequisite_for__m1_geo_pythagorean_theorem | 제곱근 | prerequisite_for | 피타고라스 정리 | high | official_dual_source |
| m1_geo_length__used_in__m1_geo_right_triangle_judgement | 길이 | used_in | 세 변의 길이로 직각삼각형 판별 | medium | official_dual_source |
| m1_geo_proof__used_in__m1_geo_pythagorean_justification | 증명 | used_in | 피타고라스 정리의 정당화 | medium | official_dual_source |
| m1_geo_triangle__used_in__m1_geo_right_triangle | 삼각형 | used_in | 직각삼각형 | medium | official_dual_source |
| m1_geo_pythagorean_unit__related_to__m1_geo_trig_unit | 피타고라스 정리 | related_to | 삼각비 | medium | official_dual_source |
| m1_geo_similarity_unit__related_to__m1_geo_pythagorean_unit | 도형의 닮음 | related_to | 피타고라스 정리 | medium | official_dual_source |
