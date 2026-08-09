import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateBudgetTotal,
  createInitialBudgetAllocations,
} from "./budget-allocation.ts";
import { BUDGET_CATEGORIES } from "./budget-categories.ts";

test("creates initial allocations from each category baseline", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);

  assert.equal(allocations.welfare, 18_730);
  assert.equal(allocations.debt, 2_799);
  assert.equal(Object.keys(allocations).length, 9);
});

test("creates a fresh allocation object for each simulation", () => {
  const first = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  const second = createInitialBudgetAllocations(BUDGET_CATEGORIES);

  first.debt = 1_959;

  assert.equal(second.debt, 2_799);
});

test("calculates the total of the user's allocations", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);

  assert.equal(calculateBudgetTotal(allocations), 96_530);
});
