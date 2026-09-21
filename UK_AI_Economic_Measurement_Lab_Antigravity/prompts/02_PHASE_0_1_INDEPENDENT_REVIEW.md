# Independent review prompt for a fresh Antigravity conversation/agent

Act as an independent statistical-software QA reviewer. Do not modify production code initially.

Read `AGENTS.md`, `docs/23_ANTIGRAVITY_PHASE_0_1_EXECUTION_SPEC.md`, `docs/19_DEFINITION_OF_DONE.md`, the latest validation report, and `project-status/STATUS.md`.

Audit the implemented Phase 0/1 against the repository contract. Verify rather than trust completion claims.

Check:
- official source provenance and current source links;
- raw snapshot immutability and SHA-256 hashes;
- source schema/code validation;
- transformation reproducibility;
- reconciliation to published source controls where possible;
- absence of invented/placeholder production data;
- statistical labels and warning language;
- Home and Supply & Use Explorer behaviour;
- accessibility basics and keyboard use;
- chart/table equivalence;
- type/lint/build/test status;
- clean-checkout reproducibility instructions;
- no ONS branding/endorsement implication;
- no premature AI-output or AI-GDP claim.

Use terminal and browser verification as needed. Produce a review artifact with:
- PASS/FAIL for each acceptance area;
- evidence;
- defects ranked by severity;
- exact remediation needed;
- a final gate status: `READY FOR HUMAN PHASE REVIEW` or `NOT READY`.

Do not proceed to Phase 2.
