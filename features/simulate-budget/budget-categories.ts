import type { BudgetCategory } from "./budget-category";

export const GENERAL_ACCOUNT_BASELINE_100M_YEN = 96_530;

export const BUDGET_CATEGORIES = [
  {
    id: "welfare",
    name: "福祉と保健",
    baselineAmount100mYen: 18_730,
    color: "#ef6a45",
    shortDescription: "少子高齢化対策など",
    request: {
      bureau: "福祉局＋保健医療局",
      requestedAmount100mYen: 18_352.6,
      previousAmount100mYen: 17_564.8,
      reason:
        "福祉局は事業費増、保健医療局は医療提供体制等を中心に要求。目的別予算とは集計範囲が一致しません。",
    },
    bureauAssessment:
      "例：シルバーパスは要求286.04億円→査定274.10億円（経費精査等）。後期高齢者医療は1,735.43億円→1,707.17億円（要求額の調整）。",
    governorAssessment:
      "例：民生・児童委員活動等は13.91億円→42.31億円、女性のがん検診受診応援事業は新規16.17億円。",
  },
  {
    id: "education",
    name: "教育と文化",
    baselineAmount100mYen: 15_922,
    color: "#5f7fce",
    shortDescription: "学校教育の充実など",
    request: {
      bureau: "教育庁（代表）",
      requestedAmount100mYen: 11_145.8,
      previousAmount100mYen: 10_478,
      reason:
        "給与関係費と事業費の増を要求。文化・私学等は別局を含むため目的別総額とは一致しません。",
    },
    bureauAssessment:
      "例：学校給食運営管理は357.19億円→546.87億円、子供の学力に対する懸念の解消は141.87億円→137.40億円。",
    governorAssessment:
      "例：公立学校給食費負担軽減は477.08億円→477.66億円、給付型奨学金は13.30億円→22.09億円。",
  },
  {
    id: "industry",
    name: "労働と経済",
    baselineAmount100mYen: 7_822,
    color: "#dfaa3a",
    shortDescription: "産業の活性化など",
    bureauAssessment:
      "例：金融支援は3,415.76億円→3,394.00億円、創業支援は150.08億円→145.73億円。",
    governorAssessment: "知事査定の事業別資料で変更事項を確認できます。",
  },
  {
    id: "environment",
    name: "生活環境",
    baselineAmount100mYen: 4_813,
    color: "#50a47b",
    shortDescription: "廃棄物対策など",
    request: {
      bureau: "環境局（代表）",
      requestedAmount100mYen: 2_635,
      previousAmount100mYen: 2_177,
      reason:
        "脱炭素、資源循環、生物多様性、都市環境を柱に前年度比21.1%増を要求。目的別総額とは集計範囲が一致しません。",
    },
    bureauAssessment:
      "再生可能エネルギーの推進は411.40億円→317.40億円（経費精査等）。環境エネルギー政策は1,391.84億円→1,684.88億円。",
    governorAssessment:
      "浮体式洋上風力発電導入推進事業は11.11億円→27.42億円（要求額の調整）。",
  },
  {
    id: "city",
    name: "都市の整備",
    baselineAmount100mYen: 9_823,
    color: "#45a4b7",
    shortDescription: "道路の整備など",
    bureauAssessment:
      "例：道路整備は267.31億円→265.33億円、公園整備は367.02億円→344.33億円。",
    governorAssessment: "空き家等みどり転用支援事業は0.90億円→4.00億円。",
  },
  {
    id: "safety",
    name: "警察と消防",
    baselineAmount100mYen: 10_575,
    color: "#965eab",
    shortDescription: "警察・消防活動など",
  },
  {
    id: "admin",
    name: "企画・総務",
    baselineAmount100mYen: 4_993,
    color: "#76808b",
    shortDescription: "行政運営など",
  },
  {
    id: "debt",
    name: "公債費",
    baselineAmount100mYen: 2_799,
    color: "#b17860",
    shortDescription: "都債の元利償還など",
  },
  {
    id: "linked",
    name: "税連動経費等",
    baselineAmount100mYen: 21_053,
    color: "#98963f",
    shortDescription: "区市町村への交付金など",
  },
] as const satisfies readonly BudgetCategory[];
