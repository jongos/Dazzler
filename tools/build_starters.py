"""Generate compact on-demand starter references from their canonical catalog."""

import json
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/dazzler-frontend"


def build():
    rows = json.loads((SKILL / "references/starters.json").read_text(encoding="utf-8"))[
        "starters"
    ]
    index = [
        "# Start with one sentence",
        "",
        "Choose a task below, or simply describe what you need. Dazzler chooses fonts, colors and layout automatically. Advanced fields are optional. These prompts do not grant publication permission.",
        "",
    ]
    for category in dict.fromkeys(row["category"] for row in rows):
        text = ["# " + category.replace("-", " ").title(), ""]
        for row in rows:
            if row["category"] != category:
                continue
            index.append(
                f'- [{row["id"]}: {row["title"]}](starters-{category}.md#{row["id"].lower()})'
            )
            text += [f'<a id="{row["id"].lower()}"></a>', f'## {row["title"]}', ""]
            for label, key in [
                ("Goal", "goal"),
                ("When to use", "whenToUse"),
                ("Prompt", "prompt"),
                ("Exercises", "exercises"),
                ("Expect", "expect"),
                ("Tips", "tips"),
                ("More control", "advanced"),
            ]:
                text += [f"**{label}:** {row[key]}", ""]
            text += [
                "Agent route: "
                + ", ".join(
                    f'`scripts/{h["script"]}'
                    + (f' {h["subcommand"]}' if h["subcommand"] else "")
                    + "`"
                    for h in row["helpers"]
                )
                + ". Read the linked workflow for arguments and schemas; this is not a command to paste.",
                "",
                "Workflow: "
                + ", ".join(
                    f'[{p.removesuffix(".md").replace("-", " ")}]({p})'
                    for p in row["references"]
                )
                + ".",
                "",
            ]
        (SKILL / f"references/starters-{category}.md").write_text(
            "\n".join(text), encoding="utf-8", newline="\n"
        )
    index += [
        "",
        "Agent lookup: `python scripts/starters.py --id B2` returns one prompt and its capability requirements. `--category brand` narrows the list. Read only the relevant category; the full JSON is maintenance metadata, not mandatory context.",
        "",
    ]
    (SKILL / "references/starters.md").write_text(
        "\n".join(index), encoding="utf-8", newline="\n"
    )
    cards = []
    for row in rows:
        cards.append(
            f'<article id="{row["id"]}"><p class="eyebrow">{row["id"]} / {escape(row["category"])}</p><h2>{escape(row["title"])}</h2><blockquote>{escape(row["prompt"])}</blockquote><p><strong>Expect:</strong> {escape(row["expect"])}</p><details><summary>Agent route and optional control</summary><p>{escape(row["advanced"])}</p><p>{escape(row["tips"])}</p></details></article>'
        )
    page = (
        """<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dazzler / 19 ways to begin</title><link rel="stylesheet" href="../templates/fonts/work-sans/fonts.css"><link rel="stylesheet" href="../templates/fonts/young-serif/fonts.css"><style>
*{box-sizing:border-box}body{margin:0;background:#faf8f2;color:#252039;font:18px/1.6 "Work Sans",system-ui,sans-serif}header,main,footer{max-width:1240px;margin:auto;padding:32px}header{padding-top:64px}nav a{color:#4829a8;font-weight:700}h1{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:clamp(3rem,7vw,6.4rem);line-height:1;letter-spacing:-.045em;max-width:900px;margin:32px 0}h1 em{color:#6230b5;font-style:normal}.intro{max-width:700px;font-size:22px}.eyebrow{text-transform:uppercase;letter-spacing:.1em;font-size:12px;font-weight:800;color:#573491}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}article{background:white;border:1px solid #d7d0e4;border-top:6px solid #6230b5;padding:28px;scroll-margin-top:24px}article:nth-child(3n+2){border-top-color:#00796c}article:nth-child(3n){border-top-color:#c55513}h2{font-size:27px;line-height:1.2}blockquote{margin:20px 0;padding:18px;background:#eee8fa;border-left:3px solid #6230b5;font-weight:600}summary{cursor:pointer;font-weight:700;color:#4829a8}a:focus-visible,summary:focus-visible{outline:3px solid #c55513;outline-offset:5px}footer{font-size:14px;color:#51495e}@media(max-width:700px){header,main,footer{padding:24px}.grid{grid-template-columns:1fr}article{padding:22px}}@media print{.grid{display:block}article{break-inside:avoid;margin:18px 0}details{display:block}header{padding-top:0}}
</style></head><body><header><nav><a href="../index.html">Dazzler field manual</a> / Starter library</nav><p class="eyebrow">One sentence. A considered design.</p><h1>You bring the purpose.<br><em>Dazzler brings the craft.</em></h1><p class="intro">19 ways to get started. Fonts, color and composition are automatic. Add preferences only when you want more control.</p><p>Use the skill name supported by your host: <strong>$dazzler-frontend</strong> in Codex, <strong>/dazzler-frontend</strong> in Claude Code, or ask for Dazzler in other supported agents. Claude plugin installs use <strong>/dazzler:dazzler-frontend</strong>.</p></header><main><div class="grid">"""
        + "".join(cards)
        + """</div></main><footer><p>Examples describe supported workflows, not guaranteed host capabilities. Document editing, native charts and browser inspection require suitable tools. No prompt grants publication permission.</p><p>Created by Jon Gosier. Feedback and ideas: <a href="mailto:jon@filmhedge.com">jon@filmhedge.com</a>. Dazzler guidance: Apache-2.0. Bundled resources retain their licenses.</p></footer></body></html>"""
    )
    folder = ROOT / "docs/starters"
    folder.mkdir(exist_ok=True)
    (folder / "index.html").write_text(page, encoding="utf-8", newline="\n")


if __name__ == "__main__":
    build()
