import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_CATEGORIES } from "../features/simulate-budget/budget-categories.ts";
import { CASE_INTERPRETATIONS } from "../features/learn-from-budget-cases/case-interpretations.ts";

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
 * 事例の節が「予測ではありません」だけを述べていると、
 * 何のために事例を並べているのかが読み取れない。
 * 分野ごとに、金額の増減が現実にどんな変更として現れたのかを述べる。
 */
test("explains what the cases show for the field before the caution", async () => {
  for (const categoryId of Object.keys(CASE_INTERPRETATIONS)) {
    const html = await fetchHtml(`/budget/${categoryId}`, `case-lead-${categoryId}`);
    const interpretation = CASE_INTERPRETATIONS[categoryId];

    assert.ok(html.includes(interpretation), `${categoryId} の分野別の説明がない`);
    assert.ok(
      html.indexOf(interpretation) < html.indexOf("同じ結果になるとは限りません"),
      `${categoryId} は説明より先に注意書きが来ている`,
    );
  }
});

test("carries an interpretation exactly for the fields whose cases are collected", () => {
  const withCases = BUDGET_CATEGORIES.filter(category => category.caseIds.length > 0).map(c => c.id);
  const withInterpretation = Object.keys(CASE_INTERPRETATIONS);

  assert.deepEqual([...withInterpretation].sort(), [...withCases].sort());
});

test("states each interpretation as a possibility rather than a certainty", () => {
  for (const [categoryId, interpretation] of Object.entries(CASE_INTERPRETATIONS)) {
    assert.match(
      interpretation,
      /ことがあ|場合があ|とは限|方法があ|方法もあ|選択肢もあ|制約し|異なりま|ではありません/,
      categoryId,
    );
    assert.doesNotMatch(interpretation, /必ず|確実に|東京都では/, categoryId);
  }
});
