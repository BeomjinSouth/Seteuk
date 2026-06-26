from __future__ import annotations

import csv
import json
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"


def source_ref(source_id: str, locator: str, evidence_kind: str, summary: str) -> dict:
    return {
        "source_id": source_id,
        "locator": locator,
        "evidence_kind": evidence_kind,
        "summary": summary,
    }


CURR_05 = source_ref(
    "curriculum_math_2022",
    "printed p. 34; [9수02-05]",
    "achievement_standard",
    "순서쌍과 좌표를 이해하고 편리함을 인식하는 성취기준",
)
CURR_06 = source_ref(
    "curriculum_math_2022",
    "printed p. 34; [9수02-06]",
    "achievement_standard",
    "다양한 상황을 그래프로 나타내고 주어진 그래프를 해석하는 성취기준",
)
CURR_07 = source_ref(
    "curriculum_math_2022",
    "printed p. 35; [9수02-07]",
    "achievement_standard",
    "정비례와 반비례 관계를 표, 식, 그래프로 나타내는 성취기준",
)
CURR_EXPLAIN = source_ref(
    "curriculum_math_2022",
    "printed pp. 35-36; achievement-standard explanation and considerations",
    "teaching_note",
    "좌표 사용 예, 그래프의 증가·감소·주기적 변화, 표·식·그래프 변환을 다룸",
)
CURR_TERMS = source_ref(
    "curriculum_math_2022",
    "printed p. 36; terms and symbols for 변화와 관계",
    "term_list",
    "좌표, 순서쌍, x좌표, y좌표, 원점, 좌표축, x축, y축, 좌표평면, 사분면, 그래프, 정비례, 반비례 등을 다룸",
)
ACH_COORD = source_ref(
    "achievement_math_2022",
    "좌표평면과 그래프 section; [9수02-05] achievement levels",
    "achievement_level",
    "수직선과 좌표평면 위의 점을 좌표로 나타내거나 주어진 좌표를 점으로 나타내는 수행을 구분",
)
ACH_GRAPH = source_ref(
    "achievement_math_2022",
    "좌표평면과 그래프 section; [9수02-06] achievement levels",
    "achievement_level",
    "상황을 그래프로 나타내기, 변화 상태 파악, 주어진 그래프 해석 수준을 구분",
)
ACH_PROP = source_ref(
    "achievement_math_2022",
    "좌표평면과 그래프 section; [9수02-07] achievement levels",
    "achievement_level",
    "정비례·반비례 관계를 표, 식, 그래프로 나타내는 수준을 구분",
)


def concept(
    id: str,
    label_ko: str,
    aliases: list[str],
    concept_type: str,
    short_definition: str,
    source_refs: list[dict],
    prerequisite_ids: list[str] | None = None,
    parent_ids: list[str] | None = None,
    related_ids: list[str] | None = None,
    notes: str = "",
    confidence: str = "high",
    grade: str = "중1(교육과정 학년군: 중1-3)",
    domain: str = "변화와 관계",
    unit: str = "좌표평면과 그래프",
) -> dict:
    return {
        "id": id,
        "label_ko": label_ko,
        "aliases": aliases,
        "grade": grade,
        "domain": domain,
        "unit": unit,
        "concept_type": concept_type,
        "short_definition": short_definition,
        "source_refs": source_refs,
        "prerequisite_ids": prerequisite_ids or [],
        "parent_ids": parent_ids or [],
        "related_ids": related_ids or [],
        "notes": notes,
        "confidence": confidence,
    }


