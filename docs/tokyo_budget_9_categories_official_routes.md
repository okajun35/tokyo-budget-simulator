# 東京予算ラボ：9分野の「話題 → 主な所管 → 公式窓口」整理

作成日：2026-08-11

## 0. 現在のコードについて

現在の `features/simulate-budget/budget-categories.ts` では、9分野すべてに同じ

- `resident-voice`
- `public-comment`
- `petition`
- `written-request`

を `COMMON_PARTICIPATION_ROUTE_IDS` として設定しています。

したがって、**「主な方法」は9分野ごとに独自ではありません**。

一方、`leadBureaus` は分野ごとに異なります。

また `app/participation/page.tsx` では、分野を選択していても `PARTICIPATION_ROUTES` 全7件をそのまま表示しています。

つまり現状は、

> 分野ごとに所管局は変わるが、参加方法はほぼ共通表示

という設計です。

### 推奨方針

参加「制度」を無理に9分野ごとに独自化しない。

代わりに、

1. あなたの変更
2. どの話について？
3. 主な所管
4. その所管の公式な意見・要望窓口
5. 共通の参加制度

という順にする。

共通制度は以下のように扱う。

- **担当局への意見・要望**：分野・話題ごとに変わる。最優先
- **都民の声総合窓口**：担当が分からない場合の共通ルート
- **都議会への意見・議員・会派への要望**：予算・条例等について議会へ伝えたい場合
- **請願・陳情**：正式な議会手続を使いたい場合
- **パブリックコメント**：そのテーマで現在意見募集が行われている場合だけ表示
- **都民提案**：募集期間中・対象条件に合う場合だけ表示

「パブリックコメント」を常時「今使える方法」と表示しないことが重要。

---

# 1. 福祉と保健

## どの話について？

### 高齢者福祉
**主な所管：東京都福祉局**

公式窓口：
https://www.fukushi.metro.tokyo.lg.jp/contact

福祉局都民の声窓口では、福祉局事業への要望・意見等を電話、メールフォーム、文書等で受付。

### 障害福祉
**主な所管：東京都福祉局**

公式窓口：
https://www.fukushi.metro.tokyo.lg.jp/contact

### 子育て・児童福祉
**主な所管：東京都福祉局**

公式窓口：
https://www.fukushi.metro.tokyo.lg.jp/contact

※個別施策によっては子供政策連携室等が関係する場合があるため、「主な所管」と表示する。

### 医療提供体制
**主な所管：東京都保健医療局**

公式窓口：
https://www.hokeniryo.metro.tokyo.lg.jp/contact

### 保健・健康施策
**主な所管：東京都保健医療局**

公式窓口：
https://www.hokeniryo.metro.tokyo.lg.jp/contact

---

# 2. 教育と文化

## どの話について？

### 学校運営・教職員
**主な所管：東京都教育庁**

公式意見・要望窓口：
https://www.kyoiku.metro.tokyo.lg.jp/consulting/other/mail

問い合わせ一覧：
https://www.kyoiku.metro.tokyo.lg.jp/inquiry

### 学校施設
**主な所管：東京都教育庁**

公式意見・要望窓口：
https://www.kyoiku.metro.tokyo.lg.jp/consulting/other/mail

### 給食・教育内容・ICT
**主な所管：東京都教育庁**

公式意見・要望窓口：
https://www.kyoiku.metro.tokyo.lg.jp/consulting/other/mail

※区市町村立学校の個別事項は各区市町村教育委員会が所管する場合があるため、その注意を表示する。

### 特別支援教育
**主な所管：東京都教育庁**

公式意見・要望窓口：
https://www.kyoiku.metro.tokyo.lg.jp/consulting/other/mail

問い合わせ一覧には特別支援教育担当・就学相談担当も掲載：
https://www.kyoiku.metro.tokyo.lg.jp/inquiry

### 都立図書館・生涯学習
**主な所管：東京都教育庁**

公式意見・要望窓口：
https://www.kyoiku.metro.tokyo.lg.jp/consulting/other/mail

### 文化・文化事業
**主な所管：東京都生活文化局**

公式「都民の声」：
https://www.seikatubunka.metro.tokyo.lg.jp/about/jouhou/tominnokoe

問い合わせ一覧：
https://www.seikatubunka.metro.tokyo.lg.jp/inquiry

### スポーツ
**主な所管：東京都スポーツ推進本部**

公式「都民の声」：
https://www.sports-tokyo-info.metro.tokyo.lg.jp/seisaku/about/tominnokoe.html

問い合わせ一覧：
https://www.sports-tokyo-info.metro.tokyo.lg.jp/contact.html

---

# 3. 労働と経済

## どの話について？

