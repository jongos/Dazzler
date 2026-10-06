"""Purpose-built interface examples, with fictional data and local interactions."""

import html
import json
from template_features import ui_feature
from pathlib import Path

e = lambda x: html.escape(str(x), quote=True)


def cfg(id, category, layout, brand, title, intro, accent, tint, **extra):
    return dict(
        id=id,
        category=category,
        layout=layout,
        brand=brand,
        title=title,
        intro=intro,
        accent=accent,
        tint=tint,
        **extra,
    )


UIS = [
    cfg(
        "webapp-workspace",
        "general-webapp",
        "workspace",
        "Orbit",
        "Projects overview",
        "Monday, 21 June • Product & delivery team",
        "#354D93",
        "#EEF1FD",
        projects=[
            dict(
                name="Customer portal",
                client="Alder Studio",
                owner="Maya Chen",
                done=18,
                total=24,
                due="12 Jul",
                status="At risk",
            ),
            dict(
                name="Welcome sequence",
                client="Northstar",
                owner="Sam Okafor",
                done=9,
                total=12,
                due="28 Jun",
                status="In review",
            ),
            dict(
                name="Research library",
                client="Internal",
                owner="Alex Rivera",
                done=6,
                total=10,
                due="05 Jul",
                status="On track",
            ),
        ],
    ),
    cfg(
        "webapp-board",
        "general-webapp",
        "board",
        "Relay",
        "Onboarding sprint",
        "Sprint 08 • 21 June – 2 July • Goal: make first setup clearer",
        "#675037",
        "#F7F0E6",
        tasks=[
            dict(
                id="ONB-41",
                title="Map the first-login path",
                owner="Maya",
                stage="Done",
                points=3,
                priority="Normal",
            ),
            dict(
                id="ONB-42",
                title="Rewrite the welcome email",
                owner="Sam",
                stage="In progress",
                points=2,
                priority="Normal",
            ),
            dict(
                id="ONB-43",
                title="Handle an expired invite",
                owner="Alex",
                stage="Review",
                points=5,
                priority="High",
            ),
            dict(
                id="ONB-44",
                title="Add setup checklist events",
                owner="Alex",
                stage="In progress",
                points=3,
                priority="Normal",
            ),
            dict(
                id="ONB-45",
                title="Test keyboard-only setup",
                owner="Maya",
                stage="Ready",
                points=3,
                priority="High",
            ),
            dict(
                id="ONB-46",
                title="Document support handoff",
                owner="Sam",
                stage="Ready",
                points=2,
                priority="Normal",
            ),
        ],
    ),
    cfg(
        "webapp-settings",
        "general-webapp",
        "settings",
        "Forma",
        "Profile & preferences",
        "Manage how your team sees you and when you hear from us.",
        "#4E5673",
        "#F0F2F8",
        profile=dict(
            name="Alex Morgan",
            email="alex@example.com",
            role="Product designer",
            timezone="America/New_York",
            digest=True,
            mentions=True,
        ),
    ),
    cfg(
        "data-revenue",
        "data-visualization",
        "revenue",
        "Metric",
        "Revenue performance",
        "January–June 2027 • USD • Illustrative finance export",
        "#285A51",
        "#EDF6F1",
        months=[
            dict(month="Jan", gross=42000, refunds=1200, orders=310),
            dict(month="Feb", gross=46000, refunds=1400, orders=338),
            dict(month="Mar", gross=51000, refunds=1800, orders=367),
            dict(month="Apr", gross=54000, refunds=1500, orders=402),
            dict(month="May", gross=61000, refunds=2100, orders=441),
            dict(month="Jun", gross=66000, refunds=2000, orders=472),
        ],
    ),
    cfg(
        "data-operations",
        "data-visualization",
        "operations",
        "Signal",
        "Support command desk",
        "Snapshot • 21 June 2027, 09:40 • Sample service data",
        "#285775",
        "#EAF3FA",
        tickets=[
            dict(
                id="SUP-2041",
                subject="Account invitation expired",
                queue="Access",
                priority="High",
                age=47,
                owner="Maya",
                status="Open",
            ),
            dict(
                id="SUP-2042",
                subject="Invoice export missing June",
                queue="Billing",
                priority="Normal",
                age=31,
                owner="Sam",
                status="Open",
            ),
            dict(
                id="SUP-2043",
                subject="New teammate cannot sign in",
                queue="Access",
                priority="High",
                age=64,
                owner="Alex",
                status="Open",
            ),
            dict(
                id="SUP-2044",
                subject="Change workspace owner",
                queue="Account",
                priority="Normal",
                age=18,
                owner="Maya",
                status="Open",
            ),
            dict(
                id="SUP-2045",
                subject="Receipt address correction",
                queue="Billing",
                priority="Normal",
                age=12,
                owner="Sam",
                status="Open",
            ),
            dict(
                id="SUP-2046",
                subject="Notification preference question",
                queue="Account",
                priority="Low",
                age=8,
                owner="Alex",
                status="Open",
            ),
        ],
    ),
    cfg(
        "restaurant-fine-dining",
        "restaurant",
        "dining",
        "Juniper",
        "The season, at the table.",
        "A small dining room, a changing menu, and an evening with room to linger.",
        "#435036",
        "#F3F0E5",
        courses=[
            ["Garden", "Peas, soft herbs, fresh cheese and toasted rye"],
            ["Field", "Summer squash, white beans and sage"],
            ["Coast", "Market fish, fennel and lemon"],
            ["Orchard", "Warm pear, almond crumb and cream"],
        ],
    ),
    cfg(
        "restaurant-cafe",
        "restaurant",
        "cafe",
        "Daybreak",
        "Your usual, or something new.",
        "Order ahead for pickup • Sample café location",
        "#8C422B",
        "#FFF0E5",
        items=[
            dict(
                name="Flat white",
                category="Coffee",
                description="Double espresso, steamed milk, fine foam.",
                price=4.5,
            ),
            dict(
                name="Iced oat latte",
                category="Coffee",
                description="Espresso over ice with oat drink.",
                price=5.5,
            ),
            dict(
                name="Filter coffee",
                category="Coffee",
                description="Today’s batch, served black or with milk.",
                price=3.5,
            ),
            dict(
                name="Almond croissant",
                category="Bakery",
                description="Twice baked with almond cream.",
                price=4.5,
            ),
            dict(
                name="Morning bun",
                category="Bakery",
                description="Orange sugar and a soft, buttery center.",
                price=4,
            ),
            dict(
                name="Tomato toast",
                category="Kitchen",
                description="Sourdough, tomatoes, whipped ricotta, herbs.",
                price=9,
            ),
        ],
    ),
    cfg(
        "restaurant-reservations",
        "restaurant",
        "reservations",
        "The Long Table",
        "Make an evening of it.",
        "Request a table for dinner. We will show a summary before any next step.",
        "#6D3656",
        "#F9EDF3",
        times=["17:30", "18:00", "18:30", "19:00", "19:30", "20:00"],
    ),
    cfg(
        "restaurant-menu",
        "restaurant",
        "menu",
        "Olive & Grain",
        "Good food. Your kind of lunch.",
        "Bowls, small plates, something sweet. Served 11:30–16:00.",
        "#5E5A24",
        "#F7F4E5",
        items=[
            dict(
                name="Roasted vegetable bowl",
                category="Bowls",
                description="Brown rice, squash, chickpeas, tahini dressing.",
                price=18,
                vegan=True,
            ),
            dict(
                name="Green goddess bowl",
                category="Bowls",
                description="Herb rice, avocado, soft egg, yogurt dressing.",
                price=19,
                vegan=False,
            ),
            dict(
                name="Crisp potato plate",
                category="Small plates",
                description="Roasted potatoes, smoked paprika, lemon.",
                price=9,
                vegan=True,
            ),
            dict(
                name="Whipped feta",
                category="Small plates",
                description="Feta, roasted peppers, warm flatbread.",
                price=11,
                vegan=False,
            ),
            dict(
                name="Lemon olive oil cake",
                category="Dessert",
                description="Lemon syrup and thick cream.",
                price=8,
                vegan=False,
            ),
            dict(
                name="Seasonal fruit",
                category="Dessert",
                description="Fresh fruit with mint and citrus.",
                price=7,
                vegan=True,
            ),
            dict(
                name="Orange blossom tea",
                category="Drinks",
                description="Fragrant black tea, served hot or iced.",
                price=5,
                vegan=True,
            ),
            dict(
                name="House lemonade",
                category="Drinks",
                description="Lemon, a little sugar, sparkling water.",
                price=6,
                vegan=True,
            ),
        ],
    ),
    cfg(
        "business-portal",
        "generic-business",
        "business",
        "Northstar",
        "Alder Studio / Brand & website",
        "Your project room • Updated 18 June 2027",
        "#344D72",
        "#EDF2FA",
        deliverables=[
            dict(
                name="Brand direction",
                version="v2",
                status="Needs review",
                due="21 Jun",
                description="Positioning, voice and visual direction. Please confirm the preferred route.",
            ),
            dict(
                name="Homepage wireframe",
                version="v1",
                status="In progress",
                due="25 Jun",
                description="Structure and content hierarchy for the new homepage.",
            ),
            dict(
                name="Launch checklist",
                version="v1",
                status="Scheduled",
                due="08 Jul",
                description="Content, analytics and deployment checks before launch.",
            ),
        ],
    ),
]


