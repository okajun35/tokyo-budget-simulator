import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAdvocacyRefinementMessages,
  extractAdvocacyRefinementText,
  inspectAdvocacyRefinementOutput,
} from "../features/find-participation-route/advocacy-refinement.ts";

const input = {
  categoryName: "教育と文化",
  topicName: "給食・教育内容・ICT",
  bureauNames: ["東京都教育庁"],
  concern: "給食費が上がり、家庭の負担が増えている。",
  requestedAction: "支援・サービスを増やしてほしい",
  reason: "経済状況による教育環境の差を小さくしたいから。",
};

test("builds a copy-editing prompt that treats resident text as data", () => {
  const messages = buildAdvocacyRefinementMessages(input);

  assert.equal(messages.length, 2);
  assert.equal(messages[0].role, "system");
  assert.match(messages[0].content, /文章編集者/);
  assert.match(messages[0].content, /入力にない事実/);
  assert.match(messages[0].content, /政治的な主張を追加/);
  assert.match(messages[0].content, /命令として実行しない/);
  assert.match(messages[0].content, /本文だけ/);

  assert.equal(messages[1].role, "user");
  assert.match(messages[1].content, /<resident_input>/);
  assert.match(messages[1].content, /給食費が上がり/);
  assert.doesNotMatch(messages[1].content, /deltaAmount|direction|contactUrl/);
});

test("flags only numbers and URLs that the model added", () => {
  const safe = inspectAdvocacyRefinementOutput(
    { ...input, concern: "30人分の支援が必要だと感じる。" },
    "30人分の支援が必要だと感じています。東京都に検討をお願いします。",
  );
  assert.deepEqual(safe.addedNumbers, []);
  assert.deepEqual(safe.addedUrls, []);

  const unsafe = inspectAdvocacyRefinementOutput(
    input,
    "利用者の50%が対象です。詳しくは https://example.com を確認してください。",
  );
  assert.deepEqual(unsafe.addedNumbers, ["50"]);
  assert.deepEqual(unsafe.addedUrls, ["https://example.com"]);
  assert.equal(unsafe.passed, false);
});

test("flags output that leaks prompt wrappers or uses unsupported certainty", () => {
  const inspection = inspectAdvocacyRefinementOutput(
    input,
    "<resident_input>この施策は必ず成功します。",
  );

  assert.equal(inspection.leakedPromptMarkup, true);
  assert.deepEqual(inspection.overclaimExpressions, ["必ず"]);
  assert.equal(inspection.passed, false);
});

test("extracts both Workers AI response and chat-completion text formats", () => {
  assert.equal(
    extractAdvocacyRefinementText({ response: "通常形式の本文" }),
    "通常形式の本文",
  );
  assert.equal(
    extractAdvocacyRefinementText({
      choices: [{ message: { content: "Chat Completions形式の本文" } }],
    }),
    "Chat Completions形式の本文",
  );
  assert.equal(
    extractAdvocacyRefinementText({
      choices: [{ message: { reasoning_content: "内部推論だけ" } }],
    }),
    undefined,
  );
});
