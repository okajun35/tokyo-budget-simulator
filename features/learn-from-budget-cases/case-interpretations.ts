import type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

/**
 * 事例を並べる目的は、金額の増減が現実にはどんな変更として現れたのかを示すこと。
 * 分野ごとに一段だけ解釈を添える。`interpretation` であって `case_fact` ではないため、
 * 断定を避け、東京都で同じことが起きるとは述べない。
 *
 * 出典となる整理は `docs/tokyo_budget_reduction_cases.md` の各事例
 * 「東京予算ラボで示せること」。事例を収録した分野だけを持つ。
 */
export const CASE_INTERPRETATIONS: Partial<Record<BudgetCategoryId, string>> = {
  welfare:
    "福祉予算を減らす場合、単に「福祉費」という数字が減るのではなく、給付対象、給付内容、補助金、在宅支援サービスなどの縮小として現れることがあります。",
  education:
    "教育・文化予算を減らす場合、学校そのものを廃止するとは限らず、図書館の開館時間、分室、移動サービスなどのサービス水準を下げる方法もあります。",
  debt:
    "公債費は一般の行政事業のように「今年やめればゼロになる」費用ではありません。過去の債務が将来の予算配分を制約します。払わずに済ませられる費用でもなく、債務不履行になれば債務再編や外部監督といった別の制約が生じます。",
};
