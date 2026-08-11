const devtoolsEndpoint = process.env.CHROME_DEVTOOLS_URL ?? "http://127.0.0.1:9223";
const siteUrl = process.argv[2] ?? "http://localhost:5173";
const startedAt = Date.now();
const checks = [];

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
const evaluate = async expression => {
  const response = await command("Runtime.evaluate", {
    expression: `JSON.stringify(${expression})`,
    returnByValue: true,
  });
  return JSON.parse(response.result.value);
};
const navigate = async path => {
  await command("Page.navigate", { url: `${siteUrl}${path}` });
  await new Promise(resolve => setTimeout(resolve, 250));
};
const pressRangeKey = async (label, key, code, windowsVirtualKeyCode) => {
  await command("Runtime.evaluate", {
    expression: `document.querySelector('input[aria-label="${label}"]').focus()`,
  });
  await command("Input.dispatchKeyEvent", {
    type: "keyDown",
    key,
    code,
    windowsVirtualKeyCode,
  });
  await command("Input.dispatchKeyEvent", {
    type: "keyUp",
    key,
    code,
    windowsVirtualKeyCode,
  });
  await new Promise(resolve => setTimeout(resolve, 100));
};
const check = (name, passed, details) => {
  checks.push({ name, passed, details });
};

await command("Page.enable");
await command("Runtime.enable");
await command("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await navigate("/");
await new Promise(resolve => setTimeout(resolve, 1_000));

const initial = await evaluate(`({
  annualBudget: document.querySelector('.balanceMetrics div:first-child strong').textContent,
  overview: document.querySelector('.overviewCards').textContent
})`);
check("17.1 一般会計総額", initial.annualBudget.includes("96,530億円") && initial.overview.includes("9兆6,530億円"), initial);

await pressRangeKey("公債費の予算", "Home", "Home", 36);
const afterDebtReduction = await evaluate(`({
  value: Number(document.querySelector('input[aria-label="公債費の予算"]').value),
  changeAmount: document.querySelector('[data-budget-category=debt] .changeMetric b').textContent,
  changeRate: document.querySelector('[data-budget-category=debt] .changeMetric em').textContent,
  metrics: Array.from(document.querySelectorAll('.balanceMetrics strong')).map(item => item.textContent)
})`);
check("17.2 公債費30%減", afterDebtReduction.value === 1959 && afterDebtReduction.changeAmount === "-840億円" && afterDebtReduction.changeRate === "-30.0%", afterDebtReduction);
check("17.3 配分可能額840億円", afterDebtReduction.metrics[2] === "840億円", afterDebtReduction.metrics);

await pressRangeKey("教育と文化の予算", "End", "End", 35);
const afterEducationIncrease = await evaluate(`({
  education: Number(document.querySelector('input[aria-label="教育と文化の予算"]').value),
  debt: Number(document.querySelector('input[aria-label="公債費の予算"]').value),
  metrics: Array.from(document.querySelectorAll('.balanceMetrics strong')).map(item => item.textContent)
})`);
check("17.4 教育へ再配分", afterEducationIncrease.education === 16762, afterEducationIncrease);
check("17.5 年間総予算を固定", afterEducationIncrease.metrics[0] === "96,530億円" && afterEducationIncrease.metrics[1] === "96,530億円" && afterEducationIncrease.metrics[2] === "0億円", afterEducationIncrease.metrics);

await navigate("/budget/debt?amount=1959");
const debtDetail = await evaluate(`({
  meaning: document.querySelector('#meaning-heading + .detailLead').textContent,
  optionCount: document.querySelectorAll('.detailOptionGrid article').length
})`);
check("17.6 公債費の意味", debtDetail.meaning.includes("元金返済") && debtDetail.meaning.includes("利子"), debtDetail.meaning);
check("17.7 複数の変更方法", debtDetail.optionCount >= 3, debtDetail.optionCount);

await navigate("/budget/debt/cases?amount=1959");
const caseTitles = await evaluate(`Array.from(document.querySelectorAll('.detailCaseGrid h3')).map(item => item.textContent)`);
check("17.8 国内外の公的事例", caseTitles.some(title => title.includes("夕張市")) && caseTitles.some(title => title.includes("プエルトリコ")), caseTitles);

await navigate("/budget-process");
const processStages = await evaluate(`Array.from(document.querySelectorAll('.budgetProcessCard h2')).map(item => item.textContent)`);
check("17.9 予算成立の流れ", ["各局要求", "財務局査定", "知事査定", "本会議で議決し、予算成立"].every(label => processStages.includes(label)), processStages);

await navigate("/participation?category=debt&topic=bonds-debt-service");
const officialRoutes = await evaluate(`({
  financeBureau: document.body.textContent.includes('東京都財務局') && Boolean(document.querySelector('a[href="https://www.soshiki-address.metro.tokyo.lg.jp/006_zaimu/zaimu-address.htm"]')),
  residentVoice: Boolean(document.querySelector('a[href="https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou"]')),
  petition: Boolean(document.querySelector('a[href="https://www.gikai.metro.tokyo.lg.jp/petition/guide.html"]')),
  petitionText: document.body.textContent.includes('請願'),
  writtenRequestText: document.body.textContent.includes('陳情')
})`);
check("17.10 公式参加先", Object.values(officialRoutes).every(Boolean), officialRoutes);

const elapsedMs = Date.now() - startedAt;
check("17.11 2分以内", elapsedMs < 120_000, { elapsedMs });

socket.close();
await fetch(`${devtoolsEndpoint}/json/close/${target.id}`);

for (const result of checks) console.log(JSON.stringify(result));
const failures = checks.filter(result => !result.passed);
console.log(`Demo audit: ${checks.length - failures.length}/${checks.length} passed in ${elapsedMs}ms.`);
if (failures.length > 0) process.exitCode = 1;