### 中小企業・金融・経営支援
**主な所管：東京都産業労働局**

公式問い合わせ・意見窓口：
https://www.sangyo-rodo.metro.tokyo.lg.jp/inquiry

このページでは中小企業支援の個別窓口と、産業労働局への意見・要望メールを案内。

### 雇用・就業
**主な所管：東京都産業労働局**

公式窓口：
https://www.sangyo-rodo.metro.tokyo.lg.jp/inquiry

### 観光
**主な所管：東京都産業労働局**

公式窓口：
https://www.sangyo-rodo.metro.tokyo.lg.jp/inquiry

### 農林水産
**主な所管：東京都産業労働局**

公式窓口：
https://www.sangyo-rodo.metro.tokyo.lg.jp/inquiry

### 創業・起業
**主な所管：東京都産業労働局**

公式窓口：
https://www.sangyo-rodo.metro.tokyo.lg.jp/inquiry

---

# 4. 生活環境

## どの話について？

### 脱炭素・省エネルギー
**主な所管：東京都環境局**

公式問い合わせ・提言フォーム案内：
https://www.kankyo.metro.tokyo.lg.jp/inquiry

### 再生可能エネルギー
**主な所管：東京都環境局**

公式窓口：
https://www.kankyo.metro.tokyo.lg.jp/inquiry

### 資源循環・廃棄物
**主な所管：東京都環境局**

公式窓口：
https://www.kankyo.metro.tokyo.lg.jp/inquiry

### 自然環境・生物多様性
**主な所管：東京都環境局**

公式窓口：
https://www.kankyo.metro.tokyo.lg.jp/inquiry

### 水環境
**主な所管：東京都環境局**

公式窓口：
https://www.kankyo.metro.tokyo.lg.jp/inquiry

環境局は公式ページ内で、

- 地球環境・エネルギー
- 自然環境
- 廃棄物・資源循環
- 水環境
- 環境アセスメント
- その他環境対策

ごとのフォームを案内しているため、東京予算ラボとの相性が非常に良い。

---

# 5. 都市の整備

## どの話について？

### 都市計画・まちづくり
**主な所管：東京都都市整備局**

公式「都市整備局都民の声窓口」：
https://www.toshiseibi.metro.tokyo.lg.jp/about/jouhou/madoguchi

問い合わせ一覧：
https://www.toshiseibi.metro.tokyo.lg.jp/inquiry

### 住宅政策
**主な所管：東京都住宅政策本部**

公式「ご意見・ご要望」：
https://www.juutakuseisaku.metro.tokyo.lg.jp/inquiry/iken

問い合わせ・相談窓口：
https://www.juutakuseisaku.metro.tokyo.lg.jp/inquiry/madoguchi

### 道路・橋梁
**主な所管：東京都建設局**

公式問い合わせ・意見・要望：
https://www.kensetsu.metro.tokyo.lg.jp/inquiry

建設局ページでは、都民の声のほか「道の相談室」「道路通報システム」等も案内。

### 河川
**主な所管：東京都建設局**

公式窓口：
https://www.kensetsu.metro.tokyo.lg.jp/inquiry

### 公園・緑地
**主な所管：東京都建設局**

公式窓口：
https://www.kensetsu.metro.tokyo.lg.jp/inquiry

---

# 6. 警察と消防

## どの話について？

### 警察活動・治安・交通安全
**主な所管：警視庁**

公式「警視庁の業務に対する苦情・ご要望・ご意見」：
https://www.keishicho.metro.tokyo.lg.jp/anket/opinion.html

※事件・事故等の緊急通報とは別。

### 消防・救急
**主な所管：東京消防庁**

公式「ご意見・ご相談」：
https://www.tfd.metro.tokyo.lg.jp/form.html

東京消防庁広報課都民の声窓口及び各消防署相談窓口を案内。

※119番通報など緊急時には使用しない。

### 火災予防・地域防災
**主な所管：東京消防庁**

公式窓口：
https://www.tfd.metro.tokyo.lg.jp/form.html

### 消防車両・装備・消防署
**主な所管：東京消防庁**

公式窓口：
https://www.tfd.metro.tokyo.lg.jp/form.html

---

# 7. 企画・総務

## どの話について？

### 都の基本政策・長期戦略・政策調整
**主な所管：東京都政策企画局**

公式お問い合わせ：
https://www.seisakukikaku.metro.tokyo.lg.jp/inquiry

### 都庁内部運営・行政管理
**主な所管：東京都総務局**

公式問い合わせ・意見・要望：
https://www.soumu.metro.tokyo.lg.jp/inquiry

組織別連絡先：
https://www.soumu.metro.tokyo.lg.jp/inquiry/otoiawase_ichiran

### 区市町村行政・島しょ行政
**主な所管：東京都総務局**

