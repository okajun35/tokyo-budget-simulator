import Link from "next/link";

import { BUDGET_TERM_GLOSSARY } from "@/domain/tokyo-budget/budget-term-glossary";
import {
  createBudgetParticipationHref,
  createBudgetProcessHref,
  createBudgetResultHref,
  createBudgetSimulatorHref,
  resolveBudgetDetailOrigin,
} from "@/features/simulate-budget/budget-plan-query";
import {
  createBudgetCasesHref,
  createBudgetMaterialsHref,
} from "@/features/understand-budget-change/budget-detail-navigation";
import { BudgetDetailFallbackNotice } from "@/features/understand-budget-change/budget-detail-context";
import {
  money,
  resolveBudgetDetailPageState,
  signedMoney,
  signedPercent,
} from "@/features/understand-budget-change/budget-detail-page-state";
import { findBudgetPolicyContext } from "@/features/understand-budget-change/budget-policy-context";
import {
  BudgetCurrentInitiatives,
  BudgetPublishedPolicyDirection,
} from "@/features/understand-budget-change/budget-policy-context-view";
import { findDetailedBudgetCategory } from "@/features/understand-budget-change/detailed-budget-categories";

type BudgetDetailPageProps = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{
    amount?: string | string[];
    plan?: string | string[];
    category?: string | string[];
    from?: string | string[];
  }>;
};

