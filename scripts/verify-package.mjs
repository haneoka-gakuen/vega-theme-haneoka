import { readFile } from "node:fs/promises";

const manifest = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
if (!manifest.repository?.url?.endsWith("/vega-theme-haneoka.git")) {
  throw new Error("package repository must point to the independent theme repository");
}
if (manifest.publishConfig?.access !== "public" || manifest.publishConfig?.provenance !== true) {
  throw new Error("public provenance publishing is required");
}
if ((manifest.files ?? []).some((entry) => entry === "src")) {
  throw new Error("source workspace internals are not part of the package");
}
process.stdout.write("Theme package boundary verified\n");
