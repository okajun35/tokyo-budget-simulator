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
const paths = ["/", "/budget/debt?amount=1959", "/budget-process", "/participation?category=debt", "/sources", "/about"];
const results = [];

for (const viewport of viewports) {
  await command("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });

  for (const path of paths) {
    await command("Page.navigate", { url: `${siteUrl}${path}` });
    await new Promise(resolve => setTimeout(resolve, 250));
    const response = await command("Runtime.evaluate", {
      expression: `JSON.stringify({
        path: location.pathname + location.search,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
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

socket.close();
await fetch(`${devtoolsEndpoint}/json/close/${target.id}`);

let failed = false;
for (const result of results) {
  const overflow = result.scrollWidth > result.clientWidth;
  if (overflow) failed = true;
  console.log(JSON.stringify({ ...result, overflow }));
}

if (failed) process.exitCode = 1;
