# 東京予算ラボ：政策参加導線データ監査 v2

作成日：2026-08-11

> **監査済み調査資料。** この文書は、実装時に所管・窓口を推測しないための一次情報確認結果を統合したものです。アプリ本体の実装変更はこの監査では行っていません。

## 1. 目的

東京予算ラボで予算を動かした都民が、**予算分野 → 具体的な関心 → 行政上の所管 → 実際に使える公式ルート**へ安全に到達できるようにする。

この機能は政治的主張を生成・推薦するものではない。シミュレーターの増減は本人の主張と同一視しない。

## 2. 監査原則

- 公式本文で確認できる範囲だけ確定する。
- 所管根拠と窓口根拠を分離する。
- HTTP 200・名称類似・検索スニペットだけでは確定しない。
- 503等で本文確認できないページは `partial` とし `verifiedAt` を付けない。
- `primary` は「主に担当すると確認できる」の意味であり、唯一の所管を意味しない。
- 複数組織の明確な分担・横断調整は `shared`、案件次第で関係するものは `possible`。
- 安全な対応を確認できない場合は `unresolved`。
- 「その他」は各分野の代表局へ推測接続しない。
- パブリックコメントは特定テーマが現在募集中とは推測しない。

### ContactKind

- `opinion_form`: URL自体が意見・要望等の送信フォーム。
- `inquiry_directory`: テーマ別・部署別の問い合わせ先一覧。
- `general_contact`: 電話・メール・フォーム等を案内する一般連絡ページ。
- `reference`: 制度・担当・所管等の確認資料。

## 3. 現行コード監査

- `PARTICIPATION_ROUTES` は `bureau-inquiry`, `resident-voice`, `public-comment`, `petition`, `written-request`, `assembly-member-request`, `election-citizen-proposal` の7制度。
- 9分野の `participationRouteIds` は共通4制度で、分野ごとに独自化されていない。
- `leadBureaus` は分野別だが局トップURL中心。
- `/participation` は選択分野にかかわらず7制度を表示。
- `plan` と `category` は引き継げる。`resolveBudgetPlanState` の `restoredFromQuery` を見ないと、古い/壊れたURLの「変更額不明」を baseline と誤認する可能性がある。
- シミュレーターは `/simulate` ではなく `/` の `#simulator`。

## 4. 確定レコード形式

```ts
type VerificationStatus = "verified" | "partial" | "unresolved";
type ContactRole = "direct" | "alternate" | "fallback" | "reference";

type BureauRelation = {
  organizationId: string;
  organizationName: string;
  relation: "primary" | "shared" | "possible";
  relationSourceUrl: string | null;
  relationEvidenceSummary: string;
  verifiedAt: string | null;
  verificationStatus: VerificationStatus;
};

type OfficialContact = {
  contactId: string;
  contactOrganizationId: string;
  contactOrganizationName: string;
  contactLabel: string;
  contactKind: "opinion_form" | "inquiry_directory" | "general_contact" | "reference";
  contactUrl: string;
  contactSourceUrl: string;
  contactPurpose: string;
  verifiedAt: string | null;
  verificationStatus: VerificationStatus;
};

type TopicContact = {
  contactId: string;
  role: ContactRole;
};

type ParticipationTopic = {
  categoryId: BudgetCategoryId;
  categoryName: string;
  topicId: string;
  topicName: string;
  bureauRelations: BureauRelation[];
  contacts: TopicContact[];
  jurisdictionNote?: string;
};
```

`organizationId`, `contactOrganizationId`, `contactId`, `topicId` は東京予算ラボ内部のslugであり、東京都の公式IDではない。

所管組織と窓口を運営する組織は一致するとは限らない。例えば、福祉局を主な所管として表示しつつ、安全に確認できた直接窓口がない場合は、東京都が運営する都民の声総合窓口を `fallback` として案内する。この場合、都民の声総合窓口を「福祉局の窓口」とは表示しない。

第5章は調査内容を一行単位で確認するための平坦化した監査表である。実装時は、所管関係、窓口マスター、テーマと窓口の対応を上記の構造へ分離する。

## 5. 検証済みルーティングデータ


