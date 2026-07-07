# CLAUDE.md

This repository uses a shared engineering setup managed by `@yugarajan/claude-engineer`.

## Source of truth

- `docs/CODEBASE_STANDARDS.md` — coding standards **discovered from this repository**. Follow it in every change. If it is still a skeleton, run `/write-standards` to generate it.
- `.claude/prompts/architecture.md` — how this system is built. If it is still a placeholder, run `/learn-codebase` to generate it.

## Available commands

| Command | Purpose |
| --- | --- |
| `/learn-codebase` | Study the repo and git history → `.claude/prompts/architecture.md` |
| `/write-standards` | Discover real conventions from code and git history → `docs/CODEBASE_STANDARDS.md` |
| `/implement <feature>` | Implement a feature following the standards, with compliance review |
| `/review [base]` | Review the current branch against the standards |
| `/bugfix <bug>` | Reproduction-first bug fixing workflow |

## Rules for every coding task

The repository is always the source of truth.

1. Read `docs/CODEBASE_STANDARDS.md` first.
2. Validate every code change against it.
3. Follow repository conventions exactly.
4. Never introduce a different coding style, even one you consider better.
5. Never rename files, folders, methods, or classes unless the repository already follows that pattern.
6. If uncertainty exists, inspect similar code before writing new code — never assume.
7. Before generating any code, search the repository for at least three similar implementations and follow the closest existing pattern.
8. Before completing the task, perform a compliance review against `docs/CODEBASE_STANDARDS.md` and list any deviations.
9. New behavior requires tests in this repo's existing test style; run the project's tests and linter before declaring work done.
10. Never commit secrets or environment-specific values.

<!-- Add project-specific instructions below this line. `claude-engineer sync` never touches this file. -->
