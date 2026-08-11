import type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";
import type {
  BudgetCategory,
  BudgetChangeOption,
} from "@/features/simulate-budget/budget-category";

import type { BudgetChangeDirection } from "./budget-detail";

export type BudgetChangeConsideration = {
  id: string;
  title: string;
  description: string;
};

export type BudgetChangeGuidance = {
  direction: BudgetChangeDirection;
  optionsHeading: string;
  optionsLead: string;
  options: readonly BudgetChangeOption[];
  considerationsHeading: string;
  considerations: readonly BudgetChangeConsideration[];
  caseHeading: string;
  caseLead: string;
  unavailableCaseMessage: string;
  finalQuestion: string;
};

const option = (
  id: string,
  title: string,
  description: string,
): BudgetChangeOption => ({ id, title, description });

const INCREASE_OPTIONS = {
  welfare: [
    option("welfare-increase-eligibility", "給付や支援の対象を広げる", "対象要件を広げたり、新たな支援対象を設けたりする使い方です。"),
    option("welfare-increase-benefit", "給付・補助の単価や上限を上げる", "利用者や事業者への支援額を厚くする使い方です。"),
    option("welfare-increase-workforce", "相談・介護・医療を担う人員を増やす", "採用と定着、専門職の確保まで含めて実施能力を整える必要があります。"),
    option("welfare-increase-capacity", "施設・在宅サービスの受け皿を広げる", "整備費だけでなく、運営費と地域ごとの供給力も必要です。"),
  ],
  education: [
    option("education-increase-workforce", "教員・支援員を増やす", "採用できる人材、配置先、翌年度以降の人件費まで確認する必要があります。"),
    option("education-increase-subsidy", "給食や教材への補助を増やす", "対象、単価、継続期間を決め、学校や家庭へどう届くかを確認します。"),
    option("education-increase-facilities", "学校施設を更新する", "設計・工事の担い手と工期、完成後の維持費まで必要です。"),
    option("education-increase-support", "ICT・特別支援を拡充する", "機器やサービスだけでなく、使いこなす人員と運用体制も必要です。"),
    option("education-increase-culture", "文化施設・助成を増やす", "対象地域、利用者、助成先の選び方によって届き方が変わります。"),
  ],
  industry: [
    option("industry-increase-finance", "中小企業への金融支援を広げる", "融資枠や利子補給を増やす場合、利用要件と審査・相談体制も必要です。"),
    option("industry-increase-startup", "創業・事業転換支援を増やす", "補助だけでなく、相談、人材、販路などの受け皿を整える必要があります。"),
    option("industry-increase-employment", "雇用・職業訓練を拡充する", "求人側の需要と訓練内容が合わなければ、支出が就業へ直結するとは限りません。"),
    option("industry-increase-tourism", "観光・農林水産業への投資を増やす", "地域、業種、時期によって需要と供給能力が異なります。"),
  ],
  environment: [
    option("environment-increase-subsidy", "省エネ・再エネ設備への助成を増やす", "申請件数だけでなく、施工事業者や設備供給の能力も確認します。"),
    option("environment-increase-infrastructure", "エネルギー・資源循環設備へ投資する", "系統接続、用地、施設容量、工期が実施量を制約する場合があります。"),
    option("environment-increase-conservation", "自然環境の保全・監視を広げる", "専門人材と継続的な調査・管理体制が必要です。"),
    option("environment-increase-demonstration", "新技術の実証や普及を支援する", "実証に成功しても、費用や制度の条件から社会実装へ進めない場合があります。"),
  ],
  city: [
    option("city-increase-renewal", "道路・橋梁・上下水道の更新を進める", "優先順位、設計、資材、建設人材を確保して初めて執行できます。"),
    option("city-increase-resilience", "防災・減災の設備を増やす", "地域ごとのリスクと既存計画に沿って対象を選ぶ必要があります。"),
    option("city-increase-housing", "住宅・まちづくり支援を広げる", "用地、事業者、住民調整が整わなければ、予算だけでは進みません。"),
    option("city-increase-parks", "公園・緑地を整備する", "整備後の維持管理費と地域ごとの利用機会も確認します。"),
  ],
  safety: [
    option("safety-increase-workforce", "警察官・消防職員などの体制を厚くする", "採用、訓練、配置に時間がかかり、予算年度内に人数を増やせるとは限りません。"),
    option("safety-increase-equipment", "車両・通信・救助装備を更新する", "調達期間、保管場所、操作訓練、更新後の維持費が必要です。"),
    option("safety-increase-facilities", "庁舎・消防署・訓練施設を整備する", "用地と工期に加え、完成後の運営人員を確保する必要があります。"),
    option("safety-increase-prevention", "予防・地域安全活動を広げる", "対象地域と活動内容によって、必要な人員と成果の測り方が異なります。"),
  ],
  admin: [
    option("admin-increase-digital", "行政システムを更新する", "導入費だけでなく、移行、教育、セキュリティ、保守の能力が必要です。"),
    option("admin-increase-workforce", "審査・相談・危機管理の体制を厚くする", "専門人材の採用と配置に時間がかかる場合があります。"),
    option("admin-increase-access", "窓口やオンライン手続を改善する", "新旧の手段を並行運用すると、一時的に費用や職員負担が増える場合があります。"),
    option("admin-increase-data", "データ整備・政策評価を拡充する", "データを集めるだけでなく、判断へ使う人材と運用ルールが必要です。"),
  ],
  debt: [
    option("debt-increase-redemption", "元金の償還へより多く充てる", "返済条件や会計上の扱いを確認し、実際に前倒しできる範囲を見極めます。"),
    option("debt-increase-interest", "増えた利払いに対応する", "金利や借換え条件による負担増なら、政策サービスの追加とは異なります。"),
    option("debt-increase-refinancing", "借換え・償還計画を組み替える", "当年度の公債費が増えても、将来を含む総負担が減るとは限りません。"),
  ],
  linked: [
    option("linked-increase-formula", "制度算定に伴う交付金増へ対応する", "税収や算定式に連動する部分は、任意の政策事業のようには決められません。"),
    option("linked-increase-demand", "区市町村の財政需要増を反映する", "どの需要を算定へ入れるかは、制度と公式な調整過程の確認が必要です。"),
    option("linked-increase-transfer", "制度上必要な繰出金・配分を増やす", "一般会計だけでなく、相手方の会計や年度間の関係も確認します。"),
  ],
} as const satisfies Record<BudgetCategoryId, readonly BudgetChangeOption[]>;

