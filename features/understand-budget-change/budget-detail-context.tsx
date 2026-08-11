import type { BudgetCategory } from "../simulate-budget/budget-category.ts";
import type { BudgetDetailComparison } from "./budget-detail.ts";
import { money, signedMoney } from "./budget-detail-page-state.ts";

type BudgetDetailContextProps = {
  category: BudgetCategory;
  comparison: BudgetDetailComparison;
};

type BudgetDetailFallbackNoticeProps = {
  amount: string | string[] | undefined;
  usedFallback: boolean;
};

export function BudgetDetailFallbackNotice({
  amount,
  usedFallback,
}: BudgetDetailFallbackNoticeProps) {
  if (!usedFallback) return null;

  return <aside className="budgetDetailFallback" role="status">
    {amount === undefined
      ? "設定額が指定されていないため、成立予算額を表示しています。"
      : "指定された金額を利用できないため、成立予算額を表示しています。"}
  </aside>;
}

export function BudgetDetailContext({
  category,
  comparison,
}: BudgetDetailContextProps) {
  return <section
    className="budgetSupplementContext"
    aria-label={`${category.name}の選択内容`}
    style={{ borderColor: category.color }}
  >
    <div>
      <span>選んだ分野</span>
      <h2>{category.name}</h2>
    </div>
    <dl>
      <div><dt>成立予算</dt><dd>{money(comparison.baselineAmount100mYen)}</dd></div>
      <div><dt>あなたの案</dt><dd>{money(comparison.proposedAmount100mYen)}</dd></div>
      <div><dt>変更額</dt><dd>{signedMoney(comparison.changeAmount100mYen)}</dd></div>
    </dl>
  </section>;
}
