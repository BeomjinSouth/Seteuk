# Research Report Concept Signal

This generated audit scans the KICE math achievement-level research report for current concept labels and aliases.
Rows are candidate signals only; inspect the local page context before changing concept confidence or source_refs.

## Summary

- matched concepts: 239

## Confidence

| confidence | matched concepts |
|---|---:|
| high | 207 |
| low | 1 |
| medium | 31 |

## Recommended Actions

| action | matched concepts |
|---|---:|
| inspect_research_report_context_before_confidence_change | 1 |
| inspect_research_report_context_before_source_ref_upgrade | 31 |
| use_as_supplemental_trace_only | 207 |

## Highest Priority Signals

| concept_id | label | unit | confidence | matches | pages | status | action |
|---|---|---|---|---:|---|---|---|
| m1_num_ratio | 비 | 공통 선수개념 | low | 77 | 61; 91; 172; 177; 180; 181; 183; 184; 185; 187; 188; 192; 194; 195; 208; 209; 260; 262 | research_report_signal | inspect_research_report_context_before_confidence_change |
| m1_geo_figure | 도형 | 도형과 측정 | medium | 433 | 9; 12; 23; 26; 45; 46; 60; 61; 62; 76; 77; 78; 79; 80; 84; 85; 86; 103; 108; 109; 110; 111; 112; 113 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_geo_triangle | 삼각형 | 도형과 측정 | medium | 367 | 60; 62; 77; 78; 79; 80; 84; 85; 86; 103; 108; 109; 111; 112; 113; 114; 115; 118; 119; 120; 131; 135; 138; 139 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_num_addition | 덧셈 | 정수와 유리수 | medium | 190 | 26; 47; 48; 55; 56; 57; 58; 59; 60; 101; 105; 107; 108; 109; 110; 125; 127; 128; 129; 132; 133; 134; 136; 137 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_num_subtraction | 뺄셈 | 정수와 유리수 | medium | 184 | 26; 47; 48; 55; 56; 57; 58; 59; 60; 101; 105; 107; 108; 109; 110; 125; 127; 128; 129; 132; 133; 134; 136; 137 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_geo_length | 길이 | 도형과 측정 | medium | 164 | 62; 77; 78; 79; 80; 82; 104; 105; 108; 109; 110; 133; 138; 139; 144; 159; 205; 213; 222; 224; 225; 231; 235; 236 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_num_multiplication | 곱셈 | 정수와 유리수 | medium | 136 | 26; 47; 48; 54; 57; 58; 59; 61; 102; 107; 126; 127; 136; 137; 141; 165; 168; 170; 171; 179; 180; 212; 213; 216 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_geo_area | 넓이 | 도형과 측정 | medium | 129 | 62; 77; 78; 79; 80; 104; 108; 109; 175; 176; 181; 182; 222; 224; 225; 235; 236; 237; 238; 242; 244; 247; 263; 269 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_num_division | 나눗셈 | 정수와 유리수 | medium | 81 | 26; 57; 58; 59; 126; 127; 136; 137; 168; 170; 171; 179; 180; 212; 213; 216; 232; 233; 234 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_prop_inverse_proportion | 반비례 | 좌표평면과 그래프 | medium | 54 | 57; 58; 59; 215; 232; 233; 234 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_geo_pyramid | 뿔 모양 입체도형 | 입체도형의 성질 | medium | 51 | 174; 181; 182; 263; 264; 265 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_geo_prism | 기둥 모양 입체도형 | 입체도형의 성질 | medium | 47 | 103; 108; 109; 174; 181; 182; 263; 264 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_func_intersection_point | 교점 | 일차함수와 일차방정식의 관계 | medium | 36 | 57; 58; 219; 232; 233; 234; 254 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_num_multiple | 배수 | 소인수분해 | medium | 35 | 13; 26; 169; 179; 180; 211; 230; 231 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_num_divisor | 약수 | 소인수분해 | medium | 34 | 13; 26; 169; 179; 180; 211; 230; 231 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_geo_correspondence | 도형의 대응 | 도형의 닮음 | medium | 25 | 5; 12; 22; 24; 54; 75; 76; 84; 171; 173; 180; 181 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_data_mean | 평균 | 대푯값 | medium | 24 | 91; 177; 183; 186; 187 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_calc_expansion | 전개 | 식의 계산 | medium | 20 | 173; 174; 181; 182; 219 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_geo_solid_net | 전개도 | 입체도형의 성질 | medium | 19 | 173; 174; 181; 182 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_geo_diagonal | 대각선 | 평면도형의 성질 | medium | 14 | 78; 213; 222; 231; 235; 236; 237; 238 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_data_or_cases | 사건 A 또는 사건 B가 일어나는 경우의 수 | 경우의 수와 확률 | medium | 12 | 228; 240; 266; 267; 268 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_data_and_cases | 사건 A와 사건 B가 동시에 일어나는 경우의 수 | 경우의 수와 확률 | medium | 11 | 228; 240; 266; 267; 268 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_quad_eq_quadratic_term | 이차항 | 이차방정식 | medium | 6 | 58; 59; 220; 234; 235 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_eq_both_sides | 양변 | 일차방정식 | medium | 4 | 98; 217 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_data_and_probability | 사건 A와 사건 B가 동시에 일어날 확률 | 경우의 수와 확률 | medium | 4 | 228; 260 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_geo_quadrilateral_relationship | 여러 가지 사각형 사이의 관계 | 삼각형과 사각형의 성질 | medium | 3 | 235; 236; 237 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_num_unit_square_diagonal | 한 변의 길이가 1인 정사각형의 대각선 | 제곱근과 실수 | medium | 3 | 213; 231 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_geo_pythagorean_converse | 피타고라스 정리의 역 | 피타고라스 정리 | medium | 2 | 269 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_geo_solid_cross_section | 입체도형의 단면 | 입체도형의 성질 | medium | 1 | 265 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_factor_quadratic_expression | 이차식 | 다항식의 곱셈과 인수분해 | medium | 1 | 219 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_func_intersection_count | 교점의 개수 | 일차함수와 일차방정식의 관계 | medium | 1 | 219 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_data_or_probability | 사건 A 또는 사건 B가 일어날 확률 | 경우의 수와 확률 | medium | 1 | 228 | research_report_signal | inspect_research_report_context_before_source_ref_upgrade |
| m1_graph_graph | 그래프 | 좌표평면과 그래프 | high | 563 | 12; 22; 45; 54; 57; 58; 59; 61; 62; 77; 79; 87; 88; 89; 90; 106; 110; 135; 140; 177; 183; 184; 186; 190 | research_report_signal | use_as_supplemental_trace_only |
| m1_data_dataset | 자료 | 자료와 가능성 | high | 390 | 2; 6; 9; 12; 13; 14; 21; 22; 23; 24; 26; 45; 46; 60; 61; 62; 76; 77; 78; 79; 80; 81; 83; 88 | research_report_signal | use_as_supplemental_trace_only |
| m1_func_function | 함수 | 일차함수와 그 그래프 | high | 357 | 54; 57; 58; 59; 62; 87; 88; 89; 90; 218; 219; 220; 232; 233; 234; 235; 242; 243; 244; 245; 246; 252; 253; 254 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_quadrilateral | 사각형 | 삼각형과 사각형의 성질 | high | 242 | 60; 77; 78; 79; 80; 84; 85; 86; 103; 108; 109; 111; 112; 115; 116; 117; 118; 119; 120; 132; 135; 138; 139; 141 | research_report_signal | use_as_supplemental_trace_only |
| m1_num_prime_number | 소수 | 소인수분해 | high | 238 | 26; 27; 48; 60; 61; 84; 90; 96; 114; 117; 120; 124; 128; 129; 136; 137; 141; 145; 150; 151; 153; 158; 161; 164 | research_report_signal | use_as_supplemental_trace_only |
| m1_func_linear_function | 일차함수 | 일차함수와 그 그래프 | high | 211 | 54; 57; 58; 59; 62; 87; 88; 89; 90; 218; 219; 232; 233; 234; 235; 242; 252; 253; 254; 255; 256; 257; 258; 259 | research_report_signal | use_as_supplemental_trace_only |
| m1_func_linear_graph | 일차함수의 그래프 | 일차함수와 그 그래프 | high | 172 | 54; 57; 58; 59; 87; 88; 89; 90; 218; 219; 220; 232; 233; 234; 235; 242; 252; 253; 254; 255; 256; 257; 258 | research_report_signal | use_as_supplemental_trace_only |
| m1_num_integer | 정수 | 정수와 유리수 | high | 163 | 5; 6; 7; 9; 12; 13; 14; 15; 16; 19; 20; 21; 22; 23; 24; 25; 26; 27; 29; 31; 33; 35; 37; 39 | research_report_signal | use_as_supplemental_trace_only |
| m1_eq_equation | 방정식 | 일차방정식 | high | 129 | 45; 54; 55; 56; 57; 58; 59; 214; 217; 219; 220; 232; 233; 234; 235 | research_report_signal | use_as_supplemental_trace_only |
| m1_data_event | 사건 | 경우의 수와 확률 | high | 119 | 62; 79; 80; 178; 183; 228; 239; 240; 241; 242; 260; 262; 266; 267; 268 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_similarity_unit | 도형의 닮음 | 도형의 닮음 | high | 106 | 77; 78; 79; 80; 224; 235; 236; 237; 238; 263; 265 | research_report_signal | use_as_supplemental_trace_only |
| m1_num_natural_number | 자연수 | 소인수분해 | high | 101 | 26; 27; 48; 49; 50; 51; 127; 136; 137; 165; 168; 170; 171; 179; 180; 209; 211; 213; 230; 231; 244 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_pythagorean_unit | 피타고라스 정리 | 피타고라스 정리 | high | 97 | 62; 77; 78; 79; 80; 225; 235; 236; 237; 238; 242; 269; 270; 271 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_pythagorean_theorem | 피타고라스 정리 | 피타고라스 정리 | high | 97 | 62; 77; 78; 79; 80; 225; 235; 236; 237; 238; 242; 269; 270; 271 | research_report_signal | use_as_supplemental_trace_only |
| m1_eq_equality | 등식 | 일차방정식 | high | 96 | 45; 54; 55; 56; 57; 58; 59; 214; 217; 232; 233; 234; 235 | research_report_signal | use_as_supplemental_trace_only |
| m1_data_probability | 확률 | 경우의 수와 확률 | high | 92 | 62; 77; 78; 79; 80; 228; 239; 240; 241; 242; 260; 261; 262 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_plane | 평면 | 기본 도형 | high | 84 | 12; 54; 60; 77; 78; 84; 103; 109; 110; 112; 130; 138; 139; 141; 154; 156; 175; 181; 182; 215; 221; 222; 224; 235 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_volume | 부피 | 입체도형의 성질 | high | 83 | 62; 77; 79; 80; 176; 177; 181; 182; 222; 224; 235; 236; 237; 238; 242; 263; 264; 265 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_similarity | 닮음 | 도형의 닮음 | high | 80 | 77; 78; 79; 80; 224; 235; 236; 237; 238; 263; 265 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_trig_unit | 삼각비 | 삼각비 | high | 79 | 62; 77; 78; 79; 225; 235; 236; 237; 238; 242; 247; 248; 250 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_trigonometric_ratio | 삼각비 | 삼각비 | high | 79 | 62; 77; 78; 79; 225; 235; 236; 237; 238; 242; 247; 248; 250 | research_report_signal | use_as_supplemental_trace_only |
| m1_expr_polynomial | 다항식 | 문자의 사용과 식 | high | 77 | 54; 55; 57; 58; 59; 214; 216; 219; 232; 233; 234; 235 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_polygon | 다각형 | 평면도형의 성질 | high | 76 | 61; 78; 79; 132; 138; 139; 141; 156; 157; 158; 175; 222; 227; 235; 236; 237; 238; 239; 240; 241 | research_report_signal | use_as_supplemental_trace_only |
| m1_num_rational_number | 유리수 | 정수와 유리수 | high | 73 | 26; 27; 45; 48; 211; 212; 213; 230; 231; 232 | research_report_signal | use_as_supplemental_trace_only |
| m1_ineq_inequality | 부등식 | 일차부등식 | high | 71 | 45; 54; 57; 58; 59; 217; 232; 233; 234; 235 | research_report_signal | use_as_supplemental_trace_only |
| m1_data_frequency | 도수 | 도수분포표와 상대도수 | high | 70 | 77; 79; 227; 228; 231; 235; 239; 240; 241 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_justification | 정당화 | 삼각형과 사각형의 성질 | high | 64 | 21; 22; 43; 45; 62; 77; 78; 79; 80; 223; 225; 226; 235; 236; 237; 242; 269 | research_report_signal | use_as_supplemental_trace_only |
| m1_expr_letter | 문자 | 문자의 사용과 식 | high | 62 | 45; 54; 55; 56; 57; 58; 59; 154; 214; 232; 233; 234; 235; 272 | research_report_signal | use_as_supplemental_trace_only |
| m1_eq_unit | 일차방정식 | 일차방정식 | high | 62 | 54; 55; 56; 57; 58; 59; 214; 217; 219; 232; 233; 234; 235 | research_report_signal | use_as_supplemental_trace_only |
| m1_eq_linear_equation | 일차방정식 | 일차방정식 | high | 62 | 54; 55; 56; 57; 58; 59; 214; 217; 219; 232; 233; 234; 235 | research_report_signal | use_as_supplemental_trace_only |
| m1_func_two_quantity_relation | 두 양 사이의 관계 | 일차함수와 그 그래프 | high | 62 | 62; 129; 137; 218; 242; 243; 245 | research_report_signal | use_as_supplemental_trace_only |
| m1_data_counting_cases | 경우의 수 | 경우의 수와 확률 | high | 62 | 62; 77; 78; 79; 80; 228; 239; 240; 241; 242; 260; 262; 266; 267; 268 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_model_tool_solid | 모형과 공학 도구로 입체도형 탐구 | 입체도형의 성질 | high | 61 | 13; 21; 22; 23; 24; 59; 60; 61; 62; 77; 79; 87; 88; 141; 142; 222; 228; 229; 235; 236; 239; 240; 241; 242 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_domain | 도형과 측정 | 도형과 측정 | high | 57 | 9; 12; 23; 26; 45; 46; 76; 77; 78; 84; 85; 103; 108; 109; 110; 112; 115; 118; 130; 138; 139; 142; 147; 154 | research_report_signal | use_as_supplemental_trace_only |
| m1_coord_coordinate | 좌표 | 좌표평면과 그래프 | high | 57 | 54; 57; 58; 59; 90; 215; 219; 232; 233; 234; 235; 253; 254; 258; 259 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_congruence | 합동 | 작도와 합동 | high | 55 | 77; 78; 97; 173; 181; 182; 221; 235; 236; 237; 238 | research_report_signal | use_as_supplemental_trace_only |
| m1_calc_exponent | 지수 | 식의 계산 | high | 54 | 54; 57; 58; 59; 97; 148; 149; 150; 152; 157; 159; 160; 163; 166; 168; 179; 216; 217; 219; 232; 233; 234; 235 | research_report_signal | use_as_supplemental_trace_only |
| m1_num_domain | 수와 연산 | 수와 연산 | high | 54 | 9; 12; 26; 27; 45; 46; 47; 48; 49; 52; 76; 100; 107; 121; 125; 136; 137; 151; 162; 165; 168; 179; 180; 202 | research_report_signal | use_as_supplemental_trace_only |
| m1_prop_direct_proportion | 정비례 | 좌표평면과 그래프 | high | 49 | 57; 58; 59; 215; 232; 233; 234; 245 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_line | 직선 | 기본 도형 | high | 47 | 77; 78; 130; 138; 139; 212; 215; 221; 231; 235; 236; 237; 238; 254; 257 | research_report_signal | use_as_supplemental_trace_only |
| m1_factor_factor | 인수 | 다항식의 곱셈과 인수분해 | high | 46 | 26; 54; 57; 58; 59; 107; 121; 211; 219; 230; 231; 232; 233; 234; 235 | research_report_signal | use_as_supplemental_trace_only |
| m1_data_statistical_inquiry_problem | 통계적 탐구 문제 | 도수분포표와 상대도수 | high | 45 | 45; 61; 62; 77; 79; 135; 140; 177; 183; 184; 190; 205; 228; 239; 240; 241 | research_report_signal | use_as_supplemental_trace_only |
| m1_num_integer_rational_unit | 정수와 유리수 | 정수와 유리수 | high | 43 | 27; 45; 211; 212; 230; 231; 232 | research_report_signal | use_as_supplemental_trace_only |
| m1_data_domain | 자료와 가능성 | 자료와 가능성 | high | 43 | 9; 12; 23; 26; 45; 46; 76; 77; 78; 106; 110; 135; 140; 177; 183; 190; 198; 205; 208; 227; 239; 260; 266 | research_report_signal | use_as_supplemental_trace_only |
| m1_func_slope | 기울기 | 일차함수와 그 그래프 | high | 42 | 58; 59; 87; 88; 89; 90; 205; 218; 234; 235; 252; 255; 257; 258 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_parallel_lines | 평행선 | 기본 도형 | high | 40 | 62; 78; 79; 80; 221; 224; 235; 236; 237; 238; 242; 272 | research_report_signal | use_as_supplemental_trace_only |
| m1_func_correspondence | 대응 관계 | 일차함수와 그 그래프 | high | 40 | 5; 12; 22; 24; 54; 75; 76; 84; 171; 173; 180; 181 | research_report_signal | use_as_supplemental_trace_only |
| m1_geo_surface_area | 겉넓이 | 입체도형의 성질 | high | 39 | 77; 79; 176; 181; 182; 222; 235; 236; 237; 238; 242; 263 | research_report_signal | use_as_supplemental_trace_only |