| categoryId | 分野 | topicId | テーマ | organizationId | organizationName | relation | relationSourceUrl | relationEvidenceSummary | relationVerifiedAt | relationVerificationStatus | contactId | contactRole | contactLabel | contactKind | contactUrl | contactSourceUrl | contactPurpose | contactVerifiedAt | contactVerificationStatus | jurisdictionNote |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| welfare | 福祉と保健 | elderly-welfare | 高齢者福祉 | welfare-bureau | 東京都福祉局 | primary | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で福祉局の主な事業に高齢者福祉を明記。 | 2026-08-11 | verified | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 福祉局の直接窓口本文を今回確認できなかったため、安全な共通フォールバックとして案内。 | 2026-08-11 | verified | 福祉局の候補窓口 https://www.fukushi.metro.tokyo.lg.jp/contact は今回503で本文未確認。 |
| welfare | 福祉と保健 | disability-welfare | 障害福祉 | welfare-bureau | 東京都福祉局 | primary | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で福祉局の主な事業に障害者福祉を明記。 | 2026-08-11 | verified | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 福祉局の直接窓口本文を今回確認できなかったため、安全な共通フォールバックとして案内。 | 2026-08-11 | verified | 福祉局の候補窓口 https://www.fukushi.metro.tokyo.lg.jp/contact は今回503で本文未確認。 |
| welfare | 福祉と保健 | child-family-welfare | 子育て・児童福祉 | welfare-bureau | 東京都福祉局 | primary | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で福祉局が子供・家庭に関する福祉施策を担当すると確認。 | 2026-08-11 | verified | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 福祉局の直接窓口本文を今回確認できなかったため、安全な共通フォールバックとして案内。 | 2026-08-11 | verified | 福祉局の候補窓口 https://www.fukushi.metro.tokyo.lg.jp/contact は今回503で本文未確認。 |
| welfare | 福祉と保健 | child-family-welfare | 子育て・児童福祉 | child-policy-coordination | 東京都子供政策連携室 | possible | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で、都の子供政策の企画立案・総合調整と先進プロジェクト推進を担当すると確認。子育て・児童福祉全体の共同所管までは確認できないためpossibleとする。 | 2026-08-11 | verified | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 横断的な子供政策に関する場合の共通フォールバック。 | 2026-08-11 | verified | 個別の児童福祉制度は福祉局等が主となる場合がある。 |
| welfare | 福祉と保健 | medical-delivery | 医療提供体制 | health-medical-bureau | 東京都保健医療局 | primary | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で保健医療局が医療政策・医療提供体制等を担当すると確認。 | 2026-08-11 | verified | health-medical-resident-voice-form | direct | 東京の保健医療についてあなたの声をお寄せください | opinion_form | https://logoform.jp/form/tmgform/297877 | https://www.hokeniryo.metro.tokyo.lg.jp/contact | 保健医療局の事業に関する要望・意見を直接送るフォーム。 | 2026-08-11 | verified |  |
| welfare | 福祉と保健 | medical-delivery | 医療提供体制 | health-medical-bureau | 東京都保健医療局 | primary | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で保健医療局が医療政策・医療提供体制等を担当すると確認。 | 2026-08-11 | verified | health-medical-contact-directory | alternate | お問い合わせ | inquiry_directory | https://www.hokeniryo.metro.tokyo.lg.jp/contact | https://www.hokeniryo.metro.tokyo.lg.jp/contact | 保健医療局の分野・内容別の問い合わせ先と、都民の声窓口を確認できる。 | 2026-08-11 | verified |  |
| welfare | 福祉と保健 | public-health | 保健・健康施策 | health-medical-bureau | 東京都保健医療局 | primary | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で保健医療局が健康・保健施策を担当すると確認。 | 2026-08-11 | verified | health-medical-resident-voice-form | direct | 東京の保健医療についてあなたの声をお寄せください | opinion_form | https://logoform.jp/form/tmgform/297877 | https://www.hokeniryo.metro.tokyo.lg.jp/contact | 保健医療局の事業に関する要望・意見を直接送るフォーム。 | 2026-08-11 | verified |  |
| welfare | 福祉と保健 | public-health | 保健・健康施策 | health-medical-bureau | 東京都保健医療局 | primary | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で保健医療局が健康・保健施策を担当すると確認。 | 2026-08-11 | verified | health-medical-contact-directory | alternate | お問い合わせ | inquiry_directory | https://www.hokeniryo.metro.tokyo.lg.jp/contact | https://www.hokeniryo.metro.tokyo.lg.jp/contact | 保健医療局の分野・内容別の問い合わせ先と、都民の声窓口を確認できる。 | 2026-08-11 | verified |  |
| welfare | 福祉と保健 | welfare-other | その他 | — | — | unresolved | — | テーマ名だけでは安全な所管対応を確認できないため、特定局へ割り当てない。 | — | unresolved | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 担当局が分からない場合の共通フォールバック。担当局が分かる場合は各局の窓口利用を案内している。 | 2026-08-11 | verified | 話題を具体化すると担当局を絞れる場合があります。 |
| education | 教育と文化 | metropolitan-schools | 都立学校・教育行政・教職員 | education-bureau | 東京都教育委員会（教育庁） | primary | https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm | 教育庁組織アドレスで都立学校運営、教職員、学校教育関係事務を確認。 | 2026-08-11 | verified | education-org-directory | direct | 教育庁組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm | 教育庁の組織・担当部署・電話番号を確認できる一覧。 | 2026-08-11 | verified |  |
| education | 教育と文化 | school-meals-curriculum-ict | 給食・教育内容・ICT | education-bureau | 東京都教育委員会（教育庁） | primary | https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm | 教育庁組織アドレスで学校給食・健康教育、情報教育等の担当を確認。 | 2026-08-11 | verified | education-org-directory | direct | 教育庁組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm | 教育庁の組織・担当部署・電話番号を確認できる一覧。 | 2026-08-11 | verified | 区市町村立学校の個別事項は各区市町村教育委員会が所管する場合がある。 |
| education | 教育と文化 | special-needs | 特別支援教育 | education-bureau | 東京都教育委員会（教育庁） | primary | https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm | 教育庁組織アドレスで特別支援教育の企画・学校運営関係を確認。 | 2026-08-11 | verified | education-org-directory | direct | 教育庁組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm | 教育庁の組織・担当部署・電話番号を確認できる一覧。 | 2026-08-11 | verified |  |
| education | 教育と文化 | school-meals-curriculum-ict | 給食・教育内容・ICT | municipal-boards | 各区市町村教育委員会 | possible | https://www.kyoiku.metro.tokyo.lg.jp/inquiry | 東京都教育委員会の問い合わせ案内では、区市町村立学校の個別事項は各区市町村教育委員会へ問い合わせる旨を案内している。 | 2026-08-11 | verified | education-inquiry-guide | alternate | 教育委員会お問い合わせ | inquiry_directory | https://www.kyoiku.metro.tokyo.lg.jp/inquiry | https://www.kyoiku.metro.tokyo.lg.jp/inquiry | 所管外・担当別の問い合わせ先を確認する案内。 | 2026-08-11 | verified | 所在地により窓口が異なるため東京予算ラボから一つの区市町村窓口へ固定しない。 |
| education | 教育と文化 | private-schools | 私立学校 | life-culture-bureau | 東京都生活文化局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/047_seikatubunka/seikatubunka-address.htm | 生活文化局組織アドレスで私学部が私立学校の設置・廃止、助成、指導監督等を担当すると確認。 | 2026-08-11 | verified | life-culture-org-directory | direct | 生活文化局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/047_seikatubunka/seikatubunka-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/047_seikatubunka/seikatubunka-address.htm | 生活文化局・私学部の担当部署と連絡先を確認できる。 | 2026-08-11 | verified | 教育庁ではなく生活文化局私学部が主な所管。 |
| education | 教育と文化 | culture | 文化・文化事業 | life-culture-bureau | 東京都生活文化局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/047_seikatubunka/seikatubunka-address.htm | 東京都の組織案内および生活文化局組織情報で文化振興を担当すると確認。 | 2026-08-11 | verified | life-culture-org-directory | direct | 生活文化局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/047_seikatubunka/seikatubunka-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/047_seikatubunka/seikatubunka-address.htm | 文化分野の担当部署と連絡先を確認できる。 | 2026-08-11 | verified |  |
| education | 教育と文化 | sports | スポーツ | sports-promotion-hq | 東京都スポーツ推進本部 | primary | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内でスポーツ振興・パラスポーツ・大会・施設等を担当すると確認。 | 2026-08-11 | verified | sports-resident-voice | direct | 都民の声 | general_contact | https://www.sports-tokyo-info.metro.tokyo.lg.jp/seisaku/about/tominnokoe.html | https://www.sports-tokyo-info.metro.tokyo.lg.jp/seisaku/about/tominnokoe.html | スポーツ推進本部の事業への意見、提言、要望、苦情、相談、問合せをEメール・手紙・電話・FAXで受け付ける案内。 | 2026-08-11 | verified |  |
| education | 教育と文化 | education-other | その他 | — | — | unresolved | — | テーマ名だけでは安全な所管対応を確認できないため、特定局へ割り当てない。 | — | unresolved | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 担当局が分からない場合の共通フォールバック。担当局が分かる場合は各局の窓口利用を案内している。 | 2026-08-11 | verified | 話題を具体化すると担当局を絞れる場合があります。 |
| industry | 労働と経済 | sme-finance | 中小企業・金融 | industry-labor-bureau | 東京都産業労働局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | 産業労働局組織アドレスで中小企業支援・金融関係の担当部署を確認。 | 2026-08-11 | verified | industry-org-directory | direct | 産業労働局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | 産業労働局のテーマ別担当部署と電話番号を確認できる。 | 2026-08-11 | verified | 個別の助成申請・融資相談と、政策への意見・要望は同じものとして扱わない。 |
| industry | 労働と経済 | employment | 雇用・就業 | industry-labor-bureau | 東京都産業労働局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | 産業労働局組織アドレスで雇用就業関係の担当部署を確認。 | 2026-08-11 | verified | industry-org-directory | direct | 産業労働局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | 産業労働局のテーマ別担当部署と電話番号を確認できる。 | 2026-08-11 | verified | 個別の助成申請・融資相談と、政策への意見・要望は同じものとして扱わない。 |
| industry | 労働と経済 | tourism | 観光 | industry-labor-bureau | 東京都産業労働局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | 産業労働局組織アドレスで観光部門を確認。 | 2026-08-11 | verified | industry-org-directory | direct | 産業労働局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | 産業労働局のテーマ別担当部署と電話番号を確認できる。 | 2026-08-11 | verified | 個別の助成申請・融資相談と、政策への意見・要望は同じものとして扱わない。 |
| industry | 労働と経済 | agriculture-forestry-fisheries | 農林水産 | industry-labor-bureau | 東京都産業労働局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | 産業労働局組織アドレスで農林水産部門を確認。 | 2026-08-11 | verified | industry-org-directory | direct | 産業労働局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | 産業労働局のテーマ別担当部署と電話番号を確認できる。 | 2026-08-11 | verified | 個別の助成申請・融資相談と、政策への意見・要望は同じものとして扱わない。 |
| industry | 労働と経済 | startup-business-support | 創業・事業支援 | industry-labor-bureau | 東京都産業労働局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | 産業労働局組織アドレスで創業支援課を含む事業支援担当を確認。 | 2026-08-11 | verified | industry-org-directory | direct | 産業労働局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | 産業労働局のテーマ別担当部署と電話番号を確認できる。 | 2026-08-11 | verified | 個別の助成申請・融資相談と、政策への意見・要望は同じものとして扱わない。 |
| industry | 労働と経済 | startup-business-support | 創業・事業支援 | startup-strategy-hq | 東京都スタートアップ戦略推進本部 | possible | https://www.startupandglobalfinancialcity.metro.tokyo.lg.jp/startup | 公式ページでスタートアップ戦略の推進・支援を担うことを確認。創業・事業支援全般の主所管とは限らない。 | 2026-08-11 | verified | startup-strategy-reference | reference | スタートアップ戦略の推進 | reference | https://www.startupandglobalfinancialcity.metro.tokyo.lg.jp/startup | https://www.startupandglobalfinancialcity.metro.tokyo.lg.jp/startup | スタートアップ戦略・支援内容を確認する参考ページ。 | 2026-08-11 | verified | 一般的な中小企業・創業支援は産業労働局の担当領域を含む。 |
| industry | 労働と経済 | industry-other | その他 | — | — | unresolved | — | テーマ名だけでは安全な所管対応を確認できないため、特定局へ割り当てない。 | — | unresolved | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 担当局が分からない場合の共通フォールバック。担当局が分かる場合は各局の窓口利用を案内している。 | 2026-08-11 | verified | 話題を具体化すると担当局を絞れる場合があります。 |
| environment | 生活環境 | decarbonization-efficiency | 脱炭素・省エネルギー | environment-bureau | 東京都環境局 | primary | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | 環境局の組織・業務案内で気候変動対策・省エネルギー関係を確認。 | 2026-08-11 | verified | environment-org-directory | direct | 組織と業務案内 | inquiry_directory | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | 環境局の担当部署、所管事務と提言・要望等への導線をテーマ別に確認できる。 | 2026-08-11 | verified |  |
| environment | 生活環境 | renewable-energy | 再生可能エネルギー | environment-bureau | 東京都環境局 | primary | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | 環境局の組織・業務案内で再生可能エネルギー関係を確認。 | 2026-08-11 | verified | environment-org-directory | direct | 組織と業務案内 | inquiry_directory | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | 環境局の担当部署、所管事務と提言・要望等への導線をテーマ別に確認できる。 | 2026-08-11 | verified |  |
| environment | 生活環境 | resources-waste | 資源循環・廃棄物 | environment-bureau | 東京都環境局 | primary | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | 環境局の組織・業務案内で資源循環・廃棄物関係を確認。 | 2026-08-11 | verified | environment-org-directory | direct | 組織と業務案内 | inquiry_directory | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | 環境局の担当部署、所管事務と提言・要望等への導線をテーマ別に確認できる。 | 2026-08-11 | verified |  |
| environment | 生活環境 | nature-biodiversity | 自然環境・生物多様性 | environment-bureau | 東京都環境局 | primary | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | 環境局の組織・業務案内で自然環境・生物多様性関係を確認。 | 2026-08-11 | verified | environment-org-directory | direct | 組織と業務案内 | inquiry_directory | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | 環境局の担当部署、所管事務と提言・要望等への導線をテーマ別に確認できる。 | 2026-08-11 | verified |  |
| environment | 生活環境 | water-environment | 水環境 | environment-bureau | 東京都環境局 | primary | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | 環境局の組織・業務案内で水環境、水質、地下水、東京湾・河川水質等を担当すると確認。 | 2026-08-11 | verified | environment-org-directory | direct | 組織と業務案内 | inquiry_directory | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | 環境局の担当部署、所管事務と提言・要望等への導線をテーマ別に確認できる。 | 2026-08-11 | verified | 水道供給・下水道事業そのものは水道局・下水道局の所管領域。 |
| environment | 生活環境 | water-environment | 水環境 | waterworks-bureau | 東京都水道局 | possible | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で水道局が特別区・多摩地域の水道事業を担当すると確認。水質環境一般とは異なる。 | 2026-08-11 | verified | tokyo-org-reference | reference | 東京都の組織・各局のページ | reference | https://www.metro.tokyo.lg.jp/about/soshiki | https://www.metro.tokyo.lg.jp/about/soshiki | 水道局という別所管が存在することを確認する参考資料。 | 2026-08-11 | verified | 「水環境」が水道サービスを指す場合は環境局へ一律に送らない。 |
| environment | 生活環境 | water-environment | 水環境 | sewerage-bureau | 東京都下水道局 | possible | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で下水道局が区部公共下水道・流域下水道等を担当すると確認。水質環境一般とは異なる。 | 2026-08-11 | verified | tokyo-org-reference | reference | 東京都の組織・各局のページ | reference | https://www.metro.tokyo.lg.jp/about/soshiki | https://www.metro.tokyo.lg.jp/about/soshiki | 下水道局という別所管が存在することを確認する参考資料。 | 2026-08-11 | verified | 「水環境」が下水道事業を指す場合は環境局へ一律に送らない。 |
| environment | 生活環境 | environment-other | その他 | — | — | unresolved | — | テーマ名だけでは安全な所管対応を確認できないため、特定局へ割り当てない。 | — | unresolved | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 担当局が分からない場合の共通フォールバック。担当局が分かる場合は各局の窓口利用を案内している。 | 2026-08-11 | verified | 話題を具体化すると担当局を絞れる場合があります。 |
| city | 都市の整備 | urban-planning | 都市計画・まちづくり | urban-development-bureau | 東京都都市整備局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/039_toshiseibi/toshiseibi-address.htm | 都市整備局組織アドレスで都市計画、まちづくり、再開発等の担当を確認。 | 2026-08-11 | verified | urban-resident-voice | direct | 都市整備局都民の声窓口 | general_contact | https://www.toshiseibi.metro.tokyo.lg.jp/about/jouhou/madoguchi | https://www.toshiseibi.metro.tokyo.lg.jp/about/jouhou/madoguchi | 都市整備局事業への都民の声の受付部署・連絡先と入力フォームへの案内を掲載。 | 2026-08-11 | verified |  |
| city | 都市の整備 | housing-policy | 住宅政策 | housing-policy-hq | 東京都住宅政策本部 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/109_juutakuseisaku/juutakuseisaku-address.htm | 住宅政策本部組織アドレスで住宅政策・都営住宅等の担当を確認。 | 2026-08-11 | verified | housing-org-directory | direct | 住宅政策本部組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/109_juutakuseisaku/juutakuseisaku-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/109_juutakuseisaku/juutakuseisaku-address.htm | 住宅政策本部の担当部署・電話番号を確認できる。 | 2026-08-11 | verified | 候補の「ご意見・ご要望」URLは今回503で本文未確認。 |
| city | 都市の整備 | roads-bridges | 道路・橋梁 | construction-bureau | 東京都建設局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/017_kensetsu/kensetsu-address.htm | 建設局組織アドレスで道路・橋梁の整備・管理担当を確認。 | 2026-08-11 | verified | construction-inquiry | direct | お問い合わせ | inquiry_directory | https://www.kensetsu.metro.tokyo.lg.jp/inquiry | https://www.kensetsu.metro.tokyo.lg.jp/inquiry | 道路・河川・公園等の問い合わせ先、都民の声や専用相談への導線を確認できる。 | 2026-08-11 | verified |  |
| city | 都市の整備 | rivers | 河川 | construction-bureau | 東京都建設局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/017_kensetsu/kensetsu-address.htm | 建設局組織アドレスで河川関係の担当を確認。 | 2026-08-11 | verified | construction-inquiry | direct | お問い合わせ | inquiry_directory | https://www.kensetsu.metro.tokyo.lg.jp/inquiry | https://www.kensetsu.metro.tokyo.lg.jp/inquiry | 道路・河川・公園等の問い合わせ先、都民の声や専用相談への導線を確認できる。 | 2026-08-11 | verified |  |
| city | 都市の整備 | parks-green | 公園・緑地 | construction-bureau | 東京都建設局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/017_kensetsu/kensetsu-address.htm | 建設局組織アドレスで都立公園・緑地関係の担当を確認。 | 2026-08-11 | verified | construction-inquiry | direct | お問い合わせ | inquiry_directory | https://www.kensetsu.metro.tokyo.lg.jp/inquiry | https://www.kensetsu.metro.tokyo.lg.jp/inquiry | 道路・河川・公園等の問い合わせ先、都民の声や専用相談への導線を確認できる。 | 2026-08-11 | verified |  |
| city | 都市の整備 | city-other | その他 | — | — | unresolved | — | テーマ名だけでは安全な所管対応を確認できないため、特定局へ割り当てない。 | — | unresolved | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 担当局が分からない場合の共通フォールバック。担当局が分かる場合は各局の窓口利用を案内している。 | 2026-08-11 | verified | 話題を具体化すると担当局を絞れる場合があります。 |
| safety | 警察と消防 | police-security | 警察活動・治安 | metropolitan-police | 警視庁 | primary | https://www.keishicho.metro.tokyo.lg.jp/about_mpd/shokai/katsudo/vision.html | 警視庁公式の組織運営ビジョンで、複雑化する治安課題への対処を警視庁の任務として確認。 | 2026-08-11 | verified | mpd-opinion | direct | 警視庁の業務に対する苦情・ご要望・ご意見 | opinion_form | https://www.keishicho.metro.tokyo.lg.jp/anket/opinion.html | https://www.keishicho.metro.tokyo.lg.jp/anket/opinion.html | 警視庁の業務への苦情、要望、意見を入力できるフォーム。 | 2026-08-11 | verified | 事件・事故の届出や緊急通報の代替ではない。 |
| safety | 警察と消防 | traffic-police | 交通規制・警察業務としての交通安全 | metropolitan-police | 警視庁 | primary | https://www.keishicho.metro.tokyo.lg.jp/saiyo/type/traffic.html | 警視庁公式の交通警察紹介で、交通指導・取締り、交通安全教育、各種交通規制、道路使用許可を担当すると確認。 | 2026-08-11 | verified | mpd-opinion | direct | 警視庁の業務に対する苦情・ご要望・ご意見 | opinion_form | https://www.keishicho.metro.tokyo.lg.jp/anket/opinion.html | https://www.keishicho.metro.tokyo.lg.jp/anket/opinion.html | 警視庁の交通警察を含む業務への意見・要望を入力できる。 | 2026-08-11 | verified | 信号機・標識等には専用フォームへの案内がある。事件・事故の届出には使わない。 |
| safety | 警察と消防 | traffic-safety-policy | 交通安全政策全般 | citizen-safety-hq | 東京都都民安全総合対策本部 | primary | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で、都民安全総合対策本部の主な事業に交通安全を含む安全・安心施策を明記。 | 2026-08-11 | verified | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 都民安全総合対策本部の直接問い合わせページを今回本文確認できなかったため共通フォールバック。 | 2026-08-11 | verified | 警察の交通取締り・交通規制そのものは警視庁が担当。 |
| safety | 警察と消防 | traffic-safety-policy | 交通安全政策全般 | metropolitan-police | 警視庁 | possible | https://www.keishicho.metro.tokyo.lg.jp/saiyo/type/traffic.html | 警視庁も交通安全教育・交通規制・取締りを担当するため、具体的内容によって関係する。 | 2026-08-11 | verified | mpd-opinion | direct | 警視庁の業務に対する苦情・ご要望・ご意見 | opinion_form | https://www.keishicho.metro.tokyo.lg.jp/anket/opinion.html | https://www.keishicho.metro.tokyo.lg.jp/anket/opinion.html | 警察業務に関する具体的な交通安全の意見・要望を受け付ける。 | 2026-08-11 | verified |  |
| safety | 警察と消防 | fire-ems-prevention | 消防・救急・火災予防 | tokyo-fire-department | 東京消防庁 | primary | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で東京消防庁が消防、救助、救急、火災予防等を担当すると確認。 | 2026-08-11 | verified | tfd-opinion-form | direct | お問い合わせフォーム | opinion_form | https://www.tfd.metro.tokyo.lg.jp/form/index.php?f=tomin_form_01.html | https://www.tfd.metro.tokyo.lg.jp/form/index.php?f=tomin_form_01.html | 相談・問合せ・要望・意見・苦情・情報等を送信できる東京消防庁のフォーム。 | 2026-08-11 | verified | 119番など緊急時には使用しない。東京消防庁の管轄外（稲城市・島しょ等）は地域の消防機関が担当。 |
| safety | 警察と消防 | disaster-general | 防災一般 | general-affairs-disaster | 東京都総務局総合防災部 | primary | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 東京都防災の問い合わせ窓口で「防災対策一般」の担当を総務局総合防災部防災管理課と明記。 | 2026-08-11 | verified | tokyo-disaster-directory | direct | お問い合わせ窓口 | inquiry_directory | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 防災分野を内容別に、総務局・建設局・保健医療局・水道局・下水道局・警視庁・東京消防庁等へ案内する。 | 2026-08-11 | verified |  |
| safety | 警察と消防 | disaster-general | 防災一般 | construction-bureau | 東京都建設局 | possible | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 東京都防災の問い合わせ窓口で、防災の具体的内容に応じて東京都建設局が担当先として掲載されている。 | 2026-08-11 | verified | tokyo-disaster-directory | direct | お問い合わせ窓口 | inquiry_directory | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 「河川の洪水・治水など」など具体的内容に応じた担当先を確認するための一覧。 | 2026-08-11 | verified |  |
| safety | 警察と消防 | disaster-general | 防災一般 | health-medical-bureau | 東京都保健医療局 | possible | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 東京都防災の問い合わせ窓口で、防災の具体的内容に応じて東京都保健医療局が担当先として掲載されている。 | 2026-08-11 | verified | tokyo-disaster-directory | direct | お問い合わせ窓口 | inquiry_directory | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 「医療救護など」など具体的内容に応じた担当先を確認するための一覧。 | 2026-08-11 | verified |  |
| safety | 警察と消防 | disaster-general | 防災一般 | waterworks-bureau | 東京都水道局 | possible | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 東京都防災の問い合わせ窓口で、防災の具体的内容に応じて東京都水道局が担当先として掲載されている。 | 2026-08-11 | verified | tokyo-disaster-directory | direct | お問い合わせ窓口 | inquiry_directory | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 「水道の防災対応」など具体的内容に応じた担当先を確認するための一覧。 | 2026-08-11 | verified |  |
| safety | 警察と消防 | disaster-general | 防災一般 | sewerage-bureau | 東京都下水道局 | possible | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 東京都防災の問い合わせ窓口で、防災の具体的内容に応じて東京都下水道局が担当先として掲載されている。 | 2026-08-11 | verified | tokyo-disaster-directory | direct | お問い合わせ窓口 | inquiry_directory | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 「下水道の防災対応」など具体的内容に応じた担当先を確認するための一覧。 | 2026-08-11 | verified |  |
| safety | 警察と消防 | disaster-general | 防災一般 | metropolitan-police | 警視庁 | possible | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 東京都防災の問い合わせ窓口で、防災の具体的内容に応じて警視庁が担当先として掲載されている。 | 2026-08-11 | verified | tokyo-disaster-directory | direct | お問い合わせ窓口 | inquiry_directory | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 「警察の災害対応」など具体的内容に応じた担当先を確認するための一覧。 | 2026-08-11 | verified |  |
| safety | 警察と消防 | disaster-general | 防災一般 | tokyo-fire-department | 東京消防庁 | possible | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 東京都防災の問い合わせ窓口で、防災の具体的内容に応じて東京消防庁が担当先として掲載されている。 | 2026-08-11 | verified | tokyo-disaster-directory | direct | お問い合わせ窓口 | inquiry_directory | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | 「消防の災害対応」など具体的内容に応じた担当先を確認するための一覧。 | 2026-08-11 | verified |  |
| safety | 警察と消防 | safety-other | その他 | — | — | unresolved | — | テーマ名だけでは安全な所管対応を確認できないため、特定局へ割り当てない。 | — | unresolved | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 担当局が分からない場合の共通フォールバック。担当局が分かる場合は各局の窓口利用を案内している。 | 2026-08-11 | verified | 話題を具体化すると担当局を絞れる場合があります。 |
| admin | 企画・総務 | policy-strategy | 都の基本政策・長期戦略 | policy-planning-bureau | 東京都政策企画局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/001_seisakukikaku/seisakukikaku-address.htm | 政策企画局組織アドレスおよび東京都組織案内で、都政の基本計画・重要施策の企画立案・総合調整を担当すると確認。 | 2026-08-11 | verified | policy-org-directory | direct | 政策企画局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/001_seisakukikaku/seisakukikaku-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/001_seisakukikaku/seisakukikaku-address.htm | 政策企画局の担当部署と連絡先を確認できる。 | 2026-08-11 | verified | 候補の /inquiry は今回503で本文未確認。 |
| admin | 企画・総務 | administration-municipal-statistics | 行政運営・庁内管理・区市町村行政・統計 | general-affairs-bureau | 東京都総務局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm | 総務局組織アドレスで庁内管理、行政部の区市町村行政・財政、統計部等の担当を確認。 | 2026-08-11 | verified | general-affairs-org-directory | direct | 総務局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm | 総務局の担当部署・連絡先を分野別に確認できる。 | 2026-08-11 | verified | 区市町村の個別行政サービスそのものは各区市町村所管の場合がある。 |
| admin | 企画・総務 | administrative-dx | 行政DX・デジタル | digital-service-bureau | 東京都デジタルサービス局 | primary | https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織案内で、各局DX推進支援、全庁デジタル統括、デジタル人材等を担当すると確認。 | 2026-08-11 | verified | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | デジタルサービス局の候補問い合わせページを今回本文確認できなかったため共通フォールバック。 | 2026-08-11 | verified | 候補URL https://www.digitalservice.metro.tokyo.lg.jp/inquiry は今回503。 |
| admin | 企画・総務 | elections | 選挙 | election-commission | 東京都選挙管理委員会事務局 | primary | https://www.senkyo.metro.tokyo.lg.jp/about/jigyougaiyou | 事業概要で選挙の管理執行、選挙啓発、政治資金等の担当を明記。 | 2026-08-11 | verified | election-business-directory | direct | 事業概要 | inquiry_directory | https://www.senkyo.metro.tokyo.lg.jp/about/jigyougaiyou | https://www.senkyo.metro.tokyo.lg.jp/about/jigyougaiyou | 総務課・選挙課等の担当業務と連絡先を確認できる。 | 2026-08-11 | verified | 選挙管理委員会は予算一般への意見提出窓口ではなく、選挙テーマの所管確認先。 |
| admin | 企画・総務 | admin-other | その他 | — | — | unresolved | — | テーマ名だけでは安全な所管対応を確認できないため、特定局へ割り当てない。 | — | unresolved | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 担当局が分からない場合の共通フォールバック。担当局が分かる場合は各局の窓口利用を案内している。 | 2026-08-11 | verified | 話題を具体化すると担当局を絞れる場合があります。 |
| debt | 公債費 | bonds-debt-service | 都債・償還・利払い・財政運営 | finance-bureau | 東京都財務局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/006_zaimu/zaimu-address.htm | 財務局組織アドレスで財政課が予算・財政制度、公債課が都債等を担当すると確認。 | 2026-08-11 | verified | finance-org-directory | direct | 財務局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/006_zaimu/zaimu-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/006_zaimu/zaimu-address.htm | 財政課・公債課等の担当部署と連絡先を確認できる。 | 2026-08-11 | verified | 公債費は個別住民サービスではなく財政・都債・予算運営に関するテーマ。 |
| debt | 公債費 | debt-other | その他 | — | — | unresolved | — | テーマ名だけでは安全な所管対応を確認できないため、特定局へ割り当てない。 | — | unresolved | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 担当局が分からない場合の共通フォールバック。担当局が分かる場合は各局の窓口利用を案内している。 | 2026-08-11 | verified | 話題を具体化すると担当局を絞れる場合があります。 |
| linked | 税連動経費等 | ward-fiscal-adjustment | 都区財政調整 | general-affairs-bureau | 東京都総務局行政部 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm | 総務局組織アドレスで行政部区政課が特別区の財政・都区財政調整等を担当すると確認。 | 2026-08-11 | verified | general-affairs-org-directory | direct | 総務局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm | 行政部区政課を含む担当部署・連絡先を確認できる。 | 2026-08-11 | verified | 制度個別ページ候補は今回503で本文未確認のため、組織アドレスを確定データに使用。 |
| linked | 税連動経費等 | municipal-fiscal-adjustment | 市町村への財政調整 | general-affairs-bureau | 東京都総務局行政部 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm | 総務局組織アドレスで行政部市町村課が市町村財政、地方交付税等を担当すると確認。 | 2026-08-11 | verified | general-affairs-org-directory | direct | 総務局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm | 行政部市町村課を含む担当部署・連絡先を確認できる。 | 2026-08-11 | verified |  |
| linked | 税連動経費等 | metropolitan-tax | 都税・税制度 | tax-bureau | 東京都主税局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/008_tax/tax-address.htm | 主税局組織アドレスで税制部門が都税制度の企画・調査等を担当すると確認。 | 2026-08-11 | verified | tax-org-directory | direct | 主税局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/008_tax/tax-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/008_tax/tax-address.htm | 主税局の税目・担当部署・連絡先を確認できる。 | 2026-08-11 | verified | 候補の都民の声URLは今回503で本文未確認。 |
| linked | 税連動経費等 | tokyo-fiscal-system | 東京都全体の財政制度 | finance-bureau | 東京都財務局 | primary | https://www.soshiki-address.metro.tokyo.lg.jp/006_zaimu/zaimu-address.htm | 財務局組織アドレスで財政課が予算、財政制度、財政計画等を担当すると確認。 | 2026-08-11 | verified | finance-org-directory | direct | 財務局組織アドレス | inquiry_directory | https://www.soshiki-address.metro.tokyo.lg.jp/006_zaimu/zaimu-address.htm | https://www.soshiki-address.metro.tokyo.lg.jp/006_zaimu/zaimu-address.htm | 財政制度・予算の担当部署と連絡先を確認できる。 | 2026-08-11 | verified |  |
| linked | 税連動経費等 | linked-other | その他 | — | — | unresolved | — | テーマ名だけでは安全な所管対応を確認できないため、特定局へ割り当てない。 | — | unresolved | tokyo-resident-voice-guide | fallback | 都民の声総合窓口（留意事項・各局案内） | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 担当局が分からない場合の共通フォールバック。担当局が分かる場合は各局の窓口利用を案内している。 | 2026-08-11 | verified | 話題を具体化すると担当局を絞れる場合があります。 |


