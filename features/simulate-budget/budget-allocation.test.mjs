import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateBudgetAllocationSummary,
  calculateBudgetTotal,
  changeBudgetAllocation,
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

test("keeps a reduced allocation inside the fixed annual budget as available funds", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  allocations.debt -= 840;

  const summary = calculateBudgetAllocationSummary(allocations, 96_530);

  assert.deepEqual(summary, {
    annualBudgetAmount100mYen: 96_530,
    allocatedAmount100mYen: 95_690,
    availableAmount100mYen: 840,
    status: "available",
  });
  assert.equal(
    summary.allocatedAmount100mYen + summary.availableAmount100mYen,
    summary.annualBudgetAmount100mYen,
  );
});

test("adds a category reduction to the available funds", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);

  const changed = changeBudgetAllocation({
    allocations,
    categoryId: "debt",
    requestedAmount100mYen: allocations.debt - 840,
    range: getBudgetAllocationRange(allocations.debt),
    annualBudgetAmount100mYen: 96_530,
  });

  assert.equal(changed.debt, 1_959);
  assert.equal(
    calculateBudgetAllocationSummary(changed, 96_530).availableAmount100mYen,
    840,
  );
});

test("uses available funds to increase another category", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  const reduced = changeBudgetAllocation({
    allocations,
    categoryId: "debt",
    requestedAmount100mYen: 1_959,
    range: getBudgetAllocationRange(2_799),
    annualBudgetAmount100mYen: 96_530,
  });

  const redistributed = changeBudgetAllocation({
    allocations: reduced,
    categoryId: "welfare",
    requestedAmount100mYen: 19_030,
    range: getBudgetAllocationRange(18_730),
    annualBudgetAmount100mYen: 96_530,
  });

  assert.equal(redistributed.welfare, 19_030);
  assert.equal(
    calculateBudgetAllocationSummary(redistributed, 96_530)
      .availableAmount100mYen,
    540,
  );
});

test("redistributes the 30 percent debt reduction to education without changing the annual total", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  const reduced = changeBudgetAllocation({
    allocations,
    categoryId: "debt",
    requestedAmount100mYen: 1_959,
    range: getBudgetAllocationRange(2_799),
    annualBudgetAmount100mYen: 96_530,
  });
  const redistributed = changeBudgetAllocation({
    allocations: reduced,
    categoryId: "education",
    requestedAmount100mYen: 16_762,
    range: getBudgetAllocationRange(15_922),
    annualBudgetAmount100mYen: 96_530,
  });

  assert.equal(redistributed.debt, 1_959);
  assert.equal(redistributed.education, 16_762);
  assert.deepEqual(calculateBudgetAllocationSummary(redistributed, 96_530), {
    annualBudgetAmount100mYen: 96_530,
    allocatedAmount100mYen: 96_530,
    availableAmount100mYen: 0,
    status: "fully-allocated",
  });
});

test("does not increase a category beyond the available funds", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  const unchanged = changeBudgetAllocation({
    allocations,
    categoryId: "welfare",
    requestedAmount100mYen: 19_030,
    range: getBudgetAllocationRange(18_730),
    annualBudgetAmount100mYen: 96_530,
  });

  assert.equal(unchanged.welfare, 18_730);
  assert.equal(calculateBudgetTotal(unchanged), 96_530);
});

test("caps an increase at the amount available from another category", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  const reduced = changeBudgetAllocation({
    allocations,
    categoryId: "debt",
    requestedAmount100mYen: 1_959,
    range: getBudgetAllocationRange(2_799),
    annualBudgetAmount100mYen: 96_530,
  });

  const redistributed = changeBudgetAllocation({
    allocations: reduced,
    categoryId: "welfare",
    requestedAmount100mYen: 20_000,
    range: getBudgetAllocationRange(18_730),
    annualBudgetAmount100mYen: 96_530,
  });

  assert.equal(redistributed.welfare, 19_570);
  assert.equal(calculateBudgetTotal(redistributed), 96_530);
});

test("keeps each category inside 70 through 130 percent of its baseline", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  const belowMinimum = changeBudgetAllocation({
    allocations,
    categoryId: "debt",
    requestedAmount100mYen: 0,
    range: getBudgetAllocationRange(2_799),
    annualBudgetAmount100mYen: 96_530,
  });
  const fundsForIncrease = changeBudgetAllocation({
    allocations,
    categoryId: "welfare",
    requestedAmount100mYen: 17_050,
    range: getBudgetAllocationRange(18_730),
    annualBudgetAmount100mYen: 96_530,
  });
  const aboveMaximum = changeBudgetAllocation({
    allocations: fundsForIncrease,
    categoryId: "debt",
    requestedAmount100mYen: 10_000,
    range: getBudgetAllocationRange(2_799),
    annualBudgetAmount100mYen: 96_530,
  });

  assert.equal(belowMinimum.debt, 1_959);
  assert.equal(aboveMaximum.debt, 3_639);
  assert.equal(
    calculateBudgetAllocationSummary(aboveMaximum, 96_530)
      .availableAmount100mYen,
    840,
  );
});
