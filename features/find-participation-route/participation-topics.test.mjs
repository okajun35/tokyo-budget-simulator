import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import { BUDGET_CATEGORIES } from "../simulate-budget/budget-categories.ts";
import { OFFICIAL_CONTACTS } from "./official-contacts.ts";
import { PARTICIPATION_TOPICS } from "./participation-topics.ts";

test("keeps generated routing data in sync with the audited Markdown", () => {
  assert.doesNotThrow(() => execFileSync(
    process.execPath,
    ["scripts/generate-participation-topic-data.mjs", "--check"],
    { cwd: new URL("../..", import.meta.url), stdio: "pipe" },
  ));
});

test("covers all nine fields with the 49 audited participation topics", () => {
  const categoryIds = BUDGET_CATEGORIES.map(category => category.id);
  assert.equal(PARTICIPATION_TOPICS.length, 49);
  assert.deepEqual(
    [...new Set(PARTICIPATION_TOPICS.map(topic => topic.categoryId))],
    categoryIds,
  );

  for (const categoryId of categoryIds) {
    const topics = PARTICIPATION_TOPICS.filter(topic => topic.categoryId === categoryId);
    assert.ok(topics.some(topic => topic.topicName === "その他"));
    assert.ok(topics.every(topic => topic.contacts.length > 0));
  }
});

test("keeps the 22 verified contact destinations separate from bureau relations", () => {
  assert.equal(Object.keys(OFFICIAL_CONTACTS).length, 22);
  for (const contact of Object.values(OFFICIAL_CONTACTS)) {
    assert.equal(contact.verificationStatus, "verified");
    assert.equal(contact.verifiedAt, "2026-08-11");
    assert.match(contact.contactUrl, /^https:\/\//);
    assert.match(contact.contactSourceUrl, /^https:\/\//);
  }

  const welfare = PARTICIPATION_TOPICS.find(topic => topic.topicId === "elderly-welfare");
  assert.equal(welfare.contacts[0].role, "fallback");
  assert.equal(
    OFFICIAL_CONTACTS[welfare.contacts[0].contactId].contactOrganizationName,
    "東京都（都民の声総合窓口）",
  );
});

test("routes health and medical topics to the verified bureau voice form and contact directory", () => {
  const expectedContacts = [
    { contactId: "health-medical-resident-voice-form", role: "direct" },
    { contactId: "health-medical-contact-directory", role: "alternate" },
  ];

  for (const topicId of ["medical-delivery", "public-health"]) {
    const topic = PARTICIPATION_TOPICS.find(item => item.topicId === topicId);
    assert.ok(topic);
    assert.deepEqual(topic.contacts, expectedContacts);
    assert.doesNotMatch(topic.jurisdictionNote ?? "", /503|本文未確認/);
  }

  assert.deepEqual(OFFICIAL_CONTACTS["health-medical-resident-voice-form"], {
    contactId: "health-medical-resident-voice-form",
    contactLabel: "東京の保健医療についてあなたの声をお寄せください",
    contactOrganizationId: "health-medical-bureau",
    contactOrganizationName: "東京都保健医療局",
    contactUrl: "https://logoform.jp/form/tmgform/297877",
    contactKind: "opinion_form",
    contactPurpose: "保健医療局の事業に関する要望・意見を直接送るフォーム。",
    contactSourceUrl: "https://www.hokeniryo.metro.tokyo.lg.jp/contact",
    verifiedAt: "2026-08-11",
    verificationStatus: "verified",
  });
  assert.equal(
    OFFICIAL_CONTACTS["health-medical-contact-directory"].contactKind,
    "inquiry_directory",
  );
  assert.equal(
    OFFICIAL_CONTACTS["health-medical-contact-directory"].contactUrl,
    "https://www.hokeniryo.metro.tokyo.lg.jp/contact",
  );
});

test("preserves audited multi-bureau and unresolved routing decisions", () => {
  const expected = [
    ["child-family-welfare", "child-policy-coordination", "possible"],
    ["startup-business-support", "industry-labor-bureau", "primary"],
    ["startup-business-support", "startup-strategy-hq", "possible"],
    ["water-environment", "waterworks-bureau", "possible"],
    ["water-environment", "sewerage-bureau", "possible"],
    ["disaster-general", "general-affairs-disaster", "primary"],
  ];

  for (const [topicId, organizationId, relation] of expected) {
    const topic = PARTICIPATION_TOPICS.find(item => item.topicId === topicId);
    assert.ok(topic?.bureauRelations.some(item =>
      item.organizationId === organizationId && item.relation === relation
    ));
  }

  for (const topic of PARTICIPATION_TOPICS.filter(item => item.topicName === "その他")) {
    assert.deepEqual(topic.bureauRelations, []);
    assert.deepEqual(topic.contacts, [{
      contactId: "tokyo-resident-voice-guide",
      role: "fallback",
    }]);
    assert.match(topic.jurisdictionNote, /話題を具体化/);
  }
});

test("retains safety warnings and verified direct opinion forms", () => {
  const fire = PARTICIPATION_TOPICS.find(topic => topic.topicId === "fire-ems-prevention");
  assert.match(fire.jurisdictionNote, /119番/);
  assert.equal(fire.contacts[0].contactId, "tfd-opinion-form");
  assert.equal(OFFICIAL_CONTACTS[fire.contacts[0].contactId].contactKind, "opinion_form");

  const police = PARTICIPATION_TOPICS.find(topic => topic.topicId === "police-security");
  assert.match(police.jurisdictionNote, /緊急通報/);
  assert.equal(OFFICIAL_CONTACTS[police.contacts[0].contactId].contactKind, "opinion_form");
});
