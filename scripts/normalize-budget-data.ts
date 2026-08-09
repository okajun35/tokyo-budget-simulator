import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BUDGET_CSV_DATASET_URL,
  BUDGET_CSV_RESOURCES,
} from "../features/prepare-budget-data/budget-csv-resources.ts";
import {
  normalizeBudgetCsv,
} from "../features/prepare-budget-data/normalize-budget-csv.ts";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rawDirectory = resolve(
  repositoryRoot,
  "data/tokyo-budget/fy2026/raw",
);
const normalizedDirectory = resolve(
  repositoryRoot,
  "data/tokyo-budget/fy2026/normalized",
);
const metadata = JSON.parse(
  await readFile(resolve(rawDirectory, "fetch-metadata.json"), "utf8"),
);

const resources = await Promise.all(
  BUDGET_CSV_RESOURCES.map(async resource => {
    const rawData = await readFile(resolve(rawDirectory, resource.fileName));
    const csv = new TextDecoder("shift_jis").decode(rawData);
    return {
      id: resource.id,
      title: resource.title,
      sourceUrl: resource.url,
      rows: normalizeBudgetCsv(csv, 2026),
    };
  }),
);

await mkdir(normalizedDirectory, { recursive: true });
await writeFile(
  resolve(normalizedDirectory, "budget-data.json"),
  `${JSON.stringify({
    schemaVersion: 1,
    fiscalYear: 2026,
    amountUnit: "100_million_yen",
    sourceEncoding: "Shift_JIS",
    normalizedEncoding: "UTF-8",
    datasetUrl: BUDGET_CSV_DATASET_URL,
    retrievedAt: metadata.retrievedAt,
    resources,
  }, null, 2)}\n`,
  "utf8",
);

console.log(`Normalized ${resources.length} resources for FY2026.`);
