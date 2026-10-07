import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { directions, distance } from "../skills/dazzler-frontend/scripts/document-directions.mjs";

test("Reader scenarios condition structures without weakening locks or inventing assets", () => {
  const corpus = JSON.parse(
    readFileSync(new URL("./fixtures/reading-task-scenarios.json", import.meta.url), "utf8"),
  );
  for (const scenario of corpus.cases) {
    for (let seed = 0; seed < 12; seed++) {
      const input = {
        purpose: scenario.purpose,
        readingTask: scenario.readingTask,
        content: scenario.content,
        locks: scenario.locks ?? {},
        seed: "reader-" + seed,
        count: 3,
      };
      const result = directions(input);
      assert.equal(result.candidates.length, 3, scenario.id);
      assert.deepEqual(result, directions(input));
      for (const c of result.candidates) {
        assert(scenario.expectedGrid.includes(c.choices.grid), scenario.id);
        assert(scenario.expectedDensity.includes(c.choices.density), scenario.id);
        assert.equal(c.choices.imageTreatment, "none");
        if (!scenario.content.includes("data")) assert.equal(c.choices.evidence, "prose-led");
        if (scenario.readingTask === "reference")
          assert(["side-index", "section-tab"].includes(c.choices.navigation));
      }
    }
  }
  for (const value of ["mixed", "bogus", ["continuous"], null])
    assert.throws(() => directions({ purpose: "x", readingTask: value }));
});
test("Directions preserve locks, source prerequisites and reproducibility", () => {
  const input = {
    purpose: "Explain the canopy study",
    seed: "fixed",
    count: 6,
    content: ["prose", "data"],
    locks: { colorRole: "monochrome" },
  };
  const copy = structuredClone(input),
    a = directions(input);
  assert.deepEqual(input, copy);
  assert.deepEqual(a, directions(input));
  assert.equal(a.candidates.length, 6);
  for (const c of a.candidates) {
    assert.equal(c.choices.colorRole, "monochrome");
    assert.equal(c.choices.imageTreatment, "none");
    assert.notEqual(c.choices.opener, "image-led");
    assert.equal(c.status, "unrendered");
  }
  for (let i = 0; i < 6; i++)
    for (let j = i + 1; j < 6; j++)
      assert(distance(a.candidates[i].choices, a.candidates[j].choices) >= 4);
  assert.notDeepEqual(a.candidates, directions({ ...input, seed: "another" }).candidates);
});
test("Directions never invent supplied imagery or data and reject conflicting controls", () => {
  for (let i = 0; i < 20; i++)
    for (const c of directions({ purpose: "A letter", seed: String(i) }).candidates) {
      assert.equal(c.choices.imageTreatment, "none");
      assert.equal(c.choices.evidence, "prose-led");
      assert.notEqual(c.choices.motif, "data-derived");
      assert.notEqual(c.choices.opener, "evidence-led");
    }
  for (const input of [
    { purpose: "x", locks: { opener: "image-led" } },
    { purpose: "x", locks: { evidence: "chart-led" } },
    { purpose: "x", count: 9 },
    { purpose: "x", seed: 42 },
    { purpose: "x", content: ["bogus"] },
    { purpose: "x", locks: { bogus: "x" } },
  ])
    assert.throws(() => directions(input));
});

test("Exact page backgrounds survive color derivation with readable companions", () => {
  for (const background of ["#FFFFFF", "#000000", "#0044CC", "#FFD600", "#AF2378"]) {
    const result = directions({
      purpose: "Respect the supplied page color",
      seed: "surface",
      background,
      count: 3,
    });
    assert.equal(result.candidates.length, 3);
    for (const candidate of result.candidates) {
      assert.equal(candidate.pagePalette.tokens.background.toUpperCase(), background);
      assert.equal(candidate.pagePalette.status, "pass");
      assert.equal(candidate.pagePalette.backgroundSource, "explicit");
    }
  }
  assert.throws(() => directions({ purpose: "x", background: "yellow" }));
});
