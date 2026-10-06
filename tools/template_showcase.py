"""Deterministic fictional scenarios and distinct editorial systems for the showcase."""

from copy import deepcopy


def p(text):
    return {"type": "p", "text": text}


def h(text):
    return {"type": "h", "text": text}


def table(headers, rows, widths=None):
    return {"type": "table", "headers": headers, "rows": rows, "widths": widths}


def call(label, text):
    return {"type": "callout", "label": label, "text": text}


def metrics(*values):
    return {"type": "metrics", "values": values}


def chart(label, rows, kind="bar", unit=""):
    return {"type": "chart", "label": label, "rows": rows, "kind": kind, "unit": unit}


def page(title, *blocks):
    return {"title": title, "blocks": list(blocks)}


def theme(accent, secondary, bright, paper, font, desktop, voice, ink="#172033"):
    return dict(
        accent=accent,
        secondary=secondary,
        bright=bright,
        paper=paper,
        headingFont=font,
        font=desktop,
        voice=voice,
        ink=ink,
    )


THEMES = {
    "professional": theme(
        "#164BCA",
        "#AE391C",
        "#FFCD4D",
        "#FFFFFF",
        "Archivo",
        "Arial",
        "Executive briefing / cobalt signals",
    ),
    "legal": theme(
        "#63305D",
        "#79571C",
        "#E8C885",
        "#FBF7EF",
        "Libre Baskerville",
        "Georgia",
        "Case-file editorial / plum and brass",
    ),
    "business": theme(
        "#3C36B5",
        "#AA352B",
        "#BFE9D8",
        "#FFFFFF",
        "Work Sans",
        "Arial",
        "Confident proposal / violet and coral",
    ),
    "fun": theme(
        "#AD145B",
        "#2440B2",
        "#FFE25A",
        "#FFF9E8",
        "Poppins",
        "Trebuchet MS",
        "Playful poster / pink blue yellow",
    ),
    "family": theme(
        "#086A66",
        "#AC402A",
        "#DCD2FF",
        "#FFFDF5",
        "Young Serif",
        "Georgia",
        "Kitchen calendar / teal and apricot",
    ),
    "presentation": theme(
        "#D8F36A",
        "#D1B6FF",
        "#FFBA8F",
        "#181B36",
        "Archivo",
        "Arial",
        "Decision deck / luminous on midnight",
        ink="#F8F8F0",
    ),
    "school": theme(
        "#216348",
        "#6E3CA1",
        "#F3D553",
        "#FCFFF8",
        "Libre Baskerville",
        "Georgia",
        "Field notebook / botanical triad",
    ),
    "marketing": theme(
        "#B3381B",
        "#5040A8",
        "#FBD66F",
        "#FFF9F3",
        "Oswald",
        "Arial",
        "Campaign editorial / vermilion and violet",
    ),
    "restaurant": theme(
        "#802338",
        "#52602B",
        "#E4BB66",
        "#FFF8E9",
        "Young Serif",
        "Georgia",
        "Seasonal menu / oxblood and herb",
    ),
    "technical": theme(
        "#075D83",
        "#B33D21",
        "#BAE9EA",
        "#F1F8FB",
        "Office Code Pro",
        "Consolas",
        "Engineering field guide / ink and cyan",
    ),
}
UI_THEMES = {
    "workspace": theme(
        "#2149B7",
        "#A23549",
        "#FDD66A",
        "#F3F5FE",
        "Archivo",
        "Arial",
        "Mission control / electric blue",
    ),
    "board": theme(
        "#563BB0",
        "#AC3A24",
        "#F8D963",
        "#F4EFFF",
        "Poppins",
        "Arial",
        "Sprint studio / violet and saffron",
    ),
    "settings": theme(
        "#096B61",
        "#9E3D60",
        "#BCE5D8",
        "#F4FAF6",
        "Work Sans",
        "Arial",
        "Personal workspace / mint and rose",
    ),
    "revenue": theme(
        "#176A58",
        "#6748B1",
        "#D8EC75",
        "#F5F9EF",
        "Archivo",
        "Arial",
        "Financial editorial / forest and citron",
    ),
    "operations": theme(
        "#1B5681",
        "#B63838",
        "#F3C659",
        "#EEF5FB",
        "Office Code Pro",
        "Arial",
        "Operations console / blue and amber",
    ),
    "dining": theme(
        "#82283D",
        "#536135",
        "#E7BD6A",
        "#FFF7E6",
        "Young Serif",
        "Georgia",
        "Supper journal / wine and parchment",
    ),
    "cafe": theme(
        "#A83B19",
        "#3C4B9C",
        "#F9C638",
        "#FFF3DA",
        "Poppins",
        "Arial",
        "Morning energy / orange and cobalt",
    ),
    "reservations": theme(
        "#593478",
        "#236B62",
        "#F0C876",
        "#F8F0FD",
        "Libre Baskerville",
        "Georgia",
        "Evening invitation / orchid and jade",
    ),
    "menu": theme(
        "#3A6325",
        "#A63E25",
        "#F6D762",
        "#F7F8E8",
        "Young Serif",
        "Georgia",
        "Market board / leaf and tomato",
    ),
    "business": theme(
        "#193D7D",
        "#A1395D",
        "#ADCFC8",
        "#F2F5FC",
        "Archivo",
        "Arial",
        "Client editorial / navy and raspberry",
    ),
}


