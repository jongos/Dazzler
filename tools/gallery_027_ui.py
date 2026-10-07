"""Ten task-specific interfaces authored for the October gallery."""

from gallery_027 import OUT, STAGE, BASE, esc, heading
import json

U = []


def add(id, title, prompt, accent, paper, font, body, css, js, data, action):
    U.append(
        dict(
            id=id,
            title=title,
            prompt=prompt,
            accent=accent,
            paper=paper,
            font=font,
            body=body,
            css=css,
            js=js,
            data=data,
            action=action,
        )
    )


add(
    "webapp-workspace",
    "Margin Writing Room",
    "Build a fictional writing workspace around the manuscript itself, with a narrow chapter index and an editorial note rail. Warm paper and literary type should support sustained writing. Make word count and saving a local draft work; no fake collaborative service.",
    "#553C2E",
    "#F5F0E5",
    "Young Serif",
    """<div class="writer"><aside class="chapters"><p class="kicker">MARGIN / DRAFT 04</p><h2>Chapter Index</h2><ol><li>At the River</li><li>The Returning Path</li><li>What We Kept</li></ol><p class="small">Local Writing Demo</p></aside><section class="manuscript"><p class="kicker">CHAPTER 01</p><h1>At the River</h1><label for="draft">Manuscript</label><textarea id="draft" spellcheck="true">The river had changed its course since we last walked this bank. Where the old path ended, a narrow bridge now joined the two neighborhoods. We crossed slowly, reading the marks left by the winter water.\n\nOn the far side, someone had planted a row of willows. Their roots held the edge of the new path.</textarea><div class="actions"><button id="save">Save Draft Locally</button><span id="count"></span></div><p id="status" role="status" class="status"></p></section><aside class="notes"><h2>Editorial Note</h2><blockquote>Let the landscape carry the change.</blockquote><p>Keep the opening concrete. Introduce the narrator's reason for returning after the bridge.</p><details><summary>Revision Checklist</summary><p>Clarify the time jump. Retain the willow image. Read the final sentence aloud.</p></details></aside></div>""",
    """.writer{display:grid;grid-template-columns:170px minmax(0,1fr) 230px;gap:40px}.chapters ol{padding-left:20px;line-height:2.5}.manuscript h1{font-size:4.5rem}.manuscript textarea{font:22px/1.8 "Young Serif";width:100%;min-height:370px;background:transparent;border:0;border-bottom:1px solid #553c2e;padding:0;resize:vertical}.notes{border-left:1px solid #553c2e50;padding-left:25px}.notes h2{font-size:1.2rem}#count{font-size:13px;align-self:center}@media(max-width:900px){.writer{grid-template-columns:1fr}.chapters ol{display:flex;gap:28px;flex-wrap:wrap}.notes{border-left:0;border-top:1px solid;padding:20px 0}}""",
    """const draft=document.querySelector('#draft'),count=document.querySelector('#count');try{const saved=localStorage.getItem('dazzler-margin-draft');if(saved!==null)draft.value=saved}catch{}const update=()=>count.textContent=draft.value.trim().split(/\\s+/).filter(Boolean).length+' words';draft.addEventListener('input',update);update();document.querySelector('#save').onclick=()=>{try{localStorage.setItem('dazzler-margin-draft',draft.value);document.querySelector('#status').textContent='Draft saved in this browser.'}catch{document.querySelector('#status').textContent='Local storage is unavailable; keep a copy of your text.'}};""",
    {"chapter": "At the River", "mode": "local manuscript"},
    "Save Draft Locally",
)

