import { BUDGET_DOCUMENT_STAGE_LABELS } from "../../domain/tokyo-budget/budget-document-stage.ts";
import { BUDGET_TERM_GLOSSARY } from "../../domain/tokyo-budget/budget-term-glossary.ts";
import type { BudgetCategory } from "../simulate-budget/budget-category.ts";
import { BUDGET_SOURCES } from "../trace-budget-sources/budget-sources.ts";
import { detailedMoney, money } from "../understand-budget-change/budget-detail-page-state.ts";
import { findDetailedBudgetCategory } from "../understand-budget-change/detailed-budget-categories.ts";

const budgetBackgroundSources = {
  request: BUDGET_SOURCES.find(source => source.id === "request")!,
  bureauAssessment: BUDGET_SOURCES.find(source => source.id === "bureau")!,
  governorAssessment: BUDGET_SOURCES.find(source => source.id === "governor")!,
  proposal: BUDGET_SOURCES.find(source => source.id === "proposal")!,
  enactedBudget: BUDGET_SOURCES.find(source => source.id === "enacted")!,
};

const budgetMaterialRelationshipLabels = {
  direct: "分野に直接対応する資料",
  related_bureau: "関連する局の予算要求",
  representative_item: "代表的な財務局査定",
} as const;

type CategoryBudgetMaterialsProps = {
  category: BudgetCategory;
};

