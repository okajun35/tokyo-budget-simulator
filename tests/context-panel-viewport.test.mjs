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

const topPageHtml = async label => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${label}-${process.pid}-${Date.now()}`);
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

  assert.equal(response.status, 200);
  return (await response.text()).replaceAll("<!-- -->", "");
};

test("keeps the sticky context panel inside the viewport", () => {
  const panel = ruleFor(".contextPanel");

  assert.match(panel, /position:sticky/);
  assert.match(panel, /max-height:calc\(100vh - \d+px\)/);
});

test("scrolls the explanation without moving the panel frame", () => {
  const panel = ruleFor(".contextPanel");
  const body = ruleFor(".contextPanelBody");

  assert.doesNotMatch(panel, /overflow/);
  assert.match(panel, /display:flex/);
  assert.match(panel, /flex-direction:column/);
  assert.match(body, /overflow-y:auto/);
  assert.match(body, /overscroll-behavior:contain/);
  assert.match(body, /min-height:0/);
});

test("lets the panel flow with the page once the columns stack", () => {
  const panel = ruleFor(".contextPanel", { inside: 950 });
  const body = ruleFor(".contextPanelBody", { inside: 950 });

  assert.match(panel, /position:relative/);
  assert.match(panel, /max-height:none/);
  assert.match(body, /overflow:visible/);
});

test("keeps the detail route reachable without scrolling the panel", async () => {
  const html = await topPageHtml("panel-foot-route");
  const foot = html.match(/<div class="contextPanelFoot">.*?<\/div><\/aside>/)?.[0];

  assert.ok(foot, "パネル下部の固定領域が見つからない");
  assert.match(foot, /class="detailLink"/);
  assert.match(foot, /class="participationDetailLink"/);
  assert.ok(
    html.indexOf('class="contextPanelBody"') < html.indexOf('class="contextPanelFoot"'),
    "固定領域がスクロール領域の内側にある",
  );
});

test("lets a keyboard user scroll the explanation", async () => {
  const html = await topPageHtml("panel-keyboard");
  const openingTag = html.match(/<div class="contextPanelBody"[^>]*>/)?.[0];

  assert.ok(openingTag, "スクロール領域が見つからない");
  assert.match(openingTag, /tabindex="0"/);
  assert.match(openingTag, /aria-label="選択分野の説明"/);
});
