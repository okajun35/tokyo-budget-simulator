import type {
  BudgetProcessOverviewStage,
  BudgetProcessOverviewStep,
  BudgetProcessSummaryStep,
  BudgetProcessStep,
} from "./budget-process-step";

export const BUDGET_PROCESS_STEPS = [
  {
    documentStage: "external_request",
    summary: "都民、各種団体、都議会各会派から意見や要望が寄せられる段階です。",
    actor: "都民、各種団体、都議会各会派",
    decision: "意見・要望を提出し、各局や知事が予算編成の参考にします。",
    amountChangePossibility:
      "この段階の要望だけでは予算額は確定・変更されません。",
    sourceIds: ["parties", "groups"],
    publicInvolvement:
      "都民の声、団体ヒアリング、議員・会派への要望などを通じて意見を伝えられます。",
    limitation:
      "要望の採用や予算への反映は保証されません。外部要望を都の確定方針として扱わないことが必要です。",
    fiscalYearStatus: "completed",
  },
  {
    documentStage: "request",
    summary: "各局が必要と考える経費を見積もった段階。成立額とは異なります。",
    actor: "東京都の各局",
    decision: "所管事業に必要な翌年度経費を見積もり、財務局へ要求します。",
    amountChangePossibility:
      "要求額は、その後の査定、知事判断、都議会審議で変更される可能性があります。",
    sourceIds: ["request"],
    publicInvolvement:
      "担当局への意見や、各制度を通じた事前の参加が要求内容の参考になる場合があります。",
    limitation:
      "目的別予算と局別要求は集計範囲が異なります。要求額を成立予算額として扱えません。",
    fiscalYearStatus: "completed",
  },
  {
    documentStage: "bureau_assessment",
    summary:
      "財務局が各局要求を査定した段階。事項別資料は要求から1億円以上増減した事項を掲載。",
    actor: "東京都財務局",
    decision: "要求された事業の必要性、緊急性、経費などを確認して査定します。",
    amountChangePossibility: "各局の要求額を増額、減額、据え置きにできます。",
    sourceIds: ["bureau"],
    publicInvolvement:
      "査定への直接参加制度ではありませんが、公表資料から判断内容の一部を確認できます。",
    limitation:
      "事項別資料に掲載されない項目を、査定されていないと断定することはできません。",
    fiscalYearStatus: "completed",
  },
  {
    documentStage: "governor_assessment",
    summary:
      "財務局査定後に知事判断で変更した段階。財務局査定と別に扱います。",
    actor: "東京都知事",
    decision: "財務局査定後の重要事項などについて最終的な査定判断を行います。",
    amountChangePossibility:
      "財務局査定額を増額、減額、据え置きにする可能性があります。",
    sourceIds: ["governor"],
    publicInvolvement:
      "都民の声や各種要望などが政策判断の参考になる場合があります。",
    limitation:
      "公表資料だけでは、すべての判断理由や要望との因果関係を確認できません。",
    fiscalYearStatus: "completed",
  },
  {
    documentStage: "proposal",
    summary:
      "知事査定等を反映し、都議会へ提出する予算案。まだ成立予算ではありません。",
    actor: "東京都知事、東京都財務局",
    decision: "査定結果をまとめ、予算案として都議会へ提出します。",
    amountChangePossibility:
      "都議会での審議や修正を経る前であり、成立額が変わる可能性があります。",
    sourceIds: ["proposal"],
    publicInvolvement:
      "都議会議員への意見、請願・陳情、審議の傍聴などを検討できます。",
    limitation: "予算案は議決前の金額であり、成立予算ではありません。",
    fiscalYearStatus: "completed",
  },
  {
    documentStage: "assembly_review",
    summary:
      "都議会が本会議や委員会で予算案を審議し、議決に向けて判断する段階です。",
    actor: "東京都議会（本会議、予算特別委員会、常任委員会）",
    decision: "質疑、審査、必要に応じた修正案等の検討を経て採決します。",
    amountChangePossibility:
      "修正案の可決などによって予算額が変わる可能性があります。",
    sourceIds: ["assembly-review"],
    publicInvolvement:
      "本会議・委員会の傍聴、請願・陳情、都議会議員への意見提出などができます。",
    limitation:
      "請願・陳情や意見の提出が、予算の修正や採択を保証するものではありません。",
    fiscalYearStatus: "completed",
  },
  {
    documentStage: "enacted_budget",
    summary: "都議会の議決後の当初予算。本シミュレーターの初期値です。",
    actor: "東京都議会",
    decision: "予算案を採決し、令和8年度一般会計予算を原案どおり可決しました。",
    amountChangePossibility:
      "議決によって当初予算額が確定しますが、年度中の補正予算等で変わる場合があります。",
    sourceIds: ["assembly-vote", "enacted"],
    publicInvolvement:
      "議決結果を確認し、執行や次年度の予算編成に向けて意見を伝えられます。",
    limitation:
      "成立予算は支出の根拠ですが、全事業の実施量や成果を保証するものではありません。",
    fiscalYearStatus: "completed",
  },
  {
    documentStage: "execution",
    summary: "成立予算に基づき、各局が契約、給付、事業運営などを進める段階です。",
    actor: "東京都の各局",
    decision: "成立予算の範囲で事業の実施方法や支出時期などを判断します。",
    amountChangePossibility:
      "執行状況や補正予算などにより、実際の支出額は当初予算額と異なる場合があります。",
    sourceIds: ["execution-instruction"],
    publicInvolvement:
      "事業ごとの都民参加、意見募集、都民の声などを利用できる場合があります。",
    limitation:
      "当初予算額を実際の支出額とみなせません。事業ごとに参加制度や公開時期も異なります。",
    fiscalYearStatus: "in_progress",
  },
  {
    documentStage: "settlement",
    summary:
      "令和8年度の決算はまだ確定していません。年度終了後に作成・審査されます。",
    actor: "東京都の各局、会計管理局、財務局、監査委員、東京都議会",
    decision: "年度終了後に収入と支出の実績を集計し、監査や都議会の審査を受けます。",
    amountChangePossibility:
      "予算額を変更する段階ではなく、実際に収入・支出した額が確定します。",
    sourceIds: ["settlement-portal"],
    publicInvolvement:
      "公表後の決算資料や都議会での審査を確認し、次の予算編成へ意見を伝えられます。",
    limitation:
      "令和8年度は進行中のため、現時点で同年度の確定決算を示すことはできません。",
    fiscalYearStatus: "not_available_yet",
  },
  {
    documentStage: "evaluation",
    summary: "政策・事業の実績や課題を検証し、今後の見直しにつなげる段階です。",
    actor: "東京都の各局、政策企画局、財務局など",
    decision: "政策・事業の実績や課題を評価し、見直しや次の予算編成に活用します。",
    amountChangePossibility:
      "評価結果は将来の要求・査定の参考になりますが、それだけで予算額は変わりません。",
    sourceIds: ["evaluation"],
    publicInvolvement:
      "公表された評価を確認し、次の予算編成や政策への意見提出に利用できます。",
    limitation:
      "評価資料の対象年度や評価時点は成立予算と異なる場合があり、因果関係を断定できません。",
    fiscalYearStatus: "in_progress",
  },
] as const satisfies readonly BudgetProcessStep[];

