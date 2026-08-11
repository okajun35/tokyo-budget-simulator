import type { ContactKind } from "./participation-topic";

type CommonParticipationLink = {
  label: string;
  url: string;
  kind: ContactKind;
};

export type CommonParticipationOption = {
  id: string;
  title: string;
  description: string;
  availabilityNote?: string;
  links: readonly CommonParticipationLink[];
};

export const COMMON_PARTICIPATION_OPTIONS = [
  {
    id: "resident-voice",
    title: "担当が分からない",
    description: "東京都の都民の声総合窓口で、担当局の案内を確認できます。",
    links: [{
      label: "都民の声総合窓口",
      url: "https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou",
      kind: "general_contact",
    }],
  },
  {
    id: "assembly-opinion",
    title: "議会へ意見を伝えたい",
    description: "都議会への直接の意見・要望と、議員・会派への連絡は別の経路です。",
    links: [
      {
        label: "東京都議会への意見・要望",
        url: "https://www.gikai.metro.tokyo.lg.jp/FormMail/demand/FormMail.html",
        kind: "opinion_form",
      },
      {
        label: "東京都議会議員一覧",
        url: "https://www.gikai.metro.tokyo.lg.jp/member.html",
        kind: "reference",
      },
      {
        label: "会派と連絡先",
        url: "https://www.gikai.metro.tokyo.lg.jp/outline/factional.html",
        kind: "inquiry_directory",
      },
    ],
  },
  {
    id: "assembly-procedure",
    title: "正式な議会手続を使いたい",
    description: "請願には紹介議員が必要です。陳情は紹介議員なしで提出できます。",
    links: [
      {
        label: "請願の手続を確認",
        url: "https://www.gikai.metro.tokyo.lg.jp/petition/guide.html",
        kind: "reference",
      },
      {
        label: "陳情の手続を確認",
        url: "https://www.gikai.metro.tokyo.lg.jp/petition/guide.html",
        kind: "reference",
      },
    ],
  },
  {
    id: "public-comment",
    title: "計画等への意見募集を探す",
    description: "パブリックコメントは、対象となる計画等の募集期間中だけ利用できます。",
    availabilityNote: "選択したテーマが現在募集中であるとは表示していません。公式一覧で確認してください。",
    links: [{
      label: "現在募集されている計画等を見る",
      url: "https://www.soumu.metro.tokyo.lg.jp/01soumu-johokokaika/jyuyokohyo/2",
      kind: "reference",
    }],
  },
] as const satisfies readonly CommonParticipationOption[];
