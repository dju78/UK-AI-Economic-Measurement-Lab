# Changelog

All notable changes to the **UK AI Economic Measurement Lab** are documented in this file.

The project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.1] - 2026-09-21

### Visual Identity & Interface Refinement (Human-Designed Research Product Standard)
- **Brand Identity & Iconography**:
  - Replaced decorative chip/neon/robot visual tropes with a calm, institutional `UK / LAB` typographic monogram mark (`app/icon.tsx`).
  - Standardized Open Graph and Twitter Card social preview images on a deep institutional slate (`#090d16`), fine structured borders (`#0f172a`), and clear author attribution (`app/opengraph-image.tsx`, `app/twitter-image.tsx`).
  - Streamlined Header and Footer navigation with muted borders, restrained badges, and generous whitespace.
- **Component Polish**:
  - `ProvenanceBadge`: Refined to subtle, non-distracting neutral badges with line icons (`ShieldCheck`, `BookOpen`, `Layers`) at 1.5 stroke width.
  - `CaveatBanner`: Standardized on clean 3px left border accents with quiet typography and no loud gradient backgrounds.
  - `StatCard`: Removed bouncy hover translateY/shadow animations; replaced with clean monospace figures, subtle borders, and generous padding (`p-6`).
- **Research Explorers & Labs**:
  - **Homepage (`/`)**: Expanded vertical spacing (`space-y-16 sm:space-y-20`), simplified feature cards to an understated research module directory indexed `01`–`06`.
  - **AI Stack Explorer (`/stack`)**: Replaced `Cpu` silicon icon with clean line icons, refined active layer tabs with neutral slate styling.
  - **Classifier Lab (`/classifier`)**: Streamlined test harness, model engine selector, and review audit trail.
  - **Supply & Use (`/supply-use`)**: Muted bar chart palette to deep slate (`#0f172a`) and neutral slate (`#64748b`); cleaned matrix table.
  - **Disaggregation Lab (`/disaggregation`)**: Streamlined sliders with `accent-slate-900`, neutral metric cards, and clean typography.
  - **SNA Decision Wizard (`/sna-decision`)**: Refined decision step cards, corporate case study selector, and double-entry accounting ledger panel.
  - **Adoption Context (`/adoption`)**: Standardized industry bar charts and adoption trajectory charts on muted slate tones.
  - **Measurement Gaps (`/gaps`)**: Refined gap priority cards, severity badges, and monospace ONS milestone tags.
  - **Methodology Cards (`/methodology`)**: Cleaned mathematical formula code blocks with dark slate backgrounds, structured parameter tables, and calm assumption/limitation callouts.
  - **QA & Data Lineage (`/quality`)**: Structured layered pipeline graph and cryptographic SHA-256 manifest table.
  - **Data Source Register (`/sources`)**: Understated search and filter controls, structured bibliography table, and clean external links.
- **Accessibility & Validation**:
  - Preserved all WCAG 2.2 AA accessibility features (keyboard focus rings, table alternatives for all charts, color-independent encoding).
  - All 20 Next.js routes built statically with zero errors.
  - All 38 automated Python statistical and reconciliation tests passing.

---

## [0.2.0] - 2026-09-21

### Added
- Complete implementation of the 5 core analytical engines:
  - 5-Layer AI Economic Production Stack Explorer (`/stack`)
  - 23-Product Supply & Use Table Explorer with 2020–2023 time-series (`/supply-use`)
  - AI/Non-AI Disaggregation Laboratory with 4 estimation methods (`/disaggregation`)
  - Multi-Label Business Classifier with TF-IDF Logistic Regression and 5-Fold Cross-Validation (`/classifier`)
  - System of National Accounts (SNA 2008 / ESA 2010) Asset Boundary Decision Engine (`/sna-decision`)
- Supporting research modules:
  - AI Adoption in UK Businesses (`/adoption`) based on ONS BICS and DBT studies
  - 10 ONS Measurement Gaps & Strategic Research Agenda (`/gaps`)
  - Methodological Registry with 10 versioned method cards (`/methodology`)
  - QA, Data Lineage & Reproducibility Centre (`/quality`)
  - Authoritative Data Sources Register (`/sources`)
- Comprehensive automated test suite with 38 unit, data reconciliation, and regression tests.
- Cryptographically hashed dataset manifest (`data/manifest.json`) verifying all 5 raw source files.

---

## [0.1.0] - 2026-09-21

### Initial Release
- Initial statistical measurement framework and project architecture.
- Schema definitions and baseline Supply & Use dataset compilation.