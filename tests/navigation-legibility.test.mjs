import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

const MINIMUM_FONT_SIZE_PX = 14;
const MINIMUM_TAP_SIZE_PX = 44;

/** 幅を問わず適用される宣言だけを対象にするため、メディアクエリの中身は除外する。 */
const baseCss = css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");

const baseRules = [...baseCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selectors, body]) => ({
  selectors: selectors.split(",").map(selector => selector.trim()),
  body,
}));

/** 子孫セレクタの巻き込みを避けるため、対象セレクタと完全一致する規則だけを見る。 */
const declaredPixels = (selector, property) => {
  const values = baseRules
    .filter(rule => rule.selectors.includes(selector))
    .flatMap(rule => rule.body.match(new RegExp(`(?<![\\w-])${property}\\s*:\\s*(\\d+)px`, "g")) ?? [])
    .map(value => Number(value.match(/(\d+)px/)[1]));

  return values.length === 0 ? null : Math.min(...values);
};

/** 別ページへ移動するための導線。読み飛ばされずに押せる大きさが必要。 */
const returnRoutes = [
  ".budgetDetailHeader>a",
  ".budgetDetailBack a",
  ".budgetLearningPath a",
  ".budgetSupplementNext>a",
  ".budgetSupplementAlternatives a",
  ".budgetProcessNext a",
  ".participationPageBack a",
  ".sourcesPageBack a",
  ".aboutPageBack a",
  ".fiscalContextHeader>a",
  ".fiscalContextBack a",
  ".budgetResultHeader>a",
  ".budgetResultNext>a",
  ".budgetResultEmpty>a",
];

/** シミュレーターから詳しい説明へ進むための導線。 */
const detailRoutes = [
  ".selectedDetailLink",
  ".mobileDetailLink",
  ".detailLink",
  ".participationDetailLink",
  ".processDetailLink",
  ".budgetResultCtaLink",
  ".budgetResultChangeList a",
];

test("keeps every return route readable", () => {
  for (const selector of returnRoutes) {
    const fontSize = declaredPixels(selector, "font-size");

    assert.ok(fontSize !== null, `${selector} に font-size がない`);
    assert.ok(
      fontSize >= MINIMUM_FONT_SIZE_PX,
      `${selector} の font-size は ${fontSize}px で ${MINIMUM_FONT_SIZE_PX}px 未満`,
    );
  }
});

test("keeps every detail route readable", () => {
  for (const selector of detailRoutes) {
    const fontSize = declaredPixels(selector, "font-size");

    assert.ok(fontSize !== null, `${selector} に font-size がない`);
    assert.ok(
      fontSize >= MINIMUM_FONT_SIZE_PX,
      `${selector} の font-size は ${fontSize}px で ${MINIMUM_FONT_SIZE_PX}px 未満`,
    );
  }
});

test("keeps every navigation route tappable at any width", () => {
  for (const selector of [...returnRoutes, ...detailRoutes]) {
    const tapSize = declaredPixels(selector, "min-height");

    assert.ok(
      tapSize !== null && tapSize >= MINIMUM_TAP_SIZE_PX,
      `${selector} の min-height は ${tapSize}px で、狭幅以外でも ${MINIMUM_TAP_SIZE_PX}px を満たしていない`,
    );
  }
});
