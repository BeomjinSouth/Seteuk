from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"

CONCEPT_REQUIRED = {
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
}
EDGE_REQUIRED = {
    "id",
    "source_id",
    "target_id",
    "relationship_type",
    "source_refs",
    "notes",
    "confidence",
}
CONCEPT_TYPES = {
    "core_concept",
    "sub_concept",
    "representation",
    "procedure",
    "property",
    "term",
    "misconception_risk",
}
EDGE_TYPES = {
    "contains",
    "prerequisite_for",
    "represented_by",
    "used_in",
    "contrasts_with",
    "often_confused_with",
    "equivalent_to",
    "related_to",
}
CONFIDENCE = {"high", "medium", "low"}
EXPECTED_ACHIEVEMENT_CODES = tuple(
    [f"9수01-{number:02d}" for number in range(1, 11)]
    + [f"9수02-{number:02d}" for number in range(1, 23)]
    + [f"9수03-{number:02d}" for number in range(1, 20)]
    + [f"9수04-{number:02d}" for number in range(1, 10)]
)
ACHIEVEMENT_CODE_RE = re.compile(r"9수(?P<domain>\d{2})-(?P<number>\d{2})")
ACHIEVEMENT_RANGE_RE = re.compile(
    r"9수(?P<start_domain>\d{2})-(?P<start_number>\d{2})\]?\s*~\s*\[?"
    r"9수(?P<end_domain>\d{2})-(?P<end_number>\d{2})"
)


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def read_csv_count(path: Path) -> int:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return sum(1 for _ in csv.DictReader(f))


def achievement_code(domain: str, number: int) -> str:
    return f"9수{domain}-{number:02d}"


def expand_achievement_range(match: re.Match[str]) -> set[str]:
    start_domain = match.group("start_domain")
    end_domain = match.group("end_domain")
    start_number = int(match.group("start_number"))
    end_number = int(match.group("end_number"))

    if start_domain != end_domain or start_number > end_number:
        return {
            achievement_code(start_domain, start_number),
            achievement_code(end_domain, end_number),
        }

    return {
        achievement_code(start_domain, number)
        for number in range(start_number, end_number + 1)
    }


def collect_achievement_codes(records: list[dict]) -> set[str]:
    codes: set[str] = set()
    for record in records:
        for ref in record.get("source_refs", []):
            evidence = " ".join(
                str(ref.get(key, ""))
                for key in ["locator", "summary"]
            )
            for match in ACHIEVEMENT_RANGE_RE.finditer(evidence):
                codes.update(expand_achievement_range(match))
            codes.update(match.group(0) for match in ACHIEVEMENT_CODE_RE.finditer(evidence))
    return codes


def missing_achievement_codes(records: list[dict]) -> list[str]:
    present = collect_achievement_codes(records)
    return [code for code in EXPECTED_ACHIEVEMENT_CODES if code not in present]


def low_confidence_concept_count(records: list[dict]) -> int:
    return sum(1 for record in records if record.get("confidence") == "low")


def main() -> None:
    data_path = OUT_DIR / "concepts.json"
    if not data_path.exists():
        fail(f"missing {data_path}")

    data = json.loads(data_path.read_text(encoding="utf-8"))
    concepts = data.get("concepts", [])
    edges = data.get("edges", [])
    sources = {source["id"] for source in data.get("sources", [])}
    concept_ids = [item.get("id") for item in concepts]
    concept_id_set = set(concept_ids)

    if len(concept_ids) != len(concept_id_set):
        duplicates = sorted({item for item in concept_ids if concept_ids.count(item) > 1})
        fail(f"duplicate concept ids: {duplicates}")

    for item in concepts:
        missing = CONCEPT_REQUIRED - set(item)
        if missing:
            fail(f"concept {item.get('id')} missing fields: {sorted(missing)}")
        if item["concept_type"] not in CONCEPT_TYPES:
            fail(f"concept {item['id']} invalid concept_type {item['concept_type']}")
        if item["confidence"] not in CONFIDENCE:
            fail(f"concept {item['id']} invalid confidence {item['confidence']}")
        for key in ["aliases", "source_refs", "prerequisite_ids", "parent_ids", "related_ids"]:
            if not isinstance(item[key], list):
                fail(f"concept {item['id']} field {key} must be a list")
        for key in ["prerequisite_ids", "parent_ids", "related_ids"]:
            unknown = sorted(set(item[key]) - concept_id_set)
            if unknown:
                fail(f"concept {item['id']} has unknown {key}: {unknown}")
        for ref in item["source_refs"]:
            if ref.get("source_id") not in sources:
                fail(f"concept {item['id']} has unknown source_ref {ref.get('source_id')}")

    edge_ids = [item.get("id") for item in edges]
    if len(edge_ids) != len(set(edge_ids)):
        duplicates = sorted({item for item in edge_ids if edge_ids.count(item) > 1})
        fail(f"duplicate edge ids: {duplicates}")

    for item in edges:
        missing = EDGE_REQUIRED - set(item)
        if missing:
            fail(f"edge {item.get('id')} missing fields: {sorted(missing)}")
        if item["relationship_type"] not in EDGE_TYPES:
            fail(f"edge {item['id']} invalid relationship_type {item['relationship_type']}")
        if item["confidence"] not in CONFIDENCE:
            fail(f"edge {item['id']} invalid confidence {item['confidence']}")
        if item["source_id"] not in concept_id_set:
            fail(f"edge {item['id']} unknown source_id {item['source_id']}")
        if item["target_id"] not in concept_id_set:
            fail(f"edge {item['id']} unknown target_id {item['target_id']}")
        for ref in item["source_refs"]:
            if ref.get("source_id") not in sources:
                fail(f"edge {item['id']} has unknown source_ref {ref.get('source_id')}")

    concepts_csv = OUT_DIR / "concepts.csv"
    edges_csv = OUT_DIR / "edges.csv"
    review_queue_csv = OUT_DIR / "review-queue.csv"
    review_queue_md = OUT_DIR / "review-queue.md"
    graph = OUT_DIR / "graph.mmd"
    if read_csv_count(concepts_csv) != len(concepts):
        fail("concepts.csv row count does not match concepts.json")
    if read_csv_count(edges_csv) != len(edges):
        fail("edges.csv row count does not match concepts.json")
    if read_csv_count(review_queue_csv) != low_confidence_concept_count(concepts):
        fail("review-queue.csv row count does not match low-confidence concepts")
    if not review_queue_md.exists() or "# 검토 큐" not in review_queue_md.read_text(encoding="utf-8"):
        fail("review-queue.md missing or invalid")
    if not graph.exists() or "flowchart LR" not in graph.read_text(encoding="utf-8"):
        fail("graph.mmd missing or invalid")

    missing_codes = missing_achievement_codes(concepts)
    if missing_codes:
        fail(f"missing achievement-standard concept coverage: {missing_codes}")

    print(
        f"Validated {len(concepts)} concepts, {len(edges)} edges, "
        f"{len(sources)} sources, "
        f"{len(EXPECTED_ACHIEVEMENT_CODES)} achievement standards."
    )


if __name__ == "__main__":
    main()
