import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_CSV_RESOURCES } from "./budget-csv-resources.ts";

test("identifies the eight official CSV resources used by the app", () => {
  assert.deepEqual(
    BUDGET_CSV_RESOURCES.map(resource => resource.id),
    [
      "general-account",
      "purpose-breakdown",
      "nature-breakdown",
      "revenue-breakdown",
      "tax-breakdown",
      "fund-balance",
      "fund-changes",
      "bond-balance",
    ],
  );

  for (const resource of BUDGET_CSV_RESOURCES) {
    assert.match(
      resource.url,
      /^https:\/\/www\.opendata\.metro\.tokyo\.lg\.jp\/zaimu\/R6\/.*\.csv$/,
    );
    assert.match(resource.fileName, /^[a-z0-9-]+\.csv$/);
  }
});
