# Changelog — UK AI Economic Measurement Lab

All notable changes to this project are documented in this file in accordance with Keep a Changelog.

---

## [0.2.0-experimental] — 2026-09-21

### Added
- **AI Production Stack Explorer (`/stack`):** Interactive conceptual map from infrastructure to applications with National Accounts boundaries and trade flow notes.
- **Supply & Use Explorer (`/supply-use`):** Complete matrix of the 23 ONS AI-relevant CPA product groups (2020–2023) with domestic output, imports, intermediate consumption, GFCF, and exports.
- **AI/Non-AI Disaggregation Lab (`/disaggregation`):** Four disaggregation engines (Survey-residual, Bottom-up, Compute-constrained, Revenue-share) with parameter sliders, sensitivity charts, and JSON/CSV scenario exports.
- **AI Business Classification Lab (`/classifier`):** Multi-label classifier (13 ONS Table 3 categories) with dual rule-based and calibrated TF-IDF logistic baselines, feature explainability, confusion matrix evaluation dashboard, and interactive human review workflow.
- **Expanded Benchmark Corpus (DS05):** 60 curated UK business profiles across dedicated AI, diversified software, hard negatives, and traditional non-AI sectors.
- **SNA Decision Engine (`/sna-decision`):** Deterministic National Accounts decision tree with 6 pre-loaded UK corporate case studies and double-entry ledger impact analysis.
- **AI Adoption Context (`/adoption`):** ONS BICS and DBT 2024 survey visualization and pedagogical "Adoption $\neq$ Value" guidance.
- **Measurement Gaps & Agenda (`/gaps`):** Structured register of 10 core ONS measurement challenges.
- **Methodology & Reproducibility Centre (`/methodology`, `/quality`, `/sources`):** 10 mathematical method cards with KaTeX formulas, cryptographic SHA-256 data manifest, automated test audit logs, and complete source bibliography (S1–S13).
- **Expanded Automated Test Suite:** 38 unit and statistical tests in `tests/` verifying data integrity, mathematical identities ($V_{\text{AI}} + V_{\text{Non-AI}} \equiv V_{\text{Broad}}$), classifier metrics, SNA decision paths, and cross-language parity.
- **Dual-Language Analytical Parity:** Native Python and TypeScript implementations with 100% verified parity across all 60 DS05 benchmark records and edge cases.

### Fixed & Hardened
- **Classifier Production Parity:** Resolved missing payload field alias `body.description` in `/api/classify/route.ts` and added plural/hyphen inflections across technical terms in both Python and TypeScript.
- **AI Producer vs AI User Distinction:** Hardened negative patterns to filter pure AI adopters without suppressing core AI model developers.
- **Cross-Language Golden Test Suite:** Added automated node subprocess execution in `tests/test_classifier.py` guaranteeing Python and TypeScript parity cannot silently diverge.
- **Verified Production Deployment:** Deployed to Vercel at `https://uk-ai-economic-measurement-lab.vercel.app/` with all 11 routes and 4 APIs verified.

---

## [0.1.0] — 2026-09-21
- Initial planning documentation, Master Blueprint, charter, and specifications.