add(
    "webapp-board",
    "Signal Production Board",
    "Create a fictional audio-production board whose workflow is visible as three horizontal lanes rather than a conventional card kanban. Use broadcast yellow and charcoal, clear owners and stage labels. A Move Forward action must update a task stage and the completion count.",
    "#34312B",
    "#FFF2B8",
    "Archivo",
    """<header class="board-title"><div><p class="kicker">SIGNAL / EPISODE 08</p><h1>From Tape<br>to Release</h1></div><p class="lead">A production rhythm for<br><strong>The Night Shift</strong><br><span id="done">1 of 4 ready</span></p></header><div class="lane-labels"><span>Assignment</span><span>Owner</span><span>Stage</span><span>Next Action</span></div><div id="tasks"></div><p class="status" role="status" id="status"></p><section class="board-foot"><h2>Release Window</h2><p>Friday, 16:00. Fact check and transcript approval are required before publication. Actions in this demo update only the local board.</p></section>""",
    """.board-title{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:45px}.board-title h1{text-transform:uppercase;font-size:clamp(3.5rem,7vw,7rem)}.lane-labels,.task{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:20px;align-items:center}.lane-labels{font-size:12px;text-transform:uppercase;letter-spacing:.1em}.task{padding:24px 0;border-top:2px solid #34312b}.task h2{font-size:1.3rem;margin:0}.task button{font-size:13px}.stage{font-weight:700}.board-foot{max-width:650px;margin-top:45px}@media(max-width:700px){.board-title{display:block}.lane-labels{display:none}.task{grid-template-columns:1fr 1fr}}""",
    """const tasks=[['Opening Mix','Ari','Edit'],['Fact Check','Noor','Review'],['Transcript','Sam','Review'],['Artwork','Dee','Ready']];function paint(){document.querySelector('#tasks').innerHTML=tasks.map((t,i)=>`<section class="task"><h2>${t[0]}</h2><span>${t[1]}</span><span class="stage">${t[2]}</span><button data-index="${i}" ${t[2]==='Ready'?'disabled':''}>${t[2]==='Ready'?'Complete':'Move Forward'}</button></section>`).join('');document.querySelector('#done').textContent=tasks.filter(t=>t[2]==='Ready').length+' of 4 ready'}paint();document.querySelector('#tasks').onclick=e=>{const b=e.target.closest('button');if(!b)return;const t=tasks[Number(b.dataset.index)];t[2]=t[2]==='Edit'?'Review':'Ready';paint();document.querySelector('#status').textContent=t[0]+' moved to '+t[2]+'.'};""",
    {
        "tasks": [
            ["Opening Mix", "Ari", "Edit"],
            ["Fact Check", "Noor", "Review"],
            ["Transcript", "Sam", "Review"],
            ["Artwork", "Dee", "Ready"],
        ]
    },
    "Move Forward",
)

add(
    "webapp-settings",
    "Still Notification Studio",
    "Design a fictional notification-settings interface centered on choosing a daily rhythm. Use a quiet blue field and a large schedule dial made from typography, not generic settings cards. Support a digest-time selector, three channel toggles and a save confirmation.",
    "#173F71",
    "#EAF1FC",
    "Work Sans",
    """<div class="settings"><header><p class="kicker">STILL / YOUR WORKING RHYTHM</p><h1>Make Room<br>for Focus</h1><p class="lead">Keep urgent messages visible.<br>Let the rest arrive together.</p><div class="clock"><span id="time">09:00</span><small>DAILY DIGEST</small></div></header><form id="settings"><h2>Choose Your Rhythm</h2><label for="digest">Digest Time</label><select id="digest"><option value="09:00">09:00 · Start of Day</option><option value="13:00">13:00 · After Lunch</option><option value="17:00">17:00 · End of Day</option></select><fieldset><legend>Delivery Channels</legend><label><input type="checkbox" checked> Mentions and Replies</label><label><input type="checkbox" checked> Weekly Summary</label><label><input type="checkbox"> Product Announcements</label></fieldset><p class="small">Times use your selected local schedule. This demo does not send notifications.</p><button>Save Preferences</button><p role="status" id="status" class="status"></p></form></div>""",
    """.settings{display:grid;grid-template-columns:1.2fr 1fr;gap:90px}.clock{border:2px solid #173f71;border-radius:50%;width:250px;height:250px;display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:35px}.clock span{font-size:4rem;font-variant-numeric:tabular-nums}.clock small{letter-spacing:.15em}form{padding-top:30px}select{width:100%;margin:14px 0 30px}fieldset{border:0;border-top:1px solid #173f71;padding:22px 0}fieldset label{padding:15px 0}input[type=checkbox]{width:20px;height:20px;vertical-align:middle;margin-right:12px}@media(max-width:800px){.settings{grid-template-columns:1fr;gap:20px}.clock{width:180px;height:180px}.clock span{font-size:3rem}}""",
    """document.querySelector('#digest').onchange=e=>document.querySelector('#time').textContent=e.target.value;document.querySelector('#settings').onsubmit=e=>{e.preventDefault();document.querySelector('#status').textContent='Preferences applied to this preview. Digest: '+document.querySelector('#digest').value+'.'};""",
    {"digestTimes": ["09:00", "13:00", "17:00"], "channels": 3},
    "Save Preferences",
)

