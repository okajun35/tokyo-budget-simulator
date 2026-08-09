import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BUDGET_CSV_DATASET_URL,
  BUDGET_CSV_RESOURCES,
} from "../features/prepare-budget-data/budget-csv-resources.ts";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rawDirectory = resolve(
  repositoryRoot,
  "data/tokyo-budget/fy2026/raw",
);

await mkdir(rawDirectory, { recursive: true });

const retrievedAt = new Date().toISOString();
const fetchedResources = await Promise.all(
  BUDGET_CSV_RESOURCES.map(async resource => {
    const response = await fetch(resource.url, {
      headers: { "user-agent": "TokyoBudgetSimulator-DataRefresh/0.1" },
    });
    if (!response.ok) {
      throw new Error(`${resource.id}: HTTP ${response.status}`);
    }

    const data = new Uint8Array(await response.arrayBuffer());
    await writeFile(resolve(rawDirectory, resource.fileName), data);

    return {
      id: resource.id,
      title: resource.title,
      sourceUrl: resource.url,
      fileName: resource.fileName,
      bytes: data.byteLength,
      contentType: response.headers.get("content-type"),
      lastModified: response.headers.get("last-modified"),
    };
  }),
);

await writeFile(
  resolve(rawDirectory, "fetch-metadata.json"),
  `${JSON.stringify({
    datasetUrl: BUDGET_CSV_DATASET_URL,
    retrievedAt,
    resources: fetchedResources,
  }, null, 2)}\n`,
  "utf8",
);

console.log(`Fetched ${fetchedResources.length} official CSV files.`);
