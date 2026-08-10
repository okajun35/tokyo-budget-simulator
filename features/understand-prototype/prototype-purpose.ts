/**
 * 何のためのサイトかを、利用者が読める言葉で持つ。
 * 実行できないことは `PROTOTYPE_NON_GOALS` に分けて、
 * 期待と実装の差が生まれないようにする。
 */

export type PrototypeExperienceStage = {
  id: string;
  label: string;
  summary: string;
  routeHref: string;
  routeLabel: string;
};

export type PrototypeNonGoal = {
  id: string;
  title: string;
  description: string;
};

export const PROTOTYPE_PURPOSE_STATEMENT =
  "東京都の予算を「見る」だけでなく、自分で動かして、その変更が現実には何を意味するのかまで理解する。";

export const PROTOTYPE_POSITIONING =
  "「自分ならこうする」から始めて、「でも現実にはなぜ簡単ではないのか」を考えるための財政体験ツールです。予算の正解を出すためのシミュレーターではありません。";

export const PROTOTYPE_EXPERIENCE_STAGES: readonly PrototypeExperienceStage[] = [
  {
    id: "see",
    label: "見る",
    summary:
      "令和8年度の成立後当初予算で、東京都が9つの分野へ実際にいくら配分しているかを確かめます。",
    routeHref: "/#simulator",
    routeLabel: "9分野の成立予算を見る",
  },
  {
    id: "move",
    label: "動かす",
    summary:
      "教育を増やす、公債費（都債の返済などに使うお金）を減らす、福祉を増やすというように、年間総額を変えずに自分で配り直します。増やすには、どこかを減らすか、配分可能額として残す必要があります。",
    routeHref: "/#simulator",
    routeLabel: "配分を動かしてみる",
  },
  {
    id: "understand",
    label: "意味を知る",
    summary:
      "「公債費を30%減らす」とは何を減らすことなのか、実際にはどんな変更方法があるのかを、国内外の公的資料で確認できた実例とともに読みます。",
    routeHref: "/budget/debt",
    routeLabel: "公債費を例に読む",
  },
  {
    id: "connect",
    label: "現実につなぐ",
    summary:
      "各局要求、財務局査定（要求された事業や金額を確認・調整すること）、知事査定、都議会審議という流れで予算がどう決まるのかを知り、都民がどこで意見を出せるのかまで確かめます。",
    routeHref: "/budget-process",
    routeLabel: "予算が決まるまでを見る",
  },
];

export const PROTOTYPE_NON_GOALS: readonly PrototypeNonGoal[] = [
  {
    id: "no-correct-answer",
    title: "正しい予算を示すことはしません",
    description:
      "配分に唯一の正解がある前提を取りません。どの分野を優先するかは価値判断であり、このサイトは判断の材料と手順を示すところまでを担います。",
    },
  {
    id: "no-full-rule-model",
    title: "予算編成のすべての規則は再現しません",
    description:
      "実際の編成には法令、国の制度、契約、人員計画、複数年度の見通しが関わります。このサイトは単年度の総額を9分野へ配り直す部分だけを扱います。",
  },
  {
    id: "no-outcome-forecast",
    title: "社会的な成果は予測しません",
    description:
      "配分を変えた結果として何人が改善するか、何%良くなるかは計算しません。公開資料で確認できない数値は表示しないためです。",
  },
  {
    id: "no-opinion-intake",
    title: "意見の受付や送信はしません",
    description:
      "このサイトは意見や個人情報を保存も送信もしません。案内するのは東京都と東京都議会の公式な窓口で、提出しても予算への反映は保証されません。",
  },
] as const;
