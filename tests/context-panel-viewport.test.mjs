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

const fetchHtml = async (path, label) => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${label}-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request(`http://localhost${path}`, {
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

const topPanel = async label => {
  const panel = (await fetchHtml("/", label)).match(/<aside class="contextPanel"[^>]*>[\s\S]*?<\/aside>/)?.[0];

  assert.ok(panel, "選択分野のパネルが見つからない");
  return panel;
};

test("never clips the panel content", () => {
  const panel = baseRuleFor(".contextPanel");

  assert.doesNotMatch(panel, /max-height/);
  assert.doesNotMatch(panel, /overflow/);
});

test("keeps the change options on the category detail page", async () => {
  const panel = await topPanel("panel-without-options");
  const detail = await fetchHtml("/budget/welfare?amount=18730", "detail-with-options");

  assert.doesNotMatch(panel, /data-change-option=/);
  assert.doesNotMatch(panel, /給付対象や単価を見直す/);
  assert.match(detail, /変更方法と検討の論点/);
  assert.match(detail, /給付対象や単価を見直す/);
});

test("still states on the top page that a change has more than one method", async () => {
  const panel = await topPanel("panel-change-caution");

  assert.match(panel, /一つに決まりません/);
  assert.match(
    panel,
    /<a[^>]*href="\/budget\/welfare\?amount=18730#options-heading"[^>]*>変更方法と論点を見る/,
  );
});

test("keeps the field meaning and both routes visible without scrolling the panel", async () => {
  const panel = await topPanel("panel-core");

  assert.match(panel, /そもそも何のお金？/);
  assert.match(panel, /高齢者、障害者、子ども・子育て世帯への福祉/);
  assert.match(panel, /class="mainUseTags"/);
  assert.match(panel, /class="detailLink"/);
  assert.match(panel, /class="participationDetailLink"/);
  assert.doesNotMatch(panel, /class="contextPanelBody"/);
});
