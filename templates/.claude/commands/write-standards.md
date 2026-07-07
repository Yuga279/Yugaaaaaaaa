---
description: Discover this repository's real conventions and generate docs/CODEBASE_STANDARDS.md
---

You are an experienced Principal Software Architect joining an existing enterprise project.

Your job is NOT to invent coding standards. Your job is to DISCOVER them from this repository.

Create (or update) `docs/CODEBASE_STANDARDS.md`. This document becomes the single source of truth that every future coding task must follow.

## Critical requirements

- **DO NOT GUESS.** DO NOT create new standards. DO NOT follow generic best practices.
- The repository itself is the source of truth. Everything written into CODEBASE_STANDARDS.md must be discovered by reading the existing code.
- If multiple patterns exist, document: the preferred pattern, the legacy pattern, where each is used, and which one new code must follow.
- Never assume.
- If `.claude/prompts/architecture.md` has been generated (via /learn-codebase), use it as a starting map — but verify against the code.

## Phase 1 — Understand the entire repository

Before writing anything, read the repository structure and understand: solution architecture, modules, applications, shared libraries, frontend, backend, infrastructure, tests, scripts, configuration, build system, deployment files.

Read everything that influences coding style: README files, CLAUDE.md, AGENTS.md, CONTRIBUTING.md, `.editorconfig`, `.eslintrc*`, `.prettierrc*`, `Directory.Build.*`, StyleCop/analyzer configs, NuGet configs, package.json, tsconfig, webpack/vite/vue.config, Docker files, CI pipelines, GitHub workflows, build scripts.

## Phase 2 — Learn from git history

Study git history before making conclusions. Inspect `git log`, `git log --stat`, `git blame` on key files, recent commits, major feature commits, bug fixes, refactors, and large PR-style commits.

Determine: how developers organize changes, how features evolve, what files are usually modified together, commit message conventions, branch naming, folder/code/naming evolution. If the same feature changed multiple times, learn WHY. Document recurring patterns.

## Phase 3 — Discover architectural patterns

Understand: folder structure, layering, dependency direction, module boundaries, feature organization, shared code, cross-cutting concerns, dependency injection, configuration, logging, caching, error handling, authorization, authentication, validation, DTO mapping, domain models, repositories, services, factories, utilities, background jobs, messaging, events, state machines, feature flags. Everything.

## Phase 4 — Frontend analysis (if the repo has a frontend)

Read ALL frontend applications. Discover the structure actually in use — for example (adapt to the frameworks present): component hierarchy, page organization, views, layouts, widgets, base components, mixins/composables, stores (Vuex/Pinia/Redux/etc.), state machines (XState), router and navigation, services, API clients, DTOs, interfaces, enums, constants, utilities, filters, plugins, directives, CSS/SCSS, themes, UI libraries (Bootstrap/Vuetify/Tailwind), icons, animations.

Determine naming patterns for: folders, files, components, events, props, emits, stores, actions, mutations, getters, machines, models, interfaces, API clients.

## Phase 5 — Backend analysis (if the repo has a backend)

Read all backend projects. Discover (adapt to the stack present): controllers, services, repositories, contracts, interfaces, DTOs, entities, ORM usage (EF/LINQ or equivalent), validation, exceptions, logging, middleware, extensions, dependency injection, identity, authorization, caching, cloud integrations (blob storage, queues), hosted services, background jobs, configuration, database migrations, SQL conventions, testing patterns. Everything.

## Phase 6 — Naming conventions

Document every naming convention found: projects, namespaces, classes, interfaces, enums, DTOs, entities, services, repositories, controllers, extensions, utilities, files (per language), CSS classes, variables, methods, properties, private fields, constants, readonly fields, async methods, generic types, events, actions, mutations, machine states, routes, API endpoints, database objects, indexes, stored procedures, migration files. EVERYTHING.

## Phase 7 — File organization

Document: where new files belong, when to create new folders, when to reuse existing modules, when NOT to create abstractions, maximum file size if patterns exist, folder hierarchy, feature grouping, how features are split.

## Phase 8 — Code style

Infer from actual code (not from generic style guides): indentation, spacing, blank lines, import/using ordering, region usage, comments, doc comments, formatting idioms per language (LINQ formatting, switch expressions, pattern matching, expression-bodied members, string interpolation, null handling, guard clauses), method/constructor/property/attribute ordering. Everything.

## Phase 9 — Feature implementation patterns

Observe multiple completed features in git history. Identify: files typically added, files modified, order of implementation, backend-first vs frontend-first, testing approach, migration approach, API pattern, store updates, UI updates, state machine updates, localization, permissions, menus, navigation, validation.

## Phase 10 — Document everything

Generate `docs/CODEBASE_STANDARDS.md` following the structure defined in `.claude/prompts/codebase-standards.md` (if this repo has no such file, use the global copy at `~/.claude/prompts/codebase-standards.md`).

Every section must contain examples taken directly from the repository (real file paths, real names, real snippets). Include only sections relevant to technologies actually present in the repo. Preserve any existing sections marked `<!-- manual -->`.

The repository is always the source of truth.
