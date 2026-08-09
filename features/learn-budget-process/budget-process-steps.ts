import type { BudgetProcessStep } from "./budget-process-step";

export const BUDGET_PROCESS_OVERVIEW_STEPS = [
  {
    documentStage: "request",
    summary: "各局が必要と考える経費を見積もった段階。成立額とは異なります。",
  },
  {
    documentStage: "bureau_assessment",
    summary:
      "財務局が各局要求を査定した段階。事項別資料は要求から1億円以上増減した事項を掲載。",
  },
  {
    documentStage: "governor_assessment",
    summary:
      "財務局査定後に知事判断で変更した段階。財務局査定と別に扱います。",
  },
  {
    documentStage: "proposal",
    summary:
      "知事査定等を反映し、都議会へ提出する予算案。まだ成立予算ではありません。",
  },
  {
    documentStage: "enacted_budget",
    summary: "都議会の議決後の当初予算。本シミュレーターの初期値です。",
  },
] as const satisfies readonly BudgetProcessStep[];
