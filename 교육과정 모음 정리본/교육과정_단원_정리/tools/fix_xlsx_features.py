from __future__ import annotations

import re
import shutil
import tempfile
import zipfile
from pathlib import Path


SHEET_FEATURES = {
    "xl/worksheets/sheet1.xml": {"freeze": ("10", "A11"), "filter": None},
    "xl/worksheets/sheet2.xml": {"freeze": ("1", "A2"), "filter": "A1:L592"},
    "xl/worksheets/sheet3.xml": {"freeze": ("1", "A2"), "filter": "A1:F18"},
    "xl/worksheets/sheet4.xml": {"freeze": ("1", "A2"), "filter": "A1:G18"},
}

TABLE_FILTERS = {
    "xl/tables/table1.xml": "A1:L592",
    "xl/tables/table2.xml": "A1:F18",
    "xl/tables/table3.xml": "A1:G18",
}


def patch_sheet_xml(xml: str, freeze: tuple[str, str] | None, filter_ref: str | None) -> str:
    if freeze and "<x:pane " not in xml:
        y_split, top_left = freeze

        def replace_sheet_view(match: re.Match[str]) -> str:
            attrs = match.group(1)
            return (
                f"<x:sheetView{attrs}>"
                f'<x:pane ySplit="{y_split}" topLeftCell="{top_left}" activePane="bottomLeft" state="frozen" />'
                f'<x:selection pane="bottomLeft" activeCell="{top_left}" sqref="{top_left}" />'
                f"</x:sheetView>"
            )

        xml = re.sub(r"<x:sheetView([^>]*)\s*/>", replace_sheet_view, xml, count=1)

    if filter_ref and "<x:autoFilter " not in xml:
        insert = f'<x:autoFilter ref="{filter_ref}" />'
        if "<x:tableParts" in xml:
            xml = xml.replace("<x:tableParts", insert + "<x:tableParts", 1)
        else:
            xml = xml.replace("</x:worksheet>", insert + "</x:worksheet>", 1)
    return xml


def patch_table_xml(xml: str, filter_ref: str) -> str:
    if "<x:autoFilter " in xml:
        return xml
    return xml.replace("<x:tableColumns", f'<x:autoFilter ref="{filter_ref}" /><x:tableColumns', 1)


def patch_xlsx(path: Path) -> None:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as temp_file:
        temp_path = Path(temp_file.name)

    with zipfile.ZipFile(path, "r") as zin, zipfile.ZipFile(temp_path, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename in SHEET_FEATURES:
                xml = data.decode("utf-8")
                features = SHEET_FEATURES[item.filename]
                data = patch_sheet_xml(xml, features["freeze"], features["filter"]).encode("utf-8")
            elif item.filename in TABLE_FILTERS:
                xml = data.decode("utf-8")
                data = patch_table_xml(xml, TABLE_FILTERS[item.filename]).encode("utf-8")
            zout.writestr(item, data)

    shutil.move(str(temp_path), str(path))


def main() -> None:
    summary_root = Path(__file__).resolve().parents[1]
    xlsx_files = list(summary_root.glob("*.xlsx"))
    if len(xlsx_files) != 1:
        raise SystemExit(f"Expected one xlsx file in {summary_root}, found {len(xlsx_files)}")
    patch_xlsx(xlsx_files[0])
    print(f"patched {xlsx_files[0].name}")


if __name__ == "__main__":
    main()