CONCEPTS = [
    concept(
        "m1_coord_graph_unit",
        "좌표평면과 그래프",
        ["좌표와 그래프", "좌표평면"],
        "core_concept",
        "순서쌍과 좌표, 그래프, 정비례와 반비례 관계를 함께 다루는 중학교 변화와 관계 단원.",
        [CURR_05, CURR_06, CURR_07],
    ),
    concept(
        "m1_coord_ordered_pair",
        "순서쌍",
        ["ordered pair", "(x, y)"],
        "term",
        "두 수나 양을 순서를 가진 한 쌍으로 나타낸 표현.",
        [CURR_05, CURR_TERMS, ACH_COORD],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_coord_coordinate", "m1_mis_order_swap"],
    ),
    concept(
        "m1_coord_coordinate",
        "좌표",
        ["점의 좌표", "coordinate"],
        "term",
        "수직선이나 좌표평면 위의 점 위치를 수로 나타낸 값.",
        [CURR_05, CURR_TERMS, ACH_COORD],
        prerequisite_ids=["m1_coord_ordered_pair"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_coord_x_coordinate", "m1_coord_y_coordinate", "m1_coord_point_location"],
    ),
    concept(
        "m1_coord_number_line",
        "수직선",
        ["number line"],
        "representation",
        "수를 한 직선 위의 점으로 나타내는 표현.",
        [CURR_EXPLAIN, ACH_COORD],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_coord_coordinate_plane", "m1_coord_coordinate"],
    ),
    concept(
        "m1_coord_coordinate_plane",
        "좌표평면",
        ["coordinate plane", "xy평면"],
        "representation",
        "서로 수직인 두 좌표축을 이용해 점의 위치를 순서쌍으로 나타내는 평면.",
        [CURR_05, CURR_TERMS, ACH_COORD],
        prerequisite_ids=["m1_coord_number_line", "m1_coord_ordered_pair"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_coord_axis", "m1_coord_origin", "m1_coord_quadrant"],
    ),
    concept(
        "m1_coord_point_location",
        "점의 위치",
        ["좌표평면 위의 점", "수직선 위의 점"],
        "sub_concept",
        "수직선 또는 좌표평면에서 한 점이 놓인 자리를 좌표로 표현하거나 좌표에서 점을 찾는 개념.",
        [ACH_COORD, CURR_05],
        prerequisite_ids=["m1_coord_coordinate"],
        parent_ids=["m1_coord_coordinate"],
        related_ids=["m1_coord_axis_point"],
    ),
    concept(
        "m1_coord_x_coordinate",
        "x좌표",
        ["x 좌표", "가로 좌표"],
        "term",
        "좌표평면에서 점의 가로 방향 위치를 나타내는 좌표의 첫 번째 값.",
        [CURR_TERMS, ACH_COORD],
        prerequisite_ids=["m1_coord_ordered_pair"],
        parent_ids=["m1_coord_coordinate"],
        related_ids=["m1_coord_y_coordinate", "m1_mis_order_swap"],
    ),
    concept(
        "m1_coord_y_coordinate",
        "y좌표",
        ["y 좌표", "세로 좌표"],
        "term",
        "좌표평면에서 점의 세로 방향 위치를 나타내는 좌표의 두 번째 값.",
        [CURR_TERMS, ACH_COORD],
        prerequisite_ids=["m1_coord_ordered_pair"],
        parent_ids=["m1_coord_coordinate"],
        related_ids=["m1_coord_x_coordinate", "m1_mis_order_swap"],
    ),
    concept(
        "m1_coord_origin",
        "원점",
        ["origin", "(0, 0)"],
        "term",
        "x축과 y축이 만나는 기준점.",
        [CURR_TERMS],
        parent_ids=["m1_coord_coordinate_plane"],
        related_ids=["m1_coord_x_axis", "m1_coord_y_axis"],
    ),
    concept(
        "m1_coord_axis",
        "좌표축",
        ["coordinate axes", "축"],
        "term",
        "좌표평면을 정하는 기준이 되는 x축과 y축.",
        [CURR_TERMS],
        parent_ids=["m1_coord_coordinate_plane"],
        related_ids=["m1_coord_x_axis", "m1_coord_y_axis", "m1_coord_axis_point"],
    ),
    concept(
        "m1_coord_x_axis",
        "x축",
        ["x 축", "가로축"],
        "term",
        "좌표평면에서 x좌표를 기준으로 삼는 가로 방향 좌표축.",
        [CURR_TERMS],
        parent_ids=["m1_coord_axis"],
        related_ids=["m1_coord_y_axis", "m1_coord_axis_point"],
    ),
    concept(
        "m1_coord_y_axis",
        "y축",
        ["y 축", "세로축"],
        "term",
        "좌표평면에서 y좌표를 기준으로 삼는 세로 방향 좌표축.",
        [CURR_TERMS],
        parent_ids=["m1_coord_axis"],
        related_ids=["m1_coord_x_axis", "m1_coord_axis_point"],
    ),
    concept(
        "m1_coord_quadrant",
        "사분면",
        ["quadrant"],
        "sub_concept",
        "좌표축이 좌표평면을 나눌 때 생기는 네 영역.",
        [CURR_TERMS],
        prerequisite_ids=["m1_coord_axis"],
        parent_ids=["m1_coord_coordinate_plane"],
        related_ids=["m1_mis_axis_quadrant"],
    ),
    concept(
        "m1_coord_quadrant_1",
        "제1사분면",
        ["1사분면"],
        "term",
        "좌표평면의 네 사분면 중 하나로, 교과서 확인 후 부호 조건까지 보강할 항목.",
        [CURR_TERMS],
        parent_ids=["m1_coord_quadrant"],
        notes="공식 문서의 용어 목록에는 제1사분면이 나오지만, 부호 조건은 파일럿에서 교과서 확인 전 일반 지식으로만 기록한다.",
        confidence="medium",
    ),
    concept(
        "m1_coord_quadrant_2",
        "제2사분면",
        ["2사분면"],
        "term",
        "좌표평면의 네 사분면 중 하나로, 교과서 확인 후 부호 조건까지 보강할 항목.",
        [CURR_TERMS],
        parent_ids=["m1_coord_quadrant"],
        notes="공식 문서의 용어 목록에는 제2사분면이 나오지만, 부호 조건은 파일럿에서 교과서 확인 전 일반 지식으로만 기록한다.",
        confidence="medium",
    ),
    concept(
        "m1_coord_quadrant_3",
        "제3사분면",
        ["3사분면"],
        "term",
        "좌표평면의 네 사분면 중 하나로, 교과서 확인 후 부호 조건까지 보강할 항목.",
        [CURR_TERMS],
        parent_ids=["m1_coord_quadrant"],
        notes="공식 문서의 용어 목록에는 제3사분면이 나오지만, 부호 조건은 파일럿에서 교과서 확인 전 일반 지식으로만 기록한다.",
        confidence="medium",
    ),
    concept(
        "m1_coord_quadrant_4",
        "제4사분면",
        ["4사분면"],
        "term",
        "좌표평면의 네 사분면 중 하나로, 교과서 확인 후 부호 조건까지 보강할 항목.",
        [CURR_TERMS],
        parent_ids=["m1_coord_quadrant"],
        notes="공식 문서의 용어 목록에는 제4사분면이 나오지만, 부호 조건은 파일럿에서 교과서 확인 전 일반 지식으로만 기록한다.",
        confidence="medium",
    ),
    concept(
        "m1_coord_axis_point",
        "축 위의 점",
        ["좌표축 위의 점", "x축 위의 점", "y축 위의 점"],
        "sub_concept",
        "좌표축 위에 놓인 점을 좌표와 사분면 판단에서 따로 다루는 미시 개념.",
        [CURR_TERMS, ACH_COORD],
        prerequisite_ids=["m1_coord_axis", "m1_coord_coordinate"],
        parent_ids=["m1_coord_point_location"],
        related_ids=["m1_mis_axis_quadrant"],
        notes="공식 문서에는 좌표축과 좌표평면 위의 점이 확인된다. '축 위의 점' 명명과 세부 처리는 교과서 본문 확인이 필요하다.",
        confidence="low",
    ),
    concept(
        "m1_coord_usefulness",
        "좌표 표현의 편리함",
        ["좌표의 유용성", "좌표의 편리함"],
        "property",
        "실생활의 위치를 수직선이나 좌표평면 위에 표현할 때 얻는 표현상의 장점.",
        [CURR_05, CURR_EXPLAIN, ACH_COORD],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_coord_coordinate", "m1_coord_coordinate_plane"],
    ),
    concept(
        "m1_graph_graph",
        "그래프",
        ["graph"],
        "representation",
        "상황이나 관계의 변화 상태를 시각적으로 나타내는 수학적 표현.",
        [CURR_06, CURR_TERMS, ACH_GRAPH],
        prerequisite_ids=["m1_coord_coordinate_plane"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_graph_situation_graphing", "m1_graph_graph_interpretation", "m1_mis_graph_picture"],
    ),
    concept(
        "m1_graph_situation_graphing",
        "상황을 그래프로 나타내기",
        ["그래프로 나타내기", "그래프 그리기"],
        "procedure",
        "다양한 상황에서 변화하는 두 양의 관계를 그래프 표현으로 옮기는 절차.",
        [CURR_06, ACH_GRAPH],
        prerequisite_ids=["m1_graph_graph", "m1_coord_coordinate_plane"],
        parent_ids=["m1_graph_graph"],
        related_ids=["m1_repr_conversion"],
    ),
    concept(
        "m1_graph_graph_interpretation",
        "그래프 해석",
        ["주어진 그래프 해석", "그래프가 나타내는 상황 설명"],
        "procedure",
        "그래프의 모양과 값의 변화를 읽어 상황의 의미를 설명하는 절차.",
        [CURR_06, CURR_EXPLAIN, ACH_GRAPH],
        prerequisite_ids=["m1_graph_graph"],
        parent_ids=["m1_graph_graph"],
        related_ids=["m1_graph_change_state", "m1_mis_graph_picture"],
    ),
    concept(
        "m1_graph_change_state",
        "변화 상태",
        ["변화의 상태", "두 양의 변화"],
        "sub_concept",
        "한 양이 변할 때 다른 양이 어떻게 변하는지 그래프에서 파악하는 대상.",
        [CURR_EXPLAIN, ACH_GRAPH],
        prerequisite_ids=["m1_graph_graph"],
        parent_ids=["m1_graph_graph_interpretation"],
        related_ids=["m1_graph_increase_decrease", "m1_graph_periodic_change"],
    ),
    concept(
        "m1_graph_increase_decrease",
        "증가와 감소",
        ["증가", "감소"],
        "property",
        "그래프에서 값이 커지거나 작아지는 변화의 특징.",
        [CURR_EXPLAIN],
        prerequisite_ids=["m1_graph_graph"],
        parent_ids=["m1_graph_change_state"],
        related_ids=["m1_mis_direct_inverse_generalization"],
    ),
    concept(
        "m1_graph_periodic_change",
        "주기적 변화",
        ["주기 변화"],
        "property",
        "그래프에서 일정한 변화 양상이 반복되는 특징.",
        [CURR_EXPLAIN],
        prerequisite_ids=["m1_graph_graph"],
        parent_ids=["m1_graph_change_state"],
    ),
    concept(
        "m1_repr_table",
        "표",
        ["table"],
        "representation",
        "값이나 관계를 행과 열로 정리한 표현.",
        [CURR_07, CURR_EXPLAIN, ACH_PROP],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_repr_expression", "m1_graph_graph", "m1_repr_conversion"],
    ),
    concept(
        "m1_repr_expression",
        "식",
        ["수식", "관계식"],
        "representation",
        "두 양의 관계를 문자와 기호로 나타낸 표현.",
        [CURR_07, CURR_EXPLAIN, ACH_PROP],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_repr_table", "m1_graph_graph", "m1_repr_conversion"],
    ),
    concept(
        "m1_repr_everyday_language",
        "일상 언어",
        ["말", "문장 표현"],
        "representation",
        "상황이나 관계를 수학 기호가 아닌 생활 언어로 설명한 표현.",
        [CURR_EXPLAIN],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_repr_table", "m1_graph_graph", "m1_repr_expression", "m1_repr_conversion"],
    ),
    concept(
        "m1_repr_conversion",
        "표·식·그래프 상호 변환",
        ["표-식-그래프 변환", "표현 변환"],
        "procedure",
        "같은 관계를 일상 언어, 표, 식, 그래프 사이에서 바꾸어 나타내는 절차.",
        [CURR_EXPLAIN, ACH_PROP],
        prerequisite_ids=["m1_repr_table", "m1_repr_expression", "m1_graph_graph"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_mis_representation_conversion"],
    ),
    concept(
        "m1_prop_direct_proportion",
        "정비례",
        ["direct proportion", "정비례 관계"],
        "core_concept",
        "두 양 사이에 일정한 비례 관계가 성립하는 관계.",
        [CURR_07, CURR_TERMS, ACH_PROP],
        prerequisite_ids=["m1_repr_table", "m1_repr_expression", "m1_graph_graph"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_prop_inverse_proportion", "m1_prop_proportion_relation"],
    ),
    concept(
        "m1_prop_inverse_proportion",
        "반비례",
        ["inverse proportion", "반비례 관계"],
        "core_concept",
        "두 양 사이에 곱이 일정한 형태로 직관화되는 관계.",
        [CURR_07, CURR_TERMS, ACH_PROP],
        prerequisite_ids=["m1_repr_table", "m1_repr_expression", "m1_graph_graph"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_prop_direct_proportion", "m1_prop_proportion_relation"],
        notes="짧은 정의는 중학교 직관 수준으로 적었다. 출판사별 도입 방식과 식 표현은 교과서 확인 후 보강한다.",
        confidence="medium",
    ),
    concept(
        "m1_prop_proportion_relation",
        "정비례·반비례 관계 판단",
        ["비례 관계 판단", "관계 판별"],
        "procedure",
        "주어진 상황, 표, 식, 그래프에서 정비례 또는 반비례 관계가 성립하는지 판단하는 절차.",
        [CURR_07, ACH_PROP],
        prerequisite_ids=["m1_prop_direct_proportion", "m1_prop_inverse_proportion", "m1_repr_conversion"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_mis_direct_inverse_generalization"],
    ),
    concept(
        "m1_context_speed_distance",
        "속력과 거리 맥락",
        ["속력-거리"],
        "sub_concept",
        "정비례 또는 반비례 관계를 직관적으로 이해하도록 쓰이는 실생활 맥락.",
        [CURR_EXPLAIN, ACH_PROP],
        parent_ids=["m1_prop_proportion_relation"],
        related_ids=["m1_context_speed_time"],
        notes="공식 문서에서 예시 맥락으로 확인된다. 구체적 문제 유형은 교과서 확인 필요.",
        confidence="medium",
    ),
    concept(
        "m1_context_speed_time",
        "속력과 시간 맥락",
        ["속력-시간"],
        "sub_concept",
        "정비례 또는 반비례 관계를 직관적으로 이해하도록 쓰이는 실생활 맥락.",
        [CURR_EXPLAIN, ACH_PROP],
        parent_ids=["m1_prop_proportion_relation"],
        related_ids=["m1_context_speed_distance"],
        notes="공식 문서에서 예시 맥락으로 확인된다. 구체적 문제 유형은 교과서 확인 필요.",
        confidence="medium",
    ),
    concept(
        "m1_term_variable",
        "변수",
        ["variable"],
        "term",
        "변하는 값을 문자로 나타내어 관계를 표현할 때 쓰는 용어.",
        [CURR_TERMS, CURR_EXPLAIN],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_repr_expression", "m1_prop_direct_proportion", "m1_prop_inverse_proportion"],
    ),
    concept(
        "m1_mis_order_swap",
        "순서쌍의 순서 혼동",
        ["x좌표와 y좌표 바꾸기", "(x, y) 순서 오류"],
        "misconception_risk",
        "순서쌍에서 첫 번째 값과 두 번째 값의 역할을 바꾸어 점을 찍거나 읽는 위험.",
        [CURR_TERMS, ACH_COORD],
        prerequisite_ids=["m1_coord_ordered_pair"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_coord_x_coordinate", "m1_coord_y_coordinate"],
        notes="성취수준 문서의 '주어진 좌표를 점으로 나타내기' 수행에서 드러날 수 있는 위험으로 추론했다. 교과서 오개념 코너 확인 필요.",
        confidence="low",
    ),
    concept(
        "m1_mis_axis_quadrant",
        "축 위의 점을 사분면에 포함하는 오류",
        ["좌표축과 사분면 혼동", "축 위 점의 사분면 판단 오류"],
        "misconception_risk",
        "좌표축 위의 점을 제1~제4사분면 중 하나에 속한다고 판단하는 위험.",
        [CURR_TERMS, ACH_COORD],
        prerequisite_ids=["m1_coord_quadrant", "m1_coord_axis_point"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_coord_axis_point", "m1_coord_quadrant"],
        notes="공식 문서에서 좌표축과 사분면 용어는 확인되지만, 오류 자체는 교과서·문항 근거 확인 전 잠정 노드이다.",
        confidence="low",
    ),
    concept(
        "m1_mis_graph_picture",
        "그래프를 상황 그림으로만 보는 오류",
        ["그래프-그림 혼동", "그래프 모양만 읽기"],
        "misconception_risk",
        "그래프를 두 양의 관계 표현이 아니라 상황의 외형 그림처럼 해석하는 위험.",
        [CURR_06, CURR_EXPLAIN, ACH_GRAPH],
        prerequisite_ids=["m1_graph_graph"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_graph_graph_interpretation"],
        notes="그래프가 나타내는 상황을 설명하게 한다는 공식 문서 근거에서 추론한 오개념 위험이다.",
        confidence="low",
    ),
    concept(
        "m1_mis_direct_inverse_generalization",
        "증가·감소만으로 정비례·반비례 판단",
        ["비례 관계 과잉 일반화", "증감만으로 판단"],
        "misconception_risk",
        "그래프나 표가 증가 또는 감소한다는 사실만으로 정비례나 반비례라고 판단하는 위험.",
        [CURR_07, CURR_EXPLAIN, ACH_PROP],
        prerequisite_ids=["m1_prop_proportion_relation"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_graph_increase_decrease", "m1_prop_direct_proportion", "m1_prop_inverse_proportion"],
        notes="공식 문서의 정비례·반비례 관계 판단 요구와 변화 상태 해석 요구를 함께 본 추론이다.",
        confidence="low",
    ),
    concept(
        "m1_mis_representation_conversion",
        "표·식·그래프 변환 오류",
        ["표현 변환 오류", "대응값 옮기기 오류"],
        "misconception_risk",
        "같은 관계를 표, 식, 그래프로 옮길 때 대응값, 축, 변수 의미를 잘못 연결하는 위험.",
        [CURR_EXPLAIN, ACH_PROP],
        prerequisite_ids=["m1_repr_conversion"],
        parent_ids=["m1_coord_graph_unit"],
        related_ids=["m1_repr_table", "m1_repr_expression", "m1_graph_graph"],
        notes="상호 변환 활동과 표·식·그래프 성취수준에서 추론한 위험이다. 교과서 예제와 문항으로 보강 필요.",
        confidence="low",
    ),
]


def edge(
    source_id: str,
    target_id: str,
    relationship_type: str,
    source_refs: list[dict],
    notes: str = "",
    confidence: str = "high",
) -> dict:
    return {
        "id": f"{source_id}__{relationship_type}__{target_id}",
        "source_id": source_id,
        "target_id": target_id,
        "relationship_type": relationship_type,
        "source_refs": source_refs,
        "notes": notes,
        "confidence": confidence,
    }


EDGES = [
    edge("m1_coord_graph_unit", "m1_coord_ordered_pair", "contains", [CURR_05, CURR_TERMS]),
    edge("m1_coord_graph_unit", "m1_coord_coordinate", "contains", [CURR_05, CURR_TERMS]),
    edge("m1_coord_graph_unit", "m1_coord_coordinate_plane", "contains", [CURR_05, CURR_TERMS]),
    edge("m1_coord_graph_unit", "m1_graph_graph", "contains", [CURR_06, CURR_TERMS]),
    edge("m1_coord_graph_unit", "m1_prop_direct_proportion", "contains", [CURR_07, CURR_TERMS]),
    edge("m1_coord_graph_unit", "m1_prop_inverse_proportion", "contains", [CURR_07, CURR_TERMS]),
    edge("m1_coord_ordered_pair", "m1_coord_coordinate", "prerequisite_for", [CURR_05, ACH_COORD]),
    edge("m1_coord_number_line", "m1_coord_coordinate_plane", "prerequisite_for", [CURR_EXPLAIN, ACH_COORD]),
    edge("m1_coord_coordinate", "m1_coord_point_location", "used_in", [ACH_COORD]),
    edge("m1_coord_coordinate", "m1_coord_x_coordinate", "contains", [CURR_TERMS]),
    edge("m1_coord_coordinate", "m1_coord_y_coordinate", "contains", [CURR_TERMS]),
    edge("m1_coord_coordinate_plane", "m1_coord_origin", "contains", [CURR_TERMS]),
    edge("m1_coord_coordinate_plane", "m1_coord_axis", "contains", [CURR_TERMS]),
    edge("m1_coord_axis", "m1_coord_x_axis", "contains", [CURR_TERMS]),
    edge("m1_coord_axis", "m1_coord_y_axis", "contains", [CURR_TERMS]),
    edge("m1_coord_coordinate_plane", "m1_coord_quadrant", "contains", [CURR_TERMS]),
    edge("m1_coord_quadrant", "m1_coord_quadrant_1", "contains", [CURR_TERMS], confidence="medium"),
    edge("m1_coord_quadrant", "m1_coord_quadrant_2", "contains", [CURR_TERMS], confidence="medium"),
    edge("m1_coord_quadrant", "m1_coord_quadrant_3", "contains", [CURR_TERMS], confidence="medium"),
    edge("m1_coord_quadrant", "m1_coord_quadrant_4", "contains", [CURR_TERMS], confidence="medium"),
    edge("m1_coord_axis", "m1_coord_axis_point", "contains", [CURR_TERMS, ACH_COORD], "교과서 본문 근거 보강 필요", "low"),
    edge("m1_coord_coordinate_plane", "m1_graph_graph", "represented_by", [CURR_06, ACH_GRAPH], "그래프가 좌표평면 위에 표현되는 경우를 우선 반영", "medium"),
    edge("m1_graph_graph", "m1_graph_situation_graphing", "used_in", [CURR_06, ACH_GRAPH]),
    edge("m1_graph_graph", "m1_graph_graph_interpretation", "used_in", [CURR_06, CURR_EXPLAIN, ACH_GRAPH]),
    edge("m1_graph_graph_interpretation", "m1_graph_change_state", "used_in", [CURR_EXPLAIN, ACH_GRAPH]),
    edge("m1_graph_change_state", "m1_graph_increase_decrease", "contains", [CURR_EXPLAIN]),
    edge("m1_graph_change_state", "m1_graph_periodic_change", "contains", [CURR_EXPLAIN]),
    edge("m1_repr_conversion", "m1_repr_table", "used_in", [CURR_EXPLAIN, ACH_PROP]),
    edge("m1_repr_conversion", "m1_repr_expression", "used_in", [CURR_EXPLAIN, ACH_PROP]),
    edge("m1_repr_conversion", "m1_graph_graph", "used_in", [CURR_EXPLAIN, ACH_PROP]),
    edge("m1_prop_direct_proportion", "m1_repr_table", "represented_by", [CURR_07, ACH_PROP]),
    edge("m1_prop_direct_proportion", "m1_repr_expression", "represented_by", [CURR_07, ACH_PROP]),
    edge("m1_prop_direct_proportion", "m1_graph_graph", "represented_by", [CURR_07, ACH_PROP]),
    edge("m1_prop_inverse_proportion", "m1_repr_table", "represented_by", [CURR_07, ACH_PROP]),
    edge("m1_prop_inverse_proportion", "m1_repr_expression", "represented_by", [CURR_07, ACH_PROP]),
    edge("m1_prop_inverse_proportion", "m1_graph_graph", "represented_by", [CURR_07, ACH_PROP]),
    edge("m1_prop_direct_proportion", "m1_prop_inverse_proportion", "contrasts_with", [CURR_07, ACH_PROP]),
    edge("m1_prop_inverse_proportion", "m1_prop_direct_proportion", "contrasts_with", [CURR_07, ACH_PROP]),
    edge("m1_prop_proportion_relation", "m1_prop_direct_proportion", "used_in", [CURR_07, ACH_PROP]),
    edge("m1_prop_proportion_relation", "m1_prop_inverse_proportion", "used_in", [CURR_07, ACH_PROP]),
    edge("m1_context_speed_distance", "m1_prop_proportion_relation", "used_in", [CURR_EXPLAIN, ACH_PROP], confidence="medium"),
    edge("m1_context_speed_time", "m1_prop_proportion_relation", "used_in", [CURR_EXPLAIN, ACH_PROP], confidence="medium"),
    edge("m1_term_variable", "m1_repr_expression", "used_in", [CURR_TERMS, CURR_EXPLAIN]),
    edge("m1_coord_x_coordinate", "m1_coord_y_coordinate", "often_confused_with", [CURR_TERMS, ACH_COORD], "순서쌍의 순서 오류와 연결", "low"),
    edge("m1_mis_order_swap", "m1_coord_ordered_pair", "often_confused_with", [CURR_TERMS, ACH_COORD], confidence="low"),
    edge("m1_mis_order_swap", "m1_coord_x_coordinate", "often_confused_with", [CURR_TERMS, ACH_COORD], confidence="low"),
    edge("m1_mis_order_swap", "m1_coord_y_coordinate", "often_confused_with", [CURR_TERMS, ACH_COORD], confidence="low"),
    edge("m1_mis_axis_quadrant", "m1_coord_axis_point", "often_confused_with", [CURR_TERMS, ACH_COORD], confidence="low"),
    edge("m1_mis_axis_quadrant", "m1_coord_quadrant", "often_confused_with", [CURR_TERMS, ACH_COORD], confidence="low"),
    edge("m1_mis_graph_picture", "m1_graph_graph_interpretation", "often_confused_with", [CURR_06, ACH_GRAPH], confidence="low"),
    edge("m1_mis_direct_inverse_generalization", "m1_prop_proportion_relation", "often_confused_with", [CURR_07, ACH_PROP], confidence="low"),
    edge("m1_mis_direct_inverse_generalization", "m1_graph_increase_decrease", "often_confused_with", [CURR_EXPLAIN, ACH_PROP], confidence="low"),
    edge("m1_mis_representation_conversion", "m1_repr_conversion", "often_confused_with", [CURR_EXPLAIN, ACH_PROP], confidence="low"),
]


SOURCES = [
    {
        "id": "curriculum_math_2022",
        "title": "2022 개정 수학과 교육과정 [별책8]",
        "path": "2022_개정_중학교_교육과정_PDF/교과/02_[별책8] 수학과 교육과정.pdf",
        "sha256": "ba7c7c63ad31ba0fd32e5eb8148d696dd73288acce111495c593298112f8f840",
        "source_url": "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003592&orgType=ogi4",
        "source_type": "official_curriculum_pdf",
    },
    {
        "id": "achievement_math_2022",
        "title": "2022 개정 중학교 수학 성취수준",
        "path": "2022_개정_중학교_성취수준_PDF/성취수준/02_수학_성취수준.pdf",
        "source_type": "official_achievement_level_pdf",
    },
    {
        "id": "unit_summary_math_json",
        "title": "수학 교육과정 단원 정리 JSON",
        "path": "교육과정_단원_정리/교과별_JSON/02_수학_단원_정리.json",
        "source_type": "derived_local_summary",
    },
    {
        "id": "textbook_originals",
        "title": "교과서 원본 폴더",
        "path": "교과서_원본/",
        "source_type": "pending_textbook_sources",
        "notes": "현재 분석할 교과서, 익힘책, 지도서 PDF 또는 이미지 파일이 없다.",
    },
]


def json_dumps(value) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def write_concepts_json() -> None:
    data = {
        "metadata": {
            "title": "수학 개념 위계 Map",
            "schema_version": "0.1.0",
            "generated_at": datetime.now().isoformat(timespec="seconds"),
            "pilot_scope": "중학교 변화와 관계 > 좌표평면과 그래프",
            "concept_count": len(CONCEPTS),
            "edge_count": len(EDGES),
        },
        "sources": SOURCES,
        "concepts": CONCEPTS,
        "edges": EDGES,
    }
    (OUT_DIR / "concepts.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def write_concepts_csv() -> None:
    fieldnames = [
        "id",
        "label_ko",
        "aliases",
        "grade",
        "domain",
        "unit",
        "concept_type",
        "short_definition",
        "source_refs",
        "prerequisite_ids",
        "parent_ids",
        "related_ids",
        "notes",
        "confidence",
    ]
    with (OUT_DIR / "concepts.csv").open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for item in CONCEPTS:
            row = item.copy()
            for key in ["aliases", "source_refs", "prerequisite_ids", "parent_ids", "related_ids"]:
                row[key] = json_dumps(row[key])
            writer.writerow(row)


def write_edges_csv() -> None:
    fieldnames = [
        "id",
        "source_id",
        "target_id",
        "relationship_type",
        "source_refs",
        "notes",
        "confidence",
    ]
    with (OUT_DIR / "edges.csv").open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for item in EDGES:
            row = item.copy()
            row["source_refs"] = json_dumps(row["source_refs"])
            writer.writerow(row)


def mermaid_label(label: str) -> str:
    return label.replace('"', "'")


def write_mermaid() -> None:
    concept_by_id = {item["id"]: item for item in CONCEPTS}
    relation_labels = {
        "contains": "포함",
        "prerequisite_for": "선수",
        "represented_by": "표현",
        "used_in": "사용",
        "contrasts_with": "대조",
        "often_confused_with": "혼동",
    }
    lines = [
        "flowchart LR",
        "  classDef core fill:#e8f1ff,stroke:#2456a6,stroke-width:1px,color:#10213f;",
        "  classDef representation fill:#fff7df,stroke:#a86b00,stroke-width:1px,color:#2c2100;",
        "  classDef procedure fill:#e9f8ed,stroke:#2d7d46,stroke-width:1px,color:#102b18;",
        "  classDef risk fill:#ffecec,stroke:#b73535,stroke-width:1px,color:#3c1010;",
        "  classDef default fill:#f7f7f7,stroke:#666,stroke-width:1px,color:#222;",
        "",
    ]
    for item in CONCEPTS:
        lines.append(f'  {item["id"]}["{mermaid_label(item["label_ko"])}"]')
    lines.append("")
    for item in EDGES:
        label = relation_labels[item["relationship_type"]]
        lines.append(f'  {item["source_id"]} -- "{label}" --> {item["target_id"]}')
    lines.append("")
    for item in CONCEPTS:
        class_name = "default"
        if item["concept_type"] == "core_concept":
            class_name = "core"
        elif item["concept_type"] == "representation":
            class_name = "representation"
        elif item["concept_type"] == "procedure":
            class_name = "procedure"
        elif item["concept_type"] == "misconception_risk":
            class_name = "risk"
        if item["id"] in concept_by_id:
            lines.append(f'  class {item["id"]} {class_name};')
    (OUT_DIR / "graph.mmd").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    write_concepts_json()
    write_concepts_csv()
    write_edges_csv()
    write_mermaid()
    print(f"Wrote {len(CONCEPTS)} concepts and {len(EDGES)} edges to {OUT_DIR}")


if __name__ == "__main__":
    main()
