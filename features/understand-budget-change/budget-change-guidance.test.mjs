import assert from "node:assert/strict";
import test from "node:test";

import { BUDGET_CATEGORIES } from "../simulate-budget/budget-categories.ts";
import { getBudgetChangeGuidance } from "./budget-change-guidance.ts";

test("provides distinct guidance for every category and change direction", () => {
  for (const category of BUDGET_CATEGORIES) {
    for (const direction of ["increase", "decrease", "unchanged"]) {
      const guidance = getBudgetChangeGuidance(category, direction, 840);

      assert.equal(guidance.direction, direction);
      assert.ok(guidance.options.length >= 3, `${category.id}: ${direction} options`);
      assert.ok(guidance.considerations.length >= 3, `${category.id}: ${direction} considerations`);
      assert.ok(guidance.optionsHeading.length > 0);
      assert.ok(guidance.considerationsHeading.length > 0);
      assert.ok(guidance.caseHeading.length > 0);
      assert.ok(guidance.finalQuestion.length > 0);
    }
  }
});

test("asks what an education increase can buy and whether it can be delivered", () => {
  const education = BUDGET_CATEGORIES.find(category => category.id === "education");
  const guidance = getBudgetChangeGuidance(education, "increase", 840);
  const options = guidance.options.map(option => option.title).join(" ");
  const considerations = guidance.considerations
    .map(item => `${item.title}${item.description}`)
    .join(" ");

  assert.equal(guidance.optionsHeading, "この840億円を増やすと、何を変えられる？");
  assert.match(options, /教員・支援員/);
  assert.match(options, /給食や教材/);
  assert.match(options, /学校施設/);
  assert.match(options, /ICT・特別支援/);
  assert.match(options, /文化施設・助成/);
  assert.equal(guidance.considerationsHeading, "増やすときに考えること");
  assert.match(considerations, /財源の機会費用/);
  assert.match(considerations, /実施能力.*教員/);
  assert.match(considerations, /恒常経費/);
  assert.match(considerations, /成果.*比例/);
  assert.match(considerations, /地域.*学校/);
  assert.match(considerations, /短期.*長期/);
  assert.equal(guidance.caseHeading, "他の自治体では、予算を増やして何を変えた？");
  assert.equal(
    guidance.finalQuestion,
    "この840億円を増やすなら、何に使いますか？その支出を来年度以降も続けられますか？",
  );
});

test("keeps debt and tax-linked increases distinct from ordinary service expansion", () => {
  const debt = BUDGET_CATEGORIES.find(category => category.id === "debt");
  const linked = BUDGET_CATEGORIES.find(category => category.id === "linked");

  assert.match(
    getBudgetChangeGuidance(debt, "increase", 100).optionsLead,
    /返済・利払い.*政策サービスの拡充とは意味が異なります/,
  );
  assert.match(
    getBudgetChangeGuidance(linked, "increase", 100).optionsLead,
    /制度上の算定.*任意に増やす一般事業費とは異なります/,
  );
});

test("explains why an unchanged nominal amount may not preserve services", () => {
  const education = BUDGET_CATEGORIES.find(category => category.id === "education");
  const guidance = getBudgetChangeGuidance(education, "unchanged", 0);
  const text = guidance.options.map(option => `${option.title}${option.description}`).join(" ");

  assert.equal(guidance.optionsHeading, "現在の水準を維持するとは？");
  assert.match(text, /物価/);
  assert.match(text, /人件費/);
  assert.match(text, /老朽化/);
  assert.match(guidance.optionsLead, /金額を据え置いても、実質的なサービス水準が同じとは限りません/);
  assert.equal(
    guidance.finalQuestion,
    "今の金額を維持すれば、サービス水準も維持できるでしょうか？",
  );
});
