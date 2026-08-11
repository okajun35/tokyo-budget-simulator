import {
  buildAdvocacyRefinementMessages,
  extractAdvocacyRefinementText,
  inspectAdvocacyRefinementOutput,
} from "../features/find-participation-route/advocacy-refinement.ts";
import { PARTICIPATION_REFINEMENT_EVALUATION_CASES } from "./participation-refinement-evaluation-cases.mjs";

const MODEL_ALIASES = {
  "llama-3b": "@cf/meta/llama-3.2-3b-instruct",
  "20b": "@cf/openai/gpt-oss-20b",
  "120b": "@cf/openai/gpt-oss-120b",
};

const COMPARISON_MODELS = [
  MODEL_ALIASES["llama-3b"],
  MODEL_ALIASES["20b"],
  MODEL_ALIASES["120b"],
];

function optionValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} には値が必要です。`);
  }
  return value;
}

function printHelp() {
  console.log(`東京予算ラボ 参加意見推敲モデル評価

使い方:
  npm run eval:participation-ai -- --dry-run
  npm run eval:participation-ai -- --case education-meals
  npm run eval:participation-ai -- --compare --case education-meals
  npm run eval:participation-ai -- --model llama-3b --repeat 2

オプション:
  --dry-run       APIを呼ばず、評価ケースとプロンプトを表示
  --case ID       1件だけ実行
  --compare       Llama 3B、gpt-oss-20b、gpt-oss-120bを同条件で比較
  --model llama-3b|20b|120b（既定: 20b）
  --repeat 1..5   同じケースの反復回数（既定: 1）

実行時に必要な環境変数:
  CLOUDFLARE_ACCOUNT_ID
  CLOUDFLARE_AUTH_TOKEN

固定の合成ケースだけを送信します。実在する人の意見や個人情報を
この評価スクリプトへ追加しないでください。`);
}

if (process.argv.includes("--help")) {
  printHelp();
  process.exit(0);
}

const dryRun = process.argv.includes("--dry-run");
const compare = process.argv.includes("--compare");
const caseId = optionValue("--case");
const modelAlias = optionValue("--model") ?? "20b";
const model = MODEL_ALIASES[modelAlias];
if (!model) {
  throw new Error("--model は llama-3b、20b、120b のいずれかを指定してください。");
}
if (compare && process.argv.includes("--model")) {
  throw new Error("--compare と --model は同時に指定できません。");
}
const selectedModels = compare ? COMPARISON_MODELS : [model];

const repeat = Number(optionValue("--repeat") ?? "1");
if (!Number.isInteger(repeat) || repeat < 1 || repeat > 5) {
  throw new Error("--repeat は1〜5の整数で指定してください。");
}

const selectedCases = caseId
  ? PARTICIPATION_REFINEMENT_EVALUATION_CASES.filter(item => item.id === caseId)
  : PARTICIPATION_REFINEMENT_EVALUATION_CASES;
if (selectedCases.length === 0) {
  throw new Error(`評価ケースが見つかりません: ${caseId}`);
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const authToken = process.env.CLOUDFLARE_AUTH_TOKEN;
if (!dryRun && (!accountId || !authToken)) {
  console.error("CLOUDFLARE_ACCOUNT_ID と CLOUDFLARE_AUTH_TOKEN を設定してください。\n");
  printHelp();
  process.exit(2);
}

async function runInference(messages, selectedModel) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${selectedModel}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        max_tokens: 600,
        temperature: 0.2,
        seed: 20260811,
      }),
      signal: AbortSignal.timeout(60_000),
    },
  );
  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    const details = payload.errors?.map(error => error.message).join(" / ") || response.statusText;
    throw new Error(`Cloudflare Workers AI ${response.status}: ${details}`);
  }
  const output = extractAdvocacyRefinementText(payload.result);
  if (!output) {
    throw new Error("Cloudflare Workers AIから本文を取得できませんでした。");
  }
  return {
    output,
    usage: payload.result.usage,
  };
}

function formatInput(input) {
  return [
    `- 分野: ${input.categoryName}`,
    `- テーマ: ${input.topicName}`,
    `- 所管候補: ${input.bureauNames.join("、") || "特定していない"}`,
    `- 気になること: ${input.concern}`,
    `- してほしいこと: ${input.requestedAction}`,
    `- 理由: ${input.reason}`,
  ].join("\n");
}

function formatInspection(inspection) {
  const pass = (condition) => condition ? "PASS" : "REVIEW";
  return [
    `- ${pass(inspection.addedNumbers.length === 0)} 入力にない数値: ${inspection.addedNumbers.join("、") || "なし"}`,
    `- ${pass(inspection.addedUrls.length === 0)} 入力にないURL: ${inspection.addedUrls.join("、") || "なし"}`,
    `- ${pass(!inspection.leakedPromptMarkup)} プロンプト記号の露出: ${inspection.leakedPromptMarkup ? "あり" : "なし"}`,
    `- ${pass(inspection.overclaimExpressions.length === 0)} 強い断定表現: ${inspection.overclaimExpressions.join("、") || "なし"}`,
  ].join("\n");
}

console.log(`# 参加意見推敲モデル評価\n
- 評価モデル: ${selectedModels.length}件
${selectedModels.map(selectedModel => `  - ${selectedModel}`).join("\n")}
- 評価ケース: ${selectedCases.length}件
- 反復: ${repeat}回
- モード: ${dryRun ? "dry-run（API呼び出しなし）" : "Workers AI REST API"}

