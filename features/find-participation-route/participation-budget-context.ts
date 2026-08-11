import type { BudgetCategoryId } from "../../domain/tokyo-budget/budget-category-id.ts";

import { BUDGET_CATEGORIES } from "../simulate-budget/budget-categories.ts";
import { parseBudgetPlan } from "../simulate-budget/budget-plan-query.ts";

export type ParticipationBudgetContext =
  | { status: "unknown" }
  | {
      status: "known";
      baselineAmount100mYen: number;
      userAmount100mYen: number;
      deltaAmount100mYen: number;
      direction: "increase" | "decrease" | "unchanged";
    };

export function resolveParticipationBudgetContext(
  categoryId: BudgetCategoryId,
  serializedPlan: string | undefined,
): ParticipationBudgetContext {
  const allocations = parseBudgetPlan(serializedPlan);
  if (!allocations) return { status: "unknown" };

  const category = BUDGET_CATEGORIES.find(item => item.id === categoryId);
  if (!category) return { status: "unknown" };

  const userAmount100mYen = allocations[categoryId];
  const deltaAmount100mYen = userAmount100mYen - category.baselineAmount100mYen;
  return {
    status: "known",
    baselineAmount100mYen: category.baselineAmount100mYen,
    userAmount100mYen,
    deltaAmount100mYen,
    direction: deltaAmount100mYen > 0
      ? "increase"
      : deltaAmount100mYen < 0
        ? "decrease"
        : "unchanged",
  };
}
