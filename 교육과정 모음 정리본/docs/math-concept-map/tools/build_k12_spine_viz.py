from __future__ import annotations

import csv
import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
NODES_CSV = OUT_DIR / "k12-spine-nodes.csv"
EDGES_CSV = OUT_DIR / "k12-spine-edges.csv"
VIZ_HTML = OUT_DIR / "k12-spine.html"

# 2026-07-06 사용자 결정: 고등학교 선택 과목은 시각화·미시 분해 범위에서 제외한다.
# AGENTS.md "Math Concept Map Scope Rules" 참조.
IN_SCOPE_COURSE_TYPES = {"공통 교육과정", "공통 과목"}

BAND_ORDER = ["초1-2", "초3-4", "초5-6", "중1-3"]
DOMAIN_ORDER = ["수와 연산", "변화와 관계", "도형과 측정", "자료와 가능성"]
MAIN_SUBJECT_ORDER = ["공통수학1", "공통수학2"]
ALT_SUBJECT_ORDER = ["기본수학1", "기본수학2"]

COL_W = 176
COL_GAP = 46
ROW_H = 92
ROW_GAP = 18
MARGIN_X = 24
HEADER_Y = 46
GRID_Y = 92
AREA_H = 58
AREA_GAP = 10


def load_rows(path: Path) -> list[dict]:
    with path.open(encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def build_view_model(nodes: list[dict], edges: list[dict]) -> dict:
    """스코프 안의 노드·edge를 격자 배치용 view model로 변환한다."""
    in_scope = [n for n in nodes if n["course_type"] in IN_SCOPE_COURSE_TYPES]
    standards = [n for n in in_scope if n["node_type"] == "achievement_standard"]

    blocks: dict[str, dict] = {}

    # 공통 교육과정: 학년군×영역 블록
    for band_i, band in enumerate(BAND_ORDER):
        for dom_i, domain in enumerate(DOMAIN_ORDER):
            block_standards = [
                s for s in standards if s["grade_band"] == band and s["domain"] == domain
            ]
            node = next(
                n
                for n in in_scope
                if n["node_type"] == "stage_domain"
                and n["grade_band"] == band
                and n["domain"] == domain
            )
            blocks[node["node_id"]] = {
                "id": node["node_id"],
                "title": domain,
                "subtitle": f"성취기준 {len(block_standards)}개",
                "column": band_i,
                "kind": "domain",
                "x": MARGIN_X + band_i * (COL_W + COL_GAP),
                "y": GRID_Y + dom_i * (ROW_H + ROW_GAP),
                "w": COL_W,
                "h": ROW_H,
                "standards": [
                    {
                        "code": s["achievement_code"],
                        "statement": s["statement"],
                        "locator": s["source_locator"],
                    }
                    for s in sorted(block_standards, key=lambda s: s["achievement_code"])
                ],
            }

    # 고등학교 공통 과목: 과목 열 + 영역 상자
    def add_subject_column(subject: str, col_i: int, y0: int, dashed: bool) -> str:
        subject_node = next(
            n
            for n in in_scope
            if n["node_type"] == "hs_subject" and n["label_ko"] == subject
        )
        areas = [
            n
            for n in in_scope
            if n["node_type"] == "hs_subject_area" and n["subject_label"] == subject
        ]
        areas.sort(key=lambda n: n["node_id"])
        x = MARGIN_X + col_i * (COL_W + COL_GAP)
        subject_standards_by_area: dict[str, list[dict]] = {}
        for s in standards:
            if s["subject_label"] == subject:
                subject_standards_by_area.setdefault(s["domain"], []).append(s)
        blocks[subject_node["node_id"]] = {
            "id": subject_node["node_id"],
            "title": subject,
            "subtitle": subject_node["course_type"],
            "column": col_i,
            "kind": "subject_alt" if dashed else "subject",
            "x": x,
            "y": y0,
            "w": COL_W,
            "h": 40,
            "standards": [],
        }
        for a_i, area in enumerate(areas):
            area_standards = subject_standards_by_area.get(area["domain"], [])
            blocks[area["node_id"]] = {
                "id": area["node_id"],
                "title": area["domain"],
                "subtitle": f"성취기준 {len(area_standards)}개",
                "column": col_i,
                "kind": "area_alt" if dashed else "area",
                "x": x,
                "y": y0 + 40 + AREA_GAP + a_i * (AREA_H + AREA_GAP),
                "w": COL_W,
                "h": AREA_H,
                "standards": [
                    {
                        "code": s["achievement_code"],
                        "statement": s["statement"],
                        "locator": s["source_locator"],
                    }
                    for s in sorted(area_standards, key=lambda s: s["achievement_code"])
                ],
            }
        return subject_node["node_id"]

    main_ids = {}
    for i, subject in enumerate(MAIN_SUBJECT_ORDER):
        main_ids[subject] = add_subject_column(subject, len(BAND_ORDER) + i, GRID_Y, False)
    alt_y = GRID_Y + 40 + AREA_GAP + 4 * (AREA_H + AREA_GAP) + 34
    alt_ids = {}
    for i, subject in enumerate(ALT_SUBJECT_ORDER):
        alt_ids[subject] = add_subject_column(subject, len(BAND_ORDER) + i, alt_y, True)

    # 그릴 edge: 스코프 안 블록 사이의 선수 관계
    block_ids = set(blocks)
    arrows = []
    for edge in edges:
        if edge["relationship_type"] != "prerequisite_for":
            continue
        src, dst = edge["source_id"], edge["target_id"]
        if src in block_ids and dst in block_ids:
            arrows.append(
                {"from": src, "to": dst, "confidence": edge["confidence"], "notes": edge["notes"]}
            )
        elif src == "spine_stage_m13" and dst in block_ids:
            # 중1-3 학년군 전체에서 고등 공통 과목으로 이어지는 편제 edge
            arrows.append(
                {
                    "from": "spine_dom_m13_bridge",
                    "to": dst,
                    "confidence": edge["confidence"],
                    "notes": edge["notes"],
                }
            )
    return {"blocks": blocks, "arrows": arrows}


def render_html(model: dict) -> str:
    blocks = model["blocks"]
    arrows = model["arrows"]

    max_x = max(b["x"] + b["w"] for b in blocks.values()) + MARGIN_X
    max_y = max(b["y"] + b["h"] for b in blocks.values()) + 30
    m13_blocks = [b for b in blocks.values() if b["id"].startswith("spine_dom_m13")]
    m13_right = max(b["x"] + b["w"] for b in m13_blocks)
    m13_mid_y = GRID_Y + (4 * ROW_H + 3 * ROW_GAP) / 2

    svg_parts: list[str] = []

    # 열 머리글
    headers = BAND_ORDER + MAIN_SUBJECT_ORDER
    for i, label in enumerate(headers):
        x = MARGIN_X + i * (COL_W + COL_GAP)
        stage = "초등학교" if i < 3 else ("중학교" if i == 3 else "고등학교 공통 과목")
        svg_parts.append(
            f'<text x="{x + COL_W / 2}" y="{HEADER_Y - 18}" class="stage-label">{html.escape(stage)}</text>'
        )
        svg_parts.append(
            f'<text x="{x + COL_W / 2}" y="{HEADER_Y + 4}" class="band-label">{html.escape(label)}</text>'
        )

    # 화살표 (블록보다 먼저 그려 밑에 깔기)
    def block_anchor(block_id: str) -> tuple[float, float, float, float]:
        if block_id == "spine_dom_m13_bridge":
            return m13_right, m13_mid_y, m13_right, m13_mid_y
        b = blocks[block_id]
        return b["x"], b["y"] + b["h"] / 2, b["x"] + b["w"], b["y"] + b["h"] / 2

    for arrow in arrows:
        _, _, x1, y1 = block_anchor(arrow["from"])
        x2, y2, _, _ = block_anchor(arrow["to"])
        dash = ' stroke-dasharray="7,5"' if arrow["confidence"] != "high" else ""
        cls = "arrow-medium" if arrow["confidence"] != "high" else "arrow-high"
        mid_x = (x1 + x2) / 2
        svg_parts.append(
            f'<path class="{cls}" d="M {x1:.0f} {y1:.0f} C {mid_x:.0f} {y1:.0f}, '
            f'{mid_x:.0f} {y2:.0f}, {x2:.0f} {y2:.0f}" marker-end="url(#arrowhead)"{dash}/>'
        )

    # 블록
    for b in blocks.values():
        cls = {
            "domain": "block domain",
            "subject": "block subject",
            "area": "block area",
            "subject_alt": "block subject alt",
            "area_alt": "block area alt",
        }[b["kind"]]
        svg_parts.append(
            f'<g class="{cls}" data-block="{b["id"]}" tabindex="0">'
            f'<rect x="{b["x"]}" y="{b["y"]}" width="{b["w"]}" height="{b["h"]}" rx="8"/>'
            f'<text x="{b["x"] + b["w"] / 2}" y="{b["y"] + b["h"] / 2 - 6}" class="block-title">{html.escape(b["title"])}</text>'
            f'<text x="{b["x"] + b["w"] / 2}" y="{b["y"] + b["h"] / 2 + 14}" class="block-sub">{html.escape(b["subtitle"])}</text>'
            f"</g>"
        )

    # 대체 경로 라벨
    alt_blocks = [b for b in blocks.values() if b["kind"] == "subject_alt"]
    if alt_blocks:
        alt_top = min(b["y"] for b in alt_blocks)
        alt_left = min(b["x"] for b in alt_blocks)
        svg_parts.append(
            f'<text x="{alt_left}" y="{alt_top - 12}" class="alt-label">대체 경로: 기본수학1·2 (공통 과목)</text>'
        )

    detail_data = {
        b["id"]: {
            "title": b["title"],
            "subtitle": b["subtitle"],
            "standards": b["standards"],
        }
        for b in blocks.values()
    }

    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>초1~고1 수학 위계 그래프 (공통 과정)</title>
<style>
  body {{ font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; margin: 0; background: #f7f8fa; color: #1f2430; }}
  header {{ padding: 18px 28px 8px; }}
  header h1 {{ font-size: 20px; margin: 0 0 6px; }}
  header p {{ font-size: 12.5px; color: #555e6e; margin: 2px 0; }}
  .wrap {{ display: flex; gap: 16px; padding: 8px 24px 24px; align-items: flex-start; }}
  .canvas {{ overflow-x: auto; background: #fff; border: 1px solid #e2e6ee; border-radius: 12px; padding: 10px; flex: 1 1 auto; }}
  .panel {{ width: 380px; flex: 0 0 380px; background: #fff; border: 1px solid #e2e6ee; border-radius: 12px; padding: 16px; max-height: 82vh; overflow-y: auto; }}
  .panel h2 {{ font-size: 15px; margin: 0 0 4px; }}
  .panel .meta {{ font-size: 12px; color: #667; margin-bottom: 10px; }}
  .panel li {{ font-size: 12.5px; margin-bottom: 9px; line-height: 1.45; }}
  .panel li code {{ background: #eef2f9; border-radius: 4px; padding: 1px 5px; font-size: 11.5px; }}
  .panel .loc {{ color: #98a; font-size: 11px; }}
  .stage-label {{ font-size: 11px; fill: #8a93a6; text-anchor: middle; }}
  .band-label {{ font-size: 14px; font-weight: 700; fill: #2a3348; text-anchor: middle; }}
  .block rect {{ cursor: pointer; }}
  .block.domain rect {{ fill: #eef4ff; stroke: #7d9bd6; stroke-width: 1.2; }}
  .block.subject rect {{ fill: #2f4f8f; stroke: #2f4f8f; }}
  .block.subject .block-title {{ fill: #fff; }}
  .block.subject .block-sub {{ fill: #cdd9f2; }}
  .block.area rect {{ fill: #f2f6ff; stroke: #9bb3dd; stroke-width: 1; }}
  .block.subject.alt rect, .block.area.alt rect {{ stroke-dasharray: 5,4; opacity: 0.85; }}
  .block.subject.alt rect {{ fill: #5a6f9b; }}
  .block:hover rect, .block:focus rect {{ stroke: #e2762d; stroke-width: 2; outline: none; }}
  .block.selected rect {{ stroke: #e2762d; stroke-width: 2.4; }}
  .block-title {{ font-size: 13px; font-weight: 700; fill: #22304d; text-anchor: middle; pointer-events: none; }}
  .block-sub {{ font-size: 11px; fill: #5d6a85; text-anchor: middle; pointer-events: none; }}
  .arrow-high {{ fill: none; stroke: #8a93a6; stroke-width: 1.7; }}
  .arrow-medium {{ fill: none; stroke: #d99141; stroke-width: 1.7; }}
  .alt-label {{ font-size: 11.5px; fill: #5a6f9b; }}
  .legend {{ font-size: 12px; color: #556; padding: 0 28px 4px; }}
  .legend span {{ margin-right: 18px; }}
  .line-high, .line-medium {{ display: inline-block; width: 30px; height: 0; border-top: 2.5px solid #8a93a6; vertical-align: middle; margin-right: 5px; }}
  .line-medium {{ border-top-style: dashed; border-top-color: #d99141; }}
</style>
</head>
<body>
<header>
  <h1>초1~고1 수학 위계 그래프 — 공통 교육과정 + 고등 공통 과목</h1>
  <p>가로축: 학년군 진행(왼쪽 → 오른쪽) · 세로축: 교육과정 영역. 블록을 클릭하면 해당 구간의 성취기준 원문이 오른쪽에 표시됩니다.</p>
  <p>출처: 2022 개정 수학과 교육과정(별책8) 원문 추출. 고등학교 선택 과목은 2026-07-06 결정에 따라 이 그래프에서 제외(AGENTS.md Scope Rules 참조).</p>
</header>
<div class="legend">
  <span><span class="line-high"></span>선수 관계 (공식 문서 직접 근거)</span>
  <span><span class="line-medium"></span>선수 관계 (편제·구성 기반 추론, medium)</span>
</div>
<div class="wrap">
  <div class="canvas">
    <svg width="{max_x}" height="{max_y}" viewBox="0 0 {max_x} {max_y}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrowhead" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 9 3.5, 0 7" fill="#8a93a6"/>
        </marker>
      </defs>
      {''.join(svg_parts)}
    </svg>
  </div>
  <aside class="panel" id="panel">
    <h2>블록을 선택하세요</h2>
    <div class="meta">학년군×영역 블록 또는 고등 과목 영역을 클릭하면 성취기준 목록이 나타납니다.</div>
  </aside>
</div>
<script>
const DETAILS = {json.dumps(detail_data, ensure_ascii=False)};
const panel = document.getElementById('panel');
let selected = null;
document.querySelectorAll('.block').forEach(el => {{
  el.addEventListener('click', () => select(el));
  el.addEventListener('keydown', e => {{ if (e.key === 'Enter' || e.key === ' ') {{ e.preventDefault(); select(el); }} }});
}});
function select(el) {{
  if (selected) selected.classList.remove('selected');
  selected = el; el.classList.add('selected');
  const d = DETAILS[el.dataset.block];
  if (!d) return;
  let html_ = `<h2>${{d.title}}</h2><div class="meta">${{d.subtitle}}</div>`;
  if (d.standards.length) {{
    html_ += '<ol style="padding-left:18px">' + d.standards.map(s =>
      `<li><code>[${{s.code}}]</code> ${{s.statement}}<br><span class="loc">${{s.locator}}</span></li>`).join('') + '</ol>';
  }} else {{
    html_ += '<div class="meta">이 블록에는 직접 연결된 성취기준이 없습니다 (과목 머리글).</div>';
  }}
  panel.innerHTML = html_;
}}
</script>
</body>
</html>
"""


def main() -> None:
    nodes = load_rows(NODES_CSV)
    edges = load_rows(EDGES_CSV)
    model = build_view_model(nodes, edges)

    out_of_scope_labels = {"대수", "미적분Ⅰ", "미적분Ⅱ", "확률과 통계", "기하"}
    titles = {b["title"] for b in model["blocks"].values()}
    if titles & out_of_scope_labels:
        raise SystemExit("선택 과목이 시각화 범위에 포함되었습니다. Scope Rules를 확인하세요.")

    VIZ_HTML.write_text(render_html(model), encoding="utf-8")
    print(f"blocks: {len(model['blocks'])}, arrows: {len(model['arrows'])}")
    print(f"written: {VIZ_HTML}")


if __name__ == "__main__":
    main()
