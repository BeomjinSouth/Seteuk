from __future__ import annotations

import hashlib
import html
import json
import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

from pypdf import PdfReader


PROJECT_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = PROJECT_ROOT / "수학_개념_위계도"
DATA_DIR = OUTPUT_DIR / "data"
ASSETS_DIR = OUTPUT_DIR / "assets"
SOURCE_DIR = PROJECT_ROOT / "교과서_원본"
CURRICULUM_PDF = next(
    (PROJECT_ROOT / "2022_개정_중학교_교육과정_PDF" / "교과").glob("02_*.pdf")
)

GRADE_BANDS = ["초1-2", "초3-4", "초5-6", "중1-3"]
AREAS = ["수와 연산", "변화와 관계", "도형과 측정", "자료와 가능성"]
AREA_BY_CODE = {
    "01": "수와 연산",
    "02": "변화와 관계",
    "03": "도형과 측정",
    "04": "자료와 가능성",
}
GRADE_BY_PREFIX = {
    "2": "초1-2",
    "4": "초3-4",
    "6": "초5-6",
    "9": "중1-3",
}

CORE_IDEAS = {
    "수와 연산": [
        "사물의 양은 자연수, 분수, 소수 등으로 표현되며, 수는 자연수에서 정수, 유리수, 실수로 확장된다.",
        "사칙계산은 자연수에서 정수, 유리수, 실수의 사칙계산으로 확장되며 연산의 성질이 일관되게 성립한다.",
        "수와 사칙계산은 수학 학습의 기본이며 다양한 문제 해결에 활용된다.",
    ],
    "변화와 관계": [
        "규칙 탐구는 수학적으로 추측하고 일반화하는 데 기반이 된다.",
        "동치 관계, 대응 관계, 비례 관계는 대상 사이의 관계를 기술하고 문제 해결에 활용된다.",
        "문자와 식, 방정식, 부등식, 함수와 그래프는 변화하는 현상을 수학적으로 표현한다.",
    ],
    "도형과 측정": [
        "평면도형과 입체도형은 여러 모양을 범주화한 것이며 고유한 성질을 갖는다.",
        "도형의 성질과 관계 탐구는 논리적이고 비판적으로 사고하는 데 기반이 된다.",
        "측정은 여러 속성의 양을 수치화하여 현상 해석과 실생활 문제 해결에 활용된다.",
    ],
    "자료와 가능성": [
        "자료 수집, 정리, 해석은 자료의 특징과 두 집단의 비교, 자료의 관계 탐구에 활용된다.",
        "가능성을 여러 방식으로 표현하고 확률로 수치화하면 불확실성을 수학적으로 다룰 수 있다.",
        "통계적 문제해결과 가능성 탐구는 예측과 합리적 의사 결정의 기반이 된다.",
    ],
}

CONTENT_ELEMENTS = {
    "수와 연산": {
        "초1-2": ["네 자리 이하의 수", "두 자리 수 범위의 덧셈과 뺄셈", "한 자리 수의 곱셈"],
        "초3-4": [
            "다섯 자리 이상의 수",
            "분수",
            "소수",
            "세 자리 수의 덧셈과 뺄셈",
            "자연수의 곱셈과 나눗셈",
            "분모가 같은 분수의 덧셈과 뺄셈",
            "소수의 덧셈과 뺄셈",
        ],
        "초5-6": [
            "약수와 배수",
            "수의 범위와 올림, 버림, 반올림",
            "자연수의 혼합 계산",
            "분모가 다른 분수의 덧셈과 뺄셈",
            "분수의 곱셈과 나눗셈",
            "소수의 곱셈과 나눗셈",
        ],
        "중1-3": ["소인수분해", "정수와 유리수", "유리수와 순환소수", "제곱근과 실수"],
    },
    "변화와 관계": {
        "초1-2": ["규칙"],
        "초3-4": ["규칙", "동치 관계"],
        "초5-6": ["대응 관계", "비와 비율", "비례식과 비례배분"],
        "중1-3": [
            "문자의 사용과 식",
            "일차방정식",
            "좌표평면과 그래프",
            "식의 계산",
            "일차부등식",
            "연립일차방정식",
            "일차함수와 그 그래프",
            "일차함수와 일차방정식의 관계",
            "다항식의 곱셈과 인수분해",
            "이차방정식",
            "이차함수와 그 그래프",
        ],
    },
    "도형과 측정": {
        "초1-2": ["입체도형의 모양", "평면도형과 그 구성 요소", "양의 비교", "시각과 시간(시, 분)", "길이(cm, m)"],
        "초3-4": [
            "도형의 기초",
            "원의 구성 요소",
            "여러 가지 삼각형",
            "여러 가지 사각형",
            "다각형",
            "평면도형의 이동",
            "시각과 시간(초)",
            "길이(mm, km)",
            "들이(L, mL)",
            "무게(kg, g, t)",
            "각도(°)",
        ],
        "초5-6": [
            "합동과 대칭",
            "직육면체와 정육면체",
            "각기둥과 각뿔",
            "원기둥, 원뿔, 구",
            "다각형의 둘레와 넓이",
            "원주율과 원의 넓이",
            "직육면체와 정육면체의 겉넓이와 부피",
        ],
        "중1-3": [
            "기본 도형",
            "작도와 합동",
            "평면도형의 성질",
            "입체도형의 성질",
            "삼각형과 사각형의 성질",
            "도형의 닮음",
            "피타고라스 정리",
            "삼각비",
            "원의 성질",
        ],
    },
    "자료와 가능성": {
        "초1-2": ["자료의 분류", "표", "○, ×, /를 이용한 그래프"],
        "초3-4": ["그림그래프", "막대그래프", "꺾은선그래프"],
        "초5-6": ["평균", "띠그래프, 원그래프", "가능성"],
        "중1-3": ["대푯값", "도수분포표와 상대도수", "경우의 수와 확률", "산포도", "상자그림과 산점도"],
    },
}

OFFICIAL_NOTICES = [
    {
        "title": "2025학년도 사용 검정 교과용도서 합격 결정 공고",
        "url": "https://www.kosac.re.kr/menus/270/boards/386/posts/40455?bbIdx=40455&brdType=R",
        "note": "초등 3~4학년군과 중학교 수학 1 등 2022 개정 적용 교과서 확인용",
    },
    {
        "title": "2026학년도 사용 검정 교과용도서 합격 결정 공고(중학교 수학 2)",
        "url": "https://www.kosac.re.kr/menus/270/boards/386/posts/42156?bbIdx=28608&brdCodeValue=&brdType=R&page=1&searchField=titlecontent&searchText=&thisPage=30",
        "note": "2026학년도 중학교 수학 2 검정 교과서 확인용",
    },
    {
        "title": "2026학년도 사용 검정 교과용도서 합격 결정 공고(초등 5~6학년군)",
        "url": "https://www.kosac.re.kr/menus/270/boards/386/posts/42428?page=1",
        "note": "2026학년도 초등 5~6학년군 수학 검정 교과서 확인용",
    },
]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def ensure_dirs() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    DATA_DIR.mkdir(exist_ok=True)
    ASSETS_DIR.mkdir(exist_ok=True)
    SOURCE_DIR.mkdir(exist_ok=True)
    source_readme = SOURCE_DIR / "README.md"
    if not source_readme.exists():
        source_readme.write_text(
            """# 교과서 원본

이 폴더에 분석할 교과서, 익힘책, 지도서 PDF 또는 이미지 파일을 넣습니다.

## 파일명 규칙

`교육과정_학년_출판사_책종_권.pdf`

예:

- `2022_초3_미래엔_교과서_1학기.pdf`
- `2022_초3_미래엔_익힘책_1학기.pdf`
- `2015_중3_천재교육_지도서.pdf`

지원 책종: `교과서`, `익힘책`, `지도서`

저작권 보호를 위해 산출물에는 원문 전체가 아니라 개념명, 짧은 요약, 페이지 참조, 위계 관계만 기록합니다.
""",
            encoding="utf-8",
        )


