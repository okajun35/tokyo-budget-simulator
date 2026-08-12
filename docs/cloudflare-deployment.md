# Cloudflare Workers Buildsによるデプロイ

東京予算ラボの公開先はCloudflare Workersとし、Cloudflareネイティブの
Workers BuildsでGitHubリポジトリを接続する。独自のGitHub Actionsから
APIトークンを渡してデプロイする構成は採用しない。

この文書はリポジトリ側のデプロイ契約と、Cloudflareダッシュボードで
一度だけ行う設定を分離して記録する。

## リポジトリ側のデプロイ契約

`wrangler.jsonc`を本番bindingのソース・オブ・トゥルースとする。
Vite/Vinextのビルドは、実際にデプロイする設定を
`dist/server/wrangler.json`へ生成する。

```text
wrangler.jsonc
  -> npm run build
  -> dist/server/wrangler.json
  -> npm run validate:cloudflare
  -> Wranglerでpreviewまたは本番へ配置
```

次のコマンドを使用する。

| 目的 | コマンド |
| --- | --- |
| build・全テスト・ESLint・Worker設定検証 | `npm run verify:cloudflare` |
| 本番ブランチの配置 | `npm run deploy:cloudflare` |
| 本番以外のブランチのpreview version作成 | `npm run preview:cloudflare` |

検証では、互換日付、`nodejs_compat`、Workers AI binding、二段のRate
Limiting binding、preview URL、静的ファイルの生成先が失われていないことを
確認する。デプロイ用コマンドは必ず生成済みの
`dist/server/wrangler.json`を使用する。

## Cloudflareダッシュボードで設定する値

Workers & PagesからGitHubリポジトリ
`okajun35/tokyo-budget-simulator`を接続し、次を設定する。

| 項目 | 値 |
| --- | --- |
| Production branch | `main` |
| Root directory | 空欄（リポジトリルート） |
| Build command | `npm run verify:cloudflare` |
| Deploy command | `npm run deploy:cloudflare` |
| Non-production branch deploy command | `npm run preview:cloudflare` |

GitHub Appは`Only select repositories`を選び、このリポジトリだけを許可する。
Cloudflareが自動作成するデプロイトークンを使う場合も、表示された権限を確認する。
独自トークンへ差し替える場合は、対象アカウントとWorkerの配置に必要な最小権限に
限定する。ローカルの`.env.local`はCloudflareへ登録せず、Gitにも追加しない。

Workers AIは`AI` bindingから呼び出すため、ブラウザやGitHubへWorkers AI REST用
APIトークンを渡さない。Cloudflare Buildsのbuild variables/secretsと、配置後の
Worker runtime variables/secretsは別物として扱う。

## 初回公開の順序

1. GitHub連携をリポジトリ単位で許可する。
2. `main`以外のブランチまたはpreview versionで画面とAIフォールバックを確認する。
3. `main`を本番ブランチとして接続し、まず`workers.dev`で公開する。
4. `docs/adversarial-release-checklist.md`の本番確認を実URLで実施する。
5. 問題がなければ独自ドメインを接続する。

`main`へのpushは本番配置を開始する。少なくともCloudflareのbuild checkが成功する
ことを確認してから本番へ反映し、複数人運用に移る場合はGitHub側でもPRと必須check
を設定する。

## 配置後に残る確認

- Workers AI bindingで1件だけ実推論する
- Rate Limitingの429と通常時の応答を確認する
- SSR CPU時間、Workers AI Neurons、エラー率を確認する
- CloudflareのログやAnalyticsに意見本文が保存されないことを確認する
- favicon、OG表示、外部リンクを実URLから確認する

リポジトリ側の検証通過は、これらの本番運用条件を確認済みであることを意味しない。

## 公式資料

- [Workers Best Practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/)
- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Workers Builds limits and pricing](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)
