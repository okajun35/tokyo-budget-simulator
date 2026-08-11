import assert from "node:assert/strict";
import test from "node:test";

const fetchHtml = async (path, label) => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${label}-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

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

  assert.equal(response.status, 200);
  return (await response.text()).replaceAll("<!-- -->", "");
};

const topPanel = async label => {
  const html = await fetchHtml("/", label);
  const panel = html.match(
    /<aside class="contextPanel"[^>]*>.*?<\/aside>/,
  )?.[0];

  assert.ok(panel, "選択分野のパネルが見つからない");
  return panel;
};

test("keeps public cases out of the top panel", async () => {
  const panel = await topPanel("panel-without-cases");

  assert.doesNotMatch(panel, /data-budget-case-scope=/);
  assert.doesNotMatch(panel, /国内外の事例/);
});

test("keeps public cases on the category detail page", async () => {
  const html = await fetchHtml("/budget/welfare?amount=15000", "detail-with-cases");

  assert.match(html, /他の自治体では、予算を減らして何を変えた/);
  assert.match(html, /飯能市の在宅・障害・高齢者福祉事業/);
  assert.match(html, /ねたきり老人等手当と老人日常生活用具給付費を廃止/);
  assert.match(html, /イングランドの成人社会福祉支出/);
  assert.match(html, /東京都で同じ結果になるとは限りません/);
});

test("keeps the evidence boundary out of the top panel", async () => {
  const panel = await topPanel("panel-without-evidence-boundary");

  assert.doesNotMatch(panel, /data-evidence-status="unknown"/);
  assert.doesNotMatch(panel, /公開情報だけでは判断できないこと/);
});

test("keeps the evidence boundary on the category detail page", async () => {
  const html = await fetchHtml("/budget/welfare?amount=18730", "detail-with-evidence-boundary");

  assert.match(html, /どこまで確かに言える/);
  assert.match(html, /data-evidence-kind="fact"/);
  assert.match(html, /data-evidence-kind="case_fact"/);
  assert.match(html, /data-evidence-kind="interpretation"/);
  assert.match(html, /data-evidence-kind="unknown"/);
  assert.match(html, /公開情報だけでは分からないこと/);
});

test("keeps the participation routes out of the top panel", async () => {
  const panel = await topPanel("panel-without-participation");

  assert.doesNotMatch(panel, /意見を伝える先/);
  assert.doesNotMatch(panel, /組織別予算との一対一対応ではありません/);
  assert.doesNotMatch(panel, /都民の声/);
  assert.doesNotMatch(panel, /請願/);
});

