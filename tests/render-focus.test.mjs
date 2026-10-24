import test from "node:test";
import assert from "node:assert/strict";
import { inspectFocus } from "../skills/dazzler-frontend/scripts/render-focus.mjs";

test("focus rejects ambiguous contracts before browser execution", async () => {
  const page = {
    evaluate() {
      throw Error("must not execute");
    },
  };
  await assert.rejects(inspectFocus(page, []), /1–16/);
  const t = { id: "action", selector: "#save", placement: "initial", reason: "Assign job" };
  await assert.rejects(inspectFocus(page, [t, t]), /unique/);
  await assert.rejects(inspectFocus(page, [{ ...t, placement: "always-compact" }]), /placement/);
});

test("geometry flags displaced tasks without inventing a density preference", async () => {
  const previous = {
    document: globalThis.document,
    innerWidth: globalThis.innerWidth,
    innerHeight: globalThis.innerHeight,
    scrollX: globalThis.scrollX,
    scrollY: globalThis.scrollY,
    getComputedStyle: globalThis.getComputedStyle,
  };
  Object.assign(globalThis, {
    innerWidth: 1000,
    innerHeight: 800,
    scrollX: 0,
    scrollY: 0,
    getComputedStyle: () => ({ fontFamily: "test", fontSize: "16px", lineHeight: "24px" }),
    document: {
      fonts: { status: "loaded" },
      documentElement: { scrollWidth: 1000 },
      querySelectorAll: (s) =>
        s === "#missing"
          ? []
          : [
              {
                checkVisibility: () => true,
                getBoundingClientRect: () => ({
                  x: 0,
                  y: 900,
                  left: 0,
                  top: 900,
                  right: 100,
                  bottom: 950,
                  width: 100,
                  height: 50,
                }),
              },
            ],
    },
  });
  try {
    const page = { evaluate: (fn, arg) => fn(arg) };
    const t = { id: "action", selector: "#save", placement: "initial", reason: "Assign job" };
    assert.equal((await inspectFocus(page, [t])).targets[0].status, "review-placement");
    assert.equal(
      (await inspectFocus(page, [{ ...t, placement: "reachable" }])).targets[0].status,
      "observed",
    );
    assert.equal(
      (await inspectFocus(page, [{ ...t, selector: "#missing" }])).targets[0].status,
      "unknown",
    );
  } finally {
    Object.assign(globalThis, previous);
  }
});
