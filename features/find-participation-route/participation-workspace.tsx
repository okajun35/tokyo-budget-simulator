"use client";

import { useMemo, useState } from "react";

import type { BudgetCategoryId } from "../../domain/tokyo-budget/budget-category-id";
import { REQUESTED_ACTION_OPTIONS } from "./advocacy-draft";
import { CommonParticipationRoutes } from "./common-participation-routes";
import type { ParticipationBudgetContext } from "./participation-budget-context";
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
};

const numberFormatter = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 });
const contactRoleLabels = {
  direct: "まずはこちら",
  alternate: "内容によってはこちら",
  fallback: "東京都の共通窓口",
  reference: "参考資料",
} as const;
const relationLabels = {
  primary: "主な所管",
  shared: "共同で関係する所管",
  possible: "内容によって関係する所管",
} as const;
const roleOrder = { direct: 0, alternate: 1, fallback: 2, reference: 3 } as const;

const formatSignedAmount = (amount: number) =>
  `${amount > 0 ? "+" : amount < 0 ? "−" : "±"}${numberFormatter.format(Math.abs(amount))}億円`;

function budgetChangeLabel(context: ParticipationBudgetContext) {
  if (context.status === "unknown") return "変更額不明";
  if (context.direction === "unchanged") return "現在の水準を維持";
  return formatSignedAmount(context.deltaAmount100mYen);
}

