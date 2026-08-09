export const BUDGET_CSV_DATASET_URL =
  "https://catalog.data.metro.tokyo.lg.jp/dataset/t000004d0000000005";

export const BUDGET_CSV_RESOURCES = [
  {
    id: "general-account",
    title: "一般会計 歳入歳出予算",
    fileName: "general-account.csv",
    url: "https://www.opendata.metro.tokyo.lg.jp/zaimu/R6/01_sainyu_saishutsu.csv",
  },
  {
    id: "purpose-breakdown",
    title: "一般歳出 目的別内訳",
    fileName: "purpose-breakdown.csv",
    url: "https://www.opendata.metro.tokyo.lg.jp/zaimu/R6/05_mokutekibetsu.csv",
  },
  {
    id: "nature-breakdown",
    title: "一般会計歳出予算 性質別内訳",
    fileName: "nature-breakdown.csv",
    url: "https://www.opendata.metro.tokyo.lg.jp/zaimu/R6/04_seishitsubetsu.csv",
  },
  {
    id: "revenue-breakdown",
    title: "一般会計 歳入内訳",
    fileName: "revenue-breakdown.csv",
    url: "https://www.opendata.metro.tokyo.lg.jp/zaimu/R6/08_sainyu_uchiwake.csv",
  },
  {
    id: "tax-breakdown",
    title: "都税内訳（当初予算）",
    fileName: "tax-breakdown.csv",
    url: "https://www.opendata.metro.tokyo.lg.jp/zaimu/R6/09_tozei_uchiwake.csv",
  },
  {
    id: "fund-balance",
    title: "基金の残高推移（普通会計ベース）",
    fileName: "fund-balance.csv",
    url: "https://www.opendata.metro.tokyo.lg.jp/zaimu/R6/14_kikin_zandaka_suii.csv",
  },
  {
    id: "fund-changes",
    title: "基金の積立・取崩状況",
    fileName: "fund-changes.csv",
    url: "https://www.opendata.metro.tokyo.lg.jp/zaimu/R6/15_kikin_tsumitate_torikuzushi_jyokyo.csv",
  },
  {
    id: "bond-balance",
    title: "都債発行額と都債残高の推移",
    fileName: "bond-balance.csv",
    url: "https://www.opendata.metro.tokyo.lg.jp/zaimu/R6/16_tosai_hakkougaku_zandaka_suii.csv",
  },
] as const;
