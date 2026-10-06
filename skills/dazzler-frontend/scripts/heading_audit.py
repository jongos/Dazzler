"""Read-only heading gate for final artifacts; Python standard library only."""

import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

from headings import heading

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"


def xml(data):
    declarations = data.replace(b"\x00", b"").upper()
    if b"<!DOCTYPE" in declarations or b"<!ENTITY" in declarations:
        raise ValueError("XML declarations with entities are unsupported")
    return ET.fromstring(data)


def office(path):
    rows = []
    with zipfile.ZipFile(path) as z:
        infos = z.infolist()
        if len(infos) > 10000 or sum(i.file_size for i in infos) > 100_000_000:
            raise ValueError("Office archive exceeds audit limits")
        if len({i.filename for i in infos}) != len(infos):
            raise ValueError("Duplicate archive entries")
        if path.suffix.lower() == ".docx":
            styles = {}
            if "word/styles.xml" in z.namelist():
                for s in xml(z.read("word/styles.xml")).findall(W + "style"):
                    styles[s.get(W + "styleId")] = s

            def is_heading(props, seen=None):
                if props is None:
                    return False
                outline = props.find(W + "outlineLvl")
                if outline is not None and outline.get(W + "val") in map(str, range(9)):
                    return True
                ref = props.find(W + "pStyle")
                if ref is None:
                    return False
                return heading_style(ref.get(W + "val"), seen or set())

            def heading_style(key, seen):
                if key in seen:
                    return False
                if len(seen) >= 100:
                    raise ValueError("Heading style inheritance exceeds audit limits")
                seen.add(key)
                s = styles.get(key)
                if re.fullmatch(r"(?:Title|Heading\s*[1-9])", key or "", re.I):
                    return True
                if s is None:
                    return False
                name = s.find(W + "name")
                if name is not None and re.fullmatch(
                    r"(?:Title|Heading\s*[1-9])", name.get(W + "val", ""), re.I
                ):
                    return True
                if is_heading(s.find(W + "pPr"), seen):
                    return True
                base = s.find(W + "basedOn")
                return base is not None and heading_style(base.get(W + "val"), seen)

            for name in z.namelist():
                if not re.fullmatch(
                    r"word/(?:document|header\d+|footer\d+)\.xml", name
                ):
                    continue
                for i, para in enumerate(xml(z.read(name)).iter(W + "p")):
                    if is_heading(para.find(W + "pPr")):
                        rows.append(
                            {
                                "location": f"{name}:p{i}",
                                "text": "".join(
                                    t.text or "" for t in para.iter(W + "t")
                                ),
                            }
                        )
        else:
            for name in z.namelist():
                if not re.fullmatch(r"ppt/slides/slide\d+\.xml", name):
                    continue
                for i, shape in enumerate(xml(z.read(name)).iter(P + "sp")):
                    ph = shape.find(".//" + P + "ph")
                    if ph is not None and ph.get("type") in ("title", "ctrTitle"):
                        rows.append(
                            {
                                "location": f"{name}:shape{i}",
                                "text": " ".join(
                                    "".join(t.text or "" for t in para.iter(A + "t"))
                                    for para in shape.iter(A + "p")
                                ),
                            }
                        )
    return rows


class WebHeadings(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.rows, self.active = [], []
        self.stack = []
        self.ignore = 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "template"):
            self.ignore += 1
        if self.ignore:
            return
        if tag not in (
            "area",
            "base",
            "br",
            "col",
            "embed",
            "hr",
            "img",
            "input",
            "link",
            "meta",
            "param",
            "source",
            "track",
            "wbr",
        ):
            self.stack.append(tag)
        attrs = dict(attrs)
        if re.fullmatch(r"h[1-6]", tag) or attrs.get("role") == "heading":
            self.active.append(
                {
                    "depth": len(self.stack),
                    "location": f"line:{self.getpos()[0]}",
                    "text": "",
                }
            )

    def handle_endtag(self, tag):
        if tag in ("script", "style", "template") and self.ignore:
            self.ignore -= 1
            return
        if not self.ignore and tag in self.stack:
            index = len(self.stack) - 1 - self.stack[::-1].index(tag)
            del self.stack[index:]
            while self.active and self.active[-1]["depth"] > len(self.stack):
                row = self.active.pop()
                row.pop("depth")
                self.rows.append(row)

    def handle_data(self, text):
        if not self.ignore:
            for row in self.active:
                row["text"] += text


