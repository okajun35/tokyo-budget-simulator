export type FiscalContext = {
  id: "fund" | "bond" | "tax";
  name: string;
  amountLabel: string;
  amountNote: string;
  roleLabel: string;
  summary: string;
  simulatorReason: string;
  changeEffect: string;
  sourceId: "enacted";
};
