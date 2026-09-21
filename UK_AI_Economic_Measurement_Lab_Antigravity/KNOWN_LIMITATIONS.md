# Known Limitations & Research Gaps — UK AI Economic Measurement Lab

Version: **0.2.0-experimental**  
Baseline Date: **21 September 2026**  

This register details known statistical, empirical, and architectural limitations of the research prototype with reference to the principles of the Code of Practice for Statistics.

---

## 1. Statistical & Conceptual Limitations

| ID | Module / Area | Limitation Description | Impact / Mitigation |
|---|---|---|---|
| **LIM-01** | Supply & Use Explorer | ONS Supply and Use Tables currently group AI within 23 broad CPA categories without sub-product AI codes. | Broad totals are candidate denominators only; explicit caveat banners prevent misinterpreting broad totals as AI output. |
| **LIM-02** | Disaggregation Lab | Proportional shares ($s_g$) represent illustrative baseline scenarios rather than mandatory official constants. | Sensitivity response curves and low/base/high intervals ($[s_L, s_U]$) are provided for all calculations. |
| **LIM-03** | Business Classifier Benchmark (DS05) | The benchmark corpus contains 60 curated, synthetic & paraphrased UK business profiles across 13 taxonomy categories. Due to the small sample size ($N=60$), metrics should be interpreted as proof-of-concept performance rather than an evaluation of all 5.6M UK businesses. | Model predictions propose candidate labels but must never silently become ground truth without human review (Rule 9). |
| **LIM-04** | SNA Decision Engine | Software/model economic life and risk-bearing terms vary across proprietary contracts. | Outputs are labelled *“Indicative treatment for investigation — not an official classification”*. |
| **LIM-05** | Adoption vs Output | BICS AI adoption survey measures prevalence of business use, not GVA contribution. | Dedicated pedagogical callout clarifies why a 35% adoption rate does not equal 35% of economic output. |
| **LIM-06** | Cloud Services Trade Deficit | Cloud compute billed via overseas APIs (e.g. US hyperscalers) represents an import of digital services, which is currently difficult to isolate within CPA J63 aggregate trade data. | Prototype highlights the cross-border digital import gap in the Gaps module and SNA decision engine. |

---

## 2. Technical & Data Engineering Limitations

- **Microdata Access:** This independent public prototype uses publicly published datasets (ONS SUT, BICS, DSIT, Data Centres) and curated open benchmarks; it does not access confidential ONS business microdata (IDBR) or unpublished administrative tax records (HMRC).
- **High-Frequency Nowcasting:** Quarterly nowcasting models are subject to future research phases as high-frequency cloud and trade telemetry becomes standardized.
- **Rule Baseline vs Machine Learning:** The TF-IDF logistic classifier is calibrated on curated features; production enterprise classification at national scale would benefit from fine-tuned UK-specific domain transformer models.
