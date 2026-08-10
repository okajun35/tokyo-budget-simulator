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
  {
    id: "case-yubari-consolidated-facility",
    title: "夕張市が公共施設の機能を複合施設へ集約",
    categoryIds: ["city"],
    jurisdiction: "北海道夕張市",
    country: "日本",
    period: "2007年度以降",
    budgetContext:
      "財政破綻後に休止・廃止した施設機能を、個別施設として再建することが財政的に難しかった",
    changeTypes: ["efficiency_reorganization"],
    whatChanged:
      "子育て、図書、公民館、行政などの機能を、一つの複合施設へまとめました。",
    confirmedChanges: [
      "複数の公共施設機能を複合施設「りすた」へ集約",
      "個別施設としての再建は行わず、機能を残す方法を選択",
    ],
    whatRemainsUnknown:
      "施設予算を抑える方法には、閉鎖や更新の見送りだけでなく、統合して機能を残すという選択肢があることを示す事例です。一方で、利用者の移動距離や地域ごとのアクセスにどのような変化が生じたかは、この資料では確認できません。人口減少の影響も切り分けられていません。",
    evidenceLevel: 4,
    sourceKind: "local_government",
    sourceUrl: "https://www.city.yubari.lg.jp/site/risuta/1339.html",
    sourceTitle: "夕張市拠点複合施設りすた",
    sourceDate: "2026-08",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-england-local-roads",
    title: "イングランドの地方道路の状態と維持管理",
    categoryIds: ["city"],
    jurisdiction: "イングランドの地方道路管理者",
    country: "イギリス",
    period: "2024年",
    budgetContext: "地方道路の維持管理をめぐる資源配分と資産管理の課題",
    changeTypes: ["deferral"],
    whatChanged:
      "必要な修繕を先送りした結果として、良好な状態へ戻すための積み残しが積み上がっています。",
    confirmedChanges: [
      "道路の状態が悪化していると会計検査院が報告",
      "良好な状態へ回復させるための積み残し（backlog）が拡大",
    ],
    whatRemainsUnknown:
      "道路の劣化を予算削減だけの結果と断定する資料ではありません。財源配分、データ不足、資産管理、維持方法など複数の要因が指摘されています。この事例は、今年度の支出を抑えることと、施設や道路を使い続ける全期間の費用を抑えることが一致しない場合があることを示します。",
    evidenceLevel: 2,
    sourceKind: "national_audit_office",
    sourceUrl:
      "https://www.nao.org.uk/reports/the-condition-and-maintenance-of-local-roads-in-england/",
    sourceTitle: "The condition and maintenance of local roads in England",
    sourceDate: "2024-06-28",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-hanno-mountain-water-subsidy",
    title: "飯能市が山間地域の給水施設補助を縮小",
    categoryIds: ["environment"],
    jurisdiction: "埼玉県飯能市",
    country: "日本",
    period: "2026年度",
    budgetContext: "緊急財政対策に伴う事務事業見直し",
    changeTypes: ["burden_shift"],
    whatChanged:
      "補助率と上限額を下げ、一部の補助は廃止して、行政が負担していた費用の一部を利用者側へ移しました。",
    confirmedChanges: [
      "給水施設の新設・改修補助を8割・上限130万円から7割・上限100万円へ",
      "水源の維持管理補助（5割）を廃止",
      "水質検査の全額補助を7割補助へ",
    ],
    whatRemainsUnknown:
      "サービスがなくなったのではなく、行政が負担していた費用の一部が利用者側へ移った事例です。移った負担が住民の生活や施設の維持にどう影響したかは、この資料では確認できません。",
    evidenceLevel: 1,
    sourceKind: "local_government",
    sourceUrl:
      "https://www.city.hanno.lg.jp/kurashi_seikatsukankyo/josuido/sankanchiikikyusui_yuhazamadam/4731.html",
    sourceTitle: "山間地域給水施設等補助金",
    sourceDate: "2026-02",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-hanno-tourism-facilities",
    title: "飯能市が一部の観光施設を休止",
    categoryIds: ["industry"],
    jurisdiction: "埼玉県飯能市",
    country: "日本",
    period: "2026年度",
    budgetContext: "緊急財政対策に伴う事務事業見直し",
    changeTypes: ["service_reduction", "efficiency_reorganization"],
    whatChanged:
      "一律に閉鎖せず、利用需要、老朽度、近隣の代替施設の有無を精査して休止する施設を選びました。",
    confirmedChanges: [
      "一部の観光公衆トイレなどを休止",
      "利用需要、老朽度、近隣代替施設の有無を精査して対象を決定",
      "観光客が利用する環境全体を維持するため、一律閉鎖は避けた",
    ],
    whatRemainsUnknown:
      "単純な観光費の削減ではなく、限られた予算の中で対象を選び直した事例です。休止した施設の周辺で観光客の利便性がどう変わったかは、この資料では確認できません。",
    evidenceLevel: 1,
    sourceKind: "local_government",
    sourceUrl:
      "https://www.city.hanno.lg.jp/soshikikarasagasu/kankyokeizaibu/kanko/13090.html",
    sourceTitle: "観光施設の休止について",
    sourceDate: "2026-02",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-england-colleges",
    title: "イングランドの継続教育カレッジの財政持続性",
    categoryIds: ["industry"],
    jurisdiction: "イングランドの継続教育カレッジ",
    country: "イギリス",
    period: "2013年度から2018年度",
    budgetContext: "カレッジの財政悪化を受けた政府による地域単位の見直し",
    changeTypes: ["efficiency_reorganization", "service_reduction"],
    whatChanged:
      "地域単位の見直しでカレッジを合併し、財政の安定化を図る一方で、提供する科目や支援の範囲を狭めました。",
    confirmedChanges: [
      "地域単位の見直しにより57のカレッジ合併を実施",
      "会計検査院は財政安定化に一定の効果があったと評価",
      "財政制約によりカリキュラムの幅、キャリア相談、メンタルヘルス支援が縮小",
      "成人教育・支援サービス資金が実質35%減少",
    ],
    whatRemainsUnknown:
      "統合が成功で削減が失敗という単純な話ではありません。組織を再編して財政を改善しながら、提供するサービスの一部が狭くなることもある複合的な事例です。学習者の進路や技能形成への影響は確認されていません。",
    evidenceLevel: 2,
    sourceKind: "national_audit_office",
    sourceUrl:
      "https://www.nao.org.uk/reports/financial-sustainability-of-colleges-in-england/",
    sourceTitle: "Financial sustainability of colleges in England",
    sourceDate: "2020-09-16",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-england-hmrc-customer-service",
    title: "英国税務当局が電話窓口を減らして起きたこと",
    categoryIds: ["admin"],
    jurisdiction: "英国歳入関税庁（HMRC）",
    country: "イギリス",
    period: "2019年度から2023年度",
    budgetContext: "デジタル化により顧客接点を減らし、サービス提供費用を削減する方針",
    changeTypes: ["efficiency_reorganization", "service_reduction", "burden_shift"],
    whatChanged:
      "利用者をデジタル手続きへ誘導し、電話窓口の一部を閉鎖しました。",
    confirmedChanges: [
      "電話の需要に対応できない状態が確認された",
      "文書処理に遅れが生じた",
      "電話窓口を一部閉鎖し、利用者をデジタルへ誘導",
      "会計検査院は、新しいデジタルサービスの効果が十分に出る前に人員とサービスを減らした進め方を過度に急だと評価",
    ],
    whatRemainsUnknown:
      "管理部門だから減らしても住民サービスに影響しないとは限らないことを示す事例です。効率化による削減は、代わりの手段が実際に機能することを確かめてから行う必要があります。デジタル化そのものの長期的な効果は確認されていません。",
    evidenceLevel: 2,
    sourceKind: "national_audit_office",
    sourceUrl: "https://www.nao.org.uk/reports/hmrc-customer-service/",
    sourceTitle: "HMRC customer service",
    sourceDate: "2024-05-15",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-japan-fire-service-consolidation",
    title: "消防庁が示す消防の広域化による効率化",
    categoryIds: ["safety"],
    jurisdiction: "日本の市町村消防本部",
    country: "日本",
    period: "令和6年版消防白書時点",
    budgetContext:
      "人口減少のもとで、小規模な消防本部の人材と装備の確保、大規模災害への対応力確保が課題",
    changeTypes: ["efficiency_reorganization"],
    whatChanged:
      "複数市町村の消防事務を共同処理・委託して消防本部を広域化し、総務部門と通信指令部門を効率化して人員を消火・救急部門へ再配置します。",
    confirmedChanges: [
      "総務部門と通信指令部門の効率化により、人員を消火・救急部門へ再配置できると説明",
      "施設・設備の整備経費の削減効果を挙げている",
      "現場体制、初動体制、専門職配置、大規模災害対応の充実を目的としている",
    ],
    whatRemainsUnknown:
      "消防費を減らして成功した特定自治体の独立した評価ではなく、消防庁が広域化制度の一般的な効果を説明している資料です。効率化の方法として管理・指令部門の共同化があり得ることを示すために使います。東京都はすでに東京消防庁という大規模組織であり、同じ効率化の余地があるとは限りません。",
    evidenceLevel: 3,
    sourceKind: "national_government",
    sourceUrl:
      "https://www.fdma.go.jp/publication/hakusho/r6/chapter2/section2/68079.html",
    sourceTitle: "令和6年版消防白書 消防の広域化の必要性と効果",
    sourceDate: "2025",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-england-local-authorities",
    title: "イングランドの地方自治体で削減が特定分野へ偏った",
    categoryIds: ["environment", "linked"],
    jurisdiction: "イングランドの地方自治体",
    country: "イギリス",
    period: "2010年度から2016年度",
    budgetContext: "中央政府から地方自治体への資金が大幅に減少",
    changeTypes: ["service_reduction", "efficiency_reorganization"],
    whatChanged:
      "全分野を均等に削るのではなく、社会福祉を比較的優先し、その分だけ福祉以外の分野で支出をより大きく減らしました。",
    confirmedChanges: [
      "計画・開発が52.8%減、住宅サービスが45.6%減",
      "道路・交通が37.1%減、文化関連サービスが34.9%減",
      "週1回以上ごみ収集を受ける世帯が33.7%減",
      "自治体補助バスの走行距離（ロンドン外）が48.4%減、図書館数が10.3%減",
    ],
    whatRemainsUnknown:
      "法定義務、需要、政策上の優先順位によって、削減は特定の分野へ偏ります。どの分野を優先したかで住民の生活がどう変わったかまでは、この資料では確認できません。英国の自治体制度は東京都と権限も財源も異なります。",
    evidenceLevel: 2,
    sourceKind: "national_audit_office",
    sourceUrl:
      "https://www.nao.org.uk/reports/financial-sustainability-of-local-authorities-2018/",
    sourceTitle: "Financial sustainability of local authorities 2018",
    sourceDate: "2018-03-08",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-hanno-emergency-fiscal-plan",
    title: "飯能市が全事務事業を見直した緊急財政対策",
    categoryIds: ["admin"],
    jurisdiction: "埼玉県飯能市",
    country: "日本",
    period: "2025年度から2026年度",
    budgetContext:
      "将来にわたり持続可能な行財政運営を確立するため、財政調整基金等の残高確保と、歳入規模に見合った歳出への転換を目標に掲げた",
    changeTypes: [
      "service_reduction",
      "efficiency_reorganization",
      "burden_shift",
      "deferral",
    ],
    whatChanged:
      "一つの方法に頼らず、人件費、市単独事業、公共施設、建設事業、受益者負担を同時に見直しました。",
    confirmedChanges: [
      "総人件費の抑制",
      "市単独事業の廃止・休止・縮小",
      "公共施設の再編",
      "建設事業の選択と集中",
      "受益者負担の見直し",
    ],
    whatRemainsUnknown:
      "同じ自治体の同じ財政対策でも、サービスを休止する、補助率を下げる、施設を閉鎖する、投資の優先順位を変えるなど、方法は一つではありません。個々の見直しが住民の生活へどう影響したかは、この資料では確認できません。",
    evidenceLevel: 1,
    sourceKind: "local_government",
    sourceUrl:
      "https://www.city.hanno.lg.jp/shiseijoho/zaisei/kinkyuzaiseitaisaku/11841.html",
    sourceTitle: "緊急財政対策の取組状況",
    sourceDate: "2026-02",
    retrievedAt: RETRIEVED_AT,
  },
  {
    id: "case-england-school-resource-management",
    title: "イングランドの学校の資源管理を改善する取組",
    categoryIds: ["education"],
    jurisdiction: "イングランドの学校",
    country: "イギリス",
    period: "2016年度以降",
    budgetContext: "学校の財政持続性を高めるための教育省による支援",
    changeTypes: ["efficiency_reorganization"],
    whatChanged:
      "教育省が学校の資源管理の改善と節約を支援するプログラムを実施しました。",
    confirmedChanges: [
      "会計検査院は、これらの取組が学校の節約に一定の価値を加えたと評価",
      "一方で、データが十分でなく、プログラムの完全な効果と費用対効果は評価できないと指摘",
    ],
    whatRemainsUnknown:
      "行政の効率化が成功したと断定できる資料ではありません。効率化の余地は存在しますが、サービス水準を維持したまま節約できたかを測るには、データが足りないという例です。効率化を理由に予算を減らす場合、代わりの手段が機能したかを測ってから減らす必要があります。",
    evidenceLevel: 2,
    sourceKind: "national_audit_office",
    sourceUrl:
      "https://www.nao.org.uk/reports/financial-sustainability-of-schools-in-england/",
    sourceTitle: "Financial sustainability of schools in England",
    sourceDate: "2016-12-14",
    retrievedAt: RETRIEVED_AT,
  },
] as const satisfies readonly BudgetCase[];
