# Project Working Agreements

These instructions apply to the entire repository.

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
