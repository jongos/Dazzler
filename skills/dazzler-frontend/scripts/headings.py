"""Conservative English heading casing; original Apache-2.0 implementation."""

import json
import re
from pathlib import Path

RULES = json.loads(
    (Path(__file__).resolve().parents[1] / "references/title-case.json").read_text(
        encoding="utf-8"
    )
)
PROTECTED = r"`[^`]*`|<(?:code|kbd|samp)\b[^>]*>[\s\S]*?</(?:code|kbd|samp)>|<[^>]*>|&(?:#[0-9]+|#x[0-9a-f]+|[a-z]+);|\"[^\"]*\"|“[^”]*”|‘[^’]*’|«[^»]*»|(?<!\w)'[^']*'|(?:https?://|www\.)\S+|\S+@\S+|[^\s<>]*[0-9_/\\()][^\s<>]*|\b[A-Za-z]+\.[A-Za-z.]+\b"


def heading(text, options=None):
    options = options or {}
    case = options.get("case", "title")
    lang = options.get("lang", "en")
    preserve = options.get("preserve", [])
    if not isinstance(text, str) or len(text) > 10000:
        raise ValueError("Heading must be text of at most 10000 characters")
    if case not in ("title", "sentence", "upper", "preserve") or not isinstance(
        lang, str
    ):
        raise ValueError("Invalid heading case or language")
    if (
        not isinstance(preserve, list)
        or len(preserve) > 100
        or any(not isinstance(x, str) or not x or len(x) > 160 for x in preserve)
    ):
        raise ValueError("Invalid heading preserve list")
    if not re.match(r"^en(?:-|$)", lang, re.I) or case in ("sentence", "preserve"):
        return text
    spans = [(m.start(), m.end()) for m in re.finditer(PROTECTED, text, re.I)]
    for value in preserve:
        spans.extend((m.start(), m.end()) for m in re.finditer(re.escape(value), text))
    words = [
        m
        for m in re.finditer(r"[^\W\d_]+(?:['’][^\W\d_]+)?", text)
        if not any(m.start() < b and m.end() > a for a, b in spans)
    ]
    if case == "title" and text == text.upper():
        return text
    result = []
    end = 0
    for i, m in enumerate(words):
        word = m.group()
        replacement = word
        protected = any(m.start() < b and m.end() > a for a, b in spans)
        # Existing capitals and camelCase/product names are never lowercased.
        if not protected and (case == "upper" or word == word.lower()):
            after_break = i == 0 or bool(
                re.search(r"[:—]\s*$", text[words[i - 1].end() : m.start()])
            )
            pair = (
                i > 0
                and (words[i - 1].group().lower() + " " + word.lower())
                in RULES["phrasalPairs"]
                and text[words[i - 1].end() : m.start()].isspace()
            )
            if case == "upper":
                replacement = word if re.search(r"[a-z][A-Z]", word) else word.upper()
            elif (
                after_break
                or i == len(words) - 1
                or pair
                or word not in RULES["smallWords"]
            ):
                replacement = word[0].upper() + word[1:]
        result.extend([text[end : m.start()], replacement])
        end = m.end()
    return "".join(result) + text[end:]


def options_from(content, system):
    typography = system.get("typography", {})
    return {
        "case": content.get("headingCase", typography.get("headingCase", "title")),
        "lang": content.get("lang", typography.get("lang", "en")),
        "preserve": content.get("preserve", typography.get("preserve", [])),
    }


def html_headings(text, options=None):
    # Script templates and style content are source code, not document headings.
    parts = re.split(
        r"(<(?:script|style)\b[^>]*>[\s\S]*?</(?:script|style)>)", text, flags=re.I
    )
    return "".join(
        (
            part
            if i % 2
            else re.sub(
                r"(<h[1-6]\b[^>]*>)([\s\S]*?)(</h[1-6]>)",
                lambda m: m[1] + heading(m[2], options) + m[3],
                part,
                flags=re.I,
            )
        )
        for i, part in enumerate(parts)
    )