const UNCHANGED_OPTIONS = {
  welfare: [
    option("welfare-unchanged-prices", "物価・人件費の上昇", "委託費や人件費が上がれば、同じ金額で提供できる支援量が減る可能性があります。"),
    option("welfare-unchanged-demand", "高齢化や支援需要の変化", "利用者が増えれば、一人当たりの支援や待ち時間が変わる可能性があります。"),
    option("welfare-unchanged-rules", "国制度・報酬改定", "制度変更によって東京都の負担や提供方法が変わる場合があります。"),
  ],
  education: [
    option("education-unchanged-inflation", "インフレ・物価上昇", "教材、給食、光熱、工事の価格が上がれば、同じ金額で買える量が減る可能性があります。"),
    option("education-unchanged-workforce", "人件費と人材確保", "賃金や採用環境が変われば、同じ予算で維持できる人員体制も変わります。"),
    option("education-unchanged-aging", "施設・設備の老朽化", "更新需要が増えると、現在のサービスを維持するだけでも追加費用が必要になります。"),
    option("education-unchanged-demand", "児童生徒数や支援需要の変化", "総数だけでなく、地域や支援内容ごとの需要変化を確認する必要があります。"),
  ],
  industry: [
    option("industry-unchanged-economy", "景気・資金需要の変化", "企業の資金需要が増えれば、同じ支援枠では届く割合が変わります。"),
    option("industry-unchanged-prices", "物価・賃金の上昇", "補助単価を据え置くと、実質的な支援割合が下がる可能性があります。"),
    option("industry-unchanged-transition", "産業構造・技能需要の変化", "同じ訓練や支援内容が新しい需要に合うとは限りません。"),
  ],
  environment: [
    option("environment-unchanged-prices", "設備・エネルギー価格の変化", "同じ予算でも導入できる設備数や運営費が変わります。"),
    option("environment-unchanged-capacity", "系統・処理施設の容量", "需要が増えると、補助額を維持しても接続や処理が追いつかない場合があります。"),
    option("environment-unchanged-targets", "環境目標・制度の変更", "基準が変われば、現在の取組を続けるだけでは不足する可能性があります。"),
  ],
  city: [
    option("city-unchanged-construction", "建設費・資材価格の上昇", "同じ金額で整備・更新できる延長や施設数が減る可能性があります。"),
    option("city-unchanged-workforce", "建設・保守人材の不足", "予算が同じでも、担い手不足で契約や工事が遅れる場合があります。"),
    option("city-unchanged-aging", "インフラの老朽化", "更新対象が増えれば、同じ金額では優先順位をさらに絞る必要があります。"),
  ],
  safety: [
    option("safety-unchanged-cost", "人件費・装備価格の上昇", "同じ金額で維持できる人員や装備の量が変わる可能性があります。"),
    option("safety-unchanged-demand", "救急・災害対応需要の変化", "出動需要が増えると、同じ体制でも余力や対応時間が変わります。"),
    option("safety-unchanged-aging", "車両・庁舎・通信設備の老朽化", "更新を先送りすると、将来費用や故障リスクが増える場合があります。"),
  ],
  admin: [
    option("admin-unchanged-security", "セキュリティ・制度要件の変化", "新しい脅威や法令へ対応するには、現状維持にも追加の作業が必要です。"),
    option("admin-unchanged-aging", "システムの老朽化", "更新を見送ると、保守費や障害リスクが増える場合があります。"),
    option("admin-unchanged-demand", "手続・相談需要の変化", "件数が増えれば、同じ人員と金額では処理時間が変わる可能性があります。"),
  ],
  debt: [
    option("debt-unchanged-rates", "金利の変化", "金利が上がれば、同じ債務残高でも将来の利払い負担が増える可能性があります。"),
    option("debt-unchanged-schedule", "償還時期の到来", "年度ごとの償還予定が異なるため、金額据え置きが同じ返済状況を意味するとは限りません。"),
    option("debt-unchanged-refinancing", "借換え条件の変化", "市場条件により、同じ金額で組める返済計画が変わります。"),
  ],
  linked: [
    option("linked-unchanged-tax", "税収の変化", "制度が税収へ連動する場合、金額を政策判断だけで据え置けるとは限りません。"),
    option("linked-unchanged-formula", "算定制度の変更", "算定項目や配分率が変われば、必要額も変化します。"),
    option("linked-unchanged-demand", "区市町村の財政需要の変化", "物価や行政需要が増えれば、同じ配分額の実質的な価値が変わります。"),
  ],
} as const satisfies Record<BudgetCategoryId, readonly BudgetChangeOption[]>;

