from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
ELEMENTARY_JSON = OUT_DIR / "elementary-concepts.json"
MIDDLE_JSON = OUT_DIR / "concepts.json"
HS_COMMON_JSON = OUT_DIR / "hs-common-concepts.json"
EDGES_CSV = OUT_DIR / "cross-band-edges.csv"
EDGES_MD = OUT_DIR / "cross-band-edges.md"

# 학년군(데이터셋) 사이를 잇는 선수 관계 edge.
# 2026-07-06 사용자 결정(AGENTS.md Math Concept Map Scope Rules)에 따라, 여기의 edge는
# 모두 별책8 원문이 앞·뒤 학년군의 학습 내용을 직접 지목하는 문장(성취기준 해설, 적용 시 고려
# 사항, 과목 성격)에만 근거한다. 모델의 배경 지식으로 임의 연결을 만들지 않는다.
#
# (source_id, target_id, confidence, locator, summary, notes)
CROSS_EDGES = [
    # ---------- 초등 → 중학교 ----------
    (
        "e56_num_common_divisor",
        "m1_num_find_gcd_lcm_prime_factorization",
        "high",
        "printed p. 33; [9수01-02] 성취기준 해설",
        "초등학교에서 학습한 최대공약수의 개념을 바탕으로 소인수분해를 이용해 최대공약수를 구하게 한다",
        "[9수01-02] 해설이 초등 최대공약수·최소공배수를 명시적으로 선수로 지목한다.",
    ),
    (
        "e56_num_common_multiple",
        "m1_num_find_gcd_lcm_prime_factorization",
        "high",
        "printed p. 33; [9수01-02] 성취기준 해설",
        "초등학교에서 학습한 최소공배수의 개념을 바탕으로 소인수분해를 이용해 최소공배수를 구하게 한다",
        "[9수01-02] 해설이 초등 최대공약수·최소공배수를 명시적으로 선수로 지목한다.",
    ),
    # ---------- 중학교 → 공통수학1 ----------
    (
        "m1_num_real_number",
        "hs1_complex",
        "high",
        "printed p. 61; [10공수1-02-01] 적용 시 고려 사항",
        "복소수의 성질과 사칙연산은 중학교에서 학습한 실수의 성질과 사칙연산과 연계하여 이해하게 한다",
        "고려 사항이 중학교 실수를 복소수의 연계 대상으로 직접 지목한다.",
    ),
    (
        "m1_num_radical_operations",
        "hs1_complex_ops",
        "high",
        "printed p. 61; [10공수1-02-01] 적용 시 고려 사항",
        "복소수의 사칙연산은 중학교에서 학습한 실수의 사칙연산과 연계하여 이해하게 한다",
        "실수 범위 근호 사칙계산을 복소수 사칙연산의 선수로 연결한다.",
    ),
    (
        "m1_factor_polynomial_multiplication",
        "hs1_poly_ops",
        "high",
        "printed p. 60; [10공수1-01-03] 적용 시 고려 사항",
        "다항식의 곱셈은 중학교에서 학습한 내용을 토대로 고등학교에서 추가된 내용을 이해하게 한다",
        "고려 사항이 중학교 다항식의 곱셈·인수분해를 토대로 지목한다.",
    ),
    (
        "m1_factor_factorization",
        "hs1_factorization",
        "high",
        "printed p. 60; [10공수1-01-03] 적용 시 고려 사항",
        "다항식의 인수분해는 중학교에서 학습한 내용을 토대로 고등학교에서 추가된 내용을 이해하게 한다",
        "고려 사항이 중학교 인수분해를 토대로 지목한다.",
    ),
    (
        "m1_calc_polynomial_divided_by_monomial_termwise",
        "hs1_synthetic_div",
        "high",
        "printed p. 60; [10공수1-01-03] 적용 시 고려 사항",
        "조립제법은 중학교에서 학습한 다항식을 단항식으로 나누는 연산과 연계하여 이해하게 한다",
        "고려 사항이 중학교 다항식÷단항식 연산을 조립제법의 연계 대상으로 지목한다.",
    ),
    (
        "m1_system_simultaneous_linear_equations",
        "hs1_system_ineq",
        "high",
        "printed p. 62; [10공수1-02-09] 적용 시 고려 사항",
        "연립부등식은 중학교에서 학습한 연립일차방정식 내용을 토대로 이해하게 한다",
        "고려 사항이 중학교 연립일차방정식을 연립부등식의 토대로 지목한다.",
    ),
    (
        "m1_data_counting_cases",
        "hs1_addition_rule",
        "high",
        "printed p. 62; [10공수1-03-01] 적용 시 고려 사항",
        "중학교에서 학습한 경우의 수와 연계하여 합의 법칙을 간단히 다룬다",
        "고려 사항이 중학교 경우의 수를 합의 법칙의 연계 대상으로 지목한다.",
    ),
    (
        "m1_data_counting_cases",
        "hs1_mult_rule",
        "high",
        "printed p. 62; [10공수1-03-01] 적용 시 고려 사항",
        "중학교에서 학습한 경우의 수와 연계하여 곱의 법칙을 간단히 다룬다",
        "고려 사항이 중학교 경우의 수를 곱의 법칙의 연계 대상으로 지목한다.",
    ),
    (
        "m1_data_counting_cases",
        "hs1_permutation",
        "medium",
        "printed p. 57 과목 성격",
        "'자료와 가능성' 영역에서 학습한 경우의 수가 순열과 조합을 활용하는 방법으로 체계화된다",
        "과목 성격의 체계화 서술에 근거한다. 특정 성취기준 해설 근거는 아니므로 medium을 유지한다.",
    ),
    (
        "m1_quad_eq_quadratic_equation",
        "hs1_quad_eq_func",
        "medium",
        "printed p. 57 과목 성격",
        "중학교 '변화와 관계' 영역에서 학습한 방정식이 심화되고 다양한 유형으로 다루어진다",
        "과목 성격의 심화 서술에 근거한다. 특정 성취기준 해설 근거는 아니므로 medium을 유지한다.",
    ),
    (
        "m1_quad_func_quadratic_function",
        "hs1_quad_eq_func",
        "medium",
        "printed p. 57 과목 성격",
        "중학교 '변화와 관계' 영역에서 학습한 이차함수가 이차방정식과 연결되어 심화된다",
        "과목 성격의 심화 서술에 근거한다. 특정 성취기준 해설 근거는 아니므로 medium을 유지한다.",
    ),
    # ---------- 중학교 → 공통수학2 ----------
    (
        "m1_func_linear_graph",
        "hs2_line_condition",
        "high",
        "printed p. 65; [10공수2-01-02] 적용 시 고려 사항",
        "두 직선의 평행 조건과 수직 조건은 중학교에서 학습한 일차함수의 그래프, 직선의 방정식과 연계하여 다룬다",
        "고려 사항이 중학교 일차함수 그래프·직선의 방정식을 직접 연계 대상으로 지목한다.",
    ),
    (
        "m1_func_eq_relation_unit",
        "hs2_line_condition",
        "high",
        "printed p. 65; [10공수2-01-02] 적용 시 고려 사항",
        "두 직선의 평행 조건과 수직 조건은 중학교에서 학습한 일차방정식과 일차함수의 그래프와 연계하여 다룬다",
        "고려 사항이 중학교 일차함수와 일차방정식의 관계를 직접 연계 대상으로 지목한다.",
    ),
    (
        "m1_func_function",
        "hs2_function",
        "high",
        "printed p. 67; [10공수2-03-01] 성취기준 해설",
        "함수의 개념은 중학교에서 학습한 내용을 확장하여 두 집합 사이의 대응 관계로 이해하게 한다",
        "해설이 중학교 함수 개념을 고등 함수의 확장 출발점으로 직접 지목한다.",
    ),
]

