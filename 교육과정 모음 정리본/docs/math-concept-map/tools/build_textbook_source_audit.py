from __future__ import annotations

import csv
import hashlib
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "docs" / "math-concept-map"
TEXTBOOK_DIR = ROOT / "교과서_원본"
TEXTBOOK_SOURCE_MANIFEST = TEXTBOOK_DIR / "TEXTBOOK_SOURCE_MANIFEST.csv"
TEXTBOOK_SOURCE_AUDIT_CSV = OUT_DIR / "textbook-source-audit.csv"
TEXTBOOK_SOURCE_AUDIT_MD = OUT_DIR / "textbook-source-audit.md"

CSV_FIELDS = [
    "file_name",
    "relative_path",
    "file_size_bytes",
    "sha256",
    "pdf_header_valid",
    "filename_parse_status",
    "curriculum",
    "grade",
    "publisher",
    "book_type",
    "volume",
    "manifest_status",
    "source_url",
    "attachment_id",
    "expected_sha256",
    "intake_status",
    "notes",
]

MANIFEST_FIELDS = [
    "relative_path",
    "source_url",
    "attachment_id",
    "expected_sha256",
    "license_note",
    "downloaded_at",
]

BOOK_TYPES = {"교과서", "익힘책", "지도서"}


def iter_textbook_pdfs(textbook_dir: Path) -> list[Path]:
    if not textbook_dir.exists():
        return []
    return sorted(path for path in textbook_dir.rglob("*.pdf") if path.is_file())


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def has_pdf_header(path: Path) -> bool:
    with path.open("rb") as f:
        return f.read(5) == b"%PDF-"


def parse_textbook_filename(path: Path) -> dict:
    parts = path.stem.split("_")
    if len(parts) < 5:
        return {
            "filename_parse_status": "invalid",
            "curriculum": "",
            "grade": "",
            "publisher": "",
            "book_type": "",
            "volume": "",
            "notes": "Filename should follow 교육과정_학년_출판사_책종_권.pdf.",
        }

    curriculum = parts[0]
    grade = parts[1]
    publisher = "_".join(parts[2:-2])
    book_type = parts[-2]
    volume = parts[-1]
    if not curriculum or not grade or not publisher or book_type not in BOOK_TYPES or not volume:
        return {
            "filename_parse_status": "invalid",
            "curriculum": curriculum,
            "grade": grade,
            "publisher": publisher,
            "book_type": book_type,
            "volume": volume,
            "notes": "Filename fields are incomplete or book_type is unsupported.",
        }

    return {
        "filename_parse_status": "ok",
        "curriculum": curriculum,
        "grade": grade,
        "publisher": publisher,
        "book_type": book_type,
        "volume": volume,
        "notes": "",
    }


