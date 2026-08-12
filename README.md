# 東京予算ラボ

[tokyobudget.page](https://tokyobudget.page/) で公開している、令和8年度東京都一般会計当初予算を題材にした学習・情報探索プロトタイプです。

> **東京予算ラボは、東京都の公式サービスではありません。**
> 東京都の予算を題材に、利用者が自分で配分を動かし、その変更が現実に何を意味し得るかを考えるための非公式サイトです。

## できること

- 令和8年度当初予算の9分野を、総額を変えずに配分し直す
- 増額・減額・据え置きが意味し得る変化、実施上の制約、他自治体等の公開事例を確認する
- 東京都の予算要求、財務局査定、知事査定、都議会審議、執行・評価の流れを知る
- 関心のある話題から主な所管と確認済みの公式窓口を探す
- 自分の考えを整理し、コピーして公式窓口へ進む

シミュレーションは学習のためのものであり、実際の予算・事業・制度・成果を予測するものではありません。東京都の目的別予算と、局別・款別の資料は分類軸が異なるため、対応関係を公式資料で確認できる範囲だけを表示します。

## サイトの構成

| ページ | 内容 |
| --- | --- |
| [`/`](https://tokyobudget.page/) | 予算の概要と固定総額のシミュレーター |
| [`/budget/[categoryId]`](https://tokyobudget.page/budget/welfare) | 分野別の意味、制約、令和8年度の取組例、令和9年度に向けた公開方針 |
| [`/budget/[categoryId]/cases`](https://tokyobudget.page/budget/welfare/cases) | 公開事例と、その事例から分かる範囲 |
| [`/budget/[categoryId]/materials`](https://tokyobudget.page/budget/welfare/materials) | 東京都の要求・査定・予算案などの関連資料 |
| [`/budget-process`](https://tokyobudget.page/budget-process) | 予算が決まり、執行・評価されるまでの流れ |
| [`/participation`](https://tokyobudget.page/participation) | 話題、所管、公式の参加・問い合わせ先 |
| [`/participation/prepare`](https://tokyobudget.page/participation/prepare) | 意見の下書き・コピー（東京都へは送信しない） |
| [`/sources`](https://tokyobudget.page/sources) | アプリ内で使う資料の出典、取得日、用途、利用条件 |
| [`/about`](https://tokyobudget.page/about) | プロトタイプの目的、限界、データ品質方針 |

## 開発環境

### 必要なもの

- Node.js `>=22.13.0`
- Linux（`flock`、`curl`、GNU `timeout` を使用）

### ローカルで起動する

```bash
npm run install:ci
npm run dev
```

標準では [http://localhost:5173/](http://localhost:5173/) で起動します。`npm run install:ci` は、同一プロジェクトでの同時実行を避けた一度だけの `npm ci` です。

### 主なコマンド

| 目的 | コマンド |
| --- | --- |
| 開発サーバー | `npm run dev` |
| 本番用ビルド | `npm run build` |
| テスト・ビルド・検証 | `npm test` |
| 本番相当の総合検証 | `npm run verify:cloudflare` |
| Cloudflareへの本番デプロイ | `npm run deploy:cloudflare` |

デプロイは個人Cloudflareアカウントの Workers Free プランと、Cloudflare Workers Builds のGitHub連携を使用します。設定・確認手順は [`docs/cloudflare-deployment.md`](docs/cloudflare-deployment.md) を参照してください。

## 実装の構成

- `app/`：ルーティングと画面構成
- `features/simulate-budget/`：9分野の予算配分、固定総額、状態引継ぎ
- `features/understand-budget-change/`：増額・減額・据え置きの意味と制約
- `features/learn-from-budget-cases/`：公開事例と根拠の限界
- `features/learn-budget-process/`：東京都の予算編成過程
- `features/find-participation-route/`：話題、所管、公式窓口
- `features/trace-budget-sources/`：出典と来歴
- `features/prepare-budget-data/`、`scripts/`：データ取得・正規化・検証

設計の背景、受け入れ条件、データ更新手順は [`docs/`](docs) に記録しています。

## AIによる下書きの推敲

`/participation/prepare` では、利用者が明示的に実行したときだけ、入力済みの「気になっていること」「してほしいこと」「理由」を Workers AI の `@cf/openai/gpt-oss-120b` で読みやすく整えられます。

- AIは本人が入力していない主張・制度・数値を追加しない方針です。
- AIを使わず、下書きの整理とコピーだけを行うこともできます。
- 自由記述はURL、localStorage、sessionStorage、DB、Analytics、telemetryに保存・送信しません。ページを離れると消えます。
- 東京予算ラボから東京都へ意見を自動送信することはありません。コピー後に、利用者自身が公式窓口を開いて送信します。

本番ではCloudflare WorkerのAI bindingを使い、ブラウザやGitHubへAI用APIトークンを渡しません。自動テストと通常のローカル開発では実AIを呼び出しません。

## ライセンス

このリポジトリでプロジェクト作成者が著作権を持つソースコードと文書は、[MIT License](LICENSE) で提供します。

東京都のデータ・公式資料・引用・要約はMITの対象外です。再利用時は各配布元の利用条件を確認してください。対象の区分と必要な表示は [NOTICE](NOTICE) に、アプリ内での資料の用途・取得日・利用条件は [出典ページ](https://tokyobudget.page/sources) に記録しています。

## 出典とデータ利用

予算額・予算過程・評価に関する主な一次資料は、以下の東京都・東京都議会の公開資料です。個別の画面で使う資料、取得日、利用条件は [/sources](https://tokyobudget.page/sources) に一覧で表示します。

- [令和8年度予算概要（東京都財務局）](https://www.zaimu.metro.tokyo.lg.jp/zaisei/yosan/r8/8yosangaiyounituite)
- [TOKYO予算見える化ボード データ一覧（東京都オープンデータカタログ）](https://catalog.data.metro.tokyo.lg.jp/dataset/t000004d0000000005) — リポジトリ内の `data/tokyo-budget/` のCSVは、このCC BY 4.0オープンデータに由来します。再利用時は「TOKYO予算見える化ボード データ一覧（東京都財務局）」を出典として表示し、CC BY 4.0の条件に従ってください。
- [令和8年度予算要求（東京都財務局）](https://www.zaimu.metro.tokyo.lg.jp/zaisei/yosan/r8/08yosanyokyujokyou_index/)
- [令和8年度一般会計予算 財務局査定結果（事項別）（東京都財務局）](https://www.zaimu.metro.tokyo.lg.jp/zaisei/yosan/r8/8zaimukyokusateikekka)
- [令和8年 予算特別委員会速記録（東京都議会）](https://www.gikai.metro.tokyo.lg.jp/record/budget/2026/)

公式資料は東京都等の著作物であり、このリポジトリのMITライセンスによって再許諾するものではありません。引用・要約・リンクの扱いを含め、再利用する場合は必ず元のサイトの利用条件を確認してください。
