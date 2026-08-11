import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sourcePath = resolve(root, "docs/tokyo_budget_participation_research_prompt_v2.md");
const source = readFileSync(sourcePath, "utf8");
const checkOnly = process.argv.includes("--check");

function tableRows(section) {
  return section
    .split("\n")
    .filter(line => line.startsWith("|") && !line.startsWith("|---"))
    .slice(1)
    .map(line => line.slice(1, -1).split("|").map(cell => cell.trim()));
}

const routingSection = source
  .split("## 5. 検証済みルーティングデータ")[1]
  .split("### 5.1 窓口運営組織")[0];
const ownerSection = source
  .split("### 5.1 窓口運営組織")[1]
  .split("`contactRole`")[0];
const rows = tableRows(routingSection);
const owners = Object.fromEntries(tableRows(ownerSection).map(row => [
  row[0],
  { organizationId: row[1], organizationName: row[2] },
]));

const contacts = {};
const topics = [];
const topicById = new Map();

for (const row of rows) {
  const [
    categoryId,
    categoryName,
    topicId,
    topicName,
    organizationId,
    organizationName,
    relation,
    relationSourceUrl,
    relationEvidenceSummary,
    relationVerifiedAt,
    relationVerificationStatus,
    contactId,
    role,
    contactLabel,
    contactKind,
    contactUrl,
    contactSourceUrl,
    contactPurpose,
    contactVerifiedAt,
    contactVerificationStatus,
    jurisdictionNote,
  ] = row;

  let topic = topicById.get(`${categoryId}/${topicId}`);
  if (!topic) {
    topic = {
      categoryId,
      categoryName,
      topicId,
      topicName,
      bureauRelations: [],
      contacts: [],
      notes: [],
    };
    topics.push(topic);
    topicById.set(`${categoryId}/${topicId}`, topic);
  }

  if (relationVerificationStatus === "verified" &&
      !topic.bureauRelations.some(item => item.organizationId === organizationId)) {
    topic.bureauRelations.push({
      organizationId,
      organizationName,
      relation,
      relationSourceUrl,
      relationEvidenceSummary,
      verifiedAt: relationVerifiedAt,
      verificationStatus: "verified",
    });
  }

  if (!topic.contacts.some(item => item.contactId === contactId)) {
    topic.contacts.push({ contactId, role });
  }
  if (jurisdictionNote && !topic.notes.includes(jurisdictionNote)) {
    topic.notes.push(jurisdictionNote);
  }

  if (contactVerificationStatus === "verified" && !contacts[contactId]) {
    const owner = owners[contactId];
    if (!owner) throw new Error(`Missing contact owner: ${contactId}`);
    contacts[contactId] = {
      contactId,
      contactOrganizationId: owner.organizationId,
      contactOrganizationName: owner.organizationName,
      contactLabel,
      contactKind,
      contactUrl,
      contactSourceUrl,
      contactPurpose,
      verifiedAt: contactVerifiedAt,
      verificationStatus: "verified",
    };
  }
}

const generatedHeader = `/* Generated from docs/tokyo_budget_participation_research_prompt_v2.md. */\n`;
const contactsPath = resolve(root, "features/find-participation-route/official-contacts.ts");
const contactsOutput = generatedHeader +
    `import type { OfficialContact } from "./participation-topic";\n\n` +
    `export const OFFICIAL_CONTACTS = ${JSON.stringify(contacts, null, 2)} as const satisfies Record<string, OfficialContact>;\n`;

const normalizedTopics = topics.map(({ notes, ...topic }) => ({
  ...topic,
  ...(notes.length > 0 ? { jurisdictionNote: notes.join(" ") } : {}),
}));
const topicsPath = resolve(root, "features/find-participation-route/participation-topics.ts");
const topicsOutput = generatedHeader +
    `import type { ParticipationTopic } from "./participation-topic";\n\n` +
    `export const PARTICIPATION_TOPICS = ${JSON.stringify(normalizedTopics, null, 2)} as const satisfies readonly ParticipationTopic[];\n`;

if (checkOnly) {
  const stale = [
    [contactsPath, contactsOutput],
    [topicsPath, topicsOutput],
  ].filter(([path, output]) => readFileSync(path, "utf8") !== output);
  if (stale.length > 0) {
    throw new Error(`Generated participation data is stale: ${stale.map(([path]) => path).join(", ")}`);
  }
} else {
  writeFileSync(contactsPath, contactsOutput);
  writeFileSync(topicsPath, topicsOutput);
}

console.log(`${checkOnly ? "Validated" : "Generated"} ${topics.length} topics and ${Object.keys(contacts).length} contacts.`);
