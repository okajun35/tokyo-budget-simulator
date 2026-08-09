import { BUDGET_CATEGORIES } from "../simulate-budget/budget-categories.ts";
import { BUDGET_CSV_RESOURCES } from "./budget-csv-resources.ts";

type NormalizedRow = {
  fiscalYear?: number;
  category?: string;
  subcategory?: string;
  amount100mYen?: number;
  [key: string]: unknown;
};

type NormalizedResource = {
  id: string;
  rows: NormalizedRow[];
};

type NormalizedBudgetData = {
  fiscalYear: number;
  amountUnit: string;
  resources: NormalizedResource[];
};

export const validateBudgetData = (
  data: NormalizedBudgetData,
): string[] => {
  const errors: string[] = [];

  if (data.fiscalYear !== 2026) {
    errors.push("fiscalYear must be 2026");
  }
  if (data.amountUnit !== "100_million_yen") {
    errors.push("amountUnit must be 100_million_yen");
  }

  for (const expectedResource of BUDGET_CSV_RESOURCES) {
    const resource = data.resources.find(item => item.id === expectedResource.id);
    if (!resource) {
      errors.push(`missing resource: ${expectedResource.id}`);
    } else if (resource.rows.length === 0) {
      errors.push(`resource has no FY2026 rows: ${expectedResource.id}`);
    }
  }

  const purposeResource = data.resources.find(
    resource => resource.id === "purpose-breakdown",
  );
  if (purposeResource) {
    const purposeTotal = purposeResource.rows.reduce(
      (sum, row) => sum + (row.amount100mYen ?? 0),
      0,
    );
    if (purposeTotal !== 96_530) {
      errors.push(
        `purpose-breakdown total must be 96530, received ${purposeTotal}`,
      );
    }

    const matchesCategories = BUDGET_CATEGORIES.every(category => {
      const row = purposeResource.rows.find(
        item => item.category === category.name,
      );
      return row?.amount100mYen === category.baselineAmount100mYen;
    });
    if (!matchesCategories || purposeResource.rows.length !== 9) {
      errors.push("purpose-breakdown must match the nine simulator categories");
    }
  }

  const generalAccountResource = data.resources.find(
    resource => resource.id === "general-account",
  );
  if (generalAccountResource) {
    const enactedExpense = generalAccountResource.rows.find(
      row => row.category === "歳出" && row.subcategory === "2026",
    );
    if (enactedExpense?.amount100mYen !== 96_530) {
      errors.push("general-account enacted expense must be 96530");
    }
  }

  return errors;
};
