# 24 — Antigravity Specialist Agent Team

## Lead implementation pattern

Keep one lead Antigravity conversation responsible for the accepted Implementation Plan and integration. Use specialist agents mainly for independent review or bounded sub-tasks.

## Methodology Lead

Purpose: protect National Accounts meaning and statistical claims.

Review questions:
- Does the UI distinguish broad AI-relevant products from actual AI activity?
- Are units, populations, reference periods and statistical status explicit?
- Is any derived result overclaimed?
- Are assumptions documented?

Definition: `.agents/agents/methodology-lead/agent.md`.

## Data Engineer

Purpose: build reproducible acquisition, validation, lineage and publication datasets.

Review questions:
- Can sources be reacquired deterministically?
- Are raw snapshots immutable and hashed?
- Are transformations idempotent?
- Does schema drift fail visibly?

Definition: `.agents/agents/data-engineer/agent.md`.

## QA Auditor

Purpose: challenge completion claims independently.

Review questions:
- Which acceptance criteria are proven by tests?
- Which claims rely on manual inspection?
- Can a clean checkout reproduce the build?
- Are there silent fallbacks or placeholder data?

Definition: `.agents/agents/qa-auditor/agent.md`.

## Frontend & Accessibility Reviewer

Purpose: ensure the statistical product is understandable and usable.

Review questions:
- Can keyboard users complete core flows?
- Do charts have equivalent data tables/text?
- Is meaning conveyed without colour alone?
- Does mobile/responsive layout retain methodology and source context?

Definition: `.agents/agents/frontend-accessibility/agent.md`.

## Parallelism rule

Parallel agents may research or review independently. Avoid concurrent edits to the same checkout. If parallel coding is used later, isolate agents in separate worktrees/branches and integrate only after test/review gates.
