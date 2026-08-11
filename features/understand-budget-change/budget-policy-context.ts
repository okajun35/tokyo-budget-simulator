import type { BudgetCategoryId } from "../simulate-budget/budget-category.ts";

export type BudgetPolicySourceKind =
  | "budget_proposal_material"
  | "enactment_record"
  | "strategy_action_plan"
  | "budget_estimate_policy";

export type BudgetPolicyContextSource = {
  title: string;
  url: string;
  kind: BudgetPolicySourceKind;
  verifiedAt: string;
};

export type BudgetInitiativeRelationship =
  | "direct"
  | "related_policy"
  | "cross_government";

export type BudgetInitiativeAccountingScope =
  | "general_account"
  | "mixed"
  | "unknown";

export type BudgetCurrentInitiative = {
  title: string;
  relationship: BudgetInitiativeRelationship;
  accountingScope: BudgetInitiativeAccountingScope;
  sourceTitle: string;
  sourceUrl: string;
  verifiedAt: string;
};

export type BudgetPolicyContext = {
  categoryId: BudgetCategoryId;
  fy2026: {
    fiscalYear: 2026;
    kind: "related_initiatives" | "fiscal_characteristic";
    heading: string;
    summary: string;
    initiatives: readonly BudgetCurrentInitiative[];
    sources: readonly BudgetPolicyContextSource[];
    disclaimer: string;
  };
  fy2027: {
    planYear: 2027;
    heading: string;
    summary: string;
    examples: readonly string[];
    relationship: "related_policy" | "fiscal_characteristic";
    sources: readonly BudgetPolicyContextSource[];
    disclaimer: string;
  };
};

const VERIFIED_AT = "2026-08-11";
const FY2026_MAJOR_POLICIES: BudgetPolicyContextSource = {
  title: "令和8年度 主要な施策",
  url: "https://www.metro.tokyo.lg.jp/documents/d/tosei/20260130_39_04",
  kind: "budget_proposal_material",
  verifiedAt: VERIFIED_AT,
};
const FY2026_BUDGET_POINTS: BudgetPolicyContextSource = {
  title: "令和8年度予算のポイント",
  url: "https://www.metro.tokyo.lg.jp/documents/d/tosei/20260130_39_01",
  kind: "budget_proposal_material",
  verifiedAt: VERIFIED_AT,
};
const FY2026_ENACTMENT_RECORD: BudgetPolicyContextSource = {
  title: "令和8年第1回定例会 提出議案と議決結果",
  url: "https://www.gikai.metro.tokyo.lg.jp/bill/reg2026-1.html",
  kind: "enactment_record",
  verifiedAt: VERIFIED_AT,
};
const FY2027_ACTION_PLAN: BudgetPolicyContextSource = {
  title: "2050東京戦略 事業実施状況調査 3か年のアクションプラン一覧",
  url: "https://www.seisakukikaku.metro.tokyo.lg.jp/documents/d/seisakukikaku/policy-review_2025_actionplan",
  kind: "strategy_action_plan",
  verifiedAt: VERIFIED_AT,
};
const FY2027_BUDGET_ESTIMATE_POLICY: BudgetPolicyContextSource = {
  title: "令和9年度東京都予算の見積方針のポイント",
  url: "https://www.metro.tokyo.lg.jp/information/press/2026/07/2026073113",
  kind: "budget_estimate_policy",
  verifiedAt: VERIFIED_AT,
};

const CURRENT_INITIATIVE_DISCLAIMER =
  "※表示している取組は、この分野に関連する代表例です。この分野の予算全体の内訳を示すものではありません。";
const FY2027_DISCLAIMER =
  "※ユーザーの選択に対する評価ではありません。政策上の方向を紹介するもので、目的別予算の増減や令和9年度予算額の確定を示すものではありません。";

