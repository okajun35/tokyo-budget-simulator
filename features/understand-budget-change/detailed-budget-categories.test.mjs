import assert from "node:assert/strict";
import test from "node:test";

import {
  DETAILED_BUDGET_CATEGORIES,
} from "./detailed-budget-categories.ts";

test("explains the debt concepts needed to interpret a 30 percent reduction", () => {
  const debt = DETAILED_BUDGET_CATEGORIES.find(item => item.categoryId === "debt");

  assert.deepEqual(
    debt.keyConcepts.map(concept => concept.term),
    ["都債", "元金", "利子", "償還", "借換え", "新規発行", "基金"],
  );
  assert.match(debt.importantNote, /返済義務/);
  assert.match(debt.importantNote, /消え/);
});

test("backs the debt explanation with Tokyo official references", () => {
  const debt = DETAILED_BUDGET_CATEGORIES.find(item => item.categoryId === "debt");

  assert.ok(debt.referenceSources.length >= 2);
  assert.ok(
    debt.referenceSources.every(
      source =>
        source.title.length > 0 &&
        source.whatCanBeLearned.length > 0 &&
        source.sourceDate.length > 0 &&
        source.retrievedAt.length > 0 &&
        /^https:\/\/www\.zaimu\.metro\.tokyo\.lg\.jp\//.test(source.url),
    ),
  );
});
