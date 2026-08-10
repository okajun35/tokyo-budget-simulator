const endpoint = process.env.CHROME_DEVTOOLS_URL ?? "http://127.0.0.1:9223";
const siteUrl = process.argv[2] ?? "http://localhost:5173";

const targets = await (await fetch(`${endpoint}/json/list`)).json();
const page = targets.find(target => target.type === "page");
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener("open", resolve, { once: true }));

let nextId = 0;
const command = (method, params = {}) =>
  new Promise(resolve => {
    const id = ++nextId;
    const onMessage = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      socket.removeEventListener("message", onMessage);
      resolve(message.result);
    };
    socket.addEventListener("message", onMessage);
    socket.send(JSON.stringify({ id, method, params }));
  });

const evaluate = async expression => {
  const result = await command("Runtime.evaluate", { expression, returnByValue: true });
  return result.result.value;
};

const measure = async () => JSON.parse(await evaluate(`JSON.stringify((() => {
  const panel = document.querySelector('.contextPanel');
  const body = document.querySelector('.contextPanelBody');
  const detail = document.querySelector('.detailLink');
  const panelBox = panel.getBoundingClientRect();
  const detailBox = detail.getBoundingClientRect();
  return {
    panelTop: Math.round(panelBox.top),
    panelBottom: Math.round(panelBox.bottom),
    bodyOverflowsBy: body.scrollHeight - body.clientHeight,
    detailBottom: Math.round(detailBox.bottom),
    detailVisible: detailBox.top >= 0 && detailBox.bottom <= window.innerHeight,
    detailClipped: detailBox.bottom > panelBox.bottom + 1,
    bottomClearance: window.innerHeight - Math.round(panelBox.bottom)
  };
})())`));

await command("Page.enable");

let failed = false;
const check = (label, passed, detail) => {
  console.log(`${passed ? "OK  " : "NG  "} ${label}`, detail);
  if (!passed) failed = true;
};

for (const viewport of [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1280x720", width: 1280, height: 720 },
]) {
  await command("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await command("Page.navigate", { url: `${siteUrl}/` });
  await new Promise(resolve => setTimeout(resolve, 1200));

  await evaluate("document.querySelector('#simulator').scrollIntoView({ block: 'start' })");
  await new Promise(resolve => setTimeout(resolve, 400));
  const atSectionTop = await measure();

  await evaluate("window.scrollBy(0, 260)");
  await new Promise(resolve => setTimeout(resolve, 400));
  const afterPinning = await measure();

  check(
    `${viewport.name} 詳しく見るがパネル内部に隠れない`,
    !atSectionTop.detailClipped && !afterPinning.detailClipped,
    { atSectionTop: atSectionTop.detailClipped, afterPinning: afterPinning.detailClipped },
  );
  check(
    `${viewport.name} 固定後に詳しく見るが画面内にある`,
    afterPinning.detailVisible,
    { detailBottom: afterPinning.detailBottom, panelBottom: afterPinning.panelBottom },
  );
  check(
    `${viewport.name} 固定後のパネル下端が画面下端から離れている`,
    afterPinning.bottomClearance >= 24,
    { bottomClearance: afterPinning.bottomClearance, bodyOverflowsBy: afterPinning.bodyOverflowsBy },
  );
}

socket.close();
if (failed) process.exitCode = 1;
