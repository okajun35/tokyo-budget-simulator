import assert from "node:assert/strict";
import test from "node:test";

const fetchHtml = async (path, label) => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${label}-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  return (await response.text()).replaceAll("<!-- -->", "");
};

/**
 * 「何のサイトなのか」は最初に生まれる疑問なので、
 * 最後までスクロールしてフッターへ届く前に答えられる位置に置く。
 */
test("reaches the prototype description from the top of the first screen", async () => {
  const hero = (await fetchHtml("/", "hero-about-route")).match(/<section class="hero"[^>]*>[\s\S]*?<\/section>/)?.[0];

  assert.ok(hero, "冒頭のセクションが見つからない");
  assert.match(
    hero,
    /東京都の公式サービスではありません.*公開資料をもとにした非公式プロトタイプです/s,
  );
  assert.match(
    hero,
    /<a(?=[^>]*href="\/about")[^>]*>このサイトについて/,
  );
});

test("keeps the first screen down to one primary action and one secondary route", async () => {
  const hero = (await fetchHtml("/", "hero-route-count")).match(/<section class="hero"[^>]*>[\s\S]*?<\/section>/)?.[0];
  const actions = hero.match(/<div class="heroActions">.*?<\/div>/)?.[0];

  assert.ok(actions, "冒頭の導線が見つからない");
  assert.equal([...actions.matchAll(/<a\b/g)].length, 2);
  assert.match(actions, /class="primary"[^>]*>予算を動かしてみる|>予算を動かしてみる/);
});

test("still reaches the sources page from the shared menu", async () => {
  const navigation = (await fetchHtml("/", "sources-in-menu")).match(/<nav(?=[^>]*aria-label="主要メニュー")[^>]*>.*?<\/nav>/)?.[0];

  assert.ok(navigation);
  assert.match(navigation, /<a(?=[^>]*href="\/sources")[^>]*>出典・データ/);
});

test("offers the prototype description from the shared menu on every page", async () => {
  for (const path of ["/", "/budget/debt?amount=1959", "/budget/debt/cases?amount=1959", "/budget/debt/materials?amount=1959", "/budget-process", "/participation", "/participation/prepare?category=education&topic=culture", "/sources", "/about", "/fiscal-context"]) {
    const navigation = (await fetchHtml(path, "about-in-menu")).match(/<nav(?=[^>]*aria-label="主要メニュー")[^>]*>.*?<\/nav>/)?.[0];

    assert.ok(navigation, `${path} は主要メニューを表示していない`);
    assert.match(navigation, /<a(?=[^>]*href="\/about")[^>]*>このサイトについて/, path);
  }
});
