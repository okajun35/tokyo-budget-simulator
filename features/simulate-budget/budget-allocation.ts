import type {
  BudgetCategory,
  BudgetCategoryId,
} from "./budget-category";

export type BudgetAllocations = Record<BudgetCategoryId, number>;

export function createInitialBudgetAllocations(
  categories: readonly BudgetCategory[],
): BudgetAllocations {
  return Object.fromEntries(
    categories.map((category) => [
      category.id,
      category.baselineAmount100mYen,
    ]),
  ) as BudgetAllocations;
}

export function calculateBudgetTotal(
  allocations: BudgetAllocations,
): number {
  return Object.values(allocations).reduce((sum, amount) => sum + amount, 0);
}
