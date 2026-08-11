/* Generated from docs/tokyo_budget_participation_research_prompt_v2.md. */
import type { ParticipationTopic } from "./participation-topic";

export const PARTICIPATION_TOPICS = [
  {
    "categoryId": "welfare",
    "categoryName": "福祉と保健",
    "topicId": "elderly-welfare",
    "topicName": "高齢者福祉",
    "bureauRelations": [
      {
        "organizationId": "welfare-bureau",
        "organizationName": "東京都福祉局",
        "relation": "primary",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内で福祉局の主な事業に高齢者福祉を明記。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "福祉局の候補窓口 https://www.fukushi.metro.tokyo.lg.jp/contact は今回503で本文未確認。"
  },
  {
    "categoryId": "welfare",
    "categoryName": "福祉と保健",
    "topicId": "disability-welfare",
    "topicName": "障害福祉",
    "bureauRelations": [
      {
        "organizationId": "welfare-bureau",
        "organizationName": "東京都福祉局",
        "relation": "primary",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内で福祉局の主な事業に障害者福祉を明記。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "福祉局の候補窓口 https://www.fukushi.metro.tokyo.lg.jp/contact は今回503で本文未確認。"
  },
  {
    "categoryId": "welfare",
    "categoryName": "福祉と保健",
    "topicId": "child-family-welfare",
    "topicName": "子育て・児童福祉",
    "bureauRelations": [
      {
        "organizationId": "welfare-bureau",
        "organizationName": "東京都福祉局",
        "relation": "primary",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内で福祉局が子供・家庭に関する福祉施策を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "child-policy-coordination",
        "organizationName": "東京都子供政策連携室",
        "relation": "possible",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内で、都の子供政策の企画立案・総合調整と先進プロジェクト推進を担当すると確認。子育て・児童福祉全体の共同所管までは確認できないためpossibleとする。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "福祉局の候補窓口 https://www.fukushi.metro.tokyo.lg.jp/contact は今回503で本文未確認。 個別の児童福祉制度は福祉局等が主となる場合がある。"
  },
  {
    "categoryId": "welfare",
    "categoryName": "福祉と保健",
    "topicId": "medical-delivery",
    "topicName": "医療提供体制",
    "bureauRelations": [
      {
        "organizationId": "health-medical-bureau",
        "organizationName": "東京都保健医療局",
        "relation": "primary",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内で保健医療局が医療政策・医療提供体制等を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "health-medical-resident-voice-form",
        "role": "direct"
      },
      {
        "contactId": "health-medical-contact-directory",
        "role": "alternate"
      }
    ]
  },
  {
    "categoryId": "welfare",
    "categoryName": "福祉と保健",
    "topicId": "public-health",
    "topicName": "保健・健康施策",
    "bureauRelations": [
      {
        "organizationId": "health-medical-bureau",
        "organizationName": "東京都保健医療局",
        "relation": "primary",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内で保健医療局が健康・保健施策を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "health-medical-resident-voice-form",
        "role": "direct"
      },
      {
        "contactId": "health-medical-contact-directory",
        "role": "alternate"
      }
    ]
  },
  {
    "categoryId": "welfare",
    "categoryName": "福祉と保健",
    "topicId": "welfare-other",
    "topicName": "その他",
    "bureauRelations": [],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "話題を具体化すると担当局を絞れる場合があります。"
  },
  {
    "categoryId": "education",
    "categoryName": "教育と文化",
    "topicId": "metropolitan-schools",
    "topicName": "都立学校・教育行政・教職員",
    "bureauRelations": [
      {
        "organizationId": "education-bureau",
        "organizationName": "東京都教育委員会（教育庁）",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm",
        "relationEvidenceSummary": "教育庁組織アドレスで都立学校運営、教職員、学校教育関係事務を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "education-org-directory",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "education",
    "categoryName": "教育と文化",
    "topicId": "school-meals-curriculum-ict",
    "topicName": "給食・教育内容・ICT",
    "bureauRelations": [
      {
        "organizationId": "education-bureau",
        "organizationName": "東京都教育委員会（教育庁）",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm",
        "relationEvidenceSummary": "教育庁組織アドレスで学校給食・健康教育、情報教育等の担当を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "municipal-boards",
        "organizationName": "各区市町村教育委員会",
        "relation": "possible",
        "relationSourceUrl": "https://www.kyoiku.metro.tokyo.lg.jp/inquiry",
        "relationEvidenceSummary": "東京都教育委員会の問い合わせ案内では、区市町村立学校の個別事項は各区市町村教育委員会へ問い合わせる旨を案内している。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "education-org-directory",
        "role": "direct"
      },
      {
        "contactId": "education-inquiry-guide",
        "role": "alternate"
      }
    ],
    "jurisdictionNote": "区市町村立学校の個別事項は各区市町村教育委員会が所管する場合がある。 所在地により窓口が異なるため東京予算ラボから一つの区市町村窓口へ固定しない。"
  },
  {
    "categoryId": "education",
    "categoryName": "教育と文化",
    "topicId": "special-needs",
    "topicName": "特別支援教育",
    "bureauRelations": [
      {
        "organizationId": "education-bureau",
        "organizationName": "東京都教育委員会（教育庁）",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/031_kyoiku/kyoiku-address.htm",
        "relationEvidenceSummary": "教育庁組織アドレスで特別支援教育の企画・学校運営関係を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "education-org-directory",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "education",
    "categoryName": "教育と文化",
    "topicId": "private-schools",
    "topicName": "私立学校",
    "bureauRelations": [
      {
        "organizationId": "life-culture-bureau",
        "organizationName": "東京都生活文化局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/047_seikatubunka/seikatubunka-address.htm",
        "relationEvidenceSummary": "生活文化局組織アドレスで私学部が私立学校の設置・廃止、助成、指導監督等を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "life-culture-org-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "教育庁ではなく生活文化局私学部が主な所管。"
  },
  {
    "categoryId": "education",
    "categoryName": "教育と文化",
    "topicId": "culture",
    "topicName": "文化・文化事業",
    "bureauRelations": [
      {
        "organizationId": "life-culture-bureau",
        "organizationName": "東京都生活文化局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/047_seikatubunka/seikatubunka-address.htm",
        "relationEvidenceSummary": "東京都の組織案内および生活文化局組織情報で文化振興を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "life-culture-org-directory",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "education",
    "categoryName": "教育と文化",
    "topicId": "sports",
    "topicName": "スポーツ",
    "bureauRelations": [
      {
        "organizationId": "sports-promotion-hq",
        "organizationName": "東京都スポーツ推進本部",
        "relation": "primary",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内でスポーツ振興・パラスポーツ・大会・施設等を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "sports-resident-voice",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "education",
    "categoryName": "教育と文化",
    "topicId": "education-other",
    "topicName": "その他",
    "bureauRelations": [],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "話題を具体化すると担当局を絞れる場合があります。"
  },
  {
    "categoryId": "industry",
    "categoryName": "労働と経済",
    "topicId": "sme-finance",
    "topicName": "中小企業・金融",
    "bureauRelations": [
      {
        "organizationId": "industry-labor-bureau",
        "organizationName": "東京都産業労働局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm",
        "relationEvidenceSummary": "産業労働局組織アドレスで中小企業支援・金融関係の担当部署を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "industry-org-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "個別の助成申請・融資相談と、政策への意見・要望は同じものとして扱わない。"
  },
  {
    "categoryId": "industry",
    "categoryName": "労働と経済",
    "topicId": "employment",
    "topicName": "雇用・就業",
    "bureauRelations": [
      {
        "organizationId": "industry-labor-bureau",
        "organizationName": "東京都産業労働局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm",
        "relationEvidenceSummary": "産業労働局組織アドレスで雇用就業関係の担当部署を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "industry-org-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "個別の助成申請・融資相談と、政策への意見・要望は同じものとして扱わない。"
  },
  {
    "categoryId": "industry",
    "categoryName": "労働と経済",
    "topicId": "tourism",
    "topicName": "観光",
    "bureauRelations": [
      {
        "organizationId": "industry-labor-bureau",
        "organizationName": "東京都産業労働局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm",
        "relationEvidenceSummary": "産業労働局組織アドレスで観光部門を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "industry-org-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "個別の助成申請・融資相談と、政策への意見・要望は同じものとして扱わない。"
  },
  {
    "categoryId": "industry",
    "categoryName": "労働と経済",
    "topicId": "agriculture-forestry-fisheries",
    "topicName": "農林水産",
    "bureauRelations": [
      {
        "organizationId": "industry-labor-bureau",
        "organizationName": "東京都産業労働局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm",
        "relationEvidenceSummary": "産業労働局組織アドレスで農林水産部門を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "industry-org-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "個別の助成申請・融資相談と、政策への意見・要望は同じものとして扱わない。"
  },
  {
    "categoryId": "industry",
    "categoryName": "労働と経済",
    "topicId": "startup-business-support",
    "topicName": "創業・事業支援",
    "bureauRelations": [
      {
        "organizationId": "industry-labor-bureau",
        "organizationName": "東京都産業労働局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/029_sangyo-rodo/sangyo-rodo-address.htm",
        "relationEvidenceSummary": "産業労働局組織アドレスで創業支援課を含む事業支援担当を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "startup-strategy-hq",
        "organizationName": "東京都スタートアップ戦略推進本部",
        "relation": "possible",
        "relationSourceUrl": "https://www.startupandglobalfinancialcity.metro.tokyo.lg.jp/startup",
        "relationEvidenceSummary": "公式ページでスタートアップ戦略の推進・支援を担うことを確認。創業・事業支援全般の主所管とは限らない。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "industry-org-directory",
        "role": "direct"
      },
      {
        "contactId": "startup-strategy-reference",
        "role": "reference"
      }
    ],
    "jurisdictionNote": "個別の助成申請・融資相談と、政策への意見・要望は同じものとして扱わない。 一般的な中小企業・創業支援は産業労働局の担当領域を含む。"
  },
  {
    "categoryId": "industry",
    "categoryName": "労働と経済",
    "topicId": "industry-other",
    "topicName": "その他",
    "bureauRelations": [],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "話題を具体化すると担当局を絞れる場合があります。"
  },
  {
    "categoryId": "environment",
    "categoryName": "生活環境",
    "topicId": "decarbonization-efficiency",
    "topicName": "脱炭素・省エネルギー",
    "bureauRelations": [
      {
        "organizationId": "environment-bureau",
        "organizationName": "東京都環境局",
        "relation": "primary",
        "relationSourceUrl": "https://www.kankyo.metro.tokyo.lg.jp/about/organization/",
        "relationEvidenceSummary": "環境局の組織・業務案内で気候変動対策・省エネルギー関係を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "environment-org-directory",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "environment",
    "categoryName": "生活環境",
    "topicId": "renewable-energy",
    "topicName": "再生可能エネルギー",
    "bureauRelations": [
      {
        "organizationId": "environment-bureau",
        "organizationName": "東京都環境局",
        "relation": "primary",
        "relationSourceUrl": "https://www.kankyo.metro.tokyo.lg.jp/about/organization/",
        "relationEvidenceSummary": "環境局の組織・業務案内で再生可能エネルギー関係を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "environment-org-directory",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "environment",
    "categoryName": "生活環境",
    "topicId": "resources-waste",
    "topicName": "資源循環・廃棄物",
    "bureauRelations": [
      {
        "organizationId": "environment-bureau",
        "organizationName": "東京都環境局",
        "relation": "primary",
        "relationSourceUrl": "https://www.kankyo.metro.tokyo.lg.jp/about/organization/",
        "relationEvidenceSummary": "環境局の組織・業務案内で資源循環・廃棄物関係を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "environment-org-directory",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "environment",
    "categoryName": "生活環境",
    "topicId": "nature-biodiversity",
    "topicName": "自然環境・生物多様性",
    "bureauRelations": [
      {
        "organizationId": "environment-bureau",
        "organizationName": "東京都環境局",
        "relation": "primary",
        "relationSourceUrl": "https://www.kankyo.metro.tokyo.lg.jp/about/organization/",
        "relationEvidenceSummary": "環境局の組織・業務案内で自然環境・生物多様性関係を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "environment-org-directory",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "environment",
    "categoryName": "生活環境",
    "topicId": "water-environment",
    "topicName": "水環境",
    "bureauRelations": [
      {
        "organizationId": "environment-bureau",
        "organizationName": "東京都環境局",
        "relation": "primary",
        "relationSourceUrl": "https://www.kankyo.metro.tokyo.lg.jp/about/organization/",
        "relationEvidenceSummary": "環境局の組織・業務案内で水環境、水質、地下水、東京湾・河川水質等を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "waterworks-bureau",
        "organizationName": "東京都水道局",
        "relation": "possible",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内で水道局が特別区・多摩地域の水道事業を担当すると確認。水質環境一般とは異なる。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "sewerage-bureau",
        "organizationName": "東京都下水道局",
        "relation": "possible",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内で下水道局が区部公共下水道・流域下水道等を担当すると確認。水質環境一般とは異なる。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "environment-org-directory",
        "role": "direct"
      },
      {
        "contactId": "tokyo-org-reference",
        "role": "reference"
      }
    ],
    "jurisdictionNote": "水道供給・下水道事業そのものは水道局・下水道局の所管領域。 「水環境」が水道サービスを指す場合は環境局へ一律に送らない。 「水環境」が下水道事業を指す場合は環境局へ一律に送らない。"
  },
  {
    "categoryId": "environment",
    "categoryName": "生活環境",
    "topicId": "environment-other",
    "topicName": "その他",
    "bureauRelations": [],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "話題を具体化すると担当局を絞れる場合があります。"
  },
  {
    "categoryId": "city",
    "categoryName": "都市の整備",
    "topicId": "urban-planning",
    "topicName": "都市計画・まちづくり",
    "bureauRelations": [
      {
        "organizationId": "urban-development-bureau",
        "organizationName": "東京都都市整備局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/039_toshiseibi/toshiseibi-address.htm",
        "relationEvidenceSummary": "都市整備局組織アドレスで都市計画、まちづくり、再開発等の担当を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "urban-resident-voice",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "city",
    "categoryName": "都市の整備",
    "topicId": "housing-policy",
    "topicName": "住宅政策",
    "bureauRelations": [
      {
        "organizationId": "housing-policy-hq",
        "organizationName": "東京都住宅政策本部",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/109_juutakuseisaku/juutakuseisaku-address.htm",
        "relationEvidenceSummary": "住宅政策本部組織アドレスで住宅政策・都営住宅等の担当を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "housing-org-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "候補の「ご意見・ご要望」URLは今回503で本文未確認。"
  },
  {
    "categoryId": "city",
    "categoryName": "都市の整備",
    "topicId": "roads-bridges",
    "topicName": "道路・橋梁",
    "bureauRelations": [
      {
        "organizationId": "construction-bureau",
        "organizationName": "東京都建設局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/017_kensetsu/kensetsu-address.htm",
        "relationEvidenceSummary": "建設局組織アドレスで道路・橋梁の整備・管理担当を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "construction-inquiry",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "city",
    "categoryName": "都市の整備",
    "topicId": "rivers",
    "topicName": "河川",
    "bureauRelations": [
      {
        "organizationId": "construction-bureau",
        "organizationName": "東京都建設局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/017_kensetsu/kensetsu-address.htm",
        "relationEvidenceSummary": "建設局組織アドレスで河川関係の担当を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "construction-inquiry",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "city",
    "categoryName": "都市の整備",
    "topicId": "parks-green",
    "topicName": "公園・緑地",
    "bureauRelations": [
      {
        "organizationId": "construction-bureau",
        "organizationName": "東京都建設局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/017_kensetsu/kensetsu-address.htm",
        "relationEvidenceSummary": "建設局組織アドレスで都立公園・緑地関係の担当を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "construction-inquiry",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "city",
    "categoryName": "都市の整備",
    "topicId": "city-other",
    "topicName": "その他",
    "bureauRelations": [],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "話題を具体化すると担当局を絞れる場合があります。"
  },
  {
    "categoryId": "safety",
    "categoryName": "警察と消防",
    "topicId": "police-security",
    "topicName": "警察活動・治安",
    "bureauRelations": [
      {
        "organizationId": "metropolitan-police",
        "organizationName": "警視庁",
        "relation": "primary",
        "relationSourceUrl": "https://www.keishicho.metro.tokyo.lg.jp/about_mpd/shokai/katsudo/vision.html",
        "relationEvidenceSummary": "警視庁公式の組織運営ビジョンで、複雑化する治安課題への対処を警視庁の任務として確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "mpd-opinion",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "事件・事故の届出や緊急通報の代替ではない。"
  },
  {
    "categoryId": "safety",
    "categoryName": "警察と消防",
    "topicId": "traffic-police",
    "topicName": "交通規制・警察業務としての交通安全",
    "bureauRelations": [
      {
        "organizationId": "metropolitan-police",
        "organizationName": "警視庁",
        "relation": "primary",
        "relationSourceUrl": "https://www.keishicho.metro.tokyo.lg.jp/saiyo/type/traffic.html",
        "relationEvidenceSummary": "警視庁公式の交通警察紹介で、交通指導・取締り、交通安全教育、各種交通規制、道路使用許可を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "mpd-opinion",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "信号機・標識等には専用フォームへの案内がある。事件・事故の届出には使わない。"
  },
  {
    "categoryId": "safety",
    "categoryName": "警察と消防",
    "topicId": "traffic-safety-policy",
    "topicName": "交通安全政策全般",
    "bureauRelations": [
      {
        "organizationId": "citizen-safety-hq",
        "organizationName": "東京都都民安全総合対策本部",
        "relation": "primary",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内で、都民安全総合対策本部の主な事業に交通安全を含む安全・安心施策を明記。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "metropolitan-police",
        "organizationName": "警視庁",
        "relation": "possible",
        "relationSourceUrl": "https://www.keishicho.metro.tokyo.lg.jp/saiyo/type/traffic.html",
        "relationEvidenceSummary": "警視庁も交通安全教育・交通規制・取締りを担当するため、具体的内容によって関係する。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      },
      {
        "contactId": "mpd-opinion",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "警察の交通取締り・交通規制そのものは警視庁が担当。"
  },
  {
    "categoryId": "safety",
    "categoryName": "警察と消防",
    "topicId": "fire-ems-prevention",
    "topicName": "消防・救急・火災予防",
    "bureauRelations": [
      {
        "organizationId": "tokyo-fire-department",
        "organizationName": "東京消防庁",
        "relation": "primary",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内で東京消防庁が消防、救助、救急、火災予防等を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "tfd-opinion-form",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "119番など緊急時には使用しない。東京消防庁の管轄外（稲城市・島しょ等）は地域の消防機関が担当。"
  },
  {
    "categoryId": "safety",
    "categoryName": "警察と消防",
    "topicId": "disaster-general",
    "topicName": "防災一般",
    "bureauRelations": [
      {
        "organizationId": "general-affairs-disaster",
        "organizationName": "東京都総務局総合防災部",
        "relation": "primary",
        "relationSourceUrl": "https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html",
        "relationEvidenceSummary": "東京都防災の問い合わせ窓口で「防災対策一般」の担当を総務局総合防災部防災管理課と明記。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "construction-bureau",
        "organizationName": "東京都建設局",
        "relation": "possible",
        "relationSourceUrl": "https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html",
        "relationEvidenceSummary": "東京都防災の問い合わせ窓口で、防災の具体的内容に応じて東京都建設局が担当先として掲載されている。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "health-medical-bureau",
        "organizationName": "東京都保健医療局",
        "relation": "possible",
        "relationSourceUrl": "https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html",
        "relationEvidenceSummary": "東京都防災の問い合わせ窓口で、防災の具体的内容に応じて東京都保健医療局が担当先として掲載されている。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "waterworks-bureau",
        "organizationName": "東京都水道局",
        "relation": "possible",
        "relationSourceUrl": "https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html",
        "relationEvidenceSummary": "東京都防災の問い合わせ窓口で、防災の具体的内容に応じて東京都水道局が担当先として掲載されている。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "sewerage-bureau",
        "organizationName": "東京都下水道局",
        "relation": "possible",
        "relationSourceUrl": "https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html",
        "relationEvidenceSummary": "東京都防災の問い合わせ窓口で、防災の具体的内容に応じて東京都下水道局が担当先として掲載されている。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "metropolitan-police",
        "organizationName": "警視庁",
        "relation": "possible",
        "relationSourceUrl": "https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html",
        "relationEvidenceSummary": "東京都防災の問い合わせ窓口で、防災の具体的内容に応じて警視庁が担当先として掲載されている。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      },
      {
        "organizationId": "tokyo-fire-department",
        "organizationName": "東京消防庁",
        "relation": "possible",
        "relationSourceUrl": "https://www.bousai.metro.tokyo.lg.jp/link/1000044/1000252.html",
        "relationEvidenceSummary": "東京都防災の問い合わせ窓口で、防災の具体的内容に応じて東京消防庁が担当先として掲載されている。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "tokyo-disaster-directory",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "safety",
    "categoryName": "警察と消防",
    "topicId": "safety-other",
    "topicName": "その他",
    "bureauRelations": [],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "話題を具体化すると担当局を絞れる場合があります。"
  },
  {
    "categoryId": "admin",
    "categoryName": "企画・総務",
    "topicId": "policy-strategy",
    "topicName": "都の基本政策・長期戦略",
    "bureauRelations": [
      {
        "organizationId": "policy-planning-bureau",
        "organizationName": "東京都政策企画局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/001_seisakukikaku/seisakukikaku-address.htm",
        "relationEvidenceSummary": "政策企画局組織アドレスおよび東京都組織案内で、都政の基本計画・重要施策の企画立案・総合調整を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "policy-org-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "候補の /inquiry は今回503で本文未確認。"
  },
  {
    "categoryId": "admin",
    "categoryName": "企画・総務",
    "topicId": "administration-municipal-statistics",
    "topicName": "行政運営・庁内管理・区市町村行政・統計",
    "bureauRelations": [
      {
        "organizationId": "general-affairs-bureau",
        "organizationName": "東京都総務局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm",
        "relationEvidenceSummary": "総務局組織アドレスで庁内管理、行政部の区市町村行政・財政、統計部等の担当を確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "general-affairs-org-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "区市町村の個別行政サービスそのものは各区市町村所管の場合がある。"
  },
  {
    "categoryId": "admin",
    "categoryName": "企画・総務",
    "topicId": "administrative-dx",
    "topicName": "行政DX・デジタル",
    "bureauRelations": [
      {
        "organizationId": "digital-service-bureau",
        "organizationName": "東京都デジタルサービス局",
        "relation": "primary",
        "relationSourceUrl": "https://www.metro.tokyo.lg.jp/about/soshiki",
        "relationEvidenceSummary": "東京都の組織案内で、各局DX推進支援、全庁デジタル統括、デジタル人材等を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "候補URL https://www.digitalservice.metro.tokyo.lg.jp/inquiry は今回503。"
  },
  {
    "categoryId": "admin",
    "categoryName": "企画・総務",
    "topicId": "elections",
    "topicName": "選挙",
    "bureauRelations": [
      {
        "organizationId": "election-commission",
        "organizationName": "東京都選挙管理委員会事務局",
        "relation": "primary",
        "relationSourceUrl": "https://www.senkyo.metro.tokyo.lg.jp/about/jigyougaiyou",
        "relationEvidenceSummary": "事業概要で選挙の管理執行、選挙啓発、政治資金等の担当を明記。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "election-business-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "選挙管理委員会は予算一般への意見提出窓口ではなく、選挙テーマの所管確認先。"
  },
  {
    "categoryId": "admin",
    "categoryName": "企画・総務",
    "topicId": "admin-other",
    "topicName": "その他",
    "bureauRelations": [],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "話題を具体化すると担当局を絞れる場合があります。"
  },
  {
    "categoryId": "debt",
    "categoryName": "公債費",
    "topicId": "bonds-debt-service",
    "topicName": "都債・償還・利払い・財政運営",
    "bureauRelations": [
      {
        "organizationId": "finance-bureau",
        "organizationName": "東京都財務局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/006_zaimu/zaimu-address.htm",
        "relationEvidenceSummary": "財務局組織アドレスで財政課が予算・財政制度、公債課が都債等を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "finance-org-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "公債費は個別住民サービスではなく財政・都債・予算運営に関するテーマ。"
  },
  {
    "categoryId": "debt",
    "categoryName": "公債費",
    "topicId": "debt-other",
    "topicName": "その他",
    "bureauRelations": [],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "話題を具体化すると担当局を絞れる場合があります。"
  },
  {
    "categoryId": "linked",
    "categoryName": "税連動経費等",
    "topicId": "ward-fiscal-adjustment",
    "topicName": "都区財政調整",
    "bureauRelations": [
      {
        "organizationId": "general-affairs-bureau",
        "organizationName": "東京都総務局行政部",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm",
        "relationEvidenceSummary": "総務局組織アドレスで行政部区政課が特別区の財政・都区財政調整等を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "general-affairs-org-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "制度個別ページ候補は今回503で本文未確認のため、組織アドレスを確定データに使用。"
  },
  {
    "categoryId": "linked",
    "categoryName": "税連動経費等",
    "topicId": "municipal-fiscal-adjustment",
    "topicName": "市町村への財政調整",
    "bureauRelations": [
      {
        "organizationId": "general-affairs-bureau",
        "organizationName": "東京都総務局行政部",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/003_soumu/soumu-address.htm",
        "relationEvidenceSummary": "総務局組織アドレスで行政部市町村課が市町村財政、地方交付税等を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "general-affairs-org-directory",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "linked",
    "categoryName": "税連動経費等",
    "topicId": "metropolitan-tax",
    "topicName": "都税・税制度",
    "bureauRelations": [
      {
        "organizationId": "tax-bureau",
        "organizationName": "東京都主税局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/008_tax/tax-address.htm",
        "relationEvidenceSummary": "主税局組織アドレスで税制部門が都税制度の企画・調査等を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "tax-org-directory",
        "role": "direct"
      }
    ],
    "jurisdictionNote": "候補の都民の声URLは今回503で本文未確認。"
  },
  {
    "categoryId": "linked",
    "categoryName": "税連動経費等",
    "topicId": "tokyo-fiscal-system",
    "topicName": "東京都全体の財政制度",
    "bureauRelations": [
      {
        "organizationId": "finance-bureau",
        "organizationName": "東京都財務局",
        "relation": "primary",
        "relationSourceUrl": "https://www.soshiki-address.metro.tokyo.lg.jp/006_zaimu/zaimu-address.htm",
        "relationEvidenceSummary": "財務局組織アドレスで財政課が予算、財政制度、財政計画等を担当すると確認。",
        "verifiedAt": "2026-08-11",
        "verificationStatus": "verified"
      }
    ],
    "contacts": [
      {
        "contactId": "finance-org-directory",
        "role": "direct"
      }
    ]
  },
  {
    "categoryId": "linked",
    "categoryName": "税連動経費等",
    "topicId": "linked-other",
    "topicName": "その他",
    "bureauRelations": [],
    "contacts": [
      {
        "contactId": "tokyo-resident-voice-guide",
        "role": "fallback"
      }
    ],
    "jurisdictionNote": "話題を具体化すると担当局を絞れる場合があります。"
  }
] as const satisfies readonly ParticipationTopic[];
