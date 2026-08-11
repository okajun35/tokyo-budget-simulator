import assert from "node:assert/strict";
import test from "node:test";

import { createInitialBudgetAllocations } from "../simulate-budget/budget-allocation.ts";
import { BUDGET_CATEGORIES } from "../simulate-budget/budget-categories.ts";
import { serializeBudgetPlan } from "../simulate-budget/budget-plan-query.ts";
import { resolveParticipationBudgetContext } from "./participation-budget-context.ts";

test("distinguishes an increased, unchanged, and unknown simulation amount", () => {
  const baseline = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  const increased = { ...baseline, welfare: baseline.welfare - 840, education: baseline.education + 840 };

  assert.deepEqual(resolveParticipationBudgetContext("education", serializeBudgetPlan(increased)), {
    status: "known",
    baselineAmount100mYen: 15_922,
    userAmount100mYen: 16_762,
    deltaAmount100mYen: 840,
    direction: "increase",
  });
  assert.equal(
    resolveParticipationBudgetContext("education", serializeBudgetPlan(baseline)).direction,
    "unchanged",
  );
  assert.deepEqual(resolveParticipationBudgetContext("education", undefined), { status: "unknown" });
  assert.deepEqual(resolveParticipationBudgetContext("education", "broken"), { status: "unknown" });
});
