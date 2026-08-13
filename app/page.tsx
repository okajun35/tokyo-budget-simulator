"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  BUDGET_PROCESS_SUMMARY_STEPS,
} from "@/features/learn-budget-process/budget-process-steps";
import {
  calculateBudgetAllocationSummary,
  changeBudgetAllocation,
  getBudgetAllocationRange,
  type BudgetAllocations,
} from "@/features/simulate-budget/budget-allocation";
import {
  BUDGET_CATEGORIES,
  GENERAL_ACCOUNT_BASELINE_100M_YEN,
} from "@/features/simulate-budget/budget-categories";
import type { BudgetCategoryId } from "@/features/simulate-budget/budget-category";
import { describeBudgetChange } from "@/features/simulate-budget/budget-change";
import {
  createBudgetDetailHref,
  createBudgetParticipationHref,
  createBudgetProcessHref,
  createBudgetResultHref,
  resolveBudgetPlanState,
} from "@/features/simulate-budget/budget-plan-query";
import { summarizeBudgetResult } from "@/features/simulate-budget/budget-result-summary";
import { createInitialBudgetSimulationState } from "@/features/simulate-budget/budget-simulation-state";
import { FISCAL_CONTEXTS } from "@/features/understand-fiscal-context/fiscal-contexts";

const money = (v: number) => `${Math.round(v).toLocaleString("ja-JP")}億円`;
export default function Home() {
  const searchParams = useSearchParams();
  const restoredState = useMemo(
    () => resolveBudgetPlanState(
      searchParams.get("plan") ?? undefined,
      searchParams.get("category") ?? undefined,
    ),
    [searchParams],
  );
  const [values, setValues] = useState<BudgetAllocations>(() => restoredState.allocations);
  const [selected, setSelected] = useState<BudgetCategoryId>(() => restoredState.selectedCategoryId);
  const allocationSummary = useMemo(
    () => calculateBudgetAllocationSummary(values, GENERAL_ACCOUNT_BASELINE_100M_YEN),
    [values],
  );
  const budgetResult = useMemo(
    () => summarizeBudgetResult(
      BUDGET_CATEGORIES,
      values,
      GENERAL_ACCOUNT_BASELINE_100M_YEN,
    ),
    [values],
  );
  const active = BUDGET_CATEGORIES.find(x => x.id === selected)!;
  const activeChange = describeBudgetChange(
    active.baselineAmount100mYen,
    values[active.id],
  );

  const setValue = (id: BudgetCategoryId, value: number) => {
    const category = BUDGET_CATEGORIES.find(item => item.id === id)!;
    setValues(allocations => changeBudgetAllocation({
      allocations,
      categoryId: id,
      requestedAmount100mYen: value,
      range: getBudgetAllocationRange(category.baselineAmount100mYen),
      annualBudgetAmount100mYen: GENERAL_ACCOUNT_BASELINE_100M_YEN,
    }));
    setSelected(id);
  };
  const reset = () => {
    const initialState = createInitialBudgetSimulationState(BUDGET_CATEGORIES);
    setValues(initialState.allocations);
    setSelected(initialState.selectedCategoryId);
  };
  return <main data-visual-theme="tokyo-blue">
      <section className="hero" id="top">
        <div>
          <aside className="unofficialNotice" role="note">
            <strong>東京都の公式サービスではありません</strong>
            <span>公開資料をもとにした非公式プロトタイプです。</span>
          </aside>
          <p className="eyebrow">BUDGET SIMULATOR · FY2026</p>
          <h1>東京都の予算を動かし、<em>変更の意味を知る。</em></h1>
          <p className="lead">令和8年度の成立後当初予算を基準にした仮想シミュレーションです。数字を変えながら予算が決まる流れを学べます。</p>
          <div className="heroActions"><a href="#simulator" className="primary">予算を動かしてみる <span>↓</span></a><a href="/about" className="textButton">このサイトについて</a></div>
        </div>
        <div className="overviewCards" aria-label="令和8年度予算の概要">
          <article><span className="overviewIcon" aria-hidden="true">暦</span><small>対象年度</small><strong>令和8年度</strong><em>2026年度</em></article>
          <article><span className="overviewIcon" aria-hidden="true">円</span><small>一般会計総額</small><strong>9兆6,530億円</strong><em>成立後当初予算</em></article>
          <article><span className="overviewIcon" aria-hidden="true">税</span><small>主要財源・都税</small><strong>7兆3,856億円</strong><em>令和8年度当初予算</em></article>
        </div>
      </section>

      <section className="simulator" id="simulator">
        <div className="sectionHead"><div><p className="eyebrow">ALLOCATION</p><h2>目的別に配分する</h2><p>先に分野を減額し、生まれた配分可能額を別の分野へ移します。スライダーは基準額の70〜130%、1億円単位です。</p></div></div>
        <aside className="simulationNotice" role="note">
          <strong>これは学習用の仮想配分です</strong>
          <p>操作結果は東京都の正式な予算案ではありません。制度上・財政上の実行可能性を保証するものではありません。</p>
        </aside>
        <div className="budgetBalance" data-state={allocationSummary.status} aria-live="polite">
          <div className="balanceMetrics">
            <div><span>年間総予算</span><strong>{money(allocationSummary.annualBudgetAmount100mYen)}</strong></div>
            <div><span>分野へ配分済み</span><strong>{money(allocationSummary.allocatedAmount100mYen)}</strong></div>
            <div><span>配分可能額</span><strong>{money(allocationSummary.availableAmount100mYen)}</strong></div>
          </div>
          <div className="balanceTrack" aria-hidden="true"><i style={{width: `${allocationSummary.allocatedAmount100mYen / allocationSummary.annualBudgetAmount100mYen * 100}%`}} /></div>
          <p id="allocation-guidance">{allocationSummary.status === "fully-allocated" ? "全額を配分済みです。増やすには先に別の分野を減らしてください" : `${money(allocationSummary.availableAmount100mYen)}を別の分野へ配分できます`}</p>
          <div className="balanceActions">
            <a className="fixedTotalReason" href="/fiscal-context">なぜ増やせない？ →</a>
            <button className="reset" onClick={reset}>↺ 初期値に戻す</button>
          </div>
        </div>

        <div className="simulatorWorkspace">
          <section className="budgetControls" aria-label="9分野の予算操作">
            {BUDGET_CATEGORIES.map(item => {
              const change = describeBudgetChange(
                item.baselineAmount100mYen,
                values[item.id],
              );
              const direction =
                change.direction === "increase"
                  ? "up"
                  : change.direction === "decrease"
                    ? "down"
                    : "unchanged";
              const range = getBudgetAllocationRange(item.baselineAmount100mYen);
              const share = (item.baselineAmount100mYen / GENERAL_ACCOUNT_BASELINE_100M_YEN * 100).toFixed(1);
              return <article key={item.id} data-budget-category={item.id} aria-current={selected === item.id ? "true" : undefined} className={`budgetRow ${selected === item.id ? "selected" : ""}`}>
                <button type="button" data-budget-select-control={item.id} aria-label={`${item.name}を選択`} aria-pressed={selected === item.id} className="budgetRowSelectSurface" onClick={() => setSelected(item.id)} />
                <div className="rowIdentity"><span className="colorDot" style={{background:item.color}}/><span><h3>{item.name}{selected === item.id && <span className="selectionState">選択中</span>}</h3><small>{item.shortDescription}</small><span className="rowShare"><i data-budget-share={item.id} style={{width: `${share}%`, background: item.color}} /><em>全体の{share}%</em></span>{item.adjustmentNote && <small data-adjustment-note={item.id} className="adjustmentNote">{item.adjustmentNote}</small>}</span></div>
                <div className="budgetMetric"><small>令和8年度当初予算</small><b>{money(item.baselineAmount100mYen)}</b></div>
                <div className="sliderCell"><input aria-label={`${item.name}の予算`} aria-describedby="allocation-guidance" type="range" min={range.minimumAmount100mYen} max={range.maximumAmount100mYen} value={values[item.id]} onChange={e => setValue(item.id, Number(e.target.value))} style={{"--accent": item.color} as React.CSSProperties}/></div>
                <div className="budgetMetric"><small>あなたの案</small><b>{money(values[item.id])}</b></div>
                <div className={`changeMetric ${direction}`}><small>変更</small><b>{change.amountLabel}</b><em>{change.rateLabel}</em></div>
                {selected === item.id && <a className="selectedDetailLink" href="#category-context">この変更の意味を見る</a>}
                <a data-mobile-detail-link={item.id} href={createBudgetDetailHref(item.id, values)} className="mobileDetailLink" onClick={event => event.stopPropagation()}>詳しく見る <span>→</span></a>
              </article>
            })}
          </section>

          <aside className="contextPanel" id="category-context" aria-label="選択分野の変更の意味">
            <h2>{active.name}</h2>
            <div className="amountCompare"><span>令和8年度当初予算<b>{money(active.baselineAmount100mYen)}</b></span><span>あなたの案<b>{money(values[active.id])}</b></span><span>変更額<b>{activeChange.amountLabel}</b></span><span>変更率<b>{activeChange.rateLabel}</b></span></div>
            <section className="contextSection categoryMeaning">
              <h3>そもそも何のお金？</h3>
              <p>{active.definition}</p>
              <ul className="mainUseTags">{active.mainUses.map(use => <li key={use}>{use}</li>)}</ul>
            </section>
            <p className="contextCaution">実際の変え方は一つに決まりません。</p>
            <a className="detailLink" href={createBudgetDetailHref(active.id, values)}>詳しく見る <span>変更方法と制約を考える →</span></a>
            <p className="participationContext">
              <a className="participationDetailLink" href={createBudgetParticipationHref(values, active.id)}>この分野の参加制度と所管局を見る →</a>
              <small>提出による予算への反映は保証されません。</small>
            </p>
          </aside>
        </div>
        <section className="budgetResultCta" aria-labelledby="budget-result-cta-heading">
          <div>
            <p className="eyebrow">YOUR ALLOCATION</p>
            <h2 id="budget-result-cta-heading">動かした予算を振り返る</h2>
            <p>{budgetResult.hasChanges
              ? `${budgetResult.increaseCount + budgetResult.decreaseCount}分野の変更を、増やした分野と減らした分野に分けて確認できます。`
              : "まだ予算配分を変更していません。分野を動かすと結果を確認できます。"}</p>
          </div>
          {budgetResult.hasChanges
            ? <a
                className="budgetResultCtaLink"
                data-budget-result-cta="enabled"
                href={createBudgetResultHref(values, active.id)}
              >配分結果を確認する <span>→</span></a>
            : <button className="budgetResultCtaDisabled" data-budget-result-cta="disabled" type="button" disabled>
                配分結果を確認する
              </button>}
        </section>
      </section>

      <section className="process" id="budget-process" aria-label="予算成立までの段階">
        <p>現実の予算は、どうやって決まる？</p>
        <ol className="processFlow">{BUDGET_PROCESS_SUMMARY_STEPS.map((step, i) => <li key={step.id} data-budget-process-summary-stage={step.id}>
          <span aria-hidden="true">{i + 1}</span>
          <b>{step.label}</b>
          <em>{step.plainMeaning}</em>
          <small>{step.summary}</small>
        </li>)}</ol>
        <a className="processDetailLink" href={createBudgetProcessHref(values, active.id)}>全過程と令和8年度の公式資料を見る →</a>
      </section>

      <section className="fiscalFacts">
        <div className="sectionHead"><div><p className="eyebrow">FISCAL CONTEXT</p><h2>動かせない前提も見る</h2><p className="fiscalFactsLead">都税・都債・基金は実際には変化しますが、9分野の歳出とは性質が異なります。このシミュレーターでは年間総予算を固定して配分を考えるため、操作対象にしていません。</p></div></div>
        <div className="factGrid">{FISCAL_CONTEXTS.map(context => <article key={context.id} data-fiscal-context-card={context.id}>
          <div className="factCardHeading"><span>{context.roleLabel}</span><h3>{context.name}</h3></div>
          <strong>{context.amountLabel}</strong>
          <p className="factAmountNote">{context.amountNote}</p>
          <div className="factExplanation"><h4>どんなもの</h4><p>{context.summary}</p><h4>この画面で動かさない理由</h4><p>{context.simulatorReason}</p></div>
          <a href={`/fiscal-context#${context.id}`}>{context.name}を詳しく見る →</a>
        </article>)}</div>
        <p className="csvBadge">✓ 公式CSVを参照し、成立予算概要と照合。取得・正規化・検証手順をリポジトリに保持しています。</p>
      </section>
  </main>;
}
