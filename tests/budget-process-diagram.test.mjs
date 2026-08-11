import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_PROCESS_SUMMARY_STEPS } from "../features/learn-budget-process/budget-process-steps.ts";

const fetchTopPageHtml = async label => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${label}-${process.pid}-${Date.now()}`);
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
  return response.text();
};

const processSection = html => html.match(/<section class="process"[^>]*>.*?<\/section>/)?.[0];

test("says each stage in plain words before the formal summary", async () => {
  const section = processSection(await fetchTopPageHtml("process-plain-words"));

  assert.ok(section, "予算成立過程のセクションが見つからない");

  for (const step of BUDGET_PROCESS_SUMMARY_STEPS) {
    assert.ok(step.plainMeaning.length > 0, `${step.label} の言い換えがない`);
    assert.ok(
      step.plainMeaning.length <= 30,
      `${step.label} の言い換えが${step.plainMeaning.length}字で長い`,
    );
    assert.ok(section.includes(step.plainMeaning), `${step.label} の言い換えが表示されていない`);
  }
});

test("shows every budget process stage without waiting for a click", async () => {
  const section = processSection(await fetchTopPageHtml("process-diagram"));

  assert.ok(section, "予算成立過程のセクションが見つからない");

  BUDGET_PROCESS_SUMMARY_STEPS.forEach((step, index) => {
    assert.match(section, new RegExp(`>${index + 1}<`), `${step.label} の段階番号がない`);
    assert.ok(section.includes(step.label), `${step.label} の名称が表示されていない`);
    assert.ok(section.includes(step.summary), `${step.label} の要約が表示されていない`);
  });
});

test("keeps the budget process stages out of interactive controls", async () => {
  const section = processSection(await fetchTopPageHtml("process-static"));

  assert.ok(section);
  assert.doesNotMatch(section, /<button/, "段階を押さないと読めない作りになっている");
});

test("still offers the complete budget process on its own page", async () => {
  const section = processSection(await fetchTopPageHtml("process-detail-route"));

  assert.ok(section);
  assert.match(
    section,
    /<a(?=[^>]*href=["']\/budget-process\?[^"']*category=welfare["'])[^>]*>全過程と令和8年度の公式資料を見る/,
  );
});
