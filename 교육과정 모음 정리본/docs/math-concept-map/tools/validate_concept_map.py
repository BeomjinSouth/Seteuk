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
import build_edge_evidence_depth as edge_evidence_depth
import build_textbook_extraction_queue as textbook_extraction_queue
import build_textbook_evidence_packet as textbook_evidence_packet
import build_textbook_edge_evidence_packet as textbook_edge_evidence_packet
import build_textbook_evidence_workplan as textbook_evidence_workplan
import build_textbook_source_audit as textbook_source_audit
import build_pilot_unit_map as pilot_unit_map
import build_equivalence_alias_audit as equivalence_alias_audit
import build_research_report_concept_signal as research_report_concept_signal
import build_research_report_context_packet as research_report_context_packet
import build_research_report_source_review as research_report_source_review
import build_legacy_gap_audit as legacy_gap_audit
import build_legacy_gap_resolution as legacy_gap_resolution
import build_legacy_gap_integration_plan as legacy_gap_integration_plan
import build_legacy_gap_source_review as legacy_gap_source_review
import build_legacy_gap_evidence_scan as legacy_gap_evidence_scan
import build_prerequisite_map as prerequisite_map
import build_node_edge_consistency_audit as node_edge_consistency
import build_related_edge_resolution_queue as related_edge_resolution_queue


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


def csv_fieldnames(path: Path) -> list[str]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        return list(reader.fieldnames or [])


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


def missing_edge_evidence_depth_ids(edges: list[dict], records: list[dict]) -> list[str]:
    present = {record.get("edge_id") for record in records}
    return sorted(str(edge.get("id")) for edge in edges if edge.get("id") not in present)


def edge_evidence_depth_source_ref_count(records: list[dict]) -> int:
    return sum(int(record.get("source_ref_count", 0)) for record in records)


def edge_evidence_depth_textbook_evidence_count(records: list[dict]) -> int:
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


def textbook_packet_expected_ranks(queue_rows: list[dict]) -> list[int]:
    return sorted(int(row.get("rank", 0)) for row in queue_rows)


def textbook_packet_index_pending_count(records: list[dict]) -> int:
    return sum(int(record.get("pending_textbook_evidence_count", 0)) for record in records)


def textbook_workplan_missing_ranks(records: list[dict], expected_ranks: list[int]) -> list[int]:
    present = {int(record.get("rank", 0)) for record in records}
    return [rank for rank in expected_ranks if rank not in present]


def textbook_workplan_pending_count(records: list[dict]) -> int:
    return sum(int(record.get("total_pending_evidence_count", 0)) for record in records)


def unit_map_packet_missing_ranks(records: list[dict], expected_ranks: list[int]) -> list[int]:
    present = {int(record.get("rank", 0)) for record in records}
    return [rank for rank in expected_ranks if rank not in present]


def unit_map_packet_index_total(records: list[dict], field: str) -> int:
    return sum(int(record.get(field, 0)) for record in records)


def equivalence_alias_audit_record_type_count(records: list[dict], record_type: str) -> int:
    return sum(1 for record in records if record.get("record_type") == record_type)


def equivalence_alias_audit_record_key(row: dict) -> str:
    return f"{row.get('record_type', '')}:{row.get('record_id', '')}"


def missing_equivalence_alias_audit_record_ids(
    expected_rows: list[dict],
    actual_rows: list[dict],
) -> list[str]:
    actual_keys = {equivalence_alias_audit_record_key(row) for row in actual_rows}
    return [
        equivalence_alias_audit_record_key(row)
        for row in expected_rows
        if equivalence_alias_audit_record_key(row) not in actual_keys
    ]


def research_report_signal_action_count(records: list[dict], action: str) -> int:
    return sum(1 for record in records if record.get("recommended_action") == action)


def missing_research_report_signal_concept_ids(
    expected_rows: list[dict],
    actual_rows: list[dict],
) -> list[str]:
    present = {record.get("concept_id") for record in actual_rows}
    return sorted(str(row.get("concept_id")) for row in expected_rows if row.get("concept_id") not in present)


def research_report_context_packet_review_status_count(records: list[dict], status: str) -> int:
    return sum(1 for record in records if record.get("review_status") == status)


def research_report_context_packet_key(record: dict) -> str:
    return f"{record.get('concept_id', '')}:{record.get('page_number', '')}:{record.get('matched_term', '')}"


def missing_research_report_context_packet_keys(
    expected_rows: list[dict],
    actual_rows: list[dict],
) -> list[str]:
    actual_keys = {research_report_context_packet_key(row) for row in actual_rows}
    return [
        research_report_context_packet_key(row)
        for row in expected_rows
        if research_report_context_packet_key(row) not in actual_keys
    ]


def research_report_source_review_action_count(records: list[dict], action: str) -> int:
    return sum(1 for record in records if record.get("source_ref_action") == action)


def research_report_source_review_has_source_ref_work(records: list[dict]) -> bool:
    source_ref_actions = {"candidate_add_after_manual_review", "applied_to_concepts_json"}
    return any(record.get("source_ref_action") in source_ref_actions for record in records)


def research_report_source_review_key(record: dict) -> str:
    return f"{record.get('context_packet_rank', '')}:{record.get('concept_id', '')}:{record.get('page_number', '')}"


def missing_research_report_source_review_keys(
    expected_rows: list[dict],
    actual_rows: list[dict],
) -> list[str]:
    actual_keys = {research_report_source_review_key(row) for row in actual_rows}
    return [
        research_report_source_review_key(row)
        for row in expected_rows
        if research_report_source_review_key(row) not in actual_keys
    ]


def textbook_source_audit_not_ready_count(records: list[dict]) -> int:
    return sum(1 for record in records if record.get("intake_status") != "ready_for_textbook_extraction")


def legacy_gap_needs_review_count(records: list[dict]) -> int:
    return sum(1 for record in records if record.get("coverage_status") == "needs_review")


def duplicate_legacy_gap_ids(records: list[dict]) -> list[str]:
    ids = [str(record.get("legacy_id", "")) for record in records]
    return sorted({legacy_id for legacy_id in ids if ids.count(legacy_id) > 1})


def duplicate_legacy_resolution_labels(records: list[dict]) -> list[str]:
    labels = [str(record.get("candidate_label", "")) for record in records]
    return sorted({label for label in labels if labels.count(label) > 1})


def legacy_resolution_candidate_count(records: list[dict]) -> int:
    return len(records)


def duplicate_legacy_integration_labels(records: list[dict]) -> list[str]:
    labels = [str(record.get("candidate_label", "")) for record in records]
    return sorted({label for label in labels if labels.count(label) > 1})


def legacy_integration_candidate_count(records: list[dict]) -> int:
    return len(records)


def duplicate_legacy_source_review_labels(records: list[dict]) -> list[str]:
    labels = [str(record.get("candidate_label", "")) for record in records]
    return sorted({label for label in labels if labels.count(label) > 1})


