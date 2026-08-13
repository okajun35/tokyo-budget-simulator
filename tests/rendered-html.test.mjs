import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_CATEGORIES } from "../features/simulate-budget/budget-categories.ts";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

const fetchHtmlForWorker = async (worker, path) => {
  const response = await worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  return (await response.text()).replaceAll("<!-- -->", "");
};

test("renders production metadata without development preview markers", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
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
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  const html = await response.text();
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.match(html, /property="og:title" content="東京予算ラボ/);
});

test("shows the same published FY2027 policy context independently of the selected direction", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `policy-context-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const paths = [
    "/budget/education?amount=16762",
    "/budget/education?amount=15922",
    "/budget/education?amount=15082",
  ];

  for (const path of paths) {
    const html = await fetchHtmlForWorker(worker, path);
    const card = html.match(
      /<section(?=[^>]*data-budget-policy-direction="education")(?=[^>]*data-independent-from-user-change="true")[^>]*>[\s\S]*?<\/section>/,
    )?.[0];

    assert.ok(card, path);
    assert.match(card, /令和9年度に向けて公表されている政策・予算編成方針/);
    assert.match(card, /2027年度アクションプラン/);
    assert.match(card, /公表資料にある例/);
    assert.match(card, /全都立高校でのオンライン英会話/);
    assert.ok(
      card.indexOf("全都立高校でのオンライン英会話") < card.indexOf("<details"),
      "FY2027 examples should remain visible while source links are collapsed",
    );
    assert.match(card, /<summary>公式資料を見る<\/summary>/);
    assert.match(card, /ユーザーの選択に対する評価ではありません/);
    assert.match(card, /目的別予算の増減/);
    assert.match(card, /予算額の確定を示すものではありません/);
  }
});

test("shows compact FY2026 context on the main detail page for all nine categories", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `current-context-all-categories-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const categories = [
    ["welfare", "不妊治療への支援"],
    ["education", "公立学校普通教室の空調更新支援"],
    ["industry", "中小企業の経営力強化"],
    ["environment", "省エネの推進"],
    ["city", "鉄道の連続立体交差"],
    ["safety", "日常の安全確保"],
    ["admin", "東京アプリ"],
    ["debt", "過去に発行した都債の元利償還"],
    ["linked", "税収や制度上の算定"],
  ];

  for (const [categoryId, expectedContext] of categories) {
    const html = await fetchHtmlForWorker(worker, `/budget/${categoryId}`);
    const currentContextIndex = html.indexOf(`data-budget-current-initiatives="${categoryId}"`);
    const userChoiceIndex = html.indexOf('id="options-heading"');

    assert.ok(currentContextIndex >= 0, categoryId);
    assert.ok(currentContextIndex < userChoiceIndex, categoryId);
    assert.match(html, new RegExp(expectedContext));
    assert.match(html, /<summary>令和8年度の公式資料を見る<\/summary>/);
  }
});

