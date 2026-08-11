import assert from "node:assert/strict";
import test from "node:test";

import {
  createParticipationPrepareHref,
  createParticipationSelectionHref,
} from "../features/find-participation-route/participation-navigation.ts";
import { createInitialBudgetAllocations } from "../features/simulate-budget/budget-allocation.ts";
import { BUDGET_CATEGORIES } from "../features/simulate-budget/budget-categories.ts";
import {
  createBudgetDetailHref,
  createBudgetParticipationHref,
  createBudgetProcessHref,
  createBudgetSimulatorHref,
} from "../features/simulate-budget/budget-plan-query.ts";

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
  return (await response.text()).replaceAll("<!-- -->", "").replaceAll("&amp;", "&");
};

const plan = createInitialBudgetAllocations(BUDGET_CATEGORIES);
plan.debt = 1_959;
plan.education = 16_762;

test("restores all nine allocations and the selected category on the simulator", async () => {
  const path = createBudgetSimulatorHref(plan, "education").replace("#simulator", "");
  const html = await fetchHtml(path, "restored-simulator-plan");

  assert.match(html, /data-budget-category="debt"[\s\S]*?あなたの案[\s\S]*?1,959億円/);
  assert.match(html, /data-budget-category="education"[\s\S]*?aria-current="true"[\s\S]*?あなたの案[\s\S]*?16,762億円/);
  assert.ok(html.includes(createBudgetDetailHref("education", plan)));
  assert.ok(html.includes(createBudgetProcessHref(plan, "education")));
});

test("returns from a detail page with the complete plan", async () => {
  const html = await fetchHtml(
    createBudgetDetailHref("education", plan),
    "detail-complete-plan-return",
  );

  assert.ok(html.includes(createBudgetSimulatorHref(plan, "education")));
  assert.ok(html.includes(createBudgetProcessHref(plan, "education")));
  assert.ok(html.includes(createBudgetParticipationHref(plan, "education")));
});

test("shows the inherited category on the budget process and preserves it onward", async () => {
  const html = await fetchHtml(
    createBudgetProcessHref(plan, "education"),
    "process-selected-category",
  );

  assert.match(html, /data-budget-process-category="education"/);
  assert.match(html, /選択中の分野[\s\S]*?教育と文化/);
  assert.match(html, /あなたの案[\s\S]*?16,762億円/);
  assert.ok(html.includes(createBudgetSimulatorHref(plan, "education")));
  assert.ok(html.includes(createBudgetParticipationHref(plan, "education")));
});

test("keeps the plan when moving from participation back to the process or simulator", async () => {
  const html = await fetchHtml(
    createBudgetParticipationHref(plan, "education"),
    "participation-complete-plan",
  );

  assert.match(html, /あなたの変更[\s\S]*?教育と文化[\s\S]*?\+840億円/);
  assert.match(html, /成立予算[\s\S]*?15,922億円/);
  assert.match(html, /あなたの案[\s\S]*?16,762億円/);
  assert.match(html, /行政へ要求する意思表示ではありません/);
  assert.ok(html.includes(createBudgetSimulatorHref(plan, "education")));
  assert.ok(html.includes(createBudgetProcessHref(plan, "education")));
});

test("keeps plan, category, and topic when opening and leaving the drafting page", async () => {
  const selectionHref = createParticipationSelectionHref(
    "education",
    "school-meals-curriculum-ict",
    plan,
  );
  const prepareHref = createParticipationPrepareHref(
    "education",
    "school-meals-curriculum-ict",
    plan,
  );
  const selectionHtml = await fetchHtml(selectionHref, "participation-selected-topic");
  const prepareHtml = await fetchHtml(prepareHref, "participation-prepare-complete-plan");

  assert.match(selectionHtml, /給食・教育内容・ICT[\s\S]*?このテーマについて考えを整理する/);
  assert.ok(selectionHtml.includes(prepareHref));
  assert.match(prepareHtml, /選んだ内容[\s\S]*?教育と文化[\s\S]*?\+840億円/);
  assert.ok(prepareHtml.includes(selectionHref));
  assert.ok(prepareHtml.includes(createBudgetSimulatorHref(plan, "education")));
  assert.ok(prepareHtml.includes(createBudgetProcessHref(plan, "education")));
});

test("does not invent a plan for legacy detail links", async () => {
  const html = await fetchHtml(
    "/budget/education?amount=16762",
    "legacy-detail-without-plan",
  );

  assert.match(html, /href="\/#simulator"[^>]*>← 予算に戻る/);
  assert.match(html, /href="\/budget-process"[^>]*>予算の決まり方を確認する/);
});
