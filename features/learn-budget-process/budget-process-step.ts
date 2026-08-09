import type { BudgetDocumentStage } from "@/domain/tokyo-budget/budget-document-stage";

export type BudgetProcessOverviewStage = Extract<
  BudgetDocumentStage,
  | "request"
  | "bureau_assessment"
  | "governor_assessment"
  | "proposal"
  | "enacted_budget"
>;

export type BudgetProcessStep = {
  documentStage: BudgetProcessOverviewStage;
  summary: string;
};
