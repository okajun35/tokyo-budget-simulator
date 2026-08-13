"use client";

import { useMemo, useState } from "react";

import type { BudgetCategoryId } from "../../domain/tokyo-budget/budget-category-id";
import { REQUESTED_ACTION_OPTIONS } from "./advocacy-draft";
import { PARTICIPATION_REFINEMENT_LIMITS } from "./participation-refinement-api";
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

type AiStatus = "idle" | "loading" | "success" | "error";

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
  const [aiConsent, setAiConsent] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus>("idle");
  const [aiStatusMessage, setAiStatusMessage] = useState("");
  const [refinedText, setRefinedText] = useState("");
  const [aiDraftConfirmed, setAiDraftConfirmed] = useState(false);
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
  const originalDraftText = [
    `気になっていること：${concern.trim()}`,
    `してほしいこと：${requestedAction}`,
    `理由：${reason.trim()}`,
  ].join("\n");

  const resetAiDraft = () => {
    setAiConsent(false);
    setAiStatus("idle");
    setAiStatusMessage("");
    setRefinedText("");
    setAiDraftConfirmed(false);
  };

  const clearDraft = () => {
    setConcern("");
    setRequestedActionId("");
    setOtherAction("");
    setReason("");
    setShowSummary(false);
    setCopyStatus("");
    resetAiDraft();
  };

  const refineWithAi = async () => {
    if (!aiConsent || aiStatus === "loading") return;
    setAiStatus("loading");
    setAiStatusMessage("AIが文章を整えています。しばらくお待ちください。");
    setRefinedText("");
    setAiDraftConfirmed(false);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch("/api/participation/refine", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          concern: concern.trim(),
          requestedAction,
          reason: reason.trim(),
        }),
        signal: controller.signal,
      });
      const payload = await response.json() as { refinedText?: unknown; message?: unknown };
      if (!response.ok || typeof payload.refinedText !== "string" || !payload.refinedText.trim()) {
        throw new Error(typeof payload.message === "string" ? payload.message : "AI推敲を利用できませんでした。");
      }
      setRefinedText(payload.refinedText);
      setAiStatus("success");
      setAiStatusMessage("AI案を作成しました。原文と比べ、必要なら編集してください。");
    } catch (error) {
      const message = error instanceof DOMException && error.name === "AbortError"
        ? "AI推敲が時間内に完了しませんでした。原文を利用してください。"
        : error instanceof Error
          ? error.message
          : "AI推敲を利用できませんでした。原文を利用してください。";
      setAiStatus("error");
      setAiStatusMessage(message);
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const copyAiDraft = async () => {
    if (!aiDraftConfirmed || !refinedText.trim()) return;
    try {
      await navigator.clipboard.writeText(refinedText.trim());
      setAiStatusMessage("確認済みのAI案をコピーしました。");
    } catch {
      setAiStatusMessage("コピーできませんでした。AI案を選択してコピーしてください。");
    }
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
        <p>シミュレーターの操作とは別に、あなた自身の考えを入力してください。まず本人の入力を整理し、希望する場合だけAIで文章を整えられます。</p>
      </div>
      <aside className="participationPrivacyNote" role="note">
        <strong>氏名・住所などの個人情報は入力しないでください</strong>
        <p>入力内容はURL・ブラウザ保存領域・DB・分析基盤へ保存しません。AI推敲を使わない限り外部通信せず、ページを離れると消えます。</p>
      </aside>
      <div className="participationDraftFields">
        <label>
          <span>何が気になっていますか？</span>
          <textarea
            value={concern}
            onChange={event => setConcern(event.target.value)}
            rows={4}
            maxLength={PARTICIPATION_REFINEMENT_LIMITS.concern}
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
            <input
              value={otherAction}
              maxLength={PARTICIPATION_REFINEMENT_LIMITS.requestedAction}
              onChange={event => setOtherAction(event.target.value)}
            />
          </label>}
        </fieldset>
        <label>
          <span>なぜそう思いますか？</span>
          <textarea
            value={reason}
            onChange={event => setReason(event.target.value)}
            rows={4}
            maxLength={PARTICIPATION_REFINEMENT_LIMITS.reason}
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
            resetAiDraft();
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
          <button type="button" onClick={() => {
            setShowSummary(false);
            resetAiDraft();
          }}>編集する</button>
          <button type="button" onClick={copySummary}>整理内容をコピー</button>
          {primaryContact && <a href={primaryContact.contactUrl} target="_blank" rel="noreferrer">
            {CONTACT_ACTION_LABELS[primaryContact.contactKind]}（外部リンク）↗
          </a>}
        </div>
        {copyStatus && <p role="status">{copyStatus}</p>}

        <section className="participationAiRefinement" aria-labelledby="ai-refinement-heading">
          <div>
            <p className="eyebrow">OPTIONAL AI COPY EDITING</p>
            <h4 id="ai-refinement-heading">AIで文章を整える（任意）</h4>
            <p>AIは本人の3項目を読みやすく整えるだけです。内容が正しい、意味が変わらないとは保証できません。</p>
          </div>
          <aside role="note">
            <strong>AIを使う場合の送信内容</strong>
            <p>「気になっていること・してほしいこと・理由」だけをCloudflare Workers AIへ推敲処理のため送ります。分野、予算変更額、所管、窓口URLは送りません。氏名・住所・電話番号・メールアドレス等は入力しないでください。</p>
          </aside>
          <label className="participationAiConsent">
            <input
              type="checkbox"
              checked={aiConsent}
              onChange={event => setAiConsent(event.target.checked)}
            />
            <span>上記の送信内容を確認し、AI利用に同意する</span>
          </label>
          <button
            type="button"
            className="participationAiRunButton"
            disabled={!aiConsent || aiStatus === "loading"}
            onClick={refineWithAi}
          >{aiStatus === "loading" ? "AIで推敲中…" : "AIで文章を整える"}</button>

          {aiStatus !== "idle" && <p
            className={`participationAiStatus ${aiStatus === "error" ? "error" : ""}`}
            role={aiStatus === "error" ? "alert" : "status"}
            aria-live="polite"
          >{aiStatusMessage}</p>}

          {aiStatus === "success" && <div className="participationAiComparison">
            <article>
              <h5>原文（AIへ送った3項目）</h5>
              <p>{originalDraftText}</p>
            </article>
            <article>
              <label htmlFor="ai-refined-text">AI案（編集できます）</label>
              <textarea
                id="ai-refined-text"
                rows={8}
                maxLength={PARTICIPATION_REFINEMENT_LIMITS.output}
                value={refinedText}
                onChange={event => {
                  setRefinedText(event.target.value);
                  setAiDraftConfirmed(false);
                }}
              />
            </article>
            <p>AI案に入力していない事実・数字・制度名・強い断定が加わっていないか、原意が変わっていないか確認してください。</p>
            <label className="participationAiConfirmation">
              <input
                type="checkbox"
                checked={aiDraftConfirmed}
                onChange={event => setAiDraftConfirmed(event.target.checked)}
              />
              <span>原意と異なる内容がないことを確認しました</span>
            </label>
            <button
              type="button"
              className="participationAiCopyButton"
              disabled={!aiDraftConfirmed || !refinedText.trim()}
              onClick={copyAiDraft}
            >確認したAI案をコピー</button>
          </div>}
        </section>

        {primaryContact && <section
          className="participationNextContact"
          aria-labelledby="next-contact-heading"
        >
          <div>
            <p className="eyebrow">NEXT STEP</p>
            <h4 id="next-contact-heading">コピーしたら、公式窓口へ</h4>
            <p>{primaryContact.contactOrganizationName}</p>
            <strong>{primaryContact.contactLabel}</strong>
          </div>
          <div>
            <a href={primaryContact.contactUrl} target="_blank" rel="noreferrer">
              {CONTACT_ACTION_LABELS[primaryContact.contactKind]}（外部リンク）↗
            </a>
            <p>このサイトから意見は送信されません。公式ページを開き、内容を確認して必要に応じて貼り付けてください。</p>
          </div>
        </section>}
      </article>}

      <button type="button" className="participationClearButton" onClick={clearDraft}>
        入力をすべて消す
      </button>
    </section>
  </>;
}
