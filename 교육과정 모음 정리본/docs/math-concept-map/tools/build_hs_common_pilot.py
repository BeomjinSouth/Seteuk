from __future__ import annotations

import csv
import json
from datetime import datetime
from pathlib import Path

from elementary_common import SOURCES, concept, ref

ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "hs-common-concepts.json"
CONCEPTS_CSV = OUT_DIR / "hs-common-concepts.csv"
EDGES_CSV = OUT_DIR / "hs-common-edges.csv"
PILOT_MD = OUT_DIR / "hs-common-pilot.md"

# 고등학교 공통 과목(공통수학1·2) 미시 concept.
# 근거: 별책8 인쇄 p.57~67 (PDF p.63~73)의 성취기준·해설·적용 시 고려 사항·용어와 기호.
# 2026-07-06 사용자 결정: 선택 과목 제외. 기본수학1·2는 공통수학의 대체 경로이므로 이번 분해에서 제외한다.

GRADE = "고1"

SYMBOL_NOTE = (
    "용어·기호 목록의 수학 기호 일부는 한글 수식 글꼴(HyhwpEQ) 문제로 텍스트 추출이 되지 않아 "
    "원문 시각 확인 또는 교과서 확인 전까지 concept으로 추가하지 않는다."
)


def m1(cid, label, unit, ctype, sdef, refs, **kw):
    return concept(cid, label, GRADE, "공통수학1", unit, ctype, sdef, refs, **kw)


def m2(cid, label, unit, ctype, sdef, refs, **kw):
    return concept(cid, label, GRADE, "공통수학2", unit, ctype, sdef, refs, **kw)


def std(page, code, summary):
    return ref(f"printed p. {page}; [{code}]", "achievement_standard", summary)


def note(page, summary):
    return ref(f"printed p. {page} 성취기준 해설", "achievement_standard_note", summary)


def tnote(page, summary):
    return ref(f"printed p. {page} 적용 시 고려 사항", "teaching_note", summary)


def term(page, name):
    return ref(f"printed p. {page} 용어와 기호", "term_list", f"용어 목록의 {name}")


