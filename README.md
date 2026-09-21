# UK AI Economic Measurement Lab

> **Independent Statistical Research Prototype**  
> **Author & Lead:** Daramola Omoyele  
> **Version:** `v0.2.0-experimental`  
> **Canonical Production URL:** [https://ai-measurement.jomovate.com](https://ai-measurement.jomovate.com)  
> **Secondary / Host URL:** [https://uk-ai-economic-measurement-lab.vercel.app/](https://uk-ai-economic-measurement-lab.vercel.app/)  
> **Status:** **LIVE IN PRODUCTION (VERIFIED)**

---

## Notice & Disclaimers

This project is an **independent statistical research prototype** designed to explore the measurement of artificial intelligence within the UK economy according to UK National Accounts principles and the published Office for National Statistics (ONS) Thematic Account Roadmap.

It is **not an ONS product**, is **not endorsed by ONS**, and does **not produce official statistics**. Broad CPA product totals represent candidate denominators containing both AI and non-AI activity; prototype decompositions are illustrative research scenarios.

---

## Live Application

The complete interactive research platform is hosted live at:  
👉 **[https://ai-measurement.jomovate.com](https://ai-measurement.jomovate.com)**  
*(Host mirror: [https://uk-ai-economic-measurement-lab.vercel.app/](https://uk-ai-economic-measurement-lab.vercel.app/))*

### Core Modules:
- **AI Production Stack Explorer (`/stack`):** 5-layer economic value chain mapping.
- **Supply & Use Explorer (`/supply-use`):** 23 AI-relevant CPA product groups and SUT balance matrices.
- **AI/Non-AI Disaggregation Lab (`/disaggregation`):** 4 scenario engines with parameter sensitivity curves.
- **AI Business Classification Lab (`/classifier`):** ML & rule classifier with dual evaluation ($N=60$ DS05 benchmark).
- **SNA Decision Engine (`/sna-decision`):** SNA 2008 / ESA 2010 asset boundary wizard with 6 corporate case studies.
- **AI Adoption Context (`/adoption`):** Cross-sector diffusion indicators from DBT & ONS BICS.
- **Measurement Gaps & Agenda (`/gaps`):** Registry of 10 statistical measurement challenges.
- **Methodology & Quality Centre (`/methodology`, `/quality`, `/sources`):** 10 method cards, 5-D data quality scoring, and cryptographic data manifest.

---

## Quickstart & Reproducibility

```bash
cd UK_AI_Economic_Measurement_Lab_Antigravity

# 1. Build and verify data layer
python scripts/build_data_layer.py

# 2. Run automated statistical test suite (38 tests)
python -m unittest discover tests

# 3. Launch Web Application locally
cd apps/web
npm install
npm run build
npm run start
```