def read_manifest_rows(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def manifest_rows_by_path(rows: Iterable[dict]) -> dict[str, dict]:
    by_path: dict[str, dict] = {}
    for row in rows:
        relative_path = str(row.get("relative_path", "")).strip().replace("\\", "/")
        if relative_path:
            by_path[relative_path] = row
    return by_path


def manifest_status(manifest_row: dict | None, sha256: str) -> str:
    if manifest_row is None:
        return "missing_manifest"
    if not str(manifest_row.get("source_url", "")).strip() or not str(manifest_row.get("attachment_id", "")).strip():
        return "missing_source_metadata"
    expected_sha256 = str(manifest_row.get("expected_sha256", "")).strip().lower()
    if not expected_sha256:
        return "missing_expected_sha256"
    if expected_sha256 != sha256.lower():
        return "hash_mismatch"
    return "matched"


def intake_status(pdf_header_valid: bool, filename_parse_status: str, manifest_status_value: str) -> str:
    if not pdf_header_valid:
        return "invalid_pdf_header"
    if filename_parse_status != "ok":
        return "invalid_filename"
    if manifest_status_value != "matched":
        return "needs_manifest_metadata"
    return "ready_for_textbook_extraction"


def textbook_source_audit_rows(
    root: Path = ROOT,
    textbook_dir: Path | None = None,
    manifest_path: Path | None = None,
) -> list[dict]:
    actual_textbook_dir = textbook_dir or (root / "교과서_원본")
    actual_manifest_path = manifest_path or (actual_textbook_dir / "TEXTBOOK_SOURCE_MANIFEST.csv")
    manifest_lookup = manifest_rows_by_path(read_manifest_rows(actual_manifest_path))
    rows: list[dict] = []

    for pdf_path in iter_textbook_pdfs(actual_textbook_dir):
        relative_path = pdf_path.relative_to(root).as_posix()
        sha256 = sha256_file(pdf_path)
        parsed = parse_textbook_filename(pdf_path)
        manifest_row = manifest_lookup.get(relative_path)
        manifest_status_value = manifest_status(manifest_row, sha256)
        header_valid = has_pdf_header(pdf_path)
        notes = "; ".join(
            note
            for note in [
                parsed.get("notes", ""),
                "" if header_valid else "File does not start with a valid PDF header.",
                "" if manifest_status_value == "matched" else "Manifest source URL, attachment id, and expected hash must be recorded before extraction.",
            ]
            if note
        )
        rows.append(
            {
                "file_name": pdf_path.name,
                "relative_path": relative_path,
                "file_size_bytes": pdf_path.stat().st_size,
                "sha256": sha256,
                "pdf_header_valid": "yes" if header_valid else "no",
                "filename_parse_status": parsed["filename_parse_status"],
                "curriculum": parsed["curriculum"],
                "grade": parsed["grade"],
                "publisher": parsed["publisher"],
                "book_type": parsed["book_type"],
                "volume": parsed["volume"],
                "manifest_status": manifest_status_value,
                "source_url": (manifest_row or {}).get("source_url", ""),
                "attachment_id": (manifest_row or {}).get("attachment_id", ""),
                "expected_sha256": (manifest_row or {}).get("expected_sha256", ""),
                "intake_status": intake_status(header_valid, parsed["filename_parse_status"], manifest_status_value),
                "notes": notes,
            }
        )

    return rows


def render_markdown(rows: list[dict]) -> str:
    status_counts: dict[str, int] = {}
    for row in rows:
        status = str(row["intake_status"])
        status_counts[status] = status_counts.get(status, 0) + 1

    lines = [
        "# Textbook Source Audit",
        "",
        "This generated audit checks textbook PDF intake readiness before page-level concept extraction.",
        "",
        "## Summary",
        "",
        f"- textbook PDF files: {len(rows)}",
    ]
    if not rows:
        lines.append("- waiting_for_textbook_pdf: 1")
    for status in sorted(status_counts):
        lines.append(f"- {status}: {status_counts[status]}")

    lines.extend(
        [
            "",
            "## Source Requirements",
            "",
            "- Keep textbook PDFs unchanged.",
            "- Record source URL, attachment id, file size, and SHA-256 hash before extraction.",
            "- Use page references only; do not copy full textbook text into concept-map artifacts.",
            "",
            "## Files",
            "",
            "| file | header | filename | manifest | intake | size | sha256 |",
            "|---|---|---|---|---|---:|---|",
        ]
    )

    for row in rows:
        lines.append(
            "| {file_name} | {pdf_header_valid} | {filename_parse_status} | {manifest_status} | "
            "{intake_status} | {file_size_bytes} | `{sha256}` |".format(**row)
        )

    lines.append("")
    return "\n".join(lines)


def write_csv(rows: list[dict], path: Path = TEXTBOOK_SOURCE_AUDIT_CSV) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    rows = textbook_source_audit_rows()
    write_csv(rows)
    TEXTBOOK_SOURCE_AUDIT_MD.write_text(render_markdown(rows), encoding="utf-8")
    print(f"Wrote textbook source audit for {len(rows)} PDFs to {TEXTBOOK_SOURCE_AUDIT_CSV} and {TEXTBOOK_SOURCE_AUDIT_MD}.")


if __name__ == "__main__":
    main()