### 5.1 窓口運営組織

第5章の `organizationId` / `organizationName` はテーマの所管関係を表す。窓口の運営主体は次の表で別に管理し、所管組織と同一だと推測しない。

| contactId | contactOrganizationId | contactOrganizationName |
|---|---|---|
| tokyo-resident-voice-guide | tokyo-metropolitan-government | 東京都（都民の声総合窓口） |
| education-org-directory | education-bureau | 東京都教育委員会（教育庁） |
| education-inquiry-guide | education-bureau | 東京都教育委員会（教育庁） |
| life-culture-org-directory | life-culture-bureau | 東京都生活文化局 |
| sports-resident-voice | sports-promotion-hq | 東京都スポーツ推進本部 |
| industry-org-directory | industry-labor-bureau | 東京都産業労働局 |
| startup-strategy-reference | startup-strategy-hq | 東京都スタートアップ戦略推進本部 |
| environment-org-directory | environment-bureau | 東京都環境局 |
| tokyo-org-reference | tokyo-metropolitan-government | 東京都 |
| urban-resident-voice | urban-development-bureau | 東京都都市整備局 |
| housing-org-directory | housing-policy-hq | 東京都住宅政策本部 |
| construction-inquiry | construction-bureau | 東京都建設局 |
| mpd-opinion | metropolitan-police | 警視庁 |
| tfd-opinion-form | tokyo-fire-department | 東京消防庁 |
| tokyo-disaster-directory | tokyo-metropolitan-government | 東京都（防災ホームページ） |
| health-medical-resident-voice-form | health-medical-bureau | 東京都保健医療局 |
| health-medical-contact-directory | health-medical-bureau | 東京都保健医療局 |
| policy-org-directory | policy-planning-bureau | 東京都政策企画局 |
| general-affairs-org-directory | general-affairs-bureau | 東京都総務局 |
| election-business-directory | election-commission | 東京都選挙管理委員会事務局 |
| finance-org-directory | finance-bureau | 東京都財務局 |
| tax-org-directory | tax-bureau | 東京都主税局 |

