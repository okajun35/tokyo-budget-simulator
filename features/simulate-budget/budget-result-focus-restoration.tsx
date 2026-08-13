"use client";

import { useEffect } from "react";

import { restoreBudgetResultCardFocus } from "./budget-result-focus";

export function BudgetResultFocusRestoration() {
  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      restoreBudgetResultCardFocus(
        window.location.hash,
        id => document.getElementById(id),
      );
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  return null;
}
