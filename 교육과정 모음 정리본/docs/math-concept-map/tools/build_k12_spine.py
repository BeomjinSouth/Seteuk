from __future__ import annotations

import csv
import re
from bisect import bisect_right
from pathlib import Path

try:
    import pdfplumber
except ImportError:  # pragma: no cover - PDF 없는 환경에서 순수 함수 테스트용
    pdfplumber = None


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
CURRICULUM_PDF = (
    ROOT / "2022_개정_중학교_교육과정_PDF" / "교과" / "02_[별책8] 수학과 교육과정.pdf"
)
NODES_CSV = OUT_DIR / "k12-spine-nodes.csv"
EDGES_CSV = OUT_DIR / "k12-spine-edges.csv"
SPINE_DOT = OUT_DIR / "k12-spine.dot"
SPINE_MD = OUT_DIR / "k12-spine.md"

SOURCE_LABEL = "수학과 교육과정(별책8)"

# 공통 교육과정 학년군. (코드 접두어, id 조각, 표시 이름, 학교급, 학년군)
BANDS = [
    ("2수", "e12", "초등학교 1~2학년 수학", "초등학교", "초1-2"),
    ("4수", "e34", "초등학교 3~4학년 수학", "초등학교", "초3-4"),
    ("6수", "e56", "초등학교 5~6학년 수학", "초등학교", "초5-6"),
    ("9수", "m13", "중학교 1~3학년 수학", "중학교", "중1-3"),
]

DOMAINS = {
    "01": "수와 연산",
    "02": "변화와 관계",
    "03": "도형과 측정",
    "04": "자료와 가능성",
}

# 공통 교육과정 학년군별 공식 성취기준 수. 추출 결과가 어긋나면 빌드를 멈춘다.
EXPECTED_BAND_STANDARD_COUNTS = {"2수": 29, "4수": 47, "6수": 45, "9수": 60}

# 고등학교 과목. (코드 접두어, id 조각, 표시 이름, 과목 구분, 학년군)
HS_SUBJECTS = [
    ("10공수1", "gongsu1", "공통수학1", "공통 과목", "고1"),
    ("10공수2", "gongsu2", "공통수학2", "공통 과목", "고1"),
    ("10기수1", "gisu1", "기본수학1", "공통 과목", "고1"),
    ("10기수2", "gisu2", "기본수학2", "공통 과목", "고1"),
    ("12대수", "daesu", "대수", "일반 선택 과목", "고2-3"),
    ("12미적Ⅰ", "mijeok1", "미적분Ⅰ", "일반 선택 과목", "고2-3"),
    ("12확통", "hwaktong", "확률과 통계", "일반 선택 과목", "고2-3"),
    ("12미적Ⅱ", "mijeok2", "미적분Ⅱ", "진로 선택 과목", "고2-3"),
    ("12기하", "giha", "기하", "진로 선택 과목", "고2-3"),
    ("12경수", "gyeongsu", "경제 수학", "진로 선택 과목", "고2-3"),
    ("12인수", "insu", "인공지능 수학", "진로 선택 과목", "고2-3"),
    ("12직수", "jiksu", "직무 수학", "진로 선택 과목", "고2-3"),
    ("12수문", "sumun", "수학과 문화", "융합 선택 과목", "고2-3"),
    ("12실통", "siltong", "실용 통계", "융합 선택 과목", "고2-3"),
    ("12수과", "sugwa", "수학과제 탐구", "융합 선택 과목", "고2-3"),
]

BAND_BY_PREFIX = {band[0]: band for band in BANDS}
SUBJECT_BY_PREFIX = {subject[0]: subject for subject in HS_SUBJECTS}

CODE_PREFIXES = [band[0] for band in BANDS] + [subject[0] for subject in HS_SUBJECTS]
CODE_RE = re.compile(
    r"\[(" + "|".join(re.escape(p) for p in CODE_PREFIXES) + r")-?(\d{2})-(\d{2})\]"
)
AREA_HEADER_RE = re.compile(r"^\((\d)\)\s*(\S.*)$", re.MULTILINE)
BOUNDARY_RE = re.compile(
    r"\[(?:" + "|".join(re.escape(p) for p in CODE_PREFIXES) + r")"
    r"|\((?:가|나|다)\)"
    r"|^\(\d\)"
    r"|\[초등학교"
    r"|\[중학교"
    r"|나\.\s*성취기준",
    re.MULTILINE,
)
PAGE_DECORATION_RE = re.compile(
    r"^\s*(?:수학과 교육과정|공통 교육과정|선택 중심 교육과정|\d{1,3})\s*$"
)