自動チェックは補助です。事実追加や原意変更の最終判定は、必ず人が行ってください。`);

let failedRequests = 0;
for (const evaluationCase of selectedCases) {
  const messages = buildAdvocacyRefinementMessages(evaluationCase.input);
  console.log(`\n## ${evaluationCase.id}\n\n目的: ${evaluationCase.purpose}\n\n### 入力\n\n${formatInput(evaluationCase.input)}`);

  if (dryRun) {
    console.log(`\n### 送信予定のプロンプト\n\n${messages.map(message => `[${message.role}]\n${message.content}`).join("\n\n")}`);
    continue;
  }

  for (const selectedModel of selectedModels) {
    console.log(`\n### モデル: ${selectedModel}`);
    for (let iteration = 1; iteration <= repeat; iteration += 1) {
      const startedAt = performance.now();
      try {
        const { output, usage } = await runInference(messages, selectedModel);
        const inspection = inspectAdvocacyRefinementOutput(evaluationCase.input, output);
        console.log(`\n#### 出力 ${iteration}\n\n${output}`);
        console.log(`\n#### 自動チェック ${iteration}\n\n${formatInspection(inspection)}`);
        console.log(`\n- 応答時間: ${Math.round(performance.now() - startedAt)}ms`);
        if (usage) console.log(`- 使用量: ${JSON.stringify(usage)}`);
        console.log(`\n#### 人手評価 ${iteration}\n
- [ ] 本人の原意と結論の強さを保っている
- [ ] 入力にない事実・制度・効果・所管を追加していない
- [ ] 不確かな内容を確認済み事実のように書いていない
- [ ] 高校生以上の一般都民が一度で読める日本語である
- [ ] 公式フォームへ貼る下書きとして役立つ
- [ ] 本人が修正・確認してから使う前提が明確である`);
      } catch (error) {
        failedRequests += 1;
        console.error(`\n#### APIエラー ${iteration}\n\n${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}

if (!dryRun) {
  console.log(`\n## 導入判断\n
全ケースについて、特に「原意の保持」と「事実を追加しない」が満たせるか確認してください。
1件でも重大な原意変更や架空事実があれば、本体へ組み込む前にプロンプトまたはモデルを再評価します。`);
}

if (failedRequests > 0) process.exitCode = 1;
