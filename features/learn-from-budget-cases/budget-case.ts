import type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

/**
 * 事例は「成功」「失敗」で分類しない。どの種類の変更だったかだけを示す。
 * 1件に複数付けてよく、たとえば「サービス縮小」と「負担移転」が並べば
 * 支出が減った先に負担が移ったことが読み取れる。
 */
export type BudgetCaseChangeType =
  | "service_expansion"
  | "workforce_expansion"
  | "capacity_expansion"
  | "capital_investment"
  | "service_reduction"
  | "efficiency_reorganization"
  | "burden_shift"
  | "deferral";

export const BUDGET_CASE_CHANGE_TYPE_LABELS = {
  service_expansion: "サービス拡充",
  workforce_expansion: "人員拡充",
  capacity_expansion: "供給能力の拡充",
  capital_investment: "設備・インフラ投資",
  service_reduction: "サービス縮小",
  efficiency_reorganization: "効率化・再編",
  burden_shift: "負担移転",
  deferral: "将来への先送り",
} as const satisfies Record<BudgetCaseChangeType, string>;

export const BUDGET_CASE_CHANGE_TYPE_DESCRIPTIONS = {
  service_expansion: "対象、回数、内容など提供するサービスを広げた",
  workforce_expansion: "サービスを担う人員や体制を増やした",
  capacity_expansion: "需要へ対応するための供給能力を増やした",
  capital_investment: "施設、設備、端末、インフラなどへ投資した",
  service_reduction: "対象、時間、人員、施設などを減らした",
  efficiency_reorganization: "統合、共同化、業務変更などで支出構造を変えた",
  burden_shift: "住民、家族、職員、別部署などへ負担が移った",
  deferral: "修繕、更新、返済などを後年度へ移した",
} as const satisfies Record<BudgetCaseChangeType, string>;

/**
 * タグは2つのまとまりを持つ。前者は追加・削減・再編によって何が変わったか、
 * 後者は削減した支出の先に費用が動いたかを表す。
 * 「支出が減った」＝「社会全体のコストが減った」ではないため、
 * 後者が付いているかどうかを一目で分かるようにする。
 * 色はタグごとではなくこのまとまりごとに決める。
 */
export type BudgetCaseChangeTypeGroup = "what_changed" | "where_the_cost_moved";

export const BUDGET_CASE_CHANGE_TYPE_GROUPS = {
  what_changed: {
    label: "何が変わったか",
    changeTypes: [
      "service_expansion",
      "workforce_expansion",
      "capacity_expansion",
      "capital_investment",
      "service_reduction",
      "efficiency_reorganization",
    ],
  },
  where_the_cost_moved: {
    label: "費用はどこへ動いたか",
    changeTypes: ["burden_shift", "deferral"],
  },
} as const satisfies Record<
  BudgetCaseChangeTypeGroup,
  { label: string; changeTypes: readonly BudgetCaseChangeType[] }
>;

export const changeTypeGroupOf = (
  changeType: BudgetCaseChangeType,
): BudgetCaseChangeTypeGroup =>
  (BUDGET_CASE_CHANGE_TYPE_GROUPS.where_the_cost_moved.changeTypes as readonly BudgetCaseChangeType[])
    .includes(changeType)
    ? "where_the_cost_moved"
    : "what_changed";

/**
 * 資料の確かさは内部で管理する。1が最も直接的で、4は関連事例。
 * 画面には出さない。「レベル2」と書かれても利用者には良し悪しが伝わらないため、
 * 代わりに `BUDGET_CASE_SOURCE_KIND_LABELS` で出典の種類を言葉で示す。
 */
export type BudgetCaseEvidenceLevel = 1 | 2 | 3 | 4;

export type BudgetCaseDirection = "increase" | "decrease" | "restructure";

export type BudgetCaseSourceKind =
  | "local_government"
  | "national_government"
  | "national_audit_office"
  | "government_inspectorate";

export const BUDGET_CASE_SOURCE_KIND_LABELS = {
  local_government: "自治体公式",
  national_government: "政府機関",
  national_audit_office: "公的監査",
  government_inspectorate: "公的評価機関",
} as const satisfies Record<BudgetCaseSourceKind, string>;

export type BudgetCase = {
  id: string;
  title: string;
  categoryIds: readonly BudgetCategoryId[];
  direction: BudgetCaseDirection;
  jurisdiction: string;
  country: string;
  period: string;
  /** なぜ変更したのか。 */
  budgetContext: string;
  changeTypes: readonly BudgetCaseChangeType[];
  /** 何を変えたのか。決めた内容を一文で。 */
  whatChanged: string;
  /** 何が確認されたのか。資料に記録された具体の変化。 */
  confirmedChanges: readonly string[];
  /** まだ分からないこと。資料では確認できない範囲を明示する。 */
  whatRemainsUnknown: string;
  evidenceLevel: BudgetCaseEvidenceLevel;
  sourceKind: BudgetCaseSourceKind;
  sourceUrl: string;
  sourceTitle: string;
  sourceDate: string;
  retrievedAt: string;
};
