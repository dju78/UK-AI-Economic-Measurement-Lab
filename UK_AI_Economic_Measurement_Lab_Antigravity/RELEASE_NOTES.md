# Release Notes — UK AI Economic Measurement Lab (v0.2.0)

**Release Date:** 21 September 2026  
**Release Version:** `v0.2.0-experimental`  
**Author:** Daramola Omoyele  
**Product Status:** Independent Research Prototype (Not an ONS product)  

---

## What is the UK AI Economic Measurement Lab?

The **UK AI Economic Measurement Lab** is a public, reproducible statistical research environment designed to explore how artificial intelligence can be identified, classified, and disaggregated from non-AI activity within the UK National Accounts framework.

It turns the public research challenges articulated in the ONS AI Thematic Account Roadmap (S1) into transparent, explorable workflows without pretending to produce official statistics.

---

## Key Features in this Release

### 1. AI Production Stack Explorer (`/stack`)
- Interactive 8-layer map tracing the AI economic value chain from data centre physical infrastructure, silicon, and hyperscale compute to foundation model APIs and enterprise applications.
- Details National Accounts boundaries (GFCF vs Intermediate Consumption), economic ownership, and UK residency flows.

### 2. Supply & Use Explorer (`/supply-use`)
- Interactive analysis of published Supply & Use data across all 23 AI-relevant CPA product groups (2020–2023).
- Persistent warning banners clarifying that broad totals represent candidate denominators containing both AI and non-AI activity.
- Tabular accessible data alternatives for all charts.

### 3. AI/Non-AI Disaggregation Lab (`/disaggregation`)
- Experimental laboratory comparing Direct, Proportional, Modelled, and Hybrid disaggregation methods.
- Dynamic parameter sliders with sensitivity response curves and low/base/high uncertainty ranges.
- 4-dimension quality scoring matrix and downloadable JSON/CSV reproducibility objects.

### 4. AI Business Classification Lab (`/classifier`)
- Dual model baselines (Rule-based dictionary matcher + TF-IDF Logistic Regression) classifying business descriptions into 13 ONS Table 3 categories.
- Feature explainability view with term weights.
- Human review workflow (`unreviewed` → `accepted`/`rejected`/`amended` → `adjudicated`) with audit log.
- Evaluation dashboard with complete confusion matrix and precision/recall metrics.

### 5. SNA National Accounts Decision Engine (`/sna-decision`)
- Step-by-step educational decision tree covering asset boundaries, own-account software capitalization, cloud API intermediate consumption, and cross-border trade flows.
- 6 pre-loaded UK corporate case studies with National Accounts ledger debit/credit impacts.

### 6. AI Adoption Context (`/adoption`)
- Visualizes ONS BICS 2023–2026 adoption survey data across industries and firm size bands.
- Pedagogical guidance on why business adoption prevalence does not equal economic monetary value.

### 7. Measurement Gaps & Agenda (`/gaps`)
- Detailed catalogue of the 6 core ONS measurement challenges with severity ratings, evidence gaps, and proposed empirical tests.

### 8. Methodology & Reproducibility Centre (`/methodology`, `/quality`, `/sources`)
- Versioned method cards with KaTeX formulas, cryptographic SHA-256 data manifest, automated test audit logs, and complete source bibliography (S1–S13).

---

## Quick Run Instructions

```bash
# 1. Clone repository
git clone <repo_url> && cd UK_AI_Economic_Measurement_Lab_Build_Package/UK_AI_Economic_Measurement_Lab_Antigravity

# 2. Run data pipeline & tests
python scripts/build_data_layer.py
python -m unittest discover tests

# 3. Launch Web Application
cd apps/web
npm install
npm run build
npm run start
```