const implementationCapacityByCategory: Record<BudgetCategoryId, string> = {
  welfare: "介護・医療・相談の人材や施設の受け皿が足りなければ、予算を増やしても支援量へ変換できません。",
  education: "教員、支援員、建設業者、施設、教材などの受け皿が足りなければ、予算だけ増やしても執行できません。",
  industry: "審査・相談人材や支援先の需要が整わなければ、用意した支援枠を十分に使えない場合があります。",
  environment: "施工事業者、専門人材、電力系統、処理施設などの容量が実施量を制約します。",
  city: "建設人材、資材、用地、設計・契約能力が足りなければ、年度内に事業化できません。",
  safety: "採用、訓練、調達、施設整備に時間がかかり、予算年度内に体制を増やせるとは限りません。",
  admin: "デジタル・審査などの専門人材と移行を管理する能力がなければ、支出が改善へ直結しません。",
  debt: "返済条件や償還予定により、追加額を任意に前倒し返済へ使えるとは限りません。",
  linked: "制度上の算定、相手方との調整、会計処理が整わなければ、任意に配分を増やせません。",
};

const distributionByCategory: Record<BudgetCategoryId, string> = {
  welfare: "どの地域、年齢、所得、支援種別へ配るかで、恩恵を受ける人が変わります。",
  education: "都全体の増額でも、どの地域・学校・年齢・支援対象へ配るかで恩恵が変わります。",
  industry: "業種、企業規模、地域、就業者の状況によって支援の届き方が変わります。",
  environment: "地域、建物種別、所得、事業規模によって設備導入の機会が偏る場合があります。",
  city: "事業地域と優先順位によって、利便性や安全性の改善が届く時期が変わります。",
  safety: "地域ごとの需要とリスクに応じた配置でなければ、体制増の効果が偏る場合があります。",
  admin: "デジタルを利用しやすい人と対面支援が必要な人の双方へ届く設計が必要です。",
  debt: "追加返済へ回す現在世代の負担と、将来世代の負担軽減を分けて考える必要があります。",
  linked: "制度算定により配分先と用途が決まるため、都民全体へ同じ形で届くとは限りません。",
};

