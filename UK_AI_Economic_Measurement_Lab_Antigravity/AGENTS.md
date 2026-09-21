# AGENTS.md — Google Antigravity Project Contract

Project: **UK AI Economic Measurement Lab**  
Owner: **Daramola Omoyele**  
Build environment: **Google Antigravity**  
Version: **0.2.0-antigravity-planning**

> This is an independent research and software prototype. It is not an Office for National Statistics (ONS) product and must not imply ONS endorsement. Published source values and prototype estimates must be clearly separated.

## Prime directive

Build a **credible statistical research product**, not a decorative dashboard. Every displayed number must have provenance. Every derived/modelled number must expose method, assumptions, version and limitations.

## Antigravity execution contract

1. Start complex work in **Planning Mode**.
2. Inspect the repository before editing.
3. Produce an Implementation Plan artifact for every phase or major architecture change.
4. Do not expand scope beyond the currently authorised phase.
5. Use the workspace Rules and relevant Skills in `.agents/`.
6. Prefer official primary sources and verify them with the browser where needed.
7. Run tests and browser verification before claiming completion.
8. Produce artifacts/evidence at the end of each phase and stop at the release gate.
9. Do not silently resolve statistical ambiguity. Record it as an assumption, decision or gap.
10. Do not continue to the next phase without explicit human approval.

## Statistical non-negotiables

- Never invent source data.
- Never label broad CPA totals as AI output.
- Never label an experimental decomposition as an official statistic.
- Keep raw source snapshots immutable and hash them.
- Separate raw, transformed, derived and prototype/modelled data layers.
- Record source title, publisher, URL, access date, reference period, vintage/version and SHA-256 where files are acquired.
- Human review is mandatory for AI business-classification labels used as evaluation truth.
- Show uncertainty/sensitivity when modelled estimates are later introduced.
- Preserve reproducibility: public analytical results must come from tested code, not ad hoc notebook cells.

## Required UI statistical statuses

1. **Published official-statistics source**
2. **Published research/context source**
3. **Prototype estimate / scenario**

Every data card/chart/table must expose the relevant status.

## Architecture baseline

- Frontend: Next.js + React + TypeScript.
- Analytical layer: Python.
- Analytical storage: DuckDB + Parquet.
- Validation: Pandera or equivalent + pytest.
- CI: GitHub Actions.
- Public deployment later: Vercel plus a suitable Python service, or a simpler documented alternative.

Architecture changes require an ADR and must not be made merely because a framework is fashionable.

## Phase 0/1 scope

Allowed:
- repository scaffold;
- source manifest/provenance model;
- ONS official-source acquisition and hashing;
- transformation and validation of AI-relevant broad product data;
- Home page;
- Supply & Use Explorer;
- source/vintage/status UI;
- tests, accessibility checks and browser verification.

Not allowed yet:
- AI-GDP estimate;
- AI/non-AI disaggregation estimate;
- business classifier;
- SNA decision engine;
- unsupported scraped datasets;
- speculative numbers.

## Definition of a valid completion claim

Before saying a phase is complete, provide evidence that answers:

- What source was used?
- What exact file/endpoint and vintage was acquired?
- Was the raw source hashed and preserved?
- Which transformations were applied?
- Which validations reconcile with the source?
- Which tests passed?
- Was the UI verified in a browser?
- Are limitations visible in-product?
- Can another developer reproduce the result from a clean checkout?
