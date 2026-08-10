import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

const baseCss = css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");

const baseRuleFor = selector => {
  const rule = baseCss.match(new RegExp(`\\${selector}\\s*\\{([^{}]*)\\}`))?.[1];

  assert.ok(rule, `${selector} の宣言が見つからない`);
  return rule;
};

const topPageHtml = async label => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${label}-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  return (await response.text()).replaceAll("<!-- -->", "");
};

test("keeps the reset control with the amounts it resets", async () => {
  const html = await topPageHtml("reset-in-balance");
  const balance = html.match(/<div class="budgetBalance"[^>]*>[\s\S]*?<\/button><\/div>/)?.[0];

  assert.ok(balance, "年間総予算のセクションが見つからない");
  assert.match(balance, /初期値に戻す/);
  assert.match(balance, /年間総予算/);
  assert.match(balance, /分野へ配分済み/);
  assert.match(balance, /配分可能額/);
});

test("stops carrying the reset control in the section heading", async () => {
  const html = await topPageHtml("reset-not-in-heading");
  const heading = html.match(/<div class="sectionHead">.*?<\/div><\/div>/)?.[0];

  assert.ok(heading, "節の見出しが見つからない");
  assert.doesNotMatch(heading, /初期値に戻す/);
});

test("keeps the reset control reachable while the amounts stay pinned", () => {
  const balance = baseRuleFor(".budgetBalance");

  assert.match(balance, /position:sticky/);
  assert.match(balance, /grid-template-columns:[^;]*auto/);
});
