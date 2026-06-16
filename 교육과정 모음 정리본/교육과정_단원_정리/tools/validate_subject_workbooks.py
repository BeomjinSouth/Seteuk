from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
EXPECTED_SHEETS = ["요약", "단원목록", "대단원요약", "출처"]
REQUIRED_FIELDS = ["교과", "대단원", "중단원", "소단원", "배우는 내용", "출처 PDF"]


def table_refs(zf: zipfile.ZipFile) -> dict[str, str]:
    refs: dict[str, str] = {}
    for name in zf.namelist():
        if not name.startswith("xl/tables/table") or not name.endswith(".xml"):
            continue
        root = ET.fromstring(zf.read(name))
        refs[root.attrib.get("displayName", name)] = root.attrib["ref"]
        if root.find("main:autoFilter", NS) is None:
            raise AssertionError(f"{name} has no table autoFilter")
    return refs


def workbook_sheet_names(zf: zipfile.ZipFile) -> list[str]:
    root = ET.fromstring(zf.read("xl/workbook.xml"))
    return [sheet.attrib["name"] for sheet in root.findall("main:sheets/main:sheet", NS)]


def worksheet_has_pane(zf: zipfile.ZipFile, sheet_number: int) -> bool:
    root = ET.fromstring(zf.read(f"xl/worksheets/sheet{sheet_number}.xml"))
    return root.find(".//main:pane", NS) is not None


def worksheet_has_filter(zf: zipfile.ZipFile, sheet_number: int) -> bool:
    root = ET.fromstring(zf.read(f"xl/worksheets/sheet{sheet_number}.xml"))
    return root.find("main:autoFilter", NS) is not None


def expected_file_name(index: int, subject: str) -> str:
    safe = re.sub(r'[\\/:*?"<>|]', "_", subject)
    safe = re.sub(r"\s+", "_", safe)
    safe = re.sub(r"_+", "_", safe).strip("_")
    return f"{index:02d}_{safe}_단원_정리.xlsx"


def main() -> None:
    summary_root = Path(__file__).resolve().parents[1]
    data = json.loads((summary_root / "unit_summary_data.json").read_text(encoding="utf-8"))
    rows = data["rows"]
    sources = data["sources"]
    subject_dir = summary_root / "교과별_XLSX"

    missing_required = [
        (row.get("교과", ""), field)
        for row in rows
        for field in REQUIRED_FIELDS
        if not str(row.get(field, "")).strip()
    ]
    if missing_required:
        raise AssertionError(f"required fields are blank: {missing_required[:5]}")

    subject_order = [source["교과"] for source in sources]
    files = sorted(subject_dir.glob("*.xlsx"))
    if len(files) != len(subject_order):
        raise AssertionError(f"expected {len(subject_order)} subject workbooks, found {len(files)}")

    by_subject = {subject: [row for row in rows if row["교과"] == subject] for subject in subject_order}
    for index, subject in enumerate(subject_order, start=1):
        path = subject_dir / expected_file_name(index, subject)
        if not path.exists():
            raise AssertionError(f"missing workbook: {path.name}")
        if not zipfile.is_zipfile(path):
            raise AssertionError(f"not a valid xlsx zip: {path.name}")

        expected_rows = len(by_subject[subject])
        with zipfile.ZipFile(path) as zf:
            sheets = workbook_sheet_names(zf)
            if sheets != EXPECTED_SHEETS:
                raise AssertionError(f"{path.name} sheets {sheets} != {EXPECTED_SHEETS}")
            for sheet_number in range(1, 5):
                if not worksheet_has_pane(zf, sheet_number):
                    raise AssertionError(f"{path.name} sheet{sheet_number} has no frozen pane")
            for sheet_number in range(2, 5):
                if not worksheet_has_filter(zf, sheet_number):
                    raise AssertionError(f"{path.name} sheet{sheet_number} has no worksheet filter")

            refs = table_refs(zf)
            unit_ref = next((ref for name, ref in refs.items() if name.startswith("UnitList_")), "")
            if unit_ref != f"A1:L{expected_rows + 1}":
                raise AssertionError(f"{path.name} unit table ref {unit_ref} != A1:L{expected_rows + 1}")

    print(json.dumps({"subjects": len(subject_order), "workbooks": len(files), "rows": len(rows)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
