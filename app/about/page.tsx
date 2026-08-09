import Link from "next/link";

import {
  ABOUT_DATA_RETRIEVED_AT,
  ABOUT_NOTICES,
} from "@/features/understand-prototype/about-notices";

export default function AboutPage() {
  return <main className="aboutPage" data-about-page="prototype">
    <header className="aboutPageHeader">
      <Link href="/">← トップへ戻る</Link>
      <p className="eyebrow">ABOUT THIS PROTOTYPE</p>
      <h1>このサイトについて</h1>
      <p>東京予算ラボは、東京都の公式サービスではありません。令和8年度の成立後当初予算を題材に、予算配分と意思決定の流れを学ぶための、学習・情報探索用の非公式プロトタイプです。</p>
    </header>

    <aside className="aboutStatus" role="note" aria-labelledby="about-status-heading">
      <div><span>サイトの位置づけ</span><h2 id="about-status-heading">調べる・動かす・参加先を知るための入口</h2></div>
      <p>このサイト自身が意見を受け付けたり、東京都へ送信したりするものではありません。判断や手続には、リンク先の最新の公式情報を確認してください。</p>
    </aside>

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