def collect(path):
    path = Path(path)
    if path.stat().st_size > 50_000_000:
        raise ValueError("Input exceeds 50 MB")
    suffix = path.suffix.lower()
    if suffix in (".docx", ".pptx"):
        return office(path)
    text = path.read_text(encoding="utf-8-sig")
    if suffix in (".html", ".htm"):
        parser = WebHeadings()
        parser.feed(text)
        parser.close()
        if parser.active:
            raise ValueError("Unclosed heading; audit rendered DOM instead")
        return parser.rows
    if suffix == ".json":
        rows = json.loads(text)
        if not isinstance(rows, list) or len(rows) > 10000:
            raise ValueError("Expected at most 10000 heading records")
        if any(
            not isinstance(r, dict)
            or not isinstance(r.get("text"), str)
            or not isinstance(r.get("location"), str)
            for r in rows
        ):
            raise ValueError("Each heading needs text and location strings")
        return rows
    if suffix == ".md":
        rows, fence = [], None
        lines = text.splitlines()
        frontmatter = bool(lines and lines[0].strip() == "---")
        previous = ""
        for i, line in enumerate(lines):
            if frontmatter:
                if i and line.strip() in ("---", "..."):
                    frontmatter = False
                continue
            marker = re.match(r"^\s{0,3}(`{3,}|~{3,})", line)
            if marker:
                previous = ""
                token = marker[1]
                if fence is None:
                    fence = token
                elif token[0] == fence[0] and len(token) >= len(fence):
                    fence = None
                continue
            if fence:
                continue
            match = re.match(r"^ {0,3}#{1,6}\s+(.+?)(?:\s+#+)?\s*$", line)
            if match:
                rows.append({"location": f"line:{i+1}", "text": match[1]})
                previous = ""
            elif previous and re.fullmatch(r" {0,3}(?:=+|-+)\s*", line):
                rows.append({"location": f"line:{i}", "text": previous})
                previous = ""
            else:
                previous = (
                    line.strip()
                    if not re.match(r"^(?: {4}|\t| {0,3}[>#*+-])", line)
                    else ""
                )
        return rows
    raise ValueError("Use DOCX, PPTX, HTML, Markdown or a JSON heading inventory")


def audit(rows, options=None):
    failures = []
    for row in rows:
        text = re.sub(r"\s+", " ", row["text"]).strip()
        expected = heading(text, options)
        if text != expected:
            failures.append(
                {"location": row["location"], "actual": text, "expected": expected}
            )
    return {
        "status": "needs-work" if failures else "pass" if rows else "not-checked",
        "checked": len(rows),
        "failures": failures,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", type=Path)
    parser.add_argument(
        "--case", choices=("title", "preserve", "sentence", "upper"), default="title"
    )
    parser.add_argument("--lang", default="en")
    parser.add_argument("--preserve", action="append", default=[])
    args = parser.parse_args()
    try:
        report = audit(
            collect(args.artifact),
            {"case": args.case, "lang": args.lang, "preserve": args.preserve},
        )
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 0 if report["status"] == "pass" else 1 if report["failures"] else 2
    except (ValueError, OSError, ET.ParseError, zipfile.BadZipFile) as error:
        print(json.dumps({"status": "not-checked", "error": str(error)}))
        return 2


if __name__ == "__main__":
    sys.exit(main())
