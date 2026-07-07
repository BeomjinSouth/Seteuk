from __future__ import annotations

import csv
import json
from datetime import datetime
from pathlib import Path

import elementary_data_e12_rest as e12_rest
import elementary_data_e34 as e34


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "elementary-concepts.json"
CONCEPTS_CSV = OUT_DIR / "elementary-concepts.csv"
EDGES_CSV = OUT_DIR / "elementary-edges.csv"
PILOT_MD = OUT_DIR / "elementary-pilot.md"

# 2026-07-06 사용자 결정(AGENTS.md Math Concept Map Scope Rules):
# - 개념·용어는 별책8 원문 추출 텍스트와 페이지 출처로만 반영한다. 모델 지식으로 채우지 않는다.
# - 이 파일의 모든 concept은 별책8 초등학교 1~2학년 수와 연산 구간
#   (인쇄 페이지 p.11~12, PDF 페이지 p.17~18)의 성취기준·해설·적용 시 고려 사항에서 왔다.

SOURCES = [
    {
        "id": "curriculum_math_2022",
        "title": "2022 개정 수학과 교육과정 [별책8]",
        "path": "2022_개정_중학교_교육과정_PDF/교과/02_[별책8] 수학과 교육과정.pdf",
        "sha256": "ba7c7c63ad31ba0fd32e5eb8148d696dd73288acce111495c593298112f8f840",
        "source_type": "official_curriculum_pdf",
    },
    {
        "id": "textbook_originals",
        "title": "교과서 원본 폴더",
        "path": "교과서_원본/",
        "source_type": "pending_textbook_sources",
        "notes": "현재 분석할 초등 교과서, 익힘책, 지도서 PDF 또는 이미지 파일이 없다.",
    },
]

GRADE = "초1-2"
DOMAIN = "수와 연산"
UNIT_NUMBERS = "네 자리 이하의 수"
UNIT_ADDSUB = "두 자리 수 범위의 덧셈과 뺄셈"
UNIT_MUL = "한 자리 수의 곱셈"

SYMBOL_EXTRACTION_NOTE = (
    "용어·기호 목록(printed p. 11)의 기호 6칸 중 ×만 텍스트 추출로 확인했고 "
    "나머지 기호는 한글 수식 글꼴(HyhwpEQ) 문제로 미추출이다. 원문 시각 확인 또는 교과서 확인 전까지 "
    "미추출 기호는 concept으로 추가하지 않는다."
)


def ref(locator: str, evidence_kind: str, summary: str) -> dict:
    return {
        "source_id": "curriculum_math_2022",
        "locator": locator,
        "evidence_kind": evidence_kind,
        "summary": summary,
    }


def concept(
    cid: str,
    label: str,
    unit: str,
    concept_type: str,
    short_definition: str,
    source_refs: list[dict],
    confidence: str = "high",
    aliases: list[str] | None = None,
    notes: str = "",
) -> dict:
    return {
        "id": cid,
        "label_ko": label,
        "aliases": aliases or [],
        "grade": GRADE,
        "domain": DOMAIN,
        "unit": unit,
        "concept_type": concept_type,
        "short_definition": short_definition,
        "source_refs": source_refs,
        "prerequisite_ids": [],
        "parent_ids": [],
        "related_ids": [],
        "notes": notes,
        "confidence": confidence,
    }


