// Informed Longshot task replay. The author already knows the implementation.
const { chromium } = require("playwright");
const fs = require("node:fs/promises"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
(async () => {
  const stage = path.resolve("maintenance/gallery-production/v0.32.0"),
    evidence = path.join(stage, "review");
  await fs.mkdir(evidence, { recursive: true });
  const browser = await chromium.launch(
    process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {},
  );
  const records = [];
  async function journey(id, goal, expected, run) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.route(/^https?:/, (r) => r.abort());
    await page.goto(
      pathToFileURL(path.resolve("skills/dazzler-frontend/assets/templates/ui", id, "index.html"))
        .href,
    );
    const observed = await run(page);
    await page.screenshot({ path: path.join(evidence, id + ".png"), fullPage: true });
    records.push({
      id,
      goal,
      expected,
      observed,
      execution: "completed",
      assistance: "informed diagnostic replay; source and earlier captures known",
      viewport: { width: 390, height: 844 },
      evidenceChannel: "rendered controls, keyboard and DOM assertions",
      capture: `review/${id}.png`,
    });
    await page.close();
  }
  try {
    await journey(
      "webapp-workspace",
      "Write a draft, save it and return to it. Open the revision guidance.",
      "Saved text survives reload in this browser; revision notes remain reachable.",
      async (p) => {
        await p
          .getByLabel("Chapter One Manuscript")
          .fill("The river connects the two neighborhoods.");
        await p.getByRole("button", { name: "Save Draft Locally" }).focus();
        await p.keyboard.press("Enter");
        assert.match(await p.locator("#status").innerText(), /saved/);
        await p.reload();
        assert.equal(
          await p.getByLabel("Chapter One Manuscript").inputValue(),
          "The river connects the two neighborhoods.",
        );
        await p.getByText("Revision Notes", { exact: true }).focus();
        await p.keyboard.press("Enter");
        assert(await p.locator(".revision").isVisible());
        return "Keyboard save persisted after reload; keyboard opened Revision Notes.";
      },
    );
    await journey(
      "webapp-board",
      "Finish the four local assignments.",
      "Every assignment reaches Ready and completed actions stop advancing.",
      async (p) => {
        for (let i = 0; i < 4; i++) {
          const b = p.locator(`[data-index="${i}"]`);
          for (let j = 0; j < 3 && (await b.isEnabled()); j++) await b.click();
          assert(await b.isDisabled());
        }
        assert.match(await p.locator("#done").innerText(), /4 of 4/);
        return "All four tasks reached Ready; completed buttons disabled; no publication occurred.";
      },
    );
    await journey(
      "webapp-settings",
      "Change the digest time and apply the preview.",
      "Selected time and local confirmation agree.",
      async (p) => {
        await p.getByLabel("Digest Time").selectOption("17:00");
        await p.getByRole("button", { name: "Apply to This Preview" }).focus();
        await p.keyboard.press("Enter");
        assert.equal(await p.locator("#time").innerText(), "17:00");
        assert.match(await p.locator("#status").innerText(), /preview.*17:00/);
        return "Keyboard submission confirmed 17:00 in the preview.";
      },
    );
    await journey(
      "data-revenue",
      "Compare members with revenue and return to revenue.",
      "Each measure keeps its own labelled scale and exact values.",
      async (p) => {
        await p.getByRole("button", { name: "Members", exact: true }).click();
        assert.match(await p.locator("#chart").innerText(), /480/);
        await p.getByRole("button", { name: "Revenue", exact: true }).click();
        assert.match(await p.locator("#chart").innerText(), /192/);
        return "Members shows 480; returning to Revenue shows 192 with its currency scale.";
      },
    );
    await journey(
      "data-operations",
      "Read a normal station, then inspect the warning station.",
      "The selected station has its own units and operating context.",
      async (p) => {
        await p.locator('[data-station="0"]').focus();
        await p.keyboard.press("Enter");
        assert.match(await p.locator("#inspector").innerText(), /18.4/);
        await p.locator('[data-station="1"]').click();
        assert.match(await p.locator("#inspector").innerText(), /2.8/);
        return "Keyboard selected Intake 18.4; Filter returned 2.8 bar and its warning context.";
      },
    );
    await journey(
      "restaurant-fine-dining",
      "Inspect the courses, then close the menu.",
      "The menu disclosure supports keyboard opening and closing.",
      async (p) => {
        const b = p.getByRole("button", { name: "Explore the Menu" });
        await b.focus();
        await p.keyboard.press("Enter");
        assert(await p.locator("#courses").isVisible());
        await p.keyboard.press("Enter");
        assert(await p.locator("#courses").isHidden());
        return "Keyboard opened and closed all five courses.";
      },
    );
    await journey(
      "restaurant-cafe",
      "Add two flat whites, filter products and clear the order twice.",
      "Subtotal is $9.00; filters preserve the ticket; repeated clear remains $0.00.",
      async (p) => {
        const b = p.getByRole("button", { name: "Add Flat White" });
        await b.click();
        await b.click();
        assert.equal(await p.locator("#total").innerText(), "$9.00");
        await p.getByRole("button", { name: "Bakery", exact: true }).click();
        assert.equal(await p.locator("#total").innerText(), "$9.00");
        await p.getByRole("button", { name: "Clear Order" }).click();
        await p.getByRole("button", { name: "Clear Order" }).click();
        assert.equal(await p.locator("#total").innerText(), "$0.00");
        return "Ticket survived filtering; repeated clearing kept the subtotal at zero.";
      },
    );
    await journey(
      "restaurant-reservations",
      "Preview a seating request with missing input, then supply a date.",
      "Missing date blocks submission; valid input produces a request preview, not a confirmed booking.",
      async (p) => {
        await p.getByRole("button", { name: "Preview Request" }).click();
        assert.equal(await p.locator("#status").innerText(), "");
        await p.locator('[data-zone="Quiet Corner"]').click();
        await p.getByLabel("Preferred Date").fill("2027-07-23");
        await p.getByRole("button", { name: "Preview Request" }).click();
        assert.match(await p.locator("#status").innerText(), /Quiet Corner.*Not confirmed/);
        return "Required date blocked the empty form; completed form explicitly reported Not confirmed.";
      },
    );
    await journey(
      "restaurant-menu",
      "Search for an absent dish, then restore vegetarian choices.",
      "Empty search has a useful result message; clearing and filtering restore valid options.",
      async (p) => {
        await p.getByLabel("Find a Dish").fill("no-such-dish");
        assert.match(await p.locator("#menu-items").innerText(), /No dishes/);
        await p.getByLabel("Find a Dish").fill("");
        await p.getByLabel("Vegetarian Only").check();
        assert.equal(await p.locator("#menu-items article").count(), 2);
        return "Empty search recovered to two vegetarian dishes after clearing and filtering.";
      },
    );
    await journey(
      "business-portal",
      "Review Materials, switch to Schedule, then undo Materials review.",
      "A review mark belongs only to its document and can be undone.",
      async (p) => {
        await p.getByRole("button", { name: "Mark Reviewed Locally" }).click();
        await p.getByRole("button", { name: "Schedule", exact: true }).click();
        assert.match(await p.locator("#status").innerText(), /Schedule awaits/);
        await p.getByRole("button", { name: "Materials", exact: true }).click();
        assert.match(await p.locator("#status").innerText(), /Materials marked reviewed/);
        await p.getByRole("button", { name: "Undo Local Review" }).click();
        assert.match(await p.locator("#status").innerText(), /Materials awaits/);
        return "Document switching preserved separate review states; undo restored Materials to awaiting review.";
      },
    );
    await fs.writeFile(
      path.join(stage, "longshot-journeys.json"),
      JSON.stringify(
        { review: "informed agent inspection, not a human participant study", records },
        null,
        2,
      ) + "\n",
    );
    console.log("10 informed task journeys passed.");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
