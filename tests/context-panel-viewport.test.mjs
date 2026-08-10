import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

const ruleFor = (selector, { inside } = {}) => {
  const source = inside
    ? css.match(new RegExp(`@media \\(max-width:${inside}px\\)[^\\n]*`))?.[0] ?? ""
    : css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");
  const rule = source.match(new RegExp(`\\${selector}\\s*\\{([^{}]*)\\}`))?.[1];

  assert.ok(rule, `${selector} の宣言が見つからない${inside ? `（${inside}px）` : ""}`);
  return rule;
};

test("keeps the sticky context panel inside the viewport", () => {
  const panel = ruleFor(".contextPanel");

  assert.match(panel, /position:sticky/);
  assert.match(panel, /max-height:calc\(100vh - \d+px\)/);
  assert.match(panel, /overflow-y:auto/);
});

test("stops the panel scroll from taking over the page scroll", () => {
  assert.match(ruleFor(".contextPanel"), /overscroll-behavior:contain/);
});

test("lets the panel flow with the page once the columns stack", () => {
  const panel = ruleFor(".contextPanel", { inside: 950 });

  assert.match(panel, /position:relative/);
  assert.match(panel, /max-height:none/);
  assert.match(panel, /overflow:visible/);
});

test("lets a keyboard user scroll the panel", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `panel-keyboard-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
  const html = await response.text();
  const openingTag = html.match(/<aside class="contextPanel"[^>]*>/)?.[0];

  assert.ok(openingTag, "選択分野のパネルが見つからない");
  assert.match(openingTag, /tabindex="0"/);
  assert.match(openingTag, /aria-label="選択分野の変更の意味"/);
});