def field(label, id, type="text", value="", options=None):
    input = (
        (
            '<select id="'
            + id
            + '" name="'
            + id
            + '">'
            + "".join("<option>" + e(o) + "</option>" for o in options)
            + "</select>"
        )
        if options
        else f'<input id="{id}" name="{id}" type="{type}" value="{e(value)}" required>'
    )
    return f'<div class="field"><label for="{id}">{e(label)}</label>{input}</div>'


def botanical():
    return (
        '<svg viewBox="0 0 420 480" role="img" aria-label="Original botanical illustration of a branch"><rect width="420" height="480" fill="#DDE2C8"/><path d="M204 440Q220 310 202 215T260 34" stroke="#435036" stroke-width="6" fill="none"/>'
        + "".join(
            f'<ellipse cx="{x}" cy="{y}" rx="53" ry="18" transform="rotate({a} {x} {y})" fill="{c}"/>'
            for x, y, a, c in [
                (174, 350, 34, "#7A875A"),
                (251, 310, -34, "#435036"),
                (170, 265, 32, "#435036"),
                (242, 217, -36, "#7A875A"),
                (197, 158, 34, "#7A875A"),
                (270, 106, -34, "#435036"),
            ]
        )
        + '<text x="30" y="445" fill="#435036" font-size="13" font-family="serif">SUMMER AT JUNIPER</text></svg>'
    )