test("replaces the unchanged public-case empty state with FY2026 related initiatives", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `current-initiatives-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const html = await fetchHtmlForWorker(
    worker,
    "/budget/education/cases?amount=15922",
  );

  assert.match(html, /data-budget-current-initiatives="education"/);
  assert.match(html, /令和8年度、この分野に関連する取組/);
  assert.match(html, /公立学校普通教室の空調更新支援/);
  assert.match(html, /この分野の予算全体の内訳を示すものではありません/);
  assert.doesNotMatch(
    html,
    /金額据え置きと実質的なサービス変化を安全に対応付けられる代表事例は現在未収録です/,
  );
});

test("introduces the simulator briefly and links straight to the controls", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `intro-${process.pid}-${Date.now()}`);
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

  assert.match(html, /成立後当初予算を基準にした仮想シミュレーション/);
  assert.match(
    html,
    /<a(?=[^>]*href=["']#simulator["'])[^>]*>予算を動かしてみる/,
  );
});

test("offers all four primary navigation destinations", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `navigation-${process.pid}-${Date.now()}`);
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
  const navigation = html.match(/<nav(?=[^>]*aria-label="主要メニュー")[^>]*>.*?<\/nav>/)?.[0];

  assert.ok(navigation);
  assert.match(navigation, />予算シミュレーター</);
  assert.match(
    navigation,
    /<a(?=[^>]*href=["']\/budget-process["'])[^>]*>予算が決まるまで/,
  );
  assert.match(
    navigation,
    /<a(?=[^>]*href=["']\/participation["'])[^>]*>声を届ける/,
  );
  assert.match(
    navigation,
    /<a(?=[^>]*href=["']\/sources["'])[^>]*>出典・データ/,
  );
});

test("renders traceable budget and case sources on an independent page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `sources-page-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/sources", {
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
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /data-sources-page="fy2026"/);
  assert.equal(html.match(/data-budget-source=/g)?.length, 13);
  assert.equal(html.match(/data-budget-case-source=/g)?.length, 20);
  assert.equal(html.match(/data-case-source-direction=/g)?.length, 20);
  for (const label of [
    "資料日・年度",
    "取得日",
    "資料段階",
    "出典種別",
    "ライセンス",
    "対象ページ・項目",
    "アプリ内の使用箇所",
  ]) {
    assert.match(html, new RegExp(label));
  }
  for (const stage of [
    "成立予算",
    "予算案",
    "各局要求",
    "財務局査定",
    "知事査定",
    "政策・事業評価",
    "外部要望",
  ]) {
    assert.match(html, new RegExp(stage));
  }
  assert.match(html, /事実.*?東京都等の一次資料/s);
  assert.match(html, /事例.*?他地域の公的資料/s);
  assert.match(html, /解釈.*?検討例/s);
  assert.match(html, /外部リンク/);
});

test("explains the status and limits of the prototype on an independent page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `about-page-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/about", {
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
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /data-about-page="prototype"/);
  for (const phrase of [
    "東京都の公式サービスではありません",
    "学習・情報探索用の非公式プロトタイプ",
    "実行可能な予算案とは限りません",
    "特定の事業変更を一意に決められません",
    "東京都の結果を予測するものではありません",
    "確認できない成果数値は生成しません",
    "端数処理により公式資料と合計差が生じる可能性",
    "リンク先は更新・移動する可能性",
    "データ取得日",
    "2026-08-09",
  ]) {
    assert.match(html, new RegExp(phrase));
  }
  assert.equal(html.match(/data-about-notice=/g)?.length, 6);
  assert.match(html, /href="\/sources"/);
});

test("explains the fiscal conditions and their relationship to the simulator on an independent page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `fiscal-context-page-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/fiscal-context", {
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
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /data-fiscal-context-page="fy2026"/);
  assert.match(html, /歳入・財源.*?年間総予算.*?9分野の歳出配分/s);
  assert.match(html, /変えられないという意味ではありません/);
  assert.equal(html.match(/data-fiscal-context-detail=/g)?.length, 3);
  for (const phrase of [
    "基金",
    "都債",
    "都税",
    "どんな仕組みか",
    "増減すると何が起こるか",
    "このシミュレーターで操作しない理由",
    "令和8年度の数値",
    "東京都の公式資料を確認する（外部リンク）",
  ]) {
    assert.match(html, new RegExp(phrase));
  }
});

test("renders the topic-first participation workspace without inventing a simulation change", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `participation-page-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/participation?category=education", {
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
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /data-participation-page="education"/);
  assert.match(html, /あなたの変更.*?教育と文化/);
  assert.match(html, /シミュレーターでの変更額を確認できません/);
  assert.match(html, /どの話について？/);
  assert.equal(html.match(/data-participation-topic=/g)?.length, 7);
  for (const label of [
    "都立学校・教育行政・教職員",
    "給食・教育内容・ICT",
    "私立学校",
    "文化・文化事業",
    "スポーツ",
    "その他",
  ]) {
    assert.match(html, new RegExp(label));
  }
  assert.match(html, /テーマを選ぶと、主な所管と確認済みの公式ルートを表示します/);
  assert.doesNotMatch(html, /何が気になっていますか？/);
  assert.doesNotMatch(html, /入力内容を確認する/);
  assert.match(html, /東京都議会への意見・要望/);
  assert.match(html, /現在募集されている計画等を見る/);
});

test("renders opinion drafting on a focused page with the selected topic", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `participation-prepare-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/participation/prepare?category=education&topic=school-meals-curriculum-ict", {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /data-participation-prepare="education"/);
  assert.match(html, /あなたの考えを整理する/);
  assert.match(html, /給食・教育内容・ICT/);
  assert.match(html, /東京都教育委員会（教育庁）/);
  assert.match(html, /シミュレーターでの変更額を確認できません/);
  assert.match(html, /何が気になっていますか？/);
  assert.match(html, /東京都に何をしてほしいですか？/);
  assert.match(html, /なぜそう思いますか？/);
  assert.match(html, /氏名・住所などの個人情報は入力しないでください/);
  assert.match(html, /入力内容はURL・ブラウザ保存領域・DB・分析基盤へ保存しません/);
  assert.match(html, /AI推敲を使わない限り外部通信せず/);
  assert.doesNotMatch(html, /ほかの方法/);
});

