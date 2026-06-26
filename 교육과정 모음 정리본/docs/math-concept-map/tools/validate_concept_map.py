from __future__ import annotations

import csv
import json
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
}
CONFIDENCE = {"high", "medium", "low"}


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def read_csv_count(path: Path) -> int:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return sum(1 for _ in csv.DictReader(f))


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
    graph = OUT_DIR / "graph.mmd"
    if read_csv_count(concepts_csv) != len(concepts):
        fail("concepts.csv row count does not match concepts.json")
    if read_csv_count(edges_csv) != len(edges):
        fail("edges.csv row count does not match concepts.json")
    if not graph.exists() or "flowchart LR" not in graph.read_text(encoding="utf-8"):
        fail("graph.mmd missing or invalid")

    print(
        f"Validated {len(concepts)} concepts, {len(edges)} edges, "
        f"{len(sources)} sources."
    )


if __name__ == "__main__":
    main()
