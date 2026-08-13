import assert from "node:assert/strict";
import test from "node:test";

import {
  createBudgetDetailHref,
  createBudgetProcessHref,
  createBudgetResultHref,
  createBudgetSimulatorHref,
  parseBudgetPlan,
  resolveBudgetPlanState,
  serializeBudgetPlan,
} from "./budget-plan-query.ts";
import { BUDGET_CATEGORIES } from "./budget-categories.ts";
import { createInitialBudgetAllocations } from "./budget-allocation.ts";

const redistributedPlan = () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  allocations.debt = 1_959;
  allocations.education = 16_762;
  return allocations;
};

test("serializes and restores all nine allocations in display order", () => {
  const allocations = redistributedPlan();
  const encoded = serializeBudgetPlan(allocations);

  assert.equal(encoded.split(",").length, 9);
  assert.deepEqual(parseBudgetPlan(encoded), allocations);
});

test("rejects incomplete, malformed, out-of-range, and over-budget plans", () => {
  const valid = serializeBudgetPlan(redistributedPlan()).split(",");

  assert.equal(parseBudgetPlan(valid.slice(0, 8).join(",")), undefined);
  assert.equal(parseBudgetPlan(valid.with(2, "abc").join(",")), undefined);
  assert.equal(parseBudgetPlan(valid.with(0, "1").join(",")), undefined);
  assert.equal(parseBudgetPlan(valid.with(0, "24349").join(",")), undefined);
});

test("restores the selected category and safely falls back to the enacted plan", () => {
  const allocations = redistributedPlan();
  const restored = resolveBudgetPlanState(
    serializeBudgetPlan(allocations),
    "education",
  );
  const fallback = resolveBudgetPlanState("invalid", "unknown");

  assert.deepEqual(restored.allocations, allocations);
  assert.equal(restored.selectedCategoryId, "education");
  assert.equal(restored.restoredFromQuery, true);
  assert.equal(fallback.allocations.education, 15_922);
  assert.equal(fallback.selectedCategoryId, "welfare");
  assert.equal(fallback.restoredFromQuery, false);
});

test("builds state-preserving simulator, result, detail, and process routes", () => {
  const allocations = redistributedPlan();
  const encoded = encodeURIComponent(serializeBudgetPlan(allocations));

  assert.equal(
    createBudgetSimulatorHref(allocations, "education"),
    `/?plan=${encoded}&category=education#simulator`,
  );
  assert.equal(
    createBudgetDetailHref("education", allocations),
    `/budget/education?plan=${encoded}&category=education&amount=16762`,
  );
  assert.equal(
    createBudgetProcessHref(allocations, "education"),
    `/budget-process?plan=${encoded}&category=education`,
  );
  assert.equal(
    createBudgetResultHref(allocations, "education"),
    `/budget-result?plan=${encoded}&category=education`,
  );
});