CONCEPTS = [
    # ========== 공통수학1: 다항식 ==========
    m1("hs1_poly_ops", "다항식의 사칙연산", "다항식", "procedure",
       "다항식의 사칙연산의 원리를 설명하고 계산하는 활동.",
       [std(60, "10공수1-01-01", "다항식의 사칙연산의 원리를 설명하고 계산할 수 있다는 진술")],
       notes="중학교에서 학습한 내용을 토대로 고등학교에서 추가된 내용을 이해하게 한다(printed p. 60)."),
    m1("hs1_identity", "항등식의 성질", "다항식", "property",
       "항등식이 가지는 성질.",
       [std(60, "10공수1-01-02", "항등식의 성질과 나머지정리를 이해하고 활용한다는 진술")],
       notes="항등식의 성질을 활용하는 복잡한 문제는 다루지 않는다(printed p. 60)."),
    m1("hs1_undetermined", "미정계수법", "다항식", "term",
       "항등식의 성질을 이용해 미지의 계수를 정하는 방법을 가리키는 공식 용어.",
       [term(60, "미정계수법")]),
    m1("hs1_remainder_thm", "나머지정리", "다항식", "core_concept",
       "다항식을 일차식으로 나눈 나머지에 관한 정리.",
       [term(60, "나머지정리"), std(60, "10공수1-01-02", "나머지정리를 이해하고 활용하여 문제를 해결한다는 진술")]),
    m1("hs1_factor_thm", "인수정리", "다항식", "term",
       "다항식의 인수와 나머지의 관계를 나타내는 정리를 가리키는 공식 용어.",
       [term(60, "인수정리")]),
    m1("hs1_synthetic_div", "조립제법", "다항식", "term",
       "다항식을 일차식으로 나누는 계산을 간단히 하는 방법.",
       [term(60, "조립제법"),
        tnote(60, "중학교에서 학습한 다항식을 단항식으로 나누는 연산과 연계하여 이해하게 하고 간단히 다룬다")]),
    m1("hs1_factorization", "다항식의 인수분해", "다항식", "procedure",
       "다항식을 인수분해하는 활동.",
       [std(60, "10공수1-01-03", "다항식의 인수분해를 할 수 있다는 진술"),
        note(60, "인수분해로 다루는 경우가 해설에 제시된다")],
       notes="해설의 인수분해 공식 목록은 수식 글꼴 문제로 텍스트 추출이 되지 않았다. 복잡한 인수분해 문제는 다루지 않는다(printed p. 60). " + SYMBOL_NOTE),
    # ========== 공통수학1: 방정식과 부등식 ==========
    m1("hs1_imaginary_unit", "허수단위", "방정식과 부등식", "term",
       "복소수 도입에 쓰는 허수단위를 가리키는 공식 용어.",
       [term(61, "허수단위")]),
    m1("hs1_complex", "복소수", "방정식과 부등식", "core_concept",
       "실수부분과 허수부분으로 이루어진 수.",
       [term(61, "복소수, 실수부분, 허수부분, 허수"), std(61, "10공수1-02-01", "복소수의 뜻과 성질을 설명한다는 진술")],
       aliases=["실수부분", "허수부분", "허수"]),
    m1("hs1_conjugate", "켤레복소수", "방정식과 부등식", "term",
       "허수부분의 부호를 바꾼 복소수.",
       [term(61, "켤레복소수"),
        tnote(61, "복소수의 나눗셈은 켤레복소수를 이용하여 계산하게 한다")]),
    m1("hs1_complex_ops", "복소수의 사칙연산", "방정식과 부등식", "procedure",
       "복소수의 사칙연산을 수행하는 활동.",
       [std(61, "10공수1-02-01", "복소수의 사칙연산을 수행할 수 있다는 진술"),
        tnote(61, "중학교에서 학습한 실수의 성질과 사칙연산과 연계하여 이해하게 한다")]),
    m1("hs1_real_imag_roots", "이차방정식의 실근과 허근", "방정식과 부등식", "sub_concept",
       "이차방정식이 가지는 실근과 허근.",
       [term(61, "실근, 허근"), std(61, "10공수1-02-02", "이차방정식의 실근과 허근을 이해한다는 진술"),
        note(61, "계수가 실수인 이차방정식은 복소수 범위에서 항상 근을 가짐을 이해하게 한다")],
       aliases=["실근", "허근"]),
    m1("hs1_discriminant", "판별식", "방정식과 부등식", "core_concept",
       "이차방정식의 근을 판별하는 식.",
       [term(61, "판별식"), std(61, "10공수1-02-02", "판별식을 이용하여 이차방정식의 근을 판별한다는 진술")],
       notes="판별식을 활용하는 지나치게 복잡한 문제는 다루지 않는다(printed p. 61)."),
    m1("hs1_root_coeff", "이차방정식의 근과 계수의 관계", "방정식과 부등식", "property",
       "이차방정식의 근과 계수 사이의 관계.",
       [std(61, "10공수1-02-03", "근과 계수의 관계를 설명할 수 있다는 진술")]),
    m1("hs1_quad_eq_func", "이차방정식과 이차함수의 관계", "방정식과 부등식", "property",
       "이차방정식과 이차함수를 연결하여 설명하는 관계.",
       [std(61, "10공수1-02-04", "이차방정식과 이차함수를 연결하여 그 관계를 설명한다는 진술")]),
    m1("hs1_graph_line", "이차함수의 그래프와 직선의 위치 관계", "방정식과 부등식", "procedure",
       "이차함수의 그래프와 직선의 위치 관계를 판단하는 활동.",
       [std(61, "10공수1-02-05", "이차함수의 그래프와 직선의 위치 관계를 판단할 수 있다는 진술")],
       notes="탐구할 때 공학 도구를 이용할 수 있다(printed p. 62)."),
    m1("hs1_quad_maxmin", "이차함수의 최대와 최소", "방정식과 부등식", "procedure",
       "이차함수의 최대, 최소를 탐구하고 실생활과 연결하는 활동.",
       [std(61, "10공수1-02-06", "이차함수의 최대, 최소를 탐구하고 실생활과 연결한다는 진술"),
        note(61, "이차함수의 최대, 최소는 제한된 범위에서만 다룬다")]),
    m1("hs1_cubic_quartic", "삼차방정식과 사차방정식 풀기", "방정식과 부등식", "procedure",
       "간단한 삼차방정식과 사차방정식을 푸는 활동.",
       [std(61, "10공수1-02-07", "간단한 삼차방정식과 사차방정식을 풀 수 있다는 진술"),
        note(61, "계수가 실수이고 인수분해 공식이나 인수정리, 조립제법으로 풀 수 있는 경우만 다룬다")]),
    m1("hs1_system_quad", "연립이차방정식 풀기", "방정식과 부등식", "procedure",
       "미지수가 2개인 연립이차방정식을 푸는 활동.",
       [std(61, "10공수1-02-08", "미지수가 2개인 연립이차방정식을 풀 수 있다는 진술"),
        note(61, "일차식과 이차식이 한 개씩이거나 한 이차식이 간단히 인수분해 되는 경우만 다룬다")]),
    m1("hs1_system_ineq", "연립일차부등식 풀기", "방정식과 부등식", "procedure",
       "미지수가 1개인 연립일차부등식을 푸는 활동.",
       [term(61, "연립부등식"), std(61, "10공수1-02-09", "미지수가 1개인 연립일차부등식을 풀 수 있다는 진술"),
        tnote(62, "연립부등식은 중학교에서 학습한 연립일차방정식 내용을 토대로 이해하게 한다")]),
    m1("hs1_abs_ineq", "절댓값을 포함한 일차부등식 풀기", "방정식과 부등식", "procedure",
       "절댓값을 포함한 일차부등식을 푸는 활동.",
       [std(61, "10공수1-02-10", "절댓값을 포함한 일차부등식을 풀 수 있다는 진술")]),
    m1("hs1_quad_ineq", "이차부등식과 연립이차부등식 풀기", "방정식과 부등식", "procedure",
       "이차부등식과 이차함수의 관계를 설명하고 이차부등식과 연립이차부등식을 푸는 활동.",
       [std(61, "10공수1-02-11", "이차부등식과 이차함수를 연결하여 설명하고 풀 수 있다는 진술")],
       notes="이차함수의 그래프를 이용해 해를 탐구할 때 공학 도구를 이용할 수 있다(printed p. 62)."),
    # ========== 공통수학1: 경우의 수 ==========
    m1("hs1_addition_rule", "합의 법칙", "경우의 수", "core_concept",
       "두 사건의 경우의 수를 더하여 세는 법칙.",
       [term(62, "합의 법칙"), std(62, "10공수1-03-01", "합의 법칙과 곱의 법칙을 이해한다는 진술")],
       notes="중학교에서 학습한 경우의 수와 연계하여 간단히 다룬다(printed p. 62)."),
    m1("hs1_mult_rule", "곱의 법칙", "경우의 수", "core_concept",
       "잇달아 일어나는 사건의 경우의 수를 곱하여 세는 법칙.",
       [term(62, "곱의 법칙"), std(62, "10공수1-03-01", "합의 법칙과 곱의 법칙을 이해한다는 진술")],
       notes="두 법칙이 적용되는 상황의 차이점을 설명하게 할 수 있다(printed p. 62)."),
    m1("hs1_counting", "경우의 수 문제해결", "경우의 수", "procedure",
       "합의 법칙과 곱의 법칙 중 적절한 전략을 사용하여 경우의 수 문제를 해결하는 활동.",
       [std(62, "10공수1-03-01", "적절한 전략을 사용하여 경우의 수 문제를 해결한다는 진술")],
       notes="지나치게 복잡한 문제는 다루지 않는다(printed p. 62)."),
    m1("hs1_permutation", "순열", "경우의 수", "core_concept",
       "서로 다른 것에서 순서를 생각하여 택하는 배열.",
       [term(62, "순열"), std(62, "10공수1-03-02", "순열의 개념을 이해한다는 진술")]),
    m1("hs1_factorial", "계승", "경우의 수", "term",
       "1부터 어떤 자연수까지의 곱을 가리키는 공식 용어.",
       [term(62, "계승")]),
    m1("hs1_permutation_count", "순열의 수 구하기", "경우의 수", "procedure",
       "순열의 수를 구하는 방법을 설명하는 활동.",
       [std(62, "10공수1-03-02", "순열의 수를 구하는 방법을 설명할 수 있다는 진술"),
        tnote(62, "직접 나열하거나 수형도를 이용하는 등 다양한 방법으로 구하게 한다")]),
    m1("hs1_combination", "조합", "경우의 수", "core_concept",
       "서로 다른 것에서 순서를 생각하지 않고 택하는 것.",
       [term(62, "조합"), std(62, "10공수1-03-03", "조합의 개념을 이해한다는 진술")]),
    m1("hs1_combination_count", "조합의 수 구하기", "경우의 수", "procedure",
       "조합의 수를 구하는 방법을 설명하는 활동.",
       [std(62, "10공수1-03-03", "조합의 수를 구하는 방법을 설명할 수 있다는 진술")]),
    # ========== 공통수학1: 행렬 ==========
    m1("hs1_matrix", "행렬", "행렬", "core_concept",
       "수를 직사각형 모양으로 배열한 것.",
       [term(63, "행렬, m×n 행렬"), std(63, "10공수1-04-01", "행렬의 뜻을 안다는 진술")]),
    m1("hs1_matrix_elements", "행·열·성분", "행렬", "term",
       "행렬의 구성 요소를 가리키는 공식 용어.",
       [term(63, "행, 열, 성분")],
       aliases=["행", "열", "성분"]),
    m1("hs1_matrix_represent", "실생활 상황을 행렬로 표현하기", "행렬", "procedure",
       "실생활 자료를 행렬로 표현하는 활동.",
       [std(63, "10공수1-04-01", "실생활 상황을 행렬로 표현할 수 있다는 진술"),
        tnote(63, "직사각형 모양으로 나타낼 수 있는 실생활 자료를 찾아 유용성을 인식하게 한다")]),
    m1("hs1_matrix_ops", "행렬의 연산", "행렬", "procedure",
       "행렬의 덧셈, 뺄셈, 실수배, 곱셈을 수행하고 문제를 해결하는 활동.",
       [std(63, "10공수1-04-02", "행렬의 연산을 수행하고 문제를 해결한다는 진술"),
        note(63, "덧셈, 뺄셈, 실수배, 곱셈을 다루고 행과 열의 수가 2를 넘지 않는 범위에서 곱셈을 하게 한다")],
       notes="연산의 대수적 구조 성질을 일반화하여 법칙으로 다루지 않는다(printed p. 63)."),
    # ========== 공통수학2: 도형의 방정식 ==========
    m2("hs2_distance", "두 점 사이의 거리", "도형의 방정식", "sub_concept",
       "선분의 내분을 도입하기 전에 다루는 두 점 사이의 거리.",
       [note(65, "선분의 내분을 도입하기 전에 두 점 사이의 거리를 구하는 방법을 다룬다")]),
    m2("hs2_division", "선분의 내분과 내분점", "도형의 방정식", "core_concept",
       "선분을 주어진 비로 나누는 내분과 그 점의 좌표.",
       [term(65, "내분"), std(65, "10공수2-01-01", "선분의 내분을 이해하고 내분점의 좌표를 계산한다는 진술"),
        note(65, "내분은 수직선 위에서, 좌표평면 위에서 구할 수 있도록 점차 확장하여 다룬다")]),
    m2("hs2_line_condition", "두 직선의 평행 조건과 수직 조건", "도형의 방정식", "property",
       "좌표평면에서 두 직선이 평행하거나 수직이 되는 조건.",
       [std(65, "10공수2-01-02", "두 직선의 평행 조건과 수직 조건을 탐구하고 이해한다는 진술"),
        tnote(65, "중학교에서 학습한 일차방정식과 일차함수의 그래프, 직선의 방정식과 연계하여 다룰 수 있다")]),
    m2("hs2_point_line", "점과 직선 사이의 거리", "도형의 방정식", "procedure",
       "점과 직선 사이의 거리를 구하고 문제를 해결하는 활동.",
       [std(65, "10공수2-01-03", "점과 직선 사이의 거리를 구하고 문제를 해결한다는 진술")]),
    m2("hs2_circle_eq", "원의 방정식", "도형의 방정식", "core_concept",
       "원을 좌표평면 위의 방정식으로 나타낸 것.",
       [std(65, "10공수2-01-04", "원의 방정식을 구하고 그래프를 그릴 수 있다는 진술")],
       notes="'원의 방정식' 용어는 교수·학습 상황에서 사용할 수 있다(printed p. 65)."),
    m2("hs2_circle_line", "원과 직선의 위치 관계", "도형의 방정식", "procedure",
       "좌표평면에서 원과 직선의 위치 관계를 판단하고 활용하는 활동.",
       [std(65, "10공수2-01-05", "원과 직선의 위치 관계를 판단하고 활용하여 문제를 해결한다는 진술")]),
    m2("hs2_translation", "평행이동", "도형의 방정식", "core_concept",
       "도형을 일정한 방향과 거리만큼 옮기는 이동.",
       [std(65, "10공수2-01-06", "평행이동을 탐구하고 실생활과 연결하여 문제를 해결한다는 진술")],
       notes="좌표축의 평행이동은 다루지 않는다(printed p. 65)."),
    m2("hs2_reflection", "대칭이동", "도형의 방정식", "core_concept",
       "원점, x축, y축, 직선 y=x에 대한 대칭이동.",
       [term(65, "대칭이동"), std(65, "10공수2-01-07", "원점, x축, y축, 직선에 대한 대칭이동을 탐구한다는 진술")],
       notes="대상 직선 표기(y=x)는 수식 글꼴 문제로 텍스트 추출에서 일부 누락되었다. " + SYMBOL_NOTE),
    # ========== 공통수학2: 집합과 명제 ==========
    m2("hs2_set", "집합", "집합과 명제", "core_concept",
       "대상을 논리적으로 표현하고 이해하는 도구.",
       [term(66, "집합"), std(66, "10공수2-02-01", "집합의 개념을 이해하고 집합을 표현할 수 있다는 진술")],
       notes="집합의 개념은 이해하는 수준에서 간단히 평가한다(printed p. 66). '원소나열법', '조건제시법' 용어는 교수·학습 상황에서 사용할 수 있다."),
    m2("hs2_element", "원소와 공집합", "집합과 명제", "term",
       "집합을 이루는 대상과 원소가 하나도 없는 집합.",
       [term(66, "원소, 공집합")],
       aliases=["원소", "공집합"]),
    m2("hs2_subset", "부분집합과 포함관계", "집합과 명제", "sub_concept",
       "두 집합 사이의 포함관계와 부분집합.",
       [term(66, "부분집합, 진부분집합"), std(66, "10공수2-02-02", "두 집합 사이의 포함관계를 판단할 수 있다는 진술")],
       aliases=["부분집합", "진부분집합"]),
    m2("hs2_set_ops", "집합의 연산", "집합과 명제", "procedure",
       "합집합, 교집합, 여집합, 차집합을 수행하는 활동.",
       [term(66, "합집합, 교집합, 전체집합, 여집합, 차집합"), std(66, "10공수2-02-03", "집합의 연산을 수행하고 벤 다이어그램으로 나타낸다는 진술"),
        note(66, "연산 법칙(교환·결합·분배·드모르간)은 벤 다이어그램으로 확인하는 정도로 간단히 다룬다")],
       aliases=["합집합", "교집합", "여집합", "차집합"]),
    m2("hs2_venn", "벤 다이어그램", "집합과 명제", "representation",
       "집합과 그 연산을 나타내는 그림 표현.",
       [term(66, "벤 다이어그램"), std(66, "10공수2-02-03", "벤 다이어그램을 이용하여 나타낼 수 있다는 진술")]),
    m2("hs2_proposition", "명제와 조건", "집합과 명제", "core_concept",
       "참, 거짓을 판별할 수 있는 문장과 조건.",
       [term(66, "명제, 가정, 결론, 조건"), std(66, "10공수2-02-04", "명제와 조건의 뜻을 알고 '모든', '어떤'을 포함한 명제를 이해한다는 진술"),
        note(66, "명제와 조건의 뜻은 수학적인 문장을 이해하는 수준에서 간단히 다룬다")],
       aliases=["가정", "결론", "조건"]),
    m2("hs2_truth_set", "진리집합", "집합과 명제", "term",
       "조건을 참이 되게 하는 원소의 집합.",
       [term(66, "진리집합")]),
    m2("hs2_converse", "명제의 역과 대우", "집합과 명제", "sub_concept",
       "명제의 역과 대우.",
       [term(66, "역, 대우, 부정"), std(66, "10공수2-02-05", "명제의 역과 대우를 이해하고 설명할 수 있다는 진술")],
       aliases=["역", "대우", "부정"]),
    m2("hs2_conditions", "충분조건과 필요조건", "집합과 명제", "sub_concept",
       "충분조건, 필요조건, 필요충분조건.",
       [term(66, "충분조건, 필요조건, 필요충분조건"), std(66, "10공수2-02-06", "충분조건과 필요조건을 이해하고 판단할 수 있다는 진술")],
       aliases=["필요충분조건"],
       notes="구체적인 예를 통하여 이해하게 한다(printed p. 66)."),
    m2("hs2_proof", "대우 증명법과 귀류법", "집합과 명제", "procedure",
       "대우를 이용한 증명법과 귀류법으로 명제를 증명하는 활동.",
       [term(66, "귀류법"), std(66, "10공수2-02-07", "대우를 이용한 증명법과 귀류법을 이해하고 증명한다는 진술"),
        note(66, "대우를 이용한 증명법과 귀류법을 이용한 증명은 간단한 것만 다룬다")],
       notes="증명을 지도할 때는 직관적인 이해로부터 시작하여 점진적으로 형식화하게 한다(printed p. 66)."),
    m2("hs2_abs_ineq", "절대부등식", "집합과 명제", "core_concept",
       "문자를 포함한 식에서 항상 성립하는 부등식.",
       [term(66, "절대부등식"), std(66, "10공수2-02-08", "절대부등식의 뜻을 알고 간단한 절대부등식을 증명한다는 진술")]),
    # ========== 공통수학2: 함수와 그래프 ==========
    m2("hs2_function", "함수(두 집합 사이의 대응)", "함수와 그래프", "core_concept",
       "두 집합 사이의 대응으로 일반화된 함수.",
       [std(67, "10공수2-03-01", "함수의 개념을 설명하고 그 그래프를 이해한다는 진술"),
        note(67, "중학교에서 학습한 내용을 확장하여 두 집합 사이의 대응 관계로 이해하게 한다")]),
    m2("hs2_domain", "정의역·공역·치역", "함수와 그래프", "term",
       "함수를 이루는 집합을 가리키는 공식 용어.",
       [term(67, "정의역, 치역, 공역, 대응")],
       aliases=["정의역", "치역", "공역", "대응"]),
    m2("hs2_function_types", "일대일대응·항등함수·상수함수·일대일함수", "함수와 그래프", "term",
       "함수의 종류를 가리키는 공식 용어.",
       [term(67, "일대일대응, 항등함수, 상수함수, 일대일함수"),
        tnote(67, "의미는 구체적인 예를 통해 이해하게 한다")],
       aliases=["일대일대응", "항등함수", "상수함수", "일대일함수"]),
    m2("hs2_composition", "함수의 합성과 합성함수", "함수와 그래프", "procedure",
       "함수의 합성을 설명하고 합성함수를 구하는 활동.",
       [term(67, "합성함수"), std(67, "10공수2-03-02", "함수의 합성을 설명하고 합성함수를 구할 수 있다는 진술")]),
    m2("hs2_inverse", "역함수", "함수와 그래프", "procedure",
       "역함수의 개념을 설명하고 역함수를 구하는 활동.",
       [term(67, "역함수"), std(67, "10공수2-03-03", "역함수의 개념을 설명하고 역함수를 구할 수 있다는 진술")]),
    m2("hs2_rational_func", "유리함수와 그 그래프", "함수와 그래프", "core_concept",
       "유리식으로 나타내어지는 함수와 그 그래프.",
       [term(67, "유리식, 유리함수"), std(67, "10공수2-03-04", "유리함수의 그래프를 그리고 성질을 탐구한다는 진술"),
        note(67, "유리식은 유리함수의 의미를 이해할 정도로 간단히 다루고 기본적인 형태 중심의 간단한 문제만 다룬다")],
       aliases=["유리식"]),
    m2("hs2_asymptote", "점근선", "함수와 그래프", "term",
       "그래프가 한없이 가까워지는 직선을 가리키는 공식 용어.",
       [term(67, "점근선")]),
    m2("hs2_irrational_func", "무리함수와 그 그래프", "함수와 그래프", "core_concept",
       "무리식으로 나타내어지는 함수와 그 그래프.",
       [term(67, "무리식, 무리함수"), std(67, "10공수2-03-05", "무리함수의 그래프를 그리고 성질을 탐구한다는 진술"),
        note(67, "무리식은 무리함수의 의미를 이해할 정도로 간단히 다루고 기본적인 형태 중심의 간단한 문제만 다룬다")],
       aliases=["무리식"],
       notes="그래프와 성질을 탐구할 때 공학 도구를 이용할 수 있다(printed p. 67)."),
]

