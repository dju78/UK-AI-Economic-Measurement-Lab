# 23 — Antigravity Phase 0/1 Execution Specification

## Objective

Create a trustworthy engineering and data foundation plus the first public analytical experience. Phase 0/1 is successful only when published official-source data can be acquired, validated, traced and presented without implying that broad AI-relevant product totals are AI output estimates.

## Work package A — Repository foundation

Deliver:
- application, analytical-service, package, data and test structure;
- dependency management and lock files;
- environment example file without secrets;
- repeatable developer commands;
- CI skeleton;
- ADR folder and first architecture decision if required.

Acceptance evidence:
- clean install/build from repository instructions;
- no secrets committed;
- tests can be invoked from one documented command.

## Work package B — Source manifest and provenance

Create a schema capable of recording:
- source ID;
- publisher;
- publication/dataset title;
- source URL and download URL;
- access timestamp;
- reference period;
- source vintage/version;
- local immutable raw path;
- media/file type;
- SHA-256 hash;
- licence/usage note where relevant;
- transformation lineage;
- statistical status.

Acceptance evidence:
- machine-readable manifest;
- schema validation tests;
- at least one real verified ONS source represented end-to-end.

## Work package C — Official data acquisition

Antigravity must inspect the source register and verify current official URLs with the browser before hard-coding them.

Requirements:
- prefer ONS/GOV.UK primary sources;
- deterministic download command/script;
- immutable raw snapshot;
- SHA-256 hash;
- fail loudly on schema/source changes;
- never silently substitute synthetic values.

If a publication is human-readable but has no suitable machine-readable table, record the gap and seek the linked downloadable source. Do not parse chart pixels or transcribe values manually unless specifically authorised and independently verified.

## Work package D — Transform and validate

Build tidy analytical tables needed for the first explorer.

Minimum fields should cover, where source permits:
- product code and label;
- reference year/period;
- supply/output variables;
- import variables;
- intermediate/final demand variables;
- unit and price basis metadata;
- source ID/vintage;
- transformation version.

Validation should include:
- expected code-set checks;
- uniqueness and key constraints;
- type/range checks;
- missingness report;
- source reconciliation where totals/controls are available;
- duplicate detection;
- snapshot/version consistency.

## Work package E — Home page

The Home page must communicate:
- research question;
- independent prototype status;
- relationship to the published ONS thematic-account research problem;
- what is currently measured versus future experimental work;
- source status legend;
- link to methodology and sources.

No ONS logo or visual treatment implying official ownership.

## Work package F — Supply & Use Explorer

Capabilities:
- browse/filter AI-relevant broad product groups;
- inspect available published supply/demand measures;
- show period, units and source vintage;
- source citation/provenance drawer or card;
- accessible data table alternative to each chart;
- clear warning next to broad totals:

> These published broad product totals contain AI and non-AI activity. They are context for the measurement problem and are not estimates of AI output.

## Work package G — QA and browser verification

Must include:
- unit tests;
- data-schema tests;
- transformation/reconciliation tests;
- build/type/lint checks;
- basic accessibility automation;
- keyboard navigation smoke check;
- browser validation of the main user flow;
- broken-link/source-link check where feasible.

## Phase completion artifacts

Antigravity must generate or update:
- `project-status/STATUS.md`;
- validation report using the repository template;
- source/provenance summary;
- list of commands/tests run and results;
- browser-verification evidence;
- known gaps and risks;
- proposed Phase 2 Implementation Plan, explicitly marked not authorised.

## Stop condition

After the Phase 0/1 report is produced, stop. Do not create disaggregation estimates or classifier work until explicit approval.