# 과목 사이 선수/연계 관계. 공식 문서의 직접 문장 또는 편제 구조 안에서만 정의한다.
# (source_node_id, target_node_id, relationship_type, confidence, locator, notes)
SUBJECT_LEVEL_EDGES = [
    (
        "spine_stage_m13",
        "spine_subj_gongsu1",
        "prerequisite_for",
        "high",
        "별책8 차례, 선택 중심 교육과정 공통 과목",
        "공통 교육과정(초1~중3) 이후 고등학교 공통 과목으로 이어지는 편제 구조.",
    ),
    (
        "spine_stage_m13",
        "spine_subj_gisu1",
        "prerequisite_for",
        "high",
        "별책8 차례, 선택 중심 교육과정 공통 과목",
        "기본수학1·2는 공통수학1·2와 함께 고등학교 공통 과목으로 편제된 대체 이수 경로.",
    ),
    (
        "spine_subj_gongsu1",
        "spine_subj_gongsu2",
        "prerequisite_for",
        "medium",
        "별책8 p.57 이하 공통수학1·2 구성",
        "과목 번호 순차 구성에서 추론한 이수 순서. 문서가 순서를 직접 강제하지는 않는다.",
    ),
    (
        "spine_subj_gisu1",
        "spine_subj_gisu2",
        "prerequisite_for",
        "medium",
        "별책8 p.76 이하 기본수학1·2 구성",
        "과목 번호 순차 구성에서 추론한 이수 순서. 문서가 순서를 직접 강제하지는 않는다.",
    ),
    (
        "spine_subj_daesu",
        "spine_subj_mijeok2",
        "prerequisite_for",
        "medium",
        "별책8 p.141 이하 미적분Ⅱ 내용 체계",
        "미적분Ⅱ의 지수함수·로그함수·삼각함수 미분은 대수의 함수 내용을 전제로 한다는 내용 체계 기반 추론.",
    ),
    (
        "spine_subj_mijeok1",
        "spine_subj_mijeok2",
        "prerequisite_for",
        "medium",
        "별책8 p.141 이하 미적분Ⅱ 내용 체계",
        "미적분Ⅱ의 미분법·적분법은 미적분Ⅰ의 극한·미분·적분 개념을 전제로 한다는 내용 체계 기반 추론.",
    ),
    (
        "spine_subj_mijeok2",
        "spine_subj_giha",
        "related_to",
        "high",
        "별책8 p.164",
        "기하 성취기준 적용 시 고려 사항: 미적분Ⅱ를 이수한 학생에게는 음함수 미분법으로 접선의 방정식을 설명하게 한다.",
    ),
    (
        "spine_subj_mijeok2",
        "spine_subj_gyeongsu",
        "related_to",
        "high",
        "별책8 p.178",
        "경제 수학 성취기준 적용 시 고려 사항: 미적분Ⅱ를 이수한 학생에게는 연속복리를 지도할 수 있다.",
    ),
    (
        "spine_subj_daesu",
        "spine_subj_insu",
        "related_to",
        "high",
        "별책8 p.193",
        "인공지능 수학 성취기준 적용 시 고려 사항: 대수를 이수한 학생은 로그로 역문서빈도(IDF)를 표현하게 한다.",
    ),
]

# 공통수학1·2 이후 선택할 수 있는 과목. p.74의 직접 문장을 근거로 공통수학2에서 연결한다.
POST_COMMON_SUBJECT_IDS = [
    "daesu",
    "mijeok1",
    "hwaktong",
    "mijeok2",
    "giha",
    "gyeongsu",
    "insu",
    "jiksu",
    "sumun",
    "siltong",
    "sugwa",
]

