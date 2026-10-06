const $ = (s) => document.querySelector(s);
const tasks = {
  website: "design and build a website",
  dashboard: "turn my data into a clear dashboard",
  document: "create a polished document",
  refine: "refine this existing interface",
};
function prompt() {
  const brief = $("#brief").value.trim();
  $("#built-prompt").textContent =
    `Use $dazzler-frontend to ${tasks[$("#task").value]}${brief ? `. ${brief}` : " for my project."} Choose the typography, colors and layout automatically. Preserve verified content and existing brand constraints. Check the rendered result with available tools.`;
}
$("#task").addEventListener("change", prompt);
$("#brief").addEventListener("input", prompt);
prompt();
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    $("#notice").textContent = "Prompt copied. Paste it into your agent.";
  } catch {
    $("#notice").textContent = "Clipboard unavailable. Select the prompt and copy it manually.";
  }
  setTimeout(() => ($("#notice").textContent = ""), 6000);
}
$("#copy-prompt").addEventListener("click", () => copy($("#built-prompt").textContent));
let active = "all";
function filter() {
  const q = $("#search").value.trim().toLowerCase();
  let n = 0;
  document.querySelectorAll(".showcase-grid article").forEach((el) => {
    el.hidden =
      !(active === "all" || el.dataset.format === active) ||
      !el.textContent.toLowerCase().includes(q);
    if (!el.hidden) n++;
  });
  $("#results").textContent = `${n} of 30 examples shown`;
}
document.querySelectorAll("[data-filter]").forEach((b) =>
  b.addEventListener("click", () => {
    active = b.dataset.filter;
    document
      .querySelectorAll("[data-filter]")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    filter();
  }),
);
$("#search").addEventListener("input", filter);
const hosts = {
  codex: [
    "npx skills add jongos/Dazzler --skill dazzler-frontend",
    "Choose Codex in the installer. Then: Use $dazzler-frontend to …",
  ],
  claude: [
    "claude plugin marketplace add jongos/Dazzler\nclaude plugin install dazzler@dazzler",
    "Then: /dazzler:dazzler-frontend …",
  ],
  gemini: [
    "gemini extensions install https://github.com/jongos/Dazzler --ref v0.25.0",
    "Review consent, refresh Gemini, then ask it to use Dazzler.",
  ],
  cursor: [
    "npx skills add jongos/Dazzler --skill dazzler-frontend",
    "Choose Cursor in the installer, refresh, then ask it to use Dazzler.",
  ],
  copilot: [
    "npx skills add jongos/Dazzler --skill dazzler-frontend",
    "Choose GitHub Copilot in the installer, refresh, then ask it to use Dazzler.",
  ],
  grokbot: [
    "/home/box/agent-data/workflows/dazzler/SKILL.md",
    "Extract the Grok Bot ZIP to this workflow path. Host indexing remains unverified; see the platform guide.",
  ],
  portable: [
    "Use the portable Dazzler prompt with your project brief.",
    "A prompt carries guidance; it does not install executable tools or fonts into a chat account.",
  ],
};
function host() {
  const [command, note] = hosts[$("#host").value];
  $("#install-command").textContent = command;
  $("#host-note").textContent = note;
}
$("#host").addEventListener("change", host);
host();
let printDetails = [];
addEventListener("beforeprint", () => {
  printDetails = [...document.querySelectorAll("details")].filter((el) => !el.open);
  printDetails.forEach((el) => (el.open = true));
});
addEventListener("afterprint", () => printDetails.forEach((el) => (el.open = false)));
