import Link from "next/link";

import { BUDGET_CATEGORIES } from "@/features/simulate-budget/budget-categories";
import {
  ABOUT_DATA_RETRIEVED_AT,
  ABOUT_NOTICES,
} from "@/features/understand-prototype/about-notices";
import {
  PROTOTYPE_EXPERIENCE_STAGES,
  PROTOTYPE_NON_GOALS,
  PROTOTYPE_POSITIONING,
  PROTOTYPE_PURPOSE_STATEMENT,
} from "@/features/understand-prototype/prototype-purpose";

export default function AboutPage() {
  const caseCoverage = BUDGET_CATEGORIES.filter(category => category.caseIds.length > 0);

  return <main className="aboutPage" data-about-page="prototype">
    <header className="aboutPageHeader">
      <Link href="/">← トップへ戻る</Link>
      <p className="eyebrow">ABOUT THIS PROTOTYPE</p>
      <h1>このサイトについて</h1>
      <p>東京予算ラボは、東京都の公式サービスではありません。令和8年度の成立後当初予算を題材に、予算配分と意思決定の流れを学ぶための、学習・情報探索用の非公式プロトタイプです。</p>
    </header>


    <section className="aboutPurpose" aria-labelledby="about-purpose-heading">
      <p className="eyebrow">WHAT THIS IS FOR</p>
      <h2 id="about-purpose-heading">{PROTOTYPE_PURPOSE_STATEMENT}</h2>
      <p className="aboutPositioning">{PROTOTYPE_POSITIONING}</p>
      <ol className="aboutStageList">{PROTOTYPE_EXPERIENCE_STAGES.map((stage, index) => <li key={stage.id} data-prototype-stage={stage.id}>
        <span aria-hidden="true">{index + 1}</span>
        <div>
          <h3>{stage.label}</h3>
          <p>{stage.summary}</p>
          <Link href={stage.routeHref}>{stage.routeLabel} →</Link>
        </div>
      </li>)}</ol>
      <p className="aboutCaseCoverage">
        国内外の公的事例は、公的資料で確認できた分野から順に収録しています。現在は{caseCoverage.length}分野（{caseCoverage.map(category => category.name).join("、")}）に収録済みで、残る分野では推測による事例を表示しません。
      </p>
    </section>

    <section className="aboutPageSection" aria-labelledby="about-non-goals-heading">
      <p className="eyebrow">WHAT THIS IS NOT</p>
      <h2 id="about-non-goals-heading">このサイトがしないこと</h2>
      <div className="aboutNoticeGrid">{PROTOTYPE_NON_GOALS.map((nonGoal, index) => <article key={nonGoal.id} data-prototype-non-goal={nonGoal.id}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <h3>{nonGoal.title}</h3>
        <p>{nonGoal.description}</p>
      </article>)}</div>
    </section>

    <section className="aboutPageSection" aria-labelledby="about-notices-heading">
      <p className="eyebrow">HOW TO READ</p>
      <h2 id="about-notices-heading">数字と事例を読むときの注意</h2>
      <div className="aboutNoticeGrid">{ABOUT_NOTICES.map((notice, index) => <article key={notice.id} data-about-notice={notice.id}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <h3>{notice.title}</h3>
        <p>{notice.description}</p>
      </article>)}</div>
    </section>

    <section className="aboutDataPolicy" aria-labelledby="about-data-heading">
      <div><p className="eyebrow">DATA POLICY</p><h2 id="about-data-heading">データの扱い</h2></div>
      <dl>
        <div><dt>基準</dt><dd>令和8年度（2026年度）の成立後当初予算</dd></div>
        <div><dt>金額単位</dt><dd>1億円</dd></div>
        <div><dt>データ取得日</dt><dd>{ABOUT_DATA_RETRIEVED_AT}</dd></div>
      </dl>
      <p>成立予算、予算案、要求、査定は別の資料段階として扱います。公式CSVの取得・正規化・検証手順を保存し、画面の基準額と照合しています。</p>
      <Link href="/sources">出典・データの詳細を見る →</Link>
    </section>

    <nav className="aboutPageBack" aria-label="関連ページへ移動">
      <Link href="/#simulator">予算シミュレーターを試す</Link>
      <Link href="/budget-process">予算の決まり方を見る</Link>
    </nav>
  </main>;
}
