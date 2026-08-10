import Link from "next/link";

import {
  BUDGET_DOCUMENT_STAGE_LABELS,
} from "@/domain/tokyo-budget/budget-document-stage";
import {
  BUDGET_PROCESS_STEPS,
} from "@/features/learn-budget-process/budget-process-steps";
import { BUDGET_SOURCES } from "@/features/trace-budget-sources/budget-sources";

const fiscalYearStatusLabels = {
  completed: "令和8年度・完了",
  in_progress: "令和8年度・進行中",
  not_available_yet: "令和8年度・未確定",
} as const;

const processHeading = (documentStage: string) => {
  if (documentStage === "enacted_budget") {
    return "本会議で議決し、予算成立";
  }
  if (documentStage === "evaluation") {
    return "政策・事業評価と次年度予算";
  }
  return BUDGET_DOCUMENT_STAGE_LABELS[
    documentStage as keyof typeof BUDGET_DOCUMENT_STAGE_LABELS
  ];
};

export default function BudgetProcessPage() {
  return <main className="budgetProcessPage" data-budget-process-page="fy2026">
    <header className="budgetProcessHeader">
      <Link href="/">← トップへ戻る</Link>
      <p className="eyebrow">TOKYO BUDGET PROCESS · FY2026</p>
      <h1>東京都の予算が<br />決まるまで</h1>
      <p>予算は、要望、各局要求、二つの査定（要求された事業や金額を確認・調整すること）、都議会審議を経て成立します。成立後も執行、決算、評価を通じて次年度へつながります。</p>
      <div className="processSeparationNotes" role="note">
        <b>資料の段階を混ぜずに読みます</b>
        <ul>
          <li>外部要望は東京都の確定政策ではありません。</li>
          <li>財務局査定と知事査定は別の段階です。</li>
          <li>予算案は成立予算ではありません。</li>
        </ul>
      </div>
    </header>

    <div className="budgetProcessTimeline">
      {BUDGET_PROCESS_STEPS.map((step, index) => {
        const sources = BUDGET_SOURCES.filter(source =>
          (step.sourceIds as readonly string[]).includes(source.id),
        );

        return <section
          key={step.documentStage}
          className="budgetProcessStage"
          data-budget-process-stage={step.documentStage}
          aria-labelledby={`process-${step.documentStage}`}
        >
          <div className="budgetProcessMarker" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
          <div className="budgetProcessCard">
            <div className="budgetProcessStageHeading">
              <span className={`stageTag ${step.documentStage}`}>{BUDGET_DOCUMENT_STAGE_LABELS[step.documentStage]}</span>
              <span className={`processStatus ${step.fiscalYearStatus}`}>{fiscalYearStatusLabels[step.fiscalYearStatus]}</span>
            </div>
            <h2 id={`process-${step.documentStage}`}>{processHeading(step.documentStage)}</h2>
            <p className="processStageSummary">{step.summary}</p>

            <dl className="budgetProcessFacts">
              <div><dt>誰が行うか</dt><dd>{step.actor}</dd></div>
              <div><dt>何を判断するか</dt><dd>{step.decision}</dd></div>
              <div><dt>金額や事業が変わる可能性</dt><dd>{step.amountChangePossibility}</dd></div>
              <div><dt>都民が関与できるか</dt><dd>{step.publicInvolvement}</dd></div>
              <div><dt>制度上の限界</dt><dd>{step.limitation}</dd></div>
            </dl>

            <div className="budgetProcessSources">
              <h3>令和8年度の公式資料</h3>
              {sources.map(source => <article key={source.id}>
                <div><b>{source.sourceTitle}</b><p>{source.targetTableOrItem}</p></div>
                <a href={source.sourceUrl} target="_blank" rel="noreferrer">公式資料を開く（外部リンク）↗</a>
              </article>)}
            </div>
          </div>
        </section>;
      })}
    </div>

    <nav className="budgetProcessNext" aria-label="次に確認する内容">
      <Link href="/#simulator">予算シミュレーターへ戻る</Link>
      <Link href="/participation">声を届ける制度を見る</Link>
    </nav>
  </main>;
}
