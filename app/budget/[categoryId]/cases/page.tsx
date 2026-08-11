import Link from "next/link";

import { CategoryCaseStudies } from "@/features/learn-from-budget-cases/category-case-studies";
import {
  createBudgetParticipationHref,
  createBudgetSimulatorHref,
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

type BudgetCasesPageProps = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{
    amount?: string | string[];
    plan?: string | string[];
  }>;
};

export default async function BudgetCasesPage({
  params,
  searchParams,
}: BudgetCasesPageProps) {
  const { categoryId } = await params;
  const { amount, plan } = await searchParams;
  const state = resolveBudgetDetailPageState(categoryId, amount, plan);

  if (!state) {
    return <main className="budgetDetailPage"><section className="budgetDetailMissing"><h1>分野が見つかりません</h1><p>URLの分野IDを確認してください。</p><Link href="/#simulator">← 予算一覧へ戻る</Link></section></main>;
  }

  const { category, comparison, changeGuidance, planAllocations, resolvedAmount } = state;
  const meaningHref = createBudgetMeaningHref(category.id, resolvedAmount.amount100mYen, planAllocations);
  const casesHref = createBudgetCasesHref(category.id, resolvedAmount.amount100mYen, planAllocations);
  const materialsHref = createBudgetMaterialsHref(category.id, resolvedAmount.amount100mYen, planAllocations);
  const simulatorHref = planAllocations
    ? createBudgetSimulatorHref(planAllocations, category.id)
    : "/#simulator";
  const participationHref = planAllocations
    ? createBudgetParticipationHref(planAllocations, category.id)
    : `/participation?category=${category.id}`;

  return <main
    className="budgetDetailPage budgetSupplementPage"
    data-budget-cases={category.id}
    data-change-direction={comparison.direction}
  >
    <header className="budgetDetailHeader">
      <Link href={meaningHref}>← 変更の意味と制約へ戻る</Link>
      <p className="eyebrow">PUBLIC CASES</p>
      <h1>{category.name}の事例</h1>
      <p>他地域の公的資料から、実際に何を変え、何が確認されたかを読みます。東京都で同じ結果になるという予測ではありません。</p>
    </header>
    <div className="budgetDetailContent">
      <BudgetDetailFallbackNotice amount={amount} usedFallback={resolvedAmount.usedFallback} />
      <BudgetDetailContext category={category} comparison={comparison} />
      <BudgetLearningJourney
        current="cases"
        meaningHref={meaningHref}
        casesHref={casesHref}
        materialsHref={materialsHref}
        participationHref={participationHref}
        simulatorHref={simulatorHref}
      />
      <CategoryCaseStudies
        category={category}
        direction={comparison.direction}
        guidance={changeGuidance}
      />
      <BudgetLearningJourneyNext
        current="cases"
        meaningHref={meaningHref}
        casesHref={casesHref}
        materialsHref={materialsHref}
        participationHref={participationHref}
        simulatorHref={simulatorHref}
      />
    </div>
  </main>;
}
