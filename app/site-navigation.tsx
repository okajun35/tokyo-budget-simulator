import Link from "next/link";
import { MobileSiteMenu } from "./mobile-site-menu";

const SITE_MENU = [
  { href: "/#simulator", label: "予算シミュレーター" },
  { href: "/budget-process", label: "予算が決まるまで" },
  { href: "/participation", label: "声を届ける" },
  { href: "/sources", label: "出典・データ" },
  { href: "/about", label: "このサイトについて" },
] as const;

export function SiteHeader() {
  return <header className="topbar">
    <Link className="brand" href="/" aria-label="東京予算ラボ トップ">
      <span className="brandMark">都</span>
      <span>東京予算ラボ<small>令和8年度・一般会計</small></span>
    </Link>
    <nav className="desktopSiteMenu" aria-label="主要メニュー">
      {SITE_MENU.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
    </nav>
    <MobileSiteMenu items={SITE_MENU} />
  </header>;
}

export function SiteFooter() {
  return <footer>
    <div className="brand">
      <span className="brandMark">都</span>
      <span>東京予算ラボ<small>非公式プロトタイプ</small></span>
    </div>
    <p>東京都の公式サービスではありません。シミュレーターの金額は1億円単位の仮想配分です。</p>
    <nav className="footerLinks" aria-label="サイト情報">
      <Link href="/about">このサイトについて</Link>
      <a href="https://odhackathon.metro.tokyo.lg.jp/issues/c10/clusters/" target="_blank" rel="noreferrer">都知事杯ODH テーマ（外部リンク）↗</a>
    </nav>
  </footer>;
}