add(
    "data-revenue",
    "Common Ground Membership Observatory",
    "Build a fictional membership revenue explorer whose main surface is an annual chart, not KPI cards. Use ink blue, coral and cream. Switch between revenue and member counts with accurate axes, exact values and a data table. Make the selected metric visually and programmatically clear.",
    "#123E59",
    "#F8F3E8",
    "Young Serif",
    """<header class="observatory"><p class="kicker">COMMON GROUND / ANNUAL OBSERVATORY</p><h1>A Community<br>That Keeps Growing</h1><p class="lead">Six years of membership, seen through two measures.</p></header><div class="actions" aria-label="Chart Metric"><button data-metric="revenue" aria-pressed="true">Revenue</button><button data-metric="members" aria-pressed="false">Members</button></div><figure class="chart-field"><figcaption id="chart-title">Membership Revenue · USD Thousands</figcaption><div id="chart"></div></figure><p id="status" role="status"></p><details open><summary>Exact Values and Notes</summary><div id="values"></div><p class="small">Synthetic annual observations. Revenue and membership are separate measures; this chart does not establish causality.</p></details>""",
    """.observatory{max-width:850px}.chart-field{margin:35px 0;background:#123E59;color:white;padding:32px}.chart-field figcaption{font-size:14px;margin-bottom:25px}.bars{display:grid;grid-template-columns:repeat(6,1fr);gap:18px;align-items:end;height:320px;border-bottom:1px solid #ffffff70}.bar{display:flex;flex-direction:column;justify-content:end;text-align:center;height:100%;font-size:13px}.bar i{display:block;background:#E79F84;min-height:2px}.bar strong{margin-bottom:8px}.bar span{margin-top:12px}button[aria-pressed=true]{background:#123e59;color:white}@media(max-width:700px){.chart-field{padding:22px 12px}.bars{gap:7px;height:300px}.bar{font-size:11px}}""",
    """const series={revenue:[84,98,121,143,168,192],members:[210,245,302,357,420,480]},years=[2021,2022,2023,2024,2025,2026];function draw(metric){const a=series[metric],max=metric==='revenue'?200:500;document.querySelector('#chart-title').textContent=metric==='revenue'?'Membership Revenue · USD Thousands · Scale 0–200':'Members · People · Scale 0–500';document.querySelector('#chart').innerHTML='<div class="bars">'+a.map((v,i)=>`<div class="bar"><strong>${v}</strong><i style="height:${v/max*240}px"></i><span>${years[i]}</span></div>`).join('')+'</div>';document.querySelector('#values').innerHTML='<div class="table-scroll" tabindex="0" role="region" aria-label="Annual values"><table><thead><tr><th>Year</th><th>Revenue USD Thousands</th><th>Members</th></tr></thead><tbody>'+years.map((y,i)=>`<tr><th scope="row">${y}</th><td>${series.revenue[i]}</td><td>${series.members[i]}</td></tr>`).join('')+'</tbody></table></div>';document.querySelectorAll('[data-metric]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.metric===metric)))}draw('revenue');document.querySelectorAll('[data-metric]').forEach(b=>b.onclick=()=>{draw(b.dataset.metric);document.querySelector('#status').textContent='Showing '+b.dataset.metric+'.'});""",
    {
        "years": [2021, 2022, 2023, 2024, 2025, 2026],
        "revenue": [84, 98, 121, 143, 168, 192],
        "members": [210, 245, 302, 357, 420, 480],
    },
    "Members",
)

