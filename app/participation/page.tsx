import Link from "next/link";

import { PARTICIPATION_ROUTES } from "@/features/find-participation-route/participation-routes";
import { BUDGET_CATEGORIES } from "@/features/simulate-budget/budget-categories";

type ParticipationPageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

export default async function ParticipationPage({
  searchParams,
}: ParticipationPageProps) {
  const { category } = await searchParams;
  const selectedCategory = typeof category === "string"
    ? BUDGET_CATEGORIES.find(item => item.id === category)
    : undefined;

  return <main
    className="participationPage"
    data-participation-page={selectedCategory?.id ?? "none"}
  >
    <header className="participationPageHeader">
      <Link href="/">← トップへ戻る</Link>
      <p className="eyebrow">CIVIC PARTICIPATION · TOKYO</p>
      <h1>声を届ける</h1>
      <p>シミュレーションで感じた関心を、現実の制度へつなぎます。制度ごとに提出先や扱われ方が異なり、提出しても予算への反映は保証されません。</p>
    </header>

    {selectedCategory ? <aside className="selectedParticipationCategory">
      <span>選択中の分野</span>
      <h2>{selectedCategory.name}</h2>
      <p>目的別予算と組織別予算は一対一対応ではありません。以下を主な所管として案内します。</p>
      <div>{selectedCategory.leadBureaus.map(bureau => <a key={bureau.name} href={bureau.url} target="_blank" rel="noreferrer">{bureau.name}（外部リンク）↗</a>)}</div>
    </aside> : <aside className="selectedParticipationCategory empty">
      <span>分野指定なし</span>
      <p>予算シミュレーターで分野を選ぶと、主な所管局を引き継いで表示します。</p>
      <Link href="/#simulator">予算シミュレーターで分野を選ぶ →</Link>
    </aside>}

    <section className="participationPageContent" aria-labelledby="routes-heading">
      <div className="participationPageIntro">
        <div><p className="eyebrow">OFFICIAL ROUTES</p><h2 id="routes-heading">制度を選ぶ</h2></div>
        <aside role="note"><b>このサイトからは送信しません</b><p>このサイトは意見や個人情報を保存・送信しません。各制度の公式案内を確認して、東京都または東京都議会の窓口を利用してください。</p></aside>
      </div>
      <div className="participationGrid">{PARTICIPATION_ROUTES.map((route, index) => <article key={route.id} data-participation-route={route.id}>
        <div className="participationTitle"><span>{String(index + 1).padStart(2, "0")}</span><h3>{route.title}</h3></div>
        <dl><dt>提出先</dt><dd>{route.recipient}</dd><dt>対象</dt><dd>{route.target}</dd><dt>必要な手続</dt><dd>{route.procedure}</dd><dt>処理の流れ</dt><dd>{route.flow}</dd><dt>できること</dt><dd>{route.canDo}</dd><dt>できないこと</dt><dd>{route.cannotGuarantee}</dd></dl>
        <div className="guarantee">予算への反映は保証されません</div>
        <div className="participationOfficialLinks">
          <a href={route.officialGuideUrl} target="_blank" rel="noreferrer">公式案内を開く（外部リンク）↗</a>
          {"relatedOfficialGuide" in route && <a href={route.relatedOfficialGuide.url} target="_blank" rel="noreferrer">{route.relatedOfficialGuide.label}（外部リンク）↗</a>}
        </div>
      </article>)}</div>
    </section>

    <nav className="participationPageBack" aria-label="関連ページへ移動">
      <Link href="/#simulator">予算シミュレーターへ戻る</Link>
      <Link href="/budget-process">予算の決まり方を見る</Link>
    </nav>
  </main>;
}
