from __future__ import annotations

import re
import shutil
import tempfile
import zipfile
from pathlib import Path


SHEET_RE = re.compile(r"xl/worksheets/sheet(\d+)\.xml$")
DIMENSION_RE = re.compile(r'<x:dimension\s+ref="([^"]+)"')
ROW_RE = re.compile(r'<x:row\s+r="(\d+)"')
CELL_RE = re.compile(r'<x:c\s+r="([A-Z]+)(\d+)"')
TABLE_REF_RE = re.compile(r'<x:table\b[^>]*\bref="([^"]+)"')


def column_to_number(column: str) -> int:
    value = 0
    for char in column:
        value = value * 26 + (ord(char) - 64)
    return value


def number_to_column(number: int) -> str:
    name = ""
    while number:
        number, remainder = divmod(number - 1, 26)
        name = chr(65 + remainder) + name
    return name or "A"


def worksheet_dimension(xml: str) -> str | None:
    match = DIMENSION_RE.search(xml)
    if match and ":" in match.group(1):
        return match.group(1)

    max_row = 0
    max_column = 0
    for row_match in ROW_RE.finditer(xml):
        max_row = max(max_row, int(row_match.group(1)))
    for cell_match in CELL_RE.finditer(xml):
        max_column = max(max_column, column_to_number(cell_match.group(1)))
        max_row = max(max_row, int(cell_match.group(2)))

    if max_row >= 1 and max_column >= 1:
        return f"A1:{number_to_column(max_column)}{max_row}"
    return None


def patch_sheet_xml(xml: str, sheet_index: int) -> str:
    if "<x:pane " not in xml:
        y_split, top_left = ("10", "A11") if sheet_index == 1 else ("1", "A2")

        def replace_sheet_view(match: re.Match[str]) -> str:
            attrs = match.group(1)
            return (
                f"<x:sheetView{attrs}>"
                f'<x:pane ySplit="{y_split}" topLeftCell="{top_left}" activePane="bottomLeft" state="frozen" />'
                f'<x:selection pane="bottomLeft" activeCell="{top_left}" sqref="{top_left}" />'
                f"</x:sheetView>"
            )

        xml = re.sub(r"<x:sheetView([^>]*)\s*/>", replace_sheet_view, xml, count=1)

    filter_ref = worksheet_dimension(xml) if sheet_index > 1 else None
    if filter_ref and "<x:autoFilter " not in xml:
        insert = f'<x:autoFilter ref="{filter_ref}" />'
        if "<x:tableParts" in xml:
            xml = xml.replace("<x:tableParts", insert + "<x:tableParts", 1)
        else:
            xml = xml.replace("</x:worksheet>", insert + "</x:worksheet>", 1)
    return xml


def patch_table_xml(xml: str) -> str:
    if "<x:autoFilter " in xml:
        return xml
    match = TABLE_REF_RE.search(xml)
    if not match:
        return xml
    return xml.replace("<x:tableColumns", f'<x:autoFilter ref="{match.group(1)}" /><x:tableColumns', 1)


def patch_xlsx(path: Path) -> None:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as temp_file:
        temp_path = Path(temp_file.name)

    try:
        with zipfile.ZipFile(path, "r") as zin, zipfile.ZipFile(temp_path, "w", zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)
                sheet_match = SHEET_RE.match(item.filename)
                if sheet_match:
                    xml = data.decode("utf-8")
                    data = patch_sheet_xml(xml, int(sheet_match.group(1))).encode("utf-8")
                elif item.filename.startswith("xl/tables/table") and item.filename.endswith(".xml"):
                    xml = data.decode("utf-8")
                    data = patch_table_xml(xml).encode("utf-8")
                zout.writestr(item, data)
        shutil.move(str(temp_path), str(path))
    finally:
        if temp_path.exists():
            temp_path.unlink()


def main() -> None:
    summary_root = Path(__file__).resolve().parents[1]
    xlsx_files = sorted(summary_root.glob("*.xlsx"))
    subject_dir = summary_root / "교과별_XLSX"
    if subject_dir.exists():
        xlsx_files.extend(sorted(subject_dir.glob("*.xlsx")))
    if not xlsx_files:
        raise SystemExit(f"No xlsx files found under {summary_root}")

    for xlsx_file in xlsx_files:
        patch_xlsx(xlsx_file)
        print(f"patched {xlsx_file.relative_to(summary_root)}")


if __name__ == "__main__":
    main()
