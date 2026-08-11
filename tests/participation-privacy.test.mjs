import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workspacePath = new URL(
  "../features/find-participation-route/participation-workspace.tsx",
  import.meta.url,
);

test("keeps free text in component memory and never persists or transmits it", async () => {
  const source = await readFile(workspacePath, "utf8");

  for (const forbidden of [
    "localStorage",
    "sessionStorage",
    "fetch(",
    "XMLHttpRequest",
    "sendBeacon",
    "FormData",
    "useSearchParams",
  ]) {
    assert.doesNotMatch(source, new RegExp(forbidden.replace(/[()]/g, "\\$&")));
  }
  assert.doesNotMatch(source, /<form\b/i);
  assert.match(source, /navigator\.clipboard\.writeText\(summaryText\)/);
});
