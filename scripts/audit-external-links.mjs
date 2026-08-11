import { OFFICIAL_CONTACTS } from "../features/find-participation-route/official-contacts.ts";
import { PARTICIPATION_TOPICS } from "../features/find-participation-route/participation-topics.ts";
import { BUDGET_CATEGORIES } from "../features/simulate-budget/budget-categories.ts";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("audit", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const paths = [
  "/",
  "/budget-process",
  "/participation",
  "/sources",
  "/about",
  "/fiscal-context",
  ...BUDGET_CATEGORIES.map(category => `/budget/${category.id}`),
  ...BUDGET_CATEGORIES.map(category => `/participation?category=${category.id}`),
];
const environment = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};
const executionContext = {
  waitUntil() {},
  passThroughOnException() {},
};
const externalUrls = new Set();

for (const contact of Object.values(OFFICIAL_CONTACTS)) {
  externalUrls.add(contact.contactUrl);
  externalUrls.add(contact.contactSourceUrl);
}
for (const topic of PARTICIPATION_TOPICS) {
  for (const relation of topic.bureauRelations) {
    externalUrls.add(relation.relationSourceUrl);
  }
}

for (const path of paths) {
  const response = await worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    environment,
    executionContext,
  );
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);

  const html = (await response.text()).replaceAll("&amp;", "&");
  const links = html.match(/<a(?=[^>]*target="_blank")[^>]*href="([^"]+)"[^>]*>/g) ?? [];
  for (const link of links) {
    const href = link.match(/href="([^"]+)"/)?.[1];
    if (href?.startsWith("https://")) externalUrls.add(href);
  }
}

const urls = [...externalUrls].sort();
const results = [];
const concurrency = 5;

for (let index = 0; index < urls.length; index += concurrency) {
  const batch = urls.slice(index, index + concurrency);
  results.push(...await Promise.all(batch.map(async url => {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        headers: {
          range: "bytes=0-0",
          "user-agent": "TokyoBudgetSimulator-LinkAudit/0.1",
        },
      });
      await response.body?.cancel();
      return {
        url,
        status: response.status,
        finalUrl: response.url,
        reachable: response.status < 400 || [401, 403, 405, 429].includes(response.status),
      };
    } catch (error) {
      return {
        url,
        error: error instanceof Error ? error.message : String(error),
        reachable: false,
      };
    }
  })));
}

for (const result of results) console.log(JSON.stringify(result));
const failures = results.filter(result => !result.reachable);
console.log(`Checked ${results.length} unique external links; ${failures.length} failed.`);
if (failures.length > 0) process.exitCode = 1;