test("does not guess a topic or bureau for an invalid drafting URL", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `participation-prepare-invalid-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/participation/prepare?category=education&topic=unknown", {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /テーマを確認できません/);
  assert.match(html, /不明なテーマを特定の所管へ割り当てることはしません/);
  assert.doesNotMatch(html, /何が気になっていますか？/);
});

test("renders the complete FY2026 budget process on an independent page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `budget-process-page-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/budget-process", {
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
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /data-budget-process-page="fy2026"/);
  assert.equal(html.match(/data-budget-process-stage=/g)?.length, 10);
  for (const heading of [
    "意見・要望",
    "各局要求",
    "財務局査定",
    "知事査定",
    "予算案",
    "都議会審議",
    "成立予算",
    "事業執行",
    "決算",
    "政策・事業評価",
  ]) {
    assert.match(html, new RegExp(heading));
  }
  for (const label of [
    "誰が行うか",
    "何を判断するか",
    "金額や事業が変わる可能性",
    "都民が関与できるか",
    "制度上の限界",
    "令和8年度の公式資料",
  ]) {
    assert.match(html, new RegExp(label));
  }
  assert.match(html, /外部要望は東京都の確定政策ではありません/);
  assert.match(html, /財務局査定と知事査定は別の段階です/);
  assert.match(html, /予算案は成立予算ではありません/);
  assert.match(html, /令和8年度の決算はまだ確定していません/);
});

test("shows the fiscal year, general account, and main revenue at the top", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `overview-${process.pid}-${Date.now()}`);
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
  const overview = html.match(
    /<div class="overviewCards" aria-label="令和8年度予算の概要">.*?<\/div><\/section>/,
  )?.[0];

  assert.ok(overview);
  assert.match(overview, /対象年度/);
  assert.match(overview, /令和8年度/);
  assert.match(overview, /一般会計総額/);
  assert.match(overview, /9兆6,530億円/);
  assert.match(overview, /主要財源・都税/);
  assert.match(overview, /7兆3,856億円/);
});

test("explains each fiscal condition on the top page and links to its detail", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `fiscal-cards-${process.pid}-${Date.now()}`);
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
  const html = (await response.text()).replaceAll("<!-- -->", "");
  const fiscalFacts = html.match(/<section class="fiscalFacts">.*?<\/section>/s)?.[0];

  assert.ok(fiscalFacts);
  assert.match(fiscalFacts, /実際には変化しますが/);
  assert.match(fiscalFacts, /9分野の歳出とは性質が異な/);
  assert.equal(fiscalFacts.match(/data-fiscal-context-card=/g)?.length, 3);
  for (const [id, name] of [["fund", "基金"], ["bond", "都債"], ["tax", "都税"]]) {
    assert.match(fiscalFacts, new RegExp(`${name}.*?どんなもの.*?この画面で動かさない理由`, "s"));
    assert.match(fiscalFacts, new RegExp(`href="/fiscal-context#${id}"`));
  }
});

test("places budget controls and category meaning in one workspace", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `workspace-${process.pid}-${Date.now()}`);
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

  assert.match(
    html,
    /<div class="simulatorWorkspace"><section class="budgetControls" aria-label="9分野の予算操作">/,
  );
  assert.match(
    html,
    /<aside class="contextPanel"[^>]*aria-label="選択分野の変更の意味"/,
  );
});

