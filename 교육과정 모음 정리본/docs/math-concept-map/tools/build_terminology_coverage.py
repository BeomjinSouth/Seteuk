from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CONCEPTS_JSON = OUT_DIR / "concepts.json"
TERM_COVERAGE_CSV = OUT_DIR / "official-term-coverage.csv"
TERM_COVERAGE_MD = OUT_DIR / "official-term-coverage.md"

CSV_FIELDS = [
    "term",
    "domain",
    "source_locator",
    "coverage_status",
    "concept_count",
    "concept_ids",
    "concept_labels",
    "notes",
]

DOMAIN_ORDER = {
    "수와 연산": 1,
    "변화와 관계": 2,
    "도형과 측정": 3,
    "자료와 가능성": 4,
}


def official_term(
    term: str,
    domain: str,
    source_locator: str,
    expected_status: str = "required",
    notes: str = "",
) -> dict:
    return {
        "term": term,
        "domain": domain,
        "source_locator": source_locator,
        "expected_status": expected_status,
        "notes": notes,
    }


def term_entries(terms: Iterable[str], domain: str, source_locator: str) -> list[dict]:
    return [official_term(term, domain, source_locator) for term in terms]


OFFICIAL_TERMS = (
    term_entries(
        [
            "소수",
            "합성수",
            "거듭제곱",
            "지수",
            "밑",
            "소인수",
            "소인수분해",
            "서로소",
            "양수",
            "음수",
            "양의 정수",
            "음의 정수",
            "정수",
            "수직선",
            "양의 유리수",
            "음의 유리수",
            "유리수",
            "절댓값",
            "교환법칙",
            "결합법칙",
            "분배법칙",
            "역수",
            "유한소수",
            "무한소수",
            "순환소수",
            "순환마디",
            "제곱근",
            "근호",
            "무리수",
            "실수",
            "분모의 유리화",
            "양의 부호",
            "음의 부호",
            "순환소수 표현",
            "근호 기호",
        ],
        "수와 연산",
        "2022 수학과 교육과정 중학교 수와 연산 용어·기호 목록",
    )
    + term_entries(
        [
            "대입",
            "다항식",
            "항",
            "단항식",
            "상수항",
            "계수",
            "차수",
            "일차식",
            "동류항",
            "등식",
            "방정식",
            "미지수",
            "해",
            "근",
            "항등식",
            "이항",
            "일차방정식",
            "변수",
            "좌표",
            "순서쌍",
            "x좌표",
            "y좌표",
            "원점",
            "좌표축",
            "x축",
            "y축",
            "좌표평면",
            "제1사분면",
            "제2사분면",
            "제3사분면",
            "제4사분면",
            "그래프",
            "정비례",
            "반비례",
            "함수",
            "함숫값",
            "일차함수",
            "기울기",
            "x절편",
            "y절편",
            "평행이동",
            "전개",
            "인수",
            "인수분해",
            "공통인수",
            "완전제곱식",
            "이차식",
            "이차방정식",
            "중근",
            "근의 공식",
            "이차함수",
            "y=f(x)",
            "f(x)",
            "포물선",
            "축",
            "꼭짓점",
            "최댓값",
            "최솟값",
        ],
        "변화와 관계",
        "2022 수학과 교육과정 중학교 변화와 관계 용어·기호 목록 및 성취수준 확인 용어",
    )
    + term_entries(
        [
            "교점",
            "교선",
            "두 점 사이의 거리",
            "중점",
            "수직이등분선",
            "꼬인 위치",
            "맞꼭지각",
            "엇각",
            "동위각",
            "평각",
            "직교",
            "수선의 발",
            "작도",
            "대변",
            "대각",
            "삼각형의 합동 조건",
            "내각",
            "외각",
            "부채꼴",
            "중심각",
            "호",
            "현",
            "활꼴",
            "할선",
            "다면체",
            "각뿔대",
            "정다면체",
            "회전체",
            "회전축",
            "원뿔대",
            "증명",
            "접선",
            "접점",
            "접한다",
            "외심",
            "외접",
            "외접원",
            "내심",
            "내접",
            "내접원",
            "중선",
            "무게중심",
            "닮음",
            "닮음비",
            "삼각형의 닮음 조건",
            "피타고라스 정리",
            "삼각비",
            "사인",
            "코사인",
            "탄젠트",
            "원주각",
        ],
        "도형과 측정",
        "2022 수학과 교육과정 중학교 도형과 측정 용어·기호 목록",
    )
    + term_entries(
        [
            "변량",
            "대푯값",
            "중앙값",
            "최빈값",
            "줄기와 잎 그림",
            "계급",
            "계급의 크기",
            "도수",
            "도수분포표",
            "히스토그램",
            "도수분포다각형",
            "상대도수",
            "사건",
            "확률",
            "산포도",
            "편차",
            "분산",
            "표준편차",
            "사분위수",
            "상자그림",
            "산점도",
            "상관관계",
        ],
        "자료와 가능성",
        "2022 수학과 교육과정 중학교 자료와 가능성 용어·기호 목록",
    )
    + [
        official_term(
            "가정",
            "도형과 측정",
            "2022 수학과 교육과정 도형과 측정 지도 유의 사항",
            "excluded_by_curriculum_scope",
            "`가정`과 `결론` 용어는 중학교 도입 범위에서 제외됨.",
        ),
        official_term(
            "결론",
            "도형과 측정",
            "2022 수학과 교육과정 도형과 측정 지도 유의 사항",
            "excluded_by_curriculum_scope",
            "`가정`과 `결론` 용어는 중학교 도입 범위에서 제외됨.",
        ),
    ]
)


