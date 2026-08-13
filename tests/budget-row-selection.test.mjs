import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

const ruleFor = selector => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rule = css.match(new RegExp(`${escapedSelector}\\s*\\{([^{}]*)\\}`))?.[1];

  assert.ok(rule, `${selector} の宣言が見つからない`);
  return rule;
};

test("uses the whole non-interactive row surface as the category selection control", () => {
  const rowRule = ruleFor(".budgetRow");
  const selectionSurfaceRule = ruleFor(".budgetRowSelectSurface");
  const independentControlsRule = ruleFor(
    ".sliderCell,.selectedDetailLink,.mobileDetailLink",
  );

  assert.match(rowRule, /position:relative/);
  assert.match(selectionSurfaceRule, /position:absolute/);
  assert.match(selectionSurfaceRule, /inset:0/);
  assert.match(selectionSurfaceRule, /cursor:pointer/);
  assert.match(independentControlsRule, /position:relative/);
  assert.match(independentControlsRule, /z-index:2/);
});