test("shows enacted and proposed amounts with the change in all nine rows", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `rows-${process.pid}-${Date.now()}`);
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

  assert.equal(html.match(/data-budget-category=/g)?.length, 9);
  assert.match(html, /成立予算/);
  assert.match(html, /あなたの案/);
  assert.match(html, /±0億円/);
  assert.match(html, /±0\.0%/);
});

test("identifies exactly one selected budget row without relying on color", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `selected-${process.pid}-${Date.now()}`);
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

  assert.equal(html.match(/aria-current="true"/g)?.length, 1);
  assert.equal(html.match(/>選択中</g)?.length, 1);
});

test("offers a keyboard-operable selection control for every budget row", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `budget-select-controls-${process.pid}-${Date.now()}`);
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

  assert.equal(html.match(/data-budget-select-control=/g)?.length, 9);
  assert.equal(html.match(/aria-pressed="true"/g)?.length, 1);
  assert.equal(html.match(/aria-pressed="false"/g)?.length, 8);
  assert.equal(html.match(/class="budgetRowSelectSurface"/g)?.length, 9);

  for (const category of BUDGET_CATEGORIES) {
    assert.match(
      html,
      new RegExp(
        `data-budget-select-control="${category.id}"[^>]*aria-label="${category.name}を選択"`,
      ),
    );
  }
});

test("visibly labels every link that opens an external site", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `external-link-labels-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const paths = [
    "/",
    "/budget/debt?amount=1959",
    "/budget-process",
    "/participation?category=debt",
    "/sources",
  ];

  for (const path of paths) {
    const response = await worker.fetch(
      new Request(`http://localhost${path}`, {
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
    const html = (await response.text()).replaceAll("<!-- -->", "");
    const externalLinks = html.match(/<a(?=[^>]*target="_blank")[^>]*>.*?<\/a>/g) ?? [];

    assert.ok(externalLinks.length > 0, `expected external links on ${path}`);
    for (const link of externalLinks) {
      assert.match(link, /外部リンク/, `${path}: ${link}`);
    }
  }
});

test("offers one detail cue for the selected category", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `detail-cue-${process.pid}-${Date.now()}`);
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

  assert.equal(html.match(/href="#category-context"/g)?.length, 1);
  assert.equal(html.match(/>この変更の意味を見る</g)?.length, 1);
});

test("shows the selected category and its complete comparison in the context panel", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `context-comparison-${process.pid}-${Date.now()}`);
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
  const panel = html.match(
    /<aside class="contextPanel"[^>]*>.*?<\/aside>/,
  )?.[0];

  assert.ok(panel);
  assert.match(panel, /<h2>福祉と保健<\/h2>/);
  assert.match(panel, /令和8年度当初予算.*?18,730億円/);
  assert.match(panel, /あなたの案.*?18,730億円/);
  assert.match(panel, /変更額.*?±0億円/);
  assert.match(panel, /変更率.*?±0\.0%/);
});

test("carries the selected category and amount to its detail page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `context-detail-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const env = {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  };
  const executionContext = {
    waitUntil() {},
    passThroughOnException() {},
  };

  const homeResponse = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    env,
    executionContext,
  );
  const homeHtml = await homeResponse.text();
  const panel = homeHtml.match(
    /<aside class="contextPanel"[^>]*>.*?<\/aside>/,
  )?.[0];

  assert.ok(panel);
  assert.match(
    panel,
    /<a class="detailLink" href="\/budget\/welfare\?[^"']*category=welfare[^"']*amount=18730">詳しく見る/,
  );

  const detailResponse = await worker.fetch(
    new Request("http://localhost/budget/welfare?amount=18730", {
      headers: { accept: "text/html" },
    }),
    env,
    executionContext,
  );
  const detailHtml = await detailResponse.text();

  assert.equal(detailResponse.status, 200);
  assert.match(detailHtml, /福祉と保健/);
  assert.match(detailHtml, /あなたの案.*?18,730億円/);
});

test("offers a direct detail route from every mobile budget card", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `mobile-detail-links-${process.pid}-${Date.now()}`);
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
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(html.match(/data-mobile-detail-link=/g)?.length, 9);
  assert.match(
    html,
    /data-mobile-detail-link="debt"[^>]*href="\/budget\/debt\?[^"']*category=debt[^"']*amount=2799"[^>]*>詳しく見る/,
  );
});

