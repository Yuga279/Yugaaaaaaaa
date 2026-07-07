---
description: Diagnose and fix a bug with a reproduction-first workflow
argument-hint: <bug description, error message, or issue reference>
---

Fix the following bug: $ARGUMENTS

Follow this workflow strictly — do not jump to a fix:

1. **Reproduce.** Find or write the smallest way to trigger the bug (ideally a failing test). If you cannot reproduce it, report what you tried and stop — do not fix blind.
2. **Diagnose.** Trace from the symptom to the root cause. State the root cause explicitly in one sentence before changing anything. Beware of fixing a symptom while leaving the cause.
3. **Fix.** Make the smallest change that fixes the root cause, following `docs/CODEBASE_STANDARDS.md`. Before writing the fix, look at how similar code in this repo handles the same concern and match it. No drive-by refactoring in the same change.
4. **Verify.** The reproduction from step 1 must now pass. Run the surrounding test suite to check for regressions.
5. **Harden.** Add a regression test that would have caught this bug, if step 1 didn't already create one.

Report: root cause, the fix, how it was verified, and any related risks you noticed but did not touch.
