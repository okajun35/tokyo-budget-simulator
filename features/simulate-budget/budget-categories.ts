import type { BudgetCategory } from "./budget-category";

export const GENERAL_ACCOUNT_BASELINE_100M_YEN = 96_530;

const COMMON_SOURCE_IDS = ["enacted", "csv"] as const;
const COMMON_PARTICIPATION_ROUTE_IDS = [
  "resident-voice",
  "public-comment",
  "petition",
  "written-request",
] as const;
const BUREAUS = {
  welfare: { name: "福祉局", url: "https://www.fukushi.metro.tokyo.lg.jp/" },
  health: { name: "保健医療局", url: "https://www.hokeniryo.metro.tokyo.lg.jp/" },
  education: { name: "教育庁", url: "https://www.kyoiku.metro.tokyo.lg.jp/" },
  culture: { name: "生活文化局", url: "https://www.seikatubunka.metro.tokyo.lg.jp/" },
  sports: { name: "スポーツ推進本部", url: "https://www.sports-tokyo-info.metro.tokyo.lg.jp/" },
  industry: { name: "産業労働局", url: "https://www.sangyo-rodo.metro.tokyo.lg.jp/" },
  environment: { name: "環境局", url: "https://www.kankyo.metro.tokyo.lg.jp/" },
  urbanDevelopment: { name: "都市整備局", url: "https://www.toshiseibi.metro.tokyo.lg.jp/" },
  housing: { name: "住宅政策本部", url: "https://www.juutakuseisaku.metro.tokyo.lg.jp/" },
  construction: { name: "建設局", url: "https://www.kensetsu.metro.tokyo.lg.jp/" },
  police: { name: "警視庁", url: "https://www.keishicho.metro.tokyo.lg.jp/" },
  fire: { name: "東京消防庁", url: "https://www.tfd.metro.tokyo.lg.jp/" },
  policy: { name: "政策企画局", url: "https://www.seisakukikaku.metro.tokyo.lg.jp/" },
  generalAffairs: { name: "総務局", url: "https://www.soumu.metro.tokyo.lg.jp/" },
  digital: { name: "デジタルサービス局", url: "https://www.digitalservice.metro.tokyo.lg.jp/" },
  finance: { name: "財務局", url: "https://www.zaimu.metro.tokyo.lg.jp/" },
  tax: { name: "主税局", url: "https://www.tax.metro.tokyo.lg.jp/" },
} as const;

