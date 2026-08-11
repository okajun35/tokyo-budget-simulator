import Link from "next/link";

import { CommonParticipationRoutes } from "@/features/find-participation-route/common-participation-routes";
import { OFFICIAL_CONTACTS } from "@/features/find-participation-route/official-contacts";
import { resolveParticipationBudgetContext } from "@/features/find-participation-route/participation-budget-context";
import { createParticipationPrepareHref } from "@/features/find-participation-route/participation-navigation";
import { PARTICIPATION_TOPICS } from "@/features/find-participation-route/participation-topics";
import { ParticipationWorkspace } from "@/features/find-participation-route/participation-workspace";
import { BUDGET_CATEGORIES } from "@/features/simulate-budget/budget-categories";
import {
  createBudgetProcessHref,
  createBudgetSimulatorHref,
  parseBudgetPlan,
} from "@/features/simulate-budget/budget-plan-query";

type ParticipationPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    plan?: string | string[];
    topic?: string | string[];
  }>;
};

export default async function ParticipationPage({
  searchParams,
}: ParticipationPageProps) {
  const { category, plan, topic } = await searchParams;
  const categoryValue = typeof category === "string" ? category : undefined;
  const planValue = typeof plan === "string" ? plan : undefined;
  const topicValue = typeof topic === "string" ? topic : undefined;
  const selectedCategory = BUDGET_CATEGORIES.find(item => item.id === categoryValue);
  const planAllocations = parseBudgetPlan(planValue);
  const simulatorHref = planAllocations && selectedCategory
    ? createBudgetSimulatorHref(planAllocations, selectedCategory.id)
    : selectedCategory
      ? `/?category=${selectedCategory.id}#simulator`
      : "/#simulator";
  const budgetProcessHref = planAllocations && selectedCategory
    ? createBudgetProcessHref(planAllocations, selectedCategory.id)
    : selectedCategory
      ? `/budget-process?category=${selectedCategory.id}`
      : "/budget-process";
  const categoryTopics = selectedCategory
    ? PARTICIPATION_TOPICS.filter(item => item.categoryId === selectedCategory.id)
    : [];
  const initialTopicId = categoryTopics.some(item => item.topicId === topicValue)
    ? topicValue
    : undefined;
  const prepareHrefs = selectedCategory
    ? Object.fromEntries(categoryTopics.map(item => [
        item.topicId,
        createParticipationPrepareHref(selectedCategory.id, item.topicId, planAllocations),
      ]))
    : {};

  return <main
    className="participationPage"
    data-participation-page={selectedCategory?.id ?? "none"}
  >
    <header className="participationPageHeader">
      <Link href={simulatorHref}>← 予算シミュレーターへ戻る</Link>
      <p className="eyebrow">CIVIC PARTICIPATION · TOKYO</p>
      <h1>声を届ける</h1>
      <p>自分が動かした予算について関心を具体化し、行政上の主な所管と公式ルートを確認します。考えの整理は次の専用ページで行えます。</p>
    </header>

    {selectedCategory ? <div className="participationPageContent">
      <ParticipationWorkspace
        category={{
          id: selectedCategory.id,
          name: selectedCategory.name,
          color: selectedCategory.color,
        }}
        budgetContext={resolveParticipationBudgetContext(selectedCategory.id, planValue)}
        topics={categoryTopics}
        contacts={OFFICIAL_CONTACTS}
        initialTopicId={initialTopicId}
        prepareHrefs={prepareHrefs}
      />
      <CommonParticipationRoutes />
    </div> : <div className="participationPageContent">
      <aside className="selectedParticipationCategory empty">
        <span>分野指定なし</span>
        <h2>まず予算分野を選んでください</h2>
        <p>予算シミュレーターで分野を選ぶと、9分野の粗い分類から具体的な話題・主な所管・確認済み窓口へ進めます。</p>
        <Link href="/#simulator">予算シミュレーターで分野を選ぶ →</Link>
      </aside>
      <CommonParticipationRoutes />
    </div>}

    <nav className="participationPageBack" aria-label="関連ページへ移動">
      <Link href={simulatorHref}>予算シミュレーターへ戻る</Link>
      <Link href={budgetProcessHref}>予算の決まり方を見る</Link>
    </nav>
  </main>;
}
