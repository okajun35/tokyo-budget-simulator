export type BudgetDocumentStage =
  | "request"
  | "bureau_assessment"
  | "governor_assessment"
  | "proposal"
  | "assembly_review"
  | "enacted_budget"
  | "evaluation"
  | "external_request"
  | "execution"
  | "settlement";

export const BUDGET_DOCUMENT_STAGE_LABELS: Record<
  BudgetDocumentStage,
  string
> = {
  request: "各局要求",
  bureau_assessment: "財務局査定",
  governor_assessment: "知事査定",
  proposal: "予算案",
  assembly_review: "都議会審議",
  enacted_budget: "成立予算",
  evaluation: "政策・事業評価",
  external_request: "外部要望",
  execution: "事業執行",
  settlement: "決算",
};
