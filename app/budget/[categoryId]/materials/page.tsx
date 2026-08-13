import Link from "next/link";

import { CategoryBudgetMaterials } from "@/features/learn-budget-process/category-budget-materials";
import {
  createBudgetProcessHref,
  createBudgetParticipationHref,
  createBudgetSimulatorHref,
  resolveBudgetDetailOrigin,
} from "@/features/simulate-budget/budget-plan-query";
import {
  BudgetDetailContext,
  BudgetDetailFallbackNotice,
} from "@/features/understand-budget-change/budget-detail-context";
import {
  BudgetLearningJourney,
  BudgetLearningJourneyNext,
} from "@/features/understand-budget-change/budget-learning-journey";
import {
  createBudgetCasesHref,
  createBudgetMaterialsHref,
  createBudgetMeaningHref,
} from "@/features/understand-budget-change/budget-detail-navigation";
import { resolveBudgetDetailPageState } from "@/features/understand-budget-change/budget-detail-page-state";

type BudgetMaterialsPageProps = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{
    amount?: string | string[];
    plan?: string | string[];
    from?: string | string[];
  }>;
};

export default async function BudgetMaterialsPage({
  params,
  searchParams,
}: BudgetMaterialsPageProps) {
  const { categoryId } = await params;
  const { amount, plan, from } = await searchParams;
  const state = resolveBudgetDetailPageState(categoryId, amount, plan);

  if (!state) {
    return <main className="budgetDetailPage"><section className="budgetDetailMissing"><h1>分野が見つかりません</h1><p>URLの分野IDを確認してください。</p><Link href="/#simulator">← 予算一覧へ戻る</Link></section></main>;
  }

  const { category, comparison, planAllocations, resolvedAmount } = state;
  const detailOrigin = planAllocations
    ? resolveBudgetDetailOrigin(typeof from === "string" ? from : undefined)
    : undefined;
  const meaningHref = createBudgetMeaningHref(
    category.id,
    resolvedAmount.amount100mYen,
    planAllocations,
    detailOrigin,
  );
  const casesHref = createBudgetCasesHref(
    category.id,
    resolvedAmount.amount100mYen,
    planAllocations,
    detailOrigin,
  );
  const materialsHref = createBudgetMaterialsHref(
    category.id,
    resolvedAmount.amount100mYen,
    planAllocations,
    detailOrigin,
  );
  const simulatorHref = planAllocations
    ? createBudgetSimulatorHref(planAllocations, category.id)
    : "/#simulator";
  const participationHref = planAllocations
    ? createBudgetParticipationHref(planAllocations, category.id)
    : `/participation?category=${category.id}`;
  const budgetProcessHref = planAllocations
    ? createBudgetProcessHref(planAllocations, category.id)
    : "/budget-process";

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
      <BudgetLearningJourney
        current="materials"
        direction={comparison.direction}
        meaningHref={meaningHref}
        casesHref={casesHref}
        materialsHref={materialsHref}
        participationHref={participationHref}
        simulatorHref={simulatorHref}
        budgetProcessHref={budgetProcessHref}
      />
      <CategoryBudgetMaterials category={category} />
      <BudgetLearningJourneyNext
        current="materials"
        direction={comparison.direction}
        meaningHref={meaningHref}
        casesHref={casesHref}
        materialsHref={materialsHref}
        participationHref={participationHref}
        simulatorHref={simulatorHref}
        budgetProcessHref={budgetProcessHref}
      />
    </div>
  </main>;
}
