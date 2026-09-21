# 00 — Master Project Charter


> **Status and independence.** This project is an independent research and software prototype. It is not an Office for National Statistics (ONS) product, is not endorsed by ONS, and must not present experimental outputs as official statistics. Published ONS values must be labelled as ONS source data; prototype decompositions must be labelled as illustrative/experimental estimates with assumptions and uncertainty shown.


## 1. Product identity

**Name:** UK AI Economic Measurement Lab  
**Tagline:** Measure the AI economy transparently.  
**Owner:** Daramola Omoyele  
**Product type:** Independent statistical methodology and research prototype.  
**Primary audience:** official statisticians, economists, methodologists, data scientists, policy analysts, researchers and technically curious public users.

## 2. Strategic problem

AI is a general-purpose technology that cuts across products, industries, infrastructure and global supply chains. Standard classifications do not make AI activity directly visible. ONS therefore plans to use a thematic account to disaggregate and rearrange National Accounts information while remaining consistent with core accounting principles. [S1]

ONS has publicly identified six immediate measurement challenges that this prototype will turn into transparent research workflows:

- separating AI from non-AI activity inside broad product categories;
- dealing with embedded AI and blurred technology boundaries;
- validating and maintaining an AI business population when SIC is not sufficient;
- separating AI revenue from non-AI revenue in diversified firms;
- finding appropriate alternative data sources for gaps;
- producing timely, decision-useful estimates. [S1]

## 3. Product objective

Create a public, reproducible environment where users can inspect the AI production stack, trace AI-relevant product groups through supply and use concepts, test alternative disaggregation assumptions, classify AI-relevant business activity, explore National Accounts treatment scenarios and understand uncertainty.

## 4. North-star question

**How can public evidence and transparent methods be used to explore the separation of AI activity from non-AI activity within a UK National Accounts framework?**

## 5. Outcomes

The product should demonstrate:

- strong statistical reasoning rather than chart-making alone;
- explicit separation between observation and estimation;
- understanding of National Accounts concepts and boundaries;
- transparent classification and model validation;
- robust QA, reproducibility and version control;
- accessible communication of complex methodology;
- responsible use of AI/ML in statistical workflows.

## 6. In scope for public MVP

1. AI Production Stack Explorer.
2. Supply & Use Explorer for the ONS-identified AI-relevant broad CPA groups.
3. Disaggregation Lab comparing direct, proportional, modelled and hybrid approaches.
4. Business Classification Lab using a public/demo business corpus with human-review workflow.
5. SNA Decision Engine for educational scenario exploration.
6. Measurement Gaps and Uncertainty Centre.
7. Methodology, provenance, QA and reproducibility pages.

## 7. Out of scope for MVP

- claiming an official estimate of UK AI GDP/GVA;
- using confidential ONS microdata;
- recreating unpublished ONS internal models;
- scraping private websites in breach of terms;
- automated decisions about real companies without review;
- presenting a company as “an AI company” solely from an opaque LLM output;
- creating a clone of the ONS website or using ONS branding as if official.

## 8. Success measures

### Statistical credibility
- 100% of displayed numerical outputs have provenance metadata.
- 100% of prototype estimates expose method, assumptions and status.
- sensitivity analysis available for all material decomposition parameters.

### Engineering quality
- reproducible build from clean checkout;
- automated unit/data/calculation tests in CI;
- no secrets committed;
- immutable raw data layer and versioned transformed data.

### User experience
- user can trace a displayed number to source/method in two interactions or fewer;
- charts have accessible tabular alternatives;
- no critical WCAG 2.2 AA failures in public pages.

### Research value
- clear research notes explain what the prototype can and cannot infer;
- methodology can be critiqued and reproduced by another analyst.

## 9. Ethical positioning

Follow the spirit of the Code of Practice for Statistics: Trustworthiness, Quality and Value. [S10] The product should invite scrutiny, reveal uncertainty, avoid false precision and correct errors openly.
