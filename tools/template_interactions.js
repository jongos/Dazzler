// Local-only demo state. No fetch, storage, payment, booking, or messaging integration.
const cfg = JSON.parse(document.getElementById("template-data").textContent);
const $ = (id) => document.getElementById(id),
  esc = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
const say = (t) => {
  $("status").textContent = t;
};
const dialog = $("edit-dialog");
let pending = "",
  cart = {},
  category = "All";
function openDialog(title, action, content = "", label = "Details") {
  $("dialog-title").textContent = title;
  $("dialog-content").innerHTML = content;
  $("entry-label").textContent = label;
  $("entry").value = "";
  $("entry").required = Boolean(label);
  $("entry").hidden = $("entry-label").hidden = !label;
  $("dialog-save").textContent =
    action === "reservation"
      ? "Keep request preview"
      : action === "cart"
        ? "Keep order preview"
        : "Save preview";
  pending = action;
  dialog.showModal();
}
if (
  DAZZLER_LAYOUT === "workspace" ||
  DAZZLER_LAYOUT === "board" ||
  DAZZLER_LAYOUT === "business" ||
  DAZZLER_LAYOUT === "cafe" ||
  DAZZLER_LAYOUT === "reservations"
)
  $("cancel").addEventListener("click", () => dialog.close());