def concept_indexes(concepts: Iterable[dict]) -> tuple[dict[str, list[dict]], dict[str, list[dict]]]:
    by_label: dict[str, list[dict]] = defaultdict(list)
    by_alias: dict[str, list[dict]] = defaultdict(list)
    for concept in concepts:
        label = str(concept.get("label_ko", "")).strip()
        if label:
            by_label[label].append(concept)
        for alias in concept.get("aliases", []):
            alias_text = str(alias).strip()
            if alias_text:
                by_alias[alias_text].append(concept)
    return by_label, by_alias


def terminology_coverage_rows(
    concepts: Iterable[dict],
    official_terms: Iterable[dict] = OFFICIAL_TERMS,
) -> list[dict]:
    by_label, by_alias = concept_indexes(concepts)
    rows: list[dict] = []

    for entry in official_terms:
        term = entry["term"]
        if entry.get("expected_status") == "excluded_by_curriculum_scope":
            matched_concepts: list[dict] = []
            status = "excluded_by_curriculum_scope"
        elif term in by_label:
            matched_concepts = by_label[term]
            status = "covered"
        elif term in by_alias:
            matched_concepts = by_alias[term]
            status = "covered_by_alias"
        else:
            matched_concepts = []
            status = "needs_concept"

        matched_concepts = sorted(matched_concepts, key=lambda concept: concept.get("id", ""))
        rows.append(
            {
                "term": term,
                "domain": entry["domain"],
                "source_locator": entry["source_locator"],
                "coverage_status": status,
                "concept_count": len(matched_concepts),
                "concept_ids": "; ".join(concept.get("id", "") for concept in matched_concepts),
                "concept_labels": "; ".join(concept.get("label_ko", "") for concept in matched_concepts),
                "notes": entry.get("notes", ""),
            }
        )

    return rows


def render_markdown(rows: list[dict]) -> str:
    status_counts = Counter(row["coverage_status"] for row in rows)
    domain_counts: dict[str, Counter] = defaultdict(Counter)
    for row in rows:
        domain_counts[row["domain"]][row["coverage_status"]] += 1

    lines = [
        "# 공식 용어·기호 커버리지",
        "",
        "이 문서는 공식 교육과정과 성취수준 문서에서 확인한 중학교 수학 용어·기호가 `concepts.json`의 `label_ko` 또는 `aliases`로 연결되는지 점검한다.",
        "",
        f"- 공식 용어·기호 항목: {len(rows)}개",
        f"- concept 직접 연결: {status_counts.get('covered', 0)}개",
        f"- alias 연결: {status_counts.get('covered_by_alias', 0)}개",
        f"- 교육과정 범위 제외: {status_counts.get('excluded_by_curriculum_scope', 0)}개",
        f"- concept 추가 검토 필요: {status_counts.get('needs_concept', 0)}개",
        "",
        "## 상태별 요약",
        "",
        "| coverage_status | 항목 수 |",
        "|---|---:|",
    ]

    for status, count in sorted(status_counts.items()):
        lines.append(f"| {status} | {count} |")

    lines.extend(
        [
            "",
            "## 영역별 요약",
            "",
            "| 영역 | 전체 | covered | covered_by_alias | needs_concept | excluded_by_curriculum_scope |",
            "|---|---:|---:|---:|---:|---:|",
        ]
    )

    for domain in DOMAIN_ORDER:
        counts = domain_counts[domain]
        total = sum(counts.values())
        lines.append(
            f"| {domain} | {total} | {counts.get('covered', 0)} | "
            f"{counts.get('covered_by_alias', 0)} | {counts.get('needs_concept', 0)} | "
            f"{counts.get('excluded_by_curriculum_scope', 0)} |"
        )

    lines.extend(
        [
            "",
            "## 항목별 연결",
            "",
            "| term | domain | coverage_status | concept_ids | concept_labels | notes |",
            "|---|---|---|---|---|---|",
        ]
    )

    for row in rows:
        lines.append(
            "| {term} | {domain} | {coverage_status} | {concept_ids} | {concept_labels} | {notes} |".format(
                **row
            )
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = TERM_COVERAGE_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    data = json.loads(CONCEPTS_JSON.read_text(encoding="utf-8"))
    rows = terminology_coverage_rows(data.get("concepts", []))

    write_csv(rows)
    TERM_COVERAGE_MD.write_text(render_markdown(rows), encoding="utf-8")

    status_counts = Counter(row["coverage_status"] for row in rows)
    print(
        f"Wrote official term coverage for {len(rows)} terms "
        f"({status_counts.get('needs_concept', 0)} need concept review) "
        f"to {TERM_COVERAGE_CSV} and {TERM_COVERAGE_MD}."
    )


if __name__ == "__main__":
    main()
