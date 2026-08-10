import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

const baseCss = css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");

const baseRules = [...baseCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selectors, body]) => ({
  selectors: selectors.split(",").map(selector => selector.trim()),
  body,
}));

const declarationsFor = selector => {
  const bodies = baseRules
    .filter(rule => rule.selectors.includes(selector))
    .map(rule => rule.body);

  assert.ok(bodies.length > 0, `${selector} の宣言が見つからない`);
  return bodies.join(" ");
};

const fetchTopPageHtml = async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `lead-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  return (await response.text()).replaceAll("<!-- -->", "");
};

/**
 * 説明文が「す。」のような数文字だけを最終行へ落としたり、
 * 「数字」のような語を行の途中で割ると、文が途切れて見える。
 * 文ごとに行を分けて、どちらも起こらないようにする。
 */
test("starts a new line at every sentence of the top-page lead", async () => {
  const lead = (await fetchTopPageHtml()).match(/<p class="lead">.*?<\/p>/)?.[0];

  assert.ok(lead, "トップの説明文が見つからない");

  const sentences = [...lead.matchAll(/<span>([^<]*)<\/span>/g)].map(match => match[1]);

  assert.equal(sentences.length, 2);
  for (const sentence of sentences) {
    assert.match(sentence, /。$/, sentence);
  }
});

test("keeps each sentence on its own line and balances a wrapped one", () => {
  assert.match(declarationsFor(".lead>span"), /display:block/);
  for (const selector of [".lead", ".intro"]) {
    assert.match(declarationsFor(selector), /text-wrap:balance/, selector);
  }
});
