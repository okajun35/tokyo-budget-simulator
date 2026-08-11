import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

import { PARTICIPATION_REFINEMENT_EVALUATION_CASES } from "../scripts/participation-refinement-evaluation-cases.mjs";

const execFileAsync = promisify(execFile);
const scriptPath = new URL(
  "../scripts/evaluate-participation-refinement.mjs",
  import.meta.url,
);

test("covers all nine budget fields with synthetic evaluation cases", () => {
  assert.deepEqual(
    [...new Set(PARTICIPATION_REFINEMENT_EVALUATION_CASES.map(item => item.input.categoryName))].sort(),
    [
      "企画・総務",
      "公債費",
      "労働と経済",
      "教育と文化",
      "生活環境",
      "福祉と保健",
      "税連動経費等",
      "警察と消防",
      "都市の整備",
    ].sort(),
  );
  assert.equal(
    new Set(PARTICIPATION_REFINEMENT_EVALUATION_CASES.map(item => item.id)).size,
    PARTICIPATION_REFINEMENT_EVALUATION_CASES.length,
  );
});

test("dry-run shows one synthetic case without requiring Cloudflare credentials", async () => {
  const { stdout } = await execFileAsync(
    process.execPath,
    [scriptPath.pathname, "--dry-run", "--case", "education-meals"],
    {
      env: {
        ...process.env,
        CLOUDFLARE_ACCOUNT_ID: "",
        CLOUDFLARE_AUTH_TOKEN: "",
      },
    },
  );

  assert.match(stdout, /gpt-oss-20b/);
  assert.match(stdout, /education-meals/);
  assert.match(stdout, /給食費が上がり/);
  assert.match(stdout, /入力にない事実/);
  assert.doesNotMatch(stdout, /welfare-care/);
});

test("comparison dry-run uses the same case with all three candidate models", async () => {
  const { stdout } = await execFileAsync(
    process.execPath,
    [scriptPath.pathname, "--dry-run", "--compare", "--case", "education-meals"],
    {
      env: {
        ...process.env,
        CLOUDFLARE_ACCOUNT_ID: "",
        CLOUDFLARE_AUTH_TOKEN: "",
      },
    },
  );

  assert.match(stdout, /@cf\/meta\/llama-3\.2-3b-instruct/);
  assert.match(stdout, /@cf\/openai\/gpt-oss-20b/);
  assert.match(stdout, /@cf\/openai\/gpt-oss-120b/);
  assert.match(stdout, /評価モデル: 3件/);
});
