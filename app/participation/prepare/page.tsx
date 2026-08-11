import Link from "next/link";

import { OFFICIAL_CONTACTS } from "@/features/find-participation-route/official-contacts";
import { resolveParticipationBudgetContext } from "@/features/find-participation-route/participation-budget-context";
import { ParticipationDraftWorkspace } from "@/features/find-participation-route/participation-draft-workspace";
import { createParticipationSelectionHref } from "@/features/find-participation-route/participation-navigation";
import { PARTICIPATION_TOPICS } from "@/features/find-participation-route/participation-topics";
import { BUDGET_CATEGORIES } from "@/features/simulate-budget/budget-categories";
import {
  createBudgetParticipationHref,
  createBudgetProcessHref,
  createBudgetSimulatorHref,
  parseBudgetPlan,
} from "@/features/simulate-budget/budget-plan-query";

type ParticipationPreparePageProps = {
  searchParams: Promise<{
    category?: string | string[];
    plan?: string | string[];
    topic?: string | string[];
  }>;
};

export default async function ParticipationPreparePage({
  searchParams,
}: ParticipationPreparePageProps) {
  const { category, plan, topic } = await searchParams;
  const categoryValue = typeof category === "string" ? category : undefined;
  const planValue = typeof plan === "string" ? plan : undefined;
  const topicValue = typeof topic === "string" ? topic : undefined;
  const selectedCategory = BUDGET_CATEGORIES.find(item => item.id === categoryValue);
  const selectedTopic = selectedCategory
    ? PARTICIPATION_TOPICS.find(item =>
        item.categoryId === selectedCategory.id && item.topicId === topicValue
      )
    : undefined;
  const planAllocations = parseBudgetPlan(planValue);
  const participationHref = selectedCategory && selectedTopic
    ? createParticipationSelectionHref(selectedCategory.id, selectedTopic.topicId, planAllocations)
    : selectedCategory && planAllocations
      ? createBudgetParticipationHref(planAllocations, selectedCategory.id)
      : selectedCategory
        ? `/participation?category=${selectedCategory.id}`
        : "/participation";
  const simulatorHref = selectedCategory && planAllocations
    ? createBudgetSimulatorHref(planAllocations, selectedCategory.id)
    : selectedCategory
      ? `/?category=${selectedCategory.id}#simulator`
      : "/#simulator";
  const budgetProcessHref = selectedCategory && planAllocations
    ? createBudgetProcessHref(planAllocations, selectedCategory.id)
    : selectedCategory
      ? `/budget-process?category=${selectedCategory.id}`
      : "/budget-process";

  return <main
    className="participationPage participationPreparePage"
    data-participation-prepare={selectedCategory?.id ?? "none"}
  >
    <header className="participationPageHeader">
      <Link href={participationHref}>← テーマと窓口を選び直す</Link>
      <p className="eyebrow">PREPARE YOUR MESSAGE</p>
      <h1>あなたの考えを整理する</h1>
      <p>選んだ話題について、問題・東京都にしてほしいこと・理由を整理します。</p>
    </header>

    {selectedCategory && selectedTopic ? <div className="participationPageContent">
      <ParticipationDraftWorkspace
        category={{
          id: selectedCategory.id,
          name: selectedCategory.name,
          color: selectedCategory.color,
        }}
        budgetContext={resolveParticipationBudgetContext(selectedCategory.id, planValue)}
        topic={selectedTopic}
        contacts={OFFICIAL_CONTACTS}
      />
    </div> : <aside className="participationInvalidSelection" role="note">
      <h2>テーマを確認できません</h2>
      <p>意見を整理する前に、予算分野と具体的な話題を選んでください。不明なテーマを特定の所管へ割り当てることはしません。</p>
      <Link href={participationHref}>テーマを選ぶ →</Link>
    </aside>}

    <nav className="participationPageBack" aria-label="関連ページへ移動">
      <Link href={participationHref}>テーマと窓口を選び直す</Link>
      <Link href={simulatorHref}>予算シミュレーターへ戻る</Link>
      <Link href={budgetProcessHref}>予算の決まり方を見る</Link>
    </nav>
  </main>;
}
