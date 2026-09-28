"""Check local Markdown/HTML targets and HTML fragments without network access."""

from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        for key in ("href", "src"):
            if key in attrs:
                self.links.append(attrs[key])


def check():
    errors = []
    files = []
    for folder in ["docs", "platforms", "skills", "maintenance"]:
        files += [
            p
            for p in (ROOT / folder).rglob("*")
            if p.suffix in (".md", ".html")
            and not any(x in ("vendor", "fonts") for x in p.relative_to(ROOT).parts)
        ]
    files += list(ROOT.glob("*.md"))
    for file in files:
        text = file.read_text(encoding="utf-8")
        parser = Links()
        parser.feed(text)
        links = parser.links
        if file.suffix == ".md":
            links += re.findall(r'\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)', text)
        for link in links:
            url = urlsplit(link.strip("<>"))
            if url.scheme or url.netloc or not url.path:
                continue
            target = (file.parent / unquote(url.path)).resolve()
            if not target.is_relative_to(ROOT):
                continue
            if target.is_dir():
                if file.suffix == ".md":
                    continue
                target = target / "index.html"
            if not target.exists():
                errors.append(f"{file.relative_to(ROOT)} -> {link}")
            elif url.fragment and target.suffix == ".html":
                dest = Links()
                dest.feed(target.read_text(encoding="utf-8"))
                if unquote(url.fragment) not in dest.ids:
                    errors.append(
                        f"{file.relative_to(ROOT)} -> missing fragment {link}"
                    )
    if errors:
        raise ValueError("\n".join(errors))
    print(f"Local links passed in {len(files)} Markdown/HTML files")


if __name__ == "__main__":
    check()