`contactRole` はテーマから見た窓口の役割である。

- `direct`: 選択テーマの担当・意見先へ直接進む窓口
- `alternate`: 所在地や個別条件に応じた別所管を確認する窓口
- `fallback`: 直接窓口を安全に確認できない場合または担当不明時の共通窓口
- `reference`: 制度や所管を確認する資料であり、意見送信先ではない

`relationVerificationStatus` と `contactVerificationStatus` は独立して扱う。所管関係が `verified` でも、直接窓口が `partial` の場合は、その組織の直接窓口を確認済みとは表示しない。第5章で都民の声総合窓口を使う行は、その窓口自体が `verified` であることを示すだけであり、所管局の直接窓口を検証した意味ではない。


## 6. 9分野×テーマの充足確認


| 分野 | テーマ総数（その他含む） | 具体テーマ数 | 具体テーマのうち専用/担当別のverified窓口あり | その他 | 安全なフォールバック |
|---|---|---|---|---|---|
| 福祉と保健 | 6 | 5 | 2 | あり | 全テーマに安全な経路あり |
| 教育と文化 | 7 | 6 | 6 | あり | 全テーマに安全な経路あり |
| 労働と経済 | 6 | 5 | 5 | あり | 全テーマに安全な経路あり |
| 生活環境 | 6 | 5 | 5 | あり | 全テーマに安全な経路あり |
| 都市の整備 | 6 | 5 | 5 | あり | 全テーマに安全な経路あり |
| 警察と消防 | 6 | 5 | 5 | あり | 全テーマに安全な経路あり |
| 企画・総務 | 5 | 4 | 3 | あり | 全テーマに安全な経路あり |
| 公債費 | 2 | 1 | 1 | あり | 全テーマに安全な経路あり |
| 税連動経費等 | 5 | 4 | 4 | あり | 全テーマに安全な経路あり |


