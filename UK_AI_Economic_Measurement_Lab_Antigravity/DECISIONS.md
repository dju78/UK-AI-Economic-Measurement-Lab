# Decision Log (ADR) — UK AI Economic Measurement Lab

This document records architectural, methodology, and statistical decisions made during the autonomous build.

---

## ADR-001: Separation of Published CPA Totals from Modelled Estimates
- **Context:** ONS identified 23 broad CPA product categories in the AI thematic account roadmap that contain both AI and non-AI products.
- **Decision:** Broad totals must never be labelled as "AI output". A visual three-tier provenance badge system is enforced:
  1. `Published official-statistics source` (Emerald)
  2. `Published research/context source` (Sky blue)
  3. `Illustrative experimental estimate` (Amber)
- **Consequences:** Eliminates misinterpretation risk and maintains statistical integrity.

## ADR-002: Dual Baseline for Business Classifier
- **Context:** Automated population identification requires explainability and resilience against terminology drift.
- **Decision:** Implement both a transparent Rule-based regex matcher and a statistical TF-IDF + Calibrated Logistic Regression model with feature explainability and human expert review workflow (`unreviewed` → `accepted`/`rejected`/`amended` → `adjudicated`).
- **Consequences:** Transparent error analysis on false positives without relying on unvalidated black-box predictions.

## ADR-003: Pure Isomorphic Analytical Architecture
- **Context:** Analytical formulas need to execute both locally in Next.js web client for instant interactive sensitivity recalculation and in Python test runners for rigorous automated validation.
- **Decision:** Statistical modules are implemented in `packages/methods` with strict TypeScript types in `packages/schemas` and tested against Python statistical test suites with parity.
- **Consequences:** Sub-second client scenario responsiveness with zero external server dependencies while preserving full test reproducibility.

## ADR-004: Immutable Raw Snapshots & SHA-256 Checksum Manifest
- **Context:** Source preservation requires that acquired official data tables cannot be silently modified or overwritten.
- **Decision:** All raw source datasets are stored in `data/raw/` with cryptographic SHA-256 checksums recorded in `data/manifest.json`.
- **Consequences:** Full auditability and verifiable data lineage.
