import type { BudgetCategoryId } from "../../domain/tokyo-budget/budget-category-id.ts";
import type { BudgetAllocations } from "../simulate-budget/budget-allocation.ts";
import { serializeBudgetPlan } from "../simulate-budget/budget-plan-query.ts";

const participationQuery = (
  categoryId: BudgetCategoryId,
  topicId: string,
  allocations?: BudgetAllocations,
) => {
  const params = new URLSearchParams();
  if (allocations) params.set("plan", serializeBudgetPlan(allocations));
  params.set("category", categoryId);
  params.set("topic", topicId);
  return params;
};

export function createParticipationPrepareHref(
  categoryId: BudgetCategoryId,
  topicId: string,
  allocations?: BudgetAllocations,
): string {
  return `/participation/prepare?${participationQuery(categoryId, topicId, allocations)}#draft-heading`;
}

export function createParticipationSelectionHref(
  categoryId: BudgetCategoryId,
  topicId: string,
  allocations?: BudgetAllocations,
): string {
  return `/participation?${participationQuery(categoryId, topicId, allocations)}`;
}
