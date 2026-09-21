# UK AI Economic Measurement Lab — Google Antigravity Start Here

**Build environment:** Google Antigravity 2.0 / Antigravity IDE  
**Project status:** Planning baseline; Phase 0/1 not yet implemented  
**Product status:** Independent research prototype; not an ONS product

## 1. Open this folder as one Antigravity Project

Use the repository root as the primary project folder. Keep Antigravity's access scoped to this project. For the first build, do not add unrelated folders to the Project.

Recommended first-run settings on Windows:

- Terminal command execution: **Proceed in Sandbox** if available; otherwise **Request Review**.
- Non-workspace file access: **Off**.
- Artifact/plan review: use **Planning Mode** and review the Implementation Plan before execution.
- Do not use unrestricted/full-machine access for this project.

## 2. Antigravity-native project controls

This repository contains Antigravity-specific controls:

- `.agents/rules/` — persistent project constraints.
- `.agents/skills/` — reusable build and validation procedures.
- `.agents/agents/` — specialist agents for methodology, data engineering, QA and accessibility.
- `prompts/` — prompts intended to be pasted into Antigravity.

The files under `/docs` remain the product contract.

## 3. First action in Antigravity

Do **not** ask Antigravity to "build the whole app".

Start a fresh Project conversation in **Planning Mode** and paste the contents of:

`prompts/00_FIRST_ANTIGRAVITY_PROMPT.md`

The first agent must inspect the repository and produce an Implementation Plan artifact. Review it before clicking Proceed.

## 4. Allowed initial scope

Only **Phase 0 and Phase 1** are authorised:

1. Repository and engineering foundation.
2. Source manifest and provenance model.
3. Reproducible ingestion of verified published ONS source data.
4. Raw-file hashing and immutable source snapshots.
5. Tidy transformed dataset for AI-relevant broad product groups.
6. Automated source/data validation.
7. Home page.
8. Supply & Use Explorer.
9. Source/vintage/statistical-status components.
10. Unit, data and basic accessibility tests.
11. Completion and validation artifacts.

**Forbidden in Phase 0/1:** AI-GDP estimates, disaggregation estimates, company classifier, SNA decision engine, invented data, or claims of ONS endorsement.

## 5. Mandatory stop gate

At the end of Phase 0/1, Antigravity must stop and create:

- implementation summary;
- validation report;
- source/provenance report;
- test results;
- screenshots/browser verification evidence;
- known gaps and risks;
- proposed Phase 2 plan, marked **not yet authorised**.

Do not continue until the human reviewer explicitly approves the gate.

## 6. Reading order

1. `AGENTS.md`
2. `README_FIRST.md`
3. `docs/00_MASTER_CHARTER.md`
4. `docs/01_PRODUCT_REQUIREMENTS_DOCUMENT.md`
5. `docs/02_STATISTICAL_MEASUREMENT_FRAMEWORK.md`
6. `docs/04_DATA_SOURCE_REGISTER.md`
7. `docs/05_DATA_MODEL.md`
8. `docs/09_TECHNICAL_ARCHITECTURE.md`
9. `docs/11_QA_VALIDATION_REPRODUCIBILITY.md`
10. `docs/15_TEST_STRATEGY.md`
11. `docs/19_DEFINITION_OF_DONE.md`
12. `docs/22_ANTIGRAVITY_OPERATING_MODEL.md`
13. `docs/23_ANTIGRAVITY_PHASE_0_1_EXECUTION_SPEC.md`

## 7. Core question

> How can AI activity be identified, classified and separated from non-AI activity so that production, investment, trade and use can be examined transparently within a UK National Accounts framework?

The software exists to investigate that question. It is not a decorative dashboard.
