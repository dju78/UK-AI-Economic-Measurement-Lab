# 04 — Data Source Register

## Source-selection principles

Prefer official/public sources with clear definitions, stable identifiers and reproducible download paths. Record licensing, vintage and limitations. Do not use a source merely because it gives a convenient number.

| ID | Source | Proposed use | Status / key limitation |
|---|---|---|---|
| DS01 | ONS AI thematic-account methodology [S1] | Product scope, 23 CPA groups, Tables 1–3, roadmap, measurement challenges | Core conceptual source; article states outputs are not official statistics |
| DS02 | ONS Input-output Supply and Use Tables / Blue Book 2025 [S5] | Broad product supply/demand denominators, reconciliation | Accredited official statistics; latest reference year in cited release is 2023 |
| DS03 | ONS AI in UK businesses / BICS [S2] | Adoption and intensity context | Survey adoption is not a monetary AI contribution measure |
| DS04 | ONS Data centres and UK National Accounts [S3] | Infrastructure/asset treatment and data-centre measurement gaps | Data centres cannot currently be separately identified in all relevant statistics |
| DS05 | ONS Digital infrastructure 2026 [S4] | Investment context and digital infrastructure methodology | Broader than AI; must not be interpreted as AI-only |
| DS06 | ONS Digital trade 2026 / Digital Economy Survey [S6] | Future trade/import/export evidence for AI services | Experimental/developing measurement; availability/vintage to verify before use |
| DS07 | UK SIC 2026 [S7] | Industry context and new AI-related subclass | Product classification remains more important for thematic account |
| DS08 | DSIT AI Sector Study 2024 [S8] | External sector-population/revenue benchmark and taxonomy | Different methodology/sector concept from National Accounts thematic account |
| DS09 | Companies House Public Data API [S9] | Public company profile, SIC, status and demo classification records | API key required; company profile alone provides limited activity text; rate limit applies |
| DS10 | ONS Opinions and Lifestyle Survey references in [S1] | Household-use context | Not suitable for deriving household AI expenditure without additional evidence |

## Required metadata fields per ingested dataset

- `source_id`
- `source_title`
- `publisher`
- `source_url`
- `release_date`
- `reference_period`
- `retrieved_at`
- `licence`
- `statistical_status`
- `file_hash`
- `raw_file_path`
- `schema_version`
- `notes`

## Source acquisition policy

1. Raw source files are downloaded into a versioned immutable directory.
2. Compute SHA-256 on acquisition.
3. Store a machine-readable source manifest.
4. Never edit raw files.
5. Transform into tidy Parquet tables.
6. Validate against expected schema and totals.
7. Create a human-readable data note for each release.

## Data not currently available to this prototype

The approximate 5,860-company list referenced by ONS was provided through collaboration with DSIT and is not assumed to be publicly downloadable in the same form. [S1] The public prototype must therefore use a reproducible public/demo corpus unless lawful access to an equivalent dataset is obtained.

## Companies House constraint

The public API exposes company profile/SIC and other public records and requires authentication. Default API guidance allows up to 600 requests per five-minute period. [S9] Build caching and batch acquisition; never make the public UI issue hundreds of live requests.