export const BUDGET_CATEGORIES = [
  {
    id: "welfare",
    name: "福祉と保健",
    baselineAmount100mYen: 18_730,
    color: "#ef6a45",
    shortDescription: "少子高齢化対策など",
    definition:
      "高齢者、障害者、子ども・子育て世帯への福祉、医療提供体制、保健・健康施策などを支える経費です。",
    mainUses: [
      "高齢者福祉",
      "障害福祉",
      "子育て・児童福祉",
      "医療提供体制",
      "保健・健康施策",
    ],
    changeOptions: [
      {
        id: "welfare-eligibility",
        title: "給付対象や単価を見直す",
        description: "支出は変わりますが、対象者の負担や利用可能性にも影響します。",
      },
      {
        id: "welfare-services",
        title: "施設・相談サービスの時間や人員を見直す",
        description: "運営費は変わりますが、開館日・利用時間や人員配置との両立が必要です。",
      },
      {
        id: "welfare-subsidy",
        title: "補助率や上限額を見直す",
        description: "支出は変わりますが、利用者や事業者の負担にも影響します。",
      },
      {
        id: "welfare-schedule",
        title: "新規事業の規模や時期を見直す",
        description: "当年度負担を調整できますが、予定した支援の開始時期が変わります。",
      },
    ],
    sourceIds: COMMON_SOURCE_IDS,
    caseIds: [
      "case-hanno-welfare-review-2026",
      "case-england-adult-social-care",
    ],
    leadBureaus: [BUREAUS.welfare, BUREAUS.health],
    participationRouteIds: COMMON_PARTICIPATION_ROUTE_IDS,
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
    definition:
      "学校運営、教職員、学校施設、図書館、文化・スポーツ、生涯学習などを支える経費です。",
    mainUses: [
      "学校運営と教職員",
      "学校施設の整備・更新",
      "図書館",
      "文化施設・文化事業",
      "スポーツ・生涯学習",
    ],
    changeOptions: [
      {
        id: "education-facilities",
        title: "学校・施設の統合や更新延期を検討する",
        description: "整備費は変わりますが、利用距離や老朽化対応への影響があります。",
      },
      {
        id: "education-staffing",
        title: "教職員・支援職員の人員体制を見直す",
        description: "人件費は変わりますが、学級運営や個別支援との両立が必要です。",
      },
      {
        id: "education-programs",
        title: "選択科目・行事・助成の規模を見直す",
        description: "支出は変わりますが、学習・文化活動の機会にも影響します。",
      },
      {
        id: "education-hours",
        title: "図書館・文化施設の開館日や時間を見直す",
        description: "運営費は変わりますが、利用できる曜日や時間帯にも影響します。",
      },
    ],
    sourceIds: COMMON_SOURCE_IDS,
    caseIds: [
      "case-hanno-library-2026",
      "case-england-school-financial-pressure",
    ],
    leadBureaus: [BUREAUS.education, BUREAUS.culture, BUREAUS.sports],
    participationRouteIds: COMMON_PARTICIPATION_ROUTE_IDS,
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
    definition:
      "中小企業支援、雇用・就業支援、観光、農林水産業など、都内経済と働く人を支える経費です。",
    detailedExplanation:
      "この分野には、中小企業への融資・経営支援、創業支援、雇用・就業支援、職業能力開発、観光振興、農林水産業の振興などが含まれます。同じ分野の中でも、貸付原資、補助金、相談・訓練、情報発信では支出の性質が異なります。増減を考えるときは、支援対象を絞るのか、補助率や上限額を変えるのか、事業の規模・実施時期を変えるのかを分けて検討する必要があります。分野全体の金額だけでは、どの業種・企業・働く人への施策が変わるかや、雇用・売上への効果を確定できません。景気動向や国の制度、民間投資など他の要因もあるため、成果を予算額だけから予測しない前提で扱います。",
    mainUses: [
      "中小企業の金融・経営支援",
      "雇用・就業支援",
      "観光振興",
      "農林水産業振興",
    ],
    changeOptions: [
      {
        id: "industry-eligibility",
        title: "支援対象を見直す",
        description: "対象の重点化で支出は変わりますが、対象外となる事業者が生じます。",
      },
      {
        id: "industry-subsidy",
        title: "補助率や上限額を見直す",
        description: "予算規模は変わりますが、事業者側の負担も変化します。",
      },
      {
        id: "industry-programs",
        title: "事業の規模や実施時期を見直す",
        description: "当年度支出を調整できますが、支援効果の時期にも影響します。",
      },
    ],
    sourceIds: COMMON_SOURCE_IDS,
    caseIds: [],
    leadBureaus: [BUREAUS.industry],
    participationRouteIds: COMMON_PARTICIPATION_ROUTE_IDS,
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
    definition:
      "脱炭素、エネルギー、資源循環、自然環境、廃棄物対策など、生活環境を守るための経費です。",
    detailedExplanation:
      "この分野には、脱炭素・省エネルギー設備への助成、再生可能エネルギーの導入支援、資源循環、廃棄物対策、自然環境や生物多様性の保全などが含まれます。設備補助、調査・監視、普及啓発、施設運営では、支出の時期と効果が現れるまでの期間が異なります。増減を考えるときは、助成対象や補助率、事業規模、着手時期、委託・運営方法を区別する必要があります。支出を遅らせると当年度負担は変わりますが、設備更新や環境目標の時期にも影響し得ます。分野全体の金額だけから温室効果ガスや廃棄物が何％変わるかは判断できず、国の制度、技術、事業者や都民の行動なども合わせて確認する必要があります。",
    mainUses: [
      "脱炭素・省エネルギー",
      "再生可能エネルギー",
      "資源循環・廃棄物対策",
      "自然環境・生物多様性",
    ],
    changeOptions: [
      {
        id: "environment-subsidy",
        title: "助成対象や補助率を見直す",
        description: "支出は変わりますが、設備導入の負担や普及速度にも影響します。",
      },
      {
        id: "environment-projects",
        title: "事業の規模や時期を見直す",
        description: "当年度負担は変わりますが、環境目標の達成時期にも影響します。",
      },
      {
        id: "environment-operations",
        title: "運営・委託方法を見直す",
        description: "経費を調整できますが、監視や回収などのサービス水準の確認が必要です。",
      },
    ],
    sourceIds: COMMON_SOURCE_IDS,
    caseIds: [],
    leadBureaus: [BUREAUS.environment],
    participationRouteIds: COMMON_PARTICIPATION_ROUTE_IDS,
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
    definition:
      "道路、橋梁、公園、住宅、まちづくりなど、都市基盤を整備・維持するための経費です。",
    detailedExplanation:
      "この分野には、道路・橋梁の整備と維持、公園・緑地、住宅政策、都市計画やまちづくりなどが含まれます。新設、用地取得、更新、点検・補修では事業期間や将来負担が異なり、複数年度にわたる事業もあります。増減を考えるときは、事業の優先順位や完成時期を変えるのか、維持・更新方法を見直すのか、補助対象を変えるのかを分けて検討する必要があります。当年度の整備を延期すれば支出は変わりますが、安全性、老朽化、移動の利便性、将来の修繕費への影響も確認が必要です。分野全体の金額だけでは、特定の道路や地域の事業が変更されるとは決められず、個別計画や契約状況を見なければ実行可能性は判断できません。",
    mainUses: [
      "道路・橋梁の整備と維持",
      "公園・緑地",
      "住宅政策",
      "都市計画・まちづくり",
    ],
    changeOptions: [
      {
        id: "city-priority",
        title: "整備事業の優先順位を見直す",
        description: "当年度の支出は変わりますが、完成時期や地域間の配分にも影響します。",
      },
      {
        id: "city-maintenance",
        title: "更新・維持方法を見直す",
        description: "経費を調整できますが、安全性と将来の修繕費を合わせて考える必要があります。",
      },
      {
        id: "city-subsidy",
        title: "補助事業の対象や規模を見直す",
        description: "支出は変わりますが、住民や事業者の負担にも影響します。",
      },
    ],
    sourceIds: COMMON_SOURCE_IDS,
    caseIds: [],
    leadBureaus: [BUREAUS.urbanDevelopment, BUREAUS.housing, BUREAUS.construction],
    participationRouteIds: COMMON_PARTICIPATION_ROUTE_IDS,
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
    definition:
      "警察活動、消防、救急、防災設備など、都民の安全を守るための経費です。",
    detailedExplanation:
      "この分野には、警察活動、消防・救急、災害対応、庁舎・車両・通信・装備の整備や更新などが含まれます。人員配置、日常の運用、施設維持、装備更新では支出の性質が異なり、緊急時の対応力とも関係します。増減を考えるときは、更新時期を変えるのか、人員や勤務・配備を見直すのか、施策の対象や規模を変えるのかを分けて検討する必要があります。短期的な支出だけでなく、対応時間、安全性、老朽化、災害時の余力への影響も確認が必要です。分野全体の金額だけでは、犯罪・火災・救急需要が何％変わるかや、どの地域の体制が変わるかを判断できません。個別の配置基準や施設計画などを確認せずに成果を断定しない前提で扱います。",
    mainUses: ["警察活動", "消防・救急", "防災設備", "庁舎・車両・装備"],
    changeOptions: [
      {
        id: "safety-equipment",
        title: "装備や施設の更新時期を見直す",
        description: "当年度支出は変わりますが、安全性と老朽化リスクの確認が必要です。",
      },
      {
        id: "safety-staffing",
        title: "人員配置や運用を見直す",
        description: "経費は変わりますが、対応時間や災害対応力への影響があります。",
      },
      {
        id: "safety-programs",
        title: "施策の規模や重点を見直す",
        description: "重点配分はできますが、対象地域や活動範囲との調整が必要です。",
      },
    ],
    sourceIds: COMMON_SOURCE_IDS,
    caseIds: ["case-england-fire-and-rescue"],
    leadBureaus: [BUREAUS.police, BUREAUS.fire],
    participationRouteIds: COMMON_PARTICIPATION_ROUTE_IDS,
  },
  {
    id: "admin",
    name: "企画・総務",
    baselineAmount100mYen: 4_993,
    color: "#76808b",
    shortDescription: "行政運営など",
    definition:
      "政策企画、総務、デジタル化、選挙、庁内運営など、都政全体を支える経費です。",
    detailedExplanation:
      "この分野には、政策企画と部局間調整、庁内の総務・人事・施設管理、行政のデジタル化、選挙・統計など、都政全体を動かすための共通業務が含まれます。住民向けの個別給付とは異なり、複数分野を支える基盤経費や法令上必要な事務も含まれます。増減を考えるときは、庁内業務や委託方法を変えるのか、システム整備の規模・時期を変えるのか、企画事業の優先順位を変えるのかを分ける必要があります。当年度の更新延期で支出は変わっても、情報セキュリティ、業務継続、処理時間、将来の更新費に影響し得ます。分野全体の金額だけでは、どの部署・システム・手続が対象になるかや、行政効率が何％変わるかは判断できません。",
    mainUses: ["政策企画・調整", "庁内運営", "デジタル化", "選挙・統計"],
    changeOptions: [
      {
        id: "admin-operations",
        title: "庁内業務や委託を見直す",
        description: "運営費は変わりますが、処理時間や行政サービスへの影響を確認する必要があります。",
      },
      {
        id: "admin-systems",
        title: "システム整備の規模や時期を見直す",
        description: "当年度支出は変わりますが、更新遅延や将来費用にも影響します。",
      },
      {
        id: "admin-programs",
        title: "企画事業の優先順位を見直す",
        description: "重点化できますが、部門横断施策の実施範囲が変わります。",
      },
    ],
    sourceIds: COMMON_SOURCE_IDS,
    caseIds: [],
    leadBureaus: [BUREAUS.policy, BUREAUS.generalAffairs, BUREAUS.digital],
    participationRouteIds: COMMON_PARTICIPATION_ROUTE_IDS,
  },
  {
    id: "debt",
    name: "公債費",
    baselineAmount100mYen: 2_799,
    color: "#b17860",
    shortDescription: "都債の元利償還など",
    definition:
      "過去に発行した都債の元金返済と利子支払いなど、借入れに伴う義務を履行するための経費です。",
    mainUses: ["都債の元金償還", "都債の利子支払い"],
    changeOptions: [
      {
        id: "debt-refinancing",
        title: "返済時期を組み替え、借換えを検討する",
        description: "当年度負担は変わりますが、借換え後も返済義務そのものは消えません。",
      },
      {
        id: "debt-other-funds",
        title: "基金等の別財源を使う",
        description: "公債費に充てる一般財源は変わりますが、別財源の余力が減ります。",
      },
      {
        id: "debt-new-issuance",
        title: "将来の新規都債発行を抑える",
        description: "将来負担を抑えられる可能性がありますが、現在の事業財源にも影響します。",
      },
      {
        id: "debt-issuance-terms",
        title: "新規発行・借換え時の条件を検討する",
        description: "利率や償還期間は市場環境などに左右され、既に約束した支払条件を一方的に変更できるという意味ではありません。",
      },
    ],
    sourceIds: COMMON_SOURCE_IDS,
    caseIds: [
      "case-yubari-financial-reconstruction",
      "case-puerto-rico-debt-restructuring",
    ],
    leadBureaus: [BUREAUS.finance],
    participationRouteIds: COMMON_PARTICIPATION_ROUTE_IDS,
  },
  {
    id: "linked",
    name: "税連動経費等",
    baselineAmount100mYen: 21_053,
    color: "#98963f",
    shortDescription: "区市町村への交付金など",
    definition:
      "税収等に連動して区市町村などへ配分する交付金や、制度上必要となる経費です。",
    detailedExplanation:
      "この分野には、特別区財政調整交付金、市町村への交付金、地方消費税交付金など、税収や制度上の算定に連動して他の自治体等へ配分する経費が含まれます。一般的な事業費のように、東京都が使途や金額を単独で自由に決められるとは限りません。表示額が変わる要因には、税収見込みの変化、配分制度・算定方法の変更、対象経費の範囲の確認などがあります。増減を考える際は、単なる事業削減として扱わず、法令・条例、自治体間の財政調整、税収との連動関係を確認する必要があります。分野全体の金額だけでは、任意に別分野へ移せる額や、各区市町村への配分影響を判断できません。この画面の増減は制度変更を実行できるとの意味ではなく、予算構造を考える仮想値です。",
    mainUses: [
      "特別区財政調整交付金",
      "市町村への交付金",
      "地方消費税交付金など",
    ],
    changeOptions: [
      {
        id: "linked-revenue",
        title: "連動する税収見込みを見直す",
        description: "見込み額は変わり得ますが、任意に使途だけを削減できる経費ではありません。",
      },
      {
        id: "linked-rules",
        title: "配分制度や算定方法を見直す",
        description: "配分額は変わり得ますが、法令・条例や自治体間調整が必要です。",
      },
      {
        id: "linked-scope",
        title: "対象経費の範囲を確認する",
        description: "一般事業費とは性質が異なるため、制度ごとの変更可能性を分けて判断します。",
      },
    ],
    sourceIds: COMMON_SOURCE_IDS,
    caseIds: [],
    leadBureaus: [BUREAUS.finance, BUREAUS.tax, BUREAUS.generalAffairs],
    participationRouteIds: COMMON_PARTICIPATION_ROUTE_IDS,
  },
] as const satisfies readonly BudgetCategory[];
