import assert from "node:assert/strict";
import test from "node:test";

import { createInitialBudgetAllocations } from "../simulate-budget/budget-allocation.ts";
import { BUDGET_CATEGORIES } from "../simulate-budget/budget-categories.ts";
import {
  createParticipationPrepareHref,
  createParticipationSelectionHref,
} from "./participation-navigation.ts";

test("carries plan, category, and non-personal topic between participation pages", () => {
  const plan = createInitialBudgetAllocations(BUDGET_CATEGORIES);
  plan.debt -= 840;
  plan.education += 840;

  assert.equal(
    createParticipationPrepareHref(
      "education",
      "school-meals-curriculum-ict",
      plan,
    ),
    "/participation/prepare?plan=18730%2C16762%2C7822%2C4813%2C9823%2C10575%2C4993%2C1959%2C21053&category=education&topic=school-meals-curriculum-ict#draft-heading",
  );
  assert.equal(
    createParticipationSelectionHref(
      "education",
      "school-meals-curriculum-ict",
      plan,
    ),
    "/participation?plan=18730%2C16762%2C7822%2C4813%2C9823%2C10575%2C4993%2C1959%2C21053&category=education&topic=school-meals-curriculum-ict",
  );
});

test("does not invent a plan when only category and topic are known", () => {
  assert.equal(
    createParticipationPrepareHref("education", "culture"),
    "/participation/prepare?category=education&topic=culture#draft-heading",
  );
});
