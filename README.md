# 東京予算ラボ

令和8年度東京都一般会計当初予算を題材にした、予算配分シミュレーターです。
React／Next.js互換の[vinext](https://github.com/cloudflare/vinext)で動作します。

## Prerequisites

- Node.js `>=22.13.0`
- Linux with `flock`, `curl`, and GNU `timeout`

## Local Development

依存関係を導入し、ローカル開発サーバーを起動します。

```bash
npm run install:ci
npm run dev
```

標準では `http://localhost:5173/` で起動します。

`install:ci` is intentionally a single, non-retrying `npm ci`. It refuses a concurrent install for the same project, consumes a matching image-seeded npm cache with `--prefer-offline` while retaining registry fallback for a missing cache object, otherwise downloads and verifies the complete vinext tarball recorded in `package-lock.json`, limits npm to one socket, and terminates a stalled install. `build` applies a short timeout and then validates the generated Worker artifact. These helpers target Linux and use GNU `timeout`; they are not native macOS scripts.

Scripts that need writable project-scoped home, npm, XDG, and temporary paths use `scripts/sites-env.sh`. The `dev` and `start` scripts honor the caller's runtime environment and keep Wrangler logs inside the checkout. The generated `.sites-runtime/` directory is disposable and ignored by Git.

## Project Structure

- `app/` はルーティングと画面構成を担当
- `features/simulate-budget/` は予算配分のデータと計算を担当
- `features/learn-budget-process/` は予算成立過程を担当
- `features/find-participation-route/` は参加制度を担当
- `features/trace-budget-sources/` は出典追跡を担当
- `domain/tokyo-budget/` は複数機能で共有する東京都予算の概念を担当
- `app/chatgpt-auth.ts` provides optional dispatch-owned ChatGPT sign-in helpers
- `db/index.ts` reads the D1 binding from the Cloudflare Worker environment
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

`.openai/hosting.json` とSitesマニフェストは使用しません。公開先は個人CloudflareアカウントのWorkers Freeプランとし、CloudflareネイティブのWorkers BuildsでGitHubを接続します。独自ドメインは`workers.dev`確認後に決定します。任意のAI推敲はCloudflare WorkerのWorkers AI bindingで動作する構成です。

## Optional AI copy-editing

`/participation/prepare` では、本人が明示的に同意して実行した場合だけ、入力した3項目を `@cf/openai/gpt-oss-120b` で整えます。ブラウザへAPIトークンを渡さず、Workerの `AI` bindingを使用します。通常の入力整理とコピーはAIなしで利用できます。

Workerには次のbindingを設定しています。

- `AI`: Workers AI
- `AI_GLOBAL_RATE_LIMITER`: 全体の短時間制限
- `AI_CLIENT_RATE_LIMITER`: 接続元ごとの短時間制限

本番bindingの設定は`wrangler.jsonc`で管理し、ビルド後の
`dist/server/wrangler.json`だけを配置します。GitHub連携のコマンドと公開手順は
[`docs/cloudflare-deployment.md`](docs/cloudflare-deployment.md)を参照してください。

自動テストはbindingをモックし、実AIや無料枠を消費しません。通常の `npm run dev` もremote AIへ接続しません。ローカル画面から実推論を試す場合だけ、remote Worker preview権限を持つCloudflare認証を環境へ読み込んだ上で `CLOUDFLARE_REMOTE_AI=true npm run dev` とします。Workers AI REST実行だけを許可したトークンではpreviewを開始できません。本番前の残確認は [`docs/adversarial-release-checklist.md`](docs/adversarial-release-checklist.md) を参照してください。

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Diagnostic Commands

- `npm run install:ci`: perform the one bounded lockfile install
- `npm run dev`: start the Vite/Vinext development server
- `npm run build`: build and validate the local deployable artifact
- `npm run start`: start the built Vinext application
- `npm test`: build, validate, and run the automated test suite
- `npm run validate:artifact`: recheck an existing artifact's ESM `default.fetch` export
- `npm run validate:cloudflare`: verify the committed and generated Worker deployment contracts
- `npm run verify:cloudflare`: run the production build, all tests, ESLint, and Worker config checks
- `npm run preview:cloudflare`: upload the verified artifact as a non-production Worker version
- `npm run deploy:cloudflare`: deploy the verified artifact to the production Worker
- `npm run db:generate`: generate Drizzle migrations after schema changes

Use build and validation commands for targeted diagnosis after a remote failure, not as part of the normal checkpoint path.

The timeout defaults can be overridden for a controlled canary with `SITES_INSTALL_TIMEOUT`, `SITES_INSTALL_KILL_AFTER`, `SITES_BUILD_TIMEOUT`, and `SITES_BUILD_KILL_AFTER`. A timeout fails the command; the helpers never retry an unchanged install or build.

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