# (source_id, target_id, relationship_type, confidence, locator, summary, notes)
EDGE_DEFS = [
    # 공통수학1: 다항식
    ("hs1_identity", "hs1_undetermined", "used_in", "high", "printed p. 60 용어와 기호", "항등식의 성질을 이용하는 미정계수법을 다룬다", ""),
    ("hs1_identity", "hs1_remainder_thm", "related_to", "high", "printed p. 60; [10공수1-01-02]", "항등식의 성질과 나머지정리를 함께 다룬다", ""),
    ("hs1_remainder_thm", "hs1_factor_thm", "related_to", "high", "printed p. 60 적용 시 고려 사항", "나머지정리와 인수정리를 함께 다룬다", ""),
    ("hs1_poly_ops", "hs1_factorization", "prerequisite_for", "medium", "printed p. 60; [10공수1-01-01]~[10공수1-01-03]", "다항식 연산에서 인수분해로 이어지는 성취기준 구성", "성취기준 배열 순서에서 추론한 관계다."),
    ("hs1_factor_thm", "hs1_factorization", "used_in", "medium", "printed p. 60 적용 시 고려 사항", "인수정리가 인수분해와 연결된다", "문서가 관계를 직접 서술하지 않으므로 medium을 유지한다."),
    ("hs1_synthetic_div", "hs1_poly_ops", "related_to", "high", "printed p. 60 적용 시 고려 사항", "조립제법을 다항식 나눗셈 연산과 연계하여 이해하게 한다", ""),
    # 공통수학1: 방정식과 부등식
    ("hs1_imaginary_unit", "hs1_complex", "used_in", "high", "printed p. 61 용어와 기호", "허수단위로 복소수를 도입한다", ""),
    ("hs1_complex", "hs1_complex_ops", "used_in", "high", "printed p. 61; [10공수1-02-01]", "복소수의 사칙연산을 수행한다", ""),
    ("hs1_conjugate", "hs1_complex_ops", "used_in", "high", "printed p. 61 적용 시 고려 사항", "나눗셈은 켤레복소수를 이용하여 계산하게 한다", ""),
    ("hs1_complex", "hs1_real_imag_roots", "prerequisite_for", "high", "printed p. 61 성취기준 해설", "이차방정식이 복소수 범위에서 항상 근을 가짐을 이해하게 한다", ""),
    ("hs1_discriminant", "hs1_real_imag_roots", "used_in", "high", "printed p. 61; [10공수1-02-02]", "판별식을 이용하여 이차방정식의 근을 판별한다", ""),
    ("hs1_real_imag_roots", "hs1_root_coeff", "related_to", "medium", "printed p. 61; [10공수1-02-02]~[10공수1-02-03]", "근 판별과 근과 계수의 관계가 이어지는 구성", "성취기준 배열 순서에서 추론한 관계다."),
    ("hs1_quad_eq_func", "hs1_graph_line", "prerequisite_for", "high", "printed p. 61; [10공수1-02-04]~[10공수1-02-05]", "이차방정식·이차함수 관계를 바탕으로 그래프와 직선의 위치 관계를 판단하는 구성", ""),
    ("hs1_quad_eq_func", "hs1_quad_ineq", "used_in", "high", "printed p. 61; [10공수1-02-11]", "이차부등식과 이차함수를 연결하여 설명하고 푼다", ""),
    ("hs1_factorization", "hs1_cubic_quartic", "used_in", "high", "printed p. 61 성취기준 해설", "인수분해 공식이나 인수정리, 조립제법으로 풀 수 있는 경우만 다룬다", ""),
    ("hs1_factor_thm", "hs1_cubic_quartic", "used_in", "high", "printed p. 61 성취기준 해설", "인수정리를 이용하여 풀 수 있는 경우를 다룬다", ""),
    ("hs1_synthetic_div", "hs1_cubic_quartic", "used_in", "high", "printed p. 61 성취기준 해설", "조립제법을 이용하여 풀 수 있는 경우를 다룬다", ""),
    ("hs1_factorization", "hs1_system_quad", "used_in", "high", "printed p. 61 성취기준 해설", "한 이차식이 간단히 인수분해 되는 경우를 다룬다", ""),
    ("hs1_system_ineq", "hs1_quad_ineq", "prerequisite_for", "medium", "printed p. 61; [10공수1-02-09]~[10공수1-02-11]", "연립일차부등식에서 이차부등식으로 이어지는 구성", "성취기준 배열 순서에서 추론한 관계다."),
    ("hs1_graph_line", "hs1_quad_maxmin", "related_to", "medium", "printed p. 61~62; [10공수1-02-05]~[10공수1-02-06]", "이차함수 그래프 탐구 활동으로 함께 제시된다", "성취기준 배열 순서에서 추론한 관계다."),
    # 공통수학1: 경우의 수
    ("hs1_addition_rule", "hs1_counting", "used_in", "high", "printed p. 62; [10공수1-03-01]", "합의 법칙을 사용하여 경우의 수 문제를 해결한다", ""),
    ("hs1_mult_rule", "hs1_counting", "used_in", "high", "printed p. 62; [10공수1-03-01]", "곱의 법칙을 사용하여 경우의 수 문제를 해결한다", ""),
    ("hs1_addition_rule", "hs1_mult_rule", "contrasts_with", "high", "printed p. 62 적용 시 고려 사항", "두 법칙이 적용되는 상황의 차이점을 설명하게 한다", ""),
    ("hs1_mult_rule", "hs1_permutation", "prerequisite_for", "medium", "printed p. 62; [10공수1-03-01]~[10공수1-03-02]", "경우의 수 법칙에서 순열로 체계화되는 구성", "성취기준 배열 순서와 성격의 체계화 서술에서 추론한 관계다."),
    ("hs1_factorial", "hs1_permutation_count", "used_in", "high", "printed p. 62 용어와 기호", "계승으로 순열의 수를 나타낸다", ""),
    ("hs1_permutation", "hs1_permutation_count", "used_in", "high", "printed p. 62; [10공수1-03-02]", "순열의 수를 구하는 방법을 설명한다", ""),
    ("hs1_permutation", "hs1_combination", "related_to", "medium", "printed p. 62; [10공수1-03-02]~[10공수1-03-03]", "순열과 조합을 이어서 다루는 구성", "성취기준 배열 순서에서 추론한 관계다."),
    ("hs1_combination", "hs1_combination_count", "used_in", "high", "printed p. 62; [10공수1-03-03]", "조합의 수를 구하는 방법을 설명한다", ""),
    # 공통수학1: 행렬
    ("hs1_matrix", "hs1_matrix_elements", "contains", "high", "printed p. 63 용어와 기호", "행, 열, 성분은 행렬의 구성 요소다", ""),
    ("hs1_matrix", "hs1_matrix_represent", "used_in", "high", "printed p. 63; [10공수1-04-01]", "실생활 상황을 행렬로 표현한다", ""),
    ("hs1_matrix", "hs1_matrix_ops", "prerequisite_for", "high", "printed p. 63; [10공수1-04-01]~[10공수1-04-02]", "행렬의 뜻을 알고 연산을 수행하는 진술 구조", ""),
    # 공통수학2: 도형의 방정식
    ("hs2_distance", "hs2_division", "prerequisite_for", "high", "printed p. 65 성취기준 해설", "내분 도입 전에 두 점 사이의 거리를 다룬다", ""),
    ("hs2_line_condition", "hs2_point_line", "related_to", "medium", "printed p. 65; [10공수2-01-02]~[10공수2-01-03]", "직선의 성질에서 점과 직선 사이의 거리로 이어지는 구성", "성취기준 배열 순서에서 추론한 관계다."),
    ("hs2_circle_eq", "hs2_circle_line", "prerequisite_for", "high", "printed p. 65; [10공수2-01-04]~[10공수2-01-05]", "원의 방정식을 구하고 원과 직선의 위치 관계를 판단하는 진술 구조", ""),
    ("hs2_point_line", "hs2_circle_line", "used_in", "medium", "printed p. 65; [10공수2-01-03], [10공수2-01-05]", "점과 직선 사이의 거리가 원과 직선의 위치 관계 판단에 쓰인다", "문서가 직접 연결을 말하지 않으므로 medium을 유지한다."),
    ("hs2_translation", "hs2_reflection", "related_to", "high", "printed p. 65; [10공수2-01-06]~[10공수2-01-07]", "도형의 이동으로 평행이동과 대칭이동을 함께 다룬다", ""),
    # 공통수학2: 집합과 명제
    ("hs2_set", "hs2_element", "contains", "high", "printed p. 66 용어와 기호", "원소와 공집합은 집합의 기본 구성 개념이다", ""),
    ("hs2_set", "hs2_subset", "prerequisite_for", "high", "printed p. 66; [10공수2-02-01]~[10공수2-02-02]", "집합의 개념을 이해하고 포함관계를 판단하는 진술 구조", ""),
    ("hs2_set", "hs2_set_ops", "prerequisite_for", "high", "printed p. 66; [10공수2-02-01], [10공수2-02-03]", "집합의 개념을 바탕으로 집합의 연산을 수행하는 구성", ""),
    ("hs2_set_ops", "hs2_venn", "represented_by", "high", "printed p. 66; [10공수2-02-03]", "집합의 연산을 벤 다이어그램으로 나타낸다", ""),
    ("hs2_proposition", "hs2_truth_set", "related_to", "high", "printed p. 66 용어와 기호", "조건과 진리집합을 함께 다룬다", ""),
    ("hs2_set", "hs2_truth_set", "used_in", "high", "printed p. 66 용어와 기호", "조건의 진리집합은 집합으로 나타낸다", ""),
    ("hs2_proposition", "hs2_converse", "prerequisite_for", "high", "printed p. 66; [10공수2-02-04]~[10공수2-02-05]", "명제의 뜻을 알고 역과 대우를 이해하는 진술 구조", ""),
    ("hs2_proposition", "hs2_conditions", "prerequisite_for", "high", "printed p. 66; [10공수2-02-04], [10공수2-02-06]", "명제와 조건을 바탕으로 충분조건과 필요조건을 판단하는 구성", ""),
    ("hs2_converse", "hs2_proof", "used_in", "high", "printed p. 66; [10공수2-02-07]", "대우를 이용한 증명법으로 명제를 증명한다", ""),
    ("hs2_proof", "hs2_abs_ineq", "used_in", "high", "printed p. 66; [10공수2-02-08]", "간단한 절대부등식을 증명한다", ""),
    # 공통수학2: 함수와 그래프
    ("hs2_set", "hs2_function", "prerequisite_for", "high", "printed p. 67 성취기준 해설", "함수를 두 집합 사이의 대응 관계로 이해하게 한다", ""),
    ("hs2_function", "hs2_domain", "contains", "high", "printed p. 67 용어와 기호", "정의역, 공역, 치역은 함수의 구성 요소다", ""),
    ("hs2_function", "hs2_function_types", "contains", "high", "printed p. 67 용어와 기호", "일대일대응 등은 함수의 종류다", ""),
    ("hs2_function", "hs2_composition", "prerequisite_for", "high", "printed p. 67; [10공수2-03-01]~[10공수2-03-02]", "함수의 개념을 바탕으로 합성함수를 구하는 구성", ""),
    ("hs2_function", "hs2_inverse", "prerequisite_for", "high", "printed p. 67; [10공수2-03-01], [10공수2-03-03]", "함수의 개념을 바탕으로 역함수를 구하는 구성", ""),
    ("hs2_function_types", "hs2_inverse", "used_in", "medium", "printed p. 67 적용 시 고려 사항", "일대일대응의 이해가 역함수 이해에 쓰인다", "문서가 직접 연결을 말하지 않으므로 medium을 유지한다."),
    ("hs2_function", "hs2_rational_func", "contains", "high", "printed p. 67; [10공수2-03-04]", "유리함수는 함수의 한 종류다", ""),
    ("hs2_function", "hs2_irrational_func", "contains", "high", "printed p. 67; [10공수2-03-05]", "무리함수는 함수의 한 종류다", ""),
    ("hs2_asymptote", "hs2_rational_func", "used_in", "high", "printed p. 67 용어와 기호", "점근선으로 유리함수의 그래프 성질을 다룬다", ""),
    # 공통수학1 -> 공통수학2 연결
    ("hs1_quad_eq_func", "hs2_circle_line", "related_to", "medium", "printed p. 61, 65", "그래프와 도형의 위치 관계 판단이라는 같은 사고가 이어진다", "문서가 직접 연결을 말하지 않으므로 medium을 유지한다."),
]