export function CategoryBudgetMaterials({
  category,
}: CategoryBudgetMaterialsProps) {
  const categorySources = BUDGET_SOURCES.filter(source =>
    category.sourceIds.includes(source.id),
  );
  const detailedCategory = findDetailedBudgetCategory(category.id);

  return <>
    <section className="budgetDetailSection" aria-labelledby="background-heading">
      <p className="sectionLabel">TOKYO BUDGET BACKGROUND</p>
      <h2 id="background-heading">この予算が決まるまでの資料を見る</h2>
      <p className="detailLead">査定（{BUDGET_TERM_GLOSSARY.査定.meaning}）を含む、資料の段階を分けて表示します。</p>
      <p className="detailLead">東京都が公開している予算要求・査定・予算案などから、この分野に関連する資料を紹介します。</p>

      <aside className="budgetMaterialPolicy">
        <b>公開資料で確認できる範囲を掲載しています</b>
        <p>東京都の目的別予算と、局別・款別の予算要求・査定資料では分類方法が異なります。公式資料から対応関係を確認できない場合、東京予算ラボ独自の推測合算は行っていません。</p>
      </aside>

      <div className="budgetClassificationGuide">
        <h3>なぜ要求額と成立予算をそのまま比較できないの？</h3>
        <p>東京都予算には複数の分類方法があります。</p>
        <dl className="budgetClassificationAxes">
          <div><dt>何のために使う？</dt><dd>目的別</dd></div>
          <div><dt>どの局が使う？</dt><dd>局別</dd></div>
          <div><dt>どんな性質の支出？</dt><dd>性質別</dd></div>
          <div><dt>会計上どこに属する？</dt><dd>款・項・目</dd></div>
        </dl>
        <p>東京予算ラボのシミュレーターは主に「目的別」を使っています。一方、予算要求・査定資料は「局別」や「款・項・目」など別の分類で公開されています。</p>
        <p>そのため、一対一に対応しない項目については独自に合算せず、公式資料から安全に確認できる範囲だけを掲載しています。</p>
      </div>

      <div className="detailTimeline">
        <article
          data-budget-material-status={category.request ? "available" : "unavailable"}
          data-budget-material-relationship={category.request?.relationship}
        >
          <span className="stageTag request">各局要求</span>
          <h3>{category.request
            ? budgetMaterialRelationshipLabels[category.request.relationship]
            : "関連する局の予算要求"}</h3>
          {category.request ? <>
            <h4>{category.request.bureau}</h4>
            <dl className="budgetMaterialAmounts">
              <div><dt>要求額</dt><dd>{detailedMoney(category.request.requestedAmount100mYen)}</dd></div>
              <div><dt>{category.request.previousAmountLabel ?? "前年度当初"}</dt><dd>{detailedMoney(category.request.previousAmount100mYen)}</dd></div>
            </dl>
            <p>{category.request.reason}</p>
            <p className="budgetMaterialNote">{category.request.note}</p>
          </> : <p data-evidence-kind="unknown">{category.requestUnavailableReason}</p>}
          <a href={budgetBackgroundSources.request.sourceUrl} target="_blank" rel="noreferrer">要求額と要求理由が分かる資料（外部リンク）↗</a>
        </article>
        <article
          data-budget-material-status={category.bureauAssessment ? "available" : "unavailable"}
          data-budget-material-relationship={category.bureauAssessment?.relationship}
        >
          <span className="stageTag bureau_assessment">財務局査定</span>
          <h3>{budgetMaterialRelationshipLabels.representative_item}</h3>
          {category.bureauAssessment ? <>
            <ul className="assessmentItemList">{category.bureauAssessment.items.map(item => <li key={item.name}>
              <h4>{item.name}</h4>
              <p><span>要求額</span><b>{detailedMoney(item.requestedAmount100mYen)}</b><i>→</i><span>査定後</span><b>{detailedMoney(item.assessedAmount100mYen)}</b></p>
              {item.reason && <small>{item.reason}</small>}
            </li>)}</ul>
            <p className="budgetMaterialNote">{category.bureauAssessment.note}</p>
          </> : <>
            <p data-evidence-kind="unknown">{category.bureauAssessmentUnavailableReason}</p>
            <p data-evidence-kind="unknown">事項別査定資料から、この分野に安全に対応付けられる代表例を現在確認できていません。掲載がないことは「査定が行われなかった」という意味ではありません。</p>
          </>}
          <a href={budgetBackgroundSources.bureauAssessment.sourceUrl} target="_blank" rel="noreferrer">要求から増減した代表事項が分かる資料（外部リンク）↗</a>
        </article>
        <article><span className="stageTag governor_assessment">知事査定</span><h3>知事判断による変更事項</h3><p>{category.governorAssessment ?? "知事査定の代表事項を対応付けられていません。掲載なしを『判断なし』とは扱いません。"}</p><a href={budgetBackgroundSources.governorAssessment.sourceUrl} target="_blank" rel="noreferrer">知事査定で変更された事項が分かる資料（外部リンク）↗</a></article>
        <article><span className="stageTag proposal">予算案</span><h3>都議会へ提出した段階</h3><p>知事査定などを反映した案であり、この時点では成立予算ではありません。</p><a href={budgetBackgroundSources.proposal.sourceUrl} target="_blank" rel="noreferrer">提出時の予算案と主要施策が分かる資料（外部リンク）↗</a></article>
        <article><span className="stageTag enacted_budget">成立予算</span><h3>{money(category.baselineAmount100mYen)}</h3><p>都議会の議決後に成立した当初予算で、本シミュレーターの基準額です。</p><a href={budgetBackgroundSources.enactedBudget.sourceUrl} target="_blank" rel="noreferrer">成立後の一般会計規模と目的別歳出が分かる資料（外部リンク）↗</a></article>
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
          <a href={source.sourceUrl} target="_blank" rel="noreferrer">公式資料を開く（外部リンク）↗</a>
        </article>)}
        {detailedCategory?.referenceSources.map(source => <article key={source.id}>
          <span className="detailReferenceTag">用語・財政資料</span>
          <h3>{source.title}</h3>
          <p><b>この資料で分かること：</b>{source.whatCanBeLearned}</p>
          <p>資料日 {source.sourceDate}／取得日 {source.retrievedAt}</p>
          <a href={source.url} target="_blank" rel="noreferrer">公式資料を開く（外部リンク）↗</a>
        </article>)}
      </div>
    </section>
  </>;
}
