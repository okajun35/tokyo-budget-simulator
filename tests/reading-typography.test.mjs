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
 * 実測では、13pxの説明文は1文字あたり約13.05pxを占める。
 * `.lead` の上限720pxは約55文字にあたり、これを超えると折り返して
 * 「す。」のような数文字だけが最終行に残る。
 */
const LEAD_MAX_CHARS = 55;

test("keeps the top-page lead within one line of its own column", async () => {
  const lead = (await fetchTopPageHtml()).match(/<p class="lead">(.*?)<\/p>/)?.[1];

  assert.ok(lead, "トップの説明文が見つからない");
  assert.doesNotMatch(lead, /</, "説明文を要素で分割していない");
  assert.ok(
    lead.length <= LEAD_MAX_CHARS,
    `説明文が${lead.length}字で、1行に収まる${LEAD_MAX_CHARS}字を超えている`,
  );
});

/**
 * 狭い窓では54文字でも折り返す。そのとき語の途中で割れないように、
 * 文節単位の改行と行のバランスを指定する。文節指定はChromium系のみが
 * 解釈し、未対応の環境では従来どおりの改行になる。
 */
test("wraps a narrow window at phrase boundaries instead of inside a word", () => {
  for (const selector of [".lead", ".intro"]) {
    const declarations = declarationsFor(selector);

    assert.match(declarations, /word-break:auto-phrase/, selector);
    assert.match(declarations, /text-wrap:balance/, selector);
  }
});
