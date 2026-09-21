# Changelog — UK AI Economic Measurement Lab

All notable changes to this project are documented in this file in accordance with Keep a Changelog.

---

## [0.2.0] — 2026-09-21

### Added
- **AI Production Stack Explorer (`/stack`):** Interactive 8-layer conceptual map from infrastructure to applications with National Accounts boundaries and trade flow notes.
- **Supply & Use Explorer (`/supply-use`):** Complete matrix of the 23 ONS AI-relevant CPA product groups (2020–2023) with domestic output, imports, intermediate consumption, GFCF, and exports.
- **AI/Non-AI Disaggregation Lab (`/disaggregation`):** Four disaggregation engines (Direct, Proportional, Modelled, Hybrid) with parameter sliders, tornado sensitivity charts, 4-dimension quality scoring, and JSON/CSV scenario exports.
- **AI Business Classification Lab (`/classifier`):** Multi-label classifier (13 ONS Table 3 categories) with dual rule-based and TF-IDF logistic baselines, feature explainability, confusion matrix evaluation dashboard, and interactive human review workflow.
- **SNA Decision Engine (`/sna-decision`):** Deterministic National Accounts decision tree with 6 pre-loaded UK corporate case studies and double-entry ledger impact analysis.
- **AI Adoption Context (`/adoption`):** ONS BICS 2023–2026 survey visualization and pedagogical "Adoption $\neq$ Value" guidance.
- **Measurement Gaps & Agenda (`/gaps`):** Structured register of the 6 core ONS measurement challenges.
- **Methodology & Reproducibility Centre (`/methodology`, `/quality`, `/sources`):** 5 mathematical method cards with KaTeX formulas, cryptographic SHA-256 data manifest, automated test audit logs, and complete source bibliography (S1–S13).
- **Automated Test Suite:** Python statistical tests in `tests/` verifying data integrity, non-negative values, and sum-of-parts reconciliation ($Broad = AI + NonAI$).

---

## [0.1.0] — 2026-09-21
- Initial planning documentation, Master Blueprint, charter, and specifications.
