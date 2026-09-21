---
name: release-gate
description: Performs the mandatory end-of-phase evidence and stop gate. Use before claiming a project phase is complete or asking to proceed to the next phase.
---
# Release Gate Skill

Read `@/docs/19_DEFINITION_OF_DONE.md` and the current phase execution spec.

## Gate procedure
1. Run the full relevant test suite.
2. Run data/statistical validations and reconciliations.
3. Run build/type/lint checks.
4. Browser-verify core flows and source links.
5. Check independence/experimental-status language.
6. Update `project-status/STATUS.md`.
7. Produce/update validation report.
8. List exact source vintages/hashes.
9. List open risks/gaps.
10. State whether the phase is ready for human review.

## Mandatory stop
Do not implement the next phase. A next-phase plan may be drafted only if clearly marked not authorised.
