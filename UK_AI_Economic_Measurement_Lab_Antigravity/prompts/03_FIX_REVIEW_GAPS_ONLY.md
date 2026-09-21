# Fix-only prompt after independent review

Read the latest independent Phase 0/1 review artifact/report.

Create a short remediation plan covering **only** failed or incomplete Phase 0/1 acceptance criteria. Do not add features and do not begin Phase 2.

After I approve the remediation plan:
- fix each identified defect;
- add regression tests for every defect that can be automated;
- rerun the full Phase 0/1 validation suite;
- browser-verify affected flows;
- update the validation report and `project-status/STATUS.md`;
- state which review findings are closed and which remain open.

Stop when Phase 0/1 evidence is refreshed.