test("labels the detail page return route as going back to the budget", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `detail-return-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/budget/debt?amount=2799", {
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

  assert.match(html, /href="\/#simulator"[^>]*>← 予算に戻る/);
});

test("renders the shared detail route for all nine budget categories", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `detail-routes-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const categoryIds = [
    "welfare",
    "education",
    "industry",
    "environment",
    "city",
    "safety",
    "admin",
    "debt",
    "linked",
  ];

  for (const categoryId of categoryIds) {
    const response = await worker.fetch(
      new Request(`http://localhost/budget/${categoryId}`, {
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

    assert.equal(response.status, 200);
    assert.match(html, new RegExp(`data-budget-detail="${categoryId}"`));
  }
});

test("renders the complete minimum detail for the remaining six categories", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `remaining-details-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const expectedTextByCategory = {
    industry: "貸付原資、補助金、相談・訓練、情報発信",
    environment: "設備補助、調査・監視、普及啓発、施設運営",
    city: "新設、用地取得、更新、点検・補修",
    safety: "人員配置、日常の運用、施設維持、装備更新",
    admin: "複数分野を支える基盤経費や法令上必要な事務",
    linked: "東京都が使途や金額を単独で自由に決められるとは限りません",
  };

  for (const [categoryId, expectedText] of Object.entries(
    expectedTextByCategory,
  )) {
    const response = await worker.fetch(
      new Request(`http://localhost/budget/${categoryId}`, {
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
    const html = (await response.text()).replaceAll("<!-- -->", "");
    const casesResponse = await worker.fetch(
      new Request(`http://localhost/budget/${categoryId}/cases`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    const materialsResponse = await worker.fetch(
      new Request(`http://localhost/budget/${categoryId}/materials`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    const casesHtml = (await casesResponse.text()).replaceAll("<!-- -->", "");
    const materialsHtml = (await materialsResponse.text()).replaceAll("<!-- -->", "");
    const sourceSection = materialsHtml.match(
      /aria-labelledby="sources-heading".*?<\/section>/,
    )?.[0];

    assert.equal(response.status, 200);
    assert.match(html, new RegExp(expectedText));
    assert.match(html, /公開情報だけでは判断できません/);
    assert.match(casesHtml, new RegExp(`data-budget-current-initiatives="${categoryId}"`));
    assert.match(casesHtml, /この分野の予算全体の内訳を示すものではありません/);
    assert.ok(sourceSection);
    assert.equal(sourceSection.match(/公式資料を開く/g)?.length, 2);
  }
});

test("falls back safely when the detail amount is invalid or outside its range", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `detail-fallback-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  for (const amount of ["invalid", "1958", "3640"]) {
    const response = await worker.fetch(
      new Request(`http://localhost/budget/debt?amount=${amount}`, {
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

    assert.match(html, /あなたの案.*?2,799億円/);
    assert.match(html, /指定された金額を利用できないため、令和8年度当初予算額を表示しています/);
  }
});

test("explains fallback amounts on the separate cases and materials pages", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `supplement-fallback-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  for (const path of [
    "/budget/debt/cases?amount=invalid",
    "/budget/debt/materials?amount=3640",
  ]) {
    const html = await fetchHtmlForWorker(worker, path);

    assert.match(html, /あなたの案.*?2,799億円/);
    assert.match(html, /指定された金額を利用できないため、令和8年度当初予算額を表示しています/);
  }
});

test("explains a budget change through the complete shared detail template", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `detail-template-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/budget/debt?amount=1959", {
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
  const normalizedHtml = html.replaceAll("<!-- -->", "");
  const casesHtml = await fetchHtmlForWorker(worker, "/budget/debt/cases?amount=1959");
  const materialsHtml = await fetchHtmlForWorker(worker, "/budget/debt/materials?amount=1959");

  assert.match(normalizedHtml, /令和8年度当初予算.*?2,799億円/);
  assert.match(normalizedHtml, /あなたの案.*?1,959億円/);
  assert.match(normalizedHtml, /変更額.*?-840億円/);
  assert.match(normalizedHtml, /変更率.*?-30\.0%/);
  assert.match(normalizedHtml, /構成比.*?2\.9%.*?2\.0%/);
  assert.match(normalizedHtml, /そもそも何のお金/);
  assert.match(normalizedHtml, /主な用途/);
  assert.match(normalizedHtml, /この840億円を減らすには、何を変える/);
  assert.match(normalizedHtml, /この画面で確かに言える範囲/);
  assert.match(normalizedHtml, /実際の事例を見る/);
  assert.match(normalizedHtml, /東京都の予算編成資料を見る/);
  assert.match(normalizedHtml, /具体的な話題と窓口を選ぶ/);
  assert.match(casesHtml, /他の自治体では、予算を減らして何を変えた/);
  assert.match(materialsHtml, /この予算が決まるまでの資料を見る/);
  assert.match(materialsHtml, /分野に直接対応する資料/);
  assert.match(materialsHtml, /公債費（款）.*?要求額.*?2,801\.14億円.*?前年度.*?2,871\.77億円/s);
  assert.match(materialsHtml, /代表的な財務局査定/);
  assert.match(materialsHtml, /分野全体の査定額ではなく、関連する代表的な事項/);
  assert.match(materialsHtml, /詳しい公式資料/);
  assert.doesNotMatch(normalizedHtml, /意見を伝える先/);
  assert.match(normalizedHtml, /href="\/#simulator"[^>]*>.*?予算に戻る/);
});

test("keeps the main budget detail focused on meaning and constraints", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `focused-detail-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/budget/welfare?amount=15000", {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /そもそも何のお金/);
  assert.match(html, /この3,730億円を減らすには、何を変える/);
  assert.match(html, /減らすときに考えること/);
  assert.match(html, /最後に考えること/);
  assert.match(html, /この変更を、もう少し考える/);
  assert.match(html, /実際の事例を見る/);
  assert.match(html, /東京都の予算編成資料を見る/);
  assert.match(html, /具体的な話題と窓口を選ぶ/);
  assert.doesNotMatch(html, /飯能市の在宅・障害・高齢者福祉事業/);
  assert.doesNotMatch(html, /この予算が決まるまでの資料を見る/);
  assert.doesNotMatch(html, /意見を伝える先/);
});

test("renders public cases on a separate category page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `case-page-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/budget/welfare/cases?amount=15000", {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /data-budget-cases="welfare"/);
  assert.match(html, /福祉と保健の事例/);
  assert.match(html, /他の自治体では、予算を減らして何を変えた/);
  assert.match(html, /飯能市の在宅・障害・高齢者福祉事業/);
  assert.match(html, /イングランドの成人社会福祉支出/);
  assert.match(html, /東京都で同じ結果になるとは限りません/);
  assert.match(html, /data-budget-journey-current="cases"/);
  assert.match(html, /aria-current="step"[^>]*>.*?事例/s);
  assert.match(html, /data-budget-next-from="cases"/);
  assert.match(html, /次に見るなら、東京都の編成資料/);
  assert.match(html, /予算編成資料へ進む/);
  assert.doesNotMatch(html, /なぜ要求額と成立予算をそのまま比較できないの/);
});

