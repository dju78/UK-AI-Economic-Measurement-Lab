# UK AI Economic Measurement Lab — Google Antigravity Build Package

**Owner:** Daramola Omoyele  
**Build environment:** Google Antigravity 2.0 / Antigravity IDE  
**Version:** 0.2.0-antigravity-planning  
**Planning baseline:** 21 September 2026

> **Status and independence.** This project is an independent research and software prototype. It is not an Office for National Statistics (ONS) product, is not endorsed by ONS, and must not present experimental outputs as official statistics. Published ONS values must be labelled as source data; prototype outputs must be labelled as illustrative/experimental and show assumptions and uncertainty.

## Purpose of this repository

This repository is both the product specification and the operating context for Google Antigravity. It is intentionally structured so Antigravity can use persistent Rules, task-specific Skills, specialist agents, implementation-plan artifacts, browser verification and explicit phase gates.

The product explores a methodological problem: moving from evidence that businesses use AI toward transparent economic measurement of AI production, investment, trade and use within a National Accounts framework.

## Antigravity operating principle

Use **explore → plan → review → execute → verify → stop at gate**.

Do not ask the agent to implement the entire product in one conversation. Each phase must produce evidence and pass its acceptance gate before scope expands.

## Mandatory reading order

1. `START_ANTIGRAVITY_HERE.md`
2. `AGENTS.md`
3. `.agents/rules/00-project-contract.md`
4. `.agents/rules/10-statistical-integrity.md`
5. `docs/00_MASTER_CHARTER.md`
6. `docs/01_PRODUCT_REQUIREMENTS_DOCUMENT.md`
7. `docs/02_STATISTICAL_MEASUREMENT_FRAMEWORK.md`
8. `docs/04_DATA_SOURCE_REGISTER.md`
9. `docs/05_DATA_MODEL.md`
10. `docs/09_TECHNICAL_ARCHITECTURE.md`
11. `docs/11_QA_VALIDATION_REPRODUCIBILITY.md`
12. `docs/15_TEST_STRATEGY.md`
13. `docs/19_DEFINITION_OF_DONE.md`
14. `docs/22_ANTIGRAVITY_OPERATING_MODEL.md`
15. `docs/23_ANTIGRAVITY_PHASE_0_1_EXECUTION_SPEC.md`

## Antigravity-native assets

- `.agents/rules/` — persistent constraints.
- `.agents/skills/phase-01-foundation/` — controlled Phase 0/1 execution.
- `.agents/skills/source-provenance/` — official-source acquisition and lineage.
- `.agents/skills/statistical-validation/` — statistical QA.
- `.agents/skills/ui-accessibility/` — accessible presentation and browser verification.
- `.agents/skills/release-gate/` — stop/go validation procedure.
- `.agents/agents/` — optional specialist agents.
- `prompts/` — the exact prompts to use in Antigravity.

## Product modules

- AI Production Stack Explorer
- Supply & Use Explorer
- AI/Non-AI Disaggregation Lab
- AI Business Classification Lab
- SNA Decision Engine
- Measurement Gaps & Uncertainty Centre
- Methodology, Sources, QA & Reproducibility Centre

## Phase 0/1 MVP

The first authorised build ends after a verified Home page and Supply & Use Explorer backed by a reproducible, provenance-rich official-source pipeline. It must not estimate AI output or AI GDP.

## Public positioning

Recommended description:

> Independent methodology prototype exploring the measurement of AI activity in the UK economy using published official-statistics data and transparent experimental methods.

Do not use the ONS logo or create visual branding that could imply ONS ownership or endorsement.
