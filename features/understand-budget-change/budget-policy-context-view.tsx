import type { BudgetPolicyContext } from "./budget-policy-context.ts";

type BudgetPolicyContextViewProps = {
  context: BudgetPolicyContext;
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
}: BudgetPolicyContextViewProps) {
  const current = context.fy2026;

  return <section
    className="budgetDetailSection budgetCurrentInitiatives"
    aria-labelledby="current-initiatives-heading"
    data-budget-current-initiatives={context.categoryId}
  >
    <p className="sectionLabel">FY2026 CURRENT CONTEXT</p>
    <h2 id="current-initiatives-heading">{current.heading}</h2>
    <p className="detailLead">{current.summary}</p>
    {current.initiatives.length > 0 && <ul className="budgetCurrentInitiativeList">
      {current.initiatives.map(item => <li key={item.title}>{item.title}</li>)}
    </ul>}
    <p className="budgetPolicyDisclaimer">{current.disclaimer}</p>
    <SourceLinks sources={current.sources} />
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
    <p className="budgetPolicyDisclaimer">{direction.disclaimer}</p>
    <details className="budgetPublishedDirectionDetails">
      <summary>計画の例と公式資料を見る</summary>
      {direction.examples.length > 0 && <div className="budgetPublishedDirectionExamples">
        <h3>公表資料にある例</h3>
        <ul>{direction.examples.map(example => <li key={example}>{example}</li>)}</ul>
      </div>}
      <SourceLinks sources={direction.sources} />
    </details>
  </section>;
}
