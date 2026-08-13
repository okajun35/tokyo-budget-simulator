import type { BudgetCategoryId } from "../../domain/tokyo-budget/budget-category-id.ts";
import type { BudgetAllocations } from "../simulate-budget/budget-allocation.ts";
import {
  serializeBudgetPlan,
  type BudgetDetailOrigin,
} from "../simulate-budget/budget-plan-query.ts";

type BudgetDetailSection = "meaning" | "cases" | "materials";

const budgetDetailHref = (
  section: BudgetDetailSection,
  categoryId: BudgetCategoryId,
  amount100mYen: number,
  allocations?: BudgetAllocations,
  origin?: BudgetDetailOrigin,
) => {
  const params = new URLSearchParams();
  if (allocations) {
    params.set("plan", serializeBudgetPlan(allocations));
    params.set("category", categoryId);
  }
  params.set("amount", String(amount100mYen));
  if (origin) params.set("from", origin);
  const suffix = section === "meaning" ? "" : `/${section}`;
  return `/budget/${categoryId}${suffix}?${params}`;
};

export function createBudgetMeaningHref(
  categoryId: BudgetCategoryId,
  amount100mYen: number,
  allocations?: BudgetAllocations,
  origin?: BudgetDetailOrigin,
): string {
  return budgetDetailHref("meaning", categoryId, amount100mYen, allocations, origin);
}

export function createBudgetCasesHref(
  categoryId: BudgetCategoryId,
  amount100mYen: number,
  allocations?: BudgetAllocations,
  origin?: BudgetDetailOrigin,
): string {
  return budgetDetailHref("cases", categoryId, amount100mYen, allocations, origin);
}

export function createBudgetMaterialsHref(
  categoryId: BudgetCategoryId,
  amount100mYen: number,
  allocations?: BudgetAllocations,
  origin?: BudgetDetailOrigin,
): string {
  return budgetDetailHref("materials", categoryId, amount100mYen, allocations, origin);
}
