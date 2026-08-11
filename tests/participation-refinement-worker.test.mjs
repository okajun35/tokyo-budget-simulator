import assert from "node:assert/strict";
import test from "node:test";

test("routes refinement through the Worker with mocked bindings and security headers", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `participation-refinement-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const aiCalls = [];
  const response = await worker.fetch(
    new Request("https://example.test/api/participation/refine", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://example.test",
        "cf-connecting-ip": "203.0.113.8",
      },
      body: JSON.stringify({
        concern: "給食費が上がり、家庭の負担が増えている。",
        requestedAction: "支援・サービスを増やしてほしい",
        reason: "経済状況による教育環境の差を小さくしたいから。",
      }),
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
      AI: {
        async run(model, options) {
          aiCalls.push({ model, options });
          return { response: "給食費が上がり、家庭の負担が増えていると感じています。支援を増やしてほしいです。経済状況による教育環境の差を小さくしたいからです。" };
        },
      },
      AI_GLOBAL_RATE_LIMITER: { async limit() { return { success: true }; } },
      AI_CLIENT_RATE_LIMITER: { async limit() { return { success: true }; } },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(aiCalls.length, 1);
  assert.deepEqual(Object.keys(await response.json()), ["refinedText"]);
});
