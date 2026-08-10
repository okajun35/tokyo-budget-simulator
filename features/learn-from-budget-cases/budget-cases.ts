import type { BudgetCase } from "./budget-case";

const RETRIEVED_AT = "2026-08-09";

export const BUDGET_CASES = [
  {
    id: "case-yubari-financial-reconstruction",
    title: "夕張市財政再建計画における行政サービス・組織の見直し",
    categoryIds: ["debt"],
    jurisdiction: "北海道夕張市",
    country: "日本",
    period: "2007年度以降",
    budgetContext:
      "財政再建計画に基づき、赤字と債務を解消するため歳入確保と歳出削減を実施",
    changeTypes: ["service_reduction", "efficiency_reorganization"],
    whatChanged:
      "赤字と債務を解消するため、職員体制、公共施設、学校、事務事業をまとめて見直す計画を定めました。",
    confirmedChanges: [
      "職員数を269人から103人へ削減する計画を明記",
      "公共施設の休止・廃止・統合を計画",
      "小中学校の統合や一部事務事業・補助の廃止縮小を計画",
    ],
    whatRemainsUnknown:
      "計画に記載された措置の事例です。個別サービスの長期成果や、人口減少など他の要因がどれだけ影響したかは、この資料だけでは確定できません。",
    evidenceLevel: 1,
    sourceKind: "local_government",
    sourceUrl: "https://www.city.yubari.lg.jp/uploaded/attachment/2320.pdf",
    sourceTitle: "夕張市財政再建計画書",
    sourceDate: "2007-02-26",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-puerto-rico-debt-restructuring",
    title: "プエルトリコの債務危機と債務再編",
    categoryIds: ["debt"],
    jurisdiction: "プエルトリコ自治連邦区",
    country: "アメリカ合衆国",
    period: "2015年以降",
    budgetContext:
      "長期的な財政赤字と債務利用を背景に債務不履行が始まり、PROMESAに基づく監督と債務再編へ移行",
    changeTypes: ["deferral", "burden_shift"],
    whatChanged:
      "債務不履行を経て、法律に基づく監督のもとで債務そのものを再編しました。",
    confirmedChanges: [
      "2024年8月までに647億ドルの債務を再編",
      "再編直後の債務は282億ドル、2025年3月時点で約241億ドル",
      "電力公社の主要な債務再編は継続中",
    ],
    whatRemainsUnknown:
      "債務残高は再編により減りましたが、電力公社債務などの財政リスクは残っています。米国領の法制度と債務再編制度に基づく事例であり、公債費を減らせば同じ経路をたどるという話ではありません。",
    evidenceLevel: 2,
    sourceKind: "national_audit_office",
    sourceUrl: "https://files.gao.gov/reports/GAO-25-107560/index.html",
    sourceTitle: "U.S. Territories: Public Debt and Economic Outlook—2025 Update",
    sourceDate: "2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-hanno-welfare-review-2026",
    title: "飯能市の在宅・障害・高齢者福祉事業の見直し",
    categoryIds: ["welfare"],
    jurisdiction: "埼玉県飯能市",
    country: "日本",
    period: "2026年度",
    budgetContext: "緊急財政対策に伴う事務事業見直し",
    changeTypes: ["service_reduction", "burden_shift"],
    whatChanged:
      "緊急財政対策として、高齢者・障害者向けの手当、給付、補助、在宅サービスの対象や規模を見直しました。",
    confirmedChanges: [
      "ねたきり老人等手当と老人日常生活用具給付費を廃止",
      "介護保険利用者負担軽減費補助金を休止",
      "緊急通報装置設置事業と老人配食サービス事業を縮小",
    ],
    whatRemainsUnknown:
      "見直しの内容と予算上の効果額は資料で確認できますが、利用者の生活や健康にどう影響したかは確認されていません。",
    evidenceLevel: 1,
    sourceKind: "local_government",
    sourceUrl:
      "https://www.city.hanno.lg.jp/material/files/group/2/jigyouminaoshikentousheetkakuteiban.pdf",
    sourceTitle: "事務事業見直し検討シート（確定版）",
    sourceDate: "2026-02",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-england-adult-social-care",
    title: "イングランドの成人社会福祉支出とサービス提供の変化",
    categoryIds: ["welfare"],
    jurisdiction: "イングランドの地方自治体",
    country: "イギリス",
    period: "2010年度から2012年度",
    budgetContext:
      "需要が増える中、地方自治体の成人社会福祉支出が実質8%減少",
    changeTypes: ["service_reduction", "burden_shift"],
    whatChanged:
      "需要が増える中で支出が実質的に減り、自治体は介護の資格基準、委託単価、提供体制を見直しました。",
    confirmedChanges: [
      "自治体が介護対象となる資格基準を引き上げた",
      "委託契約の変更や介護事業者への支払単価引下げが行われた",
      "家族など非公式介護者が提供する介護時間が増加した",
    ],
    whatRemainsUnknown:
      "家族など非公式介護者の介護時間が増えたことは確認されていますが、支出の減少だけが個々の影響の唯一の原因とは断定できません。医療・福祉制度や自治体の裁量も東京都とは異なります。",
    evidenceLevel: 2,
    sourceKind: "national_audit_office",
    sourceUrl:
      "https://www.nao.org.uk/reports/adult-social-care-england-overview-2/",
    sourceTitle: "Adult social care in England: overview",
    sourceDate: "2014",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-hanno-library-2026",
    title: "飯能市立図書館のサービス見直し",
    categoryIds: ["education"],
    jurisdiction: "埼玉県飯能市",
    country: "日本",
    period: "2026年度",
    budgetContext: "緊急財政対策",
    changeTypes: ["service_reduction", "efficiency_reorganization"],
    whatChanged:
      "緊急財政対策として、開館時間と休館日、分室、移動図書館の提供方法を変更しました。",
    confirmedChanges: [
      "市立図書館とこども図書館の開館時間・休館日を変更",
      "名栗分室と富士見分室を廃止",
      "移動図書館を休止し、行政センターで配本サービスを開始",
    ],
    whatRemainsUnknown:
      "サービスの変更は確認できますが、図書館の利用率や教育成果への長期的な影響は確認されていません。",
    evidenceLevel: 1,
    sourceKind: "local_government",
    sourceUrl:
      "https://www.city.hanno.lg.jp/shiseijoho/yakusho_madoguchiannai/r8kaichojikanhenko/13242.html",
    sourceTitle: "【飯能市図書館】開館時間及び休館日等の変更について",
    sourceDate: "2026-02-26",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-england-school-financial-pressure",
    title: "イングランドの学校が財政圧力へ対応した方法",
    categoryIds: ["education"],
    jurisdiction: "イングランドの初等・中等学校",
    country: "イギリス",
    period: "2017年度から2019年度",
    budgetContext: "学校の費用増加と財政上の圧力",
    changeTypes: ["service_reduction", "burden_shift"],
    whatChanged:
      "費用増加と財政圧力のもとで、学級規模、職員配置、教育課程の幅を学校ごとに調整しました。",
    confirmedChanges: [
      "回答した校長のうち小学校41%、中等学校91%が学級規模の拡大を報告",
      "多くの学校で教員補助員数を削減",
      "一部の学校で教育課程の幅、研修、課外活動を縮小",
    ],
    whatRemainsUnknown:
      "調査対象校の回答と訪問を中心とした研究であり、全国のすべての学校で同じ変化が起きたとは限りません。学習成果への影響も確認されていません。",
    evidenceLevel: 2,
    sourceKind: "government_inspectorate",
    sourceUrl:
      "https://www.gov.uk/government/publications/making-the-cut-how-schools-respond-when-they-are-under-financial-pressure/making-the-cut-how-schools-respond-when-they-are-under-financial-pressure",
    sourceTitle: "Making the cut: how schools respond when they are under financial pressure",
    sourceDate: "2020-02-21",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-england-fire-and-rescue",
    title: "イングランドの消防・救助サービスが資金減少へ対応した方法",
    categoryIds: ["safety"],
    jurisdiction: "イングランドの消防・救助当局",
    country: "イギリス",
    period: "2010年度から2014年度",
    budgetContext: "消防・救助当局への政府資金が大きく減少",
    changeTypes: ["service_reduction", "efficiency_reorganization"],
    whatChanged:
      "人員と予防活動の規模を見直し、一部の出動では派遣する消防士の数を減らしました。",
    confirmedChanges: [
      "常勤消防士が14%減少",
      "事業所の防火監査が30%減少",
      "住宅防火安全チェックの活動時間が27%減少",
      "同期間に主要火災件数が23%、火災死者が22%減少",
    ],
    whatRemainsUnknown:
      "火災件数と死者数も同期間に減っており、会計検査院はこれまでの資金削減に当局が概ね対応できたと評価しています。一方で、さらに削減した場合の大規模事故への対応能力や消防士の安全へのリスクを指摘しています。過去の削減を吸収できたことは、追加の削減余地があることを意味しません。",
    evidenceLevel: 2,
    sourceKind: "national_audit_office",
    sourceUrl:
      "https://www.nao.org.uk/reports/impact-of-funding-reductions-on-fire-and-rescue-services/",
    sourceTitle: "Impact of funding reductions on fire and rescue services",
    sourceDate: "2015-11-12",
    retrievedAt: RETRIEVED_AT,
  },
] as const satisfies readonly BudgetCase[];
