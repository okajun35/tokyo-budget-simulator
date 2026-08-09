import type { BudgetCategory } from "./budget-category";

type Identifiable = {
  id: string;
};

type ReferencingBudgetCategory = Pick<
  BudgetCategory,
  "id" | "sourceIds" | "caseIds" | "participationRouteIds"
>;

export type MissingBudgetCategoryReference = {
  categoryId: BudgetCategory["id"];
  referenceType: "source" | "case" | "participation_route";
  missingId: string;
};

type BudgetCategoryReferenceCollections = {
  categories: readonly ReferencingBudgetCategory[];
  sources: readonly Identifiable[];
  cases: readonly Identifiable[];
  participationRoutes: readonly Identifiable[];
};

export function findMissingBudgetCategoryReferences({
  categories,
  sources,
  cases,
  participationRoutes,
}: BudgetCategoryReferenceCollections): MissingBudgetCategoryReference[] {
  const availableIds = {
    source: new Set(sources.map(({ id }) => id)),
    case: new Set(cases.map(({ id }) => id)),
    participation_route: new Set(participationRoutes.map(({ id }) => id)),
  };

  return categories.flatMap((category) => {
    const references = [
      ["source", category.sourceIds],
      ["case", category.caseIds],
      ["participation_route", category.participationRouteIds],
    ] as const;

    return references.flatMap(([referenceType, ids]) =>
      ids
        .filter((id) => !availableIds[referenceType].has(id))
        .map((missingId) => ({
          categoryId: category.id,
          referenceType,
          missingId,
        })),
    );
  });
}
