import type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

export type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

export type BudgetMaterialRelationship =
  | "direct"
  | "related_bureau"
  | "representative_item";

export type BudgetRequestContext = {
  relationship: Extract<BudgetMaterialRelationship, "direct" | "related_bureau">;
  sourceId: "request";
  bureau: string;
  requestedAmount100mYen: number;
  previousAmount100mYen: number;
  previousAmountLabel?: "前年度" | "前年度当初";
  reason: string;
  note: string;
};

export type BudgetAssessmentItem = {
  name: string;
  requestedAmount100mYen: number;
  assessedAmount100mYen: number;
  reason?: string;
};

export type BudgetAssessmentContext = {
  relationship: Extract<BudgetMaterialRelationship, "representative_item">;
  sourceId: "bureau";
  items: readonly BudgetAssessmentItem[];
  note: string;
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
  /** 政策判断だけでは増減できない性質を持つ分野にだけ添える。 */
  adjustmentNote?: string;
  definition: string;
  detailedExplanation?: string;
  mainUses: readonly string[];
  changeOptions: readonly BudgetChangeOption[];
  sourceIds: readonly string[];
  caseIds: readonly string[];
  participationRouteIds: readonly string[];
  leadBureaus: readonly BudgetBureauLink[];
  request?: BudgetRequestContext;
  requestUnavailableReason?: string;
  bureauAssessment?: BudgetAssessmentContext;
  bureauAssessmentUnavailableReason?: string;
  governorAssessment?: string;
};
