import type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

export type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

export type BudgetRequestContext = {
  bureau: string;
  requestedAmount100mYen: number;
  previousAmount100mYen: number;
  reason: string;
};

export type BudgetCategory = {
  id: BudgetCategoryId;
  name: string;
  baselineAmount100mYen: number;
  color: string;
  shortDescription: string;
  request?: BudgetRequestContext;
  bureauAssessment?: string;
  governorAssessment?: string;
};
