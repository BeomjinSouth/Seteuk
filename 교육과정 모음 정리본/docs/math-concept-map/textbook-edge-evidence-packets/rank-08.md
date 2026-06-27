# Textbook Edge Evidence Packet

This generated packet is the unit-level worksheet for adding textbook-grounded relationship evidence.

## Target Unit

- rank: 8
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 일차방정식
- priority tier: highest
- priority score: 41
- edges in packet: 96
- cross-unit edges: 40
- low confidence edges: 19

## Relationship Evidence Slots

| edge_id | scope | source | relationship | target | confidence | required evidence | focus | source refs |
|---|---|---|---|---|---|---|---|---:|
| m1_eq_unit__contains__m1_mis_expression_equation | intra_unit | 일차방정식 | contains | 식과 방정식 혼동 | low | structure_ref;textbook_page_refs;extraction_notes | Find textbook structure evidence for the containment relation. | 2 |
| m1_eq_unit__contains__m1_mis_solution_check | intra_unit | 일차방정식 | contains | 구한 해의 상황 적합성 확인 누락 | low | structure_ref;textbook_page_refs;extraction_notes | Find textbook structure evidence for the containment relation. | 2 |
| m1_eq_unit__contains__m1_mis_transposition_sign | intra_unit | 일차방정식 | contains | 이항할 때 부호를 잘못 바꾸는 오류 | low | structure_ref;textbook_page_refs;extraction_notes | Find textbook structure evidence for the containment relation. | 3 |
| m1_eq_equality__prerequisite_for__m1_mis_expression_equation | intra_unit | 등식 | prerequisite_for | 식과 방정식 혼동 | low | prerequisite_ref;textbook_page_refs;extraction_notes | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_equality_properties__prerequisite_for__m1_mis_transposition_sign | intra_unit | 등식의 성질 | prerequisite_for | 이항할 때 부호를 잘못 바꾸는 오류 | low | prerequisite_ref;textbook_page_refs;extraction_notes | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_eq_equation__prerequisite_for__m1_mis_expression_equation | intra_unit | 방정식 | prerequisite_for | 식과 방정식 혼동 | low | prerequisite_ref;textbook_page_refs;extraction_notes | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_solution_check__prerequisite_for__m1_mis_solution_check | intra_unit | 해의 확인 | prerequisite_for | 구한 해의 상황 적합성 확인 누락 | low | prerequisite_ref;textbook_page_refs;extraction_notes | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_transposition__prerequisite_for__m1_mis_transposition_sign | intra_unit | 이항 | prerequisite_for | 이항할 때 부호를 잘못 바꾸는 오류 | low | prerequisite_ref;textbook_page_refs;extraction_notes | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_mis_expression_equation__often_confused_with__m1_eq_equality | intra_unit | 식과 방정식 혼동 | often_confused_with | 등식 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 2 |
| m1_mis_expression_equation__often_confused_with__m1_eq_equation | intra_unit | 식과 방정식 혼동 | often_confused_with | 방정식 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 2 |
| m1_mis_solution_check__often_confused_with__m1_eq_modeling_linear_equation | intra_unit | 구한 해의 상황 적합성 확인 누락 | often_confused_with | 일차방정식 세우기 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 2 |
| m1_mis_solution_check__often_confused_with__m1_eq_solution_check | intra_unit | 구한 해의 상황 적합성 확인 누락 | often_confused_with | 해의 확인 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 2 |
| m1_mis_transposition_sign__often_confused_with__m1_eq_solving_linear_equation | intra_unit | 이항할 때 부호를 잘못 바꾸는 오류 | often_confused_with | 일차방정식 풀기 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 3 |
| m1_mis_transposition_sign__often_confused_with__m1_eq_transposition | intra_unit | 이항할 때 부호를 잘못 바꾸는 오류 | often_confused_with | 이항 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 3 |
| m1_eq_solution__prerequisite_for__m1_mis_ineq_solution_single_value | cross_unit | 해 | prerequisite_for | 부등식의 해를 한 값으로만 이해하는 오류 | low | prerequisite_ref;textbook_page_refs;extraction_notes | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_repr_expression__prerequisite_for__m1_mis_expression_equation | cross_unit | 식 | prerequisite_for | 식과 방정식 혼동 | low | prerequisite_ref;textbook_page_refs;extraction_notes | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_mis_expression_equation__often_confused_with__m1_repr_expression | cross_unit | 식과 방정식 혼동 | often_confused_with | 식 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 2 |
| m1_mis_ineq_solution_single_value__often_confused_with__m1_eq_solution | cross_unit | 부등식의 해를 한 값으로만 이해하는 오류 | often_confused_with | 해 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 2 |
| m1_mis_system_one_equation_only__often_confused_with__m1_eq_solution | cross_unit | 연립방정식의 해를 한 방정식만 만족해도 된다고 보는 오류 | often_confused_with | 해 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 2 |
| m1_eq_both_sides__contains__m1_eq_left_side | intra_unit | 양변 | contains | 좌변 | medium | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 1 |
| m1_eq_both_sides__contains__m1_eq_right_side | intra_unit | 양변 | contains | 우변 | medium | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 1 |
| m1_eq_equality__contains__m1_eq_both_sides | intra_unit | 등식 | contains | 양변 | medium | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 1 |
| m1_eq_equality__contains__m1_eq_left_side | intra_unit | 등식 | contains | 좌변 | medium | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 1 |
| m1_eq_equality__contains__m1_eq_right_side | intra_unit | 등식 | contains | 우변 | medium | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 1 |
| m1_eq_equation__contains__m1_eq_solution | intra_unit | 방정식 | contains | 해 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_eq_equation__contains__m1_eq_unknown | intra_unit | 방정식 | contains | 미지수 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 2 |
| m1_eq_solution__contains__m1_eq_root | intra_unit | 해 | contains | 근 | medium | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 2 |
| m1_eq_solving_linear_equation__contains__m1_eq_transposition | intra_unit | 일차방정식 풀기 | contains | 이항 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 2 |
| m1_eq_unit__contains__m1_eq_equality | intra_unit | 일차방정식 | contains | 등식 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_eq_unit__contains__m1_eq_equality_properties | intra_unit | 일차방정식 | contains | 등식의 성질 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 2 |
| m1_eq_unit__contains__m1_eq_equation | intra_unit | 일차방정식 | contains | 방정식 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_eq_unit__contains__m1_eq_identity | intra_unit | 일차방정식 | contains | 항등식 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 2 |
| m1_eq_unit__contains__m1_eq_linear_equation | intra_unit | 일차방정식 | contains | 일차방정식 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_eq_unit__contains__m1_eq_modeling_linear_equation | intra_unit | 일차방정식 | contains | 일차방정식 세우기 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 2 |
| m1_eq_unit__contains__m1_eq_solution_check | intra_unit | 일차방정식 | contains | 해의 확인 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_eq_unit__contains__m1_eq_solving_linear_equation | intra_unit | 일차방정식 | contains | 일차방정식 풀기 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_eq_equality__prerequisite_for__m1_eq_equality_properties | intra_unit | 등식 | prerequisite_for | 등식의 성질 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_equality__prerequisite_for__m1_eq_equation | intra_unit | 등식 | prerequisite_for | 방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_equality__prerequisite_for__m1_eq_identity | intra_unit | 등식 | prerequisite_for | 항등식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_equality_properties__prerequisite_for__m1_eq_solving_linear_equation | intra_unit | 등식의 성질 | prerequisite_for | 일차방정식 풀기 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_eq_equality_properties__prerequisite_for__m1_eq_transposition | intra_unit | 등식의 성질 | prerequisite_for | 이항 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_equation__prerequisite_for__m1_eq_linear_equation | intra_unit | 방정식 | prerequisite_for | 일차방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_eq_equation__prerequisite_for__m1_eq_solution | intra_unit | 방정식 | prerequisite_for | 해 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_eq_linear_equation__prerequisite_for__m1_eq_modeling_linear_equation | intra_unit | 일차방정식 | prerequisite_for | 일차방정식 세우기 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_linear_equation__prerequisite_for__m1_eq_solving_linear_equation | intra_unit | 일차방정식 | prerequisite_for | 일차방정식 풀기 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_eq_solution__prerequisite_for__m1_eq_solution_check | intra_unit | 해 | prerequisite_for | 해의 확인 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_eq_unknown__prerequisite_for__m1_eq_equation | intra_unit | 미지수 | prerequisite_for | 방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_eq_modeling_linear_equation__represented_by__m1_eq_linear_equation | intra_unit | 일차방정식 세우기 | represented_by | 일차방정식 | high | representation_ref;textbook_page_refs | Find textbook representation evidence such as a table, graph, expression, or diagram. | 2 |
| m1_eq_both_sides__used_in__m1_eq_equality_properties | intra_unit | 양변 | used_in | 등식의 성질 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 3 |
| m1_eq_equality__used_in__m1_eq_equality_properties | intra_unit | 등식 | used_in | 등식의 성질 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_eq_equality_properties__used_in__m1_eq_solving_linear_equation | intra_unit | 등식의 성질 | used_in | 일차방정식 풀기 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 3 |
| m1_eq_linear_equation__used_in__m1_eq_solving_linear_equation | intra_unit | 일차방정식 | used_in | 일차방정식 풀기 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_eq_modeling_linear_equation__used_in__m1_eq_solving_linear_equation | intra_unit | 일차방정식 세우기 | used_in | 일차방정식 풀기 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_eq_solution_check__used_in__m1_eq_modeling_linear_equation | intra_unit | 해의 확인 | used_in | 일차방정식 세우기 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_eq_solving_linear_equation__used_in__m1_eq_solution_check | intra_unit | 일차방정식 풀기 | used_in | 해의 확인 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_eq_transposition__used_in__m1_eq_solving_linear_equation | intra_unit | 이항 | used_in | 일차방정식 풀기 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 3 |
| m1_eq_unknown__used_in__m1_eq_equation | intra_unit | 미지수 | used_in | 방정식 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_eq_equation__contrasts_with__m1_eq_identity | intra_unit | 방정식 | contrasts_with | 항등식 | high | contrast_ref;textbook_page_refs | Find textbook wording or examples that distinguish the two concepts. | 2 |
| m1_eq_left_side__contrasts_with__m1_eq_right_side | intra_unit | 좌변 | contrasts_with | 우변 | medium | contrast_ref;textbook_page_refs | Find textbook wording or examples that distinguish the two concepts. | 1 |
| m1_eq_unknown__contrasts_with__m1_eq_solution | intra_unit | 미지수 | contrasts_with | 해 | medium | contrast_ref;textbook_page_refs | Find textbook wording or examples that distinguish the two concepts. | 2 |
| m1_eq_solution__equivalent_to__m1_eq_root | intra_unit | 해 | equivalent_to | 근 | medium | related_ref;textbook_page_refs | Find textbook wording that treats the two concepts or labels as equivalent in context. | 2 |
| m1_eq_equality_properties__prerequisite_for__m1_ineq_compare_equality_properties | cross_unit | 등식의 성질 | prerequisite_for | 등식의 성질과 부등식의 성질 비교 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_equality_properties__prerequisite_for__m1_ineq_properties | cross_unit | 등식의 성질 | prerequisite_for | 부등식의 성질 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_equation__prerequisite_for__m1_quad_eq_quadratic_equation | cross_unit | 방정식 | prerequisite_for | 이차방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 4 |
| m1_eq_equation__prerequisite_for__m1_system_simultaneous_equations | cross_unit | 방정식 | prerequisite_for | 연립방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_linear_equation__prerequisite_for__m1_system_two_variable_linear_equation | cross_unit | 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_solution__prerequisite_for__m1_quad_eq_solution | cross_unit | 해 | prerequisite_for | 이차방정식의 해 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_eq_solution__prerequisite_for__m1_system_solution | cross_unit | 해 | prerequisite_for | 연립일차방정식의 해 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_solution_check__prerequisite_for__m1_quad_eq_modeling | cross_unit | 해의 확인 | prerequisite_for | 이차방정식 활용 문제 해결 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_eq_solving_linear_equation__prerequisite_for__m1_system_solving | cross_unit | 일차방정식 풀기 | prerequisite_for | 연립일차방정식 풀기 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_unit__prerequisite_for__m1_coord_graph_unit | cross_unit | 일차방정식 | prerequisite_for | 좌표평면과 그래프 | medium | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 4 |
| m1_eq_unit__prerequisite_for__m1_func_eq_relation_unit | cross_unit | 일차방정식 | prerequisite_for | 일차함수와 일차방정식의 관계 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_unit__prerequisite_for__m1_func_unit | cross_unit | 일차방정식 | prerequisite_for | 일차함수와 그 그래프 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_eq_unit__prerequisite_for__m1_ineq_unit | cross_unit | 일차방정식 | prerequisite_for | 일차부등식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 5 |
| m1_eq_unit__prerequisite_for__m1_quad_eq_unit | cross_unit | 일차방정식 | prerequisite_for | 이차방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 4 |
| m1_eq_unit__prerequisite_for__m1_system_unit | cross_unit | 일차방정식 | prerequisite_for | 연립일차방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_eq_unknown__prerequisite_for__m1_system_two_variable_linear_equation | cross_unit | 미지수 | prerequisite_for | 미지수가 2개인 일차방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_expr_letter__prerequisite_for__m1_eq_unknown | cross_unit | 문자 | prerequisite_for | 미지수 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_expr_linear_expression__prerequisite_for__m1_eq_linear_equation | cross_unit | 일차식 | prerequisite_for | 일차방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_expr_linear_expression__prerequisite_for__m1_eq_unit | cross_unit | 일차식 | prerequisite_for | 일차방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_expr_literal_expression__prerequisite_for__m1_eq_modeling_linear_equation | cross_unit | 문자를 사용한 식 | prerequisite_for | 일차방정식 세우기 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_expr_polynomial__prerequisite_for__m1_eq_equation | cross_unit | 다항식 | prerequisite_for | 방정식 | medium | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_expr_substitution__prerequisite_for__m1_eq_solution | cross_unit | 대입 | prerequisite_for | 해 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_expr_substitution__prerequisite_for__m1_eq_solution_check | cross_unit | 대입 | prerequisite_for | 해의 확인 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_expr_term__prerequisite_for__m1_eq_transposition | cross_unit | 항 | prerequisite_for | 이항 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_expr_unit__prerequisite_for__m1_eq_unit | cross_unit | 문자의 사용과 식 | prerequisite_for | 일차방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 4 |
| m1_repr_expression__prerequisite_for__m1_eq_equality | cross_unit | 식 | prerequisite_for | 등식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_eq_equality_properties__used_in__m1_ineq_compare_equality_properties | cross_unit | 등식의 성질 | used_in | 등식의 성질과 부등식의 성질 비교 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_expr_substitution__used_in__m1_eq_solution_check | cross_unit | 대입 | used_in | 해의 확인 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 3 |
| m1_quad_eq_solving__used_in__m1_eq_solution_check | cross_unit | 이차방정식 풀기 | used_in | 해의 확인 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_eq_unknown__contrasts_with__m1_term_variable | cross_unit | 미지수 | contrasts_with | 변수 | medium | contrast_ref;textbook_page_refs | Find textbook wording or examples that distinguish the two concepts. | 5 |
| m1_ineq_inequality__contrasts_with__m1_eq_equality | cross_unit | 부등식 | contrasts_with | 등식 | medium | contrast_ref;textbook_page_refs | Find textbook wording or examples that distinguish the two concepts. | 5 |
| m1_ineq_inequality__contrasts_with__m1_eq_equation | cross_unit | 부등식 | contrasts_with | 방정식 | high | contrast_ref;textbook_page_refs | Find textbook wording or examples that distinguish the two concepts. | 2 |
| m1_ineq_solution__contrasts_with__m1_eq_solution | cross_unit | 부등식의 해 | contrasts_with | 해 | medium | contrast_ref;textbook_page_refs | Find textbook wording or examples that distinguish the two concepts. | 5 |
| m1_quad_eq_solution__equivalent_to__m1_eq_root | cross_unit | 이차방정식의 해 | equivalent_to | 근 | medium | related_ref;textbook_page_refs | Find textbook wording that treats the two concepts or labels as equivalent in context. | 2 |
| m1_calc_unit__related_to__m1_eq_unit | cross_unit | 식의 계산 | related_to | 일차방정식 | medium | related_ref;textbook_page_refs | Find textbook wording or examples that justify keeping these concepts linked. | 10 |

## Textbook Edge Evidence Fields

- structure_ref
- prerequisite_ref
- representation_ref
- procedure_ref
- contrast_ref
- misconception_ref
- problem_pattern_ref
- related_ref
- textbook_page_refs
- extraction_notes