NODE_FIELDS = [
    "node_id",
    "node_type",
    "label_ko",
    "school_level",
    "grade_band",
    "course_type",
    "domain",
    "subject_label",
    "achievement_code",
    "statement",
    "source_locator",
    "confidence",
    "notes",
]

EDGE_FIELDS = [
    "edge_id",
    "source_id",
    "target_id",
    "relationship_type",
    "confidence",
    "source_locator",
    "notes",
]


def strip_page_decorations(page_text: str) -> str:
    lines = page_text.splitlines()
    kept = [line for line in lines if not PAGE_DECORATION_RE.match(line)]
    return "\n".join(kept)


def clean_statement(raw: str) -> str:
    text = re.sub(r"\s+\.", ".", raw)
    text = re.sub(r"\s+", " ", text).strip()
    cut = text.rfind("다.")
    if cut >= 0:
        text = text[: cut + 2]
    return text


def clean_title(raw: str) -> str:
    return re.sub(r"\s+", " ", raw).strip()


def parse_standards(page_texts: list[str]) -> tuple[list[dict], dict[tuple[str, str], str]]:
    """페이지 텍스트에서 성취기준과 영역 제목을 추출한다.

    반환값: (성취기준 목록, {(코드 접두어, 영역 번호): 영역 제목})
    """
    cleaned_pages = [strip_page_decorations(t or "") for t in page_texts]
    page_starts: list[int] = []
    offset = 0
    parts: list[str] = []
    for text in cleaned_pages:
        page_starts.append(offset)
        parts.append(text)
        offset += len(text) + 1
    full = "\n".join(parts)

    def page_of(pos: int) -> int:
        return bisect_right(page_starts, pos)

    code_matches = list(CODE_RE.finditer(full))
    header_matches = list(AREA_HEADER_RE.finditer(full))

    events: list[tuple[int, str, object]] = []
    for m in code_matches:
        events.append((m.start(), "code", m))
    for m in header_matches:
        events.append((m.start(), "header", m))
    events.sort(key=lambda e: e[0])

    area_titles: dict[tuple[str, str], str] = {}
    pending_header: tuple[str, str] | None = None
    for _, kind, match in events:
        if kind == "header":
            pending_header = (match.group(1).zfill(2), clean_title(match.group(2)))
            continue
        prefix, area, _num = match.group(1), match.group(2), match.group(3)
        if pending_header and pending_header[0] == area:
            area_titles.setdefault((prefix, area), pending_header[1])
        pending_header = None

    standards: list[dict] = []
    seen_codes: set[str] = set()
    for i, m in enumerate(code_matches):
        prefix, area, num = m.group(1), m.group(2), m.group(3)
        code = m.group(0)[1:-1]
        if code in seen_codes:
            continue
        seen_codes.add(code)

        next_code_start = (
            code_matches[i + 1].start() if i + 1 < len(code_matches) else len(full)
        )
        boundary = BOUNDARY_RE.search(full, m.end(), next_code_start)
        end = boundary.start() if boundary else next_code_start
        statement = clean_statement(full[m.end() : end])
        standards.append(
            {
                "code": code,
                "prefix": prefix,
                "area": area,
                "number": num,
                "statement": statement,
                "page": page_of(m.start()),
            }
        )
    return standards, area_titles


def standard_node_id(prefix: str, area: str, num: str) -> str:
    if prefix in BAND_BY_PREFIX:
        fragment = BAND_BY_PREFIX[prefix][1]
    else:
        fragment = SUBJECT_BY_PREFIX[prefix][1]
    return f"spine_std_{fragment}_{area}_{num}"


