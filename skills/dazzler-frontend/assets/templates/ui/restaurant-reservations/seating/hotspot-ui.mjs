// Original Dazzler interaction adapter, Apache-2.0.
export function scaffold(root, config) {
  const el = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  root.classList.add("dazzler-hotspots");
  root.style.setProperty("--accent", config.color);
  root.style.fontFamily = config.font;
  const heading = el("h1", config.title),
    intro = el("p", config.description);
  const layout = el("div", "", "hotspot-layout"),
    visual = el("div", "", "hotspot-visual");
  const panel = el("section", "", "hotspot-panel");
  panel.setAttribute("aria-label", "Selected region details");
  panel.setAttribute("aria-live", "polite");
  const title = el("h2", "Explore the illustration"),
    detail = el("p", "Select a region or use the buttons below.");
  panel.append(title, detail);
  const choices = el("div", "", "hotspot-choices");
  choices.setAttribute("aria-label", "Illustration regions");
  const status = el("p", "", "hotspot-status");
  status.setAttribute("role", "status");
  layout.append(visual, panel);
  root.append(heading, intro, layout, choices, status);
  let highlight = () => {};
  const buttons = new Map();
  function activate(id) {
    const region = config.regions.find((r) => r.id === id);
    if (!region) return;
    title.textContent = region.label;
    detail.textContent = region.description;
    for (const [key, button] of buttons) button.setAttribute("aria-pressed", String(key === id));
    highlight(id);
    root.dataset.selected = id;
  }
  for (const r of config.regions) {
    const b = el("button", r.label);
    b.type = "button";
    b.dataset.regionButton = r.id;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => activate(r.id));
    buttons.set(r.id, b);
    choices.append(b);
  }
  const all = el("details"),
    summary = el("summary", "Read all region descriptions");
  all.append(summary);
  for (const r of config.regions) all.append(el("h3", r.label), el("p", r.description));
  root.append(all);
  const footer = el("footer", "", "hotspot-notes");
  footer.append(
    el(
      "p",
      "Notes: " +
        (config.source || "Project-supplied artwork and descriptions.") +
        " " +
        config.credit,
    ),
  );
  root.append(footer);
  return {
    visual,
    status,
    activate,
    setHighlight(fn) {
      highlight = fn;
    },
    el,
  };
}

export function decorateMap(visual, config, activate) {
  const img = visual.querySelector("img");
  if (img) {
    img.alt = config.imageAlt;
    img.removeAttribute("role");
  }
  visual.querySelectorAll("area").forEach((area, index) => {
    const r = config.regions[index];
    if (!r) return;
    area.alt = r.label;
    area.setAttribute("aria-label", r.label);
    area.setAttribute("role", "button");
    area.tabIndex = 0;
    area.removeAttribute("href");
    area.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate(r.id);
      }
    };
  });
}

export function watchMap(visual, config, activate) {
  const update = () => decorateMap(visual, config, activate);
  const observer = new MutationObserver(update);
  observer.observe(visual, { childList: true, subtree: true });
  update();
  return () => observer.disconnect();
}