def enrich(docs, uis):
    docs = deepcopy(docs)
    uis = deepcopy(uis)
    for d in docs:
        d.update(THEMES[d["id"]])
        d["tint"] = "#EEEFF5"
        d["sample"] = {
            "fictional": True,
            "asOf": "2027-06-21",
            "scenario": d["use"],
            "generation": "Deterministic authored fixtures; no client or external personal data",
        }
        # Replace editing placeholders with clearly synthetic completed context.
        replacements = {
            "[Name]": "Avery Kim",
            "[Class]": "Year 7 Science",
            "[Date]": "21 June 2027",
            "[Family note]": "Rain plan: move the picnic to the community hall.",
            "[Insert after review]": "Await signed agreement before recording a notice date.",
            "[Add verified sources]": "No authorities asserted in this synthetic case file.",
            "[Author, title, publication date and page or URL]": "Class observation log, synthetic dataset, June 2027",
            "[Strengths]": "Clear measurement method and an honest account of uncertainty.",
            "[One specific improvement]": "Record leaf count and include more plants.",
            "[Approve / revise / decline]": "Pilot proposal for review",
        }
        for pg in d["pages"]:
            pg["blocks"] = list(pg["blocks"])
            for b in pg["blocks"]:
                if "text" in b:
                    for old, new in replacements.items():
                        b["text"] = b["text"].replace(old, new)
        k = d["id"]
        if k == "professional":
            old = d["pages"][0]["blocks"]
            d["pages"] = [
                page(
                    "Launch with confidence",
                    p("PORTAL RELEASE / WEEK 24 / 14–18 JUNE 2027"),
                    metrics(
                        ("75%", "scope complete"),
                        ("$18k", "budget remaining"),
                        ("24", "days to launch"),
                    ),
                    call(
                        "DECISION / 21 JUNE",
                        "Approve the 20-customer pilot. Identity integration is three days late; a reviewed password fallback protects the 12 July launch.",
                    ),
                    chart(
                        "Cumulative accepted deliverables",
                        [("W20", 5), ("W21", 9), ("W22", 12), ("W23", 16), ("W24", 18)],
                        "line",
                        "deliverables",
                    ),
                    table(
                        ["Workstream", "Accepted / planned", "Owner"],
                        [
                            ["Account setup", "6 / 6", "Alex Rivera"],
                            ["Invoice history", "5 / 6", "Sam Okafor"],
                            ["Identity", "3 / 6", "Maya Chen"],
                            ["Help and training", "4 / 6", "Lena Ortiz"],
                        ],
                        [42, 28, 30],
                    ),
                ),
                page("Protect the launch window", *old[5:]),
            ]
            d["sample"]["weeklyAccepted"] = [5, 9, 12, 16, 18]
            d["sample"]["budget"] = {
                "approved": 60000,
                "spent": 42000,
                "remaining": 18000,
            }
            d["pages"][1]["blocks"][0:0] = [
                metrics(
                    ("3", "tracked risks"),
                    ("0", "new funding requested"),
                    ("25 Jun", "pilot review"),
                ),
                table(
                    ["Risk / owner", "Trigger", "Response"],
                    [
                        [
                            "Identity / Maya",
                            "Access arrives after 22 June",
                            "Reviewed password fallback",
                        ],
                        [
                            "Content / Lena",
                            "Help copy not signed off",
                            "Limit pilot to reviewed flows",
                        ],
                        [
                            "Support / Sam",
                            "More than 5 pilot incidents",
                            "Pause new invitations",
                        ],
                    ],
                    [28, 34, 38],
                ),
                h("What success looks like"),
                p(
                    "Invite 20 customers, observe setup completion and review support handoffs. The sponsor receives a recorded go / revise / pause recommendation after the 25 June acceptance review."
                ),
            ]
        elif k == "legal":
            d["pages"][0]["blocks"].insert(
                0,
                metrics(
                    ("3", "chronology events"),
                    ("4", "review questions"),
                    ("0", "notices sent"),
                ),
            )
            d["pages"][1]["blocks"][-2:] = [
                h("Recorded disposition"),
                p(
                    "Avery Kim will collect the signed agreement and delivery evidence by 24 June. Counsel has not approved an exit date or a notice. The sample deliberately preserves that uncertainty."
                ),
                call(
                    "REVIEW BOUNDARY",
                    "A polished chronology is not proof of the underlying record. Each event remains tagged by evidence status; no jurisdiction-specific conclusion is supplied.",
                ),
            ]
            d["pages"][1]["blocks"] = [
                b
                for b in d["pages"][1]["blocks"]
                if not (b["type"] == "h" and b["text"] == "Review and disposition")
            ]
            d["sample"]["evidence"] = [
                {
                    "id": "E-01",
                    "item": "Onboarding email",
                    "date": "2027-02-03",
                    "status": "Fictional chronology reference",
                },
                {
                    "id": "E-02",
                    "item": "Support ticket",
                    "date": "2027-05-07",
                    "status": "Fictional chronology reference",
                },
                {
                    "id": "E-03",
                    "item": "Internal instruction",
                    "date": "2027-06-15",
                    "status": "Fictional chronology reference",
                },
            ]
        elif k == "business":
            d["pages"][0]["blocks"].insert(
                1,
                metrics(
                    ("4 weeks", "engagement"),
                    ("6 screens", "annotated prototype"),
                    ("$12,000", "fixed sample fee"),
                ),
            )
            d["pages"][1]["blocks"] = [
                chart(
                    "Payment follows delivery",
                    [("Kickoff", 4800), ("Prototype", 4800), ("Handover", 2400)],
                    "bar",
                    "USD",
                ),
                *d["pages"][1]["blocks"][:6],
                h("The decision"),
                p(
                    "Alder Studio sponsor Priya Shah and Northstar lead Maya Chen review scope on 25 June. Proposed kickoff: 5 July. Acceptance is a recorded review of the agreed deliverables, not an automatic consequence of payment."
                ),
            ]
            d["sample"]["payments"] = [
                {"milestone": "Kickoff", "percent": 40, "usd": 4800},
                {"milestone": "Prototype", "percent": 40, "usd": 4800},
                {"milestone": "Handover", "percent": 20, "usd": 2400},
            ]
            d["pages"][1]["blocks"].insert(
                -2,
                p(
                    "Acceptance covers six annotated screens, the welcome email outline, a working prototype and two team sessions. The lead records acceptance or specific scope-related corrections."
                ),
            )
        elif k == "fun":
            d["pages"][0]["blocks"].insert(
                1,
                metrics(
                    ("24", "places planned"),
                    ("4", "game stations"),
                    ("1", "glorious final round"),
                ),
            )
            d["pages"].append(
                page(
                    "The host playbook",
                    p(
                        "A little planning keeps the evening easy. These are fictional RSVPs, not real people or dietary guarantees."
                    ),
                    table(
                        ["Team", "Guests", "First station", "Food notes"],
                        [
                            ["Comets", "6", "Word relay", "1 dairy-free request"],
                            ["Fireflies", "6", "Card table", "2 vegetarian requests"],
                            ["Orbit", "6", "Puzzle corner", "1 nut-avoidance request"],
                            [
                                "Wildcards",
                                "6",
                                "Cooperative quest",
                                "No requests recorded",
                            ],
                        ],
                        [22, 12, 31, 35],
                    ),
                    h("Station rotation"),
                    table(
                        ["Round", "Time", "Play"],
                        [
                            ["1", "19:00–19:25", "Start at the assigned station"],
                            ["2", "19:30–19:55", "Rotate clockwise"],
                            ["3", "20:00–20:25", "Choose a favorite"],
                            ["Final", "20:40–21:10", "Whole-room team challenge"],
                        ],
                    ),
                    call(
                        "GOOD HOSTING",
                        "Confirm food needs directly, keep packaging available and ask before sharing photos. A quiet room and beginner-friendly rules are part of the plan.",
                    ),
                    p(
                        "Shopping plan: 8 pizzas, 24 reusable cups, 3 pitchers of lemonade and 4 snack bowls. Review quantities against the final guest list."
                    ),
                )
            )
            d["sample"]["guestCount"] = 24
            d["sample"]["stations"] = 4
        elif k == "family":
            d["sample"]["people"] = ["Alex", "Taylor", "Riley"]
            d["sample"]["weeklyMeals"] = [
                {"day": row[0], "meal": row[3]}
                for row in d["pages"][0]["blocks"][0]["rows"]
            ]
            d["pages"][0]["blocks"].insert(
                0,
                metrics(
                    ("7", "dinners planned"),
                    ("3", "shared owners"),
                    ("1", "calm place to check"),
                ),
            )
            d["pages"][0]["blocks"][-1] = call(
                "PLAN B IS STILL A PLAN",
                "Rain on Saturday? Picnic at the community hall. Alex updates Taylor before pickup. Keep emergency details in your private family record, not a public template.",
            )
        elif k == "presentation":
            d["pages"][0]["blocks"] = [
                metrics(
                    ("20", "pilot customers"),
                    ("4 weeks", "learning window"),
                    ("$6,000", "spend ceiling"),
                ),
                call(
                    "THE ASK",
                    "Approve a limited onboarding pilot with Maya Chen accountable for delivery. Keep the existing platform; test a clearer welcome sequence and one checklist.",
                ),
                h("A small bet with a visible exit"),
                p(
                    "The team needs evidence before committing to a full rollout. The pilot tests completion, time to first value and support handoffs. It does not promise a revenue result."
                ),
                table(
                    ["Today", "Pilot change", "Decision gate"],
                    [
                        [
                            "3 separate setup emails",
                            "1 sequenced checklist",
                            "Review after four weeks",
                        ],
                        [
                            "Ownership is unclear",
                            "Named success owner",
                            "No scope expansion without review",
                        ],
                    ],
                ),
            ]
            d["pages"][1]["blocks"].insert(
                0,
                chart(
                    "Sample baseline and pilot target",
                    [("Baseline", 55), ("Target", 80)],
                    "bar",
                    "completion percent",
                ),
            )
            d["sample"]["baselinePercent"] = 55
            d["sample"]["targetPercent"] = 80
            d["sample"]["targetsAreResults"] = False
        elif k == "school":
            d["pages"][0]["blocks"][0]["text"] = d["pages"][0]["blocks"][0][
                "text"
            ].replace("Teacher: Avery Kim", "Teacher: Jo Lee")
            rows = [
                {
                    "plant": g + str(i + 1),
                    "lightHours": hours,
                    "day0": round(2 + i * 0.1, 1),
                    "day7": round(middle + i * 0.1, 1),
                    "day14": round(final + i * 0.1, 1),
                }
                for g, hours, middle, final in [("A", 4, 4.3, 7.1), ("B", 8, 4.9, 8.1)]
                for i in range(3)
            ]
            d["sample"]["measurements"] = rows
            d["pages"][1]["blocks"] = [
                chart(
                    "Mean height at day 14",
                    [("4 h/day", 7.2), ("8 h/day", 8.2)],
                    "bar",
                    "cm",
                ),
                table(
                    ["Plant", "Light hours", "Day 0 cm", "Day 7 cm", "Day 14 cm"],
                    [
                        [r["plant"], r["lightHours"], r["day0"], r["day7"], r["day14"]]
                        for r in rows
                    ],
                ),
                h("What the example suggests"),
                p(
                    "Group A grew from 2.1 to 7.2 cm on average. Group B grew from 2.1 to 8.2 cm. The difference in growth is 1.0 cm. With only three plants per group, this does not establish a general rule."
                ),
                call(
                    "BETTER EVIDENCE",
                    "Height can increase when a seedling stretches for light. Add leaf count, color observations and more plants before interpreting health. These measurements are synthetic, not an experiment performed by a student.",
                ),
            ]
        elif k == "marketing":
            d["pages"][0]["blocks"].insert(
                1,
                metrics(
                    ("120", "inquiry target"),
                    ("$3,000", "sample budget"),
                    ("31 days", "launch window"),
                ),
            )
            d["pages"][1]["blocks"] = [
                chart(
                    "Allocate by the job to be done",
                    [
                        ("Paid social", 1400),
                        ("Local print", 600),
                        ("Content", 700),
                        ("Reserve", 300),
                    ],
                    "bar",
                    "USD",
                ),
                table(
                    ["Week", "Asset", "Decision signal"],
                    [
                        [
                            "01",
                            "Menu story and launch email",
                            "Are people reaching the menu?",
                        ],
                        [
                            "02",
                            "Chef interview and neighborhood card",
                            "Are inquiry starts increasing?",
                        ],
                        [
                            "03",
                            "Midweek creative variation",
                            "Which message produces qualified interest?",
                        ],
                        [
                            "04",
                            "Retrospective and follow-up",
                            "What should be retained?",
                        ],
                    ],
                    [14, 42, 44],
                ),
                h("Measure the actual journey"),
                p(
                    "Synthetic funnel: 8,000 landing visits → 1,200 menu opens → 180 inquiry starts → 120 completed inquiries. Completion is 1.5% of visits and 66.7% of starts. An inquiry is not a confirmed booking."
                ),
                call(
                    "SPEND WITH A QUESTION",
                    "If the menu attracts attention but the form loses people, improve the form before buying more traffic. Targets and illustrative funnel values are not forecasts.",
                ),
            ]
            d["sample"]["funnel"] = {
                "visits": 8000,
                "menuOpens": 1200,
                "starts": 180,
                "inquiries": 120,
            }
            d["sample"]["budget"] = {
                "paidSocial": 1400,
                "print": 600,
                "content": 700,
                "reserve": 300,
            }
        elif k == "restaurant":
            d["pages"][0]["blocks"] = d["pages"][0]["blocks"][:5]
            d["pages"].append(
                page(
                    "Stay for something sweet",
                    h("The final course"),
                    table(
                        ["Dish", "Preparation", "Price"],
                        [
                            ["Pear and almond", "Warm pear, almond crumb, cream", "11"],
                            [
                                "Dark chocolate",
                                "Chocolate crémeux, olive oil, sea salt",
                                "12",
                            ],
                            ["Seasonal sorbet", "Three scoops, citrus zest", "9"],
                        ],
                        [28, 59, 13],
                    ),
                    h("A glass alongside"),
                    table(
                        ["Drink", "Character", "Price"],
                        [
                            [
                                "Garden spritz",
                                "Citrus, rosemary, sparkling water · alcohol-free",
                                "9",
                            ],
                            [
                                "Orchard cordial",
                                "Apple, chamomile, soda · alcohol-free",
                                "8",
                            ],
                            [
                                "House white",
                                "150 ml · dry and crisp · contains alcohol",
                                "12",
                            ],
                        ],
                        [28, 59, 13],
                    ),
                    call(
                        "AT YOUR TABLE",
                        "Tell the team about allergies before ordering. Recipe labels do not guarantee freedom from cross-contact. Menu, pricing and service details are fictional; confirm them before real use.",
                    ),
                    p(
                        "Wednesday–Sunday • 17:30–22:00\n42 Orchard Lane, Sampletown • hello@example.com\nIllustrative prices in USD. Confirm the operator’s tax and service policy."
                    ),
                )
            )
            d["sample"]["menuItems"] = 12
            d["sample"]["currency"] = "USD"
        elif k == "technical":
            d["pages"][0]["blocks"].insert(
                1,
                metrics(
                    ("6", "attempt maximum"),
                    ("10 sec", "request timeout"),
                    ("24 hr", "retry window"),
                ),
            )
            d["pages"][1]["blocks"] = [
                chart(
                    "Synthetic delivery outcomes",
                    [
                        ("First try", 960),
                        ("Retry", 35),
                        ("Held", 5),
                    ],
                    "bar",
                    "events",
                ),
                table(
                    ["Fixture", "Expected behavior", "Sample outcome"],
                    [
                        [
                            "Duplicate event",
                            "Consumer deduplicates stable event_id",
                            "1 business action",
                        ],
                        [
                            "HTTP 429",
                            "Respect bounded retry schedule",
                            "Delivered on attempt 3",
                        ],
                        ["HTTP 400", "Stop and request configuration review", "Held"],
                        ["Private destination", "Reject before dispatch", "Blocked"],
                        ["Worker restart", "Replay durable outbox", "No missing event"],
                    ],
                    [25, 48, 27],
                ),
                h("Release gate"),
                p(
                    "Replay 1,000 synthetic events. 960 succeed first time, 35 after retry and 5 remain held for review: 99.5% eventually delivered in this fixture, not a production SLO."
                ),
                call(
                    "ROLL BACK SAFELY",
                    "Pause new dispatch and retain the outbox and attempt history. Never log signing secrets. Expand only after a measured pilot and operational review.",
                ),
            ]
            d["sample"]["delivery"] = {
                "firstAttempt": 960,
                "retriedSuccess": 35,
                "held": 5,
                "total": 1000,
            }
        chart_number = 0
        for pg in d["pages"]:
            for block in pg["blocks"]:
                if block["type"] == "chart":
                    chart_number += 1
                    block["asset"] = d["id"] + "-" + str(chart_number)
        d["sample"]["document"] = deepcopy(d["pages"])
        d["capabilities"] = {
            "professional": "Decision hierarchy, measured progress and owner-led action",
            "legal": "Evidence status, careful typography and review boundaries",
            "business": "Scope narrative, pricing visualization and acceptance criteria",
            "fun": "Expressive type, accessible event information and a host worksheet",
            "family": "Landscape planning, non-color ownership cues and print utility",
            "presentation": "Large type, strong contrast and decision-centered storytelling",
            "school": "Traceable synthetic observations, chart and uncertainty",
            "marketing": "Editorial emphasis, reconciled budget and funnel semantics",
            "restaurant": "Menu hierarchy, ingredient detail and dietary notes",
            "technical": "Monospace hierarchy, event data and failure-path design",
        }[k]
    for d in uis:
        d.update(UI_THEMES[d["layout"]])
        d["tint"] = "#EDEFF7"
        d["sample"] = {
            "fictional": True,
            "asOf": "2027-06-21T09:40:00",
            "seed": "dazzler-showcase-014",
            "scope": "Local demonstration only; resets on reload",
        }
        k = d["layout"]
        if k == "workspace":
            d["projects"] += [
                dict(name=n, client=c, owner=o, done=a, total=b, due=t, status=s)
                for n, c, o, a, b, t, s in [
                    (
                        "Accessibility review",
                        "Juniper",
                        "Lena Ortiz",
                        11,
                        16,
                        "30 Jun",
                        "On track",
                    ),
                    (
                        "Billing refresh",
                        "Metric",
                        "Sam Okafor",
                        7,
                        18,
                        "19 Jul",
                        "Planning",
                    ),
                    (
                        "Partner onboarding",
                        "Northstar",
                        "Alex Rivera",
                        14,
                        20,
                        "09 Jul",
                        "In review",
                    ),
                ]
            ]
            d["capacity"] = [
                {"team": n, "planned": v, "available": 40}
                for n, v in [
                    ("Design", 34),
                    ("Engineering", 38),
                    ("Content", 26),
                    ("Research", 30),
                ]
            ]
        elif k == "board":
            for i, (title, owner, stage, points) in enumerate(
                [
                    ("Test empty accounts", "Alex", "Ready", 2),
                    ("Clarify billing copy", "Sam", "Review", 2),
                    ("Add screen-reader status", "Maya", "In progress", 3),
                    ("Review mobile wrapping", "Alex", "Done", 2),
                    ("Prepare help article", "Sam", "Ready", 1),
                    ("Verify invitation expiry", "Maya", "Review", 3),
                ],
                47,
            ):
                d["tasks"].append(
                    dict(
                        id=f"ONB-{i}",
                        title=title,
                        owner=owner,
                        stage=stage,
                        points=points,
                        priority="Normal",
                    )
                )
            d["burndown"] = [22, 22, 20, 17, 14, 10, 8, 5, 2, 0]
        elif k == "settings":
            d["activity"] = [
                {
                    "device": "Desktop browser",
                    "location": "Sampletown",
                    "lastUsed": "Today 09:12",
                    "current": True,
                },
                {
                    "device": "Mobile browser",
                    "location": "Sampletown",
                    "lastUsed": "Yesterday 18:40",
                    "current": False,
                },
            ]
            d["notificationVolumes"] = [8, 5, 9, 3, 6, 2, 1]
        elif k == "revenue":
            d["sample"]["asOf"] = "2027-12-31T23:59:00"
            d["months"] += [
                dict(month=m, gross=g, refunds=r, orders=o)
                for m, g, r, o in [
                    ("Jul", 70000, 2100, 495),
                    ("Aug", 73500, 2200, 512),
                    ("Sep", 78000, 2300, 541),
                    ("Oct", 81500, 2450, 566),
                    ("Nov", 86000, 2580, 602),
                    ("Dec", 93000, 2790, 648),
                ]
            ]
            d["intro"] = "Full year 2027 • USD • Reconciled synthetic sales ledger"
            d["channels"] = [
                {"channel": "Subscriptions", "share": 62},
                {"channel": "Services", "share": 28},
                {"channel": "Add-ons", "share": 10},
            ]
        elif k == "operations":
            for i in range(12):
                d["tickets"].append(
                    dict(
                        id=f"SUP-{2047+i}",
                        subject=[
                            "Reset a team invitation",
                            "Reconcile payment reference",
                            "Update contact details",
                            "Review workspace access",
                        ][i % 4],
                        queue=["Access", "Billing", "Account"][i % 3],
                        priority=["High", "Normal", "Low"][i % 3],
                        age=[14, 72, 38, 95, 22, 11, 35, 49, 126, 18, 63, 7][i],
                        owner=["Maya", "Sam", "Alex"][i % 3],
                        status="Resolved" if i >= 10 else "Open",
                    )
                )
            d["arrivals"] = [12, 18, 24, 21, 16, 11, 8]
        elif k == "dining":
            d["producers"] = [
                {
                    "name": "Orchard plot",
                    "ingredient": "Pears and soft herbs",
                    "distanceKm": 18,
                },
                {
                    "name": "Mill House",
                    "ingredient": "Rye and wheat flour",
                    "distanceKm": 32,
                },
                {
                    "name": "Coast market",
                    "ingredient": "Daily fish selection",
                    "distanceKm": 46,
                },
            ]
            d["seats"] = 28
        elif k == "cafe":
            d["items"] += [
                dict(name=n, category=c, description=t, price=p)
                for n, c, t, p in [
                    ("Cocoa cloud", "Coffee", "Espresso, cocoa, steamed milk.", 5),
                    ("Cinnamon knot", "Bakery", "Soft dough, cinnamon sugar.", 4.25),
                    (
                        "Breakfast roll",
                        "Kitchen",
                        "Egg, cheddar, greens, soft bun.",
                        8.5,
                    ),
                    (
                        "Orange cooler",
                        "Cold drinks",
                        "Orange, sparkling water, ice.",
                        4.75,
                    ),
                    (
                        "Berry yogurt pot",
                        "Kitchen",
                        "Yogurt, berries and oat crunch.",
                        6,
                    ),
                    (
                        "Chocolate cookie",
                        "Bakery",
                        "Dark chocolate chunks, sea salt.",
                        3.75,
                    ),
                ]
            ]
            d["dailyBatch"] = {
                "pastriesBaked": 84,
                "coffeeGramsPerDose": 18,
                "samplePickupMinutes": [15, 20],
            }
        elif k == "reservations":
            d["rooms"] = [
                {
                    "id": "window",
                    "label": "Window tables",
                    "description": "Bright street-facing seats for two to four. A preference only, not a booking guarantee.",
                },
                {
                    "id": "quiet",
                    "label": "Quiet corner",
                    "description": "A calmer area away from the bar. Tell the team about access needs.",
                },
                {
                    "id": "social",
                    "label": "Shared table",
                    "description": "A convivial central table for small groups. All availability remains illustrative.",
                },
            ]
        elif k == "menu":
            d["items"] += [
                dict(name=n, category=c, description=t, price=p, vegan=v)
                for n, c, t, p, v in [
                    (
                        "Smoky bean bowl",
                        "Bowls",
                        "Black beans, corn, lime rice, salsa.",
                        18,
                        True,
                    ),
                    (
                        "Roasted carrot dip",
                        "Small plates",
                        "Carrot, cumin, seeded crackers.",
                        10,
                        True,
                    ),
                    (
                        "Herb chicken bowl",
                        "Bowls",
                        "Chicken, grains, greens, herb dressing.",
                        22,
                        False,
                    ),
                    ("Peach iced tea", "Drinks", "Black tea, peach, mint.", 5.5, True),
                    (
                        "Brown butter cookie",
                        "Dessert",
                        "Chocolate, brown butter, sea salt.",
                        5,
                        False,
                    ),
                    (
                        "Tomato and white bean salad",
                        "Small plates",
                        "White beans, tomato, basil.",
                        12,
                        True,
                    ),
                ]
            ]
            d["season"] = "Summer 2027"
            d["serviceWindow"] = "11:30–16:00"
        else:
            d["deliverables"] += [
                dict(
                    name="Type and color system",
                    version="v1",
                    status="Ready",
                    due="28 Jun",
                    description="Semantic color roles, typography scale and component states.",
                ),
                dict(
                    name="Responsive QA report",
                    version="v1",
                    status="Scheduled",
                    due="09 Jul",
                    description="Mobile layout, keyboard checks and content review evidence.",
                ),
            ]
    return docs, uis
