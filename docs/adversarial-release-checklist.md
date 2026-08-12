# 敵対的リリースレビュー・チェックリスト

最終更新：2026-08-11

東京予算ラボを「AI推敲とfaviconを追加すれば完成」とみなさず、公開前に誤認、原意変更、個人情報、濫用、費用超過、障害時の導線、非公式サービスとしての表示を攻撃者・誤操作・モデル失敗の側から確認する。

判定は次の3種類とする。

- `[x]` 実装し、ローカルで自動または画面確認できた
- `[ ]` 未実装または未確認
- `本番確認` Cloudflareへ配置しなければ確定できない外部条件

## 1. サービスの立場と誤認防止

- [x] トップとフッターで「東京都の公式サービスではない非公式プロトタイプ」と明示する
- [x] シミュレーターの操作を本人の政策要望として自動確定しない
- [x] AIを「意見を作る機能」ではなく、本人が入力した文章だけを整える任意機能とする
- [x] favicon、サイト名、OGメタデータを「東京予算ラボ」に統一する
- [x] 開発プレビュー専用メタデータを公開用HTMLから除く

## 2. 自由記述とプライバシー

- [x] 氏名、住所、電話番号、メールアドレス等を入力しないよう、入力前とAI利用前に表示する
- [x] 自由記述をURL、localStorage、sessionStorage、DB、Analytics、telemetryへ保存しない
- [x] 通常の構造化確認・コピーでは外部通信しない
- [x] AI利用時だけ、本人が入力した「気になること・してほしいこと・理由」の3項目をCloudflare Workers AIへ一時送信すると明示する
- [x] AI利用への同意を初期状態でオフにし、本人の明示操作なしに推論を開始しない
- [x] Workerは入力・出力本文をログへ記録しない
- [ ] 本番確認：Cloudflare側のログ、Analytics、Logpush等にリクエスト本文を記録しない設定を確認する

## 3. モデルによる原意変更・事実追加

- [x] 本番モデルを `@cf/openai/gpt-oss-120b`、温度0、最大出力300 tokensに固定する
- [x] 分野名、変更額、増減方向、所管名、連絡先URLをモデル入力へ含めない
- [x] 日本語・英語の明白なプロンプト注入を推論前に拒否する
- [x] 入力にない数値、URL、断定強化、書式、結論、第三者視点への一般化を出力検査で拒否する
- [x] 自動検査は意味保存を保証しないと画面上で説明する
- [x] 原文とAI案を区別して表示し、AI案を編集可能にする
- [x] AI案をコピーする前に「原意と異なる内容がないことを確認した」チェックを必須にする
- [x] AI失敗・検査拒否・通信タイムアウト時も原文の構造化内容をコピーできる
- [x] エラー時に自動再試行して費用を重ねない

## 4. 入力検証と濫用・費用対策

- [x] concern 240文字、requestedAction 120文字、reason 240文字、合計600文字に制限する
- [x] POSTかつJSONだけを受け付け、本文サイズを4KiB以下に制限する
- [x] 許可した3キー以外、型不正、空文字、同一生成元でないブラウザ要求を拒否する
- [x] Cloudflare Rate Limiting bindingで全体10回/分、接続元3回/分の二段制限を行う
- [x] 接続元識別子はWorker内でSHA-256の短縮値にし、生のIPアドレスをレート制限キーへ渡さない
- [x] 429では `Retry-After` を返し、画面は原文コピーへ戻れる
- [x] AI bindingの無料枠・上限エラーを安全な503として扱い、本文や内部詳細を返さない
- [ ] 本番確認：無料枠の実使用量と429発生率をCloudflareダッシュボードで確認する
- [ ] 本番確認：共有IP利用者への3回/分制限が過度でないか確認する

Cloudflare Rate Limiting bindingは拠点単位・結果整合が遅延する仕組みであり、正確な日次利用者数や請求上限ではない。無料枠と異常集中を守る補助として扱う。

## 5. HTTP・障害・アクセシビリティ

- [x] AIレスポンスとエラーを `Cache-Control: no-store` にする
- [x] 全レスポンスに `X-Content-Type-Options`、`Referrer-Policy`、`Permissions-Policy`、`X-Frame-Options` を付ける
- [x] クライアントは30秒でタイムアウトし、待機中・成功・失敗を `aria-live` または `role=alert` で通知する
- [x] 二重送信を防ぎ、推論中は実行ボタンを無効にする
- [x] JavaScriptやAIが使えなくても、既存の構造化確認・コピー・公式窓口リンクを維持する
- [ ] 本番確認：Cloudflare上でSSRのCPU時間、AI binding、レート制限、エラー応答を確認する

## 6. 品質ゲート

- [x] APIはAI bindingとレート制限をモックし、実AIを呼ばずに自動テストする
- [x] 参加ページの非保存境界、同意、原文フォールバック、コピー確認を自動テストする
- [x] Wrangler dry-runで圧縮367.81 KiB、静的39ファイル、AI・二つのRate Limit bindingを確認する
- [x] production build、全テスト、ESLintを通す
- [x] PC・モバイルで参加下書き画面の横あふれ、見出し、キーボード操作を監査する
- [ ] 本番確認：Cloudflare previewで1件だけ実推論し、モデル名、応答時間、Neurons、画面フォールバックを確認する
- [ ] 本番確認：公開後の外部リンク、favicon、OG表示を実URLで確認する

## 7. GitHub連携と配置境界

- [x] Cloudflare Workersを公開先として選び、独自GitHub ActionsではなくWorkers BuildsのGitHub連携を使う
- [x] `wrangler.jsonc`に互換日付、`nodejs_compat`、AI、二段Rate Limitingを明示する
- [x] 本番・previewとも、ビルド生成物`dist/server/wrangler.json`だけを配置するコマンドを用意する
- [x] build・全テスト・ESLint・生成設定検証を一つのCloudflare build commandで実行できる
- [x] `workers.dev`とpreview URLを初回確認用に有効化する
- [ ] 外部設定：Cloudflare GitHub Appをこのリポジトリだけに限定して接続する
- [ ] 外部設定：production branchを`main`にし、`docs/cloudflare-deployment.md`記載の3コマンドを登録する
- [ ] 外部設定：Cloudflareが使用するデプロイトークンの権限範囲を確認する
- [ ] 本番確認：preview成功後に`workers.dev`へ初回配置し、本チェックリストの本番確認を実施する

2026-08-11のlocal remote preview試行では、Workers AI REST評価に使えたAPIトークンが `/workers/subdomain/edge-preview` を許可せず、Cloudflare API code 10000で開始できなかった。コード不具合やAI binding不具合とは判定せず、remote Worker preview権限を持つ認証または実配置後に上記の本番確認を行う。

## リリース判定

ローカル実装の完了と、本番環境の安全確認は別判定にする。本番確認項目が残る間は「コード完成」であっても「公開運用確認済み」とは表現しない。AIを無効化しても、予算を動かす、意味を知る、考えを構造化する、公式ルートへ進むという中核体験は成立し続けることを必須条件とする。
