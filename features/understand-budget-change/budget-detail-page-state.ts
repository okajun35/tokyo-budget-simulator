import {
  BUDGET_CATEGORIES,
  GENERAL_ACCOUNT_BASELINE_100M_YEN,
} from "../simulate-budget/budget-categories.ts";
import { parseBudgetPlan } from "../simulate-budget/budget-plan-query.ts";
import {
  createBudgetDetailComparison,
  resolveBudgetDetailAmount,
} from "./budget-detail.ts";
import { getBudgetChangeGuidance } from "./budget-change-guidance.ts";

export function resolveBudgetDetailPageState(
  categoryId: string,
  amount: string | string[] | undefined,
  plan: string | string[] | undefined,
) {
  const category = BUDGET_CATEGORIES.find(item => item.id === categoryId);
  if (!category) return undefined;

  const planValue = typeof plan === "string" ? plan : undefined;
  const planAllocations = parseBudgetPlan(planValue);
  const resolvedAmount = resolveBudgetDetailAmount(
    planAllocations ? String(planAllocations[category.id]) : amount,
    category.baselineAmount100mYen,
  );
  const comparison = createBudgetDetailComparison(
    category.baselineAmount100mYen,
    resolvedAmount.amount100mYen,
    GENERAL_ACCOUNT_BASELINE_100M_YEN,
  );

  return {
    category,
    planAllocations,
    resolvedAmount,
    comparison,
    changeGuidance: getBudgetChangeGuidance(
      category,
      comparison.direction,
      Math.abs(comparison.changeAmount100mYen),
    ),
  };
}

export const money = (value: number) =>
  `${Math.round(value).toLocaleString("ja-JP")}億円`;

export const detailedMoney = (value: number) =>
  `${value.toLocaleString("ja-JP", { maximumFractionDigits: 2 })}億円`;

export const signedMoney = (value: number) =>
  value === 0 ? "±0億円" : `${value > 0 ? "+" : ""}${money(value)}`;

export const signedPercent = (value: number) =>
  value === 0 ? "±0.0%" : `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
