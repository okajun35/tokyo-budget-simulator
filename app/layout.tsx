import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./site-navigation";

export const metadata: Metadata = {
  title: "東京予算ラボ｜令和8年度東京都予算シミュレーター",
  description: "成立後の令和8年度東京都一般会計を、要求・財務局査定・知事査定の背景とともに組み替えて学ぶ非公式プロトタイプ。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: "東京予算ラボ｜予算を動かして、現実の意味を考える",
    description: "令和8年度東京都一般会計当初予算を題材に、9分野の配分とトレードオフを学ぶ非公式プロトタイプ。",
  },
  twitter: {
    card: "summary",
    title: "東京予算ラボ",
    description: "東京都の予算を自分で動かし、その変更が現実には何を意味するか考える非公式プロトタイプ。",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
