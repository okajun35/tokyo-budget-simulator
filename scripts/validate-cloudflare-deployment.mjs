import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const EXPECTED_NAME = "tokyo-budget-simulator";
const EXPECTED_COMPATIBILITY_DATE = "2026-08-12";
const EXPECTED_RATE_LIMITS = [
  {
    name: "AI_GLOBAL_RATE_LIMITER",
    namespaceId: "1001",
    limit: 10,
    period: 60,
  },
  {
    name: "AI_CLIENT_RATE_LIMITER",
    namespaceId: "1002",
    limit: 3,
    period: 60,
  },
];

const fail = message => {
  throw new Error(`Cloudflare deployment config: ${message}`);
};

export const validateCloudflareDeploymentConfig = (
  config,
  { expectedMain, requireGeneratedAssets },
) => {
  if (config.name !== EXPECTED_NAME) {
    fail(`name must be ${EXPECTED_NAME}`);
  }
  if (config.main !== expectedMain) {
    fail(`main must be ${expectedMain}`);
  }
  if (config.compatibility_date !== EXPECTED_COMPATIBILITY_DATE) {
    fail(`compatibility_date must be ${EXPECTED_COMPATIBILITY_DATE}`);
  }
  if (!config.compatibility_flags?.includes("nodejs_compat")) {
    fail("nodejs_compat must be enabled");
  }
  if (config.workers_dev !== true) {
    fail("workers_dev must stay enabled for the first release and smoke test");
  }
  if (config.preview_urls !== true) {
    fail("preview_urls must stay enabled for branch previews");
  }
  if (config.ai?.binding !== "AI") {
    fail("AI binding is missing");
  }

  for (const expected of EXPECTED_RATE_LIMITS) {
    const actual = config.ratelimits?.find(item => item.name === expected.name);
    if (!actual) {
      fail(`${expected.name} binding is missing`);
    }
    if (
      String(actual.namespace_id) !== expected.namespaceId ||
      actual.simple?.limit !== expected.limit ||
      actual.simple?.period !== expected.period
    ) {
      fail(`${expected.name} does not match the reviewed limit`);
    }
  }

  if (config.observability?.enabled !== true) {
    fail("observability must be enabled for post-release operational checks");
  }
  if (requireGeneratedAssets && config.assets?.directory !== "../client") {
    fail("generated static assets directory must be ../client");
  }
};

const loadJson = async path => JSON.parse(await readFile(path, "utf8"));

const run = async () => {
  const projectRoot = new URL("../", import.meta.url);
  const sourcePath = new URL("wrangler.jsonc", projectRoot);
  const generatedPath = new URL("dist/server/wrangler.json", projectRoot);

  const [sourceConfig, generatedConfig] = await Promise.all([
    loadJson(sourcePath),
    loadJson(generatedPath).catch(error => {
      if (error?.code === "ENOENT") {
        fail("dist/server/wrangler.json is missing; run npm run build first");
      }
      throw error;
    }),
  ]);

  validateCloudflareDeploymentConfig(sourceConfig, {
    expectedMain: "./worker/index.ts",
    requireGeneratedAssets: false,
  });
  validateCloudflareDeploymentConfig(generatedConfig, {
    expectedMain: "index.js",
    requireGeneratedAssets: true,
  });

  console.log(
    "Validated Cloudflare source and generated deployment configs: AI, rate limits, previews, assets, and compatibility settings are present.",
  );
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
