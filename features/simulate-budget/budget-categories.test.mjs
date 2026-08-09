import assert from "node:assert/strict";
import test from "node:test";

import {
  BUDGET_CATEGORIES,
  GENERAL_ACCOUNT_BASELINE_100M_YEN,
} from "./budget-categories.ts";

const expectedCategoryIds = [
  "welfare",
  "education",
  "industry",
  "environment",
  "city",
  "safety",
  "admin",
  "debt",
  "linked",
];

test("uses the nine official budget categories in display order", () => {
  assert.deepEqual(
    BUDGET_CATEGORIES.map((category) => category.id),
    expectedCategoryIds,
  );
  assert.equal(new Set(expectedCategoryIds).size, BUDGET_CATEGORIES.length);
});

test("category baselines add up to the FY2026 general account total", () => {
  const total = BUDGET_CATEGORIES.reduce(
    (sum, category) => sum + category.baselineAmount100mYen,
    0,
  );

  assert.equal(GENERAL_ACCOUNT_BASELINE_100M_YEN, 96_530);
  assert.equal(total, GENERAL_ACCOUNT_BASELINE_100M_YEN);
});

test("provides the shared detail references required by every category", () => {
  for (const category of BUDGET_CATEGORIES) {
    assert.ok(category.definition.length > 0);
    assert.ok(category.mainUses.length > 0);
    assert.ok(category.changeOptions.length > 0);
    assert.ok(
      category.changeOptions.every(
        (option) =>
          option.id.length > 0 &&
          option.title.length > 0 &&
          option.description.length > 0,
      ),
    );
    assert.ok(category.sourceIds.length > 0);
    assert.ok(Array.isArray(category.caseIds));
    assert.ok(category.participationRouteIds.length > 0);
  }
});
