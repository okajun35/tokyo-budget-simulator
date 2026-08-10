import Link from "next/link";

import {
  BUDGET_DOCUMENT_STAGE_LABELS,
} from "@/domain/tokyo-budget/budget-document-stage";
import { BUDGET_CATEGORIES } from "@/features/simulate-budget/budget-categories";
import { BUDGET_CASE_SOURCE_KIND_LABELS } from "@/features/learn-from-budget-cases/budget-case";
import { BUDGET_CASES } from "@/features/learn-from-budget-cases/budget-cases";
import { BUDGET_SOURCES } from "@/features/trace-budget-sources/budget-sources";

const sourceTypeLabels = {
  local_government: "地方公共団体",
  open_data_catalog: "東京都オープンデータカタログ",
  local_legislature: "地方議会",
  national_audit_office: "国の監査機関",
  government_inspectorate: "政府の監察・調査機関",
} as const;

export default function SourcesPage() {
  return <main className="sourcesPage" data-sources-page="fy2026">
    <header className="sourcesPageHeader">
      <Link href="/">← トップへ戻る</Link>
      <p className="eyebrow">PROVENANCE · FY2026</p>
      <h1>出典・データ</h1>
      <p>数字の「いつ・どの段階」を消さず、成立予算、予算案、要求、査定、評価、外部要望を別資料として追跡します。</p>
    </header>

    <section className="evidenceReadingGuide" aria-labelledby="evidence-guide-heading">
      <h2 id="evidence-guide-heading">このサイトでの読み分け</h2>
      <div>
        <article data-source-evidence="fact"><span>事実</span><b>東京都等の一次資料</b><p>資料に記載された金額、段階、議決、運用変更を示します。</p></article>
        <article data-source-evidence="case"><span>事例</span><b>他地域の公的資料</b><p>確認された事例を東京都の事実や予測と分けて示します。</p></article>
        <article data-source-evidence="interpretation"><span>解釈</span><b>変更方法の検討例</b><p>アプリが整理した選択肢であり、東京都の確定案ではありません。</p></article>
      </div>
    </section>

    <section className="sourcesPageSection" aria-labelledby="tokyo-sources-heading">
      <p className="eyebrow">TOKYO PRIMARY SOURCES</p>
      <h2 id="tokyo-sources-heading">東京都予算の資料</h2>
      <p className="sourcesSectionLead">外部要望や予算案を、成立予算と混ぜずに表示します。ライセンスが確認中の資料は、再利用前にリンク先の条件確認が必要です。</p>
      <div className="provenanceList">{BUDGET_SOURCES.map(source => <article key={source.id} data-budget-source={source.id}>
        <div className="provenanceHeading">
          <span className={`stageTag ${source.documentStage}`}>{BUDGET_DOCUMENT_STAGE_LABELS[source.documentStage]}</span>
          <h3>{source.sourceTitle}</h3>
          <a href={source.sourceUrl} target="_blank" rel="noreferrer">公式資料を開く（外部リンク）↗</a>
        </div>
        <dl>
          <div><dt>資料日・年度</dt><dd>{source.sourceDate}／令和8年度（{source.fiscalYear}年度）</dd></div>
          <div><dt>取得日</dt><dd>{source.retrievedAt}</dd></div>
          <div><dt>資料段階</dt><dd>{BUDGET_DOCUMENT_STAGE_LABELS[source.documentStage]}（{source.documentStage}）</dd></div>
          <div><dt>出典種別</dt><dd>{sourceTypeLabels[source.sourceType]}</dd></div>
          <div><dt>ライセンス</dt><dd>{source.license}</dd></div>
          <div><dt>対象ページ・項目</dt><dd>{source.targetPage}／{source.targetTableOrItem}</dd></div>
          <div><dt>アプリ内の使用箇所</dt><dd>{source.appUsage.join("／")}</dd></div>
        </dl>
      </article>)}</div>
    </section>

    <section className="sourcesPageSection" aria-labelledby="case-sources-heading">
      <p className="eyebrow">PUBLIC CASE SOURCES</p>
      <h2 id="case-sources-heading">国内外事例の資料</h2>
      <p className="sourcesSectionLead">事例は東京都で同じ結果が起きるとの予測ではありません。資料が直接確認している範囲と注意点を併記します。</p>
      <div className="caseSourceList">{BUDGET_CASES.map(budgetCase => {
        const categories = BUDGET_CATEGORIES.filter(category =>
          (budgetCase.categoryIds as readonly string[]).includes(category.id),
        );

        return <article key={budgetCase.id} data-budget-case-source={budgetCase.id}>
          <div><span>{budgetCase.country === "日本" ? "国内事例" : "海外事例"}</span><h3>{budgetCase.title}</h3><p>{budgetCase.jurisdiction}／{budgetCase.period}</p></div>
          <dl>
            <dt>資料日・取得日</dt><dd>{budgetCase.sourceDate}／{budgetCase.retrievedAt}</dd>
            <dt>出典種別</dt><dd>{BUDGET_CASE_SOURCE_KIND_LABELS[budgetCase.sourceKind]}</dd>
            <dt>ライセンス</dt><dd>リンク先の利用条件を確認</dd>
            <dt>対象ページ・項目</dt><dd>{budgetCase.sourceTitle}／確認された変更内容</dd>
            <dt>アプリ内の使用箇所</dt><dd>{categories.map(category => `${category.name}の詳細`).join("／")}</dd>
          </dl>
          <p className="caseSourceCaution">{budgetCase.whatRemainsUnknown}</p>
          <a href={budgetCase.sourceUrl} target="_blank" rel="noreferrer">公的資料を開く（外部リンク）↗</a>
        </article>;
      })}</div>
    </section>

    <nav className="sourcesPageBack" aria-label="関連ページへ移動">
      <Link href="/#simulator">予算シミュレーターへ戻る</Link>
      <Link href="/budget-process">予算の決まり方を見る</Link>
    </nav>
  </main>;
}
