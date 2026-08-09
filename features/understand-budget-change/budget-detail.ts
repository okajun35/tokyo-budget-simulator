import { getBudgetAllocationRange } from "../simulate-budget/budget-allocation.ts";

export type ResolvedBudgetDetailAmount = {
  amount100mYen: number;
  usedFallback: boolean;
};

export type BudgetDetailComparison = {
  baselineAmount100mYen: number;
  proposedAmount100mYen: number;
  changeAmount100mYen: number;
  changeRatePercent: number;
  baselineSharePercent: number;
  proposedSharePercent: number;
};

const roundToOneDecimal = (value: number) => Math.round(value * 10) / 10;

export function resolveBudgetDetailAmount(
  value: string | string[] | undefined,
  baselineAmount100mYen: number,
): ResolvedBudgetDetailAmount {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return {
      amount100mYen: baselineAmount100mYen,
      usedFallback: true,
    };
  }

  const requestedAmount100mYen = Number(value);
  const range = getBudgetAllocationRange(baselineAmount100mYen);
  const isInsideRange =
    requestedAmount100mYen >= range.minimumAmount100mYen &&
    requestedAmount100mYen <= range.maximumAmount100mYen;

  return isInsideRange
    ? { amount100mYen: requestedAmount100mYen, usedFallback: false }
    : { amount100mYen: baselineAmount100mYen, usedFallback: true };
}

export function createBudgetDetailComparison(
  baselineAmount100mYen: number,
  proposedAmount100mYen: number,
  annualBudgetAmount100mYen: number,
): BudgetDetailComparison {
  const changeAmount100mYen =
    proposedAmount100mYen - baselineAmount100mYen;

  return {
    baselineAmount100mYen,
    proposedAmount100mYen,
    changeAmount100mYen,
    changeRatePercent: roundToOneDecimal(
      changeAmount100mYen / baselineAmount100mYen * 100,
    ),
    baselineSharePercent: roundToOneDecimal(
      baselineAmount100mYen / annualBudgetAmount100mYen * 100,
    ),
    proposedSharePercent: roundToOneDecimal(
      proposedAmount100mYen / annualBudgetAmount100mYen * 100,
    ),
  };
}