def content(d):
    k = d["layout"]
    if k == "workspace":
        return """<div class="split"><section><div class="section-head"><h2>Active projects</h2><button data-dialog="project">New project</button></div><div class="filters"><label for="search">Search projects</label><input id="search" type="search" placeholder="Name, client or owner"></div><div id="projects"></div><p id="empty" hidden>No projects match this search.</p></section><aside class="rail"><h2>Your next decisions</h2><article><span class="pill warning">Due today</span><h3>Approve the invoice wording</h3><p>Customer portal • Finance review</p><a href="#projects">View project context</a></article><article><span class="pill">By Wednesday</span><h3>Confirm pilot participants</h3><p>20 customer accounts • Maya Chen</p></article><h2>Recent activity</h2><ol class="activity"><li><strong>Sam uploaded a review draft</strong><small>Welcome sequence • 09:10</small></li><li><strong>Alex completed two research tasks</strong><small>Research library • Yesterday</small></li></ol></aside></div>"""
    if k == "board":
        return """<div class="section-head"><div class="filters"><label for="owner-filter">Assignee</label><select id="owner-filter"><option>Everyone</option><option>Maya</option><option>Sam</option><option>Alex</option></select></div><button data-dialog="task">Add task</button></div><p id="board-summary" class="muted"></p><div class="board" id="board"></div><section class="note" id="sprint-notes"><h2>Sprint notes</h2><p>Keep tasks small enough to review in a day. High-priority cards cover access and keyboard usability. Move completed work through review before marking it done.</p></section>"""
    if k == "settings":
        return (
            """<div class="settings-layout"><nav class="subnav" aria-label="Settings"><a href="#profile">Profile</a><a href="#notifications">Notifications</a><a href="#regional">Regional settings</a></nav><form id="settings"><section class="panel" id="profile"><div class="person"><span class="avatar large">AM</span><div><h2>Alex Morgan</h2><p>Product designer • Member since March 2027</p></div></div><div class="form-grid">"""
            + field("Display name", "name", value="Alex Morgan")
            + field("Email address", "email", "email", "alex@example.com")
            + field("Role", "role", value="Product designer")
            + """</div></section><section class="panel" id="notifications"><h2>Keep me informed</h2><label class="check"><input type="checkbox" name="mentions" checked><span><strong>Mentions and replies</strong><small>When someone needs your input on a project.</small></span></label><label class="check"><input type="checkbox" name="digest" checked><span><strong>Weekly digest</strong><small>A Monday summary of activity across your workspace.</small></span></label></section><section class="panel" id="regional"><h2>Regional settings</h2><div class="form-grid">"""
            + field(
                "Time zone",
                "timezone",
                options=["America/New_York", "Europe/London", "Asia/Tokyo"],
            )
            + field("Week begins", "week", options=["Monday", "Sunday"])
            + """</div></section><div class="savebar"><span id="dirty">No unsaved changes</span><button type="reset" class="secondary">Discard changes</button><button>Save preferences</button></div></form></div>"""
        )
    if k == "revenue":
        return """<div class="section-head"><p>Net revenue = gross revenue less refunds. All amounts are USD.</p><div class="filters"><label for="period">Period</label><select id="period"><option value="all">First half 2027</option><option value="q1">Q1 · Jan–Mar</option><option value="q2">Q2 · Apr–Jun</option></select><button data-action="download">Export CSV</button></div></div><div id="revenue-metrics" class="metrics"></div><section class="panel"><div class="section-head"><h2>Monthly net revenue</h2><span class="pill">After refunds</span></div><div id="revenue-chart" class="revenue-chart"></div><p class="muted">Bars begin at zero. Exact values are shown below and in the export.</p></section><section class="panel" id="source-data"><h2>Revenue reconciliation</h2><div class="table-wrap" id="revenue-table"></div></section>"""
    if k == "operations":
        return """<div class="metrics" id="ops-metrics"></div><div class="split"><section class="panel"><div class="section-head"><h2>Open work</h2><label class="check"><input id="show-resolved" type="checkbox">Include resolved</label></div><div class="filters"><label for="queue">Queue</label><select id="queue"><option>All queues</option><option>Access</option><option>Billing</option><option>Account</option></select><button data-action="download">Export queue</button></div><div id="tickets"></div></section><aside class="rail"><h2>Queue health</h2><div id="queue-health"></div><section class="note"><h3>Response target</h3><p>High priority: first response within 30 minutes. Normal: within 60 minutes. Low: within 120 minutes.</p><p>Age is fixed at this sample snapshot. Resolving a ticket updates this preview only.</p></section></aside></div>"""
    if k == "dining":
        return (
            '<section class="dining-hero"><div><p class="eyebrow">DINNER AT JUNIPER</p><h1>The season,<br>at the table.</h1><p class="intro">'
            + e(d["intro"])
            + '</p><a class="button" href="#visit">Plan your evening</a><p class="service">Wednesday–Sunday<br>17:30–22:00</p></div><figure>'
            + botanical()
            + '<figcaption>Our kitchen follows what the season brings.</figcaption></figure></section><section class="tasting" id="menu"><div><p class="eyebrow">THE SUMMER MENU</p><h2>Four courses.<br>One unhurried evening.</h2><p>$85 per person • Illustrative menu</p><p>A vegetable-led journey with a fish course. Speak with the team about dietary needs before requesting a table.</p></div><ol>'
            + "".join(
                "<li><span>"
                + str(i + 1).zfill(2)
                + "</span><div><h3>"
                + e(name)
                + "</h3><p>"
                + e(desc)
                + "</p></div></li>"
                for i, (name, desc) in enumerate(d["courses"])
            )
            + '</ol></section><section class="visit" id="visit"><h2>Come as you are.</h2><div><p>42 Orchard Lane, Sampletown<br>Fictional venue for this template</p><p>For a table, contact hello@example.com.<br>Allow around two hours for the menu.</p></div><div><p>Step-free entry at the front door.<br>Add verified access details before use.</p><p>Service-charge and tax policy: confirm with the operator.</p></div></section>'
        )
    if k == "cafe":
        return """<div class="pickup-strip"><span><strong>Daybreak • Market Street</strong><small>Fictional café location</small></span><span>Pickup in about 15–20 min<br><small>Sample estimate, not live availability</small></span></div><div class="cafe-heading"><p class="eyebrow">ORDER A LITTLE BRIGHTER</p><h1>Your usual,<br>or something new.</h1><p>Coffee, something warm, and a good start to the day.</p></div><div class="order-layout"><section><div class="filters" id="menu-filters"></div><div class="product-grid" id="products"></div></section><aside class="order" id="order"><p class="eyebrow">PICKUP ORDER</p><h2>Your morning</h2><div id="cart-lines"></div><div class="total"><span>Subtotal</span><strong id="subtotal">$0.00</strong></div><p class="muted">USD • Taxes or service fees are not calculated in this preview.</p><button data-action="cart" class="wide">Review pickup order</button><button data-action="clear" class="text-button">Clear order</button></aside></div>"""
    if k == "reservations":
        return (
            """<div class="reservation-layout"><section><p class="eyebrow">THE LONG TABLE</p><h1>Make an<br>evening of it.</h1><p class="intro">Dinner is better with something to look forward to.</p><div class="booking-notes"><h2>Before you book</h2><p>Dinner • Tuesday–Saturday<br>17:30–22:00</p><p>Tables of up to six can use this form. For larger groups, contact the restaurant directly.</p><p>Please include access or dietary needs in your request. The team must confirm that it can accommodate them.</p><p class="muted">18 Lantern Row, Sampletown<br>Fictional restaurant details.</p></div></section><form id="reservation" class="booking-card"><p class="step">01 / YOUR VISIT</p><h2>Find a time that suits you</h2><div class="form-grid">"""
            + field("Date", "date", "date")
            + field("Guests", "guests", options=["2", "1", "3", "4", "5", "6"])
            + """</div><fieldset><legend>Preferred time</legend><div class="time-slots">"""
            + "".join(
                f'<label><input type="radio" name="time" value="{time}" required><span>{time}</span></label>'
                for time in d["times"]
            )
            + """</div></fieldset><p class="muted">Sample time options; no live availability is checked.</p><p class="step">02 / YOUR DETAILS</p><div class="form-grid">"""
            + field("Full name", "guest")
            + field("Email", "guest-email", "email")
            + """</div><div class="field"><label for="booking-note">Anything we should know? <small>Optional</small></label><textarea id="booking-note" maxlength="500" placeholder="Dietary needs, access needs or a special occasion"></textarea></div><button class="wide">Review request</button><p class="muted">This demo shows a request summary. It does not reserve a table or send your information.</p></form></div>"""
        )
    if k == "menu":
        return """<header class="menu-heading"><p class="eyebrow">OLIVE & GRAIN • LUNCH</p><h1>Good food.<br>Your kind of lunch.</h1><p>Served 11:30–16:00 • Dine in or take away</p></header><div class="menu-tools"><div class="filters" id="menu-filters"></div><div class="filters"><label for="menu-search">Find a dish</label><input id="menu-search" type="search" placeholder="Ingredient or dish name"><label class="check"><input type="checkbox" id="vegan">Vegan recipes</label></div></div><div class="menu-grid" id="products"></div><p id="menu-empty" hidden>No dishes match. Try another category or clear the filters.</p><aside class="allergen"><h2>A note on dietary needs</h2><p>V marks a vegan recipe in this sample menu. It is not an allergen or cross-contact guarantee. Speak with the restaurant team before ordering. Prices are illustrative USD; confirm local tax and service information.</p></aside>"""
    return """<div class="client-banner"><div><p class="eyebrow">NEXT STEP • BY 21 JUNE</p><h2>Your brand direction is ready to review.</h2><p>Choose a direction or leave a revision note so we can move into page design.</p><a class="button" href="#deliverables">Review deliverables</a></div><div class="project-facts"><strong>Project 027</strong><span>4-week engagement</span><span>Target handover • 12 July</span><span>Lead • Maya Chen</span></div></div><div class="split"><section id="deliverables"><h2>Deliverables and decisions</h2><div id="deliverable-list"></div><section class="panel" id="billing"><h2>Billing schedule</h2><div class="table-wrap"><table><thead><tr><th>Milestone</th><th>USD</th><th>Status</th></tr></thead><tbody><tr><td>Kickoff • 40%</td><td>$4,800</td><td>Paid</td></tr><tr><td>Prototype review • 40%</td><td>$4,800</td><td>Upcoming</td></tr><tr><td>Handover • 20%</td><td>$2,400</td><td>Not yet due</td></tr></tbody></table></div></section></section><aside class="rail"><h2>Your project team</h2><div class="person"><span class="avatar">MC</span><div><strong>Maya Chen</strong><small>Project lead</small></div></div><p>Weekly review • Tuesday, 10:00<br>Reply window • Two working days</p><button data-dialog="update">Draft an update request</button><h2>Project timeline</h2><ol class="activity"><li><strong>Discovery completed</strong><small>14 June</small></li><li><strong>Brand direction review</strong><small>Now • your feedback needed</small></li><li><strong>Website prototype</strong><small>25 June</small></li><li><strong>Handover</strong><small>12 July</small></li></ol></aside></div>"""


