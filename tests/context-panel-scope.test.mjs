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

test("keeps the evidence boundary out of the top panel", async () => {
  const panel = await topPanel("panel-without-evidence-boundary");

  assert.doesNotMatch(panel, /data-evidence-status="unknown"/);
  assert.doesNotMatch(panel, /公開情報だけでは判断できないこと/);
});

test("keeps the evidence boundary on the category detail page", async () => {
  const html = await fetchHtml("/budget/welfare?amount=18730", "detail-with-evidence-boundary");

  assert.match(html, /どこまで確かに言える/);
  assert.match(html, /data-evidence-kind="fact"/);
  assert.match(html, /data-evidence-kind="case_fact"/);
  assert.match(html, /data-evidence-kind="interpretation"/);
  assert.match(html, /data-evidence-kind="unknown"/);
  assert.match(html, /公開情報だけでは分からないこと/);
});

test("keeps the participation routes out of the top panel", async () => {
  const panel = await topPanel("panel-without-participation");

  assert.doesNotMatch(panel, /意見を伝える先/);
  assert.doesNotMatch(panel, /組織別予算との一対一対応ではありません/);
  assert.doesNotMatch(panel, /都民の声/);
  assert.doesNotMatch(panel, /請願/);
});

test("still reaches the participation page for the selected category from the top panel", async () => {
  const panel = await topPanel("panel-participation-link");

  assert.match(
    panel,
    /<a(?=[^>]*class="participationDetailLink")(?=[^>]*href="\/participation\?category=welfare")[^>]*>/,
  );
  assert.match(panel, /反映は保証されません/);
});

test("keeps the participation routes on the category detail page", async () => {
  const html = await fetchHtml("/budget/welfare?amount=18730", "detail-with-participation");

  assert.match(html, /意見を伝える先/);
  assert.match(html, /福祉局/);
  assert.match(html, /都民の声/);
  assert.match(html, /請願/);
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