add(
    "data-operations",
    "Tide Water Operations",
    "Create a fictional water-operations console focused on four stations and one alert, with a clear spatial flow diagram, measured readings and a station inspector. Use dark navy with cyan signals, text status labels and a high-contrast alert. Station buttons must update the inspector; no live telemetry claims.",
    "#0B4659",
    "#E8F4F2",
    "Office Code Pro",
    """<header><p class="kicker">TIDE / SYNTHETIC OPERATIONS</p><h1>Follow the Flow</h1><p class="lead">Four stations. One reading needs attention.</p></header><div class="flow"><button data-station="0">01<br>Intake</button><span aria-hidden="true">→</span><button data-station="1">02<br>Filter</button><span aria-hidden="true">→</span><button data-station="2">03<br>Storage</button><span aria-hidden="true">→</span><button data-station="3">04<br>Outlet</button></div><div class="ops"><section id="inspector" aria-live="polite"></section><aside><h2>Review Queue</h2><div class="alert"><strong>Attention · Filter</strong><p>Pressure is above the illustrative operating band. Inspect the filter before changing the flow setting.</p></div><p>Readings are synthetic snapshots. This interface cannot control equipment.</p></aside></div>""",
    """.flow{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:35px;background:#0C2632;color:#C4F6F0;margin:35px 0}.flow button{font:600 1.2rem/1.6 "Office Code Pro";border:1px solid #C4F6F0;flex:1}.flow button[aria-pressed=true]{background:#C4F6F0;color:#0C2632}.ops{display:grid;grid-template-columns:1.3fr 1fr;gap:60px}.reading-value{font:600 5rem/1 "Office Code Pro";color:#0b4659}.alert{border-left:5px solid #9A3B18;padding:20px;background:#FFE8D4;margin:20px 0}@media(max-width:700px){.flow{display:grid;grid-template-columns:1fr 1fr;padding:20px}.flow span{display:none}.ops{grid-template-columns:1fr;gap:25px}}""",
    """const stations=[{name:'Intake',value:'18.4',unit:'L/s',state:'Within Band',note:'Incoming flow is steady.'},{name:'Filter',value:'2.8',unit:'bar',state:'Attention',note:'Illustrative operating band: 1.5–2.5 bar.'},{name:'Storage',value:'72',unit:'% full',state:'Within Band',note:'Illustrative operating band: 30–85%.'},{name:'Outlet',value:'17.9',unit:'L/s',state:'Within Band',note:'Downstream flow is steady.'}];function inspect(i){const s=stations[i];document.querySelector('#inspector').innerHTML=`<p class="kicker">STATION 0${i+1}</p><h2>${s.name}</h2><p class="reading-value">${s.value}</p><p>${s.unit} · ${s.state}</p><p>${s.note}</p>`;document.querySelectorAll('[data-station]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.station)===i)))}inspect(1);document.querySelectorAll('[data-station]').forEach(b=>b.onclick=()=>inspect(Number(b.dataset.station)));""",
    {
        "stations": ["Intake", "Filter", "Storage", "Outlet"],
        "values": [18.4, 2.8, 72, 17.9],
    },
    "01 Intake",
)

add(
    "restaurant-fine-dining",
    "Vesper Tasting Room",
    "Create a fictional intimate tasting-room website without stock photography. Use black plum, cream serif typography and an oversized course numeral. Let visitors reveal a five-course sequence and read seating details. Distinguish a request preview from a real reservation.",
    "#4A2738",
    "#F7EEE2",
    "Libre Baskerville",
    """<div class="vesper"><header><p class="kicker">VESPER / TWELVE SEATS</p><h1>Five Courses.<br>One Long Evening.</h1><p class="lead">A seasonal tasting menu, served at the pace of the table.</p><p>Wednesday–Saturday · 19:00<br>Sample menu price: $95 per person before tax.</p><button id="courses-button" aria-expanded="false" aria-controls="courses">Explore the Menu</button></header><div class="course-number" aria-hidden="true">V</div></div><section id="courses" hidden><h2>The Five Courses</h2><ol class="courses"><li>Tomato Water · Basil Oil</li><li>Roast Beet · Cultured Cream</li><li>Market Fish · Fennel</li><li>Summer Squash · Brown Butter</li><li>Plum · Almond · Vanilla</li></ol></section><div class="columns"><section><h2>At the Table</h2><p>Arrive ten minutes before the seating. Tell the team about dietary needs before making a request; substitutions and cross-contact controls require confirmation.</p></section><section><h2>A Small Room</h2><p>Step-free entrance. One shared counter and two small tables. This fictional website does not accept reservations.</p></section></div>""",
    """body{background:#231821;color:#F7EEE2}.top,footer{border-color:#f7eee250}.vesper{display:grid;grid-template-columns:1.4fr 1fr;gap:35px;align-items:center;margin-bottom:65px}.vesper h1{font-size:clamp(3rem,5.8vw,6rem);font-weight:400}.course-number{font:400 25rem/.9 "Libre Baskerville";color:#D8BBA3;text-align:center}.courses{padding-left:30px;font:400 1.5rem/2.3 "Libre Baskerville"}.columns{border-top:1px solid #f7eee250;padding-top:35px}button{border-color:#f7eee2}@media(max-width:700px){.vesper{grid-template-columns:1fr}.course-number{display:none}}""",
    """document.querySelector('#courses-button').onclick=e=>{const section=document.querySelector('#courses');section.hidden=!section.hidden;e.target.setAttribute('aria-expanded',String(!section.hidden));e.target.textContent=section.hidden?'Explore the Menu':'Close the Menu'};""",
    {"courses": 5, "seats": 12, "price": 95},
    "Explore the Menu",
)

