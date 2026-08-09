import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_CASES } from "./budget-cases.ts";

const detailedCategoryIds = ["debt", "welfare", "education"];
const causalStrengths = new Set([
  "direct_operational_change",
  "audited_impact",
  "associated_change",
  "projected_risk",
]);

test("provides one domestic and one international case for each detailed category", () => {
  for (const categoryId of detailedCategoryIds) {
    const relatedCases = BUDGET_CASES.filter((budgetCase) =>
      budgetCase.categoryIds.includes(categoryId),
    );

    assert.equal(relatedCases.length, 2);
    assert.ok(relatedCases.some((budgetCase) => budgetCase.country === "日本"));
    assert.ok(relatedCases.some((budgetCase) => budgetCase.country !== "日本"));
  }
});

test("keeps every case traceable and explicit about evidential limits", () => {
  const ids = BUDGET_CASES.map((budgetCase) => budgetCase.id);

  assert.equal(BUDGET_CASES.length, 6);
  assert.equal(new Set(ids).size, ids.length);

  for (const budgetCase of BUDGET_CASES) {
    assert.ok(budgetCase.confirmedChanges.length > 0);
    assert.ok(causalStrengths.has(budgetCase.causalStrength));
    assert.match(budgetCase.sourceUrl, /^https:\/\//);
    assert.ok(budgetCase.sourceTitle.length > 0);
    assert.ok(budgetCase.caution.length > 0);
  }
});
