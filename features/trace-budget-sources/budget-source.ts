import type { BudgetDocumentStage } from "@/domain/tokyo-budget/budget-document-stage";

export type BudgetSource = {
  id: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceDate: string;
  fiscalYear: 2026;
  documentStage: BudgetDocumentStage;
  retrievedAt: string;
  factOrInterpretation: "fact" | "interpretation";
};
