import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_CATEGORIES } from "../features/simulate-budget/budget-categories.ts";
import {
  PROTOTYPE_EXPERIENCE_STAGES,
  PROTOTYPE_NON_GOALS,
  PROTOTYPE_PURPOSE_STATEMENT,
} from "../features/understand-prototype/prototype-purpose.ts";

const fetchAboutHtml = async label => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${label}-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/about", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  return (await response.text()).replaceAll("<!-- -->", "");
};

test("describes the experience as four stages that each lead into the site", () => {
  assert.deepEqual(
    PROTOTYPE_EXPERIENCE_STAGES.map(stage => stage.label),
    ["見る", "動かす", "意味を知る", "現実につなぐ"],
  );
  for (const stage of PROTOTYPE_EXPERIENCE_STAGES) {
    assert.match(stage.routeHref, /^\//, stage.label);
    assert.ok(stage.routeLabel.length > 0, stage.label);
    assert.ok(stage.summary.length > 0, stage.label);
  }
});

test("states what the prototype is for before how to read it", async () => {
  const html = await fetchAboutHtml("about-purpose-order");

  assert.ok(html.includes(PROTOTYPE_PURPOSE_STATEMENT), "ひとことの定義がない");
  for (const stage of PROTOTYPE_EXPERIENCE_STAGES) {
    assert.ok(html.includes(stage.summary), `${stage.label} の説明がない`);
    assert.match(
      html,
      new RegExp(`<a(?=[^>]*href="${stage.routeHref.replace("#", "#")}")[^>]*>${stage.routeLabel}`),
      `${stage.label} の導線がない`,
    );
  }
  assert.ok(
    html.indexOf(PROTOTYPE_PURPOSE_STATEMENT) < html.indexOf("数字と事例を読むときの注意"),
    "目的が読み方の注意より後ろにある",
  );
});

test("states the positioning once instead of repeating a weaker version", async () => {
  const html = await fetchAboutHtml("about-single-positioning");

  assert.ok(html.includes(PROTOTYPE_PURPOSE_STATEMENT));
  assert.doesNotMatch(html, /調べる・動かす・参加先を知るための入口/);
  assert.match(html, /意見や個人情報を保存も送信もしません/);
});

test("states what the prototype does not try to do", async () => {
  const html = await fetchAboutHtml("about-non-goals");

  assert.ok(PROTOTYPE_NON_GOALS.length >= 4);
  for (const nonGoal of PROTOTYPE_NON_GOALS) {
    assert.ok(html.includes(nonGoal.title), nonGoal.id);
    assert.ok(html.includes(nonGoal.description), nonGoal.id);
  }
});

/**
 * 「国内外の公的な実例も含めて知る」と書くなら、どの分野に収録済みかを
 * 数え上げて示す。書き置いた件数が古びないように、収録データから求める。
 */
test("names the fields whose public cases are already collected", async () => {
  const html = await fetchAboutHtml("about-case-coverage");
  const collected = BUDGET_CATEGORIES.filter(category => category.caseIds.length > 0);

  assert.ok(collected.length > 0);
  assert.match(
    html,
    new RegExp(`${collected.length}分野`),
    `収録済み ${collected.length} 分野という記載がない`,
  );

  if (collected.length === BUDGET_CATEGORIES.length) {
    assert.match(html, /すべてに収録/, "全分野に収録済みであることを述べていない");
    assert.doesNotMatch(html, /残る分野では/, "収録済みなのに未収録の断り書きが残っている");
    return;
  }

  for (const category of collected) {
    assert.ok(html.includes(category.name), category.name);
  }
});