NUMBER_CONCEPTS = [
    # ---------- 네 자리 이하의 수 ----------
    concept(
        "e12_num_zero_to_100",
        "0과 100까지의 수",
        UNIT_NUMBERS,
        "core_concept",
        "수의 필요성을 인식하면서 이해하는 0부터 100까지의 수 개념.",
        [ref("printed p. 11; [2수01-01]", "achievement_standard", "0과 100까지의 수 개념을 이해하고 수를 세고 읽고 쓰는 성취기준")],
    ),
    concept(
        "e12_num_need_for_numbers",
        "수의 필요성 인식하기",
        UNIT_NUMBERS,
        "procedure",
        "실생활에서 수가 사용되는 사례를 통하여 수의 필요성을 인식하는 활동.",
        [
            ref("printed p. 11; [2수01-01]", "achievement_standard", "수의 필요성을 인식하면서 수 개념을 이해한다는 진술"),
            ref("printed p. 11 적용 시 고려 사항", "teaching_note", "실생활에서 수가 사용되는 사례로 네 자리 이하의 수의 필요성을 인식하게 한다"),
        ],
    ),
    concept(
        "e12_num_counting",
        "수 세기",
        UNIT_NUMBERS,
        "procedure",
        "구체적 대상을 세어 수를 파악하는 활동.",
        [ref("printed p. 11; [2수01-01]", "achievement_standard", "수를 세고 읽고 쓸 수 있다는 진술의 세기 부분")],
    ),
    concept(
        "e12_num_grouped_counting",
        "묶어 세기",
        UNIT_NUMBERS,
        "procedure",
        "수 세기가 필요한 장면에서 일정한 개수로 묶어 세는 방법.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "수 세기가 필요한 장면에서 묶어 세기 방법으로 세어 보게 한다")],
    ),
    concept(
        "e12_num_skip_counting",
        "뛰어 세기",
        UNIT_NUMBERS,
        "procedure",
        "수 세기가 필요한 장면에서 일정한 간격으로 뛰어 세는 방법.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "수 세기가 필요한 장면에서 뛰어 세기 방법으로 세어 보게 한다")],
    ),
    concept(
        "e12_num_reading",
        "수 읽기",
        UNIT_NUMBERS,
        "procedure",
        "수를 바르게 읽는 활동.",
        [ref("printed p. 11; [2수01-01], [2수01-02]", "achievement_standard", "수를 읽고 쓸 수 있다는 진술의 읽기 부분")],
    ),
    concept(
        "e12_num_writing",
        "수 쓰기",
        UNIT_NUMBERS,
        "procedure",
        "수를 숫자로 바르게 쓰는 활동.",
        [ref("printed p. 11; [2수01-01], [2수01-02]", "achievement_standard", "수를 읽고 쓸 수 있다는 진술의 쓰기 부분")],
        notes="저학년 한글 학습 정도를 고려하여 '여덟', '마흔아홉' 등 한글로 쓰게 하는 것은 지양한다(printed p. 12).",
    ),
    concept(
        "e12_num_number_uses",
        "자연수의 쓰임(개수·순서·이름)",
        UNIT_NUMBERS,
        "property",
        "자연수가 개수, 순서, 이름 등을 나타내는 경우가 있음.",
        [ref("printed p. 11~12 적용 시 고려 사항", "teaching_note", "자연수가 개수, 순서, 이름 등을 나타내는 경우가 있음을 알게 한다")],
    ),
    concept(
        "e12_num_place_value",
        "일·십·백·천의 자릿값",
        UNIT_NUMBERS,
        "core_concept",
        "일, 십, 백, 천 각 자리가 나타내는 값.",
        [ref("printed p. 11; [2수01-02]", "achievement_standard", "일, 십, 백, 천의 자릿값과 위치적 기수법을 이해한다는 진술")],
        aliases=["자릿값"],
    ),
    concept(
        "e12_num_zero_in_place",
        "0이 있는 자릿값",
        UNIT_NUMBERS,
        "sub_concept",
        "십의 자리 수가 0인 세 자리 수, 백·십의 자리 수가 0인 네 자리 수에서의 자릿값 이해.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "자리 수가 0인 수를 활용하여 자릿값을 이해하게 할 수 있다")],
        confidence="medium",
        notes="문서가 '활용할 수 있다'로 제시한 선택적 활동이므로 교과서 확인 전 medium을 유지한다.",
    ),
    concept(
        "e12_num_positional_notation",
        "위치적 기수법",
        UNIT_NUMBERS,
        "core_concept",
        "숫자의 위치에 따라 값이 정해지는 수 표기 방법.",
        [ref("printed p. 11; [2수01-02]", "achievement_standard", "위치적 기수법을 이해한다는 진술")],
    ),
    concept(
        "e12_num_ten_bundles",
        "10개씩 묶음과 낱개",
        UNIT_NUMBERS,
        "representation",
        "두 자리 수를 10개씩 묶음과 낱개로 나타내는 표현.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "두 자리 수를 10개씩 묶음과 낱개로 나타내게 하여 위치적 기수법의 기초 개념을 형성하게 한다")],
    ),
    concept(
        "e12_num_four_digit_read_write",
        "네 자리 이하의 수 읽고 쓰기",
        UNIT_NUMBERS,
        "procedure",
        "자릿값과 위치적 기수법을 바탕으로 네 자리 이하의 수를 읽고 쓰는 활동.",
        [ref("printed p. 11; [2수01-02]", "achievement_standard", "네 자리 이하의 수를 읽고 쓸 수 있다는 진술")],
    ),
    concept(
        "e12_num_sequence",
        "수의 계열",
        UNIT_NUMBERS,
        "core_concept",
        "네 자리 이하의 수 범위에서 수가 이어지는 순서 구조.",
        [ref("printed p. 11; [2수01-03]", "achievement_standard", "수의 계열을 이해한다는 진술")],
    ),
    concept(
        "e12_num_compare",
        "수의 크기 비교하기",
        UNIT_NUMBERS,
        "procedure",
        "네 자리 이하의 수 범위에서 두 수의 크기를 비교하는 활동.",
        [ref("printed p. 11; [2수01-03]", "achievement_standard", "수의 크기를 비교할 수 있다는 진술")],
        notes=SYMBOL_EXTRACTION_NOTE,
    ),
    concept(
        "e12_num_decompose_compose",
        "수의 분해와 합성",
        UNIT_NUMBERS,
        "core_concept",
        "하나의 수를 두 수로 분해하고 두 수를 하나의 수로 합성하는 활동.",
        [ref("printed p. 11; [2수01-04]", "achievement_standard", "분해와 합성 활동으로 수 감각을 기른다는 진술")],
        notes="수를 분해하고 합성하는 활동은 20 이하의 수의 범위에서 한다(printed p. 12).",
    ),
    concept(
        "e12_num_sense",
        "수 감각",
        UNIT_NUMBERS,
        "sub_concept",
        "수와 수 사이 관계를 유연하게 다루는 감각.",
        [ref("printed p. 11; [2수01-04]", "achievement_standard", "분해·합성 활동을 통하여 수 감각을 기른다는 진술")],
    ),
    concept(
        "e12_num_even",
        "짝수",
        UNIT_NUMBERS,
        "term",
        "둘씩 묶을 때 남는 것이 없는 수를 가리키는 공식 용어.",
        [ref("printed p. 11 용어와 기호", "term_list", "수와 연산 영역 용어 목록의 짝수")],
        notes="짝수와 홀수는 20 이하의 수의 범위에서 다룬다(printed p. 12).",
    ),
    concept(
        "e12_num_odd",
        "홀수",
        UNIT_NUMBERS,
        "term",
        "둘씩 묶을 때 하나가 남는 수를 가리키는 공식 용어.",
        [ref("printed p. 11 용어와 기호", "term_list", "수와 연산 영역 용어 목록의 홀수")],
        notes="짝수와 홀수는 20 이하의 수의 범위에서 다룬다(printed p. 12).",
    ),
    concept(
        "e12_num_pairing_even_odd",
        "둘씩 묶어 짝수·홀수 판별하기",
        UNIT_NUMBERS,
        "procedure",
        "실생활 상황에서 둘씩 묶어 보는 활동으로 짝수와 홀수를 직관적으로 이해하는 활동.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "둘씩 묶어 보는 활동을 통하여 짝수와 홀수를 직관적으로 이해하게 한다")],
    ),
    # ---------- 두 자리 수 범위의 덧셈과 뺄셈 ----------
    concept(
        "e12_add",
        "덧셈",
        UNIT_ADDSUB,
        "core_concept",
        "두 수를 더하는 연산.",
        [
            ref("printed p. 11 용어와 기호", "term_list", "수와 연산 영역 용어 목록의 덧셈"),
            ref("printed p. 11; [2수01-05]", "achievement_standard", "실생활 상황과 연결하여 덧셈의 의미를 이해한다는 진술"),
        ],
    ),
    concept(
        "e12_sub",
        "뺄셈",
        UNIT_ADDSUB,
        "core_concept",
        "한 수에서 다른 수를 빼는 연산.",
        [
            ref("printed p. 11 용어와 기호", "term_list", "수와 연산 영역 용어 목록의 뺄셈"),
            ref("printed p. 11; [2수01-05]", "achievement_standard", "실생활 상황과 연결하여 뺄셈의 의미를 이해한다는 진술"),
        ],
    ),
    concept(
        "e12_addsub_meaning",
        "덧셈과 뺄셈의 의미",
        UNIT_ADDSUB,
        "sub_concept",
        "덧셈과 뺄셈이 이루어지는 실생활 상황과 연결하여 이해하는 두 연산의 의미.",
        [ref("printed p. 11; [2수01-05]", "achievement_standard", "실생활 상황과 연결하여 덧셈과 뺄셈의 의미를 이해한다는 진술")],
    ),
    concept(
        "e12_addsub_everyday_words",
        "덧셈과 뺄셈의 일상용어",
        UNIT_ADDSUB,
        "term",
        "덧셈과 뺄셈의 의미에 친숙해지도록 사용하는 일상용어.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "'더한다', '합한다', '뺀다', '덜어 낸다', '합', '차' 등의 일상용어를 사용하게 한다")],
        aliases=["더한다", "합한다", "뺀다", "덜어 낸다", "합", "차"],
    ),
    concept(
        "e12_addsub_two_digit_principle",
        "두 자리 수 덧셈과 뺄셈의 계산 원리",
        UNIT_ADDSUB,
        "sub_concept",
        "두 자리 수 범위 덧셈과 뺄셈에서 계산이 이루어지는 원리.",
        [
            ref("printed p. 11; [2수01-06]", "achievement_standard", "계산 원리를 이해하고 계산을 할 수 있다는 진술"),
            ref("printed p. 11 성취기준 해설", "achievement_standard_note", "덧셈은 두 자리 수 범위에서 다루되 합이 세 자리 수인 경우도 포함한다"),
        ],
    ),
    concept(
        "e12_addsub_two_digit_calc",
        "두 자리 수 덧셈과 뺄셈 계산하기",
        UNIT_ADDSUB,
        "procedure",
        "두 자리 수 범위에서 덧셈과 뺄셈을 실제로 계산하는 활동.",
        [ref("printed p. 11; [2수01-06]", "achievement_standard", "계산 원리를 이해하고 그 계산을 할 수 있다는 진술")],
    ),
    concept(
        "e12_flexible_calc",
        "여러 가지 방법으로 덧셈과 뺄셈하기",
        UNIT_ADDSUB,
        "procedure",
        "덧셈과 뺄셈을 여러 가지 방법으로 계산해 보는 활동.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "여러 가지 방법으로 계산하는 활동으로 연산 감각을 기르게 하되 지나치게 형식화하지 않는다")],
        notes="지나치게 형식화하여 다루지 않는다(printed p. 12).",
    ),
    concept(
        "e12_operation_sense",
        "연산 감각",
        UNIT_ADDSUB,
        "sub_concept",
        "연산을 유연하게 선택하고 다루는 감각.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "여러 가지 방법으로 계산하는 활동을 통하여 연산 감각을 기르게 한다")],
    ),
    concept(
        "e12_add_expression",
        "덧셈식",
        UNIT_ADDSUB,
        "representation",
        "덧셈을 식으로 나타낸 표현.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "덧셈식, 뺄셈식, 곱셈식에서 등호 양쪽의 양이 서로 같음을 이해하게 한다")],
    ),
    concept(
        "e12_sub_expression",
        "뺄셈식",
        UNIT_ADDSUB,
        "representation",
        "뺄셈을 식으로 나타낸 표현.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "덧셈식, 뺄셈식, 곱셈식에서 등호 양쪽의 양이 서로 같음을 이해하게 한다")],
    ),
    concept(
        "e12_equal_sign",
        "등호",
        UNIT_ADDSUB,
        "term",
        "식의 양쪽이 서로 같음을 나타내는 기호의 이름.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "덧셈식, 뺄셈식, 곱셈식에서 등호 양쪽의 양이 서로 같음을 이해하게 한다")],
        notes=SYMBOL_EXTRACTION_NOTE,
    ),
    concept(
        "e12_equal_both_sides",
        "등호 양쪽의 양이 서로 같음",
        UNIT_ADDSUB,
        "property",
        "등호의 양쪽에 있는 양이 서로 같다는 관계적 이해.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "등호의 양쪽에 있는 양이 서로 같음을 이해하게 한다")],
    ),
    concept(
        "e12_addsub_relation",
        "덧셈과 뺄셈의 관계",
        UNIT_ADDSUB,
        "property",
        "덧셈과 뺄셈이 서로 연결되는 관계.",
        [ref("printed p. 11; [2수01-07]", "achievement_standard", "덧셈과 뺄셈의 관계를 이해한다는 진술")],
    ),
    concept(
        "e12_one_situation_two_expressions",
        "한 상황을 덧셈식과 뺄셈식으로 나타내기",
        UNIT_ADDSUB,
        "procedure",
        "한 가지 상황을 간단한 덧셈식과 뺄셈식으로 나타내는 활동.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "한 가지 상황을 덧셈식과 뺄셈식으로 나타내는 활동으로 덧셈과 뺄셈의 관계를 이해하게 한다")],
    ),
    concept(
        "e12_three_number_addsub",
        "세 수의 덧셈과 뺄셈",
        UNIT_ADDSUB,
        "procedure",
        "두 자리 수의 범위에서 세 수의 덧셈과 뺄셈을 하는 활동.",
        [ref("printed p. 11; [2수01-08]", "achievement_standard", "세 수의 덧셈과 뺄셈을 할 수 있다는 진술")],
    ),
    concept(
        "e12_add_comm",
        "덧셈의 교환법칙 직관적 이해",
        UNIT_ADDSUB,
        "property",
        "두 수를 바꾸어 더해도 결과가 같음을 직관적으로 이해.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "한 자리 수인 두 수를 바꾸어 더해 보고 결과를 비교하는 활동으로 교환법칙을 직관적으로 이해하게 한다")],
    ),
    concept(
        "e12_add_assoc",
        "덧셈의 결합법칙 직관적 이해",
        UNIT_ADDSUB,
        "property",
        "세 수의 덧셈에서 더하는 순서를 바꾸어도 결과가 같음을 직관적으로 이해.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "앞에서부터 더한 결과와 합이 10이 되는 두 수를 먼저 더한 결과를 비교하는 활동으로 결합법칙을 직관적으로 이해하게 한다")],
    ),
    concept(
        "e12_box_expressions",
        "□가 사용된 덧셈식과 뺄셈식",
        UNIT_ADDSUB,
        "representation",
        "□가 들어간 덧셈식과 뺄셈식 표현.",
        [ref("printed p. 11; [2수01-09]", "achievement_standard", "□가 사용된 덧셈식과 뺄셈식을 만든다는 진술")],
        notes="□의 값을 직관적으로 구할 수 있는 수준으로 다룬다(printed p. 12).",
    ),
    concept(
        "e12_box_value",
        "□의 값 구하기",
        UNIT_ADDSUB,
        "procedure",
        "□가 사용된 덧셈식과 뺄셈식에서 □의 값을 구하는 활동.",
        [ref("printed p. 11; [2수01-09]", "achievement_standard", "□의 값을 구할 수 있다는 진술")],
    ),
    concept(
        "e12_addsub_problem_posing",
        "덧셈과 뺄셈 문제 만들고 해결하기",
        UNIT_ADDSUB,
        "procedure",
        "친근한 실생활 상황을 이용하여 덧셈과 뺄셈 문제를 만들고 해결하는 활동.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "실생활 상황을 이용하여 덧셈과 뺄셈에 관련된 문제를 만들고 해결하게 한다")],
    ),
    # ---------- 한 자리 수의 곱셈 ----------
    concept(
        "e12_mul",
        "곱셈",
        UNIT_MUL,
        "core_concept",
        "같은 수를 여러 번 더하는 상황을 나타내는 연산.",
        [
            ref("printed p. 11 용어와 기호", "term_list", "수와 연산 영역 용어 목록의 곱셈"),
            ref("printed p. 11; [2수01-10]", "achievement_standard", "실생활 상황과 연결하여 곱셈의 의미를 이해한다는 진술"),
        ],
    ),
    concept(
        "e12_mul_meaning",
        "곱셈의 의미",
        UNIT_MUL,
        "sub_concept",
        "곱셈이 이루어지는 실생활 상황과 연결하여 이해하는 곱셈의 의미.",
        [ref("printed p. 11; [2수01-10]", "achievement_standard", "곱셈의 의미를 이해한다는 진술")],
    ),
    concept(
        "e12_mul_bae",
        "배의 개념",
        UNIT_MUL,
        "sub_concept",
        "몇 배로 나타내는 곱셈의 기초 개념.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "곱셈의 의미는 배의 개념과 동수누가를 통하여 다룬다")],
    ),
    concept(
        "e12_mul_repeated_addition",
        "동수누가",
        UNIT_MUL,
        "sub_concept",
        "같은 수를 거듭 더하는 것으로 곱셈의 의미를 다루는 방식.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "곱셈의 의미는 배의 개념과 동수누가를 통하여 다룬다")],
    ),
    concept(
        "e12_mul_zero_one",
        "1의 곱과 0의 곱",
        UNIT_MUL,
        "sub_concept",
        "1을 곱하는 경우와 0을 곱하는 경우.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "1의 곱과 0의 곱은 실생활과 관련지어 다룬다")],
    ),
    concept(
        "e12_gugu",
        "곱셈구구",
        UNIT_MUL,
        "core_concept",
        "한 자리 수끼리의 곱을 정리한 곱셈의 기본 사실.",
        [ref("printed p. 11; [2수01-11]", "achievement_standard", "곱셈구구를 이해하고 한 자리 수의 곱셈을 할 수 있다는 진술")],
    ),
    concept(
        "e12_single_digit_mul",
        "한 자리 수의 곱셈하기",
        UNIT_MUL,
        "procedure",
        "곱셈구구를 바탕으로 한 자리 수의 곱셈을 하는 활동.",
        [ref("printed p. 11; [2수01-11]", "achievement_standard", "한 자리 수의 곱셈을 할 수 있다는 진술")],
    ),
    concept(
        "e12_mul_expression",
        "곱셈식",
        UNIT_MUL,
        "representation",
        "곱셈을 식으로 나타낸 표현.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "덧셈식, 뺄셈식, 곱셈식에서 등호 양쪽의 양이 서로 같음을 이해하게 한다")],
    ),
    concept(
        "e12_mul_symbol",
        "곱셈 기호 ×",
        UNIT_MUL,
        "term",
        "곱셈을 나타내는 기호 ×.",
        [ref("printed p. 11 용어와 기호", "term_list", "수와 연산 영역 기호 목록에서 추출 확인된 ×")],
        notes=SYMBOL_EXTRACTION_NOTE,
    ),
    concept(
        "e12_mul_table",
        "곱셈표",
        UNIT_MUL,
        "representation",
        "곱셈의 결과를 표로 정리한 표현.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "곱셈표를 이용해서 두 수를 바꾸어 곱해도 곱이 같음을 비교하게 한다")],
        notes="변화와 관계 영역 고려 사항(printed p. 13)에서도 수 배열표·덧셈표와 함께 규칙 찾기에 활용된다.",
    ),
    concept(
        "e12_mul_comm",
        "곱셈의 교환법칙 직관적 이해",
        UNIT_MUL,
        "property",
        "두 수를 바꾸어 곱해도 곱이 같음을 직관적으로 이해.",
        [ref("printed p. 12 적용 시 고려 사항", "teaching_note", "곱셈표로 두 수를 바꾸어 곱해도 곱이 같음을 비교하는 활동으로 교환법칙을 직관적으로 이해하게 한다")],
    ),
]

