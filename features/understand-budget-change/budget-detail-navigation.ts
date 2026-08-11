import type { BudgetCategoryId } from "../../domain/tokyo-budget/budget-category-id.ts";
import type { BudgetAllocations } from "../simulate-budget/budget-allocation.ts";
import { serializeBudgetPlan } from "../simulate-budget/budget-plan-query.ts";

type BudgetDetailSection = "meaning" | "cases" | "materials";

const budgetDetailHref = (
  section: BudgetDetailSection,
  categoryId: BudgetCategoryId,
  amount100mYen: number,
  allocations?: BudgetAllocations,
) => {
  const params = new URLSearchParams();
  if (allocations) {
    params.set("plan", serializeBudgetPlan(allocations));
    params.set("category", categoryId);
  }
  params.set("amount", String(amount100mYen));
  const suffix = section === "meaning" ? "" : `/${section}`;
  return `/budget/${categoryId}${suffix}?${params}`;
};

export function createBudgetMeaningHref(
  categoryId: BudgetCategoryId,
  amount100mYen: number,
  allocations?: BudgetAllocations,
): string {
  return budgetDetailHref("meaning", categoryId, amount100mYen, allocations);
}

export function createBudgetCasesHref(
  categoryId: BudgetCategoryId,
  amount100mYen: number,
  allocations?: BudgetAllocations,
): string {
  return budgetDetailHref("cases", categoryId, amount100mYen, allocations);
}

export function createBudgetMaterialsHref(
  categoryId: BudgetCategoryId,
  amount100mYen: number,
  allocations?: BudgetAllocations,
): string {
  return budgetDetailHref("materials", categoryId, amount100mYen, allocations);
}
