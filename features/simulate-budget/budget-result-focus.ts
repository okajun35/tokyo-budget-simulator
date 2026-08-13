import type { BudgetCategoryId } from "@/domain/tokyo-budget/budget-category-id";

const BUDGET_RESULT_CHANGE_ID_PREFIX = "budget-result-change-";

type BudgetResultFocusTarget = {
  focus: (options: { preventScroll: boolean }) => void;
  scrollIntoView: (options: { behavior: "auto"; block: "center" }) => void;
};

export function createBudgetResultChangeId(
  categoryId: BudgetCategoryId,
): string {
  return `${BUDGET_RESULT_CHANGE_ID_PREFIX}${categoryId}`;
}

export function restoreBudgetResultCardFocus(
  hash: string,
  findTarget: (id: string) => BudgetResultFocusTarget | null,
): boolean {
  const targetId = hash.startsWith(`#${BUDGET_RESULT_CHANGE_ID_PREFIX}`)
    ? hash.slice(1)
    : undefined;
  if (!targetId) return false;

  const target = findTarget(targetId);
  if (!target) return false;

  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: "auto", block: "center" });
  return true;
}
