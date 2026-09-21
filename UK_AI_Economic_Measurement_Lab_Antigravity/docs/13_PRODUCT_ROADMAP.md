# 13 — Product Roadmap

## ONS public context

ONS published a six-stage roadmap: scope/foundations in Q2 2026; governance/requirements in Q3; evidence/data landscape in Q4; methodology options in Q1 2027; prototype/test estimates across Q2–Q4 2027; experimental account ready to productionise in Q1 2028. [S1]

This independent product should move faster while staying clearly separate from ONS production work.

## Delivery plan — 8-week high-quality path

### Week 0 — Project controls
- create repo and docs;
- establish source manifest and licensing;
- set CI, linting and test skeleton;
- freeze MVP scope.

**Gate:** planning docs approved; no coding beyond skeleton.

### Week 1 — Data foundation
- ingest ONS thematic tables / SUT data;
- create product dictionary;
- build provenance layer;
- validate totals.

**Gate:** data-validation report passes.

### Week 2 — Stack + Supply & Use Explorer
- interactive stack;
- product detail pages;
- published value status badges;
- accessible charts/tables.

**Gate:** no broad value labelled as AI.

### Week 3 — Disaggregation Lab v1
- direct and proportional method engines;
- low/base/high sensitivity;
- scenario export;
- method cards.

**Gate:** unit/calculation tests and reconciliation pass.

### Week 4 — Disaggregation v2 + uncertainty
- hybrid architecture;
- modelled method interface;
- uncertainty/sensitivity views;
- method comparison.

### Week 5 — Business Classifier
- labelled demo dataset;
- rule baseline;
- TF-IDF logistic baseline;
- evaluation dashboard and human review.

**Gate:** publish metrics and error analysis before model demo.

### Week 6 — SNA Decision Engine + gaps
- deterministic rules graph;
- scenario paths;
- measurement gap registry;
- source references.

### Week 7 — QA, accessibility and research notes
- end-to-end testing;
- WCAG checks;
- performance;
- validation report;
- known issues and correction policy.

### Week 8 — Public launch
- production deployment;
- GitHub release/tag;
- demo video;
- LinkedIn research post;
- targeted technical feedback request.

## Accelerated 3-week MVP option

If speed matters, deliver only:
1. stack explorer;
2. supply/use product explorer;
3. proportional disaggregation lab with uncertainty;
4. methodology/QA/source pages.

Do not include an unvalidated classifier just to increase feature count.

## Post-MVP research releases

- trade and ownership explorer using Digital Economy Survey releases when available;
- regional AI producer exploration;
- productivity/labour-market linkages with suitable data;
- richer hybrid decomposition;
- revised CPA/SIC classification integration;
- annual and quarterly experimental nowcasting research only after evidence supports it.
