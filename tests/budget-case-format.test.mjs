import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  BUDGET_CASE_CHANGE_TYPE_GROUPS,
  BUDGET_CASE_CHANGE_TYPE_LABELS,
  BUDGET_CASE_SOURCE_KIND_LABELS,
} from "../features/learn-from-budget-cases/budget-case.ts";
import { BUDGET_CASES } from "../features/learn-from-budget-cases/budget-cases.ts";

const fetchHtml = async (path, label) => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${label}-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  return (await response.text()).replaceAll("<!-- -->", "");
};

test("labels a change by what kind of change it was, not by success or failure", () => {
  assert.deepEqual(Object.keys(BUDGET_CASE_CHANGE_TYPE_LABELS), [
    "service_reduction",
    "efficiency_reorganization",
    "burden_shift",
    "deferral",
  ]);
  assert.deepEqual(Object.values(BUDGET_CASE_CHANGE_TYPE_LABELS), [
    "サービス縮小",
    "効率化・再編",
    "負担移転",
    "将来への先送り",
  ]);
});

test("gives every case at least one change type and an internal evidence level", () => {
  for (const budgetCase of BUDGET_CASES) {
    assert.ok(budgetCase.changeTypes.length > 0, budgetCase.id);
    for (const changeType of budgetCase.changeTypes) {
      assert.ok(changeType in BUDGET_CASE_CHANGE_TYPE_LABELS, `${budgetCase.id}: ${changeType}`);
    }
    assert.ok([1, 2, 3, 4].includes(budgetCase.evidenceLevel), budgetCase.id);
    assert.ok(budgetCase.whatChanged.length > 0, budgetCase.id);
    assert.ok(budgetCase.whatRemainsUnknown.length > 0, budgetCase.id);
  }
});

test("keeps the evidence level out of the screen and names the source kind instead", async () => {
  const html = await fetchHtml("/budget/welfare", "case-evidence-internal");

  assert.doesNotMatch(html, /証拠レベル|evidence-level|evidenceLevel/);
  assert.match(html, new RegExp(BUDGET_CASE_SOURCE_KIND_LABELS.national_audit_office));
});

test("reads a case as what changed, what was confirmed, and what is still unknown", async () => {
  const html = await fetchHtml("/budget/welfare", "case-card-sections");
  const englandCase = BUDGET_CASES.find(item => item.id === "case-england-adult-social-care");

  assert.match(html, /何を変えた/);
  assert.match(html, /何が確認された/);
  assert.match(html, /まだ分からないこと/);
  assert.ok(html.includes(englandCase.whatChanged));
  assert.ok(html.includes(englandCase.whatRemainsUnknown));
  assert.ok(
    html.indexOf(englandCase.whatChanged) < html.indexOf(englandCase.whatRemainsUnknown),
    "分からないことが先に来ている",
  );
});

test("groups the four tags by what changed and where the cost moved", async () => {
  const html = await fetchHtml("/budget/welfare", "case-tag-groups");
  const legend = html.match(/<details class="caseTagLegend">[\s\S]*?<\/details>/)?.[0];

  assert.ok(legend, "事例の見方が見つからない");
  for (const group of Object.values(BUDGET_CASE_CHANGE_TYPE_GROUPS)) {
    assert.ok(legend.includes(group.label), group.label);
    for (const changeType of group.changeTypes) {
      assert.ok(
        legend.indexOf(group.label) < legend.indexOf(BUDGET_CASE_CHANGE_TYPE_LABELS[changeType]),
        `${BUDGET_CASE_CHANGE_TYPE_LABELS[changeType]} が ${group.label} より前にある`,
      );
    }
  }
});

test("colours a tag by its group so a scan shows when the cost moved", async () => {
  const html = await fetchHtml("/budget/welfare", "case-tag-group-attribute");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(
    html,
    /<li data-case-change-type="burden_shift" data-case-change-group="where_the_cost_moved">/,
  );
  assert.match(
    html,
    /<li data-case-change-type="service_reduction" data-case-change-group="what_changed">/,
  );
  assert.doesNotMatch(
    css,
    /\[data-case-change-type="[a-z_]+"\][^{]*\{[^}]*background/,
    "タグ単位で色を持っている",
  );
  const colouredGroups = new Set(
    (css.match(/\[data-case-change-group="([a-z_]+)"\]/g) ?? [])
      .map(selector => selector.match(/"([a-z_]+)"/)[1]),
  );

  assert.deepEqual([...colouredGroups], ["where_the_cost_moved"], "既定色から外れるまとまりは1つで足りる");
});

test("explains the four tags next to the cases without a separate page", async () => {
  const html = await fetchHtml("/budget/welfare", "case-tag-legend");
  const legend = html.match(/<details class="caseTagLegend">[\s\S]*?<\/details>/)?.[0];

  assert.ok(legend, "事例の見方が見つからない");
  assert.match(legend, /事例の見方/);
  for (const label of Object.values(BUDGET_CASE_CHANGE_TYPE_LABELS)) {
    assert.ok(legend.includes(label), label);
  }
});