def clean_text(value: str) -> str:
    value = value.replace("\u0000", " ")
    value = re.sub(r"\s+", " ", value)
    replacements = {
        "": "=",
        "": ">",
        "": "<",
        "": "°",
        "⋅": "·",
        "／": "/",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    return value.strip()


def make_label(text: str) -> str:
    text = clean_text(text)
    text = re.sub(r"(할 수 있다|이해한다|안다|기른다|해결한다|설명할 수 있다|인식할 수 있다)\.?\s*$", "", text)
    text = re.sub(r"\s*,\s*$", "", text)
    if len(text) > 54:
        text = text[:54].rstrip() + "..."
    return text


def infer_concept_tags(text: str) -> list[str]:
    tags: list[str] = []
    candidates = [
        "자연수",
        "분수",
        "소수",
        "덧셈",
        "뺄셈",
        "곱셈",
        "나눗셈",
        "약수",
        "배수",
        "정수",
        "유리수",
        "순환소수",
        "제곱근",
        "실수",
        "규칙",
        "비",
        "비율",
        "방정식",
        "부등식",
        "함수",
        "그래프",
        "좌표",
        "다항식",
        "인수분해",
        "도형",
        "삼각형",
        "사각형",
        "원",
        "합동",
        "닮음",
        "피타고라스",
        "삼각비",
        "길이",
        "넓이",
        "부피",
        "자료",
        "표",
        "그래프",
        "평균",
        "가능성",
        "확률",
        "상대도수",
        "산포도",
        "상자그림",
        "산점도",
    ]
    for candidate in candidates:
        if candidate in text and candidate not in tags:
            tags.append(candidate)
    return tags[:8]


def extract_achievement_standards() -> list[dict[str, Any]]:
    reader = PdfReader(str(CURRICULUM_PDF))
    standards: dict[str, dict[str, Any]] = {}
    code_re = re.compile(r"\[([2469]수\d{2}-\d{2})\]")
    bullet_re = re.compile(r"•\s*\[[2469]수\d{2}-\d{2}\]")
    for page_number in range(17, 48):
        text = reader.pages[page_number - 1].extract_text() or ""
        matches = list(code_re.finditer(text))
        for index, match in enumerate(matches):
            code = match.group(1)
            if "•" in text[max(0, match.start() - 6) : match.start()]:
                continue
            if code in standards:
                continue
            next_code_start = matches[index + 1].start() if index + 1 < len(matches) else len(text)
            segment = text[match.end() : next_code_start]
            bullet = bullet_re.search(segment)
            if bullet:
                segment = segment[: bullet.start()]
            summary = clean_text(segment)
            if not summary:
                continue
            prefix = code[0]
            area_code = code[2:4]
            area = AREA_BY_CODE.get(area_code, "기타")
            grade_band = GRADE_BY_PREFIX.get(prefix, "기타")
            standards[code] = {
                "code": code,
                "label": make_label(summary),
                "summary": make_label(summary),
                "area": area,
                "gradeBand": grade_band,
                "conceptTags": infer_concept_tags(summary),
                "source": {
                    "pdf": CURRICULUM_PDF.name,
                    "page": page_number,
                    "basis": "2022 개정 수학과 교육과정 공통 교육과정 성취기준",
                },
            }
    return sorted(standards.values(), key=lambda item: item["code"])


def node_id(area: str, grade_band: str, label: str) -> str:
    slug = re.sub(r"[^0-9A-Za-z가-힣]+", "-", label).strip("-")
    return f"curr-{AREAS.index(area)+1}-{GRADE_BANDS.index(grade_band)+1}-{slug}"


def concept_ref(area: str, grade_band: str, label: str) -> tuple[str, str, str]:
    return (area, grade_band, label)


CONCEPT_RELATIONS = [
    {
        "from": concept_ref("수와 연산", "초1-2", "네 자리 이하의 수"),
        "to": concept_ref("수와 연산", "초3-4", "다섯 자리 이상의 수"),
        "type": "prerequisite",
        "label": "수 개념 확장",
    },
    {
        "from": concept_ref("수와 연산", "초1-2", "네 자리 이하의 수"),
        "to": concept_ref("수와 연산", "초3-4", "세 자리 수의 덧셈과 뺄셈"),
        "type": "prerequisite",
        "label": "자릿값 기반 계산",
    },
    {
        "from": concept_ref("수와 연산", "초1-2", "두 자리 수 범위의 덧셈과 뺄셈"),
        "to": concept_ref("수와 연산", "초3-4", "세 자리 수의 덧셈과 뺄셈"),
        "type": "prerequisite",
        "label": "계산 원리 확장",
    },
    {
        "from": concept_ref("수와 연산", "초1-2", "한 자리 수의 곱셈"),
        "to": concept_ref("수와 연산", "초3-4", "자연수의 곱셈과 나눗셈"),
        "type": "prerequisite",
        "label": "곱셈에서 나눗셈으로",
    },
    {
        "from": concept_ref("수와 연산", "초3-4", "자연수의 곱셈과 나눗셈"),
        "to": concept_ref("수와 연산", "초5-6", "약수와 배수"),
        "type": "prerequisite",
        "label": "곱셈 구조 분석",
    },
    {
        "from": concept_ref("수와 연산", "초3-4", "자연수의 곱셈과 나눗셈"),
        "to": concept_ref("수와 연산", "초5-6", "자연수의 혼합 계산"),
        "type": "prerequisite",
        "label": "연산 감각 통합",
    },
    {
        "from": concept_ref("수와 연산", "초3-4", "분수"),
        "to": concept_ref("수와 연산", "초3-4", "분모가 같은 분수의 덧셈과 뺄셈"),
        "type": "prerequisite",
        "label": "분수 표현에서 계산으로",
    },
    {
        "from": concept_ref("수와 연산", "초3-4", "분모가 같은 분수의 덧셈과 뺄셈"),
        "to": concept_ref("수와 연산", "초5-6", "분모가 다른 분수의 덧셈과 뺄셈"),
        "type": "prerequisite",
        "label": "통분 필요성",
    },
    {
        "from": concept_ref("수와 연산", "초5-6", "분모가 다른 분수의 덧셈과 뺄셈"),
        "to": concept_ref("수와 연산", "초5-6", "분수의 곱셈과 나눗셈"),
        "type": "prerequisite",
        "label": "분수 연산 확장",
    },
    {
        "from": concept_ref("수와 연산", "초3-4", "소수"),
        "to": concept_ref("수와 연산", "초3-4", "소수의 덧셈과 뺄셈"),
        "type": "prerequisite",
        "label": "소수 표현에서 계산으로",
    },
    {
        "from": concept_ref("수와 연산", "초3-4", "소수의 덧셈과 뺄셈"),
        "to": concept_ref("수와 연산", "초5-6", "소수의 곱셈과 나눗셈"),
        "type": "prerequisite",
        "label": "소수 연산 확장",
    },
    {
        "from": concept_ref("수와 연산", "초5-6", "약수와 배수"),
        "to": concept_ref("수와 연산", "중1-3", "소인수분해"),
        "type": "prerequisite",
        "label": "약수·배수 구조의 형식화",
    },
    {
        "from": concept_ref("수와 연산", "초5-6", "분수의 곱셈과 나눗셈"),
        "to": concept_ref("수와 연산", "중1-3", "정수와 유리수"),
        "type": "prerequisite",
        "label": "유리수 연산 준비",
    },
    {
        "from": concept_ref("수와 연산", "초5-6", "소수의 곱셈과 나눗셈"),
        "to": concept_ref("수와 연산", "중1-3", "유리수와 순환소수"),
        "type": "prerequisite",
        "label": "소수 표현의 확장",
    },
    {
        "from": concept_ref("수와 연산", "중1-3", "정수와 유리수"),
        "to": concept_ref("수와 연산", "중1-3", "제곱근과 실수"),
        "type": "prerequisite",
        "label": "수 체계 확장",
    },
    {
        "from": concept_ref("수와 연산", "중1-3", "유리수와 순환소수"),
        "to": concept_ref("수와 연산", "중1-3", "제곱근과 실수"),
        "type": "prerequisite",
        "label": "유리수와 무리수 구분",
    },
    {
        "from": concept_ref("변화와 관계", "초1-2", "규칙"),
        "to": concept_ref("변화와 관계", "초3-4", "규칙"),
        "type": "prerequisite",
        "label": "규칙 표현 확장",
    },
    {
        "from": concept_ref("변화와 관계", "초3-4", "규칙"),
        "to": concept_ref("변화와 관계", "초5-6", "대응 관계"),
        "type": "prerequisite",
        "label": "규칙에서 대응으로",
    },
    {
        "from": concept_ref("변화와 관계", "초3-4", "동치 관계"),
        "to": concept_ref("변화와 관계", "중1-3", "문자의 사용과 식"),
        "type": "prerequisite",
        "label": "등호 이해에서 식 표현으로",
    },
    {
        "from": concept_ref("변화와 관계", "초5-6", "대응 관계"),
        "to": concept_ref("변화와 관계", "중1-3", "좌표평면과 그래프"),
        "type": "prerequisite",
        "label": "대응을 표·그래프로 표현",
    },
    {
        "from": concept_ref("변화와 관계", "초5-6", "대응 관계"),
        "to": concept_ref("변화와 관계", "중1-3", "일차함수와 그 그래프"),
        "type": "prerequisite",
        "label": "함수 사고의 출발",
    },
    {
        "from": concept_ref("수와 연산", "초3-4", "분수"),
        "to": concept_ref("변화와 관계", "초5-6", "비와 비율"),
        "type": "cross_area",
        "label": "부분-전체 표현이 비율로 연결",
    },
    {
        "from": concept_ref("수와 연산", "초3-4", "소수"),
        "to": concept_ref("변화와 관계", "초5-6", "비와 비율"),
        "type": "cross_area",
        "label": "소수 표현이 비율 표현으로 연결",
    },
    {
        "from": concept_ref("변화와 관계", "초5-6", "비와 비율"),
        "to": concept_ref("변화와 관계", "초5-6", "비례식과 비례배분"),
        "type": "prerequisite",
        "label": "비율에서 비례 관계로",
    },
    {
        "from": concept_ref("변화와 관계", "초5-6", "비례식과 비례배분"),
        "to": concept_ref("변화와 관계", "중1-3", "일차방정식"),
        "type": "prerequisite",
        "label": "관계식을 풀기",
    },
    {
        "from": concept_ref("변화와 관계", "중1-3", "문자의 사용과 식"),
        "to": concept_ref("변화와 관계", "중1-3", "식의 계산"),
        "type": "prerequisite",
        "label": "식 조작",
    },
    {
        "from": concept_ref("변화와 관계", "중1-3", "문자의 사용과 식"),
        "to": concept_ref("변화와 관계", "중1-3", "일차방정식"),
        "type": "prerequisite",
        "label": "문자식에서 방정식으로",
    },
    {
        "from": concept_ref("변화와 관계", "중1-3", "일차방정식"),
        "to": concept_ref("변화와 관계", "중1-3", "연립일차방정식"),
        "type": "prerequisite",
        "label": "미지수와 식의 확장",
    },
    {
        "from": concept_ref("변화와 관계", "중1-3", "좌표평면과 그래프"),
        "to": concept_ref("변화와 관계", "중1-3", "일차함수와 그 그래프"),
        "type": "prerequisite",
        "label": "그래프 표현 기반",
    },
    {
        "from": concept_ref("변화와 관계", "중1-3", "일차함수와 그 그래프"),
        "to": concept_ref("변화와 관계", "중1-3", "일차함수와 일차방정식의 관계"),
        "type": "prerequisite",
        "label": "함수와 방정식 연결",
    },
    {
        "from": concept_ref("변화와 관계", "중1-3", "연립일차방정식"),
        "to": concept_ref("변화와 관계", "중1-3", "일차함수와 일차방정식의 관계"),
        "type": "cross_link",
        "label": "해와 그래프의 교점 연결",
    },
    {
        "from": concept_ref("변화와 관계", "중1-3", "식의 계산"),
        "to": concept_ref("변화와 관계", "중1-3", "다항식의 곱셈과 인수분해"),
        "type": "prerequisite",
        "label": "다항식 조작 확장",
    },
    {
        "from": concept_ref("변화와 관계", "중1-3", "다항식의 곱셈과 인수분해"),
        "to": concept_ref("변화와 관계", "중1-3", "이차방정식"),
        "type": "prerequisite",
        "label": "인수분해로 이차방정식 해결",
    },
    {
        "from": concept_ref("변화와 관계", "중1-3", "이차방정식"),
        "to": concept_ref("변화와 관계", "중1-3", "이차함수와 그 그래프"),
        "type": "cross_link",
        "label": "근과 그래프 해석 연결",
    },
    {
        "from": concept_ref("도형과 측정", "초1-2", "평면도형과 그 구성 요소"),
        "to": concept_ref("도형과 측정", "초3-4", "도형의 기초"),
        "type": "prerequisite",
        "label": "도형 구성 요소 정교화",
    },
    {
        "from": concept_ref("도형과 측정", "초3-4", "도형의 기초"),
        "to": concept_ref("도형과 측정", "중1-3", "기본 도형"),
        "type": "prerequisite",
        "label": "기초 용어 형식화",
    },
    {
        "from": concept_ref("도형과 측정", "초3-4", "여러 가지 삼각형"),
        "to": concept_ref("도형과 측정", "중1-3", "삼각형과 사각형의 성질"),
        "type": "prerequisite",
        "label": "도형 성질 정당화",
    },
    {
        "from": concept_ref("도형과 측정", "초3-4", "여러 가지 사각형"),
        "to": concept_ref("도형과 측정", "중1-3", "삼각형과 사각형의 성질"),
        "type": "prerequisite",
        "label": "사각형 성질 정당화",
    },
    {
        "from": concept_ref("도형과 측정", "초3-4", "다각형"),
        "to": concept_ref("도형과 측정", "중1-3", "평면도형의 성질"),
        "type": "prerequisite",
        "label": "다각형 성질 확장",
    },
    {
        "from": concept_ref("도형과 측정", "초5-6", "합동과 대칭"),
        "to": concept_ref("도형과 측정", "중1-3", "작도와 합동"),
        "type": "prerequisite",
        "label": "합동 개념의 엄밀화",
    },
    {
        "from": concept_ref("변화와 관계", "초5-6", "비와 비율"),
        "to": concept_ref("도형과 측정", "중1-3", "도형의 닮음"),
        "type": "cross_area",
        "label": "비율이 닮음비로 전이",
    },
    {
        "from": concept_ref("도형과 측정", "중1-3", "도형의 닮음"),
        "to": concept_ref("도형과 측정", "중1-3", "삼각비"),
        "type": "prerequisite",
        "label": "비율 관계의 삼각형 적용",
    },
    {
        "from": concept_ref("도형과 측정", "중1-3", "피타고라스 정리"),
        "to": concept_ref("도형과 측정", "중1-3", "삼각비"),
        "type": "cross_link",
        "label": "직각삼각형 관계",
    },
    {
        "from": concept_ref("도형과 측정", "초3-4", "원의 구성 요소"),
        "to": concept_ref("도형과 측정", "초5-6", "원주율과 원의 넓이"),
        "type": "prerequisite",
        "label": "원 구성 요소에서 측정으로",
    },
    {
        "from": concept_ref("도형과 측정", "초5-6", "원주율과 원의 넓이"),
        "to": concept_ref("도형과 측정", "중1-3", "원의 성질"),
        "type": "prerequisite",
        "label": "원 탐구 확장",
    },
    {
        "from": concept_ref("자료와 가능성", "초1-2", "자료의 분류"),
        "to": concept_ref("자료와 가능성", "초1-2", "표"),
        "type": "prerequisite",
        "label": "분류 결과 정리",
    },
    {
        "from": concept_ref("자료와 가능성", "초1-2", "표"),
        "to": concept_ref("자료와 가능성", "초3-4", "막대그래프"),
        "type": "prerequisite",
        "label": "표에서 그래프로",
    },
    {
        "from": concept_ref("자료와 가능성", "초3-4", "막대그래프"),
        "to": concept_ref("자료와 가능성", "초5-6", "평균"),
        "type": "prerequisite",
        "label": "자료 비교에서 대표값으로",
    },
    {
        "from": concept_ref("자료와 가능성", "초5-6", "평균"),
        "to": concept_ref("자료와 가능성", "중1-3", "대푯값"),
        "type": "prerequisite",
        "label": "대표값 확장",
    },
    {
        "from": concept_ref("자료와 가능성", "초3-4", "꺾은선그래프"),
        "to": concept_ref("자료와 가능성", "중1-3", "도수분포표와 상대도수"),
        "type": "prerequisite",
        "label": "분포 표현 준비",
    },
    {
        "from": concept_ref("자료와 가능성", "초5-6", "가능성"),
        "to": concept_ref("자료와 가능성", "중1-3", "경우의 수와 확률"),
        "type": "prerequisite",
        "label": "가능성의 수량화",
    },
    {
        "from": concept_ref("수와 연산", "초3-4", "분수"),
        "to": concept_ref("자료와 가능성", "초5-6", "가능성"),
        "type": "cross_area",
        "label": "가능성의 수 표현",
    },
    {
        "from": concept_ref("변화와 관계", "중1-3", "좌표평면과 그래프"),
        "to": concept_ref("자료와 가능성", "중1-3", "상자그림과 산점도"),
        "type": "cross_area",
        "label": "좌표 표현이 산점도로 전이",
    },
    {
        "from": concept_ref("자료와 가능성", "중1-3", "도수분포표와 상대도수"),
        "to": concept_ref("자료와 가능성", "중1-3", "산포도"),
        "type": "prerequisite",
        "label": "분포 비교에서 흩어짐으로",
    },
    {
        "from": concept_ref("자료와 가능성", "중1-3", "산포도"),
        "to": concept_ref("자료와 가능성", "중1-3", "상자그림과 산점도"),
        "type": "cross_link",
        "label": "분포와 관계 탐색",
    },
]


def build_curriculum_nodes(standards: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    standards_by_area_grade: dict[tuple[str, str], list[dict[str, Any]]] = {}
    for standard in standards:
        standards_by_area_grade.setdefault((standard["area"], standard["gradeBand"]), []).append(standard)

    nodes: list[dict[str, Any]] = []
    for area in AREAS:
        for grade_band in GRADE_BANDS:
            for order, label in enumerate(CONTENT_ELEMENTS[area][grade_band], start=1):
                tags = infer_concept_tags(label)
                linked = [
                    item["code"]
                    for item in standards_by_area_grade.get((area, grade_band), [])
                    if not tags or any(tag in item["summary"] or tag in item["label"] for tag in tags)
                ]
                if not linked:
                    linked = [item["code"] for item in standards_by_area_grade.get((area, grade_band), [])[:4]]
                current_id = node_id(area, grade_band, label)
                node = {
                    "id": current_id,
                    "label": label,
                    "area": area,
                    "gradeBand": grade_band,
                    "conceptType": "curriculum_content_element",
                    "summary": f"{grade_band} {area} 영역의 핵심 내용 요소: {label}",
                    "coreIdeas": CORE_IDEAS[area],
                    "achievementCodes": linked,
                    "source": {
                        "pdf": CURRICULUM_PDF.name,
                        "pageRange": "13-16",
                        "basis": "2022 개정 수학과 교육과정 내용 체계",
                    },
                    "order": order,
                    "textbookConceptCount": 0,
                    "prerequisiteNodeIds": [],
                    "successorNodeIds": [],
                }
                nodes.append(node)

    lookup = {(node["area"], node["gradeBand"], node["label"]): node for node in nodes}
    edges: list[dict[str, Any]] = []
    seen_edges: set[tuple[str, str, str]] = set()
    for index, relation in enumerate(CONCEPT_RELATIONS, start=1):
        source = lookup.get(relation["from"])
        target = lookup.get(relation["to"])
        if not source or not target:
            continue
        key = (source["id"], target["id"], relation["type"])
        if key in seen_edges:
            continue
        seen_edges.add(key)
        edges.append(
            {
                "id": f"edge-{index:03d}",
                "from": source["id"],
                "to": target["id"],
                "type": relation["type"],
                "label": relation["label"],
                "basis": "교육과정 내용 요소의 개념적 선수·전이 관계를 수동 정리한 해석 edge",
            }
        )
        target["prerequisiteNodeIds"].append(source["id"])
        source["successorNodeIds"].append(target["id"])
    return nodes, edges


@dataclass
class SourceFile:
    path: Path
    curriculum_year: str | None
    grade: str | None
    publisher: str | None
    book_type: str | None
    volume: str | None
    parse_issue: str | None
    sha256: str
    file_size: int
    page_count: int | None
    pdf_header_valid: bool | None


def parse_source_file(path: Path) -> SourceFile:
    stem = path.stem
    match = re.match(
        r"^(?P<year>20\d{2})_(?P<grade>[초중]\d)_(?P<publisher>[^_]+)_(?P<book_type>교과서|익힘책|지도서)_(?P<volume>.+)$",
        stem,
    )
    parse_issue = None
    if not match:
        parse_issue = "파일명이 `교육과정_학년_출판사_책종_권` 규칙과 맞지 않습니다."
    page_count = None
    pdf_header_valid = None
    if path.suffix.lower() == ".pdf":
        with path.open("rb") as handle:
            pdf_header_valid = handle.read(5) == b"%PDF-"
        try:
            page_count = len(PdfReader(str(path)).pages)
        except Exception:
            parse_issue = (parse_issue + " " if parse_issue else "") + "PDF 페이지 수를 읽지 못했습니다."
    return SourceFile(
        path=path,
        curriculum_year=match.group("year") if match else None,
        grade=match.group("grade") if match else None,
        publisher=match.group("publisher") if match else None,
        book_type=match.group("book_type") if match else None,
        volume=match.group("volume") if match else None,
        parse_issue=parse_issue,
        sha256=sha256_file(path),
        file_size=path.stat().st_size,
        page_count=page_count,
        pdf_header_valid=pdf_header_valid,
    )


def source_files() -> list[SourceFile]:
    allowed = {".pdf", ".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"}
    files = [path for path in SOURCE_DIR.rglob("*") if path.is_file() and path.suffix.lower() in allowed]
    return [parse_source_file(path) for path in sorted(files)]


def textbook_concepts_from_sources(sources: list[SourceFile], curriculum_nodes: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    issues: list[dict[str, Any]] = []
    concepts: list[dict[str, Any]] = []
    node_lookup = {(node["area"], node["gradeBand"]): node for node in curriculum_nodes}

    if not sources:
        issues.append(
            {
                "type": "missing_textbook_sources",
                "severity": "blocking_for_textbook_detail",
                "message": "`교과서_원본/`에 분석할 PDF 또는 이미지 파일이 없습니다. 교육과정 골격은 완성했고, 교과서 세부개념은 원본 제공 후 갱신해야 합니다.",
            }
        )
        return concepts, issues

    for source in sources:
        if source.parse_issue:
            issues.append(
                {
                    "type": "source_filename_or_read_issue",
                    "severity": "needs_review",
                    "file": str(source.path.relative_to(PROJECT_ROOT)),
                    "message": source.parse_issue,
                }
            )
        if source.path.suffix.lower() != ".pdf":
            issues.append(
                {
                    "type": "image_ocr_pending",
                    "severity": "needs_ocr",
                    "file": str(source.path.relative_to(PROJECT_ROOT)),
                    "message": "이미지 원본은 OCR 후 세부개념 추출이 필요합니다. 현재 산출물에는 출처 파일만 등록했습니다.",
                }
            )
            continue

        try:
            reader = PdfReader(str(source.path))
        except Exception as exc:
            issues.append(
                {
                    "type": "pdf_read_error",
                    "severity": "needs_review",
                    "file": str(source.path.relative_to(PROJECT_ROOT)),
                    "message": f"PDF를 읽지 못했습니다: {exc}",
                }
            )
            continue

        seen: set[str] = set()
        for page_index, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            lines = [clean_text(line) for line in text.splitlines()]
            for line in lines:
                if not line or len(line) < 2 or len(line) > 36:
                    continue
                if re.fullmatch(r"[\d\s./-]+", line):
                    continue
                if line.endswith(("합니다", "있다", "한다", "이다", "까요", "세요")) and len(line) > 18:
                    continue
                if not re.search(r"[가-힣]", line):
                    continue
                normalized = re.sub(r"\s+", "", line)
                if normalized in seen:
                    continue
                tags = infer_concept_tags(line)
                if not tags and len(line) > 12:
                    continue
                seen.add(normalized)
                area = None
                for candidate_area in AREAS:
                    area_terms = " ".join(
                        item
                        for grade_band in GRADE_BANDS
                        for item in CONTENT_ELEMENTS[candidate_area][grade_band]
                    )
                    if any(tag in area_terms for tag in tags):
                        area = candidate_area
                        break
                if not area:
                    area = "미분류"
                grade_band = None
                if source.grade:
                    if source.grade in {"초1", "초2"}:
                        grade_band = "초1-2"
                    elif source.grade in {"초3", "초4"}:
                        grade_band = "초3-4"
                    elif source.grade in {"초5", "초6"}:
                        grade_band = "초5-6"
                    elif source.grade.startswith("중"):
                        grade_band = "중1-3"
                parent = node_lookup.get((area, grade_band)) if area != "미분류" and grade_band else None
                concepts.append(
                    {
                        "id": f"txt-{len(concepts)+1:05d}",
                        "label": line,
                        "summary": f"{source.publisher or '출처 미상'} {source.book_type or '책종 미상'} {source.grade or '학년 미상'}에서 추출된 세부 개념 후보",
                        "area": area,
                        "grade": source.grade,
                        "gradeBand": grade_band,
                        "curriculumYear": source.curriculum_year,
                        "publisher": source.publisher,
                        "bookType": source.book_type,
                        "volume": source.volume,
                        "page": page_index,
                        "parentAchievementCodes": parent["achievementCodes"] if parent else [],
                        "parentNodeId": parent["id"] if parent else None,
                        "prerequisiteConceptIds": [],
                        "successorConceptIds": [],
                        "sourceFile": str(source.path.relative_to(PROJECT_ROOT)),
                        "sourceFileSha256": source.sha256,
                        "status": "candidate_extracted",
                    }
                )
                if len(seen) >= 200:
                    break
            if len(seen) >= 200:
                break
    return concepts, issues


def build_source_manifest(sources: list[SourceFile], data: dict[str, Any]) -> str:
    lines = [
        "# 수학 개념 위계도 출처 매니페스트",
        "",
        f"- 생성 시각: {data['metadata']['generatedAt']}",
        f"- 공식 교육과정 PDF: `{CURRICULUM_PDF.relative_to(PROJECT_ROOT)}`",
        f"- 공식 교육과정 SHA-256: `{data['metadata']['curriculumPdf']['sha256']}`",
        f"- 공식 성취기준 고유 코드: {data['metadata']['counts']['achievementStandardsTotal']}개",
        "- 교과서 세부개념 원본 폴더: `교과서_원본/`",
        "",
        "## 공식 근거",
        "",
    ]
    for notice in OFFICIAL_NOTICES:
        lines.append(f"- [{notice['title']}]({notice['url']}) - {notice['note']}")
    lines.extend(["", "## 제공 교과서 원본", ""])
    if not sources:
        lines.append("- 현재 제공된 교과서, 익힘책, 지도서 PDF/이미지 파일이 없습니다.")
    else:
        lines.extend(
            [
                "| 파일 | 교육과정 | 학년 | 출판사 | 책종 | 권 | 쪽수 | PDF 헤더 | 바이트 | SHA-256 | 상태 |",
                "| --- | --- | --- | --- | --- | --- | ---: | --- | ---: | --- | --- |",
            ]
        )
        for source in sources:
            status = source.parse_issue or "등록"
            lines.append(
                "| "
                + " | ".join(
                    [
                        f"`{source.path.relative_to(PROJECT_ROOT)}`",
                        source.curriculum_year or "",
                        source.grade or "",
                        source.publisher or "",
                        source.book_type or "",
                        source.volume or "",
                        str(source.page_count or ""),
                        "" if source.pdf_header_valid is None else str(source.pdf_header_valid),
                        str(source.file_size),
                        f"`{source.sha256}`",
                        status,
                    ]
                )
                + " |"
            )
    lines.extend(
        [
            "",
            "## 저작권 처리 원칙",
            "",
            "- 산출물에는 교과서 원문 전체를 전재하지 않습니다.",
            "- 개념명, 짧은 요약, 쪽수, 출처 파일 해시, 성취기준 연결 정보만 기록합니다.",
            "- 원본 PDF와 이미지는 `교과서_원본/`에 그대로 두며, 분석 결과와 원본은 분리합니다.",
        ]
    )
    return "\n".join(lines) + "\n"


def build_markdown(data: dict[str, Any]) -> str:
    counts = data["metadata"]["counts"]
    lines = [
        "# 초1-중3 수학 개념 위계도",
        "",
        "이 문서는 2022 개정 수학과 교육과정의 공식 학년군 위계를 골격으로 삼고, 사용자가 제공한 교과서·익힘책·지도서 원본에서 추출한 세부개념을 덧붙이기 위한 산출물입니다.",
        "",
        "## 현재 상태",
        "",
        f"- 공식 교육과정 내용 요소: {counts['curriculumNodes']}개",
        f"- 공식 성취기준 고유 코드: {counts['achievementStandardsTotal']}개",
        f"- 개념 관계 edge: {counts['conceptEdges']}개",
        f"- 교과서 세부개념 후보: {counts['textbookConcepts']}개",
        f"- 출처 원본 파일: {counts['sourceFiles']}개",
        "",
        "교과서 원본이 아직 제공되지 않아 현재 HTML과 PDF는 공식 교육과정 위계와 교과서 수집 대기 상태를 함께 보여줍니다. 위계는 한 줄짜리 진도선이 아니라 여러 선수개념이 합쳐지고 여러 후속개념으로 갈라지는 관계망으로 표현합니다.",
        "",
        "## 관계 지도 해석",
        "",
        "- `prerequisite`: 같은 영역 안에서 다음 개념을 직접 받치는 선수 관계",
        "- `cross_area`: 수와 연산, 변화와 관계, 도형과 측정, 자료와 가능성 사이를 넘어 전이되는 관계",
        "- `cross_link`: 같은 학년군 안팎에서 방정식-함수, 도형-측정처럼 서로 해석을 강화하는 관계",
        "- 이 edge는 교육과정 내용 요소의 개념적 의존을 정리한 해석 자료이며, 교과서 원본이 추가되면 더 세분화합니다.",
        "",
        "## 영역별 공식 위계",
        "",
    ]
    for area in AREAS:
        lines.append(f"### {area}")
        lines.append("")
        for grade_band in GRADE_BANDS:
            nodes = [node for node in data["curriculum_nodes"] if node["area"] == area and node["gradeBand"] == grade_band]
            labels = ", ".join(node["label"] for node in nodes)
            code_count = len({code for node in nodes for code in node["achievementCodes"]})
            lines.append(f"- **{grade_band}**: {labels} ({code_count}개 성취기준 연결)")
        lines.append("")
    lines.extend(
        [
            "## 교과서 세부개념 수집 기준",
            "",
            "- 대상 폴더: `교과서_원본/`",
            "- 파일명 규칙: `교육과정_학년_출판사_책종_권.pdf`",
            "- 포함 책종: 교과서, 익힘책, 지도서",
            "- 중3은 2026년 현행 교과서 상황을 반영해 `2015 현행 중3`으로 별도 표시합니다.",
            "- 원문 전체 전재 없이 개념명, 짧은 요약, 쪽수, 출처 파일 해시만 기록합니다.",
            "",
            "## 공식 적용·검정 근거",
            "",
        ]
    )
    for notice in OFFICIAL_NOTICES:
        lines.append(f"- [{notice['title']}]({notice['url']}): {notice['note']}")
    lines.extend(
        [
            "",
            "## 사용 방법",
            "",
            "1. `index.html`을 브라우저에서 엽니다.",
            "2. 검색창과 영역·학년군·책종 필터로 개념을 좁힙니다.",
            "3. 개념 카드를 클릭하면 오른쪽 패널에서 성취기준, 출처, 선수·후속 흐름을 확인합니다.",
            "4. 교과서 원본을 추가한 뒤 `tools/build_math_hierarchy.py`를 다시 실행하면 세부개념이 갱신됩니다.",
        ]
    )
    return "\n".join(lines) + "\n"


def to_json_script(data: dict[str, Any]) -> str:
    return html.escape(json.dumps(data, ensure_ascii=False, indent=2), quote=False)


def build_html(data: dict[str, Any]) -> str:
    data_json = to_json_script(data)
    return f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>초1-중3 수학 개념 위계도</title>
  <style>
    :root {{
      --bg: #f7f6f2;
      --panel: #ffffff;
      --ink: #202124;
      --muted: #6f746f;
      --line: #d8ded7;
      --teal: #176f72;
      --teal-soft: #e0f0ee;
      --blue: #dfeaf8;
      --green: #e4f0df;
      --pink: #f5e4ec;
      --yellow: #f5ead2;
      --amber: #a76010;
      --shadow: 0 12px 28px rgba(32, 33, 36, 0.08);
      color-scheme: light;
      font-family: "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      background: var(--bg);
      color: var(--ink);
    }}
    button, input, select {{ font: inherit; }}
    .app {{
      min-height: 100vh;
      display: grid;
      grid-template-columns: minmax(220px, 280px) 1fr minmax(300px, 360px);
      gap: 16px;
      padding: 18px;
    }}
    .sidebar, .detail, .main {{
      background: var(--panel);
      border: 1px solid var(--line);
      box-shadow: var(--shadow);
    }}
    .sidebar, .detail {{
      border-radius: 8px;
      padding: 16px;
      align-self: start;
      position: sticky;
      top: 18px;
      max-height: calc(100vh - 36px);
      overflow: auto;
    }}
    .main {{
      border-radius: 8px;
      overflow: hidden;
      min-width: 0;
    }}
    .brand {{
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 18px;
    }}
    .mark {{
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: #113d3f;
      color: white;
      display: grid;
      place-items: center;
      font-weight: 800;
    }}
    h1 {{
      font-size: 22px;
      line-height: 1.25;
      margin: 0;
      letter-spacing: 0;
    }}
    h2 {{
      font-size: 15px;
      margin: 18px 0 10px;
      letter-spacing: 0;
    }}
    .subtle {{ color: var(--muted); font-size: 12px; line-height: 1.5; }}
    .control {{
      display: grid;
      gap: 6px;
      margin-bottom: 12px;
    }}
    label {{ font-size: 12px; color: var(--muted); }}
    input, select {{
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 7px;
      padding: 10px 11px;
      background: #fbfbf8;
      color: var(--ink);
    }}
    .status {{
      display: grid;
      gap: 8px;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid var(--line);
    }}
    .pill {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 26px;
      padding: 5px 9px;
      border-radius: 999px;
      background: #eef1ea;
      color: #33413c;
      font-size: 12px;
      font-weight: 700;
      width: fit-content;
      max-width: 100%;
    }}
    .pill.warn {{ background: #fff0cf; color: var(--amber); }}
    .pill.teal {{ background: var(--teal-soft); color: var(--teal); }}
    .topbar {{
      padding: 18px 20px;
      border-bottom: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: start;
    }}
    .topbar h1 {{ font-size: 26px; }}
    .metrics {{
      display: grid;
      grid-template-columns: repeat(4, minmax(82px, 1fr));
      gap: 8px;
      min-width: 360px;
    }}
    .metric {{
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 8px;
      background: #fafaf6;
    }}
    .metric strong {{ display: block; font-size: 20px; }}
    .metric span {{ color: var(--muted); font-size: 11px; }}
    .legend {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px 20px;
      border-bottom: 1px solid var(--line);
    }}
    .canvas {{
      padding: 18px;
      overflow: auto;
    }}
    .network-panel {{
      min-width: 920px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfbf8;
      margin-bottom: 18px;
      overflow: hidden;
    }}
    .section-head {{
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      padding: 12px 14px;
      border-bottom: 1px solid var(--line);
      background: #fafaf6;
    }}
    .section-head h2 {{
      margin: 0;
      font-size: 18px;
      color: #183b3c;
    }}
    .network-wrap {{
      position: relative;
      height: 540px;
      background:
        linear-gradient(to right, transparent 0 24%, rgba(216, 222, 215, 0.75) 24% 24.15%, transparent 24.15% 49%, rgba(216, 222, 215, 0.75) 49% 49.15%, transparent 49.15% 74%, rgba(216, 222, 215, 0.75) 74% 74.15%, transparent 74.15%),
        #fffefa;
    }}
    .network-svg {{
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }}
    .network-edge {{
      fill: none;
      stroke: rgba(23, 111, 114, 0.35);
      stroke-width: 1.4;
    }}
    .network-edge.cross_area {{
      stroke: rgba(167, 96, 16, 0.48);
      stroke-dasharray: 6 5;
    }}
    .network-edge.cross_link {{
      stroke: rgba(72, 90, 150, 0.42);
      stroke-dasharray: 2 4;
    }}
    .network-node {{
      position: absolute;
      width: 132px;
      min-height: 44px;
      transform: translate(-50%, -50%);
      border: 1px solid #cdd8d3;
      border-left: 4px solid var(--teal);
      border-radius: 7px;
      background: white;
      padding: 7px 8px;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 5px 14px rgba(32, 33, 36, 0.06);
    }}
    .network-node:hover, .network-node:focus {{
      outline: 2px solid #85bdb6;
      outline-offset: 1px;
      z-index: 3;
    }}
    .network-node.selected {{
      background: #f0faf8;
      border-color: #125b5f;
      z-index: 4;
    }}
    .network-node strong {{
      display: block;
      font-size: 12px;
      line-height: 1.25;
    }}
    .network-node span {{
      color: var(--muted);
      display: block;
      font-size: 10px;
      margin-top: 4px;
    }}
    .grade-axis {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      padding: 10px 14px 0;
      color: #3b403c;
      font-weight: 800;
      font-size: 12px;
    }}
    .grade-axis span {{
      border-radius: 7px;
      background: #edece5;
      padding: 6px 8px;
      text-align: center;
    }}
    .relationship-note {{
      padding: 0 14px 12px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
    }}
    .card-section-title {{
      min-width: 920px;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      margin: 2px 0 10px;
    }}
    .card-section-title h2 {{
      margin: 0;
      font-size: 18px;
      color: #183b3c;
    }}
    .grid {{
      min-width: 920px;
      display: grid;
      gap: 14px;
    }}
    .grade-head {{
      display: grid;
      grid-template-columns: 150px repeat(4, minmax(170px, 1fr));
      gap: 10px;
      align-items: stretch;
    }}
    .grade-head div {{
      border-radius: 8px;
      background: #edece5;
      padding: 9px 12px;
      font-weight: 800;
      color: #3b403c;
      min-height: 38px;
    }}
    .area-row {{
      display: grid;
      grid-template-columns: 150px repeat(4, minmax(170px, 1fr));
      gap: 10px;
      align-items: stretch;
    }}
    .area-label {{
      border-radius: 8px;
      padding: 12px;
      font-weight: 900;
      display: flex;
      align-items: center;
      min-height: 120px;
      line-height: 1.35;
    }}
    .area-0 .area-label {{ background: var(--blue); }}
    .area-1 .area-label {{ background: var(--green); }}
    .area-2 .area-label {{ background: var(--pink); }}
    .area-3 .area-label {{ background: var(--yellow); }}
    .lane {{
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 8px;
      background: #fbfbf8;
      min-height: 138px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }}
    .card {{
      width: 100%;
      text-align: left;
      border: 1px solid #d7ddd5;
      border-left: 4px solid var(--teal);
      border-radius: 7px;
      background: white;
      padding: 8px 9px;
      cursor: pointer;
      min-height: 54px;
    }}
    .card:hover, .card:focus {{
      outline: 2px solid #85bdb6;
      outline-offset: 1px;
    }}
    .card.selected {{
      border-color: #125b5f;
      background: #f0faf8;
    }}
    .card-title {{
      display: block;
      font-weight: 800;
      font-size: 13px;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }}
    .card-meta {{
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 6px;
      color: var(--muted);
      font-size: 11px;
    }}
    .empty {{
      border: 1px dashed #cfd6ce;
      border-radius: 8px;
      padding: 14px;
      color: var(--muted);
      background: #fbfaf3;
      line-height: 1.5;
    }}
    .detail h2 {{
      font-size: 20px;
      margin-top: 0;
      color: #183b3c;
    }}
    .detail-section {{
      border-top: 1px solid var(--line);
      padding-top: 12px;
      margin-top: 12px;
    }}
    .code-list {{
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }}
    .code {{
      border-radius: 6px;
      padding: 4px 6px;
      background: #eef1ea;
      font-size: 12px;
      font-weight: 700;
    }}
    .notice {{
      margin-top: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #fff7e6;
      color: #6a3a00;
      line-height: 1.5;
      font-size: 13px;
    }}
    .target {{
      margin-top: 14px;
      display: grid;
      gap: 8px;
    }}
    .target img {{
      width: 100%;
      border-radius: 8px;
      border: 1px solid var(--line);
      display: block;
    }}
    @media (max-width: 1120px) {{
      .app {{ grid-template-columns: 1fr; }}
      .sidebar, .detail {{ position: static; max-height: none; }}
      .metrics {{ min-width: 0; grid-template-columns: repeat(2, minmax(100px, 1fr)); }}
      .topbar {{ flex-direction: column; }}
    }}
    @media print {{
      body {{ background: white; }}
      .app {{ display: block; padding: 0; }}
      .sidebar {{ display: none; }}
      .detail {{ display: none; }}
      .main {{ box-shadow: none; border: none; }}
      .canvas {{ overflow: visible; }}
      .grid {{ min-width: 0; }}
      .grade-head, .area-row {{ grid-template-columns: 120px repeat(4, 1fr); }}
    }}
  </style>
</head>
<body>
  <div class="app">
    <aside class="sidebar">
      <div class="brand">
        <div class="mark">수</div>
        <div>
          <h1>초1-중3 수학 개념 위계도</h1>
          <div class="subtle">교육과정 골격 + 교과서 세부개념</div>
        </div>
      </div>

      <div class="control">
        <label for="search">검색</label>
        <input id="search" type="search" placeholder="개념, 성취기준, 출판사 검색">
      </div>
      <div class="control">
        <label for="areaFilter">영역</label>
        <select id="areaFilter"></select>
      </div>
      <div class="control">
        <label for="gradeFilter">학년군</label>
        <select id="gradeFilter"></select>
      </div>
      <div class="control">
        <label for="bookTypeFilter">책종</label>
        <select id="bookTypeFilter"></select>
      </div>

      <div class="status">
        <span class="pill teal" id="sourceStatus">교과서 원본 대기</span>
        <span class="pill warn">중3 2015 현행 별도 표시</span>
        <p class="subtle">교과서 원본을 `교과서_원본/`에 넣고 빌드 스크립트를 다시 실행하면 세부개념 카드가 추가됩니다.</p>
      </div>

      <div class="target">
        <h2>목표 화면</h2>
        <img src="assets/target-screen.png" alt="GPT Image로 생성한 16:9 목표 화면" onerror="this.style.display='none'">
      </div>
    </aside>

    <main class="main">
      <section class="topbar">
        <div>
          <h1>초1-중3 수학 개념 위계도</h1>
          <p class="subtle">공식 내용 요소와 성취기준을 먼저 세우고, 제공된 교과서·익힘책·지도서의 사소한 개념을 아래층에 붙입니다.</p>
        </div>
        <div class="metrics">
          <div class="metric"><strong id="metricNodes">0</strong><span>교육과정 노드</span></div>
          <div class="metric"><strong id="metricCodes">0</strong><span>성취기준</span></div>
          <div class="metric"><strong id="metricTextbook">0</strong><span>교과서 세부개념</span></div>
          <div class="metric"><strong id="metricSources">0</strong><span>원본 파일</span></div>
        </div>
      </section>
      <section class="legend">
        <span class="pill">교과서</span>
        <span class="pill">익힘책</span>
        <span class="pill">지도서</span>
        <span class="pill warn">2015 중3</span>
        <span class="pill teal">2022 공식 위계</span>
      </section>
      <section class="canvas">
        <div class="network-panel">
          <div class="section-head">
            <h2>관계 지도</h2>
            <span class="pill teal" id="networkMeta">선수·교차 관계</span>
          </div>
          <div class="grade-axis">
            <span>초1-2</span>
            <span>초3-4</span>
            <span>초5-6</span>
            <span>중1-3</span>
          </div>
          <div class="network-wrap" id="networkWrap">
            <svg class="network-svg" id="networkSvg" aria-hidden="true"></svg>
            <div id="networkNodes"></div>
          </div>
          <div class="relationship-note">실선은 직접 선수 관계, 점선은 영역을 넘어 전이되는 관계입니다. 이 관계는 단일 진도선이 아니라 여러 개념이 합쳐지고 갈라지는 교육과정 해석 지도입니다.</div>
        </div>
        <div class="card-section-title">
          <h2>영역별 카드</h2>
          <span class="pill">목록형 탐색</span>
        </div>
        <div class="grid" id="hierarchyGrid"></div>
        <div id="textbookSection"></div>
      </section>
    </main>

    <aside class="detail" id="detailPanel">
      <h2>개념을 선택하세요</h2>
      <p class="subtle">카드를 클릭하면 연결 성취기준, 출처, 선수·후속 흐름이 여기에 표시됩니다.</p>
      <div class="notice" id="accessNotice"></div>
    </aside>
  </div>

  <script id="hierarchyData" type="application/json">{data_json}</script>
  <script>
    const DATA = JSON.parse(document.getElementById('hierarchyData').textContent);
    const state = {{ search: '', area: '전체', grade: '전체', bookType: '전체', selectedId: null }};
    const areas = DATA.metadata.areas;
    const grades = DATA.metadata.gradeBands;
    const nodesById = new Map(DATA.curriculum_nodes.map(node => [node.id, node]));
    const standardsByCode = new Map(DATA.achievement_standards.map(item => [item.code, item]));
    const areaColors = {{
      '수와 연산': '#4b8ccf',
      '변화와 관계': '#399167',
      '도형과 측정': '#c76d92',
      '자료와 가능성': '#c79a35'
    }};

    function escapeHtml(value) {{
      return String(value ?? '').replace(/[&<>"']/g, char => ({{
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }}[char]));
    }}

    function optionList(select, values) {{
      select.innerHTML = values.map(value => `<option value="${{value}}">${{value}}</option>`).join('');
    }}

    function matchesNode(node) {{
      const q = state.search.trim().toLowerCase();
      const haystack = [
        node.label,
        node.summary,
        node.area,
        node.gradeBand,
        ...(node.achievementCodes || []),
        ...(node.coreIdeas || [])
      ].join(' ').toLowerCase();
      return (state.area === '전체' || node.area === state.area)
        && (state.grade === '전체' || node.gradeBand === state.grade)
        && (!q || haystack.includes(q));
    }}

    function card(node) {{
      const codes = node.achievementCodes || [];
      return `<button class="card ${{state.selectedId === node.id ? 'selected' : ''}}" data-id="${{node.id}}">
        <span class="card-title">${{node.label}}</span>
        <span class="card-meta"><span>${{node.gradeBand}}</span><span>${{codes.length}}개 성취기준</span><span>선수 ${{(node.prerequisiteNodeIds || []).length}}</span><span>후속 ${{(node.successorNodeIds || []).length}}</span></span>
      </button>`;
    }}

    function edgeVisible(edge, visibleIds) {{
      return visibleIds.has(edge.from) && visibleIds.has(edge.to);
    }}

    function networkNodesForState() {{
      const connectedIds = new Set();
      DATA.edges.forEach(edge => {{
        connectedIds.add(edge.from);
        connectedIds.add(edge.to);
      }});
      let nodes = DATA.curriculum_nodes
        .filter(node => connectedIds.has(node.id))
        .filter(matchesNode);
      if (state.selectedId) {{
        const selected = nodesById.get(state.selectedId);
        const neighborIds = new Set([state.selectedId]);
        DATA.edges.forEach(edge => {{
          if (edge.from === state.selectedId) neighborIds.add(edge.to);
          if (edge.to === state.selectedId) neighborIds.add(edge.from);
        }});
        const neighbors = [...neighborIds].map(id => nodesById.get(id)).filter(Boolean);
        const merged = new Map(nodes.map(node => [node.id, node]));
        neighbors.forEach(node => merged.set(node.id, node));
        nodes = [...merged.values()];
      }}
      return nodes.sort((a, b) => {{
        const gradeDelta = grades.indexOf(a.gradeBand) - grades.indexOf(b.gradeBand);
        if (gradeDelta) return gradeDelta;
        const areaDelta = areas.indexOf(a.area) - areas.indexOf(b.area);
        if (areaDelta) return areaDelta;
        return a.order - b.order;
      }});
    }}

    function renderNetwork() {{
      const wrap = document.getElementById('networkWrap');
      const svg = document.getElementById('networkSvg');
      const host = document.getElementById('networkNodes');
      const meta = document.getElementById('networkMeta');
      const width = Math.max(920, wrap.clientWidth || 920);
      const height = 540;
      const nodes = networkNodesForState();
      const ids = new Set(nodes.map(node => node.id));
      const edges = DATA.edges.filter(edge => edgeVisible(edge, ids));
      const byGrade = new Map(grades.map(grade => [grade, []]));
      nodes.forEach(node => byGrade.get(node.gradeBand)?.push(node));
      const positions = new Map();
      grades.forEach((grade, gradeIndex) => {{
        const column = byGrade.get(grade) || [];
        const usable = height - 96;
        const step = column.length > 1 ? Math.min(58, usable / (column.length - 1)) : 0;
        const total = step * Math.max(0, column.length - 1);
        const start = 70 + Math.max(0, (usable - total) / 2);
        column.forEach((node, index) => {{
          positions.set(node.id, {{
            x: Math.round(((gradeIndex + 0.5) / grades.length) * width),
            y: Math.round(start + index * step)
          }});
        }});
      }});
      const marker = `<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="rgba(23,111,114,.52)"></path></marker></defs>`;
      const edgePaths = edges.map(edge => {{
        const a = positions.get(edge.from);
        const b = positions.get(edge.to);
        if (!a || !b) return '';
        const dx = Math.max(80, Math.abs(b.x - a.x) * 0.48);
        const curve = `M ${{a.x + 58}} ${{a.y}} C ${{a.x + dx}} ${{a.y}}, ${{b.x - dx}} ${{b.y}}, ${{b.x - 58}} ${{b.y}}`;
        return `<path class="network-edge ${{edge.type}}" d="${{curve}}" marker-end="url(#arrow)"><title>${{escapeHtml(edge.label)}}</title></path>`;
      }}).join('');
      svg.setAttribute('viewBox', `0 0 ${{width}} ${{height}}`);
      svg.innerHTML = marker + edgePaths;
      host.innerHTML = nodes.map(node => {{
        const pos = positions.get(node.id);
        const selected = state.selectedId === node.id ? ' selected' : '';
        return `<button class="network-node${{selected}}" data-id="${{node.id}}" style="left:${{pos.x}}px;top:${{pos.y}}px;border-left-color:${{areaColors[node.area] || '#176f72'}}">
          <strong>${{escapeHtml(node.label)}}</strong>
          <span>${{escapeHtml(node.area)}} · ${{escapeHtml(node.gradeBand)}}</span>
        </button>`;
      }}).join('');
      host.querySelectorAll('.network-node').forEach(button => {{
        button.addEventListener('click', () => {{
          state.selectedId = button.dataset.id;
          renderAll();
          renderDetail(nodesById.get(state.selectedId));
        }});
      }});
      meta.textContent = `${{edges.length}}개 관계 · ${{nodes.length}}개 개념`;
    }}

    function renderGrid() {{
      const grid = document.getElementById('hierarchyGrid');
      const head = `<div class="grade-head"><div>영역</div>${{grades.map(g => `<div>${{g}}</div>`).join('')}}</div>`;
      const rows = areas.map((area, areaIndex) => {{
        const cells = grades.map(grade => {{
          const cards = DATA.curriculum_nodes
            .filter(node => node.area === area && node.gradeBand === grade)
            .filter(matchesNode)
            .map(card)
            .join('');
          return `<div class="lane">${{cards || '<div class="empty">필터 조건에 맞는 개념 없음</div>'}}</div>`;
        }}).join('');
        return `<div class="area-row area-${{areaIndex}}"><div class="area-label">${{area}}</div>${{cells}}</div>`;
      }}).join('');
      grid.innerHTML = head + rows;
      grid.querySelectorAll('.card').forEach(button => {{
        button.addEventListener('click', () => {{
          state.selectedId = button.dataset.id;
          renderAll();
          renderDetail(nodesById.get(state.selectedId));
        }});
      }});
    }}

    function textbookMatches(item) {{
      const q = state.search.trim().toLowerCase();
      const haystack = [item.label, item.summary, item.publisher, item.bookType, item.grade, item.area].join(' ').toLowerCase();
      return (state.area === '전체' || item.area === state.area)
        && (state.grade === '전체' || item.gradeBand === state.grade)
        && (state.bookType === '전체' || item.bookType === state.bookType)
        && (!q || haystack.includes(q));
    }}

    function renderTextbookSection() {{
      const section = document.getElementById('textbookSection');
      const items = DATA.textbook_concepts.filter(textbookMatches).slice(0, 80);
      if (!DATA.textbook_concepts.length) {{
        section.innerHTML = `<div class="empty" style="margin-top:16px">교과서 원본 대기: 현재 <code>교과서_원본/</code>에 분석할 파일이 없어 세부개념 카드는 생성되지 않았습니다.</div>`;
        return;
      }}
      section.innerHTML = `<h2>교과서 세부개념</h2><div class="lane">${{items.map(item => `<button class="card" data-textbook="${{item.id}}"><span class="card-title">${{item.label}}</span><span class="card-meta"><span>${{item.grade || ''}}</span><span>${{item.publisher || ''}}</span><span>${{item.bookType || ''}}</span><span>${{item.page}}쪽</span></span></button>`).join('')}}</div>`;
    }}

    function renderDetail(node) {{
      const panel = document.getElementById('detailPanel');
      if (!node) return;
      const codes = (node.achievementCodes || []).map(code => standardsByCode.get(code)).filter(Boolean);
      const codeHtml = codes.length ? codes.map(item => `<span class="code" title="${{item.summary}}">${{item.code}}</span>`).join('') : '<span class="subtle">연결 성취기준 없음</span>';
      const standardHtml = codes.slice(0, 8).map(item => `<li><strong>${{item.code}}</strong> ${{item.summary}}</li>`).join('');
      const incoming = DATA.edges.filter(edge => edge.to === node.id);
      const outgoing = DATA.edges.filter(edge => edge.from === node.id);
      const relationList = edges => edges.length
        ? `<ul>${{edges.map(edge => {{
            const otherId = edge.to === node.id ? edge.from : edge.to;
            const other = nodesById.get(otherId);
            return `<li><strong>${{escapeHtml(other?.label || '')}}</strong> <span class="subtle">(${{escapeHtml(edge.label)}})</span></li>`;
          }}).join('')}}</ul>`
        : '<p class="subtle">없음</p>';
      panel.innerHTML = `
        <h2>${{node.label}}</h2>
        <span class="pill teal">${{node.gradeBand}}</span>
        <span class="pill">${{node.area}}</span>
        <div class="detail-section">
          <p>${{node.summary}}</p>
          <div class="code-list">${{codeHtml}}</div>
        </div>
        <div class="detail-section">
          <h2>성취기준 요약</h2>
          <ul>${{standardHtml || '<li>표시할 성취기준 요약이 없습니다.</li>'}}</ul>
        </div>
        <div class="detail-section">
          <h2>선수 흐름</h2>
          ${{relationList(incoming)}}
        </div>
        <div class="detail-section">
          <h2>후속·교차 흐름</h2>
          ${{relationList(outgoing)}}
        </div>
        <div class="detail-section">
          <h2>출처</h2>
          <p class="subtle">${{node.source.pdf}} · ${{node.source.pageRange || node.source.page || ''}}쪽 · ${{node.source.basis}}</p>
        </div>
      `;
    }}

    function renderAccessNotice() {{
      const notice = document.getElementById('accessNotice');
      if (!notice) return;
      const blocking = DATA.access_issues.find(issue => issue.severity === 'blocking_for_textbook_detail');
      if (blocking) notice.textContent = blocking.message;
    }}

    function renderMetrics() {{
      document.getElementById('metricNodes').textContent = DATA.metadata.counts.curriculumNodes;
      document.getElementById('metricCodes').textContent = DATA.metadata.counts.achievementStandardsTotal;
      document.getElementById('metricTextbook').textContent = DATA.metadata.counts.textbookConcepts;
      document.getElementById('metricSources').textContent = DATA.metadata.counts.sourceFiles;
      document.getElementById('sourceStatus').textContent = DATA.metadata.counts.sourceFiles ? '교과서 원본 등록' : '교과서 원본 대기';
    }}

    function renderAll() {{
      renderMetrics();
      renderNetwork();
      renderGrid();
      renderTextbookSection();
      renderAccessNotice();
    }}

    optionList(document.getElementById('areaFilter'), ['전체', ...areas]);
    optionList(document.getElementById('gradeFilter'), ['전체', ...grades]);
    optionList(document.getElementById('bookTypeFilter'), ['전체', '교과서', '익힘책', '지도서']);
    document.getElementById('search').addEventListener('input', event => {{ state.search = event.target.value; renderAll(); }});
    document.getElementById('areaFilter').addEventListener('change', event => {{ state.area = event.target.value; renderAll(); }});
    document.getElementById('gradeFilter').addEventListener('change', event => {{ state.grade = event.target.value; renderAll(); }});
    document.getElementById('bookTypeFilter').addEventListener('change', event => {{ state.bookType = event.target.value; renderAll(); }});
    renderAll();
  </script>
