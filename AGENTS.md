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
  -> review only the changed fields and optionally finish
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
| 動かす | Redistribute it themselves, then review which fields gained or lost money; the summary may be the end of a light experience. |
| 意味を知る | For increases, decreases, and unchanged allocations, learn what would actually change, what delivery constraints or shifted burdens arise, and what public cases can and cannot establish. |
| 現実につなぐ | Learn how the budget is decided through bureau requests, Finance Bureau assessment, governor assessment, and the assembly, and where a resident can raise an opinion. |

The operating experience is modelled on Liverpool's Budget Challenge. Four things are the Tokyo-specific difference and must not be dropped to simplify the product:

1. Public cases showing what jurisdictions and countries actually changed when they increased, reduced, or restructured spending.
2. Tokyo's own budget formation process.
3. Routes to 都民の声, petitions, written requests, and responsible bureaus.
4. Provenance back to official primary sources.

`features/understand-prototype/prototype-purpose.ts` holds the user-facing copy for the concept, the four stages, and the non-goals. `/about` renders it. Keep that file and this section consistent; if the concept changes, change both.

When assessing the product against the concept, measure coverage rather than presence. As of 2026-08-11, decrease or restructuring cases cover all nine fields, while independently verified increase cases are intentionally limited to welfare, education, and urban development. `/about` derives general case coverage from the data so the page cannot overstate it. Do not fill increase cases merely to equalize counts.

### Intended reader and how to write for them

The reader is a 高校生以上の、東京都の予算に詳しくない一般都民: high-school and university students, and residents without specialist fiscal knowledge. Classroom and workshop use is a secondary audience. Two audiences are explicitly out of scope: analysts who need a practitioner tool, and primary or junior-high teaching material.

This choice fixes the vocabulary rule. Writing for junior-high readers would require explaining 都債, 基金, 財政調整, 議会, and 査定 from first principles and would turn the product into fiscal-education material. Writing only for engaged adults would give up the accessibility that makes the product worth building.

Therefore keep the official term and add the meaning in one line at its first appearance on a screen. Do not replace 公債費 with 借金返済のお金, because a reader who moves on to Tokyo's own documents will meet 公債費 there.

| Official term | First appearance on screen |
| --- | --- |
| 公債費 | 公債費（都債の返済などに使うお金） |
| 査定 | 査定（要求された事業や金額を確認・調整すること） |
| 借換え | 借換え（新たに借りて、以前の借入を返すこと） |
| 起債 | 起債（都債を発行して資金を調達すること） |
| 交付金 | 交付金（国や自治体などから一定の目的・制度に基づいて渡されるお金） |

The same rule applies to process stages. `BUDGET_PROCESS_SUMMARY_STEPS` carries a `plainMeaning` of at most 30 characters beside each formal label, so 各局予算要求 reads as 「来年度、この事業にこれだけ必要です」 without losing the official name.

## Simulator concept and invariants

- The annual general-account total is fixed at 96,530 hundred-million yen (9兆6,530億円) for the current FY2026 experience.
- The nine enacted baseline allocations add up to that annual total. Reducing field A creates the same amount of available funds; increasing field B consumes those funds. The UI must not allow allocations to exceed the fixed total.
- Each field is currently adjustable from 70% through 130% of its baseline, in increments of 1 hundred-million yen. “70% of baseline” means a 30% reduction, not a 70% reduction.
- Always show the annual total, allocated amount, and available amount together while the user is changing allocations.
- In each simulator row, clicking any non-interactive card surface selects that field. Moving its slider changes the amount and selects the field; detail links keep their navigation behavior without being treated as row selection. Preserve the explicit keyboard-operable selection button rather than making the article itself an inaccessible click target.
- Preserve the complete nine-field allocation and selected field when the person opens the allocation result, a category detail, returns to the simulator, or continues through the budget-process and participation routes. Validate URL-carried allocations against every field range and the fixed annual total before restoring them; malformed state must fall back safely.
- A simulated allocation is a learning exercise, not an executable official budget. Do not infer which individual project, contract, law, staffing level, or outcome would change unless supported by public evidence.
- Category details branch on the selected delta. An increase asks what the money becomes and tests opportunity cost, delivery capacity, recurring cost, distribution, diminishing returns, and timing. A decrease asks what service, burden, staffing, or future cost changes. An unchanged nominal amount asks whether inflation, wages, demand, aging assets, or rule changes alter the real service level. Never frame increase as inherently good or decrease as inherently bad.
- The simulator deliberately focuses on distributing a fixed total. It does not currently model multiple fiscal years, tax-policy changes, economic forecasts, borrowing capacity, or fund balances as controls.