def build_ui(d, folder):
    folder.mkdir(parents=True, exist_ok=True)
    k = d["layout"]
    restaurant = d["category"] == "restaurant"
    nav = {
        "workspace": [("Projects", "#projects"), ("Decisions", "#main")],
        "board": [("Board", "#board"), ("Sprint notes", "#sprint-notes")],
        "settings": [("Profile", "#profile"), ("Notifications", "#notifications")],
        "revenue": [("Overview", "#main"), ("Source data", "#source-data")],
        "operations": [("Queue", "#tickets"), ("Health", "#queue-health")],
        "dining": [("Menu", "#menu"), ("Visit", "#visit")],
        "cafe": [("Order", "#products"), ("Your bag", "#order")],
        "reservations": [("Your visit", "#reservation"), ("Restaurant", "#main")],
        "menu": [("Menu", "#products"), ("Dietary notes", ".allergen")],
        "business": [("Deliverables", "#deliverables"), ("Billing", "#billing")],
    }[k]
    nav = [
        (name, "#dietary" if target == ".allergen" else target) for name, target in nav
    ]
    links = "".join(f'<a href="{target}">{name}</a>' for name, target in nav)
    data = {
        **d,
        "schemaVersion": 2,
        "license": "Apache-2.0",
        "creator": "Jon Gosier",
        "demo": True,
        "persistence": "memory only",
        "customization": "Edit content/data here and synchronize the embedded template-data JSON. The local runtime derives interactive figures and lists from that data. Layout/copy live in HTML/CSS.",
    }
    encoded = json.dumps(data, ensure_ascii=False, indent=2).replace("<", "\\u003c")
    css = (Path(__file__).with_name("template_styles.css")).read_text(encoding="utf-8")
    css = (
        f"@import url('../../fonts/fonts.css');\n:root{{--accent:{d['accent']};--tint:{d['tint']};--secondary:{d['secondary']};--bright:{d['bright']};--paper:{d['paper']};--display:'{d['headingFont']}';}}\n"
        + css
        + Path(__file__)
        .with_name("template_showcase_ui.css")
        .read_text(encoding="utf-8")
    )
    css += (
        Path(__file__).with_name("template_ui_refresh.css").read_text(encoding="utf-8")
    )
    (folder / "styles.css").write_text(css, encoding="utf-8")
    (folder / "template.json").write_text(
        json.dumps(data, indent=2) + "\n", encoding="utf-8"
    )
    title = (
        ""
        if restaurant
        else '<header class="page-title"><p class="eyebrow">'
        + e(d["brand"])
        + " / "
        + e(k.upper())
        + "</p><h1>"
        + e(d["title"])
        + "</h1><p>"
        + e(d["intro"])
        + "</p></header>"
    )
    body = content(d).replace(
        '<aside class="allergen">', '<aside class="allergen" id="dietary">'
    )
    body += ui_feature(d)
    body = body.replace("First half 2027", "Full year 2027").replace(
        '<option value="q2">Q2 · Apr–Jun</option>',
        '<option value="q2">Q2 · Apr–Jun</option><option value="q3">Q3 · Jul–Sep</option><option value="q4">Q4 · Oct–Dec</option>',
    )
    import subprocess

    script = subprocess.check_output(
        ["node", str(Path(__file__).with_name("build_template_interactions.mjs")), k],
        text=True,
        encoding="utf-8",
    )
    page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(d['brand'])} — {e(d['title'])}</title><link rel="stylesheet" href="styles.css"></head><body class="template-{k} {'restaurant' if restaurant else 'app'}"><a class="skip" href="#main">Skip to content</a><div class="demo">FICTIONAL WORKED TEMPLATE · Local preview · No information is sent</div><header class="top"><a class="brand" href="#main">{e(d['brand'])}<span class="brand-dot"></span></a><nav aria-label="Main navigation">{links}</nav>{'<span class="avatar" aria-label="Alex Morgan">AM</span>' if not restaurant else '<span class="top-note">'+('Dinner, slowly.' if k=='dining' else 'Made for good company.')+'</span>'}</header><main id="main">{title}{body}<p id="status" class="status" role="status" aria-live="polite"></p></main><footer class="site-footer"><span>{e(d['brand'])} · Fictional example by Dazzler</span><details><summary>Template notes</summary><p>All names, contact details, dates, prices and figures are illustrative. Actions update this page only and reset on reload. Original layout/code: Jon Gosier, Apache-2.0. Bundled fonts retain their notices.</p><p>Design system: {e(d["voice"])}. Local fonts, synthetic data, responsive layout, print styles and working preview states demonstrate Dazzler.</p></details></footer><dialog id="edit-dialog"><form id="edit-form"><h2 id="dialog-title">Add details</h2><div id="dialog-content"></div><label id="entry-label" for="entry">Details</label><input id="entry" maxlength="160"><div class="dialog-actions"><button type="button" id="cancel" class="secondary">Cancel</button><button id="dialog-save">Save preview</button></div></form></dialog><script id="template-data" type="application/json">{encoded}</script><script>{script}</script></body></html>"""
    (folder / "index.html").write_text(page, encoding="utf-8")
