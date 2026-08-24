---
description: Diagnose and fix a bug with a reproduction-first workflow
argument-hint: <bug description, error message, or issue reference>
---

Fix the following bug: $ARGUMENTS

Follow this workflow strictly — do not jump to a fix:

1. **Reproduce.** Find or write the smallest way to trigger the bug (ideally a failing test). If you cannot reproduce it, report what you tried and stop — do not fix blind.
2. **Diagnose.** Trace from the symptom to the root cause. State the root cause explicitly in one sentence before changing anything. Beware of fixing a symptom while leaving the cause.
3. **Fix.** Make the smallest change that fixes the root cause, following `docs/CODEBASE_STANDARDS.md` — for a large standards doc, use its table of contents and read the sections relevant to the area you're touching plus Naming Conventions and Anti-patterns Found, rather than the whole document. Before writing the fix, look at how similar code in this repo handles the same concern and match it. No drive-by refactoring in the same change. If the fix touches a library API, verify its actual shape against the installed version (type defs / installed `package.json` version) rather than assuming it from memory.
4. **Verify.** The reproduction from step 1 must now pass. Run the surrounding test suite to check for regressions.
5. **Harden.** Add a regression test that would have caught this bug, if step 1 didn't already create one.

Report: root cause, the fix, how it was verified, and any related risks you noticed but did not touch.

```
- [ ] Reproduced before diagnosing
- [ ] Root cause stated before changing code
- [ ] Matched an existing pattern for the fix
- [ ] Verified any library API used against the installed version
- [ ] Reproduction case now passes; surrounding suite checked for regressions
- [ ] Regression test added
```
