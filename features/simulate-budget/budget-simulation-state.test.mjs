import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_CATEGORIES } from "./budget-categories.ts";
import {
  calculateBudgetAllocationSummary,
  calculateBudgetTotal,
} from "./budget-allocation.ts";
import { createInitialBudgetSimulationState } from "./budget-simulation-state.ts";

test("resets allocations, total, and selection to the intended initial state", () => {
  const state = createInitialBudgetSimulationState(BUDGET_CATEGORIES);

  assert.equal(state.selectedCategoryId, "welfare");
  assert.equal(state.allocations.welfare, 18_730);
  assert.equal(state.allocations.debt, 2_799);
  assert.equal(calculateBudgetTotal(state.allocations), 96_530);
  assert.equal(
    calculateBudgetAllocationSummary(state.allocations, 96_530)
      .availableAmount100mYen,
    0,
  );
});

test("creates a fresh allocation object for every reset", () => {
  const first = createInitialBudgetSimulationState(BUDGET_CATEGORIES);
  const second = createInitialBudgetSimulationState(BUDGET_CATEGORIES);

  first.allocations.debt = 1_959;

  assert.equal(second.allocations.debt, 2_799);
});
