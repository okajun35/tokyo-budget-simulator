import assert from "node:assert/strict";
import test from "node:test";

import { FISCAL_CONTEXTS } from "./fiscal-contexts.ts";

test("explains what each fiscal condition is and why it is outside the simulator controls", () => {
  assert.deepEqual(
    FISCAL_CONTEXTS.map(context => context.id),
    ["fund", "bond", "tax"],
  );

  for (const context of FISCAL_CONTEXTS) {
    assert.ok(context.summary.length >= 35);
    assert.ok(context.simulatorReason.length >= 35);
    assert.ok(context.changeEffect.length >= 35);
    assert.equal(context.sourceId, "enacted");
  }
});
