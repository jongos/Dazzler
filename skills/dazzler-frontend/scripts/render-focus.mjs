// Observe authored pages through an existing Playwright Page; no browser installation.
// Measurements identify review needs, never aesthetic quality or complete accessibility.
export async function inspectFocus(page, targets) {
  if (!Array.isArray(targets) || !targets.length || targets.length > 16)
    throw Error("Provide 1–16 primary-task targets");
  const ids = new Set();
  for (const t of targets) {
    if (
      !t ||
      typeof t.id !== "string" ||
      !t.id.trim() ||
      ids.has(t.id) ||
      typeof t.selector !== "string" ||
      !t.selector.trim() ||
      t.selector.length > 500 ||
      !["initial", "reachable"].includes(t.placement) ||
      typeof t.reason !== "string" ||
      !t.reason.trim()
    )
      throw Error("Each target needs a unique id, selector, placement and task reason");
    ids.add(t.id);
  }
  return page.evaluate((items) => {
    const viewport = { width: innerWidth, height: innerHeight };
    const results = items.map((t) => {
      let nodes;
      try {
        nodes = document.querySelectorAll(t.selector);
      } catch {
        return { ...t, status: "unknown", reason: "Invalid selector" };
      }
      if (nodes.length !== 1)
        return {
          ...t,
          status: "unknown",
          matches: nodes.length,
          reason: "Target must match exactly once",
        };
      const e = nodes[0],
        r = e.getBoundingClientRect(),
        style = getComputedStyle(e);
      const visible = e.checkVisibility
        ? e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
        : style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity) > 0;
      const inView =
        visible &&
        r.width > 0 &&
        r.height > 0 &&
        r.left >= 0 &&
        r.top >= 0 &&
        r.right <= innerWidth &&
        r.bottom <= innerHeight;
      return {
        ...t,
        status:
          !visible || !r.width || !r.height
            ? "review-hidden"
            : t.placement === "initial" && !inView
              ? "review-placement"
              : "observed",
        fullyInViewport: inView,
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
        font: { family: style.fontFamily, size: style.fontSize, lineHeight: style.lineHeight },
        note: "Geometry does not establish legibility, reachability or absence of overlays",
      };
    });
    return {
      viewport,
      scroll: { x: scrollX, y: scrollY },
      fonts: document.fonts.status,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      targets: results,
    };
  }, targets);
}

export async function captureFocus(page, { targets, screenshot, revision }) {
  if (
    typeof revision !== "string" ||
    !revision.trim() ||
    typeof screenshot !== "string" ||
    !screenshot
  )
    throw Error("A saved revision and screenshot path are required");
  // Bound font waiting; a hung font must not turn into an endless review.
  await page.evaluate(() =>
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 5000))]),
  );
  const measurement = await inspectFocus(page, targets);
  await page.screenshot({ path: screenshot, timeout: 10000 });
  return { revision, screenshot, ...measurement, reviewStatus: "needs-visual-review" };
}
