import assert from "node:assert/strict";
import test from "node:test";

import {
  BUDGET_CATEGORIES,
  GENERAL_ACCOUNT_BASELINE_100M_YEN,
} from "./budget-categories.ts";

const expectedCategoryIds = [
  "welfare",
  "education",
  "industry",
  "environment",
  "city",
  "safety",
  "admin",
  "debt",
  "linked",
];

test("uses the nine official budget categories in display order", () => {
  assert.deepEqual(
    BUDGET_CATEGORIES.map((category) => category.id),
    expectedCategoryIds,
  );
  assert.equal(new Set(expectedCategoryIds).size, BUDGET_CATEGORIES.length);
});

test("category baselines add up to the FY2026 general account total", () => {
  const total = BUDGET_CATEGORIES.reduce(
    (sum, category) => sum + category.baselineAmount100mYen,
    0,
  );

  assert.equal(GENERAL_ACCOUNT_BASELINE_100M_YEN, 96_530);
  assert.equal(total, GENERAL_ACCOUNT_BASELINE_100M_YEN);
});

test("provides the shared detail references required by every category", () => {
  for (const category of BUDGET_CATEGORIES) {
    assert.ok(category.definition.length > 0);
    assert.ok(category.mainUses.length > 0);
    assert.ok(category.changeOptions.length > 0);
    assert.ok(
      category.changeOptions.every(
        (option) =>
          option.id.length > 0 &&
          option.title.length > 0 &&
          option.description.length > 0,
      ),
    );
    assert.ok(category.sourceIds.length > 0);
    assert.ok(Array.isArray(category.caseIds));
    assert.ok(category.participationRouteIds.length > 0);
    assert.ok(category.leadBureaus.length > 0);
    assert.ok(
      category.leadBureaus.every(
        (bureau) => bureau.name.length > 0 && /^https:\/\//.test(bureau.url),
      ),
    );
  }
});

test("records how request and assessment materials relate to each purpose category", () => {
  const categories = Object.fromEntries(
    BUDGET_CATEGORIES.map(category => [category.id, category]),
  );

  assert.deepEqual(
    Object.values(categories)
      .filter(category => category.request)
      .map(category => category.id),
    ["welfare", "education", "environment", "safety", "debt"],
  );
  assert.equal(categories.debt.request.relationship, "direct");
  assert.deepEqual(
    Object.fromEntries(
      Object.values(categories)
        .filter(category => category.request)
        .map(category => [category.id, {
          bureau: category.request.bureau,
          requested: category.request.requestedAmount100mYen,
          previous: category.request.previousAmount100mYen,
        }]),
    ),
    {
      welfare: { bureau: "福祉局＋保健医療局", requested: 18_352.6, previous: 17_564.8 },
      education: { bureau: "教育庁（代表）", requested: 11_145.8, previous: 10_478 },
      environment: { bureau: "環境局（代表）", requested: 2_635, previous: 2_177 },
      safety: { bureau: "警察費＋消防費", requested: 10_368.9, previous: 10_125.74 },
      debt: { bureau: "公債費（款）", requested: 2_801.14, previous: 2_871.77 },
    },
  );
  for (const categoryId of ["welfare", "education", "environment", "safety"]) {
    assert.equal(categories[categoryId].request.relationship, "related_bureau");
    assert.equal(categories[categoryId].request.sourceId, "request");
    assert.ok(categories[categoryId].request.note.length > 0);
  }
  for (const categoryId of ["industry", "city", "admin", "linked"]) {
    assert.ok(categories[categoryId].requestUnavailableReason.length > 0);
  }

  assert.deepEqual(
    Object.values(categories)
      .filter(category => category.bureauAssessment)
      .map(category => category.id),
    ["welfare", "education", "industry", "environment", "city", "safety", "debt"],
  );
  for (const category of Object.values(categories).filter(
    item => item.bureauAssessment,
  )) {
    assert.equal(category.bureauAssessment.relationship, "representative_item");
    assert.equal(category.bureauAssessment.sourceId, "bureau");
    assert.ok(category.bureauAssessment.items.length > 0);
    assert.ok(
      category.bureauAssessment.items.every(
        item =>
          item.name.length > 0 &&
          Number.isFinite(item.requestedAmount100mYen) &&
          Number.isFinite(item.assessedAmount100mYen),
      ),
    );
    assert.match(category.bureauAssessment.note, /分野全体の査定額ではなく/);
  }
  for (const categoryId of ["admin", "linked"]) {
    assert.ok(categories[categoryId].bureauAssessmentUnavailableReason.length > 0);
  }
  assert.deepEqual(
    Object.fromEntries(
      Object.values(categories)
        .filter(category => category.bureauAssessment)
        .map(category => [category.id, category.bureauAssessment.items.map(item => [
          item.name,
          item.requestedAmount100mYen,
          item.assessedAmount100mYen,
        ])]),
    ),
    {
      welfare: [["シルバーパス", 286.04, 274.1], ["後期高齢者医療", 1_735.43, 1_707.17]],
      education: [["学校給食運営管理", 357.19, 546.87], ["学力への懸念解消", 141.87, 137.4]],
      industry: [["金融支援", 3_415.76, 3_394], ["創業支援", 150.08, 145.73]],
      environment: [["再生可能エネルギー推進", 411.4, 317.4], ["環境エネルギー政策", 1_391.84, 1_684.88]],
      city: [["道路整備", 267.31, 265.33], ["公園整備", 367.02, 344.33]],
      safety: [["警察本部費", 5_388.75, 5_536.16], ["消防管理費", 2_189.48, 2_269.19]],
      debt: [["公債費会計繰出金", 2_800.39, 2_813.86]],
    },
  );
});

test("provides the concrete change methods required by the three detailed categories", () => {
  const expectedWordsByCategory = {
    debt: ["返済", "基金", "新規", "借換え", "条件"],
    welfare: ["対象", "単価", "時間", "補助", "人員"],
    education: ["統合", "時間", "人員", "行事", "更新延期"],
  };

  for (const [categoryId, expectedWords] of Object.entries(
    expectedWordsByCategory,
  )) {
    const category = BUDGET_CATEGORIES.find(item => item.id === categoryId);
    const optionText = category.changeOptions
      .map(option => `${option.title}${option.description}`)
      .join(" ");

    for (const word of expectedWords) {
      assert.match(optionText, new RegExp(word), `${categoryId}: ${word}`);
    }
  }
});

test("provides complete minimum content for the remaining six categories", () => {
  const categoryIds = [
    "industry",
    "environment",
    "city",
    "safety",
    "admin",
    "linked",
  ];

  for (const categoryId of categoryIds) {
    const category = BUDGET_CATEGORIES.find(item => item.id === categoryId);

    assert.ok(category, categoryId);
    assert.ok(
      category.detailedExplanation.length >= 200 &&
        category.detailedExplanation.length <= 400,
      `${categoryId}: ${category.detailedExplanation.length}文字`,
    );
    assert.ok(category.mainUses.length >= 3 && category.mainUses.length <= 6);
    assert.ok(
      category.changeOptions.length >= 3 && category.changeOptions.length <= 6,
    );
    assert.ok(category.sourceIds.length >= 2);
    assert.ok(category.leadBureaus.length > 0);
    assert.ok(category.participationRouteIds.length > 0);
  }
});
