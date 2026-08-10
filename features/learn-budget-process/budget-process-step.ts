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
  documentStage: BudgetDocumentStage;
  summary: string;
  actor: string;
  decision: string;
  amountChangePossibility: string;
  sourceIds: readonly string[];
  publicInvolvement: string;
  limitation: string;
  fiscalYearStatus: "completed" | "in_progress" | "not_available_yet";
};

export type BudgetProcessOverviewStep = BudgetProcessStep & {
  documentStage: BudgetProcessOverviewStage;
};

export type BudgetProcessSummaryStep = {
  id: string;
  label: string;
  /** 行政用語のままでは意味が取りにくいため、この段階で誰が何をするのかを短く言い換える。 */
  plainMeaning: string;
  summary: string;
};
