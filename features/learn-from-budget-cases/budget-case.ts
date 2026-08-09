import type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

export type CausalStrength =
  | "direct_operational_change"
  | "audited_impact"
  | "associated_change"
  | "projected_risk";

export const CAUSAL_STRENGTH_LABELS = {
  direct_operational_change: "直接確認された運用変更",
  audited_impact: "監査・調査で確認された影響",
  associated_change: "関連して確認された変化",
  projected_risk: "資料上で予測されたリスク",
} as const satisfies Record<CausalStrength, string>;

export type BudgetCaseSourceType =
  | "local_government"
  | "national_audit_office"
  | "government_inspectorate";

export type BudgetCase = {
  id: string;
  title: string;
  categoryIds: readonly BudgetCategoryId[];
  jurisdiction: string;
  country: string;
  period: string;
  budgetContext: string;
  confirmedChanges: readonly string[];
  measuredLongTermOutcome: string | null;
  causalStrength: CausalStrength;
  sourceType: BudgetCaseSourceType;
  sourceUrl: string;
  sourceTitle: string;
  sourceDate: string;
  retrievedAt: string;
  caution: string;
};
