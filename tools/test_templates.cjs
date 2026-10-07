// Canonical gallery QA; functional, heading, responsive and axe checks.
process.env.DAZZLER_GALLERY_SOURCE = require("node:path").resolve(
  "skills/dazzler-frontend/assets/templates",
);
require("./gallery_027_check.cjs");
