import assert from "node:assert/strict";
import test from "node:test";

import {
  createBudgetDetailComparison,
  resolveBudgetDetailAmount,
} from "./budget-detail.ts";

test("uses an inherited simulator amount inside the category range", () => {
  assert.deepEqual(resolveBudgetDetailAmount("1959", 2_799), {
    amount100mYen: 1_959,
    usedFallback: false,
  });
});

test("falls back to the enacted amount for missing, malformed, or repeated values", () => {
  for (const value of [undefined, "not-a-number", "1959.5", ["1959", "2000"]]) {
    assert.deepEqual(resolveBudgetDetailAmount(value, 2_799), {
      amount100mYen: 2_799,
      usedFallback: true,
    });
  }
});

test("falls back to the enacted amount outside the category range", () => {
  for (const value of ["1958", "3640"]) {
    assert.deepEqual(resolveBudgetDetailAmount(value, 2_799), {
      amount100mYen: 2_799,
      usedFallback: true,
    });
  }
});

test("compares the inherited amount with the enacted amount and annual budget", () => {
  assert.deepEqual(createBudgetDetailComparison(2_799, 1_959, 96_530), {
    baselineAmount100mYen: 2_799,
    proposedAmount100mYen: 1_959,
    changeAmount100mYen: -840,
    changeRatePercent: -30,
    baselineSharePercent: 2.9,
    proposedSharePercent: 2,
  });
});
