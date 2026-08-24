---
description: Implement a change request against an existing feature, reading its history first and logging what was asked, understood, and done
argument-hint: <folder> <change description>
---

A change request for an existing feature. Arguments: $ARGUMENTS

Expect the first argument to be the folder the feature lives in, and the rest to be the change description. If the folder is missing or ambiguous, ask before doing anything else.

## 1. Read the feature's history first

- Look in the target folder for existing history: `CHANGELOG.md`, `README.md`, ADRs, or any other docs already there. Read them in full — they're the record of why the feature looks the way it does.
- Read the actual code in the folder next. Docs go stale; the code is the current truth. Reconcile the two — if they disagree, trust the code and note the discrepancy.
- Read `docs/CODEBASE_STANDARDS.md` and `.claude/prompts/architecture.md` for repo-wide conventions this change must still follow. For a large standards doc, use its table of contents to read only the sections relevant to this feature's area plus Naming Conventions and Anti-patterns Found, rather than the whole document.

## 2. Understand the request

- Restate, in your own words, what currently exists and what the user is asking to change. This restatement is what gets logged — it's how a future reader (including you, later) knows the request was understood correctly, not just executed.
- If the request is ambiguous in a way that changes the design (not just detail), ask before proceeding. Otherwise make reasonable calls and note them in the log.
- Identify what will actually change: which files, which behavior, what stays the same.

## 3. Implement

- Search the folder and repo for similar existing patterns before writing new code; follow the closest one.
- Follow repository conventions exactly — naming, layering, error handling, tests. Never introduce a different style, even a better one.
- Update or add tests using the repo's existing test patterns.
- If a library API is involved, verify its actual shape against the installed version (type defs / lockfile version) rather than assuming it from memory — the repo may pin an older or newer version than what you'd otherwise guess.
- Re-read the diff adversarially before moving on: what input breaks this change specifically, and did you actually exercise the error path, not just the happy path?

## 4. Log the change

Append an entry to `CHANGELOG.md` in the target folder (create it if it doesn't exist yet, with a one-line header naming the feature). Each entry is a dated section with exactly these parts:

```markdown
## YYYY-MM-DD — <short title for this change>

**Requested:** <the user's request, verbatim or lightly trimmed>

**Understood:** <your restatement from step 2 — what exists today and what this change does to it>

**Changed:** <files touched and what changed in each, one line per file>

**Notes:** <ambiguities you resolved on your own, deviations from standards, follow-ups the user should know about — omit if none>
```

Do not overwrite prior entries — this file is an append-only log of the feature's change history.

## 5. Verify and report

- Run the project's tests and linter for the affected area; fix what you broke.
- Re-check the change against `docs/CODEBASE_STANDARDS.md` and note any deviations.
- Summarize for the user: what changed, where the changelog entry lives, and anything they should look at closely before accepting it.

```
- [ ] Read the folder's existing history (CHANGELOG/README/ADRs) and code before changing anything
- [ ] Restated understanding of current behavior + requested change
- [ ] Followed an existing pattern rather than inventing one
- [ ] Verified any library API used against the installed version
- [ ] Ran the adversarial self-review pass
- [ ] Ran tests/linter and the compliance check
- [ ] Appended the CHANGELOG.md entry
```
