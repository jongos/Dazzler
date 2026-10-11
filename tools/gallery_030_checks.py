"""Record offline shortlist/typography evidence and build contact sheets for review."""

from gallery_030 import R, S, O, D, save
import sys
import json
from PIL import Image, ImageDraw
import recipes
import fonts


def main():
    rows = []
    font_rows = []
    catalog = fonts.load()["fonts"]
    for filename in ["document-briefs.json", "interface-briefs.json"]:
        for d in json.loads((S / filename).read_text(encoding="utf-8")):
            context = (
                "software"
                if d["id"].startswith(("webapp", "data", "business-portal"))
                or d["id"] == "technical"
                else (
                    "commerce"
                    if d["id"].startswith("restaurant")
                    or d["id"] in ("business", "marketing")
                    else (
                        "culture"
                        if d["id"] == "fun"
                        else (
                            "editorial"
                            if d["id"] in ("legal", "presentation")
                            else "information"
                        )
                    )
                )
            )
            rows.append(
                {
                    "id": d["id"],
                    "context": context,
                    "shortlist": recipes.shortlist(
                        {"contexts": [context], "brief": d["prompt"], "limit": 3}
                    ),
                    "decision": "Retain the original direction: " + d["rationale"],
                    "adaptedFromRecipe": False,
                }
            )
            family = d["font"].lower().replace(" ", "-")
            result = fonts.shortlist(
                catalog,
                "code" if family == "office-code-pro" else "heading",
                [],
                d["prompt"],
                400,
                False,
                False,
                [],
                None,
                family,
            )
            if not result:
                raise ValueError("Font shortlist failed: " + family)
            font_rows.append(
                {
                    "id": d["id"],
                    "family": family,
                    "representativeText": d["prompt"],
                    "result": result,
                }
            )
    save(S / "recipe-consideration.json", rows)
    save(S / "font-consideration.json", font_rows)
    groups = {
        "desktop": sorted((S / "renders").glob("*-1440.png")),
        "mobile": sorted((S / "renders").glob("*-390.png")),
        "word": sorted((S / "word").glob("*/page-*.png")),
    }
    for kind, paths in groups.items():
        for offset in range(0, len(paths), 4):
            canvas = Image.new("RGB", (1600, 2200), "#dedede")
            draw = ImageDraw.Draw(canvas)
            for i, p in enumerate(paths[offset : offset + 4]):
                im = Image.open(p).convert("RGB")
                im.thumbnail((780, 1050))
                x = (i % 2) * 800
                y = (i // 2) * 1100
                canvas.paste(im, (x + 10, y + 30))
                draw.text((x + 10, y + 8), p.parent.name + "/" + p.stem, fill="black")
            canvas.save(S / f"contact-{kind}-{offset//4}.jpg", quality=90)


if __name__ == "__main__":
    main()
