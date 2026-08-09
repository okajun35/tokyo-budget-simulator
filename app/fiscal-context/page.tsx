import Link from "next/link";

import { BUDGET_SOURCES } from "@/features/trace-budget-sources/budget-sources";
import { FISCAL_CONTEXTS } from "@/features/understand-fiscal-context/fiscal-contexts";

const enactedBudgetSource = BUDGET_SOURCES.find(source => source.id === "enacted")!;

export default function FiscalContextPage() {
  return <main className="fiscalContextPage" data-fiscal-context-page="fy2026">
    <header className="fiscalContextHeader">
      <Link href="/#top">← トップへ戻る</Link>
      <p className="eyebrow">FISCAL CONTEXT</p>
      <h1>予算配分を支える<br />3つの仕組み</h1>
      <p>基金・都債・都税は、9分野へ配るお金の量や年度間の余力に関わります。歳出分野とは動かし方も影響も異なるため、ここで関係を整理します。</p>
    </header>

    <aside className="fiscalContextBoundary" aria-labelledby="fiscal-boundary-heading">
      <div><span>シミュレーターの範囲</span><h2 id="fiscal-boundary-heading">「動かせない」は、変えられないという意味ではありません</h2></div>
      <p>実際の予算編成では、基金の積立・取崩し、都債の発行、都税の見込みはいずれも変化します。ただし、このシミュレーターは税制、景気、借入条件、将来年度まで計算せず、成立後の年間総予算を固定して9分野の優先順位を考えるものです。</p>
    </aside>

    <section className="fiscalContextRelationship" aria-labelledby="fiscal-relationship-heading">
      <p className="eyebrow">RELATIONSHIP</p>
      <h2 id="fiscal-relationship-heading">9分野のスライダーとの関係</h2>
      <div className="fiscalContextFlow" aria-label="歳入と財源から年間総予算を経て9分野の歳出配分へ進む関係">
        <div><span>01</span><b>歳入・財源</b><small>都税・都債・基金の取崩しなど</small></div>
        <i aria-hidden="true">→</i>
        <div><span>02</span><b>年間総予算</b><small>このシミュレーターでは固定</small></div>
        <i aria-hidden="true">→</i>
        <div><span>03</span><b>9分野の歳出配分</b><small>スライダーで優先順位を考える</small></div>
      </div>
      <p>3つを操作対象に加えると、単なる配分ではなく、収入見込み、借入、貯蓄の利用まで含む複数年度の財政シミュレーションになります。今回の範囲では、まず「限られた総額をどう配るか」に焦点を絞っています。</p>
    </section>

    <section className="fiscalContextDetails" aria-label="基金・都債・都税の詳細">
      {FISCAL_CONTEXTS.map((context, index) => <article id={context.id} key={context.id} data-fiscal-context-detail={context.id}>
        <header><span>{String(index + 1).padStart(2, "0")} · {context.roleLabel}</span><h2>{context.name}</h2><p>{context.summary}</p></header>
        <div className="fiscalContextDetailGrid">
          <section><h3>令和8年度の数値</h3><strong>{context.amountLabel}</strong><p>{context.amountNote}</p></section>
          <section><h3>どんな仕組みか</h3><p>{context.summary}</p></section>
          <section><h3>増減すると何が起こるか</h3><p>{context.changeEffect}</p></section>
          <section><h3>このシミュレーターで操作しない理由</h3><p>{context.simulatorReason}</p></section>
        </div>
        <a href={enactedBudgetSource.sourceUrl} target="_blank" rel="noreferrer">東京都の公式資料を確認する（外部リンク）↗</a>
      </article>)}
    </section>

    <aside className="fiscalContextCaution" role="note">
      <b>数値を見るときの注意</b>
      <p>表示額は令和8年度当初予算の見込みです。基金は年度末残高、都債は年度中の発行額と年度末残高、都税は年度中の収入見込みであり、同じ種類の数値ではありません。</p>
    </aside>

    <nav className="fiscalContextBack" aria-label="関連ページへ移動">
      <Link href="/#simulator">9分野の予算を動かす</Link>
      <Link href="/sources">出典・データの詳細を見る</Link>
    </nav>
  </main>;
}
