import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
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
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("introduces the simulator briefly and links straight to the controls", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `intro-${process.pid}-${Date.now()}`);
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
  const html = await response.text();

  assert.match(html, /成立後当初予算を基準にした仮想シミュレーション/);
  assert.match(
    html,
    /<a(?=[^>]*href=["']#simulator["'])[^>]*>予算を動かしてみる/,
  );
});

test("offers all four primary navigation destinations", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `navigation-${process.pid}-${Date.now()}`);
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
  const html = await response.text();
  const navigation = html.match(/<nav aria-label="主要メニュー">.*?<\/nav>/)?.[0];

  assert.ok(navigation);
  assert.match(navigation, />予算シミュレーター</);
  assert.match(navigation, />予算が決まるまで</);
  assert.match(navigation, />声を届ける</);
  assert.match(navigation, />出典・データ</);
});

test("shows the fiscal year, general account, and main revenue at the top", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `overview-${process.pid}-${Date.now()}`);
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
  const html = await response.text();
  const overview = html.match(
    /<div class="overviewCards" aria-label="令和8年度予算の概要">.*?<\/div><\/section>/,
  )?.[0];

  assert.ok(overview);
  assert.match(overview, /対象年度/);
  assert.match(overview, /令和8年度/);
  assert.match(overview, /一般会計総額/);
  assert.match(overview, /9兆6,530億円/);
  assert.match(overview, /主要財源・都税/);
  assert.match(overview, /7兆3,856億円/);
});

test("places budget controls and category meaning in one workspace", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `workspace-${process.pid}-${Date.now()}`);
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
  const html = await response.text();

  assert.match(
    html,
    /<div class="simulatorWorkspace"><section class="budgetControls" aria-label="9分野の予算操作">/,
  );
  assert.match(
    html,
    /<aside class="contextPanel" id="category-context" aria-label="選択分野の変更の意味">/,
  );
});

test("shows enacted and proposed amounts with the change in all nine rows", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `rows-${process.pid}-${Date.now()}`);
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
  const html = await response.text();

  assert.equal(html.match(/data-budget-category=/g)?.length, 9);
  assert.match(html, /成立予算/);
  assert.match(html, /あなたの案/);
  assert.match(html, /±0億円/);
  assert.match(html, /±0\.0%/);
});

test("identifies exactly one selected budget row without relying on color", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `selected-${process.pid}-${Date.now()}`);
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
  const html = await response.text();

  assert.equal(html.match(/aria-current="true"/g)?.length, 1);
  assert.equal(html.match(/>選択中</g)?.length, 1);
});

test("offers one detail cue for the selected category", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `detail-cue-${process.pid}-${Date.now()}`);
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
  const html = await response.text();

  assert.equal(html.match(/href="#category-context"/g)?.length, 1);
  assert.equal(html.match(/>この変更の意味を見る</g)?.length, 1);
});

test("shows the selected category and its complete comparison in the context panel", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `context-comparison-${process.pid}-${Date.now()}`);
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
  const html = await response.text();
  const panel = html.match(
    /<aside class="contextPanel" id="category-context" aria-label="選択分野の変更の意味">.*?<\/aside>/,
  )?.[0];

  assert.ok(panel);
  assert.match(panel, /<h2>福祉と保健<\/h2>/);
  assert.match(panel, /成立予算.*?18,730億円/);
  assert.match(panel, /あなたの案.*?18,730億円/);
  assert.match(panel, /変更額.*?±0億円/);
  assert.match(panel, /変更率.*?±0\.0%/);
});

test("explains the selected category and offers multiple ways to change it", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `context-meaning-${process.pid}-${Date.now()}`);
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
  const html = await response.text();
  const panel = html.match(
    /<aside class="contextPanel" id="category-context" aria-label="選択分野の変更の意味">.*?<\/aside>/,
  )?.[0];

  assert.ok(panel);
  assert.match(panel, /そもそも何のお金？/);
  assert.match(panel, /高齢者、障害者、子ども・子育て世帯への福祉/);
  assert.equal(panel.match(/data-change-option=/g)?.length, 3);
  assert.match(panel, /給付対象や単価を見直す/);
  assert.match(panel, /施設・相談サービスを見直す/);
  assert.match(panel, /新規事業の規模や時期を見直す/);
  assert.match(panel, /確定案ではありません/);
});

test("summarizes domestic and international cases with their evidential limits", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `context-cases-${process.pid}-${Date.now()}`);
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
  const html = await response.text();
  const panel = html.match(
    /<aside class="contextPanel" id="category-context" aria-label="選択分野の変更の意味">.*?<\/aside>/,
  )?.[0];

  assert.ok(panel);
  assert.equal(panel.match(/data-budget-case-scope=/g)?.length, 2);
  assert.match(panel, /data-budget-case-scope="domestic"/);
  assert.match(panel, /埼玉県飯能市/);
  assert.match(panel, /2026年度/);
  assert.match(panel, /ねたきり老人等手当と老人日常生活用具給付費を廃止/);
  assert.match(panel, /直接確認された運用変更/);
  assert.match(panel, /長期的な影響は確認されていません/);
  assert.match(panel, /data-budget-case-scope="international"/);
  assert.match(panel, /イングランドの地方自治体/);
  assert.match(panel, /東京都で同じ結果になるとは限りません/);
});

