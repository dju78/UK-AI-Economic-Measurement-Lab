import { CPAProduct, CompanyClassificationRecord } from '../../../packages/schemas';
import cpaRaw from '../../../data/raw/ds01_ons_thematic_cpa_sut_2020_2023.json';
import bicsRaw from '../../../data/raw/ds02_ons_bics_ai_adoption_2023_2026.json';
import dsitRaw from '../../../data/raw/ds03_dsit_ai_sector_study_2024.json';
import infraRaw from '../../../data/raw/ds04_ons_datacentres_digital_infra_2026.json';
import corpusRaw from '../../../data/raw/ds05_uk_ai_business_corpus.json';
import manifestRaw from '../../../data/manifest.json';

export const ALL_CPA_PRODUCTS: CPAProduct[] = cpaRaw.data as CPAProduct[];
export const BICS_ADOPTION_DATA = bicsRaw;
export const DSIT_BENCHMARK_DATA = dsitRaw;
export const INFRA_DATA = infraRaw;
export const BENCHMARK_BUSINESS_CORPUS: CompanyClassificationRecord[] = corpusRaw.data as CompanyClassificationRecord[];
export const DATA_MANIFEST = manifestRaw;

export function getProductByCode(code: string): CPAProduct | undefined {
  return ALL_CPA_PRODUCTS.find((p) => p.product_code.toLowerCase() === code.toLowerCase());
}

export function getAllProductCodes(): string[] {
  return ALL_CPA_PRODUCTS.map((p) => p.product_code);
}