> 「専用/担当別」は都民の声総合窓口以外の `verified` contact があるテーマ数。直接の意見フォームに限らず、担当部署を特定できる公式 `inquiry_directory` を含む。


## 7. 共通制度の確認表


| 制度/経路 | ContactKind | URL | status | 確認結果 |
|---|---|---|---|---|
| 都民の声総合窓口 | general_contact | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | verified | 担当局不明時の共通フォールバック。担当局が分かる場合は各局窓口を利用するよう案内。 |
| 東京都議会への意見・要望 | opinion_form | https://www.gikai.metro.tokyo.lg.jp/FormMail/demand/FormMail.html | verified | 東京都議会への意見・要望を直接入力。都知事・都政一般への意見は都民の声を案内。 |
| 東京都議会議員一覧 | reference | https://www.gikai.metro.tokyo.lg.jp/member.html | verified | 現職の都議会議員を確認する。 |
| 会派連絡先 | inquiry_directory | https://www.gikai.metro.tokyo.lg.jp/outline/factional.html | verified | 会派構成と連絡先を確認する。 |
| 請願 | reference | https://www.gikai.metro.tokyo.lg.jp/petition/guide.html | verified | 紹介議員が必要な正式な議会手続。提出方法等を案内。 |
| 陳情 | reference | https://www.gikai.metro.tokyo.lg.jp/petition/guide.html | verified | 紹介議員なしで提出できる議会手続。提出方法等を案内。 |
| 計画等に係る意見公募一覧 | reference | https://www.soumu.metro.tokyo.lg.jp/01soumu-johokokaika/jyuyokohyo/2 | verified | 現在・過去の計画等に係る意見公募を確認する一覧。特定テーマが募集中とは推測しない。 |
| 選挙 | inquiry_directory | https://www.senkyo.metro.tokyo.lg.jp/about/jigyougaiyou | verified | 選挙管理委員会の事業・担当を確認。予算一般への意見提出制度ではない。 |
| 都民提案2026 | reference | https://www.zaimu.metro.tokyo.lg.jp/zaisei/zaisei/zigyou_teian/2026tomin_teian | verified | 2026年度の事業提案制度。提案受付は5月31日で終了し、8月11日時点では8月31日まで投票受付中。常設窓口ではない。 |


### 共通制度の判断

- **都民の声総合窓口**は担当不明時のフォールバック。東京都公式本文が、担当局が分かる場合は各局の都民の声窓口を利用するよう案内している。
- **東京都議会への意見・要望**には直接入力フォームがある。一般問い合わせページとは別物。
- **請願と陳情**は同じガイドで説明されるが、請願は紹介議員が必要、陳情は紹介議員なし。
- **計画等に係る意見公募**は案件一覧として扱い、選択テーマが現在募集中とは推測しない。
- **選挙**は所管テーマであり、予算一般への参加制度ではない。
- **都民提案2026**は時期・要件のある制度。2026-08-11時点で提案受付は終了し、8月31日まで投票受付中のため、常設の主要導線にしない。


