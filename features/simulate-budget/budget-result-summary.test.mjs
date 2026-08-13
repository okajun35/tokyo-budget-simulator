import assert from "node:assert/strict";
import test from "node:test";

import {
  createInitialBudgetAllocations,
} from "./budget-allocation.ts";
import {
  BUDGET_CATEGORIES,
  GENERAL_ACCOUNT_BASELINE_100M_YEN,
} from "./budget-categories.ts";
import { summarizeBudgetResult } from "./budget-result-summary.ts";

const summarize = allocations => summarizeBudgetResult(
  BUDGET_CATEGORIES,
  allocations,
  GENERAL_ACCOUNT_BASELINE_100M_YEN,
);

test("summarizes only the fields changed in a fully redistributed plan", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  allocations.debt -= 840;
  allocations.education += 840;

  const result = summarize(allocations);

  assert.equal(result.hasChanges, true);
  assert.equal(result.reallocatedAmount100mYen, 840);
  assert.equal(result.decreasedAmount100mYen, 840);
  assert.equal(result.availableAmount100mYen, 0);
  assert.deepEqual(result.increases.map(entry => entry.category.id), ["education"]);
  assert.deepEqual(result.decreases.map(entry => entry.category.id), ["debt"]);
  assert.equal(result.increases[0].change.amountLabel, "+840億円");
  assert.equal(result.decreases[0].change.rateLabel, "-30.0%");
  assert.equal(result.unchangedCount, 7);
});

test("keeps redistributed and still-available amounts distinct", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  allocations.debt -= 840;
  allocations.education += 400;

  const result = summarize(allocations);

  assert.equal(result.reallocatedAmount100mYen, 400);
  assert.equal(result.decreasedAmount100mYen, 840);
  assert.equal(result.availableAmount100mYen, 440);
  assert.equal(result.increaseCount, 1);
  assert.equal(result.decreaseCount, 1);
});

test("treats a reduction with no increase as entirely unallocated", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  allocations.debt -= 840;

  const result = summarize(allocations);

  assert.equal(result.reallocatedAmount100mYen, 0);
  assert.equal(result.decreasedAmount100mYen, 840);
  assert.equal(result.availableAmount100mYen, 840);
  assert.equal(result.increaseCount, 0);
  assert.equal(result.decreaseCount, 1);
});

test("describes the enacted allocation as unchanged", () => {
  const allocations = createInitialBudgetAllocations(BUDGET_CATEGORIES);

  const result = summarize(allocations);

  assert.equal(result.hasChanges, false);
  assert.equal(result.reallocatedAmount100mYen, 0);
  assert.equal(result.decreasedAmount100mYen, 0);
  assert.equal(result.availableAmount100mYen, 0);
  assert.deepEqual(result.increases, []);
  assert.deepEqual(result.decreases, []);
  assert.equal(result.unchangedCount, 9);
});
