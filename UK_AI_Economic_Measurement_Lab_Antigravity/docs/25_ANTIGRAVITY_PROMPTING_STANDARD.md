# 25 — Antigravity Prompting Standard

## Prompt anatomy

For important work, every prompt should specify:

1. **Goal** — the outcome, not vague activity.
2. **Authorised scope** — exact phase/work package.
3. **Required context** — repository files/rules to read.
4. **Source constraints** — authoritative sources and no invented data.
5. **Engineering constraints** — stack, architecture and file boundaries.
6. **Statistical constraints** — permitted claims and labels.
7. **Verification** — tests, browser checks and reconciliations.
8. **Artifacts** — what Antigravity must produce for review.
9. **Stop condition** — where the agent must pause.

## Good prompt style

Use verbs Antigravity can verify: inspect, plan, implement, validate, reconcile, test, render, browse, record, report.

Avoid:
- “make it amazing”;
- “build everything”;
- “use your best judgement” without boundaries;
- “finish the entire product in one go”.

## Required planning instruction

For new phases use a Planning Mode conversation and explicitly request an Implementation Plan before code changes. The plan must name files, data sources, tests, risks and evidence.

## Required completion instruction

Never accept “done” by assertion. Ask Antigravity to show:
- tests run;
- reconciliation results;
- browser verification;
- files changed;
- known limitations;
- source vintage and hashes;
- next-step proposal.
