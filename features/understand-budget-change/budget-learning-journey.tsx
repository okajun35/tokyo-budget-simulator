import Link from "next/link";

import type { BudgetChangeDirection } from "./budget-detail.ts";

type BudgetLearningJourneyStep = "cases" | "materials";

type BudgetLearningJourneyProps = {
  current: BudgetLearningJourneyStep;
  direction: BudgetChangeDirection;
  meaningHref: string;
  casesHref: string;
  materialsHref: string;
  participationHref: string;
  simulatorHref: string;
  budgetProcessHref?: string;
};

const journeySteps = [
  { id: "meaning", number: "1", label: "意味と制約" },
  { id: "cases", number: "2", label: "事例" },
  { id: "materials", number: "3", label: "編成資料" },
  { id: "participation", number: "4", label: "話題と窓口" },
] as const;

export function BudgetLearningJourney({
  current,
  direction,
  meaningHref,
  casesHref,
  materialsHref,
  participationHref,
}: BudgetLearningJourneyProps) {
  const hrefs = {
    meaning: meaningHref,
    cases: casesHref,
    materials: materialsHref,
    participation: participationHref,
  };
  const caseStepLabel = direction === "unchanged" ? "現在の取組" : "事例";

  return <nav
    className="budgetLearningPath"
    aria-label="変更を考える流れ"
    data-budget-journey-current={current}
  >
    <p>変更を考える流れ <small>目安</small></p>
    <ol>{journeySteps.map(step => {
      const isCurrent = step.id === current;
      return <li key={step.id} aria-current={isCurrent ? "step" : undefined}>
        <span>{step.number}</span>
        {isCurrent
          ? <strong>{step.id === "cases" ? caseStepLabel : step.label}<small>いまここ</small></strong>
          : <Link href={hrefs[step.id]}>{step.id === "cases" ? caseStepLabel : step.label}</Link>}
      </li>;
    })}</ol>
  </nav>;
}

export function BudgetLearningJourneyNext({
  current,
  direction,
  meaningHref,
  casesHref,
  materialsHref,
  participationHref,
  simulatorHref,
  budgetProcessHref,
}: BudgetLearningJourneyProps) {
  const isCases = current === "cases";
  const showsCurrentInitiatives = direction === "unchanged";
  const primaryHref = isCases ? materialsHref : participationHref;

  return <section className="budgetSupplementNext" data-budget-next-from={current}>
    <p className="sectionLabel">NEXT</p>
    <h2>{isCases
      ? "次に見るなら、東京都の編成資料"
      : "次は、関心のある話題を具体化する"}</h2>
    <p>{isCases
      ? showsCurrentInitiatives
        ? "令和8年度の関連する取組を確認したら、東京都自身の要求・査定・予算案で、この分野に関連して何を確認できるかを見ます。"
        : "他地域の事例は東京都の結果予測ではありません。東京都自身の要求・査定・予算案で、この分野に関連して何を確認できるかを見ます。"
      : "資料を確認したら、この分野を具体的な話題に分け、主な所管と確認済みの公式ルートを探せます。シミュレーションの増減が要望として自動確定されることはありません。"}</p>
    <Link href={primaryHref}>{isCases
      ? "予算編成資料へ進む →"
      : "話題と窓口へ進む →"}</Link>
    <nav className="budgetSupplementAlternatives" aria-label="ほかの行き先">
      <span>ほかの行き先</span>
      <div>
        {isCases ? <>
          <Link href={meaningHref}>意味と制約へ戻る</Link>
          <Link href={participationHref}>話題と窓口を先に見る</Link>
        </> : <>
          <Link href={casesHref}>{showsCurrentInitiatives ? "現在の取組へ戻る" : "事例へ戻る"}</Link>
          <Link href={meaningHref}>意味と制約へ戻る</Link>
          {budgetProcessHref && <Link href={budgetProcessHref}>東京都の予算全体の流れを見る</Link>}
        </>}
        <Link href={simulatorHref}>予算シミュレーターへ戻る</Link>
      </div>
    </nav>
  </section>;
}