# (source_id, target_id, relationship_type, confidence, locator, summary, notes)
NUMBER_EDGE_DEFS = [
    # 포함 관계
    ("e12_num_zero_to_100", "e12_num_counting", "contains", "high", "printed p. 11; [2수01-01]", "수 개념 이해와 함께 수를 세는 활동이 같은 성취기준에 묶여 있다", ""),
    ("e12_num_zero_to_100", "e12_num_reading", "contains", "high", "printed p. 11; [2수01-01]", "수 개념 이해와 함께 수를 읽는 활동이 같은 성취기준에 묶여 있다", ""),
    ("e12_num_zero_to_100", "e12_num_writing", "contains", "high", "printed p. 11; [2수01-01]", "수 개념 이해와 함께 수를 쓰는 활동이 같은 성취기준에 묶여 있다", ""),
    ("e12_num_counting", "e12_num_grouped_counting", "contains", "high", "printed p. 12 적용 시 고려 사항", "묶어 세기는 수 세기의 한 방법으로 제시된다", ""),
    ("e12_num_counting", "e12_num_skip_counting", "contains", "high", "printed p. 12 적용 시 고려 사항", "뛰어 세기는 수 세기의 한 방법으로 제시된다", ""),
    ("e12_num_place_value", "e12_num_zero_in_place", "contains", "medium", "printed p. 12 적용 시 고려 사항", "0이 있는 자릿값은 자릿값 이해를 위한 활용 사례다", ""),
    ("e12_add", "e12_addsub_meaning", "contains", "high", "printed p. 11; [2수01-05]", "덧셈의 의미는 덧셈 아래의 하위 개념이다", ""),
    ("e12_sub", "e12_addsub_meaning", "contains", "high", "printed p. 11; [2수01-05]", "뺄셈의 의미는 뺄셈 아래의 하위 개념이다", ""),
    ("e12_add", "e12_addsub_two_digit_principle", "contains", "high", "printed p. 11; [2수01-06]", "두 자리 수 덧셈의 계산 원리는 덧셈의 하위 개념이다", ""),
    ("e12_sub", "e12_addsub_two_digit_principle", "contains", "high", "printed p. 11; [2수01-06]", "두 자리 수 뺄셈의 계산 원리는 뺄셈의 하위 개념이다", ""),
    ("e12_equal_sign", "e12_equal_both_sides", "contains", "high", "printed p. 12 적용 시 고려 사항", "등호 양쪽의 양이 같음은 등호에 대한 성질이다", ""),
    ("e12_mul", "e12_mul_meaning", "contains", "high", "printed p. 11; [2수01-10]", "곱셈의 의미는 곱셈 아래의 하위 개념이다", ""),
    ("e12_mul", "e12_mul_zero_one", "contains", "high", "printed p. 12 적용 시 고려 사항", "1의 곱과 0의 곱은 곱셈 아래의 하위 사례다", ""),
    ("e12_mul", "e12_gugu", "contains", "high", "printed p. 11; [2수01-11]", "곱셈구구는 곱셈 아래의 하위 개념이다", ""),
    # 선수 관계
    ("e12_num_zero_to_100", "e12_num_place_value", "prerequisite_for", "medium", "printed p. 11; [2수01-01]~[2수01-02]", "100까지의 수 개념에서 네 자리 이하의 수로 범위를 넓히는 성취기준 구성", "성취기준 배열 순서에서 추론한 관계다."),
    ("e12_num_ten_bundles", "e12_num_positional_notation", "prerequisite_for", "high", "printed p. 12 적용 시 고려 사항", "10개씩 묶음과 낱개 표현으로 위치적 기수법의 기초 개념을 형성하게 한다", ""),
    ("e12_num_place_value", "e12_num_four_digit_read_write", "prerequisite_for", "high", "printed p. 11; [2수01-02]", "자릿값 이해를 바탕으로 네 자리 이하의 수를 읽고 쓴다", ""),
    ("e12_num_positional_notation", "e12_num_four_digit_read_write", "prerequisite_for", "high", "printed p. 11; [2수01-02]", "위치적 기수법 이해를 바탕으로 네 자리 이하의 수를 읽고 쓴다", ""),
    ("e12_num_sequence", "e12_num_compare", "prerequisite_for", "medium", "printed p. 11; [2수01-03]", "수의 계열을 이해하고 수의 크기를 비교한다는 진술 순서", "한 성취기준 안의 진술 순서에서 추론한 관계다."),
    ("e12_addsub_two_digit_principle", "e12_addsub_two_digit_calc", "prerequisite_for", "high", "printed p. 11; [2수01-06]", "계산 원리를 이해하고 그 계산을 할 수 있다는 진술 구조", ""),
    ("e12_addsub_two_digit_calc", "e12_three_number_addsub", "prerequisite_for", "medium", "printed p. 11; [2수01-06]~[2수01-08]", "두 수의 덧셈과 뺄셈에서 세 수의 덧셈과 뺄셈으로 확장하는 성취기준 구성", "성취기준 배열 순서에서 추론한 관계다."),
    ("e12_addsub_two_digit_calc", "e12_box_value", "prerequisite_for", "medium", "printed p. 11; [2수01-06], [2수01-09]", "□의 값 구하기는 덧셈과 뺄셈 계산을 전제로 한다", "문서가 직접 순서를 말하지 않으므로 medium을 유지한다."),
    ("e12_add", "e12_mul_repeated_addition", "prerequisite_for", "medium", "printed p. 12 적용 시 고려 사항", "동수누가는 같은 수를 거듭 더하는 방식이므로 덧셈을 전제로 한다", "문서가 직접 순서를 말하지 않으므로 medium을 유지한다."),
    ("e12_gugu", "e12_single_digit_mul", "prerequisite_for", "high", "printed p. 11; [2수01-11]", "곱셈구구를 이해하고 한 자리 수의 곱셈을 할 수 있다는 진술 구조", ""),
    # 활용 관계
    ("e12_num_decompose_compose", "e12_num_sense", "used_in", "high", "printed p. 11; [2수01-04]", "분해와 합성 활동을 통하여 수 감각을 기른다", ""),
    ("e12_addsub_everyday_words", "e12_addsub_meaning", "used_in", "high", "printed p. 12 적용 시 고려 사항", "일상용어를 사용하여 덧셈과 뺄셈의 의미에 친숙하게 한다", ""),
    ("e12_one_situation_two_expressions", "e12_addsub_relation", "used_in", "high", "printed p. 12 적용 시 고려 사항", "한 상황을 두 식으로 나타내는 활동으로 덧셈과 뺄셈의 관계를 이해하게 한다", ""),
    ("e12_three_number_addsub", "e12_add_assoc", "used_in", "high", "printed p. 12 적용 시 고려 사항", "세 수의 덧셈 결과를 비교하는 활동으로 결합법칙을 직관적으로 이해하게 한다", ""),
    ("e12_flexible_calc", "e12_operation_sense", "used_in", "high", "printed p. 12 적용 시 고려 사항", "여러 가지 방법으로 계산하는 활동을 통하여 연산 감각을 기르게 한다", ""),
    ("e12_box_expressions", "e12_box_value", "used_in", "high", "printed p. 11; [2수01-09]", "□가 사용된 식을 만들고 그 식에서 □의 값을 구한다", ""),
    ("e12_add", "e12_addsub_problem_posing", "used_in", "high", "printed p. 12 적용 시 고려 사항", "실생활 상황으로 덧셈 문제를 만들고 해결하게 한다", ""),
    ("e12_sub", "e12_addsub_problem_posing", "used_in", "high", "printed p. 12 적용 시 고려 사항", "실생활 상황으로 뺄셈 문제를 만들고 해결하게 한다", ""),
    ("e12_mul_bae", "e12_mul_meaning", "used_in", "high", "printed p. 12 적용 시 고려 사항", "곱셈의 의미는 배의 개념을 통하여 다룬다", ""),
    ("e12_mul_repeated_addition", "e12_mul_meaning", "used_in", "high", "printed p. 12 적용 시 고려 사항", "곱셈의 의미는 동수누가를 통하여 다룬다", ""),
    ("e12_mul_table", "e12_mul_comm", "used_in", "high", "printed p. 12 적용 시 고려 사항", "곱셈표를 이용해 두 수를 바꾸어 곱한 결과를 비교하여 교환법칙을 이해하게 한다", ""),
    ("e12_num_need_for_numbers", "e12_num_zero_to_100", "used_in", "high", "printed p. 11; [2수01-01]", "수의 필요성을 인식하면서 수 개념을 이해한다", ""),
    ("e12_equal_sign", "e12_add_expression", "used_in", "high", "printed p. 12 적용 시 고려 사항", "덧셈식에서 등호 양쪽의 양이 같음을 이해하게 한다", ""),
    ("e12_equal_sign", "e12_sub_expression", "used_in", "high", "printed p. 12 적용 시 고려 사항", "뺄셈식에서 등호 양쪽의 양이 같음을 이해하게 한다", ""),
    ("e12_equal_sign", "e12_mul_expression", "used_in", "high", "printed p. 12 적용 시 고려 사항", "곱셈식에서 등호 양쪽의 양이 같음을 이해하게 한다", ""),
    ("e12_num_pairing_even_odd", "e12_num_even", "used_in", "high", "printed p. 12 적용 시 고려 사항", "둘씩 묶어 보는 활동을 통하여 짝수를 직관적으로 이해하게 한다", ""),
    ("e12_num_pairing_even_odd", "e12_num_odd", "used_in", "high", "printed p. 12 적용 시 고려 사항", "둘씩 묶어 보는 활동을 통하여 홀수를 직관적으로 이해하게 한다", ""),
    # 표현 관계
    ("e12_add", "e12_add_expression", "represented_by", "high", "printed p. 12 적용 시 고려 사항", "덧셈은 덧셈식으로 나타낸다", ""),
    ("e12_sub", "e12_sub_expression", "represented_by", "high", "printed p. 12 적용 시 고려 사항", "뺄셈은 뺄셈식으로 나타낸다", ""),
    ("e12_mul", "e12_mul_expression", "represented_by", "high", "printed p. 12 적용 시 고려 사항", "곱셈은 곱셈식으로 나타낸다", ""),
    ("e12_mul", "e12_mul_symbol", "represented_by", "high", "printed p. 11 용어와 기호", "곱셈은 기호 ×로 나타낸다", ""),
    ("e12_gugu", "e12_mul_table", "represented_by", "medium", "printed p. 12 적용 시 고려 사항", "곱셈표는 곱셈의 결과를 표로 정리한 표현이다", "곱셈구구와 곱셈표의 직접 연결 문장은 없으므로 medium을 유지한다."),
    ("e12_num_positional_notation", "e12_num_ten_bundles", "represented_by", "high", "printed p. 12 적용 시 고려 사항", "10개씩 묶음과 낱개 표현이 위치적 기수법의 기초를 나타낸다", ""),
    # 연관 관계
    ("e12_num_even", "e12_num_odd", "related_to", "high", "printed p. 11 용어와 기호", "짝수와 홀수는 같은 용어 목록에서 함께 다루는 개념 쌍이다", ""),
    ("e12_num_number_uses", "e12_num_need_for_numbers", "related_to", "high", "printed p. 11~12 적용 시 고려 사항", "자연수의 쓰임을 알고 실생활 사례로 수의 필요성을 인식하게 한다는 같은 고려 사항 문장", ""),
    ("e12_add_comm", "e12_add_assoc", "related_to", "medium", "printed p. 12 적용 시 고려 사항", "둘 다 덧셈 연산 법칙의 직관적 이해로 함께 제시된다", ""),
]


