import { reviewComposition } from "../skills/dazzler-frontend/scripts/composition.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { compilePageComposition } from "../skills/dazzler-frontend/scripts/page-composition.mjs";
import { tokens } from "../skills/dazzler-frontend/scripts/studio.mjs";
import { resumeConfig } from "../skills/dazzler-frontend/scripts/design-record.mjs";
const plan = () => ({
  idea: "Evidence surrounds a live instrument",
  sections: [
    {
      id: "instrument",
      columns: [2, 3, 1],
      mobileColumns: [1],
      gapRem: 2,
      paddingRem: 0,
      surface: "#123499",
      ink: "#FFFFFF",
      regions: [
        {
          id: "controls",
          desktop: { start: 2, span: 2 },
          mobile: { start: 1, span: 1 },
          font: "mono",
          sizeRem: [1, 4],
        },
      ],
    },
  ],
});
test("Open compositions export authored relationships and resume without mutation", () => {
  assert.doesNotThrow(() =>
    reviewComposition([], { purpose: "A live instrument surrounded by evidence" }),
  );
  assert.throws(() => reviewComposition([], { purpose: " " }));
  const input = plan(),
    before = structuredClone(input),
    result = compilePageComposition(input);
  assert.deepEqual(input, before);
  assert.match(result.css, /minmax\(0,3fr\)/);
  assert.match(result.css, /grid-column:2\/span 2/);
  assert.match(result.css, /padding:0rem/);
  assert.match(result.css, /@media/);
  assert.equal(result.status, "requires-render");
  assert(result.checks.every((x) => x.ratio >= 4.5));
  const built = tokens({ pageComposition: input, context: "enterprise finance" });
  assert.equal(built.system.policy.tone, "expressive");
  assert.deepEqual(built.system.pageComposition, input);
  assert.deepEqual(tokens(resumeConfig(built.system)), built);
  assert.throws(() => tokens({ schemaVersion: 2, pageComposition: input }));
  const other = plan();
  other.sections[0].columns = [1, 1, 1, 1, 1, 1, 1];
  assert.notEqual(compilePageComposition(other).css, result.css);
});
test("Composition rejects injection, malformed grids and unreadable text", () => {
  const changes = [
    (p) => (p.sections[0].id = 'x"]{display:none}'),
    (p) => (p.sections[0].columns = []),
    (p) => (p.sections[0].columns = [NaN]),
    (p) => (p.sections[0].regions[0].desktop.span = 3),
    (p) => (p.sections[0].regions[0].mobile.start = 2),
    (p) => (p.sections[0].ink = "#123499"),
    (p) => (p.sections[0].regions[0].ink = "#123499"),
    (p) => (p.sections[0].extra = "ignored"),
    (p) => p.sections.push(structuredClone(p.sections[0])),
    (p) => p.sections[0].regions.push(structuredClone(p.sections[0].regions[0])),
    (p) => (p.sections[0].regions[0].sizeRem = [4, 1]),
  ];
  for (const mutate of changes) {
    const p = plan();
    mutate(p);
    assert.throws(() => compilePageComposition(p));
  }
});
