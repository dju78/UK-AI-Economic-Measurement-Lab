# 01 — Product Requirements Document (PRD)

## 1. Product summary

UK AI Economic Measurement Lab is a public research application that converts the ONS AI thematic-account problem into an explorable methodology workflow. It is deliberately designed around **measurement**, not promotion.

## 2. User groups

### A. Official-statistics / methodology reviewer
Needs to inspect definitions, source data, accounting treatment, assumptions, quality and reproducibility.

### B. Economist / policy analyst
Needs to understand where AI-related activity may enter production, investment, trade and demand.

### C. Data scientist / researcher
Needs model details, features, validation, uncertainty and downloadable reproducible outputs.

### D. General analytical user
Needs a guided explanation of why AI adoption is not the same as AI economic contribution.

## 3. Information architecture

### `/` — Home / research question
- concise research question;
- latest product version and data vintage;
- clear “independent prototype” banner;
- three entry paths: Explore the stack / Explore the data / Test a method.

### `/stack` — AI Production Stack Explorer
Interactive representation of chips/compute, hyperscale/cloud, platforms/tooling, foundation models/APIs, applications and supporting data/data-centre layers. Each node shows likely National Accounts concepts, UK-residency issues and source notes.

### `/supply-use` — Supply & Use Explorer
- show ONS-identified broad CPA groups;
- allow search/filter;
- display published domestic output, imports and demand components where available;
- hard warning: broad totals contain AI + non-AI activity;
- click-through to product detail and decomposition lab.

### `/disaggregation` — AI/Non-AI Disaggregation Lab
- select product group;
- select method: direct / proportional / modelled / hybrid;
- set scenario parameters with documented defaults;
- show formula and resulting range;
- compare methods side by side;
- show sensitivity/tornado or interval chart;
- export scenario JSON/CSV and reproducibility note.

### `/classifier` — AI Business Classification Lab
- accept demo/public company text;
- return multi-label AI-activity categories and confidence;
- show evidence terms/features;
- allow reviewer accept/reject/edit;
- display model metrics and limitations.

### `/sna-decision` — National Accounts Decision Engine
Guided educational scenarios covering asset boundary, own-account software, licence/cloud access, economic ownership, residency, imports and possible treatment. Outputs must say **“Indicative treatment for investigation”**, not “official classification”.

### `/adoption` — Adoption context
Use BICS published context to show adoption and intensity while explicitly explaining that adoption rates cannot by themselves measure economic value. [S2]

### `/gaps` — Measurement Gaps & Research Agenda
Catalogue gaps, severity, evidence, proposed tests and status.

### `/methodology` — Methods
Versioned method cards and formulas.

### `/quality` — QA & reproducibility
Tests, data lineage, release validation, revisions and known issues.

### `/sources` — Sources
Dataset/source register with period, owner, status, licence and retrieval details.

## 4. Core interactions

1. User clicks a CPA group and sees its published broad total.
2. Product immediately states that the value is **not an AI estimate**.
3. User opens Disaggregation Lab.
4. User tests a method/assumption.
5. Product produces an illustrative estimate/range with uncertainty.
6. User opens the method card and can reproduce the calculation.

## 5. Key product requirements

- provenance badge on every number;
- data-vintage indicator on every analytical page;
- method-version indicator on every modelled result;
- ability to reset assumptions to baseline;
- shareable scenario URL or downloadable scenario file;
- accessible data table behind every chart;
- plain-English “What this means” section next to technical content;
- “What this does not mean” caveat for high-risk interpretation pages.

## 6. Performance requirements

- first meaningful content target < 2.5 seconds on standard broadband;
- analytical scenario recalculation target < 1 second when local/in-browser or < 3 seconds via API;
- caching of public source datasets;
- no live Companies House API dependency for core page rendering.

## 7. Security and privacy

- no personal data required for normal use;
- no API keys exposed client-side;
- user-entered text for classification should be processed transiently unless explicit save is selected;
- analytics must avoid collecting unnecessary personal data.

## 8. Acceptance criteria for MVP

MVP is complete only when the five core modules (stack, supply-use, disaggregation, classifier, SNA decision engine) are functional, source-labelled, tested, accessible and backed by published methodology pages.
