import type { BudgetCategoryId } from "../../domain/tokyo-budget/budget-category-id.ts";

export type AdvocacyDirection = "increase" | "decrease" | "unchanged";

export type AdvocacyDraftInput = {
  categoryId: BudgetCategoryId;
  categoryName: string;
  deltaAmount: number;
  direction: AdvocacyDirection;
  topicId: string;
  topicName: string;
  bureauName: string;
  contactUrl: string;
  concern: string;
  requestedAction: string;
  reason: string;
  priorities: string[];
};

export const REQUESTED_ACTION_OPTIONS = [
  { id: "increase-support", label: "支援・サービスを増やしてほしい" },
  { id: "maintain-current", label: "現在の水準を維持してほしい" },
  { id: "review-allocation", label: "内容・配分を見直してほしい" },
  { id: "reduce-spending", label: "支出を減らしてほしい" },
  { id: "consider-efficiency", label: "効率化を検討してほしい" },
  { id: "explain-disclose", label: "説明・情報公開を求めたい" },
  { id: "undecided", label: "まだ決めていない" },
  { id: "other", label: "その他" },
] as const;
