---
description: Study this codebase and git history, then produce/update .claude/prompts/architecture.md
---

Study this codebase so future sessions can work in it effectively. This command produces the architecture *context* file; the full standards document is generated separately by `/write-standards`.

1. Read the project manifest(s) (package.json, pyproject.toml, *.csproj, go.mod, etc.), the directory layout, and any existing docs (README, CLAUDE.md, CONTRIBUTING.md, docs/).
2. Study git history for context: `git log --stat` on recent history, major feature commits, and refactors — how the code got to its current shape matters as much as the shape itself.
3. Identify:
   - Languages, frameworks, and key libraries in use
   - How the code is organized (layers, modules, feature folders) and dependency direction
   - Entry points: how the app starts, how requests/jobs/events flow through it
   - Data: databases, ORM, migrations, caching
   - How configuration, secrets, and environments are handled
   - How tests are written and run
   - Build, lint, and CI commands
   - External services the system depends on
4. Write your findings into `.claude/prompts/architecture.md`, replacing its placeholder content. Keep it factual and concise — it is loaded as context by other commands, so every line must earn its place.
5. Finish with a short summary in chat of the 5 most important things a new engineer should know about this repo, and recommend running `/write-standards` next if `docs/CODEBASE_STANDARDS.md` is still a skeleton.

Do not modify any source code during this task.