test("still reaches the participation page for the selected category from the top panel", async () => {
  const panel = await topPanel("panel-participation-link");

  assert.match(
    panel,
    /<a(?=[^>]*class="participationDetailLink")(?=[^>]*href="\/participation\?[^"']*category=welfare")[^>]*>/,
  );
  assert.match(panel, /反映は保証されません/);
});

test("keeps the participation routes on the category detail page", async () => {
  const html = await fetchHtml("/budget/welfare?amount=18730", "detail-with-participation");

  assert.match(html, /意見を伝える先/);
  assert.match(html, /福祉局/);
  assert.match(html, /都民の声/);
  assert.match(html, /請願/);
});

test("keeps the document stage background out of the top panel", async () => {
  const panel = await topPanel("panel-without-background");

  assert.doesNotMatch(panel, /data-budget-background-stage=/);
  assert.doesNotMatch(panel, /この予算が決まるまでの資料を見る/);
  assert.doesNotMatch(panel, /東京都で現在の金額になった背景/);
});

test("explains the classification boundary before showing budget materials", async () => {
  const html = await fetchHtml("/budget/welfare?amount=18730", "detail-with-background");

  assert.doesNotMatch(html, /東京都で現在の金額になった背景/);
  assert.match(html, /この予算が決まるまでの資料を見る/);
  assert.match(
    html,
    /東京都が公開している予算要求・査定・予算案などから、この分野に関連する資料を紹介します/,
  );
  assert.match(html, /なぜ要求額と成立予算をそのまま比較できないの/);
  assert.match(html, /何のために使う.*?目的別/s);
  assert.match(html, /どの局が使う.*?局別/s);
  assert.match(html, /どんな性質の支出.*?性質別/s);
  assert.match(html, /会計上どこに属する.*?款・項・目/s);
  assert.match(html, /公開資料で確認できる範囲を掲載しています/);
  assert.match(html, /独自の推測合算は行っていません/);
  assert.doesNotMatch(html, /要求背景\s*5\/9|財務局査定\s*7\/9|データ充足率/);
});

test("labels related requests and representative assessments by their actual scope", async () => {
  const html = await fetchHtml(
    "/budget/education?amount=15922",
    "detail-with-related-materials",
  );

  assert.match(html, /data-budget-material-relationship="related_bureau"/);
  assert.match(html, /関連する局の予算要求/);
  assert.match(html, /教育庁（代表）/);
  assert.match(html, /要求額.*?11,145\.8億円.*?前年度当初.*?10,478億円/s);
  assert.match(html, /「教育と文化」の目的別予算全体の要求額ではありません/);
  assert.match(html, /data-budget-material-relationship="representative_item"/);
  assert.match(html, /代表的な財務局査定/);
  assert.match(html, /学校給食運営管理.*?357\.19億円.*?546\.87億円/s);
  assert.match(html, /学力への懸念解消.*?141\.87億円.*?137\.4億円/s);
  assert.match(html, /分野全体の査定額ではなく、関連する代表的な事項です/);
});

test("labels directly corresponding material without turning it into a category total", async () => {
  const html = await fetchHtml(
    "/budget/debt?amount=2799",
    "detail-with-direct-material",
  );

  assert.match(html, /data-budget-material-relationship="direct"/);
  assert.match(html, /分野に直接対応する資料/);
  assert.match(html, /公債費（款）/);
  assert.match(html, /公債費会計繰出金.*?2,800\.39億円.*?2,813\.86億円/s);
});

test("explains unavailable request and assessment mappings without calling them absent", async () => {
  const industry = await fetchHtml(
    "/budget/industry?amount=7822",
    "detail-with-request-unavailable",
  );
  const admin = await fetchHtml(
    "/budget/admin?amount=4993",
    "detail-with-materials-unavailable",
  );
  const linked = await fetchHtml(
    "/budget/linked?amount=21053",
    "detail-with-linked-materials-unavailable",
  );

  assert.match(industry, /目的別分類と局別予算要求を安全に対応付けられる公式な対応表を確認できていません/);
  assert.match(industry, /金融支援.*?3,415\.76億円.*?3,394億円/s);
  assert.match(admin, /政策企画、総務、デジタル、議会、選挙、徴税など複数領域にまたがる/);
  assert.match(admin, /掲載がないことは「査定が行われなかった」という意味ではありません/);
  assert.match(linked, /各種交付金、区市町村関係経費、繰出金など複数制度・会計項目を含む/);
  for (const html of [industry, admin, linked]) {
    assert.doesNotMatch(html, />要求なし</);
    assert.doesNotMatch(html, />査定なし</);
  }
});

test("keeps every budget stage on the category detail page", async () => {
  const html = await fetchHtml("/budget/welfare?amount=18730", "detail-with-stages");

  assert.match(html, /各局要求/);
  assert.match(html, /財務局査定/);
  assert.match(html, /知事査定/);
  assert.match(html, /都議会へ提出した段階/);
  assert.match(html, /18,730億円/);
});

test("renders increase guidance and increase cases for an increased education budget", async () => {
  const html = await fetchHtml(
    "/budget/education?amount=16762",
    "education-increase-guidance",
  );

  assert.match(html, /data-change-direction="increase"/);
  assert.match(html, /この840億円を増やすと、何を変えられる/);
  assert.match(html, /教員・支援員を増やす/);
  assert.match(html, /財源の機会費用/);
  assert.match(html, /実施能力/);
  assert.match(html, /恒常経費化/);
  assert.match(html, /他の自治体では、予算を増やして何を変えた/);
  assert.match(html, /GIGAスクール構想による端末整備/);
  assert.doesNotMatch(html, /飯能市立図書館のサービス見直し/);
  assert.match(html, /この840億円を増やすなら、何に使いますか/);
});

test("renders decrease guidance and decrease cases for a decreased education budget", async () => {
  const html = await fetchHtml(
    "/budget/education?amount=11145",
    "education-decrease-guidance",
  );

  assert.match(html, /data-change-direction="decrease"/);
  assert.match(html, /この4,777億円を減らすには、何を変える/);
  assert.match(html, /学校・施設の統合や更新延期/);
  assert.match(html, /サービス低下/);
  assert.match(html, /負担移転/);
  assert.match(html, /他の自治体では、予算を減らして何を変えた/);
  assert.match(html, /飯能市立図書館のサービス見直し/);
  assert.doesNotMatch(html, /GIGAスクール構想による端末整備/);
  assert.match(html, /この4,777億円を減らすなら、何を変えますか/);
});

test("renders unchanged pressures without pretending a reduction was selected", async () => {
  const html = await fetchHtml(
    "/budget/education?amount=15922",
    "education-unchanged-guidance",
  );

  assert.match(html, /data-change-direction="unchanged"/);
  assert.match(html, /現在の水準を維持するとは/);
  assert.match(html, /金額を据え置いても、実質的なサービス水準が同じとは限りません/);
  assert.match(html, /インフレ・物価上昇/);
  assert.match(html, /今の金額を維持すれば、サービス水準も維持できるでしょうか/);
  assert.doesNotMatch(html, /金額を減らすと、現実には何が変わったのか/);
});

test("does not fill unsupported increase cases for every category", async () => {
  const html = await fetchHtml(
    "/budget/industry?amount=8000",
    "industry-increase-case-unavailable",
  );

  assert.match(html, /data-change-direction="increase"/);
  assert.match(html, /増額後の使途と制約を公的資料で確認できる事例は現在未収録です/);
  assert.doesNotMatch(html, /飯能市が一部の観光施設を休止/);
});
