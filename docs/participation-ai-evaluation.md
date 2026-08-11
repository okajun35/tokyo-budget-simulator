# 参加意見推敲AIの事前評価

`/participation` へAI推敲を組み込む前に、Cloudflare Workers AI上の
`@cf/openai/gpt-oss-20b` が東京予算ラボの用途に耐えるかを確認する。
OpenAIの公式説明では学習データは主に英語とされているため、一般ベンチマークの
評価だけで日本語の行政向け文章品質を判断しない。

この評価は、本体の画面、Worker binding、APIエンドポイントを変更せず、
Cloudflare Workers AI REST APIへ固定の合成ケースを送る。
実在する人の意見や個人情報は評価データへ追加しない。

## まず送信内容を確認する

APIを呼ばないドライランは、Cloudflareの認証情報なしで実行できる。

```bash
npm run eval:participation-ai -- --dry-run
```

1件だけ確認する場合：

```bash
npm run eval:participation-ai -- --dry-run --case education-meals
```

## 実モデルで評価する

CloudflareダッシュボードのWorkers AI画面から、Account IDとWorkers AI用の
APIトークンを取得する。トークンをコマンド履歴へ残さないため、対話入力する。

```bash
export CLOUDFLARE_ACCOUNT_ID="Account ID"
read -rsp "Cloudflare Workers AI API token: " CLOUDFLARE_AUTH_TOKEN
export CLOUDFLARE_AUTH_TOKEN
npm run eval:participation-ai
unset CLOUDFLARE_AUTH_TOKEN
```

一時的な `.env.local` を使う場合は、次の2変数を記載する。このリポジトリでは
`.env*` はGitの対象外である。

```dotenv
CLOUDFLARE_ACCOUNT_ID=Account ID
CLOUDFLARE_AUTH_TOKEN=Workers AI API token
```

同名の環境変数を以前に `export` している場合、Nodeでは既存値が
`.env.local` より優先される。ファイルの値だけで比較するには、評価プロセスから
既存値を除外する。

```bash
env -u CLOUDFLARE_ACCOUNT_ID -u CLOUDFLARE_AUTH_TOKEN \
  node --env-file=.env.local \
  scripts/evaluate-participation-refinement.mjs \
  --compare \
  --case education-meals
```

出力のばらつきを見る場合は、1件を最大5回まで反復できる。

```bash
npm run eval:participation-ai -- --case education-meals --repeat 3
```

3モデルを同じケース・同じプロンプトで比較する場合：

```bash
npm run eval:participation-ai -- --compare --case education-meals
```

比較対象は次の3つである。

- `@cf/meta/llama-3.2-3b-instruct`
- `@cf/openai/gpt-oss-20b`
- `@cf/openai/gpt-oss-120b`

全11ケースを3モデルで実行すると33回の推論になる。最初は1ケースで比較し、
差がありそうな場合だけ全ケースへ広げる。個別モデルは
`--model llama-3b`、`--model 20b`、`--model 120b` で指定できる。

## 評価ケース

9分野の通常ケースに加えて、次の失敗しやすい入力を含む。

- 本人が結論をまだ決めていない
- 複数の所管候補がある
- 本人自身も確証を持っていない数値がある
- 自由記述内にモデルへの命令が混ざる
- 緊急性を連想する話題だが、入力に連絡先がない

## 導入判断

自動チェックは、入力にない数値・URL、プロンプト記号の露出、強い断定表現を
見つける補助にすぎない。各出力について、次を人が確認する。

1. 本人の原意と結論の強さを保っている
2. 入力にない事実・制度・効果・所管を追加していない
3. 不確かな内容を確認済み事実のように書いていない
4. 高校生以上の一般都民が一度で読める日本語である
5. 公式フォームへ貼る下書きとして役立つ

重大な原意変更や架空事実が1件でもあれば、そのまま本体へ組み込まない。
プロンプトを修正して同じケースを再実行する。それでも安定しなければ20bの採用を
見送り、構造化内容のコピーだけを維持するか、120bとの限定比較を行う。

## 2026-08-11 実行結果

同一の合成ケースとプロンプトで、Llama 3.2 3B、gpt-oss-20b、
gpt-oss-120bをWorkers AI REST APIから実行した。

初回プロンプトでは、20bが入力にない対象者と効果を追加し、120bも入力にない
具体策を補った。文章量の目安とルーティング情報が、内容を膨らませる誘因になって
いたため、次のように変更した。

- 生成入力を本人が書いた concern、requestedAction、reasonだけに限定
- 原文の内容語と意味の強さを保ち、短い入力を水増ししないよう指示
- requestedActionだけを要望の結論として扱う
- 明白なモデル向け命令を検出した入力はAIへ送信しない
- 入力にない数値、URL、強化語、禁止書式、本人の選択との矛盾を検査
- 温度を0に固定

変更後の結果は次のとおりだった。

| モデル | 結果 | 応答・使用量の傾向 | 判断 |
| --- | --- | --- | --- |
| Llama 3.2 3B | 前置きや入力JSONを出力する指示逸脱が再現 | 最速・最少 | 候補外 |
| gpt-oss-20b | 通常10ケースで事実・具体策の追加なし | 概ね1〜2秒、約15〜20 Neurons | MVP第一候補 |
| gpt-oss-120b | 通常10ケースで大きな事実追加なし | 概ね1〜3秒、約24〜37 Neurons | 比較・代替候補 |

明白なプロンプト注入を含む1ケースは、20b・120bともモデルへ送信する前に遮断した。
一方、20bと120bの両方で「シミュレーターで動かした金額」を「算出した金額」と
言い換える小さな意味ずれが発生した。したがって、20bを第一候補としても、出力を
自動確定しない。本人による編集・確認、検査失敗時の棄却、構造化内容のコピーへの
フォールバックを必須条件とする。

この結果は固定ケース各1回の事前評価であり、本番品質や安全性を保証するものでは
ない。UIへ組み込む際は、送信への明示同意、文字数制限、レート制限、エラー時の
フォールバックを別途実装する。

## 本体へ組み込む場合も維持する境界

- AIは本人の文章を整えるだけで、意見や政策判断を作らない
- シミュレーターの増減を、本人の要望としてモデルへ渡さない
- 送信前に、Cloudflare Workers AIへ入力を送ることを明示する
- 氏名、住所、連絡先などの入力を避けるよう案内する
- 出力は本人が編集・確認してからコピーする
- 東京予算ラボから東京都へ自動送信しない
- AIが失敗しても、現在の構造化内容をコピーできる

## 参照した仕様

- [Cloudflare Workers AI: gpt-oss-20b](https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/)
- [Cloudflare Workers AI: Llama 3.2 3B Instruct](https://developers.cloudflare.com/workers-ai/models/llama-3.2-3b-instruct/)
- [Cloudflare Workers AI: REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/)
- [OpenAI: Introducing gpt-oss](https://openai.com/index/introducing-gpt-oss/)
