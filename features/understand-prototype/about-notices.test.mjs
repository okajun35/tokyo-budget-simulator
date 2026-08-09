import assert from "node:assert/strict";
import test from "node:test";

import {
  ABOUT_NOTICES,
  ABOUT_DATA_RETRIEVED_AT,
} from "./about-notices.ts";

test("covers the six limits needed to interpret the prototype safely", () => {
  assert.deepEqual(
    ABOUT_NOTICES.map(notice => notice.id),
    [
      "virtual-allocation",
      "aggregate-category",
      "case-not-prediction",
      "no-generated-outcomes",
      "rounding",
      "link-changes",
    ],
  );

  for (const notice of ABOUT_NOTICES) {
    assert.ok(notice.title.length > 0);
    assert.ok(notice.description.length >= 40);
  }
});

test("publishes the latest retrieval date shown to readers", () => {
  assert.equal(ABOUT_DATA_RETRIEVED_AT, "2026-08-09");
});
