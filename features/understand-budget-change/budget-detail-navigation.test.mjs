import assert from "node:assert/strict";
import test from "node:test";

import { createInitialBudgetAllocations } from "../simulate-budget/budget-allocation.ts";
import { BUDGET_CATEGORIES } from "../simulate-budget/budget-categories.ts";
import {
  createBudgetCasesHref,
  createBudgetMaterialsHref,
  createBudgetMeaningHref,
} from "./budget-detail-navigation.ts";

const plan = createInitialBudgetAllocations(BUDGET_CATEGORIES);
plan.debt = 1_959;
plan.education = 16_762;

test("carries the complete plan from meaning to cases and materials", () => {
  assert.equal(
    createBudgetCasesHref("education", 16_762, plan),
    "/budget/education/cases?plan=18730%2C16762%2C7822%2C4813%2C9823%2C10575%2C4993%2C1959%2C21053&category=education&amount=16762",
  );
  assert.equal(
    createBudgetMaterialsHref("education", 16_762, plan),
    "/budget/education/materials?plan=18730%2C16762%2C7822%2C4813%2C9823%2C10575%2C4993%2C1959%2C21053&category=education&amount=16762",
  );
  assert.equal(
    createBudgetMeaningHref("education", 16_762, plan),
    "/budget/education?plan=18730%2C16762%2C7822%2C4813%2C9823%2C10575%2C4993%2C1959%2C21053&category=education&amount=16762",
  );
});

test("carries a legacy amount without inventing a complete plan", () => {
  assert.equal(
    createBudgetCasesHref("welfare", 15_000),
    "/budget/welfare/cases?amount=15000",
  );
  assert.equal(
    createBudgetMaterialsHref("welfare", 15_000),
    "/budget/welfare/materials?amount=15000",
  );
  assert.equal(
    createBudgetMeaningHref("welfare", 15_000),
    "/budget/welfare?amount=15000",
  );
});
