import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeBudgetCsv,
  parseCsv,
} from "./normalize-budget-csv.ts";

test("parses quoted commas and escaped quotes in CSV", () => {
  assert.deepEqual(
    parseCsv('年度,区分,金額（億円）,内容\r\n2026,福祉と保健,"18,730","説明に""引用"",あり"\r\n'),
    [
      ["年度", "区分", "金額（億円）", "内容"],
      ["2026", "福祉と保健", "18,730", '説明に"引用",あり'],
    ],
  );
});

test("normalizes FY2026 rows, headers, and 100-million-yen amounts", () => {
  const csv = [
    "年度,区分,区分２,金額（億円）",
    "2025,都税収入,法人二税,70000",
    '2026,都税収入,法人二税,"73,856"',
  ].join("\r\n");

  assert.deepEqual(normalizeBudgetCsv(csv, 2026), [
    {
      fiscalYear: 2026,
      category: "都税収入",
      subcategory: "法人二税",
      amount100mYen: 73_856,
    },
  ]);
});

test("normalizes bond balance and issuance columns as numeric amounts", () => {
  const csv = [
    "年度,都債残高（億円）,都債発行額（億円）",
    '2026,"42,372","2,226"',
  ].join("\n");

  assert.deepEqual(normalizeBudgetCsv(csv, 2026), [
    {
      fiscalYear: 2026,
      bondBalance100mYen: 42_372,
      bondIssuance100mYen: 2_226,
    },
  ]);
});
