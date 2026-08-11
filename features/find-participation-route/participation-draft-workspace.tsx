"use client";

import { useMemo, useState } from "react";

import type { BudgetCategoryId } from "../../domain/tokyo-budget/budget-category-id";
import { REQUESTED_ACTION_OPTIONS } from "./advocacy-draft";
import type { ParticipationBudgetContext } from "./participation-budget-context";
import {
  budgetChangeLabel,
  formatBudgetAmount,
  resolveTopicContacts,
} from "./participation-presentation";
import {
  CONTACT_ACTION_LABELS,
  type OfficialContact,
  type ParticipationTopic,
} from "./participation-topic";

type ParticipationDraftWorkspaceProps = {
  category: {
    id: BudgetCategoryId;
    name: string;
    color: string;
  };
  budgetContext: ParticipationBudgetContext;
  topic: ParticipationTopic;
  contacts: Record<string, OfficialContact>;
};

export function ParticipationDraftWorkspace({
  category,
  budgetContext,
  topic,
  contacts,
}: ParticipationDraftWorkspaceProps) {
  const [concern, setConcern] = useState("");
  const [requestedActionId, setRequestedActionId] = useState("");
  const [otherAction, setOtherAction] = useState("");
  const [reason, setReason] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const resolvedContacts = useMemo(
    () => resolveTopicContacts(topic, contacts),
    [contacts, topic],
  );
  const primaryContact = resolvedContacts.find(item => item.role !== "reference")?.contact;
  const primaryBureaus = topic.bureauRelations
    .filter(relation => relation.relation === "primary")
    .map(relation => relation.organizationName);
  const requestedActionOption = REQUESTED_ACTION_OPTIONS.find(option => option.id === requestedActionId);
  const requestedAction = requestedActionId === "other"
    ? otherAction.trim() || "その他（内容未入力）"
    : requestedActionOption?.label ?? "未選択";
  const canReview = Boolean(
    concern.trim() && requestedActionId && reason.trim() &&
    (requestedActionId !== "other" || otherAction.trim()),
  );
  const summaryText = [
    "あなたの考え",
    `分野：${category.name}`,
    `シミュレーション：${budgetChangeLabel(budgetContext)}`,
    `テーマ：${topic.topicName}`,
    `主な所管：${primaryBureaus.join("、") || "特定していません"}`,
    `気になっていること：${concern.trim()}`,
    `東京都にしてほしいこと：${requestedAction}`,
    `理由：${reason.trim()}`,
  ].join("\n");

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
    <section className="participationDraftContext" aria-labelledby="draft-context-heading" style={{ borderColor: category.color }}>
      <div>
        <p className="eyebrow">SELECTED CONTEXT</p>
        <h2 id="draft-context-heading">選んだ内容</h2>
      </div>
      <dl>
        <div><dt>分野</dt><dd>{category.name}</dd></div>
        <div><dt>シミュレーション</dt><dd>{budgetChangeLabel(budgetContext)}</dd></div>
        <div><dt>テーマ</dt><dd>{topic.topicName}</dd></div>
        <div><dt>主な所管</dt><dd>{primaryBureaus.join("、") || "特定していません"}</dd></div>
      </dl>
      {budgetContext.status === "known" ? <p>
        成立予算 {formatBudgetAmount(budgetContext.baselineAmount100mYen)} ／ あなたの案 {formatBudgetAmount(budgetContext.userAmount100mYen)}
      </p> : <p>シミュレーターでの変更額を確認できません。</p>}
    </section>

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
      <div className="participationDraftFields">
        <label>
          <span>何が気になっていますか？</span>
          <textarea
            value={concern}
            onChange={event => setConcern(event.target.value)}
            rows={4}
            placeholder="例：給食費が上がり、家庭の負担が増えている"
          />
        </label>
        <fieldset>
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
            rows={4}
            placeholder="例：経済状況による教育環境の差を小さくしたいから"
          />
        </label>
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

      {showSummary && <article className="participationSummary" aria-labelledby="summary-heading">
        <p className="eyebrow">YOUR NOTES</p>
        <h3 id="summary-heading">あなたの考え</h3>
        <dl>
          <div><dt>分野</dt><dd>{category.name}</dd></div>
          <div><dt>シミュレーション</dt><dd>{budgetChangeLabel(budgetContext)}</dd></div>
          <div><dt>テーマ</dt><dd>{topic.topicName}</dd></div>
          <div><dt>主な所管</dt><dd>{primaryBureaus.join("、") || "特定していません"}</dd></div>
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
