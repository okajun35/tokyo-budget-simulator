import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workspacePath = new URL(
  "../features/find-participation-route/participation-draft-workspace.tsx",
  import.meta.url,
);

test("keeps free text in component memory and never persists it", async () => {
  const source = await readFile(workspacePath, "utf8");

  for (const forbidden of [
    "localStorage",
    "sessionStorage",
    "XMLHttpRequest",
    "sendBeacon",
    "FormData",
    "useSearchParams",
  ]) {
    assert.doesNotMatch(source, new RegExp(forbidden.replace(/[()]/g, "\\$&")));
  }
  assert.doesNotMatch(source, /<form\b/i);
  assert.match(source, /navigator\.clipboard\.writeText\(summaryText\)/);
  assert.match(source, /fetch\("\/api\/participation\/refine"/);
  assert.match(source, /AI利用に同意する/);
  assert.match(source, /原意と異なる内容がないことを確認しました/);
  assert.match(source, /maxLength=\{PARTICIPATION_REFINEMENT_LIMITS\.concern\}/);
  assert.doesNotMatch(source, /categoryName[\s\S]*body:\s*JSON\.stringify/);
});
