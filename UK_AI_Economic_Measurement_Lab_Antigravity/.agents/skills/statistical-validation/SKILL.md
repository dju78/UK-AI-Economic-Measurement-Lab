---
name: statistical-validation
description: Validates official-source transformations and statistical outputs for the UK AI Economic Measurement Lab. Use when creating analytical datasets, calculations, reconciliations or release evidence.
---
# Statistical Validation Skill

## Minimum checks
- schema/types;
- expected code sets;
- unique keys;
- duplicates;
- missingness and source-specific missing-value semantics;
- units/price basis;
- reference period/vintage consistency;
- range/sign checks where conceptually valid;
- reconciliation to published controls/totals where possible;
- deterministic rerun/snapshot consistency.

## Claim discipline
A passed software test does not by itself validate statistical meaning. Check concept, population, period and unit.

## Reporting
Write actual validation results into the phase validation report. Include failures and unresolved warnings; do not report only successes.
