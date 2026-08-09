import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { validateBudgetData } from "./validate-budget-data.ts";

test("keeps the committed normalized data aligned with the simulator", async () => {
  const dataUrl = new URL(
    "../../data/tokyo-budget/fy2026/normalized/budget-data.json",
    import.meta.url,
  );
  const data = JSON.parse(await readFile(dataUrl, "utf8"));

  assert.deepEqual(validateBudgetData(data), []);
});
