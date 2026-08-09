import type { BudgetCategory } from "./budget-category";
import {
  createInitialBudgetAllocations,
  type BudgetAllocations,
} from "./budget-allocation.ts";

export type BudgetSimulationState = {
  allocations: BudgetAllocations;
  selectedCategoryId: BudgetCategory["id"];
};

export function createInitialBudgetSimulationState(
  categories: readonly BudgetCategory[],
): BudgetSimulationState {
  const firstCategory = categories[0];

  if (!firstCategory) {
    throw new Error("予算分野が1件以上必要です。");
  }

  return {
    allocations: createInitialBudgetAllocations(categories),
    selectedCategoryId: firstCategory.id,
  };
}
