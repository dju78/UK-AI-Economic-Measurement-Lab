# 22 — Google Antigravity Operating Model

## 1. Purpose

This document defines how Google Antigravity must be used to build the UK AI Economic Measurement Lab. It converts the product plan into an agent-operating model designed for controlled, auditable delivery.

## 2. Delivery pattern

For every major task use:

`Explore → Plan → Human review → Execute → Test → Browser verify → Report → Stop gate`

Antigravity's Implementation Plan artifact is part of the governance process, not optional paperwork. A plan should identify files, dependencies, data sources, calculations, tests, risks and acceptance evidence before implementation begins.

## 3. Project boundary

Open only the repository root as the Antigravity Project for Phase 0/1. Keep non-workspace access disabled. This prevents unrelated personal files from becoming accidental context.

## 4. Execution mode

Use Planning Mode for:
- scaffolding;
- architecture changes;
- data pipelines;
- statistical calculations;
- multi-file features;
- release preparation.

Fast/direct execution may be used only for small, obvious corrections after a plan is already accepted (for example a typo or a narrowly scoped style fix).

## 5. Rules

Workspace rules live in `.agents/rules/`. Recommended activation:

- `00-project-contract.md` — Always On.
- `10-statistical-integrity.md` — Always On.
- `20-architecture-and-code.md` — Always On or Model Decision.
- `30-testing-and-verification.md` — Always On.
- `40-ui-accessibility.md` — Model Decision / frontend glob if configured.

If Antigravity's UI requires activation settings, configure them at project level rather than copying the rules to a global account.

## 6. Skills

Skills live in `.agents/skills/`. They are deliberately task-specific and should be invoked automatically or manually by slash command when useful:

- `/phase-01-foundation`
- `/source-provenance`
- `/statistical-validation`
- `/ui-accessibility`
- `/release-gate`

Do not collapse them into one giant skill. Progressive context keeps the agent focused.

## 7. Specialist agents

The repository contains optional specialist definitions under `.agents/agents/`:

- methodology-lead;
- data-engineer;
- qa-auditor;
- frontend-accessibility.

For Phase 0/1, one lead conversation should own implementation. Specialist agents may review in parallel, but parallel agents must not make conflicting edits to the same working tree. If multiple agents will edit, use isolated worktrees/branches and reconcile through review.

## 8. Artifact requirements

At minimum, require these Antigravity artifacts/milestones:

### Before coding
- repository inspection summary;
- Implementation Plan.

### After data ingestion
- source/provenance manifest sample;
- data-validation report;
- reconciliation evidence.

### After UI implementation
- browser screenshots/recording for core flows;
- accessibility findings;
- responsive-layout verification.

### End of phase
- completion report;
- test evidence;
- known-gap register;
- proposed next-phase plan (not executed).

## 9. Browser-agent policy

The browser agent may be used to:
- verify official source pages and downloads;
- inspect publication metadata;
- test the local/public UI;
- verify links and responsive behaviour.

For core statistical inputs, prefer ONS/GOV.UK or another authoritative primary publisher. Do not replace a missing official source with an arbitrary web article.

## 10. Permission posture

For first build:
- keep project scope narrow;
- do not give full-machine access;
- use sandboxed execution where available;
- review commands that install system-wide software or touch paths outside the repo;
- never store credentials in repository files.

## 11. Context management

Antigravity should not rely on chat memory as the source of truth. Decisions must be written back into repository documents, ADRs, validation reports or status files. The repository should remain sufficient for a fresh agent conversation to recover the project state.

## 12. Handoff rule

At the end of every Antigravity session that materially changes the project, update `project-status/STATUS.md` with:
- phase;
- completed items;
- test state;
- source vintage;
- open risks;
- next authorised action.