export const BUDGET_PROCESS_SUMMARY_STEPS = [
  {
    id: "external-input",
    label: "意見・要望",
    summary:
      "都民、各種団体、都議会各会派などが意見や要望を伝えます。要望だけで予算額が決まるわけではありません。",
  },
  {
    id: "bureau-request",
    label: "各局予算要求",
    summary:
      "各局が所管事業に必要な翌年度経費を見積もり、財務局へ要求します。要求額は成立予算額ではありません。",
  },
  {
    id: "finance-assessment",
    label: "財務局査定",
    summary:
      "財務局が事業の必要性、緊急性、経費などを確認し、要求額を査定します。",
  },
  {
    id: "governor-proposal",
    label: "知事査定・予算案",
    summary:
      "知事査定などを反映して予算案をまとめ、東京都議会へ提出します。この時点ではまだ成立していません。",
  },
  {
    id: "assembly-decision",
    label: "都議会審議・議決",
    summary:
      "本会議や委員会で予算案を審議し、東京都議会が採決します。",
  },
  {
    id: "enacted",
    label: "予算成立",
    summary:
      "議決後に当初予算が成立し、各局が事業を執行します。本シミュレーターはこの成立額を基準にしています。",
  },
] as const satisfies readonly BudgetProcessSummaryStep[];

const OVERVIEW_STAGE_ORDER = [
  "request",
  "bureau_assessment",
  "governor_assessment",
  "proposal",
  "enacted_budget",
] as const satisfies readonly BudgetProcessOverviewStage[];

export const BUDGET_PROCESS_OVERVIEW_STEPS = OVERVIEW_STAGE_ORDER.map(
  (documentStage) =>
    BUDGET_PROCESS_STEPS.find((step) => step.documentStage === documentStage)!,
) as readonly BudgetProcessOverviewStep[];
