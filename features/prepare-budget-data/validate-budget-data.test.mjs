import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_CSV_RESOURCES } from "./budget-csv-resources.ts";
import { validateBudgetData } from "./validate-budget-data.ts";

const purposeRows = [
  ["福祉と保健", 18_730],
  ["教育と文化", 15_922],
  ["労働と経済", 7_822],
  ["生活環境", 4_813],
  ["都市の整備", 9_823],
  ["警察と消防", 10_575],
  ["企画・総務", 4_993],
  ["公債費", 2_799],
  ["税連動経費等", 21_053],
].map(([category, amount100mYen]) => ({
  fiscalYear: 2026,
  category,
  amount100mYen,
}));

const validData = () => ({
  schemaVersion: 1,
  fiscalYear: 2026,
  amountUnit: "100_million_yen",
  resources: BUDGET_CSV_RESOURCES.map(resource => ({
    id: resource.id,
    rows: resource.id === "purpose-breakdown"
      ? purposeRows
      : resource.id === "general-account"
        ? [{ fiscalYear: 2026, category: "歳出", subcategory: "2026", amount100mYen: 96_530 }]
        : [{ fiscalYear: 2026, category: "確認用", amount100mYen: 1 }],
  })),
});

test("accepts the normalized FY2026 data and simulator total", () => {
  assert.deepEqual(validateBudgetData(validData()), []);
});

test("reports a missing resource, wrong year, and wrong category total", () => {
  const data = validData();
  data.fiscalYear = 2025;
  data.resources.pop();
  data.resources.find(resource => resource.id === "purpose-breakdown")
    .rows[0].amount100mYen = 1;

  assert.deepEqual(validateBudgetData(data), [
    "fiscalYear must be 2026",
    "missing resource: bond-balance",
    "purpose-breakdown total must be 96530, received 77801",
    "purpose-breakdown must match the nine simulator categories",
  ]);
});
