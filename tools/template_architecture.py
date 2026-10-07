"""Content-led pilot architectures, shared by Word and HTML renderers."""

from copy import deepcopy

PROFILES = {
    "legal": dict(
        name="matter-memo",
        title=24,
        continuation=19,
        heading=12,
        margin=0.78,
        body=10.5,
        leading=1.16,
        table="rules",
        emphasis=False,
    ),
    "professional": dict(
        name="decision-brief",
        title=30,
        continuation=21,
        heading=14,
        margin=0.66,
        body=11,
        leading=1.1,
        table="tint",
        emphasis=True,
    ),
    "business": dict(
        name="service-proposal",
        title=32,
        continuation=25,
        heading=14,
        margin=0.7,
        body=10.5,
        leading=1.12,
        paragraph_after=5,
        chart_width=6.1,
        table="rules",
        emphasis=False,
    ),
}


def compose(doc):
    """Preserve every authored content value; change hierarchy and representation."""
    d = deepcopy(doc)
    if d["id"] not in PROFILES:
        return d
    d["architecture"] = deepcopy(PROFILES[d["id"]])
    if d["id"] == "business":
        d["headingFont"] = "Young Serif"
        d["font"] = "Georgia"
    for i, pg in enumerate(d["pages"]):
        pg["role"] = "opener" if i == 0 else "continuation"
        for b in pg["blocks"]:
            if b["type"] == "metrics":
                b["type"] = "terms" if d["id"] == "business" else "facts"
            if (
                d["id"] == "legal"
                and b["type"] == "table"
                and b["headers"] == ["To", "From", "Date"]
            ):
                b["type"] = "metadata"
            if (
                d["id"] == "business"
                and b["type"] == "table"
                and b["headers"] == ["Phase", "Deliverables", "Schedule"]
            ):
                b["type"] = "sequence"
        if i == 0:
            blocks = pg["blocks"]
            if d["id"] == "professional":
                # Decision precedes supporting measures; keep the reporting context.
                decision = next(b for b in blocks if b["type"] == "callout")
                blocks.remove(decision)
                blocks.insert(1, decision)
            elif d["id"] == "legal":
                # Counts are record context, not the legal issue or conclusion.
                facts = next(b for b in blocks if b["type"] == "facts")
                blocks.remove(facts)
                blocks.append(facts)
            else:
                offer = next(b for b in blocks if b["type"] == "terms")
                blocks.remove(offer)
                pos = next(j for j, b in enumerate(blocks) if b["type"] == "callout")
                blocks.insert(pos + 1, offer)
    d["sample"]["document"] = deepcopy(d["pages"])
    return d
