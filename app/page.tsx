"use client";

import { useMemo, useState } from "react";

import { PARTICIPATION_ROUTES } from "@/features/find-participation-route/participation-routes";
import {
  BUDGET_PROCESS_SUMMARY_STEPS,
} from "@/features/learn-budget-process/budget-process-steps";
import { CAUSAL_STRENGTH_LABELS } from "@/features/learn-from-budget-cases/budget-case";
import { BUDGET_CASES } from "@/features/learn-from-budget-cases/budget-cases";
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
import { createInitialBudgetSimulationState } from "@/features/simulate-budget/budget-simulation-state";
import { BUDGET_SOURCES } from "@/features/trace-budget-sources/budget-sources";
import { FISCAL_CONTEXTS } from "@/features/understand-fiscal-context/fiscal-contexts";

const money = (v: number) => `${Math.round(v).toLocaleString("ja-JP")}億円`;
const budgetBackgroundSources = {
  request: BUDGET_SOURCES.find(source => source.id === "request")!,
  bureauAssessment: BUDGET_SOURCES.find(source => source.id === "bureau")!,
  governorAssessment: BUDGET_SOURCES.find(source => source.id === "governor")!,
  proposal: BUDGET_SOURCES.find(source => source.id === "proposal")!,
  enactedBudget: BUDGET_SOURCES.find(source => source.id === "enacted")!,
};
export default function Home() {
  const [values, setValues] = useState<BudgetAllocations>(() =>
    createInitialBudgetSimulationState(BUDGET_CATEGORIES).allocations,
  );
  const [selected, setSelected] = useState<BudgetCategoryId>(() =>
    createInitialBudgetSimulationState(BUDGET_CATEGORIES).selectedCategoryId,
  );
  const allocationSummary = useMemo(
    () => calculateBudgetAllocationSummary(values, GENERAL_ACCOUNT_BASELINE_100M_YEN),
    [values],
  );
  const active = BUDGET_CATEGORIES.find(x => x.id === selected)!;
  const activeChange = describeBudgetChange(
    active.baselineAmount100mYen,
    values[active.id],
  );
  const activeCases = BUDGET_CASES.filter(budgetCase =>
    (active.caseIds as readonly string[]).includes(budgetCase.id),
  );
  const contextCases = [
    {
      scope: "domestic",
      label: "国内事例",
      budgetCase: activeCases.find(budgetCase => budgetCase.country === "日本"),
    },
    {
      scope: "international",
      label: "海外事例",
      budgetCase: activeCases.find(budgetCase => budgetCase.country !== "日本"),
    },
  ] as const;
  const activeParticipationRoutes = PARTICIPATION_ROUTES.filter(route =>
    (active.participationRouteIds as readonly string[]).includes(route.id),
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
          <p className="eyebrow">BUDGET SIMULATOR · FY2026</p>
          <h1>東京都の予算を動かし、<em>変更の意味を知る。</em></h1>
          <p className="lead">令和8年度の成立後当初予算を基準にした仮想シミュレーションです。数字を変えながら、要求・査定・議会を経て予算が決まる流れを学べます。</p>
          <div className="heroActions"><a href="#simulator" className="primary">予算を動かしてみる <span>↓</span></a><a href="/sources" className="textButton">データの扱いを見る</a></div>
        </div>
        <div className="overviewCards" aria-label="令和8年度予算の概要">
          <article><span className="overviewIcon" aria-hidden="true">暦</span><small>対象年度</small><strong>令和8年度</strong><em>2026年度</em></article>
          <article><span className="overviewIcon" aria-hidden="true">円</span><small>一般会計総額</small><strong>9兆6,530億円</strong><em>成立後当初予算</em></article>
          <article><span className="overviewIcon" aria-hidden="true">税</span><small>主要財源・都税</small><strong>7兆3,856億円</strong><em>令和8年度当初予算</em></article>
        </div>
      </section>

      <section className="simulator" id="simulator">
        <div className="sectionHead"><div><p className="eyebrow">ALLOCATION</p><h2>目的別に配分する</h2><p>先に分野を減額し、生まれた配分可能額を別の分野へ移します。スライダーは基準額の70〜130%、1億円単位です。</p></div><button className="reset" onClick={reset}>↺ 初期値に戻す</button></div>
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
              return <article key={item.id} data-budget-category={item.id} aria-current={selected === item.id ? "true" : undefined} className={`budgetRow ${selected === item.id ? "selected" : ""}`}>
                <button type="button" data-budget-select-control={item.id} aria-pressed={selected === item.id} className="rowIdentity rowSelect" onClick={() => setSelected(item.id)}><span className="colorDot" style={{background:item.color}}/><span><h3>{item.name}{selected === item.id && <span className="selectionState">選択中</span>}</h3><small>{item.shortDescription}</small></span></button>
                <div className="budgetMetric"><small>成立予算</small><b>{money(item.baselineAmount100mYen)}</b></div>
                <div className="sliderCell"><input aria-label={`${item.name}の予算`} aria-describedby="allocation-guidance" type="range" min={range.minimumAmount100mYen} max={range.maximumAmount100mYen} value={values[item.id]} onChange={e => setValue(item.id, Number(e.target.value))} style={{"--accent": item.color} as React.CSSProperties}/></div>
                <div className="budgetMetric"><small>あなたの案</small><b>{money(values[item.id])}</b></div>
                <div className={`changeMetric ${direction}`}><small>変更</small><b>{change.amountLabel}</b><em>{change.rateLabel}</em></div>
                {selected === item.id && <a className="selectedDetailLink" href="#category-context">この変更の意味を見る</a>}
                <a data-mobile-detail-link={item.id} href={`/budget/${item.id}?amount=${values[item.id]}`} className="mobileDetailLink" onClick={event => event.stopPropagation()}>詳しく見る <span>→</span></a>
              </article>
            })}
          </section>

          <aside className="contextPanel" id="category-context" aria-label="選択分野の変更の意味">
            <p className="panelKicker">いま見ている分野</p><h2>{active.name}</h2>
            <div className="amountCompare"><span>成立予算<b>{money(active.baselineAmount100mYen)}</b></span><span>あなたの案<b>{money(values[active.id])}</b></span><span>変更額<b>{activeChange.amountLabel}</b></span><span>変更率<b>{activeChange.rateLabel}</b></span></div>
            <section className="contextSection categoryMeaning">
              <h3>そもそも何のお金？</h3>
              <p>{active.definition}</p>
              <ul>{active.mainUses.map(use => <li key={use}>{use}</li>)}</ul>
            </section>
            <section className="contextSection">
              <div className="contextSectionHead"><h3>配分を変える方法</h3><span>{active.changeOptions.length}つの検討例</span></div>
              <p className="contextCaution">実際の変更方法を示す検討例であり、実行可能な確定案ではありません。</p>
              <ol className="changeOptionList">{active.changeOptions.map((option, index) => <li key={option.id} data-change-option={option.id}><span>{index + 1}</span><div><b>{option.title}</b><p>{option.description}</p></div></li>)}</ol>
            </section>
            <section className="contextSection">
              <div className="contextSectionHead"><h3>国内外の事例</h3><span>公的資料で確認</span></div>
              <div className="budgetCaseList">{contextCases.map(({scope, label, budgetCase}) => budgetCase ? <details key={scope} data-budget-case-scope={scope}><summary><span>{label}</span><b>{budgetCase.title}</b></summary><div className="budgetCaseBody"><p className="caseMeta">{budgetCase.jurisdiction} · {budgetCase.period}</p><p>{budgetCase.budgetContext}</p><strong>{CAUSAL_STRENGTH_LABELS[budgetCase.causalStrength]}</strong><ul>{budgetCase.confirmedChanges.map(change => <li key={change}>{change}</li>)}</ul><p className="caseCaution">{budgetCase.caution}</p>{scope === "international" && <p className="caseCaution">制度や前提が異なるため、東京都で同じ結果になるとは限りません。</p>}<a href={budgetCase.sourceUrl} target="_blank" rel="noreferrer">公的資料を確認する（外部リンク）↗</a></div></details> : <div className="caseUnavailable" key={scope}><b>{label}</b><p>この分野は信頼できる事例をまだ収録していません。推測例は表示しません。</p></div>)}</div>
            </section>
            <section className="contextSection">
              <div className="contextSectionHead"><h3>東京都で現在の金額になった背景</h3><span>資料段階を分離</span></div>
              <div className="warning">目的別予算と局別要求は集計範囲が異なります。直接の差額比較ではありません。</div>
              <div className="budgetBackgroundTimeline">
                <details className="timelineCard" data-budget-background-stage="request"><summary><span className="stageTag request">各局要求</span><b>{active.request?.bureau ?? "代表局との対応は未収録"}</b></summary><div className="timelineCardBody">{active.request ? <><div className="requestNums"><span>R8要求<b>{money(active.request.requestedAmount100mYen)}</b></span><span>R7当初<b>{money(active.request.previousAmount100mYen)}</b></span></div><p>{active.request.reason}</p></> : <p>代表局の要求総額を対応付けられていないため、推測値は表示しません。</p>}<a href={budgetBackgroundSources.request.sourceUrl} target="_blank" rel="noreferrer">要求資料（外部リンク）↗</a></div></details>
                <details className="timelineCard" data-budget-background-stage="bureau_assessment"><summary><span className="stageTag bureau">財務局査定</span><b>要求内容を財務局が精査</b></summary><div className="timelineCardBody"><p>{active.bureauAssessment ?? "この分野の代表事項は未収録です。事項別一覧に掲載されないことを『査定なし』とは扱いません。"}</p><a href={budgetBackgroundSources.bureauAssessment.sourceUrl} target="_blank" rel="noreferrer">財務局査定資料（外部リンク）↗</a></div></details>
                <details className="timelineCard" data-budget-background-stage="governor_assessment"><summary><span className="stageTag governor">知事査定</span><b>知事判断による変更事項</b></summary><div className="timelineCardBody"><p>{active.governorAssessment ?? "知事査定で変更された事項だけが資料に掲載されます。掲載なしを『判断なし』とは扱いません。"}</p><a href={budgetBackgroundSources.governorAssessment.sourceUrl} target="_blank" rel="noreferrer">知事査定資料（外部リンク）↗</a></div></details>
                <details className="timelineCard" data-budget-background-stage="proposal"><summary><span className="stageTag proposal">予算案</span><b>都議会へ提出した案</b></summary><div className="timelineCardBody"><p>知事査定などを反映して都議会へ提出した段階で、まだ成立予算ではありません。このパネルでは成立額と混ぜて表示しません。</p><a href={budgetBackgroundSources.proposal.sourceUrl} target="_blank" rel="noreferrer">予算案資料（外部リンク）↗</a></div></details>
                <details className="timelineCard" data-budget-background-stage="enacted_budget"><summary><span className="stageTag enacted_budget">成立予算</span><b>{money(active.baselineAmount100mYen)}</b></summary><div className="timelineCardBody"><p>都議会の議決後に成立した当初予算です。本シミュレーターの初期値として使用しています。</p><a href={budgetBackgroundSources.enactedBudget.sourceUrl} target="_blank" rel="noreferrer">成立後の予算概要（外部リンク）↗</a></div></details>
              </div>
            </section>
            <section className="contextSection participationContext">
              <div className="contextSectionHead"><h3>意見を伝える先</h3><span>公式案内へ移動</span></div>
              <p className="bureauMappingNote">目的別予算に関係する主な所管です。組織別予算との一対一対応ではありません。</p>
              <div className="leadBureauLinks">{active.leadBureaus.map(bureau => <a key={bureau.name} href={bureau.url} target="_blank" rel="noreferrer">{bureau.name}（外部リンク）↗</a>)}</div>
              <div className="participationLinks">{activeParticipationRoutes.map(route => <a key={route.id} href={route.officialGuideUrl} target="_blank" rel="noreferrer"><b>{route.title}（外部リンク）</b><span>{route.canDo}</span></a>)}</div>
              <p className="participationCaution">どの制度も、提出による予算への反映は保証されません。</p>
              <a className="participationDetailLink" href={`/participation?category=${active.id}`}>各制度のできること・できないことを見る →</a>
            </section>
            <div className="noForecast" data-evidence-status="unknown" role="note"><span>公開情報だけでは判断できないこと</span><b>効果量と実行方法は計算しません</b><ul><li>あなたの配分で何人改善するか、何％向上するか</li><li>どの事業を変更すれば実行できるか</li><li>予算増減と成果の因果関係</li></ul><p>公式資料で確認できないため、推測値は表示しません。</p><a href="/sources">政策・事業評価の出典を見る →</a></div>
            <a className="detailLink" href={`/budget/${active.id}?amount=${values[active.id]}`}>詳しく見る <span>選択分野とあなたの案を引き継ぐ →</span></a>
          </aside>
        </div>
      </section>

      <section className="process" id="budget-process" aria-label="予算成立までの段階">
        <p>現実の予算は、どうやって決まる？</p>
        <ol className="processFlow">{BUDGET_PROCESS_SUMMARY_STEPS.map((step, i) => <li key={step.id} data-budget-process-summary-stage={step.id}>
          <span aria-hidden="true">{i + 1}</span>
          <b>{step.label}</b>
          <small>{step.summary}</small>
        </li>)}</ol>
        <a className="processDetailLink" href="/budget-process">全過程と令和8年度の公式資料を見る →</a>
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
