# Architecture and Code

Recommended activation: **Always On or Model Decision**.

- Prefer the repository architecture in `@/docs/09_TECHNICAL_ARCHITECTURE.md`.
- Public calculations must live in tested modules, not only notebooks.
- Use typed schemas at boundaries.
- Pin dependencies and commit lockfiles.
- Keep acquisition, transformation, validation and presentation separable.
- Make commands idempotent where practical.
- Avoid adding infrastructure that does not improve reproducibility, performance or maintainability.
- Architecture changes require an ADR explaining context, decision, alternatives and consequences.
