# 06 — AI/Non-AI Disaggregation Methodology Specification

## 1. Objective

Estimate or scenario-test the AI component inside a broad published product total while preserving the identity:

`Broad = AI + non-AI`.

The MVP should implement the framework as a **laboratory**, not as a single “correct” estimate.

## 2. Method A — Direct

Use only when a monetary value is explicitly AI-specific and conceptually mappable.

`AI_value = observed_AI_value`

Validation questions:
- Is the reference period aligned?
- Is the product concept aligned?
- Is the population coverage known?
- Are imports/exports or taxes treated consistently?
- Is double counting possible?

## 3. Method B — Proportional

`AI_value = Broad_value × AI_share`

`NonAI_value = Broad_value × (1 - AI_share)`

The source of `AI_share` must be named and quality scored. A share based on business counts is not automatically a valid revenue/output share.

### MVP scenario mode
Allow users to set low/base/high share assumptions. Defaults must be explicitly labelled illustrative unless evidence-based.

## 4. Method C — Modelled

Candidate approaches:

- company-level AI relevance probability × financial proxy;
- hierarchical model by product/industry/firm type;
- calibrated regression using observed AI revenue shares in a training sample;
- small-area/domain estimation only if data support it.

For company `i`:

`Expected_AI_value_i = Value_i × p_AI_i × r_i`

where `p_AI_i` is AI-relevance probability and `r_i` is the estimated proportion of that value attributable to AI. These are distinct parameters.

Aggregate:

`AI_value_g = Σ Expected_AI_value_i` for businesses mapped to product/domain `g`.

## 5. Method D — Hybrid

Priority order:
1. direct observed AI values;
2. audited/validated revenue-share evidence;
3. proportional allocation from credible domain evidence;
4. modelled residual only where needed.

The hybrid method should return a contribution table by evidence tier.

## 6. Uncertainty

### Scenario uncertainty
For share range `[s_L, s_U]`:

`AI_L = Broad × s_L`
`AI_U = Broad × s_U`

### Sampling/model uncertainty
Where a statistical model produces a distribution, retain draws or interval estimates rather than only the mean.

### Structural uncertainty
Compare method families. The difference between plausible methods is itself a useful uncertainty indicator.

## 7. Sensitivity analysis

Minimum outputs:
- result versus AI-share curve;
- low/base/high comparison;
- method comparison;
- top assumptions ranked by effect on output where multiple parameters exist.

## 8. Quality score for a scenario

Do not create a simplistic “truth score”. Instead report four separate dimensions:

- source coverage;
- conceptual alignment;
- empirical validation;
- uncertainty width.

Use descriptive statuses (`strong`, `moderate`, `weak`, `unknown`) with a definition for each, not a single composite rank.

## 9. Reproducibility object

Every scenario export must include:

```json
{
  "product_code": "CPA_J62",
  "reference_year": 2023,
  "broad_value_source": "ONS thematic account Table 1 / SUT",
  "method": "proportional",
  "parameters": {"share_low": 0.05, "share_base": 0.10, "share_high": 0.20},
  "method_version": "prop-0.1.0",
  "status": "illustrative experimental estimate"
}
```

Values in examples are placeholders, not recommended estimates.

## 10. Prohibited shortcuts

- using AI adoption percentage as AI output share;
- assuming all turnover of any AI-relevant company is AI turnover;
- allocating an AI share from company counts without a justified weighting model;
- summing overlapping service-category percentages from multi-label classification;
- reporting more precision than the underlying evidence supports.
