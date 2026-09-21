# 07 — AI Business Classification Specification

## 1. Purpose

Demonstrate a transparent, reviewable method for identifying AI-relevant business activity from public descriptive text. The classifier supports research on population identification; it does not establish an official AI-business register.

## 2. Label taxonomy

Start with multi-label categories inspired by ONS Table 3:

- data analytics, forecasting and decision support;
- AI consulting, adoption and digital transformation;
- business process/workflow/document automation;
- finance/insurance/fintech/compliance;
- customer engagement/sales/marketing/content;
- computer vision/image/video/speech/language;
- energy/environment/agriculture/infrastructure;
- robotics/autonomous systems/industrial AI;
- healthcare/life sciences/drug discovery;
- cybersecurity/AI safety/privacy/governance;
- generative AI/digital media/synthetic content;
- education/HR/recruitment/workforce tools;
- AI platforms/model development/data infrastructure.

Add separate binary labels:
- `ai_relevant`;
- `dedicated_or_diversified` only when supported by evidence;
- `needs_human_review`.

## 3. Baseline models

### Baseline 1: rules/keywords
Transparent dictionary with negation/exclusion handling.

### Baseline 2: TF-IDF + regularised logistic regression / one-vs-rest
Provides interpretable coefficients and reproducible baseline.

### Advanced option: embeddings
Only after baseline performance is documented. Use fixed model/version and cache embeddings.

### LLM-assisted option
Use only as a supplementary label proposal or feature; preserve prompts/model version and require human-review evaluation. Never use an uncontrolled changing model as the only production classifier.

## 4. Dataset design

Create a labelled evaluation sample with:
- balanced positive/negative examples;
- hard negatives containing “AI” in marketing but no substantive AI product evidence;
- dedicated and diversified examples;
- multiple sectors;
- duplicate/near-duplicate control.

Split by business, not by text snippet, to prevent leakage.

## 5. Metrics

Report:
- precision;
- recall;
- F1;
- PR-AUC where appropriate;
- per-label metrics;
- confusion matrix for binary AI relevance;
- calibration curve/Brier score if probabilities are shown.

Do not choose a threshold using the final test set.

## 6. Explainability

For each prediction show:
- model version;
- probability/confidence;
- top evidence terms/features where technically valid;
- source text excerpt;
- human-review status.

Do not invent a natural-language “reason” not supported by the model.

## 7. Human review workflow

Statuses:
`unreviewed → accepted / rejected / amended → adjudicated`.

Store reviewer rationale. Use adjudicated examples for future training only after dataset versioning.

## 8. Drift

AI terminology evolves rapidly. Monitor:
- vocabulary drift;
- label prevalence shift;
- confidence distribution shift;
- rising review disagreement.

Trigger retraining/revalidation based on evidence, not calendar alone.
