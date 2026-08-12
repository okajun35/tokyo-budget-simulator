import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("uses the Tokyo Budget Lab identity in package metadata and favicon", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const favicon = await readFile(new URL("../public/favicon.svg", import.meta.url), "utf8");

  assert.equal(packageJson.displayName, "東京予算ラボ");
  assert.match(favicon, /<title>東京予算ラボ<\/title>/);
  assert.match(favicon, />都<\/text>/);
});

test("does not emit unused next/font requests from a deployment build path", async () => {
  const layout = await readFile(
    new URL("../app/layout.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(layout, /next\/font/);
  assert.doesNotMatch(layout, /font-geist/);
});

test("uses the public custom domain as the canonical metadata origin", async () => {
  const layout = await readFile(
    new URL("../app/layout.tsx", import.meta.url),
    "utf8",
  );

  assert.match(layout, /metadataBase:\s*new URL\("https:\/\/tokyobudget\.page"\)/);
  assert.match(layout, /canonical:\s*"\/"/);
  assert.match(layout, /url:\s*"\/"/);
});

test("licenses project code without relicensing Tokyo source materials", async () => {
  const license = await readFile(new URL("../LICENSE", import.meta.url), "utf8");
  const notice = await readFile(new URL("../NOTICE", import.meta.url), "utf8");
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.match(license, /MIT License/);
  assert.match(notice, /data\/tokyo-budget/);
  assert.match(notice, /features\/trace-budget-sources\/budget-sources\.ts/);
  assert.match(notice, /docs\/web-image\.png/);
  assert.match(readme, /## ライセンス/);
  assert.equal(packageJson.license, "MIT");
});

test("pins the patched Next.js release line", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.equal(packageJson.dependencies.next, "16.3.0");
  assert.equal(packageJson.devDependencies["eslint-config-next"], "16.3.0");
});