基金、都債、都税 are displayed as “動かせない前提”, but this must never be explained as if they are legally or practically immutable:

- 都税 is revenue affected by the tax system, the economy, corporate earnings, land values, and forecasts.
- 都債 is borrowing that can provide current resources while creating future principal and interest obligations.
- 基金 is a balance held across fiscal years; drawing it down adds current resources but reduces future room, while accumulating it does the reverse.
- They are outside the current controls because they are revenue, financing, and inter-year balance concepts rather than the nine purpose-based expenditure destinations. Making them controllable would turn the product into a broader, multi-year fiscal simulator.
- The top cards must explain both “what it is” and “why this screen does not move it”. `/fiscal-context` provides the detailed explanation and official source route.

## Information architecture and reading order

- `/` — short purpose statement, FY2026 overview, fixed-total simulator, selected-field context, budget-process summary, and fiscal-condition cards.
- `/budget-result` — changed fields grouped into increases and decreases, the amount already reallocated, any amount still unallocated, and optional links into category details. Unchanged fields are counted but not listed again.
- `/budget/[categoryId]` — inherited user amount, meaning, uses, direction-specific change options, constraints, and three next-step choices for one of the nine fields.
- `/budget/[categoryId]/cases` — direction-matched public cases and their evidential limits for the inherited category and amount.
- `/budget/[categoryId]/materials` — Tokyo request, assessment, proposal, and enacted-budget materials related to the inherited category, with classification-axis caveats and official sources.
- `/budget-process` — requests, Finance Bureau assessment, governor assessment, proposal, assembly review, enactment, execution, settlement, and evaluation as separate stages.
- `/participation` — select a concrete topic for the inherited category, identify the responsible organizations, and compare verified official contacts with common participation routes.
- `/participation/prepare` — privately organize the person's concern, requested action, and reason for the selected topic before copying it or opening an official contact. Free text remains in client memory and is not persisted. Only when the person explicitly opts into AI copy-editing are those three fields sent to the Cloudflare Workers AI binding for one inference.
- `/sources` — provenance, document stage, retrieval date, source type, license status, and app usage.
- `/about` — prototype status and interpretive limits.
- `/fiscal-context` — what funds, Tokyo bonds, and metropolitan taxes are; what changes imply; and why they are outside the current simulator controls.

The normal learning order is allocation first, an optional result summary and stopping point, meaning and trade-offs second, budget process third, and participation routes last. Links may let informed users skip ahead, but page changes should preserve this narrative.

The category case and material pages show a compact four-step guide: meaning and constraints, public cases, Tokyo formation materials, then topics and official routes. Treat it as a suggested path, not a mandatory wizard. At the end of each page, show one primary next action and separate return or skip links as secondary alternatives.

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
- The nine simulator fields use purpose-based expenditure, while request and assessment documents mainly use bureau, 款・項・目, or individual-item classifications. Never infer a one-to-one crosswalk, independently total multiple bureaus or 款, or match an item only because its name is similar.
- Request materials may be marked only as `direct` or `related_bureau`; Finance Bureau assessment examples may be marked only as `representative_item`. Explain the scope on screen, and treat an unavailable mapping as `unknown`, never as “要求なし” or “査定なし”.
- The current request-material and assessment-example coverage counts are internal QA indicators only. Do not show them to users or make full coverage a completion condition.
- OCR may help discover candidate passages, but every displayed amount and item name must be visually checked in the original PDF and cross-checked against other official material. Omit ambiguous mappings.
- Keep three layers distinct on category detail pages: the enacted FY2026 initial-budget baseline, the user's simulated change, and policy or budget-formulation material published for FY2027. The FY2027 layer is independent of increase, decrease, or unchanged simulation choices and must render the same content for all three directions.
- Label the FY2027 layer as published policy and budget-formulation context, not as an enacted budget or an inferred purpose-category increase/decrease. State that it is not an evaluation of the user's choice and does not establish either a purpose-category budget change or a finalized FY2027 amount.
- When an allocation is unchanged, retain the explanation that inflation, demand, staffing, aging assets, and制度 changes can alter the real service level. The category cases route may instead show traceable FY2026 related initiatives; label them as examples rather than the formal breakdown of that purpose category.
- AI copy-editing is optional and must receive only the person's concern, requested action, and reason. Never send the simulated category, allocation, delta, direction, bureau, or contact URL to the model. Show the original and editable AI draft separately, require explicit confirmation before copying the AI draft, and preserve the original structured-copy path when AI is unavailable or rejected.