# 학년군 데이터 모듈을 병합한 전체 concept/edge 정의.
CONCEPTS = NUMBER_CONCEPTS + e12_rest.CONCEPTS + e34.CONCEPTS
EDGE_DEFS = NUMBER_EDGE_DEFS + e12_rest.EDGE_DEFS + e34.EDGE_DEFS


def build_edges() -> list[dict]:
    edges = []
    for i, (src, dst, rel, conf, locator, summary, notes) in enumerate(EDGE_DEFS, start=1):
        edges.append(
            {
                "id": f"e12_edge_{i:03d}",
                "source_id": src,
                "target_id": dst,
                "relationship_type": rel,
                "source_refs": [ref(locator, "relationship_evidence", summary)],
                "notes": notes,
                "confidence": conf,
            }
        )
    return edges


def sync_arrays(concepts: list[dict], edges: list[dict]) -> None:
    """edge에서 parent_ids/prerequisite_ids/related_ids 배열을 파생시켜 동기화한다."""
    by_id = {c["id"]: c for c in concepts}
    for edge in edges:
        src, dst = edge["source_id"], edge["target_id"]
        rel = edge["relationship_type"]
        if rel == "contains":
            if src not in by_id[dst]["parent_ids"]:
                by_id[dst]["parent_ids"].append(src)
        elif rel == "prerequisite_for":
            if src not in by_id[dst]["prerequisite_ids"]:
                by_id[dst]["prerequisite_ids"].append(src)
        elif rel == "related_to":
            if dst not in by_id[src]["related_ids"]:
                by_id[src]["related_ids"].append(dst)
            if src not in by_id[dst]["related_ids"]:
                by_id[dst]["related_ids"].append(src)


