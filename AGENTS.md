# Project Working Agreements

These instructions apply to the entire repository.

## Product purpose and north star

- The product name is **東京予算ラボ**. It is an unofficial learning and information-exploration prototype, not a Tokyo Metropolitan Government service.
- The baseline is the enacted FY2026 (令和8年度) initial Tokyo general-account budget. Do not silently replace it with a proposal, request, assessment, another fiscal year, or a layout-mock value.
- The central purpose is to let a person experience that, within a limited total budget, increasing one priority requires reducing or leaving money unallocated elsewhere, and then help that person think about what Tokyo should prioritize.
- The intended outcome is fiscal understanding and a path to civic participation. The service should connect numbers to their meaning, concrete ways a budget could change, public cases, Tokyo's budget process, responsible bureaus, and official participation routes.
- The product is not intended to find the single correct budget, reproduce every rule of real budget formulation, predict social outcomes, accept opinions, or promise that a submitted opinion changes the budget.

The core experience is:

```text
Understand the FY2026 baseline
  -> redistribute a fixed annual total across nine fields
  -> experience trade-offs
  -> understand what the selected field and change mean
  -> inspect public cases and evidential limits
  -> learn how Tokyo's budget is decided
  -> reach official participation routes
```

Keep the top-page explanation brief enough that a first-time user can reach the simulator directly. The budget-process explanation comes after the allocation experience and also has its own page. Do not add a mandatory start/introduction screen without first making it an explicit UX decision with the user.

### The concept in one sentence

> 東京都の予算を「見る」だけでなく、自分で動かして、その変更が現実には何を意味するのかまで理解する。

The positioning is a fiscal-experience tool that starts from 「自分ならこうする」 and leads to 「でも現実にはなぜ簡単ではないのか」. It is deliberately more than a budget simulator.

The experience has four stages. Every feature should be traceable to one of them, and a change that serves none of them needs justification.

| Stage | What the person does |
| --- | --- |
| 見る | Learn how Tokyo actually allocates its budget across the nine fields. |
| 動かす | Redistribute it themselves: raise education, cut debt service, raise welfare. |
| 意味を知る | Learn what 「公債費を30%減らす」 or 「教育費を減らす」 would actually reduce, including public cases from Japan and abroad. |
| 現実につなぐ | Learn how the budget is decided through bureau requests, Finance Bureau assessment, governor assessment, and the assembly, and where a resident can raise an opinion. |

The operating experience is modelled on Liverpool's Budget Challenge. Four things are the Tokyo-specific difference and must not be dropped to simplify the product:

1. Public cases of jurisdictions and countries that actually made reductions.
2. Tokyo's own budget formation process.
3. Routes to 都民の声, petitions, written requests, and responsible bureaus.
4. Provenance back to official primary sources.

`features/understand-prototype/prototype-purpose.ts` holds the user-facing copy for the concept, the four stages, and the non-goals. `/about` renders it. Keep that file and this section consistent; if the concept changes, change both.

When assessing the product against the concept, measure coverage rather than presence. As of 2026-08-10 the weakest stage is 意味を知る, because public cases exist for three of nine fields; `/about` derives that count from the data so the page cannot overstate it.

## Simulator concept and invariants

- The annual general-account total is fixed at 96,530 hundred-million yen (9兆6,530億円) for the current FY2026 experience.
- The nine enacted baseline allocations add up to that annual total. Reducing field A creates the same amount of available funds; increasing field B consumes those funds. The UI must not allow allocations to exceed the fixed total.
- Each field is currently adjustable from 70% through 130% of its baseline, in increments of 1 hundred-million yen. “70% of baseline” means a 30% reduction, not a 70% reduction.
- Always show the annual total, allocated amount, and available amount together while the user is changing allocations.
- A simulated allocation is a learning exercise, not an executable official budget. Do not infer which individual project, contract, law, staffing level, or outcome would change unless supported by public evidence.
- The simulator deliberately focuses on distributing a fixed total. It does not currently model multiple fiscal years, tax-policy changes, economic forecasts, borrowing capacity, or fund balances as controls.

基金、都債、都税 are displayed as “動かせない前提”, but this must never be explained as if they are legally or practically immutable:

- 都税 is revenue affected by the tax system, the economy, corporate earnings, land values, and forecasts.
- 都債 is borrowing that can provide current resources while creating future principal and interest obligations.
- 基金 is a balance held across fiscal years; drawing it down adds current resources but reduces future room, while accumulating it does the reverse.
- They are outside the current controls because they are revenue, financing, and inter-year balance concepts rather than the nine purpose-based expenditure destinations. Making them controllable would turn the product into a broader, multi-year fiscal simulator.
- The top cards must explain both “what it is” and “why this screen does not move it”. `/fiscal-context` provides the detailed explanation and official source route.

## Information architecture and reading order

- `/` — short purpose statement, FY2026 overview, fixed-total simulator, selected-field context, budget-process summary, and fiscal-condition cards.
- `/budget/[categoryId]` — inherited user amount, meaning, uses, change options, domestic/international cases, Tokyo budget background, sources, responsible bureaus, and participation routes for one of the nine fields.
- `/budget-process` — requests, Finance Bureau assessment, governor assessment, proposal, assembly review, enactment, execution, settlement, and evaluation as separate stages.
- `/participation` — category-aware official routes such as 都民の声, public comments, petitions, and written requests, including what each route can and cannot do.
- `/sources` — provenance, document stage, retrieval date, source type, license status, and app usage.
- `/about` — prototype status and interpretive limits.
- `/fiscal-context` — what funds, Tokyo bonds, and metropolitan taxes are; what changes imply; and why they are outside the current simulator controls.

