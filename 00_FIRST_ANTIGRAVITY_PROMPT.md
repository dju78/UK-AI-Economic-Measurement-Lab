# First prompt to paste into Google Antigravity

Use **Planning Mode** for this conversation.

You are the lead engineer-statistician for the **UK AI Economic Measurement Lab**, an independent research prototype. Do not write code immediately.

First inspect the repository. Read, in this order:

1. `START_ANTIGRAVITY_HERE.md`
2. `AGENTS.md`
3. the files in `.agents/rules/`
4. `README_FIRST.md`
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

Then inspect the current filesystem, Git state and available tooling.

Your task in this turn is **planning only**. Produce an Antigravity **Implementation Plan artifact** for **Phase 0 and Phase 1 only**.

The plan must include:
- current repository state;
- proposed file/folder changes;
- exact application and analytical architecture;
- dependency choices and reasons;
- official-source acquisition strategy;
- provenance/hash design;
- data schema and transformation steps;
- validation/reconciliation checks;
- Home and Supply & Use Explorer implementation;
- test matrix;
- browser verification plan;
- accessibility checks;
- risks/data gaps;
- commands you expect to run;
- exact completion artifacts;
- explicit stop gate before Phase 2.

Before proposing any hard-coded ONS download URL, use browser research to confirm the current official source and record the publication/dataset title, URL and access date. Prefer ONS/GOV.UK primary sources.

Non-negotiable constraints:
- do not invent data;
- do not create an AI-GDP estimate;
- do not perform AI/non-AI disaggregation yet;
- do not build the company classifier yet;
- do not build the SNA decision engine yet;
- do not use the ONS logo or imply ONS endorsement;
- broad AI-relevant CPA totals must be labelled as containing AI and non-AI activity and must never be presented as AI output;
- raw acquired files must be immutable and SHA-256 hashed;
- public numerical outputs need source, period, unit, vintage and statistical-status metadata;
- the first implementation must be reproducible from a clean checkout.

Do not execute the plan until I review the Implementation Plan artifact and explicitly click/provide Proceed.
