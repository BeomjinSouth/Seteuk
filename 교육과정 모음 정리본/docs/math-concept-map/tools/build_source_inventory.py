from __future__ import annotations

import csv
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
SOURCE_INVENTORY_CSV = OUT_DIR / "source-inventory.csv"
SOURCE_INVENTORY_MD = OUT_DIR / "source-inventory.md"

CSV_FIELDS = [
    "source_group",
    "title",
    "path",
    "file_count",
    "pdf_count",
    "json_count",
    "status",
    "use_for_concept_map",
    "notes",
]

SOURCE_SPECS = [
    {
        "source_group": "curriculum_pdf",
        "title": "2022 개정 수학과 교육과정 [별책8]",
        "relative_path": Path("2022_개정_중학교_교육과정_PDF") / "교과" / "02_[별책8] 수학과 교육과정.pdf",
        "expected_extensions": (".pdf",),
        "use_for_concept_map": "primary official curriculum evidence",
        "available_note": "Official curriculum PDF is available and is the primary source for achievement standards and official terminology.",
        "empty_note": "Expected curriculum PDF path exists but no PDF file was counted.",
        "missing_note": "Official curriculum PDF is missing from the expected path.",
    },
    {
        "source_group": "achievement_pdf",
        "title": "2022 개정 중학교 수학 성취수준",
        "relative_path": Path("2022_개정_중학교_성취수준_PDF") / "성취수준" / "02_수학_성취수준.pdf",
        "expected_extensions": (".pdf",),
        "use_for_concept_map": "official performance-level and evidence-detail support",
        "available_note": "Official achievement-level PDF is available and supports finer evidence notes.",
        "empty_note": "Expected achievement-level PDF path exists but no PDF file was counted.",
        "missing_note": "Official achievement-level PDF is missing from the expected path.",
    },
    {
        "source_group": "unit_summary_json",
        "title": "수학 단원 정리 JSON",
        "relative_path": Path("교육과정_단원_정리") / "교과별_JSON" / "02_수학_단원_정리.json",
        "expected_extensions": (".json",),
        "use_for_concept_map": "helper unit grouping and source cross-check",
        "available_note": "Unit summary JSON is available as a helper source, not as a replacement for official PDFs.",
        "empty_note": "Expected unit summary JSON path exists but no JSON file was counted.",
        "missing_note": "Unit summary JSON is missing from the expected path.",
    },
    {
        "source_group": "textbook_originals",
        "title": "교과서 원본",
        "relative_path": Path("교과서_원본"),
        "expected_extensions": (".pdf",),
        "use_for_concept_map": "textbook table-of-contents and body evidence after PDFs are added",
        "available_note": "Textbook PDF originals are present and can be used for textbook-grounded concept refinement.",
        "empty_note": "No textbook PDFs are present yet; textbook body, examples, summaries, and problem evidence remain unavailable.",
        "missing_note": "Textbook originals folder is missing.",
    },
]


def iter_files(path: Path) -> list[Path]:
    if path.is_file():
        return [path]
    if path.is_dir():
        return sorted(item for item in path.rglob("*") if item.is_file())
    return []


def count_files(path: Path) -> dict[str, int]:
    files = iter_files(path)
    return {
        "file_count": len(files),
        "pdf_count": sum(1 for item in files if item.suffix.lower() == ".pdf"),
        "json_count": sum(1 for item in files if item.suffix.lower() == ".json"),
    }


def status_for(path: Path, counts: dict[str, int], expected_extensions: Iterable[str]) -> str:
    if not path.exists():
        return "missing"

    expected = {extension.lower() for extension in expected_extensions}
    if ".pdf" in expected and counts["pdf_count"] == 0:
        return "empty"
    if ".json" in expected and counts["json_count"] == 0:
        return "empty"
    if counts["file_count"] == 0:
        return "empty"
    return "available"


def note_for(spec: dict, status: str) -> str:
    return str(spec.get(f"{status}_note", ""))


def build_inventory_rows(root: Path = ROOT, specs: Iterable[dict] = SOURCE_SPECS) -> list[dict]:
    rows: list[dict] = []
    for spec in specs:
        relative_path = Path(spec["relative_path"])
        absolute_path = root / relative_path
        counts = count_files(absolute_path)
        status = status_for(absolute_path, counts, spec["expected_extensions"])
        rows.append(
            {
                "source_group": spec["source_group"],
                "title": spec["title"],
                "path": relative_path.as_posix(),
                "file_count": counts["file_count"],
                "pdf_count": counts["pdf_count"],
                "json_count": counts["json_count"],
                "status": status,
                "use_for_concept_map": spec["use_for_concept_map"],
                "notes": note_for(spec, status),
            }
        )
    return rows


def render_markdown(rows: list[dict]) -> str:
    status_counts: dict[str, int] = {}
    for row in rows:
        status = str(row["status"])
        status_counts[status] = status_counts.get(status, 0) + 1

    lines = [
        "# Source Inventory",
        "",
        "This generated inventory records which local source files are available for the math concept map.",
        "",
        "## Summary",
        "",
    ]
    for status in ["available", "empty", "missing"]:
        lines.append(f"- {status}: {status_counts.get(status, 0)}")

    lines.extend(
        [
            "",
            "## Inventory",
            "",
            "| source_group | title | status | files | PDFs | JSON | path | use |",
            "|---|---|---:|---:|---:|---:|---|---|",
        ]
    )

    for row in rows:
        lines.append(
            "| {source_group} | {title} | {status} | {file_count} | {pdf_count} | "
            "{json_count} | `{path}` | {use_for_concept_map} |".format(**row)
        )

    lines.extend(["", "## Notes", ""])
    for row in rows:
        lines.append(f"- `{row['source_group']}`: {row['notes']}")

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = SOURCE_INVENTORY_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    rows = build_inventory_rows()
    write_csv(rows)
    SOURCE_INVENTORY_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(f"Wrote {len(rows)} source inventory rows to {SOURCE_INVENTORY_CSV} and {SOURCE_INVENTORY_MD}.")


if __name__ == "__main__":
    main()
