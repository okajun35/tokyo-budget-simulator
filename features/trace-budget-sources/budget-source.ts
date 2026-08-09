import type { BudgetDocumentStage } from "@/domain/tokyo-budget/budget-document-stage";

export type BudgetSourceType =
  | "local_government"
  | "open_data_catalog"
  | "local_legislature";

export type BudgetSource = {
  id: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceDate: string;
  fiscalYear: 2026;
  documentStage: BudgetDocumentStage;
  retrievedAt: string;
  factOrInterpretation: "fact" | "interpretation";
  sourceType: BudgetSourceType;
  license: string;
  targetPage: string;
  targetTableOrItem: string;
  appUsage: readonly string[];
};
