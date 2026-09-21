# 05 — Data Model and Dictionary

## 1. Layered data architecture

### `raw_*`
Immutable snapshots exactly as obtained.

### `stg_*`
Standardised column names, types and codes; no analytical assumptions.

### `core_*`
Conformed dimensions and facts.

### `model_*`
Features, labels, predictions, uncertainty parameters.

### `pub_*`
Publication-ready aggregates with provenance metadata.

## 2. Core tables

### `dim_product`
- `product_code`
- `product_name`
- `classification` (CPA2008 / later)
- `ai_relevance_flag`
- `ai_scope_notes`
- `effective_from`
- `effective_to`

### `fact_supply`
- `reference_year`
- `product_code`
- `domestic_output_basic_prices`
- `imports_goods_eu`
- `imports_goods_row`
- `imports_services`
- `total_supply_purchasers_prices`
- provenance columns

### `fact_demand`
- `reference_year`
- `product_code`
- `intermediate_demand`
- household/government final-consumption fields
- `gfcf`
- inventory/valuables fields
- exports fields
- `total_demand`
- provenance columns

### `dim_ai_activity`
Multi-label taxonomy, initially aligned to ONS Table 3 categories plus infrastructure/goods/support categories.

### `business_entity`
- `business_id`
- `company_number` when public and applicable
- `name`
- `sic_codes`
- `status`
- `region` at non-sensitive aggregate level
- `source_id`

### `business_text_record`
- `business_id`
- `text_type`
- `text`
- `retrieval_date`
- `source_licence`

### `classification_prediction`
- `business_id`
- `model_version`
- `label`
- `probability`
- `evidence_terms`
- `review_status`
- `reviewer_label`

### `disaggregation_scenario`
- `scenario_id`
- `product_code`
- `method`
- `reference_year`
- `broad_value`
- `share_base`
- `share_low`
- `share_high`
- `result_base`
- `result_low`
- `result_high`
- `assumption_set_version`
- `created_at`

### `method_registry`
- `method_id`
- `version`
- `status`
- `description`
- `formula`
- `validation_report`
- `approved_for_public_prototype`

## 3. Provenance envelope

Every publication fact must carry:

`{source_id, source_vintage, reference_period, transformation_version, method_id, model_version, statistical_status}`

If a field is not applicable, store `null`; never omit the provenance schema.

## 4. Units

Store monetary values in original source units plus a canonical numeric field and unit metadata. Do not infer that an ONS table value is pounds rather than £ million; parse and retain the published unit explicitly.

## 5. Missingness

Distinguish:

- zero;
- not applicable;
- not available;
- suppressed/confidential;
- not collected;
- parse failure.

Never convert all missing symbols to zero.
