import type { BudgetPolicyContext } from "./budget-policy-context.ts";

type BudgetPolicyContextViewProps = {
  context: BudgetPolicyContext;
  compact?: boolean;
};

const sourceKindLabel = {
  budget_proposal_material: "令和8年度予算案資料",
  enactment_record: "議決結果",
  strategy_action_plan: "政策計画",
  budget_estimate_policy: "予算見積方針",
} as const;

function SourceLinks({
  sources,
}: {
  sources: BudgetPolicyContext["fy2026"]["sources"];
}) {
  return <ul className="budgetPolicySources">{sources.map(source => <li key={source.url}>
    <a href={source.url} target="_blank" rel="noreferrer">
      {source.title}（{sourceKindLabel[source.kind]}・外部リンク）↗
    </a>
  </li>)}</ul>;
}

export function BudgetCurrentInitiatives({
  context,
  compact = false,
}: BudgetPolicyContextViewProps) {
  const current = context.fy2026;
  const visibleInitiatives = compact
    ? current.initiatives.slice(0, 4)
    : current.initiatives;

  return <section
    className={`budgetDetailSection budgetCurrentInitiatives${compact ? " budgetCurrentInitiativesCompact" : ""}`}
    aria-labelledby="current-initiatives-heading"
    data-budget-current-initiatives={context.categoryId}
  >
    <p className="sectionLabel">FY2026 CURRENT CONTEXT</p>
    <h2 id="current-initiatives-heading">{current.heading}</h2>
    <p className="detailLead">{current.summary}</p>
    {visibleInitiatives.length > 0 && <ul className="budgetCurrentInitiativeList">
      {visibleInitiatives.map(item => <li key={item.title}>{item.title}</li>)}
    </ul>}
    <p className="budgetPolicyDisclaimer">{current.disclaimer}</p>
    {compact ? <details className="budgetCurrentInitiativesDetails">
      <summary>令和8年度の公式資料を見る</summary>
      <SourceLinks sources={current.sources} />
    </details> : <SourceLinks sources={current.sources} />}
  </section>;
}

export function BudgetPublishedPolicyDirection({
  context,
}: BudgetPolicyContextViewProps) {
  const direction = context.fy2027;

  return <section
    className="budgetPublishedDirection"
    aria-labelledby="published-direction-heading"
    data-budget-policy-direction={context.categoryId}
    data-independent-from-user-change="true"
  >
    <p className="sectionLabel">PUBLISHED POLICY CONTEXT · 2027</p>
    <h2 id="published-direction-heading">{direction.heading}</h2>
    <p className="budgetPublishedDirectionLead">{direction.summary}</p>
    {direction.examples.length > 0 && <div className="budgetPublishedDirectionExamples">
      <h3>公表資料にある例</h3>
      <ul>{direction.examples.map(example => <li key={example}>{example}</li>)}</ul>
    </div>}
    <p className="budgetPolicyDisclaimer">{direction.disclaimer}</p>
    <details className="budgetPublishedDirectionDetails">
      <summary>公式資料を見る</summary>
      <SourceLinks sources={direction.sources} />
    </details>
  </section>;
}
