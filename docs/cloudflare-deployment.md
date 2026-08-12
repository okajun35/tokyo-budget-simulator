# 個人CloudflareアカウントのWorkers Buildsによるデプロイ

東京予算ラボの公開先は、継続して管理できる個人Cloudflareアカウントの
Workers Freeプランとする。CloudflareネイティブのWorkers BuildsでGitHub
リポジトリを接続し、`main`を本番ブランチとして`workers.dev`へ配置する。

都知事杯ODHの期間限定Paid相当チームは、2026年9月末以降に参加者側から
配置済みWorkerを管理できなくなるため、本番の所有先にはしない。

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

## Cloudflareダッシュボードの設定

個人CloudflareアカウントのWorkers & PagesからGitHubリポジトリ
`okajun35/tokyo-budget-simulator`を接続し、次を設定する。

| 項目 | 値 |
| --- | --- |
| Production branch | `main` |
| Root directory | 空欄（リポジトリルート） |
| Build command | `npm run verify:cloudflare` |
| Deploy command | `npm run deploy:cloudflare` |
| Non-production branch deploy command | `npm run preview:cloudflare` |

GitHub Appは可能な限り`Only select repositories`を選び、このリポジトリだけを
許可する。Cloudflareが使用するデプロイトークンの権限も確認する。
ローカルの`.env.local`はCloudflareへ登録せず、Gitにも追加しない。

Workers AIは`AI` bindingから呼び出すため、ブラウザやGitHubへWorkers AI REST用
APIトークンを渡さない。Cloudflare Buildsのbuild variables/secretsと、配置後の
Worker runtime variables/secretsは別物として扱う。

## 更新手順

1. ローカルで対象差分と`npm run verify:cloudflare`の結果を確認する。
2. 完成した変更だけをコミットする。
3. `main`へpushする。
4. Cloudflareのbuildとdeployが成功したことを確認する。
5. `workers.dev`の実URLでスモークテストする。

`main`へのpushは本番配置を開始する。Cloudflare側のbuildが失敗した場合は本番確認へ
進まず、最初の意味のある失敗を修正する。複数人運用に移る場合はGitHub側でもPRと
必須checkを設定する。

障害時やGitHub連携を使えない場合は、同じ生成物を手動配置できる。

```bash
npm run verify:cloudflare
npm run deploy:cloudflare
```

## 配置後に残る確認

- フォント修正の再配置後、HTMLにビルド環境の絶対パスが出ないことを確認する
- Rate Limitingの429率と通常時の応答を継続監視する
- SSR CPU時間、Workers AI Neurons、エラー率を確認する
- CloudflareのログやAnalyticsに意見本文が保存されないことを確認する

favicon、OG表示、主要経路、AI bindingによる合成推論1件は、
2026-08-12に実URLで確認済み。

リポジトリ側の検証通過は、これらの本番運用条件を確認済みであることを意味しない。

## 公式資料

- [Workers Best Practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/)
- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