export function ParticipationWorkspace({
  category,
  budgetContext,
  topics,
  contacts,
}: ParticipationWorkspaceProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>();
  const [concern, setConcern] = useState("");
  const [requestedActionId, setRequestedActionId] = useState("");
  const [otherAction, setOtherAction] = useState("");
  const [reason, setReason] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  const selectedTopic = topics.find(topic => topic.topicId === selectedTopicId);
  const resolvedContacts = useMemo(() => selectedTopic
    ? selectedTopic.contacts
      .map(topicContact => ({
        ...topicContact,
        contact: contacts[topicContact.contactId],
      }))
      .filter(item => item.contact)
      .sort((left, right) => roleOrder[left.role] - roleOrder[right.role])
    : [], [contacts, selectedTopic]);
  const primaryContact = resolvedContacts.find(item => item.role !== "reference")?.contact;
  const requestedActionOption = REQUESTED_ACTION_OPTIONS.find(option => option.id === requestedActionId);
  const requestedAction = requestedActionId === "other"
    ? otherAction.trim() || "その他（内容未入力）"
    : requestedActionOption?.label ?? "未選択";
  const canReview = Boolean(
    selectedTopic && concern.trim() && requestedActionId && reason.trim() &&
    (requestedActionId !== "other" || otherAction.trim()),
  );

  const summaryText = selectedTopic ? [
    "あなたの考え",
    `分野：${category.name}`,
    `シミュレーション：${budgetChangeLabel(budgetContext)}`,
    `テーマ：${selectedTopic.topicName}`,
    `主な所管：${selectedTopic.bureauRelations
      .filter(relation => relation.relation === "primary")
      .map(relation => relation.organizationName)
      .join("、") || "特定していません"}`,
    `気になっていること：${concern.trim()}`,
    `東京都にしてほしいこと：${requestedAction}`,
    `理由：${reason.trim()}`,
  ].join("\n") : "";

  const clearDraft = () => {
    setConcern("");
    setRequestedActionId("");
    setOtherAction("");
    setReason("");
    setShowSummary(false);
    setCopyStatus("");
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopyStatus("整理内容をコピーしました。");
    } catch {
      setCopyStatus("コピーできませんでした。本文を選択してコピーしてください。");
    }
  };

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
            <div><dt>成立予算</dt><dd>{numberFormatter.format(budgetContext.baselineAmount100mYen)}億円</dd></div>
            <div><dt>あなたの案</dt><dd>{numberFormatter.format(budgetContext.userAmount100mYen)}億円</dd></div>
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
            onChange={() => {
              setSelectedTopicId(topic.topicId);
              setShowSummary(false);
              setCopyStatus("");
            }}
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
            <span>{relationLabels[relation.relation]}</span>
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
            <span>{contactRoleLabels[role]}</span>
            <h4>{contact.contactOrganizationName}</h4>
            <strong>{contact.contactLabel}</strong>
            <p>{contact.contactPurpose}</p>
            {role === "fallback" && <p className="participationFallbackNote">所管局の直接窓口としてではなく、東京都の共通窓口を案内しています。</p>}
            <a href={contact.contactUrl} target="_blank" rel="noreferrer">
              {CONTACT_ACTION_LABELS[contact.contactKind]}（外部リンク）↗
            </a>
          </article>)}
        </div>
      </div> : <p className="participationTopicPrompt">テーマを選ぶと、主な所管と確認済みの公式ルートを表示します。</p>}
    </section>

    <CommonParticipationRoutes />

    <section className="participationDraft" aria-labelledby="draft-heading">
      <div className="participationSectionHeading">
        <p className="eyebrow">ORGANIZE YOUR THOUGHTS</p>
        <h2 id="draft-heading">あなたは何を伝えたい？</h2>
        <p>シミュレーターの操作とは別に、あなた自身の考えを入力してください。完成文章の自動生成は行いません。</p>
      </div>
      <aside className="participationPrivacyNote" role="note">
        <strong>氏名・住所などの個人情報は入力しないでください</strong>
        <p>入力内容はこのページ内だけで保持し、保存・送信しません。ページを離れると消えます。</p>
      </aside>
      <div className="participationDraftFields" aria-disabled={!selectedTopic}>
        <label>
          <span>何が気になっていますか？</span>
          <textarea
            value={concern}
            onChange={event => setConcern(event.target.value)}
            disabled={!selectedTopic}
            rows={4}
            placeholder="例：給食費が上がり、家庭の負担が増えている"
          />
        </label>
        <fieldset disabled={!selectedTopic}>
          <legend>東京都に何をしてほしいですか？</legend>
          <p>シミュレーターの増減から自動選択はしません。</p>
          <div className="participationActionChoices">
            {REQUESTED_ACTION_OPTIONS.map(option => <label key={option.id} data-action-choice={option.id}>
              <input
                type="radio"
                name="requested-action"
                checked={requestedActionId === option.id}
                onChange={() => setRequestedActionId(option.id)}
              />
              <span>{option.label}</span>
            </label>)}
          </div>
          {requestedActionId === "other" && <label className="participationOtherAction">
            <span>具体的に入力してください</span>
            <input value={otherAction} onChange={event => setOtherAction(event.target.value)} />
          </label>}
        </fieldset>
        <label>
          <span>なぜそう思いますか？</span>
          <textarea
            value={reason}
            onChange={event => setReason(event.target.value)}
            disabled={!selectedTopic}
            rows={4}
            placeholder="例：経済状況による教育環境の差を小さくしたいから"
          />
        </label>
        {!selectedTopic && <p className="participationDraftPrompt">先に話題を一つ選んでください。</p>}
        <button
          type="button"
          className="participationReviewButton"
          disabled={!canReview}
          onClick={() => {
            setShowSummary(true);
            setCopyStatus("");
          }}
        >入力内容を確認する</button>
      </div>

      {showSummary && selectedTopic && <article className="participationSummary" aria-labelledby="summary-heading">
        <p className="eyebrow">YOUR NOTES</p>
        <h3 id="summary-heading">あなたの考え</h3>
        <dl>
          <div><dt>分野</dt><dd>{category.name}</dd></div>
          <div><dt>シミュレーション</dt><dd>{budgetChangeLabel(budgetContext)}</dd></div>
          <div><dt>テーマ</dt><dd>{selectedTopic.topicName}</dd></div>
          <div><dt>主な所管</dt><dd>{selectedTopic.bureauRelations
            .filter(relation => relation.relation === "primary")
            .map(relation => relation.organizationName)
            .join("、") || "特定していません"}</dd></div>
          <div><dt>気になっていること</dt><dd>{concern.trim()}</dd></div>
          <div><dt>東京都にしてほしいこと</dt><dd>{requestedAction}</dd></div>
          <div><dt>理由</dt><dd>{reason.trim()}</dd></div>
        </dl>
        <p>これは完成した提出文ではなく、あなたが入力した内容の整理です。</p>
        <div className="participationSummaryActions">
          <button type="button" onClick={() => setShowSummary(false)}>編集する</button>
          <button type="button" onClick={copySummary}>整理内容をコピー</button>
          {primaryContact && <a href={primaryContact.contactUrl} target="_blank" rel="noreferrer">
            {CONTACT_ACTION_LABELS[primaryContact.contactKind]}（外部リンク）↗
          </a>}
        </div>
        {copyStatus && <p role="status">{copyStatus}</p>}
      </article>}

      <button type="button" className="participationClearButton" onClick={clearDraft}>
        入力をすべて消す
      </button>
    </section>
  </>;
}