def legacy_source_review_candidate_count(records: list[dict]) -> int:
    return len(records)


def duplicate_legacy_evidence_scan_labels(records: list[dict]) -> list[str]:
    labels = [str(record.get("candidate_label", "")) for record in records]
    return sorted({label for label in labels if labels.count(label) > 1})


def legacy_evidence_scan_candidate_count(records: list[dict]) -> int:
    return len(records)


def prerequisite_edge_count(edges: list[dict]) -> int:
    return sum(1 for edge in edges if edge.get("relationship_type") == "prerequisite_for")


def missing_prerequisite_map_edge_ids(edges: list[dict], rows: list[dict]) -> list[str]:
    expected = {
        str(edge.get("id", ""))
        for edge in edges
        if edge.get("relationship_type") == "prerequisite_for"
    }
    present = {str(row.get("edge_id", "")) for row in rows}
    return sorted(expected - present)


def prerequisite_unit_graph_edge_line_count(dot_text: str) -> int:
    return sum(1 for line in dot_text.splitlines() if " -> " in line)


def prerequisite_unit_graph_has_required_content(dot_text: str) -> bool:
    return (
        "digraph prerequisite_unit_graph" in dot_text
        and 'rankdir="LR"' in dot_text
        and prerequisite_unit_graph_edge_line_count(dot_text) > 0
    )


def node_edge_consistency_issue_key(record: dict) -> tuple[str, str, str, str, str]:
    return (
        str(record.get("issue_type", "")),
        str(record.get("node_id", "")),
        str(record.get("array_field", "")),
        str(record.get("related_id", "")),
        str(record.get("expected_relationship_type", "")),
    )


def missing_node_edge_consistency_issue_keys(
    expected_rows: list[dict],
    actual_rows: list[dict],
) -> list[tuple[str, str, str, str, str]]:
    actual_keys = {node_edge_consistency_issue_key(row) for row in actual_rows}
    return [
        node_edge_consistency_issue_key(row)
        for row in expected_rows
        if node_edge_consistency_issue_key(row) not in actual_keys
    ]


def related_edge_resolution_queue_key(record: dict) -> tuple[str, str, str, str]:
    return (
        str(record.get("node_id", "")),
        str(record.get("related_id", "")),
        str(record.get("candidate_relationship_types", "")),
        str(record.get("next_action", "")),
    )


def missing_related_edge_resolution_queue_keys(
    expected_rows: list[dict],
    actual_rows: list[dict],
) -> list[tuple[str, str, str, str]]:
    actual_keys = {related_edge_resolution_queue_key(row) for row in actual_rows}
    return [
        related_edge_resolution_queue_key(row)
        for row in expected_rows
        if related_edge_resolution_queue_key(row) not in actual_keys
    ]


def csv_rows_for_fields(rows: list[dict], fields: list[str]) -> list[dict]:
    return [
        {field: str(row.get(field, "")) for field in fields}
        for row in rows
    ]


def pilot_unit_map_missing_ids(expected_rows: list[dict], actual_rows: list[dict], id_field: str) -> list[str]:
    actual_ids = {str(row.get(id_field, "")) for row in actual_rows}
    return [
        str(row.get(id_field, ""))
        for row in expected_rows
        if str(row.get(id_field, "")) not in actual_ids
    ]


