const devtoolsEndpoint = process.env.CHROME_DEVTOOLS_URL ?? "http://127.0.0.1:9223";
const siteUrl = process.argv[2] ?? "http://localhost:5173";

const targetResponse = await fetch(
  `${devtoolsEndpoint}/json/new?${encodeURIComponent(`${siteUrl}/`)}`,
  { method: "PUT" },
);
if (!targetResponse.ok) {
  throw new Error(`Could not create Chrome target: HTTP ${targetResponse.status}`);
}

const target = await targetResponse.json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

const command = (method, params = {}) => new Promise((resolve, reject) => {
  nextId += 1;
  pending.set(nextId, { resolve, reject });
  socket.send(JSON.stringify({ id: nextId, method, params }));
});

await command("Page.enable");
await command("Runtime.enable");

const viewports = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];
const statefulProcessPath = "/budget-process?plan=18730%2C16762%2C7822%2C4813%2C9823%2C10575%2C4993%2C1959%2C21053&category=education";
const statefulParticipationPreparePath = "/participation/prepare?plan=18730%2C16762%2C7822%2C4813%2C9823%2C10575%2C4993%2C1959%2C21053&category=education&topic=school-meals-curriculum-ict";
const statefulCasePath = "/budget/education/cases?plan=18730%2C16762%2C7822%2C4813%2C9823%2C10575%2C4993%2C1959%2C21053&category=education&amount=16762";
const statefulMaterialsPath = "/budget/education/materials?plan=18730%2C16762%2C7822%2C4813%2C9823%2C10575%2C4993%2C1959%2C21053&category=education&amount=16762";
const paths = ["/", "/budget/welfare?amount=15000", "/budget/debt?amount=1959", statefulCasePath, statefulMaterialsPath, "/budget-process", statefulProcessPath, "/participation?category=debt", statefulParticipationPreparePath, "/sources", "/about", "/fiscal-context"];
const results = [];

// 開発サーバは初回の変換に時間がかかる。固定の待ち時間では読み込み前の
// 空のDOMを測ってしまうため、描画が終わるまで待ってから測定する。
const waitForRenderedPage = async () => {
  for (let attempt = 0; attempt < 60; attempt++) {
    const response = await command("Runtime.evaluate", {
      expression: `document.readyState === "complete" && document.querySelectorAll("h1,h2,h3,h4,h5,h6").length > 0`,
      returnByValue: true,
    });
    if (response.result.value === true) return true;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return false;
};


for (const viewport of viewports) {
  await command("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });

  for (const path of paths) {
    await command("Page.navigate", { url: `${siteUrl}${path}` });
    await waitForRenderedPage();
    const response = await command("Runtime.evaluate", {
      expression: `JSON.stringify({
        path: location.pathname + location.search,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        loadDurationMs: Math.round(performance.getEntriesByType('navigation')[0]?.duration ?? 0),
        headings: Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(heading => ({ level: Number(heading.tagName[1]), text: heading.textContent.trim() })),
        mobileDetailDisplay: document.querySelector('[data-mobile-detail-link]') ? getComputedStyle(document.querySelector('[data-mobile-detail-link]')).display : null,
        contextPanelDisplay: document.querySelector('.contextPanel') ? getComputedStyle(document.querySelector('.contextPanel')).display : null,
        budgetBalancePosition: document.querySelector('.budgetBalance') ? getComputedStyle(document.querySelector('.budgetBalance')).position : null
      })`,
      returnByValue: true,
    });
    const value = JSON.parse(response.result.value);
    results.push({ viewport: viewport.name, ...value });
  }
}

await command("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await command("Page.navigate", { url: `${siteUrl}/` });
await waitForRenderedPage();

// 開発サーバではハイドレーションが終わる前に押しても何も起きない。
// 固定の待ち時間ではなく、選択が反映されるまで押し直して判定する。
const pressSpaceOnEducationRow = async () => {
  await command("Runtime.evaluate", {
    expression: "document.querySelector('[data-budget-select-control=education]').focus()",
  });
  for (const type of ["keyDown", "keyUp"]) {
    await command("Input.dispatchKeyEvent", {
      type,
      key: " ",
      code: "Space",
      windowsVirtualKeyCode: 32,
    });
  }
  await new Promise(resolve => setTimeout(resolve, 150));
  const response = await command("Runtime.evaluate", {
    expression:
      "document.querySelector('[data-budget-select-control=education]').getAttribute('aria-pressed')",
    returnByValue: true,
  });
  return response.result.value === "true";
};

for (let attempt = 0; attempt < 20; attempt++) {
  if (await pressSpaceOnEducationRow()) break;
}
const selectAuditResponse = await command("Runtime.evaluate", {
  expression: `JSON.stringify({
    educationPressed: document.querySelector('[data-budget-select-control=education]').getAttribute('aria-pressed'),
    educationCurrent: document.querySelector('[data-budget-category=education]').getAttribute('aria-current'),
    focusOutlineStyle: getComputedStyle(document.activeElement).outlineStyle,
    focusOutlineWidth: getComputedStyle(document.activeElement).outlineWidth
  })`,
  returnByValue: true,
});
const selectAudit = JSON.parse(selectAuditResponse.result.value);

const sliderBeforeResponse = await command("Runtime.evaluate", {
  expression: `(() => {
    const slider = document.querySelector('input[aria-label="公債費の予算"]');
    slider.focus();
    return slider.value;
  })()`,
  returnByValue: true,
});
await command("Input.dispatchKeyEvent", {
  type: "rawKeyDown",
  key: "ArrowLeft",
  code: "ArrowLeft",
  windowsVirtualKeyCode: 37,
});
await command("Input.dispatchKeyEvent", {
  type: "keyUp",
  key: "ArrowLeft",
  code: "ArrowLeft",
  windowsVirtualKeyCode: 37,
});
await new Promise(resolve => setTimeout(resolve, 100));
const sliderAfterResponse = await command("Runtime.evaluate", {
  expression: "document.querySelector('input[aria-label=\"公債費の予算\"]').value",
  returnByValue: true,
});
const keyboardAudit = {
  select: selectAudit,
  sliderBefore: Number(sliderBeforeResponse.result.value),
  sliderAfter: Number(sliderAfterResponse.result.value),
};

socket.close();
await fetch(`${devtoolsEndpoint}/json/close/${target.id}`);

let failed = false;
for (const result of results) {
  const overflow = result.scrollWidth > result.clientWidth;
  const headingLevels = result.headings.map(heading => heading.level);
  const headingsValid = headingLevels.filter(level => level === 1).length === 1 &&
    headingLevels.every((level, index) => index === 0 || level <= headingLevels[index - 1] + 1);
  const loadTimeValid = result.viewport !== "desktop" || result.path !== "/" || result.loadDurationMs < 3000;
  if (overflow || !headingsValid || !loadTimeValid) failed = true;
  const { headings, ...layoutResult } = result;
  console.log(JSON.stringify({ ...layoutResult, headingCount: headings.length, overflow, headingsValid, loadTimeValid }));
}

const keyboardValid = keyboardAudit.select.educationPressed === "true" &&
  keyboardAudit.select.educationCurrent === "true" &&
  keyboardAudit.select.focusOutlineStyle !== "none" &&
  keyboardAudit.sliderAfter === keyboardAudit.sliderBefore - 1;
if (!keyboardValid) failed = true;
console.log(JSON.stringify({ keyboardAudit, keyboardValid }));

if (failed) process.exitCode = 1;
