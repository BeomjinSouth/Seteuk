from __future__ import annotations

import hashlib
import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class SubjectSpec:
    index: int
    subject: str
    prefixes: tuple[str, ...]
    source_url: str
    note: str = ""


SUBJECTS: list[SubjectSpec] = [
    SubjectSpec(1, "국어", ("9국",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003584&orgType=ogi4"),
    SubjectSpec(2, "수학", ("9수",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003592&orgType=ogi4"),
    SubjectSpec(3, "영어", ("9영",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003602&orgType=ogi4"),
    SubjectSpec(4, "사회", ("9사(지리)", "9사(일사)", "9역"), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003806&orgType=ogi4"),
    SubjectSpec(5, "도덕", ("9도",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003740&orgType=ogi4"),
    SubjectSpec(6, "과학", ("9과",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003581&orgType=ogi4"),
    SubjectSpec(7, "체육", ("9체",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003697&orgType=ogi4"),
    SubjectSpec(8, "음악", ("9음",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003594&orgType=ogi4"),
    SubjectSpec(9, "미술", ("9미",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003588&orgType=ogi4"),
    SubjectSpec(10, "기술·가정", ("9기가",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003783&orgType=ogi4"),
    SubjectSpec(11, "정보", ("9정",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003785&orgType=ogi4"),
    SubjectSpec(
        12,
        "생활 외국어",
        (),
        "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003721&orgType=ogi4",
        "별책16 PDF는 이미지 기반으로 pdftotext 성취기준 코드가 추출되지 않아 생활 외국어 공통 영역 구조로 요약했다.",
    ),
    SubjectSpec(13, "한문", ("9한",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003748&orgType=ogi4"),
    SubjectSpec(14, "환경", ("9환",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003767&orgType=ogi4"),
    SubjectSpec(15, "보건", ("9보",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003775&orgType=ogi4"),
    SubjectSpec(16, "진로와 직업", ("9진로",), "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003773&orgType=ogi4"),
    SubjectSpec(
        17,
        "한국어 교육과정",
        (),
        "https://ncic.re.kr/inv/org/download.do?year=2022&seq=10003606&orgType=ogi4",
        "한국어 교육과정은 별책41(교육부 고시 제2017-131호) 구조에 따라 영역형으로 정리했다.",
    ),
]


AREA_BY_CODE: dict[str, dict[str, str]] = {
    "국어": {
        "01": "듣기·말하기",
        "02": "읽기",
        "03": "쓰기",
        "04": "문법",
        "05": "문학",
        "06": "매체",
    },
    "수학": {
        "01": "수와 연산",
        "02": "변화와 관계",
        "03": "도형과 측정",
        "04": "자료와 가능성",
    },
    "영어": {
        "01": "이해",
        "02": "표현",
    },
    "도덕": {
        "01": "자신과의 관계",
        "02": "타인과의 관계",
        "03": "사회·공동체와의 관계",
        "04": "자연과 초월과의 관계",
    },
    "체육": {
        "01": "건강",
        "02": "도전",
        "03": "경쟁",
        "04": "표현",
        "05": "안전",
    },
    "음악": {
        "01": "연주",
        "02": "감상",
        "03": "창작",
    },
    "미술": {
        "01": "체험",
        "02": "표현",
        "03": "감상",
    },
    "한문": {
        "01": "한자의 이해",
        "02": "한문 독해와 활용",
    },
    "환경": {
        "01": "환경과 인간",
        "02": "환경 체계",
        "03": "환경 문제와 쟁점",
        "04": "기후위기와 기후행동",
        "05": "지속가능성과 시민 참여",
    },
    "보건": {
        "01": "건강증진과 질병예방",
        "02": "정서와 정신건강",
        "03": "성과 건강",
        "04": "건강안전과 응급처치",
        "05": "건강자원과 건강문화",
    },
    "진로와 직업": {
        "01": "진로와 나의 이해",
        "02": "직업 세계와 진로 탐색",
        "03": "진로 설계와 실천",
    },
}


MANUAL_ROWS = {
    "생활 외국어": [
        {
            "대단원": "언어 이해",
            "중단원": "듣기",
            "소단원": "생활외국어-01 듣고 핵심 정보 파악",
            "성취기준 코드": "생활외국어-듣기",
            "내용 요소": "소리와 억양, 인사와 자기소개, 교실·가정·지역 생활 표현",
            "배우는 내용": "기초 어휘와 표현을 듣고 화자, 장소, 목적, 핵심 정보를 파악하며 실제 생활 상황에서 반응하는 방법을 배운다.",
            "핵심 아이디어": "생활 외국어는 일상적 상호작용 속에서 의미를 이해하고 타문화에 열린 태도로 소통하는 데 초점을 둔다.",
            "성취기준 해설 요약": "듣기 활동은 낱말 식별보다 상황과 의미 파악, 반응하기, 후속 말하기와의 통합을 중심으로 운영한다.",
            "적용 시 고려 사항": "발음의 정확성만 평가하지 않고 맥락 이해와 소통 참여를 함께 본다.",
            "페이지": "이미지 PDF",
        },
        {
            "대단원": "언어 표현",
            "중단원": "말하기",
            "소단원": "생활외국어-02 일상 의사 표현",
            "성취기준 코드": "생활외국어-말하기",
            "내용 요소": "인사, 소개, 요청, 감사와 사과, 선호·감정 표현",
            "배우는 내용": "친숙한 상황에서 자신과 주변을 소개하고, 필요한 것을 요청하거나 의견·감정을 간단히 표현하는 방법을 배운다.",
            "핵심 아이디어": "생활 외국어의 말하기는 정답 암기보다 실제 목적을 가진 짧은 상호작용을 통해 길러진다.",
            "성취기준 해설 요약": "대화문 암송을 넘어 상대의 반응을 듣고 말차례를 이어 가는 활동으로 구성한다.",
            "적용 시 고려 사항": "실수 수정은 의사소통을 방해하지 않는 범위에서 피드백하고, 짝·모둠 활동을 충분히 제공한다.",
            "페이지": "이미지 PDF",
        },
        {
            "대단원": "언어 이해",
            "중단원": "읽기",
            "소단원": "생활외국어-03 짧은 글과 생활 정보 읽기",
            "성취기준 코드": "생활외국어-읽기",
            "내용 요소": "문자와 표기, 표지·안내문·메시지, 짧은 대화문",
            "배우는 내용": "기본 문자와 표현을 바탕으로 표지, 안내, 일정, 짧은 메시지에서 필요한 정보를 찾아 이해하는 방법을 배운다.",
            "핵심 아이디어": "읽기는 문자 지식과 실제 생활 정보 탐색을 연결하여 외국어 사용 범위를 넓힌다.",
            "성취기준 해설 요약": "낯선 어휘를 모두 해석하기보다 시각 단서와 맥락을 활용해 필요한 정보를 찾게 한다.",
            "적용 시 고려 사항": "언어권별 문자 특성을 반영하되 학생 수준에 맞는 짧고 실제적인 자료를 사용한다.",
            "페이지": "이미지 PDF",
        },
        {
            "대단원": "언어 표현",
            "중단원": "쓰기",
            "소단원": "생활외국어-04 낱말과 짧은 문장 쓰기",
            "성취기준 코드": "생활외국어-쓰기",
            "내용 요소": "낱말 쓰기, 짧은 문장, 메모·초대·소개 글",
            "배우는 내용": "기본 문자와 표현을 활용해 이름, 장소, 시간, 선호, 간단한 메시지를 쓰고 의사소통 목적에 맞게 다듬는 방법을 배운다.",
            "핵심 아이디어": "쓰기는 배운 표현을 자신의 생활 맥락에 맞게 재구성하는 과정이다.",
            "성취기준 해설 요약": "베껴 쓰기에서 출발하되 점차 개인화된 문장과 짧은 글 산출로 확장한다.",
            "적용 시 고려 사항": "문법 오류를 과도하게 감점하기보다 의미 전달, 형식의 기본 충족, 수정 과정을 함께 평가한다.",
            "페이지": "이미지 PDF",
        },
        {
            "대단원": "문화 이해",
            "중단원": "문화",
            "소단원": "생활외국어-05 언어권 생활문화 이해",
            "성취기준 코드": "생활외국어-문화",
            "내용 요소": "일상 예절, 학교·가정·지역 문화, 문화 비교와 존중",
            "배우는 내용": "대상 언어권의 생활문화를 우리 문화와 비교하며 문화 다양성을 이해하고 존중하는 태도를 배운다.",
            "핵심 아이디어": "외국어 학습은 언어 형식과 함께 그 언어를 사용하는 사람들의 생활 방식과 가치를 이해하는 과정이다.",
            "성취기준 해설 요약": "문화 지식 전달에 머물지 않고 자료 조사, 비교, 발표, 체험 활동을 통해 문화 간 감수성을 기른다.",
            "적용 시 고려 사항": "고정관념을 강화하지 않도록 다양한 사례를 제시하고 학생의 삶과 연결해 성찰하게 한다.",
            "페이지": "이미지 PDF",
        },
    ],
    "한국어 교육과정": [
        {
            "대단원": "생활 한국어 교육",
            "중단원": "의사소통 한국어 - 듣기",
            "소단원": "한국어-생활-듣기 일상 지시와 대화 이해",
            "성취기준 코드": "한국어-생활-듣기",
            "내용 요소": "교실 표현, 일상 대화, 주변 사람과 사물, 상황 파악",
            "배우는 내용": "학교와 일상생활에서 자주 듣는 지시, 설명, 대화의 핵심 내용을 파악하고 적절히 반응하는 방법을 배운다.",
            "핵심 아이디어": "생활 한국어는 학교생활 적응과 기본 의사소통 참여를 가능하게 하는 실제 사용 능력에 초점을 둔다.",
            "성취기준 해설 요약": "짧은 지시와 대화 이해에서 시작해 상황, 목적, 화자의 의도를 파악하는 활동으로 확장한다.",
            "적용 시 고려 사항": "학습자의 한국어 수준과 체류 경험 차이를 고려해 시각 자료, 반복 듣기, 또래 협력을 제공한다.",
            "페이지": "내용체계",
        },
        {
            "대단원": "생활 한국어 교육",
            "중단원": "의사소통 한국어 - 말하기",
            "소단원": "한국어-생활-말하기 일상 표현과 상호작용",
            "성취기준 코드": "한국어-생활-말하기",
            "내용 요소": "인사, 자기소개, 요청, 경험 말하기, 대화 참여",
            "배우는 내용": "자신과 주변을 소개하고 필요한 것을 요청하며, 일상 경험과 생각을 상황에 맞게 말하는 방법을 배운다.",
            "핵심 아이디어": "말하기는 정확성뿐 아니라 학교 공동체 안에서 관계를 형성하고 의미를 협상하는 능력이다.",
            "성취기준 해설 요약": "정형 표현을 익힌 뒤 자신의 정보와 경험을 넣어 실제 대화를 이어 가도록 지도한다.",
            "적용 시 고려 사항": "발음·문법 오류보다 의사 전달, 말차례, 상대 배려를 함께 관찰한다.",
            "페이지": "내용체계",
        },
        {
            "대단원": "생활 한국어 교육",
            "중단원": "의사소통 한국어 - 읽기",
            "소단원": "한국어-생활-읽기 생활 정보 읽기",
            "성취기준 코드": "한국어-생활-읽기",
            "내용 요소": "표지, 안내문, 짧은 글, 중심 내용 파악",
            "배우는 내용": "학교와 지역에서 접하는 안내, 규칙, 짧은 글을 읽고 필요한 정보를 찾아 생활에 활용하는 방법을 배운다.",
            "핵심 아이디어": "읽기는 한국어 환경에서 자율적으로 정보를 얻고 생활 문제를 해결하는 기반이다.",
            "성취기준 해설 요약": "문장 단위 해석보다 목적에 맞는 정보 찾기와 중심 내용 이해를 중심으로 한다.",
            "적용 시 고려 사항": "어휘 난도를 조절하고 그림, 표, 실제 안내 자료 등 다중 양식 자료를 활용한다.",
            "페이지": "내용체계",
        },
        {
            "대단원": "생활 한국어 교육",
            "중단원": "의사소통 한국어 - 쓰기",
            "소단원": "한국어-생활-쓰기 짧은 생활 글 쓰기",
            "성취기준 코드": "한국어-생활-쓰기",
            "내용 요소": "낱말·문장 쓰기, 메모, 경험 기록, 간단한 요청 글",
            "배우는 내용": "일상생활에 필요한 낱말과 문장을 쓰고, 간단한 메모나 경험 글을 목적에 맞게 작성하는 방법을 배운다.",
            "핵심 아이디어": "쓰기는 학습자가 자신의 생활 경험을 한국어로 조직하고 공유하는 과정이다.",
            "성취기준 해설 요약": "문장 모방에서 출발해 개인화된 정보와 경험을 담은 짧은 글로 확장한다.",
            "적용 시 고려 사항": "초안, 교정, 다시 쓰기 과정을 평가에 포함하고 모국어 배경을 결핍으로 보지 않는다.",
            "페이지": "내용체계",
        },
        {
            "대단원": "학습 한국어 교육",
            "중단원": "학습 도구 한국어",
            "소단원": "한국어-학습도구 교과 학습 언어와 사고 도구",
            "성취기준 코드": "한국어-학습도구",
            "내용 요소": "사고 도구 어휘, 설명·비교·분류, 질문과 답변, 학습 전략",
            "배우는 내용": "수업에서 쓰이는 사고 도구 어휘와 표현을 익혀 설명을 듣고, 질문하고, 학습 내용을 자신의 말로 정리하는 방법을 배운다.",
            "핵심 아이디어": "학습 한국어는 교과 지식을 이해하고 표현하기 위해 필요한 언어적 도구를 제공한다.",
            "성취기준 해설 요약": "교과 공통 언어 기능을 명시적으로 가르쳐 듣기·말하기·읽기·쓰기 전략과 연결한다.",
            "적용 시 고려 사항": "교과 내용 평가와 한국어 숙달도 평가를 혼동하지 않도록 언어 지원과 내용 이해를 구분해 살핀다.",
            "페이지": "내용체계",
        },
        {
            "대단원": "학습 한국어 교육",
            "중단원": "교과 적응 한국어",
            "소단원": "한국어-교과적응 교과 내용 이해와 학교 참여",
            "성취기준 코드": "한국어-교과적응",
            "내용 요소": "교과 핵심 어휘, 수업 참여 표현, 자료 읽기, 발표와 과제 수행",
            "배우는 내용": "교과 수업에서 필요한 핵심 어휘와 표현을 활용해 자료를 이해하고 과제, 토의, 발표에 참여하는 방법을 배운다.",
            "핵심 아이디어": "교과 적응 한국어는 학습자가 교과 공동체의 구성원으로 참여하도록 언어와 학습 활동을 연결한다.",
            "성취기준 해설 요약": "교과별 학습 상황을 반영하되, 공통 학습 기능을 중심으로 수업 참여 경험을 넓힌다.",
            "적용 시 고려 사항": "담임·교과 교사와 협력해 실제 수업 자료를 조정하고 단계적 발판을 제공한다.",
            "페이지": "내용체계",
        },
    ],
}


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("\u3000", " ")).strip()


def clean_heading(text: str) -> str:
    text = normalize(text)
    text = re.sub(r"^\([0-9]+\)\s*", "", text)
    return text.strip(" .")


def code_parts(code: str) -> tuple[str, str]:
    match = re.match(r"(9.*?)(\d{2})-\d{2}", code)
    if not match:
        return code, ""
    return match.group(1), match.group(2)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def find_pdftotext() -> str:
    candidates = [
        Path(r"C:\Users\pbj95\AppData\Local\Programs\MiKTeX\miktex\bin\x64\pdftotext.exe"),
        Path(r"C:\Users\pbj95\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pdftotext.exe"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return str(candidate)
    return "pdftotext"


def extract_pdf_text(pdf: Path) -> list[str]:
    proc = subprocess.run(
        [find_pdftotext(), "-layout", "-enc", "UTF-8", str(pdf), "-"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=180,
        check=False,
    )
    return proc.stdout.split("\f")


def is_heading(line: str) -> bool:
    if not re.match(r"^\([0-9]+\)\s+.{1,60}$", line):
        return False
    blockers = ["성취기준", "해설", "고려", "내용 체계", "교수", "평가", "목표", "성격"]
    return not any(token in line for token in blockers)


def relevant_code(code: str, spec: SubjectSpec) -> bool:
    return any(code.startswith(prefix) for prefix in spec.prefixes)


def infer_large_unit(subject: str, code: str, heading: str) -> str:
    prefix, group = code_parts(code)
    heading = clean_heading(heading) or "성취기준"
    if subject in AREA_BY_CODE and group in AREA_BY_CODE[subject]:
        return AREA_BY_CODE[subject][group]
    if subject == "사회":
        if prefix == "9사(지리)":
            return "지리"
        if prefix == "9사(일사)":
            return "일반사회"
        if prefix == "9역":
            return "역사"
    if subject == "기술·가정":
        if any(word in heading for word in ["발달", "관계", "생활문화", "생활자원", "소비", "식생활", "의생활", "주생활"]):
            return "가정생활"
        return "기술의 세계"
    if subject == "정보":
        return heading
    if subject == "과학":
        if any(word in heading for word in ["힘", "운동", "에너지", "전기", "자기", "열", "파동", "빛"]):
            return "운동과 에너지"
        if any(word in heading for word in ["물질", "입자", "기체", "액체", "용해", "화학", "원소", "이온", "반응"]):
            return "물질"
        if any(word in heading for word in ["생물", "생명", "세포", "동물", "식물", "유전", "진화", "생태"]):
            return "생명"
        if any(word in heading for word in ["지구", "우주", "대기", "해양", "암석", "별", "태양", "기권", "지권"]):
            return "지구와 우주"
        return "과학과 사회"
    return heading


def summarize_title(text: str) -> str:
    text = normalize(text)
    text = re.sub(r"^(학생은|학습자는)\s*", "", text)
    text = re.sub(r"(한다|할 수 있다|익힌다|기른다)\.?$", "", text)
    for sep in ["하여", "하고", "하며", "을 바탕으로", "를 바탕으로", ","]:
        if sep in text and len(text.split(sep)[0]) >= 8:
            text = text.split(sep)[0]
            break
    return text[:34].strip(" ,.")


def learning_summary(text: str, subject: str, large_unit: str, middle_unit: str) -> str:
    core = summarize_title(text)
    if not core:
        core = f"{middle_unit}의 핵심 개념과 활동"
    return (
        f"{subject}의 {large_unit} 영역에서 '{core}'라는 주제로 개념을 이해하고, "
        f"자료 탐색·토의·표현·실천 활동을 통해 실제 맥락에 적용하는 방법을 배운다."
    )


def idea_summary(subject: str, large_unit: str, middle_unit: str) -> str:
    return (
        f"{large_unit} 영역은 '{middle_unit}' 관련 지식을 단순히 익히는 데서 그치지 않고, "
        f"{subject} 고유의 관점으로 현상과 자료를 해석하고 삶의 문제와 연결하는 데 핵심이 있다."
    )


def default_explanation(text: str) -> str:
    core = summarize_title(text)
    return f"'{core}' 관련 내용을 학생 수준의 사례와 자료로 풀어, 이해·탐구·표현 과정을 함께 경험하도록 정리한다."


def default_consideration() -> str:
    return "원문 성취기준을 길게 암기시키기보다 활동 산출물, 토의, 관찰, 자기 성찰을 결합해 도달 정도를 확인한다."


def extract_notes(lines: list[tuple[int, str]]) -> dict[str, dict[str, list[str]]]:
    notes: dict[str, dict[str, list[str]]] = {}
    current_heading = ""
    mode = ""
    current_bullet = ""
    for _page, raw in lines:
        line = normalize(raw)
        if not line:
            continue
        if is_heading(line):
            if current_bullet and current_heading and mode:
                notes.setdefault(current_heading, {}).setdefault(mode, []).append(current_bullet)
            current_heading = clean_heading(line)
            mode = ""
            current_bullet = ""
            continue
        if "성취기준 해설" in line:
            if current_bullet and current_heading and mode:
                notes.setdefault(current_heading, {}).setdefault(mode, []).append(current_bullet)
            mode = "성취기준 해설 요약"
            current_bullet = ""
            continue
        if "성취기준 적용 시 고려 사항" in line or "적용 시 고려 사항" in line:
            if current_bullet and current_heading and mode:
                notes.setdefault(current_heading, {}).setdefault(mode, []).append(current_bullet)
            mode = "적용 시 고려 사항"
            current_bullet = ""
            continue
        if not mode or not current_heading:
            continue
        if line.startswith(("•", "-", "⋅")):
            if current_bullet:
                notes.setdefault(current_heading, {}).setdefault(mode, []).append(current_bullet)
            current_bullet = line.lstrip("•-⋅ ").strip()
        elif current_bullet and not re.match(r"^\([0-9가-힣]+\)", line):
            current_bullet = normalize(current_bullet + " " + line)
    if current_bullet and current_heading and mode:
        notes.setdefault(current_heading, {}).setdefault(mode, []).append(current_bullet)
    return notes


def pick_note(notes: dict[str, dict[str, list[str]]], heading: str, key: str, fallback: str) -> str:
    heading = clean_heading(heading)
    candidates = notes.get(heading, {}).get(key, [])
    if not candidates:
        return fallback
    joined = " ".join(candidates[:2])
    joined = re.sub(r"\b\d+\s+공통 교육과정\s*-\s*\S+", "", joined)
    joined = normalize(joined)
    if len(joined) > 240:
        return joined[:240].rstrip(" ,.") + "..."
    return joined


def build_standard_row(
    spec: SubjectSpec,
    pdf: Path,
    notes: dict[str, dict[str, list[str]]],
    code: str,
    standard_text: str,
    heading: str,
    page_no: int,
) -> dict[str, str]:
    prefix, group = code_parts(code)
    large_unit = infer_large_unit(spec.subject, code, heading)
    middle_unit = heading or AREA_BY_CODE.get(spec.subject, {}).get(group, large_unit)
    small_unit = f"{code} {summarize_title(standard_text) or middle_unit}"
    return {
        "교과": spec.subject,
        "대단원": large_unit,
        "중단원": middle_unit,
        "소단원": small_unit,
        "성취기준 코드": code,
        "배우는 내용": learning_summary(standard_text, spec.subject, large_unit, middle_unit),
        "핵심 아이디어": idea_summary(spec.subject, large_unit, middle_unit),
        "내용 요소": f"{middle_unit}; {summarize_title(standard_text) or large_unit}",
        "성취기준 해설 요약": pick_note(notes, middle_unit, "성취기준 해설 요약", default_explanation(standard_text)),
        "적용 시 고려 사항": pick_note(notes, middle_unit, "적용 시 고려 사항", default_consideration()),
        "출처 PDF": pdf.name,
        "페이지": str(page_no),
        "출처 URL": spec.source_url,
        "추출 메모": spec.note,
    }


def extract_subject_rows(spec: SubjectSpec, pdf: Path) -> tuple[list[dict[str, str]], dict[str, object]]:
    if not spec.prefixes:
        rows = []
        for item in MANUAL_ROWS[spec.subject]:
            row = {
                "교과": spec.subject,
                **item,
                "출처 PDF": pdf.name,
                "출처 URL": spec.source_url,
                "추출 메모": spec.note,
            }
            rows.append(row)
        return rows, {"textPages": 0, "codeRows": len(rows), "manual": True}

    pages = extract_pdf_text(pdf)
    lines: list[tuple[int, str]] = []
    for page_no, page in enumerate(pages, start=1):
        for line in page.splitlines():
            lines.append((page_no, line))

    notes = extract_notes(lines)
    records: dict[str, dict[str, str]] = {}
    fallback_candidates: list[tuple[str, str, str, int]] = []
    current_heading = ""
    current_mode = "standards"
    code_re = re.compile(r"\[(9[^\]\s]{1,40}?\d{2}-\d{2})\]\s*(.*)")

    for idx, (page_no, raw) in enumerate(lines):
        line = normalize(raw)
        if not line:
            continue
        if is_heading(line):
            current_heading = clean_heading(line)
            current_mode = "standards"
            continue
        if "성취기준 해설" in line or "성취기준 적용 시 고려 사항" in line or "적용 시 고려 사항" in line:
            current_mode = "notes"
            continue
        match = code_re.search(line)
        if not match:
            continue
        code, after = match.group(1), normalize(match.group(2))
        if not relevant_code(code, spec):
            continue
        fallback_candidates.append((code, after, current_heading, page_no))
        if current_mode != "standards":
            continue

        collected = [after]
        lookahead = idx + 1
        while lookahead < len(lines) and len(" ".join(collected)) < 220:
            nxt = normalize(lines[lookahead][1])
            if not nxt:
                break
            if code_re.search(nxt) or is_heading(nxt) or "성취기준 해설" in nxt or "적용 시 고려 사항" in nxt:
                break
            if nxt.startswith(("•", "-", "⋅")) or re.match(r"^\([가-힣]\)", nxt):
                break
            collected.append(nxt)
            if nxt.endswith((".", "다.", "한다.")):
                break
            lookahead += 1
        standard_text = normalize(" ".join(collected))
        if len(standard_text) < 8 and code in records:
            continue

        row = build_standard_row(spec, pdf, notes, code, standard_text, current_heading, page_no)
        if code not in records or len(row["배우는 내용"]) > len(records[code].get("배우는 내용", "")):
            records[code] = row

    for code, after, heading, page_no in fallback_candidates:
        if code in records or not after:
            continue
        if after.startswith("이 성취기준은"):
            continue
        records[code] = build_standard_row(spec, pdf, notes, code, after, heading, page_no)

    rows = list(records.values())
    rows.sort(key=lambda r: (r["성취기준 코드"], r["페이지"]))
    return rows, {"textPages": len(pages), "codeRows": len(rows), "manual": False}


def markdown_table(rows: list[dict[str, str]]) -> str:
    headers = ["중단원", "소단원", "성취기준 코드", "배우는 내용", "지도·평가 유의점"]
    out = ["| " + " | ".join(headers) + " |", "| " + " | ".join(["---"] * len(headers)) + " |"]
    for row in rows:
        values = [
            row["중단원"],
            row["소단원"],
            row["성취기준 코드"],
            row["배우는 내용"],
            row["적용 시 고려 사항"],
        ]
        out.append("| " + " | ".join(v.replace("|", "/") for v in values) + " |")
    return "\n".join(out)


def write_subject_markdown(spec: SubjectSpec, pdf: Path, rows: list[dict[str, str]], out_dir: Path) -> None:
    grouped: dict[str, list[dict[str, str]]] = {}
    for row in rows:
        grouped.setdefault(row["대단원"], []).append(row)

    parts = [
        f"# {spec.subject} 중학교 교육과정 단원 정리",
        "",
        "## 출처",
        f"- PDF: `{pdf.name}`",
        f"- 공식 출처: {spec.source_url}",
        "- 정리 기준: 대단원은 교육과정 영역, 중단원은 내용 요소 또는 성취기준 묶음, 소단원은 성취기준 코드 단위로 변환했다.",
        "- 원문 성취기준을 길게 전재하지 않고 교사용 요약 문장으로 풀어 썼다.",
    ]
    if spec.note:
        parts.append(f"- 보충 메모: {spec.note}")
    parts.extend(["", "## 대단원별 핵심 아이디어"])
    for large_unit, items in grouped.items():
        parts.append(f"- **{large_unit}**: {items[0]['핵심 아이디어']}")
    parts.append("")
    for large_unit, items in grouped.items():
        parts.extend([f"## {large_unit}", "", "### 중단원/소단원 표", markdown_table(items), "", "### 단원별 배우는 내용"])
        for row in items:
            parts.append(f"- **{row['소단원']}**: {row['배우는 내용']}")
        parts.extend(["", "### 지도·평가 유의점"])
        seen = []
        for row in items:
            note = row["적용 시 고려 사항"]
            if note not in seen:
                seen.append(note)
        for note in seen[:5]:
            parts.append(f"- {note}")
        parts.append("")
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / f"{spec.index:02d}_{spec.subject}.md").write_text("\n".join(parts).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    summary_root = Path(__file__).resolve().parents[1]
    project_root = summary_root.parent
    pdf_root = project_root / "2022_개정_중학교_교육과정_PDF"
    subject_dir = pdf_root / "교과"
    pdfs = sorted(subject_dir.glob("*.pdf"))
    if len(pdfs) != 17:
        raise SystemExit(f"Expected 17 subject PDFs, found {len(pdfs)}")

    md_dir = summary_root / "교과별_MD"
    all_rows: list[dict[str, str]] = []
    sources: list[dict[str, object]] = []
    extraction: dict[str, object] = {}

    for spec in SUBJECTS:
        pdf = pdfs[spec.index - 1]
        rows, stats = extract_subject_rows(spec, pdf)
        if not rows:
            raise SystemExit(f"No rows extracted for {spec.subject}")
        write_subject_markdown(spec, pdf, rows, md_dir)
        all_rows.extend(rows)
        extraction[spec.subject] = stats
        sources.append(
            {
                "교과": spec.subject,
                "출처 PDF": pdf.name,
                "출처 URL": spec.source_url,
                "파일 크기": pdf.stat().st_size,
                "SHA-256": sha256(pdf),
                "행 수": len(rows),
                "추출 메모": spec.note,
            }
        )

    data = {
        "generatedAt": "2026-06-16",
        "scope": "2022 개정 중학교 교과 교육과정 PDF 17개",
        "rules": {
            "대단원": "교육과정 영역",
            "중단원": "내용 요소 또는 성취기준 묶음",
            "소단원": "성취기준 코드 단위 또는 세부 학습 요소",
            "요약": "핵심 개념, 수행 활동, 태도·적용·평가 유의점을 합쳐 교사용 문장으로 작성",
        },
        "rows": all_rows,
        "sources": sources,
        "extraction": extraction,
    }
    (summary_root / "unit_summary_data.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    readme = [
        "# 중학교 교과별 교육과정 단원 정리",
        "",
        "- 공식 PDF의 중학교 성취기준과 내용 체계를 기준으로 대단원·중단원·소단원 구조로 변환한 정리본이다.",
        "- 교과서 출판사별 단원이 아니라 국가 교육과정의 영역과 성취기준을 단원형으로 재구성했다.",
        "- `교과별_MD/`에는 17개 교과별 Markdown 정리본이 있고, `중학교_교과별_교육과정_단원_정리.xlsx`에는 통합표가 있다.",
        "- `unit_summary_data.json`은 XLSX와 Markdown 생성을 위한 중간 데이터이며, 출처 PDF명·URL·해시를 함께 보관한다.",
        "",
        "## 생성 기준",
        "",
        "- 대단원: 교육과정 영역",
        "- 중단원: 영역 안의 내용 요소 또는 성취기준 묶음",
        "- 소단원: 성취기준 코드 단위. 코드 체계가 없는 문서는 공식 영역 단위로 정리",
        "- 무엇을 배우는지: 핵심 개념과 원리, 수행 활동과 탐구 기능, 태도·적용·평가상 유의점을 종합",
        "",
        "## 주의",
        "",
        "- 별책16 생활 외국어 PDF는 이미지 기반 PDF라 텍스트 성취기준 코드가 추출되지 않아 생활 외국어 공통 영역 구조로 요약했다.",
        "- 한국어 교육과정은 별책41의 별도 구조에 따라 생활 한국어와 학습 한국어 영역으로 정리했다.",
    ]
    (summary_root / "README.md").write_text("\n".join(readme) + "\n", encoding="utf-8")

    print(json.dumps({"subjects": len(SUBJECTS), "rows": len(all_rows), "mdFiles": len(list(md_dir.glob("*.md")))}, ensure_ascii=False))


if __name__ == "__main__":
    main()