test("separates each Tokyo budget stage behind the enacted amount", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `context-background-${process.pid}-${Date.now()}`);
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
  const html = await response.text();
  const panel = html.match(
    /<aside class="contextPanel" id="category-context" aria-label="選択分野の変更の意味">.*?<\/aside>/,
  )?.[0];

  assert.ok(panel);
  assert.match(panel, /東京都で現在の金額になった背景/);
  assert.equal(panel.match(/data-budget-background-stage=/g)?.length, 5);

  const stages = [
    'data-budget-background-stage="request"',
    'data-budget-background-stage="bureau_assessment"',
    'data-budget-background-stage="governor_assessment"',
    'data-budget-background-stage="proposal"',
    'data-budget-background-stage="enacted_budget"',
  ];
  for (let index = 1; index < stages.length; index += 1) {
    assert.ok(panel.indexOf(stages[index - 1]) < panel.indexOf(stages[index]));
  }

  assert.match(panel, /予算案.*?まだ成立予算ではありません/);
  assert.match(panel, /成立予算.*?18,730億円/);
  assert.match(panel, /本シミュレーターの初期値/);
});

test("links the selected category to its lead bureaus and participation routes", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `context-participation-${process.pid}-${Date.now()}`);
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
  const html = await response.text();
  const panel = html.match(
    /<aside class="contextPanel" id="category-context" aria-label="選択分野の変更の意味">.*?<\/aside>/,
  )?.[0];

  assert.ok(panel);
  assert.match(panel, /意見を伝える先/);
  assert.match(panel, /href="https:\/\/www\.fukushi\.metro\.tokyo\.lg\.jp\/"[^>]*>福祉局/);
  assert.match(panel, /href="https:\/\/www\.hokeniryo\.metro\.tokyo\.lg\.jp\/"[^>]*>保健医療局/);
  assert.match(panel, /主な所管.*?一対一対応ではありません/);
  assert.match(panel, />都民の声</);
  assert.match(panel, />請願</);
  assert.match(panel, />陳情</);
  assert.match(panel, /予算への反映は保証されません/);
});

test("carries the selected category and amount to its detail page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `context-detail-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const env = {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  };
  const executionContext = {
    waitUntil() {},
    passThroughOnException() {},
  };

  const homeResponse = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    env,
    executionContext,
  );
  const homeHtml = await homeResponse.text();
  const panel = homeHtml.match(
    /<aside class="contextPanel" id="category-context" aria-label="選択分野の変更の意味">.*?<\/aside>/,
  )?.[0];

  assert.ok(panel);
  assert.match(
    panel,
    /<a class="detailLink" href="\/budget\/welfare\?amount=18730">詳しく見る/,
  );

  const detailResponse = await worker.fetch(
    new Request("http://localhost/budget/welfare?amount=18730", {
      headers: { accept: "text/html" },
    }),
    env,
    executionContext,
  );
  const detailHtml = await detailResponse.text();

  assert.equal(detailResponse.status, 200);
  assert.match(detailHtml, /福祉と保健/);
  assert.match(detailHtml, /あなたの案.*?18,730億円/);
});

test("labels what public information cannot establish without guessing", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `context-unknown-${process.pid}-${Date.now()}`);
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
  const html = await response.text();
  const panel = html.match(
    /<aside class="contextPanel" id="category-context" aria-label="選択分野の変更の意味">.*?<\/aside>/,
  )?.[0];

  assert.ok(panel);
  assert.match(panel, /data-evidence-status="unknown"/);
  assert.match(panel, /公開情報だけでは判断できないこと/);
  assert.match(panel, /何人改善するか/);
  assert.match(panel, /何％向上するか/);
  assert.match(panel, /どの事業を変更すれば実行できるか/);
  assert.match(panel, /因果関係/);
  assert.match(panel, /推測値は表示しません/);
});

test("keeps total, difference, and remaining funds together", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `balance-${process.pid}-${Date.now()}`);
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
  const html = await response.text();
  const balance = html.match(
    /<div class="budgetBalance"[^>]*aria-live="polite"[^>]*>.*?<\/div><div class="simulatorWorkspace">/,
  )?.[0];

  assert.ok(balance);
  assert.match(balance, /あなたの予算総額/);
  assert.match(balance, /成立予算との差額/);
  assert.match(balance, /残額/);
});

test("clarifies that simulated allocations are not an executable official budget", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `simulation-notice-${process.pid}-${Date.now()}`);
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
  const html = await response.text();
  const simulator = html.match(
    /<section class="simulator" id="simulator">.*?<section class="process"/,
  )?.[0];

  assert.ok(simulator);
  assert.match(
    simulator,
    /<aside class="simulationNotice" role="note">.*?学習用の仮想配分.*?東京都の正式な予算案ではありません.*?実行可能性を保証するものではありません.*?<\/aside>/,
  );
});

test("introduces the budget process after the simulator", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `process-order-${process.pid}-${Date.now()}`);
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
  const html = await response.text();

  assert.ok(html.indexOf('id="simulator"') < html.indexOf('id="budget-process"'));
});

test("uses the blue card-based visual theme", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `theme-${process.pid}-${Date.now()}`);
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
  const html = await response.text();

  assert.match(html, /<main data-visual-theme="tokyo-blue">/);
});