add(
    "restaurant-cafe",
    "Daybreak Coffee Counter",
    "Build a fictional cafe pickup interface centered on a large typographic order ticket. Use espresso brown and apricot, category filters, three products and an honest local cart total. Adding items must update quantities and totals; no checkout or real pickup promise.",
    "#543020",
    "#FFE8CC",
    "Archivo",
    """<header class="cafe"><div><p class="kicker">DAYBREAK / COFFEE COUNTER</p><h1>Your Morning,<br>Written to Order.</h1></div><p>Open 07:00–15:00<br>Fictional Pickup Demo</p></header><div class="counter"><section><div class="actions"><button data-filter="all" aria-pressed="true">All</button><button data-filter="coffee" aria-pressed="false">Coffee</button><button data-filter="bakery" aria-pressed="false">Bakery</button></div><div id="products"></div></section><aside class="ticket"><p class="kicker">YOUR ORDER / 001</p><h2>The Morning Ticket</h2><div id="cart">Your ticket is empty.</div><p class="total">Subtotal <strong id="total">$0.00</strong></p><p class="small">Sample USD prices. Taxes and service fees are not included. No order is sent.</p><button id="clear">Clear Ticket</button><p role="status" id="status"></p></aside></div>""",
    """.cafe{display:flex;align-items:end;justify-content:space-between;gap:35px;margin-bottom:45px}.cafe h1{font-size:clamp(3rem,5.5vw,5.8rem)}.counter{display:grid;grid-template-columns:1.4fr 1fr;gap:70px}.product{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:32px 0;border-bottom:2px solid #543020}.product h2{font-size:1.5rem;margin-bottom:8px}.ticket{background:#fffaf1;padding:35px;border-top:12px solid #543020;align-self:start}.total{display:flex;justify-content:space-between;font-size:1.5rem;border-top:1px dashed;padding-top:20px}.cart-line{display:flex;justify-content:space-between;padding:10px 0}button[aria-pressed=true]{background:#543020;color:white}@media(max-width:800px){.cafe{display:block}.counter{grid-template-columns:1fr;gap:30px}}""",
    """const products=[{name:'Flat White',category:'coffee',price:4.5,note:'Double espresso · steamed milk'},{name:'Filter Coffee',category:'coffee',price:3.5,note:'Seasonal single origin'},{name:'Almond Bun',category:'bakery',price:5,note:'Contains wheat, dairy and nuts'}],cart=[0,0,0];function list(filter){document.querySelector('#products').innerHTML=products.map((p,i)=>filter==='all'||p.category===filter?`<article class="product"><div><h2>${p.name}</h2><p>${p.note}</p><strong>$${p.price.toFixed(2)}</strong></div><button data-add="${i}" aria-label="Add ${p.name}">Add</button></article>`:'').join('')}function ticket(){document.querySelector('#cart').innerHTML=cart.some(Boolean)?products.map((p,i)=>cart[i]?`<div class="cart-line"><span>${cart[i]} × ${p.name}</span><strong>$${(cart[i]*p.price).toFixed(2)}</strong></div>`:'').join(''):'Your ticket is empty.';document.querySelector('#total').textContent='$'+cart.reduce((s,n,i)=>s+n*products[i].price,0).toFixed(2)}list('all');document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{list(b.dataset.filter);document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});document.querySelector('#products').onclick=e=>{const b=e.target.closest('[data-add]');if(b){cart[Number(b.dataset.add)]++;ticket();document.querySelector('#status').textContent=products[Number(b.dataset.add)].name+' added.'}};document.querySelector('#clear').onclick=()=>{cart.fill(0);ticket();document.querySelector('#status').textContent='Ticket cleared.'};""",
    {
        "products": [
            {"name": "Flat White", "price": 4.5},
            {"name": "Filter Coffee", "price": 3.5},
            {"name": "Almond Bun", "price": 5},
        ]
    },
    "Add Flat White",
)