def build_nodes(
    standards: list[dict], area_titles: dict[tuple[str, str], str]
) -> list[dict]:
    nodes: list[dict] = []
    band_pages: dict[str, int] = {}
    subject_pages: dict[str, int] = {}
    for std in standards:
        pages = band_pages if std["prefix"] in BAND_BY_PREFIX else subject_pages
        pages.setdefault(std["prefix"], std["page"])

    for prefix, fragment, label, school_level, grade_band in BANDS:
        page = band_pages.get(prefix, 0)
        nodes.append(
            {
                "node_id": f"spine_stage_{fragment}",
                "node_type": "school_stage",
                "label_ko": label,
                "school_level": school_level,
                "grade_band": grade_band,
                "course_type": "공통 교육과정",
                "domain": "",
                "subject_label": "수학",
                "achievement_code": "",
                "statement": "",
                "source_locator": f"{SOURCE_LABEL} p.{page} 이하",
                "confidence": "high",
                "notes": "",
            }
        )
        for area, domain in DOMAINS.items():
            nodes.append(
                {
                    "node_id": f"spine_dom_{fragment}_{area}",
                    "node_type": "stage_domain",
                    "label_ko": f"{grade_band} {domain}",
                    "school_level": school_level,
                    "grade_band": grade_band,
                    "course_type": "공통 교육과정",
                    "domain": domain,
                    "subject_label": "수학",
                    "achievement_code": "",
                    "statement": "",
                    "source_locator": f"{SOURCE_LABEL} p.{page} 이하",
                    "confidence": "high",
                    "notes": "",
                }
            )

    for prefix, fragment, label, course_type, grade_band in HS_SUBJECTS:
        page = subject_pages.get(prefix, 0)
        nodes.append(
            {
                "node_id": f"spine_subj_{fragment}",
                "node_type": "hs_subject",
                "label_ko": label,
                "school_level": "고등학교",
                "grade_band": grade_band,
                "course_type": course_type,
                "domain": "",
                "subject_label": label,
                "achievement_code": "",
                "statement": "",
                "source_locator": f"{SOURCE_LABEL} p.{page} 이하",
                "confidence": "high",
                "notes": "",
            }
        )
        subject_areas = sorted(
            {std["area"] for std in standards if std["prefix"] == prefix}
        )
        for area in subject_areas:
            title = area_titles.get((prefix, area), f"영역 {area}")
            first_page = min(
                std["page"]
                for std in standards
                if std["prefix"] == prefix and std["area"] == area
            )
            nodes.append(
                {
                    "node_id": f"spine_area_{fragment}_{area}",
                    "node_type": "hs_subject_area",
                    "label_ko": f"{label} · {title}",
                    "school_level": "고등학교",
                    "grade_band": grade_band,
                    "course_type": course_type,
                    "domain": title,
                    "subject_label": label,
                    "achievement_code": "",
                    "statement": "",
                    "source_locator": f"{SOURCE_LABEL} p.{first_page} 이하",
                    "confidence": "high",
                    "notes": "",
                }
            )

    for std in standards:
        prefix = std["prefix"]
        if prefix in BAND_BY_PREFIX:
            _, fragment, _, school_level, grade_band = BAND_BY_PREFIX[prefix]
            course_type = "공통 교육과정"
            domain = DOMAINS[std["area"]]
            subject_label = "수학"
        else:
            _, fragment, label, course_type, grade_band = SUBJECT_BY_PREFIX[prefix]
            school_level = "고등학교"
            domain = area_titles.get((prefix, std["area"]), f"영역 {std['area']}")
            subject_label = label
        nodes.append(
            {
                "node_id": standard_node_id(prefix, std["area"], std["number"]),
                "node_type": "achievement_standard",
                "label_ko": f"[{std['code']}]",
                "school_level": school_level,
                "grade_band": grade_band,
                "course_type": course_type,
                "domain": domain,
                "subject_label": subject_label,
                "achievement_code": std["code"],
                "statement": std["statement"],
                "source_locator": f"{SOURCE_LABEL} p.{std['page']}",
                "confidence": "high",
                "notes": "",
            }
        )
    return nodes