const initiative = (
  title: string,
  accountingScope: BudgetInitiativeAccountingScope = "general_account",
): BudgetCurrentInitiative => ({
  title,
  relationship: "related_policy",
  accountingScope,
  sourceTitle: FY2026_MAJOR_POLICIES.title,
  sourceUrl: FY2026_MAJOR_POLICIES.url,
  verifiedAt: FY2026_MAJOR_POLICIES.verifiedAt,
});

export const BUDGET_POLICY_CONTEXTS: readonly BudgetPolicyContext[] = [
  {
    categoryId: "welfare",
    fy2026: {
      fiscalYear: 2026,
      kind: "related_initiatives",
      heading: "令和8年度、この分野に関連する取組",
      summary: "不妊治療への支援拡大、高齢者の相談支援、介護情報の提供、地域医療の確保などが進められています。",
      initiatives: [
        initiative("不妊治療への支援"),
        initiative("高齢者の相談支援"),
        initiative("介護情報の提供"),
        initiative("地域医療の確保"),
        initiative("がん検診支援"),
      ],
      sources: [FY2026_MAJOR_POLICIES, FY2026_ENACTMENT_RECORD],
      disclaimer: CURRENT_INITIATIVE_DISCLAIMER,
    },
    fy2027: {
      planYear: 2027,
      heading: "令和9年度に向けて公表されている政策・予算編成方針",
      summary: "2050東京戦略の2027年度アクションプランでは、高齢者施策、医療、生活支援に関する取組が示されています。",
      examples: ["認知症の早期支援", "地域連携", "医療・救急体制"],
      relationship: "related_policy",
      sources: [FY2027_ACTION_PLAN, FY2027_BUDGET_ESTIMATE_POLICY],
      disclaimer: FY2027_DISCLAIMER,
    },
  },
  {
    categoryId: "education",
    fy2026: {
      fiscalYear: 2026,
      kind: "related_initiatives",
      heading: "令和8年度、この分野に関連する取組",
      summary: "学校環境の整備、海外留学支援、授業料負担軽減に加え、東京の歴史・文化を発信する取組などが実施されています。",
      initiatives: [
        initiative("公立学校普通教室の空調更新支援"),
        initiative("都立高校の海外留学支援"),
        initiative("私立中学校等の授業料負担軽減"),
        initiative("部活動支援"),
        initiative("江戸東京文化の発信"),
      ],
      sources: [FY2026_MAJOR_POLICIES, FY2026_ENACTMENT_RECORD],
      disclaimer: CURRENT_INITIATIVE_DISCLAIMER,
    },
    fy2027: {
      planYear: 2027,
      heading: "令和9年度に向けて公表されている政策・予算編成方針",
      summary: "2050東京戦略の2027年度アクションプランでは、子供・若者の教育と、東京の歴史・文化の発信に関する取組が示されています。",
      examples: ["全都立高校でのオンライン英会話", "江戸東京文化の発信"],
      relationship: "related_policy",
      sources: [FY2027_ACTION_PLAN, FY2027_BUDGET_ESTIMATE_POLICY],
      disclaimer: FY2027_DISCLAIMER,
    },
  },
  {
    categoryId: "industry",
    fy2026: {
      fiscalYear: 2026,
      kind: "related_initiatives",
      heading: "令和8年度、この分野に関連する取組",
      summary: "中小企業の経営力強化、スタートアップの成長、新産業創出、人手不足や物価高騰への対応などが進められています。",
      initiatives: [
        initiative("中小企業の経営力強化"),
        initiative("スタートアップ支援", "mixed"),
        initiative("新産業創出", "mixed"),
        initiative("人手不足への対応"),
        initiative("物価高騰を踏まえた事業者支援"),
      ],
      sources: [FY2026_MAJOR_POLICIES, FY2026_ENACTMENT_RECORD],
      disclaimer: CURRENT_INITIATIVE_DISCLAIMER,
    },
    fy2027: {
      planYear: 2027,
      heading: "令和9年度に向けて公表されている政策・予算編成方針",
      summary: "2050東京戦略の2027年度アクションプランでは、中小企業・スタートアップの成長、人材確保、国際競争力や新産業に関する取組が示されています。",
      examples: ["中小企業の成長支援", "スタートアップ支援", "人材確保", "新産業への取組"],
      relationship: "related_policy",
      sources: [FY2027_ACTION_PLAN, FY2027_BUDGET_ESTIMATE_POLICY],
      disclaimer: FY2027_DISCLAIMER,
    },
  },
  {
    categoryId: "environment",
    fy2026: {
      fiscalYear: 2026,
      kind: "related_initiatives",
      heading: "令和8年度、この分野に関連する取組",
      summary: "省エネ、ZEV、住宅の省エネ化、再生可能エネルギーなど、脱炭素とエネルギー転換に向けた取組が進められています。",
      initiatives: [
        initiative("省エネの推進"),
        initiative("ZEVの普及"),
        initiative("住宅の省エネ化"),
        initiative("再生可能エネルギーの利用"),
        initiative("グリーン水素の製造・利活用", "mixed"),
      ],
      sources: [FY2026_MAJOR_POLICIES, FY2026_ENACTMENT_RECORD],
      disclaimer: CURRENT_INITIATIVE_DISCLAIMER,
    },
    fy2027: {
      planYear: 2027,
      heading: "令和9年度に向けて公表されている政策・予算編成方針",
      summary: "2050東京戦略の2027年度アクションプランでは、脱炭素とエネルギー構造の転換に関する取組が示されています。",
      examples: ["住宅の省エネ", "太陽光・蓄電池", "EV充電設備の普及"],
      relationship: "related_policy",
      sources: [FY2027_ACTION_PLAN, FY2027_BUDGET_ESTIMATE_POLICY],
      disclaimer: FY2027_DISCLAIMER,
    },
  },
  {
    categoryId: "city",
    fy2026: {
      fiscalYear: 2026,
      kind: "related_initiatives",
      heading: "令和8年度、この分野に関連する取組",
      summary: "鉄道や地域交通、河川の浸水対策、耐震対策、住環境整備など、都市機能と災害への強さを支える取組が進められています。",
      initiatives: [
        initiative("鉄道の連続立体交差"),
        initiative("地域交通の確保"),
        initiative("河川の浸水対策"),
        initiative("住宅の耐震化"),
        initiative("住環境の整備"),
      ],
      sources: [FY2026_MAJOR_POLICIES, FY2026_ENACTMENT_RECORD],
      disclaimer: CURRENT_INITIATIVE_DISCLAIMER,
    },
    fy2027: {
      planYear: 2027,
      heading: "令和9年度に向けて公表されている政策・予算編成方針",
      summary: "2050東京戦略の2027年度アクションプランでは、交通、バリアフリー、住まい、災害に強い都市基盤に関する取組が示されています。",
      examples: ["地下鉄駅のバリアフリー化", "地域交通", "河川・堤防等の整備"],
      relationship: "related_policy",
      sources: [FY2027_ACTION_PLAN, FY2027_BUDGET_ESTIMATE_POLICY],
      disclaimer: FY2027_DISCLAIMER,
    },
  },
  {
    categoryId: "safety",
    fy2026: {
      fiscalYear: 2026,
      kind: "related_initiatives",
      heading: "令和8年度、この分野に関連する取組",
      summary: "警察・消防による日常の安全確保に加え、119番対応へのAI活用や、災害・救急への対応力強化などが進められています。",
      initiatives: [
        initiative("日常の安全確保"),
        initiative("119番対応へのAI活用"),
        initiative("救急対応"),
        initiative("消防活動体制の整備"),
        initiative("災害対応"),
      ],
      sources: [FY2026_MAJOR_POLICIES, FY2026_BUDGET_POINTS, FY2026_ENACTMENT_RECORD],
      disclaimer: CURRENT_INITIATIVE_DISCLAIMER,
    },
    fy2027: {
      planYear: 2027,
      heading: "令和9年度に向けて公表されている政策・予算編成方針",
      summary: "2050東京戦略の2027年度アクションプランでは、治安、サイバー攻撃、風水害、地震、火山噴火などへの対応に関する取組が示されています。",
      examples: ["AI・デジタル技術を使った安全対策", "消防活動体制の整備"],
      relationship: "related_policy",
      sources: [FY2027_ACTION_PLAN, FY2027_BUDGET_ESTIMATE_POLICY],
      disclaimer: FY2027_DISCLAIMER,
    },
  },
  {
    categoryId: "admin",
    fy2026: {
      fiscalYear: 2026,
      kind: "related_initiatives",
      heading: "令和8年度、この分野に関連する取組",
      summary: "東京アプリ、行政DX、職員のAI人材育成など、都民サービスと行政運営のデジタル化に関する取組が進められています。",
      initiatives: [
        initiative("東京アプリ"),
        initiative("行政手続のデジタル化"),
        initiative("行政DX"),
        initiative("職員のAI人材育成"),
      ],
      sources: [FY2026_MAJOR_POLICIES, FY2026_BUDGET_POINTS, FY2026_ENACTMENT_RECORD],
      disclaimer: CURRENT_INITIATIVE_DISCLAIMER,
    },
    fy2027: {
      planYear: 2027,
      heading: "令和9年度に向けて公表されている政策・予算編成方針",
      summary: "2050東京戦略の2027年度アクションプランでは、AI、データ連携、行政手続のオンライン化などに関する取組が示されています。",
      examples: ["行政手続のオンライン化と質の改善", "生成AIの活用", "東京アプリの拡充"],
      relationship: "related_policy",
      sources: [FY2027_ACTION_PLAN, FY2027_BUDGET_ESTIMATE_POLICY],
      disclaimer: FY2027_DISCLAIMER,
    },
  },
  {
    categoryId: "debt",
    fy2026: {
      fiscalYear: 2026,
      kind: "fiscal_characteristic",
      heading: "この予算の性質",
      summary: "公債費は、過去に発行した都債の元利償還などに関係する経費です。福祉や教育のように、今年のサービス内容だけで自由に変更できる経費ではありません。",
      initiatives: [],
      sources: [FY2026_BUDGET_POINTS, FY2026_ENACTMENT_RECORD],
      disclaimer: CURRENT_INITIATIVE_DISCLAIMER,
    },
    fy2027: {
      planYear: 2027,
      heading: "令和9年度に向けて公表されている財政方針",
      summary: "予算見積方針では、将来世代への負担にも配慮しながら、都債と基金を財政運営に活用する考え方が示されています。",
      examples: [],
      relationship: "fiscal_characteristic",
      sources: [FY2027_BUDGET_ESTIMATE_POLICY],
      disclaimer: FY2027_DISCLAIMER,
    },
  },
  {
    categoryId: "linked",
    fy2026: {
      fiscalYear: 2026,
      kind: "fiscal_characteristic",
      heading: "この予算の性質",
      summary: "税連動経費等は、税収や制度上の算定などに連動して必要額が決まる部分が大きく、一般的な行政サービスとは性質が異なります。",
      initiatives: [],
      sources: [FY2026_BUDGET_POINTS, FY2026_ENACTMENT_RECORD],
      disclaimer: CURRENT_INITIATIVE_DISCLAIMER,
    },
    fy2027: {
      planYear: 2027,
      heading: "令和9年度に向けて公表されている財政上の位置付け",
      summary: "予算見積方針では、税収や制度などの基礎計数を精査して必要額を算定する考え方が示されています。",
      examples: [],
      relationship: "fiscal_characteristic",
      sources: [FY2027_BUDGET_ESTIMATE_POLICY],
      disclaimer: FY2027_DISCLAIMER,
    },
  },
] as const;

export function findBudgetPolicyContext(
  categoryId: BudgetCategoryId,
): BudgetPolicyContext | undefined {
  return BUDGET_POLICY_CONTEXTS.find(context => context.categoryId === categoryId);
}
