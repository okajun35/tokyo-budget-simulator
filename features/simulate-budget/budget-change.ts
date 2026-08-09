export type BudgetChangeDirection = "increase" | "decrease" | "unchanged";

export type BudgetChangeDescription = {
  amount100mYen: number;
  ratePercent: number;
  direction: BudgetChangeDirection;
  amountLabel: string;
  rateLabel: string;
};

export function describeBudgetChange(
  baselineAmount100mYen: number,
  proposedAmount100mYen: number,
): BudgetChangeDescription {
  const amount100mYen = proposedAmount100mYen - baselineAmount100mYen;
  const ratePercent = amount100mYen / baselineAmount100mYen * 100;
  const direction =
    amount100mYen > 0
      ? "increase"
      : amount100mYen < 0
        ? "decrease"
        : "unchanged";
  const sign = amount100mYen > 0 ? "+" : "";

  return {
    amount100mYen,
    ratePercent,
    direction,
    amountLabel:
      direction === "unchanged"
        ? "±0億円"
        : `${sign}${Math.round(amount100mYen).toLocaleString("ja-JP")}億円`,
    rateLabel:
      direction === "unchanged"
        ? "±0.0%"
        : `${sign}${ratePercent.toFixed(1)}%`,
  };
}
