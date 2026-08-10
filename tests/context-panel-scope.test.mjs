import assert from "node:assert/strict";
import test from "node:test";

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
  const html = await fetchHtml("/", label);
  const panel = html.match(
    /<aside class="contextPanel"[^>]*>.*?<\/aside>/,
  )?.[0];

  assert.ok(panel, "選択分野のパネルが見つからない");
  return panel;
};

test("keeps public cases out of the top panel", async () => {
  const panel = await topPanel("panel-without-cases");

  assert.doesNotMatch(panel, /data-budget-case-scope=/);
  assert.doesNotMatch(panel, /国内外の事例/);
});

test("keeps public cases on the category detail page", async () => {
  const html = await fetchHtml("/budget/welfare?amount=18730", "detail-with-cases");

  assert.match(html, /国内外の事例/);
  assert.match(html, /飯能市の在宅・障害・高齢者福祉事業/);
  assert.match(html, /ねたきり老人等手当と老人日常生活用具給付費を廃止/);
  assert.match(html, /イングランドの成人社会福祉支出/);
  assert.match(html, /東京都で同じ結果が起きるとの予測ではありません/);
});

test("keeps the document stage background out of the top panel", async () => {
  const panel = await topPanel("panel-without-background");

  assert.doesNotMatch(panel, /data-budget-background-stage=/);
  assert.doesNotMatch(panel, /東京都で現在の金額になった背景/);
});

test("keeps the document stage background on the category detail page", async () => {
  const html = await fetchHtml("/budget/welfare?amount=18730", "detail-with-background");

  assert.match(html, /東京都で現在の金額になった背景/);
  assert.match(html, /各局要求/);
  assert.match(html, /財務局査定/);
  assert.match(html, /知事査定/);
  assert.match(html, /都議会へ提出した段階/);
  assert.match(html, /18,730億円/);
});
