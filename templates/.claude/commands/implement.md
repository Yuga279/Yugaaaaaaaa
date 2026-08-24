---
description: Implement a feature or fix following this repo's discovered standards, with a compliance check
argument-hint: <feature description or ticket reference>
---

Implement the following: $ARGUMENTS

The repository is always the source of truth. Follow this workflow strictly:

## 1. Read the standards first

- Read `docs/CODEBASE_STANDARDS.md`. If it's short, read it in full. If it's large, read its table of contents first, then read in full: **Required Tech Stack**, **Naming Conventions**, **Anti-patterns Found**, and every section actually relevant to this task (e.g. skip Frontend Standards for a pure backend change, skip Backend Standards for a pure frontend one) — every code change must still be validated against it, but that doesn't require re-reading unrelated sections on every task.
- Read `.claude/prompts/architecture.md` for system context.
- If the standards doc is still a skeleton, tell the user to run `/write-standards` first — then proceed using existing code as the reference.

## 2. Search before writing

- Before generating any code, search the repository for **at least three similar implementations** and follow the closest existing pattern.
- Prefer extending existing modules over inventing new structures. When to create a new file/folder vs. reuse is defined in the standards doc — follow it.
- If uncertainty exists, inspect similar code before writing new code. Never assume.

## 3. Decide the exact file set before writing anything

For any new page, component, endpoint, or feature — frontend or backend — do not start writing code until you can state the complete file list. Derive it from:

- The **Feature Development Checklist** and **Folder Structure** sections of `docs/CODEBASE_STANDARDS.md` (what files a comparable feature added, and in what order).
- The 3+ similar implementations found in step 2 — list every file each one has. For a frontend page/component: the component, styles, test, story/doc, index/barrel export, route/navigation registration, API client/types if it fetches data, localization entry if the repo localizes. For a backend feature/endpoint: controller/handler, service, repository/DTO, request/response models or validators, migration if the schema changes, tests, and any DI/module registration the repo requires.
- The **Frontend Standards** or **Backend Standards** section (whichever applies) for the structural conventions in use, so you don't invent a co-located `.css` file in a repo that uses CSS Modules elsewhere, or a new repository pattern where the repo already has one, or vice versa.

State the file list (created vs. modified) before writing. If the standards doc is still a skeleton and no comparable example exists in the repo, say so explicitly and ask the user rather than guessing a structure.

## 4. Implement

- Follow repository conventions exactly — naming, folder placement, layering, error handling, logging, validation, API shape, state management.
- Never introduce a different coding style, even if you consider it better.
- Never rename files, folders, methods, or classes unless the repository already follows that pattern.
- Follow the feature-implementation pattern documented in the standards (files typically added, order of implementation, migrations, localization, permissions, navigation).
- Add or update tests using the repo's existing test patterns. New behavior without tests is incomplete.
- If the request is ambiguous in a way that changes the design (not the details), ask before proceeding. Otherwise make reasonable choices and note them.
- **External APIs/libraries**: matching this repo's conventions does not guarantee the call itself is correct. Before relying on a library API's shape from memory, check it against what's actually installed — the package's type definitions (`node_modules/<pkg>/**/*.d.ts` or equivalent), its `node_modules/<pkg>/package.json` version, or its docs — especially if the version in this repo's lockfile is older or newer than what you'd assume. Do not guess a method signature, config shape, or default behavior for a library you have not confirmed against the installed version.

## 5. Self-review for correctness

Before running tests, re-read your own diff adversarially — this is a distinct pass from the compliance review below, which checks *style*, not *behavior*:

- For each changed function, ask: what input breaks this? Empty/null/zero, the max case, a concurrent call, a network/IO failure mid-operation.
- Check error paths were actually exercised, not just the happy path.
- Check off-by-one, boundary, and type-coercion issues in anything touching loops, indices, or comparisons.

Fix anything this pass finds before moving on — don't just note it for later.

## 6. Verify and comply

- Run the project's tests and linter; fix what you broke.
- **Compliance review**: before completing the task, re-check every change against `docs/CODEBASE_STANDARDS.md` and list any deviations explicitly. If a deviation is unavoidable, say why.

## 7. Report

Summarize: what changed, where, key decisions made, the similar implementations you modeled the change on, the compliance review result, and anything the reviewer should look at closely.

End with this checklist, answered honestly (a skipped step should show as "no", not be omitted) — this exists so shortcuts taken under time pressure stay visible instead of silently disappearing:

```
- [ ] Read standards + architecture docs
- [ ] Found and followed 3+ similar implementations
- [ ] Stated the file list before writing
- [ ] Verified external library APIs against the installed version, if any were used
- [ ] Ran the self-review-for-correctness pass
- [ ] Ran tests/linter
- [ ] Ran the compliance review
```
