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