const increaseConsiderations = (
  categoryId: BudgetCategoryId,
): readonly BudgetChangeConsideration[] => [
  { id: "opportunity-cost", title: "財源の機会費用", description: "固定総額の中で増やすなら、同額を他分野から減らすか、配分可能額を使う必要があります。" },
  { id: "delivery-capacity", title: "実施能力", description: implementationCapacityByCategory[categoryId] },
  { id: "recurring-cost", title: "恒常経費化", description: "人員や新施設などは翌年度以降も人件費・運営費・維持費が続く可能性があります。" },
  { id: "diminishing-returns", title: "成果は予算に比例しない", description: "支出を増やしても、成果が同じ割合で増えるとは限りません。何を測るかを先に決める必要があります。" },
  { id: "distribution", title: "配分の偏り", description: distributionByCategory[categoryId] },
  { id: "time-horizon", title: "短期と長期", description: "今年支出しても、採用、建設、制度変更などの効果が現れるまで時間がかかる場合があります。" },
];

const DECREASE_CONSIDERATIONS: readonly BudgetChangeConsideration[] = [
  { id: "service-level", title: "サービス低下", description: "対象、回数、時間、人員、施設など、現在提供している内容が変わる可能性があります。" },
  { id: "burden-shift", title: "負担移転", description: "行政支出が減っても、利用者、家族、事業者、別の会計へ費用や作業が移る場合があります。" },
  { id: "staff-load", title: "職員負担", description: "人員や委託を減らした結果、残る職員の業務量や待ち時間が増える場合があります。" },
  { id: "future-cost", title: "将来コスト", description: "更新や対応を延期すると、当年度支出は減っても将来の修繕費やリスクが増える場合があります。" },
  { id: "spillover", title: "他部署・他制度への影響", description: "一つの分野を減らした結果、別の行政サービスや区市町村側の負担が増える場合があります。" },
];

const UNCHANGED_CONSIDERATIONS: readonly BudgetChangeConsideration[] = [
  { id: "real-level", title: "実質的なサービス水準", description: "物価や人件費が上がれば、名目額が同じでも提供できる量は減る可能性があります。" },
  { id: "demand", title: "需要とのずれ", description: "利用者や行政需要が変化すれば、同じ金額でも一人当たりのサービス水準は変わります。" },
  { id: "maintenance", title: "更新・維持の先送り", description: "老朽化への対応を増やせなければ、現在の機能を保つことが難しくなる場合があります。" },
  { id: "rules", title: "制度変更", description: "国制度、法令、算定方法が変わると、同じ金額を同じ用途へ使えるとは限りません。" },
];