def prerequisite_graph_is_acyclic(edges: list[dict]) -> bool:
    adjacency: dict[str, list[str]] = {}
    for edge in edges:
        if edge["relationship_type"] != "prerequisite_for":
            continue
        adjacency.setdefault(edge["source_id"], []).append(edge["target_id"])
    state: dict[str, int] = {}

    def visit(node: str) -> bool:
        state[node] = 1
        for nxt in adjacency.get(node, []):
            if state.get(nxt) == 1:
                return False
            if state.get(nxt) != 2 and not visit(nxt):
                return False
        state[node] = 2
        return True

    return all(visit(node) for node in list(adjacency) if state.get(node) != 2)


def source_ref_summary(source_refs: list[dict]) -> str:
    parts = []
    for r in source_refs:
        parts.append(f"{r['source_id']}:{r['locator']} - {r['summary']}")
    return "; ".join(parts)


def render_md(concepts: list[dict], edges: list[dict]) -> str:
    unit_counts: dict[str, int] = {}
    for c in concepts:
        key = f"{c['grade']} · {c['domain']} · {c['unit']}"
        unit_counts[key] = unit_counts.get(key, 0) + 1
    type_counts: dict[str, int] = {}
    for c in concepts:
        type_counts[c["concept_type"]] = type_counts.get(c["concept_type"], 0) + 1
    rel_counts: dict[str, int] = {}
    for e in edges:
        rel_counts[e["relationship_type"]] = rel_counts.get(e["relationship_type"], 0) + 1

    lines = [
        "# 초등학교 미시 concept",
        "",
        "2022 개정 수학과 교육과정(별책8)의 초등학교 성취기준 구간(인쇄 페이지 p.11~24)을",
        "학년군·영역별 미시 concept과 관계 edge로 분해한 산출물이다.",
        "",
        "## 범위와 출처 규칙 (2026-07-06 사용자 결정)",
        "",
        "- 모든 concept과 edge는 별책8 원문에서 추출한 성취기준 진술, 성취기준 해설, 적용 시 고려 사항,",
        "  용어·기호 목록의 문장에 근거하며, source_refs에 인쇄 페이지 위치를 남긴다.",
        "- 모델 지식만으로 개념을 추가하지 않는다. 외국 교육과정 개념 혼입과 한국 교과서 내용 누락을 막기 위함이다.",
        "- 교과서 원본(`교과서_원본/`)이 아직 없으므로 교과서 본문·예제 근거는 전부 pending 상태다.",
        "- 고등학교 선택 과목은 이 작업 전체에서 제외한다(AGENTS.md Math Concept Map Scope Rules).",
        "",
        "## 데이터 규모",
        "",
        f"- concept: {len(concepts)}개",
        *[f"  - {unit}: {count}개" for unit, count in unit_counts.items()],
        f"- edge: {len(edges)}개 ({', '.join(f'{k} {v}' for k, v in sorted(rel_counts.items()))})",
        f"- concept type 분포: {', '.join(f'{k} {v}' for k, v in sorted(type_counts.items()))}",
        "",
        "## 알려진 추출 한계",
        "",
        f"- {SYMBOL_EXTRACTION_NOTE}",
        "- 오개념(misconception_risk) 노드는 이 구간의 공식 문서가 학생 오류를 직접 서술하지 않으므로 추가하지 않았다.",
        "",
        "## 다음 확장",
        "",
        "- 같은 방식으로 초3-4, 초5-6, 고등 공통수학1·2로 확장하고, `k12-spine-nodes.csv`의 성취기준 코드로 spine과 조인한다.",
        "- 초등 교과서 PDF가 추가되면 중학교와 같은 교과서 근거 패킷 체계를 적용한다.",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    concepts = [dict(c, prerequisite_ids=[], parent_ids=[], related_ids=[]) for c in CONCEPTS]
    edges = build_edges()
    sync_arrays(concepts, edges)

    ids = [c["id"] for c in concepts]
    if len(ids) != len(set(ids)):
        raise SystemExit("concept id 중복이 있습니다.")
    id_set = set(ids)
    for edge in edges:
        if edge["source_id"] not in id_set or edge["target_id"] not in id_set:
            raise SystemExit(f"정의되지 않은 concept을 참조하는 edge: {edge['id']}")
    if not prerequisite_graph_is_acyclic(edges):
        raise SystemExit("prerequisite_for edge에 순환이 있습니다.")
    for c in concepts:
        if not c["source_refs"]:
            raise SystemExit(f"source_refs가 없는 concept: {c['id']}")

    data = {
        "metadata": {
            "title": "초등학교 수학 개념 위계 Map (파일럿)",
            "schema_version": "0.1.0",
            "generated_at": datetime.now().isoformat(timespec="seconds"),
            "pilot_scope": "초등학교 1~2학년군([2수01-01]~[2수04-03])과 3~4학년군([4수01-01]~[4수04-03]) 전체 영역",
            "scope_rules": "2026-07-06 사용자 결정: 고등학교 선택 과목 제외, 공식 원문 출처만 사용 (AGENTS.md Math Concept Map Scope Rules)",
            "concept_count": len(concepts),
            "edge_count": len(edges),
        },
        "sources": SOURCES,
        "concepts": concepts,
        "edges": edges,
    }
    CONCEPTS_JSON.write_text(
        json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )

    with CONCEPTS_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(
            ["id", "label_ko", "aliases", "grade", "domain", "unit", "concept_type",
             "short_definition", "source_refs", "prerequisite_ids", "parent_ids",
             "related_ids", "notes", "confidence"]
        )
        for c in concepts:
            writer.writerow(
                [c["id"], c["label_ko"], "; ".join(c["aliases"]), c["grade"], c["domain"],
                 c["unit"], c["concept_type"], c["short_definition"],
                 source_ref_summary(c["source_refs"]), "; ".join(c["prerequisite_ids"]),
                 "; ".join(c["parent_ids"]), "; ".join(c["related_ids"]), c["notes"],
                 c["confidence"]]
            )

    with EDGES_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(
            ["id", "source_id", "target_id", "relationship_type", "source_refs", "notes", "confidence"]
        )
        for e in edges:
            writer.writerow(
                [e["id"], e["source_id"], e["target_id"], e["relationship_type"],
                 source_ref_summary(e["source_refs"]), e["notes"], e["confidence"]]
            )

    PILOT_MD.write_text(render_md(concepts, edges), encoding="utf-8")
    print(f"concepts: {len(concepts)}, edges: {len(edges)}")


if __name__ == "__main__":
    main()