## 8. 既存7制度から新導線への移行表


| 現行ID | 移行方針 | 理由 |
|---|---|---|
| bureau-inquiry | テーマ別の直接ルーティングへ置換 | 現行の一律「担当局」導線では粗すぎる。topic→relation→contactへ移行し、旧IDは移行記録として残す。 |
| resident-voice | 共通フォールバックとして残す | 東京都自身が担当局が分かる場合は各局窓口を案内しているため、最優先ではなく担当不明時に使用。 |
| public-comment | 「計画等に係る意見公募一覧」として残す | 選択テーマに現在募集中案件があるとは推測しない。availabilityを実装するまでは一覧リンクのみ。 |
| petition | 共通制度として残す | 紹介議員が必要な正式手続として案内。 |
| written-request | 「陳情」として共通制度に残す | 請願・陳情ガイドに基づき、紹介議員なしの正式手続として説明。 |
| assembly-member-request | 共通制度として残す | 議員一覧・会派連絡先・議会意見フォームを分離して案内する。 |
| election-citizen-proposal | 分割して補足扱い | 選挙は「企画・総務」の所管テーマ。都民提案は時期・要件のある別制度で、主要な常時導線から外し補足にする。 |


## 9. 未解決事項一覧


| 事項 | 監査結果・実装時の扱い |
|---|---|
| 福祉局等の直接窓口 | 候補URLは存在するが今回の取得では503で本文未確認。所管は確定、直接窓口は確定データにせず都民の声総合窓口へフォールバック。保健医療局はブラウザー相当の取得と利用者による画面確認で本文を確認できたため、確定データへ移行済み。 |
| 区市町村立学校の個別事項 | 都教育庁が政策・指導等で関係する領域はあるが、個別学校事項は所在地の区市町村教育委員会が所管する場合がある。ユーザー所在地なしに一つの窓口へ固定しない。 |
| 創業・事業支援 | 産業労働局の創業支援をprimary、スタートアップ戦略推進本部はスタートアップ施策に限るpossibleとして分離。 |
| 水環境 | 水質・地下水等は環境局。水道供給・下水道事業は水道局・下水道局。UI上で具体化が必要。 |
| 交通安全政策全般 | 都民安全総合対策本部をprimary、警察業務に関する交通安全は警視庁possibleとして分離。都民安全本部の直接窓口は本文未確認。 |
| 防災一般 | 総務局総合防災部を「防災対策一般」のprimaryと確認。河川・医療救護・水道・下水道・警察・消防は内容別に分岐。 |
| パブリックコメントの現在性 | 一覧は確認済みだが、選択テーマに現在募集中案件があるかは動的確認なしに表示しない。 |
| 都民提案 | 2026年度提案受付は終了済み。8月11日時点は投票期間。常時利用できる意見窓口として扱わない。 |


## 10. URL確認結果一覧


