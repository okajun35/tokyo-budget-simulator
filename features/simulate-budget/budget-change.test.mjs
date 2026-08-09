import assert from "node:assert/strict";
import test from "node:test";

import { describeBudgetChange } from "./budget-change.ts";

test("describes a 30 percent decrease with explicit minus signs", () => {
  assert.deepEqual(describeBudgetChange(1_000, 700), {
    amount100mYen: -300,
    ratePercent: -30,
    direction: "decrease",
    amountLabel: "-300億円",
    rateLabel: "-30.0%",
  });
});

test("describes an increase with explicit plus signs", () => {
  assert.deepEqual(describeBudgetChange(1_000, 1_300), {
    amount100mYen: 300,
    ratePercent: 30,
    direction: "increase",
    amountLabel: "+300億円",
    rateLabel: "+30.0%",
  });
});

test("describes an unchanged allocation without relying on color", () => {
  assert.deepEqual(describeBudgetChange(1_000, 1_000), {
    amount100mYen: 0,
    ratePercent: 0,
    direction: "unchanged",
    amountLabel: "±0億円",
    rateLabel: "±0.0%",
  });
});
