from __future__ import annotations

import csv
import tempfile
import unittest
from pathlib import Path

import build_source_inventory as inventory


class BuildSourceInventoryTests(unittest.TestCase):
    def test_inventory_rows_mark_official_sources_available_and_empty_textbook_folder(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "2022_개정_중학교_교육과정_PDF" / "교과").mkdir(parents=True)
            (root / "2022_개정_중학교_교육과정_PDF" / "교과" / "02_[별책8] 수학과 교육과정.pdf").write_bytes(b"%PDF-1.7\n")
            (root / "2022_개정_중학교_성취수준_PDF" / "성취수준").mkdir(parents=True)
            (root / "2022_개정_중학교_성취수준_PDF" / "성취수준" / "02_수학_성취수준.pdf").write_bytes(b"%PDF-1.7\n")
            (root / "2022_개정_중학교_성취수준_PDF" / "연구보고서").mkdir(parents=True)
            (
                root
                / "2022_개정_중학교_성취수준_PDF"
                / "연구보고서"
                / "02_수학_성취수준_개발_연구보고서.pdf"
            ).write_bytes(b"%PDF-1.7\n")
            (root / "교육과정_단원_정리" / "교과별_JSON").mkdir(parents=True)
            (root / "교육과정_단원_정리" / "교과별_JSON" / "02_수학_단원_정리.json").write_text("{}", encoding="utf-8")
            (root / "교과서_원본").mkdir()
            (root / "교과서_원본" / "README.md").write_text("placeholder", encoding="utf-8")

            rows = inventory.build_inventory_rows(root)
            by_group = {row["source_group"]: row for row in rows}

            self.assertEqual(by_group["curriculum_pdf"]["status"], "available")
            self.assertEqual(by_group["curriculum_pdf"]["pdf_count"], 1)
            self.assertEqual(by_group["achievement_pdf"]["status"], "available")
            self.assertEqual(by_group["achievement_research_report_pdf"]["status"], "available")
            self.assertEqual(by_group["achievement_research_report_pdf"]["pdf_count"], 1)
            self.assertEqual(by_group["unit_summary_json"]["json_count"], 1)
            self.assertEqual(by_group["textbook_originals"]["status"], "empty")
            self.assertEqual(by_group["textbook_originals"]["pdf_count"], 0)

    def test_markdown_summarizes_empty_textbook_originals(self) -> None:
        rows = [
            {
                "source_group": "curriculum_pdf",
                "title": "2022 개정 수학과 교육과정",
                "path": "2022_개정_중학교_교육과정_PDF/교과/02_[별책8] 수학과 교육과정.pdf",
                "file_count": 1,
                "pdf_count": 1,
                "json_count": 0,
                "status": "available",
                "use_for_concept_map": "primary official curriculum evidence",
                "notes": "Official curriculum PDF is available.",
            },
            {
                "source_group": "textbook_originals",
                "title": "교과서 원본",
                "path": "교과서_원본",
                "file_count": 1,
                "pdf_count": 0,
                "json_count": 0,
                "status": "empty",
                "use_for_concept_map": "textbook body evidence after PDFs are added",
                "notes": "No textbook PDFs are present yet.",
            },
        ]

        markdown = inventory.render_markdown(rows)

        self.assertIn("# Source Inventory", markdown)
        self.assertIn("교과서 원본", markdown)
        self.assertIn("empty", markdown)
        self.assertIn("curriculum_pdf", markdown)

    def test_write_csv_uses_stable_columns(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "source-inventory.csv"
            rows = [
                {
                    "source_group": "curriculum_pdf",
                    "title": "2022 개정 수학과 교육과정",
                    "path": "curriculum.pdf",
                    "file_count": 1,
                    "pdf_count": 1,
                    "json_count": 0,
                    "status": "available",
                    "use_for_concept_map": "primary official curriculum evidence",
                    "notes": "Official curriculum PDF is available.",
                }
            ]

            inventory.write_csv(rows, path)

            with path.open("r", encoding="utf-8-sig", newline="") as f:
                written = list(csv.DictReader(f))

            self.assertEqual(list(written[0]), inventory.CSV_FIELDS)
            self.assertEqual(written[0]["source_group"], "curriculum_pdf")


if __name__ == "__main__":
    unittest.main()