add(
    "restaurant-reservations",
    "Solstice Table Planner",
    "Design a fictional restaurant seating-request page around a simple original room plan and a request form. Use olive and cream, distinct named table zones and an accessible text equivalent. Choosing a zone must update the request; submission must clearly remain an unconfirmed local preview.",
    "#3E5132",
    "#F4F0DD",
    "Young Serif",
    """<header><p class="kicker">SOLSTICE / A PLACE AT THE TABLE</p><h1>Choose Your Corner</h1><p class="lead">A room for conversation.<br>A preference, not a confirmed reservation.</p></header><div class="reservation"><section class="room" aria-label="Room Preferences"><div class="window-label">STREET WINDOWS</div><button data-zone="Window Table" class="window">Window Table<br><small>Bright · Seats 2</small></button><button data-zone="Quiet Corner" class="quiet">Quiet Corner<br><small>Lower Traffic · Seats 2</small></button><button data-zone="Shared Table" class="shared">Shared Table<br><small>Social · Seats 6</small></button><p class="door">Step-Free Entrance →</p></section><form id="booking"><h2>Your Request</h2><label for="zone">Preferred Area</label><input id="zone" value="Window Table" readonly><label for="party">Party Size</label><select id="party"><option>2 guests</option><option>4 guests</option><option>6 guests</option></select><label for="date">Preferred Date</label><input id="date" type="date" required><button>Preview Request</button><p id="status" role="status" class="status"></p><p class="small">No information is sent. Access, availability and dietary requirements must be confirmed with the venue.</p></form></div>""",
    """.reservation{display:grid;grid-template-columns:1.3fr 1fr;gap:65px;margin-top:40px}.room{border:3px solid #3e5132;display:grid;grid-template-columns:1fr 1fr;gap:28px;padding:28px;min-height:420px;background:#E3E7CD}.window-label{grid-column:1/-1;text-align:center;border-bottom:5px double #3e5132;font-size:12px;letter-spacing:.15em}.room button{background:#faf7ec;border-radius:35px}.room .shared{grid-column:1/-1;border-radius:12px}.room button[aria-pressed=true]{background:#3e5132;color:white}.door{grid-column:1/-1;margin:0;font-size:13px}form input,form select{display:block;width:100%;margin:8px 0 20px}form button{width:100%}@media(max-width:750px){.reservation{grid-template-columns:1fr;gap:30px}.room{gap:15px;padding:20px}}""",
    """const zones=document.querySelectorAll('[data-zone]');zones[0].setAttribute('aria-pressed','true');zones.forEach(b=>b.onclick=()=>{document.querySelector('#zone').value=b.dataset.zone;zones.forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});document.querySelector('#booking').onsubmit=e=>{e.preventDefault();document.querySelector('#status').textContent='Preview only: '+document.querySelector('#party').value+', '+document.querySelector('#zone').value+' on '+document.querySelector('#date').value+'. Not confirmed.'};""",
    {"zones": ["Window Table", "Quiet Corner", "Shared Table"]},
    "Quiet Corner",
)

