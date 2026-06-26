from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

import build_terminology_coverage as terminology
import build_relationship_audit as relationship_audit
import build_source_inventory as source_inventory
import build_source_ref_audit as source_ref_audit
import build_concept_evidence_depth as concept_evidence_depth
import build_textbook_extraction_queue as textbook_extraction_queue
import build_textbook_evidence_packet as textbook_evidence_packet


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
SOURCE_INVENTORY_STATUSES = {"available", "empty", "missing"}
TEXTBOOK_PACKET_TOP_N = 5
REQUIRED_SOURCE_GROUPS = tuple(
    spec["source_group"] for spec in source_inventory.SOURCE_SPECS
)
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


def read_csv_rows(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


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


def term_needs_concept_count(records: list[dict]) -> int:
    return sum(1 for record in records if record.get("coverage_status") == "needs_concept")


def unit_group_count(records: list[dict]) -> int:
    return len(
        {
            (
                record.get("grade"),
                record.get("domain"),
                record.get("unit"),
            )
            for record in records
        }
    )


def isolated_concept_count(concepts: list[dict], edges: list[dict]) -> int:
    concept_ids = {concept.get("id") for concept in concepts}
    connected_ids = set()
    for edge in edges:
        connected_ids.add(edge.get("source_id"))
        connected_ids.add(edge.get("target_id"))
    return len(concept_ids - connected_ids)


def missing_source_inventory_groups(records: list[dict]) -> list[str]:
    present = {record.get("source_group") for record in records}
    return [group for group in REQUIRED_SOURCE_GROUPS if group not in present]


def invalid_source_inventory_statuses(records: list[dict]) -> list[str]:
    invalid: list[str] = []
    for record in records:
        status = record.get("status", "")
        if status not in SOURCE_INVENTORY_STATUSES:
            invalid.append(f"{record.get('source_group', '')}:{status}")
    return invalid


def source_ref_count(concepts: list[dict], edges: list[dict]) -> int:
    return sum(len(record.get("source_refs", [])) for record in concepts + edges)


def source_ref_audit_missing_detail_count(records: list[dict]) -> int:
    return sum(
        int(record.get("missing_locator_count", 0))
        + int(record.get("missing_summary_count", 0))
        for record in records
    )


def missing_concept_evidence_depth_ids(concepts: list[dict], records: list[dict]) -> list[str]:
    present = {record.get("concept_id") for record in records}
    return sorted(str(concept.get("id")) for concept in concepts if concept.get("id") not in present)


def concept_evidence_depth_source_ref_count(records: list[dict]) -> int:
    return sum(int(record.get("source_ref_count", 0)) for record in records)


def concept_evidence_depth_textbook_evidence_count(records: list[dict]) -> int:
    return sum(1 for record in records if record.get("has_textbook_evidence") == "yes")


def textbook_queue_unit_group_count(records: list[dict]) -> int:
    return len(
        {
            (
                record.get("grade"),
                record.get("domain"),
                record.get("unit"),
            )
            for record in records
        }
    )


def textbook_queue_needs_textbook_count(records: list[dict]) -> int:
    return sum(int(record.get("needs_textbook_evidence_count", 0)) for record in records)


def textbook_packet_missing_concepts(
    concepts: list[dict],
    packet_rows: list[dict],
    target: dict,
) -> list[str]:
    target_ids = {
        str(concept.get("id", ""))
        for concept in concepts
        if concept.get("grade") == target.get("grade")
        and concept.get("domain") == target.get("domain")
        and concept.get("unit") == target.get("unit")
    }
    present_ids = {str(row.get("concept_id", "")) for row in packet_rows}
    return sorted(target_ids - present_ids)


def textbook_packet_pending_count(records: list[dict]) -> int:
    return sum(1 for record in records if record.get("extraction_status") == "pending_textbook_pdf")


def textbook_packet_index_missing_ranks(records: list[dict], expected_ranks: list[int]) -> list[int]:
    present = {int(record.get("rank", 0)) for record in records}
    return [rank for rank in expected_ranks if rank not in present]


def textbook_packet_index_pending_count(records: list[dict]) -> int:
    return sum(int(record.get("pending_textbook_evidence_count", 0)) for record in records)


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
    term_coverage_csv = OUT_DIR / "official-term-coverage.csv"
    term_coverage_md = OUT_DIR / "official-term-coverage.md"
    unit_coverage_csv = OUT_DIR / "unit-coverage.csv"
    unit_coverage_md = OUT_DIR / "unit-coverage.md"
    relationship_audit_csv = OUT_DIR / "relationship-audit.csv"
    relationship_audit_md = OUT_DIR / "relationship-audit.md"
    source_inventory_csv = OUT_DIR / "source-inventory.csv"
    source_inventory_md = OUT_DIR / "source-inventory.md"
    source_ref_audit_csv = OUT_DIR / "source-ref-audit.csv"
    source_ref_audit_md = OUT_DIR / "source-ref-audit.md"
    concept_evidence_depth_csv = OUT_DIR / "concept-evidence-depth.csv"
    concept_evidence_depth_md = OUT_DIR / "concept-evidence-depth.md"
    textbook_extraction_queue_csv = OUT_DIR / "textbook-extraction-queue.csv"
    textbook_extraction_queue_md = OUT_DIR / "textbook-extraction-queue.md"
    textbook_evidence_packet_index_csv = textbook_evidence_packet.TEXTBOOK_EVIDENCE_PACKET_DIR / "index.csv"
    textbook_evidence_packet_index_md = textbook_evidence_packet.TEXTBOOK_EVIDENCE_PACKET_DIR / "index.md"
    graph = OUT_DIR / "graph.mmd"
    if read_csv_count(concepts_csv) != len(concepts):
        fail("concepts.csv row count does not match concepts.json")
    if read_csv_count(edges_csv) != len(edges):
        fail("edges.csv row count does not match concepts.json")
    if read_csv_count(review_queue_csv) != low_confidence_concept_count(concepts):
        fail("review-queue.csv row count does not match low-confidence concepts")
    if not review_queue_md.exists() or "# 검토 큐" not in review_queue_md.read_text(encoding="utf-8"):
        fail("review-queue.md missing or invalid")
    term_rows = read_csv_rows(term_coverage_csv)
    if len(term_rows) != len(terminology.OFFICIAL_TERMS):
        fail("official-term-coverage.csv row count does not match official term list")
    if term_needs_concept_count(term_rows):
        fail("official-term-coverage.csv contains terms needing concepts")
    if not term_coverage_md.exists() or "# 공식 용어·기호 커버리지" not in term_coverage_md.read_text(encoding="utf-8"):
        fail("official-term-coverage.md missing or invalid")
    unit_rows = read_csv_rows(unit_coverage_csv)
    if len(unit_rows) != unit_group_count(concepts):
        fail("unit-coverage.csv row count does not match concept unit groups")
    if sum(int(row.get("concept_count", 0)) for row in unit_rows) != len(concepts):
        fail("unit-coverage.csv concept counts do not sum to concepts.json")
    if not unit_coverage_md.exists() or "# 단원별 커버리지" not in unit_coverage_md.read_text(encoding="utf-8"):
        fail("unit-coverage.md missing or invalid")
    relationship_rows = read_csv_rows(relationship_audit_csv)
    if len(relationship_rows) != len(relationship_audit.RELATIONSHIP_TYPES):
        fail("relationship-audit.csv row count does not match relationship type list")
    if sum(int(row.get("edge_count", 0)) for row in relationship_rows) != len(edges):
        fail("relationship-audit.csv edge counts do not sum to concepts.json")
    missing_required_relationships = [
        row["relationship_type"]
        for row in relationship_rows
        if row["relationship_type"] in relationship_audit.REQUIRED_GOAL_RELATIONSHIP_TYPES
        and int(row.get("edge_count", 0)) == 0
    ]
    if missing_required_relationships:
        fail(f"relationship-audit.csv missing required relationship types: {missing_required_relationships}")
    if isolated_concept_count(concepts, edges):
        fail("concept map contains isolated concepts without any edge")
    if not relationship_audit_md.exists() or "# 관계 감사" not in relationship_audit_md.read_text(encoding="utf-8"):
        fail("relationship-audit.md missing or invalid")
    source_inventory_rows = read_csv_rows(source_inventory_csv)
    missing_source_groups = missing_source_inventory_groups(source_inventory_rows)
    if missing_source_groups:
        fail(f"source-inventory.csv missing source groups: {missing_source_groups}")
    invalid_source_statuses = invalid_source_inventory_statuses(source_inventory_rows)
    if invalid_source_statuses:
        fail(f"source-inventory.csv has invalid statuses: {invalid_source_statuses}")
    if not source_inventory_md.exists() or "# Source Inventory" not in source_inventory_md.read_text(encoding="utf-8"):
        fail("source-inventory.md missing or invalid")
    concept_evidence_rows = read_csv_rows(concept_evidence_depth_csv)
    if len(concept_evidence_rows) != len(concepts):
        fail("concept-evidence-depth.csv row count does not match concepts.json")
    missing_concept_evidence_ids = missing_concept_evidence_depth_ids(concepts, concept_evidence_rows)
    if missing_concept_evidence_ids:
        fail(f"concept-evidence-depth.csv missing concept ids: {missing_concept_evidence_ids}")
    if concept_evidence_depth_source_ref_count(concept_evidence_rows) != source_ref_count(concepts, []):
        fail("concept-evidence-depth.csv source_ref_count does not match concept source refs")
    expected_concept_evidence_rows = concept_evidence_depth.concept_evidence_rows(concepts)
    if len(concept_evidence_rows) != len(expected_concept_evidence_rows):
        fail("concept-evidence-depth.csv row count does not match generated concept evidence rows")
    textbook_inventory_empty = any(
        row.get("source_group") == "textbook_originals" and row.get("status") == "empty"
        for row in source_inventory_rows
    )
    if textbook_inventory_empty and concept_evidence_depth_textbook_evidence_count(concept_evidence_rows):
        fail("concept-evidence-depth.csv contains textbook evidence while textbook originals are empty")
    if not concept_evidence_depth_md.exists() or "# Concept Evidence Depth" not in concept_evidence_depth_md.read_text(encoding="utf-8"):
        fail("concept-evidence-depth.md missing or invalid")
    textbook_queue_rows = read_csv_rows(textbook_extraction_queue_csv)
    expected_textbook_queue_rows = textbook_extraction_queue.textbook_extraction_queue_rows(concept_evidence_rows)
    if len(textbook_queue_rows) != len(expected_textbook_queue_rows):
        fail("textbook-extraction-queue.csv row count does not match generated unit queue")
    if textbook_queue_unit_group_count(textbook_queue_rows) != unit_group_count(concepts):
        fail("textbook-extraction-queue.csv row count does not match concept unit groups")
    expected_needs_textbook_count = sum(
        1 for row in concept_evidence_rows if row.get("needs_textbook_evidence") == "yes"
    )
    if textbook_queue_needs_textbook_count(textbook_queue_rows) != expected_needs_textbook_count:
        fail("textbook-extraction-queue.csv needs_textbook_evidence_count does not match concept evidence depth")
    if not textbook_extraction_queue_md.exists() or "# Textbook Extraction Queue" not in textbook_extraction_queue_md.read_text(encoding="utf-8"):
        fail("textbook-extraction-queue.md missing or invalid")
    expected_packet_ranks = list(range(1, TEXTBOOK_PACKET_TOP_N + 1))
    textbook_packet_index_rows = read_csv_rows(textbook_evidence_packet_index_csv)
    if len(textbook_packet_index_rows) != TEXTBOOK_PACKET_TOP_N:
        fail("textbook evidence packet index row count does not match configured top-N")
    if list(textbook_packet_index_rows[0]) != textbook_evidence_packet.INDEX_FIELDS:
        fail("textbook evidence packet index fields do not match schema")
    missing_packet_ranks = textbook_packet_index_missing_ranks(textbook_packet_index_rows, expected_packet_ranks)
    if missing_packet_ranks:
        fail(f"textbook evidence packet index missing ranks: {missing_packet_ranks}")
    packet_pending_total = 0
    index_rows_by_rank = {int(row.get("rank", 0)): row for row in textbook_packet_index_rows}
    for rank in expected_packet_ranks:
        textbook_packet_target = textbook_evidence_packet.target_unit(textbook_queue_rows, rank=rank)
        textbook_evidence_packet_csv, textbook_evidence_packet_md = textbook_evidence_packet.packet_paths(rank)
        textbook_packet_rows = read_csv_rows(textbook_evidence_packet_csv)
        expected_textbook_packet_rows = textbook_evidence_packet.textbook_evidence_packet_rows(
            concepts,
            concept_evidence_rows,
            textbook_queue_rows,
            rank=rank,
        )
        if len(textbook_packet_rows) != len(expected_textbook_packet_rows):
            fail(f"rank-{rank:02d} textbook evidence packet row count does not match generated packet")
        if list(textbook_packet_rows[0]) != textbook_evidence_packet.CSV_FIELDS:
            fail(f"rank-{rank:02d} textbook evidence packet fields do not match schema")
        if [row.get("concept_id") for row in textbook_packet_rows] != [
            row.get("concept_id") for row in expected_textbook_packet_rows
        ]:
            fail(f"rank-{rank:02d} textbook evidence packet concept order does not match generated packet")
        missing_packet_concepts = textbook_packet_missing_concepts(
            concepts,
            textbook_packet_rows,
            textbook_packet_target,
        )
        if missing_packet_concepts:
            fail(f"rank-{rank:02d} textbook evidence packet missing concept ids: {missing_packet_concepts}")
        invalid_packet_units = [
            row.get("concept_id", "")
            for row in textbook_packet_rows
            if row.get("grade") != textbook_packet_target.get("grade")
            or row.get("domain") != textbook_packet_target.get("domain")
            or row.get("unit") != textbook_packet_target.get("unit")
        ]
        if invalid_packet_units:
            fail(f"rank-{rank:02d} textbook evidence packet has rows outside target unit: {invalid_packet_units}")
        pending_count = textbook_packet_pending_count(textbook_packet_rows)
        packet_pending_total += pending_count
        if textbook_inventory_empty and pending_count != len(textbook_packet_rows):
            fail(f"rank-{rank:02d} textbook evidence packet must remain pending while textbook originals are empty")
        index_row = index_rows_by_rank[rank]
        if int(index_row.get("concept_count", 0)) != len(textbook_packet_rows):
            fail(f"rank-{rank:02d} textbook evidence packet index concept_count is inconsistent")
        if int(index_row.get("pending_textbook_evidence_count", 0)) != pending_count:
            fail(f"rank-{rank:02d} textbook evidence packet index pending count is inconsistent")
        if index_row.get("packet_csv") != textbook_evidence_packet_csv.name:
            fail(f"rank-{rank:02d} textbook evidence packet index csv path is inconsistent")
        if index_row.get("packet_md") != textbook_evidence_packet_md.name:
            fail(f"rank-{rank:02d} textbook evidence packet index markdown path is inconsistent")
        if not textbook_evidence_packet_md.exists() or "# Textbook Evidence Packet" not in textbook_evidence_packet_md.read_text(encoding="utf-8"):
            fail(f"rank-{rank:02d} textbook evidence packet markdown missing or invalid")
    if textbook_packet_index_pending_count(textbook_packet_index_rows) != packet_pending_total:
        fail("textbook evidence packet index pending total does not match packet rows")
    if not textbook_evidence_packet_index_md.exists() or "# Textbook Evidence Packet Index" not in textbook_evidence_packet_index_md.read_text(encoding="utf-8"):
        fail("textbook evidence packet index markdown missing or invalid")
    source_ref_rows = read_csv_rows(source_ref_audit_csv)
    if len(source_ref_rows) != len(source_ref_audit.source_ref_summary_rows(concepts, edges)):
        fail("source-ref-audit.csv row count does not match generated source reference groups")
    if sum(int(row.get("source_ref_count", 0)) for row in source_ref_rows) != source_ref_count(concepts, edges):
        fail("source-ref-audit.csv source_ref_count does not match concepts.json")
    if source_ref_audit_missing_detail_count(source_ref_rows):
        fail("source-ref-audit.csv contains source refs missing locator or summary")
    if not source_ref_audit_md.exists() or "# Source Reference Audit" not in source_ref_audit_md.read_text(encoding="utf-8"):
        fail("source-ref-audit.md missing or invalid")
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
