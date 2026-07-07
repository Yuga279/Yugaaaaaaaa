---
description: Implement a feature or fix following this repo's discovered standards, with a compliance check
argument-hint: <feature description or ticket reference>
---

Implement the following: $ARGUMENTS

The repository is always the source of truth. Follow this workflow strictly:

## 1. Read the standards first

- Read `docs/CODEBASE_STANDARDS.md` in full. Every code change must be validated against it.
- Read `.claude/prompts/architecture.md` for system context.
- If the standards doc is still a skeleton, tell the user to run `/write-standards` first — then proceed using existing code as the reference.

## 2. Search before writing

- Before generating any code, search the repository for **at least three similar implementations** and follow the closest existing pattern.
- Prefer extending existing modules over inventing new structures. When to create a new file/folder vs. reuse is defined in the standards doc — follow it.
- If uncertainty exists, inspect similar code before writing new code. Never assume.

## 3. Implement

- Follow repository conventions exactly — naming, folder placement, layering, error handling, logging, validation, API shape, state management.
- Never introduce a different coding style, even if you consider it better.
- Never rename files, folders, methods, or classes unless the repository already follows that pattern.
- Follow the feature-implementation pattern documented in the standards (files typically added, order of implementation, migrations, localization, permissions, navigation).
- Add or update tests using the repo's existing test patterns. New behavior without tests is incomplete.
- If the request is ambiguous in a way that changes the design (not the details), ask before proceeding. Otherwise make reasonable choices and note them.

## 4. Verify and comply

- Run the project's tests and linter; fix what you broke.
- **Compliance review**: before completing the task, re-check every change against `docs/CODEBASE_STANDARDS.md` and list any deviations explicitly. If a deviation is unavoidable, say why.

## 5. Report

Summarize: what changed, where, key decisions made, the similar implementations you modeled the change on, the compliance review result, and anything the reviewer should look at closely.