## Purpose-driven code map

- `app/` owns routes and page composition only.
- `features/simulate-budget/` owns the nine fields, baseline allocations, fixed-total redistribution, ranges, simulation state, and the factual allocation-result summary.
- `features/understand-budget-change/` owns detailed explanations for a selected allocation change.
- `features/understand-fiscal-context/` owns the fund, bond, and tax explanations used by the top cards and fiscal-context page.
- `features/learn-budget-process/` owns the stages by which the budget is formed and evaluated.
- `features/learn-from-budget-cases/` owns domestic and international public cases and their evidence limits.
- `features/find-participation-route/` owns official participation mechanisms.
- `features/trace-budget-sources/` owns source and provenance metadata.
- `features/prepare-budget-data/` and `scripts/` own fetch, normalization, validation, and reproducible audits.

When adding behavior, put it under the user purpose that would cause it to change. Do not move these domains into generic `components`, `utils`, or `data` directories merely to reduce file count.

## Current handoff state

As of 2026-08-13:

- Sections 2 through 18-A of `docs/implementation-checklist.md` have been implemented and checked. The section 18 final MVP acceptance passed all 38 items; section 18-A records the later allocation-result summary. Their evidence and non-blocking coverage limits are recorded directly below those sections.
- Fiscal-context implementation is recorded in commit `546f3a8`; later commits document the handoff and demo narrative. Inspect `git log` for the actual latest state instead of treating a hash in this file as the branch tip.
- The last verification passed 231 tests, production build, ESLint, Cloudflare deployment-contract validation, and desktop/mobile layout and heading audits over 13 stateful and primary paths. The simulator audit covers whole-card pointer selection, keyboard selection, keyboard slider operation, and the allocation-result route after a complete redistribution. The result summary lists only changed fields, distinguishes reallocated from still-unallocated money, and preserves all nine allocations in category-detail links. The participation audit also covers the optional AI disclosure, default-off consent state, and the selected official contact repeated after the drafting and AI workflow. At 900px and below, the shared header keeps the brand visible and replaces the five compressed links with an accessible menu button; the layout audit checks one-line 48px menu links, no horizontal overflow, and Escape focus return at 390px.
- Optional AI copy-editing uses `@cf/openai/gpt-oss-120b`, sends only the three resident-authored fields after explicit consent, and retains an editable, confirm-before-copy result beside the original. Production binding and rate-limit configuration pass Wrangler dry-run; live preview, CPU, quota, and logging checks remain external release gates in `docs/adversarial-release-checklist.md`.
- Cloudflare Workers Free in the user's personal account is the selected hosting target, and `https://tokyobudget.page/` is the canonical public URL. The personal account's native Workers Builds GitHub integration deploys the generated `dist/server/wrangler.json` through the commands recorded in `docs/cloudflare-deployment.md`. The time-limited ODH Paid-equivalent team is not the production owner.
- The remaining unchecked section 1 items are historical decision-record entries whose substance is implemented; section 19 is intentionally future scope. Do not treat either group as a failed section 18 acceptance item.
- Confirm `git status --short` at the start of the next session. User-authored research and design Markdown may remain untracked; preserve it unless the user explicitly asks to include it in a commit.
- The primary handoff documents are:
  - `docs/tokyo_budget_lab_spec_v0.1.md` for product scope and rationale.
  - `docs/implementation-checklist.md` for completion state and acceptance evidence.
  - `docs/two-minute-demo.md` for the intended two-minute story.
  - `docs/data-refresh.md` for reproducible data updates.
  - `docs/web-image.png` and `docs/レイアウト-補足.md` for layout direction only.

At the beginning of the next session:

1. Read this file and the relevant checklist section before editing.
2. Run `git status --short` and inspect recent commits so user work is not overwritten.
3. Start locally with `npm run dev` when a visual check is needed.
4. Do not repeat section 18 without new evidence or a user request; follow the user's next priority.
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
- The optional AI copy-editing runtime uses a Cloudflare Workers AI binding with `@cf/openai/gpt-oss-120b` and Cloudflare Rate Limiting bindings. Never expose an API token to browser code.
- Native Workers Builds GitHub integration in the user's personal Cloudflare Workers Free account is the selected production hosting path. Keep `main` as the production branch and deploy only the generated config after `npm run verify:cloudflare` passes. A push to `main` can therefore change production. Use `https://tokyobudget.page/` for production checks; describe it as the project's canonical public URL rather than a Tokyo Metropolitan Government official site. Do not add another hosting platform or perform an external deployment unless the user explicitly requests it.