def build_edges(standards: list[dict], content_system_page: int) -> list[dict]:
    edges: list[dict] = []

    def add_edge(
        source_id: str,
        target_id: str,
        relationship_type: str,
        confidence: str,
        locator: str,
        notes: str,
    ) -> None:
        edge_id = f"spine_edge_{len(edges) + 1:04d}"
        edges.append(
            {
                "edge_id": edge_id,
                "source_id": source_id,
                "target_id": target_id,
                "relationship_type": relationship_type,
                "confidence": confidence,
                "source_locator": locator,
                "notes": notes,
            }
        )

    content_locator = f"{SOURCE_LABEL} p.{content_system_page} 이하 내용 체계"

    # 포함 관계: 학년군 -> 영역 블록, 영역 블록/과목 영역 -> 성취기준, 과목 -> 과목 영역
    for _, fragment, _, _, _ in BANDS:
        for area in DOMAINS:
            add_edge(
                f"spine_stage_{fragment}",
                f"spine_dom_{fragment}_{area}",
                "contains",
                "high",
                content_locator,
                "",
            )

    subject_area_seen: set[tuple[str, str]] = set()
    for std in standards:
        prefix, area, num = std["prefix"], std["area"], std["number"]
        std_node = standard_node_id(prefix, area, num)
        locator = f"{SOURCE_LABEL} p.{std['page']}"
        if prefix in BAND_BY_PREFIX:
            fragment = BAND_BY_PREFIX[prefix][1]
            add_edge(
                f"spine_dom_{fragment}_{area}", std_node, "contains", "high", locator, ""
            )
        else:
            fragment = SUBJECT_BY_PREFIX[prefix][1]
            if (prefix, area) not in subject_area_seen:
                subject_area_seen.add((prefix, area))
                add_edge(
                    f"spine_subj_{fragment}",
                    f"spine_area_{fragment}_{area}",
                    "contains",
                    "high",
                    locator,
                    "",
                )
            add_edge(
                f"spine_area_{fragment}_{area}", std_node, "contains", "high", locator, ""
            )

    # 학년군 진행: 학교급 전체와 영역별 연속
    stage_chain_note = "공통 교육과정 학년군 연속 구성에 따른 진행."
    for (prev, nxt) in zip(BANDS, BANDS[1:]):
        add_edge(
            f"spine_stage_{prev[1]}",
            f"spine_stage_{nxt[1]}",
            "prerequisite_for",
            "high",
            content_locator,
            stage_chain_note,
        )
        for area in DOMAINS:
            add_edge(
                f"spine_dom_{prev[1]}_{area}",
                f"spine_dom_{nxt[1]}_{area}",
                "prerequisite_for",
                "high",
                content_locator,
                f"{DOMAINS[area]} 영역의 학년군 연속 구성.",
            )

    for edge in SUBJECT_LEVEL_EDGES:
        add_edge(*edge)

    post_common_note = (
        "공통수학2 p.74: <공통수학1, 2> 이후 선택할 수 있는 수학 과목을 안내한다는 직접 서술. "
        "공통수학1·2를 공동 전제로 본다."
    )
    for subject_id in POST_COMMON_SUBJECT_IDS:
        add_edge(
            "spine_subj_gongsu2",
            f"spine_subj_{subject_id}",
            "prerequisite_for",
            "high",
            "별책8 p.74",
            post_common_note,
        )
    return edges


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


def render_dot(nodes: list[dict], edges: list[dict]) -> str:
    lines = [
        "digraph k12_spine {",
        "  rankdir=LR;",
        '  node [shape=box, fontname="Malgun Gothic"];',
        '  edge [fontname="Malgun Gothic"];',
    ]

    clusters = [
        ("cluster_elementary", "초등학교", ["초1-2", "초3-4", "초5-6"]),
        ("cluster_middle", "중학교", ["중1-3"]),
        ("cluster_high_common", "고등학교 공통 과목", None),
        ("cluster_high_selective", "고등학교 선택 과목", None),
    ]
    for cluster_id, label, bands in clusters:
        lines.append(f"  subgraph {cluster_id} {{")
        lines.append(f'    label="{label}";')
        if bands is not None:
            for node in nodes:
                if node["node_type"] in {"school_stage", "stage_domain"} and node[
                    "grade_band"
                ] in bands:
                    shape = "ellipse" if node["node_type"] == "school_stage" else "box"
                    lines.append(
                        f'    "{node["node_id"]}" [label="{node["label_ko"]}", shape={shape}];'
                    )
        elif cluster_id == "cluster_high_common":
            for node in nodes:
                if node["node_type"] == "hs_subject" and node["course_type"] == "공통 과목":
                    lines.append(
                        f'    "{node["node_id"]}" [label="{node["label_ko"]}", shape=ellipse];'
                    )
        else:
            for node in nodes:
                if node["node_type"] == "hs_subject" and node["course_type"] != "공통 과목":
                    lines.append(
                        f'    "{node["node_id"]}" [label="{node["label_ko"]} ({node["course_type"]})", shape=ellipse];'
                    )
        lines.append("  }")

    drawable = {
        node["node_id"]
        for node in nodes
        if node["node_type"] in {"school_stage", "stage_domain", "hs_subject"}
    }
    for edge in edges:
        if edge["source_id"] not in drawable or edge["target_id"] not in drawable:
            continue
        if edge["relationship_type"] == "contains":
            style = "dotted"
        elif edge["relationship_type"] == "related_to":
            style = "dashed"
        else:
            style = "solid"
        confidence = edge["confidence"]
        color = "gray50" if confidence == "high" else "orange3"
        lines.append(
            f'  "{edge["source_id"]}" -> "{edge["target_id"]}" '
            f'[style={style}, color={color}, label="{edge["relationship_type"]}"];'
        )
    lines.append("}")
    return "\n".join(lines) + "\n"


