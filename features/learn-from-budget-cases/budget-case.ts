import type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

export type CausalStrength =
  | "direct_operational_change"
  | "audited_impact"
  | "associated_change"
  | "projected_risk";

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
