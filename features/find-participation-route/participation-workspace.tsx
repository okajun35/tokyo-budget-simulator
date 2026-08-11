"use client";

import { useMemo, useState } from "react";

import type { BudgetCategoryId } from "../../domain/tokyo-budget/budget-category-id";
import type { ParticipationBudgetContext } from "./participation-budget-context";
import {
  budgetChangeLabel,
  CONTACT_ROLE_LABELS,
  formatBudgetAmount,
  RELATION_LABELS,
  resolveTopicContacts,
} from "./participation-presentation";
import {
  CONTACT_ACTION_LABELS,
  type OfficialContact,
  type ParticipationTopic,
} from "./participation-topic";

type ParticipationWorkspaceProps = {
  category: {
    id: BudgetCategoryId;
    name: string;
    color: string;
  };
  budgetContext: ParticipationBudgetContext;
  topics: readonly ParticipationTopic[];
  contacts: Record<string, OfficialContact>;
  initialTopicId?: string;
  prepareHrefs: Record<string, string>;
};

export function ParticipationWorkspace({
  category,
  budgetContext,
  topics,
  contacts,
  initialTopicId,
  prepareHrefs,
}: ParticipationWorkspaceProps) {
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId);
  const selectedTopic = topics.find(topic => topic.topicId === selectedTopicId);
  const resolvedContacts = useMemo(
    () => selectedTopic ? resolveTopicContacts(selectedTopic, contacts) : [],
    [contacts, selectedTopic],
  );

  return <>
    <section className="participationChange" aria-labelledby="your-change-heading">
      <div>
        <p className="eyebrow">YOUR SIMULATION</p>
        <h2 id="your-change-heading">あなたの変更</h2>
      </div>
      <article style={{ borderColor: category.color }}>
        <span>{category.name}</span>
        {budgetContext.status === "known" ? <>
          <strong>{budgetChangeLabel(budgetContext)}</strong>
          <dl>
            <div><dt>成立予算</dt><dd>{formatBudgetAmount(budgetContext.baselineAmount100mYen)}</dd></div>
            <div><dt>あなたの案</dt><dd>{formatBudgetAmount(budgetContext.userAmount100mYen)}</dd></div>
          </dl>
        </> : <strong className="unknown">シミュレーターでの変更額を確認できません</strong>}
      </article>
      <p className="participationSimulationCaveat">これはシミュレーション上の変更であり、この増減を行政へ要求する意思表示ではありません。</p>
    </section>

    <section className="participationTopicSection" aria-labelledby="topic-heading">
      <div className="participationSectionHeading">
        <p className="eyebrow">CHOOSE A TOPIC</p>
        <h2 id="topic-heading">どの話について？</h2>
        <p>9分野は行政組織と一対一ではありません。具体的な話題を選んで、主な所管を確認します。</p>
      </div>
      <fieldset className="participationTopicChoices">
        <legend className="srOnly">{category.name}の具体的な話題</legend>
        {topics.map(topic => <label key={topic.topicId} data-participation-topic={topic.topicId}>
          <input
            type="radio"
            name="participation-topic"
            checked={selectedTopicId === topic.topicId}
            onChange={() => setSelectedTopicId(topic.topicId)}
          />
          <span>{topic.topicName}</span>
        </label>)}
      </fieldset>

      {selectedTopic ? <div className="participationRoutingResult" aria-live="polite">
        <div className="participationSelectedTopic">
          <span>選んだ話題</span>
          <h3>{selectedTopic.topicName}</h3>
        </div>
        {selectedTopic.bureauRelations.length > 0 ? <div className="participationBureaus">
          {selectedTopic.bureauRelations.map(relation => <article key={relation.organizationId}>
            <span>{RELATION_LABELS[relation.relation]}</span>
            <h4>{relation.organizationName}</h4>
            <p>{relation.relationEvidenceSummary}</p>
            <a href={relation.relationSourceUrl} target="_blank" rel="noreferrer">
              所管の根拠を確認（2026年8月11日確認・外部リンク）↗
            </a>
          </article>)}
        </div> : <p className="participationUnresolved">話題を具体化すると担当局を絞れる場合があります。特定の局へは推測で割り当てていません。</p>}

        {selectedTopic.jurisdictionNote && <aside className="participationJurisdictionNote" role="note">
          {selectedTopic.jurisdictionNote}
        </aside>}

        <div className="participationContactList">
          {resolvedContacts.map(({ contact, role }) => <article key={contact.contactId} data-contact-role={role}>
            <span>{CONTACT_ROLE_LABELS[role]}</span>
            <h4>{contact.contactOrganizationName}</h4>
            <strong>{contact.contactLabel}</strong>
            <p>{contact.contactPurpose}</p>
            {role === "fallback" && <p className="participationFallbackNote">所管局の直接窓口としてではなく、東京都の共通窓口を案内しています。</p>}
            <a href={contact.contactUrl} target="_blank" rel="noreferrer">
              {CONTACT_ACTION_LABELS[contact.contactKind]}（外部リンク）↗
            </a>
          </article>)}
        </div>

        <aside className="participationPrepareCta">
          <div>
            <strong>この話題について、何を伝えたいですか？</strong>
            <p>次のページで、問題・希望・理由の3点を整理できます。</p>
          </div>
          <a href={prepareHrefs[selectedTopic.topicId]}>このテーマについて考えを整理する →</a>
        </aside>
      </div> : <p className="participationTopicPrompt">テーマを選ぶと、主な所管と確認済みの公式ルートを表示します。</p>}
    </section>
  </>;
}
