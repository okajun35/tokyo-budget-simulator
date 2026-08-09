import assert from "node:assert/strict";
import test from "node:test";

import { PARTICIPATION_ROUTES } from "../find-participation-route/participation-routes.ts";
import { BUDGET_CASES } from "../learn-from-budget-cases/budget-cases.ts";
import { BUDGET_SOURCES } from "../trace-budget-sources/budget-sources.ts";
import { BUDGET_CATEGORIES } from "./budget-categories.ts";
import { findMissingBudgetCategoryReferences } from "./budget-category-reference-validation.ts";

test("accepts every reference in the current budget category data", () => {
  assert.deepEqual(
    findMissingBudgetCategoryReferences({
      categories: BUDGET_CATEGORIES,
      sources: BUDGET_SOURCES,
      cases: BUDGET_CASES,
      participationRoutes: PARTICIPATION_ROUTES,
    }),
    [],
  );
});

test("reports missing source, case, and participation route IDs", () => {
  const invalidCategory = {
    ...BUDGET_CATEGORIES[0],
    sourceIds: ["missing-source"],
    caseIds: ["missing-case"],
    participationRouteIds: ["missing-participation-route"],
  };

  assert.deepEqual(
    findMissingBudgetCategoryReferences({
      categories: [invalidCategory],
      sources: BUDGET_SOURCES,
      cases: BUDGET_CASES,
      participationRoutes: PARTICIPATION_ROUTES,
    }),
    [
      {
        categoryId: "welfare",
        referenceType: "source",
        missingId: "missing-source",
      },
      {
        categoryId: "welfare",
        referenceType: "case",
        missingId: "missing-case",
      },
      {
        categoryId: "welfare",
        referenceType: "participation_route",
        missingId: "missing-participation-route",
      },
    ],
  );
});
