from __future__ import annotations

# 초등 미시 concept 데이터 모듈의 공통 도우미.
# 2026-07-06 사용자 결정(AGENTS.md Math Concept Map Scope Rules):
# 모든 concept은 별책8 원문 추출 텍스트와 인쇄 페이지 출처로만 반영한다.

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
    grade: str,
    domain: str,
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
        "grade": grade,
        "domain": domain,
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
