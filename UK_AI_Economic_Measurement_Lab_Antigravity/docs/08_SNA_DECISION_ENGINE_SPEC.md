# 08 — SNA Decision Engine Specification

## 1. Purpose

Create an educational decision-support module that demonstrates why the same “AI spend” can have different National Accounts implications depending on asset creation, licence/access, economic ownership, residency and transaction type.

It must never present itself as an authoritative accounting classification service.

## 2. Output wording

Always begin results with:

> **Indicative treatment for investigation — not an official classification.**

Then show the decision path and relevant concepts.

## 3. Decision questions

1. What is being acquired/created: hardware, software/model, cloud/compute service, data, consulting/support, embedded AI good?
2. Is a non-financial asset being created or acquired?
3. Is the asset expected to be used in production for more than one year?
4. Is the software/model developed on own account?
5. Who is the economic owner?
6. Is the owner UK resident?
7. Is access provided through a licence/subscription/cloud service rather than ownership?
8. Is the transaction cross-border?
9. Is AI embedded in a larger good/service whose AI component cannot be separately identified?

## 4. Example scenario patterns

### A. UK firm develops proprietary model/software for own use
Potential issue: own-account software/IP asset and GFCF if SNA asset criteria are met. Show evidence needed: labour/cost capitalisation, expected service life, ownership.

### B. UK firm pays recurring fee to access foreign-hosted AI API
Potential issue: intermediate consumption and import of service rather than UK-owned asset creation, subject to contract/economic-ownership details.

### C. UK firm purchases servers/GPU hardware
Potential issue: GFCF in computer hardware when fixed-asset criteria are met; imported hardware affects trade flows if non-UK supplied.

### D. UK firm buys consulting to implement AI
Potential issue: service input; whether any part contributes to creation of an asset depends on facts and accounting boundary.

## 5. Technical implementation

Use an explicit rules graph stored in versioned YAML/JSON:
- node question;
- answer options;
- next node;
- concept tags;
- output caveat;
- source references.

No generative model is required for the core decision tree. An LLM may provide plain-English explanation only after deterministic classification and must not alter the result.

## 6. Auditability

Export:
- answers selected;
- decision path;
- rule-set version;
- concept references;
- timestamp;
- disclaimer.
