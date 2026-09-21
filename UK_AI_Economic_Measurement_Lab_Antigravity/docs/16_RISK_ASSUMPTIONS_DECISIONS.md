# 16 — Risk, Assumption and Decision Register

## A. Key risks

| Risk | Impact | Mitigation |
|---|---|---|
| Users interpret broad CPA totals as AI totals | Severe credibility failure | adjacent warning, status badge, interpretation tests |
| Experimental scenario shared as official estimate | Severe | watermark/status in exports, disclaimer in metadata |
| Classifier labels companies incorrectly | Reputational | human review, confidence, public/demo corpus, correction route |
| Company text is marketing-heavy | Bias/false positives | hard-negative evaluation, multi-source evidence, review |
| Data vintages become inconsistent | Wrong comparisons | snapshot manifests and compatibility checks |
| Classification changes (CPA/SIC) break time series | Methodological | mapping tables and versioned classifications |
| Model drift | Degrading precision | monitoring and scheduled evidence-based review |
| ONS changes methodology | Product divergence | source-monitoring issue and versioned updates |
| Scope becomes too large | Delayed/unfinished release | strict MVP gates and P0/P1/P2 backlog |
| Visual similarity implies ONS endorsement | Legal/reputational | independent branding and explicit statement |

## B. Initial assumptions

- Public ONS tables are sufficient to create the first supply/use exploration layer.
- A credible MVP can demonstrate decomposition with scenarios before a validated monetary AI-share model exists.
- A public/demo company corpus can demonstrate classifier methodology without needing the ONS/DSIT internal company list.
- The SNA decision module should remain deterministic and explanatory.

Every assumption must have an owner, review date and evidence status when moved into the live repository.

## C. Architecture decisions to record

- frontend framework;
- analytical backend approach;
- source snapshot storage;
- charting library;
- classifier baseline;
- model hosting;
- scenario persistence strategy.

Use a short ADR format: context, decision, alternatives, consequences, date, owner.
