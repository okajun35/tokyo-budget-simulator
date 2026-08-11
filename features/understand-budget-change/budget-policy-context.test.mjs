import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_CATEGORIES } from "../simulate-budget/budget-categories.ts";
import {
  BUDGET_POLICY_CONTEXTS,
  findBudgetPolicyContext,
} from "./budget-policy-context.ts";

test("keeps FY2026 context and published FY2027 direction separate for all nine categories", () => {
  assert.deepEqual(
    BUDGET_POLICY_CONTEXTS.map(context => context.categoryId),
    BUDGET_CATEGORIES.map(category => category.id),
  );

  for (const category of BUDGET_CATEGORIES) {
    const context = findBudgetPolicyContext(category.id);

    assert.ok(context, category.id);
    assert.equal(context.fy2026.fiscalYear, 2026);
    assert.equal(context.fy2027.planYear, 2027);
    assert.ok(context.fy2026.summary.length > 0);
    assert.ok(context.fy2027.summary.length > 0);
    assert.ok(context.fy2027.sources.length > 0);
    assert.equal("userDecision" in context, false);

    for (const source of [
      ...context.fy2026.sources,
      ...context.fy2027.sources,
    ]) {
      assert.match(source.url, /^https:\/\//);
      assert.match(source.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(source.title.length > 0);
    }
  }
});

test("labels policy plans independently from a user's increase, decrease, or unchanged choice", () => {
  for (const context of BUDGET_POLICY_CONTEXTS) {
    assert.match(
      context.fy2027.disclaimer,
      /ユーザーの選択に対する評価ではありません/,
    );
    assert.match(context.fy2027.disclaimer, /目的別予算の増減/);
    assert.match(context.fy2027.disclaimer, /予算額の確定/);
    assert.doesNotMatch(context.fy2027.summary, /あなたの|増額を選|減額を選|据え置きを選/);
  }
});

test("does not present cross-government or public-enterprise initiatives as a category budget breakdown", () => {
  const admin = findBudgetPolicyContext("admin");
  const city = findBudgetPolicyContext("city");

  assert.ok(admin);
  assert.ok(city);
  assert.doesNotMatch(admin.fy2026.summary, /242件|389億円/);
  assert.equal(
    city.fy2026.initiatives.some(initiative => /下水道/.test(initiative.title)),
    false,
  );

  for (const context of BUDGET_POLICY_CONTEXTS) {
    assert.match(context.fy2026.disclaimer, /予算全体の内訳を示すものではありません/);
    for (const initiative of context.fy2026.initiatives) {
      assert.ok(["direct", "related_policy", "cross_government"].includes(initiative.relationship));
      assert.ok(["general_account", "mixed", "unknown"].includes(initiative.accountingScope));
      assert.match(initiative.sourceUrl, /^https:\/\//);
      assert.ok(initiative.sourceTitle.length > 0);
      assert.match(initiative.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    }
  }
});

test("uses fiscal characteristics instead of ordinary service examples for debt and tax-linked costs", () => {
  assert.equal(findBudgetPolicyContext("debt")?.fy2026.kind, "fiscal_characteristic");
  assert.equal(findBudgetPolicyContext("linked")?.fy2026.kind, "fiscal_characteristic");
  assert.equal(findBudgetPolicyContext("debt")?.fy2026.initiatives.length, 0);
  assert.equal(findBudgetPolicyContext("linked")?.fy2026.initiatives.length, 0);
});
