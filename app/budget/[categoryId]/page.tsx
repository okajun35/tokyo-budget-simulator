import Link from "next/link";

import {
  BUDGET_DOCUMENT_STAGE_LABELS,
} from "@/domain/tokyo-budget/budget-document-stage";
import { PARTICIPATION_ROUTES } from "@/features/find-participation-route/participation-routes";
import {
  CAUSAL_STRENGTH_LABELS,
} from "@/features/learn-from-budget-cases/budget-case";
import { BUDGET_CASES } from "@/features/learn-from-budget-cases/budget-cases";
import {
  BUDGET_CATEGORIES,
  GENERAL_ACCOUNT_BASELINE_100M_YEN,
} from "@/features/simulate-budget/budget-categories";
import {
  createBudgetDetailComparison,
  resolveBudgetDetailAmount,
} from "@/features/understand-budget-change/budget-detail";
import {
  findDetailedBudgetCategory,
} from "@/features/understand-budget-change/detailed-budget-categories";
import { BUDGET_SOURCES } from "@/features/trace-budget-sources/budget-sources";

type BudgetDetailPageProps = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ amount?: string | string[] }>;
};

const money = (value: number) =>
  `${Math.round(value).toLocaleString("ja-JP")}億円`;
const signedMoney = (value: number) =>
  value === 0
    ? "±0億円"
    : `${value > 0 ? "+" : ""}${money(value)}`;
