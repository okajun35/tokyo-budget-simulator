import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_PROCESS_OVERVIEW_STEPS } from "./budget-process-steps.ts";

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