def build_edges() -> list[dict]:
    edges = []
    for i, (src, dst, rel, conf, locator, summary, notes_) in enumerate(EDGE_DEFS, start=1):
        edges.append(
            {
                "id": f"hs_edge_{i:03d}",
                "source_id": src,
                "target_id": dst,
                "relationship_type": rel,
                "source_refs": [ref(locator, "relationship_evidence", summary)],
                "notes": notes_,
                "confidence": conf,
            }
        )
    return edges


def sync_arrays(concepts: list[dict], edges: list[dict]) -> None:
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
        elif rel in {"related_to", "contrasts_with"}:
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
    return "; ".join(f"{r['source_id']}:{r['locator']} - {r['summary']}" for r in source_refs)


def render_md(concepts: list[dict], edges: list[dict]) -> str:
    unit_counts: dict[str, int] = {}
    for c in concepts:
        key = f"{c['domain']} · {c['unit']}"
        unit_counts[key] = unit_counts.get(key, 0) + 1
    rel_counts: dict[str, int] = {}
    for e in edges:
        rel_counts[e["relationship_type"]] = rel_counts.get(e["relationship_type"], 0) + 1
    lines = [
        "# 고등학교 공통 과목 미시 concept: 공통수학1·2",
        "",
        "2022 개정 수학과 교육과정(별책8)의 공통수학1([10공수1-01-01]~[10공수1-04-02])과",
        "공통수학2([10공수2-01-01]~[10공수2-03-05]) 성취기준 구간(인쇄 p.57~67)을 미시 concept과",
        "관계 edge로 분해한 산출물이다.",
        "",
        "## 범위와 출처 규칙 (2026-07-06 사용자 결정)",
        "",
        "- 고등학교 선택 과목(일반·진로·융합)은 이 작업에서 제외한다(AGENTS.md Math Concept Map Scope Rules).",
        "- 기본수학1·2는 공통수학1·2의 대체 이수 경로인 공통 과목이므로 spine에는 있으나 이번 분해에서는 제외했다.",
        "- 모든 concept과 edge는 별책8 원문의 성취기준·해설·적용 시 고려 사항·용어와 기호에 근거하며,",
        "  중학교 연계는 문서의 직접 서술(다항식·실수 연산·연립일차방정식·경우의 수·일차함수 그래프·함수 개념 확장)을 notes와 근거로 남겼다.",
        "",
        "## 데이터 규모",
        "",
        f"- concept: {len(concepts)}개",
        *[f"  - {unit}: {count}개" for unit, count in unit_counts.items()],
        f"- edge: {len(edges)}개 ({', '.join(f'{k} {v}' for k, v in sorted(rel_counts.items()))})",
        "",
        "## 알려진 추출 한계",
        "",
        "- 인수분해 공식 목록, 유리함수·무리함수 기본형 식, 대칭이동 대상 직선(y=x) 등 수식은",
        "  한글 수식 글꼴(HyhwpEQ) 문제로 텍스트 추출이 되지 않아 노드 notes에 한계를 남겼다.",
        "- 오개념 노드는 공식 문서가 학생 오류를 직접 서술하지 않으므로 추가하지 않았다.",
        "",
        "## spine·중학교 미시 map과의 연결",
        "",
        "- 이 데이터셋의 성취기준 코드는 `k12-spine-nodes.csv`의 공통수학1·2 성취기준 노드와 같은 체계다.",
        "- 중학교 미시 concept(`concepts.json`)과의 연결은 문서의 연계 서술을 근거로 다음 단계에서 잇는다:",
        "  다항식 연산·인수분해, 실수 사칙연산→복소수, 연립일차방정식→연립부등식, 경우의 수→합·곱의 법칙,",
        "  일차함수 그래프→직선의 평행·수직 조건, 함수 개념→대응으로의 확장.",
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
            "title": "고등학교 공통 과목 수학 개념 위계 Map (공통수학1·2)",
            "schema_version": "0.1.0",
            "generated_at": datetime.now().isoformat(timespec="seconds"),
            "pilot_scope": "공통수학1([10공수1-*] 19개), 공통수학2([10공수2-*] 20개) 전체 영역",
            "scope_rules": "2026-07-06 사용자 결정: 고등학교 선택 과목 제외, 공식 원문 출처만 사용 (AGENTS.md Math Concept Map Scope Rules)",
            "concept_count": len(concepts),
            "edge_count": len(edges),
        },
        "sources": SOURCES,
        "concepts": concepts,
        "edges": edges,
    }
    CONCEPTS_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

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
        writer.writerow(["id", "source_id", "target_id", "relationship_type", "source_refs", "notes", "confidence"])
        for e in edges:
            writer.writerow(
                [e["id"], e["source_id"], e["target_id"], e["relationship_type"],
                 source_ref_summary(e["source_refs"]), e["notes"], e["confidence"]]
            )
    PILOT_MD.write_text(render_md(concepts, edges), encoding="utf-8")
    print(f"concepts: {len(concepts)}, edges: {len(edges)}")


if __name__ == "__main__":
    main()
