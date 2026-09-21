# Known Limitations & Research Gaps — UK AI Economic Measurement Lab

Version: **0.2.0**  
Baseline Date: **21 September 2026**  

This register details known statistical, empirical, and architectural limitations of the research prototype in accordance with the Code of Practice for Statistics.

---

## 1. Statistical & Conceptual Limitations

| ID | Module / Area | Limitation Description | Impact / Mitigation |
|---|---|---|---|
| **LIM-01** | Supply & Use Explorer | ONS Supply and Use Tables currently group AI within 23 broad CPA categories without sub-product AI codes. | Broad totals are candidate denominators only; explicit caveat banners prevent misinterpreting broad totals as AI output. |
| **LIM-02** | Disaggregation Lab | Proportional shares ($s_g$) represent illustrative baseline scenarios rather than mandatory official constants. | Sensitivity response curves and low/base/high intervals ($[s_L, s_U]$) are provided for all calculations. |
| **LIM-03** | Business Classifier | Text descriptions from website marketing or brief Companies House filings may contain buzzwords without core deep tech engineering. | Hard negative detection patterns and a formal Human Review workflow (`unreviewed` → `accepted`/`rejected`) are built in. |
| **LIM-04** | SNA Decision Engine | Software/model economic life and risk-bearing terms vary across proprietary contracts. | Outputs are labelled *“Indicative treatment for investigation — not an official classification”*. |
| **LIM-05** | Adoption vs Output | BICS AI adoption survey measures prevalence of business use, not GVA contribution. | Dedicated pedagogical callout clarifies why a 35% adoption rate does not equal 35% of economic output. |

---

## 2. Technical & Data Engineering Limitations

- **Microdata Access:** This independent public prototype uses publicly published datasets and curated open benchmarks; it does not contain confidential ONS microdata or unpublished administrative tax records.
- **High-Frequency Nowcasting:** Quarterly nowcasting models are subject to future development as high-frequency cloud and trade telemetry becomes available.
