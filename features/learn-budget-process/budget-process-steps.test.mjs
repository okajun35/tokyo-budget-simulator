import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_SOURCES } from "../trace-budget-sources/budget-sources.ts";
import {
  BUDGET_PROCESS_OVERVIEW_STEPS,
  BUDGET_PROCESS_SUMMARY_STEPS,
  BUDGET_PROCESS_STEPS,
} from "./budget-process-steps.ts";

test("covers the full path from external requests through evaluation", () => {
  assert.deepEqual(
    BUDGET_PROCESS_STEPS.map((step) => step.documentStage),
    [
      "external_request",
      "request",
      "bureau_assessment",
      "governor_assessment",
      "proposal",
      "assembly_review",
      "enacted_budget",
      "execution",
      "settlement",
      "evaluation",
    ],
  );
});

test("makes actors, decisions, sources, public involvement, and limits explicit", () => {
  const sourceIds = new Set(BUDGET_SOURCES.map((source) => source.id));

  for (const step of BUDGET_PROCESS_STEPS) {
    assert.ok(step.actor.length > 0);
    assert.ok(step.decision.length > 0);
    assert.ok(step.amountChangePossibility.length > 0);
    assert.ok(step.sourceIds.length > 0);
    assert.ok(step.sourceIds.every((sourceId) => sourceIds.has(sourceId)));
    assert.ok(step.publicInvolvement.length > 0);
    assert.ok(step.limitation.length > 0);
  }
});

test("marks the FY2026 settlement as not available yet", () => {
  const settlement = BUDGET_PROCESS_STEPS.find(
    (step) => step.documentStage === "settlement",
  );

  assert.equal(settlement.fiscalYearStatus, "not_available_yet");
  assert.match(settlement.summary, /令和8年度の決算はまだ確定していません/);
});

test("summarizes the top-page path in six understandable stages", () => {
  assert.deepEqual(
    BUDGET_PROCESS_SUMMARY_STEPS.map((step) => step.label),
    [
      "意見・要望",
      "各局予算要求",
      "財務局査定",
      "知事査定・予算案",
      "都議会審議・議決",
      "予算成立",
    ],
  );
});

test("shows the five budget stages currently supported by the overview", () => {
  assert.deepEqual(
    BUDGET_PROCESS_OVERVIEW_STEPS.map((step) => step.documentStage),
    [
      "request",
      "bureau_assessment",
      "governor_assessment",
      "proposal",
      "enacted_budget",
    ],
  );
});

test("explains every stage without treating proposal as enacted budget", () => {
  for (const step of BUDGET_PROCESS_OVERVIEW_STEPS) {
    assert.ok(step.summary.length > 0);
  }

  const proposal = BUDGET_PROCESS_OVERVIEW_STEPS.find(
    (step) => step.documentStage === "proposal",
  );
  assert.match(proposal.summary, /まだ成立予算ではありません/);
});
