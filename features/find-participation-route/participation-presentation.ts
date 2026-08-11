import type { ParticipationBudgetContext } from "./participation-budget-context";
import type { ContactRole, OfficialContact, ParticipationTopic } from "./participation-topic";

const numberFormatter = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 });

export const CONTACT_ROLE_LABELS = {
  direct: "まずはこちら",
  alternate: "内容によってはこちら",
  fallback: "東京都の共通窓口",
  reference: "参考資料",
} as const satisfies Record<ContactRole, string>;

export const RELATION_LABELS = {
  primary: "主な所管",
  shared: "共同で関係する所管",
  possible: "内容によって関係する所管",
} as const;

const roleOrder = { direct: 0, alternate: 1, fallback: 2, reference: 3 } as const;

export function formatBudgetAmount(amount: number): string {
  return `${numberFormatter.format(amount)}億円`;
}

export function budgetChangeLabel(context: ParticipationBudgetContext): string {
  if (context.status === "unknown") return "変更額不明";
  if (context.direction === "unchanged") return "現在の水準を維持";
  const sign = context.deltaAmount100mYen > 0 ? "+" : "−";
  return `${sign}${numberFormatter.format(Math.abs(context.deltaAmount100mYen))}億円`;
}

export function resolveTopicContacts(
  topic: ParticipationTopic,
  contacts: Record<string, OfficialContact>,
) {
  return topic.contacts
    .map(topicContact => ({
      ...topicContact,
      contact: contacts[topicContact.contactId],
    }))
    .filter((item): item is typeof item & { contact: OfficialContact } => Boolean(item.contact))
    .sort((left, right) => roleOrder[left.role] - roleOrder[right.role]);
}