公式窓口：
https://www.soumu.metro.tokyo.lg.jp/inquiry

### 統計
**主な所管：東京都総務局**

公式窓口：
https://www.soumu.metro.tokyo.lg.jp/inquiry

### デジタル化・行政DX
**主な所管：東京都デジタルサービス局**

公式問い合わせ：
https://www.digitalservice.metro.tokyo.lg.jp/inquiry

このページには、

- 東京デジタル2030
- スマート東京
- デジタル人材
- 区市町村DX
- その他意見・要望

等の担当先が掲載されている。

---

# 8. 公債費

## どの話について？

### 都債の発行・償還・利払い
**主な所管：東京都財務局**

公式「財務局都民の声窓口」：
https://www.zaimu.metro.tokyo.lg.jp/about/johokokai/goiken

財務局問い合わせ：
https://www.zaimu.metro.tokyo.lg.jp/inquiry/

公債費は個別住民サービスの窓口ではなく、東京都の財政・予算管理について意見を伝える窓口として財務局を案内する。

---

# 9. 税連動経費等

この分野は一つの所管へまとめない。

## どの話について？

### 都区財政調整・特別区への交付
**主な所管：東京都総務局 行政部**

令和8年度都区財政調整：
https://www.soumu.metro.tokyo.lg.jp/05gyousei/04kusichousonindex/04tokubetsukuzaiseichouseikouhukin/a

担当：行政部区政課

一般的な意見・要望：
https://www.soumu.metro.tokyo.lg.jp/inquiry

### 市町村への財政調整・交付
**主な所管：東京都総務局**

公式窓口：
https://www.soumu.metro.tokyo.lg.jp/inquiry

### 都税・地方税制度
**主な所管：東京都主税局**

公式お問い合わせ・意見・要望：
https://www.tax.metro.tokyo.lg.jp/inquiry

主税局都民の声：
https://www.tax.metro.tokyo.lg.jp/about/portal/voice

### 地方消費税等
**主な所管：東京都主税局（税制度）**

制度説明：
https://www.tax.metro.tokyo.lg.jp/kazei/life/shohize

意見・要望：
https://www.tax.metro.tokyo.lg.jp/inquiry

### 東京都全体の予算・財政制度
**主な所管：東京都財務局**

公式「財務局都民の声窓口」：
https://www.zaimu.metro.tokyo.lg.jp/about/johokokai/goiken

---

# 10. 全分野共通で残す公式ルート

## 都民の声総合窓口

担当局が分からない場合はこちら。

https://www.metro.tokyo.lg.jp/tosei/iken-sodan/sodan/koe

東京都は、寄せられた提言・意見・要望を内容に応じ関係各局等へ伝達すると案内している。

## 東京都議会への意見・要望

https://www.gikai.metro.tokyo.lg.jp/about/contact.html

議会そのものへの意見：
https://www.gikai.metro.tokyo.lg.jp/FormMail/demand/FormMail.html

議員一覧：
https://www.gikai.metro.tokyo.lg.jp/member.html

会派・連絡先：
https://www.gikai.metro.tokyo.lg.jp/outline/factional.html

## 請願・陳情

https://www.gikai.metro.tokyo.lg.jp/petition/guide.html

請願は紹介議員が必要。
陳情は紹介議員なしで提出可能。

---

# 11. UI案

例：教育と文化 +840億円

```text
あなたの変更
教育と文化 +840億円

どの話について？
○ 学校運営・教職員
○ 学校施設
○ 給食・教育内容・ICT
○ 特別支援教育
○ 図書館・生涯学習
○ 文化
○ スポーツ

［給食・教育内容・ICTを選択］

主な所管
東京都教育庁

まずはこちら
教育委員会「あなたの声をお寄せください」
［公式窓口へ →］

ほかの方法
・担当が分からない → 都民の声総合窓口
・議会へ伝えたい → 東京都議会／議員・会派
・正式な議会手続 → 請願・陳情
・意見募集中の計画がある場合 → パブリックコメント
```

---

# 12. 実装上の結論

## 現在

```text
分野
↓
leadBureaus（局トップページ）
↓
全分野共通の4制度
↓
/participationでは全7制度
```

## 改修後

```text
ユーザーの予算変更
↓
分野
↓
話題を選択
↓
主な所管
↓
その局の「意見・要望を受ける公式窓口」へ直接リンク
↓
必要なら共通制度
```

重要なのは、9分野それぞれに別の「制度」を作ることではない。

**独自化すべきなのは「どの話なら、どの所管の、どの直接窓口へ行くか」というルーティング。**

パブリックコメントや都民提案のような期間限定制度は、「常に使える方法」ではなく条件付きで表示する。
