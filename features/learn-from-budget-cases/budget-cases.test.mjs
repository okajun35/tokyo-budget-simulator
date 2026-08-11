import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_CASES } from "./budget-cases.ts";

const detailedCategoryIds = ["debt", "welfare", "education"];
const evidenceLevels = new Set([1, 2, 3, 4]);
const directions = new Set(["increase", "decrease", "restructure"]);

test("provides both a domestic and an international case for each detailed category", () => {
  for (const categoryId of detailedCategoryIds) {
    const relatedCases = BUDGET_CASES.filter((budgetCase) =>
      budgetCase.categoryIds.includes(categoryId),
    );

    assert.ok(relatedCases.length >= 2, categoryId);
    assert.ok(relatedCases.some((budgetCase) => budgetCase.country === "日本"), categoryId);
    assert.ok(relatedCases.some((budgetCase) => budgetCase.country !== "日本"), categoryId);
  }
});

test("keeps every case traceable and explicit about evidential limits", () => {
  const ids = BUDGET_CASES.map((budgetCase) => budgetCase.id);

  assert.equal(BUDGET_CASES.length, 20);
  assert.equal(new Set(ids).size, ids.length);

  for (const budgetCase of BUDGET_CASES) {
    assert.ok(budgetCase.confirmedChanges.length > 0);
    assert.ok(evidenceLevels.has(budgetCase.evidenceLevel));
    assert.ok(budgetCase.changeTypes.length > 0);
    assert.ok(directions.has(budgetCase.direction));
    assert.match(budgetCase.sourceUrl, /^https:\/\//);
    assert.ok(budgetCase.sourceTitle.length > 0);
    assert.ok(budgetCase.whatRemainsUnknown.length > 0);
    assert.ok(budgetCase.whatChanged.length > 0);
  }
});

test("adds one verified increase case for welfare, education, and city only", () => {
  const increaseCases = BUDGET_CASES.filter(budgetCase => budgetCase.direction === "increase");

  assert.deepEqual(
    increaseCases.map(budgetCase => budgetCase.categoryIds[0]).sort(),
    ["city", "education", "welfare"],
  );
  assert.deepEqual(
    increaseCases.map(budgetCase => budgetCase.id).sort(),
    [
      "case-england-adult-social-care-increase",
      "case-giga-device-investment",
      "case-us-iija-infrastructure-investment",
    ],
  );
  for (const budgetCase of increaseCases) {
    assert.match(budgetCase.whatRemainsUnknown, /とは限|確認|課題|必要/);
  }
});