function projectRender() {
  const search = ($("search")?.value || "").toLowerCase();
  const rows = cfg.projects.filter((x) =>
    [x.name, x.client, x.owner].join(" ").toLowerCase().includes(search),
  );
  $("projects").innerHTML = rows
    .map(
      (x) =>
        `<article class="project-row"><div><p>${esc(x.client)}</p><h3>${esc(x.name)}</h3><span class="pill ${x.status === "At risk" ? "warning" : ""}">${esc(x.status)}</span></div><div><p>${x.done} of ${x.total} tasks complete</p><progress value="${x.done}" max="${x.total || 1}" aria-label="${esc(x.name)} task completion"></progress></div><div><p>${esc(x.owner)}</p><strong>Due ${esc(x.due)}</strong></div></article>`,
    )
    .join("");
  $("empty").hidden = rows.length > 0;
}
function boardRender() {
  const owner = $("owner-filter").value;
  const tasks = cfg.tasks.filter((x) => owner === "Everyone" || x.owner === owner);
  $("board-summary").textContent =
    `${tasks.length} visible tasks · ${cfg.tasks.filter((t) => t.stage === "Done").length} completed overall · ${cfg.tasks.reduce((n, t) => n + t.points, 0)} planned points`;
  $("board").innerHTML = ["Ready", "In progress", "Review", "Done"]
    .map(
      (stage) =>
        `<section class="board-column"><h2>${stage}<span>${tasks.filter((t) => t.stage === stage).length}</span></h2>${tasks
          .filter((t) => t.stage === stage)
          .map(
            (t) =>
              `<article class="task"><span class="task-id">${esc(t.id)}</span><h3>${esc(t.title)}</h3><p class="pill ${t.priority === "High" ? "warning" : ""}">${esc(t.priority)} priority</p><div class="task-meta"><span>${esc(t.owner)}</span><span>${t.points} points</span></div><button class="secondary" data-move="${esc(t.id)}">${stage === "Done" ? "Reopen in Ready" : "Move to " + ["In progress", "Review", "Done"][["Ready", "In progress", "Review"].indexOf(stage)]}</button></article>`,
          )
          .join("")}</section>`,
    )
    .join("");
}
function selectedMonths() {
  return cfg.months.filter(
    (x, i) =>
      $("period").value === "all" || Math.floor(i / 3) + 1 === Number($("period").value.slice(1)),
  );
}
function revenueRender() {
  const rows = selectedMonths(),
    gross = rows.reduce((s, x) => s + x.gross, 0),
    refunds = rows.reduce((s, x) => s + x.refunds, 0),
    orders = rows.reduce((s, x) => s + x.orders, 0);
  $("revenue-metrics").innerHTML = [
    ["Net revenue", money(gross - refunds), "Gross less refunds"],
    ["Refund rate", ((refunds / gross) * 100).toFixed(2) + "%", money(refunds) + " returned"],
    ["Orders", orders.toLocaleString("en-US"), "Across the selected period"],
  ]
    .map(
      ([a, b, c]) =>
        `<div class="metric-card"><small>${a}</small><strong>${b}</strong><p>${c}</p></div>`,
    )
    .join("");
  const max = Math.max(...cfg.months.map((x) => x.gross - x.refunds));
  $("revenue-chart").innerHTML = rows
    .map(
      (x) =>
        `<div class="bar"><strong>${money((x.gross - x.refunds) / 1000)
          .replace(/0+$/, "")
          .replace(
            /\.$/,
            "",
          )}k</strong><div class="fill" style="height:${((x.gross - x.refunds) / max) * 170}px" aria-hidden="true"></div><span>${x.month}</span></div>`,
    )
    .join("");
  $("revenue-table").innerHTML =
    "<table><thead><tr><th>Month</th><th>Gross USD</th><th>Refunds USD</th><th>Net USD</th><th>Orders</th></tr></thead><tbody>" +
    rows
      .map(
        (x) =>
          `<tr><th scope="row">${x.month}</th><td>${money(x.gross)}</td><td>${money(x.refunds)}</td><td>${money(x.gross - x.refunds)}</td><td>${x.orders}</td></tr>`,
      )
      .join("") +
    `</tbody><tfoot><tr><th>Total</th><td>${money(gross)}</td><td>${money(refunds)}</td><td>${money(gross - refunds)}</td><td>${orders}</td></tr></tfoot></table>`;
}
function filteredTickets() {
  return cfg.tickets.filter(
    (x) =>
      ($("queue").value === "All queues" || x.queue === $("queue").value) &&
      ($("show-resolved").checked || x.status === "Open"),
  );
}
function opsRender() {
  const open = cfg.tickets.filter((x) => x.status === "Open"),
    late = open.filter((x) => x.age > { High: 30, Normal: 60, Low: 120 }[x.priority]);
  $("ops-metrics").innerHTML = [
    ["Open tickets", open.length, "Across all queues"],
    ["Past first-response target", late.length, "Based on priority at this snapshot"],
    [
      "Oldest open ticket",
      (open.length ? Math.max(...open.map((x) => x.age)) : 0) + " min",
      "Age at 09:40 snapshot",
    ],
  ]
    .map(
      ([a, b, c]) =>
        `<div class="metric-card"><small>${a}</small><strong>${b}</strong><p>${c}</p></div>`,
    )
    .join("");
  const rows = filteredTickets();
  $("tickets").innerHTML = rows.length
    ? rows
        .map(
          (x) =>
            `<article class="ticket"><div class="ticket-top"><small>${x.id} · ${x.queue}</small><span class="pill ${x.priority === "High" ? "warning" : ""}">${x.priority} priority</span></div><h3>${x.subject}</h3><div class="ticket-bottom"><small>${x.owner} · ${x.age} min old · ${x.status}</small><button class="secondary" data-resolve="${x.id}" ${x.status === "Resolved" ? "disabled" : ""}>${x.status === "Resolved" ? "Resolved" : "Resolve in preview"}</button></div></article>`,
        )
        .join("")
    : "<p>No tickets match these filters.</p>";
  $("queue-health").innerHTML = ["Access", "Billing", "Account"]
    .map((q) => {
      const n = open.filter((x) => x.queue === q).length;
      return `<div class="queue-row"><div><strong>${q}</strong><span>${n} open</span></div><progress value="${n}" max="${Math.max(open.length, 1)}" aria-label="${q} share of open tickets"></progress></div>`;
    })
    .join("");
}
function menuRender() {
  const search = DAZZLER_LAYOUT === "menu" ? $("menu-search").value.toLowerCase() : "",
    vegan = DAZZLER_LAYOUT === "menu" ? $("vegan").checked : false;
  const items = cfg.items
    .map((x, i) => ({ ...x, index: i }))
    .filter(
      (x) =>
        (category === "All" || x.category === category) &&
        (!vegan || x.vegan) &&
        [x.name, x.description].join(" ").toLowerCase().includes(search),
    );
  $("products").innerHTML = items
    .map((x) =>
      DAZZLER_LAYOUT === "cafe"
        ? `<article class="product"><small>${x.category}</small><h3>${x.name}</h3><p>${x.description}</p><div class="price"><strong>${money(x.price)}</strong><button data-add="${x.index}" aria-label="Add ${x.name}">Add +</button></div></article>`
        : `<article class="menu-dish"><header><h3>${x.name}</h3><strong>${money(x.price)}</strong></header><p>${x.description}</p><span class="pill">${x.category}${x.vegan ? " · V" : ""}</span></article>`,
    )
    .join("");
  if (DAZZLER_LAYOUT === "menu") $("menu-empty").hidden = items.length > 0;
}
function cartRender() {
  const ids = Object.keys(cart).filter((i) => cart[i] > 0);
  $("cart-lines").innerHTML = ids.length
    ? ids
        .map(
          (i) =>
            `<div class="cart-line"><strong>${cfg.items[i].name}</strong><small>${money(cfg.items[i].price * cart[i])}</small><div class="quantity"><button class="secondary" data-quantity="${i}" data-delta="-1" aria-label="Remove one ${cfg.items[i].name}">−</button><span>${cart[i]}</span><button class="secondary" data-quantity="${i}" data-delta="1" aria-label="Add one ${cfg.items[i].name}">+</button></div></div>`,
        )
        .join("")
    : '<p class="muted">Your bag is empty. Add a coffee or something from the kitchen.</p>';
  $("subtotal").textContent = money(ids.reduce((s, i) => s + cfg.items[i].price * cart[i], 0));
}
function businessRender() {
  $("deliverable-list").innerHTML = cfg.deliverables
    .map(
      (x, i) =>
        `<article class="deliverable"><header><div><small>${x.version} · Due ${x.due}</small><h3>${x.name}</h3></div><span class="pill">${x.status}</span></header><p>${x.description}</p><div class="actions"><button class="secondary" data-brief="${i}">View review brief</button>${i === 0 ? '<button data-approve="0">Approve in preview</button><button class="secondary" data-dialog="revision">Request a revision</button>' : ""}</div></article>`,
    )
    .join("");
}
document.addEventListener("click", (event) => {
  const b = event.target.closest("button");
  if (!b) return;
  if (
    (DAZZLER_LAYOUT === "workspace" ||
      DAZZLER_LAYOUT === "board" ||
      DAZZLER_LAYOUT === "business") &&
    b.dataset.dialog
  ) {
    const mode = b.dataset.dialog;
    openDialog(
      {
        project: "Create a project",
        task: "Add a sprint task",
        update: "Draft an update request",
        revision: "Request a revision",
      }[mode],
      mode,
      "<p>Saved in this local preview only.</p>",
      mode === "project" ? "Project name" : mode === "task" ? "Task title" : "Your note",
    );
  }
  if (DAZZLER_LAYOUT === "board" && b.dataset.move) {
    const t = cfg.tasks.find((x) => x.id === b.dataset.move),
      stages = ["Ready", "In progress", "Review", "Done"];
    t.stage = stages[(stages.indexOf(t.stage) + 1) % 4];
    boardRender();
    say(`${t.id} moved to ${t.stage}.`);
  }
  if (DAZZLER_LAYOUT === "operations" && b.dataset.resolve) {
    cfg.tickets.find((x) => x.id === b.dataset.resolve).status = "Resolved";
    opsRender();
    say("Ticket resolved in this preview. No support system was changed.");
  }
  if ((DAZZLER_LAYOUT === "cafe" || DAZZLER_LAYOUT === "menu") && b.dataset.filter) {
    category = b.dataset.filter;
    document
      .querySelectorAll("[data-filter]")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    menuRender();
  }
  if (DAZZLER_LAYOUT === "cafe" && b.dataset.add !== undefined) {
    cart[b.dataset.add] = (cart[b.dataset.add] || 0) + 1;
    cartRender();
    say("Added to your pickup preview.");
  }
  if (DAZZLER_LAYOUT === "cafe" && b.dataset.quantity !== undefined) {
    cart[b.dataset.quantity] = Math.max(
      0,
      (cart[b.dataset.quantity] || 0) + Number(b.dataset.delta),
    );
    cartRender();
  }
  if (DAZZLER_LAYOUT === "business" && b.dataset.approve) {
    cfg.deliverables[0].status = "Approved in preview";
    businessRender();
    say("Approval recorded locally. No client decision was sent.");
  }
  if (DAZZLER_LAYOUT === "business" && b.dataset.brief !== undefined) {
    const d = cfg.deliverables[Number(b.dataset.brief)];
    openDialog(
      d.name,
      "brief",
      `<p>${esc(d.description)}</p><h3>Review checklist</h3><ul><li>Does this meet the agreed scope?</li><li>Are the facts and wording accurate?</li><li>What specific changes are needed?</li></ul><p>${esc(d.status)} · ${esc(d.version)}</p>`,
      "",
    );
  }
  if (DAZZLER_LAYOUT === "cafe" && b.dataset.action === "clear") {
    cart = {};
    cartRender();
    say("Order preview cleared.");
  }
  if (DAZZLER_LAYOUT === "cafe" && b.dataset.action === "cart") {
    const ids = Object.keys(cart).filter((i) => cart[i] > 0);
    if (!ids.length) {
      say("Add an item before reviewing your order.");
      return;
    }
    openDialog(
      "Your pickup order",
      "cart",
      "<ul>" +
        ids
          .map(
            (i) =>
              `<li>${cart[i]} × ${cfg.items[i].name} — ${money(cfg.items[i].price * cart[i])}</li>`,
          )
          .join("") +
        "</ul><p><strong>Subtotal " +
        $("subtotal").textContent +
        "</strong></p><p>Sample pickup estimate: 15–20 minutes. No order or payment is submitted.</p>",
      "",
    );
  }
  if (
    (DAZZLER_LAYOUT === "revenue" || DAZZLER_LAYOUT === "operations") &&
    b.dataset.action === "download"
  ) {
    let rows =
      DAZZLER_LAYOUT === "revenue"
        ? [
            ["Month", "Gross USD", "Refunds USD", "Net USD", "Orders"],
            ...selectedMonths().map((x) => [
              x.month,
              x.gross,
              x.refunds,
              x.gross - x.refunds,
              x.orders,
            ]),
          ]
        : [
            ["Ticket", "Queue", "Priority", "Age minutes", "Owner", "Status"],
            ...filteredTickets().map((x) => [x.id, x.queue, x.priority, x.age, x.owner, x.status]),
          ];
    const text = rows
      .map((row) => row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = cfg.id + "-sample.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    say("The currently selected sample data was exported.");
  }
});
if (
  DAZZLER_LAYOUT === "workspace" ||
  DAZZLER_LAYOUT === "board" ||
  DAZZLER_LAYOUT === "business" ||
  DAZZLER_LAYOUT === "cafe" ||
  DAZZLER_LAYOUT === "reservations"
)
  $("edit-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const value = $("entry").value.trim();
    if ($("entry").required && !value) return;
    if (DAZZLER_LAYOUT === "workspace" && pending === "project") {
      cfg.projects.push({
        name: value,
        client: "New project",
        owner: "Unassigned",
        done: 0,
        total: 0,
        due: "Not set",
        status: "Planning",
      });
      projectRender();
    }
    if (DAZZLER_LAYOUT === "board" && pending === "task") {
      cfg.tasks.push({
        id: "ONB-" + (41 + cfg.tasks.length),
        title: value,
        owner: "Maya",
        stage: "Ready",
        points: 1,
        priority: "Normal",
      });
      boardRender();
    }
    if (DAZZLER_LAYOUT === "business" && pending === "revision") {
      cfg.deliverables[0].status = "Revision requested";
      cfg.deliverables[0].description = value;
      businessRender();
    }
    say(
      pending === "reservation"
        ? "Reservation request preview kept. No table has been booked."
        : pending === "cart"
          ? "Order preview kept. Nothing was sent to the café."
          : pending === "brief"
            ? "Review brief closed."
            : "Saved in this preview only. No message or account change was sent.",
    );
    dialog.close();
  });