def pilot_unit_map_value_count(rows: list[dict], field: str, value: str) -> int:
    return sum(1 for row in rows if row.get(field) == value)


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
    prerequisite_map_csv = OUT_DIR / "prerequisite-map.csv"
    prerequisite_map_md = OUT_DIR / "prerequisite-map.md"
    prerequisite_unit_graph_dot = prerequisite_map.PREREQUISITE_UNIT_GRAPH_DOT
    node_edge_consistency_csv = node_edge_consistency.NODE_EDGE_CONSISTENCY_CSV
    node_edge_consistency_md = node_edge_consistency.NODE_EDGE_CONSISTENCY_MD
    related_edge_resolution_csv = related_edge_resolution_queue.RELATED_EDGE_RESOLUTION_QUEUE_CSV
    related_edge_resolution_md = related_edge_resolution_queue.RELATED_EDGE_RESOLUTION_QUEUE_MD
    source_inventory_csv = OUT_DIR / "source-inventory.csv"
    source_inventory_md = OUT_DIR / "source-inventory.md"
    textbook_source_audit_csv = textbook_source_audit.TEXTBOOK_SOURCE_AUDIT_CSV
    textbook_source_audit_md = textbook_source_audit.TEXTBOOK_SOURCE_AUDIT_MD
    source_ref_audit_csv = OUT_DIR / "source-ref-audit.csv"
    source_ref_audit_md = OUT_DIR / "source-ref-audit.md"
    concept_evidence_depth_csv = OUT_DIR / "concept-evidence-depth.csv"
    concept_evidence_depth_md = OUT_DIR / "concept-evidence-depth.md"
    edge_evidence_depth_csv = edge_evidence_depth.EDGE_EVIDENCE_DEPTH_CSV
    edge_evidence_depth_md = edge_evidence_depth.EDGE_EVIDENCE_DEPTH_MD
    textbook_extraction_queue_csv = OUT_DIR / "textbook-extraction-queue.csv"
    textbook_extraction_queue_md = OUT_DIR / "textbook-extraction-queue.md"
    textbook_evidence_packet_index_csv = textbook_evidence_packet.TEXTBOOK_EVIDENCE_PACKET_DIR / "index.csv"
    textbook_evidence_packet_index_md = textbook_evidence_packet.TEXTBOOK_EVIDENCE_PACKET_DIR / "index.md"
    textbook_edge_evidence_packet_index_csv = textbook_edge_evidence_packet.TEXTBOOK_EDGE_EVIDENCE_PACKET_DIR / "index.csv"
    textbook_edge_evidence_packet_index_md = textbook_edge_evidence_packet.TEXTBOOK_EDGE_EVIDENCE_PACKET_DIR / "index.md"
    textbook_evidence_workplan_csv = textbook_evidence_workplan.TEXTBOOK_EVIDENCE_WORKPLAN_CSV
    textbook_evidence_workplan_md = textbook_evidence_workplan.TEXTBOOK_EVIDENCE_WORKPLAN_MD
    pilot_unit_map_md = pilot_unit_map.PILOT_UNIT_MAP_MD
    pilot_unit_map_nodes_csv = pilot_unit_map.PILOT_UNIT_MAP_NODES_CSV
    pilot_unit_map_edges_csv = pilot_unit_map.PILOT_UNIT_MAP_EDGES_CSV
    pilot_unit_map_dot = pilot_unit_map.PILOT_UNIT_MAP_DOT
    unit_map_packet_dir = pilot_unit_map.UNIT_MAP_PACKET_DIR
    unit_map_packet_index_csv = unit_map_packet_dir / "index.csv"
    unit_map_packet_index_md = unit_map_packet_dir / "index.md"
    equivalence_alias_audit_csv = equivalence_alias_audit.EQUIVALENCE_ALIAS_AUDIT_CSV
    equivalence_alias_audit_md = equivalence_alias_audit.EQUIVALENCE_ALIAS_AUDIT_MD
    research_report_signal_csv = research_report_concept_signal.RESEARCH_REPORT_SIGNAL_CSV
    research_report_signal_md = research_report_concept_signal.RESEARCH_REPORT_SIGNAL_MD
    research_report_context_packet_csv = research_report_context_packet.RESEARCH_REPORT_CONTEXT_PACKET_CSV
    research_report_context_packet_md = research_report_context_packet.RESEARCH_REPORT_CONTEXT_PACKET_MD
    research_report_source_review_csv = research_report_source_review.RESEARCH_REPORT_SOURCE_REVIEW_CSV
    research_report_source_review_md = research_report_source_review.RESEARCH_REPORT_SOURCE_REVIEW_MD
    legacy_gap_audit_csv = OUT_DIR / "legacy-gap-audit.csv"
    legacy_gap_audit_md = OUT_DIR / "legacy-gap-audit.md"
    legacy_gap_resolution_csv = OUT_DIR / "legacy-gap-resolution.csv"
    legacy_gap_resolution_md = OUT_DIR / "legacy-gap-resolution.md"
    legacy_gap_integration_plan_csv = OUT_DIR / "legacy-gap-integration-plan.csv"
    legacy_gap_integration_plan_md = OUT_DIR / "legacy-gap-integration-plan.md"
    legacy_gap_source_review_csv = OUT_DIR / "legacy-gap-source-review.csv"
    legacy_gap_source_review_md = OUT_DIR / "legacy-gap-source-review.md"
    legacy_gap_evidence_scan_csv = OUT_DIR / "legacy-gap-evidence-scan.csv"
    legacy_gap_evidence_scan_md = OUT_DIR / "legacy-gap-evidence-scan.md"
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
    if not equivalence_alias_audit_csv.exists():
        fail("equivalence-alias-audit.csv missing")
    equivalence_alias_rows = read_csv_rows(equivalence_alias_audit_csv)
    expected_equivalence_alias_rows = equivalence_alias_audit.equivalence_alias_audit_rows(
        concepts,
        edges,
        term_rows,
    )
    expected_equivalence_alias_csv_rows = csv_rows_for_fields(
        expected_equivalence_alias_rows,
        equivalence_alias_audit.CSV_FIELDS,
    )
    if equivalence_alias_rows and list(equivalence_alias_rows[0]) != equivalence_alias_audit.CSV_FIELDS:
        fail("equivalence-alias-audit.csv fields do not match schema")
    if len(equivalence_alias_rows) != len(expected_equivalence_alias_rows):
        fail("equivalence-alias-audit.csv row count does not match generated audit")
    missing_equivalence_alias_ids = missing_equivalence_alias_audit_record_ids(
        expected_equivalence_alias_rows,
        equivalence_alias_rows,
    )
    if missing_equivalence_alias_ids:
        fail(f"equivalence-alias-audit.csv missing record ids: {missing_equivalence_alias_ids}")
    if equivalence_alias_rows != expected_equivalence_alias_csv_rows:
        fail("equivalence-alias-audit.csv rows do not match generated audit")
    if equivalence_alias_audit_record_type_count(equivalence_alias_rows, "concept_alias") != sum(
        1 for concept in concepts if concept.get("aliases")
    ):
        fail("equivalence-alias-audit.csv concept_alias count does not match concepts with aliases")
    if equivalence_alias_audit_record_type_count(equivalence_alias_rows, "equivalent_edge") != sum(
        1 for edge in edges if edge.get("relationship_type") == "equivalent_to"
    ):
        fail("equivalence-alias-audit.csv equivalent_edge count does not match equivalent_to edges")
    if not equivalence_alias_audit_md.exists() or "# Equivalence Alias Audit" not in equivalence_alias_audit_md.read_text(encoding="utf-8"):
        fail("equivalence-alias-audit.md missing or invalid")
    if not research_report_signal_csv.exists():
        fail("research-report-concept-signal.csv missing")
    research_signal_rows = read_csv_rows(research_report_signal_csv)
    research_report_page_texts = research_report_concept_signal.extract_page_texts()
    expected_research_signal_rows = research_report_concept_signal.research_report_signal_rows(
        concepts,
        research_report_page_texts,
    )
    expected_research_signal_csv_rows = csv_rows_for_fields(
        expected_research_signal_rows,
        research_report_concept_signal.CSV_FIELDS,
    )
    if research_signal_rows and list(research_signal_rows[0]) != research_report_concept_signal.CSV_FIELDS:
        fail("research-report-concept-signal.csv fields do not match schema")
    if len(research_signal_rows) != len(expected_research_signal_rows):
        fail("research-report-concept-signal.csv row count does not match generated signal")
    missing_research_signal_ids = missing_research_report_signal_concept_ids(
        expected_research_signal_rows,
        research_signal_rows,
    )
    if missing_research_signal_ids:
        fail(f"research-report-concept-signal.csv missing concept ids: {missing_research_signal_ids}")
    if research_signal_rows != expected_research_signal_csv_rows:
        fail("research-report-concept-signal.csv rows do not match generated signal")
    if research_report_signal_action_count(
        research_signal_rows,
        "inspect_research_report_context_before_confidence_change",
    ) == 0:
        fail("research-report-concept-signal.csv has no low-confidence inspection candidates")
    if not research_report_signal_md.exists() or "# Research Report Concept Signal" not in research_report_signal_md.read_text(encoding="utf-8"):
        fail("research-report-concept-signal.md missing or invalid")
    if not research_report_context_packet_csv.exists():
        fail("research-report-context-packet.csv missing")
    research_context_packet_rows = read_csv_rows(research_report_context_packet_csv)
    expected_research_context_packet_rows = research_report_context_packet.research_report_context_packet_rows(
        research_signal_rows,
        research_report_page_texts,
    )
    expected_research_context_packet_csv_rows = csv_rows_for_fields(
        expected_research_context_packet_rows,
        research_report_context_packet.CSV_FIELDS,
    )
    if research_context_packet_rows and list(research_context_packet_rows[0]) != research_report_context_packet.CSV_FIELDS:
        fail("research-report-context-packet.csv fields do not match schema")
    if len(research_context_packet_rows) != len(expected_research_context_packet_rows):
        fail("research-report-context-packet.csv row count does not match generated context packet")
    missing_research_context_keys = missing_research_report_context_packet_keys(
        expected_research_context_packet_rows,
        research_context_packet_rows,
    )
    if missing_research_context_keys:
        fail(f"research-report-context-packet.csv missing context keys: {missing_research_context_keys}")
    if research_context_packet_rows != expected_research_context_packet_csv_rows:
        fail("research-report-context-packet.csv rows do not match generated context packet")
    if research_report_context_packet_review_status_count(
        research_context_packet_rows,
        "pending_context_review",
    ) != len(research_context_packet_rows):
        fail("research-report-context-packet.csv contains non-pending review statuses")
    if any(row.get("source_ref_upgrade_allowed") != "no" for row in research_context_packet_rows):
        fail("research-report-context-packet.csv allows source_ref upgrades without review")
    if not research_report_context_packet_md.exists() or "# Research Report Context Packet" not in research_report_context_packet_md.read_text(encoding="utf-8"):
        fail("research-report-context-packet.md missing or invalid")
    if not research_report_source_review_csv.exists():
        fail("research-report-source-review.csv missing")
    research_source_review_rows = read_csv_rows(research_report_source_review_csv)
    expected_research_source_review_rows = research_report_source_review.research_report_source_review_rows(
        research_context_packet_rows,
    )
    expected_research_source_review_csv_rows = csv_rows_for_fields(
        expected_research_source_review_rows,
        research_report_source_review.CSV_FIELDS,
    )
    if research_source_review_rows and list(research_source_review_rows[0]) != research_report_source_review.CSV_FIELDS:
        fail("research-report-source-review.csv fields do not match schema")
    if len(research_source_review_rows) != len(expected_research_source_review_rows):
        fail("research-report-source-review.csv row count does not match generated source review")
    missing_research_source_review_keys = missing_research_report_source_review_keys(
        expected_research_source_review_rows,
        research_source_review_rows,
    )
    if missing_research_source_review_keys:
        fail(f"research-report-source-review.csv missing review keys: {missing_research_source_review_keys}")
    if research_source_review_rows != expected_research_source_review_csv_rows:
        fail("research-report-source-review.csv rows do not match generated source review")
    if not research_report_source_review_has_source_ref_work(research_source_review_rows):
        fail("research-report-source-review.csv has no source-ref review candidates or applied refs")
    if any(row.get("source_ref_upgrade_allowed") != "no" for row in research_source_review_rows):
        fail("research-report-source-review.csv allows source_ref upgrades without review")
    if not research_report_source_review_md.exists() or "# Research Report Source Review" not in research_report_source_review_md.read_text(encoding="utf-8"):
        fail("research-report-source-review.md missing or invalid")
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
    prerequisite_map_rows = read_csv_rows(prerequisite_map_csv)
    expected_prerequisite_map_rows = prerequisite_map.prerequisite_rows(concepts, edges)
    if len(prerequisite_map_rows) != len(expected_prerequisite_map_rows):
        fail("prerequisite-map.csv row count does not match generated prerequisite edges")
    if len(prerequisite_map_rows) != prerequisite_edge_count(edges):
        fail("prerequisite-map.csv row count does not match prerequisite_for edge count")
    if prerequisite_map_rows and list(prerequisite_map_rows[0]) != prerequisite_map.CSV_FIELDS:
        fail("prerequisite-map.csv fields do not match schema")
    missing_prerequisite_edge_ids = missing_prerequisite_map_edge_ids(edges, prerequisite_map_rows)
    if missing_prerequisite_edge_ids:
        fail(f"prerequisite-map.csv missing edge ids: {missing_prerequisite_edge_ids}")
    if [row.get("edge_id") for row in prerequisite_map_rows] != [
        row.get("edge_id") for row in expected_prerequisite_map_rows
    ]:
        fail("prerequisite-map.csv edge order does not match generated prerequisite map")
    if not prerequisite_map_md.exists() or "# 선수 관계 지도" not in prerequisite_map_md.read_text(encoding="utf-8"):
        fail("prerequisite-map.md missing or invalid")
    if not prerequisite_unit_graph_dot.exists():
        fail("prerequisite-unit-graph.dot missing")
    prerequisite_unit_graph_text = prerequisite_unit_graph_dot.read_text(encoding="utf-8")
    if not prerequisite_unit_graph_has_required_content(prerequisite_unit_graph_text):
        fail("prerequisite-unit-graph.dot missing required graph content")
    expected_unit_transition_count = len(prerequisite_map.unit_transition_rows(expected_prerequisite_map_rows))
    if prerequisite_unit_graph_edge_line_count(prerequisite_unit_graph_text) != expected_unit_transition_count:
        fail("prerequisite-unit-graph.dot edge count does not match prerequisite unit transitions")
    node_edge_consistency_rows = read_csv_rows(node_edge_consistency_csv)
    expected_node_edge_consistency_rows = node_edge_consistency.consistency_issue_rows(concepts, edges)
    if len(node_edge_consistency_rows) != len(expected_node_edge_consistency_rows):
        fail("node-edge-consistency-audit.csv row count does not match generated consistency audit")
    if node_edge_consistency_rows and list(node_edge_consistency_rows[0]) != node_edge_consistency.CSV_FIELDS:
        fail("node-edge-consistency-audit.csv fields do not match schema")
    missing_node_edge_issue_keys = missing_node_edge_consistency_issue_keys(
        expected_node_edge_consistency_rows,
        node_edge_consistency_rows,
    )
    if missing_node_edge_issue_keys:
        fail(f"node-edge-consistency-audit.csv missing issue keys: {missing_node_edge_issue_keys}")
    if [node_edge_consistency_issue_key(row) for row in node_edge_consistency_rows] != [
        node_edge_consistency_issue_key(row) for row in expected_node_edge_consistency_rows
    ]:
        fail("node-edge-consistency-audit.csv issue order does not match generated consistency audit")
    if not node_edge_consistency_md.exists() or "# Node Edge Consistency Audit" not in node_edge_consistency_md.read_text(encoding="utf-8"):
        fail("node-edge-consistency-audit.md missing or invalid")
    related_edge_resolution_rows = read_csv_rows(related_edge_resolution_csv)
    expected_related_edge_resolution_rows = related_edge_resolution_queue.related_edge_resolution_rows(
        concepts,
        expected_node_edge_consistency_rows,
    )
    if len(related_edge_resolution_rows) != len(expected_related_edge_resolution_rows):
        fail("related-edge-resolution-queue.csv row count does not match generated related edge queue")
    if related_edge_resolution_rows and list(related_edge_resolution_rows[0]) != related_edge_resolution_queue.CSV_FIELDS:
        fail("related-edge-resolution-queue.csv fields do not match schema")
    missing_related_edge_keys = missing_related_edge_resolution_queue_keys(
        expected_related_edge_resolution_rows,
        related_edge_resolution_rows,
    )
    if missing_related_edge_keys:
        fail(f"related-edge-resolution-queue.csv missing queue keys: {missing_related_edge_keys}")
    if [related_edge_resolution_queue_key(row) for row in related_edge_resolution_rows] != [
        related_edge_resolution_queue_key(row) for row in expected_related_edge_resolution_rows
    ]:
        fail("related-edge-resolution-queue.csv row order does not match generated related edge queue")
    if not related_edge_resolution_md.exists() or "# Related Edge Resolution Queue" not in related_edge_resolution_md.read_text(encoding="utf-8"):
        fail("related-edge-resolution-queue.md missing or invalid")
    source_inventory_rows = read_csv_rows(source_inventory_csv)
    missing_source_groups = missing_source_inventory_groups(source_inventory_rows)
    if missing_source_groups:
        fail(f"source-inventory.csv missing source groups: {missing_source_groups}")
    invalid_source_statuses = invalid_source_inventory_statuses(source_inventory_rows)
    if invalid_source_statuses:
        fail(f"source-inventory.csv has invalid statuses: {invalid_source_statuses}")
    if not source_inventory_md.exists() or "# Source Inventory" not in source_inventory_md.read_text(encoding="utf-8"):
        fail("source-inventory.md missing or invalid")
    textbook_inventory_row = next(
        (row for row in source_inventory_rows if row.get("source_group") == "textbook_originals"),
        {},
    )
    textbook_inventory_empty = textbook_inventory_row.get("status") == "empty"
    if not textbook_source_audit_csv.exists():
        fail("textbook-source-audit.csv missing")
    textbook_source_audit_rows = read_csv_rows(textbook_source_audit_csv)
    expected_textbook_source_audit_rows = textbook_source_audit.textbook_source_audit_rows()
    expected_textbook_source_audit_csv_rows = [
        {field: str(row.get(field, "")) for field in textbook_source_audit.CSV_FIELDS}
        for row in expected_textbook_source_audit_rows
    ]
    if csv_fieldnames(textbook_source_audit_csv) != textbook_source_audit.CSV_FIELDS:
        fail("textbook-source-audit.csv fields do not match schema")
    if len(textbook_source_audit_rows) != int(textbook_inventory_row.get("pdf_count", 0)):
        fail("textbook-source-audit.csv row count does not match textbook PDF count")
    if textbook_source_audit_rows != expected_textbook_source_audit_csv_rows:
        fail("textbook-source-audit.csv rows do not match generated textbook source audit")
    if textbook_inventory_empty and textbook_source_audit_rows:
        fail("textbook-source-audit.csv contains rows while textbook originals are empty")
    if not textbook_inventory_empty and textbook_source_audit_not_ready_count(textbook_source_audit_rows):
        fail("textbook-source-audit.csv contains textbook PDFs that are not ready for extraction")
    if not textbook_source_audit_md.exists() or "# Textbook Source Audit" not in textbook_source_audit_md.read_text(encoding="utf-8"):
        fail("textbook-source-audit.md missing or invalid")
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
    if textbook_inventory_empty and concept_evidence_depth_textbook_evidence_count(concept_evidence_rows):
        fail("concept-evidence-depth.csv contains textbook evidence while textbook originals are empty")
    if not concept_evidence_depth_md.exists() or "# Concept Evidence Depth" not in concept_evidence_depth_md.read_text(encoding="utf-8"):
        fail("concept-evidence-depth.md missing or invalid")
    edge_evidence_rows = read_csv_rows(edge_evidence_depth_csv)
    if len(edge_evidence_rows) != len(edges):
        fail("edge-evidence-depth.csv row count does not match concepts.json")
    missing_edge_evidence_ids = missing_edge_evidence_depth_ids(edges, edge_evidence_rows)
    if missing_edge_evidence_ids:
        fail(f"edge-evidence-depth.csv missing edge ids: {missing_edge_evidence_ids}")
    if edge_evidence_depth_source_ref_count(edge_evidence_rows) != source_ref_count([], edges):
        fail("edge-evidence-depth.csv source_ref_count does not match edge source refs")
    expected_edge_evidence_rows = edge_evidence_depth.edge_evidence_rows(concepts, edges)
    if len(edge_evidence_rows) != len(expected_edge_evidence_rows):
        fail("edge-evidence-depth.csv row count does not match generated edge evidence rows")
    if edge_evidence_rows and list(edge_evidence_rows[0]) != edge_evidence_depth.CSV_FIELDS:
        fail("edge-evidence-depth.csv fields do not match schema")
    if [row.get("edge_id") for row in edge_evidence_rows] != [
        row.get("edge_id") for row in expected_edge_evidence_rows
    ]:
        fail("edge-evidence-depth.csv edge order does not match generated edge evidence rows")
    if textbook_inventory_empty and edge_evidence_depth_textbook_evidence_count(edge_evidence_rows):
        fail("edge-evidence-depth.csv contains textbook evidence while textbook originals are empty")
    if not edge_evidence_depth_md.exists() or "# Edge Evidence Depth" not in edge_evidence_depth_md.read_text(encoding="utf-8"):
        fail("edge-evidence-depth.md missing or invalid")
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
    expected_packet_ranks = textbook_packet_expected_ranks(textbook_queue_rows)
    textbook_packet_index_rows = read_csv_rows(textbook_evidence_packet_index_csv)
    if len(textbook_packet_index_rows) != len(expected_packet_ranks):
        fail("textbook evidence packet index row count does not match textbook extraction queue")
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
    edge_csv_rows = read_csv_rows(edges_csv)
    textbook_edge_packet_index_rows = read_csv_rows(textbook_edge_evidence_packet_index_csv)
    if len(textbook_edge_packet_index_rows) != len(expected_packet_ranks):
        fail("textbook edge evidence packet index row count does not match textbook extraction queue")
    if list(textbook_edge_packet_index_rows[0]) != textbook_edge_evidence_packet.INDEX_FIELDS:
        fail("textbook edge evidence packet index fields do not match schema")
    missing_edge_packet_ranks = textbook_packet_index_missing_ranks(textbook_edge_packet_index_rows, expected_packet_ranks)
    if missing_edge_packet_ranks:
        fail(f"textbook edge evidence packet index missing ranks: {missing_edge_packet_ranks}")
    edge_packet_pending_total = 0
    edge_index_rows_by_rank = {int(row.get("rank", 0)): row for row in textbook_edge_packet_index_rows}
    for rank in expected_packet_ranks:
        textbook_edge_packet_csv, textbook_edge_packet_md = textbook_edge_evidence_packet.packet_paths(rank)
        textbook_edge_packet_rows = read_csv_rows(textbook_edge_packet_csv)
        expected_textbook_edge_packet_rows = textbook_edge_evidence_packet.textbook_edge_evidence_packet_rows(
            concepts,
            edge_csv_rows,
            textbook_queue_rows,
            rank=rank,
        )
        if len(textbook_edge_packet_rows) != len(expected_textbook_edge_packet_rows):
            fail(f"rank-{rank:02d} textbook edge evidence packet row count does not match generated packet")
        if textbook_edge_packet_rows and list(textbook_edge_packet_rows[0]) != textbook_edge_evidence_packet.CSV_FIELDS:
            fail(f"rank-{rank:02d} textbook edge evidence packet fields do not match schema")
        if [row.get("edge_id") for row in textbook_edge_packet_rows] != [
            row.get("edge_id") for row in expected_textbook_edge_packet_rows
        ]:
            fail(f"rank-{rank:02d} textbook edge evidence packet edge order does not match generated packet")
        edge_pending_count = textbook_packet_pending_count(textbook_edge_packet_rows)
        edge_packet_pending_total += edge_pending_count
        if textbook_inventory_empty and edge_pending_count != len(textbook_edge_packet_rows):
            fail(f"rank-{rank:02d} textbook edge evidence packet must remain pending while textbook originals are empty")
        edge_index_row = edge_index_rows_by_rank[rank]
        if int(edge_index_row.get("edge_count", 0)) != len(textbook_edge_packet_rows):
            fail(f"rank-{rank:02d} textbook edge evidence packet index edge_count is inconsistent")
        if int(edge_index_row.get("intra_unit_edge_count", 0)) != sum(
            1 for row in textbook_edge_packet_rows if row.get("edge_scope") == "intra_unit"
        ):
            fail(f"rank-{rank:02d} textbook edge evidence packet index intra-unit count is inconsistent")
        if int(edge_index_row.get("cross_unit_edge_count", 0)) != sum(
            1 for row in textbook_edge_packet_rows if row.get("edge_scope") == "cross_unit"
        ):
            fail(f"rank-{rank:02d} textbook edge evidence packet index cross-unit count is inconsistent")
        if int(edge_index_row.get("low_confidence_count", 0)) != sum(
            1 for row in textbook_edge_packet_rows if row.get("confidence") == "low"
        ):
            fail(f"rank-{rank:02d} textbook edge evidence packet index low-confidence count is inconsistent")
        if edge_index_row.get("packet_csv") != textbook_edge_packet_csv.name:
            fail(f"rank-{rank:02d} textbook edge evidence packet index csv path is inconsistent")
        if edge_index_row.get("packet_md") != textbook_edge_packet_md.name:
            fail(f"rank-{rank:02d} textbook edge evidence packet index markdown path is inconsistent")
        if not textbook_edge_packet_md.exists() or "# Textbook Edge Evidence Packet" not in textbook_edge_packet_md.read_text(encoding="utf-8"):
            fail(f"rank-{rank:02d} textbook edge evidence packet markdown missing or invalid")
    if sum(int(row.get("edge_count", 0)) for row in textbook_edge_packet_index_rows) != sum(
        read_csv_count(textbook_edge_evidence_packet.packet_paths(rank)[0])
        for rank in expected_packet_ranks
    ):
        fail("textbook edge evidence packet index edge total does not match packet rows")
    if textbook_inventory_empty and edge_packet_pending_total != sum(
        read_csv_count(textbook_edge_evidence_packet.packet_paths(rank)[0])
        for rank in expected_packet_ranks
    ):
        fail("textbook edge evidence packet pending total does not match packet rows")
    if not textbook_edge_evidence_packet_index_md.exists() or "# Textbook Edge Evidence Packet Index" not in textbook_edge_evidence_packet_index_md.read_text(encoding="utf-8"):
        fail("textbook edge evidence packet index markdown missing or invalid")
    if not textbook_evidence_workplan_csv.exists():
        fail("textbook-evidence-workplan.csv missing")
    textbook_workplan_rows = read_csv_rows(textbook_evidence_workplan_csv)
    expected_textbook_workplan_rows = textbook_evidence_workplan.textbook_evidence_workplan_rows(
        textbook_packet_index_rows,
        textbook_edge_packet_index_rows,
        edge_packet_rows_by_rank=textbook_evidence_workplan.edge_packet_rows_by_rank(textbook_edge_packet_index_rows),
    )
    expected_textbook_workplan_csv_rows = [
        {field: str(row.get(field, "")) for field in textbook_evidence_workplan.CSV_FIELDS}
        for row in expected_textbook_workplan_rows
    ]
    if len(textbook_workplan_rows) != len(expected_packet_ranks):
        fail("textbook-evidence-workplan.csv row count does not match textbook extraction queue")
    if textbook_workplan_rows and list(textbook_workplan_rows[0]) != textbook_evidence_workplan.CSV_FIELDS:
        fail("textbook-evidence-workplan.csv fields do not match schema")
    missing_workplan_ranks = textbook_workplan_missing_ranks(textbook_workplan_rows, expected_packet_ranks)
    if missing_workplan_ranks:
        fail(f"textbook-evidence-workplan.csv missing ranks: {missing_workplan_ranks}")
    if textbook_workplan_rows != expected_textbook_workplan_csv_rows:
        fail("textbook-evidence-workplan.csv rows do not match generated workplan")
    if textbook_workplan_pending_count(textbook_workplan_rows) != packet_pending_total + edge_packet_pending_total:
        fail("textbook-evidence-workplan.csv pending total does not match concept and edge packet rows")
    if not textbook_evidence_workplan_md.exists() or "# Textbook Evidence Workplan" not in textbook_evidence_workplan_md.read_text(encoding="utf-8"):
        fail("textbook-evidence-workplan.md missing or invalid")
    if not pilot_unit_map_nodes_csv.exists():
        fail("pilot-unit-map-nodes.csv missing")
    if not pilot_unit_map_edges_csv.exists():
        fail("pilot-unit-map-edges.csv missing")
    pilot_target = pilot_unit_map.target_unit(textbook_workplan_rows, rank=1)
    pilot_node_rows = read_csv_rows(pilot_unit_map_nodes_csv)
    pilot_edge_rows = read_csv_rows(pilot_unit_map_edges_csv)
    expected_pilot_node_rows = pilot_unit_map.pilot_unit_node_rows(
        concepts,
        concept_evidence_rows,
        pilot_target,
    )
    expected_pilot_edge_rows = pilot_unit_map.pilot_unit_edge_rows(
        concepts,
        edges,
        edge_evidence_rows,
        pilot_target,
    )
    if pilot_node_rows and list(pilot_node_rows[0]) != pilot_unit_map.NODE_CSV_FIELDS:
        fail("pilot-unit-map-nodes.csv fields do not match schema")
    if pilot_edge_rows and list(pilot_edge_rows[0]) != pilot_unit_map.EDGE_CSV_FIELDS:
        fail("pilot-unit-map-edges.csv fields do not match schema")
    if len(pilot_node_rows) != int(pilot_target.get("concept_count", 0)):
        fail("pilot-unit-map-nodes.csv row count does not match workplan concept_count")
    if len(pilot_edge_rows) != int(pilot_target.get("edge_count", 0)):
        fail("pilot-unit-map-edges.csv row count does not match workplan edge_count")
    missing_pilot_node_ids = pilot_unit_map_missing_ids(
        expected_pilot_node_rows,
        pilot_node_rows,
        "concept_id",
    )
    if missing_pilot_node_ids:
        fail(f"pilot-unit-map-nodes.csv missing concept ids: {missing_pilot_node_ids}")
    missing_pilot_edge_ids = pilot_unit_map_missing_ids(
        expected_pilot_edge_rows,
        pilot_edge_rows,
        "edge_id",
    )
    if missing_pilot_edge_ids:
        fail(f"pilot-unit-map-edges.csv missing edge ids: {missing_pilot_edge_ids}")
    if pilot_node_rows != csv_rows_for_fields(expected_pilot_node_rows, pilot_unit_map.NODE_CSV_FIELDS):
        fail("pilot-unit-map-nodes.csv rows do not match generated pilot unit map")
    if pilot_edge_rows != csv_rows_for_fields(expected_pilot_edge_rows, pilot_unit_map.EDGE_CSV_FIELDS):
        fail("pilot-unit-map-edges.csv rows do not match generated pilot unit map")
    if pilot_unit_map_value_count(pilot_node_rows, "confidence", "low") != int(pilot_target.get("low_confidence_concept_count", 0)):
        fail("pilot-unit-map-nodes.csv low confidence count does not match workplan")
    if pilot_unit_map_value_count(pilot_edge_rows, "confidence", "low") != int(pilot_target.get("low_confidence_edge_count", 0)):
        fail("pilot-unit-map-edges.csv low confidence count does not match workplan")
    if pilot_unit_map_value_count(pilot_edge_rows, "edge_scope", "cross_unit") != int(pilot_target.get("cross_unit_edge_count", 0)):
        fail("pilot-unit-map-edges.csv cross-unit count does not match workplan")
    if not pilot_unit_map_md.exists() or "# Pilot Unit Map" not in pilot_unit_map_md.read_text(encoding="utf-8"):
        fail("pilot-unit-map.md missing or invalid")
    if not pilot_unit_map_dot.exists() or "digraph pilot_unit_map" not in pilot_unit_map_dot.read_text(encoding="utf-8"):
        fail("pilot-unit-map.dot missing or invalid")
    if not unit_map_packet_index_csv.exists():
        fail("unit-map-packets/index.csv missing")
    unit_map_index_rows = read_csv_rows(unit_map_packet_index_csv)
    expected_unit_map_ranks = sorted(int(row.get("rank", 0)) for row in textbook_workplan_rows)
    if len(unit_map_index_rows) != len(textbook_workplan_rows):
        fail("unit-map-packets/index.csv row count does not match textbook evidence workplan")
    if unit_map_index_rows and list(unit_map_index_rows[0]) != pilot_unit_map.INDEX_CSV_FIELDS:
        fail("unit-map-packets/index.csv fields do not match schema")
    missing_unit_map_ranks = unit_map_packet_missing_ranks(unit_map_index_rows, expected_unit_map_ranks)
    if missing_unit_map_ranks:
        fail(f"unit-map-packets/index.csv missing ranks: {missing_unit_map_ranks}")
    expected_unit_map_packets = pilot_unit_map.unit_map_packet_set(
        concepts,
        edges,
        concept_evidence_rows,
        edge_evidence_rows,
        textbook_workplan_rows,
    )
    expected_unit_map_index_rows = csv_rows_for_fields(
        pilot_unit_map.unit_map_index_rows(expected_unit_map_packets),
        pilot_unit_map.INDEX_CSV_FIELDS,
    )
    if unit_map_index_rows != expected_unit_map_index_rows:
        fail("unit-map-packets/index.csv rows do not match generated unit map packet index")
    if unit_map_packet_index_total(unit_map_index_rows, "concept_count") != len(concepts):
        fail("unit-map-packets/index.csv concept total does not match concepts.json")
    expected_edge_packet_rows_total = sum(int(row.get("edge_count", 0)) for row in textbook_workplan_rows)
    if unit_map_packet_index_total(unit_map_index_rows, "edge_count") != expected_edge_packet_rows_total:
        fail("unit-map-packets/index.csv edge total does not match workplan edge total")
    if not unit_map_packet_index_md.exists() or "# Unit Map Packet Index" not in unit_map_packet_index_md.read_text(encoding="utf-8"):
        fail("unit-map-packets/index.md missing or invalid")
    for packet in expected_unit_map_packets:
        rank = int(packet["rank"])
        paths = pilot_unit_map.unit_map_packet_paths(rank)
        for key, path in paths.items():
            if not path.exists():
                fail(f"rank-{rank:02d} unit map packet {key} missing")
        unit_map_node_rows = read_csv_rows(paths["node_csv"])
        unit_map_edge_rows = read_csv_rows(paths["edge_csv"])
        expected_node_rows = csv_rows_for_fields(packet["node_rows"], pilot_unit_map.NODE_CSV_FIELDS)
        expected_edge_rows = csv_rows_for_fields(packet["edge_rows"], pilot_unit_map.EDGE_CSV_FIELDS)
        if unit_map_node_rows and list(unit_map_node_rows[0]) != pilot_unit_map.NODE_CSV_FIELDS:
            fail(f"rank-{rank:02d} unit map node csv fields do not match schema")
        if unit_map_edge_rows and list(unit_map_edge_rows[0]) != pilot_unit_map.EDGE_CSV_FIELDS:
            fail(f"rank-{rank:02d} unit map edge csv fields do not match schema")
        if unit_map_node_rows != expected_node_rows:
            fail(f"rank-{rank:02d} unit map node rows do not match generated packet")
        if unit_map_edge_rows != expected_edge_rows:
            fail(f"rank-{rank:02d} unit map edge rows do not match generated packet")
        if "# Pilot Unit Map" not in paths["map_md"].read_text(encoding="utf-8"):
            fail(f"rank-{rank:02d} unit map markdown missing or invalid")
        if "digraph pilot_unit_map" not in paths["map_dot"].read_text(encoding="utf-8"):
            fail(f"rank-{rank:02d} unit map dot missing or invalid")
    legacy_gap_rows = read_csv_rows(legacy_gap_audit_csv)
    expected_legacy_gap_rows = legacy_gap_audit.legacy_gap_rows(
        legacy_gap_audit.read_legacy_data(),
        concepts,
    )
    if len(legacy_gap_rows) != len(expected_legacy_gap_rows):
        fail("legacy-gap-audit.csv row count does not match generated legacy candidates")
    if legacy_gap_rows and list(legacy_gap_rows[0]) != legacy_gap_audit.CSV_FIELDS:
        fail("legacy-gap-audit.csv fields do not match schema")
    duplicate_legacy_ids = duplicate_legacy_gap_ids(legacy_gap_rows)
    if duplicate_legacy_ids:
        fail(f"legacy-gap-audit.csv contains duplicate legacy ids: {duplicate_legacy_ids}")
    if [row.get("legacy_id") for row in legacy_gap_rows] != [
        row.get("legacy_id") for row in expected_legacy_gap_rows
    ]:
        fail("legacy-gap-audit.csv legacy id order does not match generated audit")
    if legacy_gap_needs_review_count(legacy_gap_rows) != legacy_gap_needs_review_count(expected_legacy_gap_rows):
        fail("legacy-gap-audit.csv needs_review count does not match generated audit")
    if not legacy_gap_audit_md.exists() or "# Legacy Gap Audit" not in legacy_gap_audit_md.read_text(encoding="utf-8"):
        fail("legacy-gap-audit.md missing or invalid")
    legacy_resolution_rows = read_csv_rows(legacy_gap_resolution_csv)
    expected_legacy_resolution_rows = legacy_gap_resolution.legacy_gap_resolution_rows(
        legacy_gap_rows,
        concepts,
    )
    if len(legacy_resolution_rows) != len(expected_legacy_resolution_rows):
        fail("legacy-gap-resolution.csv row count does not match generated unique candidates")
    if legacy_resolution_rows and list(legacy_resolution_rows[0]) != legacy_gap_resolution.CSV_FIELDS:
        fail("legacy-gap-resolution.csv fields do not match schema")
    duplicate_resolution_labels = duplicate_legacy_resolution_labels(legacy_resolution_rows)
    if duplicate_resolution_labels:
        fail(f"legacy-gap-resolution.csv contains duplicate candidate labels: {duplicate_resolution_labels}")
    if [row.get("candidate_label") for row in legacy_resolution_rows] != [
        row.get("candidate_label") for row in expected_legacy_resolution_rows
    ]:
        fail("legacy-gap-resolution.csv candidate order does not match generated resolution audit")
    if legacy_resolution_candidate_count(legacy_resolution_rows) != len(
        {
            legacy_gap_audit.normalize_label(row.get("legacy_label_ko", ""))
            for row in legacy_gap_rows
            if row.get("coverage_status") == "needs_review"
        }
    ):
        fail("legacy-gap-resolution.csv candidate count does not match unique needs_review labels")
    if not legacy_gap_resolution_md.exists() or "# Legacy Gap Resolution" not in legacy_gap_resolution_md.read_text(encoding="utf-8"):
        fail("legacy-gap-resolution.md missing or invalid")
    legacy_integration_rows = read_csv_rows(legacy_gap_integration_plan_csv)
    expected_legacy_integration_rows = legacy_gap_integration_plan.integration_plan_rows(legacy_resolution_rows)
    if len(legacy_integration_rows) != len(expected_legacy_integration_rows):
        fail("legacy-gap-integration-plan.csv row count does not match generated integration plan")
    if legacy_integration_rows and list(legacy_integration_rows[0]) != legacy_gap_integration_plan.CSV_FIELDS:
        fail("legacy-gap-integration-plan.csv fields do not match schema")
    duplicate_integration_labels = duplicate_legacy_integration_labels(legacy_integration_rows)
    if duplicate_integration_labels:
        fail(f"legacy-gap-integration-plan.csv contains duplicate candidate labels: {duplicate_integration_labels}")
    if [row.get("candidate_label") for row in legacy_integration_rows] != [
        row.get("candidate_label") for row in expected_legacy_integration_rows
    ]:
        fail("legacy-gap-integration-plan.csv candidate order does not match generated integration plan")
    if legacy_integration_candidate_count(legacy_integration_rows) != len(legacy_resolution_rows):
        fail("legacy-gap-integration-plan.csv candidate count does not match legacy-gap-resolution.csv")
    if not legacy_gap_integration_plan_md.exists() or "# Legacy Gap Integration Plan" not in legacy_gap_integration_plan_md.read_text(encoding="utf-8"):
        fail("legacy-gap-integration-plan.md missing or invalid")
    legacy_source_review_rows = read_csv_rows(legacy_gap_source_review_csv)
    expected_legacy_source_review_rows = legacy_gap_source_review.source_review_rows(legacy_integration_rows, concepts)
    if len(legacy_source_review_rows) != len(expected_legacy_source_review_rows):
        fail("legacy-gap-source-review.csv row count does not match generated source review")
    if legacy_source_review_rows and list(legacy_source_review_rows[0]) != legacy_gap_source_review.CSV_FIELDS:
        fail("legacy-gap-source-review.csv fields do not match schema")
    duplicate_source_review_labels = duplicate_legacy_source_review_labels(legacy_source_review_rows)
    if duplicate_source_review_labels:
        fail(f"legacy-gap-source-review.csv contains duplicate candidate labels: {duplicate_source_review_labels}")
    if [row.get("candidate_label") for row in legacy_source_review_rows] != [
        row.get("candidate_label") for row in expected_legacy_source_review_rows
    ]:
        fail("legacy-gap-source-review.csv candidate order does not match generated source review")
    if legacy_source_review_candidate_count(legacy_source_review_rows) != len(legacy_integration_rows):
        fail("legacy-gap-source-review.csv candidate count does not match legacy-gap-integration-plan.csv")
    if not legacy_gap_source_review_md.exists() or "# Legacy Gap Source Review" not in legacy_gap_source_review_md.read_text(encoding="utf-8"):
        fail("legacy-gap-source-review.md missing or invalid")
    legacy_evidence_scan_rows = read_csv_rows(legacy_gap_evidence_scan_csv)
    expected_legacy_evidence_scan_rows = legacy_gap_evidence_scan.evidence_scan_rows(legacy_source_review_rows)
    if len(legacy_evidence_scan_rows) != len(expected_legacy_evidence_scan_rows):
        fail("legacy-gap-evidence-scan.csv row count does not match generated evidence scan")
    if legacy_evidence_scan_rows and list(legacy_evidence_scan_rows[0]) != legacy_gap_evidence_scan.CSV_FIELDS:
        fail("legacy-gap-evidence-scan.csv fields do not match schema")
    duplicate_evidence_scan_labels = duplicate_legacy_evidence_scan_labels(legacy_evidence_scan_rows)
    if duplicate_evidence_scan_labels:
        fail(f"legacy-gap-evidence-scan.csv contains duplicate candidate labels: {duplicate_evidence_scan_labels}")
    if [row.get("candidate_label") for row in legacy_evidence_scan_rows] != [
        row.get("candidate_label") for row in expected_legacy_evidence_scan_rows
    ]:
        fail("legacy-gap-evidence-scan.csv candidate order does not match generated evidence scan")
    if legacy_evidence_scan_candidate_count(legacy_evidence_scan_rows) != len(legacy_source_review_rows):
        fail("legacy-gap-evidence-scan.csv candidate count does not match legacy-gap-source-review.csv")
    if not legacy_gap_evidence_scan_md.exists() or "# Legacy Gap Evidence Scan" not in legacy_gap_evidence_scan_md.read_text(encoding="utf-8"):
        fail("legacy-gap-evidence-scan.md missing or invalid")
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
