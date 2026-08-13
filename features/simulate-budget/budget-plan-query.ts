import type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

import {
  calculateBudgetTotal,
  createInitialBudgetAllocations,
  getBudgetAllocationRange,
  type BudgetAllocations,
} from "./budget-allocation.ts";
import {
  BUDGET_CATEGORIES,
  GENERAL_ACCOUNT_BASELINE_100M_YEN,
} from "./budget-categories.ts";
import { createBudgetResultChangeId } from "./budget-result-focus.ts";

export type ResolvedBudgetPlanState = {
  allocations: BudgetAllocations;
  selectedCategoryId: BudgetCategoryId;
  restoredFromQuery: boolean;
};

export type BudgetDetailOrigin = "budget-result";

const isBudgetCategoryId = (value: string | undefined): value is BudgetCategoryId =>
  BUDGET_CATEGORIES.some(category => category.id === value);

export function serializeBudgetPlan(allocations: BudgetAllocations): string {
  return BUDGET_CATEGORIES.map(category => allocations[category.id]).join(",");
}

export function parseBudgetPlan(value: string | undefined): BudgetAllocations | undefined {
  if (!value) return undefined;

  const tokens = value.split(",");
  if (tokens.length !== BUDGET_CATEGORIES.length) return undefined;
  if (tokens.some(token => !/^\d+$/.test(token))) return undefined;

  const amounts = tokens.map(Number);
  const insideRanges = amounts.every((amount, index) => {
    const category = BUDGET_CATEGORIES[index];
    const range = getBudgetAllocationRange(category.baselineAmount100mYen);
    return Number.isSafeInteger(amount) &&
      amount >= range.minimumAmount100mYen &&
      amount <= range.maximumAmount100mYen;
  });
  if (!insideRanges) return undefined;

  const allocations = Object.fromEntries(
    BUDGET_CATEGORIES.map((category, index) => [category.id, amounts[index]]),
  ) as BudgetAllocations;

  if (calculateBudgetTotal(allocations) > GENERAL_ACCOUNT_BASELINE_100M_YEN) {
    return undefined;
  }
  return allocations;
}

export function resolveBudgetPlanState(
  plan: string | undefined,
  selectedCategory: string | undefined,
): ResolvedBudgetPlanState {
  const restoredAllocations = parseBudgetPlan(plan);
  return {
    allocations: restoredAllocations ?? createInitialBudgetAllocations(BUDGET_CATEGORIES),
    selectedCategoryId: isBudgetCategoryId(selectedCategory)
      ? selectedCategory
      : BUDGET_CATEGORIES[0].id,
    restoredFromQuery: restoredAllocations !== undefined,
  };
}

const stateQuery = (
  allocations: BudgetAllocations,
  selectedCategoryId: BudgetCategoryId,
) => {
  const params = new URLSearchParams();
  params.set("plan", serializeBudgetPlan(allocations));
  params.set("category", selectedCategoryId);
  return params;
};

export function createBudgetSimulatorHref(
  allocations: BudgetAllocations,
  selectedCategoryId: BudgetCategoryId,
): string {
  return `/?${stateQuery(allocations, selectedCategoryId)}#simulator`;
}

export function createBudgetDetailHref(
  categoryId: BudgetCategoryId,
  allocations: BudgetAllocations,
  origin?: BudgetDetailOrigin,
): string {
  const params = stateQuery(allocations, categoryId);
  params.set("amount", String(allocations[categoryId]));
  if (origin) params.set("from", origin);
  return `/budget/${categoryId}?${params}`;
}

export function resolveBudgetDetailOrigin(
  value: string | undefined,
): BudgetDetailOrigin | undefined {
  return value === "budget-result" ? value : undefined;
}

export function createBudgetProcessHref(
  allocations: BudgetAllocations,
  selectedCategoryId: BudgetCategoryId,
): string {
  return `/budget-process?${stateQuery(allocations, selectedCategoryId)}`;
}

export function createBudgetResultHref(
  allocations: BudgetAllocations,
  selectedCategoryId: BudgetCategoryId,
  focusCategoryId?: BudgetCategoryId,
): string {
  const href = `/budget-result?${stateQuery(allocations, selectedCategoryId)}`;
  return focusCategoryId
    ? `${href}#${createBudgetResultChangeId(focusCategoryId)}`
    : href;
}

export function createBudgetParticipationHref(
  allocations: BudgetAllocations,
  selectedCategoryId: BudgetCategoryId,
): string {
  return `/participation?${stateQuery(allocations, selectedCategoryId)}`;
}