add(
    "restaurant-menu",
    "Saffron Lunch Index",
    "Make a fictional lunch-menu interface that behaves like a searchable culinary index. Use saffron yellow, ink black and a bold condensed masthead. Search and vegetarian filtering must work without changing prices or claiming allergy safety. Avoid product-photo cards.",
    "#514017",
    "#FFF1A3",
    "Oswald",
    """<header class="menu-head"><p class="kicker">SAFFRON / LUNCH UNTIL 15:00</p><h1>Good Lunch.<br>No Guesswork.</h1></header><div class="menu-controls"><label for="search">Find a Dish<input id="search" type="search" placeholder="Try lentil or chicken"></label><label class="veg"><input id="veg" type="checkbox"> Vegetarian Only</label></div><p id="result-count" role="status"></p><div id="menu-items"></div><aside class="allergy"><h2>Before You Order</h2><p>Vegetarian labels describe ingredients, not allergy safety. Ask about preparation and cross-contact. Prices are sample USD amounts; this demo does not accept orders.</p></aside>""",
    """.menu-head h1{font-size:clamp(4rem,9vw,9rem);text-transform:uppercase}.menu-controls{display:flex;gap:40px;align-items:center;padding:25px 0;border-block:3px solid #514017}.menu-controls input[type=search]{display:block;margin-top:8px;width:360px}.veg input{width:22px;height:22px;vertical-align:middle}.dish-row{display:grid;grid-template-columns:60px 1fr 100px;gap:24px;border-bottom:1px solid #514017;padding:28px 0}.dish-row h2{font:500 2rem Oswald;margin:0 0 8px}.dish-number{font-size:1.8rem}.price{font-size:1.6rem;text-align:right}.allergy{max-width:650px;padding-top:38px}@media(max-width:700px){.menu-controls{display:block}.menu-controls input[type=search]{width:100%}.veg{margin-top:20px}.dish-row{grid-template-columns:35px 1fr 65px;gap:12px}}""",
    """const dishes=[{name:'Roast Carrot Bowl',note:'Lentils, herbs, tahini',price:14,veg:true},{name:'Lemon Chicken Plate',note:'Rice, cucumber, yogurt',price:17,veg:false},{name:'Green Lentil Soup',note:'Leek, lemon, toasted bread',price:11,veg:true},{name:'Market Fish Sandwich',note:'Slaw, caper dressing, sourdough',price:18,veg:false}];function render(){const query=document.querySelector('#search').value.toLowerCase(),veg=document.querySelector('#veg').checked,rows=dishes.filter(d=>(!veg||d.veg)&&(d.name+' '+d.note).toLowerCase().includes(query));document.querySelector('#menu-items').innerHTML=rows.map((d,i)=>`<article class="dish-row"><span class="dish-number">0${i+1}</span><div><h2>${d.name}</h2><p>${d.note}${d.veg?' · Vegetarian':''}</p></div><strong class="price">$${d.price}</strong></article>`).join('')||'<p>No dishes match. Try another search.</p>';document.querySelector('#result-count').textContent=rows.length+' dishes shown'}render();document.querySelector('#search').oninput=render;document.querySelector('#veg').onchange=render;""",
    {
        "dishes": [
            {"name": "Roast Carrot Bowl", "price": 14},
            {"name": "Lemon Chicken Plate", "price": 17},
            {"name": "Green Lentil Soup", "price": 11},
            {"name": "Market Fish Sandwich", "price": 18},
        ]
    },
    "Vegetarian Only",
)

