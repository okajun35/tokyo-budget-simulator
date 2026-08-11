import type { BudgetCategory } from "../simulate-budget/budget-category.ts";
import type { BudgetChangeDirection } from "../understand-budget-change/budget-detail.ts";
import type { BudgetChangeGuidance } from "../understand-budget-change/budget-change-guidance.ts";
import {
  BUDGET_CASE_CHANGE_TYPE_DESCRIPTIONS,
  BUDGET_CASE_CHANGE_TYPE_GROUPS,
  BUDGET_CASE_CHANGE_TYPE_LABELS,
  BUDGET_CASE_SOURCE_KIND_LABELS,
  changeTypeGroupOf,
} from "./budget-case.ts";
import { BUDGET_CASES } from "./budget-cases.ts";
import {
  CASE_INTERPRETATIONS,
  INCREASE_CASE_INTERPRETATIONS,
} from "./case-interpretations.ts";

type CategoryCaseStudiesProps = {
  category: BudgetCategory;
  direction: BudgetChangeDirection;
  guidance: BudgetChangeGuidance;
};

export function CategoryCaseStudies({
  category,
  direction,
  guidance,
}: CategoryCaseStudiesProps) {
  const allCategoryCases = BUDGET_CASES.filter(budgetCase =>
    category.caseIds.includes(budgetCase.id),
  );
  const categoryCases = direction === "increase"
    ? allCategoryCases.filter(budgetCase => budgetCase.direction === "increase")
    : direction === "decrease"
      ? allCategoryCases.filter(budgetCase => budgetCase.direction !== "increase")
      : [];
  const caseInterpretation = direction === "increase"
    ? INCREASE_CASE_INTERPRETATIONS[category.id]
    : direction === "decrease"
      ? CASE_INTERPRETATIONS[category.id]
      : undefined;

  return <section className="budgetDetailSection" aria-labelledby="cases-heading">
    <p className="sectionLabel">PUBLIC CASES</p>
    <h2 id="cases-heading">{guidance.caseHeading}</h2>
    <p className="detailLead">{guidance.caseLead}</p>
    {caseInterpretation && <p className="caseInterpretation">{caseInterpretation}</p>}
    <p className="detailCaution">同じ割合を変えても、東京都で同じ結果になるとは限りません。制度、財政状況、人口などの条件が異なります。</p>
    <details className="caseTagLegend">
      <summary>？ 事例の見方</summary>
      {Object.entries(BUDGET_CASE_CHANGE_TYPE_GROUPS).map(([groupId, group]) => <div key={groupId} className="caseTagGroup" data-case-change-group={groupId}>
        <p className="caseTagGroupLabel">{group.label}</p>
        <dl>{group.changeTypes.map(changeType => <div key={changeType}>
          <dt>{BUDGET_CASE_CHANGE_TYPE_LABELS[changeType]}</dt>
          <dd>{BUDGET_CASE_CHANGE_TYPE_DESCRIPTIONS[changeType]}</dd>
        </div>)}</dl>
      </div>)}
      <p>1件の事例に複数付きます。追加予算が何へ変わったか、または削減した費用や負担がどこへ動いたかを区別して読みます。</p>
    </details>
    {categoryCases.length > 0 ? <div className="detailCaseGrid">{categoryCases.map(budgetCase => <article key={budgetCase.id} data-case-direction={budgetCase.direction}>
      <div className="detailCaseHeading"><span>{budgetCase.country === "日本" ? "国内" : "海外"}・{budgetCase.direction === "increase" ? "増額事例" : budgetCase.direction === "decrease" ? "減額事例" : "再編事例"}</span><h3>{budgetCase.title}</h3></div>
      <ul className="caseChangeTypes">{budgetCase.changeTypes.map(changeType => <li key={changeType} data-case-change-type={changeType} data-case-change-group={changeTypeGroupOf(changeType)}>{BUDGET_CASE_CHANGE_TYPE_LABELS[changeType]}</li>)}</ul>
      <dl><dt>実施地域</dt><dd>{budgetCase.jurisdiction}</dd><dt>実施時期</dt><dd>{budgetCase.period}</dd><dt>変更した理由</dt><dd>{budgetCase.budgetContext}</dd></dl>
      <h4>何を変えた？</h4>
      <p>{budgetCase.whatChanged}</p>
      <h4>何が確認された？</h4>
      <ul>{budgetCase.confirmedChanges.map(change => <li key={change}>{change}</li>)}</ul>
      <h4>まだ分からないこと</h4>
      <p className="detailCaution">{budgetCase.whatRemainsUnknown}</p>
      <a href={budgetCase.sourceUrl} target="_blank" rel="noreferrer">{budgetCase.sourceTitle}（{BUDGET_CASE_SOURCE_KIND_LABELS[budgetCase.sourceKind]}・{budgetCase.sourceDate}・外部リンク）↗</a>
    </article>)}</div> : <div className="detailUnavailable" data-evidence-kind="unknown"><b>事例は未収録です</b><p>{guidance.unavailableCaseMessage}</p></div>}
  </section>;
}