The normal learning order is allocation first, meaning and trade-offs second, budget process third, and participation routes last. Links may let informed users skip ahead, but page changes should preserve this narrative.

## Evidence and wording rules

- Keep enacted budget, proposal, bureau requests, Finance Bureau assessment, and governor assessment as distinct document stages. Never describe a proposal or requested amount as the enacted baseline.
- Distinguish four kinds of information in data and wording:
  - `fact`: a claim or number stated in an official primary source.
  - `case_fact`: a fact about another jurisdiction supported by a public source.
  - `interpretation`: the app's explanation or a possible way to think about a change.
  - `unknown`: something public material cannot establish without guessing.
- Public cases explain what happened elsewhere; they are not predictions of what would happen in Tokyo. Preserve caveats about different institutions and conditions.
- Do not generate unsupported numbers such as people helped, percentage improvement, savings, or causal effects.
- Use visible “外部リンク” wording for links that leave the site. Preserve retrieval dates and source metadata.
- Layout images under `docs/` are visual references only. Their numbers are not budget data. Structured data produced from official material takes priority for years and amounts.
- The official CSV workflow and its reproducibility are described in `docs/data-refresh.md`. Keep data acquisition, normalization, and validation separate from page composition.

## Purpose-driven code map

- `app/` owns routes and page composition only.
- `features/simulate-budget/` owns the nine fields, baseline allocations, fixed-total redistribution, ranges, and simulation state.
- `features/understand-budget-change/` owns detailed explanations for a selected allocation change.
- `features/understand-fiscal-context/` owns the fund, bond, and tax explanations used by the top cards and fiscal-context page.
- `features/learn-budget-process/` owns the stages by which the budget is formed and evaluated.
- `features/learn-from-budget-cases/` owns domestic and international public cases and their evidence limits.
- `features/find-participation-route/` owns official participation mechanisms.
- `features/trace-budget-sources/` owns source and provenance metadata.
- `features/prepare-budget-data/` and `scripts/` own fetch, normalization, validation, and reproducible audits.

When adding behavior, put it under the user purpose that would cause it to change. Do not move these domains into generic `components`, `utils`, or `data` directories merely to reduce file count.

## Current handoff state

As of 2026-08-09:

- Sections 2 through 17 of `docs/implementation-checklist.md` have been implemented and checked. Section 18 is the next formal MVP final-acceptance pass; its unchecked boxes are an acceptance review, not evidence that the preceding implementation is missing.
- Fiscal-context implementation is recorded in commit `546f3a8`; later commits document the handoff and demo narrative. Inspect `git log` for the actual latest state instead of treating a hash in this file as the branch tip.
- The last verification passed 90 tests, production build, ESLint, the two-minute demo audit, desktop/mobile layout and heading audits over seven primary pages, keyboard checks, and 39 unique external links with zero failures.
- The worktree was clean after the last commit. Confirm this with `git status --short` at the start of the next session rather than assuming it remains clean.
- The primary handoff documents are:
  - `docs/tokyo_budget_lab_spec_v0.1.md` for product scope and rationale.
  - `docs/implementation-checklist.md` for completion state and the next acceptance pass.
  - `docs/two-minute-demo.md` for the intended two-minute story.
  - `docs/data-refresh.md` for reproducible data updates.
  - `docs/web-image.png` and `docs/レイアウト-補足.md` for layout direction only.

At the beginning of the next session:

1. Read this file and the relevant checklist section before editing.
2. Run `git status --short` and inspect recent commits so user work is not overwritten.
3. Start locally with `npm run dev` when a visual check is needed.
4. Continue with section 18 only if the user wants the final acceptance pass; otherwise follow the user's new priority.
5. Preserve completed decisions unless new evidence or an explicit user decision changes them. Record any changed product decision in this file or the checklist so another agent can reconstruct why.

## Development flow

- Use test-driven development in the t-wada style: Red, Green, Refactor.
- Add or change one observable behavior at a time.
- Write the smallest test that expresses the next behavior, and run it to confirm the expected failure before writing production code.
- Implement only enough production code to make the failing test pass, then refactor while keeping all tests green.
- Prefer behavior-focused tests and real values over implementation-detail assertions and excessive mocking.
- When a check fails, address the first meaningful failure and rerun the same check before moving on.

## Design and directory structure

- Organize code by user purpose and domain concept, following the purpose-driven design ideas associated with MinoDriven.
- Keep files that change for the same user-facing reason close together.
- Use domain language in directory and file names. Prefer purpose names such as `simulate-budget` or `trace-budget-sources` over broad technical buckets such as `components`, `utils`, or `data`.
- Let `app/` handle routing and page composition; place reusable domain behavior and feature-owned data under the feature that owns the purpose.
- Introduce a shared abstraction only after multiple features genuinely share the same concept and change together.
- This is a POC: favor small, explicit structures over speculative layers and frameworks.

## Git workflow

- Work on the current branch. Do not create a feature branch for ordinary work in this single-developer POC.
- Commit each completed, coherent task before reporting it as complete.
- Review the diff and run the relevant tests, lint, and build checks before committing.
- Do not push unless the user explicitly requests it.
- Preserve unrelated user changes and exclude them from the commit unless the user asks to include them.

## Project checks

- Use the repository's Node/npm scripts rather than Python or `make` workflows.
- For a completed implementation task, run the narrow test during Red/Green cycles, then run the relevant full checks from `package.json` before committing.

## Runtime and hosting

- Treat local development with `npm run dev` as the current runtime baseline.
- Do not reintroduce `.openai/hosting.json` or a Sites manifest; that validation phase is complete and those files are retired.
- The production hosting target is intentionally undecided. Do not add Vercel, Cloudflare Pages, or AWS Amplify configuration until the user selects a target.
