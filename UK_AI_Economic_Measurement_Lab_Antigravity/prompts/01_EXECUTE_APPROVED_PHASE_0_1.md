# Prompt after the Antigravity Implementation Plan is approved

Proceed with the approved **Phase 0/1 Implementation Plan only**.

Use the relevant workspace skills, especially:
- `phase-01-foundation`;
- `source-provenance`;
- `statistical-validation`;
- `ui-accessibility`;
- `release-gate`.

Implement incrementally. After each meaningful work package, run the relevant tests rather than deferring all verification to the end.

Source requirements:
- use verified official primary sources;
- preserve immutable raw snapshots;
- calculate and store SHA-256 hashes;
- record source title, publisher, URL, access date, reference period and vintage;
- fail visibly if expected schema/codes change;
- do not silently substitute fixtures for missing public data.

UI requirements:
- every numerical view shows source/period/unit/vintage/status;
- every chart has an accessible table or equivalent;
- the Supply & Use Explorer prominently states that broad product totals contain AI and non-AI activity and are not AI estimates;
- do not imitate ONS branding.

Before claiming completion:
1. run unit, data, integration and relevant frontend tests;
2. run type/lint/build checks;
3. use the browser to verify the Home and Supply & Use Explorer flows at desktop and a narrow/mobile viewport;
4. verify source links;
5. update `project-status/STATUS.md`;
6. create the Phase 0/1 validation report using the repository template;
7. report exact source vintages/hashes and reconciliation results;
8. list all known gaps and limitations.

Then **stop**. You may draft a proposed Phase 2 plan, but do not implement Phase 2.
