# 15 — Test Strategy

## Test pyramid

### Unit tests
- formula functions;
- unit conversions;
- source-status labels;
- decision-tree rules;
- classifier preprocessing.

### Data tests
- schemas;
- product-code completeness;
- uniqueness;
- totals and reconciliations;
- missingness semantics;
- vintage consistency.

### Integration tests
- data snapshot to API response;
- API response to chart/table;
- scenario export/import round trip;
- classifier model artefact loading.

### End-to-end tests
- navigate product → disaggregation → method card;
- create and reset scenario;
- download reproducibility record;
- complete SNA decision path;
- keyboard-only core journey.

## Statistical fixtures

Create small fixed datasets with known answers. Include:
- share 0%;
- share 100%;
- 10% of £100 = £10;
- negative or >1 share rejected;
- rounding/reconciliation;
- missing source value blocks calculation.

## Classifier tests

- deterministic preprocessing;
- no training/test business overlap;
- frozen model-version checksum;
- threshold tests;
- empty/very long text handling;
- adversarial marketing phrases (“AI-powered”) as hard negatives.

## Accessibility tests

Automated: axe or equivalent.  
Manual: keyboard, focus order, zoom, screen-reader smoke test, chart table alternatives.

## Release blocker conditions

- provenance missing;
- failed source-total reconciliation;
- prototype output labelled official;
- critical accessibility failure in core flow;
- failing unit/data tests;
- secrets in repository;
- model metrics absent for public classifier.
