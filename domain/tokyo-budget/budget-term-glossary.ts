/**
 * 公式用語は言い換えて消さず、画面での初出に意味を一言添える。
 * 東京都の資料を読み進めた読者が同じ語に出会うため、語そのものを残す必要がある。
 *
 * `meaning` は初出に添える標準の言い方。
 * `acceptedPhrases` は、その場の文脈でより具体的に説明している場合も認めるための
 * 言い換えの一覧。どれか一つが初出のそばにあれば、意味は伝わっていると扱う。
 */
export type BudgetTerm = "公債費" | "査定" | "借換え" | "起債" | "交付金";

export const BUDGET_TERM_GLOSSARY = {
  公債費: {
    meaning: "都債の返済などに使うお金",
    acceptedPhrases: ["都債の返済", "元金返済と利子支払い"],
  },
  査定: {
    meaning: "要求された事業や金額を確認・調整すること",
    acceptedPhrases: ["確認・調整", "必要性、緊急性、経費などを確認"],
  },
  借換え: {
    meaning: "新たに借りて、以前の借入を返すこと",
    acceptedPhrases: ["以前の借入を返す", "新たな都債の発行で確保"],
  },
  起債: {
    meaning: "都債を発行して資金を調達すること",
    acceptedPhrases: ["都債を発行して資金を調達"],
  },
  交付金: {
    meaning: "国や自治体などから一定の目的・制度に基づいて渡されるお金",
    acceptedPhrases: [
      "一定の目的・制度に基づいて渡されるお金",
      "他の自治体等へ配分する",
      "区市町村などへ配分する",
    ],
  },
} as const satisfies Record<
  BudgetTerm,
  { meaning: string; acceptedPhrases: readonly string[] }
>;

/** 初出に使う表記。たとえば「公債費（都債の返済などに使うお金）」。 */
export const glossed = (term: BudgetTerm): string =>
  `${term}（${BUDGET_TERM_GLOSSARY[term].meaning}）`;
