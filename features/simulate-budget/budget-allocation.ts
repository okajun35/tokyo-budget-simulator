import type {
  BudgetCategory,
  BudgetCategoryId,
} from "./budget-category";

export type BudgetAllocations = Record<BudgetCategoryId, number>;

export type BudgetAllocationRange = {
  minimumAmount100mYen: number;
  maximumAmount100mYen: number;
};

export type BudgetAllocationSummary = {
  annualBudgetAmount100mYen: number;
  allocatedAmount100mYen: number;
  availableAmount100mYen: number;
  status: "fully-allocated" | "available";
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

export function calculateBudgetAllocationSummary(
  allocations: BudgetAllocations,
  annualBudgetAmount100mYen: number,
): BudgetAllocationSummary {
  const allocatedAmount100mYen = calculateBudgetTotal(allocations);
  const availableAmount100mYen =
    annualBudgetAmount100mYen - allocatedAmount100mYen;

  return {
    annualBudgetAmount100mYen,
    allocatedAmount100mYen,
    availableAmount100mYen,
    status: availableAmount100mYen > 0 ? "available" : "fully-allocated",
  };
}

export function changeBudgetAllocation({
  allocations,
  categoryId,
  requestedAmount100mYen,
  range,
  annualBudgetAmount100mYen,
}: {
  allocations: BudgetAllocations;
  categoryId: BudgetCategoryId;
  requestedAmount100mYen: number;
  range: BudgetAllocationRange;
  annualBudgetAmount100mYen: number;
}): BudgetAllocations {
  const currentAmount100mYen = allocations[categoryId];
  const availableAmount100mYen =
    annualBudgetAmount100mYen - calculateBudgetTotal(allocations);
  const maximumAffordableAmount100mYen =
    currentAmount100mYen + Math.max(0, availableAmount100mYen);
  const amountInsideRange100mYen = Math.max(
    range.minimumAmount100mYen,
    Math.min(requestedAmount100mYen, range.maximumAmount100mYen),
  );
  const nextAmount100mYen = Math.min(
    amountInsideRange100mYen,
    maximumAffordableAmount100mYen,
  );

  return {
    ...allocations,
    [categoryId]: nextAmount100mYen,
  };
}