test("renders Tokyo formation materials on a separate category page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `materials-page-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/budget/education/materials?amount=15922", {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.equal(response.status, 200);
  assert.match(html, /data-budget-materials="education"/);
  assert.match(html, /教育と文化の予算編成資料/);
  assert.match(html, /なぜ要求額と成立予算をそのまま比較できないの/);
  assert.match(html, /関連する局の予算要求/);
  assert.match(html, /学校給食運営管理.*?357\.19億円.*?546\.87億円/s);
  assert.match(html, /公開資料で確認できる範囲を掲載しています/);
  assert.match(html, /data-budget-journey-current="materials"/);
  assert.match(html, /aria-current="step"[^>]*>.*?編成資料/s);
  assert.match(html, /data-budget-next-from="materials"/);
  assert.match(html, /次は、関心のある話題を具体化する/);
  assert.match(html, /話題と窓口へ進む/);
  assert.match(html, /東京都の予算全体の流れを見る/);
  assert.doesNotMatch(html, /飯能市立図書館のサービス見直し/);
});

test("renders the completed content for debt, welfare, and education", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `detailed-categories-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const cases = [
    {
      path: "/budget/debt?amount=1959",
      patterns: [
        /都債.*?元金.*?利子.*?償還.*?借換え.*?新規発行.*?基金/s,
        /既に発行した都債の返済義務が消えるわけではなく/,
        /新規発行・借換え時の条件/,
        /東京都財務局「債券について」/,
        /夕張市財政再建計画/,
        /プエルトリコの債務危機/,
      ],
    },
    {
      path: "/budget/welfare?amount=15000",
      patterns: [
        /高齢者福祉.*?障害福祉.*?子育て・児童福祉.*?医療提供体制.*?保健・健康施策/s,
        /給付対象や単価/,
        /施設・相談サービスの時間や人員/,
        /補助率や上限額/,
        /飯能市の在宅・障害・高齢者福祉事業/,
        /イングランドの成人社会福祉支出/,
      ],
    },
    {
      path: "/budget/education?amount=16762",
      patterns: [
        /学校運営と教職員.*?学校施設の整備・更新.*?図書館.*?文化施設・文化事業.*?スポーツ・生涯学習/s,
        /教員・支援員を増やす/,
        /給食や教材への補助を増やす/,
        /学校施設を更新する/,
        /ICT・特別支援を拡充する/,
        /GIGAスクール構想による端末整備/,
        /端末を整備しても、対象者の需要把握や貸与・活用の運用が整わなければ利用へ結び付かない/,
      ],
    },
  ];

  for (const detailCase of cases) {
    const response = await worker.fetch(
      new Request(`http://localhost${detailCase.path}`, {
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
    const detailHtml = (await response.text()).replaceAll("<!-- -->", "");
    const url = new URL(`http://localhost${detailCase.path}`);
    const casesHtml = await fetchHtmlForWorker(
      worker,
      `${url.pathname}/cases${url.search}`,
    );
    const materialsHtml = await fetchHtmlForWorker(
      worker,
      `${url.pathname}/materials${url.search}`,
    );
    const html = `${detailHtml}${casesHtml}${materialsHtml}`;

    assert.equal(response.status, 200);
    for (const pattern of detailCase.patterns) {
      assert.match(html, pattern, `${detailCase.path}: ${pattern}`);
    }
    assert.match(html, /東京都で同じ結果になるとは限りません/);
  }
});

