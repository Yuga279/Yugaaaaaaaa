---
description: Review the current branch/diff against the codebase standards
argument-hint: [base branch, defaults to main]
---

Review the changes on the current branch against ${ARGUMENTS:-main}.

1. Run `git diff --stat` and `git diff` against the base branch to see what changed. If the working tree has uncommitted changes, include them.
2. Read `docs/CODEBASE_STANDARDS.md` — it is the review rubric. Also read `.claude/prompts/architecture.md` for context.
3. Review for, in priority order:
   - **Correctness**: bugs, unhandled edge cases, race conditions, broken error paths
   - **Standards violations**: anything that contradicts docs/CODEBASE_STANDARDS.md (cite the rule)
   - **Security**: injection, authz gaps, secrets in code, unsafe deserialization
   - **Tests**: new behavior without coverage, tests that don't assert anything real
   - **Simplification**: needless abstraction, dead code, duplication of existing utilities
4. For each finding, give: severity (blocker / should-fix / nit), file:line, what's wrong, and a concrete suggested fix.
5. End with a verdict: approve, approve-with-nits, or request-changes — plus a one-paragraph summary.

Only report real findings. Do not pad the review with praise or speculative issues.
