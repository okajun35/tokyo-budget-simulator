import Link from "next/link";

import {
  BUDGET_CATEGORIES,
  GENERAL_ACCOUNT_BASELINE_100M_YEN,
} from "@/features/simulate-budget/budget-categories";
import type { BudgetAllocations } from "@/features/simulate-budget/budget-allocation";
import {
  createBudgetDetailHref,
  createBudgetSimulatorHref,
  resolveBudgetPlanState,
} from "@/features/simulate-budget/budget-plan-query";
import {
  summarizeBudgetResult,
  type BudgetResultEntry,
} from "@/features/simulate-budget/budget-result-summary";

type BudgetResultPageProps = {
  searchParams: Promise<{
    plan?: string | string[];
    category?: string | string[];
  }>;
};

const money = (value: number) =>
  `${Math.round(value).toLocaleString("ja-JP")}億円`;

function BudgetResultChanges({
  heading,
  entries,
  direction,
  allocations,
}: {
  heading: string;
  entries: BudgetResultEntry[];
  direction: "increase" | "decrease";
  allocations: BudgetAllocations;
}) {
  if (entries.length === 0) return null;

  return <section className="budgetResultChanges" data-result-direction={direction}>
    <h2>{heading}</h2>
    <div className="budgetResultChangeList">{entries.map(entry => <article
      key={entry.category.id}
      data-budget-result-change={entry.category.id}
      data-change-direction={direction}
    >
      <span className="budgetResultDirectionLabel">{direction === "increase" ? "増額" : "減額"}</span>
      <span className="colorDot" style={{ background: entry.category.color }} aria-hidden="true" />
      <h3>{entry.category.name}</h3>
      <p
        className="budgetResultCategoryMeaning"
        data-budget-result-meaning={entry.category.id}
      >{entry.category.definition}</p>
      <dl>
        <div><dt>変更額</dt><dd>{entry.change.amountLabel}</dd></div>
        <div><dt>変更率</dt><dd>{entry.change.rateLabel}</dd></div>
      </dl>
      <details className="budgetResultMeaningDetails">
        <summary>この分野には何が含まれる？</summary>
        <div>
          <h4>この分野に含まれる主な経費</h4>
          <ul>{entry.category.mainUses.map(use => <li key={use}>{use}</li>)}</ul>
          <p data-budget-result-scope-note={entry.category.id}>ここに挙げたものは分野全体の例です。増減分の具体的な使い道は、この操作だけでは決まりません。</p>
        </div>
      </details>
      <Link href={createBudgetDetailHref(entry.category.id, allocations)}>
        この変更について詳しく見る <span>→</span>
      </Link>
    </article>)}</div>
  </section>;
}

export default async function BudgetResultPage({ searchParams }: BudgetResultPageProps) {
  const { plan, category } = await searchParams;
  const planValue = typeof plan === "string" ? plan : undefined;
  const categoryValue = typeof category === "string" ? category : undefined;
  const state = resolveBudgetPlanState(planValue, categoryValue);
  const result = summarizeBudgetResult(
    BUDGET_CATEGORIES,
    state.allocations,
    GENERAL_ACCOUNT_BASELINE_100M_YEN,
  );
  const simulatorHref = createBudgetSimulatorHref(
    state.allocations,
    state.selectedCategoryId,
  );
  const queryStatus = planValue && !state.restoredFromQuery ? "fallback" : "valid";

  return <main
    className="budgetResultPage"
    data-budget-result-state={result.hasChanges ? "changed" : "unchanged"}
    data-budget-result-query={queryStatus}
  >
    <header className="budgetResultHeader">
      <Link href={simulatorHref}>← 配分を調整し直す</Link>
      <p className="eyebrow">ALLOCATION RESULT · FY2026</p>
      <h1>あなたの配分結果</h1>
      <p>令和8年度当初予算から、どの分野をいくら動かしたかを振り返ります。</p>
    </header>

    {queryStatus === "fallback" && <aside className="budgetResultFallback" role="status">
      URLの予算配分を復元できなかったため、令和8年度当初予算を表示しています。
    </aside>}

    {!result.hasChanges ? <section className="budgetResultEmpty">
      <h2>まだ予算配分を変更していません</h2>
      <p>9分野のいずれかを動かすと、増やした分野と減らした分野をここで確認できます。</p>
      <Link href={simulatorHref}>予算を動かしてみる →</Link>
    </section> : <>
      <section className="budgetResultOverview" aria-labelledby="budget-result-overview-heading">
        <p className="sectionLabel">SUMMARY</p>
        <h2 id="budget-result-overview-heading">今回動かした予算</h2>
        {result.reallocatedAmount100mYen > 0
          ? <p className="budgetResultLead">あなたは<strong>{money(result.reallocatedAmount100mYen)}</strong>を分野間で配分し直しました。</p>
          : <p className="budgetResultLead">あなたは<strong>{money(result.decreasedAmount100mYen)}</strong>を分野から減らしました。</p>}
        {result.availableAmount100mYen > 0 && <p
          className="budgetResultAvailable"
          data-result-allocation-status="available"
        ><strong>{money(result.availableAmount100mYen)}</strong>はまだ配分していません。配分を調整し直すことも、この状態を結果として確認することもできます。</p>}
        <dl className="budgetResultCounts">
          <div><dt>増やした分野</dt><dd>{result.increaseCount}分野</dd></div>
          <div><dt>減らした分野</dt><dd>{result.decreaseCount}分野</dd></div>
          <div><dt>変更していない分野</dt><dd>{result.unchangedCount}分野</dd></div>
        </dl>
      </section>

      <BudgetResultChanges
        heading="増やした分野"
        entries={result.increases}
        direction="increase"
        allocations={state.allocations}
      />
      <BudgetResultChanges
        heading="減らした分野"
        entries={result.decreases}
        direction="decrease"
        allocations={state.allocations}
      />

      <aside className="budgetResultBoundary" role="note">
        <strong>この結果から分かること</strong>
        <p>確認できるのは分野ごとの金額と変更率です。どの事業やサービス、政策効果が変わるかは、この金額だけでは決まりません。これは学習用の仮想配分であり、東京都の正式な予算案ではありません。</p>
      </aside>

      <nav className="budgetResultNext" aria-label="配分結果の次の行動">
        <div>
          <h2>ここで終了してもかまいません</h2>
          <p>気になる変更があれば、各分野の意味や制約を詳しく確認できます。</p>
        </div>
        <Link href={simulatorHref}>← 配分を調整し直す</Link>
      </nav>
    </>}
  </main>;
}
