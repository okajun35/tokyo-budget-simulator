import Link from "next/link";

import { CategoryBudgetMaterials } from "@/features/learn-budget-process/category-budget-materials";
import {
  createBudgetParticipationHref,
  createBudgetSimulatorHref,
} from "@/features/simulate-budget/budget-plan-query";
import {
  BudgetDetailContext,
  BudgetDetailFallbackNotice,
} from "@/features/understand-budget-change/budget-detail-context";
import {
  createBudgetCasesHref,
  createBudgetMeaningHref,
} from "@/features/understand-budget-change/budget-detail-navigation";
import { resolveBudgetDetailPageState } from "@/features/understand-budget-change/budget-detail-page-state";

type BudgetMaterialsPageProps = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{
    amount?: string | string[];
    plan?: string | string[];
  }>;
};

export default async function BudgetMaterialsPage({
  params,
  searchParams,
}: BudgetMaterialsPageProps) {
  const { categoryId } = await params;
  const { amount, plan } = await searchParams;
  const state = resolveBudgetDetailPageState(categoryId, amount, plan);

  if (!state) {
    return <main className="budgetDetailPage"><section className="budgetDetailMissing"><h1>分野が見つかりません</h1><p>URLの分野IDを確認してください。</p><Link href="/#simulator">← 予算一覧へ戻る</Link></section></main>;
  }

  const { category, comparison, planAllocations, resolvedAmount } = state;
  const meaningHref = createBudgetMeaningHref(category.id, resolvedAmount.amount100mYen, planAllocations);
  const casesHref = createBudgetCasesHref(category.id, resolvedAmount.amount100mYen, planAllocations);
  const simulatorHref = planAllocations
    ? createBudgetSimulatorHref(planAllocations, category.id)
    : "/#simulator";
  const participationHref = planAllocations
    ? createBudgetParticipationHref(planAllocations, category.id)
    : `/participation?category=${category.id}`;

  return <main
    className="budgetDetailPage budgetSupplementPage"
    data-budget-materials={category.id}
    data-change-direction={comparison.direction}
  >
    <header className="budgetDetailHeader">
      <Link href={meaningHref}>← 変更の意味と制約へ戻る</Link>
      <p className="eyebrow">TOKYO BUDGET MATERIALS</p>
      <h1>{category.name}の予算編成資料</h1>
      <p>東京都の要求・査定・予算案・成立予算を、分類軸の違いと確認できる範囲に注意して読みます。</p>
    </header>
    <div className="budgetDetailContent">
      <BudgetDetailFallbackNotice amount={amount} usedFallback={resolvedAmount.usedFallback} />
      <BudgetDetailContext category={category} comparison={comparison} />
      <CategoryBudgetMaterials category={category} />
      <nav className="budgetDetailBack" aria-label="関連ページへ移動">
        <Link href={meaningHref}>変更の意味と制約へ戻る</Link>
        <Link href={casesHref}>実際の事例を見る</Link>
        <Link href={participationHref}>具体的な話題と窓口を選ぶ</Link>
        <Link href={simulatorHref}>予算シミュレーターへ戻る</Link>
      </nav>
    </div>
  </main>;
}
