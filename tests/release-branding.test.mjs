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