test("keeps the fixed annual budget, allocated amount, and available funds together", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `balance-${process.pid}-${Date.now()}`);
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
  const balance = html.match(
    /<div class="budgetBalance"[^>]*aria-live="polite"[^>]*>.*?<\/div><div class="simulatorWorkspace">/,
  )?.[0];

  assert.ok(balance);
  assert.match(balance, /年間総予算/);
  assert.match(balance, /分野へ配分済み/);
  assert.match(balance, /配分可能額/);
  assert.match(balance, /増やすには先に別の分野を減らしてください/);
});

test("clarifies that simulated allocations are not an executable official budget", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `simulation-notice-${process.pid}-${Date.now()}`);
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
  const simulator = html.match(
    /<section class="simulator" id="simulator">.*?<section class="process"/,
  )?.[0];

  assert.ok(simulator);
  assert.match(
    simulator,
    /<aside class="simulationNotice" role="note">.*?学習用の仮想配分.*?東京都の正式な予算案ではありません.*?実行可能性を保証するものではありません.*?<\/aside>/,
  );
});

test("describes the current CSV provenance without overstating automation", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `csv-provenance-${process.pid}-${Date.now()}`);
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

  assert.doesNotMatch(html, /8種類の公式CSVから機械取得/);
  assert.match(html, /公式CSVを参照し、成立予算概要と照合/);
});

test("introduces the budget process after the simulator", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `process-order-${process.pid}-${Date.now()}`);
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

  assert.ok(html.indexOf('id="simulator"') < html.indexOf('id="budget-process"'));
});

test("uses the blue card-based visual theme", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `theme-${process.pid}-${Date.now()}`);
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

  assert.match(html, /<main data-visual-theme="tokyo-blue">/);
});
