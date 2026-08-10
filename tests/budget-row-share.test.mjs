import assert from "node:assert/strict";
import test from "node:test";

import {
  BUDGET_CATEGORIES,
  GENERAL_ACCOUNT_BASELINE_100M_YEN,
} from "../features/simulate-budget/budget-categories.ts";

const fetchTopPageHtml = async label => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${label}-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  return (await response.text()).replaceAll("<!-- -->", "");
};

/**
 * 一覧は分野名と金額しか示しておらず、最大の21.8%と最小の2.9%が同じ見た目だった。
 * どれだけの割合を占めるのかは「見る」段階の中身なので、数字と幅の両方で示す。
 */
test("shows how much of the total each field takes", async () => {
  const html = await fetchTopPageHtml("row-share");

  for (const category of BUDGET_CATEGORIES) {
    const share = (category.baselineAmount100mYen / GENERAL_ACCOUNT_BASELINE_100M_YEN) * 100;
    const label = `全体の${share.toFixed(1)}%`;
    const row = html.match(
      new RegExp(`<article data-budget-category="${category.id}"[\\s\\S]*?</article>`),
    )?.[0];

    assert.ok(row, `${category.name} の行が見つからない`);
    assert.ok(row.includes(label), `${category.name} に${label}がない`);
    assert.match(
      row,
      new RegExp(`data-budget-share="${category.id}"[^>]*width:${share.toFixed(1)}%`),
      `${category.name} の割合が幅で表されていない`,
    );
  }
});

test("says which fields a policy choice alone cannot move", async () => {
  const html = await fetchTopPageHtml("adjustment-note");
  const noted = BUDGET_CATEGORIES.filter(category => category.adjustmentNote);

  assert.deepEqual(noted.map(category => category.id), ["debt", "linked"]);

  const panel = html.match(/<aside class="contextPanel"[^>]*>[\s\S]*?<\/aside>/)?.[0];

  assert.ok(panel);
  assert.doesNotMatch(panel, /政策判断だけで自由に増減できる性質ではありません/);

  for (const category of noted) {
    const detail = html.match(
      new RegExp(`<article data-budget-category="${category.id}"[\\s\\S]*?</article>`),
    )?.[0];

    assert.ok(detail, category.name);
    assert.match(detail, /data-adjustment-note/, `${category.name} に注記の目印がない`);
  }
});
