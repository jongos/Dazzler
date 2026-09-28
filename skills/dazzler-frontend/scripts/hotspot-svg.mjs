// Original Dazzler interaction adapter, Apache-2.0.
import { SVG } from "@svgdotjs/svg.js";
import { scaffold } from "./hotspot-ui.mjs";
export function mount(root, config) {
  const ui = scaffold(root, config);
  // Artwork is strictly validated by hotspots.mjs before it reaches this adapter.
  const doc = new DOMParser().parseFromString(config.artwork, "image/svg+xml");
  const node = document.importNode(doc.documentElement, true);
  ui.visual.append(node);
  const draw = SVG(node),
    box = draw.viewbox();
  draw.attr({ width: "100%", height: null, role: "group", "aria-label": config.imageAlt });
  const regions = new Map();
  for (const r of config.regions) {
    const shape = draw.findOne('[id="' + r.id + '"]');
    if (!shape) throw Error("Missing SVG region: " + r.id);
    shape.attr({
      "data-dazzler-region": r.id,
      tabindex: 0,
      role: "button",
      "aria-label": r.label,
      "aria-pressed": "false",
    });
    shape.on("click", (e) => {
      e.stopPropagation();
      ui.activate(r.id);
    });
    shape.on("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        ui.activate(r.id);
      }
    });
    regions.set(r.id, shape);
  }
  const outline = draw.rect(0, 0).fill("none").stroke({ color: config.color, width: 3 }).attr({
    "pointer-events": "none",
    "aria-hidden": "true",
    "vector-effect": "non-scaling-stroke",
    visibility: "hidden",
  });
  ui.setHighlight((id) => {
    for (const [key, shape] of regions)
      shape.attr({ "aria-pressed": String(key === id), "data-selected": String(key === id) });
    const bounds = regions.get(id).rbox(draw);
    outline
      .size(bounds.width, bounds.height)
      .move(bounds.x, bounds.y)
      .attr("visibility", "visible");
  });
  const toolbar = ui.el("div", "", "hotspot-toolbar");
  toolbar.setAttribute("aria-label", "Illustration view controls");
  let zoom = 1,
    dx = 0,
    dy = 0;
  function update() {
    const w = box.width / zoom,
      h = box.height / zoom;
    draw.viewbox(box.x + (box.width - w) / 2 + dx, box.y + (box.height - h) / 2 + dy, w, h);
  }
  for (const [label, fn] of [
    ["Zoom in", () => (zoom = Math.min(4, zoom * 1.25))],
    ["Zoom out", () => (zoom = Math.max(1, zoom / 1.25))],
    ["Move left", () => (dx -= box.width / 10 / zoom)],
    ["Move right", () => (dx += box.width / 10 / zoom)],
    ["Move up", () => (dy -= box.height / 10 / zoom)],
    ["Move down", () => (dy += box.height / 10 / zoom)],
    [
      "Reset view",
      () => {
        zoom = 1;
        dx = dy = 0;
      },
    ],
  ]) {
    const b = ui.el("button", label);
    b.type = "button";
    b.addEventListener("click", () => {
      fn();
      update();
    });
    toolbar.append(b);
  }
  ui.visual.before(toolbar);
  ui.status.textContent =
    "Select shapes with a pointer, Enter or Space; view controls also work with the keyboard.";
  root.dataset.renderer = "svgjs";
  return () => {
    draw.remove();
    root.replaceChildren();
  };
}
