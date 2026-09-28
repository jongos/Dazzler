"""Capture already rendered Word PDFs; requires local pypdfium2 and Pillow for maintenance only."""

import argparse
import hashlib
import json
from pathlib import Path
import pypdfium2 as pdf

ROOT = Path(__file__).resolve().parents[1] / "skills/dazzler-frontend/assets/templates"


def capture(folder):
    catalog = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
    report = []
    for item in catalog["templates"]:
        if item["format"] != "docx":
            continue
        source = ROOT / item["path"]
        document = pdf.PdfDocument(folder / (item["category"] + ".pdf"))
        if len(document) != item["plannedPages"]:
            raise ValueError(f'{item["id"]}: unexpected pagination ({len(document)})')
        pages = []
        for i, page in enumerate(document):
            if len(page.get_textpage().get_text_range()) < 100:
                raise ValueError("Unexpected nearly blank page")
            image = page.render(scale=1.7).to_pil().convert("RGB")
            name = f'{item["id"]}-p{i+1}.jpg'
            image.save(ROOT / "previews" / name, quality=91)
            pages.append(name)
            if i == 0:
                image.save(ROOT / "previews" / f'{item["id"]}.jpg', quality=90)
        report.append(
            {
                "id": item["id"],
                "engine": "Microsoft Word PDF / PDFium raster",
                "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                "pages": pages,
            }
        )
        document.close()
    (ROOT / "previews/word-captures.json").write_text(
        json.dumps(report, indent=2) + "\n", encoding="utf-8"
    )
    print(
        f'Captured {sum(len(r["pages"]) for r in report)} actual Word pages from {len(report)} templates'
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf_folder", type=Path)
    capture(parser.parse_args().pdf_folder)
