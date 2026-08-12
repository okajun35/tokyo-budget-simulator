import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { validateCloudflareDeploymentConfig } from "../scripts/validate-cloudflare-deployment.mjs";

const projectFile = relativePath => new URL(`../${relativePath}`, import.meta.url);

test("keeps the committed Cloudflare Worker contract safe for Git deployments", async () => {
  const sourceConfig = JSON.parse(
    await readFile(projectFile("wrangler.jsonc"), "utf8"),
  );

  assert.doesNotThrow(() =>
    validateCloudflareDeploymentConfig(sourceConfig, {
      expectedMain: "./worker/index.ts",
      requireGeneratedAssets: false,
    }),
  );
});

test("rejects a generated deployment that loses a required rate limiter", () => {
  const incompleteConfig = {
    name: "tokyo-budget-simulator",
    main: "index.js",
    compatibility_date: "2026-08-12",
    compatibility_flags: ["nodejs_compat"],
    workers_dev: true,
    preview_urls: true,
    ai: { binding: "AI" },
    ratelimits: [
      {
        name: "AI_GLOBAL_RATE_LIMITER",
        namespace_id: "1001",
        simple: { limit: 10, period: 60 },
      },
    ],
    assets: { directory: "../client" },
  };

  assert.throws(
    () =>
      validateCloudflareDeploymentConfig(incompleteConfig, {
        expectedMain: "index.js",
        requireGeneratedAssets: true,
      }),
    /AI_CLIENT_RATE_LIMITER/,
  );
});

test("exposes Cloudflare Builds commands that deploy only the verified artifact", async () => {
  const packageJson = JSON.parse(
    await readFile(projectFile("package.json"), "utf8"),
  );

  assert.equal(
    packageJson.scripts["verify:cloudflare"],
    "npm test && npm run lint && npm run validate:cloudflare",
  );
  assert.equal(
    packageJson.scripts["deploy:cloudflare"],
    "npm run validate:cloudflare && bash scripts/sites-env.sh -- wrangler deploy --config dist/server/wrangler.json",
  );
  assert.equal(
    packageJson.scripts["preview:cloudflare"],
    "npm run validate:cloudflare && bash scripts/sites-env.sh -- wrangler versions upload --config dist/server/wrangler.json",
  );
});
