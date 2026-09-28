"""Snapshot font-directory facts for review; never downloads or approves fonts."""

import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen

BASE = "https://open-foundry.com"


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = set()
        self.recording = False
        self.payload = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href", "").startswith("/fonts/"):
            self.links.add(BASE + attrs["href"])
        if tag == "script" and attrs.get("id") == "__NUXT_DATA__":
            self.recording = True

    def handle_endtag(self, tag):
        if tag == "script":
            self.recording = False

    def handle_data(self, text):
        if self.recording:
            self.payload += text


def fetch(url):
    request = Request(url, headers={"User-Agent": "dazzler font catalog audit"})
    with urlopen(request, timeout=30) as response:
        page = Page()
        page.feed(response.read().decode("utf-8"))
        return page


def extract(page):
    values = json.loads(page.payload)

    def resolve(index, depth=0):
        if depth > 50:
            raise ValueError("Unexpected recursive payload")
        if index < 0:
            return None
        item = values[index]
        if isinstance(item, dict):
            return {k: resolve(v, depth + 1) for k, v in item.items()}
        if isinstance(item, list):
            return [resolve(v, depth + 1) if isinstance(v, int) else v for v in item]
        return item

    keys = (
        "name",
        "slug",
        "classification",
        "licence",
        "creator",
        "projectUrl",
        "repositoryUrl",
        "downloadUrl",
        "instances",
    )
    for item in values:
        if isinstance(item, dict) and "repositoryUrl" in item:
            # Omit copyrighted specimen art and full editorial descriptions.
            return {key: resolve(item[key]) for key in keys if key in item}
    raise ValueError("Font data missing; inspect the current site schema")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    if args.out.exists():
        parser.error("Choose a new snapshot path; existing files are not overwritten")
    urls = sorted(fetch(BASE + "/").links)
    if not urls:
        raise ValueError("No detail pages found; the crawl is not complete")
    records = []
    for url in urls:
        record = extract(fetch(url))
        record["url"] = url
        records.append(record)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(
        json.dumps(
            {"source": BASE, "pages": len(records), "fonts": records},
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(
        f"Saved {len(records)} detail pages to {args.out}; licensing still requires source review."
    )


if __name__ == "__main__":
    main()
