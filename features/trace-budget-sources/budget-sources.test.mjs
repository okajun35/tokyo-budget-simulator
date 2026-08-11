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

test("records what each source is and where the app uses it", () => {
  for (const source of BUDGET_SOURCES) {
    assert.ok(source.sourceType.length > 0);
    assert.ok(source.license.length > 0);
    assert.ok(source.targetPage.length > 0);
    assert.ok(source.targetTableOrItem.length > 0);
    assert.ok(source.appUsage.length > 0);
  }
});

test("distinguishes the usage terms of each official source site", () => {
  const csvSource = BUDGET_SOURCES.find(source => source.id === "csv");
  const evaluationSource = BUDGET_SOURCES.find(source => source.id === "evaluation");
  const financeBureauSource = BUDGET_SOURCES.find(source => source.id === "enacted");
  const assemblySource = BUDGET_SOURCES.find(source => source.id === "assembly-review");

  for (const openDataSource of [csvSource, evaluationSource]) {
    assert.equal(
      openDataSource?.license,
      "クリエイティブ・コモンズ 表示（CC BY 4.0）",
    );
  }
  assert.equal(
    financeBureauSource?.license,
    "東京都財務局サイトポリシー：著作権法上認められる範囲に限り利用可。引用時は「東京都財務局出典」と明記",
  );
  assert.equal(
    assemblySource?.license,
    "東京都議会サイト：著作権法上認められた利用を除き、無断複製・転用不可",
  );
});
