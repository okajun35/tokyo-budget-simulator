import type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

export type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

export type BudgetRequestContext = {
  bureau: string;
  requestedAmount100mYen: number;
  previousAmount100mYen: number;
  reason: string;
};

export type BudgetChangeOption = {
  id: string;
  title: string;
  description: string;
};

export type BudgetBureauLink = {
  name: string;
  url: string;
};

export type BudgetCategory = {
  id: BudgetCategoryId;
  name: string;
  /** シミュレーターの基準にする成立後当初予算額。 */
  baselineAmount100mYen: number;
  color: string;
  shortDescription: string;
  definition: string;
  mainUses: readonly string[];
  changeOptions: readonly BudgetChangeOption[];
  sourceIds: readonly string[];
  caseIds: readonly string[];
  participationRouteIds: readonly string[];
  leadBureaus: readonly BudgetBureauLink[];
  request?: BudgetRequestContext;
  bureauAssessment?: string;
  governorAssessment?: string;
};
