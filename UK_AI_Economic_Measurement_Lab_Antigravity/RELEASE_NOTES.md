# Release Notes — UK AI Economic Measurement Lab (v0.2.1)

**Release Date:** 21 September 2026  
**Release Version:** `v0.2.1-launch-standard`  
**Canonical Production URL:** [https://ai-measurement.jomovate.com](https://ai-measurement.jomovate.com)  
**Secondary / Host URL:** [https://uk-ai-economic-measurement-lab.vercel.app/](https://uk-ai-economic-measurement-lab.vercel.app/)  
**Deployment Platform:** Vercel  
**GitHub Repository:** [https://github.com/dju78/UK-AI-Economic-Measurement-Lab](https://github.com/dju78/UK-AI-Economic-Measurement-Lab)  
**Lead Methodologist & Author:** Daramola Omoyele  
**Product Status:** **LIVE IN PRODUCTION — VERIFIED FOR OFFICIAL STATISTICAL & ECONOMIC AUDIENCES**

---

## What is the UK AI Economic Measurement Lab?

The **UK AI Economic Measurement Lab** is a public, reproducible statistical research environment designed to explore how artificial intelligence can be identified, classified, and disaggregated from non-AI activity within the UK National Accounts framework.

It turns the public research challenges articulated in the ONS AI Thematic Account Roadmap (S1) into transparent, explorable workflows without pretending to produce official statistics.

---

## Visual Refinement & Institutional Standard (v0.2.1)

In preparation for presentation to professional statisticians, economists, national accounts methodologists, and analytical employers, the user interface has undergone a comprehensive refinement to remove all synthetic or decorative visual signals:

1. **Restrained Brand Mark & Favicon**: Replaced generic "AI" badge with a crisp typographic monogram mark (`UK / LAB` in `apps/web/app/icon.tsx`).
2. **Institutional Social Sharing Cards**: Standardized Open Graph and Twitter Card preview images on an institutional deep slate (`#090d16`), fine structured borders (`#0f172a`), and clear author attribution (`app/opengraph-image.tsx`, `app/twitter-image.tsx`).
3. **Calm Navigation & Hierarchy**: Muted header navigation, expanded layout whitespace (`space-y-16 sm:space-y-20`), quiet active states, and understated footer.
4. **Typographic & Data Clarity**:
   - Monospace numeric indexing (`01`–`06`) for research modules.
   - Clean tabular layouts with high-contrast, readable typography.
   - Replaced multi-colored chart palettes with restrained slate tones (`#0f172a`, `#64748b`, `#334155`).
   - Removed aggressive hover elevation transforms in favor of subtle border transitions.
5. **Standardized Provenance Badging**: Neutral badge backgrounds with 1.5 stroke line icons (`ShieldCheck`, `BookOpen`, `Layers`) clearly distinguishing *Published official-statistics sources*, *Published research/context sources*, and *Prototype outputs*.

---

## Key Features & Research Modules

### 1. AI Production Stack Explorer (`/stack`)
- Interactive 5-layer map tracing the AI economic value chain from data centre physical infrastructure, silicon, and hyperscale compute to foundation model APIs and enterprise applications.
- Details National Accounts boundaries (GFCF vs Intermediate Consumption), economic ownership, and UK residency flows.

### 2. Supply & Use Explorer (`/supply-use`)
- Interactive analysis of published Supply & Use data across all 23 AI-relevant CPA product groups (2020–2023).
- Persistent warning banners clarifying that broad totals represent candidate denominators containing both AI and non-AI activity.
- Tabular accessible data alternatives for all charts.

### 3. AI/Non-AI Disaggregation Lab (`/disaggregation`)
- Experimental laboratory comparing Survey-residual, Bottom-up, Compute-constrained, and Revenue-share disaggregation methods.
- Dynamic parameter sliders with sensitivity response curves and low/base/high uncertainty ranges.
- Downloadable JSON/CSV reproducibility objects.

### 4. AI Business Classification Lab (`/classifier`)
- Heuristic and TF-IDF Logistic Regression ML classification engine with dual evaluation:
  - In-sample fit: 98.3% accuracy, 100% precision, 97.5% recall, 98.7% F1
  - Stratified 5-Fold Cross-Validation: 98.3% accuracy, 100% precision, 97.5% recall, 98.7% F1 ($N=60$ DS05 benchmark).
- Feature explainability view with term weights.
- Human review workflow (`unreviewed` → `accepted`/`rejected`/`amended` → `adjudicated`) with audit log.

### 5. SNA National Accounts Decision Engine (`/sna-decision`)
- Step-by-step educational decision tree covering asset boundaries, own-account software capitalization, cloud API intermediate consumption, and cross-border trade flows.
- 6 pre-loaded UK corporate case studies with National Accounts ledger debit/credit impacts.

### 6. AI Adoption Context (`/adoption`)
- Visualizes ONS BICS and DBT 2024 adoption survey data across industries and firm size bands.
- Pedagogical guidance on why business adoption prevalence does not equal economic monetary value.

### 7. Measurement Gaps & Agenda (`/gaps`)
- Detailed catalogue of the 10 core ONS measurement challenges with severity ratings, evidence gaps, and proposed empirical tests.

### 8. Methodology & Reproducibility Centre (`/methodology`, `/quality`, `/sources`)
- 5 versioned method cards with KaTeX formulas, cryptographic SHA-256 data manifest, automated test audit logs, and complete source bibliography (S1–S11).

---

## Verification & Quality Gate Summary

| Metric | Result |
| :--- | :---: |
| **Static Route Generation** | 20 / 20 routes generated (100% Pass) |
| **Python Statistical & Reconciliation Tests** | 38 / 38 Tests Passing (100% Pass) |
| **Accessibility Standard** | WCAG 2.2 AA compliant (Keyboard navigable, table fallbacks, visible focus) |
| **Independence Disclaimers** | Prominently displayed across Header, Footer, and Caveat Banners |
| **Critical / High Defects** | 0 |