| 確認URL | 正式ページタイトル | 現在の組織名 | 正規URL | verificationStatus | 確認日 | ページ目的 | 受け付ける内容 | 注意 |
|---|---|---|---|---|---|---|---|---|
| https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | お問い合わせ窓口｜東京都防災ホームページ | 東京都（防災ホームページ） | https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html | verified | 2026-08-11 | 防災内容別の担当局・部署を確認する一覧。 |  |  |
| https://www.digitalservice.metro.tokyo.lg.jp/inquiry | 未確認（デジタルサービス局 inquiry 候補） | 東京都デジタルサービス局 | https://www.digitalservice.metro.tokyo.lg.jp/inquiry | partial | — | デジタルサービス局の問い合わせページ候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.fukushi.metro.tokyo.lg.jp/contact | 未確認（福祉局 contact 候補） | 東京都福祉局 | https://www.fukushi.metro.tokyo.lg.jp/contact | partial | — | 福祉局の直接窓口候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.gikai.metro.tokyo.lg.jp/FormMail/demand/FormMail.html | ご意見・ご要望｜東京都議会 | 東京都議会 | https://www.gikai.metro.tokyo.lg.jp/FormMail/demand/FormMail.html | verified | 2026-08-11 | 東京都議会への意見・要望を直接入力するフォーム。 | 東京都議会への意見・要望。 |  |
| https://www.gikai.metro.tokyo.lg.jp/about/contact.html | お問い合わせ｜東京都議会 | 東京都議会 | https://www.gikai.metro.tokyo.lg.jp/about/contact.html | verified | 2026-08-11 | 議会局の一般問い合わせと意見・要望等の各導線案内。 |  |  |
| https://www.gikai.metro.tokyo.lg.jp/member.html | 議員の紹介｜東京都議会 | 東京都議会 | https://www.gikai.metro.tokyo.lg.jp/member.html | verified | 2026-08-11 | 都議会議員を確認する一覧。 |  |  |
| https://www.gikai.metro.tokyo.lg.jp/outline/factional.html | 会派構成・会派略称一覧｜東京都議会 | 東京都議会 | https://www.gikai.metro.tokyo.lg.jp/outline/factional.html | verified | 2026-08-11 | 会派構成・連絡先を確認する一覧。 |  |  |
| https://www.gikai.metro.tokyo.lg.jp/petition/guide.html | 請願・陳情ガイド｜東京都議会 | 東京都議会 | https://www.gikai.metro.tokyo.lg.jp/petition/guide.html | verified | 2026-08-11 | 請願・陳情の提出方法・要件等を確認する制度案内。 |  |  |
| https://www.hokeniryo.metro.tokyo.lg.jp/contact | お問い合わせ｜東京都保健医療局 | 東京都保健医療局 | https://www.hokeniryo.metro.tokyo.lg.jp/contact | verified | 2026-08-11 | 保健医療局の分野・内容別問い合わせ先と都民の声窓口を案内するページ。 | 保健医療局事業への要望・意見、電話・メールフォーム・文書等。 | 一般的な自動取得では503となる場合があるが、ブラウザー相当のUser-AgentではHTTP 200と本文を確認し、利用者のブラウザーでも表示を確認。 |
| https://logoform.jp/form/tmgform/297877 | 「東京の保健医療についてあなたの声をお寄せください」入力フォーム | 東京都保健医療局 | https://logoform.jp/form/tmgform/297877 | verified | 2026-08-11 | 保健医療局公式のお問い合わせページから案内される都民の声入力フォーム。 | 保健医療局の事業に関する要望・意見。 | 外部フォーム基盤LoGoフォームを使用。公式ページ上のリンク先とHTTP 200を確認。 |
| https://www.juutakuseisaku.metro.tokyo.lg.jp/inquiry/iken | 未確認（住宅政策本部 ご意見・ご要望候補） | 東京都住宅政策本部 | https://www.juutakuseisaku.metro.tokyo.lg.jp/inquiry/iken | partial | — | 住宅政策本部の意見・要望ページ候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | 組織と業務案内｜東京都環境局 | 東京都環境局 | https://www.kankyo.metro.tokyo.lg.jp/about/organization/ | verified | 2026-08-11 | 環境局の所管事務と提言・要望等のテーマ別導線。 |  |  |
| https://www.kankyo.metro.tokyo.lg.jp/inquiry | 未確認（環境局 inquiry 候補） | 東京都環境局 | https://www.kankyo.metro.tokyo.lg.jp/inquiry | partial | — | 環境局の問い合わせページ候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.keishicho.metro.tokyo.lg.jp/about_mpd/shokai/katsudo/vision.html | 警視庁組織運営ビジョン | 警視庁 | https://www.keishicho.metro.tokyo.lg.jp/about_mpd/shokai/katsudo/vision.html | verified | 2026-08-11 | 警視庁が治安課題へ対処する組織であることの所管根拠。 |  |  |
| https://www.keishicho.metro.tokyo.lg.jp/anket/opinion.html | 警視庁の業務に対する苦情・ご要望・ご意見 | 警視庁 | https://www.keishicho.metro.tokyo.lg.jp/anket/opinion.html | verified | 2026-08-11 | 警視庁業務への意見・要望を直接入力するフォーム。 | 警視庁業務への苦情・要望・意見。事件・事故の届出は対象外。 |  |
| https://www.keishicho.metro.tokyo.lg.jp/saiyo/type/traffic.html | 交通警察｜警視庁の仕事（職種紹介） | 警視庁 | https://www.keishicho.metro.tokyo.lg.jp/saiyo/type/traffic.html | verified | 2026-08-11 | 交通警察の任務・交通規制・交通安全教育等の所管根拠。 |  |  |
| https://www.kensetsu.metro.tokyo.lg.jp/inquiry | お問い合わせ｜東京都建設局 | 東京都建設局 | https://www.kensetsu.metro.tokyo.lg.jp/inquiry | verified | 2026-08-11 | 道路・河川・公園等の問い合わせ先と都民の声等への導線。 |  |  |
| https://www.kodomoseisaku.metro.tokyo.lg.jp/inquiry | 未確認（子供政策連携室 inquiry 候補） | 東京都子供政策連携室 | https://www.kodomoseisaku.metro.tokyo.lg.jp/inquiry | partial | — | 子供政策連携室の問い合わせ候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.kyoiku.metro.tokyo.lg.jp/consulting/other/mail | 未確認（教育委員会「あなたの声」候補） | 東京都教育委員会（教育庁） | https://www.kyoiku.metro.tokyo.lg.jp/consulting/other/mail | partial | — | 教育委員会の意見・要望ページ候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.kyoiku.metro.tokyo.lg.jp/inquiry | 教育委員会 お問い合わせ | 東京都教育委員会（教育庁） | https://www.kyoiku.metro.tokyo.lg.jp/inquiry | verified | 2026-08-11 | 教育庁の担当別問い合わせと所管外の案内。 |  |  |
| https://www.metro.tokyo.lg.jp/about/soshiki | 東京都の組織・各局のページ | 東京都 | https://www.metro.tokyo.lg.jp/about/soshiki | verified | 2026-08-11 | 東京都の現行組織名と各局の主な事業を確認する一次資料。 |  |  |
| https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ | 未確認（都民の声トップ候補） | 東京都 | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ | partial | — | 都民の声トップ候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | 提言・意見・要望等をお寄せいただく際の留意事項｜都民の声総合窓口 | 東京都 | https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/ryuijikou | verified | 2026-08-11 | 担当局が不明な場合の共通ルート。担当局が分かる場合は各局窓口を案内。 |  |  |
| https://www.sangyo-rodo.metro.tokyo.lg.jp/inquiry | 未確認（産業労働局 inquiry 候補） | 東京都産業労働局 | https://www.sangyo-rodo.metro.tokyo.lg.jp/inquiry | partial | — | 産業労働局の問い合わせページ候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.seikatubunka.metro.tokyo.lg.jp/about/jouhou/tominnokoe | 未確認（生活文化局 都民の声候補） | 東京都生活文化局 | https://www.seikatubunka.metro.tokyo.lg.jp/about/jouhou/tominnokoe | partial | — | 生活文化局の都民の声候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.seisakukikaku.metro.tokyo.lg.jp/inquiry | 未確認（政策企画局 inquiry 候補） | 東京都政策企画局 | https://www.seisakukikaku.metro.tokyo.lg.jp/inquiry | partial | — | 政策企画局の問い合わせページ候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.senkyo.metro.tokyo.lg.jp/about/jigyougaiyou | 事業概要｜東京都選挙管理委員会 | 東京都選挙管理委員会 | https://www.senkyo.metro.tokyo.lg.jp/about/jigyougaiyou | verified | 2026-08-11 | 選挙管理委員会事務局の担当業務・連絡先。 |  |  |
| https://www.soshiki-address.metro.tokyo.lg.jp/001_seisakukikaku/seisakukikaku-address.htm | 政策企画局組織アドレス | 東京都政策企画局 | https://www.soshiki-address.metro.tokyo.lg.jp/001_seisakukikaku/seisakukikaku-address.htm | verified | 2026-08-11 | 政策企画局の担当部署・電話番号一覧。 |  |  |
| https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm | 総務局組織アドレス | 東京都総務局 | https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm | verified | 2026-08-11 | 総務局の担当部署・業務・電話番号一覧。 |  |  |
| https://www.soshiki-address.metro.tokyo.lg.jp/006_zaimu/zaimu-address.htm | 財務局組織アドレス | 東京都財務局 | https://www.soshiki-address.metro.tokyo.lg.jp/006_zaimu/zaimu-address.htm | verified | 2026-08-11 | 財務局の財政課・公債課等の担当業務・電話番号一覧。 |  |  |
| https://www.soshiki-address.metro.tokyo.lg.jp/008_tax/tax-address.htm | 主税局組織アドレス | 東京都主税局 | https://www.soshiki-address.metro.tokyo.lg.jp/008_tax/tax-address.htm | verified | 2026-08-11 | 主税局の税制・税務担当部署・電話番号一覧。 |  |  |
| https://www.soshiki-address.metro.tokyo.lg.jp/017_kensetsu/kensetsu-address.htm | 建設局組織アドレス | 東京都建設局 | https://www.soshiki-address.metro.tokyo.lg.jp/017_kensetsu/kensetsu-address.htm | verified | 2026-08-11 | 建設局の担当部署・業務・電話番号一覧。 |  |  |
| https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | 産業労働局組織アドレス | 東京都産業労働局 | https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm | verified | 2026-08-11 | 産業労働局の担当部署・業務・電話番号一覧。 |  |  |
| https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm | 教育庁組織アドレス | 東京都教育委員会（教育庁） | https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm | verified | 2026-08-11 | 教育庁の担当部署・業務・電話番号一覧。 |  |  |
| https://www.soshiki-address.metro.tokyo.lg.jp/039_toshiseibi/toshiseibi-address.htm | 都市整備局組織アドレス | 東京都都市整備局 | https://www.soshiki-address.metro.tokyo.lg.jp/039_toshiseibi/toshiseibi-address.htm | verified | 2026-08-11 | 都市整備局の担当部署・業務・電話番号一覧。 |  |  |
| https://www.soshiki-address.metro.tokyo.lg.jp/047_seikatubunka/seikatubunka-address.htm | 生活文化局組織アドレス | 東京都生活文化局 | https://www.soshiki-address.metro.tokyo.lg.jp/047_seikatubunka/seikatubunka-address.htm | verified | 2026-08-11 | 生活文化局・私学部等の担当部署と連絡先一覧。 |  |  |
| https://www.soshiki-address.metro.tokyo.lg.jp/109_juutakuseisaku/juutakuseisaku-address.htm | 住宅政策本部組織アドレス | 東京都住宅政策本部 | https://www.soshiki-address.metro.tokyo.lg.jp/109_juutakuseisaku/juutakuseisaku-address.htm | verified | 2026-08-11 | 住宅政策本部の担当部署・業務・電話番号一覧。 |  |  |
| https://www.soumu.metro.tokyo.lg.jp/01soumu-johokokaika/jyuyokohyo/2 | 計画等に係る意見公募｜東京都総務局総務部情報公開課 | 東京都総務局 | https://www.soumu.metro.tokyo.lg.jp/01soumu-johokokaika/jyuyokohyo/2 | verified | 2026-08-11 | 計画等の意見公募案件を確認する一覧。 |  |  |
| https://www.soumu.metro.tokyo.lg.jp/05gyousei/04kusichousonindex/04tokubetsukuzaiseichouseikouhukin/a | 未確認（都区財政調整個別ページ候補） | 東京都総務局 | https://www.soumu.metro.tokyo.lg.jp/05gyousei/04kusichousonindex/04tokubetsukuzaiseichouseikouhukin/a | partial | — | 都区財政調整の制度個別ページ候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.soumu.metro.tokyo.lg.jp/inquiry | 未確認（総務局 inquiry 候補） | 東京都総務局 | https://www.soumu.metro.tokyo.lg.jp/inquiry | partial | — | 総務局の問い合わせページ候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.sports-tokyo-info.metro.tokyo.lg.jp/seisaku/about/tominnokoe.html | 都民の声｜スポーツTOKYOインフォメーション | 東京都スポーツ推進本部 | https://www.sports-tokyo-info.metro.tokyo.lg.jp/seisaku/about/tominnokoe.html | verified | 2026-08-11 | スポーツ推進本部事業への意見・提言・要望等の受付案内。 | 意見・提言・要望・苦情・相談・問合せ（メール・手紙・電話・FAX） |  |
| https://www.startupandglobalfinancialcity.metro.tokyo.lg.jp/startup | スタートアップ戦略の推進｜スタートアップ戦略推進本部 | 東京都スタートアップ戦略推進本部 | https://www.startupandglobalfinancialcity.metro.tokyo.lg.jp/startup | verified | 2026-08-11 | スタートアップ戦略・取組を確認する参考資料。 |  |  |
| https://www.tax.metro.tokyo.lg.jp/about/portal/voice | 未確認（主税局 都民の声候補） | 東京都主税局 | https://www.tax.metro.tokyo.lg.jp/about/portal/voice | partial | — | 主税局の都民の声候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.tfd.metro.tokyo.lg.jp/form.html | ご意見・ご相談｜東京消防庁 | 東京消防庁 | https://www.tfd.metro.tokyo.lg.jp/form.html | verified | 2026-08-11 | 東京消防庁の意見・相談フォーム等への案内ページ。 |  |  |
| https://www.tfd.metro.tokyo.lg.jp/form/index.php?f=tomin_form_01.html | お問い合わせフォーム 入力｜東京消防庁 | 東京消防庁 | https://www.tfd.metro.tokyo.lg.jp/form/index.php?f=tomin_form_01.html | verified | 2026-08-11 | 相談・問合せ・要望・意見・苦情等を直接送るフォーム。 | 相談・問合せ・要望・意見・苦情・情報・感謝。119番等の緊急連絡は対象外。 |  |
| https://www.tomin-anzen.metro.tokyo.lg.jp/ | 未確認（都民安全総合対策本部トップ） | 東京都都民安全総合対策本部 | https://www.tomin-anzen.metro.tokyo.lg.jp/ | partial | — | 都民安全総合対策本部サイト候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.toshiseibi.metro.tokyo.lg.jp/about/jouhou/madoguchi | 都市整備局都民の声窓口｜東京都都市整備局 | 東京都都市整備局 | https://www.toshiseibi.metro.tokyo.lg.jp/about/jouhou/madoguchi | verified | 2026-08-11 | 都市整備局の都民の声受付窓口・連絡先案内。 |  |  |
| https://www.zaimu.metro.tokyo.lg.jp/about/johokokai/goiken | 未確認（財務局 都民の声候補） | 東京都財務局 | https://www.zaimu.metro.tokyo.lg.jp/about/johokokai/goiken | partial | — | 財務局の都民の声候補。 |  | 2026-08-11の監査では503等により本文を確認できず。リンク切れとは断定しない。verifiedAtは付与しない。 |
| https://www.zaimu.metro.tokyo.lg.jp/zaisei/zaisei/zigyou_teian/2026tomin_teian | 都民提案2026｜事業提案制度 | 東京都財務局 | https://www.zaimu.metro.tokyo.lg.jp/zaisei/zaisei/zigyou_teian/2026tomin_teian | verified | 2026-08-11 | 2026年度の都民提案の募集・投票・条件を確認する制度ページ。 |  |  |