const money = (value: number) => `${value.toLocaleString("ja-JP")}億円`;

const increaseLead = (categoryId: BudgetCategoryId) => {
  if (categoryId === "debt") {
    return "公債費の増額は返済・利払いへの支出増であり、通常の政策サービスの拡充とは意味が異なります。";
  }
  if (categoryId === "linked") {
    return "税連動経費等の増額は制度上の算定や他会計への配分に伴う場合があり、任意に増やす一般事業費とは異なります。";
  }
  return "増額分を人員、設備、給付、補助、インフラなどの何へ変換するかで、必要な実施能力と将来負担が変わります。";
};

const increaseFinalQuestion = (
  categoryId: BudgetCategoryId,
  amount: string,
) => {
  if (categoryId === "debt") {
    return `この${amount}を公債費へ追加するなら、どの返済・利払いに充てますか？将来を含む負担はどう変わりますか？`;
  }
  if (categoryId === "linked") {
    return `この${amount}が増えるなら、どの制度算定や配分が変わりますか？東京都が任意に決められる範囲でしょうか？`;
  }
  return `この${amount}を増やすなら、何に使いますか？その支出を来年度以降も続けられますか？`;
};

export function getBudgetChangeGuidance(
  category: BudgetCategory,
  direction: BudgetChangeDirection,
  absoluteChangeAmount100mYen: number,
): BudgetChangeGuidance {
  const amount = money(absoluteChangeAmount100mYen);

  if (direction === "increase") {
    return {
      direction,
      optionsHeading: `この${amount}を増やすと、何を変えられる？`,
      optionsLead: increaseLead(category.id),
      options: INCREASE_OPTIONS[category.id],
      considerationsHeading: "増やすときに考えること",
      considerations: increaseConsiderations(category.id),
      caseHeading: "他の自治体では、予算を増やして何を変えた？",
      caseLead: "公的資料から、追加の予算や投資が何へ使われ、その後どんな制約が確認されたかを示します。",
      unavailableCaseMessage: "増額後の使途と制約を公的資料で確認できる事例は現在未収録です。掲載がないことは、増額の方法がないという意味ではありません。",
      finalQuestion: increaseFinalQuestion(category.id, amount),
    };
  }

  if (direction === "decrease") {
    return {
      direction,
      optionsHeading: `この${amount}を減らすには、何を変える？`,
      optionsLead: "減額分を対象縮小、サービス水準、効率化、負担移転、更新延期などのどの方法で実現するかを分けて考えます。",
      options: category.changeOptions,
      considerationsHeading: "減らすときに考えること",
      considerations: DECREASE_CONSIDERATIONS,
      caseHeading: "他の自治体では、予算を減らして何を変えた？",
      caseLead: "公的資料から、財政対策として支出を減らした地域で、サービスや負担がどう変わったかを示します。",
      unavailableCaseMessage: "減額後の変更を公的資料で確認できる事例は現在未収録です。推測例は表示しません。",
      finalQuestion: `この${amount}を減らすなら、何を変えますか？その負担は本当に消えますか？`,
    };
  }

  return {
    direction,
    optionsHeading: "現在の水準を維持するとは？",
    optionsLead: "金額を据え置いても、実質的なサービス水準が同じとは限りません。外部条件が変われば、同じ予算で提供できる内容も変わります。",
    options: UNCHANGED_OPTIONS[category.id],
    considerationsHeading: "据え置くときに考えること",
    considerations: UNCHANGED_CONSIDERATIONS,
    caseHeading: "金額を据え置いたとき、何が変わり得る？",
    caseLead: "据え置きは変化がないという意味ではありません。物価、需要、老朽化、制度の変化と合わせて読みます。",
    unavailableCaseMessage: "令和8年度の関連する取組を確認します。",
    finalQuestion: "今の金額を維持すれば、サービス水準も維持できるでしょうか？",
  };
}
