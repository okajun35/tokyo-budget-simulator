import assert from "node:assert/strict";
import test from "node:test";

import {
  createInitialBudgetAllocations,
} from "../features/simulate-budget/budget-allocation.ts";
import {
  BUDGET_CATEGORIES,
} from "../features/simulate-budget/budget-categories.ts";
import {
  createBudgetDetailHref,
  createBudgetResultHref,
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

const fullyRedistributedPlan = () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  allocations.debt -= 840;
  allocations.education += 840;
  return allocations;
};

test("shows only increased and decreased fields in the allocation result", async () => {
  const allocations = fullyRedistributedPlan();
  const html = await fetchHtml(
    createBudgetResultHref(allocations, "education"),
    "fully-redistributed-result",
  );

  assert.match(html, /<main class="budgetResultPage" data-budget-result-state="changed"/);
  assert.match(html, /840億円<\/strong>を分野間で配分し直しました/);
  assert.equal(html.match(/data-budget-result-change=/g)?.length, 2);
  assert.match(html, /data-budget-result-change="education"[^>]*data-change-direction="increase"/);
  assert.match(html, /data-budget-result-change="debt"[^>]*data-change-direction="decrease"/);
  assert.match(
    html,
    /id="budget-result-change-education"[^>]*tabindex="-1"[^>]*data-budget-result-change="education"/,
  );
  assert.doesNotMatch(html, /data-budget-result-change="welfare"/);
  assert.equal(html.match(/data-budget-result-meaning=/g)?.length, 2);
  assert.match(
    html,
    /data-budget-result-meaning="education"[^>]*>学校運営、教職員、学校施設、図書館、文化・スポーツ、生涯学習などを支える経費です。/,
  );
  assert.equal(html.match(/<summary>この分野には何が含まれる？<\/summary>/g)?.length, 2);
  assert.match(html, /学校運営と教職員/);
  assert.match(html, /都債の元金償還/);
  assert.equal(html.match(/data-budget-result-scope-note=/g)?.length, 2);
  assert.match(html, /増減分の具体的な使い道は、この操作だけでは決まりません。/);
  assert.match(html, /東京都の正式な予算案ではありません/);
  assert.ok(html.includes(createBudgetDetailHref("education", allocations, "budget-result")));
  assert.ok(html.includes(createBudgetDetailHref("debt", allocations, "budget-result")));
});

test("distinguishes redistributed money from money that remains available", async () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  allocations.debt -= 840;
  allocations.education += 400;
  const html = await fetchHtml(
    createBudgetResultHref(allocations, "education"),
    "partly-redistributed-result",
  );

  assert.match(html, /400億円<\/strong>を分野間で配分し直しました/);
  assert.match(html, /440億円<\/strong>はまだ配分していません/);
  assert.match(html, /data-result-allocation-status="available"/);
});

test("does not call a reduction-only plan a redistribution", async () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  allocations.debt -= 840;
  const html = await fetchHtml(
    createBudgetResultHref(allocations, "debt"),
    "reduction-only-result",
  );

  assert.match(html, /840億円<\/strong>を分野から減らしました/);
  assert.match(html, /840億円<\/strong>はまだ配分していません/);
  assert.equal(html.match(/data-budget-result-change=/g)?.length, 1);
  assert.doesNotMatch(html, /<h2>増やした分野<\/h2>/);
});

test("handles an unchanged or invalid plan without inventing a result", async () => {
  const unchangedHtml = await fetchHtml("/budget-result", "unchanged-result");
  const invalidHtml = await fetchHtml(
    "/budget-result?plan=invalid&category=education",
    "invalid-result",
  );

  for (const html of [unchangedHtml, invalidHtml]) {
    assert.match(html, /data-budget-result-state="unchanged"/);
    assert.match(html, /まだ予算配分を変更していません/);
    assert.doesNotMatch(html, /data-budget-result-change=/);
  }
  assert.match(invalidHtml, /data-budget-result-query="fallback"/);
  assert.match(invalidHtml, /URLの予算配分を復元できなかったため/);
});

test("enables the top result route only after an allocation changes", async () => {
  const allocations = fullyRedistributedPlan();
  const changedPath = createBudgetSimulatorHref(allocations, "education")
    .replace("#simulator", "");
  const changedHtml = await fetchHtml(changedPath, "changed-top-result-cta");
  const unchangedHtml = await fetchHtml("/", "unchanged-top-result-cta");

  assert.match(changedHtml, /data-budget-result-cta="enabled"/);
  assert.ok(changedHtml.includes(createBudgetResultHref(allocations, "education")));
  assert.match(
    changedHtml,
    /data-budget-result-cta-location="budget-balance"[^>]*>2分野の配分結果を見る<\/a>/,
  );
  assert.match(
    changedHtml,
    /class="fixedTotalReason"[^>]*>なぜ増やせない？<\/a>/,
  );
  assert.match(unchangedHtml, /data-budget-result-cta="disabled"/);
  assert.doesNotMatch(unchangedHtml, /data-budget-result-cta-location="budget-balance"/);
  assert.match(unchangedHtml, /まだ予算配分を変更していません/);
});
