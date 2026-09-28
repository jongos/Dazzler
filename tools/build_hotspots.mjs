import { build } from "esbuild";
import { readFile, writeFile, mkdir, readdir, copyFile, unlink } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
const root = process.cwd(),
  dest = path.join(root, "skills/dazzler-frontend/scripts/vendor/hotspots");
await mkdir(path.join(dest, "licenses"), { recursive: true });
const packages = new Map(),
  files = {};
for (const kind of ["svg", "react", "vue", "native", "xml"]) {
  const result = await build({
    entryPoints: [
      kind === "xml"
        ? "tools/xml-entry.mjs"
        : `skills/dazzler-frontend/scripts/hotspot-${kind}.mjs`,
    ],
    outfile: path.join(dest, kind + (kind === "xml" ? ".mjs" : ".js")),
    bundle: true,
    format: kind === "xml" ? "esm" : "iife",
    globalName: kind === "xml" ? undefined : "DazzlerHotspots",
    platform: "browser",
    target: "es2022",
    minify: true,
    legalComments: "inline",
    metafile: true,
    define: {
      "process.env.NODE_ENV": '"production"',
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
    },
  });
  for (const input of Object.keys(result.metafile.inputs)) {
    if (!input.includes("node_modules/")) continue;
    let dir = path.dirname(path.resolve(input));
    while (dir !== root && dir !== path.dirname(dir)) {
      try {
        const pkg = JSON.parse(await readFile(path.join(dir, "package.json"), "utf8"));
        if (pkg.name) {
          packages.set(dir, pkg);
          break;
        }
      } catch {}
      dir = path.dirname(dir);
    }
  }
}
const notices = [];
for (const old of await readdir(path.join(dest, "licenses")))
  await unlink(path.join(dest, "licenses", old));
for (const [dir, pkg] of packages) {
  const names = (await readdir(dir)).filter((n) => /^(license|copying|notice)(\.|$)/i.test(n));
  if (!names.length) throw Error("Missing license " + pkg.name);
  for (const n of names)
    await copyFile(
      path.join(dir, n),
      path.join(dest, "licenses", pkg.name.replaceAll("/", "__") + "@" + pkg.version + "-" + n),
    );
  notices.push({
    name: pkg.name,
    version: pkg.version,
    license: pkg.license,
    repository: pkg.repository,
    licenseFiles: names.map(
      (n) => "licenses/" + pkg.name.replaceAll("/", "__") + "@" + pkg.version + "-" + n,
    ),
  });
}
async function inventory(folder) {
  for (const e of await readdir(folder, { withFileTypes: true })) {
    const p = path.join(folder, e.name);
    if (e.isDirectory()) await inventory(p);
    else if (e.name !== "provenance.json")
      files[path.relative(dest, p).replaceAll("\\", "/")] = createHash("sha256")
        .update(await readFile(p))
        .digest("hex");
  }
}
await inventory(dest);
await writeFile(
  path.join(dest, "provenance.json"),
  JSON.stringify(
    {
      build: "tools/build_hotspots.mjs; pinned package-lock.json",
      packages: notices.sort((a, b) => a.name.localeCompare(b.name)),
      files,
    },
    null,
    2,
  ) + "\n",
);
console.log("Built hotspot adapters with " + notices.length + " package notices.");
