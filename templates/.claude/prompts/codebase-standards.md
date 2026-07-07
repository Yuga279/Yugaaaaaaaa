# Codebase Standards — Document Structure

This prompt defines the required structure for `docs/CODEBASE_STANDARDS.md`.
It is consumed by the `/write-standards` command; it is not the standards document itself.

## Required sections

Include every section below that applies to this repository. Add per-technology
sections matching the stack actually present (e.g. "Vue Standards", "C# Standards",
"SQL Standards" for a Vue + .NET + SQL repo; substitute for other stacks). Omit
sections for technologies the repo does not use.

1. **Repository Overview** — what this system is, applications/modules it contains
2. **Architecture** — layers, dependency direction, module boundaries
3. **Folder Structure** — annotated tree; where new code goes
4. **Backend Standards** — patterns for the server-side stack in use
5. **Frontend Standards** — patterns for the client-side stack in use
6. **Per-language Standards** — one section per language (e.g. TypeScript, C#, SQL)
7. **Git Standards** — workflow, PR size expectations
8. **Commit Message Standards** — format discovered from git log, with real examples
9. **Branch Naming** — patterns discovered from git history
10. **Naming Conventions** — classes, interfaces, methods, variables, constants, files, routes, API endpoints, database objects — everything, with real examples
11. **File Naming** and **Folder Naming**
12. **Import Rules** — ordering, aliases, allowed directions
13. **Dependency Rules** — how to decide on new dependencies; preferred libraries; anything banned and why
14. **Error Handling** — how errors are raised, wrapped, surfaced
15. **Logging** — what gets logged, levels, context; what must never be logged (secrets, PII)
16. **Validation** — where and how input is validated
17. **API Patterns** — endpoint shape, versioning, request/response formats, pagination, error responses
18. **State Management** — stores, actions, mutations/reducers, conventions
19. **State Machines** — if used: naming, structure, where they live
20. **Testing** — frameworks, placement, naming, what must be tested, how to run
21. **Performance** — patterns the repo relies on (caching, lazy loading, query patterns)
22. **Security** — authn/authz patterns, secrets handling, known rules
23. **Code Review Checklist** — what reviewers block on, derived from the standards above
24. **Feature Development Checklist** — files typically added/modified and in what order, from observed feature commits
25. **Anti-patterns Found** — things present in the repo that new code must NOT copy
26. **Legacy Patterns** — old conventions still present, where they live, and that they must not be extended
27. **Preferred Patterns** — when preferred and legacy coexist, which one wins and why
28. **Examples from Repository** — real snippets with file paths illustrating the most important rules

## Formatting rules

- Every rule must be discovered from the repository, never invented. Cite real file paths.
- Every section must contain examples taken directly from the repository.
- Where the codebase is inconsistent, name the preferred pattern, the legacy pattern, where each is used, and which one new code must follow.
- Every rule gets a one-line "why" where the reason isn't obvious.
- Mark any hand-written sections with `<!-- manual -->` so regeneration preserves them.