</body>
</html>
"""


def build_pdf(data: dict[str, Any]) -> None:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import mm
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

    font_path = Path("C:/Windows/Fonts/malgun.ttf")
    bold_path = Path("C:/Windows/Fonts/malgunbd.ttf")
    font_name = "MalgunGothic"
    bold_name = "MalgunGothicBold"
    if font_path.exists():
        pdfmetrics.registerFont(TTFont(font_name, str(font_path)))
        if bold_path.exists():
            pdfmetrics.registerFont(TTFont(bold_name, str(bold_path)))
        else:
            bold_name = font_name
    else:
        font_name = "Helvetica"
        bold_name = "Helvetica-Bold"

    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "KTitle",
        parent=styles["Title"],
        fontName=bold_name,
        fontSize=18,
        leading=24,
        spaceAfter=10,
    )
    heading = ParagraphStyle(
        "KHeading",
        parent=styles["Heading2"],
        fontName=bold_name,
        fontSize=12,
        leading=16,
        spaceBefore=12,
        spaceAfter=6,
    )
    body = ParagraphStyle("KBody", parent=styles["BodyText"], fontName=font_name, fontSize=9, leading=13)
    small = ParagraphStyle("KSmall", parent=body, fontSize=8, leading=11, textColor=colors.HexColor("#555555"))
    def pcell(value: Any, style: ParagraphStyle = body) -> Paragraph:
        return Paragraph(html.escape(str(value)), style)

    doc = SimpleDocTemplate(
        str(OUTPUT_DIR / "수학_개념_위계도.pdf"),
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
    )
    story: list[Any] = []
    counts = data["metadata"]["counts"]
    story.append(Paragraph("초1-중3 수학 개념 위계도", title))
    story.append(
        Paragraph(
            f"공식 교육과정 내용 요소 {counts['curriculumNodes']}개, 성취기준 {counts['achievementStandardsTotal']}개, 개념 관계 edge {counts['conceptEdges']}개를 골격으로 구성했습니다. 교과서 세부개념은 `교과서_원본/` 제공 파일 기준으로 갱신됩니다.",
            body,
        )
    )
    story.append(Spacer(1, 5 * mm))

    summary_rows = [
        [pcell("구분"), pcell("값")],
        [pcell("교육과정 PDF"), pcell(Path(data["metadata"]["curriculumPdf"]["file"]).name)],
        [pcell("SHA-256"), pcell(data["metadata"]["curriculumPdf"]["sha256"][:24] + "...")],
        [pcell("개념 관계 edge"), pcell(str(counts["conceptEdges"]))],
        [pcell("교과서 원본 파일"), pcell(str(counts["sourceFiles"]))],
        [pcell("교과서 세부개념 후보"), pcell(str(counts["textbookConcepts"]))],
    ]
    table = Table(summary_rows, colWidths=[38 * mm, 130 * mm])
    table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (-1, -1), font_name),
                ("FONTNAME", (0, 0), (-1, 0), bold_name),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e0f0ee")),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cfd6ce")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("LEADING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    story.append(table)
    story.append(Paragraph("관계 지도 해석", heading))
    story.append(
        Paragraph(
            "이 산출물의 위계는 한 줄짜리 진도선이 아니라 여러 선수개념이 합쳐지고 여러 후속개념으로 갈라지는 관계망입니다. 실선은 직접 선수 관계, 점선은 영역을 넘는 전이 또는 해석 연결을 뜻합니다.",
            body,
        )
    )

    for area in AREAS:
        story.append(Paragraph(area, heading))
        rows = [[pcell("학년군"), pcell("내용 요소")]]
        for grade_band in GRADE_BANDS:
            labels = [node["label"] for node in data["curriculum_nodes"] if node["area"] == area and node["gradeBand"] == grade_band]
            rows.append([pcell(grade_band), pcell(", ".join(labels), small)])
        area_table = Table(rows, colWidths=[25 * mm, 143 * mm])
        area_table.setStyle(
            TableStyle(
                [
                    ("FONTNAME", (0, 0), (-1, -1), font_name),
                    ("FONTNAME", (0, 0), (-1, 0), bold_name),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1eee6")),
                    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#d8ded7")),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("FONTSIZE", (0, 0), (-1, -1), 7.3),
                    ("LEADING", (0, 0), (-1, -1), 9.5),
                ]
            )
        )
        story.append(area_table)

    if data["access_issues"]:
        story.append(Paragraph("접근/자료 이슈", heading))
        for issue in data["access_issues"]:
            story.append(Paragraph(f"- {issue['message']}", small))

    story.append(Paragraph("중3 처리", heading))
    story.append(
        Paragraph(
            "2026년 현행 중3 교과서 세부개념은 2015 개정 자료로 별도 표시합니다. 2022 개정 중3 교과서 원본이 제공되면 별도 노드로 추가해 비교할 수 있습니다.",
            body,
        )
    )
    doc.build(story)


def write_outputs() -> None:
    ensure_dirs()
    reader = PdfReader(str(CURRICULUM_PDF))
    curriculum_pdf_meta = {
        "file": str(CURRICULUM_PDF.relative_to(PROJECT_ROOT)),
        "sha256": sha256_file(CURRICULUM_PDF),
        "fileSize": CURRICULUM_PDF.stat().st_size,
        "pageCount": len(reader.pages),
        "pdfHeaderValid": CURRICULUM_PDF.open("rb").read(5) == b"%PDF-",
    }
    standards = extract_achievement_standards()
    curriculum_nodes, edges = build_curriculum_nodes(standards)
    sources = source_files()
    textbook_concepts, access_issues = textbook_concepts_from_sources(sources, curriculum_nodes)

    textbook_counts_by_parent: dict[str, int] = {}
    for concept in textbook_concepts:
        parent_id = concept.get("parentNodeId")
        if parent_id:
            textbook_counts_by_parent[parent_id] = textbook_counts_by_parent.get(parent_id, 0) + 1
    for node in curriculum_nodes:
        node["textbookConceptCount"] = textbook_counts_by_parent.get(node["id"], 0)

    standards_by_prefix = {}
    for standard in standards:
        prefix = standard["code"][:2]
        standards_by_prefix[prefix] = standards_by_prefix.get(prefix, 0) + 1
    edge_counts_by_type: dict[str, int] = {}
    for edge in edges:
        edge_counts_by_type[edge["type"]] = edge_counts_by_type.get(edge["type"], 0) + 1

    data = {
        "metadata": {
            "title": "초1-중3 수학 개념 위계도",
            "generatedAt": datetime.now().replace(microsecond=0).isoformat(),
            "version": "1.0.0",
            "areas": AREAS,
            "gradeBands": GRADE_BANDS,
            "curriculumPdf": curriculum_pdf_meta,
            "officialNotices": OFFICIAL_NOTICES,
            "textbookSourceRule": {
                "folder": "교과서_원본/",
                "filenamePattern": "교육과정_학년_출판사_책종_권.pdf",
                "bookTypes": ["교과서", "익힘책", "지도서"],
                "middle3Policy": "2015 현행 중3 별도 표시",
            },
            "counts": {
                "curriculumNodes": len(curriculum_nodes),
                "achievementStandardsTotal": len(standards),
                "achievementStandardsByPrefix": standards_by_prefix,
                "conceptEdges": len(edges),
                "conceptEdgesByType": edge_counts_by_type,
                "textbookConcepts": len(textbook_concepts),
                "sourceFiles": len(sources),
                "accessIssues": len(access_issues),
            },
        },
        "curriculum_nodes": curriculum_nodes,
        "achievement_standards": standards,
        "textbook_concepts": textbook_concepts,
        "edges": edges,
        "source_files": [
            {
                "file": str(source.path.relative_to(PROJECT_ROOT)),
                "curriculumYear": source.curriculum_year,
                "grade": source.grade,
                "publisher": source.publisher,
                "bookType": source.book_type,
                "volume": source.volume,
                "fileSize": source.file_size,
                "sha256": source.sha256,
                "pageCount": source.page_count,
                "pdfHeaderValid": source.pdf_header_valid,
                "parseIssue": source.parse_issue,
            }
            for source in sources
        ],
        "access_issues": access_issues,
    }

    (DATA_DIR / "math_concept_hierarchy.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (OUTPUT_DIR / "index.html").write_text(build_html(data), encoding="utf-8")
    (OUTPUT_DIR / "수학_개념_위계도.md").write_text(build_markdown(data), encoding="utf-8")
    (OUTPUT_DIR / "SOURCE_MANIFEST.md").write_text(build_source_manifest(sources, data), encoding="utf-8")
    (OUTPUT_DIR / "README.md").write_text(
        """# 수학 개념 위계도

2022 개정 수학과 교육과정의 초1-중3 공식 위계를 바탕으로, 사용자가 제공한 교과서·익힘책·지도서 세부개념을 연결하는 산출물입니다. 위계는 한 줄짜리 순서가 아니라 여러 선수개념이 합쳐지고 갈라지는 관계 지도와 영역별 카드로 함께 제공합니다.

## 열기

- 인터랙티브 HTML: `index.html`
- 원천 데이터: `data/math_concept_hierarchy.json`
- 문서 요약: `수학_개념_위계도.md`
- PDF 요약: `수학_개념_위계도.pdf`
- 출처 매니페스트: `SOURCE_MANIFEST.md`

## 갱신

`교과서_원본/`에 원본 파일을 넣은 뒤 아래 명령을 실행합니다.

```powershell
& "C:\\Users\\pbj95\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe" "수학_개념_위계도\\tools\\build_math_hierarchy.py"
```
""",
        encoding="utf-8",
    )
    build_pdf(data)


if __name__ == "__main__":
    write_outputs()