`partial` は「リンク切れ」を意味しない。今回の監査環境で503等となり本文を確認できなかったため、確定データには使用しないか、候補としてのみ保持する。


## 11. 調査による変更履歴


| 監査前 | 監査後 | 理由 |
|---|---|---|
| 9分野→代表局 | テーマ→複数所管関係へ変更 | 一対一対応を避け、primary/shared/possible/unresolvedを明示。 |
| 私立学校→教育庁の可能性 | 生活文化局私学部 primary | 生活文化局の組織情報で私学部の担当を確認。 |
| 防災一般→東京消防庁 | 総務局総合防災部 primary＋内容別分岐 | 東京都防災の公式問い合わせ一覧で確認。 |
| 水環境→環境局のみ | 環境局 primary＋水道局/下水道局 possible | 「水環境」と上下水道事業を分離。 |
| 創業・事業支援→産業労働局のみ | 産業労働局 primary＋スタートアップ戦略推進本部 possible | 現行組織を公式情報で確認。 |
| 全窓口を「公式窓口へ」 | ContactKind別に分類 | 意見フォーム、問い合わせ一覧、一般連絡、参考資料を区別。 |
| 教育委員会の直接意見URL | 本文未確認のため確定データから外す | 503。教育庁組織アドレス/問い合わせ案内を使用。 |
| 都民の声トップ | 本文確認済みの留意事項ページへ | 担当局が分かる場合は各局利用というルーティング原則を確認。 |
| パブコメ常時利用 | 公式の「計画等に係る意見公募」一覧へ | 選択テーマの募集有無は推測しない。 |
| 東京都議会の一般お問い合わせのみ | 直接の「ご意見・ご要望」フォームを追加 | 一般問い合わせページが専用フォームを案内していることを確認。 |
| 子供政策連携室をshared候補 | possible | 子供政策の企画立案・総合調整は確認できるが、子育て・児童福祉全体の共同所管までは確認できない。 |
| 所管組織と窓口を同じレコードで扱う | 所管関係・窓口運営組織・contactRoleを分離 | 都民の声フォールバックを所管局の直接窓口と誤表示しないため。 |
| 保健医療局の問い合わせページをpartial扱い | 問い合わせ一覧と直接意見フォームをverifiedとして採用 | ブラウザー相当の取得でHTTP 200と本文を確認し、利用者のブラウザーでも通常表示を確認できたため。 |


## 12. TypeScriptデータへ変換する際の注意事項

1. **この表をそのまま一局一窓口へ正規化しない。** 所管関係、窓口マスター、テーマと窓口の対応を分離し、1テーマに複数relation/contactsを保持する。
2. `organizationId` / `contactOrganizationId` / `contactId` / `topicId` は内部ID。東京都公式のコードと誤認させない。
3. UIでは所管関係と窓口を別に表示する。`primary + relation verified` は主な所管の根拠であり、その組織の直接窓口が確認済みであることを意味しない。`direct + contact verified` がなければ、確認済みの `fallback` を別組織の共通窓口として案内する。
4. `reference` は「意見を送る」ボタンにしない。`opinion_form` / `inquiry_directory` / `general_contact` で文言を分ける。
5. `partial` の窓口を「確認済み」と表示しない。`contactVerifiedAt` は `null` のまま。所管関係の確認状態と窓口の確認状態を一つの値へ統合しない。
6. `その他` の `bureauRelations` は空にする。表ではレコード形式を満たすため `relation: unresolved` としているが、実装データでは組織関係を生成しない。
7. `plan` の変更額は `restoredFromQuery` が真のときだけ「ユーザーの変更」として復元する。失敗時は `unknown`。`0` と混同しない。
8. 自由記述（concern / requestedAction / reason 等）はURL、localStorage、sessionStorage、サーバー、DB、analytics/telemetryへ送らない。MVPはクライアントメモリのみ。
9. シミュレーターの増減は本人の主張として自動選択しない。
10. パブリックコメントの「現在募集中」を表示するには、将来 `availability`, `startsAt`, `endsAt`, `checkedAt` を別途検証する。現時点は公式一覧への導線のみ。
11. 緊急系では、警視庁・東京消防庁の意見フォームを110/119や事件・事故届出の代替にしない。
12. 区市町村立学校など所在地依存の窓口は、所在地を取得・確認しない限り一つの自治体窓口へ自動ルーティングしない。
13. `contactId` の運営組織は第5.1章から取得し、テーマの `organizationName` を窓口名へ流用しない。

## 13. 実装用プロンプト（監査結果反映版）

### ゴール

`/participation` を、制度一覧から次の導線へ発展させる。

> シミュレーター上の変更を確認 → 関心テーマを具体化 → 主な/関係する所管を確認 → 窓口の種類を理解 → 自分の考えを整理 → 適切な公式ルートへ進む

### 実装ルール

- 第5章の監査行を、所管関係、窓口マスター、テーマと窓口の対応へ分離してデータ化する。窓口運営組織は第5.1章を使用する。
- `partial` は候補として残してよいが、UIの確認済み窓口には使わない。
- 一つのテーマに複数所管を許容する。
- 所管の `relationVerificationStatus` と窓口の `contactVerificationStatus` を別々に保持する。
- 所管局の直接窓口を確認できない場合、主な所管はそのまま表示し、都民の声総合窓口を「東京都の共通窓口（fallback）」として案内する。所管局自身の窓口とは表示しない。
- 「その他」は所管を割り当てず都民の声総合窓口へフォールバックする。
- ボタン文言は ContactKind に合わせる。
  - `opinion_form`: 「意見・要望を伝える」
  - `inquiry_directory`: 「問い合わせ先を確認」
  - `general_contact`: 「公式の連絡方法を見る」
  - `reference`: 「制度・担当を確認」
- 共通制度は担当局ルートの後に「ほかの方法」として表示する。
- `public-comment` は「計画等に係る意見公募一覧」とし、テーマごとの募集中状態を推測しない。
- `election-citizen-proposal` は分割する。選挙はテーマ、都民提案は補足的・期間限定の参加方法。
- 変更額不明と据え置きを区別する。
- シミュレーターの増減を本人の要望として自動確定しない。
- 自由記述を保存・自動送信しない。

### 実装前に再確認するURL

本監査で `partial` のURLを直接窓口として採用したい場合は、実装直前にブラウザで本文を再確認し、ページタイトル・受付内容・対象外事項を確認した日だけ `verifiedAt` を付与する。

## 14. 完成条件に対する監査結果

| 条件 | 結果 |
|---|---|
| 9分野すべての全テーマを確認 | 完了 |
| 9分野すべてに「その他」 | 完了 |
| 所管関係に公式根拠URLまたは unresolved | 完了 |
| 全窓口に ContactKind | 完了 |
| 全窓口に目的説明 | 完了 |
| 所管・窓口それぞれで確認済みだけ verifiedAt | 完了 |
| 所管と窓口運営組織を分離 | 完了 |
| 所管と窓口の検証状態を分離 | 完了 |
| テーマに対する窓口役割を明示 | 完了 |
| 複数所管を潰さない | 完了 |
| 区市町村所管可能性の明記 | 完了 |
| 緊急連絡に使えない窓口への警告 | 完了 |
| 「その他」の推測接続なし | 完了 |
| パブコメ常時受付表現なし | 完了 |
| 個別申請/相談と政策意見を区別 | 完了（実装時にもContactKindを維持すること） |
| 既存7制度の移行方針 | 完了 |
| 全ユニークURLの確認結果 | 完了（本文未確認はpartialとして記録） |
| 未解決事項を推測で補完しない | 完了 |