add(
    "business-portal",
    "Fieldwork Client Ledger",
    "Create a fictional client portal for a small architecture studio. Organize the page as a project ledger with milestone dates and a focused decision panel, rather than a generic dashboard. Use brick red and warm white. Document selection must show a useful preview; approval must be explicitly local and reversible.",
    "#853B2C",
    "#F5EFE9",
    "Work Sans",
    """<header class="portal"><p class="kicker">FIELDWORK / CLIENT ROOM</p><h1>The Courtyard Project</h1><p class="lead">One decision is ready for your review.</p></header><div class="ledger"><section><h2>Project Sequence</h2><ol class="milestones"><li><strong>06 Jun</strong><span>Site Survey<br><small>Complete</small></span></li><li><strong>20 Jun</strong><span>Concept Review<br><small>Complete</small></span></li><li class="current"><strong>04 Jul</strong><span>Material Direction<br><small>Awaiting Your Review</small></span></li><li><strong>18 Jul</strong><span>Detailed Design<br><small>Planned</small></span></li></ol><h2>Review Documents</h2><div class="actions"><button data-doc="Materials">Materials</button><button data-doc="Schedule">Schedule</button></div></section><aside class="decision-panel"><p class="kicker">DECISION 03</p><h2 id="preview-title">Materials</h2><p id="preview">The proposal pairs reclaimed brick with pale timber and a permeable courtyard surface. Final product specifications and costs remain subject to confirmation.</p><button id="approve">Mark Reviewed Locally</button><p role="status" id="status" class="status"></p><p class="small">This preview records no contractual approval and sends nothing to the studio.</p></aside></div>""",
    """.portal{border-left:12px solid #853b2c;padding-left:30px;margin-bottom:48px}.portal h1{font-size:clamp(3rem,5.5vw,5.5rem)}.ledger{display:grid;grid-template-columns:1fr 1fr;gap:75px}.milestones{list-style:none;padding:0}.milestones li{display:grid;grid-template-columns:90px 1fr;padding:22px 0;border-top:1px solid #853b2c60}.milestones strong{color:#853b2c}.milestones small{font-size:13px}.current{border-left:5px solid #853b2c;padding-left:15px!important}.decision-panel{background:#fff;padding:35px;border-top:5px solid #853b2c;align-self:start}.decision-panel h2{font-size:2.5rem}@media(max-width:750px){.ledger{grid-template-columns:1fr;gap:30px}}""",
    """const docs={Materials:'The proposal pairs reclaimed brick with pale timber and a permeable courtyard surface. Final product specifications and costs remain subject to confirmation.',Schedule:'Detailed design is planned for 18 July. Procurement dates depend on the confirmed scope and supplier lead times.'};document.querySelectorAll('[data-doc]').forEach(b=>b.onclick=()=>{document.querySelector('#preview-title').textContent=b.dataset.doc;document.querySelector('#preview').textContent=docs[b.dataset.doc]});let reviewed=false;document.querySelector('#approve').onclick=e=>{reviewed=!reviewed;e.target.textContent=reviewed?'Undo Local Review':'Mark Reviewed Locally';document.querySelector('#status').textContent=reviewed?'Marked reviewed in this preview only.':'Local review removed.'};""",
    {
        "milestones": ["06 Jun", "20 Jun", "04 Jul", "18 Jul"],
        "documents": ["Materials", "Schedule"],
    },
    "Mark Reviewed Locally",
)


def build():
    for d in U:
        folder = OUT / "ui" / d["id"]
        folder.mkdir(parents=True, exist_ok=True)
        css = (
            ":root{--accent:"
            + d["accent"]
            + ";--paper:"
            + d["paper"]
            + ';--display:"'
            + d["font"]
            + '"}\n'
            + BASE
            + "\n"
            + d["css"]
        )
        (folder / "styles.css").write_text(css, encoding="utf8")
        (folder / "template.json").write_text(
            json.dumps(
                {k: d[k] for k in ["id", "title", "prompt", "data", "action"]}, indent=2
            ),
            encoding="utf8",
        )
        data = (
            (folder / "template.json")
            .read_text(encoding="utf8")
            .replace("<", "\\u003c")
        )
        (folder / "index.html").write_text(
            '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'
            + esc(d["title"])
            + '</title><link rel="stylesheet" href="../../fonts/fonts.css"><link rel="stylesheet" href="styles.css"><body><nav class="top"><a href="../../index.html">Dazzler Design Gallery</a><span class="small">Fictional Interactive Example</span></nav><main class="canvas">'
            + d["body"]
            + '</main><footer>Original Dazzler design · Apache-2.0. Local font licenses accompany these files. Synthetic data; no live service.</footer><script id="template-data" type="application/json">'
            + data
            + "</script><script>"
            + d["js"]
            + "</script></body></html>",
            encoding="utf8",
        )
    (STAGE / "interface-briefs.json").write_text(
        json.dumps(
            [{k: d[k] for k in ["id", "title", "prompt", "data", "action"]} for d in U],
            indent=2,
        ),
        encoding="utf8",
    )
    print("Authored 10 distinct interactive interfaces in staging")


if __name__ == "__main__":
    build()
