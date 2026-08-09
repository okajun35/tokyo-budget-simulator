type BudgetKeyConcept = {
  term: string;
  explanation: string;
};

type BudgetReferenceSource = {
  id: string;
  title: string;
  whatCanBeLearned: string;
  sourceDate: string;
  retrievedAt: string;
  url: string;
};

type DetailedBudgetCategory = {
  categoryId: "debt";
  keyConcepts: readonly BudgetKeyConcept[];
  importantNote: string;
  referenceSources: readonly BudgetReferenceSource[];
};

export const DETAILED_BUDGET_CATEGORIES = [
  {
    categoryId: "debt",
    keyConcepts: [
      {
        term: "都債",
        explanation: "東京都が資金を借り入れるために発行する地方債で、東京都には元金と利子を支払う義務が生じます。",
      },
      {
        term: "元金",
        explanation: "都債を発行して借り入れた金額そのものです。",
      },
      {
        term: "利子",
        explanation: "借入期間に応じて、元金とは別に支払う費用です。",
      },
      {
        term: "償還",
        explanation: "満期など、あらかじめ定めた条件に従って元金を返済することです。",
      },
      {
        term: "借換え",
        explanation: "満期を迎える都債の償還財源を、新たな都債の発行で確保することです。返済時期は移りますが、債務は消えません。",
      },
      {
        term: "新規発行",
        explanation: "新たな事業などの財源を確保するために都債を発行することです。将来の公債費に影響します。",
      },
      {
        term: "基金",
        explanation: "年度間の調整や将来の支出に備えて積み立てる資産です。将来支払う負債である都債とは性質が異なり、使えば基金残高が減ります。",
      },
    ],
    importantNote:
      "この画面の30%減は、総額固定の再配分を考えるための仮想計算です。既に発行した都債の返済義務が消えるわけではなく、実際には償還時期、借換え、別財源などを個別に確認する必要があります。",
    referenceSources: [
      {
        id: "tokyo-bond-faq",
        title: "東京都財務局「債券について」",
        whatCanBeLearned: "都債、元金、利子、償還日と、発行者に支払義務があることを確認できます。",
        sourceDate: "2024-01-23",
        retrievedAt: "2026-08-09",
        url: "https://www.zaimu.metro.tokyo.lg.jp/bond/tosai_faq/tosai_faq02",
      },
      {
        id: "tokyo-financial-report-2023",
        title: "東京都年次財務報告書（令和5年度）",
        whatCanBeLearned: "基金が資産、都債が将来支払う負債であることや、減債基金の役割を確認できます。",
        sourceDate: "2024-09-17",
        retrievedAt: "2026-08-09",
        url: "https://www.zaimu.metro.tokyo.lg.jp/documents/d/zaimu/20240917nenjizaimuhoukokushohonpen",
      },
      {
        id: "tokyo-finance-and-bonds-2026-04",
        title: "東京都の財政状況と都債（令和8年4月）",
        whatCanBeLearned: "都債発行計画に新規債と借換債が含まれ、借換債が発行額に影響することを確認できます。",
        sourceDate: "2026-04",
        retrievedAt: "2026-08-09",
        url: "https://www.zaimu.metro.tokyo.lg.jp/documents/d/zaimu/irreport202604",
      },
    ],
  },
] as const satisfies readonly DetailedBudgetCategory[];

export const findDetailedBudgetCategory = (categoryId: string) =>
  DETAILED_BUDGET_CATEGORIES.find(item => item.categoryId === categoryId);
