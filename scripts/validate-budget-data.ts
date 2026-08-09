import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  validateBudgetData,
} from "../features/prepare-budget-data/validate-budget-data.ts";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = resolve(
  repositoryRoot,
  "data/tokyo-budget/fy2026/normalized/budget-data.json",
);
const data = JSON.parse(await readFile(dataPath, "utf8"));
const errors = validateBudgetData(data);

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log("Validated FY2026 data: 8 resources, 9 categories, total 96530.");
}
