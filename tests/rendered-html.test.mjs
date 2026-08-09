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
