# UK AI Economic Measurement Lab

> **Independent Research Prototype**  
> **Author & Lead:** Daramola Omoyele  
> **Version:** 0.2.0  
> **Status:** Full Autonomous Build Complete & Verified  

---

## Notice & Disclaimers

This project is an **independent statistical research prototype** designed to explore the measurement of artificial intelligence within the UK economy according to UK National Accounts principles and the published Office for National Statistics (ONS) Thematic Account Roadmap.

It is **not an ONS product**, is **not endorsed by ONS**, and does **not produce official statistics**. Broad CPA product totals represent candidate denominators containing both AI and non-AI activity; prototype decompositions are illustrative research scenarios.

---

## Core Modules

1. **AI Production Stack Explorer (`/stack`):** Interactive 8-layer value chain map from data centre facilities, silicon, and compute to foundation model APIs and enterprise applications.
2. **Supply & Use Explorer (`/supply-use`):** Complete matrix of the 23 ONS AI-relevant CPA product groups (2020–2023) with domestic output, imports, intermediate consumption, GFCF, and exports.
3. **AI/Non-AI Disaggregation Lab (`/disaggregation`):** Four disaggregation engines (Direct, Proportional, Modelled, Hybrid) with parameter sensitivity curves and JSON/CSV scenario exports.
4. **AI Business Classification Lab (`/classifier`):** Multi-label NLP text classifier (13 ONS Table 3 categories) with dual baselines (Rule-based + TF-IDF Logistic), feature explainability, and interactive human review.
5. **SNA Decision Engine (`/sna-decision`):** Educational System of National Accounts decision tree with 6 pre-loaded UK corporate case studies and National Accounts ledger impacts.
6. **AI Adoption Context (`/adoption`):** ONS BICS 2023–2026 survey visualization with pedagogical "Adoption $\neq$ Value" guidance.
7. **Measurement Gaps & Agenda (`/gaps`):** Structured register of the 6 core ONS measurement challenges.
8. **Methodology & Reproducibility Centre (`/methodology`, `/quality`, `/sources`):** Versioned method cards with KaTeX formulas, cryptographic SHA-256 data manifest, automated test audit logs, and complete source bibliography (S1–S13).

---

## Quickstart & Reproducibility

### Prerequisites
- Node.js >= 18.x
- Python >= 3.10

### 1. Build and Verify Data Layer
```bash
python scripts/build_data_layer.py
```

### 2. Run Automated Statistical Test Suite
```bash
python -m unittest discover tests
```

### 3. Run Web Application
```bash
cd apps/web
npm install
npm run build
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Repository Structure

```
UK_AI_Economic_Measurement_Lab_Antigravity/
├── apps/
│   └── web/                   # Next.js 14 App Router + Tailwind + TypeScript
├── packages/
│   ├── schemas/               # Zod & TypeScript data contracts
│   └── methods/               # Statistical calculation modules (TS & Python)
├── data/
│   ├── raw/                   # Immutable raw datasets with SHA-256 hashes
│   ├── processed/             # Tidy publication tables
│   └── manifest.json          # Machine-readable cryptographic data manifest
├── tests/                     # Unit, schema, and reconciliation test suites
├── docs/                      # Master Charter, PRD, Methodology specs, Bibliography
├── project-status/            # Continuous status & milestone logs
└── scripts/                   # Data layer ingestion & validation scripts
```

---

## Ethical Positioning & Standards

This project adheres to the spirit of the UK Statistics Authority **Code of Practice for Statistics (v3.0)**:
- **Trustworthiness:** Transparent provenance, open code, and explicit disclaimers.
- **Quality:** Automated reconciliation tests, immutable source snapshots, and sensitivity intervals.
- **Value:** Open educational tools to demystify complex National Accounts concepts for researchers and the public.
