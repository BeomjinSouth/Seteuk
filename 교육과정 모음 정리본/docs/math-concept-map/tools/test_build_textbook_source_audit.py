from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_textbook_source_audit as audit


class BuildTextbookSourceAuditTests(unittest.TestCase):
    def test_empty_textbook_folder_has_no_rows_and_waiting_markdown(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            textbook_dir = root / "교과서_원본"
            textbook_dir.mkdir()
            (textbook_dir / "README.md").write_text("placeholder", encoding="utf-8")

            rows = audit.textbook_source_audit_rows(root=root)
            markdown = audit.render_markdown(rows)

        self.assertEqual(rows, [])
        self.assertIn("# Textbook Source Audit", markdown)
        self.assertIn("textbook PDF files: 0", markdown)
        self.assertIn("waiting_for_textbook_pdf", markdown)

    def test_valid_pdf_with_manifest_is_ready_for_extraction(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            textbook_dir = root / "교과서_원본"
            textbook_dir.mkdir()
            pdf_path = textbook_dir / "2022_중1_미래엔_교과서_1학기.pdf"
            pdf_path.write_bytes(b"%PDF-1.7\nvalid textbook bytes\n")
            sha256 = audit.sha256_file(pdf_path)
            manifest_path = textbook_dir / "TEXTBOOK_SOURCE_MANIFEST.csv"
            with manifest_path.open("w", encoding="utf-8-sig", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=audit.MANIFEST_FIELDS)
                writer.writeheader()
                writer.writerow(
                    {
                        "relative_path": "교과서_원본/2022_중1_미래엔_교과서_1학기.pdf",
                        "source_url": "https://example.invalid/textbook",
                        "attachment_id": "att-001",
                        "expected_sha256": sha256,
                        "license_note": "official review copy",
                        "downloaded_at": "2026-06-27",
                    }
                )

            rows = audit.textbook_source_audit_rows(root=root)

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["file_name"], "2022_중1_미래엔_교과서_1학기.pdf")
        self.assertEqual(rows[0]["pdf_header_valid"], "yes")
        self.assertEqual(rows[0]["filename_parse_status"], "ok")
        self.assertEqual(rows[0]["curriculum"], "2022")
        self.assertEqual(rows[0]["grade"], "중1")
        self.assertEqual(rows[0]["publisher"], "미래엔")
        self.assertEqual(rows[0]["book_type"], "교과서")
        self.assertEqual(rows[0]["volume"], "1학기")
        self.assertEqual(rows[0]["manifest_status"], "matched")
        self.assertEqual(rows[0]["intake_status"], "ready_for_textbook_extraction")

    def test_invalid_pdf_and_missing_manifest_are_flagged(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            textbook_dir = root / "교과서_원본"
            textbook_dir.mkdir()
            bad_path = textbook_dir / "badname.pdf"
            bad_path.write_bytes(b"not a pdf\n")

            rows = audit.textbook_source_audit_rows(root=root)

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["pdf_header_valid"], "no")
        self.assertEqual(rows[0]["filename_parse_status"], "invalid")
        self.assertEqual(rows[0]["manifest_status"], "missing_manifest")
        self.assertEqual(rows[0]["intake_status"], "invalid_pdf_header")

    def test_write_csv_uses_stable_columns_even_when_empty(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = Path(temp_dir) / "textbook-source-audit.csv"
            audit.write_csv([], csv_path)

            with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
                reader = csv.DictReader(f)
                fieldnames = reader.fieldnames

        self.assertEqual(fieldnames, audit.CSV_FIELDS)


if __name__ == "__main__":
    unittest.main()
