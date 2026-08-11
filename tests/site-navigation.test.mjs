import assert from "node:assert/strict";
import test from "node:test";

const sitePaths = [
  "/",
  "/budget/debt?amount=1959",
  "/budget/debt/cases?amount=1959",
  "/budget/debt/materials?amount=1959",
  "/budget-process",
  "/participation",
  "/participation/prepare?category=education&topic=culture",
  "/sources",
  "/about",
  "/fiscal-context",
];

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
  return response.text();
};

test("offers the same primary menu on every page", async () => {
  for (const path of sitePaths) {
    const html = await fetchHtml(path, "shared-menu");
    const navigation = html.match(/<nav aria-label="主要メニュー">.*?<\/nav>/)?.[0];

    assert.ok(navigation, `${path} は主要メニューを表示していない`);
    assert.match(
      navigation,
      /<a(?=[^>]*href=["']\/#simulator["'])[^>]*>予算シミュレーター/,
      path,
    );
    assert.match(
      navigation,
      /<a(?=[^>]*href=["']\/budget-process["'])[^>]*>予算が決まるまで/,
      path,
    );
    assert.match(
      navigation,
      /<a(?=[^>]*href=["']\/participation["'])[^>]*>声を届ける/,
      path,
    );
    assert.match(
      navigation,
      /<a(?=[^>]*href=["']\/sources["'])[^>]*>出典・データ/,
      path,
    );
  }
});

test("returns to the top page from the brand on every page", async () => {
  for (const path of sitePaths) {
    const html = await fetchHtml(path, "shared-brand");

    assert.match(
      html,
      /<a(?=[^>]*class="brand")(?=[^>]*href="\/")[^>]*>/,
      `${path} はブランドからトップへ戻れない`,
    );
  }
});

test("states the unofficial prototype notice in the footer of every page", async () => {
  for (const path of sitePaths) {
    const html = await fetchHtml(path, "shared-footer");
    const footer = html.match(/<footer.*?<\/footer>/)?.[0];

    assert.ok(footer, `${path} はフッターを表示していない`);
    assert.match(footer, /東京都の公式サービスではありません/, path);
    assert.match(
      footer,
      /<a(?=[^>]*href=["']\/about["'])[^>]*>このサイトについて/,
      path,
    );
  }
});
