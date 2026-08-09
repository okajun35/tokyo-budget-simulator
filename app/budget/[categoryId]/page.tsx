import Link from "next/link";

import { BUDGET_CATEGORIES } from "@/features/simulate-budget/budget-categories";

type BudgetDetailPageProps = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ amount?: string | string[] }>;
};

const money = (value: number) =>
  `${Math.round(value).toLocaleString("ja-JP")}億円`;

export default async function BudgetDetailPage({
  params,
  searchParams,
}: BudgetDetailPageProps) {
  const { categoryId } = await params;
  const { amount } = await searchParams;
  const category = BUDGET_CATEGORIES.find(item => item.id === categoryId);

  if (!category) {
    return <main className="budgetDetailPage"><section className="budgetDetailPreview"><h1>分野が見つかりません</h1><Link href="/#simulator">予算一覧へ戻る</Link></section></main>;
  }

  const requestedAmount = typeof amount === "string" ? Number(amount) : Number.NaN;
  const proposedAmount = Number.isFinite(requestedAmount)
    ? requestedAmount
    : category.baselineAmount100mYen;

  return <main className="budgetDetailPage" data-budget-detail={category.id}>
    <header className="budgetDetailHeader">
      <Link href="/#simulator">← 予算一覧へ戻る</Link>
      <h1>{category.name}</h1>
      <p>シミュレーターで選んだ分野と金額を引き継いだ詳細画面です。</p>
    </header>
    <section className="budgetDetailPreview" aria-label={`${category.name}の予算比較`}>
      <div className="budgetDetailMetrics">
        <article><span>成立予算</span><strong>{money(category.baselineAmount100mYen)}</strong></article>
        <article><span>あなたの案</span><strong>{money(proposedAmount)}</strong></article>
      </div>
      <p>基礎説明、変更方法、事例、東京都での背景を、この共通画面へセクション6で展開します。</p>
    </section>
  </main>;
}