export default async function BudgetDetailPage({
  params,
  searchParams,
}: BudgetDetailPageProps) {
  const { categoryId } = await params;
  const { amount, plan, from } = await searchParams;
  const state = resolveBudgetDetailPageState(categoryId, amount, plan);

  if (!state) {
    return <main className="budgetDetailPage"><section className="budgetDetailMissing"><h1>分野が見つかりません</h1><p>URLの分野IDを確認してください。</p><Link href="/#simulator">← 予算一覧へ戻る</Link></section></main>;
  }

  const {
    category,
    planAllocations,
    resolvedAmount,
    comparison,
    changeGuidance,
  } = state;
  const categoryTermMeaning =
    BUDGET_TERM_GLOSSARY[category.name as keyof typeof BUDGET_TERM_GLOSSARY]?.meaning;
  const detailedCategory = findDetailedBudgetCategory(category.id);
  const policyContext = findBudgetPolicyContext(category.id);
  const detailOrigin = planAllocations
    ? resolveBudgetDetailOrigin(typeof from === "string" ? from : undefined)
    : undefined;
  const simulatorHref = planAllocations
    ? createBudgetSimulatorHref(planAllocations, category.id)
    : "/#simulator";
  const returnHref = detailOrigin === "budget-result" && planAllocations
    ? createBudgetResultHref(planAllocations, category.id)
    : simulatorHref;
  const returnLabel = detailOrigin === "budget-result"
    ? "← 配分結果に戻る"
    : "← 予算に戻る";
  const participationHref = planAllocations
    ? createBudgetParticipationHref(planAllocations, category.id)
    : `/participation?category=${category.id}`;
  const budgetProcessHref = planAllocations
    ? createBudgetProcessHref(planAllocations, category.id)
    : "/budget-process";
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
  const changeVerb = comparison.direction === "increase"
    ? "増やしました"
    : comparison.direction === "decrease"
      ? "減らしました"
      : "変更していません";

  return <main className="budgetDetailPage" data-budget-detail={category.id} data-change-direction={comparison.direction}>
    <header className="budgetDetailHeader">
      <Link href={returnHref}>{returnLabel}</Link>
      <p className="eyebrow">BUDGET DETAIL · FY2026</p>
      <h1>{category.name}</h1>
      <p>{categoryTermMeaning && <>{category.name}は{categoryTermMeaning}です。</>}選んだ変更が何を意味し、どんな制約があるかを考えます。</p>
    </header>

    <div className="budgetDetailContent">
      <BudgetDetailFallbackNotice amount={amount} usedFallback={resolvedAmount.usedFallback} />

      <section className="budgetDetailOverview" aria-label={`${category.name}の予算比較`}>
        <div className="budgetDetailMetrics">
          <article><span>令和8年度当初予算</span><strong>{money(comparison.baselineAmount100mYen)}</strong></article>
          <article><span>あなたの案</span><strong>{money(comparison.proposedAmount100mYen)}</strong></article>
          <article><span>変更額</span><strong>{signedMoney(comparison.changeAmount100mYen)}</strong></article>
          <article><span>変更率</span><strong>{signedPercent(comparison.changeRatePercent)}</strong></article>
          <article><span>一般会計に占める構成比</span><strong>{comparison.baselineSharePercent.toFixed(1)}% → {comparison.proposedSharePercent.toFixed(1)}%</strong></article>
        </div>
        <p className="budgetChangeSummary">あなたは{category.name}を<strong>{money(Math.abs(comparison.changeAmount100mYen))}</strong>{changeVerb}。これは年間総予算を固定した仮想的な再配分であり、実行可能な正式予算案ではありません。</p>
      </section>

      <section className="budgetDetailSection" aria-labelledby="meaning-heading">
        <p className="sectionLabel">BASIC FACTS</p>
        <h2 id="meaning-heading">そもそも何のお金？</h2>
        <p className="detailLead">{"detailedExplanation" in category ? category.detailedExplanation : category.definition}</p>
        <h3>主な用途</h3>
        <ul className="detailUseList">{category.mainUses.map(use => <li key={use}>{use}</li>)}</ul>
        {detailedCategory && <>
          <details className="detailConceptDisclosure">
            <summary>用語を整理する</summary>
            <dl className="detailConceptList">{detailedCategory.keyConcepts.map(concept => <div key={concept.term}>
              <dt>{concept.term}</dt>
              <dd>{concept.explanation}</dd>
            </div>)}</dl>
          </details>
          <aside className="detailImportantNote"><b>このシミュレーションを読むうえで重要なこと</b><p>{detailedCategory.importantNote}</p></aside>
        </>}
      </section>

      {policyContext && <BudgetCurrentInitiatives context={policyContext} compact />}

      <section className="budgetDetailSection" aria-labelledby="options-heading">
        <p className="sectionLabel">OPTIONS &amp; TRADE-OFFS</p>
        <h2 id="options-heading">{changeGuidance.optionsHeading}</h2>
        <p className="detailLead">{changeGuidance.optionsLead}</p>
        <div className="detailOptionGrid">{changeGuidance.options.map((option, index) => <article key={option.id}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{option.title}</h3>
          <p>{option.description}</p>
        </article>)}</div>
        <h3 className="directionConsiderationsHeading">{changeGuidance.considerationsHeading}</h3>
        <div className="directionConsiderationGrid">{changeGuidance.considerations.map(consideration => <article key={consideration.id}>
          <h4>{consideration.title}</h4>
          <p>{consideration.description}</p>
        </article>)}</div>
      </section>

      <aside className="detailEvidenceBoundary" role="note">
        <b>この画面で確かに言える範囲</b>
        <p>金額と構成比は計算できますが、どの事業を変えるか、何人に影響するか、成果が何％変わるかは公開情報だけでは判断できません。</p>
      </aside>

      <aside className="directionQuestion" data-direction-question={comparison.direction}>
        <b>最後に考えること</b>
        <p>{changeGuidance.finalQuestion}</p>
      </aside>

      {policyContext && <BudgetPublishedPolicyDirection context={policyContext} />}

      <section className="budgetDetailSection budgetDetailNext" aria-labelledby="next-heading">
        <p className="sectionLabel">CHOOSE WHAT TO EXPLORE</p>
        <h2 id="next-heading">この変更を、もう少し考える</h2>
        <p className="detailLead">必要な情報を選んで進めます。すべてを順番に読む必要はありません。</p>
        <div className="budgetDetailNextGrid">
          <article>
            <span>01</span>
            <h3>{comparison.direction === "unchanged" ? "令和8年度の取組を見る" : "実際の事例を見る"}</h3>
            <p>{comparison.direction === "unchanged"
              ? "現在の分野に関連する代表的な取組を、目的別予算の正式な内訳と混同せず確認します。"
              : "他地域で何を変え、どんな制約や負担が確認されたかを公的資料から読みます。"}</p>
            <Link href={casesHref}>{comparison.direction === "unchanged" ? "取組を見る →" : "事例を見る →"}</Link>
          </article>
          <article>
            <span>02</span>
            <h3>東京都の予算編成資料を見る</h3>
            <p>要求・査定（要求された事業や金額を確認・調整すること）・予算案を、目的別と局別などの分類軸を混同せず確認します。</p>
            <Link href={materialsHref}>編成資料を見る →</Link>
          </article>
          <article>
            <span>03</span>
            <h3>具体的な話題と窓口を選ぶ</h3>
            <p>この分野を具体的な話題へ分け、主な所管と確認済みの公式ルートを探します。</p>
            <p className="budgetDetailNextNote">シミュレーションの増減は、あなたの要望として自動的に確定されません。</p>
            <Link href={participationHref}>話題と窓口を選ぶ →</Link>
          </article>
        </div>
      </section>

      <nav className="budgetDetailBack" aria-label="関連ページへ移動">
        <Link href={returnHref}>{returnLabel}</Link>
        <Link href={budgetProcessHref}>東京都の予算が決まる流れを見る →</Link>
      </nav>
    </div>
  </main>;
}