if (DAZZLER_LAYOUT === "workspace") {
  projectRender();
  $("search").addEventListener("input", projectRender);
}
if (DAZZLER_LAYOUT === "board") {
  boardRender();
  $("owner-filter").addEventListener("change", boardRender);
}
if (DAZZLER_LAYOUT === "settings") {
  $("settings").addEventListener("input", () => {
    $("dirty").textContent = "Unsaved changes";
  });
  $("settings").addEventListener("reset", () => {
    $("dirty").textContent = "No unsaved changes";
    say("Changes discarded.");
  });
  $("settings").addEventListener("submit", (event) => {
    event.preventDefault();
    $("dirty").textContent = "Saved for this preview";
    say("Preferences updated locally. Reloading restores the sample profile.");
  });
}
if (DAZZLER_LAYOUT === "revenue") {
  revenueRender();
  $("period").addEventListener("change", revenueRender);
}
if (DAZZLER_LAYOUT === "operations") {
  opsRender();
  $("queue").addEventListener("change", opsRender);
  $("show-resolved").addEventListener("change", opsRender);
}
if (DAZZLER_LAYOUT === "cafe" || DAZZLER_LAYOUT === "menu") {
  $("menu-filters").innerHTML = ["All", ...new Set(cfg.items.map((x) => x.category))]
    .map((c) => `<button data-filter="${c}" aria-pressed="${c === "All"}">${c}</button>`)
    .join("");
  menuRender();
  if (DAZZLER_LAYOUT === "menu") $("menu-search").addEventListener("input", menuRender);
  if (DAZZLER_LAYOUT === "menu") $("vegan").addEventListener("change", menuRender);
  if (DAZZLER_LAYOUT === "cafe") cartRender();
}
if (DAZZLER_LAYOUT === "reservations") {
  const today = new Date(),
    localDate = (d) =>
      [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");
  $("date").min = localDate(today);
  today.setDate(today.getDate() + 7);
  while ([0, 1].includes(today.getDay())) today.setDate(today.getDate() + 1);
  $("date").value = localDate(today);
  $("date").addEventListener("change", () => {
    const day = new Date($("date").value + "T12:00:00").getDay();
    $("date").setCustomValidity(
      [0, 1].includes(day)
        ? "Dinner service runs Tuesday through Saturday. Choose another date."
        : "",
    );
  });
  $("reservation").addEventListener("submit", (event) => {
    event.preventDefault();
    const f = new FormData(event.target);
    openDialog(
      "Review your table request",
      "reservation",
      `<p><strong>${esc(f.get("guest"))}</strong><br>${esc(f.get("guests"))} guests · ${esc(f.get("date"))} at ${esc(f.get("time"))}</p><p>${esc(f.get("guest-email"))}</p><p>${esc($("booking-note").value)}</p><p>No availability has been checked and no booking will be made by this preview.</p>`,
      "",
    );
  });
}
if (DAZZLER_LAYOUT === "business") businessRender();