def render_md(nodes: list[dict], edges: list[dict]) -> str:
    standards = [n for n in nodes if n["node_type"] == "achievement_standard"]
    band_counts: dict[str, int] = {}
    for node in standards:
        band_counts[node["grade_band"]] = band_counts.get(node["grade_band"], 0) + 1

    subject_rows = []
    for prefix, fragment, label, course_type, grade_band in HS_SUBJECTS:
        subject_standards = [
            n for n in standards if n["subject_label"] == label and n["school_level"] == "고등학교"
        ]
        areas = sorted({n["domain"] for n in subject_standards})
        pages = [
            int(m.group(1))
            for n in subject_standards
            if (m := re.search(r"p\.(\d+)", n["source_locator"]))
        ]
        first_locator = f"{SOURCE_LABEL} p.{min(pages)}" if pages else ""
        subject_rows.append(
            f"| {label} | {course_type} | {len(areas)} | {len(subject_standards)} | {first_locator} |"
        )

    prereq_edges = [e for e in edges if e["relationship_type"] == "prerequisite_for"]
    related_edges = [e for e in edges if e["relationship_type"] == "related_to"]
    contains_edges = [e for e in edges if e["relationship_type"] == "contains"]

    subject_edge_lines = []
    node_labels = {n["node_id"]: n["label_ko"] for n in nodes}
    for edge in prereq_edges + related_edges:
        if not (
            edge["source_id"].startswith("spine_subj_")
            or edge["target_id"].startswith("spine_subj_")
        ):
            continue
        subject_edge_lines.append(
            f"- `{node_labels[edge['source_id']]}` -> `{node_labels[edge['target_id']]}`"
            f" ({edge['relationship_type']}, {edge['confidence']}): {edge['notes']}"
            f" [{edge['source_locator']}]"
        )

    lines = [
        "# 초1~고3 수학 위계 Spine",
        "",
        "이 산출물은 2022 개정 수학과 교육과정(별책8) 원문에서 초1~고3 전 구간의",
        "학년군·영역·과목·성취기준을 추출해, 중학교 미시 concept map을 초등·고등과 잇는",
        "거시 위계 그래프로 정리한 것이다.",
        "",
        "## 데이터 규모",
        "",
        f"- 노드: {len(nodes)}개",
        f"  - 학년군(공통 교육과정): {sum(1 for n in nodes if n['node_type'] == 'school_stage')}개",
        f"  - 학년군×영역 블록: {sum(1 for n in nodes if n['node_type'] == 'stage_domain')}개",
        f"  - 고등학교 과목: {sum(1 for n in nodes if n['node_type'] == 'hs_subject')}개",
        f"  - 고등학교 과목×영역: {sum(1 for n in nodes if n['node_type'] == 'hs_subject_area')}개",
        f"  - 성취기준: {len(standards)}개",
        f"- edge: {len(edges)}개 (contains {len(contains_edges)}, prerequisite_for {len(prereq_edges)}, related_to {len(related_edges)})",
        "",
        "## 학년군별 성취기준 수",
        "",
        "| 학년군 | 성취기준 수 |",
        "| --- | --- |",
    ]
    for band in ["초1-2", "초3-4", "초5-6", "중1-3", "고1", "고2-3"]:
        if band in band_counts:
            lines.append(f"| {band} | {band_counts[band]} |")
    lines += [
        "",
        "## 고등학교 과목",
        "",
        "| 과목 | 구분 | 영역 수 | 성취기준 수 | 시작 위치 |",
        "| --- | --- | --- | --- | --- |",
        *subject_rows,
        "",
        "## 과목 수준 위계 edge와 근거",
        "",
        *subject_edge_lines,
        "",
        "## 기존 중학교 미시 concept map과의 연결",
        "",
        "- 중1-3 성취기준 노드의 `achievement_code`(`9수01-01`~`9수04-09`)는",
        "  `achievement-coverage.csv`의 `achievement_code`와 같은 코드 체계를 쓴다.",
        "  spine의 중학교 성취기준 노드에서 해당 코드로 조인하면 미시 concept 수준으로 내려갈 수 있다.",
        "- 초등·고등 구간은 아직 성취기준 수준까지만 있으며, 미시 concept 분해는 다음 작업이다.",
        "",
        "## 한계",
        "",
        "- 과목 사이 선수 관계는 문서의 직접 서술(p.74, p.164, p.178, p.193)과 편제 구조 안에서만 연결했고,",
        "  내용 체계 기반 추론 edge(공통수학1->2, 기본수학1->2, 대수/미적분Ⅰ->미적분Ⅱ)는 `medium`으로 표시했다.",
        "- 성취기준 진술문은 PDF 텍스트 추출 결과이므로 일부 글자 간격 잡음이 남을 수 있다.",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    if pdfplumber is None:
        raise SystemExit("pdfplumber가 필요합니다.")
    with pdfplumber.open(str(CURRICULUM_PDF)) as pdf:
        page_texts = [page.extract_text() or "" for page in pdf.pages]

    content_system_page = 0
    for i, text in enumerate(page_texts):
        if "내용 체계" in text and "성취기준" in text:
            content_system_page = i + 1
            break

    standards, area_titles = parse_standards(page_texts)

    for prefix, expected in EXPECTED_BAND_STANDARD_COUNTS.items():
        actual = sum(1 for std in standards if std["prefix"] == prefix)
        if actual != expected:
            raise SystemExit(
                f"{prefix} 성취기준 추출 수 {actual}가 기대값 {expected}와 다릅니다."
            )
    for prefix, _, label, _, _ in HS_SUBJECTS:
        actual = sum(1 for std in standards if std["prefix"] == prefix)
        if actual < 5:
            raise SystemExit(f"{label} 성취기준이 {actual}개만 추출되었습니다.")
    empty_statements = [std["code"] for std in standards if not std["statement"]]
    if empty_statements:
        raise SystemExit(f"진술문이 비어 있는 성취기준: {empty_statements[:5]}")

    nodes = build_nodes(standards, area_titles)
    edges = build_edges(standards, content_system_page)

    node_ids = {node["node_id"] for node in nodes}
    if len(node_ids) != len(nodes):
        raise SystemExit("node_id 중복이 있습니다.")
    for edge in edges:
        if edge["source_id"] not in node_ids or edge["target_id"] not in node_ids:
            raise SystemExit(f"정의되지 않은 노드를 참조하는 edge: {edge['edge_id']}")
    if not prerequisite_graph_is_acyclic(edges):
        raise SystemExit("prerequisite_for edge에 순환이 있습니다.")

    with NODES_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=NODE_FIELDS)
        writer.writeheader()
        writer.writerows(nodes)
    with EDGES_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=EDGE_FIELDS)
        writer.writeheader()
        writer.writerows(edges)
    SPINE_DOT.write_text(render_dot(nodes, edges), encoding="utf-8")
    SPINE_MD.write_text(render_md(nodes, edges), encoding="utf-8")

    standards_count = sum(1 for n in nodes if n["node_type"] == "achievement_standard")
    print(f"nodes: {len(nodes)} (standards: {standards_count})")
    print(f"edges: {len(edges)}")
    print(f"content system page: {content_system_page}")


if __name__ == "__main__":
    main()
