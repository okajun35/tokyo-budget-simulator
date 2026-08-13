import type { BudgetCategory } from "./budget-category.ts";
import {
  calculateBudgetAllocationSummary,
  type BudgetAllocations,
} from "./budget-allocation.ts";
import {
  describeBudgetChange,
  type BudgetChangeDescription,
} from "./budget-change.ts";

export type BudgetResultEntry = {
  category: BudgetCategory;
  change: BudgetChangeDescription;
};

export type BudgetResultSummary = {
  hasChanges: boolean;
  increases: BudgetResultEntry[];
  decreases: BudgetResultEntry[];
  increaseCount: number;
  decreaseCount: number;
  unchangedCount: number;
  reallocatedAmount100mYen: number;
  decreasedAmount100mYen: number;
  availableAmount100mYen: number;
};

export function summarizeBudgetResult(
  categories: readonly BudgetCategory[],
  allocations: BudgetAllocations,
  annualBudgetAmount100mYen: number,
): BudgetResultSummary {
  const entries = categories.map(category => ({
    category,
    change: describeBudgetChange(
      category.baselineAmount100mYen,
      allocations[category.id],
    ),
  }));
  const increases = entries.filter(entry => entry.change.direction === "increase");
  const decreases = entries.filter(entry => entry.change.direction === "decrease");
  const allocationSummary = calculateBudgetAllocationSummary(
    allocations,
    annualBudgetAmount100mYen,
  );

  return {
    hasChanges: increases.length > 0 || decreases.length > 0,
    increases,
    decreases,
    increaseCount: increases.length,
    decreaseCount: decreases.length,
    unchangedCount: entries.length - increases.length - decreases.length,
    reallocatedAmount100mYen: increases.reduce(
      (total, entry) => total + entry.change.amount100mYen,
      0,
    ),
    decreasedAmount100mYen: decreases.reduce(
      (total, entry) => total + Math.abs(entry.change.amount100mYen),
      0,
    ),
    availableAmount100mYen: allocationSummary.availableAmount100mYen,
  };
}
