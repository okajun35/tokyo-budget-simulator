export type BudgetCategoryId =
  | "welfare"
  | "education"
  | "industry"
  | "environment"
  | "city"
  | "safety"
  | "admin"
  | "debt"
  | "linked";

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
