# 02 — Statistical Measurement Framework

## 1. Measurement philosophy

The framework separates three layers:

1. **Observed published evidence** — values directly published by an authoritative source.
2. **Derived transformations** — deterministic calculations from observed evidence.
3. **Experimental/modelled estimates** — outputs dependent on assumptions, classification or statistical models.

The UI and exported data must retain this distinction.

## 2. National Accounts anchor

The thematic-account approach starts with the supply and use framework, then disaggregates relevant products to expose AI activity before re-aggregating the AI component for analysis. ONS states that the account is intended to remain consistent with core National Accounts principles. [S1]

### Core concepts

- **Domestic output:** value of products produced by UK-resident producers.
- **Imports:** products supplied from non-resident producers.
- **Intermediate consumption/demand:** goods/services consumed in production.
- **Final demand:** household/government consumption, capital formation, inventories and exports.
- **GVA:** output less intermediate consumption at basic prices.
- **GFCF:** acquisition/creation of fixed assets used in production for more than one year, subject to the SNA asset boundary.
- **Economic ownership:** party entitled to benefits and accepting associated risks.
- **Residency:** determines whether activity belongs in the UK economy and whether cross-border flows are imports/exports.

## 3. Scope taxonomy

Use the ONS publication as the primary scope anchor. It covers AI infrastructure, AI goods, direct AI services and supporting AI services, with downstream use considered iteratively. [S1]

### Product-level measurement is primary
Industry SIC is useful context but is not a reliable sole indicator of AI activity. ONS explicitly notes this limitation and identifies product disaggregation as central. [S1]

## 4. Broad CPA totals are not AI totals

The ONS publication identifies 23 broad CPA categories that may contain AI activity. Published totals for these categories contain both AI and non-AI products. They are **candidate denominators**, not estimates of the AI sector. [S1]

Mathematically, for product group `g`:

`BroadValue_g = AIValue_g + NonAIValue_g`

The project estimates or observes an AI share `s_g` only when evidence supports it:

`AIValue_g = BroadValue_g × s_g`

where `0 <= s_g <= 1`.

## 5. Four decomposition families

### Direct
Use an observed AI-specific monetary value that can be mapped to the target product/transaction with adequate coverage and definition.

### Proportional
Apply an evidence-based share to a broad total. The share may come from survey evidence, audited revenue split, structured sample or externally published estimate.

### Modelled
Predict AI share/value using statistical or ML relationships and aggregate with explicit validation.

### Hybrid
Use direct evidence where available, proportional allocation for well-supported segments and modelled estimates only for residual gaps.

## 6. Uncertainty framework

Every experimental result must include at least one of:

- scenario low/base/high;
- parameter confidence interval;
- bootstrap interval;
- model-prediction interval;
- sensitivity range.

Avoid presenting a single point estimate without its assumption context.

## 7. Reconciliation checks

For each decomposed broad value:

- `AI + non-AI = broad total` within rounding tolerance;
- no negative shares unless the source concept permits negative transactions;
- no share > 100%;
- same data vintage across compared values unless clearly flagged;
- supply/demand identities checked where the source table supports them.

## 8. Business population measurement

A business classifier is a **population-identification aid**, not a substitute for financial attribution. Being classified as AI-relevant does not mean 100% of turnover, employment or GVA is AI-related.

Dedicated/diversified status must be separate from AI-relevance. Diversified firms require an AI activity share or other disaggregation evidence.

## 9. Timeliness and revisions

Store every published source with:

- reference period;
- release date;
- retrieval date;
- source version/vintage;
- revision status;
- transformation version.

Never silently replace historical inputs after a source revision. Create a new data snapshot and record the change.

## 10. Interpretation guardrails

The prototype may say:

- “Under this scenario, the implied AI component is …”
- “This result is sensitive to the assumed AI share.”
- “This is an illustrative decomposition of a broad published total.”

It must not say:

- “UK AI GDP is …” unless quoting an explicitly published source and naming it;
- “ONS estimates …” for project-generated numbers;
- “This company is definitely an AI company” based only on model output.