CSV_FIELDS = [
    "edge_id",
    "source_id",
    "source_label",
    "source_dataset",
    "source_grade",
    "target_id",
    "target_label",
    "target_dataset",
    "target_grade",
    "relationship_type",
    "confidence",
    "source_locator",
    "summary",
    "notes",
]

DATASET_LABELS = {
    "elementary": "초등(elementary-concepts.json)",
    "middle": "중학교(concepts.json)",
    "hs_common": "고1 공통(hs-common-concepts.json)",
}


def _load(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8")).get("concepts", [])


def build_lookup() -> dict[str, dict]:
    """세 데이터셋의 concept을 id → {label, grade, dataset}로 합친다."""
    lookup: dict[str, dict] = {}
    for dataset, path in [
        ("elementary", ELEMENTARY_JSON),
        ("middle", MIDDLE_JSON),
        ("hs_common", HS_COMMON_JSON),
    ]:
        for c in _load(path):
            lookup[c["id"]] = {
                "label": c["label_ko"],
                "grade": c["grade"],
                "dataset": dataset,
            }
    return lookup


def build_rows(lookup: dict[str, dict]) -> list[dict]:
    rows: list[dict] = []
    for i, (src, dst, conf, locator, summary, notes) in enumerate(CROSS_EDGES, start=1):
        if src not in lookup:
            raise SystemExit(f"cross edge {i}: source id {src}가 어느 데이터셋에도 없습니다.")
        if dst not in lookup:
            raise SystemExit(f"cross edge {i}: target id {dst}가 어느 데이터셋에도 없습니다.")
        s, t = lookup[src], lookup[dst]
        rows.append(
            {
                "edge_id": f"cross_edge_{i:03d}",
                "source_id": src,
                "source_label": s["label"],
                "source_dataset": s["dataset"],
                "source_grade": s["grade"],
                "target_id": dst,
                "target_label": t["label"],
                "target_dataset": t["dataset"],
                "target_grade": t["grade"],
                "relationship_type": "prerequisite_for",
                "confidence": conf,
                "source_locator": locator,
                "summary": summary,
                "notes": notes,
            }
        )
    return rows


def validate_forward_only(rows: list[dict]) -> None:
    """모든 cross edge는 낮은 학년군 → 높은 학년군의 정방향이어야 한다."""
    order = {"elementary": 0, "middle": 1, "hs_common": 2}
    for r in rows:
        if order[r["source_dataset"]] >= order[r["target_dataset"]]:
            raise SystemExit(
                f"{r['edge_id']}: {r['source_dataset']} → {r['target_dataset']}는 정방향이 아닙니다."
            )


def render_md(rows: list[dict]) -> str:
    high = [r for r in rows if r["confidence"] == "high"]
    med = [r for r in rows if r["confidence"] == "medium"]
    lines = [
        "# 학년군 사이 연결 (cross-band edges)",
        "",
        "초등·중학교·고등 공통 과목의 미시 concept 데이터셋은 각각 별도 파일이지만,",
        "2022 개정 수학과 교육과정(별책8) 원문은 앞·뒤 학년군의 학습 내용을 직접 지목하는 문장을 담고 있다.",
        "이 산출물은 그 직접 서술에만 근거해 데이터셋 경계를 잇는 선수 관계 edge를 모은 것이다.",
        "",
        "## 근거 규칙",
        "",
        "- 모든 edge는 성취기준 해설, 적용 시 고려 사항, 또는 과목 성격의 직접 연계 문장에 근거한다.",
        "- 성취기준 해설·고려 사항이 앞 학년군 학습을 명시적으로 지목하면 `high`,",
        "  과목 성격의 심화·체계화 서술처럼 특정 성취기준 근거가 아니면 `medium`으로 둔다.",
        "- 모델의 배경 지식으로 임의 연결을 만들지 않는다(AGENTS.md Math Concept Map Scope Rules).",
        "",
        f"## 규모: {len(rows)}개 (high {len(high)}, medium {len(med)})",
        "",
        "| 근거 위치 | 앞 학년군 개념 | → | 뒤 학년군 개념 | 신뢰도 |",
        "| --- | --- | --- | --- | --- |",
    ]
    for r in rows:
        lines.append(
            f"| {r['source_locator']} | {r['source_label']} ({r['source_grade']}) | → "
            f"| {r['target_label']} ({r['target_grade']}) | {r['confidence']} |"
        )
    lines += [
        "",
        "## 근거 문장",
        "",
    ]
    for r in rows:
        lines.append(f"- `{r['source_label']}` → `{r['target_label']}`: {r['summary']} [{r['source_locator']}]")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    lookup = build_lookup()
    rows = build_rows(lookup)
    validate_forward_only(rows)

    with EDGES_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    EDGES_MD.write_text(render_md(rows), encoding="utf-8")
    print(f"cross-band edges: {len(rows)}")


if __name__ == "__main__":
    main()
