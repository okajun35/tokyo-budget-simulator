import type {
  BudgetCategory,
  BudgetCategoryId,
} from "./budget-category";

export type BudgetAllocations = Record<BudgetCategoryId, number>;

export type BudgetAllocationRange = {
  minimumAmount100mYen: number;
  maximumAmount100mYen: number;
};

export function getBudgetAllocationRange(
  baselineAmount100mYen: number,
): BudgetAllocationRange {
  return {
    minimumAmount100mYen: Math.round(baselineAmount100mYen * 0.7),
    maximumAmount100mYen: Math.round(baselineAmount100mYen * 1.3),
  };
}

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
