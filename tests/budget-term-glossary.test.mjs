import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_TERM_GLOSSARY } from "../domain/tokyo-budget/budget-term-glossary.ts";

const PAGES = [
  "/",
  "/budget/debt?amount=1959",
  "/budget/linked",
  "/budget-process",
  "/participation",
  "/sources",
  "/about",
  "/fiscal-context",
];

/** 初出の直後に説明が続いていることを見るため、タグを外した本文で判定する。 */
const visibleTextOf = async path => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `glossary-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  const body = html.slice(html.indexOf("<body"), html.indexOf("</body>"));

  return body
    .replaceAll("<!-- -->", "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, "");
};

/** 初出から数えて、この文字数以内に説明が現れていれば同じ視界にあると扱う。 */
const NEARBY_CHARS = 90;

test("explains an official term where the reader first meets it", async () => {
  const missing = [];

  for (const path of PAGES) {
    const text = await visibleTextOf(path);

    for (const [term, { acceptedPhrases }] of Object.entries(BUDGET_TERM_GLOSSARY)) {
      const first = text.indexOf(term);
      if (first === -1) continue;

      const nearby = text.slice(first, first + term.length + NEARBY_CHARS);
      if (!acceptedPhrases.some(phrase => nearby.includes(phrase))) {
        missing.push(`${path}「${term}」: ${nearby.slice(0, 56)}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});
