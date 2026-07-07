# AGENTS.md

Instructions for AI coding agents working in this repository (Cursor, Copilot, Codex, and others).

## Read first

1. `docs/CODEBASE_STANDARDS.md` — the coding standards for this repo. Every change must follow it.
2. `.claude/prompts/architecture.md` — how this system is structured.

## Rules

- The repository is always the source of truth — follow discovered conventions, not generic best practices.
- Match the surrounding code's style, naming, and idioms exactly. Never introduce a different coding style, even one you consider better.
- Before writing new code, search the repository for at least three similar implementations and follow the closest existing pattern.
- Reuse existing utilities and patterns; do not introduce new abstractions, layers, or dependencies without being asked.
- Never rename files, folders, methods, or classes unless the repository already follows that pattern.
- Every new behavior needs a test, written in this repo's existing test style.
- Run the project's tests and linter after changes; fix what you broke.
- Keep changes minimal and focused — no drive-by refactoring.
- Never commit secrets, credentials, or environment-specific values.

<!-- Add project-specific agent instructions below this line. -->