const signedPercent = (value: number) =>
  value === 0
    ? "±0.0%"
    : `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

const budgetBackgroundSources = {
  request: BUDGET_SOURCES.find(source => source.id === "request")!,
  bureauAssessment: BUDGET_SOURCES.find(source => source.id === "bureau")!,
  governorAssessment: BUDGET_SOURCES.find(source => source.id === "governor")!,
  proposal: BUDGET_SOURCES.find(source => source.id === "proposal")!,
  enactedBudget: BUDGET_SOURCES.find(source => source.id === "enacted")!,
};

export default async function BudgetDetailPage({
  params,
  searchParams,
}: BudgetDetailPageProps) {
  const { categoryId } = await params;
  const { amount } = await searchParams;
  const category = BUDGET_CATEGORIES.find(item => item.id === categoryId);

  if (!category) {
    return <main className="budgetDetailPage"><section className="budgetDetailMissing"><h1>分野が見つかりません</h1><p>URLの分野IDを確認してください。</p><Link href="/#simulator">← 予算一覧へ戻る</Link></section></main>;
  }

  const resolvedAmount = resolveBudgetDetailAmount(
    amount,
    category.baselineAmount100mYen,
  );
  const comparison = createBudgetDetailComparison(
    category.baselineAmount100mYen,
    resolvedAmount.amount100mYen,
    GENERAL_ACCOUNT_BASELINE_100M_YEN,
  );
  const categoryCases = BUDGET_CASES.filter(budgetCase =>
    (category.caseIds as readonly string[]).includes(budgetCase.id),
  );
  const categorySources = BUDGET_SOURCES.filter(source =>
    (category.sourceIds as readonly string[]).includes(source.id),
  );
  const categoryParticipationRoutes = PARTICIPATION_ROUTES.filter(route =>
    (category.participationRouteIds as readonly string[]).includes(route.id),
  );
  const detailedCategory = findDetailedBudgetCategory(category.id);
  const changeVerb = comparison.changeAmount100mYen > 0
    ? "増やしました"
    : comparison.changeAmount100mYen < 0
      ? "減らしました"
      : "変更していません";

  return <main className="budgetDetailPage" data-budget-detail={category.id}>
    <header className="budgetDetailHeader">
      <Link href="/#simulator">← 予算に戻る</Link>
      <p className="eyebrow">BUDGET DETAIL · FY2026</p>
      <h1>{category.name}</h1>
      <p>シミュレーターで選んだ分野と金額を引き継ぎ、変更の意味と根拠を確認します。</p>
    </header>

    <div className="budgetDetailContent">
      {resolvedAmount.usedFallback && <aside className="budgetDetailFallback" role="status">
        {amount === undefined
          ? "設定額が指定されていないため、成立予算額を表示しています。"
          : "指定された金額を利用できないため、成立予算額を表示しています。"}
      </aside>}

      <section className="budgetDetailOverview" aria-label={`${category.name}の予算比較`}>
        <div className="budgetDetailMetrics">
          <article><span>成立予算</span><strong>{money(comparison.baselineAmount100mYen)}</strong></article>
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
          <h3 className="detailSubheading">用語を整理する</h3>
          <dl className="detailConceptList">{detailedCategory.keyConcepts.map(concept => <div key={concept.term}>
            <dt>{concept.term}</dt>
            <dd>{concept.explanation}</dd>
          </div>)}</dl>
          <aside className="detailImportantNote"><b>このシミュレーションを読むうえで重要なこと</b><p>{detailedCategory.importantNote}</p></aside>
        </>}
      </section>

      <section className="budgetDetailSection" aria-labelledby="options-heading">
        <p className="sectionLabel">OPTIONS &amp; TRADE-OFFS</p>
        <h2 id="options-heading">変更方法と検討の論点</h2>
        <p className="detailLead">同じ増減額でも実現方法は一つではありません。以下は確定案ではなく、検討時の選択肢です。</p>
        <div className="detailOptionGrid">{category.changeOptions.map((option, index) => <article key={option.id}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{option.title}</h3>
          <b>検討時のトレードオフ</b>
          <p>{option.description}</p>
          <dl><dt>短期</dt><dd>当年度の支出と、現在提供している事業・サービスへの影響を確認する必要があります。</dd><dt>中長期</dt><dd>変更を継続した場合の成果や負担は、公開情報だけから一意に決められません。</dd></dl>
        </article>)}</div>
      </section>

      <section className="budgetDetailSection" aria-labelledby="evidence-heading">
        <p className="sectionLabel">EVIDENCE BOUNDARY</p>
        <h2 id="evidence-heading">どこまで確かに言える？</h2>
        <div className="evidenceGrid">
          <article data-evidence-kind="fact"><span>事実</span><b>予算計算上、確認できること</b><p>成立予算、あなたの案、変更額、変更率、構成比は画面上の数値から計算できます。</p></article>
          <article data-evidence-kind="case_fact"><span>事例の事実</span><b>他地域で確認されたこと</b><p>下記の公的資料に記録された変更だけを、東京都とは分けて表示します。</p></article>
          <article data-evidence-kind="interpretation"><span>アプリの解釈</span><b>考えられる変更方法</b><p>複数の検討例を示しますが、東京都が採用する案や実行可能性を断定しません。</p></article>
          <article data-evidence-kind="unknown"><span>判断不能</span><b>公開情報だけでは分からないこと</b><p>どの事業を変更するか、何人に影響するか、成果が何％変わるかは計算しません。</p></article>
        </div>
      </section>

      <section className="budgetDetailSection" aria-labelledby="cases-heading">
        <p className="sectionLabel">PUBLIC CASES</p>
        <h2 id="cases-heading">国内外の事例</h2>
        <p className="detailLead">他地域の事例は検討材料であり、東京都で同じ結果が起きるとの予測ではありません。</p>
        {categoryCases.length > 0 ? <div className="detailCaseGrid">{categoryCases.map(budgetCase => <article key={budgetCase.id}>
          <div className="detailCaseHeading"><span>{budgetCase.country === "日本" ? "国内事例" : "海外事例"}</span><h3>{budgetCase.title}</h3></div>
          <dl><dt>実施地域</dt><dd>{budgetCase.jurisdiction}</dd><dt>実施時期</dt><dd>{budgetCase.period}</dd><dt>財政・政策上の背景</dt><dd>{budgetCase.budgetContext}</dd></dl>
          <h4>公的資料で確認された変更</h4>
          <ul>{budgetCase.confirmedChanges.map(change => <li key={change}>{change}</li>)}</ul>
          <p><b>長期成果：</b>{budgetCase.measuredLongTermOutcome ?? "この資料では確認できません。"}</p>
          <p><b>因果の強さ：</b>{CAUSAL_STRENGTH_LABELS[budgetCase.causalStrength]}</p>
          <p className="detailCaution">{budgetCase.caution}</p>
          <a href={budgetCase.sourceUrl} target="_blank" rel="noreferrer">{budgetCase.sourceTitle}（{budgetCase.sourceDate}）↗</a>
        </article>)}</div> : <div className="detailUnavailable" data-evidence-kind="unknown"><b>事例は未収録です</b><p>信頼できる公的事例を確認できるまで、推測例は表示しません。</p></div>}
      </section>

      <section className="budgetDetailSection" aria-labelledby="background-heading">
        <p className="sectionLabel">TOKYO BUDGET BACKGROUND</p>
        <h2 id="background-heading">東京都で現在の金額になった背景</h2>
        <p className="detailLead">目的別予算と局別要求は集計範囲が異なるため、直接の差額比較はしません。資料段階ごとに確認できる内容を分けます。</p>
        <div className="detailTimeline">
          <article><span className="stageTag request">各局要求</span><h3>{category.request?.bureau ?? "代表局との対応は未収録"}</h3>{category.request ? <><p>要求額 {money(category.request.requestedAmount100mYen)}／前年度当初 {money(category.request.previousAmount100mYen)}</p><p>{category.request.reason}</p></> : <p data-evidence-kind="unknown">この分野の代表局要求は確認できていません。</p>}<a href={budgetBackgroundSources.request.sourceUrl} target="_blank" rel="noreferrer">要求額と要求理由が分かる資料 ↗</a></article>
          <article><span className="stageTag bureau_assessment">財務局査定</span><h3>要求内容を財務局が精査</h3><p>{category.bureauAssessment ?? "事項別資料に代表例を対応付けられていません。掲載なしを『査定なし』とは扱いません。"}</p><a href={budgetBackgroundSources.bureauAssessment.sourceUrl} target="_blank" rel="noreferrer">要求から増減した代表事項が分かる資料 ↗</a></article>
          <article><span className="stageTag governor_assessment">知事査定</span><h3>知事判断による変更事項</h3><p>{category.governorAssessment ?? "知事査定の代表事項を対応付けられていません。掲載なしを『判断なし』とは扱いません。"}</p><a href={budgetBackgroundSources.governorAssessment.sourceUrl} target="_blank" rel="noreferrer">知事査定で変更された事項が分かる資料 ↗</a></article>
          <article><span className="stageTag proposal">予算案</span><h3>都議会へ提出した段階</h3><p>知事査定などを反映した案であり、この時点では成立予算ではありません。</p><a href={budgetBackgroundSources.proposal.sourceUrl} target="_blank" rel="noreferrer">提出時の予算案と主要施策が分かる資料 ↗</a></article>
          <article><span className="stageTag enacted_budget">成立予算</span><h3>{money(category.baselineAmount100mYen)}</h3><p>都議会の議決後に成立した当初予算で、本シミュレーターの基準額です。</p><a href={budgetBackgroundSources.enactedBudget.sourceUrl} target="_blank" rel="noreferrer">成立後の一般会計規模と目的別歳出が分かる資料 ↗</a></article>
        </div>
      </section>

      <section className="budgetDetailSection" aria-labelledby="sources-heading">
        <p className="sectionLabel">OFFICIAL SOURCES</p>
        <h2 id="sources-heading">詳しい公式資料</h2>
        <div className="detailSourceList">
          {categorySources.map(source => <article key={source.id}>
            <span className={`stageTag ${source.documentStage}`}>{BUDGET_DOCUMENT_STAGE_LABELS[source.documentStage]}</span>
            <h3>{source.sourceTitle}</h3>
            <p><b>この資料で分かること：</b>{source.targetTableOrItem}</p>
            <p>資料日 {source.sourceDate}／取得日 {source.retrievedAt}</p>
            <a href={source.sourceUrl} target="_blank" rel="noreferrer">公式資料を開く ↗</a>
          </article>)}
          {detailedCategory?.referenceSources.map(source => <article key={source.id}>
            <span className="detailReferenceTag">用語・財政資料</span>
            <h3>{source.title}</h3>
            <p><b>この資料で分かること：</b>{source.whatCanBeLearned}</p>
            <p>資料日 {source.sourceDate}／取得日 {source.retrievedAt}</p>
            <a href={source.url} target="_blank" rel="noreferrer">公式資料を開く ↗</a>
          </article>)}
        </div>
      </section>

      <section className="budgetDetailSection" aria-labelledby="participation-heading">
        <p className="sectionLabel">CIVIC PARTICIPATION</p>
        <h2 id="participation-heading">意見を伝える先</h2>
        <p className="detailLead">以下は主な所管であり、予算分類との一対一対応ではありません。提出しても予算への反映は保証されません。</p>
        <div className="detailBureauLinks">{category.leadBureaus.map(bureau => <a key={bureau.name} href={bureau.url} target="_blank" rel="noreferrer">{bureau.name} ↗</a>)}</div>
        <div className="detailParticipationGrid">{categoryParticipationRoutes.map(route => <article key={route.id}>
          <h3>{route.title}</h3><p><b>提出先：</b>{route.recipient}</p><p><b>できること：</b>{route.canDo}</p><p><b>保証されないこと：</b>{route.cannotGuarantee}</p><a href={route.officialGuideUrl} target="_blank" rel="noreferrer">公式案内を開く ↗</a>
        </article>)}</div>
      </section>

      <nav className="budgetDetailBack" aria-label="関連ページへ移動"><Link href="/#simulator">← 予算に戻る</Link><Link href={`/participation?category=${category.id}`}>この分野の意見先を見る</Link><Link href="/budget-process">予算の決まり方を確認する →</Link></nav>
    </div>
  </main>;
}
