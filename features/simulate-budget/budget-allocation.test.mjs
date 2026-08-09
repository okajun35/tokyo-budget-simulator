import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateBudgetBalance,
  calculateBudgetTotal,
  createInitialBudgetAllocations,
  getBudgetAllocationRange,
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

test("limits allocation controls to 70 through 130 percent of the baseline", () => {
  assert.deepEqual(getBudgetAllocationRange(2_799), {
    minimumAmount100mYen: 1_959,
    maximumAmount100mYen: 3_639,
  });
});

test("reports surplus when the user's total is below the enacted budget", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  allocations.debt -= 840;

  assert.deepEqual(calculateBudgetBalance(allocations, 96_530), {
    totalAmount100mYen: 95_690,
    differenceAmount100mYen: -840,
    remainingAmount100mYen: 840,
    status: "surplus",
  });
});

test("reports shortage when the user's total exceeds the enacted budget", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  allocations.welfare += 300;

  assert.deepEqual(calculateBudgetBalance(allocations, 96_530), {
    totalAmount100mYen: 96_830,
    differenceAmount100mYen: 300,
    remainingAmount100mYen: -300,
    status: "shortage",
  });
});
