# Codebase Standards — Document Structure

This prompt defines the required structure for `docs/CODEBASE_STANDARDS.md`.
It is consumed by the `/write-standards` command; it is not the standards document itself.

## Required sections

Include every section below that applies to this repository. Add per-technology
sections matching the stack actually present (e.g. "Vue Standards", "C# Standards",
"SQL Standards" for a Vue + .NET + SQL repo; substitute for other stacks). Omit
sections for technologies the repo does not use.

1. **Repository Overview** — what this system is, applications/modules it contains
2. **Required Tech Stack** — the stack new code MUST use, not just what's currently present: mandatory frameworks/libraries per layer (frontend, backend, data), and anything explicitly banned. Distinguish this from things merely *observed* in old code — source it from `package.json`/lockfile, `.eslintrc*` rules that ban alternatives, CI checks, README/CONTRIBUTING requirements, and dependency count (one experimental import doesn't make something mandatory; near-universal use across features does)
3. **Architecture** — layers, dependency direction, module boundaries
4. **Folder Structure** — annotated tree; where new code goes
5. **Backend Standards** — patterns for the server-side stack in use
6. **Frontend Standards** — patterns for the client-side stack in use, explicitly covering: component file/folder structure (co-located styles/tests? atomic/feature-based?), the styling approach in use (CSS Modules, Tailwind, styled-components, SCSS, plain CSS, CSS-in-JS) and why, any design-token/theme system, and the UI/component library in use (or "none — hand-rolled components")
7. **Per-language Standards** — one section per language (e.g. TypeScript, C#, SQL)
8. **Git Standards** — workflow, PR size expectations
9. **Commit Message Standards** — format discovered from git log, with real examples
10. **Branch Naming** — patterns discovered from git history
11. **Naming Conventions** — classes, interfaces, methods, variables, constants, files, routes, API endpoints, database objects — everything, with real examples
12. **File Naming** and **Folder Naming**
13. **Import Rules** — ordering, aliases, allowed directions
14. **Dependency Rules** — how to decide on new dependencies; preferred libraries; anything banned and why
15. **Error Handling** — how errors are raised, wrapped, surfaced
16. **Logging** — what gets logged, levels, context; what must never be logged (secrets, PII)
17. **Validation** — where and how input is validated
18. **API Patterns** — endpoint shape, versioning, request/response formats, pagination, error responses
19. **State Management** — stores, actions, mutations/reducers, conventions
20. **State Machines** — if used: naming, structure, where they live
21. **Testing** — frameworks, placement, naming, what must be tested, how to run
22. **Performance** — patterns the repo relies on (caching, lazy loading, query patterns)
23. **Security** — authn/authz patterns, secrets handling, known rules
24. **Code Review Checklist** — what reviewers block on, derived from the standards above
25. **Feature Development Checklist** — files typically added/modified and in what order, from observed feature commits
26. **Anti-patterns Found** — things present in the repo that new code must NOT copy
27. **Legacy Patterns** — old conventions still present, where they live, and that they must not be extended
28. **Preferred Patterns** — when preferred and legacy coexist, which one wins and why
29. **Examples from Repository** — real snippets with file paths illustrating the most important rules

## Formatting rules

- Every rule must be discovered from the repository, never invented. Cite real file paths.
- Every section must contain examples taken directly from the repository.
- Where the codebase is inconsistent, name the preferred pattern, the legacy pattern, where each is used, and which one new code must follow.
- Every rule gets a one-line "why" where the reason isn't obvious.
- Mark any hand-written sections with `<!-- manual -->` so regeneration preserves them.

## Token budget: this document gets read on almost every coding task

Other commands (`/implement`, `/bugfix`, `/review`, `/change-request`) read this file on
every invocation, and are instructed to read only the sections relevant to the task at
hand rather than the whole document once it's grown large — see "Selective reading" in
each of those commands. That only works if the document is structured to make selective
reading possible:

- Start the file with a **table of contents** — one line per section, linking to its
  heading — so a consuming command can decide what's relevant without reading the body.
- Say a thing once. Do not repeat a convention across multiple sections; put it in the
  one section it belongs to and cross-reference by heading name if another section needs
  to mention it.
- Prefer one real snippet with a file path over a paragraph of prose describing the same
  rule — it's shorter and it's the actual evidence.
- Do not pad sections that don't apply to this repo — omit them (see "Required sections"
  above), don't write "N/A" filler.
