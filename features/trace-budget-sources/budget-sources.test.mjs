import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_SOURCES } from "./budget-sources.ts";

test("keeps each budget source uniquely traceable", () => {
  const ids = BUDGET_SOURCES.map((source) => source.id);

  assert.equal(BUDGET_SOURCES.length, 13);
  assert.equal(new Set(ids).size, ids.length);
});

test("identifies the fiscal year, document stage, and official URL", () => {
  for (const source of BUDGET_SOURCES) {
    assert.equal(source.fiscalYear, 2026);
    assert.ok(source.documentStage.length > 0);
    assert.match(source.sourceUrl, /^https:\/\//);
  }
});
