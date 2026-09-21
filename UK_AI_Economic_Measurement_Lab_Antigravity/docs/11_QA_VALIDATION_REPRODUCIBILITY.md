# 11 — QA, Validation and Reproducibility Framework

## 1. Quality model

Use three lenses inspired by the Code of Practice for Statistics: Trustworthiness, Quality and Value. [S10]

### Trustworthiness
- independence clearly stated;
- decisions/change log published;
- corrections visible;
- no hidden manipulation of assumptions.

### Quality
- suitable data and methods;
- source and method limitations documented;
- calculations tested;
- uncertainty communicated.

### Value
- research questions tied to user need;
- outputs accessible and reusable;
- methodology understandable to specialists and non-specialists.

## 2. Data validation

Automated checks:
- schema and types;
- required product codes;
- uniqueness constraints;
- published totals within tolerance;
- missingness categories;
- reference-year consistency;
- source-hash verification.

## 3. Calculation validation

For each method:
- hand-worked fixture;
- boundary cases `share=0`, `share=1`;
- invalid share rejection;
- reconciliation AI + non-AI = broad total;
- deterministic repeatability;
- unit/rounding tests.

## 4. Model validation

Classifier:
- fixed train/validation/test splits by business;
- baseline comparison;
- threshold documented;
- per-label metrics;
- error analysis;
- calibration assessment;
- human-review sample.

## 5. Analytical peer review checklist

A release reviewer must verify:
- question and population;
- source suitability;
- concept alignment;
- formulas;
- assumptions;
- uncertainty;
- interpretation;
- disclosure/privacy;
- reproducibility.

## 6. Reproducibility

A tagged release must include:
- code tag/commit;
- data manifest and hashes;
- environment lock;
- method versions;
- model artefact versions;
- generated validation report;
- known issues.

## 7. Revision policy

If a source is revised:
1. retain previous snapshot;
2. ingest new snapshot;
3. run comparison report;
4. identify affected published outputs;
5. release new product/data version;
6. state material changes publicly.

## 8. Public validation report

Use `templates/validation_report_template.md`. A release should not be promoted on LinkedIn before this report is complete.
