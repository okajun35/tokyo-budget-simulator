import type { BudgetCategoryId } from "../../domain/tokyo-budget/budget-category-id.ts";

export type VerificationStatus = "verified" | "partial" | "unresolved";
export type BureauRelationKind = "primary" | "shared" | "possible";
export type ContactKind =
  | "opinion_form"
  | "inquiry_directory"
  | "general_contact"
  | "reference";
export type ContactRole = "direct" | "alternate" | "fallback" | "reference";

export type BureauRelation = {
  organizationId: string;
  organizationName: string;
  relation: BureauRelationKind;
  relationSourceUrl: string;
  relationEvidenceSummary: string;
  verifiedAt: string;
  verificationStatus: "verified";
};

export type OfficialContact = {
  contactId: string;
  contactOrganizationId: string;
  contactOrganizationName: string;
  contactLabel: string;
  contactKind: ContactKind;
  contactUrl: string;
  contactSourceUrl: string;
  contactPurpose: string;
  verifiedAt: string;
  verificationStatus: "verified";
};

export type TopicContact = {
  contactId: string;
  role: ContactRole;
};

export type ParticipationTopic = {
  categoryId: BudgetCategoryId;
  categoryName: string;
  topicId: string;
  topicName: string;
  bureauRelations: readonly BureauRelation[];
  contacts: readonly TopicContact[];
  jurisdictionNote?: string;
};

export const CONTACT_ACTION_LABELS: Record<ContactKind, string> = {
  opinion_form: "意見・要望を伝える",
  inquiry_directory: "問い合わせ先を確認",
  general_contact: "公式の連絡方法を見る",
  reference: "制度・担当を確認",
};
