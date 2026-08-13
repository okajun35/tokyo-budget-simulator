import { createInitialBudgetAllocations } from "../features/simulate-budget/budget-allocation.ts";
import { BUDGET_CATEGORIES } from "../features/simulate-budget/budget-categories.ts";
import { createBudgetParticipationHref } from "../features/simulate-budget/budget-plan-query.ts";

const endpoint = process.env.CHROME_DEVTOOLS_URL ?? "http://127.0.0.1:9223";
const siteUrl = process.argv[2] ?? "http://localhost:5173";
const targets = await (await fetch(`${endpoint}/json/list`)).json();
const page = targets.find(target => target.type === "page");
if (!page) throw new Error("Chrome page target was not found.");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener("open", resolve, { once: true }));
let nextId = 0;
const command = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  const onMessage = event => {
    const message = JSON.parse(event.data);
    if (message.id !== id) return;
    socket.removeEventListener("message", onMessage);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  };
  socket.addEventListener("message", onMessage);
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const result = await command("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};
const pause = duration => new Promise(resolve => setTimeout(resolve, duration));

let failed = false;
const check = (label, passed, detail = "") => {
  console.log(`${passed ? "OK  " : "NG  "} ${label}`, detail);
  if (!passed) failed = true;
};

await command("Page.enable");
const plan = createInitialBudgetAllocations(BUDGET_CATEGORIES);
plan.debt -= 840;
plan.education += 840;
const educationPath = createBudgetParticipationHref(plan, "education");

for (const viewport of [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
]) {
  await command("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  await command("Page.navigate", { url: `${siteUrl}${educationPath}` });
  await pause(1600);

  const initial = JSON.parse(await evaluate(`JSON.stringify({
    topics: document.querySelectorAll('[data-participation-topic]').length,
    change: document.querySelector('.participationChange')?.innerText,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    draftFields: document.querySelectorAll('.participationDraftFields').length
  })`));
  check(`${viewport.name}: 7テーマ`, initial.topics === 7, initial.topics);
  check(`${viewport.name}: +840億円を引継ぎ`, initial.change.includes("+840億円"));
  check(`${viewport.name}: 横あふれなし`, initial.overflow === 0, initial.overflow);
  check(`${viewport.name}: 選択ページに自由記述なし`, initial.draftFields === 0);

  await evaluate(`document.querySelector('[data-participation-topic="school-meals-curriculum-ict"] input').click()`);
  await pause(250);
  const routing = JSON.parse(await evaluate(`JSON.stringify({
    text: document.querySelector('.participationRoutingResult')?.innerText,
    direct: document.querySelectorAll('[data-contact-role="direct"]').length,
    alternate: document.querySelectorAll('[data-contact-role="alternate"]').length,
    prepareHref: document.querySelector('.participationPrepareCta a')?.getAttribute('href')
  })`));
  check(`${viewport.name}: 教育庁と区市町村の分岐`,
    routing.text.includes("東京都教育委員会（教育庁）") && routing.text.includes("各区市町村教育委員会"));
  check(`${viewport.name}: 直接・代替窓口を区別`, routing.direct === 1 && routing.alternate === 1);
  check(`${viewport.name}: 専用ページへplan/category/topicを引継ぎ`,
    routing.prepareHref.includes("/participation/prepare?") &&
    routing.prepareHref.includes("plan=") &&
    routing.prepareHref.includes("category=education") &&
    routing.prepareHref.includes("topic=school-meals-curriculum-ict"));

  await command("Page.navigate", { url: `${siteUrl}${routing.prepareHref}` });
  await pause(900);
  const prepare = JSON.parse(await evaluate(`JSON.stringify({
    page: document.querySelector('[data-participation-prepare]')?.getAttribute('data-participation-prepare'),
    context: document.querySelector('.participationDraftContext')?.innerText,
    textareas: document.querySelectorAll('.participationDraftFields textarea').length,
    disabled: document.querySelector('.participationReviewButton')?.disabled,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    firstInputTop: Math.round(document.querySelector('.participationDraftFields textarea')?.getBoundingClientRect().top ?? 9999)
  })`));
  check(`${viewport.name}: 独立入力ページを表示`, prepare.page === "education" && prepare.textareas === 2);
  check(`${viewport.name}: 選択内容を短く再掲`, prepare.context.includes("給食・教育内容・ICT") && prepare.context.includes("+840億円"));
  check(`${viewport.name}: 入力前は確認不可`, prepare.disabled === true);
  check(`${viewport.name}: 入力ページも横あふれなし`, prepare.overflow === 0, prepare.overflow);
  check(`${viewport.name}: 最初の入力欄が初期画面内`, prepare.firstInputTop < viewport.height, prepare.firstInputTop);

  await evaluate(`(() => {
    const areas = document.querySelectorAll('.participationDraftFields textarea');
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
    setter.call(areas[0], '給食費の負担が気になっている');
    areas[0].dispatchEvent(new Event('input', { bubbles: true }));
    setter.call(areas[1], '経済状況による差を小さくしたいから');
    areas[1].dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-action-choice="increase-support"] input').click();
  })()`);
  await pause(250);
  const ready = await evaluate("document.querySelector('.participationReviewButton').disabled === false");
  check(`${viewport.name}: 必須3項目後に確認可`, ready === true);
  await evaluate("document.querySelector('.participationReviewButton').click()");
  await pause(250);
  const summary = await evaluate("document.querySelector('.participationSummary')?.innerText");
  check(`${viewport.name}: 本人入力を構造化`,
    summary.includes("給食費の負担") && summary.includes("支援・サービスを増やしてほしい") && summary.includes("経済状況による差"));
  const aiBoundary = JSON.parse(await evaluate(`JSON.stringify({
    text: document.querySelector('.participationAiRefinement')?.innerText,
    consent: document.querySelector('.participationAiConsent input')?.checked,
    runDisabled: document.querySelector('.participationAiRunButton')?.disabled,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  })`));
  check(`${viewport.name}: AIは任意で送信内容を明示`,
    aiBoundary.text.includes("Cloudflare Workers AI") &&
    aiBoundary.text.includes("分野、予算変更額、所管、窓口URLは送りません"));
  check(`${viewport.name}: AI同意は初期オフ`, aiBoundary.consent === false && aiBoundary.runDisabled === true);
  check(`${viewport.name}: AI説明表示後も横あふれなし`, aiBoundary.overflow === 0, aiBoundary.overflow);
  const nextContact = JSON.parse(await evaluate(`JSON.stringify((() => {
    const card = document.querySelector('.participationNextContact');
    const ai = document.querySelector('.participationAiRefinement');
    return {
      text: card?.innerText,
      href: card?.querySelector('a')?.getAttribute('href'),
      followsAi: Boolean(ai && card && (ai.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING)),
      columns: card ? getComputedStyle(card).gridTemplateColumns.split(' ').length : 0,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  })())`));
  check(`${viewport.name}: 下書き後に選択済みの公式窓口を再掲`,
    nextContact.text.includes("コピーしたら、公式窓口へ") &&
    nextContact.text.includes("東京都教育委員会") &&
    nextContact.href.startsWith("https://"));
  check(`${viewport.name}: 窓口導線をAI欄の後に表示`, nextContact.followsAi === true);
  check(`${viewport.name}: 窓口再掲後も横あふれなし`, nextContact.overflow === 0, nextContact.overflow);
  if (viewport.mobile) {
    check("mobile: 最終窓口カードは1列", nextContact.columns === 1, nextContact.columns);
  }
}

await command("Page.navigate", { url: `${siteUrl}/participation?category=safety` });
await pause(1200);
await evaluate(`document.querySelector('[data-participation-topic="fire-ems-prevention"] input').click()`);
await pause(200);
const emergency = await evaluate("document.querySelector('.participationRoutingResult')?.innerText");
check("消防: 緊急時の利用禁止を表示", emergency.includes("119番など緊急時には使用しない"));
check("消防: 直接の意見フォームを表示", emergency.includes("意見・要望を伝える"));

socket.close();
if (failed) process.exitCode = 1;
