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
