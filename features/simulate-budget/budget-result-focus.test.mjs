import assert from "node:assert/strict";
import test from "node:test";

import {
  createBudgetResultChangeId,
  restoreBudgetResultCardFocus,
} from "./budget-result-focus.ts";

test("focuses and scrolls the result card named by the URL fragment", () => {
  const calls = [];
  const target = {
    focus: options => calls.push(["focus", options]),
    scrollIntoView: options => calls.push(["scroll", options]),
  };

  const restored = restoreBudgetResultCardFocus(
    "#budget-result-change-education",
    id => id === createBudgetResultChangeId("education") ? target : null,
  );

  assert.equal(restored, true);
  assert.deepEqual(calls, [
    ["focus", { preventScroll: true }],
    ["scroll", { behavior: "auto", block: "center" }],
  ]);
});

test("ignores unrelated or missing result-card fragments", () => {
  let lookupCount = 0;
  const findTarget = () => {
    lookupCount += 1;
    return null;
  };

  assert.equal(restoreBudgetResultCardFocus("#simulator", findTarget), false);
  assert.equal(
    restoreBudgetResultCardFocus("#budget-result-change-welfare", findTarget),
    false,
  );
  assert.equal(lookupCount, 1);
});
